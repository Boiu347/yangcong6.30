import fromPrimaryBriefing from './from-primary-brief.md?raw';
import jisuanyingBriefing from './jisuanying-brief.md?raw';

export interface ProjectBackgroundResource {
  label: string;
  description: string;
  url?: string;
}

export interface ProjectBackgroundConfig {
  title: string;
  eyebrow: string;
  summary: string;
  markdown: string;
  resources: ProjectBackgroundResource[];
}

const pendingResources: ProjectBackgroundResource[] = [
  {
    label: '飞书会议纪要',
    description: '业务访谈、阶段讨论与关键决策记录',
  },
  {
    label: '智能纪要',
    description: '会议内容的结构化摘要与行动项整理',
  },
];

export const PROJECT_BACKGROUNDS: Record<string, ProjectBackgroundConfig> = {
  default_project: {
    title: '从小学系列售卖策略调研',
    eyebrow: 'PROJECT CONTEXT',
    summary: '从增长目标、研究问题与目标人群出发，说明本次研究为何启动、需要回答什么，以及研究覆盖的边界。',
    markdown: fromPrimaryBriefing,
    resources: pendingResources,
  },
  jisuanying_project: {
    title: '计算营产品定位与增长调研',
    eyebrow: 'PROJECT CONTEXT',
    summary: '从真实家长的需求与认知出发，理解计算营在购买决策中的位置，并验证产品定位、服务价值与增长模型。',
    markdown: jisuanyingBriefing,
    resources: pendingResources,
  },
};

export const DEFAULT_PROJECT_BACKGROUND: ProjectBackgroundConfig = {
  title: '项目调研背景',
  eyebrow: 'PROJECT CONTEXT',
  summary: '说明项目缘起、研究目标与研究边界。',
  markdown: '# 项目调研背景\n\n当前项目尚未补充调研背景。',
  resources: pendingResources,
};
