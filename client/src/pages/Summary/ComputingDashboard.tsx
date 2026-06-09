import React from 'react';
import { ArrowRight, CheckCircle2, Database, FileClock, UsersRound } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { fetchUsers } from '../../api/research';
import { DEFAULT_PORTRAITS } from '../../store/portraitDefaults';
import type { ResearchUser } from '../../types/research';

const conclusions = [
  '用户需求不能只按“补差 / 提前学”划分，还要同时观察目标、基础与家长投入方式。',
  '购买决策依赖诊断可信度、师资与服务可见性；只强调课程内容不足以支撑续费。',
  '续费提升需要把学习进展、阶段反馈和下一阶段路径连接起来，降低效果感知模糊。',
];

export default function ComputingDashboard() {
  const navigate = useNavigate();
  const [users, setUsers] = React.useState<ResearchUser[]>([]);
  React.useEffect(() => { void fetchUsers('jisuanying_project').then(setUsers).catch(() => setUsers([])); }, []);

  const childCount = users.reduce((sum, user) => sum + user.data.children.length, 0);
  const multiChild = users.filter((user) => user.data.children.length > 1).length;
  const complete = users.filter((user) => user.completeness === 100).length;
  const averageCompleteness = users.length ? Math.round(users.reduce((sum, user) => sum + user.completeness, 0) / users.length) : 0;
  const portraits = DEFAULT_PORTRAITS.jisuanying_project.personas;

  return (
    <main className="min-h-full bg-[#f8f8f5] px-5 py-5">
      <div className="mx-auto max-w-[1400px]">
        <header className="flex flex-wrap items-end justify-between gap-4 border-b border-[#d8d7d0] pb-4">
          <div>
            <div className="text-xs font-bold text-[#e65532]">计算营 · 研究驾驶舱</div>
            <h1 className="mt-1 text-2xl font-bold text-[#252525]">用户研究总览</h1>
            <p className="mt-1 text-sm text-[#777]">把研究结论、画像版本和实时用户结构放在同一个汇报视图中。</p>
          </div>
          <div className="flex gap-2">
            <button onClick={() => navigate('/profile?projectId=jisuanying_project')} className="flex h-9 items-center gap-1.5 rounded-md border border-[#d8d7d0] bg-white px-3 text-xs font-bold">查看项目画像<ArrowRight size={13} /></button>
            <button onClick={() => navigate('/users?projectId=jisuanying_project')} className="flex h-9 items-center gap-1.5 rounded-md bg-[#e65532] px-3 text-xs font-bold text-white">进入用户库<ArrowRight size={13} /></button>
          </div>
        </header>

        <section className="mt-5 grid gap-px border border-[#d8d7d0] bg-[#d8d7d0] sm:grid-cols-2 lg:grid-cols-4">
          <Metric icon={UsersRound} label="匿名家庭" value={String(users.length)} note={users.length ? `${multiChild} 户多孩家庭` : '待录入可核验明细'} />
          <Metric icon={Database} label="孩子记录" value={String(childCount)} note="家庭 + 孩子结构" />
          <Metric icon={CheckCircle2} label="完整资料" value={`${complete}/${users.length}`} note={`平均完整度 ${averageCompleteness}%`} />
          <Metric icon={FileClock} label="最近更新" value={users[0] ? new Date(users[0].updatedAt).toLocaleDateString('zh-CN') : '暂无'} note="每 20 秒同步用户库" />
        </section>

        <div className="mt-5 grid gap-5 xl:grid-cols-[1.2fr_.8fr]">
          <section className="border border-[#d8d7d0] bg-white">
            <div className="border-b border-[#e5e4de] px-5 py-4"><h2 className="text-base font-bold">关键研究结论</h2><p className="mt-1 text-xs text-[#888]">来自现有计算营研究报告的阶段性共识</p></div>
            <div className="divide-y divide-[#ecebe6]">
              {conclusions.map((item, index) => <div key={item} className="flex gap-4 px-5 py-4"><span className="text-xs font-bold text-[#e65532]">0{index + 1}</span><p className="text-sm leading-6 text-[#444]">{item}</p></div>)}
            </div>
          </section>
          <section className="border border-[#d8d7d0] bg-white">
            <div className="border-b border-[#e5e4de] px-5 py-4"><h2 className="text-base font-bold">资料健康度</h2><p className="mt-1 text-xs text-[#888]">只统计用户库中的真实明细</p></div>
            <div className="p-5">
              <div className="flex items-end justify-between"><span className="text-sm text-[#666]">平均字段完整度</span><span className="text-3xl font-bold">{averageCompleteness}%</span></div>
              <div className="mt-3 h-2 bg-[#e8e7e1]"><div className="h-full bg-[#37a87a]" style={{ width: `${averageCompleteness}%` }} /></div>
              <p className="mt-4 text-xs leading-5 text-[#888]">{users.length ? '优先补齐地区、年级、走读/住宿与学校类型，驾驶舱结构统计会随之更新。' : '当前没有个人明细。汇总结论不会被自动拆成虚构用户。'}</p>
            </div>
          </section>
        </div>

        <section className="mt-5 border border-[#d8d7d0] bg-white">
          <div className="flex items-center justify-between border-b border-[#e5e4de] px-5 py-4"><div><h2 className="text-base font-bold">计算营画像版本</h2><p className="mt-1 text-xs text-[#888]">画像分布需要用户库样本继续验证</p></div><button onClick={() => navigate('/profile?projectId=jisuanying_project')} className="text-xs font-bold text-[#e65532]">管理画像</button></div>
          <div className="grid gap-px bg-[#e5e4de] md:grid-cols-2 xl:grid-cols-4">
            {portraits.map((persona) => <div key={persona.id} className="bg-white p-5"><div className="text-sm font-bold">{persona.name}</div><p className="mt-2 text-xs leading-5 text-[#666]">{persona.definition}</p><div className="mt-4 text-[10px] font-bold text-[#a05a46]">{persona.distribution}</div></div>)}
          </div>
        </section>
      </div>
    </main>
  );
}

function Metric({ icon: Icon, label, value, note }: { icon: typeof UsersRound; label: string; value: string; note: string }) {
  return <div className="bg-white p-4"><div className="flex items-center gap-2 text-xs font-bold text-[#777]"><Icon size={14} className="text-[#e65532]" />{label}</div><div className="mt-3 text-2xl font-bold text-[#252525]">{value}</div><div className="mt-1 text-[11px] text-[#999]">{note}</div></div>;
}
