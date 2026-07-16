import React from 'react';
import {
  ArrowDown,
  ArrowRight,
  BadgeCheck,
  BookOpen,
  CircleCheck,
  Eye,
  FileText,
  Headphones,
  Layers,
  Quote,
  Sparkles,
  TriangleAlert,
} from 'lucide-react';
import EvidenceAudioClips from '@/components/EvidenceAudioClips';
import type { EvidenceClip } from '@/utils/evidenceClipLookup';
import { cn } from '@/lib/utils';

// summary-demo-legacy：把「主页面 2：核心结论」重构为编辑部叙事 × 真实声场的深度专题。
// 内容全部取自飞书主页面 2（成交原因 / 未成交卡点 / 产品体验）原文，不增删、不编造；
// 原文配图以「原生数据证据卡」呈现（数据来自原文图注），录音仅在与原文引文一致时挂载播放器。

const SOURCE_URL =
  'https://guanghe.feishu.cn/wiki/XvjcwdzsZiEiJ1kF9UOcburXnig?from=from_copylink';

/* --------------------------- 通用：减少动态 & 滚动揭示 --------------------------- */

function useReducedMotion() {
  const [reduced, setReduced] = React.useState(false);
  React.useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => setReduced(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);
  return reduced;
}

function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [shown, setShown] = React.useState(false);
  const reduced = useReducedMotion();

  React.useEffect(() => {
    if (reduced) {
      setShown(true);
      return;
    }
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0.06 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [reduced]);

  return (
    <div
      ref={ref}
      style={{ transitionDelay: shown ? `${delay}ms` : '0ms' }}
      className={cn(
        'transition-[opacity,transform] duration-[650ms] ease-out will-change-transform',
        shown
          ? 'translate-y-0 scale-100 opacity-100'
          : 'translate-y-6 scale-[0.985] opacity-0',
        className,
      )}
    >
      {children}
    </div>
  );
}

/* --------------------------------- 高亮 & 结构件 --------------------------------- */

function Hi({
  children,
  color = '#FFCF4A',
  className,
}: {
  children: React.ReactNode;
  color?: string;
  className?: string;
}) {
  return (
    <span className={cn('relative inline-block', className)}>
      <span
        className="absolute inset-x-[-3px] bottom-[3px] -z-10 h-[34%] -rotate-1"
        style={{ backgroundColor: color }}
      />
      {children}
    </span>
  );
}

function ChapterMarker({
  number,
  label,
  tone = 'dark',
}: {
  number: string;
  label: string;
  tone?: 'dark' | 'light';
}) {
  const light = tone === 'light';
  return (
    <div
      className={cn(
        'mb-10 flex items-center gap-3 text-[11px] font-black tracking-[0.16em]',
        light ? 'text-white/60' : 'text-[#83796E]',
      )}
    >
      <span
        className={cn(
          'grid size-8 place-items-center rounded-full border',
          light
            ? 'border-white/30 text-[#C9FF5B]'
            : 'border-[#BFB3A6] text-[#9C4A2F]',
        )}
      >
        {number}
      </span>
      {label}
    </div>
  );
}

function SubHead({
  kicker,
  title,
  tone = 'dark',
}: {
  kicker: string;
  title: React.ReactNode;
  tone?: 'dark' | 'light';
}) {
  const light = tone === 'light';
  return (
    <div className="mb-9">
      <p
        className={cn(
          'text-[11px] font-black tracking-[0.16em]',
          light ? 'text-[#C9FF5B]' : 'text-[#9C4A2F]',
        )}
      >
        {kicker}
      </p>
      <h3
        className={cn(
          'mt-3 text-[26px] font-black leading-[1.28] tracking-[-0.02em] md:text-[32px]',
          light ? 'text-white' : 'text-[#25211D]',
        )}
      >
        {title}
      </h3>
    </div>
  );
}

/* ------------------------------------ 原声件 ------------------------------------ */

type Voice = { text: string; source: string; clipUrl?: string };

function VoiceLead({
  voice,
  eyebrow,
  dark = false,
}: {
  voice: Voice;
  eyebrow: string;
  dark?: boolean;
}) {
  const clips: EvidenceClip[] = voice.clipUrl
    ? [{ clipUrl: voice.clipUrl, startTime: 0, duration: 0 }]
    : [];
  return (
    <figure
      className={cn(
        'border-l-[3px] pl-5 md:pl-7',
        dark ? 'border-[#C9FF5B]' : 'border-[#191816]',
      )}
    >
      <figcaption
        className={cn(
          'mb-4 flex items-center gap-2 text-[11px] font-black tracking-[0.16em]',
          dark ? 'text-[#C9FF5B]' : 'text-[#9C4A2F]',
        )}
      >
        {voice.clipUrl ? <Headphones size={14} /> : <Quote size={14} />}
        {eyebrow}
      </figcaption>
      <blockquote
        className={cn(
          'text-[19px] font-black leading-[1.7] md:text-[23px]',
          dark ? 'text-white' : 'text-[#25211D]',
        )}
      >
        “{voice.text}”
      </blockquote>
      <p
        className={cn(
          'mt-4 text-[12px] font-bold',
          dark ? 'text-white/55' : 'text-[#8A7E71]',
        )}
      >
        — {voice.source}
      </p>
      {voice.clipUrl ? (
        <EvidenceAudioClips clips={clips} className="mt-4 max-w-[360px]" />
      ) : (
        <p
          className={cn(
            'mt-3 text-[11px] font-semibold',
            dark ? 'text-white/35' : 'text-[#B4A99B]',
          )}
        >
          （该原声暂无录音切片，保留完整文字）
        </p>
      )}
    </figure>
  );
}

function VoiceCard({ voice }: { voice: Voice }) {
  const clips: EvidenceClip[] = voice.clipUrl
    ? [{ clipUrl: voice.clipUrl, startTime: 0, duration: 0 }]
    : [];
  return (
    <div className="rounded-[14px] border border-[#E6DBCC] bg-white/70 p-4">
      <div className="flex items-start gap-2">
        <Quote size={13} className="mt-1 shrink-0 text-[#C99B54]" />
        <p className="text-[14px] font-semibold leading-[1.7] text-[#4C453D]">
          {voice.text}
        </p>
      </div>
      <p className="mt-2.5 pl-[21px] text-[11px] font-bold text-[#A2978A]">
        — {voice.source}
      </p>
      {voice.clipUrl ? (
        <EvidenceAudioClips clips={clips} className="ml-[21px] mt-1" />
      ) : null}
    </div>
  );
}

function VoiceGroup({ voices, title }: { voices: Voice[]; title?: string }) {
  return (
    <div>
      {title && (
        <div className="mb-3 flex items-center gap-1.5 text-[10.5px] font-black tracking-[0.12em] text-[#9C4A2F]">
          <Headphones size={12} />
          {title}
        </div>
      )}
      <div className="grid gap-3 md:grid-cols-2">
        {voices.map((v, i) => (
          <VoiceCard key={v.text + i} voice={v} />
        ))}
      </div>
    </div>
  );
}

/* ------------------------------- 数据证据卡（原文配图） ------------------------------- */

function EvidenceFigure({
  caption,
  children,
}: {
  caption: string;
  children: React.ReactNode;
}) {
  return (
    <figure className="rounded-[16px] border border-[#E4D9C9] bg-white p-5 md:p-6">
      {children}
      <figcaption className="mt-4 flex items-start gap-1.5 border-t border-[#F0E8DB] pt-3 text-[10.5px] font-semibold leading-5 text-[#A99E8F]">
        <FileText size={12} className="mt-0.5 shrink-0" />
        {caption}
      </figcaption>
    </figure>
  );
}

function DataBars({
  data,
  unit = '%',
  color = '#E95B35',
}: {
  data: { label: string; value: number; hint?: string }[];
  unit?: string;
  color?: string;
}) {
  const max = Math.max(...data.map((d) => d.value), 1);
  return (
    <div className="space-y-3">
      {data.map((d) => {
        const ratio = d.value / max;
        return (
          <div
            key={d.label}
            className="grid grid-cols-[minmax(0,132px)_minmax(0,1fr)_52px] items-center gap-3"
          >
            <span
              className="truncate text-[12px] font-bold text-[#5B534A]"
              title={d.label}
            >
              {d.label}
            </span>
            <div
              className="h-3 w-full overflow-hidden rounded-full bg-[#F1Eadf]"
              role="meter"
              aria-valuenow={d.value}
              aria-valuemin={0}
              aria-valuemax={max}
              aria-label={d.label}
            >
              <div
                className="h-full rounded-full transition-[width] duration-700 ease-out"
                style={{
                  width: `${ratio * 100}%`,
                  backgroundColor: color,
                  opacity: d.value > 0 ? 0.45 + 0.55 * ratio : 0,
                }}
              />
            </div>
            <span
              className="text-right text-[12.5px] font-black tabular-nums"
              style={{ color }}
            >
              {d.value}
              {unit}
            </span>
          </div>
        );
      })}
    </div>
  );
}

/* ------------------------------------ 数据 ------------------------------------ */

const HERO_VOICE: Voice = {
  text: '首先是孩子能看得进去，看得进去的话，想教他的知识，他才能听进去，学进去。',
  source: '用户7｜二年级｜山东潍坊',
  clipUrl: '/clips/interview7/0208-01.mp3',
};

const CHAPTERS = [
  { id: 'ch1', no: '01', q: '为什么成交？', hint: '品类动机与产品决策', color: '#C58A3D' },
  { id: 'ch2', no: '02', q: '为什么没有成交？', hint: '两个无法确认的问题', color: '#C0685C' },
  { id: 'ch3', no: '03', q: '买后体验到底怎么样？', hint: '使用场景与优劣势', color: '#2F9F8F' },
];

// 品类动机 · 兴趣入口
const INTEREST_VOICES: Voice[] = [
  {
    text: '首先是孩子能看得进去，看得进去的话，想教他的知识，他才能听进去，学进去。',
    source: '用户7｜二年级｜山东潍坊',
    clipUrl: '/clips/interview7/0208-01.mp3',
  },
  {
    text: '我是基于我们家孩子喜欢，我才付费去买这个课程的。',
    source: '用户4｜二年级｜北京顺义',
  },
];

// 品类动机 · 未来学科价值
const FUTURE_VALUE_VOICES: Voice[] = [
  {
    text: '因为以后到初中也会学到物理。然后可以提前让他认识知道一些跟物理相关的知识。',
    source: '用户3｜二年级｜广东中山',
  },
  {
    text: '初中、高中肯定都会有这个课程，那提前小学现在这个阶段，通过各种渠道让他先接触一下，了解一下相关知识，然后他之后学起来可能不会很吃力。',
    source: '用户7｜二年级｜山东潍坊',
  },
  {
    text: '最少他上初中、高中学习物理不会那么吃力吧？因为他小时候就喜欢接触，应该是有点帮助。',
    source: '用户8｜一年级｜安徽合肥',
    clipUrl: '/clips/interview8/0001-01.mp3',
  },
];

// 品类定位 · 匿名原声（原文引号，无编号）
const POSITION_VOICES: Voice[] = [
  { text: '不需要提前学完初中内容，能确保以后正式学时不陌生就可以了。', source: '访谈原声' },
  { text: '到真正学物理的时候，讲到的时候孩子都知道，比其他同学更好吸收。', source: '访谈原声' },
  { text: '初中学印象中有这个东西，不排斥这个学科就好。', source: '访谈原声' },
];

// 问卷：家长对课程的定位（n=41，数据来自原文配图图注）
const POSITION_SURVEY = [
  { label: '小学阶段学科启蒙课', value: 29.27 },
  { label: '有营养的动画/视频内容', value: 14.63 },
  { label: '科普百科拓展', value: 14.63 },
  { label: '小初理科衔接课', value: 14.63 },
  { label: '初中课程提前学', value: 14.63 },
  { label: '科学实验/动手探索课', value: 12.2 },
  { label: '其他', value: 0 },
];

// 内部销售数据（数据来自原文配图图注）
const SALES_TABLE = [
  { grade: '二年级', overall: 18, media: 20, app: 16, tele: 21 },
  { grade: '三年级', overall: 27, media: 27, app: 28, tele: 21 },
];

// 竞品单点爆破
const COMPETITORS = [
  {
    name: 'NB 实验室',
    hook: '模拟触屏操作方便，能规避危险实验',
    tone: '#DDF5EF',
    voices: [
      {
        text: 'NB实验室是因为我当时觉得他那个操作比较方便一点，他演示的操作看上去比较直观。',
        source: '用户1｜二年级｜山东济宁',
      },
      {
        text: '比较吸引我的就是有一些比较危险的一些实验，可以在比较安全的这种情况下能让孩子了解到。',
        source: '用户1｜二年级｜山东济宁',
      },
    ] as Voice[],
  },
  {
    name: '学而思科学 / 赛先生',
    hook: '真人老师动手实验，参与感强',
    tone: '#FFDCD6',
    voices: [
      { text: '很好，讲得特别好，老师特别有吸引力。', source: '用户8｜一年级｜安徽合肥' },
      {
        text: '学而思科学课主要老师备课备得好呀，然后孩子很感兴趣呀。',
        source: '用户8｜一年级｜安徽合肥',
      },
      {
        text: '学而思的那个他会寄实验器材、实验材料，让我们自己来做，也很棒。',
        source: '用户8｜一年级｜安徽合肥',
      },
    ] as Voice[],
  },
  {
    name: '妙懂物理',
    hook: 'AR 形式有趣',
    tone: '#E8E1FF',
    voices: [
      {
        text: '我想让他玩那个 AR，但是买了以后他就只玩那个 AR，里面的东西他也不太爱看。',
        source: '用户5｜三年级｜重庆渝中',
      },
    ] as Voice[],
  },
  {
    name: '万物指南',
    hook: '不刷题的吴姥姥，IP 权威',
    tone: '#FFE8BA',
    voices: [
      {
        text: '因为我就觉着他万物指南的团队比较靠谱，因为他不是个什么不刷题的吴姥姥吗？',
        source: '用户1｜二年级｜山东济宁',
      },
      {
        text: '我觉得吴姥姥既然她比较靠谱，她也不会去找不靠谱的团队合作吧；因为她这种已经荣誉加身的人，然后比较爱惜羽毛一点。',
        source: '用户1｜二年级｜山东济宁',
      },
    ] as Voice[],
  },
];

// 洋葱：品牌信任 + 顺手加购
const ONION_BUY_VOICES: Voice[] = [
  { text: '名校的光环，就是觉得这个人还是挺信得过的。', source: '用户4｜二年级｜北京顺义' },
  { text: '就基于他信任，然后其他的话都是随缘。', source: '用户4｜二年级｜北京顺义' },
  {
    text: '就是因为给姐姐买了高中物理，然后就顺着推荐；弟弟看到里面有从小学物理，就想学，后来发现要收费，我就买了。',
    source: '用户8｜一年级｜安徽合肥',
  },
];

// 最专业的学科启蒙课：系统性 / 专业性 / 丰富性
const PRO_PILLARS = [
  {
    tag: '系统性',
    icon: Layers,
    points: [
      '课程设计系统：目录框架式设计，将 300+ 个生活现象融入三大篇章（基础篇 / 进阶篇 / 挑战篇），从基础到挑战的梯度启蒙。',
      '知识点覆盖系统：启蒙内容与人教版初中教材开篇要求一致（机械运动、声现象、物态变化、光现象、透镜、质量与密度……），衔接不脱节。',
    ],
  },
  {
    tag: '专业性',
    icon: BadgeCheck,
    points: [
      '老师专业：中考命题专家、竞赛专家、资深教研老师带队设计（谢虹、王少芳、朱若辰、高昕、甄鸿祥、李夏）。',
      '讲解专业：3 大独创思维模型「抽象—推理—应用」，帮孩子从表象到本质、从现象到规律。',
    ],
  },
  {
    tag: '丰富性',
    icon: Sparkles,
    points: ['知识点丰富：小初 900+ 个知识点。', '实验丰富：300+ 个真动手实验。'],
  },
];

// 未成交卡点 · 弹幕（取自原文顾虑与引文片段）
const CONCERN_DANMU = [
  '不确定孩子会不会坚持看',
  '有时候孩子会忘记看',
  '不确定看完到底有没有学到',
  '到底学了什么东西？',
  '学了多少？能记住什么？',
  '到初中正式学物理才能看出来',
  '一年级时好像没有特别感兴趣',
  '所以会提醒孩子去看一下',
  '现在没法判断',
  '他到底学了什么？',
];

// 卡点原声
const CONCERN_KEEP_VOICES: Voice[] = [
  {
    text: '当时比如一年级，我让他看的时候他在看，但是好像没有特别感兴趣……但是现在看的话就是真的还是挺认真的，挺感兴趣的。',
    source: '用户5｜三年级｜重庆渝中',
    clipUrl: '/clips/interview5/0045-01.mp3',
  },
  { text: '有时候孩子会忘记看，所以会提醒孩子去看一下。', source: '用户4｜二年级｜北京顺义' },
];
const CONCERN_LEARN_VOICES: Voice[] = [
  {
    text: '我想知道他到底学了什么东西？学到了什么东西？学了多少？能记住什么？',
    source: '用户5｜三年级｜重庆渝中',
    clipUrl: '/clips/interview5/0057-01.mp3',
  },
  { text: '到初中正式学物理才能看出来，现在没法判断。', source: '访谈原声' },
];

// 卡点业务启发
const KEEP_ACTIONS = [
  {
    title: '数千家庭的选择，买回家不吃灰',
    text: '1353 个家庭，人均观看 86 次；购买后第 1 周人均观看 21.69 次，全量付费用户人均每月看 17 节。',
  },
  {
    title: '趣味动画课，孩子更能看得进去',
    text: '650+ 节动画视频课，用孩子愿意看的形式传递知识，让物理从课本上的概念，变成一个个好玩的小故事。',
  },
  {
    title: '跟着做的实验，动手把兴趣留住',
    text: '制作热气球、潜望镜、乐器、造云…… 300+ 个真动手实验，孩子能跟着亲手尝试，参与感拉满。',
  },
];

// 典型使用场景
const SCENE_STEPS = [
  ['碎片时间', '周末 / 假期、主科学习间隙'],
  ['孩子主动点开', '感兴趣想看时自己打开'],
  ['低压力观看', '单视频几分钟，无负担'],
  ['家长偶尔陪伴', '偶尔一起看、偶尔提醒'],
];
const SCENE_VOICES: Voice[] = [
  {
    text: '这些看的，看这些的话就是零碎的时间看。比如吃饭……星期六、星期天出去玩，他玩累了，休息的时候他也可能去看一下。',
    source: '用户5｜三年级｜重庆渝中',
  },
  {
    text: '洋葱学园的从小学物理，如果说我不是不管的话，他每天他都会刷。',
    source: '用户4｜二年级｜北京顺义',
    clipUrl: '/clips/interview4/0041-01.mp3',
  },
];

// 体验优劣势矩阵（4 产品，取自原文嵌入表格）
const EXPERIENCE_MATRIX: {
  product: string;
  highlight?: boolean;
  pro: { summary: string; voices: Voice[] };
  con: { summary: string; voices: Voice[] };
}[] = [
  {
    product: '从小学物理',
    highlight: true,
    pro: {
      summary: '课程内容有趣，孩子愿意主动看',
      voices: [
        {
          text: '他自己会学习洋葱学园里边的从小学物理……定了 15 到 20 分钟之后，他还会往下串表，特别喜欢。',
          source: '用户4｜二年级｜北京顺义',
        },
        {
          text: '洋葱学园的从小学物理，如果说我不是不管的话，他每天他都会刷。',
          source: '用户4｜二年级｜北京顺义',
          clipUrl: '/clips/interview4/0041-01.mp3',
        },
      ],
    },
    con: {
      summary: '部分表达对小低孩子仍偏难，答题文字识别也会影响体验。',
      voices: [
        {
          text: '有些晦涩难懂的词语小低孩子不能理解，如果口语化更好。',
          source: '用户4｜二年级｜北京顺义',
        },
        {
          text: '答题正确率高，字不认识，如果读出来更好。',
          source: '用户4｜二年级｜北京顺义',
        },
      ],
    },
  },
  {
    product: '万物指南 / 物理十分通',
    pro: {
      summary: '1、专业背书强　2、内容简洁高质',
      voices: [
        {
          text: '万物指南的团队比较靠谱，因为他不是个什么不刷题的吴姥姥吗？',
          source: '用户1｜二年级｜山东济宁',
        },
        {
          text: '物理十分通里面非常简洁明了……没有过多的废话。',
          source: '用户1｜二年级｜山东济宁',
        },
      ],
    },
    con: {
      summary: '看完后家长不知道孩子吸收多少、记住多少，缺少可见的学习反馈。',
      voices: [
        {
          text: '我孩子把这个万物视频全部看完了，他能吸收多少呢？',
          source: '用户5｜三年级｜重庆渝中',
        },
        {
          text: '我想知道他到底学了什么东西？学到了什么东西？学了多少？能记住什么？',
          source: '用户5｜三年级｜重庆渝中',
          clipUrl: '/clips/interview5/0057-01.mp3',
        },
      ],
    },
  },
  {
    product: 'NB实验室',
    pro: {
      summary: '模拟实验直观，有触屏参与感，也能安全展示危险实验。',
      voices: [
        {
          text: 'NB实验室……操作比较方便一点，演示的操作看上去比较直观。',
          source: '用户1｜二年级｜山东济宁',
        },
        {
          text: '有一些比较危险的一些实验，可以在比较安全的这种情况下能让孩子了解到。',
          source: '用户1｜二年级｜山东济宁',
        },
      ],
    },
    con: {
      summary: '1、无法替代真实实验，参与感不如真人　2、低龄孩子自己操作时缺少讲解和引导，容易卡住。',
      voices: [
        { text: '你在视频上看他是完全感受不一样的。', source: '用户1｜二年级｜山东济宁' },
        {
          text: 'NB的话他得自己乱拖，他自己有些字还不认识，然后那实验操作的话，兴许他还做不好。',
          source: '用户4｜二年级｜北京顺义',
        },
      ],
    },
  },
  {
    product: '真人实验直播课（学而思科学 / 赛先生等）',
    pro: {
      summary: '真人老师带着做实验，互动和引导更强，孩子吸收更多。',
      voices: [
        {
          text: '有真人老师，老师也能照顾过来，孩子吸收的也多。老师会带着做实验讲解。',
          source: '用户4｜二年级｜北京顺义',
        },
      ],
    },
    con: {
      summary: '1、价格和进阶成本高；2、部分理论讲解仍不够儿童化。',
      voices: [
        {
          text: '如果要再进阶的话，还需要再付费……性价比确实不高。',
          source: '用户2｜三年级｜北京昌平',
        },
        {
          text: '老师讲解知识点也是有点问题，理论讲解不好，没用孩子的语言讲解。',
          source: '用户4｜二年级｜北京顺义',
        },
      ],
    },
  },
];

// 结尾原声：显示"效果正在发生"
const CLOSING_VOICE: Voice = {
  text: '当时比如一年级，我让他看的时候他在看，但是好像没有特别感兴趣……但是现在看的话就是真的还是挺认真的，挺感兴趣的。',
  source: '用户5｜三年级｜重庆渝中',
  clipUrl: '/clips/interview5/0045-01.mp3',
};

/* ------------------------------------ 页面 ------------------------------------ */

export default function ConclusionsDemo() {
  const [progress, setProgress] = React.useState(0);
  const [barColor, setBarColor] = React.useState('#E95B35');

  React.useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      const scrolled = h.scrollTop;
      const total = h.scrollHeight - h.clientHeight;
      setProgress(total > 0 ? Math.min(100, (scrolled / total) * 100) : 0);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  React.useEffect(() => {
    const ids = ['hero', ...CHAPTERS.map((c) => c.id)];
    const els = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el));
    if (els.length === 0) return;
    const io = new IntersectionObserver(
      (entries) => {
        const hit = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (!hit) return;
        const ch = CHAPTERS.find((c) => c.id === hit.target.id);
        setBarColor(ch ? ch.color : '#E95B35');
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: 0 },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <main className="min-h-full overflow-x-hidden bg-[#F7F3EC] text-[#191816]">
      {/* 顶部细阅读进度线 */}
      <div className="fixed inset-x-0 top-0 z-50 h-[3px] bg-transparent">
        <div
          className="h-full transition-[width,background-color] duration-300 ease-out"
          style={{ width: `${progress}%`, backgroundColor: barColor }}
        />
      </div>

      {/* ============================= 首屏 ============================= */}
      <section
        id="hero"
        className="relative isolate min-h-[calc(100vh-52px)] overflow-hidden border-b border-[#D7CCBF]"
      >
        <div className="pointer-events-none absolute -right-24 top-14 -z-10 size-[420px] rounded-full border-[72px] border-[#E95B35]/10 md:size-[620px]" />
        <div className="mx-auto flex min-h-[calc(100vh-52px)] max-w-[1280px] flex-col px-5 py-8 md:px-10 md:py-12 lg:px-14">
          <div className="flex items-center justify-between border-b border-[#CFC3B5] pb-4">
            <p className="text-[11px] font-black tracking-[0.18em] text-[#9C4A2F]">
              从小学系列售卖策略调研 · 核心结论
            </p>
            <a
              href={SOURCE_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-[12px] font-black text-[#5C554E] transition hover:text-[#E95B35]"
            >
              <FileText size={14} />
              查看研究素材
            </a>
          </div>

          <div className="grid flex-1 items-center gap-12 py-12 lg:grid-cols-[minmax(0,1.35fr)_minmax(320px,.65fr)] lg:gap-16">
            <Reveal>
              <p className="mb-7 inline-flex items-center gap-2 rounded-full border border-[#CFC3B5] px-3 py-1.5 text-[11px] font-black tracking-[0.12em] text-[#73695F]">
                <Sparkles size={13} className="text-[#E95B35]" />
                一句话总判断
              </p>
              <h1 className="max-w-[920px] text-[40px] font-black leading-[1.14] tracking-[-0.045em] sm:text-[54px] md:text-[68px] lg:text-[76px]">
                从小学物理，卖的不是
                <Hi>更早学物理</Hi>，
                <br className="hidden md:block" />
                而是一份
                <span className="text-[#E95B35]">「不陌生、不畏难」</span>
                的确定感。
              </h1>
              <p className="mt-8 max-w-[680px] text-[16px] font-semibold leading-8 text-[#655D54] md:text-[19px] md:leading-9">
                孩子因为有趣愿意看，家长因为未来学理科
                <span className="font-black text-[#191816]">不陌生、不畏难</span>
                而买单——真正的品类位置是介于纯兴趣与提前学之间的
                <Hi color="#C9FF5B">学科启蒙</Hi>。
              </p>

              <div className="mt-10 grid max-w-[640px] grid-cols-3 gap-3">
                {[
                  ['核心人群', '小学 1—4 年级'],
                  ['购买入口', '孩子愿意看'],
                  ['成交理由', '未来学理科更轻松'],
                ].map(([label, value]) => (
                  <div key={label} className="border-t-2 border-[#191816] pt-3">
                    <p className="text-[11px] font-bold text-[#83796E]">{label}</p>
                    <p className="mt-1.5 text-[14px] font-black leading-6 text-[#25211D] md:text-[16px]">
                      {value}
                    </p>
                  </div>
                ))}
              </div>
            </Reveal>

            <Reveal delay={120}>
              <div className="rounded-[18px] border border-[#E0D4C3] bg-white/70 p-6 md:p-7">
                <VoiceLead voice={HERO_VOICE} eyebrow="先听第一条真实声音" />
              </div>
            </Reveal>
          </div>

          <a
            href="#ch1"
            className="flex w-fit items-center gap-2 pb-1 text-[12px] font-black tracking-[0.12em] text-[#655D54]"
          >
            继续听用户怎么说
            <ArrowDown size={16} className="motion-safe:animate-bounce" />
          </a>
        </div>
      </section>

      {/* ============================= 全篇导航 ============================= */}
      <section className="border-b border-[#D7CCBF] bg-[#F7F3EC]">
        <div className="mx-auto max-w-[1280px] px-5 py-14 md:px-10 md:py-20 lg:px-14">
          <p className="mb-8 text-[11px] font-black tracking-[0.16em] text-[#83796E]">
            全篇围绕三个研究问题展开
          </p>
          <div className="grid gap-4 md:grid-cols-3">
            {CHAPTERS.map((c) => (
              <a
                key={c.id}
                href={`#${c.id}`}
                className="group flex flex-col justify-between rounded-[16px] border border-[#DDD1C2] bg-white/60 p-6 transition hover:-translate-y-0.5 hover:border-[color:var(--c)] hover:shadow-[0_18px_30px_-24px_rgba(60,45,30,0.5)]"
                style={{ ['--c' as string]: c.color }}
              >
                <div>
                  <span
                    className="text-[13px] font-black tracking-[0.14em]"
                    style={{ color: c.color }}
                  >
                    {c.no}
                  </span>
                  <p className="mt-4 text-[22px] font-black leading-8 text-[#25211D] md:text-[25px]">
                    {c.q}
                  </p>
                  <p className="mt-2 text-[13px] font-semibold text-[#8A7E71]">
                    {c.hint}
                  </p>
                </div>
                <ArrowRight
                  size={18}
                  className="mt-6 text-[#B2A598] transition group-hover:translate-x-1"
                  style={{ color: c.color }}
                />
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ============================= 章节一：成交原因 ============================= */}
      {/* —— 1. 品类动机（浅奶油黄） —— */}
      <section id="ch1" className="scroll-mt-2 bg-[#FFF9E8]">
        <div className="mx-auto max-w-[1280px] px-5 py-20 md:px-10 md:py-28 lg:px-14 lg:py-32">
          <ChapterMarker number="01" label="成交原因 · 品类动机" />
          <Reveal>
            <h2 className="max-w-[900px] text-[36px] font-black leading-[1.18] tracking-[-0.035em] md:text-[52px]">
              为初中理科学习，
              <br className="hidden md:block" />
              买一份<Hi>确定感</Hi>。
            </h2>
            <p className="mt-6 max-w-[560px] text-[16px] font-semibold leading-8 text-[#695F4D]">
              兴趣是入口，孩子喜欢家长才会考虑；但
              <span className="font-black text-[#25211D]">「未来学科价值」</span>
              才是最终合理化购买的理由。
            </p>
          </Reveal>

          {/* 用研洞察 · 前提：兴趣入口 */}
          <div className="mt-16 space-y-16">
            <Reveal>
              <SubHead
                kicker="用研洞察 · 前提"
                title={<>兴趣是入口，孩子喜欢家长才会考虑</>}
              />
              <div className="grid grid-cols-2 border-y border-[#CDBE8B]">
                {[
                  ['53%', '趣味动画课（TOP 1）'],
                  ['40%', '孩子喜欢（TOP 2）'],
                ].map(([v, l]) => (
                  <div
                    key={v}
                    className="border-r border-[#CDBE8B] px-3 py-6 last:border-r-0 md:px-5"
                  >
                    <p className="text-[34px] font-black tracking-[-0.04em] text-[#E95B35] md:text-[46px]">
                      {v}
                    </p>
                    <p className="mt-2 text-[12px] font-bold leading-5 text-[#746A56]">
                      {l}
                    </p>
                  </div>
                ))}
              </div>
              <p className="mt-3 text-[11px] font-semibold text-[#A89A72]">
                问卷调研「成交被打动因素」排名
              </p>
              <div className="mt-8">
                <VoiceGroup voices={INTEREST_VOICES} title="访谈录音片段" />
              </div>
            </Reveal>

            <Reveal className="border-t border-[#E4D7B4] pt-14" delay={80}>
              <SubHead
                kicker="用研洞察 · 核心"
                title={<>「未来学科价值」才是最终合理化购买的理由</>}
              />
              {/* 递进链路 */}
              <div className="mb-9">
                {['孩子觉得有趣', '家长开始考虑', '未来学科价值成立', '最终完成购买'].map(
                  (t, i, arr) => (
                    <div
                      key={t}
                      className="relative grid grid-cols-[40px_1fr] items-center gap-3 border-b border-[#D5C89A] py-4 first:pt-0"
                    >
                      <span className="text-[12px] font-black text-[#A5945C]">
                        0{i + 1}
                      </span>
                      <p className="text-[16px] font-black text-[#25211D] md:text-[18px]">
                        {t}
                      </p>
                      {i < arr.length - 1 && (
                        <ArrowDown
                          size={16}
                          className="absolute -bottom-[8px] left-[12px] z-10 bg-[#FFF9E8] text-[#A5945C]"
                        />
                      )}
                    </div>
                  ),
                )}
              </div>
              <div className="mb-6 inline-flex items-baseline gap-2 rounded-full bg-[#E95B35]/10 px-4 py-2">
                <span className="text-[22px] font-black text-[#E95B35]">31%</span>
                <span className="text-[12px] font-bold text-[#8A6A2F]">
                  期待孩子未来进初中后，学理科时能更快听懂（TOP 1）
                </span>
              </div>
              <VoiceGroup voices={FUTURE_VALUE_VOICES} title="访谈录音片段" />
              <div className="mt-6 rounded-[14px] border border-dashed border-[#CDBE8B] bg-white/50 p-4 text-[13px] font-semibold leading-7 text-[#6B6046]">
                <span className="font-black text-[#9C4A2F]">竞品分析：</span>
                物理十分通卖「孩子将来上初中，物理会跟不上」的预防焦虑，妙懂卖「初中物理课听不懂，我辅导不了」的辅导焦虑，NB
                实验室卖「初高中实验全覆盖」——本质都在指向
                <Hi color="#FFCF4A">学科</Hi>。
              </div>
            </Reveal>
          </div>

          {/* 业务启发 · 品类定位 + 目标人群 */}
          <Reveal>
            <div className="mt-20 border-t-2 border-[#191816] pt-10">
              <SubHead
                kicker="业务启发"
                title={
                  <>
                    结合品类需求，洋葱该占据
                    <Hi color="#C9FF5B">「学科启蒙」</Hi>
                    这片蓝海
                  </>
                }
              />
              <p className="max-w-[720px] text-[15px] font-semibold leading-8 text-[#695F4D]">
                家长需求介于「纯兴趣启蒙」和「小初衔接提前学」之间，更准确的品类位置是
                <span className="font-black text-[#25211D]">学科启蒙</span>
                ，而这部分恰好是竞品未占据的蓝海。
              </p>
            </div>
          </Reveal>

          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            <Reveal>
              <EvidenceFigure caption="数据来自原文配图：问卷调研「家长对课程的定位」，有效填写 41 人次">
                <p className="mb-4 text-[12px] font-black tracking-[0.1em] text-[#9C4A2F]">
                  家长对课程的定位（n=41）
                </p>
                <DataBars data={POSITION_SURVEY} />
              </EvidenceFigure>
            </Reveal>
            <Reveal delay={80}>
              <div className="flex h-full flex-col gap-6">
                <div className="rounded-[16px] border border-[#E4D9C9] bg-white p-5 md:p-6">
                  <p className="mb-3 text-[12px] font-black tracking-[0.1em] text-[#9C4A2F]">
                    行业研究：为什么是「学科启蒙」
                  </p>
                  <ul className="space-y-3 text-[13.5px] font-semibold leading-7 text-[#5B534A]">
                    <li>
                      <span className="font-black text-[#25211D]">
                        兴趣启蒙——竞争激烈、红海市场：
                      </span>
                      一边有更方便实惠护眼的绘本/科普书籍，一边有更有趣主流的线上化竞品（斑马、叫叫等），洋葱做「课」起家，在纯启蒙领域不一定有优势。
                    </li>
                    <li>
                      <span className="font-black text-[#25211D]">
                        小初衔接提前学——需求和方案不匹配：
                      </span>
                      有「提前学理科」需求的用户更希望直接对标课本教材，可选秒懂，或买洋葱小初 6
                      年卡直接学【初中物理同步课】。
                    </li>
                  </ul>
                </div>
                <VoiceGroup voices={POSITION_VOICES} title="访谈录音片段" />
              </div>
            </Reveal>
          </div>

          <Reveal>
            <div className="mt-10 grid gap-6 rounded-[18px] bg-[#1E2B24] p-6 text-white md:grid-cols-[.85fr_1.15fr] md:p-9">
              <div>
                <p className="text-[11px] font-black tracking-[0.15em] text-[#C9FF5B]">
                  目标人群
                </p>
                <p className="mt-3 text-[46px] font-black tracking-[-0.05em] md:text-[62px]">
                  1—4 年级
                </p>
                <p className="mt-3 max-w-[380px] text-[13.5px] font-semibold leading-7 text-white/60">
                  既没有学前（3-6 岁）的纯兴趣启蒙诉求，也不到小高（5-6
                  年级）的强应试衔接焦虑，是「低压力学科启蒙」的核心受众。
                </p>
              </div>
              <div className="rounded-[14px] bg-white/[0.06] p-5">
                <p className="mb-3 text-[11px] font-black tracking-[0.1em] text-[#C9FF5B]">
                  内部销售数据：已购用户年级分布
                </p>
                <p className="mb-4 text-[13px] font-semibold leading-7 text-white/75">
                  截至 5 月 12 日，《从小学系列课程》已购用户——
                  <span className="font-black text-white">
                    1-3 年级占比 77%
                  </span>
                  （新媒体近 7 成），从 5 年级开始断崖式下降。
                </p>
                <div className="overflow-hidden rounded-[10px] border border-white/15 text-[12px]">
                  <div className="grid grid-cols-5 bg-white/[0.08] font-black text-white/80">
                    {['年级', '整体', '新媒体', '商业化', '电销/网销'].map((h) => (
                      <span key={h} className="px-2 py-2 text-center">
                        {h}
                      </span>
                    ))}
                  </div>
                  {SALES_TABLE.map((r) => (
                    <div
                      key={r.grade}
                      className="grid grid-cols-5 border-t border-white/10 font-bold text-white/70"
                    >
                      <span className="px-2 py-2 text-center text-white">
                        {r.grade}
                      </span>
                      <span className="px-2 py-2 text-center">{r.overall}%</span>
                      <span className="px-2 py-2 text-center">{r.media}%</span>
                      <span className="px-2 py-2 text-center">{r.app}%</span>
                      <span className="px-2 py-2 text-center">{r.tele}%</span>
                    </div>
                  ))}
                </div>
                <p className="mt-3 text-[10.5px] font-semibold text-white/35">
                  数据来自原文配图：不同年级用户来源占比表
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* —— 2. 产品决策（浅灰绿，深色仅用于核心反转） —— */}
      <section className="bg-[#F1F4EF]">
        <div className="mx-auto max-w-[1280px] px-5 py-20 md:px-10 md:py-28 lg:px-14 lg:py-32">
          <ChapterMarker number="01" label="成交原因 · 产品决策" />
          <Reveal>
            <h2 className="max-w-[880px] text-[34px] font-black leading-[1.2] tracking-[-0.035em] md:text-[50px]">
              相比竞品，洋葱缺少一个
              <br className="hidden md:block" />
              <span className="text-[#456A58]">清晰的课程记忆点</span>。
            </h2>
          </Reveal>

          {/* 用户洞察 · 竞品记忆点墙 */}
          <Reveal>
            <div className="mt-16">
              <SubHead
                kicker="用户洞察 · 竞品"
                title={<>家长被什么吸引下单——更多来自「单点爆破」</>}
              />
            </div>
          </Reveal>
          <div className="grid gap-4 md:grid-cols-2">
            {COMPETITORS.map((c, i) => (
              <Reveal key={c.name} delay={i * 60}>
                <div className="h-full rounded-[16px] border border-[#D8E1D9] bg-white/70 p-5">
                  <div className="mb-4 flex items-center gap-3">
                    <span
                      className="inline-block -rotate-1 px-2.5 py-1.5 text-[13px] font-black text-[#191816]"
                      style={{ backgroundColor: c.tone }}
                    >
                      {c.name}
                    </span>
                    <span className="text-[13px] font-bold text-[#5F6E64]">
                      {c.hook}
                    </span>
                  </div>
                  <div className="space-y-2.5">
                    {c.voices.map((v, vi) => (
                      <div
                        key={vi}
                        className="rounded-[10px] bg-[#F8FAF7] p-3"
                      >
                        <p className="text-[13px] font-semibold leading-6 text-[#4C564F]">
                          「{v.text}」
                        </p>
                        <p className="mt-1.5 text-[11px] font-bold text-[#98A39B]">
                          — {v.source}
                        </p>
                        {v.clipUrl && (
                          <EvidenceAudioClips
                            clips={[{ clipUrl: v.clipUrl, startTime: 0, duration: 0 }]}
                            className="mt-1"
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          {/* 洋葱：品牌信任 + 顺手加购 + 洋葱困境 */}
          <Reveal>
            <div className="mt-12 grid gap-8 border-t border-[#CDD8CF] pt-10 lg:grid-cols-[1.05fr_.95fr] lg:gap-16">
              <div>
                <p className="text-[11px] font-black tracking-[0.15em] text-[#456A58]">
                  洋葱：主要来自「品牌信任」和「顺手加购」
                </p>
                <ol className="mt-5 space-y-3 text-[15px] font-bold text-[#39443D]">
                  <li className="flex gap-3 border-b border-[#D8E1D9] pb-3">
                    <span className="text-[#A2ADA5]">01</span>信任洋葱的品牌
                  </li>
                  <li className="flex gap-3 border-b border-[#D8E1D9] pb-3">
                    <span className="text-[#A2ADA5]">02</span>买小学/全科课包时顺手加购
                  </li>
                </ol>
                <div className="mt-6 space-y-2.5">
                  {ONION_BUY_VOICES.map((v, i) => (
                    <div key={i} className="rounded-[10px] border border-[#D8E1D9] bg-white/70 p-3">
                      <p className="text-[13px] font-semibold leading-6 text-[#4C564F]">
                        「{v.text}」
                      </p>
                      <p className="mt-1.5 text-[11px] font-bold text-[#98A39B]">
                        — {v.source}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="self-start rounded-[16px] border border-[#1E2B24] bg-[#1E2B24] p-6">
                <div className="mb-3 flex items-center gap-2 text-[11px] font-black tracking-[0.12em] text-[#C9FF5B]">
                  <TriangleAlert size={14} />
                  洋葱困境
                </div>
                <p className="text-[17px] font-black leading-[1.7] text-white md:text-[19px]">
                  洋葱目前既不是妙懂（有 AR+竞技），也不是物理十分通（有超级 IP）；如果只用「动画易懂+教材同步」去卖，不仅在达人面前是一个没有独特故事可讲的产品，
                  <Hi color="#C9FF5B">家长也无法清晰感知产品价值</Hi>。
                </p>
              </div>
            </div>
          </Reveal>

          {/* 业务启发 · 最专业的学科启蒙课 */}
          <Reveal>
            <div className="mt-16 border-t border-[#CDD8CF] pt-10">
              <SubHead
                kicker="业务启发"
                title={
                  <>
                    最大优势不是拼单一功能，而是塑造
                    <span className="text-[#456A58]">「最专业的学科启蒙课」</span>
                  </>
                }
              />
            </div>
          </Reveal>
          <div className="grid gap-4 md:grid-cols-3">
            {PRO_PILLARS.map((p, i) => {
              const Icon = p.icon;
              return (
                <Reveal key={p.tag} delay={i * 70}>
                  <div className="flex h-full flex-col rounded-[16px] border border-[#D8E1D9] bg-white/70 p-6">
                    <div className="mb-4 flex items-center gap-2.5">
                      <span className="grid size-9 place-items-center rounded-[10px] bg-[#DDE8E0] text-[#456A58]">
                        <Icon size={18} />
                      </span>
                      <span className="text-[17px] font-black text-[#2F3B34]">
                        {p.tag}
                      </span>
                    </div>
                    <ul className="space-y-3 text-[13px] font-semibold leading-7 text-[#627067]">
                      {p.points.map((pt, pi) => (
                        <li key={pi} className="flex gap-2.5">
                          <span className="mt-[10px] size-1.5 shrink-0 rounded-full bg-[#6D8E7B]" />
                          <span>{pt}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </Reveal>
              );
            })}
          </div>
          <p className="mt-4 text-[10.5px] font-semibold text-[#99A49C]">
            系统性/专业性中的课程体系、教材对应、专家团队、思维模型，原文以配图呈现，此处提炼其要点。
          </p>
        </div>
      </section>

      {/* ============================= 章节二：未成交卡点 ============================= */}
      <section id="ch2" className="scroll-mt-2 bg-[#FCF1EE]">
        <div className="mx-auto max-w-[1280px] px-5 py-20 md:px-10 md:py-28 lg:px-14 lg:py-32">
          <ChapterMarker number="02" label="未成交卡点" />

          {/* 顾虑弹幕过场 */}
          <ConcernDanmu items={CONCERN_DANMU} />

          <Reveal>
            <div className="mt-4">
              <p className="text-[18px] font-black text-[#9C4A2F]">
                大量顾虑，最终收束为两个问题。
              </p>
              <h2 className="mt-4 max-w-[900px] text-[36px] font-black leading-[1.16] tracking-[-0.04em] md:text-[52px]">
                家长无法确认
                <Hi>「会不会看」</Hi>，
                <br className="hidden md:block" />
                也无法确认<Hi>「有没有用」</Hi>。
              </h2>
            </div>
          </Reveal>

          {/* 两个核心问题 */}
          <div className="mt-14 grid gap-6 md:grid-cols-2">
            <Reveal>
              <div className="flex h-full flex-col rounded-[16px] border border-[#D8A99C] bg-white/60 p-6">
                <div className="mb-4 flex items-center gap-2.5">
                  <TriangleAlert size={22} className="text-[#9C4A2F]" />
                  <p className="text-[20px] font-black text-[#25211D]">
                    不确定孩子会不会坚持看
                  </p>
                </div>
                <div className="mt-auto space-y-3">
                  {CONCERN_KEEP_VOICES.map((v, i) => (
                    <VoiceCard key={i} voice={v} />
                  ))}
                </div>
              </div>
            </Reveal>
            <Reveal delay={80}>
              <div className="flex h-full flex-col rounded-[16px] border border-[#D8A99C] bg-white/60 p-6">
                <div className="mb-4 flex items-center gap-2.5">
                  <Eye size={22} className="text-[#9C4A2F]" />
                  <p className="text-[20px] font-black text-[#25211D]">
                    不确定看完到底有没有学到
                  </p>
                </div>
                <div className="mt-auto space-y-3">
                  {CONCERN_LEARN_VOICES.map((v, i) => (
                    <VoiceCard key={i} voice={v} />
                  ))}
                </div>
              </div>
            </Reveal>
          </div>

          {/* 深色高亮框 */}
          <Reveal>
            <div className="mt-10 bg-[#191816] p-7 text-white md:p-10">
              <p className="text-[11px] font-black tracking-[0.15em] text-[#FFCF4A]">
                真正阻断成交的
              </p>
              <p className="mt-4 text-[24px] font-black leading-[1.5] md:text-[30px]">
                不是单纯价格，而是家长无法确认
                <span className="text-[#FFCF4A]">「会不会看」</span>
                和<span className="text-[#FFCF4A]">「有没有用」</span>。
              </p>
            </div>
          </Reveal>

          {/* 业务启发 · 两组硬数据动作 */}
          <Reveal>
            <div className="mt-16 border-t-2 border-[#191816] pt-10">
              <SubHead
                kicker="业务启发"
                title={<>洋葱该如何帮助家长打消顾虑</>}
              />
            </div>
          </Reveal>

          <div className="grid gap-6 lg:grid-cols-2">
            <Reveal>
              <div className="h-full rounded-[16px] border border-[#D8A99C] bg-white/70 p-6">
                <p className="text-[15px] font-black text-[#9C4A2F]">
                  ① 会不会坚持看 —— 用数据和事实说话
                </p>
                <p className="mt-1.5 text-[13px] font-semibold text-[#8A7062]">
                  清楚告诉家长：我们有什么、孩子为什么喜欢。
                </p>
                <ul className="mt-5 space-y-4">
                  {KEEP_ACTIONS.map((a) => (
                    <li key={a.title} className="border-t border-[#EAD6CE] pt-4">
                      <p className="text-[15px] font-black text-[#25211D]">
                        {a.title}
                      </p>
                      <p className="mt-1.5 text-[13px] font-semibold leading-7 text-[#6E5F57]">
                        <MarkNums text={a.text} />
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
            <Reveal delay={80}>
              <div className="h-full rounded-[16px] border border-[#D8A99C] bg-white/70 p-6">
                <p className="text-[15px] font-black text-[#9C4A2F]">
                  ② 到底有没有学到 —— 把「效果外化」前置为营销机制
                </p>
                <p className="mt-1.5 text-[13px] font-semibold text-[#8A7062]">
                  不仅告诉家长孩子爱看，还要让家长看见孩子学到什么、学会什么。
                </p>
                <ul className="mt-5 space-y-4">
                  <li className="border-t border-[#EAD6CE] pt-4">
                    <p className="text-[15px] font-black text-[#25211D]">
                      看见「阶段性信号」，而非立刻要成绩
                    </p>
                    <p className="mt-1.5 text-[13px] font-semibold leading-7 text-[#6E5F57]">
                      家长需要看到孩子能解释一个生活现象、完成一个实验、讲出一个原理、做对相关题目。只要有可感知证据，对「未来有用」的信心就会增强。
                    </p>
                  </li>
                  <li className="border-t border-[#EAD6CE] pt-4">
                    <p className="text-[15px] font-black text-[#25211D]">
                      多维数据的学情报告，定期推送家长
                    </p>
                    <p className="mt-1.5 text-[13px] font-semibold leading-7 text-[#6E5F57]">
                      包含时长/模块/知识点等数据的学情报告，每周通过 APP、公众号推送，让家长清晰看到孩子学了啥、学会啥。
                    </p>
                  </li>
                </ul>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ============================= 章节三：产品体验 ============================= */}
      <section id="ch3" className="scroll-mt-2 bg-[#F1F7F5]">
        <div className="mx-auto max-w-[1280px] px-5 py-20 md:px-10 md:py-28 lg:px-14 lg:py-32">
          <ChapterMarker number="03" label="产品体验 · 典型使用场景" />
          <Reveal>
            <h2 className="max-w-[900px] text-[34px] font-black leading-[1.2] tracking-[-0.035em] md:text-[50px]">
              碎片化、低压力、
              <br className="hidden md:block" />
              由<Hi>兴趣触发</Hi>的补充学习。
            </h2>
            <p className="mt-6 max-w-[600px] text-[15px] font-semibold leading-8 text-[#695F4D]">
              常见于周末/假期、主科学习间隙、孩子主动感兴趣想看时。
            </p>
          </Reveal>

          {/* 横向时间带 */}
          <Reveal>
            <div className="mt-14 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {SCENE_STEPS.map(([t, d], i) => (
                <div key={t} className="relative rounded-[14px] border border-[#DDD1C2] bg-white/60 p-5">
                  <span className="text-[12px] font-black text-[#2F9F8F]">
                    0{i + 1}
                  </span>
                  <p className="mt-3 text-[17px] font-black text-[#25211D]">{t}</p>
                  <p className="mt-1.5 text-[12.5px] font-semibold leading-6 text-[#8A7E71]">
                    {d}
                  </p>
                  {i < SCENE_STEPS.length - 1 && (
                    <ArrowRight
                      size={16}
                      className="absolute -right-[11px] top-1/2 z-10 hidden -translate-y-1/2 bg-[#F1F7F5] text-[#B7C7B3] lg:block"
                    />
                  )}
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal>
            <div className="mt-8 grid gap-3 md:grid-cols-2">
              {SCENE_VOICES.map((v, i) => (
                <VoiceCard key={i} voice={v} />
              ))}
            </div>
          </Reveal>

          {/* 体验优劣势矩阵 */}
          <Reveal>
            <div className="mt-20 border-t-2 border-[#191816] pt-10">
              <SubHead
                kicker="产品体验 · 体验优劣势"
                title={<>四类产品的优势与折损，各有一手用户原声</>}
              />
              <div className="mb-6 flex flex-wrap gap-4 text-[12px] font-bold">
                <span className="flex items-center gap-2">
                  <span className="size-3 rounded-full bg-[#DDF5EF]" />
                  体验优势
                </span>
                <span className="flex items-center gap-2">
                  <span className="size-3 rounded-full bg-[#F5DCD5]" />
                  体验劣势
                </span>
              </div>
            </div>
          </Reveal>

          <div className="space-y-4">
            {EXPERIENCE_MATRIX.map((row, i) => (
              <Reveal key={row.product} delay={i * 50}>
                <div
                  className={cn(
                    'overflow-hidden rounded-[16px] border',
                    row.highlight
                      ? 'border-[#E95B35] bg-white shadow-[0_18px_30px_-26px_rgba(233,91,53,0.6)]'
                      : 'border-[#DDD1C2] bg-white/70',
                  )}
                >
                  <div
                    className={cn(
                      'flex items-center gap-2 px-5 py-3.5 md:px-6',
                      row.highlight ? 'bg-[#E95B35]/10' : 'bg-[#F1EADF]',
                    )}
                  >
                    <span
                      className={cn(
                        'text-[16px] font-black',
                        row.highlight ? 'text-[#E95B35]' : 'text-[#25211D]',
                      )}
                    >
                      {row.product}
                    </span>
                    {row.highlight && (
                      <span className="rounded-full bg-[#E95B35] px-2 py-0.5 text-[10px] font-black text-white">
                        本品
                      </span>
                    )}
                  </div>
                  <div className="grid gap-px bg-[#EBE1D4] md:grid-cols-2">
                    <div className="bg-[#F4FBF8] p-5 md:p-6">
                      <p className="mb-3 flex items-center gap-1.5 text-[11px] font-black tracking-[0.1em] text-[#2F9F8F]">
                        <CircleCheck size={13} /> 体验优势
                      </p>
                      <p className="text-[14.5px] font-black leading-7 text-[#25211D]">
                        {row.pro.summary}
                      </p>
                      <div className="mt-4 space-y-2.5">
                        {row.pro.voices.map((v, vi) => (
                          <VoiceCard key={vi} voice={v} />
                        ))}
                      </div>
                    </div>
                    <div className="bg-[#FBF3F1] p-5 md:p-6">
                      <p className="mb-3 flex items-center gap-1.5 text-[11px] font-black tracking-[0.1em] text-[#C0685C]">
                        <TriangleAlert size={13} /> 体验劣势
                      </p>
                      <p className="text-[14.5px] font-black leading-7 text-[#25211D]">
                        {row.con.summary}
                      </p>
                      <div className="mt-4 space-y-2.5">
                        {row.con.voices.map((v, vi) => (
                          <VoiceCard key={vi} voice={v} />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          {/* 章节结论框 */}
          <Reveal>
            <div className="mt-12 rounded-[4px] border-l-4 border-[#E95B35] bg-white p-7 md:p-9">
              <p className="text-[20px] font-black leading-[1.7] text-[#25211D] md:text-[26px]">
                <Hi>有趣</Hi>解决了「愿不愿意看」，但
                <Hi color="#F5DCD5">儿童化表达和效果外化</Hi>
                决定了「能不能持续、值不值得买」。
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============================= 结尾：回到真实用户 ============================= */}
      <section className="border-t border-[#D7CCBF] bg-white">
        <div className="mx-auto max-w-[1280px] px-5 py-20 md:px-10 md:py-28 lg:px-14">
          <Reveal>
            <p className="text-[11px] font-black tracking-[0.16em] text-[#9C4A2F]">
              读到最后，回到一个真实的孩子
            </p>
            <h2 className="mt-4 max-w-[860px] text-[30px] font-black leading-[1.3] tracking-[-0.03em] md:text-[42px]">
              从「没那么感兴趣」到「真的挺认真」——
              <br className="hidden md:block" />
              <Hi>启蒙的效果，正在发生。</Hi>
            </h2>
          </Reveal>

          <Reveal>
            <div className="mt-12 grid gap-8 rounded-[18px] bg-[#FFF4CC] p-6 md:p-10 lg:grid-cols-[1fr_auto] lg:items-center">
              <VoiceLead voice={CLOSING_VOICE} eyebrow="效果外化已经有真实苗头" />
              <a
                href={SOURCE_URL}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-12 items-center justify-center gap-2 bg-[#191816] px-5 text-[13px] font-black text-white transition hover:bg-[#E95B35]"
              >
                查看完整研究证据
                <ArrowRight size={16} />
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      <footer className="bg-[#191816] px-5 py-8 text-white md:px-10">
        <div className="mx-auto flex max-w-[1280px] flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="flex items-center gap-2 text-[12px] font-black">
            <BookOpen size={14} className="text-[#C9FF5B]" />
            从小学物理 · 核心结论叙事版
          </p>
          <p className="text-[11px] font-semibold text-white/35">
            内容取自研究文档「主页面 2：核心结论」，配图数据以原文图注为准。
          </p>
        </div>
      </footer>
    </main>
  );
}

/* ------------------------------- 顾虑弹幕（减少动态降级） ------------------------------- */

function ConcernDanmu({ items }: { items: string[] }) {
  const reduced = useReducedMotion();
  const [paused, setPaused] = React.useState(false);

  if (reduced) {
    // 减少动态：静态原声墙
    return (
      <div className="mb-4 flex flex-wrap gap-2.5">
        {items.map((t, i) => (
          <span
            key={i}
            className={cn(
              'rounded-full px-3.5 py-2 text-[13px] font-bold',
              i % 3 === 0
                ? 'bg-[#FFCF4A]/60 text-[#7A5A17]'
                : 'bg-white/70 text-[#7A6E68]',
            )}
          >
            {t}
          </span>
        ))}
      </div>
    );
  }

  const rows = [items.slice(0, 4), items.slice(4, 7), items.slice(7)];
  return (
    <div
      className="relative mb-6 h-[200px] overflow-hidden rounded-[16px] border border-[#E1C4BB] bg-white/40"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="pointer-events-none absolute inset-x-0 top-2 z-10 px-4 text-[10.5px] font-black tracking-[0.14em] text-[#B08A80]">
        章节开场 · 家长的顾虑（悬停暂停）
      </div>
      {rows.map((row, ri) => (
        <div
          key={ri}
          className="absolute flex gap-3 whitespace-nowrap"
          style={{
            top: `${44 + ri * 48}px`,
            animation: `danmu-scroll ${20 + ri * 4}s linear infinite`,
            animationDelay: `${ri * -6}s`,
            animationPlayState: paused ? 'paused' : 'running',
          }}
        >
          {[...row, ...row].map((t, i) => {
            const key = t + i;
            const emph = (ri + i) % 3 === 0;
            return (
              <span
                key={key}
                className={cn(
                  'rounded-full px-3.5 py-2 text-[13px] font-bold',
                  emph
                    ? 'bg-[#FFCF4A]/70 text-[#7A5A17]'
                    : 'bg-[#F1E0DA] text-[#8A6E66]',
                )}
              >
                {t}
              </span>
            );
          })}
        </div>
      ))}
      <style>{`
        @keyframes danmu-scroll {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}

/* 高亮数字（业务启发中的关键记忆锚点） */
function MarkNums({ text }: { text: string }) {
  const parts = text.split(/(\d[\d.,]*\s*(?:个|次|节|周|年|万|万级)?\+?|\d+\+)/g);
  return (
    <>
      {parts.map((p, i) =>
        /\d/.test(p) ? (
          <span key={i} className="font-black text-[#E95B35]">
            {p}
          </span>
        ) : (
          <React.Fragment key={i}>{p}</React.Fragment>
        ),
      )}
    </>
  );
}
