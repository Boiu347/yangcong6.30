import React from 'react';
import {
  ArrowDown,
  ArrowRight,
  BarChart3,
  Bot,
  Check,
  ChevronRight,
  CircleDollarSign,
  Clock3,
  Database,
  Eye,
  LineChart,
  RefreshCw,
  Sparkles,
  Target,
  Users,
} from 'lucide-react';

const ORANGE = '#FF5722';
const INK = '#27231F';
const MUTED = '#756F68';

const findings = [
  {
    value: '1.8%',
    label: '自然渗透率',
    note: '需求存在，但品类价值尚未被充分理解',
    color: '#E8572A',
  },
  {
    value: '52.2%',
    label: '流失指向价值感不足',
    note: '“觉得不值”与“效果不明显”是同一问题的两面',
    color: '#7C3AED',
  },
  {
    value: '30%→60%',
    label: '续报率提升情景',
    note: '人均四期 LTV 可由 626 元提升至 1,047 元',
    color: '#167D70',
  },
  {
    value: '59.7%',
    label: '高于 300 元不购买',
    note: '价格压力背后，是教辅升级版的错误锚点',
    color: '#B7791F',
  },
];

const personas = [
  {
    id: 'remedial',
    title: '补差',
    share: '13.4%',
    score: '1.75 / 3',
    priority: '机会型',
    summary: '问题紧迫、容易触发，但对短期效果期待最高，问题解决后也容易自然流失。',
    trigger: '考试失分、速度慢',
    value: '快速定位问题并稳定正确率',
    risk: '效果落差与短续报周期',
    color: '#D95555',
  },
  {
    id: 'foundation',
    title: '巩固－夯实',
    share: '31.3%',
    score: '2.75 / 3',
    priority: 'P0 主力人群',
    summary: '规模大、体验课路径自然，需求与诊断反馈、专项练习、督学闭环高度匹配。',
    trigger: '偶尔出错、新学期准备',
    value: '把不稳定变成稳定，让家长看见具体改善',
    risk: '痛感不强，需要被“点醒”',
    color: ORANGE,
  },
  {
    id: 'speed',
    title: '巩固－提速',
    share: '30.1%',
    score: '2.25 / 3',
    priority: '稳定承接',
    summary: '孩子当前表现不差，主要追求更快更稳，需要用具体、可量化的进步说服。',
    trigger: '效率提升、减少低级错误',
    value: '速度与稳定性双重提升',
    risk: '痛感弱、决策周期较长',
    color: '#3478B8',
  },
  {
    id: 'advance',
    title: '提前学',
    share: '21.2%',
    score: '2.35 / 3',
    priority: 'P1 长期价值',
    summary: '续报动力天然存在，但首购更依赖品牌、口碑和内容体系感。',
    trigger: '提前准备、拔高冲分',
    value: '清晰的进阶路线与领先感',
    risk: '内容深度不足会迅速损伤信任',
    color: '#7C3AED',
  },
];

const serviceNeeds = [
  ['即时批改', 90.2],
  ['深度诊断', 86.3],
  ['算理动画课', 84.8],
  ['专项推题', 84.4],
  ['答疑服务', 77.5],
  ['学习记录', 77.1],
  ['阶段报告', 73],
  ['督促提醒', 69.2],
] as const;

const retentionLevers = [
  {
    level: '01',
    title: '价值感知',
    tag: '最高 ROI',
    description: '让家长明确看到孩子哪里变好了，而不是只知道完成了多少题。',
    actions: ['入营测与结营测对比', '错因变化追踪', '每周进步摘要'],
    color: ORANGE,
  },
  {
    level: '02',
    title: '本期留存',
    tag: '解决坚持',
    description: '把提醒、反馈与成就机制交给产品，减少家长每天催促。',
    actions: ['主动学习提醒', '连续学习反馈', '异常进度人工介入'],
    color: '#3478B8',
  },
  {
    level: '03',
    title: '跨期沉淀',
    tag: '适配节奏',
    description: '解决学期内时间冲突与两期之间的学习断档。',
    actions: ['营期间歇与保温内容', '学期节点运营', '结营前下期规划'],
    color: '#167D70',
  },
  {
    level: '04',
    title: '流转衔接',
    tag: '放大 LTV',
    description: '当计算问题阶段性解决后，为用户提供下一步，而不是自然离场。',
    actions: ['夯实转提前学', '计算转应用题', '老用户专属权益'],
    color: '#7C3AED',
  },
];

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
    <div className="max-w-3xl mb-10">
      <div className="flex items-center gap-2 text-[11px] font-bold tracking-[0.18em] uppercase mb-3" style={{ color: ORANGE }}>
        <span className="w-5 h-[2px] rounded-full" style={{ background: ORANGE }} />
        {eyebrow}
      </div>
      <h2 className="text-[30px] md:text-[38px] leading-tight font-black tracking-[-0.04em]" style={{ color: INK }}>
        {title}
      </h2>
      <p className="text-[15px] md:text-[16px] leading-8 mt-4 max-w-2xl" style={{ color: MUTED }}>
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
      className="scroll-mt-20 px-5 md:px-10 py-20 md:py-28"
      style={{ background: tinted ? '#F5F1EA' : '#FBFAF7' }}
    >
      <div className="max-w-[1080px] mx-auto">{children}</div>
    </section>
  );
}

export default function QuantitativePage() {
  const [activePersona, setActivePersona] = React.useState(personas[1]);
  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    window.history.replaceState(null, '', `#${id}`);
  };

  return (
    <div className="min-h-full" style={{ background: '#FBFAF7', color: INK }}>
      <div className="sticky top-0 z-30 border-b border-[#E7E0D6]/90 bg-[#FBFAF7]/90 backdrop-blur-xl">
        <div className="max-w-[1080px] mx-auto h-12 px-5 md:px-10 flex items-center gap-5 overflow-x-auto">
          <span className="text-[12px] font-black whitespace-nowrap" style={{ color: ORANGE }}>
            计算营研究
          </span>
          {[
            ['overview', '核心发现'],
            ['users', '用户结构'],
            ['decision', '购买决策'],
            ['model', '商业判断'],
            ['retention', '续报增长'],
            ['method', '研究说明'],
          ].map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => scrollToSection(id)}
              className="text-[12px] font-medium whitespace-nowrap text-[#7A746D] hover:text-[#FF5722] transition-colors"
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <header className="relative overflow-hidden px-5 md:px-10 py-20 md:py-28 border-b border-[#E8E1D7]">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(circle at 82% 12%, rgba(255,87,34,.13), transparent 30%), radial-gradient(circle at 10% 90%, rgba(124,58,237,.08), transparent 32%)',
          }}
        />
        <div className="relative max-w-[1080px] mx-auto grid md:grid-cols-[1.25fr_.75fr] gap-14 items-end">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#FF5722]/20 bg-[#FF5722]/5 text-[11px] font-bold tracking-[0.12em] mb-7" style={{ color: ORANGE }}>
              QUANTITATIVE RESEARCH · 2026
            </div>
            <h1 className="text-[46px] md:text-[72px] leading-[1.02] font-black tracking-[-0.06em]" style={{ color: INK }}>
              计算营不是
              <br />
              更多的题。
            </h1>
            <p className="text-[18px] md:text-[22px] leading-9 font-semibold mt-7 max-w-2xl" style={{ color: '#4D4741' }}>
              它应该是一项让孩子持续进步、让家长真正省心的
              <span style={{ color: ORANGE }}>计算专项陪练服务</span>。
            </p>
            <p className="text-[14px] leading-7 mt-5 max-w-xl" style={{ color: MUTED }}>
              本专题基于 396 份有效问卷、已购用户满意度开放题与业务侧反馈，沿着“发生了什么、意味着什么、先做什么”的顺序呈现研究结论。
            </p>
          </div>

          <div className="rounded-[28px] border border-white/80 bg-white/65 backdrop-blur-xl p-7 shadow-[0_24px_70px_rgba(70,54,40,.10)]">
            <p className="text-[11px] font-bold tracking-[0.14em] mb-6" style={{ color: MUTED }}>
              一条核心因果链
            </p>
            {[
              ['市场有真实需求', '73.5% 对现有方案不满意'],
              ['价值没有被理解', '33.6% 仍将其视作教辅升级版'],
              ['效果没有被看见', '52.2% 流失指向价值感不足'],
              ['续报成为增长瓶颈', '当前业务续报率约 30%'],
            ].map(([title, note], index) => (
              <React.Fragment key={title}>
                <div className="flex gap-4">
                  <span
                    className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-[11px] font-black text-white"
                    style={{ background: index === 3 ? ORANGE : '#2F2B27' }}
                  >
                    {index + 1}
                  </span>
                  <div>
                    <p className="text-[14px] font-bold">{title}</p>
                    <p className="text-[12px] mt-1" style={{ color: MUTED }}>{note}</p>
                  </div>
                </div>
                {index < 3 && <ArrowDown size={15} className="ml-1.5 my-3 text-[#B8B0A7]" />}
              </React.Fragment>
            ))}
          </div>
        </div>
      </header>

      <Section id="overview">
        <SectionTitle
          eyebrow="01 · 核心发现"
          title="问题不在需求上限，而在价值认知。"
          description="四个数字勾勒出计算营当前最关键的经营矛盾：市场有需求，但用户仍在用教辅的心理账户评估一项服务。"
        />
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {findings.map((item) => (
            <article key={item.label} className="rounded-2xl border border-[#E8E1D7] bg-white p-6 min-h-[190px] flex flex-col">
              <div className="text-[34px] font-black tracking-[-0.05em]" style={{ color: item.color }}>
                {item.value}
              </div>
              <h3 className="text-[14px] font-bold mt-4">{item.label}</h3>
              <p className="text-[12px] leading-6 mt-3" style={{ color: MUTED }}>{item.note}</p>
              <span className="w-8 h-1 rounded-full mt-auto pt-5" style={{ borderBottom: `3px solid ${item.color}` }} />
            </article>
          ))}
        </div>

        <div className="mt-8 rounded-[24px] bg-[#29241F] text-white p-7 md:p-9 grid md:grid-cols-[.8fr_1.2fr] gap-8 items-center">
          <div>
            <div className="flex items-center gap-2 text-[#FF8A65] text-[11px] font-bold tracking-[0.14em]">
              <Target size={15} />
              RESEARCH VERDICT
            </div>
            <p className="text-[24px] md:text-[30px] leading-snug font-black mt-4">
              让进步可见，
              <br />
              是当前最高优先级。
            </p>
          </div>
          <p className="text-[14px] leading-8 text-[#D8D1CA]">
            在现有证据下，不应首先把问题理解为“399 元太贵”，而应先解决用户不知道贵在哪里、也无法判断孩子是否变好的问题。价值外化是边际成本更低、覆盖用户更广的改进方向。
          </p>
        </div>
      </Section>

      <Section id="users" tinted>
        <SectionTitle
          eyebrow="02 · 用户结构"
          title="不是一种计算需求，而是四条不同的成长路径。"
          description="这里不设置全局筛选。四类人群只作为一张局部阅读地图，帮助理解谁适合优先承接，以及不同人群为什么会购买。"
        />

        <div className="grid md:grid-cols-[.78fr_1.22fr] gap-6">
          <div className="space-y-3">
            {personas.map((persona) => {
              const active = activePersona.id === persona.id;
              return (
                <button
                  key={persona.id}
                  type="button"
                  onClick={() => setActivePersona(persona)}
                  className="w-full text-left rounded-2xl p-5 transition-all border"
                  style={{
                    background: active ? '#FFFFFF' : 'rgba(255,255,255,.45)',
                    borderColor: active ? persona.color : '#E2DBD1',
                    boxShadow: active ? '0 14px 35px rgba(72,54,40,.08)' : 'none',
                  }}
                >
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[16px] font-black">{persona.title}</span>
                        {persona.id === 'foundation' && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-black text-white" style={{ background: ORANGE }}>
                            P0
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] mt-1" style={{ color: MUTED }}>{persona.priority}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[22px] font-black" style={{ color: persona.color }}>{persona.share}</p>
                      <p className="text-[10px]" style={{ color: MUTED }}>样本占比</p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          <article className="rounded-[28px] border border-white bg-white p-7 md:p-9 shadow-[0_20px_60px_rgba(73,54,38,.09)]">
            <div className="flex items-start justify-between gap-5">
              <div>
                <p className="text-[11px] font-bold tracking-[0.14em]" style={{ color: activePersona.color }}>
                  {activePersona.priority}
                </p>
                <h3 className="text-[30px] font-black tracking-[-0.04em] mt-2">{activePersona.title}</h3>
              </div>
              <div className="rounded-2xl px-4 py-3 text-center" style={{ background: `${activePersona.color}12` }}>
                <p className="text-[18px] font-black" style={{ color: activePersona.color }}>{activePersona.score}</p>
                <p className="text-[10px] mt-1" style={{ color: MUTED }}>综合潜力分</p>
              </div>
            </div>
            <p className="text-[15px] leading-8 mt-7" style={{ color: '#514B45' }}>{activePersona.summary}</p>
            <div className="grid sm:grid-cols-3 gap-3 mt-8">
              {[
                ['购买触发', activePersona.trigger, Target],
                ['核心价值', activePersona.value, Sparkles],
                ['主要风险', activePersona.risk, Eye],
              ].map(([label, text, Icon]) => (
                <div key={String(label)} className="rounded-2xl bg-[#F8F5F0] p-4">
                  <Icon size={17} style={{ color: activePersona.color }} />
                  <p className="text-[11px] font-bold mt-3" style={{ color: MUTED }}>{String(label)}</p>
                  <p className="text-[13px] leading-6 font-semibold mt-1">{String(text)}</p>
                </div>
              ))}
            </div>
            {activePersona.id === 'foundation' && (
              <div className="mt-7 flex gap-3 rounded-2xl border border-[#FF5722]/15 bg-[#FF5722]/5 p-4">
                <Check size={18} className="shrink-0 mt-0.5" style={{ color: ORANGE }} />
                <p className="text-[13px] leading-6 text-[#694232]">
                  推荐作为主力承接人群：用低门槛体验建立信任，再用可见的进步证据推动续报。
                </p>
              </div>
            )}
          </article>
        </div>
      </Section>

      <Section id="decision">
        <SectionTitle
          eyebrow="03 · 购买决策"
          title="家长买的不是内容，而是一套反馈闭环。"
          description="内容是基础，但真正拉开计算营与教辅差异的，是及时纠错、识别薄弱点、针对性练习，以及减少家长介入。"
        />

        <div className="grid lg:grid-cols-[1.2fr_.8fr] gap-6">
          <div className="rounded-[26px] border border-[#E8E1D7] bg-white p-6 md:p-8">
            <div className="flex items-center justify-between gap-5 mb-8">
              <div>
                <p className="text-[14px] font-black">家长认为“必须有”的服务</p>
                <p className="text-[11px] mt-1" style={{ color: MUTED }}>多选题，按选择率排序</p>
              </div>
              <BarChart3 size={22} style={{ color: ORANGE }} />
            </div>
            <div className="space-y-4">
              {serviceNeeds.map(([label, value], index) => (
                <div key={label}>
                  <div className="flex items-center justify-between text-[12px] mb-1.5">
                    <span className="font-semibold">{label}</span>
                    <span className="font-black" style={{ color: index < 4 ? ORANGE : MUTED }}>{value}%</span>
                  </div>
                  <div className="h-2.5 rounded-full bg-[#F0ECE6] overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${value}%`,
                        background: index < 4 ? `linear-gradient(90deg, ${ORANGE}, #FF8A65)` : '#B9B1A7',
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-[26px] bg-[#FFF1EB] border border-[#FFD7C8] p-7">
              <CircleDollarSign size={22} style={{ color: ORANGE }} />
              <p className="text-[24px] leading-snug font-black mt-5">300 元是表象，价格锚点才是问题。</p>
              <p className="text-[13px] leading-7 mt-4 text-[#765446]">
                33.6% 的家长把计算营理解为“练习册或题卡升级版”。当参照物只有几十元，399 元自然显得不值。
              </p>
            </div>
            <div className="rounded-[26px] bg-[#29241F] text-white p-7">
              <Users size={22} className="text-[#FF8A65]" />
              <p className="text-[18px] font-black mt-5">更合适的定位锚点</p>
              <p className="text-[14px] leading-7 mt-3 text-[#D9D2CB]">
                从“教辅升级版”转向“高性价比的专项陪练服务”：不是多给题，而是持续告诉孩子错在哪里、该练什么、有没有变好。
              </p>
            </div>
            <div className="rounded-[26px] border border-[#E8E1D7] bg-white p-6">
              <p className="text-[11px] font-bold tracking-[0.12em]" style={{ color: MUTED }}>一句话产品介绍</p>
              <p className="text-[16px] leading-7 font-black mt-3">
                每天有人陪孩子练、及时纠错，并把进步清楚地反馈给家长。
              </p>
            </div>
          </div>
        </div>
      </Section>

      <Section id="model" tinted>
        <SectionTitle
          eyebrow="04 · 商业判断"
          title="从卖一门课，转向经营一段持续关系。"
          description="当计算营被定义为服务订阅，定价锚点、产品优先级和衡量指标都会改变。续报不是销售动作，而是服务价值是否成立的结果。"
        />

        <div className="overflow-hidden rounded-[26px] border border-[#DFD7CC] bg-white">
          <div className="grid grid-cols-[.8fr_1fr_1fr] bg-[#2B2621] text-white text-[12px] font-bold">
            <div className="p-4 md:p-5">比较维度</div>
            <div className="p-4 md:p-5 border-l border-white/10">内容课逻辑</div>
            <div className="p-4 md:p-5 border-l border-white/10 text-[#FF9A76]">服务订阅逻辑</div>
          </div>
          {[
            ['付费原因', '课程内容是否值得买', '孩子是否变好，家长是否省心'],
            ['价格锚点', '课时数、教辅书价格', '专项诊断、督学与服务成本'],
            ['留存关键', '有没有新内容', '效果能否持续被看见'],
            ['核心指标', '首购转化与客单价', '续报率、LTV 与长期留存'],
          ].map(([dimension, oldValue, newValue]) => (
            <div key={dimension} className="grid grid-cols-[.8fr_1fr_1fr] text-[12px] md:text-[13px] border-t border-[#EEE8E0]">
              <div className="p-4 md:p-5 font-black">{dimension}</div>
              <div className="p-4 md:p-5 border-l border-[#EEE8E0] leading-6" style={{ color: MUTED }}>{oldValue}</div>
              <div className="p-4 md:p-5 border-l border-[#EEE8E0] leading-6 font-semibold text-[#A23A19] bg-[#FFF8F4]">{newValue}</div>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-3 gap-4 mt-7">
          {[
            ['30%', '当前续报率', '626 元', '四期人均 LTV'],
            ['45%', '中间情景', '800 元', '较当前增长 28%'],
            ['60%', '目标情景', '1,047 元', '较当前增长 67%'],
          ].map(([rate, label, ltv, note], index) => (
            <div
              key={rate}
              className="rounded-2xl border p-6"
              style={{
                background: index === 2 ? '#FFF1EB' : '#FFFFFF',
                borderColor: index === 2 ? '#FFB397' : '#E4DDD4',
              }}
            >
              <div className="flex items-center justify-between">
                <LineChart size={20} style={{ color: index === 2 ? ORANGE : '#8D857C' }} />
                <span className="text-[11px]" style={{ color: MUTED }}>{label}</span>
              </div>
              <p className="text-[34px] font-black mt-5" style={{ color: index === 2 ? ORANGE : INK }}>{rate}</p>
              <p className="text-[17px] font-black mt-3">{ltv}</p>
              <p className="text-[11px] mt-1" style={{ color: MUTED }}>{note}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 rounded-2xl border-l-4 border-[#7C3AED] bg-white p-6">
          <p className="text-[14px] font-black text-[#5D2BA6]">为什么不优先全面降价？</p>
          <p className="text-[13px] leading-7 mt-2" style={{ color: MUTED }}>
            399 元降至 299 元意味着客单下降约 25%，续报率需提升至接近 55% 才能弥补 LTV 损失。相比之下，先让用户明确看见服务价值，更可能同时改善首购信任与后续续报。
          </p>
        </div>
      </Section>

      <Section id="retention">
        <SectionTitle
          eyebrow="05 · 续报增长"
          title="续报问题，需要按四层杠杆逐步解决。"
          description="优惠只是最后一环。用户首先要相信第一期有效，孩子愿意持续，产品节奏能承接，才会自然进入下一期或下一个模块。"
        />

        <div className="grid md:grid-cols-2 gap-5">
          {retentionLevers.map((lever) => (
            <article key={lever.level} className="rounded-[26px] border border-[#E7E0D7] bg-white p-7">
              <div className="flex items-center justify-between gap-4">
                <span className="text-[12px] font-black tracking-[0.12em]" style={{ color: lever.color }}>
                  LEVEL {lever.level}
                </span>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold" style={{ color: lever.color, background: `${lever.color}12` }}>
                  {lever.tag}
                </span>
              </div>
              <h3 className="text-[23px] font-black mt-4">{lever.title}</h3>
              <p className="text-[13px] leading-7 mt-3" style={{ color: MUTED }}>{lever.description}</p>
              <div className="mt-6 space-y-2.5">
                {lever.actions.map((action) => (
                  <div key={action} className="flex items-center gap-3 text-[12px] font-semibold">
                    <span className="w-5 h-5 rounded-full flex items-center justify-center" style={{ background: `${lever.color}14`, color: lever.color }}>
                      <ChevronRight size={13} />
                    </span>
                    {action}
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>

        <div className="mt-8 rounded-[28px] bg-[#29241F] text-white p-7 md:p-10">
          <div className="grid md:grid-cols-[.8fr_1.2fr] gap-8 items-center">
            <div>
              <RefreshCw size={26} className="text-[#FF8A65]" />
              <p className="text-[25px] font-black leading-snug mt-5">理想的续报链路</p>
            </div>
            <div className="flex flex-wrap items-center gap-2 text-[12px] font-bold">
              {['低门槛体验', '看见具体进步', '形成学习节奏', '获得下期规划', '进入下一阶段'].map((item, index) => (
                <React.Fragment key={item}>
                  <span className="rounded-xl bg-white/10 border border-white/10 px-4 py-3">{item}</span>
                  {index < 4 && <ArrowRight size={14} className="text-[#918980]" />}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </Section>

      <Section id="method" tinted>
        <SectionTitle
          eyebrow="06 · 研究说明"
          title="这是一项以定量证据为主的研究。"
          description="页面不把有限的开放题与业务反馈包装成完整的定性研究。它们只用于解释数据现象、提出假设，并明确区分事实、推断和待验证方向。"
        />

        <div className="grid md:grid-cols-3 gap-4">
          {[
            {
              icon: Database,
              title: '主要证据',
              content: '396 份有效定量问卷，覆盖需求结构、购买决策、服务偏好、价格敏感度与用户分层。',
            },
            {
              icon: Clock3,
              title: '补充信号',
              content: '已购用户满意度开放题与业务侧反馈，用于辅助解释流失、节奏错位和服务体验。',
            },
            {
              icon: Bot,
              title: '判断边界',
              content: '方向性建议基于数据推演，并非实验结果；具体产品方案仍需通过灰度测试和行为数据验证。',
            },
          ].map(({ icon: Icon, title, content }) => (
            <article key={title} className="rounded-2xl border border-[#E2DAD0] bg-white/70 p-6">
              <Icon size={21} style={{ color: ORANGE }} />
              <h3 className="text-[15px] font-black mt-5">{title}</h3>
              <p className="text-[12px] leading-7 mt-3" style={{ color: MUTED }}>{content}</p>
            </article>
          ))}
        </div>

        <div className="mt-9 flex flex-col md:flex-row md:items-center justify-between gap-5 pt-8 border-t border-[#DED6CC]">
          <div>
            <p className="text-[11px] font-bold tracking-[0.12em]" style={{ color: MUTED }}>最终判断</p>
            <p className="text-[21px] md:text-[25px] font-black mt-2">
              让孩子的进步可见且持续，尽可能省妈。
            </p>
          </div>
          <button
            type="button"
            onClick={() => scrollToSection('overview')}
            className="inline-flex items-center gap-2 text-[12px] font-bold"
            style={{ color: ORANGE }}
          >
            返回核心发现
            <ArrowRight size={14} />
          </button>
        </div>
      </Section>
    </div>
  );
}
