import {
  ArrowDown,
  Atom,
  BookOpenCheck,
  BrainCircuit,
  CheckCircle2,
  ChevronRight,
  CircleHelp,
  Compass,
  FlaskConical,
  GraduationCap,
  Lightbulb,
  Quote,
  Sparkles,
  Telescope,
} from 'lucide-react';

type QuoteItem = {
  text: string;
  source: string;
};

const QuoteCard = ({ quote, className = '' }: { quote: QuoteItem; className?: string }) => (
  <figure className={`rounded-2xl border border-[#e6e1d8] bg-white p-5 shadow-[0_12px_30px_rgba(46,42,36,.06)] ${className}`}>
    <Quote className="mb-3 size-5 text-[#ee6a43]" fill="currentColor" strokeWidth={0} />
    <blockquote className="text-[15px] font-semibold leading-7 text-[#302d28]">“{quote.text}”</blockquote>
    <figcaption className="mt-3 text-xs font-bold text-[#867d73]">— {quote.source}</figcaption>
  </figure>
);

const MiniLabel = ({ children }: { children: React.ReactNode }) => (
  <p className="text-[11px] font-black uppercase tracking-[0.18em] text-[#ee6a43]">{children}</p>
);

const SectionTitle = ({ eyebrow, title, description }: { eyebrow: string; title: string; description?: string }) => (
  <div className="max-w-3xl">
    <MiniLabel>{eyebrow}</MiniLabel>
    <h2 className="mt-3 text-3xl font-black tracking-[-0.04em] text-[#292722] md:text-5xl">{title}</h2>
    {description && <p className="mt-4 text-base font-medium leading-7 text-[#6e675f] md:text-lg">{description}</p>}
  </div>
);

export default function CodexConclusionsPage() {
  return (
    <main className="min-h-full overflow-hidden bg-[#fbfaf7] text-[#292722]">
      <section className="relative isolate overflow-hidden border-b border-[#e6e1d8] bg-[#171b25] px-5 pb-18 pt-16 text-white md:px-10 md:pb-24 md:pt-24">
        <div className="absolute inset-0 opacity-50 [background:radial-gradient(circle_at_78%_22%,#ee6a43_0,transparent_27%),radial-gradient(circle_at_15%_85%,#325c7d_0,transparent_32%)]" />
        <div className="relative mx-auto max-w-6xl">
          <div className="flex items-center gap-2 text-xs font-bold text-[#f4b49e]">
            <Atom className="size-4" />
            从小学系列售卖策略调研 · 主页面2：核心结论
          </div>
          <div className="mt-12 grid gap-10 lg:grid-cols-[1.3fr_.7fr] lg:items-end">
            <div>
              <p className="text-sm font-bold tracking-[0.16em] text-[#aeb9c9]">CODEX · NARRATIVE VIEW</p>
              <h1 className="mt-4 max-w-4xl text-5xl font-black leading-[1.06] tracking-[-0.055em] md:text-7xl">
                为初中理科学习<br />买一份<span className="text-[#ff916e]">“确定感”</span>
              </h1>
              <p className="mt-7 max-w-2xl text-lg font-medium leading-8 text-[#d1d8e1]">
                一页叙事化呈现：从孩子喜欢，到未来学科价值，再到洋葱需要解决的产品决策与未成交卡点。
              </p>
            </div>
            <div className="rounded-3xl border border-white/15 bg-white/8 p-6 backdrop-blur-sm">
              <p className="text-sm font-bold text-[#aeb9c9]">阅读方式</p>
              <p className="mt-3 text-xl font-black leading-8">原始结论 → 数据证据 → 用户原声</p>
              <p className="mt-3 text-sm leading-6 text-[#c2cad5]">页面只使用调研素材中已有的结论、数据与访谈引文。</p>
            </div>
          </div>
          <div className="mt-12 flex items-center gap-3 text-sm font-bold text-[#d1d8e1]">
            向下阅读结论推导 <ArrowDown className="size-4 animate-bounce" />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-18 md:px-10 md:py-24">
        <SectionTitle eyebrow="01 · 成交原因" title="兴趣是入口" description="孩子喜欢，是家长进一步考虑购买的前提。" />
        <div className="mt-10 grid gap-5 md:grid-cols-[.72fr_1.28fr]">
          <div className="rounded-3xl bg-[#fff0ea] p-7 md:p-9">
            <p className="text-sm font-black text-[#c74c29]">成交被打动因素</p>
            <div className="mt-8 flex items-end gap-5">
              <p className="text-7xl font-black tracking-[-0.07em] text-[#dd542e]">53%</p>
              <p className="mb-2 max-w-[10rem] text-sm font-bold leading-5 text-[#8f422d]">趣味动画课<br />TOP 1</p>
            </div>
            <div className="mt-6 h-px bg-[#efb7a4]" />
            <div className="mt-5 flex items-end gap-4">
              <p className="text-5xl font-black tracking-[-0.07em] text-[#dd542e]">40%</p>
              <p className="mb-1.5 text-sm font-bold text-[#8f422d]">孩子喜欢 · TOP 2</p>
            </div>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <QuoteCard quote={{ text: '首先是孩子能看得进去，看得进去的话，想教他的知识，他才能听进去，学进去。', source: '用户7 · 二年级 · 山东潍坊' }} />
            <QuoteCard quote={{ text: '我是基于我们家孩子喜欢，我才付费去买这个课程的。', source: '用户4 · 二年级 · 北京顺义' }} />
          </div>
        </div>
      </section>

      <section className="border-y border-[#e6e1d8] bg-[#f0f4f7] px-5 py-18 md:px-10 md:py-24">
        <div className="mx-auto max-w-6xl">
          <SectionTitle eyebrow="02 · 品类动机" title="未来学科价值，才是最终合理化购买的理由" />
          <div className="mt-10 grid gap-6 lg:grid-cols-[.85fr_1.15fr]">
            <div className="rounded-3xl bg-[#19334b] p-8 text-white md:p-10">
              <p className="text-sm font-bold text-[#b5cfdf]">对课程的学习预期 · TOP 1</p>
              <p className="mt-8 text-7xl font-black tracking-[-0.07em] text-[#9cdefa]">31%</p>
              <p className="mt-4 max-w-sm text-2xl font-black leading-9">未来进入初中后，学理科时能更快听懂</p>
            </div>
            <div className="grid gap-4">
              {[
                '因为以后到初中也会学到物理。然后可以提前让他认识知道一些跟物理相关的知识。',
                '初中、高中肯定都会有这个课程，那提前小学现在这个阶段，通过各种渠道让他先接触一下，了解一下相关知识，然后他之后学起来可能不会很吃力。',
                '最少他上初中、高中学习物理不会那么吃力吧？因为他小时候就喜欢接触，应该是有点帮助。',
              ].map((text, index) => (
                <div key={text} className="flex gap-4 rounded-2xl border border-[#d7e0e5] bg-white p-5">
                  <span className="grid size-8 shrink-0 place-items-center rounded-full bg-[#e6f3f9] text-xs font-black text-[#287395]">0{index + 1}</span>
                  <p className="text-[15px] font-semibold leading-7 text-[#37444e]">“{text}”</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-18 md:px-10 md:py-24">
        <SectionTitle eyebrow="03 · 产品定位" title="介于两端之间的“学科启蒙”" description="原文将需求定位在“纯兴趣启蒙”与“小初衔接提前学”之间。" />
        <div className="mt-12 overflow-hidden rounded-3xl border border-[#e8e3db] bg-white">
          <div className="grid divide-y divide-[#e8e3db] md:grid-cols-3 md:divide-x md:divide-y-0">
            <div className="p-7 md:p-8">
              <Compass className="size-7 text-[#9a9288]" />
              <h3 className="mt-8 text-xl font-black">纯兴趣启蒙</h3>
              <p className="mt-3 text-sm font-medium leading-6 text-[#756e65]">竞争激烈的红海市场。</p>
            </div>
            <div className="relative bg-[#fff1eb] p-7 md:p-8">
              <span className="absolute right-5 top-5 rounded-full bg-[#ef6740] px-2.5 py-1 text-[10px] font-black text-white">核心位置</span>
              <Lightbulb className="size-7 text-[#e45730]" />
              <h3 className="mt-8 text-xl font-black text-[#ba3d1d]">学科启蒙</h3>
              <p className="mt-3 text-sm font-bold leading-6 text-[#97472f]">更准确的品类位置，恰好是竞品未占据的蓝海。</p>
            </div>
            <div className="p-7 md:p-8">
              <GraduationCap className="size-7 text-[#9a9288]" />
              <h3 className="mt-8 text-xl font-black">小初衔接提前学</h3>
              <p className="mt-3 text-sm font-medium leading-6 text-[#756e65]">用户更希望直接对标课本教材，需求与课程方案不匹配。</p>
            </div>
          </div>
          <div className="border-t border-[#e8e3db] bg-[#fbfaf8] p-6 text-center text-[15px] font-semibold leading-7 text-[#625b52]">
            “不需要提前学完初中内容，能确保以后正式学时不陌生就可以了。”
          </div>
        </div>
        <div className="mt-8 flex flex-col justify-between gap-5 rounded-3xl bg-[#272a31] p-7 text-white md:flex-row md:items-center md:p-9">
          <div>
            <p className="text-sm font-bold text-[#b8c0cb]">目标人群</p>
            <p className="mt-2 text-2xl font-black">小学 1—4 年级家长</p>
          </div>
          <div className="flex items-center gap-4 rounded-2xl bg-white/10 px-5 py-4">
            <p className="text-5xl font-black text-[#ff956f]">77%</p>
            <p className="text-sm font-bold leading-6 text-[#e0e5eb]">已购用户中<br />1—3 年级占比</p>
          </div>
        </div>
      </section>

      <section className="border-y border-[#e6e1d8] bg-[#fff8f3] px-5 py-18 md:px-10 md:py-24">
        <div className="mx-auto max-w-6xl">
          <SectionTitle eyebrow="04 · 产品决策" title="相比竞品，洋葱缺少清晰的课程记忆点" />
          <div className="mt-10 grid gap-4 md:grid-cols-4">
            {[
              ['NB 实验室', '模拟触屏操作方便，能规避危险实验', FlaskConical],
              ['线上实验直播课', '真人老师动手实验，参与感强', Telescope],
              ['妙懂物理', 'AR 形式有趣', Sparkles],
              ['万物指南', '不刷题的吴姥姥，IP 权威', BookOpenCheck],
            ].map(([name, desc, Icon]) => {
              const CardIcon = Icon as typeof FlaskConical;
              return <article key={name as string} className="rounded-2xl border border-[#eadfd7] bg-white p-5"><CardIcon className="size-6 text-[#d96845]" /><h3 className="mt-7 text-base font-black">{name}</h3><p className="mt-2 text-sm font-medium leading-6 text-[#756e65]">{desc}</p></article>;
            })}
          </div>
          <div className="mt-7 grid gap-5 lg:grid-cols-[.9fr_1.1fr]">
            <div className="rounded-3xl bg-[#e65f39] p-8 text-white">
              <p className="text-sm font-bold text-[#ffd2c4]">洋葱当前成交来源</p>
              <p className="mt-4 text-3xl font-black leading-10">品牌信任<br />顺手加购</p>
            </div>
            <QuoteCard quote={{ text: '名校的光环，就是觉得这个人还是挺信得过的。', source: '用户4 · 二年级 · 北京顺义' }} />
          </div>
          <div className="mt-10 rounded-3xl border border-[#d8e4dd] bg-[#f3faf5] p-7 md:p-9">
            <p className="text-sm font-black text-[#2a865c]">原文业务启发</p>
            <h3 className="mt-3 text-2xl font-black leading-9">洋葱的最大优势，不是和竞品拼单一功能，而是要塑造「最专业的学科启蒙课」</h3>
            <div className="mt-7 grid gap-4 md:grid-cols-3">
              {[
                ['系统性', '300+ 个生活现象融入三大篇章；与人教版初中教材开篇要求一致。'],
                ['专业性', '中考命题专家、竞赛专家、资深教研老师带队；3 大独创思维模型。'],
                ['丰富性', '小初 900+ 个知识点；300+ 个真动手实验。'],
              ].map(([title, text]) => <div key={title} className="rounded-2xl bg-white p-5"><CheckCircle2 className="size-5 text-[#3e9d71]" /><h4 className="mt-5 font-black">{title}</h4><p className="mt-2 text-sm font-medium leading-6 text-[#64736a]">{text}</p></div>)}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-18 md:px-10 md:py-24">
        <SectionTitle eyebrow="05 · 未成交卡点" title="家长还有两件事不确定" />
        <div className="mt-10 grid gap-5 md:grid-cols-2">
          <article className="rounded-3xl border border-[#e6e1d8] bg-white p-7 md:p-8"><CircleHelp className="size-7 text-[#d26746]" /><h3 className="mt-8 text-2xl font-black">会不会坚持看？</h3><p className="mt-3 text-sm font-semibold leading-6 text-[#716961]">不确定孩子会不会坚持看。</p><p className="mt-7 border-l-2 border-[#eb9478] pl-4 text-[15px] font-semibold leading-7 text-[#4c4640]">“有时候孩子会忘记看，所以会提醒孩子去看一下。”</p><p className="mt-3 text-xs font-bold text-[#897f75]">— 用户4 · 二年级 · 北京顺义</p></article>
          <article className="rounded-3xl border border-[#e6e1d8] bg-white p-7 md:p-8"><BrainCircuit className="size-7 text-[#d26746]" /><h3 className="mt-8 text-2xl font-black">到底有没有学到？</h3><p className="mt-3 text-sm font-semibold leading-6 text-[#716961]">不确定看完到底有没有学到。</p><p className="mt-7 border-l-2 border-[#eb9478] pl-4 text-[15px] font-semibold leading-7 text-[#4c4640]">“我想知道他到底学了什么东西？学到了什么东西？学了多少？能记住什么？”</p><p className="mt-3 text-xs font-bold text-[#897f75]">— 用户5 · 三年级 · 重庆渝中</p></article>
        </div>
        <div className="mt-8 rounded-3xl bg-[#272a31] p-7 text-white md:p-10">
          <p className="text-sm font-bold text-[#b6c0ca]">原文业务启发</p>
          <div className="mt-4 grid gap-7 md:grid-cols-[.9fr_1.1fr] md:items-center">
            <h3 className="text-3xl font-black leading-10">用数据和事实证明“孩子会看”；把“效果外化”前置为营销机制。</h3>
            <div className="grid grid-cols-3 gap-3 text-center">
              {[['1353', '个家庭'], ['86', '人均观看次数'], ['650+', '动画视频课']].map(([num, label]) => <div key={label} className="rounded-2xl bg-white/10 p-4"><p className="text-3xl font-black text-[#ff956f]">{num}</p><p className="mt-2 text-[11px] font-bold leading-4 text-[#cdd5df]">{label}</p></div>)}
            </div>
          </div>
          <p className="mt-7 border-t border-white/15 pt-5 text-sm font-medium leading-7 text-[#d7dde5]">阶段性信号包括：解释生活现象、完成实验、讲出原理、做对相关题目；并通过包含时长、模块、知识点的学情报告，让家长看见孩子学了什么、学会什么。</p>
        </div>
      </section>

      <section className="border-t border-[#e6e1d8] bg-[#edf4ef] px-5 py-16 text-center md:px-10">
        <div className="mx-auto max-w-2xl">
          <MiniLabel>06 · 产品体验</MiniLabel>
          <h2 className="mt-3 text-3xl font-black tracking-[-0.04em] md:text-4xl">碎片化、低压力、由兴趣触发的补充学习</h2>
          <QuoteCard className="mt-8 text-left" quote={{ text: '这些看的，看这些的话就是零碎的时间看。比如吃饭……星期六、星期天出去玩，他玩累了，休息的时候他也可能去看一下。', source: '用户5 · 三年级 · 重庆渝中' }} />
          <p className="mt-10 text-xs font-bold text-[#7c827d]">内容对应《从小学系列售卖策略调研》V2 · 主页面2：核心结论</p>
        </div>
      </section>
    </main>
  );
}
