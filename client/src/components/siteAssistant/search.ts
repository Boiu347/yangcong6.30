import type { KnowledgeChunk } from './types';

export interface SearchResult {
  chunk: KnowledgeChunk;
  score: number;
}

const STOPWORDS = new Set(['为什么', '什么', '怎么', '如何', '一下', '这个', '那个', '是否', '可以', '能够']);

// 阿拉伯数字年级 → 中文，使「5年级」与数据里的「五年级」可互相命中
const CN_DIGITS: Record<string, string> = {
  '1': '一', '2': '二', '3': '三', '4': '四', '5': '五',
  '6': '六', '7': '七', '8': '八', '9': '九',
};
function normalizeGrades(text: string) {
  return text.replace(/([1-9])\s*年级/g, (_, d: string) => `${CN_DIGITS[d]}年级`);
}

function normalize(text: string) {
  return normalizeGrades(text.toLowerCase().replace(/\s+/g, ' ').trim());
}

function unique<T>(items: T[]) {
  return [...new Set(items)];
}

// 标题主干（去掉「· 受访者」等后缀），用于引用区按主题分散、避免重复
function titleBase(title: string) {
  return title.split(/\s*·\s*/)[0].trim();
}
function excerptKey(chunk: KnowledgeChunk) {
  return normalize(chunk.excerpt || chunk.text).replace(/[\s，。、！？,.!?"“”]/g, '');
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
  const asksPrimary = /小学|小学生|低年级|高年级|一二三年级|四五六年级|学前|[一二三四五六]年级/.test(queryText);
  const asksJunior = /初中|初一|初二|初三|中考/.test(queryText);
  const asksSenior = /高中|高一|高二|高三|高考/.test(queryText);

  const scored = chunks
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

      // 结论/卖点/建议/成交/卡点/体验类问题：优先命中沉淀好的结论卡片（核心结论 / 调研结论 / 下一步建议）
      if (
        /结论|洞察|卖点|建议|策略|成交|卡点|未成交|体验|优势|劣势|下一步|怎么做|如何做/.test(query) &&
        chunk.type === 'conclusion'
      ) {
        score += 7;
      }

      return { chunk, score };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score);

  // 去重 + 按主题分散：相同原话只留一条，同一主题最多 2 条，避免引用区大量重复
  const seenExcerpt = new Set<string>();
  const perTitle = new Map<string, number>();
  const diversified: SearchResult[] = [];
  for (const result of scored) {
    const key = excerptKey(result.chunk);
    if (key && seenExcerpt.has(key)) continue;
    const base = titleBase(result.chunk.title);
    const count = perTitle.get(base) ?? 0;
    if (count >= 2) continue;
    if (key) seenExcerpt.add(key);
    perTitle.set(base, count + 1);
    diversified.push(result);
    if (diversified.length >= limit) break;
  }
  return diversified;
}

export function hasEnoughEvidence(results: SearchResult[]) {
  // 放宽门槛：有 1 条较相关（score≥5）即可作答；或多条弱相关累积也放行，
  // 避免「5年级学习痛点」这类正常问题被误判为证据不足。
  if (!results.length) return false;
  const top = results[0].score;
  return top >= 5 || (results.length >= 3 && top >= 4);
}
