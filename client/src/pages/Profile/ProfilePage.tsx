import React from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  BarChart3,
  BookOpenCheck,
  GitCompareArrows,
  Pencil,
  Quote,
  Save,
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
  const [mode, setMode] = React.useState<'portrait' | 'compare'>('portrait');
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
                onClick={() => setMode('portrait')}
                className={`flex items-center gap-1.5 rounded px-3 text-xs font-semibold ${mode === 'portrait' ? 'bg-[#252525] text-white' : 'text-[#666]'}`}
              >
                <BookOpenCheck size={13} />项目画像
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

        {mode === 'portrait' ? (
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
    <section className="mt-5 overflow-x-auto border border-[#dddcd5] bg-white">
      <table className="w-full min-w-[900px] border-collapse text-left">
        <thead>
          <tr className="border-b border-[#dddcd5] bg-[#f3f3ef]">
            <th className="w-40 px-4 py-3 text-xs text-[#777]">项目</th>
            <th className="px-4 py-3 text-xs text-[#777]">画像类型</th>
            <th className="px-4 py-3 text-xs text-[#777]">核心需求</th>
            <th className="px-4 py-3 text-xs text-[#777]">典型行为</th>
            <th className="px-4 py-3 text-xs text-[#777]">数据来源</th>
          </tr>
        </thead>
        <tbody>
          {projects.flatMap((project) => {
            const data = (snapshots[project.id] ?? fallbackSnapshot(project.id)).data;
            if (!data.personas.length) {
              return [<tr key={project.id} className="border-b border-[#ecebe6]"><td className="px-4 py-4 text-sm font-bold">{project.name}</td><td colSpan={4} className="px-4 py-4 text-sm text-[#999]">尚未建立项目画像</td></tr>];
            }
            return data.personas.map((persona, index) => (
              <tr key={`${project.id}-${persona.id}`} className="border-b border-[#ecebe6] align-top">
                <td className="px-4 py-4 text-sm font-bold">{index === 0 ? project.name : ''}</td>
                <td className="px-4 py-4"><div className="text-sm font-bold">{persona.name}</div><div className="mt-1 text-xs leading-5 text-[#777]">{persona.definition}</div></td>
                <td className="px-4 py-4 text-xs leading-6 text-[#555]">{persona.coreNeeds.join('、')}</td>
                <td className="px-4 py-4 text-xs leading-6 text-[#555]">{persona.typicalBehaviors.join('、')}</td>
                <td className="max-w-64 px-4 py-4 text-xs leading-5 text-[#777]">{index === 0 ? data.source : ''}</td>
              </tr>
            ));
          })}
        </tbody>
      </table>
    </section>
  );
}
