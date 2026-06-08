import type { Project, ProjectFile, VOCItem } from '../types/voc';

export const JISUANYING_FILE_DEFS = [
  { id: 'jisuanying_file_1', name: '计算营行业与用户调研整合版报告.md' },
  { id: 'jisuanying_file_2', name: '洋葱计算营调研2_用户需求和购买决策调研报告.md' },
  { id: 'jisuanying_file_3', name: '洋葱计算营调研1_产品定位与商业策略报告.md' },
  { id: 'jisuanying_file_4', name: '计算营商业模式和提升续费的阶段性思考.md' },
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
        name: '四类用户不是同一种需求',
        globalSummary: '计算营用户从被动问题驱动到主动目标驱动形成四层梯度。补差型痛感最强但规模较小；巩固夯实型是主力人群；提速型和提前学型更看重效率、深度与体系，不能用同一套内容和话术承接。',
        brands: [
          entry('主力市场是巩固夯实，补差适合拉新，提前学要求更高', 'neutral', [
            {
              text: '补差型适合用“反复错、家长盯得累”的强痛点获客，但不能把它误判为最大市场。',
              tag: '用户分层-补差型',
              evidence: ['孩子没坚持下来。'],
            },
            {
              text: '提前学用户更容易因内容简单、深度不足而流失，需要独立的难度与进阶路径。',
              tag: '用户分层-提前学',
              evidence: ['对孩子来说有些简单。'],
            },
            {
              text: '完成计算训练后，用户需求会自然迁移到应用题、思维与综合能力，产品必须给出下一步。',
              tag: '用户分层-需求迁移',
              evidence: ['小学计算已经跟完，想学思维训练。', '小学计算营已上完，想学习思维课。'],
            },
          ]),
        ],
      },
      {
        name: '家长真正购买的任务',
        globalSummary: '家长不是单纯购买课程内容，而是在购买“诊断孩子问题、安排下一步练习、维持坚持、减少家长盯学”的服务闭环。',
        brands: [
          entry('核心任务是让孩子持续练对，同时让家长少操心', 'negative', [
            {
              text: '省心是明确需求，但当前交付仍把催促责任留给家长，承诺与体验存在落差。',
              tag: '需求-省心',
              evidence: ['一开始想着是让自己省点事，但是报了这个课后发现自己没有省太多事，因为你每天都要催促他学，毕竟是课外的孩子都不积极。'],
            },
            {
              text: '当服务被感知为“视频加练习题”，300元价格会直接与几十元教辅比较。',
              tag: '需求-服务外包',
              evidence: ['我花钱买了一个营，但孩子主要还是自己看视频、自己练。'],
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
        globalSummary: '计算营被大量家长理解为“教辅升级版”，天然落入几十元题卡的价格锚点。只有把诊断、专项推题、督学和效果证明做成可见服务，才能支撑300-399元价格。',
        brands: [
          entry('价格问题的本质是增量价值没有被清楚看见', 'negative', [
            {
              text: '洋葱老会员对内容重复尤其敏感，需要清楚区分“会员内容库”和“计算营服务订阅”。',
              tag: '购买-会员权益',
              evidence: ['已经买了6年的阶段，计算营感觉跟本来买的比较重复，希望可以针对已经购买的提供专项服务。', '已购买洋葱12年会员。'],
            },
            {
              text: '用户能够识别督促服务，但当前服务密度不足以自然支撑价格。',
              tag: '购买-价格感知',
              evidence: ['价格太高，这本来就是洋葱里的内容，我们本来就有会员，自己也可以练，你们只是给了练习题、有群、有老师督促每天打卡，就收费300元。'],
            },
          ]),
        ],
      },
      {
        name: '购买需要先验证效果',
        globalSummary: '家长在首次购买和续报时都表现出“先看一周期效果”的谨慎态度。效果证明不是结营汇报，而应贯穿21天，让错因、速度、正确率和坚持变化持续可见。',
        brands: [
          entry('用户会先小额试错，再根据可见效果决定下一步', 'neutral', [
            {
              text: '如果本期效果尚未被看见，用户会延迟承诺，而不是直接购买长期方案。',
              tag: '购买-效果验证',
              evidence: ['还没结束，先报一期看看效果。', '一期学的没效果，又报一期试试。'],
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
        globalSummary: '定量结果显示，即时批改、深度诊断、专项推题是优先级最高的服务。内容不是唯一核心，真正的差异化是“知道错在哪里、下一步练什么、家长不用一直盯”。',
        brands: [
          entry('服务必须从提醒打卡升级为诊断、解释和行动建议', 'negative', [
            {
              text: '单纯提醒和夸奖不能形成专业服务感，辅导老师需要解释问题并给出下一步。',
              tag: '服务-人工价值',
              evidence: ['助教老师作用很少，每天只是发过去夸一下、提醒一下。'],
            },
            {
              text: '交付若仍以孩子自主看视频、自主练习为主，用户会质疑营课与会员内容的区别。',
              tag: '服务-价值感',
              evidence: ['我花钱买了一个营，但孩子主要还是自己看视频、自己练。'],
            },
          ]),
        ],
      },
      {
        name: '任务负担与学习效率',
        globalSummary: '学期内每天20-30分钟的任务对很多家庭并不轻。用户需要更短、更高效、更可完成的学习单元，以及完成后的即时反馈。',
        brands: [
          entry('学期内任务需要轻量化，假期可以系统化', 'negative', [
            {
              text: '长视频和多集任务会挤压校内学习时间，直接降低完成率。',
              tag: '体验-任务负担',
              evidence: ['这类计算训练营最好安排在假期，上课期间每天要看2-3集视频课，孩子时间压力太大。', '希望可以改成更高效的题型讲解视频，课时不要那么长。'],
            },
            {
              text: '每期持续学习新方法但缺少系统复习，会削弱掌握感和长期效果。',
              tag: '体验-复习巩固',
              evidence: ['一直在学习新的计算方式，希望一期结束了能给相应的复习题目进行巩固。'],
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
        name: '低月度续费不等于需求消失',
        globalSummary: '计算需求具有明显季节性。家长普遍把系统提前学和集中训练放在寒暑假，学期中更适合轻量巩固。月度续费率会低估跨季复购和长期价值。',
        brands: [
          entry('核心矛盾是产品节奏与家庭决策节奏错位', 'negative', [
            {
              text: '学期内作业和其他课程挤压计算营，用户倾向延迟到寒暑假，而非永久流失。',
              tag: '续费-季节性',
              evidence: ['学期内比较耽误时间，假期会考虑。', '孩子时间有限，排不开，寒暑假会继续报名。', '寒假营很喜欢，但日常学校作业太多。'],
            },
            {
              text: '已经完成多期的用户仍存在暑假回流意愿，应该按季节复购而非月度续费衡量。',
              tag: '续费-复购口径',
              evidence: ['学了两期巩固一下，暑假接着来。', '想假期再上。'],
            },
          ]),
        ],
      },
      {
        name: '续费的四层杠杆',
        globalSummary: '续费提升应按价值外化、本期留存、跨期衔接、下一品类承接四层推进。先证明本期有效，再降低坚持难度，随后消除结营断点，最后承接应用题与思维等后续需求。',
        brands: [
          entry('真正要经营的是数学专题服务关系，不是无限续计算', 'neutral', [
            {
              text: '结营后需要保温练习和明确复习计划，避免学习链路突然中断。',
              tag: '续费-跨期衔接',
              evidence: ['建议报二期的计算营，一期结束后二期开始之前，孩子们计算应该保温保持下去。', '每期结束后可否发3周的计算资料用来巩固所学资料。'],
            },
            {
              text: '计算问题解决后，应主动推荐应用题、思维等下一专题，而不是把它记作自然流失。',
              tag: '续费-下一步',
              evidence: ['小学计算已经跟完，想学思维训练。', '小学计算营已上完，想学习思维课。'],
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
