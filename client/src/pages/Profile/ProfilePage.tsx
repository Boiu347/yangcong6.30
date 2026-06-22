import React from 'react';
import {
  BarChart3,
  BookOpenCheck,
  Home,
  Layers,
  Pencil,
  Quote,
  Save,
  School,
  Target,
  Users,
} from 'lucide-react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { toast } from 'sonner';
import { useIsEditor } from '../../components/auth/PasswordGate';
import { DEFAULT_PORTRAITS, PORTRAIT_FRAMEWORK } from '../../store/portraitDefaults';
import { fetchPortrait, savePortrait } from '../../api/research';
import type { PortraitData, PortraitPersona, PortraitSnapshot } from '../../types/research';

const PROFILE_PROJECT_ID = 'default_project';
const CHART_COLORS = ['#e65532', '#2f6f9f', '#56a383', '#b58a43', '#8b6bb8', '#b8667a'];

const dimensionFields: Array<{ key: keyof PortraitPersona; label: string }> = [
  { key: 'educationPhilosophy', label: '教育理念' },
  { key: 'investment', label: '投入程度' },
  { key: 'decisionStyle', label: '决策方式' },
];

type ProfileMode = 'overview' | 'portrait';
type PersonaRole = '家长' | '学生' | '家庭决策';
type PersonaStage = '小学' | '初中' | '高中';
type DemandType = '兴趣习惯' | '错题提效' | '补弱巩固' | '备考提分' | '规划解惑' | '情绪支持';

interface PersonaSummary {
  persona: PortraitPersona;
  role: PersonaRole;
  stage: PersonaStage;
  demandType: DemandType;
  tags: string[];
}

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

export default function ProfilePage() {
  const editor = useIsEditor();
  const [mode, setMode] = React.useState<ProfileMode>('overview');
  const [snapshot, setSnapshot] = React.useState<PortraitSnapshot>(() => fallbackSnapshot());
  const [activePersonaId, setActivePersonaId] = React.useState('');
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

  const data = draft ?? snapshot.data;
  const activePersona = data.personas.find((persona) => persona.id === activePersonaId) ?? data.personas[0];
  const personaSummaries = React.useMemo(() => buildPersonaSummaries(data.personas), [data.personas]);
  const dashboard = React.useMemo(() => buildProfileDashboard(personaSummaries), [personaSummaries]);

  React.useEffect(() => {
    setActivePersonaId(snapshot.data.personas[0]?.id ?? '');
    setDraft(null);
    setEditing(false);
  }, [snapshot.projectId, snapshot.updatedAt, snapshot.version]);

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
    <main className="flex-1 min-h-0 overflow-y-auto bg-[#f8f8f5]">
      <div className="mx-auto max-w-[1440px] px-5 py-5">
        <div className="flex flex-wrap items-end justify-between gap-4 border-b border-[#dddcd5] pb-4">
          <div>
            <div className="flex items-center gap-2 text-[#e65532]">
              <Users size={18} />
              <span className="text-xs font-bold">INSIGHTHUB PROFILE</span>
            </div>
            <h1 className="mt-1 text-2xl font-bold text-[#252525]">用户画像</h1>
            <p className="mt-1 text-sm text-[#6f6f68]">基于小学、初中、高中三份画像报告，呈现画像类型结构与业务重点。</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex h-9 rounded-md border border-[#d8d7d0] bg-white p-1">
              <button
                onClick={() => setMode('overview')}
                className={`flex items-center gap-1.5 rounded px-3 text-xs font-semibold ${mode === 'overview' ? 'bg-[#252525] text-white' : 'text-[#666]'}`}
              >
                <Layers size={13} />结构看板
              </button>
              <button
                onClick={() => setMode('portrait')}
                className={`flex items-center gap-1.5 rounded px-3 text-xs font-semibold ${mode === 'portrait' ? 'bg-[#252525] text-white' : 'text-[#666]'}`}
              >
                <BookOpenCheck size={13} />画像详情
              </button>
            </div>
            {mode === 'portrait' && editor && !editing && (
              <button onClick={() => { setDraft(structuredClone(snapshot.data)); setEditing(true); }} className="flex h-9 items-center gap-1.5 rounded-md bg-[#e65532] px-3 text-xs font-bold text-white">
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

        <section className="grid grid-cols-2 gap-px border-x border-b border-[#dddcd5] bg-[#dddcd5] md:grid-cols-5">
          {PORTRAIT_FRAMEWORK.map((item, index) => (
            <div key={item} className="bg-white px-4 py-3">
              <div className="text-[10px] font-bold text-[#9a9991]">0{index + 1}</div>
              <div className="mt-1 text-sm font-bold text-[#333]">{item}</div>
            </div>
          ))}
        </section>

        {mode === 'overview' ? (
          <ProfileOverview dashboard={dashboard} summaries={personaSummaries} source={data.source} />
        ) : (
          <section className="mt-5 grid min-h-[560px] gap-4 lg:grid-cols-[280px_minmax(0,1fr)]">
            <aside className="border border-[#dddcd5] bg-white">
              <div className="border-b border-[#e5e4de] px-4 py-3 text-xs font-bold text-[#777]">画像类型</div>
              {data.personas.length ? data.personas.map((persona) => (
                <button
                  key={persona.id}
                  onClick={() => setActivePersonaId(persona.id)}
                  className={`block w-full border-b border-[#efeee9] px-4 py-3 text-left ${activePersona?.id === persona.id ? 'bg-[#fff3ef]' : 'hover:bg-[#fafaf7]'}`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-sm font-bold text-[#30302d]">{persona.name}</span>
                    <span className="shrink-0 text-[10px] text-[#a05a46]">{inferPersonaStage(persona)}</span>
                  </div>
                  <p className="mt-1 line-clamp-2 text-xs leading-5 text-[#777]">{persona.definition}</p>
                </button>
              )) : (
                <div className="px-4 py-10 text-center text-sm text-[#999]">三份画像报告尚未建立画像</div>
              )}
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
                  <div className="flex items-center gap-2 rounded-md bg-[#f3f3ef] px-3 py-2">
                    <BarChart3 size={14} className="text-[#e65532]" />
                    {editing ? (
                      <input value={activePersona.distribution} onChange={(e) => updatePersona({ distribution: e.target.value })} className="w-32 bg-transparent text-xs font-bold outline-none" />
                    ) : <span className="text-xs font-bold">{activePersona.distribution}</span>}
                  </div>
                </header>

                <div className="grid gap-px bg-[#e5e4de] md:grid-cols-3">
                  {dimensionFields.map(({ key, label }) => (
                    <div key={key} className="bg-white p-5">
                      <div className="text-[11px] font-bold text-[#9a9991]">{label}</div>
                      {editing ? (
                        <textarea value={String(activePersona[key])} onChange={(e) => updatePersona({ [key]: e.target.value })} className="mt-2 min-h-24 w-full rounded-md border border-[#ddd] p-2 text-sm" />
                      ) : <p className="mt-2 text-sm leading-6 text-[#333]">{String(activePersona[key])}</p>}
                    </div>
                  ))}
                </div>

                <div className="grid gap-6 p-5 md:grid-cols-2">
                  <ListEditor title="核心需求" values={activePersona.coreNeeds} editing={editing} onChange={(coreNeeds) => updatePersona({ coreNeeds })} />
                  <ListEditor title="典型行为" values={activePersona.typicalBehaviors} editing={editing} onChange={(typicalBehaviors) => updatePersona({ typicalBehaviors })} />
                </div>
                <div className="border-t border-[#e5e4de] p-5">
                  <div className="mb-3 flex items-center gap-2 text-xs font-bold text-[#777]"><Quote size={14} />代表原声</div>
                  {activePersona.quotes.length ? activePersona.quotes.map((quote, index) => (
                    <blockquote key={index} className="mb-2 border-l-2 border-[#e65532] bg-[#fafaf7] px-4 py-3 text-sm leading-6 text-[#444]">“{quote}”</blockquote>
                  )) : <p className="text-sm text-[#999]">当前资料没有可核验的逐字原声，暂不补写。</p>}
                </div>
                <footer className="border-t border-[#e5e4de] bg-[#fafaf7] px-5 py-3 text-xs text-[#777]">
                  数据来源：{data.source} · {snapshot.version ? `版本 ${snapshot.version}` : '本地初始版本'}
                </footer>
              </article>
            )}
          </section>
        )}
      </div>
    </main>
  );
}

function inferPersonaStage(persona: PortraitPersona): PersonaStage {
  const text = `${persona.id} ${persona.name} ${persona.definition}`;
  if (/高中|高一|高二|高三/.test(text)) return '高中';
  if (/初中|初一|初二|初三|中考/.test(text)) return '初中';
  return '小学';
}

function inferPersonaRole(persona: PortraitPersona): PersonaRole {
  const text = `${persona.id} ${persona.name} ${persona.definition} ${persona.decisionStyle}`;
  if (/价值未被看见|价格|付费|购买|决策|续费/.test(text)) return '家庭决策';
  if (/家长|妈妈|爸爸/.test(text)) return '家长';
  return '学生';
}

function inferDemandType(persona: PortraitPersona): DemandType {
  const text = `${persona.name} ${persona.definition} ${persona.coreNeeds.join(' ')} ${persona.typicalBehaviors.join(' ')}`;
  if (/兴趣|习惯|陪伴|PK|游戏/.test(text)) return '兴趣习惯';
  if (/错题|题型|解析|刷题|解惑/.test(text)) return '错题提效';
  if (/基础|补弱|断层|巩固|查漏/.test(text)) return '补弱巩固';
  if (/中考|高考|备考|提分|考试|答题技巧/.test(text)) return '备考提分';
  if (/规划|时间|方向|计划|路径/.test(text)) return '规划解惑';
  return '情绪支持';
}

function getPersonaTags(persona: PortraitPersona): string[] {
  const text = `${persona.name} ${persona.definition} ${persona.coreNeeds.join(' ')} ${persona.typicalBehaviors.join(' ')}`;
  const rules: Array<[string, RegExp]> = [
    ['兴趣驱动', /兴趣|好玩|PK|游戏|陪伴/],
    ['习惯培养', /习惯|预习|复习|持续/],
    ['错题提效', /错题|题型|解析|刷题/],
    ['补弱巩固', /补弱|断层|跟不上|巩固/],
    ['自主备考', /中考|备考|试卷|考试/],
    ['住宿高压', /住宿|高压|时间|盲目/],
    ['提分方法', /提分|答题技巧|归纳|专题/],
    ['情绪支持', /情绪|烦躁|回血|动力/],
    ['价格敏感', /价格|付费|贵|价值/],
  ];
  return rules.filter(([, pattern]) => pattern.test(text)).map(([label]) => label).slice(0, 3);
}

function buildPersonaSummaries(personas: PortraitPersona[]): PersonaSummary[] {
  return personas.map((persona) => ({
    persona,
    role: inferPersonaRole(persona),
    stage: inferPersonaStage(persona),
    demandType: inferDemandType(persona),
    tags: getPersonaTags(persona),
  }));
}

function countSummaries<T extends string>(rows: PersonaSummary[], getKey: (row: PersonaSummary) => T) {
  const counts = new Map<T, number>();
  rows.forEach((row) => counts.set(getKey(row), (counts.get(getKey(row)) ?? 0) + 1));
  return [...counts.entries()].map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count);
}

function buildProfileDashboard(rows: PersonaSummary[]) {
  return {
    personaCount: rows.length,
    stageCount: new Set(rows.map((row) => row.stage)).size,
    parentCount: rows.filter((row) => row.role === '家长' || row.role === '家庭决策').length,
    studentCount: rows.filter((row) => row.role === '学生').length,
    stages: countSummaries(rows, (row) => row.stage),
    roles: countSummaries(rows, (row) => row.role),
    demandTypes: countSummaries(rows, (row) => row.demandType),
  };
}

function ProfileOverview({
  dashboard,
  summaries,
  source,
}: {
  dashboard: ReturnType<typeof buildProfileDashboard>;
  summaries: PersonaSummary[];
  source: string;
}) {
  const groupedByStage = (['小学', '初中', '高中'] as PersonaStage[]).map((stage) => ({
    stage,
    rows: summaries.filter((row) => row.stage === stage),
  }));

  return (
    <section className="mt-5 space-y-5">
      <div className="grid gap-4 md:grid-cols-4">
        <OverviewMetric icon={<Users size={17} />} label="画像类型" value={dashboard.personaCount} note="三份画像报告整理口径" />
        <OverviewMetric icon={<BookOpenCheck size={17} />} label="覆盖学段" value={dashboard.stageCount} note="小学 / 初中 / 高中" />
        <OverviewMetric icon={<Home size={17} />} label="家长/决策" value={dashboard.parentCount} note="影响购买与付费判断" />
        <OverviewMetric icon={<School size={17} />} label="学生画像" value={dashboard.studentCount} note="影响使用和课程体验" />
      </div>

      <div className="grid gap-5 xl:grid-cols-[0.9fr_1.05fr_1.05fr]">
        <ChartPanel icon={<BarChart3 size={17} />} title="学段占比">
          <DonutChart rows={dashboard.stages} />
          <p className="mt-3 text-xs leading-5 text-[#777]">按画像类型计数，不代表真实用户人数占比。</p>
        </ChartPanel>
        <ChartPanel icon={<School size={17} />} title="小初高画像数量">
          <VerticalBarChart rows={dashboard.stages} />
          <p className="mt-3 text-xs leading-5 text-[#777]">用于快速比较哪个学段画像拆得更细、需求更分化。</p>
        </ChartPanel>
        <ChartPanel icon={<Target size={17} />} title="需求类型分布">
          <HorizontalBarChart rows={dashboard.demandTypes} />
          <p className="mt-3 text-xs leading-5 text-[#777]">把画像转成业务可读的需求入口。</p>
        </ChartPanel>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <BusinessExplanation title="为什么看家长" text="小学阶段的付费与坚持高度依赖家长理解价值，所以图表里单独保留家长/决策画像。" />
        <BusinessExplanation title="为什么看学生" text="初高中画像更多指向学生自己的使用效率、备考压力、题目解惑和情绪状态。" />
        <BusinessExplanation title="为什么不用项目库" text="本页先只呈现三份画像文件的结构，避免和小学物理、计算营、家庭包项目用户混在一起。" />
      </div>

      <div className="border border-[#dddcd5] bg-white px-5 py-3 text-xs leading-5 text-[#777]">
        数据来源：{source}
      </div>

      {groupedByStage.map(({ stage, rows }) => (
        <div key={stage} className="border border-[#dddcd5] bg-white">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#e5e4de] px-5 py-4">
            <div>
              <h2 className="text-lg font-bold text-[#252525]">{stage}画像</h2>
              <p className="mt-1 text-sm text-[#777]">{stageSummary(stage)}</p>
            </div>
            <span className="rounded bg-[#fff3ef] px-2.5 py-1 text-xs font-bold text-[#e65532]">{rows.length} 类画像</span>
          </div>
          <div className="grid gap-px bg-[#e5e4de] md:grid-cols-2 xl:grid-cols-3">
            {rows.map((row) => <PersonaPreviewCard key={row.persona.id} row={row} />)}
          </div>
        </div>
      ))}
    </section>
  );
}

function OverviewMetric({ icon, label, value, note }: { icon: React.ReactNode; label: string; value: number; note: string }) {
  return (
    <div className="border border-[#dddcd5] bg-white p-4">
      <div className="flex items-center gap-2 text-[#e65532]">{icon}<span className="text-xs font-bold">{label}</span></div>
      <div className="mt-2 text-3xl font-extrabold text-[#252525]">{value}</div>
      <p className="mt-1 text-xs text-[#777]">{note}</p>
    </div>
  );
}

function ChartPanel({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div className="min-w-0 border border-[#dddcd5] bg-white p-5">
      <div className="mb-4 flex items-center gap-2 text-[#e65532]">
        {icon}
        <h2 className="text-lg font-bold text-[#252525]">{title}</h2>
      </div>
      {children}
    </div>
  );
}

function DonutChart({ rows }: { rows: Array<{ name: string; count: number }> }) {
  const total = rows.reduce((sum, row) => sum + row.count, 0);
  return (
    <div className="h-[260px] min-w-0">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={rows} dataKey="count" nameKey="name" innerRadius={58} outerRadius={88} paddingAngle={3}>
            {rows.map((row, index) => <Cell key={row.name} fill={CHART_COLORS[index % CHART_COLORS.length]} />)}
          </Pie>
          <Tooltip formatter={(value: unknown, name: unknown) => [`${value} 类 / ${total ? Math.round((Number(value) / total) * 100) : 0}%`, String(name)]} />
        </PieChart>
      </ResponsiveContainer>
      <div className="-mt-7 flex flex-wrap justify-center gap-3">
        {rows.map((row, index) => (
          <span key={row.name} className="inline-flex items-center gap-1.5 text-xs text-[#666]">
            <i className="h-2.5 w-2.5 rounded-full" style={{ background: CHART_COLORS[index % CHART_COLORS.length] }} />
            {row.name} {row.count}
          </span>
        ))}
      </div>
    </div>
  );
}

function VerticalBarChart({ rows }: { rows: Array<{ name: string; count: number }> }) {
  return (
    <div className="h-[260px] min-w-0">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={rows} margin={{ top: 16, right: 12, left: -18, bottom: 4 }}>
          <CartesianGrid stroke="#eee9df" vertical={false} />
          <XAxis dataKey="name" tickLine={false} axisLine={false} />
          <YAxis allowDecimals={false} tickLine={false} axisLine={false} />
          <Tooltip formatter={(value: unknown) => [`${value} 类画像`, '数量']} />
          <Bar dataKey="count" radius={[6, 6, 0, 0]}>
            {rows.map((row, index) => <Cell key={row.name} fill={CHART_COLORS[index % CHART_COLORS.length]} />)}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

function HorizontalBarChart({ rows }: { rows: Array<{ name: string; count: number }> }) {
  return (
    <div className="h-[260px] min-w-0">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={rows} layout="vertical" margin={{ top: 6, right: 22, left: 24, bottom: 4 }}>
          <CartesianGrid stroke="#eee9df" horizontal={false} />
          <XAxis type="number" allowDecimals={false} tickLine={false} axisLine={false} />
          <YAxis type="category" dataKey="name" width={62} tickLine={false} axisLine={false} />
          <Tooltip formatter={(value: unknown) => [`${value} 类画像`, '数量']} />
          <Bar dataKey="count" radius={[0, 6, 6, 0]} fill="#e65532" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

function stageSummary(stage: PersonaStage) {
  if (stage === '小学') return '重点看兴趣、习惯、家长价值理解和付费不确定感。';
  if (stage === '初中') return '重点看错题解析、补弱巩固、中考复习和自律学习。';
  return '重点看住宿高压、习题解惑、提分方法和情绪支持。';
}

function BusinessExplanation({ title, text }: { title: string; text: string }) {
  return (
    <div className="border border-[#dddcd5] bg-white p-4">
      <div className="text-sm font-bold text-[#252525]">{title}</div>
      <p className="mt-2 text-sm leading-6 text-[#666]">{text}</p>
    </div>
  );
}

function PersonaPreviewCard({ row }: { row: PersonaSummary }) {
  return (
    <article className="flex min-h-[280px] flex-col bg-white p-4">
      <div className="mb-2 flex flex-wrap gap-1.5">
        <span className="rounded bg-[#fff3ef] px-2 py-0.5 text-[10px] font-bold text-[#e65532]">{row.stage}</span>
        <span className="rounded bg-[#f3f3ef] px-2 py-0.5 text-[10px] font-bold text-[#777]">{row.role}</span>
        <span className="rounded bg-[#eef5f2] px-2 py-0.5 text-[10px] font-bold text-[#4d8977]">{row.demandType}</span>
      </div>
      <h3 className="text-sm font-bold text-[#252525]">{row.persona.name}</h3>
      <p className="mt-2 line-clamp-3 text-xs leading-5 text-[#666]">{row.persona.definition}</p>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {row.tags.map((tag) => <span key={tag} className="rounded border border-[#e5e1d8] px-2 py-0.5 text-[10px] font-semibold text-[#776f65]">{tag}</span>)}
      </div>
      <div className="mt-3 grid gap-3 text-xs leading-5 text-[#555]">
        <div><b className="text-[#333]">核心需求：</b>{row.persona.coreNeeds.slice(0, 2).join('、')}</div>
        <div><b className="text-[#333]">典型行为：</b>{row.persona.typicalBehaviors.slice(0, 2).join('、')}</div>
      </div>
      {row.persona.quotes[0] && (
        <blockquote className="mt-auto border-l-2 border-[#e65532] bg-[#fafaf7] px-3 py-2 text-xs leading-5 text-[#555]">“{row.persona.quotes[0]}”</blockquote>
      )}
    </article>
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
