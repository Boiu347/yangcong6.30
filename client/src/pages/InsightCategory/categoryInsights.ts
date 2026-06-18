import type { Project, Sentiment, VOCItem } from '../../types/voc';
import { JTB_INTERVIEWS } from '../../store/jiatingbaoData';

export type InsightCategorySlug = 'app-experience' | 'course-experience' | 'purchase-decision';
export type UserRole = '家长' | '学生' | '其他';

export const QUALITATIVE_RESEARCH_SLUGS: InsightCategorySlug[] = [
  'app-experience',
  'course-experience',
  'purchase-decision',
];

export interface InsightCategoryConfig {
  slug: InsightCategorySlug;
  title: string;
  eyebrow: string;
  description: string;
  color: string;
  tint: string;
  emptyHint: string;
  keywords: string[];
  dimensions: string[];
  subKeywords: string[];
}

export interface CategoryQuote {
  id: string;
  text: string;
  quoteSummary?: string;
  projectId: string;
  projectName: string;
  respondent?: string;
  sourceName: string;
  sourceId: string;
  sentiment: Sentiment;
  dimension: string;
  subCategory: string;
  subSubCategory: string;
  userRole: UserRole;
  schoolLevel?: string;
  grade?: string;
  gender?: string;
}

export interface CategoryInsightData {
  quotes: CategoryQuote[];
  totalQuotes: number;
  totalProjects: number;
  totalSources: number;
  sentimentCounts: Record<Sentiment, number>;
}

export interface CategoryExecutiveSummary {
  verdict: string;
  opportunity: string;
  risk: string;
  action: string;
}

export interface DirectionDefinition {
  id: string;
  title: string;
  businessImpact: string;
  findings: string[];
  action: string;
  keywords: string[];
}

export interface BusinessDirection {
  id: string;
  title: string;
  businessImpact: string;
  findings: string[];
  action: string;
  quotes: CategoryQuote[];
  representativeQuotes: CategoryQuote[];
  projectNames: string[];
  sourceCount: number;
  sentimentCounts: Record<Sentiment, number>;
}

export const INSIGHT_CATEGORY_CONFIGS: Record<InsightCategorySlug, InsightCategoryConfig> = {
  'app-experience': {
    slug: 'app-experience',
    title: 'APP体验',
    eyebrow: 'Product Experience',
    description: '聚合功能、交互、导航、服务闭环和使用场景反馈，帮助判断产品体验里的真实摩擦点。',
    color: '#3b82f6',
    tint: '#eff6ff',
    emptyHint: '当前项目数据里还没有匹配到 APP 体验相关原声。',
    dimensions: ['产品体验', '产品体验与服务价值'],
    subKeywords: ['功能', '交互', '导航', '入口', '使用', '服务', '反馈', '闭环', 'AI', '动画', '题库', '报告', '设备', '账号', '效率', '体验'],
    keywords: ['APP', 'app', '功能', '交互', '导航', '入口', '使用', '服务', 'AI', '动画', '反馈', '错题', '设备', '账号', '体验', '不好用', '方便'],
  },
  'course-experience': {
    slug: 'course-experience',
    title: '课程体验',
    eyebrow: 'Course Experience',
    description: '聚合课程内容、难度、同步、知识覆盖、学习方式和理解效果，看到课程本身是否承接需求。',
    color: '#22a06b',
    tint: '#ecfdf5',
    emptyHint: '当前项目数据里还没有匹配到课程体验相关原声。',
    dimensions: ['启蒙认知', '产品体验', '产品体验与服务价值', '用户分层与需求'],
    subKeywords: ['课程', '内容', '难度', '同步', '知识', '题型', '练习', '复习', '预习', '实验', '动画', '启蒙', '理解', '学习', '体系', '校内'],
    keywords: ['课程', '内容', '难度', '同步', '知识点', '题型', '练习', '复习', '预习', '实验', '动画', '启蒙', '理解', '学习', '校内', '提前学', '体系'],
  },
  'purchase-decision': {
    slug: 'purchase-decision',
    title: '购买决策',
    eyebrow: 'Purchase Decision',
    description: '聚合购买动机、价格价值、信任背书、续费升单和未购顾虑，定位影响成交的关键证据。',
    color: '#e65532',
    tint: '#fff1ed',
    emptyHint: '当前项目数据里还没有匹配到购买决策相关原声。',
    dimensions: ['购买决策', '续费诊断', '已购', '未购'],
    subKeywords: ['购买', '续费', '升单', '首购', '价格', '价值', '信任', '顾虑', '转化', '套餐', '付费', '效果', '推荐', '决策'],
    keywords: ['购买', '续费', '升单', '首购', '价格', '价值', '信任', '顾虑', '转化', '套餐', '付费', '效果', '推荐', '下单', '买', '未购'],
  },
};

export const CATEGORY_EXECUTIVE_SUMMARIES: Record<InsightCategorySlug, CategoryExecutiveSummary> = {
  'app-experience': {
    verdict: 'APP体验的核心不是“功能够不够”，而是用户能不能快速找到、持续用起来，并看到学习闭环的价值。',
    opportunity: '把 AI 定制、错题、学情报告和入口可见性讲清楚，可以直接提升使用率和续费信心。',
    risk: '入口难找、权益不透明、账号设备限制会让用户把问题归因为产品不好用，而不是自己没用起来。',
    action: '优先梳理关键路径入口、学情反馈和多孩账号体验，把高频功能包装成可感知的闭环。',
  },
  'course-experience': {
    verdict: '课程体验的关键在于“是否承接真实学习场景”：同步、难度、覆盖和理解方式比单纯内容量更重要。',
    opportunity: '动画、实验、即时互动能放大理解价值，适合做成课程差异化卖点。',
    risk: '如果知识覆盖和校内同步感不足，用户会认为课程有趣但不够刚需，使用频次会被压低。',
    action: '围绕校内同步、难度分层和知识覆盖补齐表达，让课程从“可看”变成“该用”。',
  },
  'purchase-decision': {
    verdict: '购买决策不是单点价格问题，而是价值锚点、效果信心和家庭场景是否被说透。',
    opportunity: '多孩家庭、长期学习规划和学习闭环是高客单转化的核心机会。',
    risk: '效果不可见、怕浪费、重复收费感会拖慢成交，也会影响续费和升单。',
    action: '销售和产品要共同输出“为什么值、怎么用、怎么验证效果”的成交证据链。',
  },
};

export const DIRECTION_DEFINITIONS: Record<InsightCategorySlug, DirectionDefinition[]> = {
  'app-experience': [
    {
      id: 'entry-visibility',
      title: '入口和路径要足够直观，否则用户会把“找不到”理解成“产品不好用”',
      businessImpact: '影响激活、使用频次和新功能渗透。',
      findings: ['用户对入口可见性非常敏感。', '功能藏得深会削弱购买后的价值感。', '关键学习路径需要像数学同步课一样明确。'],
      action: '把核心课程、AI 定制、错题和学情报告做成稳定入口，并在销售交付时同步说明。',
      keywords: ['入口', '导航', '找', '板块', '首页', '明显', '可见', '点不开'],
    },
    {
      id: 'interaction-feedback',
      title: '互动反馈是用户愿意持续使用的主要抓手',
      businessImpact: '影响孩子注意力、家长感知效果和课程复用率。',
      findings: ['即时对错反馈能提升专注度。', '题库、错题和针对性练习让视频不只是“看完”。', '互动比纯讲解更容易形成学习闭环。'],
      action: '把“讲解-练习-反馈-复习”的闭环作为体验亮点前置展示。',
      keywords: ['互动', '反馈', '错题', '题库', '练习', '对错', '针对', '复习', '点', '选'],
    },
    {
      id: 'ai-service-loop',
      title: 'AI 和学情报告必须承担“省心感”，不能只停留在功能名',
      businessImpact: '影响家长是否相信产品能替代人工监督。',
      findings: ['家长需要看到薄弱点和下一步安排。', 'AI 定制班、学情报告和错题订正能形成省心理由。', '服务价值如果不可见，会被认为只是视频加题。'],
      action: '强化周度报告、薄弱点诊断和下一步学习建议，让服务价值可见。',
      keywords: ['AI', '学情', '报告', '诊断', '薄弱', '错题本', '定制', '省心', '老师', '服务'],
    },
    {
      id: 'account-device',
      title: '多孩家庭的账号和设备限制会直接影响家庭包价值感',
      businessImpact: '影响家庭包成交、升单和售后满意度。',
      findings: ['多孩同时学习是家庭包高频场景。', '学情分账和设备并发影响家长对“家庭权益”的理解。', '账号限制容易成为未消解痛点。'],
      action: '把多孩并发、家庭组和学情分账作为家庭包体验优先级。',
      keywords: ['设备', '账号', '同时', '家庭组', '分开', '学情报告', '锁账号', '多孩', '冲突'],
    },
  ],
  'course-experience': [
    {
      id: 'school-sync',
      title: '校内同步感决定课程是不是刚需',
      businessImpact: '影响使用频次、家长推荐理由和课程续用。',
      findings: ['用户会按课内单元和知识点去找内容。', '不同步会降低使用率。', '数学同步课常被用作参照物。'],
      action: '课程目录和销售话术都要明确“对应哪个年级、哪个单元、哪个学习场景”。',
      keywords: ['同步', '校内', '课本', '单元', '数学', '知识点', '对标', '课堂'],
    },
    {
      id: 'difficulty-layering',
      title: '难度分层要清楚，否则提前学和补基础用户都会犹豫',
      businessImpact: '影响人群匹配、退费风险和课程满意度。',
      findings: ['有用户觉得太简单，也有用户需要打基础。', '基础、进阶、挑战的定位需要更直观。', '不同成绩段不能用同一套表达。'],
      action: '在课程页和交付中明确基础/进阶/挑战的适配人群与学习目标。',
      keywords: ['简单', '难度', '基础', '进阶', '挑战', '拔高', '补差', '提前学', '分层'],
    },
    {
      id: 'animation-understanding',
      title: '动画和实验的价值在于帮助理解，而不是制造热闹',
      businessImpact: '影响课程差异化、孩子兴趣和家长付费理由。',
      findings: ['动画能把抽象知识具体化。', '实验和直观呈现能降低理解门槛。', '用户认可“理解替代死记硬背”。'],
      action: '把动画/实验包装成“理解效率”和“科学思维”的证据，不只说形式有趣。',
      keywords: ['动画', '实验', '直观', '理解', '抽象', '具体', '兴趣', '现象', '思维'],
    },
    {
      id: 'content-coverage',
      title: '知识覆盖和内容丰富度决定课程能不能长期用',
      businessImpact: '影响课程复购、长期会员价值和口碑。',
      findings: ['用户会关注知识点是否完整。', '内容少会导致预期落差。', '长期有效和持续更新是购买理由的一部分。'],
      action: '补齐知识覆盖表达，并对更新节奏给出明确承诺。',
      keywords: ['覆盖', '丰富', '内容', '更新', '知识点', '长期', '永久', '完整', '不够'],
    },
  ],
  'purchase-decision': [
    {
      id: 'value-price',
      title: '用户不是单纯嫌贵，而是在找“值不值”的参照物',
      businessImpact: '影响定价接受度、套餐设计和销售解释成本。',
      findings: ['用户会拿私教、线下班、教辅和已有会员做比较。', '重复收费感会削弱价值判断。', '长期套餐需要讲清未来成本。'],
      action: '销售话术先建立价值参照，再谈价格和优惠。',
      keywords: ['价格', '贵', '便宜', '值', '划算', '套餐', '会员', '重复', '成本', '私教', '线下'],
    },
    {
      id: 'effect-risk',
      title: '效果不可见和怕浪费，是阻断成交的最大顾虑',
      businessImpact: '影响成交周期、未购转化和续费升单。',
      findings: ['家长担心孩子坚持不下来。', '是否提分、是否有效是未购关键阻力。', '需要可验证的短期反馈。'],
      action: '建立试用期、阶段报告和效果验证节点，降低一次性决策压力。',
      keywords: ['效果', '提分', '浪费', '坚持', '不学', '顾虑', '验证', '退', '担心'],
    },
    {
      id: 'trust-trigger',
      title: '信任来源决定用户是否愿意跨过高客单门槛',
      businessImpact: '影响获客渠道、转化素材和顾问角色设计。',
      findings: ['熟人、博主和教育规划老师能降低信任成本。', '孩子体验后的正反馈会推动成交。', '客观推荐比硬推销更有效。'],
      action: '沉淀可信推荐、试用反馈和客观对比材料，减少销售单点说服。',
      keywords: ['信任', '推荐', '介绍', '博主', '老师', '规划', '体验', '销售', '客观', '朋友'],
    },
    {
      id: 'family-decision',
      title: '多孩家庭买的不是多个账号，而是未来几年学习安排的确定性',
      businessImpact: '影响家庭包主卖点、升单策略和权益设计。',
      findings: ['大孩需求常是成交锚点，小孩权益合理化高客单。', '长期规划感和全科覆盖会放大家庭包价值。', '多孩并发限制会反向伤害价值感。'],
      action: '家庭包销售要围绕主次孩子、长期规划和多孩权益设计，而不是简单强调人数更多。',
      keywords: ['多孩', '两个孩子', '大宝', '小宝', '家庭包', '升单', '首购', '续购', '规划', '全科', '长期', '6年'],
    },
  ],
};

const SENTIMENTS: Sentiment[] = ['positive', 'neutral', 'negative'];

function emptySentimentCounts(): Record<Sentiment, number> {
  return { positive: 0, neutral: 0, negative: 0 };
}

function includesAny(value: string | undefined, keywords: string[]): boolean {
  const text = (value ?? '').toLowerCase();
  return keywords.some((keyword) => text.includes(keyword.toLowerCase()));
}

function inferUserRole(respondent?: string): UserRole {
  if (!respondent) return '家长';
  if (/学生|孩子|小朋友/.test(respondent)) return '学生';
  if (/妈妈|爸爸|家长|父|母/.test(respondent)) return '家长';
  return '家长';
}

function inferGrade(sourceName: string, respondent?: string): string | undefined {
  const text = `${sourceName} ${respondent ?? ''}`;
  const match = text.match(/(幼儿园|中班|大班|[一二三四五六七八九]年级|初一|初二|初三|高一|高二|高三|\d年级)/);
  return match?.[0];
}

function isVocMatched(voc: VOCItem, config: InsightCategoryConfig, projectId: string): boolean {
  const dimensionMatched = config.dimensions.some((dimension) => voc.dimension.includes(dimension));
  const subMatched = includesAny(voc.subDimension, config.subKeywords);
  const textMatched = includesAny(voc.text, config.keywords);

  if (projectId === 'jiatingbao_project') {
    return config.slug === 'purchase-decision'
      ? dimensionMatched || subMatched || textMatched
      : textMatched || subMatched;
  }

  return dimensionMatched || subMatched || textMatched;
}

function toCategoryQuote(voc: VOCItem, project: Project): CategoryQuote {
  return {
    id: voc.id,
    text: voc.text,
    quoteSummary: voc.subDimension,
    projectId: project.id,
    projectName: project.name,
    respondent: voc.respondent,
    sourceName: voc.sourceFileName,
    sourceId: voc.sourceFileId,
    sentiment: voc.sentiment,
    dimension: voc.dimension,
    subCategory: project.name,
    subSubCategory: voc.subDimension || voc.dimension || '未分类',
    userRole: inferUserRole(voc.respondent),
    grade: inferGrade(voc.sourceFileName, voc.respondent),
  };
}

function buildFamilyDecisionQuotes(project: Project): CategoryQuote[] {
  return JTB_INTERVIEWS.flatMap((interview) => {
    const sourceName = `用户${interview.seq} · ${interview.parent} · ${interview.region} · ${interview.combo}`;
    const insightQuotes = interview.insights
      .filter((insight) => insight.quote)
      .map((insight, index) => ({
        id: `${interview.id}_insight_${index + 1}`,
        text: insight.quote as string,
        quoteSummary: insight.detail,
        subSubCategory: insight.title,
      }));

    const originalQuotes = interview.quotes.map((quote, index) => ({
      id: `${interview.id}_quote_${index + 1}`,
      text: quote,
      quoteSummary: interview.purchaseType || interview.status,
      subSubCategory: interview.purchaseType || interview.status,
    }));

    return [...insightQuotes, ...originalQuotes].map((quote) => ({
      id: quote.id,
      text: quote.text,
      quoteSummary: quote.quoteSummary,
      projectId: project.id,
      projectName: project.name,
      respondent: `${interview.parent}（${interview.combo}）`,
      sourceName,
      sourceId: interview.id,
      sentiment: interview.status === '未购' ? 'negative' : 'neutral',
      dimension: interview.status,
      subCategory: project.name,
      subSubCategory: quote.subSubCategory,
      userRole: '家长',
      grade: interview.combo,
    }));
  });
}

function uniqueQuotes(quotes: CategoryQuote[]): CategoryQuote[] {
  const seen = new Set<string>();
  return quotes.filter((quote) => {
    const key = `${quote.projectId}::${quote.text}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function countSentiment(quotes: CategoryQuote[]): Record<Sentiment, number> {
  const counts = emptySentimentCounts();
  quotes.forEach((quote) => {
    counts[quote.sentiment] += 1;
  });
  return counts;
}

export function isQualitativeResearchProject(project: Project): boolean {
  return project.methods?.includes('定性调研') ?? false;
}

export function buildCategoryInsightData(
  projects: Project[],
  slug: InsightCategorySlug,
): CategoryInsightData {
  const config = INSIGHT_CATEGORY_CONFIGS[slug];
  const qualitativeProjects = projects.filter(isQualitativeResearchProject);
  const quotes = uniqueQuotes(
    qualitativeProjects.flatMap((project) => {
      const vocQuotes = project.files
        .filter((file) => file.status === 'ready')
        .flatMap((file) => file.vocList)
        .filter((voc) => isVocMatched(voc, config, project.id))
        .map((voc) => toCategoryQuote(voc, project));

      const familyQuotes =
        project.id === 'jiatingbao_project' && slug === 'purchase-decision'
          ? buildFamilyDecisionQuotes(project)
          : [];

      return [...vocQuotes, ...familyQuotes];
    }),
  ).sort((a, b) => a.projectName.localeCompare(b.projectName, 'zh-Hans-CN') || a.subSubCategory.localeCompare(b.subSubCategory, 'zh-Hans-CN'));

  return {
    quotes,
    totalQuotes: quotes.length,
    totalProjects: new Set(quotes.map((quote) => quote.projectId)).size,
    totalSources: new Set(quotes.map((quote) => quote.sourceId)).size,
    sentimentCounts: countSentiment(quotes),
  };
}

export function countBy<T extends string>(items: CategoryQuote[], getKey: (item: CategoryQuote) => T): Array<{ name: T; count: number }> {
  const counts = new Map<T, number>();
  items.forEach((item) => {
    const key = getKey(item);
    counts.set(key, (counts.get(key) ?? 0) + 1);
  });
  return [...counts.entries()]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name, 'zh-Hans-CN'));
}

export { SENTIMENTS };
