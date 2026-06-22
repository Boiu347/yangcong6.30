import React from 'react';
import {
  ArrowDown,
  ArrowRight,
  BadgeCheck,
  CalendarRange,
  ChevronRight,
  CircleDollarSign,
  Layers3,
  LineChart,
  RefreshCw,
  Route,
  ShieldCheck,
  Sparkles,
  Target,
  Users,
} from 'lucide-react';
import { useParams } from 'react-router-dom';

const ORANGE = '#E95B35';
const INK = '#28241F';
const MUTED = '#746E67';

type EvidenceType = '问卷数据' | '业务数据' | '业务反馈' | '研究判断' | '待验证';

const evidenceStyle: Record<EvidenceType, string> = {
  问卷数据: 'border-[#F2B49F] bg-[#FFF2EC] text-[#B74825]',
  业务数据: 'border-[#A9CDC7] bg-[#ECF7F5] text-[#176F65]',
  业务反馈: 'border-[#B9CAE2] bg-[#EFF5FB] text-[#326690]',
  研究判断: 'border-[#C8B7E7] bg-[#F5F0FC] text-[#6840A0]',
  待验证: 'border-[#D8D2C9] bg-[#F5F3EF] text-[#77716A]',
};

const coreProblems = [
  {
    value: '52.2%',
    title: '价值感知不足',
    description: '“价格偏高，觉得不值”与“效果不明显”共同指向：家长没有稳定看见进步证据。',
    source: '问卷数据' as EvidenceType,
    color: ORANGE,
  },
  {
    value: '19.6%',
    title: '孩子不能坚持',
    description: '学习启动仍依赖家长提醒，产品尚未真正兑现“省心”和持续陪练。',
    source: '问卷数据' as EvidenceType,
    color: '#3979A8',
  },
  {
    value: '17.4%',
    title: '计算问题已解决',
    description: '这是计算品类的自然完成信号，也说明下一专题的承接路径必须提前出现。',
    source: '问卷数据' as EvidenceType,
    color: '#6E4AA5',
  },
  {
    value: '假期再学',
    title: '时间节奏错位',
    description: '家长倾向在寒暑假系统提前学，学期中更需要轻量巩固，而非连续重任务。',
    source: '业务反馈' as EvidenceType,
    color: '#B07A24',
  },
];

const mismatches = [
  {
    icon: CalendarRange,
    title: '节奏错位',
    current: '产品按 21 天月度营连续运营',
    reality: '家长按学期与寒暑假做学习决策',
    implication: '月度续费率不能单独代表完整需求，应观察关键窗口回流。',
    source: '业务反馈' as EvidenceType,
  },
  {
    icon: Users,
    title: '用户混杂',
    current: '一套产品同时服务夯实与拔高用户',
    reality: '两类用户对难度、效果与价格的定义不同',
    implication: '至少通过入营测评和任务分层提供基础型、拔高型路径。',
    source: '待验证' as EvidenceType,
  },
  {
    icon: CircleDollarSign,
    title: '权益不对称',
    current: '计算续报缺少稳定老用户权益',
    reality: '应用题转化有优惠，也提供了新内容',
    implication: '同模块续报、跨模块流转与假期预约应形成统一权益。',
    source: '业务数据' as EvidenceType,
  },
];

const levers = [
  {
    level: '01',
    title: '价值外化',
    priority: 'P0 · 最高 ROI',
    question: '为什么值？',
    description: '把学习过程翻译成家长看得懂的进步证据。',
    actions: ['入营前测与结营后测', '错因、速度与正确率变化', '阶段报告自然引出下一目标'],
    color: ORANGE,
  },
  {
    level: '02',
    title: '本期留存',
    priority: 'P0 · 解决坚持',
    question: '能不能学完？',
    description: '让产品承担学习启动和反馈，减少家长每天催促。',
    actions: ['可设置的主动学习提醒', '2-4 分钟模块化任务', '连续学习反馈与异常介入'],
    color: '#3979A8',
  },
  {
    level: '03',
    title: '跨期沉淀',
    priority: 'P1 · 适配节奏',
    question: '什么时候继续？',
    description: '结营是阶段里程碑，不是数据和关系的终点。',
    actions: ['学习档案持续累计', '学期中轻量保温', '假期窗口集中转化'],
    color: '#17786B',
  },
  {
    level: '04',
    title: '流转承接',
    priority: '战略杠杆',
    question: '下一步买什么？',
    description: '计算问题解决后，顺滑进入新的数学专题需求。',
    actions: ['计算转应用题', '应用题转后续专题', '基于诊断推荐下一阶段'],
    color: '#7048A8',
  },
];

function EvidenceBadge({ type }: { type: EvidenceType }) {
  return (
    <span className={`inline-flex rounded-full border px-2.5 py-1 text-[10px] font-bold ${evidenceStyle[type]}`}>
      {type}
    </span>
  );
}

function SectionTitle({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="mb-10 max-w-3xl">
      <div className="mb-3 flex items-center gap-2 text-[11px] font-bold tracking-[0.18em]" style={{ color: ORANGE }}>
        <span className="h-0.5 w-5 rounded-full" style={{ background: ORANGE }} />
        {eyebrow}
      </div>
      <h2 className="text-[30px] font-black leading-tight tracking-[-0.04em] md:text-[40px]" style={{ color: INK }}>
        {title}
      </h2>
      <p className="mt-4 max-w-2xl text-[15px] leading-8 md:text-[16px]" style={{ color: MUTED }}>
        {description}
      </p>
    </div>
  );
}

function Section({
  id,
  children,
  tinted = false,
}: {
  id: string;
  children: React.ReactNode;
  tinted?: boolean;
}) {
  return (
    <section
      id={id}
      className="qp-rv scroll-mt-20 px-5 py-20 md:px-10 md:py-28"
      style={{ background: tinted ? '#F4F0E9' : '#FBFAF7' }}
    >
      <div className="mx-auto max-w-[1100px]">{children}</div>
    </section>
  );
}

function CalculationQuantitativePage() {
  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    window.history.replaceState(null, '', `#${id}`);
  };

  React.useEffect(() => {
    const els = document.querySelectorAll('.qp-rv');
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add('in')),
      { threshold: 0.12 },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  const navItems = [
    ['verdict', '核心判断'],
    ['model', '模式推演'],
    ['problems', '续费问题'],
    ['mismatch', '结构错配'],
    ['growth', '增长路径'],
    ['levers', '四层杠杆'],
    ['foundation', '配套机制'],
    ['metrics', '指标升级'],
  ];

  return (
    <div className="min-h-full" style={{ background: '#FBFAF7', color: INK }}>
      <style>{`
        .qp-rv{opacity:0;transform:translateY(20px);transition:opacity .7s cubic-bezier(.16,1,.3,1),transform .7s cubic-bezier(.16,1,.3,1)}
        .qp-rv.in{opacity:1;transform:none}
        @media (prefers-reduced-motion:reduce){.qp-rv{opacity:1;transform:none;transition:none}}
        @media print{.qp-rv{opacity:1!important;transform:none!important}}
      `}</style>
      <div className="sticky top-0 z-30 border-b border-[#E7E0D6]/90 bg-[#FBFAF7]/90 backdrop-blur-xl">
        <div className="mx-auto flex h-12 max-w-[1100px] items-center gap-5 overflow-x-auto px-5 md:px-10">
          <span className="whitespace-nowrap text-[12px] font-black" style={{ color: ORANGE }}>
            计算营商业总览
          </span>
          {navItems.map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => scrollToSection(id)}
              className="whitespace-nowrap text-[12px] font-medium text-[#7A746D] transition-colors hover:text-[#E95B35]"
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <header className="relative overflow-hidden border-b border-[#E8E1D7] px-5 py-20 md:px-10 md:py-28">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(circle at 84% 12%, rgba(233,91,53,.15), transparent 29%), radial-gradient(circle at 12% 88%, rgba(112,72,168,.08), transparent 30%)',
          }}
        />
        <div className="relative mx-auto grid max-w-[1100px] items-end gap-14 md:grid-cols-[1.18fr_.82fr]">
          <div>
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-[#E95B35]/20 bg-[#E95B35]/5 px-3 py-1.5 text-[11px] font-bold tracking-[0.12em]" style={{ color: ORANGE }}>
              BUSINESS MODEL · RETENTION · 2026
            </div>
            <h1 className="text-[44px] font-black leading-[1.04] tracking-[-0.06em] md:text-[68px]">
              不是连续买计算，
              <br />
              而是持续解决
              <br />
              <span style={{ color: ORANGE }}>数学专项问题。</span>
            </h1>
            <p className="mt-7 max-w-2xl text-[17px] font-semibold leading-9 text-[#4D4741] md:text-[21px]">
              计算营应被重新定义为
              <span style={{ color: ORANGE }}>小学数学专题服务订阅体系的入口模块</span>。
            </p>
            <p className="mt-5 max-w-xl text-[13px] leading-7" style={{ color: MUTED }}>
              本页综合问卷数据、业务数据与业务反馈形成阶段性商业判断。页面中的方向性建议并非实验结果，仍需通过产品灰度和长期行为数据验证。
            </p>
          </div>

          <div className="rounded-[28px] border border-white/80 bg-white/70 p-7 shadow-[0_24px_70px_rgba(70,54,40,.10)] backdrop-blur-xl">
            <p className="mb-6 text-[11px] font-bold tracking-[0.14em]" style={{ color: MUTED }}>
              经营逻辑的变化
            </p>
            {[
              ['过去', '关注单期计算营是否续报'],
              ['现在', '关注用户是否留在数学专题学习路径'],
              ['结果', '计算 → 应用题 → 后续专题模块'],
            ].map(([label, text], index) => (
              <React.Fragment key={label}>
                <div className="flex gap-4">
                  <span
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[11px] font-black text-white"
                    style={{ background: index === 2 ? ORANGE : '#302B26' }}
                  >
                    {index + 1}
                  </span>
                  <div>
                    <p className="text-[11px] font-bold" style={{ color: MUTED }}>{label}</p>
                    <p className="mt-1 text-[14px] font-bold leading-6">{text}</p>
                  </div>
                </div>
                {index < 2 && <ArrowDown size={15} className="my-3 ml-2 text-[#B8B0A7]" />}
              </React.Fragment>
            ))}
          </div>
        </div>
      </header>

      <Section id="verdict">
        <SectionTitle
          eyebrow="01 · 核心判断"
          title="计算营不是无限订阅，也不只是低价引流。"
          description="计算内容有明确终点，学习需求具有阶段性，家长也会按学期和假期安排投入。因此，更准确的商业定位是“分阶段服务订阅”。"
        />
        <div className="grid gap-5 md:grid-cols-3">
          {[
            ['不是纯订阅', '计算内容有限、进步容易衡量，达成目标后会自然结束。', '纯订阅假设不成立'],
            ['不是单纯引流', '部分家长愿意为阶段性改善、陪练和反馈持续付费。', '服务价值真实存在'],
            ['是阶段订阅', '围绕孩子阶段性短板，在若干学期持续购买不同专题服务。', '推荐商业定位'],
          ].map(([title, description, tag], index) => (
            <article
              key={title}
              className="rounded-[24px] border p-7"
              style={{
                background: index === 2 ? '#FFF4EE' : '#FFFFFF',
                borderColor: index === 2 ? '#F1C3B1' : '#E5DED5',
                color: INK,
              }}
            >
              <span className="text-[11px] font-bold tracking-[0.12em]" style={{ color: index === 2 ? '#C2502E' : MUTED }}>
                {tag}
              </span>
              <h3 className="mt-5 text-[23px] font-black">{title}</h3>
              <p className="mt-4 text-[13px] leading-7 text-[#746E67]">
                {description}
              </p>
            </article>
          ))}
        </div>
        <div className="mt-7 flex gap-3 rounded-2xl border border-[#CDBCE8] bg-[#F7F2FD] p-5">
          <BadgeCheck size={20} className="mt-0.5 shrink-0 text-[#7048A8]" />
          <div>
            <EvidenceBadge type="研究判断" />
            <p className="mt-3 text-[14px] font-bold leading-7 text-[#4B356B]">
              真正需要经营的不是“计算营订阅”，而是“小学数学专项能力提升服务”。
            </p>
          </div>
        </div>
      </Section>

      <Section id="model" tinted>
        <SectionTitle
          eyebrow="02 · 模式推演"
          title="为什么流利说式的纯订阅难以直接复制？"
          description="英语订阅依赖内容无限、高频使用和进步模糊；计算在这三个条件上恰好相反。差异决定了产品必须承认阶段终点，并主动设计下一阶段。"
        />
        <div className="overflow-hidden rounded-[26px] border border-[#DFD7CC] bg-white">
          <div className="grid grid-cols-[.8fr_1fr_1fr] bg-[#F4ECE2] text-[12px] font-bold" style={{ color: INK }}>
            <div className="p-4 md:p-5">成立条件</div>
            <div className="border-l border-[#E5DCD0] p-4 md:p-5">英语订阅</div>
            <div className="border-l border-[#E5DCD0] p-4 md:p-5" style={{ color: '#C2502E' }}>计算营现实</div>
          </div>
          {[
            ['内容边界', '长期无限，可持续学习', '小学计算有限，有明确完成点'],
            ['使用频率', '语言可每天使用和练习', '需求常按学期、假期阶段出现'],
            ['进步衡量', '流利度渐进且较模糊', '正确率、速度和成绩容易衡量'],
            ['续费含义', '维持习惯与能力', '进入下一短板或下一专题'],
          ].map(([dimension, english, calculation]) => (
            <div key={dimension} className="grid grid-cols-[.8fr_1fr_1fr] border-t border-[#EEE8E0] text-[12px] md:text-[13px]">
              <div className="p-4 font-black md:p-5">{dimension}</div>
              <div className="border-l border-[#EEE8E0] p-4 leading-6 text-[#746E67] md:p-5">{english}</div>
              <div className="border-l border-[#EEE8E0] bg-[#FFF8F4] p-4 font-semibold leading-6 text-[#A23A19] md:p-5">{calculation}</div>
            </div>
          ))}
        </div>
      </Section>

      <Section id="problems">
        <SectionTitle
          eyebrow="03 · 续费问题"
          title="续费低不是一个问题，而是四种不同的离开理由。"
          description="价值没有被看见、孩子难以坚持、计算阶段自然完成，以及产品节奏与家庭安排错位，需要分别处理，不能都归因于价格。"
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {coreProblems.map((problem) => (
            <article key={problem.title} className="flex min-h-[240px] flex-col rounded-2xl border border-[#E8E1D7] bg-white p-6">
              <EvidenceBadge type={problem.source} />
              <div className="mt-5 text-[29px] font-black tracking-[-0.04em]" style={{ color: problem.color }}>
                {problem.value}
              </div>
              <h3 className="mt-3 text-[15px] font-black">{problem.title}</h3>
              <p className="mt-3 text-[12px] leading-6" style={{ color: MUTED }}>{problem.description}</p>
              <span className="mt-auto w-8 pt-5" style={{ borderBottom: `3px solid ${problem.color}` }} />
            </article>
          ))}
        </div>
        <div className="mt-8 rounded-[26px] border border-[#F0C7B6] p-7 md:p-9" style={{ background: 'linear-gradient(135deg,#fff,#FFF4EE)' }}>
          <div className="grid items-center gap-7 md:grid-cols-[.75fr_1.25fr]">
            <div>
              <Target size={24} style={{ color: ORANGE }} />
              <p className="mt-4 text-[24px] font-black leading-snug">价值外化仍是第一优先级。</p>
            </div>
            <p className="text-[14px] leading-8 text-[#6b635b]">
              如果家长没有先相信第一期有效，续费优惠、跨期运营和后续模块承接都很难成立。先证明孩子哪里变好了，再讨论为什么继续。
            </p>
          </div>
        </div>
      </Section>

      <Section id="mismatch" tinted>
        <SectionTitle
          eyebrow="04 · 结构性错配"
          title="业务反馈揭示了三个比促销更底层的问题。"
          description="这些判断中，节奏错位与权益差异已有业务信号；用户分层仍需要更充分的交叉数据和产品实验验证。"
        />
        <div className="grid gap-5 lg:grid-cols-3">
          {mismatches.map(({ icon: Icon, title, current, reality, implication, source }) => (
            <article key={title} className="rounded-[25px] border border-[#E1D9CF] bg-white p-7">
              <div className="flex items-start justify-between gap-4">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#FFF0EA] text-[#E95B35]">
                  <Icon size={21} />
                </span>
                <EvidenceBadge type={source} />
              </div>
              <h3 className="mt-6 text-[22px] font-black">{title}</h3>
              <div className="mt-5 space-y-3 text-[12px] leading-6">
                <p><span className="font-bold text-[#9A948C]">当前：</span>{current}</p>
                <p><span className="font-bold text-[#9A948C]">现实：</span>{reality}</p>
              </div>
              <div className="mt-5 rounded-2xl bg-[#F7F4EF] p-4 text-[12px] font-semibold leading-6 text-[#554D45]">
                {implication}
              </div>
            </article>
          ))}
        </div>
      </Section>

      <Section id="growth">
        <SectionTitle
          eyebrow="05 · 增长路径"
          title="从月度续费，转向完整学年中的三段经营。"
          description="学期中维持关系，寒暑假集中转化，计算完成后流向下一个专题。三段共同决定用户生命周期价值。"
        />
        <div className="rounded-[28px] border border-[#E4DDD3] bg-white p-6 md:p-9">
          <div className="grid gap-4 md:grid-cols-[1fr_auto_1fr_auto_1fr] md:items-stretch">
            {[
              {
                label: '学期中',
                title: '轻量维系',
                description: '巩固、查漏补缺、短任务与持续反馈，不增加家庭负担。',
                icon: RefreshCw,
                color: '#3979A8',
              },
              {
                label: '寒暑假',
                title: '系统突破',
                description: '承接集中提前学与高客单专题产品，完成关键窗口转化。',
                icon: CalendarRange,
                color: ORANGE,
              },
              {
                label: '问题解决后',
                title: '跨模块流转',
                description: '从计算进入应用题、思维、几何等后续专项路径。',
                icon: Route,
                color: '#7048A8',
              },
            ].map(({ label, title, description, icon: Icon, color }, index) => (
              <React.Fragment key={title}>
                <div className="rounded-2xl p-5" style={{ background: `${color}0D` }}>
                  <Icon size={21} style={{ color }} />
                  <p className="mt-5 text-[11px] font-bold" style={{ color }}>{label}</p>
                  <h3 className="mt-1 text-[20px] font-black">{title}</h3>
                  <p className="mt-3 text-[12px] leading-6" style={{ color: MUTED }}>{description}</p>
                </div>
                {index < 2 && <ArrowRight className="hidden self-center text-[#B6AEA5] md:block" size={18} />}
              </React.Fragment>
            ))}
          </div>
        </div>
      </Section>

      <Section id="levers" tinted>
        <SectionTitle
          eyebrow="06 · 四层杠杆"
          title="先证明有效，再让用户自然进入下一阶段。"
          description="四层杠杆按用户决策顺序展开。优惠不是起点，第一期的效果感知和完成体验才是后续复购的前提。"
        />
        <div className="grid gap-5 md:grid-cols-2">
          {levers.map((lever) => (
            <article key={lever.level} className="rounded-[26px] border border-[#E2DBD2] bg-white p-7">
              <div className="flex items-center justify-between gap-4">
                <span className="text-[12px] font-black tracking-[0.12em]" style={{ color: lever.color }}>
                  LEVEL {lever.level}
                </span>
                <span className="rounded-full px-2.5 py-1 text-[10px] font-bold" style={{ color: lever.color, background: `${lever.color}12` }}>
                  {lever.priority}
                </span>
              </div>
              <div className="mt-5 flex items-end justify-between gap-4">
                <h3 className="text-[24px] font-black">{lever.title}</h3>
                <span className="text-[12px] font-bold" style={{ color: MUTED }}>{lever.question}</span>
              </div>
              <p className="mt-3 text-[13px] leading-7" style={{ color: MUTED }}>{lever.description}</p>
              <div className="mt-6 space-y-2.5">
                {lever.actions.map((action) => (
                  <div key={action} className="flex items-center gap-3 text-[12px] font-semibold">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full" style={{ background: `${lever.color}14`, color: lever.color }}>
                      <ChevronRight size={13} />
                    </span>
                    {action}
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>
      </Section>

      <Section id="foundation">
        <SectionTitle
          eyebrow="07 · 配套机制"
          title="四层杠杆需要三项基础设施支撑。"
          description="用户分层决定服务谁，节奏适配决定何时卖，老用户权益决定持续购买是否具有身份价值。"
        />
        <div className="grid gap-5 md:grid-cols-3">
          {[
            {
              icon: Users,
              title: '用户分层',
              description: '用入营测评与任务难度区分基础夯实型和拔高型路径，避免两类用户都觉得不匹配。',
              status: '方向已明确，差异规模待验证',
              source: '待验证' as EvidenceType,
            },
            {
              icon: Layers3,
              title: '节奏适配',
              description: '从单一月度营改为“学期中轻量 + 寒暑假系统突破”的双轨产品结构。',
              status: '已有业务反馈支持',
              source: '业务反馈' as EvidenceType,
            },
            {
              icon: ShieldCheck,
              title: '老用户权益',
              description: '统一同模块续报、跨模块转化和假期预约权益，让持续学习获得明确奖励。',
              status: '需结合价格实验验证',
              source: '研究判断' as EvidenceType,
            },
          ].map(({ icon: Icon, title, description, status, source }) => (
            <article key={title} className="rounded-[25px] border border-[#E5DED5] bg-white p-7">
              <div className="flex items-center justify-between">
                <Icon size={22} style={{ color: ORANGE }} />
                <EvidenceBadge type={source} />
              </div>
              <h3 className="mt-6 text-[20px] font-black">{title}</h3>
              <p className="mt-3 text-[13px] leading-7" style={{ color: MUTED }}>{description}</p>
              <p className="mt-6 border-t border-[#EEE8E1] pt-4 text-[11px] font-bold text-[#9A938B]">{status}</p>
            </article>
          ))}
        </div>
      </Section>

      <Section id="metrics" tinted>
        <SectionTitle
          eyebrow="08 · 指标升级"
          title="单月续费率不再足以衡量这门生意。"
          description="如果用户按学期与假期决策，且可以跨专题复购，就需要用更长周期和更完整的价值口径评价计算营。"
        />
        <div className="grid gap-4 md:grid-cols-3">
          {([
            ['学年周期续费率', '观察用户是否在完整学年内回流，而非要求每 21 天连续购买。', CalendarRange],
            ['寒暑假窗口转化率', '验证集中提前学是否真的更适合家庭决策节奏。', LineChart],
            ['跨模块 LTV', '衡量计算营是否成功带动应用题和后续专题复购。', Layers3],
          ] as const).map(([title, description, Icon]) => (
            <article key={String(title)} className="rounded-2xl border border-[#E2DAD0] bg-white p-6">
              <Icon size={22} style={{ color: ORANGE }} />
              <h3 className="mt-5 text-[16px] font-black">{String(title)}</h3>
              <p className="mt-3 text-[12px] leading-7" style={{ color: MUTED }}>{String(description)}</p>
            </article>
          ))}
        </div>

        <div className="mt-9 rounded-[30px] border border-[#F0C7B6] p-7 md:p-10" style={{ background: 'linear-gradient(135deg,#fff,#FFF4EE)' }}>
          <div className="grid gap-8 md:grid-cols-[.72fr_1.28fr] md:items-center">
            <div>
              <Sparkles size={25} style={{ color: ORANGE }} />
              <p className="mt-5 text-[25px] font-black leading-snug">
                最终经营路径
              </p>
              <p className="mt-3 text-[12px] leading-6" style={{ color: MUTED }}>
                计算营负责打开入口，后续专题负责延展用户生命周期价值。
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2 text-[12px] font-bold">
              {['计算营', '应用题营', '思维 / 几何', '更多专项模块'].map((item, index) => (
                <React.Fragment key={item}>
                  <span className="rounded-xl border border-[#EBD9CD] bg-white px-4 py-3">{item}</span>
                  {index < 3 && <ArrowRight size={14} className="text-[#B6AEA5]" />}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col justify-between gap-5 border-t border-[#DED6CC] pt-8 md:flex-row md:items-center">
          <div>
            <p className="text-[11px] font-bold tracking-[0.12em]" style={{ color: MUTED }}>阶段性结论</p>
            <p className="mt-2 text-[20px] font-black md:text-[25px]">
              学期中维持关系，假期集中转化，跨专题提升 LTV。
            </p>
          </div>
          <button
            type="button"
            onClick={() => scrollToSection('verdict')}
            className="inline-flex items-center gap-2 text-[12px] font-bold"
            style={{ color: ORANGE }}
          >
            返回核心判断
            <ArrowRight size={14} />
          </button>
        </div>
      </Section>
    </div>
  );
}

function DefaultQuantitativeReport() {
  return (
    <iframe
      src="/research-report.html"
      title="用户调研报告 · 从小学系列"
      className="block h-full min-h-full w-full border-none bg-white"
    />
  );
}

export default function QuantitativePage() {
  const { projectId } = useParams<{ projectId: string }>();
  if (projectId === 'jisuanying_project') return <CalculationQuantitativePage />;
  return <DefaultQuantitativeReport />;
}
