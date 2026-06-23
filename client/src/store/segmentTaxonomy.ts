// 定性访谈「片段标签」三级体系（用户原声 → 语义切片 → 标准标签）
// 一级维度只有三个：APP体验 / 课程体验 / 购买决策。
// 每个片段：一个一级维度 + 一个主标签 + 若干辅助标签 + 研究价值。
// 无法归入词典的明确价值片段，使用 待归类_xxx 标签并标注 pendingNew。

export type DimensionId = 'app' | 'course' | 'buy';
export type ResearchValue = 'high' | 'medium' | 'low';

export interface DimensionDef {
  id: DimensionId;
  name: string;
  short: string;
  desc: string;
}

export interface LabelDef {
  id: string;
  dimension: DimensionId;
  name: string;        // 标签全名，如 APP_功能使用
  short: string;       // 简短名，如 功能使用
  definition: string;
}

export const DIMENSIONS: DimensionDef[] = [
  {
    id: 'app',
    name: 'APP体验',
    short: 'APP',
    desc: '用户如何接触、使用、操作 APP，以及使用过程中的顺畅、困难、习惯与监督体验。',
  },
  {
    id: 'course',
    name: '课程体验',
    short: '课程',
    desc: '用户对课程内容、老师讲解、难度、孩子反应、学习效果与课程匹配度的感受。',
  },
  {
    id: 'buy',
    name: '购买决策',
    short: '购买',
    desc: '为什么买/不买、怎么知道产品、被什么打动、有什么顾虑、如何比较、谁做决定、是否续费。',
  },
];

export const LABELS: LabelDef[] = [
  // 【APP体验】
  { id: 'app_first_contact', dimension: 'app', name: 'APP_初次接触', short: '初次接触', definition: '第一次接触、下载、打开、注册、登录、进入 APP 的过程。' },
  { id: 'app_feature_use', dimension: 'app', name: 'APP_功能使用', short: '功能使用', definition: '具体使用了 APP 的某个功能（看课、搜索、收藏、倍速、作业、报告、提醒等）。' },
  { id: 'app_operation', dimension: 'app', name: 'APP_操作体验', short: '操作体验', definition: '对 APP 操作是否方便、清楚、顺手的感受。' },
  { id: 'app_problem', dimension: 'app', name: 'APP_问题阻碍', short: '问题阻碍', definition: '使用 APP 时遇到的技术问题或明显障碍（卡顿、闪退、登录不上、投屏失败等）。' },
  { id: 'app_parent_supervision', dimension: 'app', name: 'APP_家长监督', short: '家长监督', definition: '家长通过 APP 查看、管理、监督孩子学习。' },
  { id: 'app_usage_habit', dimension: 'app', name: 'APP_使用习惯', short: '使用习惯', definition: '用户或孩子是否形成固定的使用习惯。' },
  { id: 'app_improvement', dimension: 'app', name: 'APP_改进建议', short: '改进建议', definition: '对 APP 功能、页面、操作、提醒、数据等方面的改进建议。' },

  // 【课程体验】
  { id: 'course_content_type', dimension: 'course', name: '课程_内容类型', short: '内容类型', definition: '课程的类别、科目、学习阶段或内容方向。' },
  { id: 'course_teaching', dimension: 'course', name: '课程_讲解体验', short: '讲解体验', definition: '老师讲得怎么样、表达是否清楚、节奏是否合适。' },
  { id: 'course_difficulty', dimension: 'course', name: '课程_难度感受', short: '难度感受', definition: '课程难度是否适合孩子。' },
  { id: 'course_child_reaction', dimension: 'course', name: '课程_孩子反应', short: '孩子反应', definition: '孩子对课程的兴趣、参与度、主动性与情绪反应。' },
  { id: 'course_effect', dimension: 'course', name: '课程_学习效果', short: '学习效果', definition: '课程带来的学习结果或能力变化。' },
  { id: 'course_match', dimension: 'course', name: '课程_课程匹配', short: '课程匹配', definition: '课程与孩子年级、水平、教材、学校进度是否匹配。' },
  { id: 'course_persistence', dimension: 'course', name: '课程_坚持情况', short: '坚持情况', definition: '孩子是否能持续学习课程。' },
  { id: 'course_improvement', dimension: 'course', name: '课程_改进建议', short: '改进建议', definition: '对课程内容、老师、难度、节奏、题目、体系提出建议。' },

  // 【购买决策】
  { id: 'buy_need_trigger', dimension: 'buy', name: '购买_需求触发', short: '需求触发', definition: '产生购买需求的原因或背景。' },
  { id: 'buy_info_source', dimension: 'buy', name: '购买_信息来源', short: '信息来源', definition: '从哪里知道这个产品或课程。' },
  { id: 'buy_trust', dimension: 'buy', name: '购买_信任背书', short: '信任背书', definition: '为什么相信这个产品靠谱。' },
  { id: 'buy_price', dimension: 'buy', name: '购买_价格判断', short: '价格判断', definition: '对价格贵不贵、值不值、划不划算的判断。' },
  { id: 'buy_family_package', dimension: 'buy', name: '购买_套餐家庭包', short: '套餐家庭包', definition: '围绕家庭包、多个孩子、长期套餐、多人共用产生的购买判断。' },
  { id: 'buy_competitor', dimension: 'buy', name: '购买_竞品对比', short: '竞品对比', definition: '把该产品和其他课程、APP、线下班、免费资源进行比较。' },
  { id: 'buy_decision_role', dimension: 'buy', name: '购买_决策角色', short: '决策角色', definition: '谁参与或影响了购买决定。' },
  { id: 'buy_concern', dimension: 'buy', name: '购买_顾虑阻碍', short: '顾虑阻碍', definition: '购买前后的担心、犹豫、不买的原因。' },
  { id: 'buy_conversion', dimension: 'buy', name: '购买_转化节点', short: '转化节点', definition: '最后决定购买的关键时刻或关键原因。' },
  { id: 'buy_renewal', dimension: 'buy', name: '购买_续费意愿', short: '续费意愿', definition: '是否愿意继续买、续费、推荐或复购。' },
];

export const LABEL_BY_ID: Record<string, LabelDef> = Object.fromEntries(
  LABELS.map((l) => [l.id, l]),
);

export const DIMENSION_BY_ID: Record<DimensionId, DimensionDef> = Object.fromEntries(
  DIMENSIONS.map((d) => [d.id, d]),
) as Record<DimensionId, DimensionDef>;

export const RESEARCH_VALUE_META: Record<ResearchValue, { label: string; color: string; bg: string }> = {
  high: { label: '高价值', color: '#b91c1c', bg: '#fef2f2' },
  medium: { label: '中价值', color: '#b45309', bg: '#fffbeb' },
  low: { label: '低价值', color: '#475569', bg: '#f1f5f9' },
};

// 一个语义切片：用户原话 + 一级维度 + 主标签 + 辅助标签 + 研究价值（+ 录音）
export interface LabeledSegment {
  id: string;
  project: 'jiatingbao' | 'physics';
  projectName: string;
  respondent: string;        // 例：用户8 · 广东湛江
  dimension: DimensionId;
  primaryLabel: string;      // LabelDef.id 或 待归类_xxx
  auxLabels: string[];       // LabelDef.id 或 待归类_xxx
  researchValue: ResearchValue;
  quote: string;             // 用户原话（口语，未润色）
  clipUrl?: string;
  startTime?: number;
  duration?: number;
  pendingNew?: boolean;      // 主标签为待归类_xxx 时为 true
  pendingReason?: string;    // 新增理由
}

/** 主标签为「待归类_xxx」时返回简短显示名，否则返回词典短名。 */
export function labelShortName(labelId: string): string {
  if (labelId.startsWith('待归类_')) return labelId;
  return LABEL_BY_ID[labelId]?.short ?? labelId;
}

export function labelFullName(labelId: string): string {
  if (labelId.startsWith('待归类_')) return labelId;
  return LABEL_BY_ID[labelId]?.name ?? labelId;
}

export function dimensionOfLabel(labelId: string): DimensionId | undefined {
  return LABEL_BY_ID[labelId]?.dimension;
}
