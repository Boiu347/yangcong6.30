// 把「定性下钻页的原声文本」映射到新三级标签（家庭包 + 小学物理）。
// 物理：按 voc.text 精确匹配；家庭包：caption -> 切片 -> 已标注片段。
import { ALL_SEGMENTS } from '../store/labeledSegments';
import { JIATINGBAO_CLIP_MAP } from './jiatingbaoClipLookup';
import {
  DIMENSION_BY_ID,
  labelShortName,
  type DimensionId,
  type LabeledSegment,
  type ResearchValue,
} from '../store/segmentTaxonomy';

export interface QuoteLabel {
  dimension: DimensionId;
  dimensionName: string;
  primaryLabel: string;
  auxLabels: string[];
  researchValue: ResearchValue;
  pendingNew?: boolean;
}

function norm(t: string): string {
  return t.replace(/\*\*/g, '').replace(/\s+/g, '').trim();
}

function toLabel(s: LabeledSegment): QuoteLabel {
  return {
    dimension: s.dimension,
    dimensionName: DIMENSION_BY_ID[s.dimension].name,
    primaryLabel: labelShortName(s.primaryLabel),
    auxLabels: s.auxLabels.map(labelShortName),
    researchValue: s.researchValue,
    pendingNew: s.pendingNew,
  };
}

const MAP = new Map<string, QuoteLabel>();
const byUrl = new Map<string, LabeledSegment>();

for (const s of ALL_SEGMENTS) {
  MAP.set(norm(s.quote), toLabel(s));
  if (s.clipUrl) byUrl.set(s.clipUrl, s);
}

for (const [caption, clip] of Object.entries(JIATINGBAO_CLIP_MAP)) {
  const seg = byUrl.get(clip.clipUrl);
  if (seg) MAP.set(norm(caption), toLabel(seg));
}

export function lookupQuoteLabel(text: string): QuoteLabel | undefined {
  return MAP.get(norm(text));
}
