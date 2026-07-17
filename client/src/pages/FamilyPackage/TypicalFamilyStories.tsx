import React from 'react';
import { motion } from 'motion/react';
import {
  AlertTriangle,
  BookOpenCheck,
  CheckCircle2,
  Lightbulb,
  Quote,
  Sparkles,
  Users,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const INK = '#292521';
const MUTED = '#746E67';
const STORY = '#33302b';
const BASE_PATH = process.env.CLIENT_BASE_PATH || '';

const reveal = {
  initial: { opacity: 0, y: 18 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-48px' },
  transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] as const },
};

type IconType = React.ComponentType<{ size?: number }>;

interface StoryPoint {
  text: string;
  quotes?: string[];
}

interface FamilyPersona {
  id: string;
  index: string;
  accent: string;
  name: string;
  keyword: string;
  tagline: string;
  portrait: {
    image: string;
    imageAlt: string;
    recognitionLabels: string[];
    basicSituation: string[];
    purchaseMotivation: string[];
    familyPackageReasons: string[];
    concernIntro?: string;
    concerns: string[];
  };
  story: {
    banner: string;
    coreFeature: string;
    businessInsight: string;
    narrative: {
      heading: string;
      points: StoryPoint[];
    }[];
  };
}

// 内容对齐飞书文档《家庭包用户购买决策洞察》主页面 4：典型家庭故事。
const PERSONAS: FamilyPersona[] = [
  {
    id: 'transition-window',
    index: '01',
    accent: '#C9622E',
    name: '小升初窗口驱动型',
    keyword: '5/6/7 年级',
    tagline: '兼顾同步复习小学和提前学初中',
    portrait: {
      image: '/family-stories/transition-window.png',
      imageAlt: '妈妈陪六年级哥哥准备升学，三年级妹妹在旁学习',
      recognitionLabels: ['年级在小升初前后（5/6/7 年级）'],
      basicSituation: [
        '家中有孩子处于小升初前后年级的节点（5/6 年级）',
        '购买触发来自某个孩子的明确学习问题',
        '对「现在不准备，后面会更被动」有较强感知',
      ],
      purchaseMotivation: [
        '兼顾同步复习小学和提前学初中',
        '复习：五年级难度上升，成绩有下滑苗头，学期内同步复习',
        '提前学：六年级/初一孩子需要暑假预习下学期内容',
      ],
      familyPackageReasons: [
        '升学孩子的紧迫问题提供购买理由，另一个孩子的权益让高客单价不浪费',
        '6 年时长，减少初高中反复选品和续买成本',
      ],
      concernIntro: '提分效果不确定时，会退而求其次买更短、更便宜的方案',
      concerns: ['有没有效果？', '孩子能不能坚持？', '孩子能不能适应（录播课）？'],
    },
    story: {
      banner: '广州黄妈妈 —— 哥哥要小升初强驱动，妹妹让家庭包变得“不浪费”',
      coreFeature: '先被哥哥小升初衔接需求触发，再用妹妹未来可用来合理化家庭包；如果没有妹妹权益，她更可能只买短期课。',
      businessInsight: '对这类家庭，要先讲清当下任务（小升初孩子怎么用：暑假怎么预习、初中后怎么继续接），再讲另一个孩子未来如何承接权益。',
      narrative: [
        {
          heading: '两个孩子，哥哥 6 年级，妹妹 3 年级。',
          points: [
            { text: '这个家庭的第一需求不是“两个孩子都要同步学”，而是哥哥马上要小升初，暑假预习初中内容已经变成明确任务。' },
            { text: '妹妹还在 3 年级，当前不是主需求，但她让家庭包的 6 年权益变得更容易被接受。' },
          ],
        },
        {
          heading: '她购买家庭包，首先是为了哥哥的暑假衔接。',
          points: [
            { text: '对黄妈妈来说，暑假不是普通假期，而是哥哥进入初中前的准备窗口。' },
            {
              text: '她期待哥哥先用洋葱做初中预习，进入初中后周末也可以继续跟进。',
              quotes: ['我们暑假先衔接嘛，就是暑假先预习嘛。到了初中的话，周末也是预习嘛。'],
            },
          ],
        },
        {
          heading: '她最初的顾虑不是价格本身，而是怕孩子不适应、买了浪费。',
          points: [
            {
              text: '家庭包客单不低，如果哥哥不适应录播课，长期权益就会变成风险。',
              quotes: ['我主要担忧是小孩不适应这个课，买了浪费。'],
            },
            {
              text: '决策能继续推进，是因为哥哥自己同意学，家长相信他有较大概率会用起来。',
              quotes: ['之前担心买了浪费，孩子不能坚持；最终打消顾虑是因为哥哥自己说喜欢学，还是相信他。'],
            },
          ],
        },
        {
          heading: '妹妹不是成交的第一理由，但她是家庭包成立的关键补充。',
          points: [
            { text: '如果只给哥哥买，黄妈妈可能会退回到更短、更便宜的方案。' },
            {
              text: '因为妹妹以后也能用，家庭包才从“太长、太贵”变成“两个孩子都能接上”。',
              quotes: [
                '妹妹只要陪着上就好。',
                '主要考虑的是哥哥，妹妹顺带着用；但如果没有妹妹的权益，可能就会买个短期课，不会买家庭包了，毕竟 7000 多块钱也不便宜。',
              ],
            },
          ],
        },
      ],
    },
  },
  {
    id: 'self-driven',
    index: '02',
    accent: '#3F5E8C',
    name: '拔尖自驱超前学型',
    keyword: '成绩优秀、提前学',
    tagline: '孩子已经在提前学，需要覆盖初中与高中的同步、拔高资源',
    portrait: {
      image: '/family-stories/self-driven.png',
      imageAlt: '初一女儿自主规划初高中学习，妈妈在旁支持',
      recognitionLabels: ['成绩优秀（如：小学 95、初中 110+），已经在/有计划提前学'],
      basicSituation: [
        '孩子成绩优秀、自律、主动性强',
        '家长不是在补差，而是在支持孩子继续往前学',
        '家长更重视孩子的自主学习能力和思维能力',
      ],
      purchaseMotivation: ['孩子已经在提前学，需要一套覆盖初中 + 高中的同步、拔高资源。'],
      familyPackageReasons: [
        '下个阶段的内容不是“囤着”，孩子现在就可能用到',
        '家庭包比单买初中 + 高中划算',
        '产品能支撑孩子长期自主学习',
      ],
      concernIntro: '孩子长期自律、主动提出购买，顾虑较容易被化解',
      concerns: ['孩子是不是一时兴起？', '孩子能不能适应录播课？', '长期包会不会浪费？'],
    },
    story: {
      banner: '景德镇王妈妈 —— 孩子自己想往前学，家长才敢一次买到高中',
      coreFeature: '家长购买家庭包，是在支持一个自律、主动、愿意提前学的孩子；孩子的长期使用确定性，降低了家庭包的浪费风险。',
      businessInsight: '对这类家庭，最应该突出的是“孩子已经准备好了，这套资源能跟上她”，包括课程能否支持孩子自主学习、能否从初中自然接到高中、能否让孩子按自己的节奏往前走。',
      narrative: [
        {
          heading: '核心对象是成绩好，也有主动学习意识的孩子。',
          points: [
            { text: '这个家庭的购买动机，是孩子已经具备继续往前学的能力和意愿。' },
            {
              text: '家长相信孩子，因为她平时就比较自觉、自律，认定的事情通常能坚持。',
              quotes: ['因为她平时学习也是非常主动的，非常自律。'],
            },
          ],
        },
        {
          heading: '长周期家庭包并非毫无阻力：王妈妈最初也想过先买初中，再看要不要买高中。',
          points: [
            {
              text: '家长的初始思路更谨慎：先买初中，验证效果，再考虑高中。',
              quotes: ['当时也会想，我就买个初中的，看好不好，然后我再买高中的。'],
            },
          ],
        },
        {
          heading: '真正让决策升级的，是孩子自己提出想学。',
          points: [
            {
              text: '对王妈妈来说，孩子主动提出学习，比销售承诺更有说服力。',
              quotes: [
                '既然我小孩子，我女儿她是比较自觉的，自律的。她能够这样自己主动地提出来，她说要想自己去学习，那我们就支持她。',
                '他只要是他自己认定的事情，他一般都还能够坚持下去。所以我就相信他。',
              ],
            },
          ],
        },
        {
          heading: '高中内容在这个家庭里不是遥远囤课，而是孩子超前学习路径的自然延伸。',
          points: [
            {
              text: '如果孩子本来就会往前学，高中资源就不是“以后再说”的权益，而是一套能支持孩子持续自主学习的资源底座。',
              quotes: ['既然要学嘛，你既然要提前学，那你就一起买。'],
            },
          ],
        },
        {
          heading: '她认可洋葱的关键，不只是知识点多，而是能帮助孩子形成自主学习体系。',
          points: [
            {
              text: '王妈妈希望孩子能自己消化吸收，重视孩子把知识串起来、形成主线的能力。',
              quotes: ['我希望他能够自己消化吸收，形成自己的知识成体系嘛；等于是有一个主线，他能够把这知识串联起来。'],
            },
          ],
        },
      ],
    },
  },
  {
    id: 'experience-transfer',
    index: '03',
    accent: '#2F8272',
    name: '大孩经验迁移型',
    keyword: '多胎隔段',
    tagline: '希望小孩提前准备，减少无效补课和线下奔波',
    portrait: {
      image: '/family-stories/experience-transfer.png',
      imageAlt: '妈妈把初三姐姐的学习经验迁移给四年级妹妹',
      recognitionLabels: ['多胎隔段：初高中 + 小学', '对辅导班的态度：中立或负面'],
      basicSituation: [
        '有明显的大孩经验',
        '老大经历过升学压力、辅导班低效、补课疲惫',
        '家长希望老二少走弯路，减少无效补课和线下奔波',
      ],
      purchaseMotivation: [
        '首购多由大孩中考复习触发，续购转向为小孩长期准备',
        '希望小孩初中阶段少补课、提前建立学习节奏',
      ],
      familyPackageReasons: [
        '家庭包被看作提前准备和替代线下补课的方案',
        '小初高衔接内容，帮助小孩更早适应下个阶段',
      ],
      concernIntro: '带着顾虑下单：“东西给你了，真不学我也没办法。”',
      concerns: [
        '会不会像老大一样，买了但没真正用起来？',
        '学情报告是否能让家长持续看到学习过程和效果？',
      ],
    },
    story: {
      banner: '合肥张妈妈 —— 为了不走老大的弯路，让妈妈更早为老二准备',
      coreFeature: '她从老大的经历中，看到老二未来的风险，希望老二提前准备，少走弯路。',
      businessInsight: '对这类家庭，最有效的表达是把未来补课风险讲具体，同时要把产品的学习闭环展示清楚，让家长知道不是买完就只能靠孩子自觉。',
      narrative: [
        {
          heading: '两个孩子，大孩初三，小孩 4 年级。',
          points: [
            { text: '老二还没到强升学压力阶段，但家长已经从老大身上见过初中后的学习压力、补课成本和被动感。' },
            {
              text: '老大的经历让她后悔没有更早做准备：她见过身边孩子提前学，也见过没有提前准备后面可能更被动。',
              quotes: ['姐姐小升初的时候，好像周边的人都在补（提前学），我顶住压力没有给报班，现在想起来有点后悔。'],
            },
          ],
        },
        {
          heading: '她会拿洋葱和线下补课算一笔非常现实的账。',
          points: [
            { text: '线下补课：不只是课时费，还包括接送、路费、等待和孩子疲惫。' },
            {
              text: '洋葱：能承担一部分预习、复习、巩固功能，就会显得更轻、更灵活、更划算。',
              quotes: [
                '买这个的话肯定比那个补课要便宜多了呀。我还不需要接送，时间成本也没有。路费也没有。',
                '孩子他自己也不会那么累，因为他不需要赶路啊……他想什么时候看都行。',
              ],
            },
          ],
        },
        {
          heading: '但她并不盲目信任课程，真正担心的是孩子不主动学。',
          points: [
            { text: '在张妈妈看来，课程设计好只是前提，不代表孩子一定会打开。' },
            {
              text: '她需要看到学习过程，比如错题、学习记录、家长可跟进的信息。',
              quotes: [
                '课程设计得再好，孩子如果主动不学，他不看，不还是没什么用嘛。',
                '我还是希望，家长是不是能看到一些东西，或者是，假设我能看到他具体哪些错题啊，然后我再叮嘱。',
              ],
            },
          ],
        },
        {
          heading: '这个案例说明：大孩经验型家庭要重点证明“提前准备”和“过程可见”。',
          points: [
            { text: '只讲课程多，不足以打动这类家长。' },
            { text: '她们需要看到：为什么现在准备比未来补救更好，以及孩子学没学、哪里错了、家长怎么跟进。' },
          ],
        },
      ],
    },
  },
  {
    id: 'resource-reserve',
    index: '04',
    accent: '#9A6B2F',
    name: '资源预置囤课型',
    keyword: '长期资源预置',
    tagline: '提前备着，避免问题出现后再补救',
    portrait: {
      image: '/family-stories/resource-reserve.png',
      imageAlt: '爸爸与六年级姐姐、一年级弟弟共享家庭学习资源',
      recognitionLabels: ['关注“能学到高中/高考”', '关注“多个孩子都能用”'],
      basicSituation: [
        '把家庭包理解成“储备资源”',
        '消费观偏“可以买最好的，但要用到极致”',
        '注重性价比、不浪费、多孩共用（多孩家庭）',
      ],
      purchaseMotivation: ['没有非常明确的学业危机，但希望提前备着，避免问题出现再补救'],
      familyPackageReasons: [
        '性价比高：学到高中、多个孩子可用、分开买更麻烦',
        '内容资源丰富：像“图书馆”一样先把资源放好',
      ],
      concerns: [
        '是否能学到高中？学满 6 年不浪费？',
        '时间太长，孩子能不能坚持学？',
        '学情报告是否能让家长持续看到学习过程和效果？',
      ],
    },
    story: {
      banner: '九江刘爸爸 —— 先把资源准备好，不等问题出现后再补救',
      coreFeature: '他把家庭包当成一套长期学习资源，愿意提前配置，但前提是孩子真的会用、资源真的能发挥作用。',
      businessInsight: '对这类家庭，要讲清楚未来哪些节点会用、不同孩子怎么接续使用、孩子如何保持使用、课程是否会持续更新。家庭包的最大说服力不是“买下很多内容”，而是“这些内容未来真的能被用起来”。',
      narrative: [
        {
          heading: '两个孩子，一个低年级，一个处在小升初前后阶段。',
          points: [],
        },
        {
          heading: '他的购买触发，是“不想走到必须线下补课那一步”。',
          points: [
            {
              text: '他受到教育规划类内容影响，更倾向于提前准备，而不是等问题出现后被动补救；因此，家庭包在这个家庭里像一套提前放好的资源库。',
              quotes: ['阿刘教育规划训练营知道的洋葱，不想等出现问题的时候再来，就提前去做一些准备吧；如果说读到初二、初三，发现我数学很差了，到那个时候再去赶，可能就真的只能跟着线下老师去补习班了。'],
            },
          ],
        },
        {
          heading: '他愿意买好的，但非常在意有没有真正用起来。',
          points: [
            { text: '刘爸爸的消费观不是“便宜就行”，而是“可以买最好，但一定要发挥作用”。' },
            {
              text: '对他来说，如果孩子不用，再便宜也是浪费。',
              quotes: ['可以买最好，但是一定要发挥出东西。不能说放在那里，你就是再便宜的东西放在那里，它也浪费钱。'],
            },
          ],
        },
        {
          heading: '“多孩共用”是他判断家庭包值得的重要依据。',
          points: [
            {
              text: '他会自然地从家庭资源复用角度理解家庭包：大孩能用，小孩未来还能接着用，会让长期包更有性价比。',
              quotes: ['我买衣服我都考虑到大的能穿，小的还能穿是最好，赚钱也不容易。'],
            },
          ],
        },
        {
          heading: '这个家庭最大的顾虑，是孩子能不能长期愿意用。',
          points: [
            { text: '孩子不排斥，是家庭包成立的第一步。' },
            {
              text: '但长期来看，家长仍然关心孩子能不能坚持、课程会不会持续更新、平台是否稳定。',
              quotes: [
                '小孩来说，至少他不排斥。我说你用的洋葱上课吧，他自己会去点开来。',
                '如果他能一直坚持用下去，我觉得一切都值得，我就怕这个他不愿意用。不愿意用钱也白花了，是吧？',
              ],
            },
          ],
        },
      ],
    },
  },
];

const soft = (color: string) => `${color}14`;

export default function TypicalFamilyStories() {
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const sectionRefs = React.useRef<Record<string, HTMLElement | null>>({});
  const [activeId, setActiveId] = React.useState(PERSONAS[0].id);
  const activeAccent = PERSONAS.find((persona) => persona.id === activeId)?.accent ?? PERSONAS[0].accent;

  React.useEffect(() => {
    const root = scrollRef.current;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target instanceof HTMLElement && visible.target.dataset.id) setActiveId(visible.target.dataset.id);
      },
      { root, rootMargin: '-45% 0px -45% 0px', threshold: [0, 0.2, 0.5, 1] },
    );
    Object.values(sectionRefs.current).forEach((element) => element && observer.observe(element));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="flex h-full flex-col bg-[#f8f8f5]">
      <div ref={scrollRef} className="min-h-0 flex-1 overflow-y-auto">
        <div className="sticky top-0 z-20 border-b border-[#e4e2da] bg-white/95 px-5 py-3 backdrop-blur md:px-8">
          <div className="mx-auto max-w-[940px]">
            <div className="flex items-center gap-2" style={{ color: activeAccent }}>
              <Sparkles size={15} />
              <span className="text-[11px] font-black tracking-[0.14em]">用户画像与典型家庭故事 · 家庭包</span>
            </div>
            <div className="mt-2.5 flex flex-wrap gap-1.5">
              {PERSONAS.map((persona) => {
                const active = persona.id === activeId;
                return (
                  <button
                    key={persona.id}
                    onClick={() => sectionRefs.current[persona.id]?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
                    className={cn('flex items-center gap-1.5 rounded-xl px-3 py-2 text-[12.5px] font-bold transition-all', active ? 'text-white shadow-sm' : 'bg-[#f4f1eb] text-[#6b655c] hover:bg-[#eee9e0]')}
                    style={active ? { background: persona.accent } : undefined}
                  >
                    <span className="text-[10px] font-black" style={!active ? { color: persona.accent } : undefined}>{persona.index}</span>
                    {persona.name}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-[940px] px-5 md:px-8">
          {PERSONAS.map((persona) => (
            <section
              key={persona.id}
              data-id={persona.id}
              ref={(element) => { sectionRefs.current[persona.id] = element; }}
              className="scroll-mt-24 border-b border-[#e4e2da] py-9 last:border-0"
            >
              <TypeHero persona={persona} />
              <PortraitSection persona={persona} />
              <StorySection persona={persona} />
            </section>
          ))}
          <p className="my-10 rounded-xl border border-[#e4e2da] bg-[#f4f2ec] p-4 text-[11px] leading-5" style={{ color: MUTED }}>
            页面内容对齐《家庭包用户购买决策洞察》“主页面 4：典型家庭故事”，用户画像、代表案例和用户原声均按文档结构呈现。
          </p>
        </div>
      </div>
    </div>
  );
}

function TypeHero({ persona }: { persona: FamilyPersona }) {
  return (
    <motion.div {...reveal} className="flex items-end gap-3">
      <span className="text-5xl font-black leading-none md:text-6xl" style={{ color: persona.accent }}>{persona.index}</span>
      <div className="pb-1">
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="text-2xl font-black md:text-3xl" style={{ color: INK }}>{persona.name}</h1>
          <span className="rounded px-2 py-0.5 text-[11px] font-black" style={{ background: soft(persona.accent), color: persona.accent }}>{persona.keyword}</span>
        </div>
        <p className="mt-1.5 text-[14px] font-semibold text-[#4a453f]">{persona.tagline}</p>
      </div>
    </motion.div>
  );
}

function SectionHeader({ icon: Icon, label, subtitle, accent }: { icon: IconType; label: string; subtitle: string; accent: string }) {
  return (
    <div className="flex items-start gap-3 border-b border-[#e4e2da] pb-3">
      <span className="mt-1 grid h-8 w-8 shrink-0 place-items-center rounded-lg" style={{ background: soft(accent), color: accent }}><Icon size={16} /></span>
      <div>
        <h2 className="text-[17px] font-black" style={{ color: INK }}>{label}</h2>
        <p className="mt-0.5 text-[12.5px]" style={{ color: MUTED }}>{subtitle}</p>
      </div>
    </div>
  );
}

function PortraitSection({ persona }: { persona: FamilyPersona }) {
  const { portrait, accent } = persona;
  const rows = [
    { label: '销售特征识别标签', items: portrait.recognitionLabels, highlighted: true },
    { label: '基本情况', items: portrait.basicSituation },
    { label: '购买动机', items: portrait.purchaseMotivation },
    { label: '家庭包为什么成立', items: portrait.familyPackageReasons },
    { label: '关键顾虑及化解方式', items: portrait.concerns, intro: portrait.concernIntro, concern: true },
  ];

  return (
    <section className="mt-8">
      <SectionHeader icon={Users} label="用户画像" subtitle={`${persona.name}：销售识别、基本情况、动机、成立原因与顾虑`} accent={accent} />
      <motion.div {...reveal} className="mt-5 overflow-hidden rounded-2xl border border-[#dcd9d1] bg-white shadow-sm">
        <div className="grid border-b border-[#e4e2da] md:grid-cols-[270px_1fr]">
          <figure className="flex items-center justify-center bg-[#faf9f6] p-4 md:border-r md:border-[#e4e2da]">
            <img
              src={`${BASE_PATH}${portrait.image}`}
              alt={portrait.imageAlt}
              className="max-h-[360px] w-full rounded-xl object-contain"
              loading="lazy"
            />
          </figure>
          <div className="flex flex-col justify-center p-5 md:p-8">
            <div className="flex items-center gap-2 text-[11px] font-black tracking-[0.12em]" style={{ color: accent }}>
              <span className="h-2 w-2 rounded-full" style={{ background: accent }} />
              {persona.name}
            </div>
            <p className="mt-4 text-[18px] font-black leading-9 md:text-[21px]" style={{ color: INK }}>{persona.tagline}</p>
            <p className="mt-4 text-[12px] font-semibold leading-6" style={{ color: MUTED }}>画像信息按研究文档原始结构整理，便于销售快速识别与判断。</p>
          </div>
        </div>
        <div className="divide-y divide-[#e4e2da]">
          {rows.map((row) => (
            <ProfileRow
              key={row.label}
              label={row.label}
              items={row.items}
              intro={row.intro}
              highlighted={row.highlighted}
              concern={row.concern}
              accent={accent}
            />
          ))}
        </div>
      </motion.div>
    </section>
  );
}

function ProfileRow({
  label,
  items,
  intro,
  highlighted = false,
  concern = false,
  accent,
}: {
  label: string;
  items: string[];
  intro?: string;
  highlighted?: boolean;
  concern?: boolean;
  accent: string;
}) {
  return (
    <div className="grid sm:grid-cols-[170px_1fr]">
      <div className="flex items-center bg-[#f5f6f7] px-4 py-4 text-[12.5px] font-black leading-6 text-[#3e3a36] sm:justify-center sm:border-r sm:border-[#e4e2da] sm:text-center">
        {label}
      </div>
      <div className={cn('px-4 py-4 md:px-6', highlighted && 'bg-[#eef3ff]')}>
        {intro && <p className="mb-2.5 text-[13px] font-semibold leading-7 text-[#4a453f]">{intro}</p>}
        <ul className="space-y-2">
          {items.map((item) => (
            <li key={item} className="flex items-start gap-2.5 text-[13px] leading-7 text-[#4a453f]">
              {concern ? (
                <AlertTriangle size={14} className="mt-1.5 shrink-0" style={{ color: accent }} />
              ) : (
                <CheckCircle2 size={14} className="mt-1.5 shrink-0" style={{ color: accent }} />
              )}
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function StorySection({ persona }: { persona: FamilyPersona }) {
  const { story, accent } = persona;
  return (
    <section className="mt-12">
      <SectionHeader icon={BookOpenCheck} label="典型家庭故事" subtitle="该类型中的一户代表家庭 · 真实访谈还原" accent={STORY} />
      <motion.div {...reveal} className="mt-5 overflow-hidden rounded-2xl border bg-white shadow-sm" style={{ borderColor: `${accent}55` }}>
        <div className="px-5 py-5 md:px-7" style={{ background: soft(accent) }}>
          <div className="flex items-start gap-3">
            <Lightbulb size={19} className="mt-1 shrink-0" style={{ color: accent }} />
            <h3 className="text-[16px] font-black leading-8 md:text-[19px]" style={{ color: INK }}>代表案例：{story.banner}</h3>
          </div>
        </div>
        <div className="grid gap-px bg-[#e4e2da] md:grid-cols-2">
          <div className="bg-white p-5 md:p-6">
            <div className="text-[12px] font-black" style={{ color: accent }}>核心特征</div>
            <p className="mt-3 text-[13.5px] font-semibold leading-8 text-[#3f3a35]">{story.coreFeature}</p>
          </div>
          <div className="bg-white p-5 md:p-6">
            <div className="text-[12px] font-black" style={{ color: accent }}>业务启发</div>
            <p className="mt-3 text-[13.5px] font-semibold leading-8 text-[#3f3a35]">{story.businessInsight}</p>
          </div>
        </div>
      </motion.div>
      <NarrativeBlock narrative={story.narrative} accent={accent} />
    </section>
  );
}

function NarrativeBlock({ narrative, accent }: { narrative: FamilyPersona['story']['narrative']; accent: string }) {
  return (
    <div className="mt-7">
      <div className="mb-4 flex items-center gap-2">
        <span className="h-5 w-1 rounded-full" style={{ background: STORY }} />
        <h4 className="text-[14px] font-black" style={{ color: INK }}>访谈还原 · 她 / 他为什么这样选</h4>
      </div>
      <ol className="relative space-y-5 border-l-2 pl-7" style={{ borderColor: `${accent}33` }}>
        {narrative.map((segment, index) => (
          <motion.li
            {...reveal}
            transition={{ ...reveal.transition, delay: index * 0.05 }}
            key={segment.heading}
            className="relative rounded-xl border border-[#e7e5de] bg-white p-4 md:p-5"
          >
            <span className="absolute -left-[39px] top-4 grid h-6 w-6 place-items-center rounded-full text-[10px] font-black text-white" style={{ background: accent }}>{index + 1}</span>
            <h5 className="text-[15px] font-black leading-7 md:text-[16px]" style={{ color: INK }}>{segment.heading}</h5>
            {segment.points.length > 0 && (
              <div className="mt-3 space-y-3">
                {segment.points.map((point, pointIndex) => (
                  <div key={`${point.text}-${pointIndex}`} className="space-y-2">
                    <div className="flex items-start gap-2.5">
                      <span className="mt-[11px] h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: `${accent}99` }} />
                      <p className="text-[13.5px] font-medium leading-7 text-[#4a453f]">{point.text}</p>
                    </div>
                    {point.quotes?.map((quote) => (
                      <blockquote
                        key={quote}
                        className="ml-4 flex gap-2 rounded-lg px-3.5 py-2.5 text-[12.5px] italic leading-7"
                        style={{ background: soft(accent), color: '#746e67' }}
                      >
                        <Quote size={14} className="mt-1 shrink-0" style={{ color: accent }} />
                        <span>「{quote}」</span>
                      </blockquote>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </motion.li>
        ))}
      </ol>
    </div>
  );
}
