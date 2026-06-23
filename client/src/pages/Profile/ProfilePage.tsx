import React from 'react';
import {
  BarChart3,
  BookOpenCheck,
  Brain,
  ChevronRight,
  Home,
  Layers,
  Pencil,
  Quote,
  Save,
  School,
  Target,
  Users,
} from 'lucide-react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { toast } from 'sonner';
import { useIsEditor } from '../../components/auth/PasswordGate';
import { DEFAULT_PORTRAITS, PORTRAIT_FRAMEWORK } from '../../store/portraitDefaults';
import { fetchPortrait, savePortrait } from '../../api/research';
import type { PortraitData, PortraitPersona, PortraitSnapshot } from '../../types/research';

const PROFILE_PROJECT_ID = 'default_project';
const CHART_COLORS = ['#e65532', '#2f6f9f', '#56a383', '#b58a43', '#8b6bb8', '#b8667a'];

const dimensionFields: Array<{ key: keyof PortraitPersona; label: string }> = [
  { key: 'educationPhilosophy', label: '教育理念' },
  { key: 'investment', label: '投入程度' },
  { key: 'decisionStyle', label: '决策方式' },
];

type ProfileMode = 'overview' | 'portrait' | 'learning';
type PersonaRole = '家长' | '学生' | '家庭决策';
type PersonaStage = '小学' | '初中' | '高中';
type DemandType = '兴趣习惯' | '错题提效' | '补弱巩固' | '备考提分' | '规划解惑' | '情绪支持';

interface LearningPain {
  tag: string;
  title: string;
  detail: string;
  quotes: Array<{ text: string; source: string }>;
  solution: string;
}

interface GradeLearningInsight {
  grade: string;
  phase: string;
  color: string;
  summary: string;
  pains: LearningPain[];
}

interface CrossLearningInsight {
  stage: string;
  title: string;
  summary: string;
  keywords: string[];
  quotes: Array<{ text: string; source: string }>;
}

interface PersonaSummary {
  persona: PortraitPersona;
  role: PersonaRole;
  stage: PersonaStage;
  demandType: DemandType;
  tags: string[];
}

const LEARNING_INSIGHTS: GradeLearningInsight[] = [
  {
    grade: '学前',
    phase: '启蒙前置',
    color: '#4f74b8',
    summary: '低龄孩子不是没有兴趣，而是识字、读题和理解能力还没准备好，家长更怕过早拔高破坏兴趣。',
    pains: [
      {
        tag: '兴趣启蒙',
        title: '喜欢看动画，但看不懂练习和题目',
        detail: '学前阶段的核心痛点不是内容不足，而是孩子识字少、读题弱，动画能吸引注意力，练习却需要家长陪读。',
        quotes: [
          { text: '洋葱一年级课程，孩子看过一点点很喜欢看，但我感觉他看不懂，就没让他继续看。', source: '中班 · 998 · 上海奉贤' },
          { text: '他才四岁多，很多字都不认识；一上课马上有练习，他不会读题，读题还要家长守着他读。', source: '中班 · 家庭包 · 湖南长沙' },
        ],
        solution: '低龄内容应更像启蒙陪伴：少文字、轻练习、强互动，让孩子先建立兴趣和理解信心。',
      },
      {
        tag: '避免拔苗',
        title: '家长不急着学快，更在意别把兴趣磨掉',
        detail: '启蒙阶段的家长更谨慎，接受“接触”和“喜欢”，但抗拒过早提速、过早应试化。',
        quotes: [
          { text: '一年级没必要拔苗助长这么快，你要让他感兴趣，先把兴趣提上来。', source: '启蒙观 · 998 · 北京大兴' },
        ],
        solution: '表达上少讲超前，更多强调兴趣、韵律、自然拼读和大百科式的轻量探索。',
      },
    ],
  },
  {
    grade: '一年级',
    phase: '入学适应',
    color: '#3f9b8f',
    summary: '一年级最关键的是进学习状态，家长既要陪又不能让屏幕和题目负担过重。',
    pains: [
      {
        tag: '习惯养成',
        title: '每天只能短时间学，多了就开始推脱',
        detail: '孩子刚入学，学习耐受度有限，家长希望用短视频帮助预习复习，但不愿制造额外压力。',
        quotes: [
          { text: '孩子推三阻四，我没那么多时间领着他学；每天十分钟看个数学视频还行，多了他就不愿意了。', source: '1年级 · 998 · 山东青岛' },
          { text: '目的是让他预习，主要学课内的，我先把课内学好了，再去拔高。', source: '1年级 · 998 · 山东青岛' },
        ],
        solution: '低年级路径要短、任务要轻，围绕课内预习复习建立“每天能完成”的稳定感。',
      },
      {
        tag: '护眼陪读',
        title: '识字少看不懂解析，家长担心盯屏太久',
        detail: '一年级对文字解析依赖低，家长也会控制屏幕时长，因此内容需要更清晰、更短、更可听。',
        quotes: [
          { text: '弟弟一年级，主要是课内复习预习、练计算，给他出一些计算练习册，没搞太多。', source: '1年级 · 家庭包 · 江西九江' },
        ],
        solution: '用大字、语音、动画和少量即时练习替代长解析，让孩子少依赖家长读题。',
      },
    ],
  },
  {
    grade: '二年级',
    phase: '效率分化',
    color: '#2f6f9f',
    summary: '二年级开始暴露作业效率和复看耐心问题，孩子愿意看第一遍，但不会主动回看补洞。',
    pains: [
      {
        tag: '作业效率',
        title: '边玩边写，作业拖到很晚',
        detail: '低年级作业拖拉会挤压睡眠和课外学习，家长希望先把状态调起来。',
        quotes: [
          { text: '每天写完作业就到十点了，中途还要看小猪佩奇休息，要三个小时。', source: '2年级 · 998 · 浙江杭州' },
        ],
        solution: '把放学后流程重构为“先看短内容进入状态，再做作业，再轻预习”，帮助缩短作业时间。',
      },
      {
        tag: '复看耐心',
        title: '第一遍能听，遇到不会题却不愿回看',
        detail: '动画的新鲜感能拉动首次学习，但错题复看和二次理解需要更明确的引导。',
        quotes: [
          { text: '他说懂了，但后面的题还是不懂，这个时候我就没办法让他再用你们这个方式弄懂。', source: '2年级 · 998 · 浙江杭州' },
          { text: '孩子只喜欢看第一遍的新鲜感，后面习题不会做时，就不爱再看第二遍。', source: '2年级 · 998 · 浙江杭州' },
        ],
        solution: '错题后应自动回到相关片段，并用更短的二次讲解降低复看门槛。',
      },
    ],
  },
  {
    grade: '三年级',
    phase: '三年级现象',
    color: '#7359a4',
    summary: '三年级是专注力、开放题、阅读理解和“到底怎么用产品”集中爆发的节点。',
    pains: [
      {
        tag: '专注力',
        title: '坐不住、拖拉、阅读量不够，家长陪伴方式也变难',
        detail: '家长既想纠正习惯，又怕一直提醒破坏专注力，学习陪伴开始变成高消耗任务。',
        quotes: [
          { text: '他好动好说话坐不住，前期总溜号，你不陪着提醒，作业就要写好久好久。', source: '3年级 · 998 · 辽宁沈阳' },
          { text: '老三习惯不如姐姐、做事拖拉、不爱阅读，经常没时间上洋葱。', source: '3年级 · 家庭包 · 广东湛江' },
        ],
        solution: '需要把任务拆小，并给家长可执行的陪伴节奏，而不是只给孩子一堆内容。',
      },
      {
        tag: '路径不清',
        title: '语文英语方向模糊，产品优势说不清就不会用',
        detail: '三年级家长开始比较各类学习资源，如果不知道洋葱在某科具体解决什么问题，就容易搁置。',
        quotes: [
          { text: '语文英语没有重点的方向，担心浪费时间没什么帮助，规划一直比较模糊。', source: '3年级 · 998 · 辽宁沈阳' },
          { text: '大部分产品都在等着我们自己去研究，没有指导，我们就没时间打开洋葱去研究它。', source: '3年级 · 998 · 北京东城' },
        ],
        solution: '每个年级需要给出“本周学什么、为什么学、学完看什么结果”的清晰路径。',
      },
    ],
  },
  {
    grade: '四年级',
    phase: '概念上台阶',
    color: '#b58a43',
    summary: '四年级难点开始从会不会做，转向概念是否真正理解、同类题能否迁移。',
    pains: [
      {
        tag: '抽象理解',
        title: '概念细节丢分，基础不牢影响后续迁移',
        detail: '知识开始抽象化，家长发现刷题前必须先把概念讲透，否则同类题换个问法就不会。',
        quotes: [
          { text: '基础首先是概念，先把概念弄懂，其他题都是从概念往外延伸的。', source: '4年级 · 998 · 河北唐山' },
          { text: '概念性的问题还不太会、见题少，期末主要丢分在概念细节上。', source: '4年级 · 998 · 河北唐山' },
        ],
        solution: '用动画把抽象概念具象化，再配同类题迁移，承接“理解到会做”的中间层。',
      },
      {
        tag: '错题提效',
        title: '同类题和错题归纳开始变重要',
        detail: '四年级家长已经会主动用练习册、打印机、AI 工具找同类题，说明错题提效需求明确。',
        quotes: [
          { text: '同一类型题可以做三道，刷够基础再推举一反三，有的练习册这个板块做得挺好，可以借鉴。', source: '4年级 · 998 · 河北唐山' },
        ],
        solution: '错题后自动归类、推荐同类题和举一反三，是四年级之后更可感知的价值。',
      },
    ],
  },
  {
    grade: '五年级',
    phase: '升学前置',
    color: '#b8667a',
    summary: '五年级难度和升学预期同步上升，家长开始要查漏补缺、校内同步和明确规划。',
    pains: [
      {
        tag: '小升初焦虑',
        title: '五下成绩波动，家长开始担心衔接和分班',
        detail: '高年级不再只是兴趣和习惯，成绩变化会快速转化为升学压力。',
        quotes: [
          { text: '上五年级之后感觉越来越难了，五下的成绩感觉有下滑。', source: '5年级 · 家庭包 · 浙江杭州' },
          { text: '小时候更注重兴趣，但到了四五年级、高年级，也要提前学一学，因为最终是要升学的。', source: '5年级 · 998 · 上海奉贤' },
        ],
        solution: 'AI 定制班和阶段规划要讲清楚“先复习、再预习、再查漏”的节奏。',
      },
      {
        tag: '查漏补缺',
        title: '家长需要知道薄弱点在哪，而不是泛泛多学',
        detail: '五年级开始更看重校内重难点、易错点和本地教材匹配。',
        quotes: [
          { text: '洋葱对校内做得挺细，重难点、易错点比天天练更细，还有沪教版。', source: '5年级 · 998 · 上海奉贤' },
          { text: '喜欢 AI 精准学，能知道孩子第一遍学时薄弱点在哪。', source: '5年级 · 998 · 上海奉贤' },
        ],
        solution: '把薄弱点诊断、校内版本匹配和阶段反馈做成家长能看懂的学情证据。',
      },
    ],
  },
  {
    grade: '六年级',
    phase: '小升初衔接',
    color: '#8b6bb8',
    summary: '六年级要为初中铺路，但时间有限，家长更偏好短、准、能讲透的同步预习。',
    pains: [
      {
        tag: '小升初衔接',
        title: '直播课太占时间，预习要更高效',
        detail: '六年级家长明确知道要预习初中，但不希望用长时直播挤压孩子时间。',
        quotes: [
          { text: '高途上课时间太久，每天两个小时一科；初中没有这么多时间去看。', source: '6年级 · 家庭包 · 广东广州' },
          { text: '暑假先衔接、先预习，到了初中周末也是预习。', source: '6年级 · 家庭包 · 广东广州' },
        ],
        solution: '短视频同步预习和明确衔接路径，是六年级最容易被理解的价值。',
      },
      {
        tag: '抽象具象化',
        title: '抽象知识难理解，刷题前要先讲透',
        detail: '六年级开始对动画讲解的价值感明显增强，家长关注能不能把抽象知识变具体。',
        quotes: [
          { text: '我担心他一知半解、半懂不懂，老师讲的就不是很懂。', source: '6年级 · 家庭包 · 广东深圳' },
          { text: '把一个抽象的东西具体化，对小孩的理解很有帮助。', source: '6年级 · 家庭包 · 广东深圳' },
        ],
        solution: '强化“讲透概念，再做题”的路径，把动画理解和题目迁移连接起来。',
      },
    ],
  },
  {
    grade: '初一',
    phase: '初中适应',
    color: '#566f8f',
    summary: '初一是科目骤增、节奏变快和青春期叠加的阶段，家长希望孩子能更自主地跟上。',
    pains: [
      {
        tag: '科目骤增',
        title: '初中科目变多，孩子需要更清晰的学习节奏',
        detail: '初一不只是难度上升，也是管理方式变化，家长无法像小学一样盯全过程。',
        quotes: [
          { text: '马上初中了，想在暑假利用这些学习资源让他提前学一下。', source: '6年级升初一 · 家庭包 · 江西九江' },
          { text: '希望把学习习惯各方面带起来，自己能有那种内驱力。', source: '6年级升初一 · 家庭包 · 江西九江' },
        ],
        solution: '给初一学生清晰的预习、复习、错题闭环，帮助家长从陪学转为看学情。',
      },
    ],
  },
  {
    grade: '初二',
    phase: '分化加速',
    color: '#a26f4a',
    summary: '初二进入分化期，题目难度和知识综合度上升，解惑效率和错题归纳成为关键。',
    pains: [
      {
        tag: '解题效率',
        title: '难题不能每道都靠一对一，孩子需要即时解惑',
        detail: '初中阶段时间更紧，家长很难逐题陪练，也难以长期承担高频一对一。',
        quotes: [
          { text: '数学压轴题攻不下，又请不起一对一。', source: '初中 · 998 首购调研' },
        ],
        solution: '围绕错题、压轴题和专题讲解提供高效解惑入口，减少家长找资源成本。',
      },
    ],
  },
  {
    grade: '初三',
    phase: '中考冲刺',
    color: '#c05f4a',
    summary: '初三核心是备考压力和提分效率，学生需要可执行的方法，而不是泛泛刷题。',
    pains: [
      {
        tag: '备考压力',
        title: '时间紧、压力大，需要明确提分方法',
        detail: '冲刺阶段的痛点不是有没有内容，而是能不能快速定位薄弱点、掌握答题方法并稳定情绪。',
        quotes: [
          { text: '我知道我不懂的知识点，洋葱能很好帮我弄明白，但是我没有时间看完。', source: '高中画像延伸 · 备考压力' },
        ],
        solution: '初三内容要更像备考工具：专题、错题、薄弱点、答题方法和短平快复习路径。',
      },
    ],
  },
];

const CROSS_LEARNING_INSIGHTS: CrossLearningInsight[] = [
  {
    stage: '低龄阶段',
    title: '兴趣和可理解性优先',
    summary: '学前到一二年级，孩子的学习痛点不是“缺内容”，而是识字少、读题弱、坐不住，家长陪读成本高。',
    keywords: ['兴趣启蒙', '看不懂', '陪读成本'],
    quotes: [
      { text: '他才四岁多，很多字都不认识；一上课马上有练习，他不会读题，读题还要家长守着他读。', source: '中班 · 家庭包 · 湖南长沙' },
      { text: '孩子推三阻四，我没那么多时间领着他学；每天十分钟看个数学视频还行。', source: '1年级 · 998 · 山东青岛' },
    ],
  },
  {
    stage: '小学中段',
    title: '习惯和效率开始分化',
    summary: '二三年级之后，作业拖拉、专注力、错题复看和学习路径不清开始拉开差距，家长需要的不只是内容，而是怎么用。',
    keywords: ['作业效率', '专注力', '路径不清'],
    quotes: [
      { text: '每天写完作业就到十点了，中途还要看小猪佩奇休息，要三个小时。', source: '2年级 · 998 · 浙江杭州' },
      { text: '大部分产品都在等着我们自己去研究，没有指导，我们就没时间打开洋葱去研究它。', source: '3年级 · 998 · 北京东城' },
    ],
  },
  {
    stage: '小学高段',
    title: '校内同步和升学衔接变强',
    summary: '四到六年级，痛点从“愿不愿意学”转向“能不能学懂、学准、接上初中”，查漏补缺和抽象理解变得关键。',
    keywords: ['查漏补缺', '抽象理解', '小升初衔接'],
    quotes: [
      { text: '基础首先是概念，先把概念弄懂，其他题都是从概念往外延伸的。', source: '4年级 · 998 · 河北唐山' },
      { text: '高途上课时间太久，每天两个小时一科；初中没有这么多时间去看。', source: '6年级 · 家庭包 · 广东广州' },
    ],
  },
  {
    stage: '初中阶段',
    title: '解题效率和应试压力成为核心',
    summary: '初中阶段科目增多、时间变紧，压轴题、错题归纳、专题提分和情绪压力会成为更直接的学习痛点。',
    keywords: ['压轴题', '错题归纳', '备考压力'],
    quotes: [
      { text: '数学压轴题攻不下，又请不起一对一。', source: '初中 · 998 首购调研' },
      { text: '我知道我不懂的知识点，洋葱能很好帮我弄明白，但是我没有时间看完。', source: '备考画像 · 高压学习场景' },
    ],
  },
];

const LEARNING_KEYWORDS = ['兴趣启蒙', '习惯养成', '作业效率', '抽象理解', '错题提效', '小升初衔接', '压轴题', '备考压力'];

function fallbackSnapshot(): PortraitSnapshot {
  return {
    projectId: PROFILE_PROJECT_ID,
    data: DEFAULT_PORTRAITS[PROFILE_PROJECT_ID] ?? {
      framework: PORTRAIT_FRAMEWORK,
      personas: [],
      source: '小学用户画像调研报告、初中用户画像调研报告、高中用户画像调研报告',
      updatedBy: '编辑者',
    },
    version: 0,
    updatedAt: new Date(0).toISOString(),
  };
}

export default function ProfilePage() {
  const editor = useIsEditor();
  const [mode, setMode] = React.useState<ProfileMode>('overview');
  const [snapshot, setSnapshot] = React.useState<PortraitSnapshot>(() => fallbackSnapshot());
  const [activePersonaId, setActivePersonaId] = React.useState('');
  const [draft, setDraft] = React.useState<PortraitData | null>(null);
  const [editing, setEditing] = React.useState(false);
  const [saving, setSaving] = React.useState(false);

  React.useEffect(() => {
    let cancelled = false;
    fetchPortrait(PROFILE_PROJECT_ID)
      .then((remote) => {
        if (!cancelled) setSnapshot(remote ?? fallbackSnapshot());
      })
      .catch(() => {
        if (!cancelled) setSnapshot(fallbackSnapshot());
      });
    return () => { cancelled = true; };
  }, []);

  const data = draft ?? snapshot.data;
  const activePersona = data.personas.find((persona) => persona.id === activePersonaId) ?? data.personas[0];
  const personaSummaries = React.useMemo(() => buildPersonaSummaries(data.personas), [data.personas]);
  const dashboard = React.useMemo(() => buildProfileDashboard(personaSummaries), [personaSummaries]);

  React.useEffect(() => {
    setActivePersonaId(snapshot.data.personas[0]?.id ?? '');
    setDraft(null);
    setEditing(false);
  }, [snapshot.projectId, snapshot.updatedAt, snapshot.version]);

  const updatePersona = (patch: Partial<PortraitPersona>) => {
    if (!activePersona) return;
    const next = structuredClone(data);
    next.personas = next.personas.map((persona) =>
      persona.id === activePersona.id ? { ...persona, ...patch } : persona,
    );
    setDraft(next);
  };

  const handleSave = async () => {
    if (!draft) return;
    setSaving(true);
    try {
      const saved = await savePortrait(PROFILE_PROJECT_ID, draft, snapshot.version);
      setSnapshot(saved);
      setDraft(null);
      setEditing(false);
      toast.success('画像报告已保存');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : '保存失败');
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="flex-1 min-h-0 overflow-y-auto bg-[#f8f8f5]">
      <div className="mx-auto max-w-[1440px] px-5 py-5">
        <div className="flex flex-wrap items-end justify-between gap-4 border-b border-[#dddcd5] pb-4">
          <div>
            <div className="flex items-center gap-2 text-[#e65532]">
              <Users size={18} />
              <span className="text-xs font-bold">INSIGHTHUB PROFILE</span>
            </div>
            <h1 className="mt-1 text-2xl font-bold text-[#252525]">用户画像</h1>
            <p className="mt-1 text-sm text-[#6f6f68]">基于小学、初中、高中三份画像报告，呈现画像类型结构与业务重点。</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex h-9 rounded-md border border-[#d8d7d0] bg-white p-1">
              <button
                onClick={() => setMode('overview')}
                className={`flex items-center gap-1.5 rounded px-3 text-xs font-semibold ${mode === 'overview' ? 'bg-[#252525] text-white' : 'text-[#666]'}`}
              >
                <Layers size={13} />结构看板
              </button>
              <button
                onClick={() => setMode('portrait')}
                className={`flex items-center gap-1.5 rounded px-3 text-xs font-semibold ${mode === 'portrait' ? 'bg-[#252525] text-white' : 'text-[#666]'}`}
              >
                <BookOpenCheck size={13} />画像详情
              </button>
              <button
                onClick={() => setMode('learning')}
                className={`flex items-center gap-1.5 rounded px-3 text-xs font-semibold ${mode === 'learning' ? 'bg-[#252525] text-white' : 'text-[#666]'}`}
              >
                <Brain size={13} />学情分析
              </button>
            </div>
            {mode === 'portrait' && editor && !editing && (
              <button onClick={() => { setDraft(structuredClone(snapshot.data)); setEditing(true); }} className="flex h-9 items-center gap-1.5 rounded-md bg-[#e65532] px-3 text-xs font-bold text-white">
                <Pencil size={13} />编辑画像
              </button>
            )}
            {mode === 'portrait' && editing && (
              <>
                <button onClick={() => { setDraft(null); setEditing(false); }} className="h-9 rounded-md border border-[#d8d7d0] bg-white px-3 text-xs font-semibold">取消</button>
                <button disabled={saving} onClick={handleSave} className="flex h-9 items-center gap-1.5 rounded-md bg-[#e65532] px-3 text-xs font-bold text-white disabled:opacity-50">
                  <Save size={13} />{saving ? '保存中' : '保存'}
                </button>
              </>
            )}
          </div>
        </div>

        <section className="grid grid-cols-2 gap-px border-x border-b border-[#dddcd5] bg-[#dddcd5] md:grid-cols-5">
          {PORTRAIT_FRAMEWORK.map((item, index) => (
            <div key={item} className="bg-white px-4 py-3">
              <div className="text-[10px] font-bold text-[#9a9991]">0{index + 1}</div>
              <div className="mt-1 text-sm font-bold text-[#333]">{item}</div>
            </div>
          ))}
        </section>

        {mode === 'overview' ? (
          <ProfileOverview dashboard={dashboard} summaries={personaSummaries} source={data.source} />
        ) : mode === 'learning' ? (
          <LearningAnalysis />
        ) : (
          <section className="mt-5 grid min-h-[560px] gap-4 lg:grid-cols-[280px_minmax(0,1fr)]">
            <aside className="border border-[#dddcd5] bg-white">
              <div className="border-b border-[#e5e4de] px-4 py-3 text-xs font-bold text-[#777]">画像类型</div>
              {data.personas.length ? data.personas.map((persona) => (
                <button
                  key={persona.id}
                  onClick={() => setActivePersonaId(persona.id)}
                  className={`block w-full border-b border-[#efeee9] px-4 py-3 text-left ${activePersona?.id === persona.id ? 'bg-[#fff3ef]' : 'hover:bg-[#fafaf7]'}`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-sm font-bold text-[#30302d]">{persona.name}</span>
                    <span className="shrink-0 text-[10px] text-[#a05a46]">{inferPersonaStage(persona)}</span>
                  </div>
                  <p className="mt-1 line-clamp-2 text-xs leading-5 text-[#777]">{persona.definition}</p>
                </button>
              )) : (
                <div className="px-4 py-10 text-center text-sm text-[#999]">三份画像报告尚未建立画像</div>
              )}
            </aside>

            {activePersona && (
              <article className="border border-[#dddcd5] bg-white">
                <header className="flex flex-wrap items-start justify-between gap-4 border-b border-[#e5e4de] px-5 py-5">
                  <div className="min-w-0 flex-1">
                    {editing ? (
                      <>
                        <input value={activePersona.name} onChange={(e) => updatePersona({ name: e.target.value })} className="w-full border-b border-[#ccc] pb-1 text-xl font-bold outline-none" />
                        <textarea value={activePersona.definition} onChange={(e) => updatePersona({ definition: e.target.value })} className="mt-3 min-h-16 w-full rounded-md border border-[#ddd] p-2 text-sm" />
                      </>
                    ) : (
                      <>
                        <h2 className="text-xl font-bold text-[#252525]">{activePersona.name}</h2>
                        <p className="mt-2 max-w-3xl text-sm leading-6 text-[#666]">{activePersona.definition}</p>
                      </>
                    )}
                  </div>
                  <div className="flex items-center gap-2 rounded-md bg-[#f3f3ef] px-3 py-2">
                    <BarChart3 size={14} className="text-[#e65532]" />
                    {editing ? (
                      <input value={activePersona.distribution} onChange={(e) => updatePersona({ distribution: e.target.value })} className="w-32 bg-transparent text-xs font-bold outline-none" />
                    ) : <span className="text-xs font-bold">{activePersona.distribution}</span>}
                  </div>
                </header>

                <div className="grid gap-px bg-[#e5e4de] md:grid-cols-3">
                  {dimensionFields.map(({ key, label }) => (
                    <div key={key} className="bg-white p-5">
                      <div className="text-[11px] font-bold text-[#9a9991]">{label}</div>
                      {editing ? (
                        <textarea value={String(activePersona[key])} onChange={(e) => updatePersona({ [key]: e.target.value })} className="mt-2 min-h-24 w-full rounded-md border border-[#ddd] p-2 text-sm" />
                      ) : <p className="mt-2 text-sm leading-6 text-[#333]">{String(activePersona[key])}</p>}
                    </div>
                  ))}
                </div>

                <div className="grid gap-6 p-5 md:grid-cols-2">
                  <ListEditor title="核心需求" values={activePersona.coreNeeds} editing={editing} onChange={(coreNeeds) => updatePersona({ coreNeeds })} />
                  <ListEditor title="典型行为" values={activePersona.typicalBehaviors} editing={editing} onChange={(typicalBehaviors) => updatePersona({ typicalBehaviors })} />
                </div>
                <div className="border-t border-[#e5e4de] p-5">
                  <div className="mb-3 flex items-center gap-2 text-xs font-bold text-[#777]"><Quote size={14} />代表原声</div>
                  {activePersona.quotes.length ? activePersona.quotes.map((quote, index) => (
                    <blockquote key={index} className="mb-2 border-l-2 border-[#e65532] bg-[#fafaf7] px-4 py-3 text-sm leading-6 text-[#444]">“{quote}”</blockquote>
                  )) : <p className="text-sm text-[#999]">当前资料没有可核验的逐字原声，暂不补写。</p>}
                </div>
                <footer className="border-t border-[#e5e4de] bg-[#fafaf7] px-5 py-3 text-xs text-[#777]">
                  数据来源：{data.source} · {snapshot.version ? `版本 ${snapshot.version}` : '本地初始版本'}
                </footer>
              </article>
            )}
          </section>
        )}
      </div>
    </main>
  );
}

function inferPersonaStage(persona: PortraitPersona): PersonaStage {
  const text = `${persona.id} ${persona.name} ${persona.definition}`;
  if (/高中|高一|高二|高三/.test(text)) return '高中';
  if (/初中|初一|初二|初三|中考/.test(text)) return '初中';
  return '小学';
}

function inferPersonaRole(persona: PortraitPersona): PersonaRole {
  const text = `${persona.id} ${persona.name} ${persona.definition} ${persona.decisionStyle}`;
  if (/价值未被看见|价格|付费|购买|决策|续费/.test(text)) return '家庭决策';
  if (/家长|妈妈|爸爸/.test(text)) return '家长';
  return '学生';
}

function inferDemandType(persona: PortraitPersona): DemandType {
  const text = `${persona.name} ${persona.definition} ${persona.coreNeeds.join(' ')} ${persona.typicalBehaviors.join(' ')}`;
  if (/兴趣|习惯|陪伴|PK|游戏/.test(text)) return '兴趣习惯';
  if (/错题|题型|解析|刷题|解惑/.test(text)) return '错题提效';
  if (/基础|补弱|断层|巩固|查漏/.test(text)) return '补弱巩固';
  if (/中考|高考|备考|提分|考试|答题技巧/.test(text)) return '备考提分';
  if (/规划|时间|方向|计划|路径/.test(text)) return '规划解惑';
  return '情绪支持';
}

function getPersonaTags(persona: PortraitPersona): string[] {
  const text = `${persona.name} ${persona.definition} ${persona.coreNeeds.join(' ')} ${persona.typicalBehaviors.join(' ')}`;
  const rules: Array<[string, RegExp]> = [
    ['兴趣驱动', /兴趣|好玩|PK|游戏|陪伴/],
    ['习惯培养', /习惯|预习|复习|持续/],
    ['错题提效', /错题|题型|解析|刷题/],
    ['补弱巩固', /补弱|断层|跟不上|巩固/],
    ['自主备考', /中考|备考|试卷|考试/],
    ['住宿高压', /住宿|高压|时间|盲目/],
    ['提分方法', /提分|答题技巧|归纳|专题/],
    ['情绪支持', /情绪|烦躁|回血|动力/],
    ['价格敏感', /价格|付费|贵|价值/],
  ];
  return rules.filter(([, pattern]) => pattern.test(text)).map(([label]) => label).slice(0, 3);
}

function buildPersonaSummaries(personas: PortraitPersona[]): PersonaSummary[] {
  return personas.map((persona) => ({
    persona,
    role: inferPersonaRole(persona),
    stage: inferPersonaStage(persona),
    demandType: inferDemandType(persona),
    tags: getPersonaTags(persona),
  }));
}

function countSummaries<T extends string>(rows: PersonaSummary[], getKey: (row: PersonaSummary) => T) {
  const counts = new Map<T, number>();
  rows.forEach((row) => counts.set(getKey(row), (counts.get(getKey(row)) ?? 0) + 1));
  return [...counts.entries()].map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count);
}

function buildProfileDashboard(rows: PersonaSummary[]) {
  return {
    personaCount: rows.length,
    stageCount: new Set(rows.map((row) => row.stage)).size,
    parentCount: rows.filter((row) => row.role === '家长' || row.role === '家庭决策').length,
    studentCount: rows.filter((row) => row.role === '学生').length,
    stages: countSummaries(rows, (row) => row.stage),
    roles: countSummaries(rows, (row) => row.role),
    demandTypes: countSummaries(rows, (row) => row.demandType),
  };
}

function ProfileOverview({
  dashboard,
  summaries,
  source,
}: {
  dashboard: ReturnType<typeof buildProfileDashboard>;
  summaries: PersonaSummary[];
  source: string;
}) {
  const groupedByStage = (['小学', '初中', '高中'] as PersonaStage[]).map((stage) => ({
    stage,
    rows: summaries.filter((row) => row.stage === stage),
  }));

  return (
    <section className="mt-5 space-y-5">
      <div className="grid gap-4 md:grid-cols-4">
        <OverviewMetric icon={<Users size={17} />} label="画像类型" value={dashboard.personaCount} note="三份画像报告整理口径" />
        <OverviewMetric icon={<BookOpenCheck size={17} />} label="覆盖学段" value={dashboard.stageCount} note="小学 / 初中 / 高中" />
        <OverviewMetric icon={<Home size={17} />} label="家长/决策" value={dashboard.parentCount} note="影响购买与付费判断" />
        <OverviewMetric icon={<School size={17} />} label="学生画像" value={dashboard.studentCount} note="影响使用和课程体验" />
      </div>

      <div className="grid gap-5 xl:grid-cols-[0.9fr_1.05fr_1.05fr]">
        <ChartPanel icon={<BarChart3 size={17} />} title="学段占比">
          <DonutChart rows={dashboard.stages} />
          <p className="mt-3 text-xs leading-5 text-[#777]">按画像类型计数，不代表真实用户人数占比。</p>
        </ChartPanel>
        <ChartPanel icon={<School size={17} />} title="小初高画像数量">
          <VerticalBarChart rows={dashboard.stages} />
          <p className="mt-3 text-xs leading-5 text-[#777]">用于快速比较哪个学段画像拆得更细、需求更分化。</p>
        </ChartPanel>
        <ChartPanel icon={<Target size={17} />} title="需求类型分布">
          <HorizontalBarChart rows={dashboard.demandTypes} />
          <p className="mt-3 text-xs leading-5 text-[#777]">把画像转成业务可读的需求入口。</p>
        </ChartPanel>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <BusinessExplanation title="为什么看家长" text="小学阶段的付费与坚持高度依赖家长理解价值，所以图表里单独保留家长/决策画像。" />
        <BusinessExplanation title="为什么看学生" text="初高中画像更多指向学生自己的使用效率、备考压力、题目解惑和情绪状态。" />
        <BusinessExplanation title="为什么不用项目库" text="本页先只呈现三份画像文件的结构，避免和小学物理、计算营、家庭包项目用户混在一起。" />
      </div>

      <div className="border border-[#dddcd5] bg-white px-5 py-3 text-xs leading-5 text-[#777]">
        数据来源：{source}
      </div>

      {groupedByStage.map(({ stage, rows }) => (
        <div key={stage} className="border border-[#dddcd5] bg-white">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#e5e4de] px-5 py-4">
            <div>
              <h2 className="text-lg font-bold text-[#252525]">{stage}画像</h2>
              <p className="mt-1 text-sm text-[#777]">{stageSummary(stage)}</p>
            </div>
            <span className="rounded bg-[#fff3ef] px-2.5 py-1 text-xs font-bold text-[#e65532]">{rows.length} 类画像</span>
          </div>
          <div className="grid gap-4 bg-[#fafaf7] p-4 md:grid-cols-2 xl:grid-cols-3">
            {rows.map((row) => <PersonaPreviewCard key={row.persona.id} row={row} />)}
          </div>
        </div>
      ))}
    </section>
  );
}

function OverviewMetric({ icon, label, value, note }: { icon: React.ReactNode; label: string; value: number; note: string }) {
  return (
    <div className="border border-[#dddcd5] bg-white p-4">
      <div className="flex items-center gap-2 text-[#e65532]">{icon}<span className="text-xs font-bold">{label}</span></div>
      <div className="mt-2 text-3xl font-extrabold text-[#252525]">{value}</div>
      <p className="mt-1 text-xs text-[#777]">{note}</p>
    </div>
  );
}

function ChartPanel({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div className="min-w-0 border border-[#dddcd5] bg-white p-5">
      <div className="mb-4 flex items-center gap-2 text-[#e65532]">
        {icon}
        <h2 className="text-lg font-bold text-[#252525]">{title}</h2>
      </div>
      {children}
    </div>
  );
}

function DonutChart({ rows }: { rows: Array<{ name: string; count: number }> }) {
  const total = rows.reduce((sum, row) => sum + row.count, 0);
  return (
    <div className="h-[260px] min-w-0">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={rows} dataKey="count" nameKey="name" innerRadius={58} outerRadius={88} paddingAngle={3}>
            {rows.map((row, index) => <Cell key={row.name} fill={CHART_COLORS[index % CHART_COLORS.length]} />)}
          </Pie>
          <Tooltip formatter={(value: unknown, name: unknown) => [`${value} 类 / ${total ? Math.round((Number(value) / total) * 100) : 0}%`, String(name)]} />
        </PieChart>
      </ResponsiveContainer>
      <div className="-mt-7 flex flex-wrap justify-center gap-3">
        {rows.map((row, index) => (
          <span key={row.name} className="inline-flex items-center gap-1.5 text-xs text-[#666]">
            <i className="h-2.5 w-2.5 rounded-full" style={{ background: CHART_COLORS[index % CHART_COLORS.length] }} />
            {row.name} {row.count}
          </span>
        ))}
      </div>
    </div>
  );
}

function VerticalBarChart({ rows }: { rows: Array<{ name: string; count: number }> }) {
  return (
    <div className="h-[260px] min-w-0">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={rows} margin={{ top: 16, right: 12, left: -18, bottom: 4 }}>
          <CartesianGrid stroke="#eee9df" vertical={false} />
          <XAxis dataKey="name" tickLine={false} axisLine={false} />
          <YAxis allowDecimals={false} tickLine={false} axisLine={false} />
          <Tooltip formatter={(value: unknown) => [`${value} 类画像`, '数量']} />
          <Bar dataKey="count" radius={[6, 6, 0, 0]}>
            {rows.map((row, index) => <Cell key={row.name} fill={CHART_COLORS[index % CHART_COLORS.length]} />)}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

function HorizontalBarChart({ rows }: { rows: Array<{ name: string; count: number }> }) {
  return (
    <div className="h-[260px] min-w-0">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={rows} layout="vertical" margin={{ top: 6, right: 22, left: 24, bottom: 4 }}>
          <CartesianGrid stroke="#eee9df" horizontal={false} />
          <XAxis type="number" allowDecimals={false} tickLine={false} axisLine={false} />
          <YAxis type="category" dataKey="name" width={62} tickLine={false} axisLine={false} />
          <Tooltip formatter={(value: unknown) => [`${value} 类画像`, '数量']} />
          <Bar dataKey="count" radius={[0, 6, 6, 0]} fill="#e65532" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

function stageSummary(stage: PersonaStage) {
  if (stage === '小学') return '重点看兴趣、习惯、家长价值理解和付费不确定感。';
  if (stage === '初中') return '重点看错题解析、补弱巩固、中考复习和自律学习。';
  return '重点看住宿高压、习题解惑、提分方法和情绪支持。';
}

function BusinessExplanation({ title, text }: { title: string; text: string }) {
  return (
    <div className="border border-[#dddcd5] bg-white p-4">
      <div className="text-sm font-bold text-[#252525]">{title}</div>
      <p className="mt-2 text-sm leading-6 text-[#666]">{text}</p>
    </div>
  );
}

function PersonaPreviewCard({ row }: { row: PersonaSummary }) {
  return (
    <article className="flex min-h-[280px] flex-col border border-[#e5e4de] bg-white p-4">
      <div className="mb-2 flex flex-wrap gap-1.5">
        <span className="rounded bg-[#fff3ef] px-2 py-0.5 text-[10px] font-bold text-[#e65532]">{row.stage}</span>
        <span className="rounded bg-[#f3f3ef] px-2 py-0.5 text-[10px] font-bold text-[#777]">{row.role}</span>
        <span className="rounded bg-[#eef5f2] px-2 py-0.5 text-[10px] font-bold text-[#4d8977]">{row.demandType}</span>
      </div>
      <h3 className="text-sm font-bold text-[#252525]">{row.persona.name}</h3>
      <p className="mt-2 line-clamp-3 text-xs leading-5 text-[#666]">{row.persona.definition}</p>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {row.tags.map((tag) => <span key={tag} className="rounded border border-[#e5e1d8] px-2 py-0.5 text-[10px] font-semibold text-[#776f65]">{tag}</span>)}
      </div>
      <div className="mt-3 grid gap-3 text-xs leading-5 text-[#555]">
        <div><b className="text-[#333]">核心需求：</b>{row.persona.coreNeeds.slice(0, 2).join('、')}</div>
        <div><b className="text-[#333]">典型行为：</b>{row.persona.typicalBehaviors.slice(0, 2).join('、')}</div>
      </div>
      {row.persona.quotes[0] && (
        <blockquote className="mt-auto border-l-2 border-[#e65532] bg-[#fafaf7] px-3 py-2 text-xs leading-5 text-[#555]">“{row.persona.quotes[0]}”</blockquote>
      )}
    </article>
  );
}

function LearningAnalysis() {
  const painCount = LEARNING_INSIGHTS.reduce((sum, grade) => sum + grade.pains.length, 0);
  const quoteCount = LEARNING_INSIGHTS.reduce(
    (sum, grade) => sum + grade.pains.reduce((painSum, pain) => painSum + pain.quotes.length, 0),
    0,
  ) + CROSS_LEARNING_INSIGHTS.reduce((sum, item) => sum + item.quotes.length, 0);

  return (
    <section className="mt-5 space-y-5">
      <div className="border border-[#dddcd5] bg-white">
        <div className="grid gap-px bg-[#e5e4de] xl:grid-cols-[minmax(0,1.35fr)_420px]">
          <div className="bg-white p-6 md:p-7">
            <div className="flex items-center gap-2 text-[#e65532]">
              <Brain size={18} />
              <span className="text-xs font-extrabold tracking-[0.18em]">LEARNING ANALYSIS</span>
            </div>
            <h2 className="mt-3 max-w-4xl text-2xl font-extrabold leading-tight text-[#252525] md:text-3xl">
              从学前到初三，学习痛点从<span className="mx-1 rounded bg-[#fff0ea] px-1.5 text-[#e65532]">兴趣和陪伴</span>
              逐步转向<span className="mx-1 rounded bg-[#fff0ea] px-1.5 text-[#e65532]">效率、解惑和应试</span>。
            </h2>
            <p className="mt-3 max-w-4xl text-sm leading-7 text-[#666]">
              这里不做项目售卖分析，而是把 998 与家庭包访谈中和孩子学习状态相关的原声，重新按具体年级归位，观察每个节点真正卡住孩子和家长的学习痛点。
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              {LEARNING_KEYWORDS.map((keyword) => (
                <span key={keyword} className="rounded-full border border-[#eaded3] bg-[#faf7f1] px-3 py-1 text-xs font-bold text-[#705f50]">
                  {keyword}
                </span>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-px bg-[#e5e4de]">
            <LearningMetric label="覆盖年级" value={LEARNING_INSIGHTS.length} note="学前到初三" />
            <LearningMetric label="痛点主题" value={painCount} note="按学习场景归纳" />
            <LearningMetric label="代表原声" value={quoteCount} note="仅保留学习痛点相关" />
            <LearningMetric label="演进规律" value={CROSS_LEARNING_INSIGHTS.length} note="跨年级归纳" />
          </div>
        </div>
      </div>

      <div className="border border-[#dddcd5] bg-white p-4">
        <div className="mb-3 text-xs font-bold text-[#888]">年级路径</div>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {LEARNING_INSIGHTS.map((item, index) => (
            <a
              key={item.grade}
              href={`#learning-${item.grade}`}
              className="flex shrink-0 items-center gap-2 rounded-full border border-[#e5e1d8] bg-[#fafaf7] px-3 py-2 text-xs font-bold text-[#5f5a53] hover:border-[#e65532] hover:text-[#e65532]"
            >
              <span>{item.grade}</span>
              {index < LEARNING_INSIGHTS.length - 1 && <ChevronRight size={12} className="text-[#aaa]" />}
            </a>
          ))}
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        {LEARNING_INSIGHTS.map((grade) => (
          <GradeLearningCard key={grade.grade} grade={grade} />
        ))}
      </div>

      <div className="border border-[#dddcd5] bg-white">
        <div className="border-b border-[#e5e4de] px-5 py-4">
          <div className="text-xs font-extrabold tracking-[0.16em] text-[#e65532]">CROSS-GRADE PATTERNS</div>
          <h2 className="mt-1 text-xl font-extrabold text-[#252525]">跨年级痛点演进</h2>
          <p className="mt-1 text-sm leading-6 text-[#666]">
            这里只保留学习痛点规律，不纳入售卖转化、价格判断或账号权益类结论。
          </p>
        </div>
        <div className="grid gap-px bg-[#e5e4de] lg:grid-cols-2">
          {CROSS_LEARNING_INSIGHTS.map((item, index) => (
            <CrossLearningCard key={item.title} item={item} index={index} />
          ))}
        </div>
      </div>

      <div className="border border-[#dddcd5] bg-white px-5 py-3 text-xs leading-5 text-[#777]">
        数据来源：本地《逐年级学习痛点洞察》整理稿，引用 998 小学/初中首购与家庭包访谈中和学习状态、课程使用、理解困难直接相关的原声；已排除交易转化、价格和账号权益类结论。
      </div>
    </section>
  );
}

function LearningMetric({ label, value, note }: { label: string; value: number; note: string }) {
  return (
    <div className="bg-white p-5">
      <div className="text-xs font-bold text-[#8a857d]">{label}</div>
      <div className="mt-2 text-3xl font-extrabold text-[#e65532]">{value}</div>
      <div className="mt-1 text-xs text-[#777]">{note}</div>
    </div>
  );
}

function GradeLearningCard({ grade }: { grade: GradeLearningInsight }) {
  return (
    <article id={`learning-${grade.grade}`} className="scroll-mt-20 border border-[#dddcd5] bg-white">
      <header className="border-b border-[#e5e4de] px-5 py-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-xl text-sm font-extrabold text-white" style={{ backgroundColor: grade.color }}>
              {grade.grade.slice(0, 2)}
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-[#252525]">{grade.grade}</h3>
              <p className="text-xs font-bold text-[#8a857d]">{grade.phase}</p>
            </div>
          </div>
          <span className="rounded-full bg-[#fff3ef] px-3 py-1 text-xs font-bold text-[#e65532]">{grade.pains.length} 个痛点</span>
        </div>
        <p className="mt-3 text-sm leading-6 text-[#666]"><EmphasizedText text={grade.summary} keywords={LEARNING_KEYWORDS} /></p>
      </header>
      <div className="grid gap-px bg-[#e5e4de]">
        {grade.pains.map((pain) => (
          <div key={pain.title} className="bg-white p-5">
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <span className="rounded bg-[#faf1ec] px-2 py-0.5 text-[11px] font-extrabold text-[#e65532]">{pain.tag}</span>
              <h4 className="text-base font-extrabold text-[#252525]"><EmphasizedText text={pain.title} keywords={LEARNING_KEYWORDS} /></h4>
            </div>
            <p className="text-sm leading-6 text-[#5f5a53]"><EmphasizedText text={pain.detail} keywords={LEARNING_KEYWORDS} /></p>
            <div className="mt-4 grid gap-2">
              {pain.quotes.map((quote) => (
                <LearningQuote key={`${pain.title}-${quote.text}`} text={quote.text} source={quote.source} />
              ))}
            </div>
            <div className="mt-4 border border-[#eaded3] bg-[#fbfaf7] px-4 py-3">
              <div className="mb-1 flex items-center gap-2 text-xs font-extrabold text-[#e65532]"><Target size={13} />洋葱可承接</div>
              <p className="text-sm leading-6 text-[#4f4a43]"><EmphasizedText text={pain.solution} keywords={LEARNING_KEYWORDS} /></p>
            </div>
          </div>
        ))}
      </div>
    </article>
  );
}

function CrossLearningCard({ item, index }: { item: CrossLearningInsight; index: number }) {
  return (
    <article className="bg-white p-5">
      <div className="mb-3 flex items-center gap-3">
        <div className="grid h-8 w-8 place-items-center rounded-lg bg-[#252525] text-xs font-extrabold text-white">0{index + 1}</div>
        <div>
          <div className="text-xs font-bold text-[#8a857d]">{item.stage}</div>
          <h3 className="text-base font-extrabold text-[#252525]">{item.title}</h3>
        </div>
      </div>
      <p className="text-sm leading-6 text-[#5f5a53]"><EmphasizedText text={item.summary} keywords={item.keywords} /></p>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {item.keywords.map((keyword) => (
          <span key={keyword} className="rounded-full border border-[#eaded3] px-2.5 py-1 text-[11px] font-bold text-[#705f50]">{keyword}</span>
        ))}
      </div>
      <div className="mt-4 grid gap-2">
        {item.quotes.map((quote) => (
          <LearningQuote key={`${item.title}-${quote.text}`} text={quote.text} source={quote.source} />
        ))}
      </div>
    </article>
  );
}

function LearningQuote({ text, source }: { text: string; source: string }) {
  return (
    <blockquote className="border-l-2 border-[#e65532] bg-[#fafaf7] px-4 py-3 text-sm leading-6 text-[#444]">
      <Quote size={14} className="mb-1 text-[#e65532]" />
      “<EmphasizedText text={text} keywords={LEARNING_KEYWORDS} />”
      <cite className="mt-2 block not-italic text-xs font-semibold text-[#888]">{source}</cite>
    </blockquote>
  );
}

function EmphasizedText({ text, keywords }: { text: string; keywords: string[] }) {
  const matched = keywords.filter((keyword) => text.includes(keyword));
  if (!matched.length) return <>{text}</>;
  const pattern = new RegExp(`(${matched.map(escapeRegExp).join('|')})`, 'g');
  return (
    <>
      {text.split(pattern).map((part, index) => (
        matched.includes(part)
          ? <mark key={`${part}-${index}`} className="rounded bg-[#ffe2d8] px-1 font-bold text-[#9d321b]">{part}</mark>
          : <React.Fragment key={`${part}-${index}`}>{part}</React.Fragment>
      ))}
    </>
  );
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function ListEditor({ title, values, editing, onChange }: { title: string; values: string[]; editing: boolean; onChange: (next: string[]) => void }) {
  return (
    <section>
      <div className="mb-3 text-xs font-bold text-[#777]">{title}</div>
      {editing ? (
        <textarea
          value={values.join('\n')}
          onChange={(event) => onChange(event.target.value.split('\n').map((item) => item.trim()).filter(Boolean))}
          className="min-h-32 w-full rounded-md border border-[#ddd] p-3 text-sm leading-6"
        />
      ) : (
        <ul className="space-y-2">
          {values.map((value) => <li key={value} className="border-l-2 border-[#d5d4cd] pl-3 text-sm leading-6 text-[#444]">{value}</li>)}
        </ul>
      )}
    </section>
  );
}
