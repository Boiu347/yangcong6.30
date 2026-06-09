import React from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  AlertTriangle,
  Building2,
  Clock3,
  History,
  Plus,
  RefreshCw,
  Search,
  UsersRound,
  X,
} from 'lucide-react';
import { toast } from 'sonner';
import { useIsEditor } from '../../components/auth/PasswordGate';
import { useProjects } from '../../store/useProjectStore';
import {
  createResearchUser,
  fetchUserHistory,
  fetchUsers,
  updateResearchUser,
} from '../../api/research';
import type {
  ResearchChild,
  ResearchUser,
  ResearchUserData,
  UserHistoryEntry,
} from '../../types/research';

const emptyChild = (): ResearchChild => ({
  id: crypto.randomUUID(),
  birthOrder: 1,
  grade: '',
  schoolingMode: 'unknown',
  schoolType: 'unknown',
});

const emptyData = (): ResearchUserData => ({
  region: '',
  guardianRole: '',
  children: [emptyChild()],
  source: '',
  notes: '',
});

export default function UsersPage() {
  const projects = useProjects();
  const editor = useIsEditor();
  const [searchParams, setSearchParams] = useSearchParams();
  const [projectId, setProjectId] = React.useState(searchParams.get('projectId') ?? projects[0]?.id ?? 'default_project');
  const [users, setUsers] = React.useState<ResearchUser[]>([]);
  const [selectedId, setSelectedId] = React.useState('');
  const [history, setHistory] = React.useState<UserHistoryEntry[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [lastUpdated, setLastUpdated] = React.useState<Date | null>(null);
  const [query, setQuery] = React.useState('');
  const [multiChild, setMultiChild] = React.useState('all');
  const [grade, setGrade] = React.useState('all');
  const [schooling, setSchooling] = React.useState('all');
  const [completeness, setCompleteness] = React.useState('all');
  const [editing, setEditing] = React.useState<ResearchUser | 'new' | null>(null);
  const [draft, setDraft] = React.useState<ResearchUserData | null>(null);
  const [remoteChanged, setRemoteChanged] = React.useState(false);
  const [saving, setSaving] = React.useState(false);

  const load = React.useCallback(async (quiet = false) => {
    if (!quiet) setLoading(true);
    try {
      const rows = await fetchUsers(projectId);
      setUsers((current) => {
        if (editing && editing !== 'new') {
          const remote = rows.find((row) => row.id === editing.id);
          if (remote && remote.version !== editing.version) setRemoteChanged(true);
        }
        return rows;
      });
      setLastUpdated(new Date());
      setSelectedId((current) => current || rows[0]?.id || '');
    } catch (error) {
      if (!quiet) toast.error(error instanceof Error ? error.message : '用户数据加载失败');
    } finally {
      if (!quiet) setLoading(false);
    }
  }, [projectId, editing]);

  React.useEffect(() => {
    void load();
    const timer = window.setInterval(() => void load(true), 20_000);
    return () => window.clearInterval(timer);
  }, [load]);

  React.useEffect(() => {
    if (!selectedId) {
      setHistory([]);
      return;
    }
    void fetchUserHistory(selectedId).then(setHistory).catch(() => setHistory([]));
  }, [selectedId, users]);

  const selected = users.find((user) => user.id === selectedId);
  const grades = Array.from(new Set(users.flatMap((user) => user.data.children.map((child) => child.grade)).filter(Boolean)));
  const filtered = users.filter((user) => {
    const haystack = [user.code, user.data.region, user.data.guardianRole, user.data.source, user.data.notes].join(' ').toLowerCase();
    if (query && !haystack.includes(query.toLowerCase())) return false;
    if (multiChild === 'yes' && user.data.children.length < 2) return false;
    if (multiChild === 'no' && user.data.children.length !== 1) return false;
    if (grade !== 'all' && !user.data.children.some((child) => child.grade === grade)) return false;
    if (schooling !== 'all' && !user.data.children.some((child) => child.schoolingMode === schooling)) return false;
    if (completeness === 'complete' && user.completeness < 100) return false;
    if (completeness === 'incomplete' && user.completeness === 100) return false;
    return true;
  });

  const changeProject = (next: string) => {
    setProjectId(next);
    setSearchParams({ projectId: next });
    setSelectedId('');
    setEditing(null);
  };

  const openCreate = () => {
    setEditing('new');
    setDraft(emptyData());
    setRemoteChanged(false);
  };

  const openEdit = (user: ResearchUser) => {
    setEditing(user);
    setDraft(structuredClone(user.data));
    setRemoteChanged(false);
  };

  const closeEditor = () => {
    setEditing(null);
    setDraft(null);
    setRemoteChanged(false);
  };

  const save = async () => {
    if (!draft || !editing) return;
    setSaving(true);
    try {
      const saved = editing === 'new'
        ? await createResearchUser(projectId, draft)
        : await updateResearchUser(editing.id, draft, editing.version);
      closeEditor();
      await load(true);
      setSelectedId(saved.id);
      toast.success(editing === 'new' ? '匿名用户已创建' : '用户资料已更新');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : '保存失败');
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="flex flex-1 min-h-0 flex-col bg-[#f8f8f5]">
      <header className="flex flex-wrap items-end justify-between gap-4 border-b border-[#dddcd5] bg-white px-5 py-4">
        <div>
          <div className="flex items-center gap-2 text-[#e65532]"><UsersRound size={17} /><span className="text-xs font-bold">ANONYMOUS RESEARCH PANEL</span></div>
          <h1 className="mt-1 text-2xl font-bold text-[#252525]">用户库</h1>
          <p className="mt-1 text-sm text-[#777]">家庭与孩子信息按项目隔离，不进行跨项目身份合并。</p>
        </div>
        <div className="flex items-center gap-2">
          <select value={projectId} onChange={(e) => changeProject(e.target.value)} className="h-9 min-w-52 rounded-md border border-[#d8d7d0] bg-white px-3 text-sm">
            {projects.map((project) => <option key={project.id} value={project.id}>{project.name}</option>)}
          </select>
          <button title="立即刷新" onClick={() => void load()} className="flex h-9 w-9 items-center justify-center rounded-md border border-[#d8d7d0] bg-white"><RefreshCw size={15} /></button>
          {editor && <button onClick={openCreate} className="flex h-9 items-center gap-1.5 rounded-md bg-[#e65532] px-3 text-xs font-bold text-white"><Plus size={14} />新增用户</button>}
        </div>
      </header>

      <div className="flex flex-wrap items-center gap-2 border-b border-[#dddcd5] bg-[#fafaf7] px-5 py-3">
        <div className="relative min-w-56 flex-1 max-w-sm">
          <Search size={14} className="absolute left-3 top-2.5 text-[#999]" />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="搜索编号、地区、来源或备注" className="h-9 w-full rounded-md border border-[#d8d7d0] bg-white pl-9 pr-3 text-sm" />
        </div>
        <Filter value={multiChild} onChange={setMultiChild} label="孩子数量" options={[['all', '全部'], ['yes', '多孩'], ['no', '单孩']]} />
        <Filter value={grade} onChange={setGrade} label="年级" options={[['all', '全部年级'], ...grades.map((item) => [item, item] as [string, string])]} />
        <Filter value={schooling} onChange={setSchooling} label="住宿" options={[['all', '全部'], ['day', '走读'], ['boarding', '住宿'], ['unknown', '未填写']]} />
        <Filter value={completeness} onChange={setCompleteness} label="完整度" options={[['all', '全部'], ['complete', '完整'], ['incomplete', '待补充']]} />
        <span className="ml-auto flex items-center gap-1 text-[11px] text-[#999]"><Clock3 size={11} />20 秒自动刷新{lastUpdated ? ` · ${lastUpdated.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}` : ''}</span>
      </div>

      <div className="grid min-h-0 flex-1 lg:grid-cols-[minmax(620px,1.4fr)_minmax(360px,.8fr)]">
        <section className="min-h-0 overflow-auto border-r border-[#dddcd5] bg-white">
          <table className="w-full min-w-[760px] border-collapse text-left">
            <thead className="sticky top-0 z-10 bg-[#f3f3ef]">
              <tr className="border-b border-[#dddcd5] text-[11px] text-[#777]">
                <th className="px-4 py-3">匿名编号</th><th className="px-4 py-3">地区 / 家长</th><th className="px-4 py-3">孩子结构</th><th className="px-4 py-3">走读 / 住宿</th><th className="px-4 py-3">完整度</th><th className="px-4 py-3">最近更新</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((user) => (
                <tr key={user.id} onClick={() => setSelectedId(user.id)} className={`cursor-pointer border-b border-[#ecebe6] text-sm ${selectedId === user.id ? 'bg-[#fff3ef]' : 'hover:bg-[#fafaf7]'}`}>
                  <td className="px-4 py-3 font-bold text-[#333]">{user.code}</td>
                  <td className="px-4 py-3"><div>{user.data.region || '未填写'}</div><div className="mt-1 text-xs text-[#888]">{user.data.guardianRole || '家长角色未填写'}</div></td>
                  <td className="px-4 py-3"><div>{user.data.children.length} 个孩子</div><div className="mt-1 text-xs text-[#888]">{user.data.children.map((child) => child.grade || '年级未填').join('、')}</div></td>
                  <td className="px-4 py-3 text-xs text-[#666]">{Array.from(new Set(user.data.children.map((child) => modeLabel(child.schoolingMode)))).join('、')}</td>
                  <td className="px-4 py-3"><div className="h-1.5 w-20 bg-[#e7e6df]"><div className="h-full bg-[#37a87a]" style={{ width: `${user.completeness}%` }} /></div><span className="mt-1 block text-[10px] text-[#888]">{user.completeness}%</span></td>
                  <td className="px-4 py-3 text-xs text-[#777]">{new Date(user.updatedAt).toLocaleDateString('zh-CN')}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {!loading && !filtered.length && <div className="px-6 py-20 text-center text-sm text-[#999]">{users.length ? '没有符合筛选条件的记录' : '该项目还没有用户明细。只从可核验资料录入，不由汇总结论反推个人。'}</div>}
          {loading && <div className="px-6 py-20 text-center text-sm text-[#999]">正在读取用户库…</div>}
        </section>

        <aside className="min-h-0 overflow-auto bg-[#fafaf7]">
          {selected ? (
            <>
              <div className="border-b border-[#dddcd5] bg-white p-5">
                <div className="flex items-start justify-between gap-3">
                  <div><div className="text-xs font-bold text-[#e65532]">匿名家庭</div><h2 className="mt-1 text-xl font-bold">{selected.code}</h2></div>
                  {editor && <button onClick={() => openEdit(selected)} className="rounded-md border border-[#d8d7d0] px-3 py-2 text-xs font-bold">编辑资料</button>}
                </div>
                <dl className="mt-5 grid grid-cols-2 gap-4 text-sm">
                  <Info label="地区" value={selected.data.region} />
                  <Info label="家长角色" value={selected.data.guardianRole} />
                  <Info label="数据来源" value={selected.data.source} />
                  <Info label="资料完整度" value={`${selected.completeness}%`} />
                </dl>
              </div>
              <div className="border-b border-[#dddcd5] p-5">
                <h3 className="flex items-center gap-2 text-sm font-bold"><Building2 size={15} />孩子信息</h3>
                <div className="mt-3 space-y-2">
                  {selected.data.children.map((child) => (
                    <div key={child.id} className="grid grid-cols-2 gap-3 border border-[#dddcd5] bg-white p-3 text-xs">
                      <Info label="排行" value={`第 ${child.birthOrder} 个孩子`} />
                      <Info label="年级" value={child.grade} />
                      <Info label="就读方式" value={modeLabel(child.schoolingMode)} />
                      <Info label="学校类型" value={schoolLabel(child.schoolType)} />
                    </div>
                  ))}
                </div>
                {selected.data.notes && <div className="mt-4 text-xs leading-6 text-[#666]"><span className="font-bold text-[#444]">备注：</span>{selected.data.notes}</div>}
              </div>
              <div className="p-5">
                <h3 className="flex items-center gap-2 text-sm font-bold"><History size={15} />更新历史</h3>
                <div className="mt-3 space-y-3">
                  {history.map((entry) => (
                    <div key={entry.id} className="border-l-2 border-[#cbc9c0] pl-3">
                      <div className="text-[11px] text-[#888]">{entry.updatedBy} · {new Date(entry.createdAt).toLocaleString('zh-CN')}</div>
                      {entry.changes.map((change) => <div key={change.field} className="mt-1 text-xs leading-5 text-[#555]"><b>{change.label}</b>：{change.before} → {change.after}</div>)}
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : <div className="px-6 py-20 text-center text-sm text-[#999]">从左侧选择一条用户记录</div>}
        </aside>
      </div>

      {editing && draft && (
        <UserEditor
          title={editing === 'new' ? '新增匿名用户' : `编辑 ${editing.code}`}
          draft={draft}
          setDraft={setDraft}
          saving={saving}
          remoteChanged={remoteChanged}
          onClose={closeEditor}
          onSave={save}
        />
      )}
    </main>
  );
}

function Filter({ value, onChange, label, options }: { value: string; onChange: (value: string) => void; label: string; options: [string, string][] }) {
  return <label className="flex items-center gap-1 text-[11px] text-[#888]">{label}<select value={value} onChange={(e) => onChange(e.target.value)} className="h-9 rounded-md border border-[#d8d7d0] bg-white px-2 text-xs text-[#444]">{options.map(([key, text]) => <option key={key} value={key}>{text}</option>)}</select></label>;
}

function Info({ label, value }: { label: string; value?: string }) {
  return <div><dt className="text-[10px] font-bold text-[#999]">{label}</dt><dd className="mt-1 text-xs leading-5 text-[#444]">{value || '未填写'}</dd></div>;
}

function modeLabel(value: ResearchChild['schoolingMode']) {
  return value === 'day' ? '走读' : value === 'boarding' ? '住宿' : '未填写';
}

function schoolLabel(value: ResearchChild['schoolType']) {
  return value === 'public' ? '公立' : value === 'private' ? '民办' : value === 'international' ? '国际学校' : '未填写';
}

function UserEditor({ title, draft, setDraft, saving, remoteChanged, onClose, onSave }: {
  title: string;
  draft: ResearchUserData;
  setDraft: React.Dispatch<React.SetStateAction<ResearchUserData | null>>;
  saving: boolean;
  remoteChanged: boolean;
  onClose: () => void;
  onSave: () => void;
}) {
  const patch = (next: Partial<ResearchUserData>) => setDraft((current) => current ? { ...current, ...next } : current);
  const patchChild = (id: string, next: Partial<ResearchChild>) => patch({ children: draft.children.map((child) => child.id === id ? { ...child, ...next } : child) });
  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/25" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="flex h-full w-full max-w-[620px] flex-col bg-[#fafaf7] shadow-xl">
        <header className="flex h-14 items-center justify-between border-b border-[#dddcd5] bg-white px-5">
          <h2 className="text-base font-bold">{title}</h2>
          <button title="关闭" onClick={onClose}><X size={18} /></button>
        </header>
        {remoteChanged && <div className="flex items-center gap-2 border-b border-amber-200 bg-amber-50 px-5 py-3 text-xs text-amber-800"><AlertTriangle size={14} />远端记录已有新版本。当前草稿未被覆盖，建议取消后刷新再编辑。</div>}
        <div className="min-h-0 flex-1 space-y-5 overflow-auto p-5">
          <section className="grid gap-4 border border-[#dddcd5] bg-white p-4 sm:grid-cols-2">
            <Field label="地区"><input value={draft.region} onChange={(e) => patch({ region: e.target.value })} placeholder="如：北京 / 海淀" className="field-input" /></Field>
            <Field label="家长角色"><input value={draft.guardianRole} onChange={(e) => patch({ guardianRole: e.target.value })} placeholder="如：母亲、父亲" className="field-input" /></Field>
            <Field label="数据来源"><input value={draft.source} onChange={(e) => patch({ source: e.target.value })} placeholder="访谈、问卷或运营记录" className="field-input" /></Field>
            <Field label="孩子数量"><div className="flex h-9 items-center text-sm font-bold">{draft.children.length} 个</div></Field>
          </section>
          <section>
            <div className="mb-2 flex items-center justify-between"><h3 className="text-sm font-bold">孩子信息</h3><button onClick={() => patch({ children: [...draft.children, { ...emptyChild(), birthOrder: draft.children.length + 1 }] })} className="flex items-center gap-1 text-xs font-bold text-[#e65532]"><Plus size={13} />添加孩子</button></div>
            <div className="space-y-3">
              {draft.children.map((child, index) => (
                <div key={child.id} className="border border-[#dddcd5] bg-white p-4">
                  <div className="mb-3 flex items-center justify-between"><span className="text-xs font-bold">孩子 {index + 1}</span>{draft.children.length > 1 && <button onClick={() => patch({ children: draft.children.filter((item) => item.id !== child.id) })} className="text-xs text-[#b34c3a]">移除</button>}</div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="排行"><input type="number" min={1} value={child.birthOrder} onChange={(e) => patchChild(child.id, { birthOrder: Number(e.target.value) })} className="field-input" /></Field>
                    <Field label="年级"><input value={child.grade} onChange={(e) => patchChild(child.id, { grade: e.target.value })} placeholder="如：四年级" className="field-input" /></Field>
                    <Field label="走读 / 住宿"><select value={child.schoolingMode} onChange={(e) => patchChild(child.id, { schoolingMode: e.target.value as ResearchChild['schoolingMode'] })} className="field-input"><option value="unknown">未填写</option><option value="day">走读</option><option value="boarding">住宿</option></select></Field>
                    <Field label="学校类型"><select value={child.schoolType} onChange={(e) => patchChild(child.id, { schoolType: e.target.value as ResearchChild['schoolType'] })} className="field-input"><option value="unknown">未填写</option><option value="public">公立</option><option value="private">民办</option><option value="international">国际学校</option></select></Field>
                  </div>
                </div>
              ))}
            </div>
          </section>
          <Field label="备注"><textarea value={draft.notes} onChange={(e) => patch({ notes: e.target.value })} className="min-h-28 w-full rounded-md border border-[#d8d7d0] p-3 text-sm" placeholder="只记录研究必要信息，不填写姓名、手机号或照片。" /></Field>
        </div>
        <footer className="flex items-center justify-end gap-2 border-t border-[#dddcd5] bg-white px-5 py-3">
          <button onClick={onClose} className="h-9 rounded-md border border-[#d8d7d0] px-4 text-xs font-bold">取消</button>
          <button disabled={saving || remoteChanged} onClick={onSave} className="h-9 rounded-md bg-[#e65532] px-4 text-xs font-bold text-white disabled:opacity-50">{saving ? '保存中' : '保存更新'}</button>
        </footer>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="block"><span className="mb-1.5 block text-[11px] font-bold text-[#777]">{label}</span>{children}</label>;
}
