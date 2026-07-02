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
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';

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
  { id: 'brand', label: '品牌认知', icon: Sparkles, color: '#6E4AA5' },
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
      { sourceId: 'u1', text: '低年级只需要“学科启蒙”，不需要提前学完初中内容。', audioUrl: '/clips/interview1/0007-01.mp3' },
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
      { sourceId: 'u3', text: '兴趣是起点，学科思维是最终目的。' },
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
      { sourceId: 'u5', text: '想看到孩子学了什么、学到什么、记住什么。' },
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
      { sourceId: 'u4', text: '毕竟升学需求、考试科目的选取，还是不想让他之后对理科失去兴趣。', audioUrl: '/clips/interview4/0044-01.mp3' },
      { sourceId: 'u6', text: '郑州把科学课纳入了主科，期中期末都在考。', audioUrl: '/clips/interview6/0094-01.mp3' },
    ],
  },
  {
    id: 'c05',
    dimension: 'purchase',
    title: '购买直接动因是有趣、孩子喜欢',
    conclusion: '孩子愿意看、主动看，是最直接的购买触发。',
    data: '趣味动画课 53%；孩子喜欢 40%。',
    voices: [
      { sourceId: 'u4', text: '如果不管的话，他每天都会刷从小学物理，特别喜欢看实验男做实验。', audioUrl: '/clips/interview4/0005-01.mp3' },
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
      { sourceId: 'u4', text: '从小学物理的知识好像更多、更系统。', audioUrl: '/clips/interview4/0019-01.mp3' },
      { sourceId: 'u4', text: '每个模块讲解的知识多，罗列的层次好，孩子能自主看。' },
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
      { sourceId: 'u3', text: '直播间说实验素材可以从生活中随时找到，可以提前物理启蒙。', audioUrl: '/clips/interview3/0008-01.mp3' },
      { sourceId: 'u6', text: '先看到公众号，内容契合当前需求，预约直播后买下来。', audioUrl: '/clips/interview6/0095-01.mp3' },
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
      { sourceId: 'u4', text: '孩子自己会翻，然后学得特别多，特别喜欢。', audioUrl: '/clips/interview4/0003-01.mp3' },
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
      { sourceId: 'u4', text: '有些晦涩难懂的词语小低孩子不能理解，如果口语化更好。' },
      { sourceId: 'u4', text: '答题正确率高，但字不认识，如果读出来更好。' },
      { sourceId: 'u6', text: '四年级上册内容找不到，对标校内知识点不够。', audioUrl: '/clips/interview6/0077-01.mp3' },
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
      { sourceId: 'u1', text: '看物理化学不是为了提前校内学习，是了解“为什么”的概念。', audioUrl: '/clips/interview1/0005-01.mp3' },
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
      { sourceId: 'u6', text: '郑州把科学课纳入了主科，期中期末都在考。', audioUrl: '/clips/interview6/0094-01.mp3' },
      { sourceId: 'u6', text: '如果同步的话，使用率上会更高一些。', audioUrl: '/clips/interview6/0102-01.mp3' },
      { sourceId: 'u6', text: '希望根据各地区课本引入知识点，一找就知道从哪里找。', audioUrl: '/clips/interview6/0086-01.mp3' },
    ],
  },
  {
    id: 'c15',
    dimension: 'barrier',
    title: '使用阻力包括时间不够和入口找不到',
    conclusion: '认可课程不等于能持续用，时间和入口都会影响使用。',
    data: '定量报告未给该点比例，不放造数。',
    voices: [
      { sourceId: 'u3', text: '不是不想学物理，而是没时间。' },
      { sourceId: 'u4', text: '不是觉得它不重要，是因为没有时间，只能先选孩子选洋葱。', audioUrl: '/clips/interview4/0053-01.mp3' },
      { sourceId: 'u6', text: '最近没有学，就是因为没找到位置。', audioUrl: '/clips/interview6/0082-01.mp3' },
    ],
  },
  {
    id: 'c16',
    dimension: 'brand',
    title: '洋葱品牌信任能迁移到物理',
    conclusion: '洋葱数学、品牌、直播间和创始人形象降低购买决策成本。',
    data: '品牌保证 31%。',
    voices: [
      { sourceId: 'u4', text: '对洋葱的信任、对品牌的信任。' },
      { sourceId: 'u4', text: '比较喜欢杨临风，他展现个人魅力还是挺好的，团队也信得过。', audioUrl: '/clips/interview4/0055-01.mp3' },
      { sourceId: 'u6', text: '买洋葱学园数学课的时候推荐了物理课，我才买的。', audioUrl: '/clips/interview6/0096-01.mp3' },
    ],
  },
  {
    id: 'c17',
    dimension: 'brand',
    title: '洋葱要占领“有趣但有用”的心智',
    conclusion: '先让孩子愿意看，再证明它和未来理科学习有关。',
    data: '趣味动画课 53%，孩子喜欢 40%，课程体系 29%。',
    voices: [
      { sourceId: 'u4', text: '展现的形式孩子喜欢，孩子喜欢第一要素。' },
      { sourceId: 'u7', text: '首先得是易懂，这么小的孩子如果听不懂，系统和专业也没啥用。' },
      { sourceId: 'u8', text: '实验类课程吸引孩子的点是好玩、孩子感兴趣、用孩子能听懂的语言描述。' },
    ],
  },
  {
    id: 'c18',
    dimension: 'brand',
    title: '竞品差异要讲清楚',
    conclusion: '万物指南、NB、妙懂、学而思各有优势，洋葱要明确自己的差异。',
    data: '定量报告未给竞品差异比例，不放造数。',
    voices: [
      { sourceId: 'u1', text: 'NB 更偏实验过程和现象模拟，不是系统讲知识。', audioUrl: '/clips/interview1/0057-01.mp3' },
      { sourceId: 'u5', text: '妙懂是很正式的，孩子看着感觉像学习。' },
      { sourceId: 'u8', text: '学而思是直播，洋葱是录播；学而思能动手，洋葱是纯教学。' },
    ],
  },
  {
    id: 'c19',
    dimension: 'next',
    title: '营销话术从“体系好”改为“孩子笑着学，悄悄领先”',
    conclusion: '先展示趣味动画和孩子投入，再补充体系化和长期价值。',
    data: '趣味动画课 53%，孩子喜欢 40%，课程体系 29%。',
    voices: [
      { sourceId: 'u4', text: '如果不管，孩子每天都会刷从小学物理。', audioUrl: '/clips/interview4/0005-01.mp3' },
      { sourceId: 'u7', text: '首先得孩子看得进去。' },
      { sourceId: 'u8', text: '从小学物理主要是录制课件，孩子听得也很有兴趣。' },
    ],
  },
  {
    id: 'c20',
    dimension: 'next',
    title: '渠道增长从内部转化走向公域破圈',
    conclusion: '继续用洋葱自有渠道，同时加强小红书、抖音、达人和口碑内容。',
    data: '定量报告建议社交媒体认知占比从 23% 提升到 40% 以上。',
    voices: [
      { sourceId: 'u1', text: '小红书上看到 NB 实验室。' },
      { sourceId: 'u2', text: '通过抖音直播间接触 NB 实验室。' },
      { sourceId: 'u6', text: '郑州妈妈帮公众号和微信直播促成下单。', audioUrl: '/clips/interview6/0095-01.mp3' },
    ],
  },
  {
    id: 'c21',
    dimension: 'next',
    title: '产品矩阵优先地理和理科全家桶',
    conclusion: '地理需求最高，后续适合规划从小学理科全家桶。',
    data: '地理需求 69%；报告建议提到 74% 用户倾向全科套餐；不超过 400 元接受度 52.94%。',
    voices: [
      { sourceId: 'u3', text: '一门物理都没时间看，四门课更容易劝退，可以包装成大而全的全科课包。' },
      { sourceId: 'u4', text: '听说过从小学系列，如果体验不错，可能酌情报。' },
      { sourceId: 'u6', text: '已经买了物理，后面再买生物和地理能不能补差价？', audioUrl: '/clips/interview6/0075-01.mp3' },
    ],
  },
  {
    id: 'c22',
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

function AudioOrSourceLink({ voice }: { voice: Voice }) {
  const [audio, setAudio] = React.useState<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = React.useState(false);
  const source = sourceOf(voice.sourceId);
  const audioUrl = voice.audioUrl ?? source.recordingUrl;
  if (!audioUrl) return null;

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

  const toggle = () => {
    let next = audio;
    if (!next) {
      next = new Audio(audioUrl);
      next.onended = () => setPlaying(false);
      next.onpause = () => setPlaying(false);
      setAudio(next);
    }
    if (playing) {
      next.pause();
      setPlaying(false);
    } else {
      next.currentTime = 0;
      void next.play().catch(() => setPlaying(false));
      setPlaying(true);
    }
  };

  return (
    <button
      type="button"
      onClick={toggle}
      className={cn(
        'inline-flex items-center gap-1 rounded-full border px-2 py-1 text-[11px] font-bold transition',
        playing
          ? 'border-[#E95B35] bg-[#E95B35] text-white'
          : 'border-[#E95B35]/25 bg-[#FFF3EC] text-[#B94925] hover:bg-[#FFE8DB]',
      )}
    >
      {playing ? <Pause size={12} /> : <Play size={12} />}
      原声切片
    </button>
  );
}

function SourceLinks({ source }: { source: SourceInfo }) {
  return (
    <div className="flex flex-wrap gap-2">
      <a
        href={source.url}
        target="_blank"
        rel="noreferrer"
        className="inline-flex items-center gap-1 rounded-full border border-[#DED6CC] bg-white px-2.5 py-1 text-[11px] font-bold text-[#5F5851] hover:border-[#E95B35]/40 hover:text-[#E95B35]"
      >
        <FileText size={12} />
        查看文字记录
      </a>
      {source.recordingUrl && (
        <a
          href={source.recordingUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1 rounded-full border border-[#DED6CC] bg-white px-2.5 py-1 text-[11px] font-bold text-[#5F5851] hover:border-[#E95B35]/40 hover:text-[#E95B35]"
        >
          <Mic2 size={12} />
          访谈录音
        </a>
      )}
    </div>
  );
}

function InsightCardView({ card, color, onOpen }: { card: InsightCard; color: string; onOpen: () => void }) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className="group flex min-h-[280px] flex-col rounded-[8px] border border-[#E4DDD3] bg-white p-5 text-left shadow-[0_1px_4px_rgba(55,44,34,.05)] transition hover:-translate-y-0.5 hover:border-[#E9B49F] hover:shadow-[0_16px_34px_rgba(66,48,34,.10)]"
    >
      <div className="mb-4 flex items-start justify-between gap-4">
        <span className="rounded-full px-2.5 py-1 text-[11px] font-black" style={{ color, background: `${color}14` }}>
          {card.id.replace('c', '').padStart(2, '0')}
        </span>
        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#958E86] group-hover:text-[#E95B35]">
          看详情
          <ExternalLink size={12} />
        </span>
      </div>
      <h3 className="text-[20px] font-black leading-tight text-[#292521]">{card.title}</h3>
      <p className="mt-3 text-[13px] font-semibold leading-6 text-[#5E5650]">{card.conclusion}</p>
      {card.data && (
        <div className="mt-4 rounded-md border border-[#EEE5DC] bg-[#FBF8F3] px-3 py-2 text-[12px] font-semibold leading-5 text-[#7A6255]">
          {card.data}
        </div>
      )}
      <div className="mt-4 space-y-2">
        {card.voices.slice(0, 2).map((voice) => {
          const source = sourceOf(voice.sourceId);
          return (
            <div key={`${card.id}-${voice.sourceId}-${voice.text}`} className="rounded-md bg-[#F7F4EF] p-3">
              <p className="line-clamp-2 text-[12.5px] leading-6 text-[#403A34]">“{voice.text}”</p>
              <p className="mt-1 text-[11px] font-bold text-[#9A938A]">{source.title}</p>
            </div>
          );
        })}
      </div>
    </button>
  );
}

function CardDetailModal({ card, onClose }: { card: InsightCard; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-6" onClick={onClose}>
      <div
        className="max-h-[88vh] w-full max-w-3xl overflow-y-auto rounded-[8px] bg-[#FBFAF7] shadow-[0_28px_80px_rgba(0,0,0,.24)]"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-[#E7DED3] bg-[#FBFAF7]/95 px-6 py-5 backdrop-blur">
          <div>
            <p className="text-[11px] font-black tracking-[0.16em] text-[#E95B35]">CARD {card.id.replace('c', '').padStart(2, '0')}</p>
            <h2 className="mt-2 text-[26px] font-black leading-tight text-[#292521]">{card.title}</h2>
          </div>
          <button type="button" onClick={onClose} className="rounded-full border border-[#DDD4CA] p-2 text-[#7A746D] hover:bg-white hover:text-[#E95B35]">
            <X size={18} />
          </button>
        </div>
        <div className="space-y-5 px-6 py-6">
          <section className="rounded-[8px] border border-[#E8DED3] bg-white p-5">
            <p className="text-[12px] font-black text-[#9A938B]">核心结论</p>
            <p className="mt-2 text-[17px] font-black leading-8 text-[#292521]">{card.conclusion}</p>
            {card.data && <p className="mt-3 text-[13px] font-semibold leading-6 text-[#7A6255]">{card.data}</p>}
          </section>

          <section className="space-y-3">
            <p className="text-[12px] font-black text-[#9A938B]">用户原声与来源</p>
            {card.voices.map((voice) => {
              const source = sourceOf(voice.sourceId);
              return (
                <article key={`${card.id}-${voice.sourceId}-${voice.text}`} className="rounded-[8px] border border-[#E5DDD3] bg-white p-5">
                  <div className="flex items-start gap-3">
                    <Quote size={20} className="mt-1 shrink-0 text-[#E95B35]" />
                    <p className="text-[15px] font-bold leading-8 text-[#302A25]">“{voice.text}”</p>
                  </div>
                  <div className="mt-4 rounded-md bg-[#F7F4EF] p-3">
                    <p className="text-[13px] font-black text-[#292521]">{source.title}</p>
                    <p className="mt-1 text-[12px] leading-5 text-[#746E67]">{source.meta}</p>
                    <p className="mt-1 text-[12px] leading-5 text-[#9A938A]">材料：{source.materials}</p>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <AudioOrSourceLink voice={voice} />
                    <SourceLinks source={source} />
                  </div>
                </article>
              );
            })}
          </section>
        </div>
      </div>
    </div>
  );
}

function SourcePanel() {
  return (
    <div className="rounded-[8px] border border-[#E6DDD3] bg-white p-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-[12px] font-black tracking-[0.14em] text-[#E95B35]">资料来源</p>
          <p className="mt-2 max-w-2xl text-[13px] leading-6 text-[#706960]">
            页面结论来自项目总结、定性洞察和定量报告；每条用户原声都落到“用户几访谈”，详情弹窗里可打开文字记录和录音。
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
  const [selected, setSelected] = React.useState<InsightCard | null>(null);
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
            <div className="grid min-w-[280px] grid-cols-3 gap-2 rounded-[8px] border border-[#E5DDD3] bg-white p-3">
              {[
                ['81', '问卷样本'],
                ['8', '定性用户'],
                ['22', '结论卡片'],
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
          <p className="text-[12px] font-bold text-[#8A8279]">{activeCards.length} 张卡片</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {activeCards.map((card) => (
            <InsightCardView key={card.id} card={card} color={activeDim.color} onOpen={() => setSelected(card)} />
          ))}
        </div>
      </section>

      {selected && <CardDetailModal card={selected} onClose={() => setSelected(null)} />}

      <footer className="border-t border-[#E2DAD0] px-5 py-6 text-center text-[12px] font-semibold text-[#8A8279]">
        定量数据仅使用指定定量报告；用户原声来源限定为访谈目录中的用户1-用户8。
      </footer>
    </main>
  );
}
