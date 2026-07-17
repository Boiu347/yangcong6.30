import type { Project } from '../../types/voc';
import { DEFAULT_PORTRAITS } from '../../store/portraitDefaults';
import { JTB_INTERVIEWS } from '../../store/jiatingbaoData';
import { JIATINGBAO_SEGMENTS } from '../../store/jiatingbaoSegments';
import { labelFullName } from '../../store/segmentTaxonomy';
import {
  buildBusinessDirections,
  buildCategoryInsightData,
  INSIGHT_CATEGORY_CONFIGS,
  QUALITATIVE_RESEARCH_SLUGS,
  type InsightCategorySlug,
} from '../../pages/InsightCategory/categoryInsights';
import { coreConclusionSections } from '../../pages/CoreConclusions/coreConclusionsData';
import { jiatingbaoConclusionSections } from '../../pages/JiatingbaoConclusions/jiatingbaoConclusionsData';
import { reportConclusions } from '../../pages/Summary/FromPrimaryMergedReport';
import { nextStepPrimaries } from '../../pages/Summary/nextStepData';
import type { KnowledgeChunk } from './types';

// 「从小学物理」项目下的调研结论 / 核心结论页面路由
const FROM_PRIMARY_PROJECT_ID = 'default_project';
const SUMMARY_ROUTE = `/projects/${FROM_PRIMARY_PROJECT_ID}/summary`;
const CORE_CONCLUSIONS_ROUTE = `/projects/${FROM_PRIMARY_PROJECT_ID}/core-conclusions`;

const RESEARCH_DIMENSION_LABELS: Record<string, string> = {
  core: '核心洞察',
  purchase: '购买决策',
  experience: '买后体验',
  barrier: '购买卡点',
  brand: '品牌差异',
  next: '下一步建议',
};

function compact(text: string, max = 180) {
  const clean = text.replace(/\s+/g, ' ').trim();
  return clean.length > max ? `${clean.slice(0, max)}...` : clean;
}

function addChunk(chunks: KnowledgeChunk[], chunk: Omit<KnowledgeChunk, 'excerpt'> & { excerpt?: string }) {
  const text = chunk.text.replace(/\s+/g, ' ').trim();
  if (!text) return;
  chunks.push({
    ...chunk,
    text,
    excerpt: chunk.excerpt ?? compact(text),
    keywords: [...new Set(chunk.keywords.filter(Boolean))],
  });
}

function projectRoute(projectId: string, fallback = 'summary') {
  return `/projects/${projectId}/${fallback}`;
}

function directionRoute(slug: InsightCategorySlug, topic?: string) {
  return topic ? `/qualitative-research/${slug}/${topic}` : `/qualitative-research/${slug}`;
}

export function buildSiteKnowledge(projects: Project[]): KnowledgeChunk[] {
  const chunks: KnowledgeChunk[] = [];

  projects.forEach((project) => {
    addChunk(chunks, {
      id: `project_${project.id}`,
      type: 'project',
      title: project.name,
      text: [
        project.name,
        project.category,
        project.methods?.join('、'),
        project.team?.join('、'),
        project.summaryData?.coreFindings?.join('。'),
        project.summaryData?.actionItems?.join('。'),
      ].filter(Boolean).join('。'),
      source: '项目库',
      projectName: project.name,
      route: projectRoute(project.id),
      keywords: [project.name, project.category ?? '', ...(project.methods ?? [])],
    });

    project.files
      .filter((file) => file.status === 'ready')
      .forEach((file) => {
        file.vocList.forEach((voc, index) => {
          addChunk(chunks, {
            id: `voc_${project.id}_${file.id}_${voc.id || index}`,
            type: 'quote',
            title: `${project.name} · ${voc.subDimension || voc.dimension || '用户原声'}`,
            text: `${voc.respondent ?? ''} ${voc.dimension ?? ''} ${voc.subDimension ?? ''} ${voc.text}`,
            excerpt: compact(voc.text),
            source: file.name,
            projectName: project.name,
            route: projectRoute(project.id, 'qualitative'),
            keywords: [project.name, file.name, voc.dimension, voc.subDimension ?? '', voc.respondent ?? ''],
          });
        });
      });
  });

  QUALITATIVE_RESEARCH_SLUGS.forEach((slug) => {
    const config = INSIGHT_CATEGORY_CONFIGS[slug];
    const data = buildCategoryInsightData(projects, slug);
    const directions = buildBusinessDirections(slug, data.quotes);

    addChunk(chunks, {
      id: `qualitative_${slug}`,
      type: 'qualitative',
      title: config.title,
      text: `${config.title}。${config.description}。原声 ${data.totalQuotes} 条，项目 ${data.totalProjects} 个。`,
      source: '定性调研',
      route: directionRoute(slug),
      keywords: [config.title, ...config.keywords],
    });

    directions.forEach((direction) => {
      addChunk(chunks, {
        id: `direction_${slug}_${direction.id}`,
        type: 'qualitative',
        title: direction.title,
        text: [
          direction.title,
          direction.businessImpact,
          direction.findings.join('。'),
          direction.action,
          direction.representativeQuotes.map((quote) => quote.text).join('。'),
        ].join('。'),
        source: `${config.title} · 业务维度`,
        route: directionRoute(slug, direction.id),
        keywords: [config.title, direction.title, ...direction.keywords, ...direction.projectNames],
      });

      direction.quotes.slice(0, 80).forEach((quote, index) => {
        addChunk(chunks, {
          id: `direction_quote_${slug}_${direction.id}_${quote.id}_${index}`,
          type: 'quote',
          title: `${direction.title} · ${quote.respondent || quote.sourceName}`,
          text: `${quote.projectName} ${quote.respondent ?? ''} ${quote.sourceName} ${quote.subSubCategory} ${quote.text}`,
          excerpt: compact(quote.text),
          source: quote.sourceName,
          projectName: quote.projectName,
          route: directionRoute(slug, direction.id),
          keywords: [config.title, direction.title, quote.projectName, quote.subSubCategory, quote.respondent ?? ''],
        });
      });
    });
  });

  JTB_INTERVIEWS.forEach((interview) => {
    const base = `用户${interview.seq} ${interview.parent} ${interview.combo} ${interview.region} ${interview.status} ${interview.purchaseType}`;
    interview.insights.forEach((insight, index) => {
      addChunk(chunks, {
        id: `jtb_insight_${interview.id}_${index}`,
        type: 'family_interview',
        title: `家庭包访谈 · 用户${interview.seq} · ${insight.title}`,
        text: `${base} ${insight.title} ${insight.detail} ${insight.quote ?? ''}`,
        excerpt: compact(insight.quote || insight.detail),
        source: `用户${interview.seq}访谈纪要`,
        projectName: '洋葱家庭包用户调研',
        route: '/projects/jiatingbao_project/core-conclusions',
        keywords: ['家庭包', interview.status, interview.purchaseType, interview.combo, insight.title],
      });
    });
    interview.quotes.forEach((quote, index) => {
      addChunk(chunks, {
        id: `jtb_quote_${interview.id}_${index}`,
        type: 'family_interview',
        title: `家庭包用户原声 · 用户${interview.seq}`,
        text: `${base} ${quote}`,
        excerpt: compact(quote),
        source: `用户${interview.seq}访谈纪要`,
        projectName: '洋葱家庭包用户调研',
        route: '/projects/jiatingbao_project/core-conclusions',
        keywords: ['家庭包', interview.status, interview.purchaseType, interview.combo],
      });
    });
  });

  JIATINGBAO_SEGMENTS.forEach((segment) => {
    addChunk(chunks, {
      id: `jtb_segment_${segment.id}`,
      type: 'family_interview',
      title: `家庭包片段 · ${labelFullName(segment.primaryLabel)}`,
      text: `${segment.projectName} ${segment.respondent} ${labelFullName(segment.primaryLabel)} ${segment.quote}`,
      excerpt: compact(segment.quote),
      source: segment.respondent,
      projectName: segment.projectName,
      route: '/projects/jiatingbao_project/core-conclusions',
      keywords: ['家庭包', labelFullName(segment.primaryLabel), segment.respondent],
    });
  });

  const portraitData = DEFAULT_PORTRAITS.default_project;
  portraitData?.personas.forEach((persona) => {
    addChunk(chunks, {
      id: `profile_${persona.id}`,
      type: 'profile',
      title: persona.name,
      text: [
        persona.name,
        persona.stage,
        persona.representativeUser,
        persona.definition,
        persona.coreJudgment,
        persona.goals?.join('。'),
        persona.painPoints?.join('。'),
        persona.usageScenarios?.join('。'),
        persona.valuePerception?.join('。'),
        persona.paymentOrChurn?.join('。'),
        persona.evidenceQuotes?.join('。'),
      ].filter(Boolean).join('。'),
      source: persona.sourceReport || portraitData.source,
      route: '/profile',
      keywords: [persona.name, persona.stage ?? '', persona.representativeUser ?? '', ...(persona.painPoints ?? [])],
    });
  });

  addChunk(chunks, {
    id: 'learning_analysis',
    type: 'learning',
    title: '逐年级学习痛点洞察',
    text: '学情分析包含学前到初中的逐年级学习痛点、小低小高初中阶段差异、兴趣启蒙、习惯养成、作业效率、抽象理解、错题提效、小升初衔接、压轴题和备考压力等内容。',
    source: '学情分析',
    route: '/learning-analysis',
    keywords: ['学情分析', '学习痛点', '小低', '小高', '初中', '错题', '备考', '习惯'],
  });

  // ── 调研结论页：各维度结论（含核心结论、建议行动） ──────────────────────────
  reportConclusions.forEach((conclusion) => {
    const dimensionLabel = RESEARCH_DIMENSION_LABELS[conclusion.dimension] ?? '调研结论';
    addChunk(chunks, {
      id: `research_conclusion_${conclusion.id}`,
      type: 'conclusion',
      title: `调研结论 · ${conclusion.title}`,
      text: [
        conclusion.title,
        conclusion.insight,
        conclusion.conclusion,
        conclusion.conclusions.join('。'),
        conclusion.actions.join('。'),
        conclusion.evidenceNote,
      ].filter(Boolean).join('。'),
      excerpt: compact(conclusion.insight || conclusion.conclusion),
      source: `调研结论 · ${dimensionLabel}`,
      projectName: '从小学物理售卖策略调研',
      route: SUMMARY_ROUTE,
      keywords: ['调研结论', '洞察总览', dimensionLabel, conclusion.title, '结论', '建议'],
    });
  });

  // ── 调研结论页：下一步建议（方向 + 二级动作） ──────────────────────────────
  nextStepPrimaries.forEach((primary) => {
    addChunk(chunks, {
      id: `research_next_${primary.id}`,
      type: 'conclusion',
      title: `下一步建议 · ${primary.title}`,
      text: [
        primary.title,
        primary.summary,
        primary.insight,
        primary.conclusion,
        primary.actions.join('。'),
        primary.secondaries.map((s) => `${s.title}：${s.action}。${s.points.join('。')}`).join('。'),
      ].filter(Boolean).join('。'),
      excerpt: compact(primary.summary || primary.insight),
      source: '调研结论 · 下一步建议',
      projectName: '从小学物理售卖策略调研',
      route: SUMMARY_ROUTE,
      keywords: ['下一步建议', '行动建议', '策略', primary.title, '结论'],
    });
  });

  // ── 核心结论页：三大板块（成交原因 / 未成交卡点 / 产品体验） ────────────────
  coreConclusionSections.forEach((section) => {
    section.mains.forEach((main) => {
      const pointsText = main.subs
        .flatMap((sub) => [sub.title, ...sub.points.map((point) => `${point.label ? `${point.label}：` : ''}${point.text}`)])
        .filter(Boolean)
        .join('。');
      const quotesText = main.subs
        .flatMap((sub) => sub.points.flatMap((point) => (point.quotes ?? []).map((quote) => quote.text)))
        .filter(Boolean)
        .join('。');
      addChunk(chunks, {
        id: `core_conclusion_${section.id}_${main.id}`,
        type: 'conclusion',
        title: `核心结论 · ${section.label} · ${main.title}`,
        text: [main.title, main.summary, main.insight, pointsText, quotesText, main.evidenceNote]
          .filter(Boolean)
          .join('。'),
        excerpt: compact(main.summary || main.insight),
        source: `核心结论 · ${section.label}`,
        projectName: '从小学物理售卖策略调研',
        route: CORE_CONCLUSIONS_ROUTE,
        keywords: ['核心结论', section.label, main.title, '结论', '成交', '卡点', '体验'],
      });
    });
  });

  // ── 家庭包「核心结论」页：六大板块（核心结论/购买动机/关键顾虑/成立原因/放大价值/推课逻辑） ──
  const JTB_CONCLUSIONS_ROUTE = '/projects/jiatingbao_project/core-conclusions';
  jiatingbaoConclusionSections.forEach((section) => {
    section.mains.forEach((main) => {
      const pointsText = main.subs
        .flatMap((sub) => [sub.title, ...sub.points.map((point) => `${point.label ? `${point.label}：` : ''}${point.text}`)])
        .filter(Boolean)
        .join('。');
      const quotesText = main.subs
        .flatMap((sub) => sub.points.flatMap((point) => (point.quotes ?? []).map((quote) => quote.text)))
        .filter(Boolean)
        .join('。');
      addChunk(chunks, {
        id: `jtb_conclusion_${section.id}_${main.id}`,
        type: 'conclusion',
        title: `家庭包调研结论 · ${section.label} · ${main.title}`,
        text: [main.title, main.summary, main.insight, pointsText, quotesText, main.evidenceNote]
          .filter(Boolean)
          .join('。'),
        excerpt: compact(main.summary || main.insight),
        source: `家庭包调研结论 · ${section.label}`,
        projectName: '洋葱家庭包用户调研',
        route: JTB_CONCLUSIONS_ROUTE,
        keywords: ['家庭包', '调研结论', section.label, main.title, '结论', '购买动机', '顾虑', '成交', '推课', '话术'],
      });
    });
  });

  const seen = new Set<string>();
  return chunks.filter((chunk) => {
    const key = `${chunk.route}::${chunk.title}::${chunk.excerpt}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}
