// 家庭包「定性洞察」页数据
// 维度：用户需求 / 购买决策 / 产品体验（课程体验 + APP体验）。
// 叙事（维度结论 / AI 概况 / AI 总结）为人工提炼；
// 「代表原声」均取自 JIATINGBAO_SEGMENTS 的逐字原话（口语未润色），并按标签自动挑选高价值片段，
// 音频在渲染时由 clipsForQuote(原声) 命中切片。
import { JIATINGBAO_SEGMENTS } from './jiatingbaoSegments';
import { labelShortName } from './segmentTaxonomy';

export interface FamilyEvidence {
  /** 用户逐字原话（与切片库 quote 完全一致，用于命中音频） */
  text: string;
  /** 来源受访者，例：用户1 · 广东广州 · 黄妈妈 */
  who: string;
  /** 标签短名，例：需求触发 */
  tag?: string;
}

export interface FamilySubDimension {
  name: string;
  /** AI 概况：子维度整体结论 */
  summary: string;
  /** AI 总结：卡片内的一句话洞察 */
  cardSummary: string;
  evidence: FamilyEvidence[];
}

export interface FamilyInsightDimension {
  key: string;
  label: string;
  color: string;
  /** 维度结论：置顶执行摘要 */
  verdict: string;
  subDimensions: FamilySubDimension[];
}

interface SubDimDef {
  name: string;
  summary: string;
  cardSummary: string;
  /** 取这些主标签下的片段作为代表原声 */
  labels: string[];
  max?: number;
}

interface DimDef {
  key: string;
  label: string;
  color: string;
  verdict: string;
  subs: SubDimDef[];
}

// ── 代表原声挑选：按主标签 + 研究价值排序，尽量跨受访者多样化 ──────────────
const VALUE_ORDER: Record<string, number> = { high: 0, medium: 1, low: 2 };
const MIN_QUOTE_LEN = 10;
const PER_RESPONDENT_CAP = 2;

function pickEvidence(labels: string[], max: number): FamilyEvidence[] {
  const wanted = new Set(labels);
  const candidates = JIATINGBAO_SEGMENTS.filter(
    (s) =>
      wanted.has(s.primaryLabel) &&
      !!s.clipUrl &&
      s.quote.trim().length >= MIN_QUOTE_LEN,
  ).sort((a, b) => (VALUE_ORDER[a.researchValue] ?? 9) - (VALUE_ORDER[b.researchValue] ?? 9));

  const seen = new Set<string>();
  const perRespondent = new Map<string, number>();
  const out: FamilyEvidence[] = [];

  const take = (capByRespondent: boolean) => {
    for (const s of candidates) {
      if (out.length >= max) break;
      const q = s.quote.trim();
      if (seen.has(q)) continue;
      if (capByRespondent && (perRespondent.get(s.respondent) ?? 0) >= PER_RESPONDENT_CAP) continue;
      seen.add(q);
      perRespondent.set(s.respondent, (perRespondent.get(s.respondent) ?? 0) + 1);
      out.push({ text: s.quote, who: s.respondent, tag: labelShortName(s.primaryLabel) });
    }
  };

  // 先按「每位受访者最多 N 条」保证多样性，不足再放开补齐
  take(true);
  if (out.length < max) take(false);
  return out;
}

// ── 维度与子维度定义（叙事人工提炼，原声自动挂载） ───────────────────────────
const DIM_DEFS: DimDef[] = [
  {
    key: 'need',
    label: '用户需求',
    color: '#5B7BBF',
    verdict:
      '家庭包用户买的是「把孩子未来几年的学习确定性一次定下来」：大孩往往有升学/同步的紧迫刚需，小孩则是打基础、提前学的长期诉求；家长更在意「学得到位、学得久、学得省心」，而不是当下某一次的分数。',
    subs: [
      {
        name: '孩子学情与需求触发',
        summary:
          '需求大多由具体节点触发——小升初衔接、校内同步吃力、想提前预习初中，或是大孩验证有效后再给小孩补单；需求往往是「全科 + 长周期」的组合，而非单科单点。',
        cardSummary:
          '购买动机由真实学习节点驱动：升学衔接、校内同步与提前预习是三个最高频的触发点。',
        labels: ['buy_need_trigger'],
        max: 6,
      },
      {
        name: '对课程的需求：同步与内容覆盖',
        summary:
          '家长普遍希望课程能对齐校内进度与教材，覆盖主科和薄弱环节；既要「同步」兜住校内，也要有适度拓展和提升，单纯课本搬运不够、只做拓展又怕脱节。',
        cardSummary:
          '需求落在「同步兜底 + 适度拓展」之间：既要贴合年级教材，又要有可感知的提升空间。',
        labels: ['course_match', 'course_content_type'],
        max: 6,
      },
      {
        name: '对「学到位」的效果预期',
        summary:
          '家长对效果的期待是能力与习惯层面的「学到位」：理解了、会用了、能坚持，而不是刷对几道题；他们希望能看到孩子真的吸收了知识，这也是后续是否认可、是否续费的隐性标准。',
        cardSummary:
          '效果标准偏「理解与内化」：能讲出来、能用起来、能持续，比一次正确率更被看重。',
        labels: ['course_effect'],
        max: 6,
      },
    ],
  },
  {
    key: 'buy',
    label: '购买决策',
    color: '#BF9455',
    verdict:
      '购买决策不是单点的价格问题，而是「价值锚点、效果信心、家庭场景」是否被说透：家长算的是综合成本与未来 6 年的价值感，最担心的是「买了浪费、孩子不能坚持」，多孩家庭则在「主次需求 + 性价比」之间权衡。',
    subs: [
      {
        name: '价值与价格判断',
        summary:
          '家长算的不是标价，而是「综合成本 / 单孩单年成本 / 未来还要再花的钱」；当家庭包能把多科、多孩、多年的开销一次锁定时，「贵」会被「划算」覆盖。',
        cardSummary: '价格判断的本质是性价比账：把长周期、多孩成本摊薄后才形成「值」的感知。',
        labels: ['buy_price'],
        max: 6,
      },
      {
        name: '效果顾虑与未买阻力',
        summary:
          '最普遍的顾虑是「怕浪费、怕孩子坚持不下来」；其次是担心内容不够系统、点状学习、与现有资源重复，这些顾虑若不被消解就会卡在临门一脚。',
        cardSummary: '「怕浪费 + 怕不能坚持」是共性阻力，消解顾虑比强调卖点更影响成交。',
        labels: ['buy_concern'],
        max: 6,
      },
      {
        name: '信息来源与信任背书',
        summary:
          '家长多通过直播、公众号、老师/朋友推荐等渠道接触产品，信任来自专家背书、口碑与「看得懂的讲解」；信息源的可信度直接决定了愿不愿意点进来了解。',
        cardSummary: '决策入口高度依赖可信渠道与背书：直播、熟人推荐与专家口碑是主要信任来源。',
        labels: ['buy_info_source', 'buy_trust'],
        max: 6,
      },
      {
        name: '多孩家庭包与决策角色',
        summary:
          '多孩家庭的需求有主次，家长更偏向「让好的更好」，常在升学等节点转化；决策多由妈妈主导，但会参考孩子兴趣和另一半意见，家庭包的「经验复制 + 6 年价值」是核心卖点。',
        cardSummary: '多孩决策遵循「主次 + 全科长周期」逻辑，家庭包价值在于经验复制与长期锁定。',
        labels: ['buy_family_package', 'buy_decision_role'],
        max: 6,
      },
      {
        name: '竞品对比、转化与续费',
        summary:
          '家长会把洋葱与其他网课、线下班、免费资源横向比较，成交往往发生在「强兴趣 + 强背书」叠加的瞬间；续费与推荐则取决于是否真切看到效果和坚持。',
        cardSummary: '转化靠「兴趣 + 背书」临门一脚，续费靠可见的效果与坚持反馈。',
        labels: ['buy_competitor', 'buy_conversion', 'buy_renewal'],
        max: 6,
      },
    ],
  },
  {
    key: 'product',
    label: '产品体验',
    color: '#4BA69E',
    verdict:
      '产品体验决定课程从「可看」变成「该用」：课程要承接校内同步、合适的难度与讲解，APP 要让孩子愿意用、家长看得到学习闭环；动画、AI、错题这些亮点只有落到「理解效率」和「省心感」上才被真正认可。',
    subs: [
      {
        name: '课程内容与校内同步',
        summary:
          '家长看重内容是否贴合年级、教材与校内进度；当课程能对应到具体单元知识点时认可度最高，反之「找不到对应内容」会直接削弱使用动机。',
        cardSummary: '内容价值锚定在「同步可查」：能对应到校内知识点的课程最被信任和高频使用。',
        labels: ['course_content_type', 'course_match'],
        max: 6,
      },
      {
        name: '讲解体验与难度感受',
        summary:
          '「讲得孩子能听懂、像听故事」是洋葱被反复认可的核心；难度需要分层适配，过简单会失去兴趣，过难又会畏难，合适的梯度才能撑住长期学习。',
        cardSummary: '讲解「听得懂、不枯燥」是核心优势，难度需分层以避免过简或畏难。',
        labels: ['course_teaching', 'course_difficulty'],
        max: 6,
      },
      {
        name: '孩子反应与坚持情况',
        summary:
          '孩子是否主动看、看完是否兴奋分享，是家长判断产品价值的直接信号；但「全部开放、缺少每日目标和提醒」常导致难以坚持，留存需要节奏化的牵引。',
        cardSummary: '孩子的主动性是价值信号，但缺少目标与提醒会让坚持成为最大留存缺口。',
        labels: ['course_child_reaction', 'course_persistence'],
        max: 6,
      },
      {
        name: 'APP 功能与操作体验',
        summary:
          '动画、AI 搜索、答题闭环等功能是吸引点，孩子能看懂、能形成「看—练」小闭环时体验最好；操作顺手、入口清晰也影响家长和孩子是否愿意持续打开。',
        cardSummary: '动画与「看—练闭环」是体验亮点，顺手的操作与清晰入口决定打开频率。',
        labels: ['app_feature_use', 'app_operation', 'app_first_contact', 'app_usage_habit'],
        max: 6,
      },
      {
        name: '家长监督与问题阻碍',
        summary:
          '家长希望通过 APP 看到孩子「学了什么、学了多少、记住什么」，这种反馈是省心感的来源；入口变动、找不到内容、缺少学习数据等问题会明显拉低体验与信任。',
        cardSummary: '家长要的是可见的学习反馈，入口/查找类问题与数据缺失最伤体验与信任。',
        labels: ['app_parent_supervision', 'app_problem', 'app_improvement'],
        max: 6,
      },
    ],
  },
];

export const FAMILY_INSIGHT_DIMENSIONS: FamilyInsightDimension[] = DIM_DEFS.map((d) => ({
  key: d.key,
  label: d.label,
  color: d.color,
  verdict: d.verdict,
  subDimensions: d.subs.map((s) => ({
    name: s.name,
    summary: s.summary,
    cardSummary: s.cardSummary,
    evidence: pickEvidence(s.labels, s.max ?? 6),
  })),
}));
