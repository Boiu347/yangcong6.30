import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  BookOpenCheck,
  Brain,
  CheckCircle2,
  Clock3,
  Compass,
  ExternalLink,
  Gauge,
  MessageSquareQuote,
  Route,
  Search,
  Sparkles,
  Target,
  Users2,
  XCircle,
} from 'lucide-react';
import { PAISOU_USERS, PaisouUserStory } from '../../store/paisouData';
import { cn } from '@/lib/utils';

const ACCENT = '#e65532';

const RELATION_STYLE: Record<PaisouUserStory['relation'], { bg: string; text: string; border: string }> = {
  忠实粉: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-100' },
  摇摆用户: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-100' },
  偶尔使用: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-100' },
  被竞品截流: { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-100' },
};

const COMPETITOR_ROWS = [
  { name: '洋葱AI拍搜', fit: '愿意用、能看懂、感觉能学透', scene: '难题复盘、找卡点、知识点补充', risk: '速度和准确性会影响高压场景' },
  { name: '作业帮', fit: '快、题库强、答案路径明确', scene: '赶作业、刷题、快速确认答案', risk: 'AI讲解和情绪价值不足' },
  { name: '豆包 / 豆包爱学', fit: '可追问、对话感强、情绪价值高', scene: '思路卡点、想继续问为什么', risk: '难题准确性和响应稳定性' },
  { name: '快对 / 小猿', fit: '低成本核答案、题库路径熟悉', scene: '简单题和标准答案确认', risk: '深度理解与学习闭环较弱' },
  { name: '学习机', fit: '入口顺手、学习生态完整', scene: '低龄学生、家长参与、硬件使用习惯', risk: '灵活追问和品牌情感不一定强' },
];

function relationClass(relation: PaisouUserStory['relation']) {
  const style = RELATION_STYLE[relation];
  return cn('border px-2 py-0.5 text-[11px] font-bold', style.bg, style.text, style.border);
}

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full border border-gray-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-gray-500">
      {children}
    </span>
  );
}

function MetricCard({
  icon,
  title,
  value,
  note,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
  note: string;
}) {
  return (
    <article className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="flex items-center gap-2 text-[11px] font-bold text-gray-500">
        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#fff2ed] text-[#e65532]">{icon}</span>
        {title}
      </div>
      <p className="mt-3 text-[18px] font-black leading-snug text-gray-900">{value}</p>
      <p className="mt-2 text-[11px] leading-5 text-gray-500">{note}</p>
    </article>
  );
}

function UserCard({ user }: { user: PaisouUserStory }) {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => navigate(`/projects/paisou_project/qualitative/users/${user.id}`)}
      className="group flex h-full flex-col rounded-2xl border border-gray-200 bg-white p-4 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:border-[#e65532]/60 hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-[17px] font-black text-gray-900">{user.name}</h3>
            <span className={relationClass(user.relation)}>{user.relation}</span>
          </div>
          <p className="mt-1 text-[11px] font-semibold text-gray-400">
            {user.region} · {user.grade} · {user.subjects.join('/')}
          </p>
        </div>
        <ArrowRight size={16} className="mt-1 text-gray-300 transition-colors group-hover:text-[#e65532]" />
      </div>

      <div className="mt-4 rounded-xl border border-[#f0ded8] bg-[#fff8f5] p-3.5">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="rounded-full bg-[#e65532] px-2 py-0.5 text-[10px] font-black text-white">{user.typeLabel}</span>
          <span className="rounded-full border border-[#f0ded8] bg-white px-2 py-0.5 text-[10px] font-bold text-[#a45138]">
            {user.pressure.split('：')[0]}
          </span>
        </div>
        <p className="mt-2.5 text-[13px] font-black leading-5 text-gray-900">{user.oneLine}</p>
      </div>

      <div className="mt-3 grid gap-2">
        <div className="rounded-xl border border-gray-100 bg-[#FAFAF8] p-3">
          <p className="text-[10px] font-black tracking-widest text-gray-400">学习状态</p>
          <p className="mt-1 text-[12px] leading-5 text-gray-700">{user.learningStatus}</p>
        </div>
        <div className="grid gap-2 sm:grid-cols-2">
          <div className="rounded-xl border border-gray-100 bg-white p-3">
            <p className="text-[10px] font-black tracking-widest text-gray-400">当前目标</p>
            <p className="mt-1 text-[12px] font-bold leading-5 text-gray-800">{user.currentGoal}</p>
          </div>
          <div className="rounded-xl border border-gray-100 bg-white p-3">
            <p className="text-[10px] font-black tracking-widest text-gray-400">需求倾向</p>
            <p className="mt-1 text-[12px] font-bold leading-5 text-gray-800">{user.answerVsLearn}</p>
          </div>
        </div>
      </div>

      <div className="mt-3 rounded-xl border border-gray-100 bg-white p-3">
        <p className="text-[10px] font-black tracking-widest text-gray-400">工具切换</p>
        <div className="mt-2 flex flex-wrap items-center gap-1.5 text-[11px] font-semibold text-gray-600">
          {user.tools.map((tool, index) => (
            <React.Fragment key={tool}>
              {index > 0 && <span className="text-gray-300">/</span>}
              <span className={cn(
                'rounded-full border px-2 py-0.5',
                tool.includes('洋葱') ? 'border-[#f0ded8] bg-[#fff8f5] text-[#d34b2a]' : 'border-gray-200 bg-gray-50 text-gray-500',
              )}>
                {tool}
              </span>
            </React.Fragment>
          ))}
        </div>
        <p className="mt-2 text-[11px] leading-5 text-gray-500">
          <strong className="text-gray-700">主要截流：</strong>{user.primaryCompetitor}
        </p>
      </div>

      <blockquote className="mt-3 rounded-xl border border-gray-100 bg-gray-50 px-3 py-2.5 text-[12px] leading-5 text-gray-600">
        “{user.quote}”
      </blockquote>

      <div className="mt-3 flex-1 rounded-xl border border-[#E8E2D9] bg-[#fffdf9] p-3">
        <p className="text-[10px] font-black tracking-widest text-[#b7793b]">业务启发</p>
        <p className="mt-1 text-[12px] font-bold leading-5 text-gray-800">{user.marketing.hook}</p>
        <p className="mt-1 text-[11px] leading-5 text-gray-500">{user.marketing.angle}</p>
      </div>
    </button>
  );
}

function OverviewPage() {
  return (
    <div className="min-h-full bg-[#f8f8f5]">
      <main className="mx-auto max-w-7xl px-5 py-6 sm:px-8">
        <section className="rounded-[24px] border border-[#E8E2D9] bg-white p-6 shadow-[0_12px_35px_rgba(30,35,40,0.06)] sm:p-8">
          <div className="max-w-4xl">
            <div className="flex items-center gap-2 text-[11px] font-black tracking-[0.18em] text-[#e65532]">
              <Users2 size={15} />
              拍搜调研 · 8个真实学生故事
            </div>
            <h1 className="mt-3 text-[28px] font-black leading-tight text-[#242421] sm:text-[38px]">
              学生不是固定分成“想学懂”和“只对答案”两类，而是在时间紧/松之间切换状态。
            </h1>
            <p className="mt-4 max-w-3xl text-[14px] leading-7 text-gray-600">
              这页用 8 个真实学生作为入口，让业务方先看见具体的人，再理解他们为什么使用洋葱、什么时候切到竞品，以及这些差异能怎样转化为传播和投放启发。
            </p>
          </div>
        </section>

        <section className="mt-5 grid gap-4 md:grid-cols-3">
          <MetricCard
            icon={<Clock3 size={15} />}
            title="第一变量"
            value="时间紧迫度"
            note="时间紧时先要快和关键步骤，时间松时才会触发深度学习、举一反三和知识点补充。"
          />
          <MetricCard
            icon={<BookOpenCheck size={15} />}
            title="洋葱优势场景"
            value="愿意用、能看懂、感觉能学透"
            note="洋葱最能赢的是难题复盘、找卡点和讲清楚，而不是所有场景都比竞品更快。"
          />
          <MetricCard
            icon={<Gauge size={15} />}
            title="竞品截流场景"
            value="高压作业与低成本核答案"
            note="作业帮、快对、豆包和学习机会在速度、入口、追问和题库上分别截流不同学生。"
          />
        </section>

        <section className="mt-6 grid gap-4 lg:grid-cols-2 2xl:grid-cols-3">
          {PAISOU_USERS.map((user) => <UserCard key={user.id} user={user} />)}
        </section>

        <section className="mt-6 rounded-[22px] border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex items-center gap-2">
            <Compass size={16} className="text-[#e65532]" />
            <h2 className="text-[16px] font-black text-gray-900">学生为什么在不同工具间切换</h2>
          </div>
          <div className="mt-4 overflow-hidden rounded-2xl border border-gray-100">
            <div className="grid grid-cols-[0.75fr_1.2fr_1.2fr_1fr] bg-[#FAFAF8] px-4 py-3 text-[11px] font-bold text-gray-500">
              <span>工具</span>
              <span>用户感知</span>
              <span>赢的场景</span>
              <span>风险</span>
            </div>
            {COMPETITOR_ROWS.map((row) => (
              <div key={row.name} className="grid grid-cols-[0.75fr_1.2fr_1.2fr_1fr] border-t border-gray-100 px-4 py-3 text-[12px] leading-5">
                <strong className="text-gray-900">{row.name}</strong>
                <span className="text-gray-600">{row.fit}</span>
                <span className="text-gray-600">{row.scene}</span>
                <span className="text-gray-500">{row.risk}</span>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

function DetailSection({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center gap-2">
        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#fff2ed] text-[#e65532]">{icon}</span>
        <h2 className="text-[15px] font-black text-gray-900">{title}</h2>
      </div>
      {children}
    </section>
  );
}

function BulletList({ items, positive }: { items: string[]; positive: boolean }) {
  const Icon = positive ? CheckCircle2 : XCircle;
  return (
    <div className="space-y-2">
      {items.map((item) => (
        <div key={item} className="flex gap-2.5">
          <Icon size={15} className={cn('mt-0.5 shrink-0', positive ? 'text-emerald-500' : 'text-rose-500')} />
          <p className="text-[12.5px] leading-5 text-gray-600">{item}</p>
        </div>
      ))}
    </div>
  );
}

function UserDetailPage({ user }: { user: PaisouUserStory }) {
  const navigate = useNavigate();
  return (
    <div className="min-h-full bg-[#f8f8f5]">
      <main className="mx-auto max-w-6xl px-5 py-6 sm:px-8">
        <button
          onClick={() => navigate('/projects/paisou_project/qualitative')}
          className="mb-4 flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-[12px] font-semibold text-gray-500 hover:border-[#e65532]/40 hover:text-[#e65532]"
        >
          <ArrowLeft size={14} />
          返回 8 个用户卡片
        </button>

        <section className="overflow-hidden rounded-[24px] border border-[#E8E2D9] bg-white shadow-[0_12px_35px_rgba(30,35,40,0.06)]">
          <div className="grid gap-5 p-6 lg:grid-cols-[1.2fr_0.8fr] lg:p-8">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className={relationClass(user.relation)}>{user.relation}</span>
                <Pill>{user.typeLabel}</Pill>
                <Pill>{user.pressure}</Pill>
              </div>
              <h1 className="mt-4 text-[32px] font-black text-gray-900 sm:text-[42px]">{user.name}</h1>
              <p className="mt-2 text-[13px] font-semibold text-gray-400">
                {user.region} · {user.grade} · {user.subjects.join('/')} · {user.learningStatus}
              </p>
              <p className="mt-5 max-w-3xl text-[20px] font-black leading-8 text-gray-900">{user.oneLine}</p>
              <blockquote className="mt-5 rounded-2xl border border-[#f0ded8] bg-[#fff8f5] p-4 text-[14px] font-semibold leading-7 text-gray-700">
                “{user.quote}”
              </blockquote>
            </div>
            <div className="rounded-2xl border border-gray-100 bg-[#FAFAF8] p-5">
              <p className="text-[11px] font-black tracking-widest text-gray-400">用户档案</p>
              <div className="mt-4 space-y-3 text-[12.5px]">
                <div><strong className="text-gray-900">当前目标：</strong><span className="text-gray-600">{user.currentGoal}</span></div>
                <div><strong className="text-gray-900">需求倾向：</strong><span className="text-gray-600">{user.answerVsLearn}</span></div>
                <div><strong className="text-gray-900">工具组合：</strong><span className="text-gray-600">{user.tools.join(' / ')}</span></div>
                <div><strong className="text-gray-900">主要竞品：</strong><span className="text-gray-600">{user.primaryCompetitor}</span></div>
              </div>
            </div>
          </div>
        </section>

        <div className="mt-6 grid gap-5 lg:grid-cols-[1.25fr_0.75fr]">
          <div className="space-y-5">
            <DetailSection icon={<Search size={15} />} title="使用场景">
              <p className="text-[13px] leading-7 text-gray-600">{user.scene}</p>
            </DetailSection>

            <DetailSection icon={<Target size={15} />} title="JTBD">
              <p className="rounded-xl border border-gray-100 bg-[#FAFAF8] p-4 text-[14px] font-semibold leading-7 text-gray-800">{user.jtbd}</p>
            </DetailSection>

            <DetailSection icon={<Route size={15} />} title="为什么选洋葱 / 什么时候切走">
              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <h3 className="mb-3 text-[12px] font-black text-emerald-700">洋葱赢的理由</h3>
                  <BulletList items={user.whyOnionWins} positive />
                </div>
                <div>
                  <h3 className="mb-3 text-[12px] font-black text-rose-700">切到竞品的理由</h3>
                  <BulletList items={user.whySwitches} positive={false} />
                </div>
              </div>
            </DetailSection>
          </div>

          <div className="space-y-5">
            <DetailSection icon={<Brain size={15} />} title="留存判断">
              <div className="space-y-3">
                <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-3">
                  <p className="text-[11px] font-bold text-emerald-700">会成为忠实粉的条件</p>
                  <p className="mt-1.5 text-[12px] leading-5 text-gray-700">{user.retention}</p>
                </div>
                <div className="rounded-xl border border-rose-100 bg-rose-50 p-3">
                  <p className="text-[11px] font-bold text-rose-700">不会留下的风险</p>
                  <p className="mt-1.5 text-[12px] leading-5 text-gray-700">{user.risk}</p>
                </div>
              </div>
            </DetailSection>

            <DetailSection icon={<Sparkles size={15} />} title="营销启发">
              <div className="space-y-3">
                <div>
                  <p className="text-[10px] font-bold tracking-widest text-gray-400">传播角度</p>
                  <p className="mt-1 text-[13px] font-bold leading-6 text-gray-900">{user.marketing.angle}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold tracking-widest text-gray-400">素材钩子</p>
                  <p className="mt-1 text-[13px] leading-6 text-gray-700">“{user.marketing.hook}”</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold tracking-widest text-gray-400">适合渠道</p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {user.marketing.channels.map((channel) => <Pill key={channel}>{channel}</Pill>)}
                  </div>
                </div>
                <div className="rounded-xl border border-amber-100 bg-amber-50 p-3">
                  <p className="text-[10px] font-bold tracking-widest text-amber-700">避免话术</p>
                  <p className="mt-1 text-[12px] leading-5 text-gray-700">{user.marketing.avoid}</p>
                </div>
              </div>
            </DetailSection>
          </div>
        </div>

        <section className="mt-6 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2">
            <MessageSquareQuote size={16} color={ACCENT} />
            <h2 className="text-[15px] font-black text-gray-900">业务阅读提示</h2>
          </div>
          <p className="mt-3 text-[12.5px] leading-6 text-gray-600">
            这张详情页不是把用户归纳成抽象标签，而是保留一个真实学生的使用链路。投放和内容团队应从这里判断：这个学生在哪个状态会被洋葱打动，在哪个状态会被竞品截走，以及哪一句话最可能让他愿意试一次。
          </p>
        </section>
      </main>
    </div>
  );
}

export default function PaisouUserStoriesPage() {
  const { userId } = useParams<{ userId?: string }>();
  const user = userId ? PAISOU_USERS.find((item) => item.id === userId) : undefined;

  if (!userId) return <OverviewPage />;
  if (!user) {
    return (
      <div className="flex h-full flex-col items-center justify-center bg-[#f8f8f5] text-center">
        <ExternalLink size={26} className="text-gray-300" />
        <p className="mt-3 text-[14px] font-bold text-gray-700">没有找到这个用户故事</p>
        <a href="/projects/paisou_project/qualitative" className="mt-2 text-[12px] font-semibold text-[#e65532]">
          返回拍搜用户卡片
        </a>
      </div>
    );
  }
  return <UserDetailPage user={user} />;
}
