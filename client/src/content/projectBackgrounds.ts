import fromPrimaryBriefing from './from-primary-brief.md?raw';
import jisuanyingBriefing from './jisuanying-brief.md?raw';
import jiatingbaoBriefing from './jiatingbao-brief.md?raw';
import paisouBriefing from './paisou-brief.md?raw';

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
    resources: [
      {
        label: '小学物理调研背景',
        description: '从小学物理项目的研究背景、业务问题与研究边界',
        url: 'https://guanghe.feishu.cn/wiki/S7NrwiHD8iQhkFkzR50cs54bnMf',
      },
      ...pendingResources,
    ],
  },
  jisuanying_project: {
    title: '计算营产品定位与增长调研',
    eyebrow: 'PROJECT CONTEXT',
    summary: '从真实家长的需求与认知出发，理解计算营在购买决策中的位置，并验证产品定位、服务价值与增长模型。',
    markdown: jisuanyingBriefing,
    resources: pendingResources,
  },
  jiatingbao_project: {
    title: '家庭包用户调研背景',
    eyebrow: 'PROJECT CONTEXT',
    summary: '从家庭包上线后的真实转化差异出发，解释不同年级组合为什么买、为什么不买，以及哪些人群和话术值得在暑促中放大。',
    markdown: jiatingbaoBriefing,
    resources: [
      {
        label: '研究方案',
        description: '家庭包用户调研的业务问题、人群优先级、研究假设与访谈提纲',
        url: 'https://guanghe.feishu.cn/wiki/SW7FwtXejisq42kR241cdjuPnAd',
      },
      ...pendingResources,
    ],
  },
  paisou_project: {
    title: '拍搜产品全流程调研背景',
    eyebrow: 'PROJECT CONTEXT',
    summary: '围绕 AI 拍题 4.0 的产品迭代目标，从真实使用场景、竞品生态、定量验证和营销表达出发，判断洋葱拍搜如何从“给答案工具”走向“校内提分型学习入口”。',
    markdown: paisouBriefing,
    resources: [
      {
        label: '拍搜调研洞察简报',
        description: '研究背景、议题拆解、阶段性洞察和产品优先级建议',
        url: 'https://guanghe.feishu.cn/wiki/PWA5wZGawiTvS2kK6aGcrBP5nWc',
      },
      {
        label: '拍搜 AI 竞品分析',
        description: '洋葱与竞品在准、快、懂、透等维度的走查对比',
        url: 'https://guanghe.feishu.cn/wiki/FTjywFGSKihXOMkRprEckkR9ncd',
      },
      {
        label: '竞品与营销总结',
        description: '产品生态位、功能优化方向和营销人设策略',
        url: 'https://guanghe.feishu.cn/wiki/Hex5wwKLXiM6RHkSgn7clVyQneV',
      },
      {
        label: '拍搜定量报告',
        description: '学段、时间紧迫度、成绩差异和获得感的问卷验证',
        url: 'https://guanghe.feishu.cn/docx/HXiQdmdf0ovWcdx9v0oc5f8tn0c',
      },
      {
        label: '学生拍搜 JTBD 访谈',
        description: '8 位学生用户在作业、复习、纠错和核对场景中的任务拆解',
        url: 'https://guanghe.feishu.cn/wiki/LjhIwF4wHiIBZgk56h0cnyTRnXe',
      },
    ],
  },
};

export const DEFAULT_PROJECT_BACKGROUND: ProjectBackgroundConfig = {
  title: '项目调研背景',
  eyebrow: 'PROJECT CONTEXT',
  summary: '说明项目缘起、研究目标与研究边界。',
  markdown: '# 项目调研背景\n\n当前项目尚未补充调研背景。',
  resources: pendingResources,
};
