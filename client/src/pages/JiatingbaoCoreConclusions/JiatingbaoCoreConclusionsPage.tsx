import React from 'react';
import {
  FileText,
  Lightbulb,
  Map,
  Pencil,
  Quote,
  Sparkles,
} from 'lucide-react';
import { useIsEditor } from '@/components/auth/PasswordGate';
import {
  EditDrawer,
  ListField,
  SaveBar,
  TextField,
} from '@/components/edit/EditDrawer';
import EvidenceAudioClips from '@/components/EvidenceAudioClips';
import { HighlightText } from '@/components/report/HighlightText';
import { KeyStat, extractStats } from '@/components/report/KeyStat';
import { useContentStore } from '@/hooks/useContentStore';
import { JIATINGBAO_CLIP_MAP } from '@/utils/jiatingbaoClipLookup';
import {
  familyCoreConclusions,
  type FamilyConclusionPoint,
  type FamilyCoreConclusion,
} from './jiatingbaoCoreConclusionsData';

const STORE_KEY = 'jiatingbao-core-conclusions';
const DIVIDER = '#F0EAE1';
const SOURCE_URL = 'https://guanghe.feishu.cn/wiki/HLzew9x1gisyRhkNbfmccO5En4b';

const DIMENSIONS = [
  {
    id: 'purchase',
    label: '购买决策',
    icon: Lightbulb,
    color: '#E8643C',
    description: '为什么买、为什么不买，以及怎样让长期价值更容易成立。',
  },
  {
    id: 'audience',
    label: '机会人群地图',
    icon: Map,
    color: '#2F8A78',
    description: '从不同家庭年级组合中识别最值得优先转化的人群。',
  },
] as const;

type DimensionId = (typeof DIMENSIONS)[number]['id'];

const HIGHLIGHT_KEYWORDS = [
  '当前孩子',
  '另一个孩子',
  '马上能用',
  '未来能接上',
  '高性价比',
  '长期价值',
  '确定性',
  '不浪费',
  '小低',
  '小高',
  '初中',
  '高中',
  '养生式自学',
  '家庭包',
  '效果',
  '短期课',
];

function deepClone<Value>(value: Value): Value {
  if (typeof structuredClone === 'function') return structuredClone(value);
  return JSON.parse(JSON.stringify(value)) as Value;
}

function EvidenceBlock({
  point,
  color,
}: {
  point: FamilyConclusionPoint;
  color: string;
}) {
  if (!point.evidence?.length) return null;

  return (
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
      <div className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-3">
        {point.evidence.map((evidence) => {
          const clip = evidence.clipCaption
            ? JIATINGBAO_CLIP_MAP[evidence.clipCaption]
            : undefined;
          return (
            <blockquote
              key={`${evidence.quote}-${evidence.source}`}
              className="rounded-[10px] bg-white/80 px-3 py-3"
            >
              <p className="text-[12px] font-medium leading-5 text-[#716A62]">
                “{evidence.quote}”
              </p>
              <footer className="mt-1.5 text-[10.5px] font-semibold text-[#A89C8C]">
                — {evidence.source}
              </footer>
              {clip && <EvidenceAudioClips clips={[clip]} className="mt-2" />}
            </blockquote>
          );
        })}
      </div>
    </div>
  );
}

function ConclusionCard({
  item,
  index,
  color,
  editor,
  onEdit,
}: {
  item: FamilyCoreConclusion;
  index: number;
  color: string;
  editor: boolean;
  onEdit: () => void;
}) {
  const stats = extractStats(`${item.conclusion} ${item.evidenceNote}`);

  return (
    <article
      id={`family-core-item-${item.id}`}
      className="relative scroll-mt-[108px] rounded-[16px] border border-l-4 border-[#ECE6DD] bg-white p-6 lg:scroll-mt-4"
      style={{ borderLeftColor: color }}
    >
      <div className="sticky top-12 z-[5] -mx-6 -mt-6 rounded-t-[13px] border-b border-transparent bg-white px-6 pb-3 pt-6 lg:top-0 lg:shadow-[0_8px_12px_-12px_rgba(60,45,30,0.3)]">
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
              className="ml-auto flex items-center gap-1 rounded-full border border-[#E6DDD3] bg-white px-2.5 py-1 text-[11px] font-bold text-[#8A8279] transition hover:border-[#E8643C] hover:text-[#E8643C]"
            >
              <Pencil size={11} />
              编辑
            </button>
          )}
        </div>

        <h3 className="mt-2.5 text-[20px] font-black leading-8 text-[#2A2621]">
          <HighlightText color={color} keywords={HIGHLIGHT_KEYWORDS}>
            {item.title}
          </HighlightText>
        </h3>
        <p className="mt-2 text-[14.5px] font-medium leading-7 text-[#6F675E] lg:max-w-[820px]">
          <HighlightText color={color} keywords={HIGHLIGHT_KEYWORDS}>
            {item.conclusion}
          </HighlightText>
        </p>
      </div>

      {stats.length > 0 && (
        <KeyStat stats={stats} color={color} className="mt-4 lg:max-w-[65%]" />
      )}

      <div className="mt-5 border-t pt-4" style={{ borderColor: DIVIDER }}>
        <p
          className="text-[11.5px] font-black tracking-[0.08em]"
          style={{ color }}
        >
          核心结论
        </p>
        <ul className="mt-3 space-y-3">
          {item.points.map((point, pointIndex) => (
            <li
              key={`${point.title}-${pointIndex}`}
              className="overflow-hidden rounded-[14px] border border-[#EDE6DC] bg-[#FFFDFC]"
            >
              <div className="px-4 py-4 lg:px-6 lg:py-5">
                <span
                  className="mb-3 grid size-7 place-items-center rounded-full text-[11px] font-black text-white"
                  style={{ backgroundColor: color }}
                >
                  {String(pointIndex + 1).padStart(2, '0')}
                </span>
                <div className="flex items-start gap-3">
                  <span
                    className="mt-[11px] h-5 w-0.5 shrink-0 rounded-full"
                    style={{ background: `${color}99` }}
                  />
                  <div>
                    <h4 className="text-[17px] font-black leading-8 text-[#2A2621] lg:text-[18px]">
                      <HighlightText
                        color={color}
                        keywords={HIGHLIGHT_KEYWORDS}
                      >
                        {point.title}
                      </HighlightText>
                    </h4>
                    <p className="mt-2 text-[13px] font-medium leading-7 text-[#716A62]">
                      <HighlightText
                        color={color}
                        keywords={HIGHLIGHT_KEYWORDS}
                      >
                        {point.text}
                      </HighlightText>
                    </p>
                  </div>
                </div>
              </div>
              <EvidenceBlock point={point} color={color} />
            </li>
          ))}
        </ul>
      </div>

      <div
        className={`mt-5 grid gap-3 border-t pt-4 ${
          item.actions.length > 0
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
                  <HighlightText color={color} keywords={HIGHLIGHT_KEYWORDS}>
                    {action}
                  </HighlightText>
                </li>
              ))}
            </ul>
          </div>
        )}
        <div className="rounded-[12px] bg-[#FAF8F4] px-4 py-3.5">
          <p className="text-[10.5px] font-black tracking-[0.1em] text-[#B0A695]">
            来源说明
          </p>
          <p className="mt-2 text-[11.5px] font-medium leading-6 text-[#9A9186]">
            {item.evidenceNote}
          </p>
        </div>
      </div>
    </article>
  );
}

export default function JiatingbaoCoreConclusionsPage() {
  const editor = useIsEditor();
  const {
    data: storedConclusions,
    saving,
    save,
  } = useContentStore<FamilyCoreConclusion[]>(STORE_KEY, familyCoreConclusions);
  const conclusions =
    storedConclusions.length > 0 ? storedConclusions : familyCoreConclusions;
  const [activeDimension, setActiveDimension] = React.useState<DimensionId>(
    DIMENSIONS[0].id,
  );
  const [draft, setDraft] = React.useState<FamilyCoreConclusion | null>(null);

  const itemsOf = React.useCallback(
    (dimensionId: string) =>
      conclusions.filter((item) => item.dimension === dimensionId),
    [conclusions],
  );

  const jumpToDimension = React.useCallback((dimensionId: string) => {
    setActiveDimension(dimensionId as DimensionId);
    document
      .getElementById(`family-core-dim-${dimensionId}`)
      ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  const jumpToItem = React.useCallback((itemId: string) => {
    document
      .getElementById(`family-core-item-${itemId}`)
      ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  React.useEffect(() => {
    const sections = DIMENSIONS.map((dimension) =>
      document.getElementById(`family-core-dim-${dimension.id}`),
    ).filter((element): element is HTMLElement => Boolean(element));
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort(
            (left, right) =>
              left.boundingClientRect.top - right.boundingClientRect.top,
          )[0];
        if (visible?.target.id) {
          setActiveDimension(
            visible.target.id.replace('family-core-dim-', '') as DimensionId,
          );
        }
      },
      { rootMargin: '-72px 0px -60% 0px', threshold: 0 },
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  const patchDraft = React.useCallback(
    (updater: (item: FamilyCoreConclusion) => void) => {
      setDraft((current) => {
        if (!current) return current;
        const next = deepClone(current);
        updater(next);
        return next;
      });
    },
    [],
  );

  const saveDraft = React.useCallback(async () => {
    if (!draft) return;
    await save(
      conclusions.map((item) => (item.id === draft.id ? draft : item)),
    );
    setDraft(null);
  }, [conclusions, draft, save]);

  return (
    <main className="min-h-full bg-[#FAF8F4] text-[#2A2621]">
      <div className="sticky top-0 z-20 border-b border-[#ECE6DD] bg-[#FAF8F4]/90 backdrop-blur lg:hidden">
        <div className="mx-auto flex h-12 max-w-[820px] items-center gap-1 overflow-x-auto px-4 md:px-6">
          {DIMENSIONS.map((dimension) => {
            const active = activeDimension === dimension.id;
            return (
              <button
                key={dimension.id}
                type="button"
                onClick={() => jumpToDimension(dimension.id)}
                className="shrink-0 rounded-full px-3 py-1.5 text-[12.5px] font-bold transition"
                style={
                  active
                    ? {
                        backgroundColor: `${dimension.color}16`,
                        color: dimension.color,
                      }
                    : { color: '#8A8279' }
                }
              >
                <span
                  className="mr-1.5 inline-block size-1.5 rounded-full align-middle"
                  style={{
                    backgroundColor: dimension.color,
                    opacity: active ? 1 : 0.4,
                  }}
                />
                {dimension.label}
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
              {DIMENSIONS.map((dimension) => {
                const Icon = dimension.icon;
                const active = activeDimension === dimension.id;
                return (
                  <button
                    key={dimension.id}
                    type="button"
                    onClick={() => jumpToDimension(dimension.id)}
                    className="flex w-full items-center gap-2.5 rounded-[12px] px-3 py-2.5 text-left transition"
                    style={
                      active
                        ? {
                            backgroundColor: `${dimension.color}16`,
                            color: dimension.color,
                          }
                        : { color: '#8A8279' }
                    }
                  >
                    <span
                      className="grid size-8 shrink-0 place-items-center rounded-[9px]"
                      style={{
                        backgroundColor: active
                          ? `${dimension.color}1F`
                          : '#F1ECE4',
                        color: active ? dimension.color : '#A89C8C',
                      }}
                    >
                      <Icon size={16} />
                    </span>
                    <span className="min-w-0 flex-1 text-[13px] font-black">
                      {dimension.label}
                    </span>
                    <span className="text-[11px] font-bold opacity-60">
                      {itemsOf(dimension.id).length}
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
              洋葱家庭包用户调研
            </p>
            <div className="mt-2.5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h1 className="text-[28px] font-black leading-tight md:text-[34px]">
                  核心结论
                </h1>
                <p className="mt-2.5 max-w-3xl text-[14px] font-medium leading-7 text-[#8A8279]">
                  从购买决策到机会人群，快速看清家庭包为什么成立、卡在哪里，以及优先向谁转化。
                </p>
              </div>
              <a
                href={SOURCE_URL}
                target="_blank"
                rel="noreferrer"
                className="inline-flex w-fit shrink-0 items-center gap-1.5 rounded-full border border-[#DDD3C7] bg-white px-3.5 py-2 text-[12px] font-black text-[#756B61] transition hover:border-[#E8643C] hover:text-[#E8643C]"
              >
                <FileText size={13} />
                查看原始文档
              </a>
            </div>
          </header>

          <nav className="mt-6 rounded-[16px] border border-[#ECE6DD] bg-white p-5">
            <p className="text-[11px] font-black tracking-[0.12em] text-[#B29B7E]">
              总览目录
            </p>
            <div className="mt-3 space-y-3 lg:grid lg:grid-cols-2 lg:gap-x-8 lg:gap-y-4 lg:space-y-0">
              {DIMENSIONS.map((dimension) => (
                <div
                  key={dimension.id}
                  className="flex flex-col gap-1.5 sm:flex-row sm:gap-3"
                >
                  <div className="flex shrink-0 items-center gap-1.5 sm:w-28 sm:pt-0.5">
                    <span
                      className="size-2 rounded-full"
                      style={{ backgroundColor: dimension.color }}
                    />
                    <span
                      className="text-[12.5px] font-black"
                      style={{ color: dimension.color }}
                    >
                      {dimension.label}
                    </span>
                  </div>
                  <ul className="flex flex-1 flex-wrap gap-x-4 gap-y-1">
                    {itemsOf(dimension.id).map((item) => (
                      <li key={item.id}>
                        <button
                          type="button"
                          onClick={() => jumpToItem(item.id)}
                          className="text-left text-[13px] font-semibold text-[#4A453F] underline-offset-4 transition hover:text-[#E8643C] hover:underline"
                        >
                          {item.title}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </nav>

          <section className="mt-10 space-y-12">
            {DIMENSIONS.map((dimension) => {
              const Icon = dimension.icon;
              const items = itemsOf(dimension.id);
              return (
                <div
                  key={dimension.id}
                  id={`family-core-dim-${dimension.id}`}
                  className="scroll-mt-14 lg:scroll-mt-4"
                >
                  <div className="mb-4 flex items-center gap-2.5">
                    <span
                      className="grid size-9 shrink-0 place-items-center rounded-[10px]"
                      style={{
                        backgroundColor: `${dimension.color}1A`,
                        color: dimension.color,
                      }}
                    >
                      <Icon size={18} />
                    </span>
                    <div>
                      <h2 className="text-[19px] font-black leading-none text-[#2A2621]">
                        {dimension.label}
                      </h2>
                      <p className="mt-1.5 text-[11.5px] font-medium text-[#9A9186]">
                        {dimension.description}
                      </p>
                    </div>
                    <span
                      className="ml-auto rounded-full px-2.5 py-1 text-[11.5px] font-bold"
                      style={{
                        backgroundColor: `${dimension.color}14`,
                        color: dimension.color,
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
                        color={dimension.color}
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
            内容对应《家庭包用户购买决策洞察》主页面 2、3。
          </footer>
        </div>
      </div>

      <EditDrawer
        open={Boolean(draft)}
        onClose={() => setDraft(null)}
        title={draft ? `编辑「${draft.title}」` : '编辑核心结论'}
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
              label="一句话结论"
              value={draft.conclusion}
              multiline
              onChange={(value) =>
                patchDraft((item) => {
                  item.conclusion = value;
                })
              }
            />
            <div className="space-y-4">
              {draft.points.map((point, pointIndex) => (
                <div
                  key={`${point.title}-${pointIndex}`}
                  className="rounded-2xl border border-gray-200 bg-gray-50/50 p-4"
                >
                  <p className="mb-3 text-[11px] font-bold text-gray-400">
                    核心结论 {pointIndex + 1}
                  </p>
                  <TextField
                    label="标题"
                    value={point.title}
                    onChange={(value) =>
                      patchDraft((item) => {
                        item.points[pointIndex].title = value;
                      })
                    }
                  />
                  <TextField
                    label="说明"
                    value={point.text}
                    multiline
                    onChange={(value) =>
                      patchDraft((item) => {
                        item.points[pointIndex].text = value;
                      })
                    }
                  />
                </div>
              ))}
            </div>
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
              用户证据与文档原文绑定，不在此处编辑。
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
