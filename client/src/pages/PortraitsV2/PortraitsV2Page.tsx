import React from 'react';
import { motion } from 'motion/react';
import {
  AlertTriangle,
  ArrowRight,
  BookMarked,
  CheckCircle2,
  FlaskConical,
  GitCompare,
  GraduationCap,
  Heart,
  Lightbulb,
  PlayCircle,
  Quote,
  RotateCw,
  Scale,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Target,
  ThumbsDown,
  ThumbsUp,
  TrendingUp,
  UserRound,
  Users,
  XCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils';

// ════════════════════════════════════════════════════════════════════════════
// 用户画像 V2 · 对齐《小学家长画像白皮书》「典型用户代表」的共性版式
//   每类一页两大块：A. 用户画像（这一类人） B. 用户故事（典型代表）
//   ④ 教育逻辑可视化为可插拔槽位（chart.type），四类各用不同图式：
//     兴趣启蒙 flywheel · 学科打底 ladder · 实验探究 balance · 校内助力 match
// ════════════════════════════════════════════════════════════════════════════

const STORY = '#33302b'; // 用户故事 / 人设横幅 统一墨色
const INK = '#292521';
const MUTED = '#746E67';

const reveal = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-48px' },
  transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
};

// ── 可插拔图式类型 ───────────────────────────────────────────────────────────
type IconType = React.ComponentType<{ size?: number }>;

type FlywheelChart = {
  type: 'flywheel';
  engine: { title: string; sub: string };
  nodes: { icon: IconType; title: string; desc: string }[];
  loopNote: string;
};
type LadderChart = {
  type: 'ladder';
  intro: string;
  steps: { stage: string; title: string; desc: string }[];
  gapNote: string;
};
type BalanceChart = {
  type: 'balance';
  left: { title: string; points: string[] };
  right: { title: string; points: string[] };
  fulcrum: string;
  marks: { brand: string; side: 'left' | 'right' | 'balanced'; note: string }[];
};
type MatchChart = {
  type: 'match';
  pivot: string;
  hit: { title: string; desc: string; results: string[] };
  miss: { title: string; desc: string; results: string[] };
};
type PersonaChart = FlywheelChart | LadderChart | BalanceChart | MatchChart;

interface AttrItem {
  icon: IconType;
  label: string;
  value: string;
}
interface CaseItem {
  tone: 'positive' | 'negative';
  brand: string;
  note: string;
}
interface PersonaV2 {
  id: string;
  accent: string;
  type: { index: string; name: string; keyword: string; tagline: string };
  portrait: {
    definition: string;
    boundary: string;
    attributes: AttrItem[];
    cases: CaseItem[];
    productOpportunity: string;
  };
  story: {
    banner: string;
    region: string;
    grade: string;
    role: string;
    coreFeature: string;
    family: { k: string; v: string }[];
    chartTitle: string;
    chart: PersonaChart;
    heroQuote: string;
    moreQuotes: string[];
    onion: { purpose: string; cases: CaseItem[] };
  };
}

// ════════════════════════════════════════════════════════════════════════════
// 数据（4 类）
// ════════════════════════════════════════════════════════════════════════════
const PERSONAS: PersonaV2[] = [
  // ── 01 兴趣启蒙型 ──────────────────────────────────────────────────────────
  {
    id: 'interest',
    accent: '#C9622E',
    type: { index: '01', name: '兴趣启蒙型', keyword: '入口', tagline: '把物理当作孩子「愿意看」的理科兴趣入口' },
    portrait: {
      definition:
        '低年级、低压力家庭：不急于提分，首要目标是让孩子愿意接触理科、不排斥未来学习。「兴趣」是入口，孩子喜欢，家长才会考虑。',
      boundary:
        '和「学科启蒙打底型」不同：同样不追短期成绩，但这类家长对「未来有用」的表述更轻，购买理由更偏「孩子喜欢就先接触」。',
      attributes: [
        { icon: Users, label: '学情特征', value: '孩子低年级，家长不急于提分；更在意孩子是否愿意看、是否不排斥理科。' },
        { icon: Target, label: '用户需求', value: '让孩子觉得物理有意思，愿意持续接触，防止未来畏难排斥。' },
        { icon: AlertTriangle, label: '核心痛点', value: '课程太像上课、太正式、太无趣，孩子容易排斥，起不到兴趣启蒙效果。' },
        { icon: Heart, label: '课程偏好', value: '偏好动画、短视频、故事化、生活现象等孩子喜欢的内容。' },
      ],
      cases: [
        { tone: 'positive', brand: '洋葱', note: '孩子喜欢看实验男做实验' },
        { tone: 'negative', brand: '妙懂', note: '太正式，不是小孩能接受的预期' },
      ],
      productOpportunity:
        '做足**趣味动画、短视频节奏、实验男**等「孩子愿意主动看」的入口内容；避免太正式、太像上课的表达。兴趣是把孩子拉进来的第一道门，也是这类家长唯一会检验的「效果」。',
    },
    story: {
      banner: '安徽合肥妈妈 —— 把《从小学物理》当作孩子愿意看的「理科兴趣入口」',
      region: '安徽合肥',
      grade: '弟弟一年级',
      role: '妈妈 · 主要负责孩子学习',
      coreFeature: '不急着让孩子提前学完整套初中物理，也不用成绩检验启蒙效果；她首先要的，是孩子愿意看、听得懂、觉得好玩。',
      family: [
        { k: '妈妈', v: '主要负责孩子学习，无强规划、不焦虑' },
        { k: '孩子', v: '两个：姐姐高中、弟弟一年级' },
        { k: '弟弟学情', v: '没报很多辅导班，整体掌握情况也不错' },
        { k: '购买方式', v: '给姐姐买高中物理时，顺着推荐加购《从小学物理》' },
      ],
      chartTitle: '教育逻辑 · 兴趣自驱正循环',
      chart: {
        type: 'flywheel',
        engine: { title: '兴趣', sub: '孩子喜欢 = 她唯一检验的「效果」' },
        nodes: [
          { icon: Heart, title: '孩子喜欢', desc: '孩子能看得进去，家长才会考虑——兴趣是唯一入口' },
          { icon: ShoppingBag, title: '顺手加购', desc: '给姐姐买高中物理时顺带加购，期待很轻、门槛很低' },
          { icon: PlayCircle, title: '主动看 · 不用催', desc: '实验男 / 动画有吸引力，不主动管也每天自己看' },
          { icon: ShieldCheck, title: '不排斥理科', desc: '先建立熟悉与好感，未来正式学理科时更从容' },
        ],
        loopNote: '孩子越喜欢 → 越愿意看 → 越不排斥 → 更喜欢，形成兴趣自驱的正循环（反之一旦「不喜欢」就整条断裂）。',
      },
      heroQuote: '孩子喜欢学就学，多看一点总归有帮助。',
      moreQuotes: [
        '因为学习是个长期的过程，不是一蹴而就的。所以也没什么目的，孩子喜欢学就学。',
        '孩子喜欢看实验男，因为学而思的教具或课堂都不能做危险的实验，而实验男可以做一些家里做不到、且会爆炸的实验。',
      ],
      onion: {
        purpose: '把《从小学物理》当作孩子愿意看的「理科兴趣入口」——先让孩子接触、不排斥，未来学理科时更从容。',
        cases: [
          { tone: 'positive', brand: '洋葱', note: '孩子喜欢看实验男做实验，愿意主动看' },
          { tone: 'negative', brand: '妙懂', note: '太正式，不是小孩能接受的预期' },
        ],
      },
    },
  },
  // ── 02 学科启蒙打底型 ──────────────────────────────────────────────────────
  {
    id: 'foundation',
    accent: '#3F5E8C',
    type: { index: '02', name: '学科启蒙打底型', keyword: '长期', tagline: '把理科启蒙当作「未来别被卡住」的长期打底' },
    portrait: {
      definition:
        '有明确「未来学科价值」预期：不追短期提分，但要求启蒙内容和初高中理科学习挂钩，形成长期优势。',
      boundary:
        '和「兴趣启蒙型」共享低压力场景，但更「功利」——需要看见「有用」的路径，而不只是「孩子爱看」。和「实验探究型」不同：实验是手段之一，核心诉求是思维框架与未来衔接。',
      attributes: [
        { icon: Users, label: '学情特征', value: '不追求短期效果，但有明确「未来有用」的预期；相对兴趣启蒙更加「功利」。' },
        { icon: Target, label: '用户需求', value: '为孩子建立理科思维框架，提前熟悉概念，初中学理科时更轻松。' },
        { icon: AlertTriangle, label: '核心痛点', value: '「未来有用」达成路径缺失——不知道孩子学到多少、记住多少、学科思维有没有变化。' },
        { icon: Heart, label: '课程偏好', value: '偏好「有趣但有用」：生活化讲解、体系化大纲、轻量题目验证、能关联未来初中知识。' },
      ],
      cases: [
        { tone: 'positive', brand: '效果外化', note: '阶段性让家长看到学科启蒙效果，是差异化机会点' },
        { tone: 'negative', brand: '洋葱与竞品', note: '目前均未很好做到「有用」的可见验证' },
      ],
      productOpportunity:
        '体系化大纲、生活化讲解、轻量验证、与未来初中知识的关联；**「效果外化」是这类家长最缺的判断依据**，也是差异化机会。',
    },
    story: {
      banner: '北京昌平爸爸 —— 把理科启蒙当作「未来别被卡住」的长期打底',
      region: '北京昌平',
      grade: '大孩三年级',
      role: '爸爸 · 主导理科规划',
      coreFeature: '文科背景、自己理科偏弱，不会用短期成绩检验课程价值，也不希望孩子过早刷题；但明确要求课程「未来有用」，帮孩子建立理科接纳度、熟悉感和长期优势。',
      family: [
        { k: '爸爸', v: '文科背景、理科相对弱，主导孩子理科规划' },
        { k: '孩子', v: '两个，课程主要买给三年级的大孩' },
        { k: '教育观', v: '长期打底，不追短期见效，不希望过早刷题' },
        { k: '已选产品', v: '学而思科学、NB 实验室等，带「笨鸟先飞」逻辑' },
      ],
      chartTitle: '教育逻辑 · 笨鸟先飞的长期阶梯',
      chart: {
        type: 'ladder',
        intro: '现在先学一遍，越往后越轻松——但中间缺少「正在变有用」的验证信号。',
        steps: [
          { stage: '小学', title: '启蒙打底', desc: '现在先学一遍，建立理科接纳度与熟悉感' },
          { stage: '初中', title: '学得更快', desc: '讲到时孩子都知道，比同学更好吸收' },
          { stage: '高中 / 选科', title: '不被理科限制', desc: '面对物化不吃力，选专业时不因理科弱被动' },
        ],
        gapNote:
          '断点：小学到初中之间隔着数年，家长看不到「正在变有用」的证据——不知道学到多少、思维有没有变化，正是最需要「效果外化」的地方。',
      },
      heroQuote: '学的东西未来要有用，理科启蒙要和未来学科挂钩，不能只是玩一玩。',
      moreQuotes: [
        '希望孩子现在学一遍，初高中再学一遍时更轻松。',
        '覆盖教材、覆盖小学到高中、能做实验、能做习题，说明产品具备学科启蒙属性。',
      ],
      onion: {
        purpose: '把理科启蒙当作长期打底，要求「未来有用」、能连接初高中学习路径；用孩子是否接纳、是否愿意学来判断启蒙是否成立。',
        cases: [
          { tone: 'positive', brand: 'NB 实验室', note: '覆盖小学到高中、能选教材、有实验与习题，长期可用' },
          { tone: 'negative', brand: '效果验证', note: '短期没有清晰效果标准，最缺「有用」的可见证据' },
        ],
      },
    },
  },
  // ── 03 实验探究型 ──────────────────────────────────────────────────────────
  {
    id: 'experiment',
    accent: '#2F8272',
    type: { index: '03', name: '实验探究型', keyword: '动手', tagline: '相信实验与系统讲解，想让孩子在动手中真正理解物理' },
    portrait: {
      definition:
        '把「动手验证」视为理科学习的核心方式：不只接受视频讲解，要求孩子能观察、操作、提问并理解原理。',
      boundary:
        '和「兴趣启蒙型」都可能被实验吸引，但这类家长要的是「讲解 + 动手」兼备，而不是只看实验视频。和「校内助力型」不同：动机是理解原理，不是对标教材拿分。',
      attributes: [
        { icon: Users, label: '学情特征', value: '家长看重实验，相信「实验是理科学习的核心」；孩子对「科学实验」有兴趣。' },
        { icon: Target, label: '用户需求', value: '让孩子通过观察现象、动手操作来理解原理，而不是只看视频。' },
        { icon: AlertTriangle, label: '核心痛点', value: '虚拟实验缺少动手感，无法替代真人实验——容易停留在「看过」，孩子无法跟着一起做。' },
        { icon: Heart, label: '课程偏好', value: '偏好真实验、可动手、材料易获得、老师带做。' },
      ],
      cases: [
        { tone: 'positive', brand: '真人实验直播课', note: '专业老师带做实验讲解，孩子感兴趣、吸收得多' },
        { tone: 'negative', brand: 'NB 实验室', note: '动手交互不能代替真实实验' },
      ],
      productOpportunity:
        '真实验、材料易得、可跟着做；**讲解要儿童化、实验要更可操作**——虚拟实验难以替代「真动手」的参与感。',
    },
    story: {
      banner: '北京顺义妈妈 —— 相信实验与系统讲解，让孩子在动手中真正理解物理',
      region: '北京顺义',
      grade: '二年级',
      role: '妈妈 · 长期关注学科启蒙',
      coreFeature: '她相信兴趣重要，但更相信「实践出真知」；要的不是孩子只看懂视频，而是能动手、能提问、能在实验中把抽象概念真正理解。',
      family: [
        { k: '妈妈', v: '长期关注学习兴趣、学科启蒙与升学' },
        { k: '孩子', v: '二年级男孩，对科学实验有兴趣' },
        { k: '报课', v: '从小学物理、NB 实验室、学而思自然博物、赛先生等' },
        { k: '教育观', v: '「实践出真知」，知识讲解 + 动手实验缺一不可' },
      ],
      chartTitle: '教育逻辑 · 讲解与动手的天平',
      chart: {
        type: 'balance',
        left: { title: '知识讲解', points: ['系统、层次清晰', '把专业概念讲得更儿童化'] },
        right: { title: '动手实验', points: ['真操作、材料易得', '孩子能问、老师能纠正'] },
        fulcrum: '只有「讲解 + 动手」两端都够，孩子才能真正印证理论、理解原理。',
        marks: [
          { brand: '真人实验直播课', side: 'balanced', note: '讲解 + 动手兼具，吸收多' },
          { brand: 'NB 实验室', side: 'right', note: '动手多但讲解弱' },
          { brand: '洋葱', side: 'left', note: '讲解系统但动手不足' },
        ],
      },
      heroQuote: '实验肯定是重要的，理科就是实践出真知，自己看肯定不如自己动手。',
      moreQuotes: [
        '一定要有专业的老师带着做实验才效果好，孩子做实验时能问老师，老师能纠正过来。',
        '（NB）没讲解，更多动手操作，家长在旁边需要多一点。',
      ],
      onion: {
        purpose: '信任洋葱品牌、被实验吸引而购买；孩子喜欢看实验男。期待洋葱在保持系统与趣味的同时，把概念讲得更儿童化、实验做得更可操作。',
        cases: [
          { tone: 'positive', brand: '洋葱', note: '内容系统、孩子喜欢看实验男，不管也每天看' },
          { tone: 'negative', brand: '洋葱', note: '实验动手不足，虚拟难替代真操作' },
        ],
      },
    },
  },
  // ── 04 校内科学课助力型 ────────────────────────────────────────────────────
  {
    id: 'school',
    accent: '#7C5A93',
    type: { index: '04', name: '校内科学课助力型', keyword: '同步', tagline: '把《从小学物理》当作小学科学课的辅助工具' },
    portrait: {
      definition:
        '动机来自校内：所在地区科学是主课、要考试，希望帮孩子理解课本、减少死记硬背，而非做长期启蒙或提前学。',
      boundary:
        '和前三类都不同：购买理由不是「兴趣」或「未来打底」，而是「现在这门课要考」。对教材版本、知识点顺序、检索能力的要求远高于其他类型。',
      attributes: [
        { icon: Users, label: '学情特征', value: '所在地区科学是主课，会像语数英一样有考试；家长希望帮助校内科学学习。' },
        { icon: Target, label: '用户需求', value: '让孩子学透校内科学课的知识，不只是背概念、背实验结论。' },
        { icon: AlertTriangle, label: '核心痛点', value: '课程内容需与教材知识点顺序一致，否则会影响使用率——不能按年级、教材、知识点查找就用不上。' },
        { icon: Heart, label: '课程偏好', value: '偏好对标教材、按年级 / 教材版本 / 知识点组织、能快速搜索的产品。' },
      ],
      cases: [
        { tone: 'positive', brand: '洋葱', note: '动画不枯燥，能把抽象知识点讲明白' },
        { tone: 'negative', brand: '洋葱', note: '有些校内知识点没有、不够同步，检索匹配待加强' },
      ],
      productOpportunity:
        '按**年级 / 教材版本 / 知识点**组织与快速检索；内容覆盖需尽量对齐校内，否则使用频率会快速下降。',
    },
    story: {
      banner: '河南郑州妈妈 —— 把《从小学物理》当作小学科学课的「对标教材」辅助工具',
      region: '河南郑州',
      grade: '四年级',
      role: '妈妈 · 目标明确',
      coreFeature: '她不是为了启蒙或提前学，而是希望课程帮孩子学透校内科学课；最看重能不能对标教材，让孩子不再死记硬背，而能真的理解原理。',
      family: [
        { k: '妈妈', v: '目标明确，为校内科学课服务' },
        { k: '孩子', v: '四年级' },
        { k: '地区特点', v: '郑州科学是主科，期中期末考、有单元测' },
        { k: '使用定位', v: '查漏补缺 / 复习知识点工具，非系统学完' },
      ],
      chartTitle: '教育逻辑 · 教材对齐决定用不用得上',
      chart: {
        type: 'match',
        pivot: '课程知识点 ↔ 校内教材单元 / 年级 是否对齐？',
        hit: {
          title: '对得上',
          desc: '哪个单元不懂就能精准找到对应视频',
          results: ['考前复习', '查漏补缺', '理解原理、不再死记硬背'],
        },
        miss: {
          title: '对不上',
          desc: '四年级上册内容找不到、顺序不一致',
          results: ['使用频率骤降', '变成「想起来划两下」', '平时用不到'],
        },
      },
      heroQuote: '洋葱主要是用来复习知识点，这个单元需要考试，或者某个知识点有明显缺漏需要看。',
      moreQuotes: [
        '可以研究各个地区的课本，根据课本有相关知识点，一找就能找到知识点。',
        '之前以为顺序不一样但知识点都有，后面发现不一样（四上的内容找不到）。',
      ],
      onion: {
        purpose: '把课程当作校内科学课的复习 / 理解工具，最看重能否对标教材、按知识点检索。',
        cases: [
          { tone: 'positive', brand: '洋葱', note: '动画不枯燥，把抽象知识点讲明白，不用死记硬背' },
          { tone: 'negative', brand: '洋葱', note: '不够同步、四上内容找不到，检索匹配待加强' },
        ],
      },
    },
  },
];

// 半透明底色
const soft = (hex: string) => `${hex}14`;

// ── 富文本：**加粗**高亮 ─────────────────────────────────────────────────────
function Rich({ text, accent }: { text: string; accent: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return (
    <>
      {parts.map((p, i) =>
        p.startsWith('**') && p.endsWith('**') ? (
          <span key={i} className="rounded px-1 font-bold" style={{ background: soft(accent), color: accent }}>
            {p.slice(2, -2)}
          </span>
        ) : (
          <span key={i}>{p}</span>
        ),
      )}
    </>
  );
}

// ════════════════════════════════════════════════════════════════════════════
export default function PortraitsV2Page() {
  const [activeId, setActiveId] = React.useState(PERSONAS[0].id);
  const persona = PERSONAS.find((p) => p.id === activeId) ?? PERSONAS[0];

  return (
    <div className="flex h-full flex-col bg-[#f8f8f5]">
      {/* 类型切换 */}
      <div className="shrink-0 border-b border-[#e4e2da] bg-white px-5 py-3 md:px-8">
        <div className="mx-auto max-w-[940px]">
          <div className="flex items-center gap-2" style={{ color: persona.accent }}>
            <Sparkles size={15} />
            <span className="text-[11px] font-black tracking-[0.14em]">用户画像 V2 · 从小学物理</span>
          </div>
          <div className="mt-2.5 flex flex-wrap gap-1.5">
            {PERSONAS.map((p) => {
              const active = p.id === activeId;
              return (
                <button
                  key={p.id}
                  onClick={() => setActiveId(p.id)}
                  className={cn(
                    'flex items-center gap-1.5 rounded-xl px-3 py-2 text-[12.5px] font-bold transition-all',
                    active ? 'text-white shadow-sm' : 'bg-[#f4f1eb] text-[#6b655c] hover:bg-[#eee9e0]',
                  )}
                  style={active ? { background: p.accent } : undefined}
                >
                  <span className={cn('text-[10px] font-black', active ? 'text-white/80' : '')} style={!active ? { color: p.accent } : undefined}>
                    {p.type.index}
                  </span>
                  {p.type.name}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 内容 */}
      <div className="min-h-0 flex-1 overflow-y-auto">
        <div className="mx-auto max-w-[940px] px-5 py-8 md:py-10">
          <TypeHero key={`hero-${persona.id}`} persona={persona} />
          <PortraitSection key={`portrait-${persona.id}`} persona={persona} />
          <StorySection key={`story-${persona.id}`} persona={persona} />
          <FooterNote />
        </div>
      </div>
    </div>
  );
}

// ── 类型 Hero ────────────────────────────────────────────────────────────────
function TypeHero({ persona }: { persona: PersonaV2 }) {
  const { type, accent } = persona;
  return (
    <motion.div {...reveal}>
      <div className="flex items-end gap-3">
        <span className="text-5xl font-black leading-none md:text-6xl" style={{ color: accent }}>
          {type.index}
        </span>
        <div className="pb-1">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-black md:text-3xl" style={{ color: INK }}>
              {type.name}
            </h1>
            <span className="rounded px-2 py-0.5 text-[11px] font-black" style={{ background: soft(accent), color: accent }}>
              {type.keyword}
            </span>
          </div>
          <p className="mt-1.5 text-[14px] font-semibold" style={{ color: '#4a453f' }}>
            {type.tagline}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

// ── 段落大标题 ───────────────────────────────────────────────────────────────
function SectionHeader({ icon: Icon, label, subtitle, accent }: { icon: IconType; label: string; subtitle: string; accent: string }) {
  return (
    <div className="flex items-start gap-3 border-b border-[#e4e2da] pb-3">
      <span className="mt-1 grid h-8 w-8 shrink-0 place-items-center rounded-lg" style={{ background: soft(accent), color: accent }}>
        <Icon size={16} />
      </span>
      <div>
        <h2 className="text-[17px] font-black" style={{ color: INK }}>
          {label}
        </h2>
        <p className="mt-0.5 text-[12.5px]" style={{ color: MUTED }}>
          {subtitle}
        </p>
      </div>
    </div>
  );
}

function CaseChip({ tone, brand, note }: CaseItem) {
  return (
    <div className="flex items-start gap-2 rounded-lg border bg-white px-3.5 py-2.5" style={{ borderColor: tone === 'positive' ? '#cfe6dc' : '#f0d6cd' }}>
      {tone === 'positive' ? (
        <ThumbsUp size={14} className="mt-0.5 shrink-0 text-[#2F8272]" />
      ) : (
        <ThumbsDown size={14} className="mt-0.5 shrink-0 text-[#C9622E]" />
      )}
      <div className="text-[12.5px]">
        <span className="font-black" style={{ color: INK }}>
          {tone === 'positive' ? '正面案例 · ' : '负面案例 · '}
          {brand}
        </span>
        <span className="mx-1.5 text-[#ccc]">·</span>
        <span style={{ color: '#5c564f' }}>{note}</span>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// A. 用户画像
// ════════════════════════════════════════════════════════════════════════════
function PortraitSection({ persona }: { persona: PersonaV2 }) {
  const { portrait, accent } = persona;
  return (
    <section className="mt-8">
      <SectionHeader icon={Users} label="用户画像" subtitle={`${persona.type.name}这一类家长：是谁、要什么、痛在哪、偏好什么`} accent={accent} />

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <motion.div {...reveal} className="rounded-xl border p-4 md:p-5" style={{ borderColor: `${accent}44`, background: soft(accent) }}>
          <div className="text-[12px] font-black" style={{ color: accent }}>
            类型定义
          </div>
          <p className="mt-3 text-[14px] font-semibold leading-8" style={{ color: '#332f2a' }}>
            {portrait.definition}
          </p>
        </motion.div>
        <motion.div {...reveal} className="rounded-xl border border-[#e7e5de] bg-white p-4 md:p-5">
          <div className="flex items-center gap-2" style={{ color: MUTED }}>
            <GitCompare size={14} />
            <span className="text-[12px] font-black">与其他类型的边界</span>
          </div>
          <p className="mt-3 text-[13.5px] leading-7" style={{ color: '#4a453f' }}>
            {portrait.boundary}
          </p>
        </motion.div>
      </div>

      <div className="mt-4 grid gap-px overflow-hidden rounded-xl border border-[#e4e2da] bg-[#e4e2da] sm:grid-cols-2">
        {portrait.attributes.map((attr, i) => {
          const Icon = attr.icon;
          return (
            <motion.div {...reveal} transition={{ ...reveal.transition, delay: i * 0.05 }} key={attr.label} className="bg-white p-4">
              <div className="flex items-center gap-2" style={{ color: accent }}>
                <Icon size={14} />
                <span className="text-[12px] font-black">{attr.label}</span>
              </div>
              <p className="mt-2 text-[13px] leading-7" style={{ color: '#4a453f' }}>
                {attr.value}
              </p>
            </motion.div>
          );
        })}
      </div>

      <motion.div {...reveal} className="mt-4 flex flex-wrap gap-3">
        {portrait.cases.map((c, i) => (
          <CaseChip key={`${c.brand}-${i}`} {...c} />
        ))}
      </motion.div>

      <motion.div {...reveal} className="mt-4 rounded-xl border p-4 md:p-5" style={{ borderColor: `${accent}44`, background: soft(accent) }}>
        <div className="flex items-center gap-2" style={{ color: accent }}>
          <Lightbulb size={15} />
          <span className="text-[12px] font-black tracking-wide">产品机会（来自偏好）</span>
        </div>
        <p className="mt-3 text-[13.5px] leading-8" style={{ color: '#332f2a' }}>
          <Rich text={portrait.productOpportunity} accent={accent} />
        </p>
      </motion.div>
    </section>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// B. 用户故事
// ════════════════════════════════════════════════════════════════════════════
function StorySection({ persona }: { persona: PersonaV2 }) {
  const { story, accent } = persona;
  return (
    <section className="mt-12">
      <SectionHeader icon={UserRound} label="用户故事" subtitle="该类型中的典型代表 · 真实访谈还原" accent={STORY} />

      <motion.div {...reveal} className="mt-5 rounded-xl px-5 py-4 md:py-5" style={{ background: STORY }}>
        <h3 className="text-center text-[16px] font-black leading-snug text-white md:text-[19px]">{story.banner}</h3>
        <p className="mt-1.5 text-center text-[12px] font-semibold text-white/80">
          {story.region} · {story.grade} · {story.role}
        </p>
      </motion.div>

      <motion.div {...reveal} className="mt-4 grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-dashed border-[#cbc7bf] bg-white p-4 md:p-5">
          <div className="text-[12px] font-black" style={{ color: STORY }}>
            家庭情况
          </div>
          <dl className="mt-3 space-y-2">
            {story.family.map((r) => (
              <div key={r.k} className="flex gap-2 text-[13px] leading-6">
                <dt className="w-16 shrink-0 font-bold text-[#6b655c]">{r.k}</dt>
                <dd className="flex-1 text-[#4a453f]">{r.v}</dd>
              </div>
            ))}
          </dl>
        </div>
        <div className="rounded-xl border p-4 md:p-5" style={{ borderColor: `${accent}44`, background: soft(accent) }}>
          <div className="text-[12px] font-black" style={{ color: accent }}>
            核心特征
          </div>
          <p className="mt-3 text-[14px] font-semibold leading-8" style={{ color: INK }}>
            {story.coreFeature}
          </p>
        </div>
      </motion.div>

      {/* ④ 教育逻辑可视化（可插拔）*/}
      <div className="mt-6">
        <div className="mb-3 flex items-center gap-2">
          <span className="h-5 w-1 rounded-full" style={{ background: accent }} />
          <h4 className="text-[14px] font-black" style={{ color: INK }}>
            {story.chartTitle}
          </h4>
        </div>
        <ChartRenderer chart={story.chart} accent={accent} />
      </div>

      <QuoteBlock heroQuote={story.heroQuote} moreQuotes={story.moreQuotes} accent={accent} />
      <OnionBlock onion={story.onion} />
    </section>
  );
}

// ── 图式分发 ─────────────────────────────────────────────────────────────────
function ChartRenderer({ chart, accent }: { chart: PersonaChart; accent: string }) {
  switch (chart.type) {
    case 'flywheel':
      return <Flywheel chart={chart} accent={accent} />;
    case 'ladder':
      return <Ladder chart={chart} accent={accent} />;
    case 'balance':
      return <Balance chart={chart} accent={accent} />;
    case 'match':
      return <Match chart={chart} accent={accent} />;
  }
}

// ── 图式 1：兴趣自驱飞轮 ─────────────────────────────────────────────────────
function Flywheel({ chart, accent }: { chart: FlywheelChart; accent: string }) {
  return (
    <motion.div {...reveal} className="rounded-2xl border border-[#e7e5de] bg-white p-5 md:p-7">
      <div className="relative rounded-[26px] border-2 border-dashed p-5 md:p-7" style={{ borderColor: `${accent}66` }}>
        <div className="mb-5 flex justify-center">
          <div className="flex items-center gap-2 rounded-full px-4 py-2 text-white shadow-sm" style={{ background: accent }}>
            <RotateCw size={15} />
            <span className="text-[13px] font-black">引擎：{chart.engine.title}</span>
            <span className="hidden text-[11px] font-semibold opacity-90 sm:inline">· {chart.engine.sub}</span>
          </div>
        </div>
        <div className="grid items-stretch gap-3 md:grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr]">
          {chart.nodes.map((node, i) => {
            const Icon = node.icon;
            const isStart = i === 0;
            return (
              <React.Fragment key={node.title}>
                <div className="rounded-xl border bg-white p-3.5" style={{ borderColor: isStart ? accent : '#e7e5de', background: isStart ? soft(accent) : '#fff', borderWidth: isStart ? 2 : 1 }}>
                  <div className="flex items-center gap-2">
                    <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full text-white" style={{ background: accent }}>
                      <Icon size={15} />
                    </span>
                    <span className="text-[10px] font-black" style={{ color: accent }}>
                      0{i + 1}
                    </span>
                    <span className="text-[13.5px] font-black leading-tight" style={{ color: INK }}>
                      {node.title}
                    </span>
                  </div>
                  <p className="mt-2 text-[12px] leading-6" style={{ color: '#5c564f' }}>
                    {node.desc}
                  </p>
                </div>
                {i < chart.nodes.length - 1 && (
                  <div className="flex items-center justify-center py-0.5 md:py-0">
                    <ArrowRight size={18} className="rotate-90 md:rotate-0" style={{ color: `${accent}88` }} />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
        <div className="mt-4 flex items-center justify-center gap-2 rounded-xl px-4 py-2.5" style={{ background: soft(accent) }}>
          <RotateCw size={15} className="shrink-0" style={{ color: accent }} />
          <p className="text-[12px] font-semibold leading-6" style={{ color: '#5c4a40' }}>
            {chart.loopNote}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

// ── 图式 2：长期阶梯（含断点）────────────────────────────────────────────────
function Ladder({ chart, accent }: { chart: LadderChart; accent: string }) {
  const lift = ['md:mt-16', 'md:mt-8', 'md:mt-0'];
  const stepIcons = [Sparkles, GraduationCap, TrendingUp];
  return (
    <motion.div {...reveal} className="rounded-2xl border border-[#e7e5de] bg-white p-5 md:p-7">
      <p className="mb-4 text-[12.5px] leading-6" style={{ color: MUTED }}>
        {chart.intro}
      </p>
      <div className="grid items-end gap-3 md:grid-cols-3">
        {chart.steps.map((s, i) => {
          const Icon = stepIcons[i] ?? Sparkles;
          return (
            <div key={s.stage} className={cn('relative rounded-xl border p-4', lift[i])} style={{ borderColor: `${accent}55`, background: soft(accent), borderBottomWidth: 3, borderBottomColor: accent }}>
              <div className="flex items-center gap-2">
                <span className="grid h-7 w-7 place-items-center rounded-full text-white" style={{ background: accent }}>
                  <Icon size={15} />
                </span>
                <span className="text-[11px] font-black" style={{ color: accent }}>
                  {s.stage}
                </span>
              </div>
              <div className="mt-2 text-[14px] font-black" style={{ color: INK }}>
                {s.title}
              </div>
              <p className="mt-1 text-[12px] leading-6" style={{ color: '#5c564f' }}>
                {s.desc}
              </p>
              {i < chart.steps.length - 1 && (
                <ArrowRight size={18} className="absolute -right-3 bottom-4 z-10 hidden md:block" style={{ color: `${accent}88` }} />
              )}
            </div>
          );
        })}
      </div>
      <div className="mt-4 flex items-start gap-2 rounded-xl border border-dashed px-4 py-3" style={{ borderColor: '#e3b7a6', background: '#fdf4ee' }}>
        <AlertTriangle size={15} className="mt-0.5 shrink-0 text-[#C9622E]" />
        <p className="text-[12px] font-semibold leading-6" style={{ color: '#7a5a48' }}>
          {chart.gapNote}
        </p>
      </div>
    </motion.div>
  );
}

// ── 图式 3：讲解 / 动手 天平 ─────────────────────────────────────────────────
function Balance({ chart, accent }: { chart: BalanceChart; accent: string }) {
  const sideLabel = { left: '偏讲解', right: '偏动手', balanced: '两端兼具' } as const;
  return (
    <motion.div {...reveal} className="rounded-2xl border border-[#e7e5de] bg-white p-5 md:p-7">
      <div className="mb-4 flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-center" style={{ background: soft(accent) }}>
        <Scale size={16} className="shrink-0" style={{ color: accent }} />
        <p className="text-[12.5px] font-bold leading-6" style={{ color: '#4a453f' }}>
          {chart.fulcrum}
        </p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {[chart.left, chart.right].map((col, idx) => {
          const Icon = idx === 0 ? BookMarked : FlaskConical;
          return (
            <div key={col.title} className="rounded-xl border p-4" style={{ borderColor: `${accent}44`, borderTopWidth: 3, borderTopColor: accent }}>
              <div className="flex items-center gap-2" style={{ color: accent }}>
                <Icon size={15} />
                <span className="text-[13.5px] font-black">{col.title}</span>
              </div>
              <ul className="mt-2.5 space-y-1.5">
                {col.points.map((pt) => (
                  <li key={pt} className="flex gap-2 text-[12.5px] leading-6" style={{ color: '#4a453f' }}>
                    <CheckCircle2 size={13} className="mt-1 shrink-0" style={{ color: accent }} />
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
      <div className="mt-4">
        <div className="mb-2 text-[11px] font-black tracking-wide" style={{ color: MUTED }}>
          各产品在天平上的位置
        </div>
        <div className="flex flex-wrap gap-2">
          {chart.marks.map((m) => (
            <div
              key={m.brand}
              className="flex items-center gap-1.5 rounded-lg border bg-white px-3 py-2 text-[12px]"
              style={{ borderColor: m.side === 'balanced' ? '#cfe6dc' : '#e7e5de' }}
            >
              <span className="font-black" style={{ color: m.side === 'balanced' ? '#2F8272' : INK }}>
                {m.brand}
              </span>
              <span className="rounded px-1.5 py-0.5 text-[10px] font-bold" style={{ background: soft(accent), color: accent }}>
                {sideLabel[m.side]}
              </span>
              <span className="text-[#5c564f]">{m.note}</span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

// ── 图式 4：教材对齐命中分支 ─────────────────────────────────────────────────
function Match({ chart, accent }: { chart: MatchChart; accent: string }) {
  return (
    <motion.div {...reveal} className="rounded-2xl border border-[#e7e5de] bg-white p-5 md:p-7">
      <div className="mx-auto mb-4 flex max-w-[560px] items-center justify-center gap-2 rounded-xl px-4 py-3 text-center text-white" style={{ background: accent }}>
        <BookMarked size={16} className="shrink-0" />
        <p className="text-[13px] font-black leading-6">{chart.pivot}</p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {/* 对得上 */}
        <div className="overflow-hidden rounded-xl border" style={{ borderColor: '#cfe6dc' }}>
          <div className="flex items-center gap-2 border-b border-[#dcefe6] bg-[#eef7f3] px-4 py-2.5">
            <CheckCircle2 size={15} className="text-[#2F8272]" />
            <span className="text-[13px] font-black text-[#256c5f]">{chart.hit.title}</span>
          </div>
          <div className="p-4">
            <p className="text-[12.5px] leading-6" style={{ color: '#4a453f' }}>
              {chart.hit.desc}
            </p>
            <ul className="mt-2.5 space-y-1.5">
              {chart.hit.results.map((r) => (
                <li key={r} className="flex gap-2 text-[12.5px] leading-6 text-[#2f6a5d]">
                  <ThumbsUp size={13} className="mt-1 shrink-0" />
                  <span>{r}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        {/* 对不上 */}
        <div className="overflow-hidden rounded-xl border" style={{ borderColor: '#f0d6cd' }}>
          <div className="flex items-center gap-2 border-b border-[#f3ddd4] bg-[#fdf1ec] px-4 py-2.5">
            <XCircle size={15} className="text-[#C9622E]" />
            <span className="text-[13px] font-black text-[#b0492b]">{chart.miss.title}</span>
          </div>
          <div className="p-4">
            <p className="text-[12.5px] leading-6" style={{ color: '#4a453f' }}>
              {chart.miss.desc}
            </p>
            <ul className="mt-2.5 space-y-1.5">
              {chart.miss.results.map((r) => (
                <li key={r} className="flex gap-2 text-[12.5px] leading-6 text-[#9a4d34]">
                  <ThumbsDown size={13} className="mt-1 shrink-0" />
                  <span>{r}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ── ⑤ 高亮原声 ───────────────────────────────────────────────────────────────
function QuoteBlock({ heroQuote, moreQuotes, accent }: { heroQuote: string; moreQuotes: string[]; accent: string }) {
  return (
    <div className="mt-6">
      <motion.blockquote {...reveal} className="relative overflow-hidden rounded-2xl border p-6 md:p-7" style={{ borderColor: `${accent}44`, background: soft(accent) }}>
        <Quote size={54} className="absolute -right-1 -top-1 opacity-[0.12]" style={{ color: accent }} />
        <p className="relative text-[11px] font-black tracking-wide" style={{ color: accent }}>
          代表原声
        </p>
        <p className="relative mt-2 text-[19px] font-black leading-9" style={{ color: INK }}>
          「{heroQuote}」
        </p>
      </motion.blockquote>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        {moreQuotes.map((q) => (
          <motion.blockquote {...reveal} key={q} className="rounded-xl border border-[#e7e5de] bg-white px-4 py-3 text-[13px] italic leading-7" style={{ color: '#5c564f' }}>
            「{q}」
          </motion.blockquote>
        ))}
      </div>
    </div>
  );
}

// ── ⑥ 洋葱评价 ───────────────────────────────────────────────────────────────
function OnionBlock({ onion }: { onion: PersonaV2['story']['onion'] }) {
  return (
    <motion.div {...reveal} className="mt-6 rounded-xl border border-[#e7e5de] bg-white p-4 md:p-5">
      <div className="mb-3 flex items-center gap-2">
        <span className="h-5 w-1 rounded-full" style={{ background: STORY }} />
        <h4 className="text-[14px] font-black" style={{ color: INK }}>
          使用洋葱的目的 & 评价
        </h4>
      </div>
      <p className="text-[13px] leading-7" style={{ color: '#4a453f' }}>
        {onion.purpose}
      </p>
      <div className="mt-3 flex flex-wrap gap-3">
        {onion.cases.map((c, i) => (
          <CaseChip key={`${c.brand}-${i}`} {...c} />
        ))}
      </div>
    </motion.div>
  );
}

function FooterNote() {
  return (
    <p className="mt-10 rounded-xl border border-[#e4e2da] bg-[#f4f2ec] p-4 text-[11px] leading-5" style={{ color: MUTED }}>
      共性版式（对齐白皮书「典型用户代表」）：先「用户画像」讲这一类人（定义 / 边界 / 画像四维 / 典型案例 / 产品机会），
      再「用户故事」讲典型代表（人设横幅 / 家庭情况 / 核心特征 / 教育逻辑可视化 / 高亮原声 / 洋葱评价）。「教育逻辑可视化」为可插拔槽位，
      四类各用不同图式：兴趣启蒙=兴趣自驱飞轮、学科打底=长期阶梯、实验探究=讲解/动手天平、校内助力=教材对齐命中。
      数据来源：从小学系列售卖策略调研 · 访谈纪要与「用户画像和故事」。
    </p>
  );
}
