import React from 'react';
import {
  BarChart3,
  BookOpenCheck,
  ExternalLink,
  FileText,
  Lightbulb,
  Mic2,
  Pause,
  Play,
  Quote,
  SearchCheck,
  Sparkles,
  Target,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { lookupClips } from '@/utils/sourceUtils';

const ORANGE = '#E95B35';
const INK = '#292521';
const MUTED = '#746E67';
const INTERVIEW_INDEX_URL = 'https://guanghe.feishu.cn/wiki/STo3wNQSui7aohkP4oacAXVVnKf';
const QUANT_SOURCE_URL = 'https://guanghe.feishu.cn/wiki/XvjcwdzsZiEiJ1kF9UOcburXnig';

type DimensionId = 'core' | 'purchase' | 'experience' | 'barrier' | 'brand' | 'next';

interface SourceInfo {
  id: string;
  title: string;
  meta: string;
  materials: string;
  url: string;
  recordingUrl?: string;
}

interface Voice {
  text: string;
  sourceId: string;
  audioUrl?: string;
  sourceUrl?: string;
}

interface InsightCard {
  id: string;
  dimension: DimensionId;
  title: string;
  conclusion: string;
  data?: string;
  voices: Voice[];
}

const dimensions: Array<{ id: DimensionId; label: string; icon: typeof Lightbulb; color: string }> = [
  { id: 'core', label: '核心洞察', icon: Lightbulb, color: '#E95B35' },
  { id: 'purchase', label: '购买决策', icon: Target, color: '#3E76A8' },
  { id: 'experience', label: '买后体验', icon: BookOpenCheck, color: '#18806F' },
  { id: 'barrier', label: '为什么不买', icon: SearchCheck, color: '#8A5A22' },
  { id: 'brand', label: '品牌差异', icon: Sparkles, color: '#6E4AA5' },
  { id: 'next', label: '下一步建议', icon: BarChart3, color: '#B64A35' },
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

const cards: InsightCard[] = [
  {
    id: 'c01',
    dimension: 'core',
    title: '核心定位是“学科启蒙”',
    conclusion: '从小学物理应占领兴趣启蒙和小初衔接之间的中间地带。',
    data: '定量报告：核心客群孩子集中在 1-5 年级。',
    voices: [
      { sourceId: 'u1', text: '我就觉得他可以大概了解一下，有个概念就行。不是为了提前学什么，更多是让他了解一下自然现象，他小孩不是有的时候可能会问吗？然后这一类的可能会有一些比较直观的内容，包括一些，这个他可能会就是更准确一些，对于我们家长跟他解释的话可能有的时候不一定那么的正规。' },
      { sourceId: 'u2', text: '希望孩子现在学一遍，初高中再学一遍时更轻松。' },
      { sourceId: 'u7', text: '为孩子购买从小学物理的诉求最偏向学科启蒙。' },
    ],
  },
  {
    id: 'c02',
    dimension: 'core',
    title: '兴趣是入口，未来有用才是购买理由',
    conclusion: '孩子喜欢是购买入口，但家长真正买单的是未来理科学习有帮助。',
    data: '趣味动画课 53%，孩子喜欢 40%，课程体系 29%。',
    voices: [
      { sourceId: 'u3', text: '因为他说素材可以从生活中随手，可以随时可以找到。然后就可以提前对那个物理启蒙。因为以后到初中也会学到物理，然后可以提前让他认识知道一些就是跟物理相关的知识。' },
      { sourceId: 'u7', text: '让孩子先接触一下初高中的课程，了解相关知识，之后学起来可能不吃力。' },
      { sourceId: 'u8', text: '最少他上初中、高中学习物理不会那么吃力吧。' },
    ],
  },
  {
    id: 'c03',
    dimension: 'core',
    title: '效果需要外化',
    conclusion: '不能只让家长看到孩子爱看，还要看到孩子到底学到了什么。',
    data: '定量报告未给该点单独比例，不放造数。',
    voices: [
      { sourceId: 'u4', text: '他看了之后会考我，会把课上看的从小学物理视频转化成自己的语言。', audioUrl: '/clips/interview4/0048-01.mp3' },
      { sourceId: 'u5', text: '没看出，因为我有没，没有，我不知道怎么去看这个东西。就说孩子学了多少东西，因为我平时又没看的，没去，一直关注他看的是什么。然后我想知道他到底学了什么东西？学到了什么东西？学了多少？能记住什么？' },
      { sourceId: 'u8', text: '没有学习报告，不知道孩子最终掌握什么程度。' },
    ],
  },
  {
    id: 'c04',
    dimension: 'purchase',
    title: '核心购买人群',
    conclusion: '36-44 岁、企业/事业单位家长，孩子 1-5 年级，年教育支出 5000+。',
    data: '广东 14.81%；江浙鲁各 9.88%；北京、河南各 8.64%。',
    voices: [
      { sourceId: 'u2', text: '更关注长期能力、学习习惯、理科思维和未来学科优势。' },
      { sourceId: 'u4', text: '还是从小激发这个物理的学习兴趣，也能不排斥以后，因为以后有更高的，毕竟升学需求，考试科目的选取，还是不想让他之后对理科失去兴趣，所以抓住从小应该掌握这个理科的黄金期，让他去早早的有所渗透。' },
      { sourceId: 'u6', text: '郑州把科学课纳入了主科，期中期末都在考。到初中之后它就变成了物理化学生物，我不希望他只是去死记硬背。' },
    ],
  },
  {
    id: 'c05',
    dimension: 'purchase',
    title: '购买直接动因是有趣、孩子喜欢',
    conclusion: '孩子愿意看、主动看，是最直接的购买触发。',
    data: '趣味动画课 53%；孩子喜欢 40%。',
    voices: [
      { sourceId: 'u4', text: '洋葱学园的从小学物理，如果说我不是不管的话，他每天他都会刷。他好像特别喜欢看那实验男做实验。他当成趣味里边学知识了。' },
      { sourceId: 'u7', text: '短视频的形式比较娱乐，孩子能看得进去。' },
      { sourceId: 'u8', text: '孩子喜欢卡实验男，因为可以做一些家里做不到的实验。' },
    ],
  },
  {
    id: 'c06',
    dimension: 'purchase',
    title: '课程体系让家长安心',
    conclusion: '家长不只买好玩，还希望课程有体系、能为后续学习打底。',
    data: '课程体系 29%；单选最重要因素约 16%。',
    voices: [
      { sourceId: 'u4', text: '从小学物理的知识好像更多更系统，更多NB实验室来讲。孩子静下心来去做，在那去看，从小学物理讲这个概念，趣味性的概念，他投入的就是专注力更多，注意力会更吸引孩子吧。' },
      { sourceId: 'u4', text: '知识的话就是系统性更强，因为它都已经罗列得非常分层次，看得也比较清晰，孩子也能自行选取，他喜欢什么，他也可以能随机点取，自己的选择性更强。' },
      { sourceId: 'u7', text: '一个知识点接一个知识点，让孩子像看动画片一样一个接一个看下去。' },
    ],
  },
  {
    id: 'c07',
    dimension: 'purchase',
    title: '购买路径来自自有渠道和直播转化',
    conclusion: '常见路径是公众号、视频号、直播间触达，再顺手购买。',
    data: '定量报告总结为“认知 → 了解 → 决策”。',
    voices: [
      { sourceId: 'u3', text: '因为他说素材可以从生活中随手，可以随时可以找到。然后就可以提前对那个物理启蒙。因为以后到初中也会学到物理，然后可以提前让他认识知道一些就是跟物理相关的知识。' },
      { sourceId: 'u6', text: '当时买洋葱学园的数学课的时候，推荐了这个物理课，我才买的。当时是郑州妈妈帮有一个线上的直播，当时主要请到了洋葱学园的老师，当时在卖数学课，科学课又间接推了一下，我就直接买了。' },
      { sourceId: 'u8', text: '给姐姐买了高中物理，然后顺着推荐给弟弟买了小学课程。' },
    ],
  },
  {
    id: 'c08',
    dimension: 'experience',
    title: '使用场景是碎片时间',
    conclusion: '吃饭、休息、周末、主科学累了，是主要使用场景。',
    data: '定量报告未给场景比例，不放造数。',
    voices: [
      { sourceId: 'u4', text: '吃饭的时候在学习机上看，星期六星期天出去玩累的时候看一下。' },
      { sourceId: 'u5', text: '周一到周五就是零碎时间看，比如吃饭时间在学习机上看。' },
      { sourceId: 'u6', text: '做完作业，或者累了休息一会的时候看。' },
    ],
  },
  {
    id: 'c09',
    dimension: 'experience',
    title: '体验优势是系统、短、孩子愿意看',
    conclusion: '相对零散科普更系统，相对正式课程更轻量。',
    data: '趣味动画课 53%，课程体系 29%。',
    voices: [
      { sourceId: 'u4', text: '一个视频几分钟，不会太长，孩子看了还想继续看。' },
      { sourceId: 'u4', text: '他自己会学习洋葱学园里边的从小学物理，就是自己会翻，然后学的特别多。他还会往下串表，就会自己就会学。对，特别喜欢。' },
      { sourceId: 'u7', text: '孩子都是自己主动去看。' },
    ],
  },
  {
    id: 'c10',
    dimension: 'experience',
    title: '体验问题是难懂、读题、不同步',
    conclusion: '问题集中在小低孩子理解难、读题难、校内科学不同步。',
    data: '定量报告未给该点比例，不放造数。',
    voices: [
      { sourceId: 'u4', text: '就是他在视频里面介绍，很多时候有一些对孩子来讲，因为我们家小低阶段一些晦涩难懂的一些概念词，孩子还是不能很好的理解，如果说这个概念同步出来的话，再根据这个概念进行口语化，或者是孩子能接受的方式进行一些举例去介绍这个专业性的概念的话，孩子能理解更好一些。' },
      { sourceId: 'u4', text: '答题正确率高，但字不认识，如果读出来更好。' },
      { sourceId: 'u6', text: '我理解的是涵盖的知识点应该都有，只是不同步而已。结果我去找的话，一定是课内讲的是什么，我就按这个去找，划拉了一遍，发现没有，所以就也没有再看。' },
    ],
  },
  {
    id: 'c11',
    dimension: 'experience',
    title: '实验是重要补充',
    conclusion: '家长认为实验能帮助孩子理解和记忆，纯视频不够。',
    data: '定量报告未给实验需求比例，不放造数。',
    voices: [
      { sourceId: 'u5', text: '只看视频当时可能记得，后面可能忘掉；有实验会更清楚原理。' },
      { sourceId: 'u7', text: '能够动手做实验的话，锻炼孩子方面的能力也是很好的。' },
      { sourceId: 'u8', text: '学而思的实验可以自己动手做，但是洋葱学园的实验不能自己动手做。' },
    ],
  },
  {
    id: 'c12',
    dimension: 'barrier',
    title: '不适合打成纯兴趣启蒙',
    conclusion: '纯兴趣启蒙竞争多，洋葱需要讲出学科价值。',
    data: '定量报告未给该点比例，不放造数。',
    voices: [
      { sourceId: 'u1', text: '让他了解一下，就是有一些自然现象，他为什么他小孩不是有的时候可能会问吗？然后这一类的可能会有一些比较直观的，包括我给他弄那个NB实验室，他有一些现象会比较直观的能够表现出来，然后大概了解一下，就是不是说让他为了校内学习提前学什么的。' },
      { sourceId: 'u2', text: '科学这件事上，他更偏“学科启蒙”，不是纯兴趣。' },
      { sourceId: 'u3', text: '兴趣是起点，学科思维是最终目的。' },
    ],
  },
  {
    id: 'c13',
    dimension: 'barrier',
    title: '不适合直接打成小初衔接先修',
    conclusion: '如果直接讲提前学初中同步课，会和现有小初同步产品冲突。',
    data: '定量报告未给该点比例，不放造数。',
    voices: [
      { sourceId: 'u1', text: '低年级只需要学科启蒙，不需要提前学完初中内容。' },
      { sourceId: 'u3', text: '到初中正式学物理才能看出。' },
      { sourceId: 'u5', text: '现在接触应试的话，怕孩子排斥。', audioUrl: '/clips/interview5/0031-01.mp3' },
    ],
  },
  {
    id: 'c14',
    dimension: 'barrier',
    title: '校内科学同步是小众但强烈的需求',
    conclusion: '多数用户不是为了校内同步，但科学是主科的地区非常在意教材匹配。',
    data: '定性总结：6 位用户中 1 位是科学主课同步诉求。',
    voices: [
      { sourceId: 'u6', text: '郑州把科学课纳入了主科，期中期末都在考。到初中之后它就变成了物理化学生物，我不希望他只是去死记硬背。' },
      { sourceId: 'u6', text: '如果说是同步的话，我觉得会更好，就是使用率上会更高一些。如果说没那么同步的话，可能就是，想起来了去划了两下看一下，或者是哪个知识点真的不理解，去找一下。' },
      { sourceId: 'u6', text: '我理解的是涵盖的知识点应该都有，只是不同步而已。结果我去找的话，一定是课内讲的是什么，我就按这个去找，划拉了一遍，发现没有，所以就也没有再看。' },
    ],
  },
  {
    id: 'c15',
    dimension: 'barrier',
    title: '使用阻力包括时间不够和入口找不到',
    conclusion: '认可课程不等于能持续用，时间和入口都会影响使用。',
    data: '定量报告未给该点比例，不放造数。',
    voices: [
      { sourceId: 'u3', text: '到了三年级以上，学业比较重，你很难顾及全科的。如果我们三年级之后能把从小学物理坚持每天学已经很不错了，如果再开发地理生物有历史那些，时间没时间了，不是不想学。' },
      { sourceId: 'u4', text: '我不是觉得它不重要，是因为没有时间，这个时间不够。平时涉及肯定是洋葱这个从小学物理占的块，时间模块是最大的，NB 实验室还有洋葱的话，只能先选孩子选洋葱了，那 NB 我肯定就舍弃了，因为这时间的话不能投入在那上面。' },
      { sourceId: 'u6', text: '我理解的是涵盖的知识点应该都有，只是不同步而已。结果我去找的话，一定是课内讲的是什么，我就按这个去找，划拉了一遍，发现没有，所以就也没有再看。' },
    ],
  },
  {
    id: 'c16',
    dimension: 'brand',
    title: '跨品牌洞察：家长买的不是“有趣”，而是有用且可信',
    conclusion: '理科启蒙产品都在争夺兴趣入口，但真正影响购买的是未来学科价值、可信来源、权益透明和孩子持续主动使用。',
    data: '竞品分析：触达依赖直播/社群口碑；权益透明度影响购买信任；孩子主动参与是续费强信号。',
    voices: [
      { sourceId: 'u4', text: '展现的形式孩子喜欢，孩子喜欢第一要素。' },
      { sourceId: 'u1', text: '万物指南的话，是，也是从我们有个学习群，大概就是看了一下这个介绍觉得他这个团队还是比较靠谱的。' },
      { sourceId: 'u4', text: '洋葱学园的从小学物理，如果说我不是不管的话，他每天他都会刷。他好像特别喜欢看那实验男做实验。他当成趣味里边学知识了。' },
    ],
  },
  {
    id: 'c17',
    dimension: 'brand',
    title: '妙懂：AR 记忆点强，但容易停在“玩”，启蒙感弱',
    conclusion: '妙懂的强点是 AR、题库和直观展示；短板是讲法偏正式、偏应试，孩子可能只玩 AR，不深入看内容。',
    data: '竞品分析：AR 是强记忆点，但“只玩 AR、不看内容”和应试感知会抑制启蒙场景转化。',
    voices: [
      { sourceId: 'u5', text: '他的吸引那个点就是妙懂的AR东西，就是看着很更直观。然后还有就说里面有很多题库。' },
      { sourceId: 'u5', text: '买了以后他就只玩那个AR，里面的东西他也不太爱看。' },
      { sourceId: 'u5', text: '妙懂偏应试一点，它里面讲的东西不是那种小孩能接受那种，别人讲的时候那种语气，其他两个讲的时候都是小朋友讲那种，他不是，他是正儿八经的讲，很正式，孩子看着好像没有那么有感觉，就是让他学习了的那种感觉。' },
    ],
  },
  {
    id: 'c18',
    dimension: 'brand',
    title: '万物指南：专业和稀缺内容建立信任，但产出感弱',
    conclusion: '万物指南的优势是专业团队、化学内容稀缺、题库和长期可用；短板是更像内容库，家长仍需要看到孩子到底学会了什么。',
    data: '竞品分析：化学内容稀缺和权威内容建立信任，但学习产出难量化是续费阻力。',
    voices: [
      { sourceId: 'u1', text: '万物指南的话，是，也是从我们有个学习群，大概就是看了一下这个介绍觉得他这个团队还是比较靠谱的。' },
      { sourceId: 'u1', text: '就反正就是感觉可能专业性上各方面，他就觉得比妙懂要更专业一些。然后设计上还有包括他后边那些，他这个的话不是那种单纯的让你了解一下，他后面是跟着题的，他每个题都是相当于是那种题库，你大了以后，包括上初中了以后都还能用。就是这种，而且还是永久的嘛。' },
      { sourceId: 'u5', text: '我看见那个万物指南里面有化学，然后就买了那个。化学好像市面上好像只有它有。' },
    ],
  },
  {
    id: 'c19',
    dimension: 'brand',
    title: 'NB虚拟实验室：实验探索感强，但不替代系统学习',
    conclusion: 'NB 的优势是虚拟实验、安全、直观、可操作；短板是偏工具和实验模拟，缺少系统讲解，也无法替代真实实验和完整课程学习。',
    data: '竞品分析：虚拟实验探索感强、低价受认可，但实际使用率低，模拟与真实实验存在落差。',
    voices: [
      { sourceId: 'u1', text: 'NB实验室，它是一些实验性的东西。他没有那些具体的，他只是说是他里面都是一些实验，他没有，他除了实验之外的东西他是没有的。他是可以搭配着用的，我觉得。' },
      { sourceId: 'u4', text: '很多就危险性的实验的操作的话，肯定是在现实生活当中，有些家长就包括于我来讲，我也达不到那么的专业，但是在这个虚拟的环境下的话，可以放心让孩子去做，它不存在危险性，这是它的一大优点。' },
      { sourceId: 'u1', text: '后来又觉得他这种模拟实验其实跟你实际做实验的话，他是有差距的。他也不能完全的，他只是模拟那个动画场景。但是他不是，他跟你当时你做实验的那种真实的这种感受，他是还是有很大区别的。' },
    ],
  },
  {
    id: 'c20',
    dimension: 'next',
    title: '营销话术从“体系好”改为“孩子笑着学，悄悄领先”',
    conclusion: '先展示趣味动画和孩子投入，再补充体系化和长期价值。',
    data: '趣味动画课 53%，孩子喜欢 40%，课程体系 29%。',
    voices: [
      { sourceId: 'u4', text: '洋葱学园的从小学物理，如果说我不是不管的话，他每天他都会刷。他好像特别喜欢看那实验男做实验。他当成趣味里边学知识了。' },
      { sourceId: 'u7', text: '首先得孩子看得进去。' },
      { sourceId: 'u8', text: '从小学物理主要是录制课件，孩子听得也很有兴趣。' },
    ],
  },
  {
    id: 'c21',
    dimension: 'next',
    title: '渠道增长从内部转化走向公域破圈',
    conclusion: '继续用洋葱自有渠道，同时加强小红书、抖音、达人和口碑内容。',
    data: '定量报告建议社交媒体认知占比从 23% 提升到 40% 以上。',
    voices: [
      { sourceId: 'u1', text: '小红书上看到 NB 实验室。' },
      { sourceId: 'u2', text: '通过抖音直播间接触 NB 实验室。' },
      { sourceId: 'u6', text: '当时买洋葱学园的数学课的时候，推荐了这个物理课，我才买的。当时是郑州妈妈帮有一个线上的直播，当时主要请到了洋葱学园的老师，当时在卖数学课，科学课又间接推了一下，我就直接买了。' },
    ],
  },
  {
    id: 'c22',
    dimension: 'next',
    title: '产品矩阵优先地理和理科全家桶',
    conclusion: '地理需求最高，后续适合规划从小学理科全家桶。',
    data: '地理需求 69%；报告建议提到 74% 用户倾向全科套餐；不超过 400 元接受度 52.94%。',
    voices: [
      { sourceId: 'u3', text: '到了三年级以上，学业比较重，你很难顾及全科的。如果我们三年级之后能把从小学物理坚持每天学已经很不错了，如果再开发地理生物有历史那些，时间没时间了，不是不想学。' },
      { sourceId: 'u4', text: '听说过从小学系列，如果体验不错，可能酌情报。' },
      { sourceId: 'u6', text: '后续如果说我再需要的话，是不是还得分开再买生物和地理呀？正常的话它是四科一块，那如果我已经买了物理，后面再买是怎么样的形式？能不能补差价？' },
    ],
  },
  {
    id: 'c23',
    dimension: 'next',
    title: '产品侧补“启蒙成功验证”',
    conclusion: '让家长看到孩子能解释现象、说出原理、做对题、讲给家长听。',
    data: '定量报告未给该点比例，不放造数。',
    voices: [
      { sourceId: 'u1', text: '孩子能说出一些基本原理，有概念性认知即可。' },
      { sourceId: 'u7', text: '现实生活中见到以后能联想到，比如停车前倾知道是惯性。' },
      { sourceId: 'u8', text: '做题能做对，能讲给家长听，就是看懂了。' },
    ],
  },
];

function sourceOf(id: string): SourceInfo {
  return sources[id] ?? sources.u1;
}

function clipUrlsOf(voice: Voice) {
  return lookupClips(voice.text).map((clip) => clip.clipUrl);
}

function formatTime(value: number) {
  if (!Number.isFinite(value) || value <= 0) return '0:00';
  const minutes = Math.floor(value / 60);
  const seconds = Math.floor(value % 60)
    .toString()
    .padStart(2, '0');
  return `${minutes}:${seconds}`;
}

function AudioClipButton({ audioUrl, index, total }: { audioUrl: string; index: number; total: number }) {
  const [audio, setAudio] = React.useState<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = React.useState(false);
  const [duration, setDuration] = React.useState(0);
  const [currentTime, setCurrentTime] = React.useState(0);

  const isMp3 = audioUrl.endsWith('.mp3');
  if (!isMp3) {
    return (
      <a
        href={audioUrl}
        target="_blank"
        rel="noreferrer"
        className="inline-flex items-center gap-1 rounded-full border border-[#E95B35]/25 bg-[#FFF3EC] px-2 py-1 text-[11px] font-bold text-[#B94925] hover:bg-[#FFE8DB]"
      >
        <Mic2 size={12} />
        听录音
      </a>
    );
  }

  React.useEffect(() => {
    return () => {
      audio?.pause();
    };
  }, [audio]);

  const ensureAudio = () => {
    if (audio) return audio;
    const next = new Audio(audioUrl);
    next.onloadedmetadata = () => setDuration(next.duration || 0);
    next.ontimeupdate = () => setCurrentTime(next.currentTime || 0);
    next.onended = () => {
      setPlaying(false);
      setCurrentTime(next.duration || 0);
    };
    next.onpause = () => setPlaying(false);
    setAudio(next);
    return next;
  };

  const toggle = () => {
    const next = ensureAudio();
    if (playing) {
      next.pause();
      setPlaying(false);
    } else {
      if (next.ended || next.currentTime >= next.duration) next.currentTime = 0;
      void next.play().catch(() => setPlaying(false));
      setPlaying(true);
    }
  };

  const seek = (event: React.ChangeEvent<HTMLInputElement>) => {
    const next = ensureAudio();
    const time = Number(event.target.value);
    next.currentTime = time;
    setCurrentTime(time);
  };

  const clipLabel = total > 1 ? `原声切片 ${index + 1}/${total}` : '原声切片';

  return (
    <div className="flex w-full max-w-[340px] items-center gap-2 rounded-full border border-[#E95B35]/25 bg-[#FFF3EC] px-2 py-1.5 text-[#B94925]">
      <button
        type="button"
        onClick={toggle}
        className={cn(
          'inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-1 text-[11px] font-bold transition',
          playing ? 'bg-[#E95B35] text-white' : 'bg-white text-[#B94925] hover:bg-[#FFE8DB]',
        )}
        aria-label={playing ? `暂停${clipLabel}` : `播放${clipLabel}`}
      >
        {playing ? <Pause size={12} /> : <Play size={12} />}
        <span>{clipLabel}</span>
      </button>
      <input
        type="range"
        min={0}
        max={duration || 0}
        step={0.1}
        value={Math.min(currentTime, duration || currentTime)}
        onChange={seek}
        className="h-1 min-w-0 flex-1 accent-[#E95B35]"
        aria-label={`${clipLabel}进度`}
      />
      <span className="min-w-[58px] shrink-0 text-right text-[10px] font-bold tabular-nums text-[#9A5A42]">
        {formatTime(currentTime)} / {formatTime(duration)}
      </span>
    </div>
  );
}

function SourceFallbackLink({ voice, source }: { voice: Voice; source: SourceInfo }) {
  const url = voice.sourceUrl ?? source.recordingUrl ?? source.url;
  const label = source.recordingUrl ? '访谈录音' : '查看文字记录';

  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer"
      className="inline-flex items-center gap-1 rounded-full border border-[#DED6CC] bg-white px-2.5 py-1 text-[11px] font-bold text-[#5F5851] hover:border-[#E95B35]/40 hover:text-[#E95B35]"
    >
      {source.recordingUrl ? <Mic2 size={12} /> : <FileText size={12} />}
      {label}
      <ExternalLink size={11} />
    </a>
  );
}

function VoiceEvidence({ cardId, voice }: { cardId: string; voice: Voice }) {
  const source = sourceOf(voice.sourceId);
  const quote = voice.text;
  const clipUrls = clipUrlsOf(voice);

  return (
    <article key={`${cardId}-${voice.sourceId}-${quote}`} className="rounded-[8px] border border-[#E5DDD3] bg-white p-4">
      <div className="flex items-start gap-3">
        <Quote size={20} className="mt-1 shrink-0 text-[#E95B35]" />
        <p className="text-[15px] font-bold leading-8 text-[#302A25]">“{quote}”</p>
      </div>
      <div className="mt-4 rounded-md bg-[#F7F4EF] p-3">
        <p className="text-[13px] font-black text-[#292521]">{source.title}</p>
        <p className="mt-1 text-[12px] leading-5 text-[#746E67]">{source.meta}</p>
        <p className="mt-1 text-[12px] leading-5 text-[#9A938A]">材料：{source.materials}</p>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {clipUrls.length > 0 ? (
          clipUrls.map((audioUrl, index) => <AudioClipButton key={audioUrl} audioUrl={audioUrl} index={index} total={clipUrls.length} />)
        ) : (
          <SourceFallbackLink voice={voice} source={source} />
        )}
      </div>
    </article>
  );
}

function InsightCardView({ card, color }: { card: InsightCard; color: string }) {
  return (
    <article className="rounded-[8px] border border-[#E4DDD3] bg-[#FBFAF7] shadow-[0_1px_4px_rgba(55,44,34,.05)]">
      <div className="grid gap-0 lg:grid-cols-[0.86fr_1.45fr]">
        <div className="border-b border-[#E7DED3] p-5 lg:border-b-0 lg:border-r">
          <h3 className="text-[24px] font-black leading-tight text-[#292521]">{card.title}</h3>
          <p className="mt-4 text-[15px] font-black leading-7 text-[#403A34]">{card.conclusion}</p>
          {card.data && (
            <div className="mt-5 rounded-md border border-[#EEE5DC] bg-white px-4 py-3 text-[13px] font-bold leading-6 text-[#7A6255]">
              {card.data}
            </div>
          )}
        </div>
        <div className="space-y-3 p-5">
          <p className="text-[12px] font-black text-[#9A938B]">用户原声与来源</p>
          {card.voices.map((voice) => (
            <VoiceEvidence key={`${card.id}-${voice.sourceId}-${voice.text}`} cardId={card.id} voice={voice} />
          ))}
        </div>
      </div>
    </article>
  );
}

function SourcePanel() {
  return (
    <div className="rounded-[8px] border border-[#E6DDD3] bg-white p-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-[12px] font-black tracking-[0.14em] text-[#E95B35]">资料来源</p>
          <p className="mt-2 max-w-2xl text-[13px] leading-6 text-[#706960]">
            页面结论来自项目总结、定性洞察和定量报告；每条用户原声都落到“用户几访谈”，有切片的可在卡片内直接播放，没有切片的跳转到原始文字记录或录音。
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <a href={INTERVIEW_INDEX_URL} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 rounded-full border border-[#D8D0C6] px-3 py-1.5 text-[12px] font-bold text-[#5F5851] hover:text-[#E95B35]">
            <FileText size={13} />
            访谈目录
          </a>
          <a href={QUANT_SOURCE_URL} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 rounded-full border border-[#D8D0C6] px-3 py-1.5 text-[12px] font-bold text-[#5F5851] hover:text-[#E95B35]">
            <BarChart3 size={13} />
            定量报告
          </a>
        </div>
      </div>
    </div>
  );
}

export default function FromPrimaryMergedReport() {
  const [active, setActive] = React.useState<DimensionId>('core');
  const activeDim = dimensions.find((item) => item.id === active) ?? dimensions[0];
  const activeCards = cards.filter((card) => card.dimension === active);

  return (
    <main className="min-h-full bg-[#F6F3ED] text-[#292521]">
      <header className="border-b border-[#E2DAD0] bg-[#FBFAF7] px-5 py-8 md:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <p className="text-[12px] font-black tracking-[0.18em] text-[#E95B35]">从小学系列售卖策略调研</p>
              <h1 className="mt-3 text-[34px] font-black leading-tight tracking-[-0.03em] md:text-[48px]">
                小学物理项目结论
              </h1>
              <p className="mt-4 text-[15px] font-semibold leading-8 text-[#5F5851]">
                将项目总结、定性洞察和定量报告合并为一页，按六个业务维度展示结论、数据和用户原声。
              </p>
            </div>
            <div className="grid min-w-[190px] grid-cols-2 gap-2 rounded-[8px] border border-[#E5DDD3] bg-white p-3">
              {[
                ['81', '问卷样本'],
                ['8', '定性用户'],
              ].map(([value, label]) => (
                <div key={label} className="rounded-md bg-[#F8F4EE] px-3 py-3 text-center">
                  <div className="text-[22px] font-black text-[#E95B35]">{value}</div>
                  <div className="mt-1 text-[11px] font-bold text-[#8A8279]">{label}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-6">
            <SourcePanel />
          </div>
        </div>
      </header>

      <div className="sticky top-0 z-30 border-b border-[#DDD4C9] bg-[#FBFAF7]/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl gap-1 overflow-x-auto px-4 md:px-8">
          {dimensions.map(({ id, label, icon: Icon, color }) => {
            const current = active === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => setActive(id)}
                className={cn(
                  'flex h-12 shrink-0 items-center gap-2 border-b-2 px-3 text-[13px] font-black transition',
                  current ? 'border-current' : 'border-transparent text-[#736C65] hover:text-[#292521]',
                )}
                style={current ? { color } : undefined}
              >
                <Icon size={15} />
                {label}
              </button>
            );
          })}
        </div>
      </div>

      <section className="mx-auto max-w-7xl px-4 py-7 md:px-8">
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <p className="text-[12px] font-black tracking-[0.16em]" style={{ color: activeDim.color }}>
              {activeDim.label}
            </p>
            <h2 className="mt-1 text-[24px] font-black text-[#292521]">关键结论卡片</h2>
          </div>
        </div>
        <div className="space-y-4">
          {activeCards.map((card) => (
            <InsightCardView key={card.id} card={card} color={activeDim.color} />
          ))}
        </div>
      </section>

      <footer className="border-t border-[#E2DAD0] px-5 py-6 text-center text-[12px] font-semibold text-[#8A8279]">
        定量数据仅使用指定定量报告；用户原声来源限定为访谈目录中的用户1-用户8。
      </footer>
    </main>
  );
}
