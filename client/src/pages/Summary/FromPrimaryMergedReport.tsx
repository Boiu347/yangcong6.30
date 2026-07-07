import React from 'react';
import {
  BarChart3,
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
import EvidenceAudioClips from '@/components/EvidenceAudioClips';
import type { EvidenceClip } from '@/utils/evidenceClipLookup';
import { clipMetaByUrl, conclusionClipsByCardId, conclusionDetailsByCardId } from './conclusionMaps';

const ORANGE = '#E95B35';
const INK = '#292521';
const MUTED = '#746E67';
const INTERVIEW_INDEX_URL = 'https://guanghe.feishu.cn/wiki/STo3wNQSui7aohkP4oacAXVVnKf';
const QUANT_SOURCE_URL = 'https://guanghe.feishu.cn/wiki/XvjcwdzsZiEiJ1kF9UOcburXnig';
const STRATEGY_SOURCE_URL = 'https://guanghe.feishu.cn/wiki/BRBywMno4iK5QakFbmqcwJxen4b?from=from_copylink';
const RESEARCH_SOURCE_URL = 'https://guanghe.feishu.cn/wiki/S7NrwiHD8iQhkFkzR50cs54bnMf?from=from_copylink';

type DimensionId = 'core' | 'purchase' | 'experience' | 'barrier' | 'brand' | 'next';

interface Takeaway {
  label: '判断' | '依据' | '动作';
  text: string;
}

interface InsightCard {
  id: string;
  dimension: DimensionId;
  title: string;
  conclusion: string;
  data?: string;
  takeaways?: Takeaway[];
}

const dimensions: Array<{ id: DimensionId; label: string; icon: typeof Lightbulb; color: string }> = [
  { id: 'core', label: '核心洞察', icon: Lightbulb, color: '#E95B35' },
  { id: 'purchase', label: '购买决策', icon: Target, color: '#C58A3D' },
  { id: 'experience', label: '买后体验', icon: BookOpenCheck, color: '#2F9F8F' },
  { id: 'barrier', label: '购买卡点', icon: SearchCheck, color: '#D96D62' },
  { id: 'brand', label: '品牌差异', icon: Sparkles, color: '#5D78BD' },
  { id: 'next', label: '下一步建议', icon: BarChart3, color: '#B35A3F' },
];


const cardTakeaways: Record<string, Takeaway[]> = {
  c01: [
    { label: '判断', text: '低年级用户不是要提前学完整物理，而是要让孩子先有概念、能解释自然现象。' },
    { label: '依据', text: '定量显示核心客群集中在 1-5 年级；访谈反复出现“有个概念”“初高中更轻松”的预期。' },
    { label: '动作', text: '定位话术避开“先修”，突出“低龄理科启蒙、未来学科不陌生”。' },
  ],
  c02: [
    { label: '判断', text: '兴趣负责打开第一步，长期有用负责最终成交。' },
    { label: '依据', text: '趣味动画课 53%、孩子喜欢 40%、课程体系 29%，说明“好玩+有体系”才成立。' },
    { label: '动作', text: '营销先展示孩子爱看，再补充“理科学科思维/初中不吃力”的价值闭环。' },
  ],
  c03: [
    { label: '判断', text: '只证明孩子爱看不够，家长还需要看到孩子到底学到了什么。' },
    { label: '依据', text: '访谈里有孩子会转述、家长想看掌握程度的诉求。' },
    { label: '动作', text: '补学习报告、讲给家长听、知识点掌握和生活迁移任务，把启蒙效果外显。' },
  ],
  c04: [
    { label: '判断', text: '主力用户是有教育投入、关注长期理科能力的中高线家长。' },
    { label: '依据', text: '定量画像集中在 36-44 岁、企业/事业单位、1-5 年级、年教育支出 5000+ 的家庭。' },
    { label: '动作', text: '投放和话术优先面向“愿意为未来学科优势付费”的家庭。' },
  ],
  c05: [
    { label: '判断', text: '孩子是否愿意主动看，是购买决策里最直接的触发器。' },
    { label: '依据', text: '趣味动画课 53%、孩子喜欢 40%；访谈中多次出现“每天刷”“看得进去”。' },
    { label: '动作', text: '首屏素材多放孩子投入观看、实验男、短视频节奏，不要先讲完整体系。' },
  ],
  c06: [
    { label: '判断', text: '家长最终买的是“有趣但不零散”的体系化课程。' },
    { label: '依据', text: '课程体系占 29%；访谈对比 NB 时认为洋葱更系统、更适合静下来看概念。' },
    { label: '动作', text: '对外表达“从兴趣到知识结构”，把目录层级和知识地图可视化。' },
  ],
  c07: [
    { label: '判断', text: '当前转化依赖存量触达，公众号、视频号、直播间承担临门一脚。' },
    { label: '依据', text: '访谈出现郑州妈妈帮、视频号、顺着洋葱推荐购买；定量报告总结为认知到决策路径。' },
    { label: '动作', text: '保留自有渠道转化，同时把直播答疑沉淀成可复用的购买 FAQ。' },
  ],
  c08: [
    { label: '判断', text: '从小学物理不是大块上课场景，更像碎片时间的轻学习。' },
    { label: '依据', text: '用户集中描述吃饭、休息、周末、主科学累了看，属于访谈中的稳定共性。' },
    { label: '动作', text: '产品入口和提醒适配“5 分钟看一节”，减少打开和续看的成本。' },
  ],
  c09: [
    { label: '判断', text: '体验优势是比科普更系统、比正式课更轻。' },
    { label: '依据', text: '趣味动画课 53%、课程体系 29%；访谈提到短、可自己翻、愿意持续看。' },
    { label: '动作', text: '课程包装强调“短视频式学习节奏 + 完整知识链”。' },
  ],
  c10: [
    { label: '判断', text: '低龄理解门槛和校内不同步，会让好内容无法持续使用。' },
    { label: '依据', text: '访谈问题集中在概念晦涩、读题困难、四年级科学找不到同步内容。' },
    { label: '动作', text: '补口语化解释、读题/朗读、按教材或地区知识点查找。' },
  ],
  c11: [
    { label: '判断', text: '实验不是主卖点，但能补强理解、记忆和“真的学会了”的感受。' },
    { label: '依据', text: '家长认为纯视频容易忘，有动手实验能理解原理；也会拿学而思实验做对比。' },
    { label: '动作', text: '先做低门槛家庭实验清单和安全提示，不必一开始重做完整实验课。' },
  ],
  c12: [
    { label: '判断', text: '只说兴趣会陷入科普/短视频竞争，无法解释为什么要付费。' },
    { label: '依据', text: '访谈明确不是单纯提前学，而是专业解释自然现象、建立学科概念。' },
    { label: '动作', text: '话术从“好玩”升级到“好玩地学会物理概念”。' },
  ],
  c13: [
    { label: '判断', text: '直接卖“提前学初中物理”会吓退低龄家长，也容易和同步课冲突。' },
    { label: '依据', text: '用户担心应试排斥，认为低年级只要启蒙；正式物理价值到初中才更明显。' },
    { label: '动作', text: '用“小初衔接前的学科兴趣和概念预热”，不要承诺完整先修。' },
  ],
  c14: [
    { label: '判断', text: '科学主科化地区是小众但高强度需求，不适合忽略。' },
    { label: '依据', text: '6 位定性用户中 1 位强同步诉求；郑州用户明确提到期中期末在考。' },
    { label: '动作', text: '不把同步做成全国主定位，但提供地区/教材索引满足高需求用户。' },
  ],
  c15: [
    { label: '判断', text: '认可课程不等于会持续用，入口和时间会直接影响留存。' },
    { label: '依据', text: '访谈出现没时间、找不到入口、只能先选洋葱物理而舍弃 NB。' },
    { label: '动作', text: '首页入口、学习提醒、最近学到哪里，要比新增内容更优先。' },
  ],
  c16: [
    { label: '判断', text: '跨品牌竞争的核心不是“谁更好玩”，而是谁更可信、更有长期价值。' },
    { label: '依据', text: '竞品分析显示直播/社群口碑是触达关键，权益透明和孩子主动参与影响信任与续费。' },
    { label: '动作', text: '洋葱要把“孩子爱看”和“家长看得见效果”同时做成证据链。' },
  ],
  c17: [
    { label: '判断', text: '妙懂强在 AR 记忆点，但启蒙转化容易卡在“玩具感/应试感”。' },
    { label: '依据', text: '用户认可 AR 直观和题库，但反馈只玩 AR、不爱看内容、讲法正式偏应试。' },
    { label: '动作', text: '对比妙懂时突出“动画讲懂 + 系统概念”，避免只拼互动形式。' },
  ],
  c18: [
    { label: '判断', text: '万物指南靠专业团队和稀缺内容建立信任，弱点是学习产出不够外显。' },
    { label: '依据', text: '用户提到团队靠谱、比妙懂专业、题库长期可用、化学内容稀缺。' },
    { label: '动作', text: '学习“专业可信”的背书，同时补上学习成果可视化。' },
  ],
  c19: [
    { label: '判断', text: 'NB 虚拟实验室更像实验工具，不是完整课程替代。' },
    { label: '依据', text: '用户认可安全、直观、可操作，也指出只有实验、缺系统讲解、模拟与真实有落差。' },
    { label: '动作', text: '把 NB 定位为补充竞品，强调洋葱“实验兴趣 + 系统讲解”的完整性。' },
  ],
  c20: [
    { label: '判断', text: '营销要先让家长看到孩子笑着学，再说明悄悄建立理科优势。' },
    { label: '依据', text: '趣味动画课 53%、孩子喜欢 40%、课程体系 29%，说明兴趣和体系都不能缺。' },
    { label: '动作', text: '素材顺序改为孩子投入观看、学会概念、未来学科更轻松。' },
  ],
  c21: [
    { label: '判断', text: '仅靠自有渠道会限制新增，需要公域种草补足认知。' },
    { label: '依据', text: '定量建议社交媒体认知占比从 23% 提升到 40% 以上；访谈有小红书/抖音/公众号路径。' },
    { label: '动作', text: '做小红书/抖音达人内容和家长口碑案例，再承接到直播/私域转化。' },
  ],
  c22: [
    { label: '判断', text: '地理和理科全家桶是更自然的后续扩展方向。' },
    { label: '依据', text: '地理需求 69%；报告提到 74% 用户倾向全科套餐，不超过 400 元接受度 52.94%。' },
    { label: '动作', text: '先验证地理，再用补差价/组合包降低已购物理用户升级门槛。' },
  ],
  c23: [
    { label: '判断', text: '产品需要定义“启蒙成功”，否则家长难判断值不值。' },
    { label: '依据', text: '访谈中家长期待孩子能解释现象、讲给家长听、做对题。' },
    { label: '动作', text: '用学习报告、讲解任务、生活现象迁移题来证明启蒙效果。' },
  ],
};

const redesignedCards: InsightCard[] = [
  {
    id: 'r01',
    dimension: 'core',
    title: '访谈用户分类与目标人群',
    conclusion: '从小学物理要占领的不是纯兴趣启蒙，也不是小初衔接先修，而是“兴趣启蒙”和“衔接先修”之间的学科启蒙。',
    data: '来源说明：访谈纪要/文字记录，涉及用户1、用户2、用户3、用户6、用户8；定量报告显示核心客群孩子集中在 1-5 年级。',
    takeaways: [
      { label: '判断', text: '核心目标用户不是所有启蒙家庭，而是小学1-4年级里已经开始考虑未来理科学习、但又不想过早应试的家庭；另有科学主科化地区的同步型强需求。' },
      { label: '依据', text: '从一手访谈看，低年级家长普遍不是在追求提前学完整体系，而是在寻找“先建立概念、降低后续学习门槛”的启蒙内容。部分家长明确提到低年级阶段只需要“有个概念”，也有家长把小学物理视为后续初高中理科学习的铺垫；在科学课主科化地区，家长还会把它和校内科学理解、避免死记硬背联系起来。定量报告补充显示，核心客群孩子集中在 1-5 年级。' },
      { label: '动作', text: '页面应按真实用户诉求拆成概念启蒙型、长期铺垫型、轻度兴趣型、校内同步型，而不是只用二手总结里的“中间地带”作为依据。' },
    ],
  },
  {
    id: 'r02',
    dimension: 'core',
    title: '关键卖点解析：学科启蒙是真实需求',
    conclusion: '家长嘴上说“兴趣”“启蒙”，继续追问后，真实需求是正式学理科别排斥、别畏难、培养理科思维。',
    data: '来源：课程售卖情况｜需求端；定量报告：趣味动画课 53%，孩子喜欢 40%，课程体系 29%。竞品（妙懂/十分通/NB）都在卖「学科」焦虑，洋葱应占「学科启蒙」蓝海。',
    takeaways: [
      { label: '判断', text: '兴趣更像入口，未来的学科价值才是最终合理化购买的理由。' },
      { label: '依据', text: '文档原文：从功利角度，正式学理科别排斥、别畏难，培养理科思维，对未来升学、选科有帮助。定量报告里“趣味动画课”占 53%、“孩子喜欢”占 40%、“课程体系”占 29%，说明兴趣入口和体系价值需要同时被讲清。' },
      { label: '动作', text: '卖点不能只停留在“孩子爱看”，要把“未来有用”讲成可理解的学科启蒙价值。' },
    ],
  },
  {
    id: 'r03',
    dimension: 'core',
    title: '学科启蒙的短期需求和长期需求',
    conclusion: '短期看孩子爱看、会问为什么、能说出原理；长期看正式学理科时不陌生、不排斥、吸收更快。',
    data: '来源：课程售卖情况｜需求端；定量报告：孩子喜欢 40%，课程体系 29%。',
    takeaways: [
      { label: '判断', text: '家长对启蒙有效的终极判断是“未来有用”，但短期仍以孩子爱看作为主要依据。' },
      { label: '依据', text: '文档原文：孩子喜欢看，不用父母催会主动学；看到生活现象，能知道/想到问“为什么”。定量报告中“孩子喜欢”占 40%、“课程体系”占 29%，对应短期兴趣反馈和长期体系收益两类需求。' },
      { label: '动作', text: '卡片内容需要同时呈现短期可见反馈和长期学科价值，避免只讲长期愿景。' },
    ],
  },
  {
    id: 'r04',
    dimension: 'core',
    title: '启蒙效果：关键变量解析',
    conclusion: '启蒙效果不能只停留在“爱看”，需要阶段性外化为家长看得见、听得见的结果。',
    data: '来源：课程售卖情况｜需求端。「未来有用」是最终结果，但达成路径缺失，家长会因「不确定性」而打消下单。',
    takeaways: [
      { label: '判断', text: '市场普遍没有把“启蒙到位”讲清楚，这正是洋葱可做差异化的机会。' },
      { label: '依据', text: '文档原文：很多家长想知道孩子学到了什么、记住了什么、能不能讲出来、哪些概念已经掌握。' },
      { label: '动作', text: '把“孩子讲给家长听”、学习报告、概念掌握、生活迁移做成产品和营销证据。' },
    ],
  },
  {
    id: 'r05',
    dimension: 'purchase',
    title: '触达渠道',
    conclusion: '渠道不是平均用力，新媒体负责拉新促转化，APP负责信息深化，电销负责高客单补刀。',
    data: '来源：研究拆解和假设｜有路；定量报告建议社交媒体认知占比从 23% 提升到 40% 以上。',
    takeaways: [
      { label: '判断', text: '购买链路需要“新媒体筛人 → APP 深化 → 电销补刀”，不能只设计立即下单路径。' },
      { label: '依据', text: '文档原文：新媒体是拉新主力，APP 是信息池+决策推动器，电销是高客单补刀。定量报告建议社交媒体认知占比从 23% 提升到 40% 以上，说明新媒体不能只做下单口，也要承担认知扩散。' },
      { label: '动作', text: '每个渠道保留统一定位，但分别设计新媒体钩子、APP 信息密度、电销权益话术。' },
    ],
  },
  {
    id: 'r06',
    dimension: 'purchase',
    title: '吸引卖点：学科启蒙的诉求标准',
    conclusion: '理想的学科启蒙课程要同时具备系统性、专业性、丰富性、关联性和易懂性。',
    data: '来源：课程售卖情况｜单个用户归纳分析；定量报告：趣味动画课 53%，课程体系 29%。',
    takeaways: [
      { label: '判断', text: '家长不是只要“好玩”，而是希望孩子爱看之外还能建立理科框架。' },
      { label: '依据', text: '文档原文：目录框架做的系统；讲解全面、老师专业；丰富的理科实验；内容和初高中学科挂钩；易懂性。定量报告里“趣味动画课”占 53%、“课程体系”占 29%，说明理想课程不能只好玩，也要让家长看到体系。' },
      { label: '动作', text: '课程详情页把五个诉求标准显性化，避免只用动画趣味承载全部卖点。' },
    ],
  },
  {
    id: 'r07',
    dimension: 'purchase',
    title: '购前预期',
    conclusion: '家长期待课程不抢跑、不刷题，但学完能解释现象、说出原理、会做实验，未来学理科不陌生。',
    data: '来源：课程售卖情况｜用户2启发；定量报告：课程体系 29%，单选最重要因素约 16%。',
    takeaways: [
      { label: '判断', text: '购前预期既排斥过早应试，又希望课程有真实学科收益。' },
      { label: '依据', text: '文档原文：学的东西未来要有用，要和未来中高考、初高中理科学科挂钩，不能只是玩一玩。定量报告中“课程体系”占 29%，单选最重要因素约 16%，说明购前预期里已经有明确体系判断。' },
      { label: '动作', text: '售卖表达用“轻松启蒙 + 可验证学到”承接，而不是单纯强调提前学。' },
    ],
  },
  {
    id: 'r08',
    dimension: 'purchase',
    title: '购买原因',
    conclusion: '当前购买原因更多来自洋葱品牌信任、顺手加购、终身制/永久有效，以及生活化实验素材。',
    data: '来源：购买原因&体验横向汇总。从小学物理购前吸引卖点：洋葱品牌信任/老板学霸光环；买小学/全科课包时顺手加购；实验操作素材在生活中好找。',
    takeaways: [
      { label: '判断', text: '现有成交更多是品牌和权益带动，课程卖点自身还需要讲得更强。' },
      { label: '依据', text: '文档原文：洋葱购买原因偏向【洋葱品牌导向】，而非从小学物理的「课程卖点」击中。定量报告里“趣味动画课”占 53%、“孩子喜欢”占 40%、“课程体系”占 29%，这些本应成为课程卖点自身的购买理由。' },
      { label: '动作', text: '后续商详页和直播间要把“学科启蒙为什么值得买”放到品牌信任之后承接。' },
    ],
  },
  {
    id: 'r09',
    dimension: 'experience',
    title: '感觉好的点',
    conclusion: '买后体验亮点集中在知识多、更系统、孩子感兴趣、时长短无压力。',
    data: '来源：购买原因&体验横向汇总。从小学物理体验亮点：每个模块讲解的知识多；内容更系统；孩子能自主看实验男做实验；一个视频几分钟，不会太长。',
    takeaways: [
      { label: '判断', text: '洋葱的正向体验不是单点好玩，而是“短、系统、孩子愿意自己看”共同成立。' },
      { label: '依据', text: '文档原文：知识多、更系统、孩子感兴趣、时长短无压力。' },
      { label: '动作', text: '卡片里优先保留这些明确好评，作为学科启蒙卖点的体验证明。' },
    ],
  },
  {
    id: 'r10',
    dimension: 'experience',
    title: '感觉不好的点',
    conclusion: '买后折损点集中在概念晦涩、不够口语化、读题困难、孩子兴趣没有培养起来、不同步。',
    data: '来源：购买原因&体验横向汇总。体验折损点：晦涩难懂词语孩子不能理解；答题中有些字不认识；孩子不会主动看；课程内容与校内科学课不同步。',
    takeaways: [
      { label: '判断', text: '产品短板不是内容有没有，而是低龄孩子能不能听懂、找得到、持续用。' },
      { label: '依据', text: '文档原文：晦涩难懂词语孩子不能理解，不够口语化；答题中有些字不认识，读出来会更好。' },
      { label: '动作', text: '优先补“儿童化讲解、读题辅助、同步索引、持续学习机制”。' },
    ],
  },
  {
    id: 'r11',
    dimension: 'barrier',
    title: '用户侧卡点',
    conclusion: '用户侧卡点包括需求没有被明确定义、时间被主科和兴趣班挤压、以及更倾向其他方案。',
    data: '来源：调研结论同步。用户3代表“冲动消费的囤课型家长”，课外兴趣班和主课时间严重挤压理科启蒙/素拓时间。',
    takeaways: [
      { label: '判断', text: '认可课程不等于会用，时间和孩子主动性是用户侧最大的落差。' },
      { label: '依据', text: '文档原文：孩子学的东西太多没有坚持下去；理科启蒙/素拓基本没时间/只会挤出很少零碎时间看。' },
      { label: '动作', text: '把学习节奏设计成轻量任务，并在营销里降低家长对“又多一门课”的压力。' },
    ],
  },
  {
    id: 'r12',
    dimension: 'barrier',
    title: '产品侧卡点',
    conclusion: '产品侧卡点集中在定位不够突出、孩子视角不足、持续学习机制弱、实验感不足和不同步。',
    data: '来源：课程售卖情况｜供给端。短板集中在：不够“孩子视角”、缺少持续学习机制、实验感不足、不够同步。',
    takeaways: [
      { label: '判断', text: '要卖学科启蒙，最需要补的是专业概念儿童化和启蒙效果外化。' },
      { label: '依据', text: '文档原文：“概念理解”是竞品的共同痛点；针对启蒙小低，最需要打磨的是【专业概念儿童化】。' },
      { label: '动作', text: '把孩子能懂的例子、口语化讲解、答题朗读、学习反馈作为产品优先级。' },
    ],
  },
  {
    id: 'r13',
    dimension: 'barrier',
    title: '商业化卡点',
    conclusion: '商业化卡点是渠道承接和下单链路不完整，未转化用户容易漏掉。',
    data: '来源：研究拆解和假设｜有路。“未转化用户的承接当前几乎是漏的，大部分新媒体内容只设计【立即下单】路径。”',
    takeaways: [
      { label: '判断', text: '从小学系列不能只靠单个直播间成交，需要设计从种草到了解再到补刀的完整漏斗。' },
      { label: '依据', text: '文档原文：任何渠道单独打都打不爆，必须多渠道联动。' },
      { label: '动作', text: '落地页设置立即购买和下载 APP 了解双路径，APP 承接试听/大纲/FAQ，电销做权益补刀。' },
    ],
  },
  {
    id: 'r14',
    dimension: 'brand',
    title: '洋葱自身优势劣势',
    conclusion: '洋葱优势是动画孩子爱看、品牌信任、知识多、更系统、时长短；劣势是孩子视角、实验感、学习机制和同步体验还不够。',
    data: '来源：课程售卖情况｜供给端。洋葱被认可的优势：动画孩子爱看、品牌信任、买大会员顺手带一件、校内同步；短板集中在孩子视角、持续学习机制、实验感、同步。',
    takeaways: [
      { label: '判断', text: '洋葱有“孩子愿意看”和“体系化”的底子，但还没把课程卖点打成强心智。' },
      { label: '依据', text: '文档原文：洋葱购买原因偏向品牌导向，而非从小学物理课程卖点击中。' },
      { label: '动作', text: '品牌信任负责降低决策成本，课程卖点负责解释为什么这个品类值得买。' },
    ],
  },
  {
    id: 'r15',
    dimension: 'brand',
    title: '竞品购买的主要原因',
    conclusion: '竞品各自有清晰购买理由：NB 强在虚拟实验，妙懂强在 AR 和题库，万物指南强在专业背书，学而思/赛先生强在真人实验课。',
    data: '来源：购买原因&体验横向汇总。NB：触屏形式方便、安全、覆盖教材；妙懂：AR 好玩、有题库；万物指南：吴姥姥靠谱权威；直播课：真人老师和动手实验。',
    takeaways: [
      { label: '判断', text: '竞品容易被记住，是因为它们的购买理由更单点清晰。' },
      { label: '依据', text: '文档原文：家长能非常清晰地说出竞品购买原因，且吸引点结果趋同。' },
      { label: '动作', text: '洋葱需要把“学科启蒙”也压缩成能被复述的一句话和三条证据。' },
    ],
  },
  {
    id: 'r16',
    dimension: 'brand',
    title: '对比之下的优势劣势',
    conclusion: '洋葱最适合站在“启蒙性 + 体系性兼得”的位置：比纯启蒙更系统，比补课更轻松。',
    data: '来源：研究拆解和假设｜有差。核心圈是中段衔接型，差异化优势是“启蒙性 + 体系性兼得”。',
    takeaways: [
      { label: '判断', text: '洋葱没有通吃所有人的差异化点，最强位置在中段衔接型人群。' },
      { label: '依据', text: '文档原文：中年级家长不想孩子太早功利化，但又怕纯科普看完啥也没学到；洋葱恰好夹在中间。' },
      { label: '动作', text: '品牌差异页只保留关键竞品和关键对比，不做大而全竞品列表。' },
    ],
  },
  {
    id: 'r17',
    dimension: 'next',
    title: '三大价值主张',
    conclusion: '下一步建议直接围绕三大价值主张组织：爱学、听懂、有用。',
    data: '来源：课程定位和卖点；定量报告：趣味动画课 53%，孩子喜欢 40%，课程体系 29%。',
    takeaways: [
      { label: '判断', text: '三大价值主张可以作为页面、直播间和商详页的统一 Message House。' },
      { label: '依据', text: '文档原文：趣味、听得懂是 RTB，学得会、初中不陌生是利益点。定量报告中“趣味动画课”占 53%、“孩子喜欢”占 40%、“课程体系”占 29%，正好对应“爱学、听懂、有用”三层价值主张。' },
      { label: '动作', text: '每条价值主张都绑定 RTB：观看数据/动画课/真动手实验，生活化讲解/思维模型，学习报告/学做练闭环。' },
    ],
  },
  {
    id: 'r18',
    dimension: 'next',
    title: '营销落地页参考',
    conclusion: '营销落地要做到一个核心定位、三套场景表达：新媒体打启蒙和信任，APP打信息密度，电销打权益升级感。',
    data: '来源：研究拆解和假设｜有路；定量报告：社交媒体认知 23%→40%+，地理需求 69%，全科套餐倾向 74%，400 元以内接受度 52.94%。',
    takeaways: [
      { label: '判断', text: '新媒体、APP、电销不是互相替代，而是一个漏斗里的不同节点。' },
      { label: '依据', text: '文档原文：新媒体话术不能用“提前学/小初衔接”作为大词主打；APP 相对新媒体的结构性优势是信息密度高；电销核心不是卖一个新产品而是通知一个权益。定量报告建议社交媒体认知从 23% 提升到 40%+，并给出地理需求 69%、全科套餐倾向 74%、400 元以内接受度 52.94% 作为落地页选品和套餐表达依据。' },
      { label: '动作', text: '落地页结构按“孩子爱学 → 听得懂 → 家长看得见效果 → 试听/购买/APP承接”组织。' },
    ],
  },
];


function SourcePanel() {
  return (
    <div className="rounded-[8px] border border-[#E6DDD3] bg-white p-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-[12px] font-black tracking-[0.14em] text-[#E95B35]">资料来源</p>
          <p className="mt-2 max-w-2xl text-[13px] leading-6 text-[#706960]">
            页面结论来自课程售卖情况、研究拆解、项目总结、定性洞察和定量报告；每条用户原声都落到“用户几访谈”，可跳转到对应访谈纪要、文字记录或录音来源继续追溯。
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <a href={STRATEGY_SOURCE_URL} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 rounded-full border border-[#D8D0C6] px-3 py-1.5 text-[12px] font-bold text-[#5F5851] hover:text-[#E95B35]">
            <FileText size={13} />
            洞察小结
          </a>
          <a href={RESEARCH_SOURCE_URL} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 rounded-full border border-[#D8D0C6] px-3 py-1.5 text-[12px] font-bold text-[#5F5851] hover:text-[#E95B35]">
            <FileText size={13} />
            研究方案
          </a>
          <a href={INTERVIEW_INDEX_URL} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 rounded-full border border-[#D8D0C6] px-3 py-1.5 text-[12px] font-bold text-[#5F5851] hover:text-[#E95B35]">
            <FileText size={13} />
            访谈纪要
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

type ConclusionPriority = '高优先级' | '中优先级';
type ConclusionConfidence = '高置信' | '中高置信';

interface ResearchConclusion {
  id: string;
  dimension: DimensionId;
  title: string;
  summary: string;
  priority: ConclusionPriority;
  confidence: ConclusionConfidence;
  insight: string;
  conclusion: string;
  conclusions: string[];
  actions: string[];
  evidenceNote: string;
}

const priorityByDimension: Record<DimensionId, ConclusionPriority> = {
  core: '高优先级',
  purchase: '高优先级',
  experience: '高优先级',
  barrier: '高优先级',
  brand: '中优先级',
  next: '中优先级',
};

const confidenceByDimension: Record<DimensionId, ConclusionConfidence> = {
  core: '高置信',
  purchase: '中高置信',
  experience: '高置信',
  barrier: '中高置信',
  brand: '中高置信',
  next: '中高置信',
};

function compactSummary(text: string) {
  return text.length > 52 ? `${text.slice(0, 52)}...` : text;
}


const reportConclusions: ResearchConclusion[] = redesignedCards.map((card) => {
  const takeaways = card.takeaways ?? cardTakeaways[card.id] ?? [];
  const judgment = takeaways.find((item) => item.label === '判断')?.text;
  const evidence = takeaways.find((item) => item.label === '依据')?.text;
  const action = takeaways.find((item) => item.label === '动作')?.text;

  return {
    id: card.id,
    dimension: card.dimension,
    title: card.title,
    summary: compactSummary(judgment ?? card.conclusion),
    priority: priorityByDimension[card.dimension],
    confidence: confidenceByDimension[card.dimension],
    insight: evidence ?? card.data ?? card.conclusion,
    conclusion: card.conclusion,
    conclusions: conclusionDetailsByCardId[card.id] ?? [card.conclusion],
    actions: action ? [action] : ['把该结论转成页面话术、产品反馈或转化链路中的具体表达。'],
    evidenceNote: card.data ?? '来源说明：访谈纪要/文字记录与定量报告。',
  };
});


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
  const detailRefs = React.useRef<Partial<Record<DimensionId, HTMLElement | null>>>({});
  const [detailHeights, setDetailHeights] = React.useState<Partial<Record<DimensionId, number>>>({});

  const totalVoc = Object.values(conclusionClipsByCardId).flat(2).length;
  const userCount = new Set(Object.values(clipMetaByUrl).map((item) => item.source.split('·')[0].trim())).size;

  React.useLayoutEffect(() => {
    const measuredNodes = dimensions
      .map((dimension) => [dimension.id, detailRefs.current[dimension.id]] as const)
      .filter((entry): entry is readonly [DimensionId, HTMLElement] => Boolean(entry[1]));

    if (measuredNodes.length === 0) return;

    const nodeIds = new Map<HTMLElement, DimensionId>();
    measuredNodes.forEach(([dimensionId, node]) => nodeIds.set(node, dimensionId));

    const updateHeight = (dimensionId: DimensionId, node: HTMLElement) => {
      const nextHeight = Math.ceil(node.getBoundingClientRect().height);
      setDetailHeights((prev) => (prev[dimensionId] === nextHeight ? prev : { ...prev, [dimensionId]: nextHeight }));
    };

    const updateAllHeights = () => {
      measuredNodes.forEach(([dimensionId, node]) => updateHeight(dimensionId, node));
    };

    updateAllHeights();

    if (typeof ResizeObserver === 'undefined') {
      window.addEventListener('resize', updateAllHeights);
      return () => window.removeEventListener('resize', updateAllHeights);
    }

    const observer = new ResizeObserver((entries) => {
      entries.forEach((entry) => {
        const node = entry.target as HTMLElement;
        const dimensionId = nodeIds.get(node);
        if (dimensionId) updateHeight(dimensionId, node);
      });
    });

    measuredNodes.forEach(([, node]) => observer.observe(node));
    window.addEventListener('resize', updateAllHeights);

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', updateAllHeights);
    };
  }, [selectedByDimension]);

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
            const dynamicHeightStyle = detailHeights[dimension.id]
              ? ({ '--detail-column-height': `${detailHeights[dimension.id]! + 48}px` } as React.CSSProperties)
              : undefined;

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
                    ref={(node) => {
                      detailRefs.current[dimension.id] = node;
                    }}
                    className="self-start rounded-[18px] border border-[#E6DDD3] bg-[#FBFAF7] p-3"
                  >
                    <div className="mb-3 flex shrink-0 items-center justify-between">
                      <p className="text-[14px] font-black text-[#403A34]">结论列表</p>
                      <span className="text-[11px] font-bold text-[#8A8279]">{dimensionItems.length} 条</span>
                    </div>
                    <div className="space-y-2.5">
                      {dimensionItems.map((item) => {
                        const selected = item.id === selectedConclusion.id;
                        const index = dimensionItems.findIndex((entry) => entry.id === item.id);
                        return (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => {
                              setSelectedByDimension((prev) => ({ ...prev, [dimension.id]: item.id }));
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

                  <section
                    className="self-start rounded-[18px] border border-[#E6DDD3] bg-white p-5 xl:h-[var(--detail-column-height)] xl:overflow-y-auto"
                    style={dynamicHeightStyle}
                  >
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
                      <div className="mt-3 space-y-2.5">
                        {selectedConclusion.conclusions.map((conclusion, index) => {
                          const conclusionClips = conclusionClipsByCardId[selectedConclusion.id]?.[index] ?? [];
                          return (
                            <div key={conclusion} className="flex items-start gap-3 rounded-[12px] bg-[#FFF9F5] px-3 py-3">
                              <span
                                className="mt-1 grid size-5 shrink-0 place-items-center rounded-full text-[11px] font-black text-white"
                                style={{ backgroundColor: dimension.color }}
                              >
                                {index + 1}
                              </span>
                              <div className="min-w-0 flex-1">
                                <p className="text-[16px] font-black leading-7 text-[#292521]">{conclusion}</p>
                                {conclusionClips.length > 0 && (
                                  <div className="mt-2.5 flex flex-col gap-2">
                                    {conclusionClips.map((clip, clipIndex) => {
                                      const meta = clipMetaByUrl[clip];
                                      const evidenceClips: EvidenceClip[] = [{ clipUrl: clip, startTime: 0, duration: 0 }];
                                      return (
                                        <div
                                          key={clip + clipIndex}
                                          className="flex w-full flex-col rounded-[12px] border border-[#EADFD2] bg-white px-3.5 py-3"
                                        >
                                          <div className="flex items-start gap-1.5">
                                            <Quote size={13} className="mt-0.5 shrink-0 text-[#E95B35]" />
                                            <p className="text-[12.5px] font-semibold leading-5 text-[#3A342E]">{meta?.text ?? ''}</p>
                                          </div>
                                          <p className="mt-1.5 text-[11px] font-bold text-[#9A8F82]">— {meta?.source ?? '访谈原声'}</p>
                                          <EvidenceAudioClips clips={evidenceClips} />
                                        </div>
                                      );
                                    })}
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
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

                  </section>
                </div>
              </article>
            );
          })}
        </div>
      </section>


      <footer className="px-5 pb-8 text-center text-[12px] font-semibold text-[#A19990] md:px-8">
        用户原声来源限定为访谈目录中的用户1-用户8；每个维度卡片内的结论与内联原声独立联动。
      </footer>
    </main>
  );
}
