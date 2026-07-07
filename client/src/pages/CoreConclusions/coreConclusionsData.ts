// 「核心结论」tab 数据
// 结构对应飞书文档《【网站素材】从小学系列售卖策略调研》V2 › 主页面2：核心结论
//   子页面(DimensionSection) → 主标题(MainConclusion) → 副标题(SubSection) → 要点(Point) → 论据(录音/数据/图片)
// 访谈原话对应的音频切片来自 client/public/clips，映射解析自 evidenceClipLookup.ts。

const BASE_PATH = process.env.CLIENT_BASE_PATH || '';
const img = (name: string) => `${BASE_PATH}/core-conclusions/${name}`;

export interface VocClip {
  /** 展示的原话文本 */
  text: string;
  /** 用户来源，如「用户7 · 二年级 · 山东潍坊」 */
  source: string;
  /** 音频切片地址；缺省表示暂无现成录音，仅展示文本 */
  clipUrl?: string;
}

export interface DocImage {
  src: string;
  caption?: string;
}

export interface Point {
  /** 要点标签，如 前提 / 核心 / 产品定位 / 竞品 / 洋葱 / 系统性 */
  label?: string;
  /** 要点正文 */
  text: string;
  /** 访谈录音片段 */
  quotes?: VocClip[];
  /** 问卷 / 行业 / 销售等文字论据 */
  notes?: string[];
  /** 配图论据 */
  images?: DocImage[];
}

export interface SubSection {
  /** 副标题，如「用研洞察：品类成立的原因是什么？」；为空则不单独渲染标题 */
  title: string;
  /** 副标题类型，用于配色（洞察偏暖、启发偏冷） */
  kind?: '洞察' | '启发';
  points: Point[];
}

export interface MainConclusion {
  id: string;
  /** 主标题（左侧结论列表卡片） */
  title: string;
  /** 左侧卡片摘要 */
  summary: string;
  /** 关键洞察（右侧详情顶部高亮框） */
  insight: string;
  subs: SubSection[];
  /** 底部来源说明 */
  evidenceNote: string;
}

export interface DimensionSection {
  id: string;
  label: string;
  desc: string;
  iconKey: 'deal' | 'barrier' | 'experience';
  color: string;
  mains: MainConclusion[];
}

export const coreConclusionSections: DimensionSection[] = [
  // ── 子页面a：成交原因 ─────────────────────────────────────────────
  {
    id: 'deal',
    label: '成交原因',
    desc: '家长为什么会买？从品类动机到产品决策，拆解成交背后的真实逻辑。',
    iconKey: 'deal',
    color: '#E95B35',
    mains: [
      {
        id: 'deal-category',
        title: '品类动机 —— 为初中理科学习买一份"确定感"',
        summary: '兴趣是入口，"未来学科价值"才是最终合理化购买的理由。',
        insight:
          '家长嘴上说"兴趣""启蒙"，继续追问后几乎都会回到"未来学理科别排斥、别畏难"。兴趣负责打开第一步，未来的学科价值才是最终合理化购买的理由——这份"初中有用"的确定感，正是品类成立的根本。',
        subs: [
          {
            title: '用研洞察：品类成立的原因是什么？',
            kind: '洞察',
            points: [
              {
                label: '前提',
                text: '兴趣是入口，孩子喜欢，家长才会进一步考虑购买。',
                notes: [
                  '问卷「成交被打动因素」排名：趣味动画课（TOP 1）53%、孩子喜欢（TOP 2）40%。',
                ],
                quotes: [
                  {
                    text: '首先是孩子能看得进去，看得进去的话，想教他的知识，他才能听进去、学进去。',
                    source: '用户7 · 二年级 · 山东潍坊',
                    clipUrl: '/clips/interview7/0208-01.mp3',
                  },
                  {
                    text: '我是基于我们家孩子喜欢，我才付费去买这个课程的。',
                    source: '用户4 · 二年级 · 北京顺义',
                    clipUrl: '/clips/interview4/0086-01.mp3',
                  },
                ],
              },
              {
                label: '核心',
                text: '「未来学科价值」才是最终合理化购买的理由：正式学理科时不陌生、不畏难，对初高中学习有帮助。',
                notes: [
                  '问卷「对课程的学习预期」：孩子未来进入初中后学理科时能更快听懂（TOP 1）31%。',
                  '竞品分析：物理十分通卖"将来上初中物理跟不上"的预防焦虑，妙懂卖"初中物理听不懂、我辅导不了"的辅导焦虑，NB 实验室卖"初高中实验全覆盖"——本质都在指向「学科」。',
                ],
                quotes: [
                  {
                    text: '因为以后到初中也会学到物理，然后可以提前让他认识、知道一些跟物理相关的知识。',
                    source: '用户3 · 二年级 · 广东中山',
                    clipUrl: '/clips/interview3/0007-01.mp3',
                  },
                  {
                    text: '初中、高中肯定都会有这个课程，那提前在小学这个阶段让他先接触一下、了解相关知识，之后学起来可能不会很吃力。',
                    source: '用户7 · 二年级 · 山东潍坊',
                  },
                  {
                    text: '最少他上初中、高中学习物理不会那么吃力吧？因为他小时候就喜欢接触，应该是有点帮助。',
                    source: '用户8 · 一年级 · 安徽合肥',
                    clipUrl: '/clips/interview8/0001-01.mp3',
                  },
                ],
              },
            ],
          },
          {
            title: '业务启发：结合品类需求，洋葱该占据哪类细分市场？',
            kind: '启发',
            points: [
              {
                label: '产品定位',
                text: '家长需求介于「纯兴趣启蒙」和「小初衔接提前学」之间，更准确的品类位置是"学科启蒙"，而这部分恰好是竞品未占据的蓝海。',
                notes: [
                  '行业研究·兴趣启蒙：竞争激烈的红海，一边是更方便实惠的绘本/科普书，一边是斑马、叫叫等线上化竞品，洋葱做「课」起家不一定占优。',
                  '行业研究·小初衔接提前学：需求与课程方案不匹配，有"提前学"诉求的用户更想直接对标教材，会选妙懂或洋葱小初 6 年卡的初中同步课。',
                ],
                quotes: [
                  {
                    text: '不需要提前学完初中内容，能确保以后正式学时不陌生就可以了。',
                    source: '访谈原声',
                  },
                  {
                    text: '到真正学物理的时候，讲到的时候孩子都知道，比其他同学更好吸收。',
                    source: '用户3 · 二年级 · 广东中山',
                    clipUrl: '/clips/interview3/0045-01.mp3',
                  },
                  {
                    text: '让他不排斥，印象里面有这个东西，他就更感兴趣去学，学起来也容易一些。',
                    source: '用户5 · 三年级 · 重庆渝中',
                    clipUrl: '/clips/interview5/0001-01.mp3',
                  },
                ],
                images: [{ src: img('positioning-survey.png'), caption: '问卷：家长对课程的定位' }],
              },
              {
                label: '目标人群',
                text: '小学 1-4 年级家长——既没有学前（3-6 岁）的纯兴趣启蒙诉求，也不到小高（5-6 年级）的强应试衔接焦虑，是"低压力学科启蒙"的核心受众。',
                notes: [
                  '内部销售数据：截至 5 月 12 日，《从小学系列课程》已购用户 1-3 年级占比 77%（新媒体渠道近 7 成），从 5 年级开始断崖式下降。',
                ],
                images: [{ src: img('sales-grade.png'), caption: '销售数据：已购用户年级分布' }],
              },
            ],
          },
        ],
        evidenceNote: '来源：网站素材 V2｜成交原因·品类动机；问卷调研、内部销售数据、竞品分析。',
      },
      {
        id: 'deal-product',
        title: '产品决策 —— 相比竞品，洋葱缺少清晰的课程记忆点',
        summary: '竞品靠"单点爆破"成交，洋葱更多靠品牌信任和顺手加购。',
        insight:
          '家长能一句话说清竞品"为什么买"：NB 触屏安全实验、直播课真人带做、妙懂 AR 有趣、万物指南吴姥姥权威。而洋葱的成交更多来自品牌信任和顺手加购——缺少一个能让家长立刻感知"非买不可"的课程记忆点。',
        subs: [
          {
            title: '用户洞察：家长被什么吸引下单？',
            kind: '洞察',
            points: [
              {
                label: '竞品',
                text: '更多来自"单点爆破"：NB 实验室——模拟触屏方便、能规避危险实验；线上实验直播课——真人老师动手实验、参与感强；妙懂物理——AR 形式有趣；万物指南——不刷题的吴姥姥、IP 权威。',
                quotes: [
                  {
                    text: 'NB 实验室是因为我当时觉得它那个操作比较方便一点，演示的操作看上去比较直观。',
                    source: '用户1 · 二年级 · 山东济宁',
                    clipUrl: '/clips/interview1/0074-01.mp3',
                  },
                  {
                    text: '比较吸引我的就是有一些比较危险的实验，可以在比较安全的情况下让孩子了解到。',
                    source: '用户1 · 二年级 · 山东济宁',
                    clipUrl: '/clips/interview1/0038-01.mp3',
                  },
                  {
                    text: '（学而思科学）很好，讲得特别好，老师特别有吸引力。',
                    source: '用户8 · 一年级 · 安徽合肥',
                  },
                  {
                    text: '学而思科学课主要是老师备课备得好呀，然后孩子很感兴趣。',
                    source: '用户8 · 一年级 · 安徽合肥',
                  },
                  {
                    text: '学而思还会寄实验器材、实验材料，让我们自己来做，也很棒。',
                    source: '用户8 · 一年级 · 安徽合肥',
                  },
                  {
                    text: '我想让他玩那个 AR，但是买了以后他就只玩那个 AR，里面的东西他也不太爱看。',
                    source: '用户5 · 三年级 · 重庆渝中',
                    clipUrl: '/clips/interview5/0023-01.mp3',
                  },
                  {
                    text: '我就觉着万物指南的团队比较靠谱，他不是那个不刷题的吴姥姥吗？',
                    source: '用户1 · 二年级 · 山东济宁',
                    clipUrl: '/clips/interview1/0081-01.mp3',
                  },
                  {
                    text: '吴姥姥既然比较靠谱，也不会去找不靠谱的团队合作；她这种已经荣誉加身的人，比较爱惜羽毛。',
                    source: '用户1 · 二年级 · 山东济宁',
                    clipUrl: '/clips/interview1/0085-01.mp3',
                  },
                ],
              },
              {
                label: '洋葱',
                text: '主要来自"品牌信任"和"顺手加购"。洋葱既不是妙懂（有 AR+竞技），也不是物理十分通（有超级 IP），若只用"动画易懂+教材同步"去卖，在达人面前没有独特故事，家长也难清晰感知产品价值。',
                quotes: [
                  {
                    text: '名校的光环，就是觉得这个人还是挺信得过的。',
                    source: '用户4 · 二年级 · 北京顺义',
                    clipUrl: '/clips/interview4/0021-01.mp3',
                  },
                  {
                    text: '就基于他信任，然后其他的话都是随缘。',
                    source: '用户4 · 二年级 · 北京顺义',
                    clipUrl: '/clips/interview4/0064-01.mp3',
                  },
                  {
                    text: '因为给姐姐买了高中物理，然后就顺着推荐；弟弟看到里面有从小学物理就想学，后来发现要收费，我就买了。',
                    source: '用户8 · 一年级 · 安徽合肥',
                  },
                ],
              },
            ],
          },
          {
            title: '业务启发：洋葱的最大优势不是拼单一功能，而是塑造「最专业的学科启蒙课」',
            kind: '启发',
            points: [
              {
                label: '系统性',
                text: '课程设计系统：目录框架式设计，将 300+ 个生活现象融入三大篇章，形成从基础到挑战的梯度启蒙；知识点覆盖系统：启蒙内容与人教版初中教材开篇要求一致，衔接不脱节。',
                images: [
                  { src: img('course-catalog.png'), caption: '课程目录框架：三大篇章梯度启蒙' },
                  { src: img('knowledge-coverage.png'), caption: '知识点覆盖：对齐人教版初中开篇' },
                ],
              },
              {
                label: '专业性',
                text: '老师专业：中考命题专家、竞赛专家、资深教研老师带队设计；讲解专业：3 大独创思维模型，帮孩子从表象到本质、从现象到规律。',
                images: [
                  { src: img('teacher-team.png'), caption: '教研团队：命题/竞赛/资深教研' },
                  { src: img('thinking-model.png'), caption: '3 大独创思维模型' },
                ],
              },
              {
                label: '丰富性',
                text: '知识点丰富：小初 900+ 个知识点；实验丰富：300+ 个真动手实验。',
              },
            ],
          },
        ],
        evidenceNote: '来源：网站素材 V2｜成交原因·产品决策；访谈录音、竞品分析、课程资料。',
      },
    ],
  },

  // ── 子页面b：未成交卡点 ───────────────────────────────────────────
  {
    id: 'barrier',
    label: '未成交卡点',
    desc: '哪些顾虑会阻断下单？以及洋葱该如何帮家长打消这些顾虑。',
    iconKey: 'barrier',
    color: '#D96D62',
    mains: [
      {
        id: 'barrier-insight',
        title: '用研洞察：哪些顾虑可能阻断家长下单？',
        summary: '两大顾虑：不确定孩子会不会坚持看，不确定看完到底有没有学到。',
        insight:
          '认可课程不等于会下单。家长的两条心理红线是：不确定孩子会不会坚持看（新鲜感过去就不看了），以及不确定看完到底有没有学到（小学阶段缺少可见的验证标准）。',
        subs: [
          {
            title: '',
            kind: '洞察',
            points: [
              {
                label: '顾虑一',
                text: '不确定孩子会不会坚持看。',
                quotes: [
                  {
                    text: '当时比如一年级，我让他看的时候他在看，但好像没有特别感兴趣……但现在看的话就是真的还挺认真的、挺感兴趣的。',
                    source: '用户5 · 三年级 · 重庆渝中',
                    clipUrl: '/clips/interview5/0045-01.mp3',
                  },
                  {
                    text: '有时候孩子会忘记看，所以会提醒孩子去看一下。',
                    source: '用户4 · 二年级 · 北京顺义',
                  },
                ],
              },
              {
                label: '顾虑二',
                text: '不确定看完到底有没有学到。',
                quotes: [
                  {
                    text: '我想知道他到底学了什么东西？学到了什么？学了多少？能记住什么？',
                    source: '用户5 · 三年级 · 重庆渝中',
                    clipUrl: '/clips/interview5/0035-01.mp3',
                  },
                  {
                    text: '到初中正式学物理才能看出来，现在没法判断。',
                    source: '访谈原声',
                  },
                ],
              },
            ],
          },
        ],
        evidenceNote: '来源：网站素材 V2｜未成交卡点·用研洞察；访谈录音。',
      },
      {
        id: 'barrier-action',
        title: '业务启发：洋葱该如何帮助家长打消顾虑？',
        summary: '用数据和事实证明"孩子会看"，并把"效果外化"前置为营销机制。',
        insight:
          '对"会不会坚持看"，用数据和事实说话，清楚告诉家长我们有什么、孩子为什么喜欢；对"有没有学到"，把"效果外化"前置为营销机制——不仅告诉家长孩子爱看，还让家长看见孩子学到什么、学会什么。',
        subs: [
          {
            title: '',
            kind: '启发',
            points: [
              {
                label: '打消顾虑一',
                text: '不确定孩子会不会坚持看 —— 用数据和事实说话。',
                notes: [
                  '数千家庭的选择，买回家不吃灰：1353 个家庭人均观看 86 次；购买后第 1 周人均观看 21.69 次，全量付费用户人均每月看 17 节。',
                  '趣味动画课，孩子更能看得进去：650+ 节动画视频课，把物理从课本概念变成一个个好玩的小故事。',
                  '跟着做的实验，动手把兴趣留住：制作热气球、潜望镜、乐器、造云……300+ 个真动手实验，参与感拉满。',
                ],
              },
              {
                label: '打消顾虑二',
                text: '不确定看完到底有没有学到 —— 把"效果外化"前置为营销机制。',
                notes: [
                  '家长不一定要立刻看到成绩提升，但需要阶段性信号：孩子能解释一个生活现象、完成一个实验、讲出一个原理、做对相关题目。',
                  '多维数据的学情报告，定期推送家长：包含时长/模块/知识点等数据，每周通过 APP、公众号推送，让家长清晰看到孩子学了啥、学会啥。',
                ],
              },
            ],
          },
        ],
        evidenceNote: '来源：网站素材 V2｜未成交卡点·业务启发；产品与运营数据。',
      },
    ],
  },

  // ── 子页面c：产品体验 ─────────────────────────────────────────────
  {
    id: 'experience',
    label: '产品体验',
    desc: '《从小学物理》的典型使用场景，以及各产品的体验优劣势对比。',
    iconKey: 'experience',
    color: '#2F9F8F',
    mains: [
      {
        id: 'exp-scene',
        title: '典型使用场景',
        summary: '碎片化、低压力、由兴趣触发的补充学习。',
        insight:
          '《从小学物理》的学习场景是碎片化、低压力、由兴趣触发的补充学习，常见于周末/假期、主科学习间隙、孩子主动感兴趣想看时。',
        subs: [
          {
            title: '',
            kind: '洞察',
            points: [
              {
                text: '碎片时间看：吃饭、休息、放学后、周末有空、主科学累了换脑子。',
                quotes: [
                  {
                    text: '这些看的话就是零碎的时间看，比如吃饭；星期六、星期天出去玩，他玩累了、休息的时候也可能去看一下。',
                    source: '用户5 · 三年级 · 重庆渝中',
                    clipUrl: '/clips/interview5/0053-01.mp3',
                  },
                  {
                    text: '洋葱学园的从小学物理，如果我不是不管的话，他每天都会刷。',
                    source: '用户4 · 二年级 · 北京顺义',
                    clipUrl: '/clips/interview4/0041-01.mp3',
                  },
                ],
              },
            ],
          },
        ],
        evidenceNote: '来源：网站素材 V2｜产品体验·典型使用场景；访谈录音。',
      },
      {
        id: 'exp-compare',
        title: '体验优劣势',
        summary: '从小学物理与主要竞品的体验优势 / 劣势横向对比。',
        insight:
          '各产品的体验优势与劣势各有侧重：洋葱强在系统、趣味、时长短，短板在儿童化表达、实验动手感和校内同步；竞品则各有获客钩子，但普遍卡在"效果不可见"。',
        subs: [
          {
            title: '从小学物理',
            kind: '洞察',
            points: [
              {
                label: '体验优势',
                text: '每个模块讲解的知识多；内容更系统、罗列层次清晰；孩子感兴趣、主动看；时长短无压力，一个视频就几分钟。',
              },
              {
                label: '体验劣势',
                text: '晦涩难懂词语孩子不能理解、不够口语化；答题中有些字不认识，读出来会更好；部分孩子兴趣没培养起来、不会主动看；课程内容与校内科学课不同步。',
                quotes: [
                  {
                    text: '一些晦涩难懂的概念词，孩子还是不能很好地理解……如果能根据概念做口语化、用孩子能接受的方式举例介绍，就更好了。',
                    source: '用户4 · 二年级 · 北京顺义',
                    clipUrl: '/clips/interview4/0054-01.mp3',
                  },
                ],
              },
            ],
          },
          {
            title: '万物指南 / 物理十分通',
            kind: '洞察',
            points: [
              { label: '体验优势', text: '内容质量高：短而精、废话少；不像漫画书，没有花里胡哨的废话。' },
              { label: '体验劣势', text: '视频看完了，不知道孩子吸收了多少。' },
            ],
          },
          {
            title: 'NB 实验室',
            kind: '洞察',
            points: [
              { label: '体验优势', text: '模拟实验比纯视频更有参与感；动画形式孩子喜欢；学完对理科兴趣整体越来越高。' },
              { label: '体验劣势', text: '和实际实验有差别，只能模拟、不能代替真实实验（亮度、气味、风险控制）；缺少讲解和引导，更多是孩子自己动手探索。' },
            ],
          },
          {
            title: '妙懂物理',
            kind: '洞察',
            points: [
              { label: '体验优势', text: 'AR 看起来好玩；有题库。' },
              { label: '体验劣势', text: '太正式，不是小孩能接受的语气，孩子看着感觉像学习。' },
            ],
          },
          {
            title: '真人实验直播课（学而思科学 / 赛先生等）',
            kind: '洞察',
            points: [
              { label: '体验优势', text: '专业老师带着做实验讲解，孩子吸收得多；动手实验比单纯看视频更有吸引力；后续能参加比赛。' },
              { label: '体验劣势', text: '部分老师理论讲解不好、没用孩子的语言讲解；以"参赛"为目的性价比不高（进阶赛需额外配教具和指导老师）。' },
            ],
          },
        ],
        evidenceNote: '来源：网站素材 V2｜产品体验·体验优劣势；访谈录音、产品走查。',
      },
    ],
  },
];

/** 与结论绑定的访谈原声总数（有音频切片的去重统计） */
export function countCoreVocClips(): number {
  const urls = new Set<string>();
  coreConclusionSections.forEach((section) =>
    section.mains.forEach((main) =>
      main.subs.forEach((sub) =>
        sub.points.forEach((point) =>
          (point.quotes ?? []).forEach((q) => {
            if (q.clipUrl) urls.add(q.clipUrl);
          }),
        ),
      ),
    ),
  );
  return urls.size;
}

/** 覆盖到的访谈用户数（按 source 首段去重） */
export function countCoreUsers(): number {
  const users = new Set<string>();
  coreConclusionSections.forEach((section) =>
    section.mains.forEach((main) =>
      main.subs.forEach((sub) =>
        sub.points.forEach((point) =>
          (point.quotes ?? []).forEach((q) => {
            const head = q.source.split('·')[0].trim();
            if (head.startsWith('用户')) users.add(head);
          }),
        ),
      ),
    ),
  );
  return users.size;
}
