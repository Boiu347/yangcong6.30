const BASE = '/api/reports';

export interface ReportMeta {
  id: string;
  name: string;
  createdAt: string;
}

async function handle<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const err = await res.json().catch(() => ({})) as Record<string, unknown>;
    throw new Error((err?.message as string) ?? `请求失败 (${res.status})`);
  }
  return res.json() as Promise<T>;
}

export async function listReports(): Promise<ReportMeta[]> {
  return handle(await fetch(BASE));
}

export async function uploadReport(file: File): Promise<ReportMeta> {
  const form = new FormData();
  form.append('file', file);
  return handle(await fetch(`${BASE}/upload`, { method: 'POST', body: form }));
}

export async function fetchReportContent(id: string): Promise<string> {
  const res = await fetch(`${BASE}/${id}/content`);
  if (!res.ok) throw new Error(`获取报告内容失败 (${res.status})`);
  return res.text();
}

export async function deleteReport(id: string): Promise<void> {
  await handle(await fetch(`${BASE}/${id}`, { method: 'DELETE' }));
}
