// 家庭包「定性洞察」页数据
// 维度：用户需求 / 购买决策 / 产品体验（课程体验 + APP体验）。
// 叙事（维度结论 / AI 概况 / AI 总结）为人工提炼；
// 「代表原声」取自 JIATINGBAO_SEGMENTS 的逐字原话（口语未润色）。
//
// ⚠️ 关键：切片库的标签只表达「话题」（如 课程_学习效果），不含情感/意图。
// 而展示侧的子维度往往要求特定极性——「优势好评」要正向、「劣势差评」要负向、
// 「需求/效果预期」要的是期望诉求。若只按话题标签挂载，会把中性描述、负面吐槽、
// 需求期望一并塞进「优势好评」，导致原声与维度对不上。
// 因此这里增加一层轻量「情感/意图分类」（classifyQuote），按子维度声明的 accept 过滤并重新路由：
//   - 优势好评 ← 体验类话题中判为正向(pos)的原声
//   - 劣势差评 ← 问题/改进话题 + 体验类话题中判为负向(neg)的原声
//   - 对课程的需求 / 效果预期 ← 课程话题中判为需求(wish)的原声
// 分类为启发式（针对 ASR 口语文本），覆盖大多数情况，个别仍可能误判。
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

/** 原声的情感/意图分类 */
type QuoteSentiment = 'pos' | 'neg' | 'wish' | 'neutral';

/** 一个原声来源：某些主标签下的片段，可选地仅保留特定情感/意图 */
interface EvidenceSource {
  /** 取这些主标签下的片段 */
  labels: string[];
  /** 仅保留命中这些情感/意图的原声；缺省=不过滤（话题本身已足够定义该子维度） */
  accept?: QuoteSentiment[];
}

interface SubDimDef {
  name: string;
  summary: string;
  cardSummary: string;
  /** 原声来源（可多组，按情感重新路由）；不限条数，全部展示 */
  sources: EvidenceSource[];
}

interface DimDef {
  key: string;
  label: string;
  color: string;
  verdict: string;
  subs: SubDimDef[];
}

// ── 情感/意图分类（启发式，针对 ASR 口语文本）──────────────────────────────────
// 优先级：需求/期望(wish) → 负向(neg) → 正向(pos) → 中性(neutral)。
// 「正向词被否定」（如「不是很喜欢」「没有帮助」）会被改判为负向。
const WISH_MARKERS = [
  '希望', '最好', '能不能', '可不可以', '可不可', '建议', '要是', '应该要', '期望', '期待',
  '诉求', '多一点', '多做', '再做多', '可以去', '要不要', '想要', '需要能', '能够再', '增加',
  '加一个', '加个', '合在一起', '可以再', '改进', '补一下', '补好', '一定要', '必须', '更看重',
  '看重', '在意', '但愿', '巴不得',
];
const NEG_MARKERS = [
  '没有用', '没什么用', '没用', '不行', '效果一般', '一般般', '没有进步', '没有很明显', '没有明显',
  '不喜欢', '不想看', '不想学', '不愿意', '不会主动', '不主动', '听不懂', '看不懂', '反感', '抵触',
  '跟不上', '赶不上', '落下', '落了', '太难', '不适合', '差一点', '差一截', '差了一点', '不理想',
  '达不到', '不太好', '没那么好', '没办法', '无聊', '不好看', '粗糙', '耗时', '意义不大', '起不到',
  '退课', '没有什么感觉', '一般吧',
];
const POS_MARKERS = [
  '不错', '挺好', '很好', '蛮好', '好看', '喜欢', '愿意', '有趣', '有意思', '有帮助', '有效果',
  '效果好', '有进步', '有提升', '讲得好', '讲的好', '道理好', '听得懂', '看得懂', '能看懂', '感兴趣',
  '有兴趣', '形象', '搞笑', '轻松', '吸引', '好玩', '认可',
];
const NEGATORS_BEFORE = ['不', '没', '别', '非', '谈不', '说不'];

const includesAny = (text: string, list: string[]) => list.some((m) => text.includes(m));

/** 某正向词的所有出现处是否都被前置否定词修饰（如「不是很喜欢」「没有帮助」） */
function positiveAllNegated(text: string, marker: string): boolean {
  let idx = 0;
  while ((idx = text.indexOf(marker, idx)) !== -1) {
    const pre = text.slice(Math.max(0, idx - 3), idx);
    if (!NEGATORS_BEFORE.some((n) => pre.includes(n))) return false;
    idx += marker.length;
  }
  return true;
}

function classifyQuote(text: string): QuoteSentiment {
  if (includesAny(text, WISH_MARKERS)) return 'wish';
  if (includesAny(text, NEG_MARKERS)) return 'neg';
  const posHits = POS_MARKERS.filter((m) => text.includes(m));
  if (posHits.length) return posHits.every((m) => positiveAllNegated(text, m)) ? 'neg' : 'pos';
  return 'neutral';
}

// ── 代表原声挑选：按多来源 + 情感过滤路由，取符合条件的「全部」逐字原声，不限条数 ──────
// 排序：研究价值高→低；并先排出「每位受访者最多 N 条」的多样化前排，再补齐其余全部。
const VALUE_ORDER: Record<string, number> = { high: 0, medium: 1, low: 2 };
const MIN_QUOTE_LEN = 10;
const PER_RESPONDENT_CAP = 2;

function pickEvidence(sources: EvidenceSource[]): FamilyEvidence[] {
  const matchesSource = (s: (typeof JIATINGBAO_SEGMENTS)[number]) =>
    sources.some(
      (src) =>
        src.labels.includes(s.primaryLabel) &&
        (!src.accept || src.accept.includes(classifyQuote(s.quote))),
    );

  const candidates = JIATINGBAO_SEGMENTS.filter(
    (s) => !!s.clipUrl && s.quote.trim().length >= MIN_QUOTE_LEN && matchesSource(s),
  ).sort((a, b) => (VALUE_ORDER[a.researchValue] ?? 9) - (VALUE_ORDER[b.researchValue] ?? 9));

  const seen = new Set<string>();
  const perRespondent = new Map<string, number>();
  const out: FamilyEvidence[] = [];

  const take = (capByRespondent: boolean) => {
    for (const s of candidates) {
      const q = s.quote.trim();
      if (seen.has(q)) continue;
      if (capByRespondent && (perRespondent.get(s.respondent) ?? 0) >= PER_RESPONDENT_CAP) continue;
      seen.add(q);
      perRespondent.set(s.respondent, (perRespondent.get(s.respondent) ?? 0) + 1);
      out.push({ text: s.quote, who: s.respondent, tag: labelShortName(s.primaryLabel) });
    }
  };

  // 不限条数：先排多样化前排，再补齐剩余全部原声
  take(true);
  take(false);
  return out;
}

// ── 维度与子维度定义（叙事人工提炼，原声自动挂载） ───────────────────────────
// 「体验类话题标签」：本身只表话题、不含极性，需配合情感过滤路由到好评/差评。
const EXPERIENCE_LABELS = [
  'course_teaching',
  'course_child_reaction',
  'course_effect',
  'course_content_type',
  'course_match',
  'app_feature_use',
];

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
        sources: [{ labels: ['buy_need_trigger'] }],
      },
      {
        name: '对课程的需求：同步与内容覆盖',
        summary:
          '家长普遍希望课程能对齐校内进度与教材，覆盖主科和薄弱环节；既要「同步」兜住校内，也要有适度拓展和提升，单纯课本搬运不够、只做拓展又怕脱节。',
        cardSummary:
          '需求落在「同步兜底 + 适度拓展」之间：既要贴合年级教材，又要有可感知的提升空间。',
        // 仅保留课程话题里「表达需求/期望」的原声，剔除中性的科目/进度描述。
        sources: [{ labels: ['course_match', 'course_content_type'], accept: ['wish'] }],
      },
      {
        name: '对「学到位」的效果预期',
        summary:
          '家长对效果的期待是能力与习惯层面的「学到位」：理解了、会用了、能坚持，而不是刷对几道题；他们希望能看到孩子真的吸收了知识，这也是后续是否认可、是否续费的隐性标准。',
        cardSummary:
          '效果标准偏「理解与内化」：能讲出来、能用起来、能持续，比一次正确率更被看重。',
        // 效果「预期」是期望诉求，剔除「实际效果好/差」的评价（那属于好评/差评）。
        sources: [{ labels: ['course_effect'], accept: ['wish'] }],
      },
    ],
  },
  {
    // 二级维度与小学物理「购买决策」完全一致：触达渠道 / 吸引卖点 / 购前预期 / 续费意愿
    key: 'buy',
    label: '购买决策',
    color: '#BF9455',
    verdict:
      '购买决策不是单点的价格问题，而是「在哪看到、被什么打动、买前怎么想、用后是否续费」的完整链路：家长算的是综合成本与长周期价值，成交往往发生在「强兴趣 + 强背书 + 划算」叠加的瞬间。',
    subs: [
      {
        name: '触达渠道：在哪看到的？',
        summary:
          '家长主要通过直播、公众号、老师与朋友推荐等渠道接触到洋葱，信息源的可信度直接决定了愿不愿意点进来进一步了解。',
        cardSummary: '决策入口高度依赖可信渠道：直播、熟人与老师推荐是最高频的触达方式。',
        sources: [{ labels: ['buy_info_source'] }],
      },
      {
        name: '吸引卖点：什么内容吸引促使购买？',
        summary:
          '真正促成下单的是「强兴趣 + 强背书 + 划算」的叠加：专家口碑、家庭包的多孩长周期价值与性价比，常在某个瞬间把犹豫变成付款。',
        cardSummary: '打动点是兴趣、背书与性价比的叠加，家庭包的长周期价值是核心卖点。',
        sources: [
          {
            labels: ['buy_conversion', 'buy_trust', 'buy_price', 'buy_family_package', 'buy_competitor'],
          },
        ],
      },
      {
        name: '购前预期：买前希望孩子怎么学？',
        summary:
          '购买往往由具体节点触发——升学衔接、校内同步、提前预习；家长买前已对「孩子要怎么学、学到什么程度」有预期，同时带着「怕浪费、怕坚持不下来」的顾虑。',
        cardSummary: '购前预期由真实学习节点驱动，并伴随「怕浪费、怕不能坚持」的顾虑。',
        sources: [{ labels: ['buy_need_trigger', 'buy_concern', 'buy_decision_role'] }],
      },
      {
        name: '续费意愿',
        summary:
          '是否续费、是否推荐，取决于家长有没有真切看到效果和孩子的坚持；效果可见、孩子愿意用，续费与口碑就水到渠成，反之则成为流失风险。',
        cardSummary: '续费由可见的效果与坚持决定，效果不可感是最大的流失风险。',
        sources: [{ labels: ['buy_renewal'] }],
      },
    ],
  },
  {
    // 二级维度与小学物理「产品体验」完全一致：使用场景 / 优势好评 / 劣势差评
    key: 'product',
    label: '产品体验',
    color: '#4BA69E',
    verdict:
      '产品体验决定课程从「可看」变成「该用」：在课后碎片场景里被使用，靠通俗讲解、动画与内容同步赢得好评，但难度系统性、内容查找与学习反馈缺失等问题，仍是被诟病和提改进建议最集中的地方。',
    subs: [
      {
        name: '使用场景',
        summary:
          '家长更多在课后、周末等碎片时间带着孩子使用；「全部开放、缺少每日目标和提醒」常导致使用断续，固定的使用习惯还没普遍建立。',
        cardSummary: '使用集中在课后碎片时间，缺少节奏牵引是养成习惯的主要障碍。',
        sources: [
          { labels: ['app_first_contact', 'app_usage_habit', 'course_persistence', 'app_operation'] },
        ],
      },
      {
        name: '优势好评',
        summary:
          '「讲得孩子能听懂、像听故事」是被反复认可的核心优势；动画形式、贴合年级的内容与「看—练」闭环，让孩子愿意看、看得进去。',
        cardSummary: '讲解通俗 + 动画 + 内容同步是核心好评点，孩子愿意看、看得进去是最强的价值信号。',
        // 只收体验类话题里「判为正向」的原声，剔除中性描述、需求与负面吐槽。
        sources: [{ labels: EXPERIENCE_LABELS, accept: ['pos'] }],
      },
      {
        name: '劣势差评',
        summary:
          '主要槽点集中在难度与系统性、找不到对应内容、缺少学习数据反馈等；这些问题会削弱使用动机，也是家长提改进建议最集中的地方。',
        cardSummary: '难度/系统性、内容查找与学习反馈缺失是主要槽点与改进诉求。',
        // 问题/改进话题全收；难度只收负面/期望；并把散落在体验类话题里的负面原声归位到差评。
        sources: [
          { labels: ['app_problem'] },
          { labels: ['app_improvement', 'course_improvement'] },
          { labels: ['course_difficulty'], accept: ['neg', 'wish'] },
          { labels: EXPERIENCE_LABELS, accept: ['neg'] },
        ],
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
    evidence: pickEvidence(s.sources),
  })),
}));
