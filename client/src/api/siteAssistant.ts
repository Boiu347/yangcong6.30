import { getStoredPassword } from '../components/auth/PasswordGate';
import type { EvidenceLink, KnowledgeChunk, SiteAssistantResponse } from '../components/siteAssistant/types';

function authHeaders(): Record<string, string> {
  const pw = getStoredPassword();
  return pw ? { 'x-access-password': pw } : {};
}

export async function apiAskSiteAssistant(
  question: string,
  evidence: KnowledgeChunk[],
  currentPath: string,
): Promise<SiteAssistantResponse> {
  const relatedLinks: EvidenceLink[] = evidence.map(({ title, excerpt, route, source, projectName }) => ({
    title,
    excerpt,
    route,
    source,
    projectName,
  }));

  const res = await fetch('/api/ai/ask-site', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify({ question, evidence, currentPath }),
  });

  if (!res.ok) {
    return {
      answer: 'AI 没有生成有效总结；我只能先展示检索到的站内证据。请点击下方链接查看原始页面。',
      relatedLinks,
      confidence: 'low',
      unavailable: true,
      answerMode: 'unavailable',
    };
  }

  return res.json() as Promise<SiteAssistantResponse>;
}
