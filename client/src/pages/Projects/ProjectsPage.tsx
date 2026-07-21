import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, FolderOpen, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { projectActions, useProjects } from '../../store/useProjectStore';
import { cn } from '@/lib/utils';
import type { Project } from '../../types/voc';

const METHOD_COLOR: Record<string, string> = {
  桌面研究: 'border-slate-200 bg-slate-50 text-slate-600',
  定量调研: 'border-blue-200 bg-blue-50 text-blue-700',
  定性调研: 'border-teal-200 bg-teal-50 text-teal-700',
};

const CATEGORY_COLOR: Record<string, string> = {
  新课定位: 'border-orange-200 bg-orange-50 text-orange-600',
  购买决策调研: 'border-rose-200 bg-rose-50 text-rose-700',
  用户画像: 'border-teal-200 bg-teal-50 text-teal-700',
  产品功能: 'border-blue-200 bg-blue-50 text-blue-700',
  用户体验: 'border-amber-200 bg-amber-50 text-amber-700',
};

const STATUS_CONFIG: Record<string, { className: string; dot: string }> = {
  已完成: { className: 'border-emerald-200 bg-emerald-50 text-emerald-700', dot: 'bg-emerald-500' },
  进行中: { className: 'border-blue-200 bg-blue-50 text-blue-700', dot: 'bg-blue-500' },
  部分完成: { className: 'border-amber-200 bg-amber-50 text-amber-700', dot: 'bg-amber-500' },
  施工中: { className: 'border-amber-200 bg-amber-50 text-amber-700', dot: 'bg-amber-500' },
  待验收: { className: 'border-sky-200 bg-sky-50 text-sky-700', dot: 'bg-sky-500' },
};

const PROJECT_COPY: Record<string, { summary: string; takeaway: string; source: string }> = {
  default_project: {
    summary: '围绕“从小学物理”新课定位，判断低龄家庭到底买的是兴趣启蒙、学科启蒙，还是小初衔接。',
    takeaway: '核心不是卖“提前学物理”，而是把“孩子喜欢看”和“未来有用”的学科启蒙路径讲清楚。',
    source: '调研背景 / 研究结论 / 用户画像 / 竞品分析 / 营销落地',
  },
  jisuanying_project: {
    summary: '从计算能力、付费意愿和续费判断出发，评估计算营的定位、商业模型和增长抓手。',
    takeaway: '重点是识别谁真的需要计算训练，以及训练效果如何被家长感知并转化为续费理由。',
    source: '定量问卷 / 行业研究 / 策略分析',
  },
  jiatingbao_project: {
    summary: '围绕 6 年多孩家庭包，拆解已购、未购、续购、升单家庭的购买动机和顾虑。',
    takeaway: '家庭包不是单个卖点打动，而是“长期价值、风险消解、家庭场景”共同促成决策。',
    source: '调研背景 / 研究结论 / 典型家庭故事',
  },
  paisou_project: {
    summary: '围绕 AI 拍题 4.0，从真实使用场景、竞品生态、定量验证和营销表达判断产品机会。',
    takeaway: '拍搜不只是给答案，差异化应落在“讲得懂、可迁移、能提分”的校内提分型入口。',
    source: '桌面研究 / 定性调研 / 定量调研',
  },
};

function projectCopy(project: Project) {
  if (PROJECT_COPY[project.id]) return PROJECT_COPY[project.id];
  const methods = project.methods?.join('、') || '研究资料';
  return {
    summary: `围绕「${project.name}」沉淀 ${methods} 资料，支持业务方快速判断项目价值和下一步动作。`,
    takeaway: project.summaryData?.coreFindings?.[0] ?? '进入项目查看完整结论、用户原声和支撑材料。',
    source: methods,
  };
}

function displayStatus(status?: string, projectId?: string) {
  // 从小学物理项目已进入待验收阶段
  if (projectId === 'default_project') return '待验收';
  if (!status) return undefined;
  if (status === '已完成' || status === '进行中' || status === '部分完成') return '施工中';
  return status;
}

function projectEntryPath(projectId: string) {
  if (projectId === 'paisou_project') return 'qualitative';
  if (projectId === 'jiatingbao_project') return 'background';
  return 'summary';
}

function Pill({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={cn('inline-flex items-center rounded-full border px-2.5 py-1 text-[12px] font-bold', className)}>
      {children}
    </span>
  );
}

export default function ProjectsPage() {
  const projects = useProjects();
  const navigate = useNavigate();
  const [creating, setCreating] = React.useState(false);
  const [newName, setNewName] = React.useState('');
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (creating) inputRef.current?.focus();
  }, [creating]);

  const handleCreate = () => {
    const name = newName.trim();
    if (!name) {
      toast.error('请输入项目名称');
      return;
    }
    const project = projectActions.create(name);
    setNewName('');
    setCreating(false);
    navigate(`/projects/${project.id}/summary`);
  };

  const handleDelete = (id: string, name: string, event: React.MouseEvent) => {
    event.stopPropagation();
    if (!confirm(`确认删除「${name}」？该项目所有数据将被清除。`)) return;
    projectActions.delete(id);
    toast.success('项目已删除');
  };

  return (
    <main className="min-h-0 flex-1 overflow-y-auto bg-[#f5f3ee]">
      <div className="mx-auto w-full max-w-6xl px-5 py-7">
        <section className="mb-6">
          <div className="mb-2 text-[12px] font-black uppercase tracking-[0.18em] text-[#e65532]">
            Research Library
          </div>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h1 className="text-[34px] font-black leading-tight tracking-tight text-[#191816]">
                项目库
              </h1>
              <p className="mt-2 max-w-2xl text-[14px] leading-relaxed text-[#6f6a61]">
                先用业务判断理解项目，再进入项目查看完整报告、访谈原声和证据材料。
              </p>
            </div>
            <button
              onClick={() => setCreating(true)}
              className="inline-flex items-center gap-2 rounded-xl bg-[#e65532] px-4 py-2.5 text-[13px] font-bold text-white shadow-sm transition hover:bg-[#d64b2a]"
            >
              <Plus size={15} />
              新建研究项目
            </button>
          </div>
        </section>

        <section className="space-y-4">
          {projects.map((project) => {
            const readyFiles = project.files.filter((file) => file.status === 'ready').length;
            const vocCount = project.files
              .filter((file) => file.status === 'ready')
              .reduce((sum, file) => sum + file.vocList.length, 0);
            const copy = projectCopy(project);
            const statusLabel = displayStatus(project.status, project.id);
            const status = statusLabel ? STATUS_CONFIG[statusLabel] : undefined;

            return (
              <button
                key={project.id}
                onClick={() => navigate(`/projects/${project.id}/${projectEntryPath(project.id)}`)}
                className="group w-full rounded-2xl border border-[#e1dbd1] bg-white px-5 py-5 text-left shadow-[0_10px_26px_rgba(43,34,24,0.05)] transition hover:-translate-y-0.5 hover:border-[#e65532]/50 hover:shadow-[0_18px_44px_rgba(43,34,24,0.10)]"
              >
                <div className="flex gap-5">
                  <div className="min-w-0 flex-1">
                    <div className="mb-3 flex flex-wrap items-center gap-2">
                      {project.category && (
                        <Pill className={CATEGORY_COLOR[project.category] ?? 'border-gray-200 bg-gray-50 text-gray-600'}>
                          {project.category}
                        </Pill>
                      )}
                      {project.methods?.map((method) => (
                        <Pill key={method} className={METHOD_COLOR[method] ?? 'border-gray-200 bg-gray-50 text-gray-600'}>
                          {method}
                        </Pill>
                      ))}
                      {status && (
                        <Pill className={status.className}>
                          <span className={cn('mr-1.5 h-1.5 w-1.5 rounded-full', status.dot)} />
                          {statusLabel}
                        </Pill>
                      )}
                    </div>

                    <h2 className="text-[21px] font-black leading-snug tracking-tight text-[#191816]">
                      {project.name}
                    </h2>
                    <p className="mt-2 max-w-4xl text-[14px] leading-relaxed text-[#66605a]">
                      {copy.summary}
                    </p>
                    <p className="mt-3 max-w-4xl text-[14px] font-bold leading-relaxed text-[#2b2926]">
                      {copy.takeaway}
                    </p>

                    <div className="mt-5 flex flex-wrap items-center gap-3">
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-[#eee4d8] bg-[#fbf8f2] px-3 py-1.5 text-[12px] font-semibold text-[#756d64]">
                        <FolderOpen size={13} />
                        {copy.source}
                      </span>
                      {project.quarter && (
                        <span className="rounded-full border border-[#eee4d8] bg-[#fbf8f2] px-3 py-1.5 text-[12px] font-semibold text-[#756d64]">
                          {project.quarter}
                        </span>
                      )}
                      <span className="rounded-full border border-[#eee4d8] bg-[#fbf8f2] px-3 py-1.5 text-[12px] font-semibold text-[#756d64]">
                        {readyFiles > 0 ? `${readyFiles} 个文件` : '暂无文件'}
                      </span>
                      {project.id !== 'jisuanying_project' && readyFiles > 0 && (
                        <span className="rounded-full border border-[#eee4d8] bg-[#fbf8f2] px-3 py-1.5 text-[12px] font-semibold text-[#756d64]">
                          {vocCount} 条原声
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="hidden w-px shrink-0 bg-[#eee7dd] md:block" />

                  <div className="flex shrink-0 flex-col items-end justify-between gap-4">
                    <div className="text-right text-[12px] font-semibold text-[#8a8176]">
                      点击查看完整项目
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="rounded-full border border-[#e8ded2] bg-[#fbf8f2] px-3 py-2 text-[12px] font-bold text-[#6d655b] transition group-hover:border-[#e65532]/40 group-hover:text-[#e65532]">
                        进入项目
                      </span>
                      <ArrowRight size={17} className="text-[#b8afa5] transition group-hover:text-[#e65532]" />
                    </div>
                    <button
                      onClick={(event) => handleDelete(project.id, project.name, event)}
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-[#c8c0b6] opacity-0 transition hover:bg-red-50 hover:text-red-500 group-hover:opacity-100"
                      aria-label={`删除${project.name}`}
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              </button>
            );
          })}

          {creating && (
            <div className="rounded-2xl border-2 border-[#e65532] bg-white p-5 shadow-[0_12px_30px_rgba(43,34,24,0.08)]">
              <input
                ref={inputRef}
                value={newName}
                onChange={(event) => setNewName(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') handleCreate();
                  if (event.key === 'Escape') {
                    setCreating(false);
                    setNewName('');
                  }
                }}
                placeholder="输入项目名称，例如：K12物理品牌调研2026Q2"
                className="mb-4 w-full border-0 text-[16px] font-bold text-gray-900 outline-none placeholder:text-gray-300"
              />
              <div className="flex gap-2">
                <button
                  onClick={handleCreate}
                  className="rounded-xl bg-[#e65532] px-4 py-2 text-[13px] font-bold text-white transition hover:bg-[#d64b2a]"
                >
                  创建项目
                </button>
                <button
                  onClick={() => {
                    setCreating(false);
                    setNewName('');
                  }}
                  className="rounded-xl px-4 py-2 text-[13px] font-bold text-gray-500 transition hover:bg-gray-50"
                >
                  取消
                </button>
              </div>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
