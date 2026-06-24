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
import type { KnowledgeChunk } from './types';

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
        route: '/projects/jiatingbao_project/qualitative',
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
        route: '/projects/jiatingbao_project/qualitative',
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
      route: '/projects/jiatingbao_project/qualitative',
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

  const seen = new Set<string>();
  return chunks.filter((chunk) => {
    const key = `${chunk.route}::${chunk.title}::${chunk.excerpt}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}
