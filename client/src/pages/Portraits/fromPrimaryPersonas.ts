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
  representative: {
    title: string;
    region: string;
    grade: string;
    role: string;
    /** 压缩后的代表场景，1–2 句 */
    snapshot: string;
    /** 只保留 1 条最有代表性的原声 */
    quote: string;
  };
}

export const PORTRAIT_INTRO = {
  eyebrow: 'INSIGHTHUB · 用户画像',
  title: '用户画像',
  lead: '根据「家长买这类课时，真正想解决什么问题」，将 8 位访谈家长抽象成 4 类画像。',
  note: '本页聚焦类型定义与人群差异；具体策略与动作建议见「调研结论」。',
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
    representative: {
      title: '安徽合肥妈妈',
      region: '安徽合肥',
      grade: '一年级',
      role: '妈妈',
      snapshot: '给姐姐买高中物理时顺手加购；弟弟看到小学物理有兴趣就买了，不定义成硬性学习任务。',
      quote: '孩子喜欢学就学，多看一点总归有帮助。',
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
    representative: {
      title: '北京昌平爸爸',
      region: '北京昌平',
      grade: '三年级',
      role: '爸爸',
      snapshot: '文科背景，担心孩子未来被理科限制；选 NB 实验室等，是因为覆盖小学到高中、能连接未来学习路径。',
      quote: '学的东西未来要有用，理科启蒙要和未来学科挂钩，不能只是玩一玩。',
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
    representative: {
      title: '北京顺义妈妈',
      region: '北京顺义',
      grade: '二年级',
      role: '妈妈',
      snapshot: '报过多门实验课；认可洋葱的系统讲解，但更看重赛先生「老师边讲边带做」的真人实验体验。',
      quote: '实验肯定是重要的，理科的话肯定就是说，实践出真知。',
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
    representative: {
      title: '河南郑州妈妈',
      region: '河南郑州',
      grade: '四年级',
      role: '妈妈',
      snapshot: '郑州科学要期中期末考；买来主要是查漏补缺，但四上部分内容找不到，使用频率因此降低。',
      quote: '洋葱主要用来复习知识点，这个单元需要考试，或者某个知识点有明显缺漏需要看。',
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
