import { getStoredPassword } from '../components/auth/PasswordGate';
import type {
  PortraitData,
  PortraitSnapshot,
  ResearchUser,
  ResearchUserData,
  UserHistoryEntry,
} from '../types/research';

function headers(write = false): HeadersInit {
  return {
    ...(write ? { 'Content-Type': 'application/json' } : {}),
    'x-access-password': getStoredPassword(),
  };
}

async function parse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const payload = await response.json().catch(() => null);
    throw new Error(payload?.message ?? payload?.error?.message ?? `请求失败 (${response.status})`);
  }
  return response.json() as Promise<T>;
}

export async function fetchPortrait(projectId: string): Promise<PortraitSnapshot | null> {
  const response = await fetch(`/api/research/portraits/${encodeURIComponent(projectId)}`, {
    headers: headers(),
  });
  if (response.status === 404 || response.status === 503) return null;
  const row = await parse<Record<string, unknown>>(response);
  return {
    projectId: String(row.project_id),
    data: row.data as PortraitData,
    version: Number(row.version),
    updatedAt: String(row.updated_at),
  };
}

export async function savePortrait(
  projectId: string,
  data: PortraitData,
  version: number,
): Promise<PortraitSnapshot> {
  const response = await fetch(`/api/research/portraits/${encodeURIComponent(projectId)}`, {
    method: 'PUT',
    headers: headers(true),
    body: JSON.stringify({ data, version }),
  });
  const row = await parse<Record<string, unknown>>(response);
  return {
    projectId: String(row.project_id),
    data: row.data as PortraitData,
    version: Number(row.version),
    updatedAt: String(row.updated_at),
  };
}

export async function fetchUsers(projectId: string): Promise<ResearchUser[]> {
  const response = await fetch(`/api/research/users?projectId=${encodeURIComponent(projectId)}`, {
    headers: headers(),
  });
  if (response.status === 503) return [];
  return parse<ResearchUser[]>(response);
}

export async function createResearchUser(projectId: string, data: ResearchUserData) {
  const response = await fetch('/api/research/users', {
    method: 'POST',
    headers: headers(true),
    body: JSON.stringify({ projectId, data }),
  });
  return parse<ResearchUser>(response);
}

export async function updateResearchUser(id: string, data: ResearchUserData, version: number) {
  const response = await fetch(`/api/research/users/${encodeURIComponent(id)}`, {
    method: 'PUT',
    headers: headers(true),
    body: JSON.stringify({ data, version }),
  });
  return parse<ResearchUser>(response);
}

export async function fetchUserHistory(id: string): Promise<UserHistoryEntry[]> {
  const response = await fetch(`/api/research/users/${encodeURIComponent(id)}/history`, {
    headers: headers(),
  });
  if (response.status === 503) return [];
  return parse<UserHistoryEntry[]>(response);
}
