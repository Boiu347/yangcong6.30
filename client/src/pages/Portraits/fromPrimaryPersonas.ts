export interface PersonaAttribute {
  key: 'situation' | 'need' | 'pain' | 'preference';
  label: string;
  value: string;
}

export interface PersonaCase {
  tone: 'positive' | 'negative';
  brand: string;
  note: string;
}

export interface PersonaStoryPoint {
  /** 论点描述（可为空，只放原声时留空即可） */
  text: string;
  /** 该论点下的访谈原声引用 */
  quotes?: string[];
}

export interface PersonaStoryBeat {
  heading: string;
  /** 段落引子（可选） */
  body?: string;
  /** 逐条论点 + 原声，用于还原访谈密度 */
  points?: PersonaStoryPoint[];
}

export interface FromPrimaryPersona {
  id: string;
  index: string;
  name: string;
  keyword: string;
  tagline: string;
  /** 一句话类型定义 */
  definition: string;
  /** 与其他类型的边界 */
  boundary: string;
  /** 课程偏好 → 产品机会（轻量，非完整策略） */
  productOpportunity: string;
  accent: string;
  accentSoft: string;
  attributes: PersonaAttribute[];
  cases: PersonaCase[];
  /** 完整故事线：逐段还原访谈论点与原声 */
  storyBeats: PersonaStoryBeat[];
  representative: {
    title: string;
    region: string;
    grade: string;
    role: string;
    snapshot: string;
    quote: string;
    extraQuotes?: string[];
  };
}

export const PORTRAIT_INTRO = {
  eyebrow: 'INSIGHTHUB · 用户画像',
  title: '用户画像',
  lead: '根据「家长买这类课时，真正想解决什么问题」，将 8 位访谈家长抽象成 4 类画像。',
  note: '每一章先讲一类人的画像定义，再讲该类型中的典型代表用户故事；策略与动作建议见「调研结论」。',
};

/** 页面级总结：核心客群判断 + 分类逻辑 */
export const PORTRAIT_OVERVIEW = {
  coreJudgment: {
    title: '核心客群判断',
    text: '同一位家长可能同时具备多种特征；访谈中大多数家长属于「兴趣启蒙型 + 学科启蒙打底型」的叠加——先用兴趣打开接触，再用「未来有用」合理化长期投入。',
    highlight: ['兴趣启蒙型', '学科启蒙打底型'],
  },
  classificationLogic: {
    title: '分类逻辑',
    text: '分类轴不是年级或地域，而是「家长买课真正想解决什么问题」：是打开兴趣、长期打底、动手验证，还是辅助校内。',
  },
  comparisonColumns: ['学情特征', '用户需求', '核心痛点', '课程偏好'] as const,
};

export const PORTRAIT_SOURCES: Array<{ label: string; url: string }> = [
  { label: '访谈纪要（录音、逐字稿）', url: 'https://guanghe.feishu.cn/wiki/STo3wNQSui7aohkP4oacAXVVnKf' },
  { label: '洞察小结 · 从小学系列调研', url: 'https://guanghe.feishu.cn/wiki/BRBywMno4iK5QakFbmqcwJxen4b?from=from_copylink' },
  { label: '研究方案（招募问卷、访谈提纲）', url: 'https://guanghe.feishu.cn/wiki/S7NrwiHD8iQhkFkzR50cs54bnMf?from=from_copylink' },
];

export const FROM_PRIMARY_PERSONAS: FromPrimaryPersona[] = [
  {
    id: 'interest',
    index: '01',
    name: '兴趣启蒙型',
    keyword: '入口',
    tagline: '把物理当作孩子「愿意看」的理科兴趣入口',
    definition: '低年级、低压力家庭：不急于提分，首要目标是让孩子愿意接触理科、不排斥未来学习。',
    boundary: '和「学科打底型」不同：同样不追短期成绩，但这类家长对「未来有用」的表述更轻，购买理由更偏「孩子喜欢就先接触」。',
    productOpportunity: '趣味动画、短视频节奏、实验男等「孩子愿意主动看」的入口内容；避免太正式、太像上课的表达。',
    accent: '#C9622E',
    accentSoft: 'rgba(201, 98, 46, 0.10)',
    attributes: [
      { key: 'situation', label: '学情特征', value: '孩子低年级，家长不急于提分；更在意孩子是否愿意看、是否不排斥理科。' },
      { key: 'need', label: '用户需求', value: '让孩子觉得物理有意思，愿意持续接触，防止未来畏难排斥。' },
      { key: 'pain', label: '核心痛点', value: '孩子不喜欢，无法起到兴趣启蒙的效果——课程太像上课、太正式、太无趣，孩子容易排斥。' },
      { key: 'preference', label: '课程偏好', value: '偏好动画、短视频、故事化、生活现象等孩子喜欢的内容。' },
    ],
    cases: [
      { tone: 'positive', brand: '洋葱', note: '孩子喜欢看实验男做实验' },
      { tone: 'negative', brand: '妙懂', note: '太正式，不是小孩能接受的预期' },
    ],
    storyBeats: [
      {
        heading: '两个孩子，姐姐高中、弟弟一年级',
        points: [
          { text: '她对孩子学习没有特别焦虑的强规划，一年级孩子目前没有报很多辅导班，整体掌握情况也不错。' },
          { text: '相比「必须学到什么程度」，她更在意的是孩子能不能先愿意接触、愿意听、愿意看下去。' },
        ],
      },
      {
        heading: '顺手加购，期待很轻',
        body: '她最初购买《从小学物理》，是给姐姐买高中物理时顺着推荐看到了小学课程；弟弟看到里面有从小学物理后表现出兴趣，她就顺手买了。',
        points: [
          {
            text: '她对这门课的期待很轻，不会把这件事定义成明确的学习任务，也没有要求孩子每天固定学习。',
            quotes: ['孩子喜欢学就学，多看一点总归有帮助。'],
          },
          {
            text: '对她来说，小学阶段的物理启蒙不是为了马上衔接，而是因为孩子喜欢，先让孩子接触。',
            quotes: ['因为学习是个长期的过程，不是一蹴而就的。所以也没什么目的，孩子喜欢学就学。'],
          },
        ],
      },
      {
        heading: '认可的是「听得有兴趣」',
        points: [
          { text: '相比普通科普视频，这类内容更像是孩子愿意主动看的科学内容，能把孩子先拉进来。' },
          {
            text: '尤其是实验男做实验相关内容，对孩子很有吸引力。',
            quotes: ['孩子喜欢看实验男，因为学而思的教具或课堂都不能做危险的实验，而实验男可以做一些家里做不到、且会爆炸的实验。'],
          },
        ],
      },
    ],
    representative: {
      title: '安徽合肥妈妈',
      region: '安徽合肥',
      grade: '一年级',
      role: '妈妈',
      snapshot: '不急着让孩子提前学完整套初中物理，也不会用成绩检验启蒙效果；她首先要的是孩子愿意看、听得懂、觉得好玩。',
      quote: '孩子喜欢学就学，多看一点总归有帮助。',
      extraQuotes: [
        '因为学习是个长期的过程，不是一蹴而就的。所以也没什么目的，孩子喜欢学就学。',
        '孩子喜欢看实验男，因为学而思的教具或课堂都不能做危险的实验，而实验男可以做一些家里做不到、且会爆炸的实验。',
      ],
    },
  },
  {
    id: 'foundation',
    index: '02',
    name: '学科启蒙打底型',
    keyword: '长期',
    tagline: '把理科启蒙当作「未来别被卡住」的长期打底',
    definition: '有明确「未来学科价值」预期：不追短期提分，但要求启蒙内容和初高中理科学习挂钩，形成长期优势。',
    boundary: '和「兴趣启蒙型」共享低压力场景，但更「功利」——需要看见「有用」的路径，而不只是「孩子爱看」。和「实验探究型」不同：实验是手段之一，核心诉求是思维框架与未来衔接。',
    productOpportunity: '体系化大纲、生活化讲解、轻量验证、与未来初中知识的关联；「效果外化」是这类家长最缺的判断依据，也是差异化机会。',
    accent: '#3F5E8C',
    accentSoft: 'rgba(63, 94, 140, 0.10)',
    attributes: [
      { key: 'situation', label: '学情特征', value: '不追求短期效果，但有明确「未来有用」的预期；相对兴趣启蒙更加「功利」。' },
      { key: 'need', label: '用户需求', value: '为孩子建立理科思维框架，提前熟悉概念，初中学理科时更轻松。' },
      { key: 'pain', label: '核心痛点', value: '「未来有用」达成路径缺失，缺少对「有用」的判断依据——不知道孩子学到多少、记住多少、学科思维有没有变化。' },
      { key: 'preference', label: '课程偏好', value: '偏好「有趣但有用」的课程：生活化讲解、体系化大纲、轻量题目验证、能关联未来初中知识。' },
    ],
    cases: [
      { tone: 'positive', brand: '效果外化', note: '阶段性让家长看到学科启蒙的效果，是差异化机会点' },
      { tone: 'negative', brand: '洋葱与竞品', note: '目前均未很好做到「有用」的可见验证' },
    ],
    storyBeats: [
      {
        heading: '两个孩子，课程主要买给三年级的大孩',
        points: [
          { text: '爸爸是文科背景，自己理科相对弱，所以希望孩子不要走自己的老路。' },
          { text: '他对孩子的理科学习有明确的长期规划：小学阶段不一定要立刻见效，但不能让孩子未来初高中被理科限制。' },
        ],
      },
      {
        heading: '「笨鸟先飞」的学科启蒙逻辑',
        body: '更在意的是：孩子未来能不能形成理科思维、能不能在初高中面对物理化学时不吃力，甚至大学选专业时不要因为理科弱而被动。',
        points: [
          {
            text: '因此，他购买学而思科学、NB 实验室，不是单纯为了兴趣，而是带着「笨鸟先飞」的学科启蒙逻辑。',
            quotes: ['希望孩子现在学一遍，初高中再学一遍时更轻松。'],
          },
          {
            text: '对他来说，真正有价值的启蒙不是「看着玩」，而是和未来学科挂钩。',
            quotes: [
              '学科启蒙为了以后中高考、初高中理科学习；兴趣启蒙要求更低，更像让孩子试水、培养兴趣。',
              '学的东西未来要有用，理科启蒙要和未来学科挂钩，不能只是玩一玩。',
            ],
          },
        ],
      },
      {
        heading: '看重长期使用与未来路径',
        body: '相比一次性的兴趣内容，他更看重一个产品能不能长期使用、能不能连接未来学习路径。',
        points: [
          {
            text: '他选择 NB 实验室，是因为它覆盖小学到高中、能选教材版本、有实验、有知识闯关和习题，还能寒暑假按单元复习或预习。',
            quotes: ['覆盖教材、覆盖小学到高中、能做实验、能做习题，说明产品具备学科启蒙属性。'],
          },
          {
            text: '短期内并没有非常清晰的效果标准，主要用孩子是否接纳、是否愿意学来判断启蒙是否成立。',
            quotes: ['孩子保持兴趣；孩子不逆反；布置任务时愿意点进去学；对科学书籍和理科内容接纳度提升。'],
          },
        ],
      },
    ],
    representative: {
      title: '北京昌平爸爸',
      region: '北京昌平',
      grade: '三年级',
      role: '爸爸',
      snapshot: '文科背景，不会用短期成绩检验课程价值，也不希望孩子过早刷题；但明确要求课程「未来有用」，帮助孩子建立理科接纳度、熟悉感和长期学习优势。',
      quote: '学的东西未来要有用，理科启蒙要和未来学科挂钩，不能只是玩一玩。',
      extraQuotes: [
        '希望孩子现在学一遍，初高中再学一遍时更轻松。',
        '覆盖教材、覆盖小学到高中、能做实验、能做习题，说明产品具备学科启蒙属性。',
        '孩子保持兴趣；孩子不逆反；布置任务时愿意点进去学；对科学书籍和理科内容接纳度提升。',
      ],
    },
  },
  {
    id: 'experiment',
    index: '03',
    name: '实验探究型',
    keyword: '动手',
    tagline: '相信实验与系统讲解，想让孩子在动手中真正理解物理',
    definition: '把「动手验证」视为理科学习的核心方式：不只接受视频讲解，要求孩子能观察、操作、提问并理解原理。',
    boundary: '和「兴趣启蒙型」都可能被实验吸引，但这类家长要的是「讲解 + 动手」兼备，而不是只看实验视频。和「校内助力型」不同：动机是理解原理，不是对标教材拿分。',
    productOpportunity: '真实验、材料易得、可跟着做；讲解要儿童化，实验要更可操作——虚拟实验难以替代「真动手」的参与感。',
    accent: '#2F8272',
    accentSoft: 'rgba(47, 130, 114, 0.10)',
    attributes: [
      { key: 'situation', label: '学情特征', value: '家长看重实验，相信「实验是理科学习的核心」；孩子对「科学实验」有兴趣。' },
      { key: 'need', label: '用户需求', value: '让孩子通过观察现象、动手操作来理解原理，而不是只看视频。' },
      { key: 'pain', label: '核心痛点', value: '虚拟实验缺少动手感，无法替代真人实验——容易停留在「看过」，孩子无法跟着一起动手做。' },
      { key: 'preference', label: '课程偏好', value: '偏好真实验、可动手、材料易获得、老师带做。' },
    ],
    cases: [
      { tone: 'positive', brand: '真人实验直播课', note: '专业老师带做实验讲解，孩子感兴趣、吸收得多' },
      { tone: 'negative', brand: 'NB实验室', note: '动手交互不能代替真实实验' },
    ],
    storyBeats: [
      {
        heading: '报过很多物理启蒙 / 实验课',
        body: '家里一个二年级男孩，报过很多物理启蒙 / 实验课（从小学物理、NB 实验室、学而思自然博物、赛先生科学课等）。',
        points: [
          { text: '她不是随便买来试试，而是长期关注孩子的学习兴趣、学科启蒙和未来升学。' },
        ],
      },
      {
        heading: '买洋葱：信任品牌 + 被实验吸引',
        body: '她购买《从小学物理》，一方面是因为信任洋葱品牌，另一方面是被实验吸引，孩子也喜欢看实验男做实验。',
        points: [
          {
            text: '购买前——看中理科同步校内、实验做得好、孩子感兴趣才加购。',
            quotes: ['我主要是看中他这个理科的同步校内，看他那实验做得也比较好，孩子看了也很感兴趣，我才又添加这笔钱买的从小学物理这个课程。'],
          },
          {
            text: '购买后——不主动管的话，孩子每天都会看。',
            quotes: ['洋葱如果不管的话每天都会看，喜欢看实验男做实验。'],
          },
        ],
      },
      {
        heading: '讲解 + 动手要兼备',
        body: '她对「好的理科启蒙」要求：只有「知识讲解」和「动手实验」兼备，孩子才能真正印证理论知识。',
        points: [
          {
            text: '她对赛先生科学课评价高，就是因为有真人老师一边讲解一边带着做实验，孩子吸收更多、更有参与感。',
            quotes: [
              '一定要有专业的老师带着做实验才效果好，孩子做实验时能问老师，老师能纠正过来。',
              '线上知识点、线下做实验直播课更全，有真人老师照顾得过来，孩子吸收得也多。',
              '实验肯定是重要的，理科就是实践出真知，自己看肯定不如自己动手。',
            ],
          },
          {
            text: '相比之下，NB 实验室动手操作多但讲解弱，洋葱内容讲解系统但实验动手不足。',
            quotes: ['（NB）没讲解，更多动手操作，家长在旁边需要多一点。'],
          },
        ],
      },
      {
        heading: '对洋葱的三点期待',
        points: [
          { text: '保持内容系统和趣味的优势；把专业概念讲得更儿童化；把实验做得更可操作。' },
        ],
      },
    ],
    representative: {
      title: '北京顺义妈妈',
      region: '北京顺义',
      grade: '二年级',
      role: '妈妈',
      snapshot: '她相信兴趣重要，但更相信「实践出真知」；要的不是孩子只看懂视频，而是能动手、能提问、能在实验中把抽象概念真正理解。',
      quote: '实验肯定是重要的，理科就是实践出真知，自己看肯定不如自己动手。',
      extraQuotes: [
        '一定要有专业的老师带着做实验才效果好，孩子做实验时能问老师，老师能纠正过来。',
        '线上知识点、线下做实验直播课更全，有真人老师照顾得过来，孩子吸收得也多。',
        '（NB）没讲解，更多动手操作，家长在旁边需要多一点。',
      ],
    },
  },
  {
    id: 'school',
    index: '04',
    name: '校内科学课助力型',
    keyword: '同步',
    tagline: '把《从小学物理》当作小学科学课的辅助工具',
    definition: '动机来自校内：所在地区科学是主课、要考试，希望帮孩子理解课本、减少死记硬背，而非做长期启蒙或提前学。',
    boundary: '和前三类都不同：购买理由不是「兴趣」或「未来打底」，而是「现在这门课要考」。对教材版本、知识点顺序、检索能力的要求远高于其他类型。',
    productOpportunity: '按年级 / 教材版本 / 知识点组织与快速检索；内容覆盖需尽量对齐校内，否则使用频率会快速下降。',
    accent: '#7C5A93',
    accentSoft: 'rgba(124, 90, 147, 0.10)',
    attributes: [
      { key: 'situation', label: '学情特征', value: '所在地区科学是主课，会像语数英一样有考试；家长希望帮助校内科学学习。' },
      { key: 'need', label: '用户需求', value: '让孩子学透校内科学课的知识，不只是背概念、背实验结论。' },
      { key: 'pain', label: '核心痛点', value: '课程内容需与教材知识点顺序一致，否则会影响使用率——不能按年级、教材、知识点查找，实际会用不上。' },
      { key: 'preference', label: '课程偏好', value: '偏好对标教材、按年级 / 教材版本 / 知识点组织、能快速搜索的产品。' },
    ],
    cases: [
      { tone: 'negative', brand: '洋葱', note: '有些学校科学课的知识点在洋葱没有，需更强的年级 / 教材 / 知识点检索匹配' },
    ],
    storyBeats: [
      {
        heading: '科学是要考试的主科',
        body: '一个四年级孩子，郑州的科学课是需要考试的主课：期中期末要考，平时也有单元测。',
      },
      {
        heading: '买来把抽象知识点讲明白',
        body: '打动她购买的，是科学课占据了很多学习时间，孩子平时更多靠背书，容易背不下来、理解不透。她希望用动画视频帮孩子把校内科学里的抽象知识点讲明白。',
        points: [
          {
            text: '科学课占时间、靠背书理解不透，希望用动画讲明白抽象知识点。',
            quotes: [
              '孩子日常单元课，在科学上占据很多时间，老师会梳理知识点——实验、名词解释都需要背。',
              '不希望孩子死记硬背，刚好有这个课。',
            ],
          },
        ],
      },
      {
        heading: '期待与使用场景很具体',
        points: [
          {
            text: '期待 · 校内同步：能对标校内知识点，孩子哪个单元不理解就能快速找到对应视频看。',
            quotes: ['可以研究各个地区的课本，根据课本有相关知识点，一找就能找到知识点。'],
          },
          {
            text: '场景 · 查漏补缺：并不强求系统学完整套课程，而是当作一种「知识点复习 / 理解工具」。',
            quotes: ['洋葱主要是用来复习知识点，这个单元需要考试，或者某个知识点有明显缺漏需要看。'],
          },
        ],
      },
      {
        heading: '使用落差：不够同步',
        body: '课程虽然动画不枯燥，但不够同步，四年级上册的一些内容找不到。',
        points: [
          {
            text: '如果不能按年级、教材、知识点检索，这门课的使用频率就会降低，容易变成「想起来划两下」的补充内容。',
            quotes: [
              '之前以为顺序不一样但知识点都有，后面发现不一样（四上的内容找不到）。',
              '如果没那么同步，可能想起来了去划两下，或者哪个知识点真的不理解，平时用不到。',
            ],
          },
        ],
      },
    ],
    representative: {
      title: '河南郑州妈妈',
      region: '河南郑州',
      grade: '四年级',
      role: '妈妈',
      snapshot: '她不是为了启蒙或提前学，而是希望课程帮孩子学透校内科学课；最看重能不能对标教材，让孩子不再死记硬背，而能真的理解原理。',
      quote: '洋葱主要是用来复习知识点，这个单元需要考试，或者某个知识点有明显缺漏需要看。',
      extraQuotes: [
        '可以研究各个地区的课本，根据课本有相关知识点，一找就能找到知识点。',
        '之前以为顺序不一样但知识点都有，后面发现不一样（四上的内容找不到）。',
        '如果没那么同步，可能想起来了去划两下，或者哪个知识点真的不理解，平时用不到。',
      ],
    },
  },
];

/** 横向对比表：供总览区使用 */
export function getComparisonMatrix() {
  const dims: Array<{ key: keyof PersonaAttribute; label: string }> = [
    { key: 'situation', label: '学情特征' },
    { key: 'need', label: '用户需求' },
    { key: 'pain', label: '核心痛点' },
    { key: 'preference', label: '课程偏好' },
  ];
  return dims.map((dim) => ({
    dimension: dim.label,
    cells: FROM_PRIMARY_PERSONAS.map((p) => {
      const attr = p.attributes.find((a) => a.key === dim.key);
      return { personaId: p.id, personaName: p.name, accent: p.accent, value: attr?.value ?? '' };
    }),
  }));
}
