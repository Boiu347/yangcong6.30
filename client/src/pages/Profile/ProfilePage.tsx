import React from 'react';
import {
  BookOpenCheck,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  FileText,
  Layers,
  Pencil,
  Quote,
  Save,
  Table2,
  Target,
  Users,
} from 'lucide-react';
import { toast } from 'sonner';
import { useIsEditor } from '../../components/auth/PasswordGate';
import { DEFAULT_PORTRAITS, PORTRAIT_FRAMEWORK } from '../../store/portraitDefaults';
import { fetchPortrait, savePortrait } from '../../api/research';
import type { PortraitData, PortraitPersona, PortraitSnapshot } from '../../types/research';

const PROFILE_PROJECT_ID = 'default_project';
const STAGES = ['全部', '小学', '初中', '高中'] as const;
const PAIN_DIMENSIONS = ['兴趣习惯', '错题解惑', '补弱巩固', '备考提分', '学习规划', '情绪压力', '付费价值'] as const;
const VALUE_DIMENSIONS = ['好玩', '听得懂', '短时高效', '错题本', '学练闭环', '轻松解惑', '提分方法'] as const;

const REPORT_LINKS = [
  { stage: '小学', title: '小学用户画像调研报告-23年2月', url: 'https://guanghe.feishu.cn/docx/DzbedUWR2oaOK9xei32cg5wBnec' },
  { stage: '初中', title: '初中用户画像调研报告-23年9月', url: 'https://guanghe.feishu.cn/docx/SIyMd84yEoCS5XxnUhRcQ5K1nsd' },
  { stage: '高中', title: '高中用户画像调研报告-23年12月', url: 'https://guanghe.feishu.cn/docx/CNMEdPRyko6V8KxEwvhcMWGwn5b' },
];

const STAGE_EVOLUTION = [
  {
    stage: '小学',
    motive: '兴趣、陪伴、习惯养成',
    pain: '价值容易被家长误解，复习/提分价值未被看见',
    scene: '教材同步、日常练习、PK、次元书桌、自习室',
    opportunity: '把“好玩乐学”外化成家长能理解的学习闭环',
  },
  {
    stage: '初中',
    motive: '解惑、效率、错题复盘',
    pain: '多学科压力变大，题型解析和错题闭环成为核心',
    scene: '复习当天知识点、作业题型速攻、错题本、中考做题带复习',
    opportunity: '从单节课短时高效，升级到多学科多场景提效',
  },
  {
    stage: '高中',
    motive: '规划、提分、压力回血',
    pain: '时间少、作业多、习题解惑低效，没时间看会觉得不划算',
    scene: '听不懂课后补看、综合题定位、考前专题、纸质讲义配合',
    opportunity: '从“课程多”转向“帮你更快解决考试问题”',
  },
];

const dimensionFields: Array<{ key: keyof PortraitPersona; label: string }> = [
  { key: 'educationPhilosophy', label: '教育理念' },
  { key: 'investment', label: '投入程度' },
  { key: 'decisionStyle', label: '决策方式' },
];

type ProfileMode = 'report' | 'portrait';
type StageFilter = typeof STAGES[number];

function fallbackSnapshot(): PortraitSnapshot {
  return {
    projectId: PROFILE_PROJECT_ID,
    data: DEFAULT_PORTRAITS[PROFILE_PROJECT_ID] ?? {
      framework: PORTRAIT_FRAMEWORK,
      personas: [],
      source: '小学用户画像调研报告、初中用户画像调研报告、高中用户画像调研报告',
      updatedBy: '编辑者',
    },
    version: 0,
    updatedAt: new Date(0).toISOString(),
  };
}

function mergePortraitData(base: PortraitData, remote?: PortraitData | null): PortraitData {
  if (!remote) return base;
  const remoteById = new Map(remote.personas.map((persona) => [persona.id, persona]));
  const baseIds = new Set(base.personas.map((persona) => persona.id));
  return {
    ...base,
    ...remote,
    source: base.source,
    framework: base.framework,
    personas: [
      ...base.personas.map((persona) => ({ ...persona, ...(remoteById.get(persona.id) ?? {}) })),
      ...remote.personas.filter((persona) => !baseIds.has(persona.id)),
    ],
  };
}

function stageOf(persona: PortraitPersona) {
  if (persona.stage) return persona.stage;
  const text = `${persona.id} ${persona.name} ${persona.definition}`;
  if (/高中|高一|高二|高三/.test(text)) return '高中';
  if (/初中|初一|初二|初三|中考/.test(text)) return '初中';
  return '小学';
}

function list(values?: string[], fallback?: string[]) {
  return values?.length ? values : fallback ?? [];
}

function first(values?: string[], fallback = '暂无') {
  return values?.find(Boolean) ?? fallback;
}

function scoreFor(persona: PortraitPersona, dimension: string) {
  return Math.max(0, Math.min(5, persona.painScores?.[dimension] ?? 0));
}

function valueHit(persona: PortraitPersona, dimension: string) {
  const text = [
    persona.name,
    persona.definition,
    persona.coreJudgment,
    ...(persona.valuePerception ?? []),
    ...(persona.coreNeeds ?? []),
    ...(persona.typicalBehaviors ?? []),
  ].join(' ');
  const rules: Record<string, RegExp> = {
    好玩: /好玩|游戏|PK|兴趣|动漫|乐学|陪伴/,
    听得懂: /听懂|易懂|讲解|知识点|轻松/,
    短时高效: /短时|高效|省时间|节省时间|效率/,
    错题本: /错题|错题本|错题率|反复刷/,
    学练闭环: /学-练-纠|学练|练习|做题|复习|预习|闭环/,
    轻松解惑: /解惑|不会|补看|轻松|问同学|拍搜/,
    提分方法: /提分|答题技巧|题型|专题|考试|备考|方法/,
  };
  return rules[dimension]?.test(text) ?? false;
}

export default function ProfilePage() {
  const editor = useIsEditor();
  const baseData = DEFAULT_PORTRAITS[PROFILE_PROJECT_ID] ?? fallbackSnapshot().data;
  const [mode, setMode] = React.useState<ProfileMode>('report');
  const [stageFilter, setStageFilter] = React.useState<StageFilter>('全部');
  const [snapshot, setSnapshot] = React.useState<PortraitSnapshot>(() => fallbackSnapshot());
  const [activePersonaId, setActivePersonaId] = React.useState('');
  const [expandedPersonaId, setExpandedPersonaId] = React.useState('');
  const [draft, setDraft] = React.useState<PortraitData | null>(null);
  const [editing, setEditing] = React.useState(false);
  const [saving, setSaving] = React.useState(false);

  React.useEffect(() => {
    let cancelled = false;
    fetchPortrait(PROFILE_PROJECT_ID)
      .then((remote) => {
        if (!cancelled) setSnapshot(remote ?? fallbackSnapshot());
      })
      .catch(() => {
        if (!cancelled) setSnapshot(fallbackSnapshot());
      });
    return () => { cancelled = true; };
  }, []);

  const data = React.useMemo(() => mergePortraitData(baseData, draft ?? snapshot.data), [baseData, draft, snapshot.data]);
  const personas = data.personas;
  const filteredPersonas = React.useMemo(
    () => personas.filter((persona) => stageFilter === '全部' || stageOf(persona) === stageFilter),
    [personas, stageFilter],
  );
  const activePersona = personas.find((persona) => persona.id === activePersonaId) ?? personas[0];
  const expandedPersona = personas.find((persona) => persona.id === expandedPersonaId);

  React.useEffect(() => {
    const firstPersona = mergePortraitData(baseData, snapshot.data).personas[0];
    setActivePersonaId(firstPersona?.id ?? '');
    setExpandedPersonaId(firstPersona?.id ?? '');
    setDraft(null);
    setEditing(false);
  }, [baseData, snapshot.projectId, snapshot.updatedAt, snapshot.version, snapshot.data]);

  const updatePersona = (patch: Partial<PortraitPersona>) => {
    if (!activePersona) return;
    const next = structuredClone(data);
    next.personas = next.personas.map((persona) =>
      persona.id === activePersona.id ? { ...persona, ...patch } : persona,
    );
    setDraft(next);
  };

  const handleSave = async () => {
    if (!draft) return;
    setSaving(true);
    try {
      const saved = await savePortrait(PROFILE_PROJECT_ID, draft, snapshot.version);
      setSnapshot(saved);
      setDraft(null);
      setEditing(false);
      toast.success('画像报告已保存');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : '保存失败');
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="min-h-0 flex-1 overflow-y-auto bg-[#f8f8f5]">
      <div className="mx-auto max-w-[1480px] px-5 py-5">
        <div className="flex flex-wrap items-end justify-between gap-4 border-b border-[#dddcd5] pb-4">
          <div>
            <div className="flex items-center gap-2 text-[#e65532]">
              <Users size={18} />
              <span className="text-xs font-bold tracking-[0.08em]">INSIGHTHUB PROFILE REPORT</span>
            </div>
            <h1 className="mt-1 text-2xl font-black text-[#252525]">用户画像报告</h1>
            <p className="mt-1 max-w-3xl text-sm leading-6 text-[#6f6f68]">
              小学重兴趣与陪伴，初中重解惑与效率，高中重规划、提分和压力回血。页面只使用小学、初中、高中三份画像报告整理。
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex h-9 rounded-md border border-[#d8d7d0] bg-white p-1">
              <button
                onClick={() => setMode('report')}
                className={`flex items-center gap-1.5 rounded px-3 text-xs font-semibold ${mode === 'report' ? 'bg-[#252525] text-white' : 'text-[#666]'}`}
              >
                <Table2 size={13} />画像报告
              </button>
              <button
                onClick={() => setMode('portrait')}
                className={`flex items-center gap-1.5 rounded px-3 text-xs font-semibold ${mode === 'portrait' ? 'bg-[#252525] text-white' : 'text-[#666]'}`}
              >
                <BookOpenCheck size={13} />画像详情
              </button>
            </div>
            {mode === 'portrait' && editor && !editing && (
              <button onClick={() => { setDraft(structuredClone(data)); setEditing(true); }} className="flex h-9 items-center gap-1.5 rounded-md bg-[#e65532] px-3 text-xs font-bold text-white">
                <Pencil size={13} />编辑画像
              </button>
            )}
            {editing && (
              <>
                <button onClick={() => { setDraft(null); setEditing(false); }} className="h-9 rounded-md border border-[#d8d7d0] bg-white px-3 text-xs font-semibold">取消</button>
                <button disabled={saving} onClick={handleSave} className="flex h-9 items-center gap-1.5 rounded-md bg-[#e65532] px-3 text-xs font-bold text-white disabled:opacity-50">
                  <Save size={13} />{saving ? '保存中' : '保存'}
                </button>
              </>
            )}
          </div>
        </div>

        {mode === 'report' ? (
          <ProfileReport
            personas={personas}
            filteredPersonas={filteredPersonas}
            stageFilter={stageFilter}
            setStageFilter={setStageFilter}
            expandedPersona={expandedPersona}
            onTogglePersona={(persona) => setExpandedPersonaId(expandedPersonaId === persona.id ? '' : persona.id)}
          />
        ) : (
          <PortraitEditor
            personas={personas}
            activePersona={activePersona}
            editing={editing}
            data={data}
            snapshot={snapshot}
            setActivePersonaId={setActivePersonaId}
            updatePersona={updatePersona}
          />
        )}
      </div>
    </main>
  );
}

function ProfileReport({
  personas,
  filteredPersonas,
  stageFilter,
  setStageFilter,
  expandedPersona,
  onTogglePersona,
}: {
  personas: PortraitPersona[];
  filteredPersonas: PortraitPersona[];
  stageFilter: StageFilter;
  setStageFilter: (stage: StageFilter) => void;
  expandedPersona?: PortraitPersona;
  onTogglePersona: (persona: PortraitPersona) => void;
}) {
  return (
    <section className="space-y-5">
      <StageSummaryCards personas={personas} />
      <SourceStrip />
      <StageEvolutionTable />
      <PortraitMatrix
        personas={filteredPersonas}
        stageFilter={stageFilter}
        setStageFilter={setStageFilter}
        expandedPersona={expandedPersona}
        onTogglePersona={onTogglePersona}
      />
      <PainHeatMatrix personas={filteredPersonas} />
      <ValueMatrix personas={filteredPersonas} />
    </section>
  );
}

function StageSummaryCards({ personas }: { personas: PortraitPersona[] }) {
  return (
    <section className="mt-5 grid gap-4 lg:grid-cols-3">
      {STAGE_EVOLUTION.map((item) => {
        const rows = personas.filter((persona) => stageOf(persona) === item.stage);
        return (
          <article key={item.stage} className="border border-[#dddcd5] bg-white p-5">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-[#e65532]">
                <Layers size={16} />
                <span className="text-xs font-black">{item.stage}画像</span>
              </div>
              <span className="rounded bg-[#fff3ef] px-2.5 py-1 text-xs font-bold text-[#e65532]">{rows.length} 类</span>
            </div>
            <h2 className="mt-4 text-lg font-black text-[#252525]">{item.motive}</h2>
            <div className="mt-4 grid gap-3 text-sm leading-6">
              <InfoLine label="关键痛点" value={item.pain} />
              <InfoLine label="主要场景" value={item.scene} />
              <InfoLine label="商业机会" value={item.opportunity} />
            </div>
          </article>
        );
      })}
    </section>
  );
}

function SourceStrip() {
  return (
    <section className="border border-[#dddcd5] bg-white p-4">
      <div className="mb-3 flex items-center gap-2 text-xs font-black text-[#777]">
        <FileText size={14} />数据来源
      </div>
      <div className="grid gap-2 md:grid-cols-3">
        {REPORT_LINKS.map((link) => (
          <a
            key={link.url}
            href={link.url}
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-between gap-3 rounded-md border border-[#e5e1d8] bg-[#fafaf7] px-3 py-2 text-xs font-bold text-[#4f4b45] hover:border-[#e65532] hover:text-[#e65532]"
          >
            <span>{link.stage} · {link.title}</span>
            <ExternalLink size={13} />
          </a>
        ))}
      </div>
    </section>
  );
}

function StageEvolutionTable() {
  return (
    <section className="border border-[#dddcd5] bg-white">
      <SectionHeader icon={<Target size={16} />} title="学段需求演进表" description="横向看三份报告里的需求如何从兴趣陪伴，演进到效率解惑，再到高中提分和回血。" />
      <div className="overflow-x-auto">
        <table className="min-w-[980px] w-full border-t border-[#e5e4de] text-left text-sm">
          <thead className="bg-[#fafaf7] text-xs font-black text-[#777]">
            <tr>
              <th className="w-24 px-4 py-3">学段</th>
              <th className="px-4 py-3">动机</th>
              <th className="px-4 py-3">主要痛点</th>
              <th className="px-4 py-3">使用场景</th>
              <th className="px-4 py-3">商业机会</th>
            </tr>
          </thead>
          <tbody>
            {STAGE_EVOLUTION.map((item) => (
              <tr key={item.stage} className="border-t border-[#efeee9] align-top">
                <td className="px-4 py-3 font-black text-[#252525]">{item.stage}</td>
                <td className="px-4 py-3 text-[#555]">{item.motive}</td>
                <td className="px-4 py-3 text-[#555]">{item.pain}</td>
                <td className="px-4 py-3 text-[#555]">{item.scene}</td>
                <td className="px-4 py-3 font-semibold text-[#333]">{item.opportunity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function PortraitMatrix({
  personas,
  stageFilter,
  setStageFilter,
  expandedPersona,
  onTogglePersona,
}: {
  personas: PortraitPersona[];
  stageFilter: StageFilter;
  setStageFilter: (stage: StageFilter) => void;
  expandedPersona?: PortraitPersona;
  onTogglePersona: (persona: PortraitPersona) => void;
}) {
  return (
    <section className="border border-[#dddcd5] bg-white">
      <div className="flex flex-wrap items-center justify-between gap-3 p-4">
        <SectionTitle icon={<Table2 size={16} />} title="画像矩阵表" description="点击任一行展开完整画像证据。" />
        <div className="flex flex-wrap gap-1 rounded-md border border-[#d8d7d0] bg-[#fafaf7] p-1">
          {STAGES.map((stage) => (
            <button
              key={stage}
              onClick={() => setStageFilter(stage)}
              className={`h-8 rounded px-3 text-xs font-bold ${stageFilter === stage ? 'bg-[#252525] text-white' : 'text-[#666] hover:bg-white'}`}
            >
              {stage}
            </button>
          ))}
        </div>
      </div>
      <div className="overflow-x-auto border-t border-[#e5e4de]">
        <table className="min-w-[1320px] w-full text-left text-sm">
          <thead className="bg-[#fafaf7] text-xs font-black text-[#777]">
            <tr>
              <th className="w-56 px-4 py-3">画像类型</th>
              <th className="w-20 px-4 py-3">学段</th>
              <th className="w-44 px-4 py-3">代表用户</th>
              <th className="w-52 px-4 py-3">核心目标</th>
              <th className="w-56 px-4 py-3">主要痛点</th>
              <th className="w-56 px-4 py-3">使用场景</th>
              <th className="w-52 px-4 py-3">产品价值</th>
              <th className="w-52 px-4 py-3">付费/流失</th>
              <th className="w-72 px-4 py-3">代表原声</th>
            </tr>
          </thead>
          <tbody>
            {personas.map((persona) => (
              <React.Fragment key={persona.id}>
                <tr className="cursor-pointer border-t border-[#efeee9] align-top hover:bg-[#fffaf7]" onClick={() => onTogglePersona(persona)}>
                  <td className="px-4 py-4">
                    <div className="flex items-start gap-2">
                      {expandedPersona?.id === persona.id ? <ChevronDown size={15} className="mt-1 shrink-0 text-[#e65532]" /> : <ChevronRight size={15} className="mt-1 shrink-0 text-[#aaa]" />}
                      <div>
                        <div className="font-black text-[#252525]">{persona.name}</div>
                        <p className="mt-1 line-clamp-2 text-xs leading-5 text-[#777]">{persona.coreJudgment ?? persona.definition}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4"><StageBadge stage={stageOf(persona)} /></td>
                  <td className="px-4 py-4 text-xs leading-5 text-[#555]">{persona.representativeUser ?? persona.distribution}</td>
                  <td className="px-4 py-4"><TagList items={list(persona.goals, persona.coreNeeds).slice(0, 3)} /></td>
                  <td className="px-4 py-4"><TagList items={list(persona.painPoints).slice(0, 3)} tone="warm" /></td>
                  <td className="px-4 py-4 text-xs leading-5 text-[#555]">{list(persona.usageScenarios, persona.typicalBehaviors).slice(0, 2).join('；')}</td>
                  <td className="px-4 py-4"><TagList items={list(persona.valuePerception).slice(0, 3)} tone="green" /></td>
                  <td className="px-4 py-4 text-xs leading-5 text-[#555]">{list(persona.paymentOrChurn).slice(0, 2).join('；')}</td>
                  <td className="px-4 py-4">
                    <blockquote className="border-l-2 border-[#e65532] bg-[#fafaf7] px-3 py-2 text-xs leading-5 text-[#555]">“{first(persona.evidenceQuotes, first(persona.quotes))}”</blockquote>
                  </td>
                </tr>
                {expandedPersona?.id === persona.id && (
                  <tr className="border-t border-[#efeee9] bg-[#fffaf7]">
                    <td colSpan={9} className="px-5 py-5">
                      <PersonaExpanded persona={persona} />
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function PainHeatMatrix({ personas }: { personas: PortraitPersona[] }) {
  return (
    <section className="border border-[#dddcd5] bg-white">
      <SectionHeader icon={<Target size={16} />} title="痛点热力矩阵" description="颜色越深，代表该画像在该痛点维度上的强度越高；口径为画像类型强弱，不代表人数占比。" />
      <div className="overflow-x-auto border-t border-[#e5e4de]">
        <table className="min-w-[980px] w-full text-left text-xs">
          <thead className="bg-[#fafaf7] font-black text-[#777]">
            <tr>
              <th className="w-56 px-4 py-3">画像</th>
              {PAIN_DIMENSIONS.map((dimension) => <th key={dimension} className="px-3 py-3 text-center">{dimension}</th>)}
            </tr>
          </thead>
          <tbody>
            {personas.map((persona) => (
              <tr key={persona.id} className="border-t border-[#efeee9]">
                <td className="px-4 py-3">
                  <div className="font-bold text-[#252525]">{persona.name}</div>
                  <div className="mt-1 text-[11px] text-[#888]">{stageOf(persona)}</div>
                </td>
                {PAIN_DIMENSIONS.map((dimension) => {
                  const score = scoreFor(persona, dimension);
                  return (
                    <td key={dimension} className="px-3 py-3 text-center">
                      <span
                        className="inline-flex h-8 w-12 items-center justify-center rounded text-xs font-black"
                        style={{
                          background: score ? `rgba(230, 85, 50, ${0.14 + score * 0.13})` : '#f3f3ef',
                          color: score >= 4 ? '#fff' : '#7a3b2b',
                        }}
                      >
                        {score || '-'}
                      </span>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function ValueMatrix({ personas }: { personas: PortraitPersona[] }) {
  return (
    <section className="border border-[#dddcd5] bg-white">
      <SectionHeader icon={<Layers size={16} />} title="价值感知矩阵" description="把报告中的价值感知转成可扫视的矩阵，看不同画像为什么觉得洋葱有用。" />
      <div className="overflow-x-auto border-t border-[#e5e4de]">
        <table className="min-w-[980px] w-full text-left text-xs">
          <thead className="bg-[#fafaf7] font-black text-[#777]">
            <tr>
              <th className="w-56 px-4 py-3">画像</th>
              {VALUE_DIMENSIONS.map((dimension) => <th key={dimension} className="px-3 py-3 text-center">{dimension}</th>)}
            </tr>
          </thead>
          <tbody>
            {personas.map((persona) => (
              <tr key={persona.id} className="border-t border-[#efeee9]">
                <td className="px-4 py-3 font-bold text-[#252525]">{persona.name}</td>
                {VALUE_DIMENSIONS.map((dimension) => {
                  const hit = valueHit(persona, dimension);
                  return (
                    <td key={dimension} className="px-3 py-3 text-center">
                      <span className={`inline-flex h-7 w-7 items-center justify-center rounded-full text-xs font-black ${hit ? 'bg-[#e65532] text-white' : 'bg-[#f1f0eb] text-[#b8b4aa]'}`}>
                        {hit ? '✓' : ''}
                      </span>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function PersonaExpanded({ persona }: { persona: PortraitPersona }) {
  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_1fr_1.1fr]">
      <DetailBlock title="基本信息 / 判断" items={[persona.representativeUser ?? persona.distribution, persona.coreJudgment ?? persona.definition, `来源：${persona.sourceReport ?? '三份画像报告'}`]} />
      <DetailBlock title="学习行为与痛点" items={[...list(persona.painPoints).slice(0, 4), ...list(persona.usageScenarios).slice(0, 2)]} />
      <div className="rounded-md border border-[#e8e1d8] bg-white p-4">
        <div className="mb-3 flex items-center gap-2 text-xs font-black text-[#777]"><Quote size={14} />代表原声</div>
        {list(persona.evidenceQuotes, persona.quotes).slice(0, 4).map((quote) => (
          <blockquote key={quote} className="mb-2 border-l-2 border-[#e65532] bg-[#fafaf7] px-3 py-2 text-xs leading-5 text-[#555]">“{quote}”</blockquote>
        ))}
      </div>
    </div>
  );
}

function PortraitEditor({
  personas,
  activePersona,
  editing,
  data,
  snapshot,
  setActivePersonaId,
  updatePersona,
}: {
  personas: PortraitPersona[];
  activePersona?: PortraitPersona;
  editing: boolean;
  data: PortraitData;
  snapshot: PortraitSnapshot;
  setActivePersonaId: (id: string) => void;
  updatePersona: (patch: Partial<PortraitPersona>) => void;
}) {
  return (
    <section className="mt-5 grid min-h-[560px] gap-4 lg:grid-cols-[300px_minmax(0,1fr)]">
      <aside className="border border-[#dddcd5] bg-white">
        <div className="border-b border-[#e5e4de] px-4 py-3 text-xs font-bold text-[#777]">画像类型</div>
        {personas.map((persona) => (
          <button
            key={persona.id}
            onClick={() => setActivePersonaId(persona.id)}
            className={`block w-full border-b border-[#efeee9] px-4 py-3 text-left ${activePersona?.id === persona.id ? 'bg-[#fff3ef]' : 'hover:bg-[#fafaf7]'}`}
          >
            <div className="flex items-start justify-between gap-2">
              <span className="text-sm font-bold text-[#30302d]">{persona.name}</span>
              <span className="shrink-0 text-[10px] text-[#a05a46]">{stageOf(persona)}</span>
            </div>
            <p className="mt-1 line-clamp-2 text-xs leading-5 text-[#777]">{persona.definition}</p>
          </button>
        ))}
      </aside>

      {activePersona && (
        <article className="border border-[#dddcd5] bg-white">
          <header className="flex flex-wrap items-start justify-between gap-4 border-b border-[#e5e4de] px-5 py-5">
            <div className="min-w-0 flex-1">
              {editing ? (
                <>
                  <input value={activePersona.name} onChange={(e) => updatePersona({ name: e.target.value })} className="w-full border-b border-[#ccc] pb-1 text-xl font-bold outline-none" />
                  <textarea value={activePersona.definition} onChange={(e) => updatePersona({ definition: e.target.value })} className="mt-3 min-h-16 w-full rounded-md border border-[#ddd] p-2 text-sm" />
                </>
              ) : (
                <>
                  <h2 className="text-xl font-bold text-[#252525]">{activePersona.name}</h2>
                  <p className="mt-2 max-w-3xl text-sm leading-6 text-[#666]">{activePersona.definition}</p>
                </>
              )}
            </div>
            <StageBadge stage={stageOf(activePersona)} />
          </header>

          <div className="grid gap-px bg-[#e5e4de] md:grid-cols-3">
            {dimensionFields.map(({ key, label }) => (
              <div key={key} className="bg-white p-5">
                <div className="text-[11px] font-bold text-[#9a9991]">{label}</div>
                {editing ? (
                  <textarea value={String(activePersona[key] ?? '')} onChange={(e) => updatePersona({ [key]: e.target.value })} className="mt-2 min-h-24 w-full rounded-md border border-[#ddd] p-2 text-sm" />
                ) : <p className="mt-2 text-sm leading-6 text-[#333]">{String(activePersona[key] ?? '')}</p>}
              </div>
            ))}
          </div>

          <div className="grid gap-6 p-5 md:grid-cols-2">
            <ListEditor title="核心需求" values={activePersona.coreNeeds} editing={editing} onChange={(coreNeeds) => updatePersona({ coreNeeds })} />
            <ListEditor title="典型行为" values={activePersona.typicalBehaviors} editing={editing} onChange={(typicalBehaviors) => updatePersona({ typicalBehaviors })} />
          </div>
          <div className="border-t border-[#e5e4de] p-5">
            <div className="mb-3 flex items-center gap-2 text-xs font-bold text-[#777]"><Quote size={14} />代表原声</div>
            {list(activePersona.evidenceQuotes, activePersona.quotes).map((quote) => (
              <blockquote key={quote} className="mb-2 border-l-2 border-[#e65532] bg-[#fafaf7] px-4 py-3 text-sm leading-6 text-[#444]">“{quote}”</blockquote>
            ))}
          </div>
          <footer className="border-t border-[#e5e4de] bg-[#fafaf7] px-5 py-3 text-xs text-[#777]">
            数据来源：{data.source} · {snapshot.version ? `版本 ${snapshot.version}` : '本地初始版本'}
          </footer>
        </article>
      )}
    </section>
  );
}

function SectionHeader({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="p-4">
      <SectionTitle icon={icon} title={title} description={description} />
    </div>
  );
}

function SectionTitle({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div>
      <div className="flex items-center gap-2 text-[#e65532]">
        {icon}
        <h2 className="text-lg font-black text-[#252525]">{title}</h2>
      </div>
      <p className="mt-1 text-sm leading-6 text-[#777]">{description}</p>
    </div>
  );
}

function InfoLine({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span className="mr-2 text-xs font-black text-[#e65532]">{label}</span>
      <span className="text-[#555]">{value}</span>
    </div>
  );
}

function StageBadge({ stage }: { stage: string }) {
  return <span className="inline-flex rounded bg-[#fff3ef] px-2.5 py-1 text-xs font-black text-[#e65532]">{stage}</span>;
}

function TagList({ items, tone = 'gray' }: { items: string[]; tone?: 'gray' | 'warm' | 'green' }) {
  const className = tone === 'warm'
    ? 'border-[#f1d4c8] bg-[#fff7f2] text-[#9a4a34]'
    : tone === 'green'
      ? 'border-[#d6e8df] bg-[#f2faf6] text-[#35745f]'
      : 'border-[#e5e1d8] bg-[#fafaf7] text-[#625b52]';
  return (
    <div className="flex flex-wrap gap-1.5">
      {items.map((item) => <span key={item} className={`rounded border px-2 py-1 text-[11px] font-semibold leading-4 ${className}`}>{item}</span>)}
    </div>
  );
}

function DetailBlock({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-md border border-[#e8e1d8] bg-white p-4">
      <div className="text-xs font-black text-[#777]">{title}</div>
      <ul className="mt-3 space-y-2">
        {items.filter(Boolean).map((item) => (
          <li key={item} className="border-l-2 border-[#e0d7cd] pl-3 text-xs leading-5 text-[#555]">{item}</li>
        ))}
      </ul>
    </div>
  );
}

function ListEditor({ title, values, editing, onChange }: { title: string; values: string[]; editing: boolean; onChange: (next: string[]) => void }) {
  return (
    <section>
      <div className="mb-3 text-xs font-bold text-[#777]">{title}</div>
      {editing ? (
        <textarea
          value={values.join('\n')}
          onChange={(event) => onChange(event.target.value.split('\n').map((item) => item.trim()).filter(Boolean))}
          className="min-h-32 w-full rounded-md border border-[#ddd] p-3 text-sm leading-6"
        />
      ) : (
        <ul className="space-y-2">
          {values.map((value) => <li key={value} className="border-l-2 border-[#d5d4cd] pl-3 text-sm leading-6 text-[#444]">{value}</li>)}
        </ul>
      )}
    </section>
  );
}
