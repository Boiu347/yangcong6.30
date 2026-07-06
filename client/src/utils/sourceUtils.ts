import { EVIDENCE_SOURCE_MAP } from './evidenceLookup';
import { EVIDENCE_CLIP_MAP, EvidenceClip } from './evidenceClipLookup';
import { JIATINGBAO_CLIP_MAP } from './jiatingbaoClipLookup';
import { DEFAULT_VOC_CLIP_MAP } from './defaultVocClipLookup';
import { JISUANYING_EVIDENCE_SOURCE_MAP } from '../store/jisuanyingData';
import { JIATINGBAO_SEGMENTS } from '../store/jiatingbaoSegments';
import { PHYSICS_SEGMENTS } from '../store/physicsSegments';

/**
 * Look up the source interview file for an evidence quote.
 * Uses a pre-computed exact-key map (100% coverage, built at analysis time).
 */
export function lookupSource(evidence: string, _brand?: string): string | null {
  const plain = evidence.replace(/\*\*/g, '');
  return JISUANYING_EVIDENCE_SOURCE_MAP[plain]
    ?? JISUANYING_EVIDENCE_SOURCE_MAP[evidence]
    ?? EVIDENCE_SOURCE_MAP[plain]
    ?? EVIDENCE_SOURCE_MAP[evidence]
    ?? null;
}

/**
 * Look up audio clips for an evidence quote (访谈1–6，一条原声可对应多段录音).
 */
export function lookupClips(evidence: string): EvidenceClip[] {
  const plain = evidence.replace(/\*\*/g, '');
  const physicsSeg = PHYSICS_SEGMENT_CLIP_MAP[plain] ?? findPhysicsSegmentClip(plain);
  const raw =
    JIATINGBAO_CLIP_MAP[plain] ??
    JIATINGBAO_CLIP_MAP[evidence] ??
    physicsSeg ??
    EVIDENCE_CLIP_MAP[plain] ??
    EVIDENCE_CLIP_MAP[evidence] ??
    DEFAULT_VOC_CLIP_MAP[plain] ??
    DEFAULT_VOC_CLIP_MAP[evidence];
  if (raw) return Array.isArray(raw) ? raw : [raw as EvidenceClip];
  // 回退：报告原声常是完整访谈原话的「去标点精简子串」，
  // 用归一化（去除标点/空白）后的双向子串匹配复用已有切片。
  return normalizedSubstringClips(plain);
}

/** 去除标点、空白等噪声，用于宽松子串匹配。 */
function normalizeForMatch(s: string): string {
  return s.replace(/[\s，。、？！,.?!；;：:“”"'’‘（）()【】《》\-—…~·]/g, '');
}

/**
 * 归一化子串回退匹配：在 PHYSICS_SEGMENTS / DEFAULT / EVIDENCE 三个来源中，
 * 找到与目标原声互为「去标点子串」的切片。要求较短一方长度 ≥ 10，避免短语误命中。
 */
function normalizedSubstringClips(quote: string): EvidenceClip[] {
  const nq = normalizeForMatch(quote);
  if (nq.length < 10) return [];

  const consider = (text: string, clips: EvidenceClip[]): EvidenceClip[] | null => {
    const nt = normalizeForMatch(text);
    if (nt.length < 10) return null;
    if (nt.includes(nq) || nq.includes(nt)) return clips;
    return null;
  };

  for (const seg of PHYSICS_SEGMENTS) {
    if (!seg.clipUrl) continue;
    const hit = consider(seg.quote.replace(/\*\*/g, ''), [
      { clipUrl: seg.clipUrl, startTime: seg.startTime ?? 0, duration: seg.duration },
    ]);
    if (hit) return hit;
  }
  for (const [text, rawVal] of Object.entries(DEFAULT_VOC_CLIP_MAP)) {
    const hit = consider(text, Array.isArray(rawVal) ? rawVal : [rawVal]);
    if (hit) return hit;
  }
  for (const [text, rawVal] of Object.entries(EVIDENCE_CLIP_MAP)) {
    const hit = consider(text, Array.isArray(rawVal) ? rawVal : [rawVal]);
    if (hit) return hit;
  }
  return [];
}

/** @deprecated use lookupClips */
export function lookupClip(evidence: string): EvidenceClip | null {
  const clips = lookupClips(evidence);
  return clips[0] ?? null;
}

/**
 * 家庭包逐字原声 → 切片映射（由 JIATINGBAO_SEGMENTS 构建）。
 * 同一条原话可能出现多次，保留首个带音频的片段即可。
 */
const JIATINGBAO_SEGMENT_CLIP_MAP: Record<string, EvidenceClip> = (() => {
  const map: Record<string, EvidenceClip> = {};
  for (const seg of JIATINGBAO_SEGMENTS) {
    if (!seg.clipUrl) continue;
    const key = seg.quote.replace(/\*\*/g, '').trim();
    if (key && !map[key]) {
      map[key] = { clipUrl: seg.clipUrl, startTime: seg.startTime ?? 0, duration: seg.duration };
    }
  }
  return map;
})();

const PHYSICS_SEGMENT_CLIP_MAP: Record<string, EvidenceClip> = (() => {
  const map: Record<string, EvidenceClip> = {};
  for (const seg of PHYSICS_SEGMENTS) {
    if (!seg.clipUrl) continue;
    const key = seg.quote.replace(/\*\*/g, '').trim();
    if (key && !map[key]) {
      map[key] = { clipUrl: seg.clipUrl, startTime: seg.startTime ?? 0, duration: seg.duration };
    }
  }
  return map;
})();

function findPhysicsSegmentClip(quote: string): EvidenceClip | undefined {
  const key = quote.trim();
  if (!key) return undefined;
  const match = PHYSICS_SEGMENTS.find((seg) => {
    const segQuote = seg.quote.replace(/\*\*/g, '').trim();
    return Boolean(seg.clipUrl && segQuote && (segQuote.includes(key) || key.includes(segQuote)));
  });
  if (!match?.clipUrl) return undefined;
  return { clipUrl: match.clipUrl, startTime: match.startTime ?? 0, duration: match.duration };
}

/**
 * 为一条「代表原声」查找录音切片：优先命中家庭包逐句拆解片段，
 * 再回退到既有 lookupClips（纪要 caption / study·onion bullet 等）。
 */
export function clipsForQuote(quote: string): EvidenceClip[] {
  const plain = quote.replace(/\*\*/g, '').trim();
  const seg = JIATINGBAO_SEGMENT_CLIP_MAP[plain];
  if (seg) return [seg];
  return lookupClips(quote);
}

/**
 * Shorten a source file name for compact display.
 * "用户访谈4·二年级·北京顺义·从小学物理&NB&南开AI" → "访谈4 · 北京顺义"
 */
export function shortSource(sourceFileName: string): string {
  const parts = sourceFileName.split('·');
  // parts[0] = "用户访谈N"  parts[1] = "年级"  parts[2] = "城市"
  const numMatch = sourceFileName.match(/访谈(\d+)/);
  const city = parts[2] ?? '';
  if (numMatch && city) {
    return `访谈${numMatch[1]} · ${city}`;
  }
  return parts.slice(0, 2).join(' · ');
}
