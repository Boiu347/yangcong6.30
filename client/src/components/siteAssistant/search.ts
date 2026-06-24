import type { KnowledgeChunk } from './types';

export interface SearchResult {
  chunk: KnowledgeChunk;
  score: number;
}

const STOPWORDS = new Set(['为什么', '什么', '怎么', '如何', '一下', '这个', '那个', '是否', '可以', '能够']);

function normalize(text: string) {
  return text.toLowerCase().replace(/\s+/g, ' ').trim();
}

function unique<T>(items: T[]) {
  return [...new Set(items)];
}

export function queryTerms(query: string): string[] {
  const normalized = normalize(query);
  const coarse = normalized.match(/[\u4e00-\u9fa5a-z0-9]+/g) ?? [];
  const terms: string[] = [];

  coarse.forEach((part) => {
    if (part.length >= 2 && !STOPWORDS.has(part)) terms.push(part);
    if (/[\u4e00-\u9fa5]/.test(part) && part.length > 2) {
      for (let i = 0; i < part.length - 1; i += 1) {
        const gram = part.slice(i, i + 2);
        if (!STOPWORDS.has(gram)) terms.push(gram);
      }
    }
  });

  return unique(terms).slice(0, 18);
}

export function searchKnowledge(query: string, chunks: KnowledgeChunk[], limit = 10): SearchResult[] {
  const terms = queryTerms(query);
  if (!terms.length) return [];
  const queryText = normalize(query);
  const asksPrimary = /小学|小学生|低年级|高年级|一二三年级|四五六年级|学前/.test(queryText);
  const asksJunior = /初中|初一|初二|初三|中考/.test(queryText);
  const asksSenior = /高中|高一|高二|高三|高考/.test(queryText);

  return chunks
    .map((chunk) => {
      const title = normalize(chunk.title);
      const source = normalize(`${chunk.source} ${chunk.projectName ?? ''}`);
      const text = normalize(chunk.text);
      const keywordText = normalize(chunk.keywords.join(' '));
      let score = 0;

      terms.forEach((term) => {
        if (title.includes(term)) score += 8;
        if (source.includes(term)) score += 5;
        if (keywordText.includes(term)) score += 5;
        if (text.includes(term)) score += term.length > 2 ? 4 : 2;
      });

      if (query.includes('家庭包') && (title.includes('家庭包') || text.includes('家庭包'))) score += 8;
      if (asksPrimary && /小学|小学生|学前|一年级|二年级|三年级|四年级|五年级|六年级|小低|小高/.test(`${title} ${text}`)) score += 8;
      if (asksJunior && /初中|初一|初二|初三|中考/.test(`${title} ${text}`)) score += 8;
      if (asksSenior && /高中|高一|高二|高三|高考/.test(`${title} ${text}`)) score += 8;
      if (asksPrimary && /初中|初一|初二|初三|中考|高中|高一|高二|高三|高考/.test(`${title} ${text}`)) score -= 4;
      if (asksJunior && /小学|小学生|学前|一年级|二年级|三年级|四年级|五年级|六年级|高中|高一|高二|高三|高考/.test(`${title} ${text}`)) score -= 4;
      if (asksSenior && /小学|小学生|学前|一年级|二年级|三年级|四年级|五年级|六年级|初中|初一|初二|初三|中考/.test(`${title} ${text}`)) score -= 4;
      if (/买|购买|付费|续费|升单|价格|成交/.test(query) && /购买|付费|续费|升单|价格|成交|家庭包|未购|已购/.test(`${title} ${text}`)) score += 6;

      return { chunk, score };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

export function hasEnoughEvidence(results: SearchResult[]) {
  return results.length >= 2 && results[0].score >= 8;
}
