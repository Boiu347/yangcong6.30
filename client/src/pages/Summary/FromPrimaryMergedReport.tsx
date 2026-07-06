import React from 'react';
import {
  BookOpenCheck,
  ExternalLink,
  FileText,
  Lightbulb,
  Quote,
  SearchCheck,
  Sparkles,
  Target,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const INTERVIEW_INDEX_URL = 'https://guanghe.feishu.cn/wiki/STo3wNQSui7aohkP4oacAXVVnKf';
const QUANT_SOURCE_URL = 'https://guanghe.feishu.cn/wiki/XvjcwdzsZiEiJ1kF9UOcburXnig';
const STRATEGY_SOURCE_URL = 'https://guanghe.feishu.cn/wiki/BRBywMno4iK5QakFbmqcwJxen4b?from=from_copylink';
const RESEARCH_SOURCE_URL = 'https://guanghe.feishu.cn/wiki/S7NrwiHD8iQhkFkzR50cs54bnMf?from=from_copylink';

type DimensionId = 'core' | 'purchase' | 'experience' | 'barrier' | 'brand' | 'next';

interface SourceInfo {
  id: string;
  title: string;
  meta: string;
  materials: string;
  url: string;
  recordingUrl?: string;
}

const dimensions: Array<{ id: DimensionId; label: string; icon: typeof Lightbulb; color: string }> = [
  { id: 'core', label: '核心洞察', icon: Lightbulb, color: '#E95B35' },
];

const sources: Record<string, SourceInfo> = {
  u1: {
    id: 'u1',
    title: '用户1-王女士',
    meta: '二年级｜山东临沂｜妙懂 & 十分通 & NB实验室',
    materials: '智能纪要｜文字记录',
    url: `${INTERVIEW_INDEX_URL}#CP6Qdhb0XoTpIxxAqgWc7x1Mnif`,
  },
  u2: {
    id: 'u2',
    title: '用户2-王先生',
    meta: '三年级｜北京昌平｜学而思科学 & NB实验室',
    materials: '智能纪要｜文字记录',
    url: `${INTERVIEW_INDEX_URL}#NVjrdP3c7oDgJLx0MlKcnDInnHf`,
  },
  u3: {
    id: 'u3',
    title: '用户3-周女士',
    meta: '二年级｜广东中山｜从小学物理（视频号购买）',
    materials: '智能纪要｜文字记录',
    url: `${INTERVIEW_INDEX_URL}#Hm0YdrirZorWf2x7xcocI1jinoh`,
  },
  u4: {
    id: 'u4',
    title: '用户4-关女士',
    meta: '二年级｜北京顺义｜从小学物理 & NB实验室 & 南开大学AI物理课',
    materials: '智能纪要｜文字记录｜本地录音切片',
    url: `${INTERVIEW_INDEX_URL}#NqATdZwhMo1B2ExTzsOcHL4Jnod`,
  },
  u5: {
    id: 'u5',
    title: '用户5-王女士',
    meta: '三年级｜重庆渝中｜妙懂 & 物理十分通 & 三五小星',
    materials: '访谈录音｜访谈逐字稿',
    url: `${INTERVIEW_INDEX_URL}#XUXldAwC5oPOJrxCgyIccsHEnwc`,
    recordingUrl: 'https://guanghe.feishu.cn/minutes/obcnmxj6m36kxvi2k3txa4u9?from=from_copylink',
  },
  u6: {
    id: 'u6',
    title: '用户6-王女士',
    meta: '四年级｜河南郑州｜从小学物理（视频号购买）',
    materials: '访谈录音｜文字逐字稿｜本地录音切片',
    url: `${INTERVIEW_INDEX_URL}#VRHPdy1pko3LLPxmmyHcGLqhnWe`,
    recordingUrl: 'https://guanghe.feishu.cn/minutes/obcno5fuo2wglif6rwv1o6r8?from=from_copylink',
  },
  u7: {
    id: 'u7',
    title: '用户7-丁女士',
    meta: '二年级｜山东潍坊｜从小学物理 & 南瓜科学',
    materials: '访谈录音｜文字记录',
    url: `${INTERVIEW_INDEX_URL}#PWzEd9Kk9o9JJcxiBkxcvLzqnvd`,
    recordingUrl: 'https://guanghe.feishu.cn/minutes/obcnvu8ri4f94293h88p8ap4',
  },
  u8: {
    id: 'u8',
    title: '用户8-X女士',
    meta: '一年级｜安徽合肥｜从小学物理 & 学而思生物课',
    materials: '访谈录音｜文字记录',
    url: `${INTERVIEW_INDEX_URL}#BbGQdc7TKoQ0m2xyPbMcqeK2nDe`,
    recordingUrl: 'https://guanghe.feishu.cn/minutes/obcnynrb466y6x9rmqoerwjr',
  },
};

function sourceOf(id: string): SourceInfo {
  return sources[id] ?? sources.u1;
}

type ConclusionPriority = '高优先级' | '中优先级';
type ConclusionConfidence = '高置信' | '中高置信';

interface ResearchVoc {
  quote: string;
  sourceId: string;
  tags: string[];
  sourceUrl?: string;
}

interface ResearchConclusion {
  id: string;
  dimension: DimensionId;
  title: string;
  summary: string;
  priority: ConclusionPriority;
  confidence: ConclusionConfidence;
  insight: string;
  conclusion: string;
  conclusions: string[];
  actions: string[];
  evidenceNote: string;
  vocs: ResearchVoc[];
}

const reportConclusions: ResearchConclusion[] = [
  {
    id: 'core-positioning',
    dimension: 'core',
    title: '从小学系列应占领“学科启蒙”',
    summary: '不是纯兴趣科普，也不是初中先修，而是低压力建立理科概念。',
    priority: '高优先级',
    confidence: '高置信',
    insight:
      '从小学系列更适合站在“学科启蒙”位置：它避开纯兴趣科普的红海，也不把低年级孩子推向初中先修。这个位置的核心是让小学 1-4 年级孩子先理解自然现象、建立基础概念，对未来理科学习不陌生。',
    conclusion: '从小学系列应占领“学科启蒙”：用孩子能听懂、家长觉得有长期价值的方式，连接兴趣入口和未来理科学习。',
    conclusions: [
      '从小学系列真正要占领的是兴趣启蒙和衔接先修之间的“学科启蒙”：家长还没有明确说出这个词，但需求真实存在。',
      '主要受众应聚焦小学 1-4 年级家长：他们不是学前纯兴趣启蒙，也还没进入小高阶段强应试、强先修的诉求。',
      '不应把主定位放在纯兴趣启蒙、初中先修或校内科学同步上：纯兴趣启蒙竞争激烈，先修需求更适合初中同步课，校内同步目前需求小众且内容难完全同步。',
    ],
    actions: [
      '页面主叙事统一到“学科启蒙”，避免同时讲纯科普、先修和同步导致心智发散。',
      '把核心受众写成小学 1-4 年级、关注未来理科但不想过早应试的家庭。',
      '科学主科化地区可以作为增强需求保留，但不要替代“学科启蒙”的主定位。',
    ],
    evidenceNote: '来源说明：洞察小结、售卖策略调研、访谈纪要；涉及用户1、用户2、用户3、用户6。',
    vocs: [
      { sourceId: 'u1', tags: ['学科启蒙', '低压力', '自然现象'], quote: '有个概念就行。不是为了提前学什么，更多是让他了解一下自然现象。' },
      { sourceId: 'u2', tags: ['学科启蒙', '未来理科', '长期铺垫'], quote: '学科启蒙：为了以后中高考、初高中理科学习。兴趣启蒙：要求更低，更像让孩子试水，培养兴趣。' },
      { sourceId: 'u3', tags: ['物理启蒙', '生活素材', '初中衔接'], quote: '素材可以从生活中随手，可以随时可以找到。然后就可以提前对那个物理启蒙。' },
      { sourceId: 'u6', tags: ['科学主科化', '校内科学', '避免死记硬背'], quote: '郑州把科学课纳入了主科，期中期末都在考。到初中之后它就变成了物理化学生物，我不希望他只是去死记硬背。' },
    ],
  },
  {
    id: 'demand-and-onion-fit',
    dimension: 'core',
    title: '关键卖点：兴趣入口，学科价值成交',
    summary: '孩子爱看负责打开第一步，未来有用才是家长最终买单理由。',
    priority: '高优先级',
    confidence: '高置信',
    insight:
      '家长会用“兴趣”“启蒙”描述需求，但继续追问后，真正支撑购买的是未来学理科别排斥、别畏难、吸收更快。洋葱适合承接这个需求，是因为它同时具备动画易懂、内容系统、品牌可信和孩子愿意持续看的基础。',
    conclusion: '这个板块需要把“为什么买”和“为什么洋葱能做”连起来：兴趣是入口，学科价值是成交理由，洋葱负责把二者接住。',
    conclusions: [
      '兴趣是入口，孩子喜欢、看得进去，家长才会进一步考虑购买。',
      '未来学科价值才是家长最终合理化购买的理由：正式学理科时别排斥、别畏难，对初高中理科学习有帮助。',
      '洋葱目前更多被“品牌信任”和“顺手加购”带动，而不是靠从小学物理本身的课程卖点形成清晰记忆点。',
      '洋葱的机会是把动画易懂、内容系统、孩子视角讲解和学科启蒙价值连起来，塑造更明确的课程心智。',
    ],
    actions: [
      '卖点顺序先讲孩子愿意看，再讲听得懂、能解释、未来理科不陌生。',
      '“洋葱适合做”不单独拉成新模块，放在本结论里作为品牌和产品承接依据。',
      '用系统性、易懂性、内容丰富度和品牌信任支撑“学科启蒙”而不是泛泛说好玩。',
    ],
    evidenceNote: '来源说明：洞察小结、购买原因与体验横向汇总、访谈纪要；涉及用户3、用户4、用户7、用户8。',
    vocs: [
      { sourceId: 'u7', tags: ['兴趣入口', '看得进去', '学习前提'], quote: '首先是孩子能看得进去，看得进去的话，想教他的知识，他才能听进去，学进去。' },
      { sourceId: 'u4', tags: ['系统性', '课程目录', '自主选择'], quote: '知识的话就是系统性更强，因为它都已经罗列得非常分层次，看得也比较清晰，孩子也能自行选取。' },
      { sourceId: 'u4', tags: ['品牌信任', '购买原因', '顺手加购'], quote: '就还是当时他有这个链接挂链了，我也需要，就买了。有对比，没有那么多，当时。就基于他信任。' },
      { sourceId: 'u7', tags: ['动画表达', '持续观看', '易懂'], quote: '一个知识点接一个知识点，让孩子像看动画片一样一个接一个看下去。' },
      { sourceId: 'u8', tags: ['长期价值', '未来理科', '购买理由'], quote: '最少他上初中、高中学习物理不会那么吃力吧。' },
    ],
  },
  {
    id: 'short-long-needs',
    dimension: 'core',
    title: '学科启蒙的短期需求和长期需求',
    summary: '短期看爱学、听懂、能说、能做；长期看初中不陌生、不排斥、吸收更快。',
    priority: '高优先级',
    confidence: '高置信',
    insight:
      '短期需求不是立刻提分，而是孩子愿意看、能听懂、能用自己的话说出来、能通过实验或生活现象理解原理，并且学习压力足够轻。长期需求则是进入初中理科时不陌生、不排斥、吸收更快。',
    conclusion: '需求表达要同时覆盖短期可见反馈和长期学科价值：短期让孩子进入，长期让家长觉得值得。',
    conclusions: [
      '短期有效标准包括孩子爱看、愿意主动学，并且看到生活现象时能产生“为什么”的思考意识。',
      '中期有效标准是孩子能理解本质，大概说出现象背后的原理或概念，而不是只停留在看过视频。',
      '长期有效标准是进入初中理科学习时不陌生、不排斥，并且能更快吸收老师讲的内容。',
      '“未来有用”需要拆成短期兴趣与思考、中期原理表达、长期初中承接，而不是停留在一句空泛口号。',
    ],
    actions: [
      '短期维度拆成“爱学、听懂、能说、能做、低压力”，并分别挂对应 VOC。',
      '长期维度拆成“不陌生、不排斥、吸收更快、理科思维”，避免只写“未来有用”。',
      '详情页和核心洞察都要把短期反馈与长期价值放在同一条链路里讲。',
    ],
    evidenceNote: '来源说明：售卖策略调研、洞察小结、访谈纪要；涉及用户3、用户4、用户5、用户7、用户8。',
    vocs: [
      { sourceId: 'u4', tags: ['爱看', '实验男', '主动学习'], quote: '洋葱学园的从小学物理，如果说我不是不管的话，他每天他都会刷。他好像特别喜欢看那实验男做实验。他当成趣味里边学知识了。' },
      { sourceId: 'u4', tags: ['能说', '转述', '主动反馈'], quote: '他看了之后会考我，会把课上看的从小学物理视频转化成自己的语言。' },
      { sourceId: 'u1', tags: ['能说原理', '概念认知', '理解本质'], quote: '孩子大概了解这个内容，能说出一些基本原理，有概念性认知即可。' },
      { sourceId: 'u7', tags: ['生活迁移', '惯性', '理解反馈'], quote: '现实生活中见到以后能联想到，比如停车前倾知道是惯性。' },
      { sourceId: 'u3', tags: ['长期验证', '初中物理', '未来有用'], quote: '到初中正式学物理才能看出。' },
    ],
  },
  {
    id: 'effective-enlightenment',
    dimension: 'core',
    title: '启蒙有效判断：困境、后果与机会点',
    summary: '终极判断是初中有用，但小学阶段必须让效果提前被看见。',
    priority: '高优先级',
    confidence: '中高置信',
    insight:
      '家长对启蒙有效的终极判断是“未来初中有没有用”，但这个结果太远，购买当下无法验证。现有困境是孩子爱看不等于家长知道学到了什么，后果是购买不确定、使用低频、担心吃灰。机会点是把启蒙效果外化成学习报告、孩子复述、知识进度、实验完成和小测反馈。',
    conclusion: '启蒙有效的机会点不是再喊“未来有用”，而是把“学会了什么”做成家长现在就能看见的证据链。',
    conclusions: [
      '家长对启蒙有效的终极判断是未来初中有没有用：正式学理科时是否不陌生、不排斥，学习时是否更快、更好吸收。',
      '当前困境是小学阶段短期缺少清晰可见的验证标准，孩子爱看还不能直接证明启蒙正在变得有用。',
      '直接后果是家长不知道孩子学到了什么、记住了什么、掌握到什么程度，也不知道学科思维有没有变化。',
      '机会点是阶段性地把启蒙效果外化，让家长通过学习报告、孩子复述、概念掌握和生活现象解释看见结果。',
    ],
    actions: [
      '第三层内容按“终极判断-现有困境-导致后果-机会点”呈现，不把卡点和机会点单独拆成外部模块。',
      '把学习报告、孩子讲给家长听、生活现象解释和小测反馈作为效果外化方案。',
      '用“看得见的确定感”回应家长不确定，而不是只强调课程体系完整。',
    ],
    evidenceNote: '来源说明：洞察小结、售卖策略调研、访谈纪要；涉及用户1、用户4、用户5、用户8。',
    vocs: [
      { sourceId: 'u5', tags: ['不知道学了什么', '效果不可见', '购买犹豫'], quote: '我想知道他到底学了什么东西？学到了什么东西？学了多少？能记住什么？' },
      { sourceId: 'u8', tags: ['学习报告', '掌握程度', '验证缺口'], quote: '没有学习报告，不知道孩子最终掌握什么程度。' },
      { sourceId: 'u4', tags: ['孩子复述', '效果外化', '家庭反馈'], quote: '他看了之后会考我，会把课上看的从小学物理视频转化成自己的语言。' },
      { sourceId: 'u1', tags: ['能解释', '概念认知', '启蒙结果'], quote: '孩子能说出一些基本原理，有概念性认知即可。' },
    ],
  },
];

function sourceUrlOf(voc: ResearchVoc) {
  return voc.sourceUrl ?? sourceOf(voc.sourceId).url;
}

function ResearchVocCard({ voc, dense = false }: { voc: ResearchVoc; dense?: boolean }) {
  const source = sourceOf(voc.sourceId);
  const sourceLabel = `${source.title.split('-')[0]}访谈`;

  return (
    <article className={cn('rounded-[14px] border border-[#E6DDD3] bg-white p-4 shadow-[0_8px_22px_rgba(55,44,34,.04)]', dense && 'p-3.5')}>
      <div className="flex items-start gap-2.5">
        <Quote size={16} className="mt-1 shrink-0 text-[#E95B35]" />
        <p className={cn('font-semibold leading-7 text-[#2E2924]', dense ? 'text-[13px]' : 'text-[14px]')}>“{voc.quote}”</p>
      </div>
      <div className="mt-3 border-t border-[#EEE5DC] pt-3">
        <p className="text-[12px] font-black text-[#403A34]">{`${source.title}｜${source.meta}`}</p>
        <p className="mt-1 text-[11px] font-semibold text-[#7D746A]">
          {sourceLabel}｜{source.materials}
        </p>
      </div>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {voc.tags.map((tag) => (
          <span key={`${voc.sourceId}-${tag}`} className="rounded-full bg-[#FFF3EE] px-2 py-1 text-[11px] font-bold text-[#E95B35]">
            {tag}
          </span>
        ))}
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <a
          href={sourceUrlOf(voc)}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1 rounded-full border border-[#D9D1C7] bg-[#FAF8F4] px-2.5 py-1 text-[11px] font-bold text-[#6E675F] hover:border-[#E95B35] hover:text-[#E95B35]"
        >
          查看来源记录
          <ExternalLink size={11} />
        </a>
      </div>
    </article>
  );
}

export default function FromPrimaryMergedReport() {
  const [selectedByDimension, setSelectedByDimension] = React.useState<Record<DimensionId, string>>(() =>
    dimensions.reduce(
      (acc, dimension) => {
        const first = reportConclusions.find((item) => item.dimension === dimension.id);
        if (first) acc[dimension.id] = first.id;
        return acc;
      },
      {} as Record<DimensionId, string>,
    ),
  );
  const [drawerConclusionId, setDrawerConclusionId] = React.useState<string | null>(null);

  const drawerConclusion = drawerConclusionId ? reportConclusions.find((item) => item.id === drawerConclusionId) : null;
  const totalVoc = reportConclusions.reduce((sum, item) => sum + item.vocs.length, 0);
  const userCount = new Set(reportConclusions.flatMap((item) => item.vocs.map((voc) => voc.sourceId))).size;

  return (
    <main className="min-h-full bg-[#F8F6F1] text-[#292521]">
      <header className="px-5 py-7 md:px-8">
        <div className="mx-auto max-w-[1440px]">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="text-[12px] font-black tracking-[0.16em] text-[#E95B35]">从小学系列售卖策略调研</p>
              <h1 className="mt-3 text-[32px] font-black leading-tight md:text-[42px]">从小学物理洞察总览</h1>
              <p className="mt-3 max-w-3xl text-[15px] font-semibold leading-7 text-[#706960]">
                用于沉淀小学物理项目的核心结论、VOC 证据和产品优化建议，帮助业务方先看判断，再追溯到用户原声。
              </p>
            </div>
            <div className="flex flex-wrap gap-2 lg:max-w-[420px] lg:justify-end">
              {[
                { label: '洞察小结', url: STRATEGY_SOURCE_URL },
                { label: '研究方案', url: RESEARCH_SOURCE_URL },
                { label: '访谈纪要', url: INTERVIEW_INDEX_URL },
                { label: '定量报告', url: QUANT_SOURCE_URL },
              ].map((link) => (
                <a
                  key={link.label}
                  href={link.url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-full border border-[#D8D0C6] bg-white px-3 py-2 text-[12px] font-black text-[#5F5851] shadow-sm transition hover:border-[#E95B35] hover:text-[#E95B35]"
                >
                  <FileText size={13} />
                  {link.label}
                  <ExternalLink size={11} />
                </a>
              ))}
            </div>
          </div>

          <div className="mt-7 grid gap-4 md:grid-cols-3">
            {[
              { icon: Lightbulb, value: reportConclusions.length, label: '核心结论', desc: '已沉淀的可行动判断', color: '#E95B35', bg: '#FFF3EE' },
              { icon: Quote, value: totalVoc, label: '有效 VOC', desc: '与结论强绑定的原声', color: '#2F9F8F', bg: '#EFFFFB' },
              { icon: Target, value: userCount, label: '涉及用户', desc: '覆盖访谈用户来源', color: '#C58A3D', bg: '#FFF7E8' },
            ].map(({ icon: Icon, value, label, desc, color, bg }) => (
              <div key={label} className="rounded-[18px] border border-[#E6DDD3] bg-white p-5 shadow-[0_10px_28px_rgba(55,44,34,.05)]">
                <div className="flex items-center gap-4">
                  <div className="grid size-14 place-items-center rounded-full" style={{ backgroundColor: bg, color }}>
                    <Icon size={24} />
                  </div>
                  <div>
                    <p className="text-[14px] font-black text-[#403A34]">{label}</p>
                    <p className="text-[34px] font-black leading-none" style={{ color }}>
                      {value}
                    </p>
                    <p className="mt-1 text-[12px] font-semibold text-[#8A8279]">{desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </header>

      <section className="px-5 pb-8 md:px-8">
        <div className="mx-auto max-w-[1440px] space-y-6">
          {dimensions.map((dimension) => {
            const dimensionItems = reportConclusions.filter((item) => item.dimension === dimension.id);
            if (dimensionItems.length === 0) return null;
            const selectedId = selectedByDimension[dimension.id];
            const selectedConclusion = dimensionItems.find((item) => item.id === selectedId) ?? dimensionItems[0];
            const selectedIndex = dimensionItems.findIndex((item) => item.id === selectedConclusion.id);
            const Icon = dimension.icon;

            return (
              <article
                key={dimension.id}
                className="rounded-[24px] border border-[#E0D7CC] bg-white p-5 shadow-[0_18px_42px_rgba(55,44,34,.07)]"
              >
                <div className="mb-5 flex flex-col gap-3 border-b border-[#E8DED3] pb-4 md:flex-row md:items-center md:justify-between">
                  <div className="flex items-center gap-3">
                    <div className="grid size-11 place-items-center rounded-full" style={{ backgroundColor: `${dimension.color}18`, color: dimension.color }}>
                      <Icon size={21} />
                    </div>
                    <div>
                      <h2 className="text-[22px] font-black text-[#292521]">{dimension.label}</h2>
                      <p className="mt-1 text-[12px] font-semibold text-[#7D746A]">本维度包含 {dimensionItems.length} 条结论，点击左侧结论查看对应分析和 VOC。</p>
                    </div>
                  </div>
                  <span
                    className="w-fit rounded-full px-3 py-1.5 text-[12px] font-black"
                    style={{ backgroundColor: `${dimension.color}14`, color: dimension.color }}
                  >
                    {dimensionItems.length} 条结论
                  </span>
                </div>

                <div className="grid items-start gap-5 xl:grid-cols-[300px_minmax(0,1fr)]">
                  <aside
                    className="self-start rounded-[18px] border border-[#E6DDD3] bg-[#FBFAF7] p-3 xl:flex xl:flex-col xl:overflow-hidden"
                  >
                    <div className="mb-3 flex shrink-0 items-center justify-between">
                      <p className="text-[14px] font-black text-[#403A34]">结论列表</p>
                      <span className="text-[11px] font-bold text-[#8A8279]">{dimensionItems.length} 条</span>
                    </div>
                    <div className="min-h-0 space-y-2.5 pr-1 xl:flex-1 xl:overflow-y-auto">
                      {dimensionItems.map((item) => {
                        const selected = item.id === selectedConclusion.id;
                        const index = dimensionItems.findIndex((entry) => entry.id === item.id);
                        return (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => {
                              setSelectedByDimension((prev) => ({ ...prev, [dimension.id]: item.id }));
                              if (drawerConclusionId) setDrawerConclusionId(null);
                            }}
                            className={cn(
                              'w-full rounded-[14px] border p-4 text-left transition',
                              selected
                                ? 'bg-white shadow-[0_12px_28px_rgba(55,44,34,.08)]'
                                : 'bg-white hover:bg-[#FFF9F5]',
                            )}
                            style={{ borderColor: selected ? dimension.color : `${dimension.color}55` }}
                          >
                            <div className="flex items-start gap-3">
                              <span className="grid size-8 shrink-0 place-items-center rounded-full bg-[#F1ECE5] text-[14px] font-black text-[#7D746A]">
                                {index + 1}
                              </span>
                              <div className="min-w-0">
                                <h3 className="text-[15px] font-black leading-6 text-[#292521]">{item.title}</h3>
                                <p className="mt-1 text-[12px] font-semibold leading-5 text-[#6F675F]">{item.summary}</p>
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </aside>

                  <section className="self-start rounded-[18px] border border-[#E6DDD3] bg-white p-5">
                    <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-[12px] font-black" style={{ backgroundColor: `${dimension.color}12`, color: dimension.color }}>
                      当前结论
                      <span className="rounded-full bg-white px-2 py-0.5">{selectedIndex + 1}</span>
                    </div>
                    <h3 className="mt-4 text-[28px] font-black leading-tight text-[#292521]">{selectedConclusion.title}</h3>

                    <div className="mt-5 rounded-[16px] border border-[#EEE0D6] bg-[#FFF9F5] p-5">
                      <div className="flex items-center gap-2 text-[14px] font-black" style={{ color: dimension.color }}>
                        <BookOpenCheck size={17} />
                        关键洞察
                      </div>
                      <p className="mt-3 text-[15px] font-semibold leading-8 text-[#403A34]">{selectedConclusion.insight}</p>
                    </div>

                    <div className="mt-4 rounded-[16px] border bg-white p-5" style={{ borderColor: `${dimension.color}40`, boxShadow: `inset 4px 0 0 ${dimension.color}` }}>
                      <div className="flex items-center gap-2 text-[14px] font-black" style={{ color: dimension.color }}>
                        <Sparkles size={17} />
                        核心结论
                      </div>
                      <div className="mt-3 space-y-2.5">
                        {(selectedConclusion.conclusions.length ? selectedConclusion.conclusions : [selectedConclusion.conclusion]).map((conclusion, index) => (
                          <div key={conclusion} className="flex items-start gap-3 rounded-[12px] bg-[#FFF9F5] px-3 py-3">
                            <span
                              className="mt-1 grid size-5 shrink-0 place-items-center rounded-full text-[11px] font-black text-white"
                              style={{ backgroundColor: dimension.color }}
                            >
                              {index + 1}
                            </span>
                            <p className="text-[16px] font-black leading-7 text-[#292521]">{conclusion}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="mt-4 rounded-[16px] border border-[#D8EFE8] bg-[#F5FFFC] p-5">
                      <div className="flex items-center gap-2 text-[14px] font-black text-[#2F9F8F]">
                        <Target size={17} />
                        建议行动
                      </div>
                      <div className="mt-3 space-y-2.5">
                        {selectedConclusion.actions.map((action, index) => (
                          <div key={action} className="flex items-start gap-3 rounded-[12px] bg-white px-3 py-3">
                            <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-[#2F9F8F] text-[11px] font-black text-white">
                              {index + 1}
                            </span>
                            <p className="text-[14px] font-bold leading-6 text-[#403A34]">{action}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="mt-4 rounded-[14px] border border-[#E6DDD3] bg-[#FBFAF7] px-4 py-3 text-[12px] font-semibold leading-6 text-[#7D746A]">
                      {selectedConclusion.evidenceNote}
                    </div>

                    <div className="mt-5 rounded-[16px] border border-[#E6DDD3] bg-[#FBFAF7] p-4">
                      <div className="mb-4 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                        <div>
                          <h3 className="text-[18px] font-black text-[#292521]">对应 VOC</h3>
                          <p className="mt-1 text-[12px] font-semibold text-[#7D746A]">直接支撑当前结论的用户原声</p>
                        </div>
                        <span className="w-fit rounded-full bg-[#F1ECE5] px-2.5 py-1 text-[12px] font-black text-[#6E675F]">{selectedConclusion.vocs.length} 条</span>
                      </div>
                      <div className="grid gap-3 lg:grid-cols-3">
                        {selectedConclusion.vocs.slice(0, 3).map((voc) => (
                          <ResearchVocCard key={`${selectedConclusion.id}-${voc.sourceId}-${voc.quote}`} voc={voc} dense />
                        ))}
                      </div>
                      <button
                        type="button"
                        onClick={() => setDrawerConclusionId(selectedConclusion.id)}
                        className="mt-4 w-full rounded-[12px] border px-4 py-3 text-[13px] font-black hover:bg-white md:w-auto"
                        style={{ borderColor: `${dimension.color}50`, backgroundColor: `${dimension.color}10`, color: dimension.color }}
                      >
                        查看全部 VOC（{selectedConclusion.vocs.length} 条）
                      </button>
                    </div>
                  </section>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {drawerConclusion && (
        <div className="fixed inset-0 z-50 bg-[#292521]/35" role="presentation" onClick={() => setDrawerConclusionId(null)}>
          <aside
            className="ml-auto h-full w-full max-w-[520px] overflow-y-auto bg-[#F8F6F1] p-5 shadow-[-18px_0_42px_rgba(55,44,34,.22)]"
            role="dialog"
            aria-modal="true"
            aria-label={`${drawerConclusion.title}全部 VOC`}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="sticky top-0 z-10 -mx-5 -mt-5 border-b border-[#E6DDD3] bg-[#F8F6F1]/95 px-5 py-4 backdrop-blur">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[12px] font-black tracking-[0.12em] text-[#E95B35]">全部 VOC</p>
                  <h2 className="mt-1 text-[22px] font-black text-[#292521]">{drawerConclusion.title}</h2>
                </div>
                <button
                  type="button"
                  onClick={() => setDrawerConclusionId(null)}
                  className="grid size-9 shrink-0 place-items-center rounded-full border border-[#D8D0C6] bg-white text-[20px] font-light text-[#7D746A] hover:border-[#E95B35] hover:text-[#E95B35]"
                  aria-label="关闭全部 VOC"
                >
                  ×
                </button>
              </div>
            </div>
            <div className="mt-5 space-y-3">
              {drawerConclusion.vocs.map((voc) => (
                <ResearchVocCard key={`drawer-${drawerConclusion.id}-${voc.sourceId}-${voc.quote}`} voc={voc} />
              ))}
            </div>
          </aside>
        </div>
      )}

      <footer className="px-5 pb-8 text-center text-[12px] font-semibold text-[#A19990] md:px-8">
        用户原声来源限定为访谈目录中的用户1-用户8；每个维度卡片内的结论、分析和 VOC 独立联动。
      </footer>
    </main>
  );
}
