import React from 'react';
import {
  BookOpenCheck,
  ExternalLink,
  FileText,
  Lightbulb,
  Quote,
  SearchCheck,
  Sparkles,
  Target,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const INTERVIEW_INDEX_URL = 'https://guanghe.feishu.cn/wiki/STo3wNQSui7aohkP4oacAXVVnKf';
const QUANT_SOURCE_URL = 'https://guanghe.feishu.cn/wiki/XvjcwdzsZiEiJ1kF9UOcburXnig';
const STRATEGY_SOURCE_URL = 'https://guanghe.feishu.cn/wiki/BRBywMno4iK5QakFbmqcwJxen4b?from=from_copylink';
const RESEARCH_SOURCE_URL = 'https://guanghe.feishu.cn/wiki/S7NrwiHD8iQhkzR50cs54bnMf?from=from_copylink';

type DimensionId = 'core' | 'purchase' | 'experience' | 'barrier' | 'brand' | 'next';

interface SourceInfo {
  id: string;
  title: string;
  meta: string;
  materials: string;
  url: string;
  recordingUrl?: string;
}

const dimensions: Array<{ id: DimensionId; label: string; icon: typeof Lightbulb; color: string }> = [
  { id: 'core', label: '占领学科启蒙', icon: Lightbulb, color: '#E95B35' },
  { id: 'purchase', label: '短期兴趣与长期学科价值', icon: Target, color: '#2F9F8F' },
  { id: 'barrier', label: '让启蒙效果被看见', icon: SearchCheck, color: '#C58A3D' },
];

const sources: Record<string, SourceInfo> = {
  u1: {
    id: 'u1',
    title: '用户1-王女士',
    meta: '二年级｜山东临沂｜妙懂 & 十分通 & NB实验室',
    materials: '智能纪要｜文字记录',
    url: `${INTERVIEW_INDEX_URL}#CP6Qdhb0XoTpIxxAqgWc7x1Mnif`,
  },
  u2: {
    id: 'u2',
    title: '用户2-王先生',
    meta: '三年级｜北京昌平｜学而思科学 & NB实验室',
    materials: '智能纪要｜文字记录',
    url: `${INTERVIEW_INDEX_URL}#NVjrdP3c7oDgJLx0MlKcnDInnHf`,
  },
  u3: {
    id: 'u3',
    title: '用户3-周女士',
    meta: '二年级｜广东中山｜从小学物理（视频号购买）',
    materials: '智能纪要｜文字记录',
    url: `${INTERVIEW_INDEX_URL}#Hm0YdrirZorWf2x7xcocI1jinoh`,
  },
  u4: {
    id: 'u4',
    title: '用户4-关女士',
    meta: '二年级｜北京顺义｜从小学物理 & NB实验室 & 南开大学AI物理课',
    materials: '智能纪要｜文字记录｜本地录音切片',
    url: `${INTERVIEW_INDEX_URL}#NqATdZwhMo1B2ExTzsOcHL4Jnod`,
  },
  u5: {
    id: 'u5',
    title: '用户5-王女士',
    meta: '三年级｜重庆渝中｜妙懂 & 物理十分通 & 三五小星',
    materials: '访谈录音｜访谈逐字稿',
    url: `${INTERVIEW_INDEX_URL}#XUXldAwC5oPOJrxCgyIccsHEnwc`,
    recordingUrl: 'https://guanghe.feishu.cn/minutes/obcnmxj6m36kxvi2k3txa4u9?from=from_copylink',
  },
  u6: {
    id: 'u6',
    title: '用户6-王女士',
    meta: '四年级｜河南郑州｜从小学物理（视频号购买）',
    materials: '访谈录音｜文字逐字稿｜本地录音切片',
    url: `${INTERVIEW_INDEX_URL}#VRHPdy1pko3LLPxmmyHcGLqhnWe`,
    recordingUrl: 'https://guanghe.feishu.cn/minutes/obcno5fuo2wglif6rwv1o6r8?from=from_copylink',
  },
  u7: {
    id: 'u7',
    title: '用户7-丁女士',
    meta: '二年级｜山东潍坊｜从小学物理 & 南瓜科学',
    materials: '访谈录音｜文字记录',
    url: `${INTERVIEW_INDEX_URL}#PWzEd9Kk9o9JJcxiBkxcvLzqnvd`,
    recordingUrl: 'https://guanghe.feishu.cn/minutes/obcnvu8ri4f94293h88p8ap4',
  },
  u8: {
    id: 'u8',
    title: '用户8-X女士',
    meta: '一年级｜安徽合肥｜从小学物理 & 学而思生物课',
    materials: '访谈录音｜文字记录',
    url: `${INTERVIEW_INDEX_URL}#BbGQdc7TKoQ0m2xyPbMcqeK2nDe`,
    recordingUrl: 'https://guanghe.feishu.cn/minutes/obcnynrb466y6x9rmqoerwjr',
  },
};

function sourceOf(id: string): SourceInfo {
  return sources[id] ?? sources.u1;
}

type ConclusionPriority = '高优先级' | '中优先级';
type ConclusionConfidence = '高置信' | '中高置信';

interface ResearchVoc {
  quote: string;
  sourceId: string;
  tags: string[];
  sourceUrl?: string;
}

interface ResearchConclusion {
  id: string;
  dimension: DimensionId;
  title: string;
  summary: string;
  priority: ConclusionPriority;
  confidence: ConclusionConfidence;
  insight: string;
  conclusion: string;
  actions: string[];
  evidenceNote: string;
  vocs: ResearchVoc[];
}

const reportConclusions: ResearchConclusion[] = [
  {
    id: 'discipline-enlightenment',
    dimension: 'core',
    title: '从小学系列应占领“学科启蒙”',
    summary: '不是纯兴趣科普，也不是初中先修，而是低压力建立理科概念。',
    priority: '高优先级',
    confidence: '高置信',
    insight:
      '低年级家长对从小学物理的期待，介于“好玩科普”和“正式先修”之间：他们希望孩子先认识自然现象、听懂基础概念、对未来理科学习不陌生，但并不希望小学阶段过早进入应试和完整初中体系。',
    conclusion: '从小学系列最应该占领的是“学科启蒙”：用低压力、生活化、孩子听得懂的方式，让孩子先建立理科概念和学科熟悉感。',
    actions: [
      '核心话术弱化“提前学完整物理”，强化“先有概念、未来不陌生”。',
      '把页面中的定位表达统一到“学科启蒙”，避免纯兴趣和先修两种心智互相打架。',
      '对科学主科化地区保留同步价值，但不把它作为唯一主定位。',
    ],
    evidenceNote: '来源说明：洞察小结、售卖策略调研、访谈纪要；涉及用户1、用户2、用户3、用户6。',
    vocs: [
      {
        sourceId: 'u1',
        tags: ['学科启蒙', '自然现象', '低压力'],
        quote: '有个概念就行。不是为了提前学什么，更多是让他了解一下自然现象。',
      },
      {
        sourceId: 'u2',
        tags: ['学科启蒙', '未来理科', '长期铺垫'],
        quote: '学科启蒙：为了以后中高考、初高中理科学习。兴趣启蒙：要求更低，更像让孩子试水，培养兴趣。',
      },
      {
        sourceId: 'u3',
        tags: ['物理启蒙', '初中衔接', '生活素材'],
        quote: '素材可以从生活中随手，可以随时可以找到。然后就可以提前对那个物理启蒙。',
      },
      {
        sourceId: 'u6',
        tags: ['科学主科化', '校内科学', '避免死记硬背'],
        quote: '郑州把科学课纳入了主科，期中期末都在考。到初中之后它就变成了物理化学生物，我不希望他只是去死记硬背。',
      },
    ],
  },
  {
    id: 'primary-audience',
    dimension: 'core',
    title: '主要受众是小学 1-4 年级家长',
    summary: '他们已经在想未来理科，但又不想让孩子过早应试。',
    priority: '高优先级',
    confidence: '中高置信',
    insight:
      '从访谈和定量数据看，核心用户集中在小学低中年级。这个阶段的家长对理科启蒙有真实兴趣，但购买理由往往不是当下考试成绩，而是孩子是否能对科学产生兴趣、对未来物理不排斥、进入初中后吸收更快。',
    conclusion: '核心洞察应把“主受众”说清楚：小学 1-4 年级，尤其是已经开始关注未来理科学习、但仍希望低压力启蒙的家庭。',
    actions: [
      '受众描述从泛泛的“启蒙家庭”收窄到“小学低中年级的未来理科铺垫型家长”。',
      '在结论里保留低龄孩子的理解门槛，避免把内容写成高年级同步课。',
      '把科学主科化地区家长作为增强型人群，而不是覆盖全部用户的主叙事。',
    ],
    evidenceNote: '来源说明：定量报告显示核心客群孩子集中在 1-5 年级；访谈覆盖用户1-用户8。',
    vocs: [
      {
        sourceId: 'u4',
        tags: ['低年级', '未来理科', '兴趣保护'],
        quote: '还是从小激发这个物理的学习兴趣，也能不排斥以后。',
      },
      {
        sourceId: 'u7',
        tags: ['初高中衔接', '低年级启蒙', '未来不吃力'],
        quote: '让孩子先接触一下初高中的课程，了解相关知识，之后学起来可能不吃力。',
      },
      {
        sourceId: 'u8',
        tags: ['一年级', '长期价值', '未来理科'],
        quote: '最少他上初中、高中学习物理不会那么吃力吧。',
      },
    ],
  },
  {
    id: 'short-term-needs',
    dimension: 'purchase',
    title: '短期需求：爱看、听懂、能说、能做、低压力',
    summary: '短期不是证明成绩，而是让孩子愿意进入科学内容并产生可感知反馈。',
    priority: '高优先级',
    confidence: '高置信',
    insight:
      '小学阶段的启蒙效果首先体现在孩子愿不愿意看、能不能听懂、会不会用自己的话说、有没有动手或观察兴趣，以及学习是否不挤压主科时间。短期需求如果只写“兴趣”，会丢掉家长真正关心的理解和反馈。',
    conclusion: '短期需求应拆成五个可对应 VOC 的维度：爱看、听懂、能说、能做、低压力。',
    actions: [
      '页面表达不要只写“孩子喜欢”，要补充“听懂了什么、能讲出什么、能做什么”。',
      '把实验男、生活现象、短视频节奏和碎片时间使用，都归到短期启蒙价值里。',
      '把低龄孩子听不懂、读题难的问题作为短期体验优化依据。',
    ],
    evidenceNote: '来源说明：洞察小结与访谈纪要；涉及用户4、用户5、用户7、用户8。',
    vocs: [
      {
        sourceId: 'u4',
        tags: ['爱看', '实验男', '主动学习'],
        quote: '洋葱学园的从小学物理，如果说我不是不管的话，他每天他都会刷。他好像特别喜欢看那实验男做实验。他当成趣味里边学知识了。',
      },
      {
        sourceId: 'u4',
        tags: ['听懂', '儿童化讲解', '概念理解'],
        quote: '晦涩难懂的一些概念词，孩子还是不能很好的理解。',
      },
      {
        sourceId: 'u5',
        tags: ['能做', '实验理解', '原理记忆'],
        quote: '只看视频容易忘，如果有实验会更清楚原理。',
      },
      {
        sourceId: 'u7',
        tags: ['持续观看', '动画表达', '轻学习'],
        quote: '一个知识点接一个知识点，让孩子像看动画片一样一个接一个看下去。',
      },
    ],
  },
  {
    id: 'long-term-needs',
    dimension: 'purchase',
    title: '长期需求：未来学理科不陌生、不排斥、吸收更快',
    summary: '兴趣只是入口，长期学科价值才是家长合理化购买的理由。',
    priority: '高优先级',
    confidence: '高置信',
    insight:
      '家长并不满足于孩子当下“看得开心”。他们会把从小学物理和未来初高中理科学习联系起来，希望孩子正式接触物理时不陌生、不畏难、不排斥，并能更快理解抽象概念。',
    conclusion: '核心洞察需要明确：兴趣负责打开入口，长期学科价值负责支撑购买。',
    actions: [
      '把“未来有用”从一句口号拆成“不陌生、不排斥、吸收更快、理科思维”。',
      '详情页和洞察页都应先讲孩子爱看，再补足长期理科学习价值。',
      '避免把长期价值写成应试承诺，而是写成学科熟悉感和理解基础。',
    ],
    evidenceNote: '来源说明：售卖策略调研、洞察小结、访谈纪要；涉及用户2、用户3、用户7、用户8。',
    vocs: [
      {
        sourceId: 'u2',
        tags: ['未来有用', '中高考', '理科学习'],
        quote: '希望孩子现在学一遍，初高中再学一遍时更轻松。',
      },
      {
        sourceId: 'u3',
        tags: ['初中物理', '提前认识', '启蒙价值'],
        quote: '因为以后到初中也会学到物理，然后可以提前让他认识知道一些就是跟物理相关的知识。',
      },
      {
        sourceId: 'u7',
        tags: ['未来不吃力', '提前接触', '学科铺垫'],
        quote: '让孩子先接触一下初高中的课程，了解相关知识，之后学起来可能不吃力。',
      },
      {
        sourceId: 'u8',
        tags: ['初高中', '长期价值', '学习信心'],
        quote: '最少他上初中、高中学习物理不会那么吃力吧。',
      },
    ],
  },
  {
    id: 'onion-fit',
    dimension: 'purchase',
    title: '洋葱适合承接“学科启蒙”',
    summary: '它不是单独拉一个模块，而是支撑需求成立后的品牌与产品承接。',
    priority: '中优先级',
    confidence: '中高置信',
    insight:
      '用户需求成立不等于洋葱天然能赢，因此需要在短期/长期需求后补一句“为什么洋葱适合做”。从现有 VOC 看，洋葱被认可的点集中在动画易懂、知识更系统、品牌可信、内容丰富、能让孩子主动看。',
    conclusion: '“为什么洋葱适合做”适合作为第二模块里的支撑结论：洋葱能把兴趣入口、系统课程和长期学科价值连起来。',
    actions: [
      '把洋葱优势写成系统性、专业性、易懂性、丰富性、品牌信任五个支撑点。',
      '不把“洋葱适合做”独立成第四个大模块，避免核心洞察结构变散。',
      '用 VOC 证明“孩子愿意看”和“家长相信体系”同时存在。',
    ],
    evidenceNote: '来源说明：购买原因与体验横向汇总、访谈纪要；涉及用户3、用户4、用户7。',
    vocs: [
      {
        sourceId: 'u4',
        tags: ['系统性', '课程目录', '自主选择'],
        quote: '知识的话就是系统性更强，因为它都已经罗列得非常分层次，看得也比较清晰，孩子也能自行选取。',
      },
      {
        sourceId: 'u4',
        tags: ['品牌信任', '购买原因', '顺手加购'],
        quote: '就还是当时他有这个链接挂链了，我也需要，就买了。有对比，没有那么多，当时。就基于他信任。',
      },
      {
        sourceId: 'u7',
        tags: ['动画表达', '持续观看', '易懂'],
        quote: '一个知识点接一个知识点，让孩子像看动画片一样一个接一个看下去。',
      },
      {
        sourceId: 'u3',
        tags: ['生活化', '实验素材', '物理启蒙'],
        quote: '素材可以从生活中随手，可以随时可以找到。然后就可以提前对那个物理启蒙。',
      },
    ],
  },
  {
    id: 'effect-judgment',
    dimension: 'barrier',
    title: '终极判断：初中有用，但小学阶段难验证',
    summary: '家长最终看未来理科有没有帮助，可这个结果离购买当下太远。',
    priority: '高优先级',
    confidence: '中高置信',
    insight:
      '启蒙类课程的终极价值往往要等孩子正式学习初中物理后才真正显现，但家长是在小学阶段就要做购买决策。这个时间差会让家长产生不确定：孩子现在爱看，是否真的代表以后有用？',
    conclusion: '第三个模块应先讲清楚判断逻辑：终极判断是未来初中有用，但现阶段必须提供更近的验证信号。',
    actions: [
      '把“初中有用”作为长期终点，同时补短期验证路径。',
      '不要只用“孩子喜欢看”证明效果，要设计更接近学习结果的反馈。',
      '将家长的验证焦虑转化为产品机会，而不是单纯归为购买卡点。',
    ],
    evidenceNote: '来源说明：洞察小结、访谈纪要；涉及用户3、用户5、用户8。',
    vocs: [
      {
        sourceId: 'u3',
        tags: ['终极判断', '初中验证', '长期效果'],
        quote: '到初中正式学物理才能看出。',
      },
      {
        sourceId: 'u5',
        tags: ['效果判断', '学习反馈', '家长不确定'],
        quote: '我想知道他到底学了什么东西？学到了什么东西？学了多少？能记住什么？',
      },
      {
        sourceId: 'u8',
        tags: ['学习报告', '掌握程度', '验证缺口'],
        quote: '没有学习报告，不知道孩子最终掌握什么程度。',
      },
    ],
  },
  {
    id: 'current-barriers',
    dimension: 'barrier',
    title: '现有困境与后果：看不见效果会放大购买和使用卡点',
    summary: '孩子爱看不等于家长放心，效果不可见会带来吃灰、遗忘和低频使用担忧。',
    priority: '高优先级',
    confidence: '中高置信',
    insight:
      '当家长不知道孩子学到了什么、记住了什么、是否能迁移到生活现象时，启蒙价值就会变得抽象。结果是购买前不确定、购买后低频使用，甚至出现“买了但没坚持”“想起来才看”的情况。',
    conclusion: '卡点不应单独外置，而应作为“启蒙怎么有效判断”的子维度：看不见效果，才会导致不确定和使用折损。',
    actions: [
      '在第三模块内保留“现有困境”和“导致后果”，不要拆成独立一级模块。',
      '把时间挤压、入口难找、不同步、吃灰担忧，都归因到启蒙效果缺少阶段性确认。',
      '优先表达对转化影响最大的卡点：不确定孩子到底学到了什么。',
    ],
    evidenceNote: '来源说明：调研结论同步、访谈纪要；涉及用户3、用户5、用户6。',
    vocs: [
      {
        sourceId: 'u3',
        tags: ['坚持困难', '时间挤压', '使用折损'],
        quote: '到了三年级以上，学业比较重，你很难顾及全科的。',
      },
      {
        sourceId: 'u5',
        tags: ['不知道学了什么', '效果不可见', '购买犹豫'],
        quote: '我不知道怎么去看这个东西。就说孩子学了多少东西。',
      },
      {
        sourceId: 'u6',
        tags: ['不同步', '找不到内容', '使用率'],
        quote: '如果说是同步的话，我觉得会更好，就是使用率上会更高一些。',
      },
    ],
  },
  {
    id: 'visible-opportunity',
    dimension: 'barrier',
    title: '机会点：把启蒙效果外化',
    summary: '让孩子学会的东西被家长看见、听见、追踪到。',
    priority: '高优先级',
    confidence: '高置信',
    insight:
      '如果家长短期无法验证“初中有用”，产品就需要把阶段性效果外化：孩子能复述、能解释生活现象、能完成实验、能做对小题、学习报告能显示进度。这些反馈会让启蒙从抽象价值变成家庭里可感知的结果。',
    conclusion: '最大机会点是建立“启蒙有效”的可见证据链：学习报告、孩子复述、知识进度、实验完成和小测反馈。',
    actions: [
      '把“孩子讲给家长听”设计成课程后的轻任务。',
      '学习报告展示已学概念、能解释的生活现象、实验完成和小测反馈。',
      '商详页把“学完能解释什么”放到卖点里，直接回应家长的效果判断。',
    ],
    evidenceNote: '来源说明：洞察小结、售卖策略调研、访谈纪要；涉及用户1、用户4、用户7、用户8。',
    vocs: [
      {
        sourceId: 'u4',
        tags: ['孩子复述', '效果外化', '家庭反馈'],
        quote: '他看了之后会考我，会把课上看的从小学物理视频转化成自己的语言。',
      },
      {
        sourceId: 'u1',
        tags: ['能解释', '概念认知', '启蒙结果'],
        quote: '孩子能说出一些基本原理，有概念性认知即可。',
      },
      {
        sourceId: 'u7',
        tags: ['生活迁移', '惯性', '理解反馈'],
        quote: '现实生活中见到以后能联想到，比如停车前倾知道是惯性。',
      },
      {
        sourceId: 'u8',
        tags: ['做题反馈', '讲给家长', '掌握判断'],
        quote: '做题能做对，能讲给家长听，就是看懂了。',
      },
    ],
  },
];

function sourceUrlOf(voc: ResearchVoc) {
  return voc.sourceUrl ?? sourceOf(voc.sourceId).url;
}

function ResearchVocCard({ voc, dense = false }: { voc: ResearchVoc; dense?: boolean }) {
  const source = sourceOf(voc.sourceId);
  const sourceLabel = `${source.title.split('-')[0]}访谈`;

  return (
    <article className={cn('rounded-[14px] border border-[#E6DDD3] bg-white p-4 shadow-[0_8px_22px_rgba(55,44,34,.04)]', dense && 'p-3.5')}>
      <div className="flex items-start gap-2.5">
        <Quote size={16} className="mt-1 shrink-0 text-[#E95B35]" />
        <p className={cn('font-semibold leading-7 text-[#2E2924]', dense ? 'text-[13px]' : 'text-[14px]')}>“{voc.quote}”</p>
      </div>
      <div className="mt-3 border-t border-[#EEE5DC] pt-3">
        <p className="text-[12px] font-black text-[#403A34]">{`${source.title}｜${source.meta}`}</p>
        <p className="mt-1 text-[11px] font-semibold text-[#7D746A]">
          {sourceLabel}｜{source.materials}
        </p>
      </div>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {voc.tags.map((tag) => (
          <span key={`${voc.sourceId}-${tag}`} className="rounded-full bg-[#FFF3EE] px-2 py-1 text-[11px] font-bold text-[#E95B35]">
            {tag}
          </span>
        ))}
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <a
          href={sourceUrlOf(voc)}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1 rounded-full border border-[#D9D1C7] bg-[#FAF8F4] px-2.5 py-1 text-[11px] font-bold text-[#6E675F] hover:border-[#E95B35] hover:text-[#E95B35]"
        >
          查看来源记录
          <ExternalLink size={11} />
        </a>
      </div>
    </article>
  );
}

export default function FromPrimaryMergedReport() {
  const [selectedByDimension, setSelectedByDimension] = React.useState<Record<DimensionId, string>>(() =>
    dimensions.reduce(
      (acc, dimension) => {
        const first = reportConclusions.find((item) => item.dimension === dimension.id);
        if (first) acc[dimension.id] = first.id;
        return acc;
      },
      {} as Record<DimensionId, string>,
    ),
  );
  const [drawerConclusionId, setDrawerConclusionId] = React.useState<string | null>(null);

  const drawerConclusion = drawerConclusionId ? reportConclusions.find((item) => item.id === drawerConclusionId) : null;
  const totalVoc = reportConclusions.reduce((sum, item) => sum + item.vocs.length, 0);
  const userCount = new Set(reportConclusions.flatMap((item) => item.vocs.map((voc) => voc.sourceId))).size;

  return (
    <main className="min-h-full bg-[#F8F6F1] text-[#292521]">
      <header className="px-5 py-7 md:px-8">
        <div className="mx-auto max-w-[1440px]">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="text-[12px] font-black tracking-[0.16em] text-[#E95B35]">从小学系列售卖策略调研</p>
              <h1 className="mt-3 text-[32px] font-black leading-tight md:text-[42px]">从小学物理洞察总览</h1>
              <p className="mt-3 max-w-3xl text-[15px] font-semibold leading-7 text-[#706960]">
                用于沉淀小学物理项目的核心结论、VOC 证据和产品优化建议，帮助业务方先看判断，再追溯到用户原声。
              </p>
            </div>
            <div className="flex flex-wrap gap-2 lg:max-w-[420px] lg:justify-end">
              {[
                { label: '洞察小结', url: STRATEGY_SOURCE_URL },
                { label: '研究方案', url: RESEARCH_SOURCE_URL },
                { label: '访谈纪要', url: INTERVIEW_INDEX_URL },
                { label: '定量报告', url: QUANT_SOURCE_URL },
              ].map((link) => (
                <a
                  key={link.label}
                  href={link.url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-full border border-[#D8D0C6] bg-white px-3 py-2 text-[12px] font-black text-[#5F5851] shadow-sm transition hover:border-[#E95B35] hover:text-[#E95B35]"
                >
                  <FileText size={13} />
                  {link.label}
                  <ExternalLink size={11} />
                </a>
              ))}
            </div>
          </div>

          <div className="mt-7 grid gap-4 md:grid-cols-3">
            {[
              { icon: Lightbulb, value: reportConclusions.length, label: '核心结论', desc: '已沉淀的可行动判断', color: '#E95B35', bg: '#FFF3EE' },
              { icon: Quote, value: totalVoc, label: '有效 VOC', desc: '与结论强绑定的原声', color: '#2F9F8F', bg: '#EFFFFB' },
              { icon: Target, value: userCount, label: '涉及用户', desc: '覆盖访谈用户来源', color: '#C58A3D', bg: '#FFF7E8' },
            ].map(({ icon: Icon, value, label, desc, color, bg }) => (
              <div key={label} className="rounded-[18px] border border-[#E6DDD3] bg-white p-5 shadow-[0_10px_28px_rgba(55,44,34,.05)]">
                <div className="flex items-center gap-4">
                  <div className="grid size-14 place-items-center rounded-full" style={{ backgroundColor: bg, color }}>
                    <Icon size={24} />
                  </div>
                  <div>
                    <p className="text-[14px] font-black text-[#403A34]">{label}</p>
                    <p className="text-[34px] font-black leading-none" style={{ color }}>
                      {value}
                    </p>
                    <p className="mt-1 text-[12px] font-semibold text-[#8A8279]">{desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </header>

      <section className="px-5 pb-8 md:px-8">
        <div className="mx-auto max-w-[1440px] space-y-6">
          {dimensions.map((dimension) => {
            const dimensionItems = reportConclusions.filter((item) => item.dimension === dimension.id);
            if (dimensionItems.length === 0) return null;
            const selectedId = selectedByDimension[dimension.id];
            const selectedConclusion = dimensionItems.find((item) => item.id === selectedId) ?? dimensionItems[0];
            const selectedIndex = dimensionItems.findIndex((item) => item.id === selectedConclusion.id);
            const Icon = dimension.icon;

            return (
              <article
                key={dimension.id}
                className="rounded-[24px] border border-[#E0D7CC] bg-white p-5 shadow-[0_18px_42px_rgba(55,44,34,.07)]"
              >
                <div className="mb-5 flex flex-col gap-3 border-b border-[#E8DED3] pb-4 md:flex-row md:items-center md:justify-between">
                  <div className="flex items-center gap-3">
                    <div className="grid size-11 place-items-center rounded-full" style={{ backgroundColor: `${dimension.color}18`, color: dimension.color }}>
                      <Icon size={21} />
                    </div>
                    <div>
                      <h2 className="text-[22px] font-black text-[#292521]">{dimension.label}</h2>
                      <p className="mt-1 text-[12px] font-semibold text-[#7D746A]">本维度包含 {dimensionItems.length} 条结论，点击左侧结论查看对应分析和 VOC。</p>
                    </div>
                  </div>
                  <span
                    className="w-fit rounded-full px-3 py-1.5 text-[12px] font-black"
                    style={{ backgroundColor: `${dimension.color}14`, color: dimension.color }}
                  >
                    {dimensionItems.length} 条结论
                  </span>
                </div>

                <div className="grid items-start gap-5 xl:grid-cols-[300px_minmax(0,1fr)]">
                  <aside
                    className="self-start rounded-[18px] border border-[#E6DDD3] bg-[#FBFAF7] p-3 xl:flex xl:flex-col xl:overflow-hidden"
                  >
                    <div className="mb-3 flex shrink-0 items-center justify-between">
                      <p className="text-[14px] font-black text-[#403A34]">结论列表</p>
                      <span className="text-[11px] font-bold text-[#8A8279]">{dimensionItems.length} 条</span>
                    </div>
                    <div className="min-h-0 space-y-2.5 pr-1 xl:flex-1 xl:overflow-y-auto">
                      {dimensionItems.map((item) => {
                        const selected = item.id === selectedConclusion.id;
                        const index = dimensionItems.findIndex((entry) => entry.id === item.id);
                        return (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => {
                              setSelectedByDimension((prev) => ({ ...prev, [dimension.id]: item.id }));
                              if (drawerConclusionId) setDrawerConclusionId(null);
                            }}
                            className={cn(
                              'w-full rounded-[14px] border p-4 text-left transition',
                              selected
                                ? 'bg-white shadow-[0_12px_28px_rgba(55,44,34,.08)]'
                                : 'bg-white hover:bg-[#FFF9F5]',
                            )}
                            style={{ borderColor: selected ? dimension.color : `${dimension.color}55` }}
                          >
                            <div className="flex items-start gap-3">
                              <span className="grid size-8 shrink-0 place-items-center rounded-full bg-[#F1ECE5] text-[14px] font-black text-[#7D746A]">
                                {index + 1}
                              </span>
                              <div className="min-w-0">
                                <h3 className="text-[15px] font-black leading-6 text-[#292521]">{item.title}</h3>
                                <p className="mt-1 text-[12px] font-semibold leading-5 text-[#6F675F]">{item.summary}</p>
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </aside>

                  <section className="self-start rounded-[18px] border border-[#E6DDD3] bg-white p-5">
                    <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-[12px] font-black" style={{ backgroundColor: `${dimension.color}12`, color: dimension.color }}>
                      当前结论
                      <span className="rounded-full bg-white px-2 py-0.5">{selectedIndex + 1}</span>
                    </div>
                    <h3 className="mt-4 text-[28px] font-black leading-tight text-[#292521]">{selectedConclusion.title}</h3>

                    <div className="mt-5 rounded-[16px] border border-[#EEE0D6] bg-[#FFF9F5] p-5">
                      <div className="flex items-center gap-2 text-[14px] font-black" style={{ color: dimension.color }}>
                        <BookOpenCheck size={17} />
                        关键洞察
                      </div>
                      <p className="mt-3 text-[15px] font-semibold leading-8 text-[#403A34]">{selectedConclusion.insight}</p>
                    </div>

                    <div className="mt-4 rounded-[16px] border bg-white p-5" style={{ borderColor: `${dimension.color}40`, boxShadow: `inset 4px 0 0 ${dimension.color}` }}>
                      <div className="flex items-center gap-2 text-[14px] font-black" style={{ color: dimension.color }}>
                        <Sparkles size={17} />
                        核心结论
                      </div>
                      <p className="mt-3 text-[18px] font-black leading-8 text-[#292521]">{selectedConclusion.conclusion}</p>
                    </div>

                    <div className="mt-4 rounded-[16px] border border-[#D8EFE8] bg-[#F5FFFC] p-5">
                      <div className="flex items-center gap-2 text-[14px] font-black text-[#2F9F8F]">
                        <Target size={17} />
                        建议行动
                      </div>
                      <div className="mt-3 space-y-2.5">
                        {selectedConclusion.actions.map((action, index) => (
                          <div key={action} className="flex items-start gap-3 rounded-[12px] bg-white px-3 py-3">
                            <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-[#2F9F8F] text-[11px] font-black text-white">
                              {index + 1}
                            </span>
                            <p className="text-[14px] font-bold leading-6 text-[#403A34]">{action}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="mt-4 rounded-[14px] border border-[#E6DDD3] bg-[#FBFAF7] px-4 py-3 text-[12px] font-semibold leading-6 text-[#7D746A]">
                      {selectedConclusion.evidenceNote}
                    </div>

                    <div className="mt-5 rounded-[16px] border border-[#E6DDD3] bg-[#FBFAF7] p-4">
                      <div className="mb-4 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                        <div>
                          <h3 className="text-[18px] font-black text-[#292521]">对应 VOC</h3>
                          <p className="mt-1 text-[12px] font-semibold text-[#7D746A]">直接支撑当前结论的用户原声</p>
                        </div>
                        <span className="w-fit rounded-full bg-[#F1ECE5] px-2.5 py-1 text-[12px] font-black text-[#6E675F]">{selectedConclusion.vocs.length} 条</span>
                      </div>
                      <div className="grid gap-3 lg:grid-cols-3">
                        {selectedConclusion.vocs.slice(0, 3).map((voc) => (
                          <ResearchVocCard key={`${selectedConclusion.id}-${voc.sourceId}-${voc.quote}`} voc={voc} dense />
                        ))}
                      </div>
                      <button
                        type="button"
                        onClick={() => setDrawerConclusionId(selectedConclusion.id)}
                        className="mt-4 w-full rounded-[12px] border px-4 py-3 text-[13px] font-black hover:bg-white md:w-auto"
                        style={{ borderColor: `${dimension.color}50`, backgroundColor: `${dimension.color}10`, color: dimension.color }}
                      >
                        查看全部 VOC（{selectedConclusion.vocs.length} 条）
                      </button>
                    </div>
                  </section>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {drawerConclusion && (
        <div className="fixed inset-0 z-50 bg-[#292521]/35" role="presentation" onClick={() => setDrawerConclusionId(null)}>
          <aside
            className="ml-auto h-full w-full max-w-[520px] overflow-y-auto bg-[#F8F6F1] p-5 shadow-[-18px_0_42px_rgba(55,44,34,.22)]"
            role="dialog"
            aria-modal="true"
            aria-label={`${drawerConclusion.title}全部 VOC`}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="sticky top-0 z-10 -mx-5 -mt-5 border-b border-[#E6DDD3] bg-[#F8F6F1]/95 px-5 py-4 backdrop-blur">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[12px] font-black tracking-[0.12em] text-[#E95B35]">全部 VOC</p>
                  <h2 className="mt-1 text-[22px] font-black text-[#292521]">{drawerConclusion.title}</h2>
                </div>
                <button
                  type="button"
                  onClick={() => setDrawerConclusionId(null)}
                  className="grid size-9 shrink-0 place-items-center rounded-full border border-[#D8D0C6] bg-white text-[20px] font-light text-[#7D746A] hover:border-[#E95B35] hover:text-[#E95B35]"
                  aria-label="关闭全部 VOC"
                >
                  ×
                </button>
              </div>
            </div>
            <div className="mt-5 space-y-3">
              {drawerConclusion.vocs.map((voc) => (
                <ResearchVocCard key={`drawer-${drawerConclusion.id}-${voc.sourceId}-${voc.quote}`} voc={voc} />
              ))}
            </div>
          </aside>
        </div>
      )}

      <footer className="px-5 pb-8 text-center text-[12px] font-semibold text-[#A19990] md:px-8">
        用户原声来源限定为访谈目录中的用户1-用户8；每个维度卡片内的结论、分析和 VOC 独立联动。
      </footer>
    </main>
  );
}
