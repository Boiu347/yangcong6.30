import React from 'react';
import {
  BookOpenCheck,
  Lightbulb,
  Pencil,
  Quote,
  SearchCheck,
  Sparkles,
  Target,
} from 'lucide-react';
import { reportConclusions, type ResearchConclusion } from './FromPrimaryMergedReport';
import { clipMetaByUrl, conclusionClipsByCardId } from './conclusionMaps';
import { HighlightText } from '@/components/report/HighlightText';
import { KeyStat, extractStats } from '@/components/report/KeyStat';
import EvidenceAudioClips from '@/components/EvidenceAudioClips';
import type { EvidenceClip } from '@/utils/evidenceClipLookup';
import { useIsEditor } from '@/components/auth/PasswordGate';
import { useContentStore } from '@/hooks/useContentStore';
import { EditDrawer, ListField, SaveBar, TextField } from '@/components/edit/EditDrawer';

// Demo：把「调研结论」从「文档式仓库」改成「层级清晰、一次看清」的浏览体验。
//   不用折叠/点击展开，靠字号-字重-颜色-留白的层级阶梯把主次拉开。
//   层级：主标题(title) > 副标题(conclusion) > 数字锚点 > 核心要点 > 支撑信息(行动/来源)

const RESEARCH_CONCLUSIONS_STORE_KEY = 'research-conclusions';
const ACCENT = '#E95B35';
const DIVIDER = '#F0EAE1';

const DIMS: { id: string; label: string; icon: typeof Lightbulb; color: string }[] = [
  { id: 'core', label: '核心洞察', icon: Lightbulb, color: '#E95B35' },
  { id: 'purchase', label: '购买决策', icon: Target, color: '#C58A3D' },
  { id: 'experience', label: '买后体验', icon: BookOpenCheck, color: '#2F9F8F' },
  { id: 'barrier', label: '购买卡点', icon: SearchCheck, color: '#D96D62' },
  { id: 'brand', label: '品牌差异', icon: Sparkles, color: '#5D78BD' },
];

function deepClone<T>(value: T): T {
  if (typeof structuredClone === 'function') return structuredClone(value);
  return JSON.parse(JSON.stringify(value)) as T;
}

export default function ConclusionsDemo() {
  const editor = useIsEditor();
  const { data: storedConclusions, saving, save } = useContentStore<ResearchConclusion[]>(
    RESEARCH_CONCLUSIONS_STORE_KEY,
    reportConclusions,
  );
  const conclusions = storedConclusions.length > 0 ? storedConclusions : reportConclusions;

  const itemsOf = React.useCallback(
    (dimId: string) => conclusions.filter((item) => item.dimension === dimId),
    [conclusions],
  );

  const visibleDims = React.useMemo(
    () => DIMS.filter((dim) => conclusions.some((item) => item.dimension === dim.id)),
    [conclusions],
  );
  const [activeDim, setActiveDim] = React.useState(visibleDims[0]?.id ?? '');

  const [draft, setDraft] = React.useState<ResearchConclusion | null>(null);
  const patchDraft = React.useCallback((updater: (item: ResearchConclusion) => void) => {
    setDraft((prev) => {
      if (!prev) return prev;
      const next = deepClone(prev);
      updater(next);
      return next;
    });
  }, []);
  const saveDraft = React.useCallback(async () => {
    if (!draft) return;
    const next = conclusions.map((item) => (item.id === draft.id ? draft : item));
    await save(next);
    setDraft(null);
  }, [draft, conclusions, save]);

  const jumpTo = React.useCallback((id: string) => {
    document.getElementById(`demo-item-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);
  const jumpToDim = React.useCallback((id: string) => {
    setActiveDim(id);
    document.getElementById(`demo-dim-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  // Scroll-spy：高亮当前所在维度
  React.useEffect(() => {
    const sections = visibleDims
      .map((dim) => document.getElementById(`demo-dim-${dim.id}`))
      .filter((el): el is HTMLElement => Boolean(el));
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const hit = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (hit?.target.id) setActiveDim(hit.target.id.replace('demo-dim-', ''));
      },
      { rootMargin: '-72px 0px -60% 0px', threshold: 0 },
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [visibleDims]);

  return (
    <main className="min-h-full bg-[#FAF8F4] text-[#2A2621]">
      {/* 吸顶维度 tab 栏：页面太长时快速跳转 + 当前定位 */}
      <div className="sticky top-0 z-20 border-b border-[#ECE6DD] bg-[#FAF8F4]/90 backdrop-blur">
        <div className="mx-auto flex h-12 max-w-[820px] items-center gap-1 overflow-x-auto px-4 md:px-6">
          {visibleDims.map((dim) => {
            const isActive = activeDim === dim.id;
            return (
              <button
                key={dim.id}
                type="button"
                onClick={() => jumpToDim(dim.id)}
                className="shrink-0 rounded-full px-3 py-1.5 text-[12.5px] font-bold transition"
                style={
                  isActive
                    ? { backgroundColor: `${dim.color}16`, color: dim.color }
                    : { color: '#8A8279' }
                }
              >
                <span
                  className="mr-1.5 inline-block size-1.5 rounded-full align-middle"
                  style={{ backgroundColor: dim.color, opacity: isActive ? 1 : 0.4 }}
                />
                {dim.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mx-auto max-w-[820px] px-5 py-9 md:px-6">
        <header>
          <p className="text-[12px] font-bold tracking-[0.14em] text-[#B29B7E]">从小学系列售卖策略调研 · DEMO</p>
          <h1 className="mt-2.5 text-[28px] font-black leading-tight md:text-[34px]">结论速览</h1>
          <p className="mt-2.5 text-[14px] font-medium leading-7 text-[#8A8279]">
            先扫一遍总览目录抓全貌，再往下逐条看；每条结论标题、要点、支撑信息层层分明。
          </p>
        </header>

        {/* 总览目录 */}
        <nav className="mt-6 rounded-[16px] border border-[#ECE6DD] bg-white p-5">
          <p className="text-[11px] font-black tracking-[0.12em] text-[#B29B7E]">总览目录</p>
          <div className="mt-3 space-y-3">
            {DIMS.map((dim) => {
              const items = itemsOf(dim.id);
              if (items.length === 0) return null;
              return (
                <div key={dim.id} className="flex flex-col gap-1.5 sm:flex-row sm:gap-3">
                  <div className="flex shrink-0 items-center gap-1.5 sm:w-24 sm:pt-0.5">
                    <span className="size-2 rounded-full" style={{ backgroundColor: dim.color }} />
                    <span className="text-[12.5px] font-black" style={{ color: dim.color }}>{dim.label}</span>
                  </div>
                  <ul className="flex flex-1 flex-wrap gap-x-4 gap-y-1">
                    {items.map((item) => (
                      <li key={item.id}>
                        <button
                          type="button"
                          onClick={() => jumpTo(item.id)}
                          className="text-left text-[13px] font-semibold text-[#4A453F] underline-offset-4 transition hover:text-[#E95B35] hover:underline"
                        >
                          {item.title}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </nav>

        {/* 详情区（单列 · 层级分明 · 不折叠） */}
        <section className="mt-10 space-y-12">
          {DIMS.map((dim) => {
            const items = itemsOf(dim.id);
            if (items.length === 0) return null;
            const Icon = dim.icon;
            return (
              <div key={dim.id} id={`demo-dim-${dim.id}`} className="scroll-mt-14">
                {/* 维度分区标题：吸附在 tab 栏下方，滚动时始终显示当前板块重点 */}
                <div className="sticky top-12 z-10 -mx-5 mb-4 flex items-center gap-2.5 bg-[#FAF8F4]/95 px-5 py-2.5 backdrop-blur md:-mx-6 md:px-6">
                  <span
                    className="grid size-9 shrink-0 place-items-center rounded-[10px]"
                    style={{ backgroundColor: `${dim.color}1A`, color: dim.color }}
                  >
                    <Icon size={18} />
                  </span>
                  <h2 className="text-[19px] font-black leading-none text-[#2A2621]">{dim.label}</h2>
                  <span
                    className="ml-auto rounded-full px-2.5 py-1 text-[11.5px] font-bold"
                    style={{ backgroundColor: `${dim.color}14`, color: dim.color }}
                  >
                    {items.length} 条
                  </span>
                </div>

                <div className="space-y-4">
                  {items.map((item, index) => (
                    <ConclusionCard
                      key={item.id}
                      item={item}
                      index={index + 1}
                      color={dim.color}
                      editor={editor}
                      onEdit={() => setDraft(deepClone(item))}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </section>

        <footer className="mt-12 text-center text-[12px] font-medium text-[#B7AEA3]">
          Demo · 仅用于对比新版「层级清晰 · 一次看清」的浏览体验，数据同「调研结论」。
        </footer>
      </div>

      <EditDrawer
        open={!!draft}
        onClose={() => setDraft(null)}
        title={draft ? `编辑「${draft.title}」` : '编辑调研结论'}
      >
        {draft && (
          <div className="space-y-5">
            <TextField
              label="结论标题"
              value={draft.title}
              onChange={(value) => patchDraft((item) => { item.title = value; })}
            />
            <TextField
              label="一句话结论（副标题）"
              value={draft.conclusion}
              multiline
              onChange={(value) => patchDraft((item) => { item.conclusion = value; })}
            />
            <ListField
              label="核心结论"
              items={draft.conclusions}
              onChange={(items) => patchDraft((item) => { item.conclusions = items; })}
            />
            <ListField
              label="建议行动"
              items={draft.actions}
              onChange={(items) => patchDraft((item) => { item.actions = items; })}
            />
            <TextField
              label="来源说明"
              value={draft.evidenceNote}
              multiline
              onChange={(value) => patchDraft((item) => { item.evidenceNote = value; })}
            />
            <p className="text-[11px] leading-5 text-gray-400">
              说明：结论下方的访谈原声（录音切片）按原文匹配，不在此处编辑，以免影响音频对应关系。
            </p>
            <SaveBar saving={saving} onSave={() => void saveDraft()} onCancel={() => setDraft(null)} />
          </div>
        )}
      </EditDrawer>
    </main>
  );
}

function ConclusionCard({
  item,
  index,
  color = ACCENT,
  editor = false,
  onEdit,
}: {
  item: ResearchConclusion;
  index: number;
  color?: string;
  editor?: boolean;
  onEdit?: () => void;
}) {
  const stats = extractStats(`${item.conclusion} ${item.evidenceNote}`);

  return (
    <article
      id={`demo-item-${item.id}`}
      className="relative scroll-mt-[120px] overflow-hidden rounded-[16px] border border-[#ECE6DD] bg-white p-6 pl-7"
      style={{ boxShadow: `inset 4px 0 0 ${color}` }}
    >
      {/* 顶部：序号 + 编辑按钮 */}
      <div className="flex items-center gap-2 text-[11px] font-black tracking-[0.1em]" style={{ color: `${color}80` }}>
        <span className="tabular-nums">{String(index).padStart(2, '0')}</span>
        <span className="h-px w-6" style={{ backgroundColor: `${color}40` }} />
        {editor && (
          <button
            type="button"
            onClick={onEdit}
            className="ml-auto flex items-center gap-1 rounded-full border border-[#E6DDD3] bg-white px-2.5 py-1 text-[11px] font-bold text-[#8A8279] transition hover:border-[#E95B35] hover:text-[#E95B35]"
          >
            <Pencil size={11} />
            编辑
          </button>
        )}
      </div>

      {/* L1 主标题 */}
      <h3 className="mt-2.5 text-[20px] font-black leading-8 text-[#2A2621]">{item.title}</h3>

      {/* L2 副标题：一句话结论 */}
      <p className="mt-2 text-[14.5px] font-medium leading-7 text-[#6F675E]">
        <HighlightText color={color}>{item.conclusion}</HighlightText>
      </p>

      {/* L3 数字锚点 */}
      {stats.length > 0 && <KeyStat stats={stats} color={color} className="mt-4" />}

      {/* L4 核心要点 */}
      {item.conclusions.length > 0 && (
        <div className="mt-5 border-t pt-4" style={{ borderColor: DIVIDER }}>
          <p className="text-[11.5px] font-black tracking-[0.08em]" style={{ color }}>
            核心结论
          </p>
          <ul className="mt-2.5 space-y-3.5">
            {item.conclusions.map((point, i) => {
              const clips = conclusionClipsByCardId[item.id]?.[i] ?? [];
              return (
                <li key={point} className="text-[14px] font-medium leading-7 text-[#4A453F]">
                  <div className="flex items-start gap-2.5">
                    <span className="mt-[10px] size-1.5 shrink-0 rounded-full" style={{ background: `${color}99` }} />
                    <span>
                      <HighlightText color={color}>{point}</HighlightText>
                    </span>
                  </div>
                  <VocClips clips={clips} color={color} />
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {/* 支撑信息：建议行动（视觉降权） */}
      {item.actions.length > 0 && (
        <div className="mt-4 border-t pt-4" style={{ borderColor: DIVIDER }}>
          <p className="text-[11.5px] font-black tracking-[0.08em] text-[#A89C8C]">建议行动</p>
          <ul className="mt-2 space-y-1.5">
            {item.actions.map((action) => (
              <li key={action} className="flex items-start gap-2.5 text-[12.5px] font-medium leading-6 text-[#8A8279]">
                <span className="mt-[9px] size-1 shrink-0 rounded-full bg-[#CBBFAF]" />
                <span>{action}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* 支撑信息：来源（最弱） */}
      {item.evidenceNote && (
        <p className="mt-4 border-t pt-3 text-[11.5px] font-medium leading-6 text-[#B0A695]" style={{ borderColor: DIVIDER }}>
          {item.evidenceNote}
        </p>
      )}
    </article>
  );
}

function VocClips({ clips, color }: { clips: string[]; color: string }) {
  if (clips.length === 0) return null;
  return (
    <div className="ml-4 mt-2 flex flex-col gap-2">
      {clips.map((clip, clipIndex) => {
        const meta = clipMetaByUrl[clip];
        const evidenceClips: EvidenceClip[] = [{ clipUrl: clip, startTime: 0, duration: 0 }];
        return (
          <div key={clip + clipIndex} className="rounded-[12px] border border-[#EFE7DB] bg-[#FBFAF7] px-3.5 py-3">
            <div className="flex items-start gap-1.5">
              <Quote size={13} className="mt-0.5 shrink-0" style={{ color }} />
              <p className="text-[12.5px] font-medium leading-5 text-[#5A544C]">{meta?.text ?? ''}</p>
            </div>
            <p className="mt-1.5 text-[11px] font-bold text-[#A89C8C]">— {meta?.source ?? '访谈原声'}</p>
            <EvidenceAudioClips clips={evidenceClips} />
          </div>
        );
      })}
    </div>
  );
}
