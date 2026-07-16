import React from 'react';
import { motion } from 'motion/react';
import {
  AlertTriangle,
  ArrowRight,
  BookOpenCheck,
  CheckCircle2,
  GitCompare,
  Heart,
  Lightbulb,
  Quote,
  ShieldCheck,
  Sparkles,
  Target,
  Users,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const INK = '#292521';
const MUTED = '#746E67';
const STORY = '#33302b';
const BASE_PATH = process.env.CLIENT_BASE_PATH || '';

const reveal = {
  initial: { opacity: 0, y: 18 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-48px' },
  transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] as const },
};

type IconType = React.ComponentType<{ size?: number }>;

type FlowChart = {
  type: 'flow';
  nodes: { title: string; desc: string }[];
  note: string;
};

type LadderChart = {
  type: 'ladder';
  nodes: { title: string; desc: string }[];
  note: string;
};

type TransferChart = {
  type: 'transfer';
  source: { title: string; points: string[] };
  bridge: string;
  target: { title: string; points: string[] };
};

type LibraryChart = {
  type: 'library';
  factors: { title: string; desc: string }[];
  result: string;
};

type DecisionChart = FlowChart | LadderChart | TransferChart | LibraryChart;

interface FamilyPersona {
  id: string;
  index: string;
  accent: string;
  name: string;
  keyword: string;
  tagline: string;
  portrait: {
    image: string;
    imageAlt: string;
    definition: string;
    boundary: string;
    attributes: { icon: IconType; label: string; value: string }[];
    signals: string[];
    productOpportunity: string;
  };
  story: {
    banner: string;
    region: string;
    combo: string;
    role: string;
    status: string;
    coreFeature: string;
    family: { k: string; v: string }[];
    chartTitle: string;
    chart: DecisionChart;
    onion: {
      purpose: string;
      positives: string[];
      concerns: string[];
    };
    narrative: {
      heading: string;
      intro?: string;
      points: { text: string; quote?: string }[];
    }[];
  };
}

// 画像结论来自《家庭包用户购买决策洞察》；故事事实与原声来自四户代表家庭访谈。
const PERSONAS: FamilyPersona[] = [
  {
    id: 'transition-window',
    index: '01',
    accent: '#C9622E',
    name: '小升初窗口驱动型',
    keyword: '升学触发',
    tagline: '升学孩子的紧迫问题给购买理由，另一孩子权益让高客单不浪费',
    portrait: {
      image: '/family-stories/transition-window.png',
      imageAlt: '妈妈陪六年级哥哥准备升学，三年级妹妹在旁学习',
      definition: '年级在小升初前后（5/6/7 年级），购买由某个孩子明确学习问题触发；核心需求是兼顾同步复习小学与提前学初中。',
      boundary: '和「拔尖自驱超前学型」不同：这类家庭首先被明确的升学节点和当下问题推动，孩子是否长期自主学习尚未完全确定；另一孩子的权益主要负责把高客单价合理化。',
      attributes: [
        { icon: Users, label: '家庭与学情特征', value: '年级在小升初前后（5/6/7 年级），多孩需求有主次。' },
        { icon: Target, label: '购买需求', value: '同步复习小学 + 提前学初中，解决暑假衔接与分班考试压力。' },
        { icon: AlertTriangle, label: '核心顾虑', value: '提分效果不确定时，会退而买更短、更便宜的方案。' },
        { icon: Heart, label: '决策偏好', value: '主孩紧迫需求促成购买，另一孩子能用让长期包显得不浪费。' },
      ],
      signals: ['5/6/7 年级附近', '暑假预习初中', '两个孩子需求有主次', '在短期课与家庭包之间比较'],
      productOpportunity: '先抓住大孩「紧急 + 重要」的升学问题，再把二孩打基础需求作为锦上添花；同时用试用和具体学习计划证明买后能用起来。',
    },
    story: {
      banner: '广州黄妈妈 —— 两个孩子都有需求，但家长更偏向让「好的更好」',
      region: '广东广州',
      combo: '三年级 & 六年级',
      role: '妈妈 · 主导购买决策',
      status: '已购家庭包',
      coreFeature: '大孩强需求成交（小升初衔接），小孩权益负责把高客单价合理化，二者缺一不可。',
      family: [
        { k: '哥哥', v: '暑假前六年级、暑假后升初一；成绩一直 A，三科均衡。' },
        { k: '妹妹', v: '暑假前三年级、升四年级；数学一直没进入状态，有 B/C。' },
        { k: '主需求', v: '哥哥小升初衔接、预习初中；妹妹打基础是长期需求。' },
        { k: '使用差异', v: '哥哥能自主学习，妹妹上 AI 定制班时仍需要陪伴。' },
      ],
      chartTitle: '购买逻辑 · 主孩触发，二孩合理化',
      chart: {
        type: 'flow',
        nodes: [
          { title: '大孩升学触发', desc: '哥哥进入小升初衔接，暑假需要预习初中。' },
          { title: '小孩权益合理化', desc: '妹妹未来也能打基础，让高客单不浪费。' },
          { title: '试用确认', desc: '哥哥试用后三科都喜欢，愿意自主学习。' },
          { title: '购买家庭包', desc: '两个孩子一起用 6 年，覆盖到高中。' },
        ],
        note: '如果没有妹妹的权益，家庭更可能只给哥哥购买短期课。',
      },
      onion: {
        purpose: '哥哥用短视频完成初中同步预习，妹妹先打好数学基础；希望两个孩子都能用到高中。',
        positives: ['哥哥试用后三科都喜欢，尤其喜欢语文。', '短视频预习比直播课更节省时间。'],
        concerns: ['担心买了浪费、孩子不能坚持。', '妹妹需要陪伴，长期使用仍有不确定性。'],
      },
      narrative: [
        {
          heading: '小升初是这次购买最明确的触发点',
          intro: '哥哥即将升初一，家庭正在准备暑假衔接与初中预习。',
          points: [
            { text: '哥哥成绩稳定、三科均衡，需要的是更省时间的同步预习，而不是再上一节两小时的直播课。', quote: '大宝暑假小升初衔接，洋葱可以用短视频完成同步预习，不像直播课一节两小时占时间；二宝现在可以先用来打好基础。' },
          ],
        },
        {
          heading: '真正决定买家庭包的，是两个孩子需求叠加',
          points: [
            { text: '哥哥的需求负责促成当下成交，妹妹的长期权益让家庭觉得不用只买一份短期课。', quote: '主要考虑的是哥哥，妹妹无所谓，顺带使用；但如果没有妹妹的权益，可能就会买个短期课，不会买家庭包了。' },
          ],
        },
        {
          heading: '妹妹的基础问题，让长期准备变得有现实意义',
          points: [
            { text: '家长最担心妹妹的数学基础，认为如果现在不处理，五六年级会更难。', quote: '怕数学基础没打好，五六年级会更难搞。' },
          ],
        },
      ],
    },
  },
  {
    id: 'self-driven',
    index: '02',
    accent: '#3F5E8C',
    name: '拔尖自驱超前学型',
    keyword: '自主学习',
    tagline: '孩子已经准备好了，家庭包需要证明资源能持续跟上她',
    portrait: {
      image: '/family-stories/self-driven.png',
      imageAlt: '初一女儿自主规划初高中学习，妈妈在旁支持',
      definition: '成绩优秀（小学 95、初中 110+），已在或计划提前学；需要覆盖初中与高中的同步、拔高资源，支撑长期自主学习。',
      boundary: '和「小升初窗口驱动型」不同：购买不是由一次迫近的升学问题推动，而是孩子已经具备主动学习能力和持续往前学的意愿；家长对长期包的信心主要来自对孩子的信任。',
      attributes: [
        { icon: Users, label: '家庭与学情特征', value: '成绩优秀、孩子自律，已在或计划提前学习更高年级内容。' },
        { icon: Target, label: '购买需求', value: '覆盖初中 + 高中的同步与拔高资源，让孩子按自己的节奏往前走。' },
        { icon: AlertTriangle, label: '核心顾虑', value: '孩子是否一时兴起、能否适应录播、长期包会不会浪费。' },
        { icon: Heart, label: '决策偏好', value: '孩子主动提出、能长期坚持，比销售承诺更能推动家长升级购买。' },
      ],
      signals: ['成绩优秀', '主动提出学习', '已经超前学', '家长信任孩子能坚持'],
      productOpportunity: '突出课程如何支持孩子自主学习、如何从初中自然衔接到高中，以及如何帮助孩子把知识串联成体系，而不是只强调课程数量。',
    },
    story: {
      banner: '景德镇王妈妈 —— 孩子自己想往前学，家长才敢一次买到高中',
      region: '江西景德镇',
      combo: '初一 & 已毕业',
      role: '妈妈 · 支持孩子自主规划',
      status: '已购家庭包 + 学习机',
      coreFeature: '家长购买家庭包，是在支持一个自律、主动、愿意提前学的孩子；孩子的长期使用确定性，降低了家庭包的浪费风险。',
      family: [
        { k: '孩子', v: '七年级，年级前几名；主要靠超前学，基本不用家长管。' },
        { k: '进度', v: '数学已预习到九年级，英语在自学高中内容。' },
        { k: '购买发起', v: '孩子自己发现洋葱、主动提出想学，家长随后评估。' },
        { k: '家长期待', v: '不只会套公式，还要形成思维分析与知识串联能力。' },
      ],
      chartTitle: '学习逻辑 · 孩子主动，资源自然衔接',
      chart: {
        type: 'ladder',
        nodes: [
          { title: '孩子主动', desc: '主动发现产品、提出想学。' },
          { title: '家长信任', desc: '平时自觉、自律，认定的事情能坚持。' },
          { title: '初中超前学', desc: '数学学到九年级，英语接触高中内容。' },
          { title: '高中自然衔接', desc: '高中资源不是囤课，而是学习路径的延伸。' },
        ],
        note: '长期包成立的关键不是“时间长”，而是孩子的学习路径本来就在持续向前。',
      },
      onion: {
        purpose: '支持孩子自主超前学习，把初高中知识形成体系，提高思维分析与举一反三能力。',
        positives: ['同步 + 培优内容可以由简入深。', '初高中资源连续，适合孩子自主安排。'],
        concerns: ['担心孩子心血来潮，过段时间不学。', '需要持续证明知识能被消化吸收、形成体系。'],
      },
      narrative: [
        {
          heading: '核心对象是成绩好、也有主动学习意识的孩子',
          points: [
            { text: '这个家庭的购买动机，是孩子已经具备继续往前学的能力和意愿。', quote: '因为她平时学习也是非常主动的，非常自律。' },
            { text: '家长相信孩子，是因为她认定的事情通常能坚持。', quote: '他只要是他自己认定的事情，他一般都还能坚持下去。所以我就相信他。' },
          ],
        },
        {
          heading: '长周期家庭包并非毫无阻力',
          points: [
            { text: '家长最初也想先买初中验证效果，再考虑高中。', quote: '当时也会想，我就买个初中的，看好不好，然后我再买高中的。' },
          ],
        },
        {
          heading: '真正让决策升级的，是孩子自己提出想学',
          points: [
            { text: '对王妈妈来说，孩子主动提出学习，比销售承诺更有说服力。', quote: '既然我小孩子，我女儿她是比较自觉的，自律的。她能够这样自己主动地提出出来，她说要想自己去学习，那我们就支持她。' },
          ],
        },
        {
          heading: '高中内容不是遥远囤课，而是超前学习的自然延伸',
          points: [
            { text: '孩子本来就会往前学，高中资源因此成为持续自主学习的底座。', quote: '既然要学嘛，你既然要提前学，那你就一起买。' },
          ],
        },
        {
          heading: '她认可洋葱的关键，是帮助孩子形成自主学习体系',
          points: [
            { text: '家长希望孩子消化吸收、形成自己的知识主线，而不是只会套公式。', quote: '我希望他能够自己消化吸收，形成自己的知识成体系嘛；等于是有一个主线，他能够把这知识串联起来。' },
          ],
        },
      ],
    },
  },
  {
    id: 'experience-transfer',
    index: '03',
    accent: '#2F8272',
    name: '大孩经验迁移型',
    keyword: '经验复制',
    tagline: '把大孩的成功与踩坑经验，转化为小孩更早、更明确的学习安排',
    portrait: {
      image: '/family-stories/experience-transfer.png',
      imageAlt: '妈妈把初三姐姐的学习经验迁移给四年级妹妹',
      definition: '多胎隔段（初高中 + 小学），首购多由大孩中考复习触发，后续决策转向为小孩长期准备；家庭包被看作提前准备和减少线下补课的方案。',
      boundary: '和「资源预置囤课型」不同：这类家庭并非单纯提前把资源备好，而是已经经历过大孩的升学、补课或使用问题，购买逻辑来自对真实经验的复盘。',
      attributes: [
        { icon: Users, label: '家庭与学情特征', value: '多胎隔段（初高中 + 小学），大孩与小孩需求会随升学节点转换。' },
        { icon: Target, label: '购买需求', value: '把大孩成功或踩坑经验迁移给小孩，提前规划、减少未来补课。' },
        { icon: AlertTriangle, label: '核心顾虑', value: '会不会像老大一样买了没用起来，长期效果能否持续看见。' },
        { icon: Heart, label: '决策偏好', value: '比较接送、时间、私教和未来涨价等综合成本，而不只看标价。' },
      ],
      signals: ['大孩经历过升学压力', '对辅导班中立或负面', '主动复盘过去遗憾', '想为小孩更早规划'],
      productOpportunity: '把家庭包讲成「将大孩经验转化为小孩的提前准备」：真人老师确定方向，AI 定制班落实日常安排，并用分孩子学情持续外化效果。',
    },
    story: {
      banner: '合肥张妈妈 —— 两个孩子有主次，会在节点转化',
      region: '安徽合肥',
      combo: '四年级 & 初三',
      role: '妈妈 · 从大孩经验转向小孩规划',
      status: '续购 · 家庭包首购',
      coreFeature: '尽管希望都兼顾，但两个孩子有主次之分（初中 > 小学 > 高中），且会在特定节点发生需求转化。',
      family: [
        { k: '姐姐', v: '初三临近中考，理科偏弱，作业磨蹭到晚上 12 点。' },
        { k: '妹妹', v: '四年级，成绩较稳定，洋葱主要用于复习和寒暑假预习。' },
        { k: '过去经验', v: '此前课程主要为姐姐中考购买，但实际妹妹使用更多。' },
        { k: '长期计划', v: '希望妹妹借助工具提前学，初中阶段尽量少补课。' },
      ],
      chartTitle: '家庭逻辑 · 从大孩经验迁移到小孩',
      chart: {
        type: 'transfer',
        source: { title: '大孩经历', points: ['中考压力与理科短板', '买过冲刺包但没有持续使用', '小升初缺少提前准备'] },
        bridge: '家长复盘：哪些准备可以更早发生？',
        target: { title: '小孩规划', points: ['寒暑假提前预习', '学期中用 AI 定制班复习', '长期覆盖到高中毕业'] },
      },
      onion: {
        purpose: '把大孩经历过的升学压力和补课成本转化为妹妹更早的学习规划，希望长期借助工具而不是依赖线下补课。',
        positives: ['课程覆盖小初高，像图书馆一样可长期使用。', 'AI 定制班能规定每天学什么。'],
        concerns: ['姐姐买过却没看，担心妹妹将来也用不起来。', '需要持续看到每个孩子的学习效果。'],
      },
      narrative: [
        {
          heading: '两个孩子的需求会随升学节点发生转换',
          points: [
            { text: '姐姐进入高中后，家长判断自己的精力会更多转向妹妹。', quote: '姐姐上高中没精力管他了，会把更多精力放在小的身上。' },
          ],
        },
        {
          heading: '家长算的不是标价，而是综合成本',
          points: [
            { text: '时间、接送和私教价格共同构成家庭对“划算”的判断。', quote: '不需要接送，孩子也不用赶路，时间成本也没有，还比私教班便宜，私教班一门就一万多。' },
          ],
        },
        {
          heading: '真正推动长期准备的，是对大孩经历的复盘',
          points: [
            { text: '过去没有在关键节点提前准备，成为家长希望妹妹少走弯路的直接原因。', quote: '小升初的时候没有给报，现在想起来有点后悔。' },
          ],
        },
      ],
    },
  },
  {
    id: 'resource-reserve',
    index: '04',
    accent: '#9A6B2F',
    name: '资源预置囤课型',
    keyword: '长期预置',
    tagline: '把家庭包当作覆盖多个孩子、多个学段的家庭学习资源库',
    portrait: {
      image: '/family-stories/resource-reserve.png',
      imageAlt: '爸爸与六年级姐姐、一年级弟弟共享家庭学习资源',
      definition: '关注“能学到高中 / 高考”“多个孩子都能用”；没有明确学业危机，但希望提前把资源准备好，以全科、长期和多孩复用建立性价比。',
      boundary: '和「大孩经验迁移型」不同：这类家庭不一定经历过明确的升学踩坑，购买更像一次家庭资源配置；能否多人使用、长期不浪费，是方案成立的基础。',
      attributes: [
        { icon: Users, label: '家庭与学情特征', value: '两个或多个孩子跨学段，希望资源能覆盖到高中。' },
        { icon: Target, label: '购买需求', value: '提前备好全科内容，多个孩子按需要使用，避免未来分开购买。' },
        { icon: AlertTriangle, label: '核心顾虑', value: '时间太长孩子能否坚持、多人能否同时使用、学情能否分开查看。' },
        { icon: Heart, label: '决策偏好', value: '看重可信推荐、完整资源和多人复用形成的整体性价比。' },
      ],
      signals: ['多个孩子都能用', '关注能否学到高中', '想一步到位', '高度关注账号与并发规则'],
      productOpportunity: '把全科、长期、多人使用讲成具体的家庭资源配置方案，同时明确并发、家庭组和分孩子学情规则，避免“买得到但一起用不了”。',
    },
    story: {
      banner: '九江刘爸爸 —— 先把资源准备好，再让两个孩子各自用起来',
      region: '江西九江',
      combo: '一年级 & 六年级',
      role: '爸爸 · 主导资源选择',
      status: '家庭包首购',
      coreFeature: '希望 2 个孩子同时用到极致。基础要求：孩子愿意看；进阶要求：理科全学好；理想要求：2 个孩子全科覆盖学好。',
      family: [
        { k: '姐姐', v: '六年级，各科 95 分以上；暑假准备提前学初中。' },
        { k: '弟弟', v: '一年级，课内成绩跟得上，对数字较强。' },
        { k: '购买触发', v: '没有具体学习问题，主要来自第三方教育规划推荐和提前准备。' },
        { k: '基础条件', v: '两个孩子能一起用、账号不冲突，否则家庭包不成立。' },
      ],
      chartTitle: '价值逻辑 · 家庭学习资源库',
      chart: {
        type: 'library',
        factors: [
          { title: '两个孩子', desc: '姐姐准备初中，弟弟从小学开始使用。' },
          { title: '全科内容', desc: '基础目标学好理科，理想状态覆盖全科。' },
          { title: '六年周期', desc: '现在准备好，未来需要时不用重新购买。' },
        ],
        result: '家庭资源库价值：多人可用 × 内容完整 × 长期覆盖',
      },
      onion: {
        purpose: '一步到位准备两个孩子未来需要的学习内容，优先学好理科，并尽可能发挥全科资源价值。',
        positives: ['第三方教育规划推荐提高了信任。', '全科、长期覆盖能减少未来重复购买。'],
        concerns: ['两个孩子能否同时使用是基础条件。', '长期课程能否坚持、用不好能否退。'],
      },
      narrative: [
        {
          heading: '购买首先建立在可信推荐之上',
          points: [
            { text: '家长不太相信销售自我推荐，更相信第三方规划者的判断。', quote: '阿刘教育规划训练营，没有非常大力推销，只是单纯说这个好、提供链接，从客观公正的角度说，比起销售更相信他。' },
          ],
        },
        {
          heading: '家庭包要发挥价值，必须让两个孩子都能使用',
          points: [
            { text: '对这个家庭来说，多孩复用不是附加权益，而是购买家庭包的核心前提。', quote: '希望 2 个孩子一起用，账号不会相互冲突，希望能发挥到最大的功效。' },
          ],
        },
        {
          heading: '多人并发规则会直接决定是否购买',
          points: [
            { text: '如果两个孩子不能同时学习，长期和全科带来的性价比会立即失去意义。', quote: '如果 2 个不能同时用，就不考虑了。' },
          ],
        },
      ],
    },
  },
];

const soft = (color: string) => `${color}14`;

export default function TypicalFamilyStories() {
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const sectionRefs = React.useRef<Record<string, HTMLElement | null>>({});
  const [activeId, setActiveId] = React.useState(PERSONAS[0].id);
  const activeAccent = PERSONAS.find((persona) => persona.id === activeId)?.accent ?? PERSONAS[0].accent;

  React.useEffect(() => {
    const root = scrollRef.current;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target instanceof HTMLElement && visible.target.dataset.id) setActiveId(visible.target.dataset.id);
      },
      { root, rootMargin: '-45% 0px -45% 0px', threshold: [0, 0.2, 0.5, 1] },
    );
    Object.values(sectionRefs.current).forEach((element) => element && observer.observe(element));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="flex h-full flex-col bg-[#f8f8f5]">
      <div ref={scrollRef} className="min-h-0 flex-1 overflow-y-auto">
        <div className="sticky top-0 z-20 border-b border-[#e4e2da] bg-white/95 px-5 py-3 backdrop-blur md:px-8">
          <div className="mx-auto max-w-[940px]">
            <div className="flex items-center gap-2" style={{ color: activeAccent }}>
              <Sparkles size={15} />
              <span className="text-[11px] font-black tracking-[0.14em]">用户画像与典型家庭故事 · 家庭包</span>
            </div>
            <div className="mt-2.5 flex flex-wrap gap-1.5">
              {PERSONAS.map((persona) => {
                const active = persona.id === activeId;
                return (
                  <button
                    key={persona.id}
                    onClick={() => sectionRefs.current[persona.id]?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
                    className={cn('flex items-center gap-1.5 rounded-xl px-3 py-2 text-[12.5px] font-bold transition-all', active ? 'text-white shadow-sm' : 'bg-[#f4f1eb] text-[#6b655c] hover:bg-[#eee9e0]')}
                    style={active ? { background: persona.accent } : undefined}
                  >
                    <span className="text-[10px] font-black" style={!active ? { color: persona.accent } : undefined}>{persona.index}</span>
                    {persona.name}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-[940px] px-5 md:px-8">
          {PERSONAS.map((persona) => (
            <section
              key={persona.id}
              data-id={persona.id}
              ref={(element) => { sectionRefs.current[persona.id] = element; }}
              className="scroll-mt-24 border-b border-[#e4e2da] py-9 last:border-0"
            >
              <TypeHero persona={persona} />
              <PortraitSection persona={persona} />
              <StorySection persona={persona} />
            </section>
          ))}
          <p className="my-10 rounded-xl border border-[#e4e2da] bg-[#f4f2ec] p-4 text-[11px] leading-5" style={{ color: MUTED }}>
            页面结构对齐“从小学物理”用户画像：先呈现一类家庭的画像、边界与业务机会，再用一户代表家庭还原决策机制。画像结论来自《家庭包用户购买决策洞察》，事实和原声来自对应家庭访谈。
          </p>
        </div>
      </div>
    </div>
  );
}

function TypeHero({ persona }: { persona: FamilyPersona }) {
  return (
    <motion.div {...reveal} className="flex items-end gap-3">
      <span className="text-5xl font-black leading-none md:text-6xl" style={{ color: persona.accent }}>{persona.index}</span>
      <div className="pb-1">
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="text-2xl font-black md:text-3xl" style={{ color: INK }}>{persona.name}</h1>
          <span className="rounded px-2 py-0.5 text-[11px] font-black" style={{ background: soft(persona.accent), color: persona.accent }}>{persona.keyword}</span>
        </div>
        <p className="mt-1.5 text-[14px] font-semibold text-[#4a453f]">{persona.tagline}</p>
      </div>
    </motion.div>
  );
}

function SectionHeader({ icon: Icon, label, subtitle, accent }: { icon: IconType; label: string; subtitle: string; accent: string }) {
  return (
    <div className="flex items-start gap-3 border-b border-[#e4e2da] pb-3">
      <span className="mt-1 grid h-8 w-8 shrink-0 place-items-center rounded-lg" style={{ background: soft(accent), color: accent }}><Icon size={16} /></span>
      <div>
        <h2 className="text-[17px] font-black" style={{ color: INK }}>{label}</h2>
        <p className="mt-0.5 text-[12.5px]" style={{ color: MUTED }}>{subtitle}</p>
      </div>
    </div>
  );
}

function PortraitSection({ persona }: { persona: FamilyPersona }) {
  const { portrait, accent } = persona;
  return (
    <section className="mt-8">
      <SectionHeader icon={Users} label="用户画像" subtitle={`${persona.name}：是谁、要什么、担心什么、如何决策`} accent={accent} />
      <motion.div {...reveal} className="mt-5 grid overflow-hidden rounded-2xl border border-[#e4e2da] bg-white shadow-sm md:grid-cols-[280px_1fr]">
        <figure className="flex items-center justify-center bg-[#faf9f6] p-3">
          <img src={`${BASE_PATH}${portrait.image}`} alt={portrait.imageAlt} className="max-h-[440px] w-full rounded-xl object-contain md:max-h-[390px]" loading="lazy" />
        </figure>
        <div className="flex flex-col justify-center p-5 md:p-8">
          <div className="flex items-center gap-2 text-[11px] font-black tracking-[0.12em]" style={{ color: accent }}><span className="h-2 w-2 rounded-full" style={{ background: accent }} />一句话认识这类家庭</div>
          <p className="mt-4 text-[17px] font-black leading-9 md:text-[20px]" style={{ color: INK }}>{portrait.definition}</p>
          <div className="mt-5 h-px w-12" style={{ background: `${accent}66` }} />
          <p className="mt-4 text-[13px] font-semibold leading-7" style={{ color: MUTED }}>{persona.tagline}</p>
        </div>
      </motion.div>

      <div className="mt-7 flex items-end justify-between">
        <div><div className="text-[14px] font-black" style={{ color: INK }}>画像四维</div><p className="mt-1 text-[12px]" style={{ color: MUTED }}>从家庭学情、需求、顾虑与决策偏好快速识别</p></div>
        <span className="text-[11px] font-black" style={{ color: accent }}>01—04</span>
      </div>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        {portrait.attributes.map((attribute, index) => {
          const Icon = attribute.icon;
          return (
            <motion.div {...reveal} transition={{ ...reveal.transition, delay: index * 0.05 }} key={attribute.label} className="rounded-xl border border-[#e7e5de] bg-white p-4 md:p-5">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2" style={{ color: accent }}><span className="grid h-7 w-7 place-items-center rounded-lg" style={{ background: soft(accent) }}><Icon size={14} /></span><span className="text-[12px] font-black">{attribute.label}</span></div>
                <span className="text-[10px] font-black" style={{ color: `${accent}88` }}>0{index + 1}</span>
              </div>
              <p className="mt-3 text-[13px] leading-7 text-[#4a453f]">{attribute.value}</p>
            </motion.div>
          );
        })}
      </div>

      <motion.div {...reveal} className="mt-5 rounded-xl border border-[#e4e2da] bg-[#faf9f6] p-4 md:p-5">
        <div className="flex items-start gap-3"><GitCompare size={15} className="mt-1 shrink-0" style={{ color: MUTED }} /><div><div className="text-[12px] font-black" style={{ color: INK }}>辅助判断 · 与其他类型的边界</div><p className="mt-2 text-[13px] leading-7 text-[#5c564f]">{portrait.boundary}</p></div></div>
        <div className="my-4 h-px bg-[#e4e2da]" />
        <div className="mb-2 text-[11px] font-black tracking-wide" style={{ color: MUTED }}>典型识别信号</div>
        <div className="flex flex-wrap gap-2">{portrait.signals.map((signal) => <span key={signal} className="rounded-lg border bg-white px-3 py-2 text-[12px] font-semibold" style={{ borderColor: `${accent}44`, color: '#4a453f' }}>{signal}</span>)}</div>
      </motion.div>

      <motion.div {...reveal} className="relative mt-5 overflow-hidden rounded-xl border p-5 md:p-6" style={{ borderColor: `${accent}55`, background: soft(accent) }}>
        <span className="absolute inset-y-0 left-0 w-1" style={{ background: accent }} />
        <div className="flex items-center gap-2" style={{ color: accent }}><Lightbulb size={15} /><span className="text-[12px] font-black tracking-wide">行动建议 · 业务机会</span></div>
        <p className="mt-3 text-[14px] font-semibold leading-8 text-[#332f2a]">{portrait.productOpportunity}</p>
      </motion.div>
    </section>
  );
}

function StorySection({ persona }: { persona: FamilyPersona }) {
  const { story, accent } = persona;
  return (
    <section className="mt-12">
      <SectionHeader icon={BookOpenCheck} label="典型家庭故事" subtitle="该类型中的一户代表家庭 · 真实访谈还原" accent={STORY} />
      <motion.div {...reveal} className="mt-5 rounded-xl px-5 py-5 text-center" style={{ background: STORY }}>
        <h3 className="text-[16px] font-black leading-snug text-white md:text-[19px]">{story.banner}</h3>
        <p className="mt-1.5 text-[12px] font-semibold text-white/80">{story.region} · {story.combo} · {story.role} · {story.status}</p>
      </motion.div>
      <motion.div {...reveal} className="mt-4 grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-dashed border-[#cbc7bf] bg-white p-4 md:p-5">
          <div className="text-[12px] font-black" style={{ color: STORY }}>家庭情况</div>
          <dl className="mt-3 space-y-2">{story.family.map((row) => <div key={row.k} className="flex gap-2 text-[13px] leading-6"><dt className="w-20 shrink-0 font-bold text-[#6b655c]">{row.k}</dt><dd className="flex-1 text-[#4a453f]">{row.v}</dd></div>)}</dl>
        </div>
        <div className="rounded-xl border p-4 md:p-5" style={{ borderColor: `${accent}44`, background: soft(accent) }}>
          <div className="text-[12px] font-black" style={{ color: accent }}>核心特征</div>
          <p className="mt-3 text-[14px] font-semibold leading-8" style={{ color: INK }}>{story.coreFeature}</p>
        </div>
      </motion.div>

      <div className="mt-6"><div className="mb-3 flex items-center gap-2"><span className="h-5 w-1 rounded-full" style={{ background: accent }} /><h4 className="text-[14px] font-black" style={{ color: INK }}>{story.chartTitle}</h4></div><DecisionChartView chart={story.chart} accent={accent} /></div>
      <OnionBlock onion={story.onion} />
      <NarrativeBlock narrative={story.narrative} accent={accent} />
    </section>
  );
}

function DecisionChartView({ chart, accent }: { chart: DecisionChart; accent: string }) {
  if (chart.type === 'flow' || chart.type === 'ladder') {
    return (
      <motion.div {...reveal} className="rounded-2xl border border-[#e7e5de] bg-white p-5 md:p-7">
        <div className="grid items-stretch gap-3 md:grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr]">
          {chart.nodes.map((node, index) => (
            <React.Fragment key={node.title}>
              <div className={cn('rounded-xl border p-4', chart.type === 'ladder' && ['md:mt-12', 'md:mt-8', 'md:mt-4', 'md:mt-0'][index])} style={{ borderColor: `${accent}55`, background: index === 0 ? soft(accent) : '#fff', borderBottomWidth: chart.type === 'ladder' ? 3 : 1, borderBottomColor: accent }}>
                <span className="text-[10px] font-black" style={{ color: accent }}>0{index + 1}</span><h5 className="mt-1 text-[13.5px] font-black" style={{ color: INK }}>{node.title}</h5><p className="mt-2 text-[12px] leading-6 text-[#5c564f]">{node.desc}</p>
              </div>
              {index < chart.nodes.length - 1 && <div className="flex items-center justify-center"><ArrowRight size={18} className="rotate-90 md:rotate-0" style={{ color: `${accent}88` }} /></div>}
            </React.Fragment>
          ))}
        </div>
        <p className="mt-4 rounded-xl px-4 py-3 text-center text-[12px] font-semibold leading-6" style={{ background: soft(accent), color: '#5c4a40' }}>{chart.note}</p>
      </motion.div>
    );
  }
  if (chart.type === 'transfer') {
    return (
      <motion.div {...reveal} className="grid items-stretch gap-3 rounded-2xl border border-[#e7e5de] bg-white p-5 md:grid-cols-[1fr_auto_1fr] md:p-7">
        <div className="rounded-xl border p-4" style={{ borderColor: `${accent}55`, background: soft(accent) }}>
          <h5 className="text-[14px] font-black" style={{ color: accent }}>{chart.source.title}</h5>
          <ul className="mt-3 space-y-2">{chart.source.points.map((point) => <li key={point} className="flex gap-2 text-[12.5px] leading-6 text-[#4a453f]"><CheckCircle2 size={13} className="mt-1 shrink-0" style={{ color: accent }} />{point}</li>)}</ul>
        </div>
        <div className="flex flex-col items-center justify-center gap-2 text-center"><ArrowRight size={22} className="rotate-90 md:rotate-0" style={{ color: accent }} /><span className="max-w-[150px] text-[11px] font-bold leading-5" style={{ color: MUTED }}>{chart.bridge}</span></div>
        <div className="rounded-xl border p-4" style={{ borderColor: `${accent}55`, background: soft(accent) }}>
          <h5 className="text-[14px] font-black" style={{ color: accent }}>{chart.target.title}</h5>
          <ul className="mt-3 space-y-2">{chart.target.points.map((point) => <li key={point} className="flex gap-2 text-[12.5px] leading-6 text-[#4a453f]"><CheckCircle2 size={13} className="mt-1 shrink-0" style={{ color: accent }} />{point}</li>)}</ul>
        </div>
      </motion.div>
    );
  }
  return (
    <motion.div {...reveal} className="rounded-2xl border border-[#e7e5de] bg-white p-5 md:p-7">
      <div className="grid gap-3 md:grid-cols-3">{chart.factors.map((factor, index) => <div key={factor.title} className="rounded-xl border p-4" style={{ borderColor: `${accent}55`, background: soft(accent) }}><span className="text-[10px] font-black" style={{ color: accent }}>0{index + 1}</span><h5 className="mt-1 text-[14px] font-black" style={{ color: INK }}>{factor.title}</h5><p className="mt-2 text-[12.5px] leading-6 text-[#5c564f]">{factor.desc}</p></div>)}</div>
      <div className="mt-4 flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-center text-[13px] font-black text-white" style={{ background: accent }}><ShieldCheck size={16} />{chart.result}</div>
    </motion.div>
  );
}

function OnionBlock({ onion }: { onion: FamilyPersona['story']['onion'] }) {
  return (
    <motion.div {...reveal} className="mt-6 rounded-xl border border-[#e7e5de] bg-white p-4 md:p-5">
      <div className="flex items-center gap-2"><span className="h-5 w-1 rounded-full" style={{ background: STORY }} /><h4 className="text-[14px] font-black" style={{ color: INK }}>使用洋葱的目的 & 评价</h4></div>
      <p className="mt-3 text-[13px] leading-7 text-[#4a453f]">{onion.purpose}</p>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div className="rounded-lg border border-[#cfe6dc] bg-[#f2f8f5] p-3"><div className="flex items-center gap-2 text-[12px] font-black text-[#2F8272]"><CheckCircle2 size={14} />认可点</div><ul className="mt-2 space-y-1.5">{onion.positives.map((item) => <li key={item} className="text-[12.5px] leading-6 text-[#4a453f]">{item}</li>)}</ul></div>
        <div className="rounded-lg border border-[#f0d6cd] bg-[#fdf4ee] p-3"><div className="flex items-center gap-2 text-[12px] font-black text-[#C9622E]"><AlertTriangle size={14} />顾虑点</div><ul className="mt-2 space-y-1.5">{onion.concerns.map((item) => <li key={item} className="text-[12.5px] leading-6 text-[#4a453f]">{item}</li>)}</ul></div>
      </div>
    </motion.div>
  );
}

function NarrativeBlock({ narrative, accent }: { narrative: FamilyPersona['story']['narrative']; accent: string }) {
  return (
    <div className="mt-6">
      <div className="mb-3 flex items-center gap-2"><span className="h-5 w-1 rounded-full" style={{ background: STORY }} /><h4 className="text-[14px] font-black" style={{ color: INK }}>访谈还原 · 她 / 他为什么这样选</h4></div>
      <ol className="relative space-y-4 border-l-2 pl-6" style={{ borderColor: `${accent}33` }}>
        {narrative.map((segment, index) => (
          <motion.li {...reveal} transition={{ ...reveal.transition, delay: index * 0.05 }} key={segment.heading} className="relative">
            <span className="absolute -left-[31px] top-0.5 grid h-5 w-5 place-items-center rounded-full text-[10px] font-black text-white" style={{ background: accent }}>{index + 1}</span>
            <h5 className="text-[16px] font-black" style={{ color: INK }}>{segment.heading}</h5>
            {segment.intro && <p className="mt-1.5 text-[14px] font-semibold leading-8 text-[#33302b]">{segment.intro}</p>}
            <div className="mt-2 space-y-2.5">{segment.points.map((point, pointIndex) => <div key={pointIndex} className="space-y-1.5"><div className="flex items-start gap-2"><span className="mt-[11px] h-1 w-1 shrink-0 rounded-full" style={{ background: `${accent}99` }} /><p className="text-[13.5px] font-medium leading-7 text-[#4a453f]">{point.text}</p></div>{point.quote && <blockquote className="ml-4 flex gap-2 rounded-lg px-3.5 py-2.5 text-[12.5px] italic leading-7" style={{ background: soft(accent), color: '#746e67' }}><Quote size={14} className="mt-1 shrink-0" style={{ color: accent }} /><span>「{point.quote}」</span></blockquote>}</div>)}</div>
          </motion.li>
        ))}
      </ol>
    </div>
  );
}
