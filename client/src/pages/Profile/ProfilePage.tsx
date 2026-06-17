import React from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  BarChart3,
  BookOpenCheck,
  GitCompareArrows,
  Home,
  Layers,
  Pencil,
  Quote,
  Save,
  School,
  Target,
  Users,
} from 'lucide-react';
import { toast } from 'sonner';
import { useIsEditor } from '../../components/auth/PasswordGate';
import { useProjects } from '../../store/useProjectStore';
import { DEFAULT_PORTRAITS, PORTRAIT_FRAMEWORK } from '../../store/portraitDefaults';
import { fetchPortrait, savePortrait } from '../../api/research';
import type { PortraitData, PortraitPersona, PortraitSnapshot } from '../../types/research';

const dimensionFields: Array<{ key: keyof PortraitPersona; label: string }> = [
  { key: 'educationPhilosophy', label: '教育理念' },
  { key: 'investment', label: '投入程度' },
  { key: 'decisionStyle', label: '决策方式' },
];

type ProfileMode = 'overview' | 'portrait' | 'compare';
type PersonaRole = '家长' | '学生' | '家庭决策';
type PersonaStage = '小学' | '初中' | '高中' | '跨学段';

interface PersonaSummary {
  projectId: string;
  projectName: string;
  persona: PortraitPersona;
  role: PersonaRole;
  stage: PersonaStage;
  businessType: '转化决策' | '课程使用' | '家庭包决策' | '学习规划';
}

function fallbackSnapshot(projectId: string): PortraitSnapshot {
  return {
    projectId,
    data: DEFAULT_PORTRAITS[projectId] ?? {
      framework: PORTRAIT_FRAMEWORK,
      personas: [],
      source: '尚未录入可验证的研究资料',
      updatedBy: '编辑者',
    },
    version: 0,
    updatedAt: new Date(0).toISOString(),
  };
}

export default function ProfilePage() {
  const projects = useProjects();
  const editor = useIsEditor();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialProject = searchParams.get('projectId') ?? projects[0]?.id ?? 'default_project';
  const [projectId, setProjectId] = React.useState(initialProject);
  const [mode, setMode] = React.useState<ProfileMode>('overview');
  const [snapshots, setSnapshots] = React.useState<Record<string, PortraitSnapshot>>({});
  const [activePersonaId, setActivePersonaId] = React.useState('');
  const [draft, setDraft] = React.useState<PortraitData | null>(null);
  const [editing, setEditing] = React.useState(false);
  const [saving, setSaving] = React.useState(false);

  React.useEffect(() => {
    let cancelled = false;
    Promise.all(projects.map(async (project) => {
      const snapshot = await fetchPortrait(project.id).catch(() => null);
      return snapshot ?? fallbackSnapshot(project.id);
    })).then((rows) => {
      if (cancelled) return;
      setSnapshots(Object.fromEntries(rows.map((row) => [row.projectId, row])));
    });
    return () => { cancelled = true; };
  }, [projects]);

  const snapshot = snapshots[projectId] ?? fallbackSnapshot(projectId);
  const data = draft ?? snapshot.data;
  const activePersona = data.personas.find((persona) => persona.id === activePersonaId) ?? data.personas[0];
  const personaSummaries = React.useMemo(
    () => buildPersonaSummaries(projects, snapshots),
    [projects, snapshots],
  );
  const dashboard = React.useMemo(
    () => buildProfileDashboard(personaSummaries, projects.length),
    [personaSummaries, projects.length],
  );

  React.useEffect(() => {
    setActivePersonaId(snapshot.data.personas[0]?.id ?? '');
    setDraft(null);
    setEditing(false);
  }, [projectId, snapshot.projectId]);

  const selectProject = (next: string) => {
    setProjectId(next);
    setSearchParams({ projectId: next });
  };

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
      const saved = await savePortrait(projectId, draft, snapshot.version);
      setSnapshots((current) => ({ ...current, [projectId]: saved }));
      setDraft(null);
      setEditing(false);
      toast.success('项目画像已保存');
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
              <span className="text-xs font-bold">INSIGHTHUB GLOBAL</span>
            </div>
            <h1 className="mt-1 text-2xl font-bold text-[#252525]">用户画像</h1>
            <p className="mt-1 text-sm text-[#6f6f68]">统一画像框架，按研究项目独立维护版本。</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={projectId}
              onChange={(event) => selectProject(event.target.value)}
              className="h-9 min-w-52 rounded-md border border-[#d8d7d0] bg-white px-3 text-sm"
            >
              {projects.map((project) => <option key={project.id} value={project.id}>{project.name}</option>)}
            </select>
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
              <button
                onClick={() => setMode('compare')}
                className={`flex items-center gap-1.5 rounded px-3 text-xs font-semibold ${mode === 'compare' ? 'bg-[#252525] text-white' : 'text-[#666]'}`}
              >
                <GitCompareArrows size={13} />项目对比
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
          <ProfileOverview dashboard={dashboard} summaries={personaSummaries} />
        ) : mode === 'portrait' ? (
          <section className="mt-5 grid min-h-[560px] gap-4 lg:grid-cols-[260px_minmax(0,1fr)]">
            <aside className="border border-[#dddcd5] bg-white">
              <div className="border-b border-[#e5e4de] px-4 py-3 text-xs font-bold text-[#777]">画像类型</div>
              {data.personas.length ? data.personas.map((persona) => (
                <button
                  key={persona.id}
                  onClick={() => setActivePersonaId(persona.id)}
                  className={`block w-full border-b border-[#efeee9] px-4 py-3 text-left ${activePersona?.id === persona.id ? 'bg-[#fff3ef]' : 'hover:bg-[#fafaf7]'}`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-bold text-[#30302d]">{persona.name}</span>
                    <span className="text-[10px] text-[#a05a46]">{persona.distribution}</span>
                  </div>
                  <p className="mt-1 line-clamp-2 text-xs leading-5 text-[#777]">{persona.definition}</p>
                </button>
              )) : (
                <div className="px-4 py-10 text-center text-sm text-[#999]">该项目尚未建立画像</div>
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
                      <input value={activePersona.distribution} onChange={(e) => updatePersona({ distribution: e.target.value })} className="w-28 bg-transparent text-xs font-bold outline-none" />
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
                  <ListEditor
                    title="核心需求"
                    values={activePersona.coreNeeds}
                    editing={editing}
                    onChange={(coreNeeds) => updatePersona({ coreNeeds })}
                  />
                  <ListEditor
                    title="典型行为"
                    values={activePersona.typicalBehaviors}
                    editing={editing}
                    onChange={(typicalBehaviors) => updatePersona({ typicalBehaviors })}
                  />
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
        ) : (
          <ComparisonView projects={projects} snapshots={snapshots} />
        )}
      </div>
    </main>
  );
}

function inferPersonaRole(persona: PortraitPersona, projectName: string): PersonaRole {
  const text = `${persona.id} ${persona.name} ${persona.definition} ${persona.coreNeeds.join(' ')} ${projectName}`;
  if (/家庭包|家庭|多孩|二胎|多胎|家长|妈妈|爸爸/.test(text)) return '家庭决策';
  if (/学生|小学|初中|高中|中考|高三|住宿|备考|学霸/.test(text)) return '学生';
  return '家长';
}

function inferPersonaStage(persona: PortraitPersona): PersonaStage {
  const text = `${persona.id} ${persona.name} ${persona.definition}`;
  if (/跨学段|家庭包|多孩|二胎|多胎/.test(text)) return '跨学段';
  if (/高中|高一|高二|高三/.test(text)) return '高中';
  if (/初中|初一|初二|初三|中考/.test(text)) return '初中';
  if (/小学|小低|小高|一年级|二年级|三年级|四年级|五年级|六年级/.test(text)) return '小学';
  return '跨学段';
}

function inferBusinessType(summary: Pick<PersonaSummary, 'role' | 'stage'>, persona: PortraitPersona): PersonaSummary['businessType'] {
  const text = `${persona.name} ${persona.definition} ${persona.coreNeeds.join(' ')} ${persona.decisionStyle}`;
  if (summary.role === '家庭决策' || /家庭包|多孩|升单|续购|价格|付费|购买/.test(text)) return '家庭包决策';
  if (/付费|价格|转化|购买|续费|价值/.test(text)) return '转化决策';
  if (/课程|错题|练习|使用|预习|复习|动画|题型/.test(text)) return '课程使用';
  return '学习规划';
}

function buildPersonaSummaries(projects: ReturnType<typeof useProjects>, snapshots: Record<string, PortraitSnapshot>): PersonaSummary[] {
  return projects.flatMap((project) => {
    const snapshot = snapshots[project.id] ?? fallbackSnapshot(project.id);
    return snapshot.data.personas.map((persona) => {
      const role = inferPersonaRole(persona, project.name);
      const stage = inferPersonaStage(persona);
      return {
        projectId: project.id,
        projectName: project.name,
        persona,
        role,
        stage,
        businessType: inferBusinessType({ role, stage }, persona),
      };
    });
  });
}

function countSummaries<T extends string>(rows: PersonaSummary[], getKey: (row: PersonaSummary) => T) {
  const counts = new Map<T, number>();
  rows.forEach((row) => counts.set(getKey(row), (counts.get(getKey(row)) ?? 0) + 1));
  return [...counts.entries()].map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count);
}

function buildProfileDashboard(rows: PersonaSummary[], projectCount: number) {
  return {
    personaCount: rows.length,
    projectCount,
    parentCount: rows.filter((row) => row.role === '家长' || row.role === '家庭决策').length,
    studentCount: rows.filter((row) => row.role === '学生').length,
    stages: countSummaries(rows, (row) => row.stage),
    roles: countSummaries(rows, (row) => row.role),
    businessTypes: countSummaries(rows, (row) => row.businessType),
  };
}

function ProfileOverview({
  dashboard,
  summaries,
}: {
  dashboard: ReturnType<typeof buildProfileDashboard>;
  summaries: PersonaSummary[];
}) {
  const priorityPersonas = summaries.slice(0, 8);
  return (
    <section className="mt-5 space-y-5">
      <div className="grid gap-4 md:grid-cols-4">
        <OverviewMetric icon={<Users size={17} />} label="画像类型" value={dashboard.personaCount} note="覆盖现有研究人群" />
        <OverviewMetric icon={<BookOpenCheck size={17} />} label="覆盖项目" value={dashboard.projectCount} note="项目画像持续补充" />
        <OverviewMetric icon={<Home size={17} />} label="家长/家庭" value={dashboard.parentCount} note="影响购买和续费" />
        <OverviewMetric icon={<School size={17} />} label="学生画像" value={dashboard.studentCount} note="影响使用和课程体验" />
      </div>

      <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="border border-[#dddcd5] bg-white p-5">
          <div className="mb-4 flex items-center gap-2">
            <BarChart3 size={17} className="text-[#e65532]" />
            <h2 className="text-lg font-bold text-[#252525]">用户结构分布</h2>
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            <DistributionBlock title="按学段看" rows={dashboard.stages} helper="用于判断课程体验、转化率和使用场景是否按小初高分化。" />
            <DistributionBlock title="按角色看" rows={dashboard.roles} helper="家长决定购买，学生决定使用，家庭决策决定高客单价值。" />
          </div>
        </div>

        <div className="border border-[#dddcd5] bg-white p-5">
          <div className="mb-4 flex items-center gap-2">
            <Target size={17} className="text-[#e65532]" />
            <h2 className="text-lg font-bold text-[#252525]">业务判断入口</h2>
          </div>
          <div className="space-y-3">
            {dashboard.businessTypes.map((item) => (
              <div key={item.name} className="rounded-md bg-[#fafaf7] px-4 py-3">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm font-bold text-[#333]">{item.name}</span>
                  <span className="text-sm font-extrabold text-[#e65532]">{item.count}</span>
                </div>
                <p className="mt-1 text-xs leading-5 text-[#777]">{businessTypeExplanation(item.name)}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <BusinessExplanation
          title="为什么看家长"
          text="家长画像决定价格接受、信任来源和续费判断。购买决策页面里的顾虑，最终都要回到家长的确定性需求。"
        />
        <BusinessExplanation
          title="为什么看学生"
          text="学生画像决定产品是否真的被用起来。课程难度、动画理解、错题反馈和学习规划，都要按学生阶段拆开看。"
        />
        <BusinessExplanation
          title="为什么看结构变化"
          text="飞书讨论里提到的住宿/走读、多孩、学段占比，本质是解释业务波动的长期监测指标。当前先用现有画像做静态看板。"
        />
      </div>

      <div className="border border-[#dddcd5] bg-white">
        <div className="border-b border-[#e5e4de] px-5 py-4">
          <h2 className="text-lg font-bold text-[#252525]">重点人群速览</h2>
          <p className="mt-1 text-sm text-[#777]">先看人群是什么，再进入画像详情追核心需求和原声。</p>
        </div>
        <div className="grid gap-px bg-[#e5e4de] md:grid-cols-2 xl:grid-cols-4">
          {priorityPersonas.map((row) => (
            <PersonaPreviewCard key={`${row.projectId}-${row.persona.id}`} row={row} />
          ))}
        </div>
      </div>
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

function DistributionBlock({ title, rows, helper }: { title: string; rows: Array<{ name: string; count: number }>; helper: string }) {
  const total = rows.reduce((sum, row) => sum + row.count, 0);
  return (
    <section>
      <div className="mb-2 text-xs font-bold text-[#777]">{title}</div>
      <div className="space-y-2">
        {rows.map((row) => (
          <div key={row.name}>
            <div className="mb-1 flex items-center justify-between text-xs">
              <span className="font-bold text-[#333]">{row.name}</span>
              <span className="text-[#777]">{row.count}</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-[#efeee9]">
              <div className="h-full rounded-full bg-[#e65532]" style={{ width: `${total ? (row.count / total) * 100 : 0}%` }} />
            </div>
          </div>
        ))}
      </div>
      <p className="mt-3 text-xs leading-5 text-[#777]">{helper}</p>
    </section>
  );
}

function businessTypeExplanation(type: string) {
  if (type === '家庭包决策') return '关注多孩、长期规划、价格价值和购买确定性。';
  if (type === '转化决策') return '关注价格、效果验证、信任来源和付费门槛。';
  if (type === '课程使用') return '关注课程是否被真正使用、是否听懂、是否能持续。';
  return '关注学生如何安排学习、如何找到下一步提升路径。';
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
    <article className="bg-white p-4">
      <div className="mb-2 flex flex-wrap gap-1.5">
        <span className="rounded bg-[#fff3ef] px-2 py-0.5 text-[10px] font-bold text-[#e65532]">{row.stage}</span>
        <span className="rounded bg-[#f3f3ef] px-2 py-0.5 text-[10px] font-bold text-[#777]">{row.role}</span>
      </div>
      <h3 className="text-sm font-bold text-[#252525]">{row.persona.name}</h3>
      <p className="mt-2 line-clamp-3 text-xs leading-5 text-[#666]">{row.persona.definition}</p>
      <div className="mt-3 text-[11px] text-[#999]">{row.projectName}</div>
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

function ComparisonView({ projects, snapshots }: { projects: ReturnType<typeof useProjects>; snapshots: Record<string, PortraitSnapshot> }) {
  return (
    <section className="mt-5 grid gap-4 lg:grid-cols-2">
      {projects.map((project) => {
        const data = (snapshots[project.id] ?? fallbackSnapshot(project.id)).data;
        const rows = data.personas.map((persona) => {
          const role = inferPersonaRole(persona, project.name);
          const stage = inferPersonaStage(persona);
          return { persona, role, stage };
        });
        return (
          <article key={project.id} className="border border-[#dddcd5] bg-white">
            <header className="border-b border-[#e5e4de] px-5 py-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="text-base font-bold text-[#252525]">{project.name}</h2>
                  <p className="mt-1 text-xs leading-5 text-[#777]">{data.source}</p>
                </div>
                <span className="rounded bg-[#fff3ef] px-2 py-1 text-xs font-bold text-[#e65532]">{rows.length} 类画像</span>
              </div>
            </header>
            {rows.length ? (
              <div className="divide-y divide-[#efeee9]">
                {rows.map(({ persona, role, stage }) => (
                  <div key={persona.id} className="px-5 py-4">
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                      <span className="text-sm font-bold text-[#30302d]">{persona.name}</span>
                      <span className="rounded bg-[#f3f3ef] px-2 py-0.5 text-[10px] font-bold text-[#777]">{stage}</span>
                      <span className="rounded bg-[#f3f3ef] px-2 py-0.5 text-[10px] font-bold text-[#777]">{role}</span>
                    </div>
                    <p className="text-xs leading-5 text-[#666]">{persona.definition}</p>
                    <div className="mt-3 grid gap-3 md:grid-cols-2">
                      <div>
                        <div className="mb-1 text-[10px] font-bold text-[#999]">核心需求</div>
                        <p className="text-xs leading-5 text-[#555]">{persona.coreNeeds.join('、') || '待补充'}</p>
                      </div>
                      <div>
                        <div className="mb-1 text-[10px] font-bold text-[#999]">典型行为</div>
                        <p className="text-xs leading-5 text-[#555]">{persona.typicalBehaviors.join('、') || '待补充'}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="px-5 py-10 text-center text-sm text-[#999]">尚未建立项目画像</div>
            )}
          </article>
        );
      })}
    </section>
  );
}
