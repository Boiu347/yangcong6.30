import React from 'react';
import {
  ArrowRight,
  BadgeCheck,
  BarChart3,
  BookOpen,
  Brain,
  CheckCircle2,
  ExternalLink,
  Layers3,
  MessageSquareText,
  SearchCheck,
  Sparkles,
  Target,
  Users,
  Zap,
} from 'lucide-react';
import {
  PAISOU_COMPETITIVE,
  PAISOU_MARKETING,
  PAISOU_QUANTITATIVE,
  PAISOU_REPORT,
  PAISOU_SOURCE_LINKS,
  PAISOU_USERS,
  PAISOU_VOCS,
} from '../../store/paisouData';

const ORANGE = '#E65532';
const INK = '#27231F';
const MUTED = '#756E67';

type PaisouPage = 'summary' | 'qualitative' | 'competitive' | 'quantitative' | 'marketing';

function Highlight({ children }: { children: React.ReactNode }) {
  return <mark className="rounded-md bg-[#FFE4D9] px-1.5 py-0.5 font-black text-[#B83D20]">{children}</mark>;
}

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex rounded-full border border-[#E9DED4] bg-white px-2.5 py-1 text-[11px] font-bold text-[#7A7168]">
      {children}
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
    <div className="mb-7 max-w-3xl">
      <div className="mb-3 flex items-center gap-2 text-[11px] font-black tracking-[0.18em] text-[#E65532]">
        <span className="h-0.5 w-6 rounded-full bg-[#E65532]" />
        {eyebrow}
      </div>
      <h2 className="text-[27px] font-black leading-tight tracking-[-0.04em] md:text-[38px]" style={{ color: INK }}>
        {title}
      </h2>
      <p className="mt-3 text-[14px] leading-7 md:text-[15px]" style={{ color: MUTED }}>
        {description}
      </p>
    </div>
  );
}

function MetricCard({ value, label, note }: { value: string; label: string; note: string }) {
  return (
    <div className="rounded-2xl border border-[#E8DED4] bg-white p-5 shadow-[0_12px_34px_rgba(60,45,30,.04)]">
      <div className="text-[28px] font-black tracking-[-0.04em] text-[#E65532]">{value}</div>
      <div className="mt-1 text-[13px] font-black text-[#302B26]">{label}</div>
      <div className="mt-2 text-[12px] leading-5 text-[#837A71]">{note}</div>
    </div>
  );
}

function SourceLinks() {
  const links = [
    ['洞察简报', PAISOU_SOURCE_LINKS.briefing],
    ['竞品走查', PAISOU_SOURCE_LINKS.competitiveWalkthrough],
    ['产品与营销总结', PAISOU_SOURCE_LINKS.competitiveSummary],
    ['定量报告', PAISOU_SOURCE_LINKS.quantitative],
    ['JTBD访谈', PAISOU_SOURCE_LINKS.jtbd],
  ];
  return (
    <div className="flex flex-wrap gap-2">
      {links.map(([label, url]) => (
        <a
          key={label}
          href={url}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 rounded-full border border-[#E8DED4] bg-white px-3 py-1.5 text-[11px] font-bold text-[#675F56] transition hover:border-[#E65532] hover:text-[#D84C2C]"
        >
          {label}
          <ExternalLink size={12} />
        </a>
      ))}
    </div>
  );
}

function Hero({ page }: { page: PaisouPage }) {
  const pageLabel = {
    summary: 'PROJECT SUMMARY',
    qualitative: 'JTBD INTERVIEWS',
    competitive: 'COMPETITIVE MAP',
    quantitative: 'SURVEY EVIDENCE',
    marketing: 'GO-TO-MARKET',
  }[page];

  return (
    <header className="border-b border-[#E8DED4] bg-[#FBFAF7] px-5 py-12 md:px-10 md:py-16">
      <div className="mx-auto grid max-w-[1120px] gap-8 lg:grid-cols-[1.15fr_.85fr] lg:items-end">
        <div>
          <div className="mb-4 flex items-center gap-2 text-[11px] font-black tracking-[0.18em] text-[#A58B78]">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#FFF0EA] text-[#E65532]">
              <SearchCheck size={18} />
            </span>
            {pageLabel}
          </div>
          <h1 className="text-[40px] font-black leading-[1.05] tracking-[-0.055em] md:text-[62px]" style={{ color: INK }}>
            拍搜产品全流程调研
          </h1>
          <p className="mt-5 max-w-2xl text-[15px] leading-8 md:text-[17px]" style={{ color: MUTED }}>
            围绕 <Highlight>AI 拍题 4.0</Highlight> 的产品体验、竞品生态、用户 JTBD、问卷验证和营销表达，回答洋葱拍搜如何从“给答案”走向“校内提分型学习入口”。
          </p>
          <div className="mt-6">
            <SourceLinks />
          </div>
        </div>
        <div className="rounded-[28px] border border-[#F0C6B6] bg-white p-6 shadow-[0_22px_70px_rgba(68,48,35,.08)]">
          <div className="mb-4 flex items-center gap-2 text-[11px] font-black tracking-[0.14em] text-[#E65532]">
            <Sparkles size={15} />
            核心判断
          </div>
          <p className="text-[22px] font-black leading-9 tracking-[-0.03em] text-[#2E2924]">
            准和快是地基，<Highlight>看得懂</Highlight>、<Highlight>能迁移</Highlight>、<Highlight>能提分</Highlight>才是洋葱的差异化。
          </p>
        </div>
      </div>
    </header>
  );
}

function SummaryView() {
  return (
    <>
      <section className="px-5 py-10 md:px-10 md:py-14">
        <div className="mx-auto max-w-[1120px]">
          <div className="grid gap-4 md:grid-cols-4">
            {PAISOU_REPORT.metrics.map(([value, label, note]) => (
              <MetricCard key={label} value={value} label={label} note={note} />
            ))}
          </div>
        </div>
      </section>
      <section className="px-5 pb-14 md:px-10 md:pb-20">
        <div className="mx-auto max-w-[1120px]">
          <SectionTitle
            eyebrow="01 · 产品判断"
            title="不是另一个拍题工具，而是从作业入口切进学习闭环。"
            description="拍搜的竞争不只是谁先给答案，而是谁能在不同时间压力下让学生更快完成、更清楚知道哪里错、最后愿意留下来学一类题。"
          />
          <div className="grid gap-5 md:grid-cols-2">
            {PAISOU_REPORT.pillars.map((pillar, index) => (
              <article key={pillar.title} className="rounded-[26px] border border-[#E8DED4] bg-white p-6 shadow-[0_15px_45px_rgba(64,46,31,.05)]">
                <div className="mb-4 flex items-center gap-2">
                  <span className="rounded-xl bg-[#FFF0EA] px-2.5 py-1 text-[12px] font-black text-[#E65532]">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <Badge>产品机会</Badge>
                </div>
                <h3 className="text-[22px] font-black leading-8 tracking-[-0.035em] text-[#27231F]">{pillar.title}</h3>
                <div className="mt-4 rounded-2xl border-l-4 border-[#E65532] bg-[#FFF9F5] p-4">
                  <div className="text-[11px] font-black tracking-[0.12em] text-[#E65532]">业务影响</div>
                  <p className="mt-2 text-[13px] font-bold leading-6 text-[#39332D]">{pillar.impact}</p>
                </div>
                <div className="mt-4 space-y-2">
                  {pillar.findings.map((finding) => (
                    <div key={finding} className="flex gap-2 rounded-2xl border border-[#EFE7DF] bg-[#FCFAF7] p-3 text-[13px] leading-6 text-[#4B443E]">
                      <CheckCircle2 size={15} className="mt-1 shrink-0 text-[#E65532]" />
                      <span>{finding}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 flex gap-2 rounded-2xl bg-[#292724] p-4 text-white">
                  <Target size={16} className="mt-1 shrink-0 text-[#FF9C7D]" />
                  <p className="text-[13px] font-bold leading-6">{pillar.action}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

function QualitativeView() {
  return (
    <section className="px-5 py-12 md:px-10 md:py-16">
      <div className="mx-auto max-w-[1120px]">
        <SectionTitle
          eyebrow="02 · JTBD 访谈"
          title="学生不是按品牌分流，而是按题目难度、时间压力和卡点类型分流。"
          description="8 位用户访谈显示，同一个学生可能同时保留洋葱、豆包、快对、学习机：难题要学透，中等题要纠错，简单题只要核对。"
        />
        <div className="grid gap-4 lg:grid-cols-2">
          {PAISOU_USERS.map((user) => (
            <article key={user.id} className="rounded-[24px] border border-[#E8DED4] bg-white p-5 shadow-[0_12px_38px_rgba(64,46,31,.04)]">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className="text-[18px] font-black text-[#27231F]">{user.name}</h3>
                  <p className="mt-1 text-[12px] leading-5 text-[#7B746D]">{user.meta}</p>
                </div>
                <Badge>{user.need}</Badge>
              </div>
              <div className="mt-5 grid gap-3 md:grid-cols-2">
                <div className="rounded-2xl bg-[#FFF8F3] p-4">
                  <div className="text-[11px] font-black text-[#E65532]">Job Story</div>
                  <p className="mt-2 text-[13px] leading-6 text-[#403A35]">{user.job}</p>
                </div>
                <div className="rounded-2xl bg-[#F5F3EF] p-4">
                  <div className="text-[11px] font-black text-[#877B70]">摩擦点</div>
                  <p className="mt-2 text-[13px] leading-6 text-[#403A35]">{user.friction}</p>
                </div>
              </div>
              <blockquote className="mt-4 border-l-4 border-[#E65532] bg-[#FCFAF7] p-4 text-[14px] font-bold leading-7 text-[#302A25]">
                “{user.quote}”
              </blockquote>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function CompetitiveView() {
  return (
    <section className="px-5 py-12 md:px-10 md:py-16">
      <div className="mx-auto max-w-[1120px]">
        <SectionTitle
          eyebrow="03 · 竞品地图"
          title="行业地基已稳，竞争正在从“给答案”卷到“教方法”和“学习生态”。"
          description="拍搜竞品可以分成 AI+教育 App、通用大模型产品和学习机产品三类；洋葱的优势在中高层体验，短板在底层准和快。"
        />
        <div className="grid gap-4 md:grid-cols-3">
          {PAISOU_COMPETITIVE.landscape.map(([title, brands, desc]) => (
            <article key={title} className="rounded-[24px] border border-[#E8DED4] bg-white p-5">
              <Layers3 size={20} className="text-[#E65532]" />
              <h3 className="mt-4 text-[17px] font-black">{title}</h3>
              <p className="mt-2 text-[12px] font-bold text-[#83776C]">{brands}</p>
              <p className="mt-4 text-[13px] leading-6 text-[#514A43]">{desc}</p>
            </article>
          ))}
        </div>
        <div className="mt-7 grid gap-5 lg:grid-cols-[.9fr_1.1fr]">
          <div className="rounded-[26px] border border-[#E8DED4] bg-white p-6">
            <h3 className="text-[20px] font-black">四个核心评估维度</h3>
            <div className="mt-5 space-y-3">
              {PAISOU_COMPETITIVE.dimensions.map(([title, desc]) => (
                <div key={title} className="rounded-2xl bg-[#FBF8F4] p-4">
                  <div className="text-[15px] font-black text-[#E65532]">{title}</div>
                  <p className="mt-1 text-[13px] leading-6 text-[#514A43]">{desc}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-[26px] border border-[#E8DED4] bg-white p-6">
            <h3 className="text-[20px] font-black">竞品与洋葱位置</h3>
            <div className="mt-5 space-y-3">
              {PAISOU_COMPETITIVE.competitors.map(([brand, desc]) => (
                <div key={brand} className="grid gap-3 rounded-2xl border border-[#EFE7DF] p-4 md:grid-cols-[100px_1fr]">
                  <div className="text-[15px] font-black text-[#27231F]">{brand}</div>
                  <p className="text-[13px] leading-6 text-[#514A43]">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function QuantitativeView() {
  return (
    <section className="px-5 py-12 md:px-10 md:py-16">
      <div className="mx-auto max-w-[1120px]">
        <SectionTitle
          eyebrow="04 · 定量验证"
          title="时间紧迫度比学段和成绩更能解释拍搜行为切换。"
          description="问卷报告显示，用户不是“想学懂”和“只对答案”两类人，而是同一批人在不同时间压力下的两种状态。"
        />
        <div className="grid gap-5">
          {PAISOU_QUANTITATIVE.tables.map((table) => (
            <article key={table.title} className="overflow-hidden rounded-[24px] border border-[#E8DED4] bg-white">
              <div className="border-b border-[#EFE7DF] bg-[#FCFAF7] px-5 py-4 text-[17px] font-black">{table.title}</div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[640px] text-left text-[13px]">
                  <tbody>
                    {table.rows.map((row) => (
                      <tr key={row.join('-')} className="border-b border-[#F1ECE6] last:border-b-0">
                        {row.map((cell, index) => (
                          <td key={cell} className={`px-5 py-4 ${index === 0 ? 'font-black text-[#E65532]' : 'text-[#4F4841]'}`}>
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </article>
          ))}
        </div>
        <div className="mt-7 grid gap-4 md:grid-cols-3">
          {PAISOU_QUANTITATIVE.implications.map((item) => (
            <div key={item} className="rounded-[22px] border border-[#E8DED4] bg-white p-5">
              <BarChart3 size={20} className="text-[#E65532]" />
              <p className="mt-4 text-[14px] font-bold leading-7 text-[#352F2A]">{item}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function MarketingView() {
  return (
    <section className="px-5 py-12 md:px-10 md:py-16">
      <div className="mx-auto max-w-[1120px]">
        <SectionTitle
          eyebrow="05 · 营销落地"
          title="拍搜营销不能只讲 AI，而要讲“有趣、专业、亲近”的洋葱味。"
          description="产品短板会限制营销放大；在准和快补齐前，营销需要真实承接产品体验，把学生愿意用和家长能感知有效讲清楚。"
        />
        <div className="grid gap-4 md:grid-cols-3">
          {PAISOU_MARKETING.personas.map(([title, desc], index) => {
            const icons = [BadgeCheck, MessageSquareText, Brain] as const;
            const Icon = icons[index] ?? Sparkles;
            return (
              <article key={title} className="rounded-[24px] border border-[#E8DED4] bg-white p-5">
                <Icon size={22} className="text-[#E65532]" />
                <h3 className="mt-4 text-[18px] font-black">{title}</h3>
                <p className="mt-3 text-[13px] leading-6 text-[#514A43]">{desc}</p>
              </article>
            );
          })}
        </div>
        <div className="mt-7 rounded-[28px] border border-[#E8DED4] bg-white p-6">
          <h3 className="text-[22px] font-black">落地策略</h3>
          <div className="mt-5 grid gap-3 md:grid-cols-2">
            {PAISOU_MARKETING.strategy.map((item) => (
              <div key={item} className="flex gap-3 rounded-2xl bg-[#FBF8F4] p-4">
                <ArrowRight size={16} className="mt-1 shrink-0 text-[#E65532]" />
                <p className="text-[13px] font-bold leading-6 text-[#403A35]">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function EvidenceStrip() {
  return (
    <section className="border-t border-[#E8DED4] bg-[#F4F0EA] px-5 py-10 md:px-10">
      <div className="mx-auto max-w-[1120px]">
        <div className="mb-5 flex items-center gap-2 text-[12px] font-black text-[#E65532]">
          <BookOpen size={16} />
          代表证据
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {PAISOU_VOCS.slice(0, 3).map((voc) => (
            <blockquote key={voc.id} className="rounded-2xl border border-[#E8DED4] bg-white p-5 text-[13px] leading-7 text-[#3C3630]">
              “{voc.text}”
              <footer className="mt-4 text-[11px] font-bold text-[#8A8178]">{voc.sourceFileName}</footer>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function PaisouReport({ page }: { page: PaisouPage }) {
  return (
    <main className="min-h-full bg-[#FBFAF7] text-[#27231F]">
      <Hero page={page} />
      {page === 'summary' && <SummaryView />}
      {page === 'qualitative' && <QualitativeView />}
      {page === 'competitive' && <CompetitiveView />}
      {page === 'quantitative' && <QuantitativeView />}
      {page === 'marketing' && <MarketingView />}
      {page !== 'qualitative' && <EvidenceStrip />}
      <footer className="border-t border-[#E8DED4] px-5 py-8 md:px-10">
        <div className="mx-auto flex max-w-[1120px] flex-col gap-3 text-[12px] text-[#8A8178] md:flex-row md:items-center md:justify-between">
          <span>资料范围：5 份飞书文档，项目内容不混入小学物理、计算营和家庭包。</span>
          <div className="flex items-center gap-2">
            <Zap size={14} className="text-[#E65532]" />
            <span>产品导向：体验、场景、竞品、增长机会</span>
          </div>
        </div>
      </footer>
    </main>
  );
}
