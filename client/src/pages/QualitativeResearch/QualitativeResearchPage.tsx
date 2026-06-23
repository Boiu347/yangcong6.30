import { useMemo, useState, type ReactNode } from 'react';
import { ChevronDown, Search, Sparkles, AudioLines } from 'lucide-react';
import EvidenceAudioClips from '../../components/EvidenceAudioClips';
import { ALL_SEGMENTS } from '../../store/labeledSegments';
import {
  DIMENSIONS,
  LABELS,
  LABEL_BY_ID,
  RESEARCH_VALUE_META,
  labelFullName,
  type DimensionId,
  type LabeledSegment,
  type ResearchValue,
} from '../../store/segmentTaxonomy';

const DIM_TINT: Record<DimensionId, { color: string; bg: string }> = {
  app: { color: '#2563eb', bg: '#eff6ff' },
  course: { color: '#7c3aed', bg: '#f5f3ff' },
  buy: { color: '#dc2626', bg: '#fef2f2' },
};

type ProjectFilter = 'all' | 'jiatingbao' | 'physics';
type ValueFilter = 'all' | ResearchValue;

export default function QualitativeResearchPage() {
  const [project, setProject] = useState<ProjectFilter>('all');
  const [value, setValue] = useState<ValueFilter>('all');
  const [kw, setKw] = useState('');
  const [pendingOnly, setPendingOnly] = useState(false);
  const [activeDim, setActiveDim] = useState<DimensionId | 'all'>('all');
  const [openLabels, setOpenLabels] = useState<Set<string>>(new Set());

  const filtered = useMemo(() => {
    const q = kw.trim();
    return ALL_SEGMENTS.filter((s) => {
      if (project !== 'all' && s.project !== project) return false;
      if (value !== 'all' && s.researchValue !== value) return false;
      if (pendingOnly && !s.pendingNew) return false;
      if (q && !(s.quote.includes(q) || s.respondent.includes(q))) return false;
      return true;
    });
  }, [project, value, kw, pendingOnly]);

  const stats = useMemo(() => {
    const withAudio = filtered.filter((s) => s.clipUrl).length;
    const high = filtered.filter((s) => s.researchValue === 'high').length;
    const pending = filtered.filter((s) => s.pendingNew).length;
    const byDim: Record<DimensionId, number> = { app: 0, course: 0, buy: 0 };
    filtered.forEach((s) => (byDim[s.dimension] += 1));
    return { total: filtered.length, withAudio, high, pending, byDim };
  }, [filtered]);

  const dims = activeDim === 'all' ? DIMENSIONS : DIMENSIONS.filter((d) => d.id === activeDim);

  const toggleLabel = (id: string) =>
    setOpenLabels((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  return (
    <main className="min-h-[calc(100vh-52px)] bg-[#f4f5f2]">
      {/* Hero */}
      <section className="border-b border-[#e2dfd7] bg-white">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
          <div className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-[#928b80]">
            Qualitative Research · 片段标签分析
          </div>
          <h1 className="text-[30px] font-extrabold leading-tight text-[#25231f] sm:text-[36px]">定性调研</h1>
          <p className="mt-3 max-w-3xl text-[15px] leading-7 text-[#5f5a52]">
            把用户原声切成「单一语义」的研究片段，按 <b>APP体验 / 课程体验 / 购买决策</b> 三个一级维度打标。
            每条片段保留原话、绑定录音，并标注主标签、辅助标签与研究价值；词典覆盖不到的明确价值片段用
            <span className="mx-1 rounded bg-amber-50 px-1.5 py-0.5 text-amber-700">待归类</span>标识。
          </p>
          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <Stat label="片段总数" value={stats.total} />
            <Stat label="绑定录音" value={stats.withAudio} />
            <Stat label="高价值片段" value={stats.high} accent="#dc2626" />
            <Stat label="待归类（建议新增）" value={stats.pending} accent="#b45309" />
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="sticky top-0 z-10 border-b border-[#e2dfd7] bg-[#f9f8f5]/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-6 gap-y-3 px-4 py-3 sm:px-6">
          <FilterGroup label="项目">
            {([['all', '全部'], ['jiatingbao', '家庭包'], ['physics', '小学物理']] as const).map(([id, t]) => (
              <Chip key={id} active={project === id} onClick={() => setProject(id)}>{t}</Chip>
            ))}
          </FilterGroup>
          <FilterGroup label="价值">
            {([['all', '全部'], ['high', '高'], ['medium', '中'], ['low', '低']] as const).map(([id, t]) => (
              <Chip key={id} active={value === id} onClick={() => setValue(id)}>{t}</Chip>
            ))}
          </FilterGroup>
          <FilterGroup label="维度">
            {([['all', '全部'], ['app', 'APP'], ['course', '课程'], ['buy', '购买']] as const).map(([id, t]) => (
              <Chip key={id} active={activeDim === id} onClick={() => setActiveDim(id)}>{t}</Chip>
            ))}
          </FilterGroup>
          <label className="flex cursor-pointer items-center gap-1.5 text-xs font-medium text-[#6f6a63]">
            <input type="checkbox" checked={pendingOnly} onChange={(e) => setPendingOnly(e.target.checked)} className="accent-amber-600" />
            仅看待归类
          </label>
          <div className="ml-auto flex items-center gap-1.5 rounded-md border border-[#dcd7cc] bg-white px-2.5 py-1.5">
            <Search size={14} className="text-[#9a948b]" />
            <input
              value={kw}
              onChange={(e) => setKw(e.target.value)}
              placeholder="搜索原话/受访者"
              className="w-40 bg-transparent text-sm text-[#34312c] outline-none placeholder:text-[#b3ada3]"
            />
          </div>
        </div>
      </section>

      {/* Dimensions */}
      <section className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
        {dims.map((dim) => {
          const dimSegs = filtered.filter((s) => s.dimension === dim.id);
          const labelsHere = LABELS.filter((l) => l.dimension === dim.id);
          // 该维度下出现的待归类标签
          const pendingLabels = [...new Set(dimSegs.filter((s) => s.pendingNew).map((s) => s.primaryLabel))];
          const groups: { id: string; full: string; segs: LabeledSegment[]; pending: boolean }[] = [
            ...labelsHere.map((l) => ({ id: l.id, full: l.name, segs: dimSegs.filter((s) => s.primaryLabel === l.id), pending: false })),
            ...pendingLabels.map((id) => ({ id, full: id, segs: dimSegs.filter((s) => s.primaryLabel === id), pending: true })),
          ]
            .filter((g) => g.segs.length > 0)
            .sort((a, b) => b.segs.length - a.segs.length);
          const tint = DIM_TINT[dim.id];

          return (
            <div key={dim.id} className="mb-8">
              <div className="mb-3 flex items-baseline gap-3">
                <h2 className="text-xl font-extrabold text-[#25231f]">{dim.name}</h2>
                <span className="text-sm font-semibold" style={{ color: tint.color }}>{dimSegs.length} 片段</span>
                <span className="text-xs text-[#9a948b]">{dim.desc}</span>
              </div>

              {groups.length === 0 ? (
                <div className="rounded-lg border border-dashed border-[#dcd7cc] bg-white px-4 py-6 text-center text-sm text-[#9a948b]">
                  当前筛选下无片段
                </div>
              ) : (
                <div className="space-y-2">
                  {groups.map((g) => {
                    const open = openLabels.has(g.id);
                    const vmix = valueMix(g.segs);
                    const def = LABEL_BY_ID[g.id]?.definition;
                    return (
                      <div key={g.id} className="overflow-hidden rounded-lg border border-[#e3dfd6] bg-white">
                        <button
                          type="button"
                          onClick={() => toggleLabel(g.id)}
                          className="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-[#faf9f6]"
                        >
                          <ChevronDown size={16} className={`shrink-0 text-[#9a948b] transition-transform ${open ? '' : '-rotate-90'}`} />
                          <span
                            className="rounded px-2 py-0.5 text-sm font-bold"
                            style={{ backgroundColor: g.pending ? '#fffbeb' : tint.bg, color: g.pending ? '#b45309' : tint.color }}
                          >
                            {g.full}
                          </span>
                          {g.pending && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-bold text-amber-700">
                              <Sparkles size={11} /> 建议新增
                            </span>
                          )}
                          {def && <span className="hidden truncate text-xs text-[#9a948b] md:inline">{def}</span>}
                          <span className="ml-auto flex shrink-0 items-center gap-2">
                            <ValueDots mix={vmix} />
                            <span className="text-sm font-bold text-[#34312c]">{g.segs.length}</span>
                          </span>
                        </button>
                        {open && (
                          <div className="border-t border-[#eee9df] bg-[#fbfaf7] px-3 py-3">
                            <div className="grid gap-2.5 lg:grid-cols-2">
                              {g.segs.map((s) => (
                                <SegmentCard key={s.id} seg={s} />
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </section>
    </main>
  );
}

function SegmentCard({ seg }: { seg: LabeledSegment }) {
  const vm = RESEARCH_VALUE_META[seg.researchValue];
  const projTint = seg.project === 'jiatingbao' ? '#e65532' : '#0d9488';
  return (
    <div className={`rounded-lg border bg-white p-3 ${seg.pendingNew ? 'border-dashed border-amber-300' : 'border-[#e8e3d9]'}`}>
      <div className="mb-1.5 flex flex-wrap items-center gap-1.5">
        <span className="rounded px-1.5 py-0.5 text-[11px] font-bold" style={{ backgroundColor: vm.bg, color: vm.color }}>
          {vm.label}
        </span>
        <span className="rounded-full px-2 py-0.5 text-[11px] font-medium" style={{ backgroundColor: `${projTint}14`, color: projTint }}>
          {seg.respondent}
        </span>
      </div>
      <p className="text-sm leading-6 text-[#2c2a26]">{seg.quote}</p>
      {seg.auxLabels.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1">
          <span className="text-[11px] text-[#9a948b]">辅助：</span>
          {seg.auxLabels.map((a) => (
            <span key={a} className="rounded bg-[#f1efe8] px-1.5 py-0.5 text-[11px] text-[#6f6a63]">
              {labelFullName(a)}
            </span>
          ))}
        </div>
      )}
      {seg.pendingNew && seg.pendingReason && (
        <div className="mt-2 rounded bg-amber-50 px-2 py-1 text-[11px] leading-5 text-amber-800">
          新增理由：{seg.pendingReason}
        </div>
      )}
      {seg.clipUrl ? (
        <EvidenceAudioClips clips={[{ clipUrl: seg.clipUrl, startTime: seg.startTime ?? 0, duration: seg.duration }]} />
      ) : (
        <div className="mt-1.5 flex items-center gap-1 text-[11px] text-[#bdb7ac]">
          <AudioLines size={12} /> 暂无录音切片
        </div>
      )}
    </div>
  );
}

function valueMix(segs: LabeledSegment[]) {
  return {
    high: segs.filter((s) => s.researchValue === 'high').length,
    medium: segs.filter((s) => s.researchValue === 'medium').length,
    low: segs.filter((s) => s.researchValue === 'low').length,
  };
}

function ValueDots({ mix }: { mix: { high: number; medium: number; low: number } }) {
  return (
    <span className="flex items-center gap-1 text-[10px] font-semibold">
      {mix.high > 0 && <span style={{ color: '#dc2626' }}>高{mix.high}</span>}
      {mix.medium > 0 && <span style={{ color: '#b45309' }}>中{mix.medium}</span>}
      {mix.low > 0 && <span style={{ color: '#94a3b8' }}>低{mix.low}</span>}
    </span>
  );
}

function Stat({ label, value, accent }: { label: string; value: number; accent?: string }) {
  return (
    <div className="rounded-lg border border-[#e7e2d8] bg-[#fbfaf7] px-3 py-2.5">
      <div className="text-[11px] font-medium text-[#8a857d]">{label}</div>
      <div className="mt-0.5 text-2xl font-extrabold" style={{ color: accent ?? '#25231f' }}>{value}</div>
    </div>
  );
}

function FilterGroup({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="text-xs font-semibold text-[#928b80]">{label}</span>
      <div className="flex gap-1">{children}</div>
    </div>
  );
}

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-2.5 py-1 text-xs font-medium transition ${
        active ? 'bg-[#25231f] text-white' : 'bg-white text-[#6f6a63] border border-[#dcd7cc] hover:border-[#b3ada3]'
      }`}
    >
      {children}
    </button>
  );
}
