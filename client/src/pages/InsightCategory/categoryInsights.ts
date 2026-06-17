import type { Project, Sentiment, VOCItem } from '../../types/voc';
import { JTB_INTERVIEWS } from '../../store/jiatingbaoData';

export type InsightCategorySlug = 'app-experience' | 'course-experience' | 'purchase-decision';
export type UserRole = '家长' | '学生' | '其他';

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

export function buildCategoryInsightData(
  projects: Project[],
  slug: InsightCategorySlug,
): CategoryInsightData {
  const config = INSIGHT_CATEGORY_CONFIGS[slug];
  const quotes = uniqueQuotes(
    projects.flatMap((project) => {
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
