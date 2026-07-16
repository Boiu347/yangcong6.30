import React from 'react';
import { motion } from 'motion/react';
import {
  AlertTriangle,
  ArrowRight,
  ClipboardList,
  Lightbulb,
  Quote,
  Sparkles,
  Users,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const INK = '#292521';
const MUTED = '#746E67';

const reveal = {
  initial: { opacity: 0, y: 18 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-48px' },
  transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] as const },
};

type FamilyStory = {
  id: string;
  index: string;
  accent: string;
  title: string;
  keyword: string;
  tagline: string;
  banner: string;
  meta: string[];
  situation: string[];
  path: { label: string; title: string; detail: string }[];
  quote: string;
  opportunity: string;
  unresolved: string;
};

const STORIES: FamilyStory[] = [
  {
    id: 'transition-window',
    index: '01',
    accent: '#C9622E',
    title: '升学窗口家庭',
    keyword: '主孩触发',
    tagline: '六年级哥哥的升学需求先发生，三年级妹妹让长期包不再显得浪费。',
    banner: '广东广州黄妈妈 —— 两个孩子都有需求，但决策一定有主次',
    meta: ['三年级 & 六年级', '已购家庭包', '妈妈主导决策'],
    situation: [
      '哥哥即将小升初，成绩稳定，暑假需要用更短的视频完成初一同步预习；妹妹数学基础不稳，需要更长期的陪伴与打底。',
      '家庭原本也会给孩子买其他机构课程；真正的选择不是“买不买课”，而是“买短期课还是一次覆盖两个孩子的长期方案”。',
      '哥哥可以自主学习，妹妹仍需陪伴；同一家庭中，两个孩子的需求强度和使用方式并不相同。',
    ],
    path: [
      { label: '触发', title: '哥哥小升初', detail: '升学衔接带来明确、紧急的预习需求。' },
      { label: '算账', title: '妹妹权益补足价值', detail: '若只有哥哥，更可能买短期课；妹妹让高客单价变得合理。' },
      { label: '确认', title: '孩子愿意自主用', detail: '哥哥试用后三科都愿意学，消解了“买了不用”的担心。' },
    ],
    quote: '主要考虑的是哥哥，妹妹无所谓，顺带使用；但如果没有妹妹的权益，可能就会买个短期课，不会买家庭包了。',
    opportunity: '销售和产品应先承接主孩的升学问题，再把另一孩子的基础、思维培养与未来使用路径讲成“长期不浪费”的证据，而不是平均地讲两个孩子。',
    unresolved: '妹妹能否坚持、家庭包能否持续被用起来，仍需要可见的学习计划和分孩子的学情反馈。',
  },
  {
    id: 'self-driven',
    index: '02',
    accent: '#3F5E8C',
    title: '拔尖自驱家庭',
    keyword: '超前学',
    tagline: '孩子自律且主动要学，家庭包的价值是把初高中的长期资源一次准备好。',
    banner: '江西景德镇王妈妈 —— 支持孩子把“现在想学”延续到高中',
    meta: ['初一 & 已毕业', '已购家庭包 + 学习机', '孩子主动发起'],
    situation: [
      '初一孩子成绩靠前，已自主安排九年级数学和高中英语；她要的不只是同步课，而是能持续拔高、由浅入深的资源。',
      '家长愿意为长期内容投入，但并非不在乎价格；她的底气来自对孩子自律和持续性的信任。',
      '购买家庭包不是因为另一个孩子分摊成本，而是因为“既然要超前学，就不能到高中再重新找资源”。',
    ],
    path: [
      { label: '触发', title: '孩子主动要超前学', detail: '需要同步、培优与更高年级内容的连续供给。' },
      { label: '判断', title: '信任孩子能坚持', detail: '先判断孩子的自律、主动性和长期学习意愿。' },
      { label: '决策', title: '一次准备到高中', detail: '把资源完整性和知识体系当成长期投入的回报。' },
    ],
    quote: '既然要提前学就一起买，初中的时候就要往高中的时候学，不能等到了高中再学。',
    opportunity: '对自驱、成绩较好的孩子，重点不是“课程很多”，而是展示跨学段的进阶路径、体系化知识串联和自主学习的支撑方式。',
    unresolved: '仍需验证孩子不是一时兴起，并让家长看到超前学习是否真正沉淀为解决问题的能力。',
  },
  {
    id: 'experience-transfer',
    index: '03',
    accent: '#2F8272',
    title: '大孩经验迁移家庭',
    keyword: '少走弯路',
    tagline: '姐姐的升学与使用经验，让妈妈更早为妹妹安排一条可执行的长期路径。',
    banner: '安徽合肥张妈妈 —— 从大孩的遗憾出发，为小孩提前准备',
    meta: ['四年级 & 初三', '续购后首次买家庭包', '二孩跨学段'],
    situation: [
      '姐姐临近中考、理科偏弱，曾买过冲刺包却没有持续使用；妹妹学习更稳定，家长开始把精力转向她的长期准备。',
      '她不只比较标价，而是比较接送、时间、线下私教和未来涨价、补课的综合成本。',
      '过去“小升初时没有提前准备”的遗憾，成为她愿意提前给妹妹规划的真实动力。',
    ],
    path: [
      { label: '触发', title: '大孩升学暴露问题', detail: '姐姐进入高压阶段后，家庭开始复盘哪些准备可以更早发生。' },
      { label: '迁移', title: '把经验用到妹妹身上', detail: '寒暑假预习、平时复习，逐步形成可执行的日常规划。' },
      { label: '锁定', title: '覆盖到高中毕业', detail: '用长期使用确定性抵消“当下看起来贵”的感受。' },
    ],
    quote: '小升初的时候没有给报，现在想起来有点后悔。',
    opportunity: '家庭包可被讲成“把大孩的踩坑经验变成小孩的提前准备”：用真人规划确定大方向、用 AI 定制班落实每天做什么。',
    unresolved: '大孩“买了不看”的记忆仍会让家长担心小孩重复同样的结果，需要持续呈现使用进度与阶段成效。',
  },
  {
    id: 'resource-reserve',
    index: '04',
    accent: '#805C9B',
    title: '资源预置家庭',
    keyword: '一次备齐',
    tagline: '没有单一的学业危机，但希望两个孩子在需要时都有可用、可信、完整的资源。',
    banner: '江西九江刘爸爸 —— 先把资源准备好，再让两个孩子各自用起来',
    meta: ['一年级 & 六年级', '首购家庭包', '第三方规划背书'],
    situation: [
      '姐姐即将上初中，弟弟刚入小学；家庭没有一个必须立刻解决的成绩危机，却希望两个孩子都能把理科学好。',
      '家长更相信第三方教育规划者的客观推荐，而不是销售话术；先体验，再决定是否一步到位。',
      '“两个孩子能否同时使用”是他判断家庭包是否值得的基础条件，而非附加功能。',
    ],
    path: [
      { label: '触发', title: '为未来提前囤资源', detail: '希望姐姐预习初中，弟弟也能从小学阶段开始使用。' },
      { label: '信任', title: '第三方背书 + 体验', detail: '先确认内容和品牌可信，再比较不同课程组合。' },
      { label: '决策', title: '两个孩子都能用才成立', detail: '长期覆盖和并行使用决定“囤课”是否真正划算。' },
    ],
    quote: '希望 2 个孩子一起用，账号不会相互冲突，希望能发挥到最大的功效。',
    opportunity: '面向资源预置型家庭，应该把全科、长期、多人使用说成具体的“家庭资源配置方案”，同时补足可信第三方背书与使用规则说明。',
    unresolved: '最强的使用门槛仍是多孩并发、账号冲突和长期坚持；若无法解决，家庭包的性价比感会迅速坍塌。',
  },
];

function soft(color: string) {
  return `${color}12`;
}

export default function TypicalFamilyStories() {
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const sectionRefs = React.useRef<Record<string, HTMLElement | null>>({});
  const [activeId, setActiveId] = React.useState(STORIES[0].id);
  const activeStory = STORIES.find((story) => story.id === activeId) ?? STORIES[0];

  React.useEffect(() => {
    const root = scrollRef.current;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target instanceof HTMLElement && visible.target.dataset.id) {
          setActiveId(visible.target.dataset.id);
        }
      },
      { root, rootMargin: '-45% 0px -45% 0px', threshold: [0, 0.2, 0.5, 1] },
    );
    Object.values(sectionRefs.current).forEach((element) => element && observer.observe(element));
    return () => observer.disconnect();
  }, []);

  const jumpTo = (id: string) => {
    sectionRefs.current[id]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="flex h-full flex-col bg-[#f8f8f5]">
      <div ref={scrollRef} className="min-h-0 flex-1 overflow-y-auto">
        <div className="sticky top-0 z-20 border-b border-[#e4e2da] bg-white/95 px-5 py-3 backdrop-blur md:px-8">
          <div className="mx-auto max-w-[940px]">
            <div className="flex items-center gap-2" style={{ color: activeStory.accent }}>
              <Sparkles size={15} />
              <span className="text-[11px] font-black tracking-[0.14em]">典型家庭故事 · 家庭包购买决策</span>
            </div>
            <div className="mt-2.5 flex flex-wrap gap-1.5">
              {STORIES.map((story) => {
                const active = story.id === activeId;
                return (
                  <button
                    key={story.id}
                    onClick={() => jumpTo(story.id)}
                    className={cn(
                      'flex items-center gap-1.5 rounded-xl px-3 py-2 text-[12.5px] font-bold transition-all',
                      active ? 'text-white shadow-sm' : 'bg-[#f4f1eb] text-[#6b655c] hover:bg-[#eee9e0]',
                    )}
                    style={active ? { background: story.accent } : undefined}
                  >
                    <span className="text-[10px] font-black" style={!active ? { color: story.accent } : undefined}>{story.index}</span>
                    {story.title}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-[940px] px-5 pb-10 md:px-8">
          <motion.header {...reveal} className="border-b border-[#e4e2da] py-9">
            <div className="flex items-center gap-2 text-[#e65532]">
              <Users size={17} />
              <span className="text-[11px] font-black tracking-[0.14em]">RESEARCH STORYBOOK</span>
            </div>
            <h1 className="mt-2 text-2xl font-black md:text-3xl" style={{ color: INK }}>典型家庭故事</h1>
            <p className="mt-3 max-w-3xl text-[14px] font-medium leading-7" style={{ color: MUTED }}>
              不再把家庭抽象为一张“用户画像”。从孩子的学段组合、真正触发购买的那一个问题、家长如何算长期账，到仍未消解的顾虑，复原家庭包决策发生的真实过程。
            </p>
            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              {[
                ['11 户', '深度访谈，复原购买与未购路径'],
                ['29 条', '招募简访，补充观望与用不上证据'],
                ['8000+', '问卷样本，观察家庭结构与年级分布'],
              ].map(([value, label]) => (
                <div key={value} className="rounded-xl border border-[#e4e2da] bg-white px-4 py-3">
                  <div className="text-lg font-black text-[#e65532]">{value}</div>
                  <div className="mt-1 text-[11.5px] leading-5" style={{ color: MUTED }}>{label}</div>
                </div>
              ))}
            </div>
          </motion.header>

          {STORIES.map((story) => (
            <article
              key={story.id}
              data-id={story.id}
              ref={(element) => { sectionRefs.current[story.id] = element; }}
              className="scroll-mt-24 border-b border-[#e4e2da] py-9 last:border-0"
            >
              <StorySection story={story} />
            </article>
          ))}

          <p className="mt-10 rounded-xl border border-[#e4e2da] bg-[#f4f2ec] p-4 text-[11px] leading-5" style={{ color: MUTED }}>
            故事来自家庭包用户调研的深度访谈与销售录音分析。它们不是对所有家庭的机械分类，而是四种高频购买机制的代表样本：主孩升学触发、自驱超前学习、大孩经验迁移与长期资源预置。
          </p>
        </div>
      </div>
    </div>
  );
}

function StorySection({ story }: { story: FamilyStory }) {
  return (
    <>
      <motion.div {...reveal}>
        <div className="flex items-end gap-3">
          <span className="text-5xl font-black leading-none md:text-6xl" style={{ color: story.accent }}>{story.index}</span>
          <div className="pb-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-2xl font-black md:text-3xl" style={{ color: INK }}>{story.title}</h2>
              <span className="rounded px-2 py-0.5 text-[11px] font-black" style={{ background: soft(story.accent), color: story.accent }}>{story.keyword}</span>
            </div>
            <p className="mt-1.5 text-[14px] font-semibold" style={{ color: '#4a453f' }}>{story.tagline}</p>
          </div>
        </div>
      </motion.div>

      <motion.div {...reveal} className="mt-6 rounded-xl px-5 py-5 text-center md:px-8" style={{ background: '#33302b' }}>
        <h3 className="text-[16px] font-black leading-snug text-white md:text-[19px]">{story.banner}</h3>
        <div className="mt-3 flex flex-wrap justify-center gap-2">
          {story.meta.map((item) => <span key={item} className="rounded-full border border-white/20 bg-white/10 px-2.5 py-1 text-[11px] font-semibold text-white/85">{item}</span>)}
        </div>
      </motion.div>

      <div className="mt-7 flex items-start gap-3 border-b border-[#e4e2da] pb-3">
        <span className="mt-1 grid h-8 w-8 shrink-0 place-items-center rounded-lg" style={{ background: soft(story.accent), color: story.accent }}><Users size={16} /></span>
        <div>
          <h3 className="text-[17px] font-black" style={{ color: INK }}>家庭处境</h3>
          <p className="mt-0.5 text-[12.5px]" style={{ color: MUTED }}>先看到一个家庭的具体矛盾，才知道家庭包为什么会成立。</p>
        </div>
      </div>
      <div className="mt-4 grid gap-3 md:grid-cols-3">
        {story.situation.map((item, index) => (
          <motion.div {...reveal} transition={{ ...reveal.transition, delay: index * 0.05 }} key={item} className="rounded-xl border border-[#e7e5de] bg-white p-4">
            <span className="text-[11px] font-black" style={{ color: story.accent }}>0{index + 1}</span>
            <p className="mt-2 text-[13px] leading-7" style={{ color: '#4a453f' }}>{item}</p>
          </motion.div>
        ))}
      </div>

      <div className="mt-8 flex items-start gap-3 border-b border-[#e4e2da] pb-3">
        <span className="mt-1 grid h-8 w-8 shrink-0 place-items-center rounded-lg" style={{ background: soft(story.accent), color: story.accent }}><ClipboardList size={16} /></span>
        <div>
          <h3 className="text-[17px] font-black" style={{ color: INK }}>购买决策如何发生</h3>
          <p className="mt-0.5 text-[12.5px]" style={{ color: MUTED }}>从需求触发到下单，不是一次统一话术能完成的路径。</p>
        </div>
      </div>
      <motion.div {...reveal} className="mt-4 rounded-2xl border border-[#e7e5de] bg-white p-5 md:p-6">
        <div className="grid gap-3 md:grid-cols-[1fr_auto_1fr_auto_1fr]">
          {story.path.map((step, index) => (
            <React.Fragment key={step.title}>
              <div className="rounded-xl border p-4" style={{ borderColor: `${story.accent}44`, background: index === 0 ? soft(story.accent) : '#fff' }}>
                <span className="text-[10px] font-black tracking-wide" style={{ color: story.accent }}>{step.label}</span>
                <h4 className="mt-1 text-[14px] font-black" style={{ color: INK }}>{step.title}</h4>
                <p className="mt-2 text-[12px] leading-6" style={{ color: '#5c564f' }}>{step.detail}</p>
              </div>
              {index < story.path.length - 1 && <div className="flex items-center justify-center"><ArrowRight size={18} className="rotate-90 md:rotate-0" style={{ color: `${story.accent}88` }} /></div>}
            </React.Fragment>
          ))}
        </div>
      </motion.div>

      <motion.blockquote {...reveal} className="mt-5 flex gap-3 rounded-xl border px-4 py-4" style={{ borderColor: `${story.accent}44`, background: soft(story.accent) }}>
        <Quote size={18} className="mt-0.5 shrink-0" style={{ color: story.accent }} />
        <p className="text-[14px] font-semibold italic leading-7" style={{ color: '#4a453f' }}>“{story.quote}”</p>
      </motion.blockquote>

      <div className="mt-5 grid gap-3 md:grid-cols-2">
        <motion.div {...reveal} className="rounded-xl border p-5" style={{ borderColor: `${story.accent}55`, background: soft(story.accent) }}>
          <div className="flex items-center gap-2" style={{ color: story.accent }}><Lightbulb size={15} /><span className="text-[12px] font-black tracking-wide">对家庭包意味着什么</span></div>
          <p className="mt-3 text-[13px] font-semibold leading-7" style={{ color: '#332f2a' }}>{story.opportunity}</p>
        </motion.div>
        <motion.div {...reveal} className="rounded-xl border border-[#f0d6cd] bg-[#fdf4ee] p-5">
          <div className="flex items-center gap-2 text-[#b0492b]"><AlertTriangle size={15} /><span className="text-[12px] font-black tracking-wide">仍未消解的顾虑</span></div>
          <p className="mt-3 text-[13px] font-semibold leading-7 text-[#6d5549]">{story.unresolved}</p>
        </motion.div>
      </div>
    </>
  );
}
