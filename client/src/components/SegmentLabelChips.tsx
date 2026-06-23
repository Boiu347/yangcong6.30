import { Sparkles } from 'lucide-react';
import { lookupQuoteLabel } from '../utils/segmentLabelLookup';
import { RESEARCH_VALUE_META } from '../store/segmentTaxonomy';

const DIM_TINT: Record<string, { color: string; bg: string }> = {
  app: { color: '#2563eb', bg: '#eff6ff' },
  course: { color: '#7c3aed', bg: '#f5f3ff' },
  buy: { color: '#dc2626', bg: '#fef2f2' },
};

// 在现有原声卡上叠加新三级标签（研究价值 + 维度·主标签 + 辅助标签），匹配不到则不渲染。
export default function SegmentLabelChips({ text, className }: { text: string; className?: string }) {
  const lab = lookupQuoteLabel(text);
  if (!lab) return null;
  const vm = RESEARCH_VALUE_META[lab.researchValue];
  const dim = DIM_TINT[lab.dimension];

  return (
    <div className={`flex flex-wrap items-center gap-1.5 ${className ?? ''}`}>
      <span className="rounded px-1.5 py-0.5 text-[11px] font-bold" style={{ backgroundColor: vm.bg, color: vm.color }}>
        {vm.label}
      </span>
      <span
        className="inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[11px] font-bold"
        style={
          lab.pendingNew
            ? { backgroundColor: '#fffbeb', color: '#b45309' }
            : { backgroundColor: dim.bg, color: dim.color }
        }
      >
        {lab.pendingNew && <Sparkles size={10} />}
        {lab.dimensionName} · {lab.primaryLabel}
      </span>
      {lab.auxLabels.map((a) => (
        <span key={a} className="rounded bg-[#f1efe8] px-1.5 py-0.5 text-[11px] text-[#6f6a63]">
          {a}
        </span>
      ))}
    </div>
  );
}
