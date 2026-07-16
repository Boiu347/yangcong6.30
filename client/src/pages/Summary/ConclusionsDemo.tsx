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
import {
  reportConclusions,
  type ResearchConclusion,
} from './FromPrimaryMergedReport';
import { clipMetaByUrl, conclusionClipsByCardId } from './conclusionMaps';
import {
  DEFAULT_KEYWORDS,
  HighlightText,
} from '@/components/report/HighlightText';
import { KeyStat, extractStats } from '@/components/report/KeyStat';
import EvidenceAudioClips from '@/components/EvidenceAudioClips';
import type { EvidenceClip } from '@/utils/evidenceClipLookup';
import { useIsEditor } from '@/components/auth/PasswordGate';
import { useContentStore } from '@/hooks/useContentStore';
import {
  EditDrawer,
  ListField,
  SaveBar,
  TextField,
} from '@/components/edit/EditDrawer';

// Demo：把「调研结论」从「文档式仓库」改成「层级清晰、一次看清」的浏览体验。
//   不用折叠/点击展开，靠字号-字重-颜色-留白的层级阶梯把主次拉开。
//   层级：主标题(title) > 副标题(conclusion) > 数字锚点 > 核心要点 > 支撑信息(行动/来源)

const RESEARCH_CONCLUSIONS_STORE_KEY = 'research-conclusions';
const ACCENT = '#E95B35';
const DIVIDER = '#F0EAE1';
const SUMMARY_HIGHLIGHT_KEYWORDS = [
  ...DEFAULT_KEYWORDS,
  '真实需求',
  '目标人群',
  '兴趣启蒙',
  '衔接先修',
  '短期需求',
  '长期需求',
  '短期反馈',
  '长期价值',
  '启蒙效果',
  '关键变量',
  '理科思维',
  '触达渠道',
  '新媒体',
  '电销',
  '诉求标准',
  '系统性',
  '专业性',
  '丰富性',
  '关联性',
  '易懂性',
  '购前预期',
  '不抢跑',
  '有收获',
  '品牌信任',
  '顺手加购',
  '终身制',
  '永久有效',
  '买后体验',
  '知识多',
  '更系统',
  '时长短无压力',
  '概念晦涩',
  '不够口语化',
  '读题困难',
  '用户侧卡点',
  '产品侧卡点',
  '商业化卡点',
  '持续学习机制',
  '实验感',
  '漏斗断裂',
  '洋葱优势',
  '洋葱劣势',
  '虚拟实验',
  '专业背书',
  '真人实验课',
  '启蒙性',
  '体系性',
  '差异化优势',
];

const DIMS: {
  id: string;
  label: string;
  icon: typeof Lightbulb;
  color: string;
}[] = [
  { id: 'core', label: '核心洞察', icon: Lightbulb, color: '#E95B35' },
  { id: 'purchase', label: '购买决策', icon: Target, color: '#C58A3D' },
  {
    id: 'experience',
    label: '买后体验',
    icon: BookOpenCheck,
    color: '#2F9F8F',
  },
  { id: 'barrier', label: '购买卡点', icon: SearchCheck, color: '#D96D62' },
  { id: 'brand', label: '品牌差异', icon: Sparkles, color: '#5D78BD' },
];

function deepClone<T>(value: T): T {
  if (typeof structuredClone === 'function') return structuredClone(value);
  return JSON.parse(JSON.stringify(value)) as T;
}

export default function ConclusionsDemo() {
  const editor = useIsEditor();
  const {
    data: storedConclusions,
    saving,
    save,
  } = useContentStore<ResearchConclusion[]>(
    RESEARCH_CONCLUSIONS_STORE_KEY,
    reportConclusions,
  );
  const conclusions =
    storedConclusions.length > 0 ? storedConclusions : reportConclusions;

  const itemsOf = React.useCallback(
    (dimId: string) => conclusions.filter((item) => item.dimension === dimId),
    [conclusions],
  );

  const visibleDims = React.useMemo(
    () =>
      DIMS.filter((dim) =>
        conclusions.some((item) => item.dimension === dim.id),
      ),
    [conclusions],
  );
  const [activeDim, setActiveDim] = React.useState(visibleDims[0]?.id ?? '');

  const [draft, setDraft] = React.useState<ResearchConclusion | null>(null);
  const patchDraft = React.useCallback(
    (updater: (item: ResearchConclusion) => void) => {
      setDraft((prev) => {
        if (!prev) return prev;
        const next = deepClone(prev);
        updater(next);
        return next;
      });
    },
    [],
  );
  const saveDraft = React.useCallback(async () => {
    if (!draft) return;
    const next = conclusions.map((item) =>
      item.id === draft.id ? draft : item,
    );
    await save(next);
    setDraft(null);
  }, [draft, conclusions, save]);

  const jumpTo = React.useCallback((id: string) => {
    document
      .getElementById(`demo-item-${id}`)
      ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);
  const jumpToDim = React.useCallback((id: string) => {
    setActiveDim(id);
    document
      .getElementById(`demo-dim-${id}`)
      ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
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
          .sort(
            (a, b) => a.boundingClientRect.top - b.boundingClientRect.top,
          )[0];
        if (hit?.target.id)
          setActiveDim(hit.target.id.replace('demo-dim-', ''));
      },
      { rootMargin: '-72px 0px -60% 0px', threshold: 0 },
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [visibleDims]);

  return (
    <main className="min-h-full bg-[#FAF8F4] text-[#2A2621]">
      {/* 小屏使用横向 tab；桌面端改用左侧导航轨，释放纵向空间 */}
      <div className="sticky top-0 z-20 border-b border-[#ECE6DD] bg-[#FAF8F4]/90 backdrop-blur lg:hidden">
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
                  style={{
                    backgroundColor: dim.color,
                    opacity: isActive ? 1 : 0.4,
                  }}
                />
                {dim.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mx-auto max-w-[1320px] px-5 md:px-6 lg:grid lg:grid-cols-[190px_minmax(0,1050px)] lg:gap-10">
        <aside className="hidden lg:block">
          <nav className="sticky top-4 py-9">
            <p className="px-3 text-[11px] font-black tracking-[0.12em] text-[#B29B7E]">
              结论维度
            </p>
            <div className="mt-3 space-y-1.5">
              {visibleDims.map((dim) => {
                const Icon = dim.icon;
                const isActive = activeDim === dim.id;
                const count = itemsOf(dim.id).length;
                return (
                  <button
                    key={dim.id}
                    type="button"
                    onClick={() => jumpToDim(dim.id)}
                    className="flex w-full items-center gap-2.5 rounded-[12px] px-3 py-2.5 text-left transition"
                    style={
                      isActive
                        ? {
                            backgroundColor: `${dim.color}16`,
                            color: dim.color,
                          }
                        : { color: '#8A8279' }
                    }
                  >
                    <span
                      className="grid size-8 shrink-0 place-items-center rounded-[9px]"
                      style={{
                        backgroundColor: isActive
                          ? `${dim.color}1F`
                          : '#F1ECE4',
                        color: isActive ? dim.color : '#A89C8C',
                      }}
                    >
                      <Icon size={16} />
                    </span>
                    <span className="min-w-0 flex-1 text-[13px] font-black">
                      {dim.label}
                    </span>
                    <span className="text-[11px] font-bold opacity-60">
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </nav>
        </aside>

        <div className="min-w-0 py-9">
          <header>
            <p className="text-[12px] font-bold tracking-[0.14em] text-[#B29B7E]">
              从小学系列售卖策略调研 · DEMO
            </p>
            <h1 className="mt-2.5 text-[28px] font-black leading-tight md:text-[34px]">
              结论速览
            </h1>
            <p className="mt-2.5 text-[14px] font-medium leading-7 text-[#8A8279]">
              先扫一遍总览目录抓全貌，再往下逐条看；每条结论标题、要点、支撑信息层层分明。
            </p>
          </header>

          {/* 总览目录 */}
          <nav className="mt-6 rounded-[16px] border border-[#ECE6DD] bg-white p-5">
            <p className="text-[11px] font-black tracking-[0.12em] text-[#B29B7E]">
              总览目录
            </p>
            <div className="mt-3 space-y-3 lg:grid lg:grid-cols-2 lg:gap-x-8 lg:gap-y-4 lg:space-y-0">
              {DIMS.map((dim) => {
                const items = itemsOf(dim.id);
                if (items.length === 0) return null;
                return (
                  <div
                    key={dim.id}
                    className="flex flex-col gap-1.5 sm:flex-row sm:gap-3"
                  >
                    <div className="flex shrink-0 items-center gap-1.5 sm:w-24 sm:pt-0.5">
                      <span
                        className="size-2 rounded-full"
                        style={{ backgroundColor: dim.color }}
                      />
                      <span
                        className="text-[12.5px] font-black"
                        style={{ color: dim.color }}
                      >
                        {dim.label}
                      </span>
                    </div>
                    <ul className="flex flex-1 flex-wrap gap-x-4 gap-y-1">
                      {items.map((item) => (
                        <li key={item.id}>
                          <button
                            type="button"
                            onClick={() => jumpTo(item.id)}
                            className="text-left text-[13px] font-semibold text-[#4A453F] underline-offset-4 transition hover:text-[#E95B35] hover:underline"
                          >
                            <HighlightText
                              color={dim.color}
                              keywords={SUMMARY_HIGHLIGHT_KEYWORDS}
                            >
                              {item.title}
                            </HighlightText>
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
                <div
                  key={dim.id}
                  id={`demo-dim-${dim.id}`}
                  className="scroll-mt-14 lg:scroll-mt-4"
                >
                  {/* 板块标题保留在正文流中；当前维度由导航轨持续高亮 */}
                  <div className="mb-4 flex items-center gap-2.5">
                    <span
                      className="grid size-9 shrink-0 place-items-center rounded-[10px]"
                      style={{
                        backgroundColor: `${dim.color}1A`,
                        color: dim.color,
                      }}
                    >
                      <Icon size={18} />
                    </span>
                    <h2 className="text-[19px] font-black leading-none text-[#2A2621]">
                      {dim.label}
                    </h2>
                    <span
                      className="ml-auto rounded-full px-2.5 py-1 text-[11.5px] font-bold"
                      style={{
                        backgroundColor: `${dim.color}14`,
                        color: dim.color,
                      }}
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
            Demo · 仅用于对比新版「层级清晰 ·
            一次看清」的浏览体验，数据同「调研结论」。
          </footer>
        </div>
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
              onChange={(value) =>
                patchDraft((item) => {
                  item.title = value;
                })
              }
            />
            <TextField
              label="一句话结论（副标题）"
              value={draft.conclusion}
              multiline
              onChange={(value) =>
                patchDraft((item) => {
                  item.conclusion = value;
                })
              }
            />
            <ListField
              label="核心结论"
              items={draft.conclusions}
              onChange={(items) =>
                patchDraft((item) => {
                  item.conclusions = items;
                })
              }
            />
            <ListField
              label="建议行动"
              items={draft.actions}
              onChange={(items) =>
                patchDraft((item) => {
                  item.actions = items;
                })
              }
            />
            <TextField
              label="来源说明"
              value={draft.evidenceNote}
              multiline
              onChange={(value) =>
                patchDraft((item) => {
                  item.evidenceNote = value;
                })
              }
            />
            <p className="text-[11px] leading-5 text-gray-400">
              说明：结论下方的访谈原声（录音切片）按原文匹配，不在此处编辑，以免影响音频对应关系。
            </p>
            <SaveBar
              saving={saving}
              onSave={() => void saveDraft()}
              onCancel={() => setDraft(null)}
            />
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
      className="relative scroll-mt-[108px] rounded-[16px] border border-l-4 border-[#ECE6DD] bg-white p-6 lg:scroll-mt-4"
      style={{ borderLeftColor: color }}
    >
      {/* 小屏吸附在横向 tab 下方；桌面端直接吸附在内容区顶部 */}
      <div className="sticky top-12 z-[5] -mx-6 -mt-6 rounded-t-[13px] border-b border-transparent bg-white px-6 pb-3 pt-6 lg:top-0 lg:shadow-[0_8px_12px_-12px_rgba(60,45,30,0.3)]">
        {/* 顶部：序号 + 编辑按钮 */}
        <div
          className="flex items-center gap-2 text-[11px] font-black tracking-[0.1em]"
          style={{ color: `${color}80` }}
        >
          <span className="tabular-nums">{String(index).padStart(2, '0')}</span>
          <span
            className="h-px w-6"
            style={{ backgroundColor: `${color}40` }}
          />
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
        <h3 className="mt-2.5 text-[20px] font-black leading-8 text-[#2A2621]">
          <HighlightText color={color} keywords={SUMMARY_HIGHLIGHT_KEYWORDS}>
            {item.title}
          </HighlightText>
        </h3>

        {/* L2 副标题：一句话结论 */}
        <p className="mt-2 text-[14.5px] font-medium leading-7 text-[#6F675E] lg:max-w-[820px]">
          <HighlightText color={color} keywords={SUMMARY_HIGHLIGHT_KEYWORDS}>
            {item.conclusion}
          </HighlightText>
        </p>
      </div>

      {/* L3 数字锚点 */}
      {stats.length > 0 && (
        <KeyStat stats={stats} color={color} className="mt-4 lg:max-w-[65%]" />
      )}

      {/* L4 核心要点 */}
      {item.conclusions.length > 0 && (
        <div className="mt-5 border-t pt-4" style={{ borderColor: DIVIDER }}>
          <p
            className="text-[11.5px] font-black tracking-[0.08em]"
            style={{ color }}
          >
            核心结论
          </p>
          <ul className="mt-3 space-y-3">
            {item.conclusions.map((point, i) => {
              const clips = conclusionClipsByCardId[item.id]?.[i] ?? [];
              return (
                <li
                  key={point}
                  className="overflow-hidden rounded-[14px] border border-[#EDE6DC] bg-[#FFFDFC]"
                >
                  <div className="relative px-4 py-4 lg:px-6 lg:py-5">
                    <span
                      className="mb-3 grid size-7 place-items-center rounded-full text-[11px] font-black text-white"
                      style={{ backgroundColor: color }}
                    >
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <div className="flex items-start gap-3">
                      <span
                        className="mt-[11px] h-5 w-0.5 shrink-0 rounded-full"
                        style={{ background: `${color}99` }}
                      />
                      <p className="text-[17px] font-black leading-8 text-[#2A2621] lg:text-[18px]">
                        <HighlightText
                          color={color}
                          keywords={SUMMARY_HIGHLIGHT_KEYWORDS}
                        >
                          {point}
                        </HighlightText>
                      </p>
                    </div>
                  </div>
                  {clips.length > 0 && (
                    <div className="border-t border-[#EDE6DC] bg-[#F8F6F2] px-4 py-4 lg:px-6">
                      <div className="mb-3 flex items-center gap-1.5">
                        <Quote size={12} style={{ color }} />
                        <p
                          className="text-[10.5px] font-black tracking-[0.1em]"
                          style={{ color }}
                        >
                          对应用户证据
                        </p>
                      </div>
                      <VocClips clips={clips} color={color} />
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {(item.actions.length > 0 || item.evidenceNote) && (
        <div
          className={`mt-5 grid gap-3 border-t pt-4 ${
            item.actions.length > 0 && item.evidenceNote
              ? 'lg:grid-cols-[minmax(0,1.15fr)_minmax(280px,0.85fr)]'
              : 'lg:grid-cols-1'
          }`}
          style={{ borderColor: DIVIDER }}
        >
          {item.actions.length > 0 && (
            <div className="rounded-[12px] bg-[#FAF8F4] px-4 py-3.5">
              <p className="text-[10.5px] font-black tracking-[0.1em] text-[#9D9181]">
                建议行动
              </p>
              <ul className="mt-2 space-y-1.5">
                {item.actions.map((action) => (
                  <li
                    key={action}
                    className="flex items-start gap-2.5 text-[12.5px] font-medium leading-6 text-[#746C63]"
                  >
                    <span
                      className="mt-[9px] size-1 shrink-0 rounded-full"
                      style={{ backgroundColor: `${color}80` }}
                    />
                    <span>
                      <HighlightText
                        color={color}
                        keywords={SUMMARY_HIGHLIGHT_KEYWORDS}
                      >
                        {action}
                      </HighlightText>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {item.evidenceNote && (
            <div className="rounded-[12px] bg-[#FAF8F4] px-4 py-3.5">
              <p className="text-[10.5px] font-black tracking-[0.1em] text-[#B0A695]">
                来源说明
              </p>
              <p className="mt-2 text-[11.5px] font-medium leading-6 text-[#9A9186]">
                {item.evidenceNote}
              </p>
            </div>
          )}
        </div>
      )}
    </article>
  );
}

function VocClips({ clips, color }: { clips: string[]; color: string }) {
  if (clips.length === 0) return null;
  return (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-3">
      {clips.map((clip, clipIndex) => {
        const meta = clipMetaByUrl[clip];
        const evidenceClips: EvidenceClip[] = [
          { clipUrl: clip, startTime: 0, duration: 0 },
        ];
        return (
          <div
            key={clip + clipIndex}
            className="rounded-[10px] bg-white/75 px-3 py-3"
          >
            <div className="flex items-start gap-1.5">
              <Quote
                size={12}
                className="mt-0.5 shrink-0 opacity-60"
                style={{ color }}
              />
              <p className="text-[12px] font-medium leading-5 text-[#716A62]">
                {meta?.text ?? ''}
              </p>
            </div>
            <p className="mt-1.5 pl-[18px] text-[10.5px] font-semibold text-[#A89C8C]">
              — {meta?.source ?? '访谈原声'}
            </p>
            <EvidenceAudioClips clips={evidenceClips} className="ml-[18px]" />
          </div>
        );
      })}
    </div>
  );
}
