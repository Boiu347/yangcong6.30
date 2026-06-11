import type { Project, ProjectFile, VOCItem } from '../types/voc';

export const JISUANYING_FILE_DEFS = [
  { id: 'jisuanying_file_1', name: '计算营行业与用户调研整合版报告.md' },
  { id: 'jisuanying_file_2', name: '洋葱计算营调研2_用户需求和购买决策调研报告.md' },
  { id: 'jisuanying_file_3', name: '洋葱计算营调研1_产品定位与商业策略报告.md' },
  { id: 'jisuanying_file_4', name: '计算营商业模式和提升续费的阶段性思考.md' },
  { id: 'jisuanying_file_5', name: '3月期计算训练营满意度问卷.xlsx' },
] as const;

type VoiceSeed = Omit<VOCItem, 'id' | 'sourceFileId' | 'sourceFileName'> & {
  file: number;
};

const VOICE_SEEDS: VoiceSeed[] = [
  { file: 2, brand: '计算营', text: '这类计算训练营最好安排在假期，上课期间每天要看2-3集视频课，孩子时间压力太大。', sentiment: 'negative', dimension: '续费诊断', subDimension: '学期时间冲突' },
  { file: 2, brand: '计算营', text: '学期内比较耽误时间，假期会考虑。', sentiment: 'negative', dimension: '续费诊断', subDimension: '假期再学' },
  { file: 2, brand: '计算营', text: '孩子时间有限，排不开，寒暑假会继续报名。', sentiment: 'negative', dimension: '续费诊断', subDimension: '假期再学' },
  { file: 2, brand: '计算营', text: '希望可以改成更高效的题型讲解视频，课时不要那么长。', sentiment: 'negative', dimension: '产品体验与服务价值', subDimension: '任务效率' },
  { file: 2, brand: '计算营', text: '建议报二期的计算营，一期结束后二期开始之前，孩子们计算应该保温保持下去。', sentiment: 'positive', dimension: '续费诊断', subDimension: '跨期保温' },
  { file: 2, brand: '计算营', text: '每期结束后可否发3周的计算资料用来巩固所学资料。', sentiment: 'neutral', dimension: '续费诊断', subDimension: '跨期保温' },
  { file: 2, brand: '计算营', text: '一直在学习新的计算方式，希望一期结束了能给相应的复习题目进行巩固。', sentiment: 'neutral', dimension: '产品体验与服务价值', subDimension: '复习巩固' },
  { file: 2, brand: '计算营', text: '已经买了6年的阶段，计算营感觉跟本来买的比较重复，希望可以针对已经购买的提供专项服务。', sentiment: 'negative', dimension: '购买决策', subDimension: '会员重复收费感' },
  { file: 2, brand: '计算营', text: '价格太高，这本来就是洋葱里的内容，我们本来就有会员，自己也可以练，你们只是给了练习题、有群、有老师督促每天打卡，就收费300元。', sentiment: 'negative', dimension: '购买决策', subDimension: '价值与价格' },
  { file: 2, brand: '计算营', text: '一期学的没效果，又报一期试试。', sentiment: 'negative', dimension: '续费诊断', subDimension: '效果不可见' },
  { file: 2, brand: '计算营', text: '寒假营很喜欢，但日常学校作业太多。', sentiment: 'neutral', dimension: '续费诊断', subDimension: '产品节奏' },
  { file: 2, brand: '计算营', text: '想假期再上。', sentiment: 'neutral', dimension: '续费诊断', subDimension: '产品节奏' },
  { file: 2, brand: '计算营', text: '学了两期巩固一下，暑假接着来。', sentiment: 'positive', dimension: '续费诊断', subDimension: '季节性复购' },
  { file: 2, brand: '计算营', text: '对孩子来说有些简单。', sentiment: 'negative', dimension: '用户分层与需求', subDimension: '提前学用户' },
  { file: 2, brand: '计算营', text: '还没结束，先报一期看看效果。', sentiment: 'neutral', dimension: '购买决策', subDimension: '效果验证' },
  { file: 2, brand: '计算营', text: '孩子没坚持下来。', sentiment: 'negative', dimension: '续费诊断', subDimension: '坚持困难' },
  { file: 2, brand: '计算营', text: '助教老师作用很少，每天只是发过去夸一下、提醒一下。', sentiment: 'negative', dimension: '产品体验与服务价值', subDimension: '人工服务感知' },
  { file: 2, brand: '计算营', text: '已购买洋葱12年会员。', sentiment: 'neutral', dimension: '购买决策', subDimension: '存量会员' },
  { file: 2, brand: '计算营', text: '小学计算已经跟完，想学思维训练。', sentiment: 'positive', dimension: '续费诊断', subDimension: '下一步需求' },
  { file: 2, brand: '计算营', text: '小学计算营已上完，想学习思维课。', sentiment: 'positive', dimension: '续费诊断', subDimension: '下一步需求' },
  { file: 3, brand: '计算营', text: '一开始想着是让自己省点事，但是报了这个课后发现自己没有省太多事，因为你每天都要催促他学，毕竟是课外的孩子都不积极。', sentiment: 'negative', dimension: '产品体验与服务价值', subDimension: '省心承诺' },
  { file: 4, brand: '计算营', text: '我花钱买了一个营，但孩子主要还是自己看视频、自己练。', sentiment: 'negative', dimension: '产品体验与服务价值', subDimension: '服务价值感' },
  { file: 4, brand: '计算营', text: '假期再上。', sentiment: 'neutral', dimension: '续费诊断', subDimension: '产品节奏' },
  { file: 4, brand: '计算营', text: '学期内排不开。', sentiment: 'negative', dimension: '续费诊断', subDimension: '产品节奏' },
];

export const JISUANYING_VOCS: VOCItem[] = VOICE_SEEDS.map((seed, index) => {
  const file = JISUANYING_FILE_DEFS[seed.file - 1];
  return {
    id: `jisuanying_voc_${String(index + 1).padStart(3, '0')}`,
    brand: seed.brand,
    text: seed.text,
    sentiment: seed.sentiment,
    dimension: seed.dimension,
    subDimension: seed.subDimension,
    sourceFileId: file.id,
    sourceFileName: file.name,
  };
});

export const JISUANYING_EVIDENCE_SOURCE_MAP: Record<string, string> =
  Object.fromEntries(JISUANYING_VOCS.map((item) => [item.text, item.sourceFileName]));

const entry = (
  subtitle: string,
  sentiment: 'positive' | 'neutral' | 'negative',
  bullets: Array<{ text: string; tag: string; evidence: string[] }>,
) => ({
  brand: '计算营',
  vocCount: bullets.reduce((sum, item) => sum + item.evidence.length, 0),
  subtitle,
  sentiment,
  bullets,
});

export const JISUANYING_QUALITATIVE_DATA = {
  用户分层与需求: {
    dimension: '用户分层与需求',
    subDimensions: [
      {
        name: '需求不是单一补差，而是四类渐进结构',
        globalSummary: 'N=396 的问卷显示，补差只占 13.4%，巩固-夯实与巩固-提速合计占 61.4%。计算营的主市场不是“成绩差”，而是基础尚可但希望更稳、更快的人群。',
        brands: [
          entry('主产品应承接巩固人群，补差负责强痛点获客，提前学需要独立进阶路径', 'neutral', [
            {
              text: '巩固人群是规模中心：夯实型需要消除不稳定，提速型需要效率和精进。',
              tag: '分群-规模',
              evidence: [
                '31.3%｜巩固-夯实型，n=124，是规模最大的单一分群。',
                '30.1%｜巩固-提速型，n=119，与夯实型共同构成主力市场。',
                '13.4%｜补差型，n=53，痛感强但并不是最大市场。',
                '21.2%｜提前学型，n=84，更追求领先感、内容深度与体系。',
              ],
            },
            {
              text: '四类人群的目标不同，不能用同一套“补差提分”话术覆盖。',
              tag: '分群-目标',
              evidence: [
                '64.2%｜补差型首要目标是解决眼前问题。',
                '50.4%｜巩固-提速型选择提前准备，明显高于解决眼前问题的 11.8%。',
                '52.4%｜提前学型以拔高冲高分为核心目标。',
              ],
            },
          ]),
        ],
      },
      {
        name: '不同人群由不同场景触发',
        globalSummary: '问卷中的触发点呈现清晰梯度：补差用户由失分和速度问题触发，成绩较好的用户更偏向开学前规划。统一投放素材会同时损失两端人群。',
        brands: [
          entry('补差靠问题触发，提速与提前学靠计划触发，夯实型适合体验课承接', 'neutral', [
            {
              text: '补差用户应使用“失分、速度慢、家长辅导累”的问题型入口。',
              tag: '触发-补差',
              evidence: [
                '67.9%｜补差型因孩子速度慢或习惯差被触发。',
                '62.3%｜补差型因考试或测验计算失分明显被触发。',
                '56.3%｜已购补差用户因自己辅导耗费大量精力而购买。',
              ],
            },
            {
              text: '成绩较好的用户更适合开学前规划和专业背书，而不是问题恐吓。',
              tag: '触发-规划',
              evidence: [
                '51.3%｜巩固-提速型因“为下学期提前培优拔高”被触发。',
                '66.7%｜提前学型因“为下学期提前培优拔高”被触发。',
                '16.2%｜巩固-夯实型已购用户由免费体验课转化，为四类最高。',
              ],
            },
          ]),
        ],
      },
    ],
  },
  购买决策: {
    dimension: '购买决策',
    subDimensions: [
      {
        name: '价值判断与价格锚点',
        globalSummary: '价格阻力不能只解释为用户预算低。问卷显示，计算营仍被放在教辅的心理账户里比较，导致 300 元成为跨分群的共同上限。',
        brands: [
          entry('先改变品类参照，再讨论价格；单期低承诺比多期套餐更符合决策习惯', 'negative', [
            {
              text: '用户把计算营理解为教辅升级版时，会天然使用几十元题卡作为价格参照。',
              tag: '购买-价格锚点',
              evidence: [
                '33.6%｜家长将计算营认知为“练习册或题卡升级版”。',
                '11.4%｜家长将计算营认知为“高性价比的 1v1 替代”，这一心智尚未建立。',
                '59.7%｜价格题样本（N=347）中，高于 300 元就不购买。',
              ],
            },
            {
              text: '大多数潜客愿意先尝试一期开启关系，不愿一次承诺多期。',
              tag: '购买-承诺方式',
              evidence: [
                '36.9%｜购买意愿样本（N=287）愿意从百元单期开始尝试。',
                '33.4%｜购买意愿样本有些兴趣，但需要进一步了解。',
                '12.5%｜购买意愿样本可接受上千元多期课程，属于少数。',
              ],
            },
          ]),
        ],
      },
      {
        name: '购买的是内容、诊断反馈与省心的组合',
        globalSummary: '服务重要性排序表明，家长首先要求“练完马上知道错在哪、下一步练什么”，督促只是加分项。计算营应从卖课程内容转向卖诊断反馈闭环。',
        brands: [
          entry('诊断反馈是必须项，省心是差异化入口，单纯打卡不足以支撑价值', 'neutral', [
            {
              text: '家长对核心服务的排序高度集中在批改、诊断和精准练习。',
              tag: '购买-核心服务',
              evidence: [
                '90.2%｜认为即时批改、说明对错和错因是“必须有”。',
                '86.3%｜认为深度诊断、指出薄弱点是“必须有”。',
                '84.4%｜认为针对薄弱点推送专项练习是“必须有”。',
              ],
            },
            {
              text: '省心需求广泛存在，尤其适合作为教辅和 App 用户的转化理由。',
              tag: '购买-省心',
              evidence: [
                '48.4%｜使用现有付费方案的家长认为“需要一直盯，比较耗精力”。',
                '54.3%｜纸质教辅用户受“需要家长一直盯”困扰。',
                '45.6%｜计算 App 用户认为孩子难以坚持。',
              ],
            },
          ]),
        ],
      },
    ],
  },
  产品体验与服务价值: {
    dimension: '产品体验与服务价值',
    subDimensions: [
      {
        name: '诊断反馈闭环',
        globalSummary: 'N=315 的服务重要性评价显示，批改、诊断、算理讲解和专项推题均超过 84%。产品优先级应从“增加内容”转向“缩短发现问题到针对练习的反馈链路”。',
        brands: [
          entry('用户需要的是精准练习闭环，而不是更多题量或更频繁提醒', 'neutral', [
            {
              text: '核心服务需要共同构成“发现错误—解释原因—推送弱项—反馈进步”的闭环。',
              tag: '产品-反馈闭环',
              evidence: [
                '90.2%｜即时批改是服务重要性第一位。',
                '86.3%｜深度诊断是服务重要性第二位。',
                '84.8%｜算理动画课被认为必须有。',
                '84.4%｜针对薄弱点推送专项练习被认为必须有。',
              ],
            },
            {
              text: '现有方案的共同缺口不是题不够，而是效果和问题不可见。',
              tag: '产品-现有缺口',
              evidence: [
                '32.9%｜计算专项训练营用户仍认为练了效果不明显。',
                '27.8%｜计算专项训练营用户不清楚孩子具体问题在哪里。',
                '33.8%｜计算 App 用户认为练了效果不明显。',
              ],
            },
          ]),
        ],
      },
      {
        name: 'AI承担执行层，真人保留信任层',
        globalSummary: 'N=232 的 AI 接受度评价呈现明确边界：提醒、记录、推题适合自动化；诊断需要人工核实；答疑尤其是提前学用户仍需要真人。',
        brands: [
          entry('AI优先处理高频标准动作，老师集中在解释、答疑和关键节点确认', 'neutral', [
            {
              text: '提醒、记录和推题的 AI 接受度超过 75%，可作为产品自动化基础。',
              tag: 'AI-执行层',
              evidence: [
                '81.5%｜完全接受 AI 每天督促提醒学习。',
                '77.6%｜完全接受 AI 记录每天学习完成情况。',
                '76.7%｜完全接受 AI 针对薄弱点推送专项练习。',
                '70.3%｜完全接受 AI 生成每周或阶段学习报告。',
              ],
            },
            {
              text: '诊断和答疑涉及专业信任，不能因为技术可行就完全去人工化。',
              tag: 'AI-信任层',
              evidence: [
                '66.8%｜完全接受 AI 即时批改，适合“AI生成+人工核实”。',
                '64.2%｜完全接受 AI 深度诊断，仍需老师解释关键结论。',
                '51.7%｜完全接受 AI 答疑，明显低于其他服务。',
                '43.4%｜提前学用户完全接受 AI 答疑，为各分群最低。',
              ],
            },
          ]),
        ],
      },
    ],
  },
  续费诊断: {
    dimension: '续费诊断',
    subDimensions: [
      {
        name: '续报由下一阶段目标、坚持与可见效果共同驱动',
        globalSummary: '已续报用户 n=48 的选择率显示，“继续提前学”是第一驱动力；习惯、效果和服务共同决定是否留下。续报页应证明变化，并给出明确的下一阶段目标。',
        brands: [
          entry('续报不是一次促销动作，而是用户确认“有效且下一步仍值得学”', 'neutral', [
            {
              text: '续报用户首先需要新的学习目标，其次需要确认习惯和效果已经发生变化。',
              tag: '续报-驱动力',
              evidence: [
                '54.2%｜已续报用户因为想提前学下学期或高年级计算而续报。',
                '39.6%｜因为孩子能坚持、学习习惯变好而续报。',
                '37.5%｜因为孩子计算能力有明显提升而续报。',
                '37.5%｜因为老师或助教服务好、督促到位而续报。',
              ],
            },
            {
              text: '产品应把续报理由外化为“本期变化证明+下一期问题规划”。',
              tag: '续报-产品动作',
              evidence: [
                '44.0%｜调研样本中已续报；样本来自活跃私域，结果偏乐观。',
                '31.2%｜尚未续报但仍在考虑，说明决策窗口尚未关闭。',
                '约30%｜业务实际续报率，是更适合经营判断的基准。',
              ],
            },
          ]),
        ],
      },
      {
        name: '未续报不是一个问题，而是四类不同阻力',
        globalSummary: '未续报且有考虑或不打算续的用户 n=46，其选择率分别指向价值感、效果、坚持和需求完成。必须按原因分流，而不是统一发送优惠券。',
        brands: [
          entry('先识别用户属于“觉得不值、没效果、坚持不了、已经学完”中的哪一类，再给下一步', 'negative', [
            {
              text: '前三类阻力都需要产品证据和服务设计解决，不能仅靠降价。',
              tag: '未续报-阻力',
              evidence: [
                '28.3%｜未续报用户认为价格偏高、觉得不值。',
                '23.9%｜认为效果不明显，孩子计算没有改善。',
                '19.6%｜孩子不愿继续、坚持不下来。',
                '17.4%｜孩子计算问题已经解决，不再需要同类内容。',
              ],
            },
            {
              text: '“其他原因”主要由开放题解释为时间冲突，应作为产品节奏信号，而非精确比例结论。',
              tag: '未续报-时间',
              evidence: [
                '30.4%｜未续报用户选择“其他原因”，为选项第一位。',
                '解释边界｜开放题中时间冲突高频出现，但报告未提供“时间冲突”单独选择率。',
                '产品含义｜假期承接系统训练，学期中提供轻量保温与可暂停机制。',
              ],
            },
          ]),
        ],
      },
    ],
  },
};

export const JISUANYING_COMPETITIVE_DATA = {
  计算营: {
    brand: '计算营',
    groups: [
      {
        l1: '购买决策',
        l2: '价格与价值',
        sentiment: 'negative',
        items: [
          { l3: '诊断、督学和效果证明是支撑溢价的核心', sentiment: 'neutral', evidence: ['还没结束，先报一期看看效果。'] },
          { l3: '存量会员容易产生重复收费感', sentiment: 'negative', evidence: ['已经买了6年的阶段，计算营感觉跟本来买的比较重复，希望可以针对已经购买的提供专项服务。'] },
        ],
      },
      {
        l1: '产品体验',
        l2: '服务闭环',
        sentiment: 'negative',
        items: [
          { l3: '有真人督学基础，但服务容易停留在提醒层', sentiment: 'negative', evidence: ['助教老师作用很少，每天只是发过去夸一下、提醒一下。'] },
          { l3: '自主看课和练习占比高，省心感不足', sentiment: 'negative', evidence: ['一开始想着是让自己省点事，但是报了这个课后发现自己没有省太多事，因为你每天都要催促他学，毕竟是课外的孩子都不积极。'] },
        ],
      },
      {
        l1: '留存与复购',
        l2: '产品节奏',
        sentiment: 'negative',
        items: [
          { l3: '寒暑假适合系统训练，学期中适合轻量保温', sentiment: 'neutral', evidence: ['寒假营很喜欢，但日常学校作业太多。', '学了两期巩固一下，暑假接着来。'] },
          { l3: '结营后的复习与下一专题承接不足', sentiment: 'negative', evidence: ['每期结束后可否发3周的计算资料用来巩固所学资料。', '小学计算已经跟完，想学思维训练。'] },
        ],
      },
    ],
  },
  '教辅/题卡': {
    brand: '教辅/题卡',
    groups: [
      {
        l1: '购买决策',
        l2: '低价锚点',
        sentiment: 'positive',
        items: [
          { l3: '价格低、购买简单，是计算训练的默认替代方案', sentiment: 'positive', evidence: ['价格太高，这本来就是洋葱里的内容，我们本来就有会员，自己也可以练，你们只是给了练习题、有群、有老师督促每天打卡，就收费300元。'] },
        ],
      },
      {
        l1: '产品体验',
        l2: '反馈能力',
        sentiment: 'negative',
        items: [
          { l3: '有稳定题量，但缺少即时批改、错因诊断和督学', sentiment: 'negative', evidence: ['孩子没坚持下来。'] },
        ],
      },
      {
        l1: '留存与复购',
        l2: '坚持机制',
        sentiment: 'negative',
        items: [
          { l3: '高度依赖家长批改和监督，容易买而不用', sentiment: 'negative', evidence: ['一开始想着是让自己省点事，但是报了这个课后发现自己没有省太多事，因为你每天都要催促他学，毕竟是课外的孩子都不积极。'] },
        ],
      },
    ],
  },
  '计算App': {
    brand: '计算App',
    groups: [
      {
        l1: '购买决策',
        l2: '自动化体验',
        sentiment: 'positive',
        items: [
          { l3: '即时批改和低使用门槛具有吸引力', sentiment: 'positive', evidence: ['希望可以改成更高效的题型讲解视频，课时不要那么长。'] },
        ],
      },
      {
        l1: '产品体验',
        l2: '个性化与解释',
        sentiment: 'neutral',
        items: [
          { l3: '适合高频执行，但深度诊断和关键答疑仍需人工解释', sentiment: 'neutral', evidence: ['助教老师作用很少，每天只是发过去夸一下、提醒一下。'] },
        ],
      },
      {
        l1: '留存与复购',
        l2: '自律要求',
        sentiment: 'negative',
        items: [
          { l3: '刷题容易走形式，孩子难坚持、效果难被家长看见', sentiment: 'negative', evidence: ['一期学的没效果，又报一期试试。', '孩子没坚持下来。'] },
        ],
      },
    ],
  },
  综合数学班: {
    brand: '综合数学班',
    groups: [
      {
        l1: '购买决策',
        l2: '信任与替代',
        sentiment: 'positive',
        items: [
          { l3: '“有人教、有人管”认知成熟，付费心理门槛较低', sentiment: 'positive', evidence: ['还没结束，先报一期看看效果。'] },
        ],
      },
      {
        l1: '产品体验',
        l2: '专项深度',
        sentiment: 'negative',
        items: [
          { l3: '覆盖面广但计算专项诊断通常不够细', sentiment: 'negative', evidence: ['对孩子来说有些简单。'] },
        ],
      },
      {
        l1: '留存与复购',
        l2: '稳定关系',
        sentiment: 'positive',
        items: [
          { l3: '固定老师和长期班级关系有利于持续学习', sentiment: 'positive', evidence: ['学了两期巩固一下，暑假接着来。'] },
        ],
      },
    ],
  },
  '1v1私教': {
    brand: '1v1私教',
    groups: [
      {
        l1: '购买决策',
        l2: '高价高信任',
        sentiment: 'negative',
        items: [
          { l3: '诊断和陪练最深，但价格高、难规模化', sentiment: 'negative', evidence: ['价格太高，这本来就是洋葱里的内容，我们本来就有会员，自己也可以练，你们只是给了练习题、有群、有老师督促每天打卡，就收费300元。'] },
        ],
      },
      {
        l1: '产品体验',
        l2: '个性化服务',
        sentiment: 'positive',
        items: [
          { l3: '可基于真实错题制定计划并动态调整，服务感最强', sentiment: 'positive', evidence: ['小学计算已经跟完，想学思维训练。'] },
        ],
      },
      {
        l1: '留存与复购',
        l2: '服务依赖',
        sentiment: 'neutral',
        items: [
          { l3: '效果和关系黏性强，但高度依赖教师产能', sentiment: 'neutral', evidence: ['每期结束后可否发3周的计算资料用来巩固所学资料。'] },
        ],
      },
    ],
  },
};

export const JISUANYING_CROSS_BRAND_DATA = {
  conclusions: [
    { text: '**计算营的真正对手不是另一门计算课，而是低价教辅、综合数学班和家长自己盯学。** 差异化必须建立在诊断、专项推题、督学和效果证明的组合上。', color: '#5B7BBF' },
    { text: '**服务价值必须被看见。** 只做提醒打卡会被认为是“视频加题卡”；应把错因、速度、正确率、坚持变化和下一步建议持续展示给家长。', color: '#E07A6E' },
    { text: '**AI适合承担高频执行层，真人负责信任节点。** 提醒、记录、批改、推题可以自动化，关键诊断解释、答疑和续报沟通仍需人工确认。', color: '#4BA69E' },
    { text: '**留存口径应从月度续费升级为跨季复购与专题流转。** 学期中轻量巩固，寒暑假系统突破，计算完成后承接应用题和思维。', color: '#BF9455' },
  ],
  brandSummaries: {
    计算营: '优势是**内容、诊断、督学可以形成闭环**；短板是服务感、效果外化和学期节奏仍不足，老会员还有重复收费感。',
    '教辅/题卡': '优势是**便宜、题量稳定、购买简单**；短板是没有诊断和督学，家长需要承担批改与坚持成本。',
    '计算App': '优势是**即时批改、自动记录、低边际成本**；短板是深度解释与信任不足，孩子容易刷题走形式。',
    综合数学班: '优势是**有人教、长期关系稳定**；短板是计算专项诊断不够细，难针对错因精准训练。',
    '1v1私教': '优势是**个性化和服务密度最高**；短板是价格高、教师产能有限，难以规模化。',
  },
};

export function buildJisuanyingProject(): Project {
  const files: ProjectFile[] = JISUANYING_FILE_DEFS.map((file) => ({
    ...file,
    category: 'document',
    status: 'ready',
    uploadedAt: 1780905600000,
    vocList: JISUANYING_VOCS.filter((item) => item.sourceFileId === file.id),
  }));

  return {
    id: 'jisuanying_project',
    name: '洋葱计算营用户与商业增长研究',
    createdAt: 1780905600000,
    files,
    category: '用户研究与续费诊断',
    team: ['课程', '策略', '增长'],
    methods: ['桌面研究', '定量调研', '开放题分析', '业务访谈'],
    status: '已完成',
    summaryData: {
      coreFindings: [
        '家长购买的是持续练对、诊断反馈和少操心，不只是课程内容。',
        '巩固夯实型是主力人群，补差适合拉新，提前学需要独立进阶路径。',
        '续费低同时受效果不可见、孩子难坚持和学期时间冲突影响。',
        '计算营应从单期营课升级为数学专题服务入口。',
      ],
      actionItems: [
        '上线入营诊断、周度进步报告和结营前后对比。',
        '将学期产品轻量化，寒暑假提供系统突破营。',
        '建立结营保温包和应用题/思维等下一专题推荐。',
        '为洋葱会员设计服务增量权益与专属价格。',
      ],
      methodology: '综合4份行业、用户、购买决策与续费策略报告，提取定量结论、开放题原话和业务访谈反馈。',
      generatedAt: 1780905600000,
    },
  };
}
