import { Logger } from '@nestjs/common';
import postgres from 'postgres';
import { randomUUID } from 'crypto';
import type { FieldChange, ResearchUserData } from './research.types';

const logger = new Logger('ResearchDB');
let client: ReturnType<typeof postgres> | null = null;

function getClient() {
  if (client) return client;
  const url = process.env.DATABASE_URL;
  if (!url) return null;
  client = postgres(url);
  return client;
}

export function hasResearchDb() {
  return Boolean(getClient());
}

export async function ensureResearchTables() {
  const sql = getClient();
  if (!sql) return;
  await sql`
    CREATE TABLE IF NOT EXISTS research_portrait_snapshots (
      project_id TEXT PRIMARY KEY,
      data JSONB NOT NULL,
      version INTEGER NOT NULL DEFAULT 1,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS research_users (
      id TEXT PRIMARY KEY,
      project_id TEXT NOT NULL,
      code TEXT NOT NULL,
      data JSONB NOT NULL,
      version INTEGER NOT NULL DEFAULT 1,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      UNIQUE(project_id, code)
    )
  `;
  await sql`
    CREATE INDEX IF NOT EXISTS research_users_project_idx
    ON research_users(project_id, updated_at DESC)
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS research_user_changes (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES research_users(id) ON DELETE CASCADE,
      project_id TEXT NOT NULL,
      changes JSONB NOT NULL,
      updated_by TEXT NOT NULL DEFAULT '编辑者',
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;
  logger.log('research tables ready');
}

export async function getPortrait(projectId: string) {
  const sql = getClient()!;
  const rows = await sql`
    SELECT project_id, data, version, updated_at
    FROM research_portrait_snapshots
    WHERE project_id = ${projectId}
  `;
  return rows[0] ?? null;
}

export async function listPortraits() {
  const sql = getClient()!;
  return sql`
    SELECT project_id, data, version, updated_at
    FROM research_portrait_snapshots
    ORDER BY project_id
  `;
}

export async function savePortrait(projectId: string, data: unknown, version: number) {
  const sql = getClient()!;
  const existing = await getPortrait(projectId);
  if (!existing) {
    if (version !== 0) return null;
    const rows = await sql`
      INSERT INTO research_portrait_snapshots (project_id, data)
      VALUES (${projectId}, ${sql.json(data as never)})
      RETURNING project_id, data, version, updated_at
    `;
    return rows[0];
  }
  const rows = await sql`
    UPDATE research_portrait_snapshots
    SET data = ${sql.json(data as never)}, version = version + 1, updated_at = NOW()
    WHERE project_id = ${projectId} AND version = ${version}
    RETURNING project_id, data, version, updated_at
  `;
  return rows[0] ?? null;
}

function valueText(value: unknown): string {
  if (value === undefined || value === null || value === '') return '未填写';
  if (Array.isArray(value)) return value.map(valueText).join('；');
  if (typeof value === 'object') return JSON.stringify(value);
  return String(value);
}

const fieldLabels: Record<string, string> = {
  region: '地区',
  guardianRole: '家长角色',
  children: '孩子信息',
  source: '数据来源',
  notes: '备注',
};

export function diffUserData(before: ResearchUserData | null, after: ResearchUserData): FieldChange[] {
  return Object.keys(fieldLabels).flatMap((field) => {
    const previous = before?.[field as keyof ResearchUserData];
    const next = after[field as keyof ResearchUserData];
    if (JSON.stringify(previous ?? null) === JSON.stringify(next ?? null)) return [];
    return [{
      field,
      label: fieldLabels[field],
      before: before ? valueText(previous) : '未创建',
      after: valueText(next),
    }];
  });
}

export function completeness(data: ResearchUserData): number {
  const household = [data.region, data.guardianRole, data.source];
  const childFields = data.children.flatMap((child) => [
    child.birthOrder,
    child.grade,
    child.schoolingMode === 'unknown' ? '' : child.schoolingMode,
    child.schoolType === 'unknown' ? '' : child.schoolType,
  ]);
  const fields = [...household, ...childFields];
  if (!fields.length) return 0;
  return Math.round((fields.filter(Boolean).length / fields.length) * 100);
}

function normalizeRow(row: Record<string, unknown>) {
  const data = row.data as ResearchUserData;
  return {
    id: row.id,
    projectId: row.project_id,
    code: row.code,
    data,
    version: row.version,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    completeness: completeness(data),
  };
}

export async function listUsers(projectId?: string) {
  const sql = getClient()!;
  const rows = projectId
    ? await sql`SELECT * FROM research_users WHERE project_id = ${projectId} ORDER BY updated_at DESC`
    : await sql`SELECT * FROM research_users ORDER BY updated_at DESC`;
  return rows.map((row) => normalizeRow(row));
}

export async function createUser(projectId: string, data: ResearchUserData) {
  const sql = getClient()!;
  return sql.begin(async (tx) => {
    const countRows = await tx`
      SELECT COUNT(*)::int AS count FROM research_users WHERE project_id = ${projectId}
    `;
    const prefix = projectId === 'jisuanying_project' ? 'JSY' : projectId === 'default_project' ? 'WL' : 'USR';
    const code = `${prefix}-U${String(Number(countRows[0].count) + 1).padStart(3, '0')}`;
    const id = randomUUID();
    const rows = await tx`
      INSERT INTO research_users (id, project_id, code, data)
      VALUES (${id}, ${projectId}, ${code}, ${tx.json(data as never)})
      RETURNING *
    `;
    const changes = diffUserData(null, data);
    await tx`
      INSERT INTO research_user_changes (id, user_id, project_id, changes)
      VALUES (${randomUUID()}, ${id}, ${projectId}, ${tx.json(changes as never)})
    `;
    return normalizeRow(rows[0]);
  });
}

export async function updateUser(id: string, data: ResearchUserData, version: number) {
  const sql = getClient()!;
  return sql.begin(async (tx) => {
    const existingRows = await tx`SELECT * FROM research_users WHERE id = ${id}`;
    const existing = existingRows[0];
    if (!existing) return { status: 'missing' as const };
    const changes = diffUserData(existing.data as ResearchUserData, data);
    const rows = await tx`
      UPDATE research_users
      SET data = ${tx.json(data as never)}, version = version + 1, updated_at = NOW()
      WHERE id = ${id} AND version = ${version}
      RETURNING *
    `;
    if (!rows[0]) return { status: 'conflict' as const };
    if (changes.length) {
      await tx`
        INSERT INTO research_user_changes (id, user_id, project_id, changes)
        VALUES (${randomUUID()}, ${id}, ${existing.project_id}, ${tx.json(changes as never)})
      `;
    }
    return { status: 'ok' as const, user: normalizeRow(rows[0]) };
  });
}

export async function getUserHistory(id: string) {
  const sql = getClient()!;
  const rows = await sql`
    SELECT id, changes, updated_by, created_at
    FROM research_user_changes
    WHERE user_id = ${id}
    ORDER BY created_at DESC
  `;
  return rows.map((row) => ({
    id: row.id,
    changes: row.changes,
    updatedBy: row.updated_by,
    createdAt: row.created_at,
  }));
}
