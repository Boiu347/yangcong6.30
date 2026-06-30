import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  BarChart3,
  BookOpenCheck,
  Brain,
  CheckCircle2,
  Clock3,
  Compass,
  ExternalLink,
  Gauge,
  MessageSquareQuote,
  Route,
  Search,
  Sparkles,
  Target,
  Users2,
  XCircle,
} from 'lucide-react';
import {
  PAISOU_INTERVIEW_EVIDENCE,
  PAISOU_SURVEY_SIGNALS,
  PAISOU_USERS,
  PaisouUserStory,
} from '../../store/paisouData';
import { cn } from '@/lib/utils';

const ACCENT = '#e65532';
const OVERVIEW_SCROLL_TARGET_KEY = 'paisou-overview-scroll-target';

const RELATION_STYLE: Record<PaisouUserStory['relation'], { bg: string; text: string; border: string }> = {
  忠实粉: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-100' },
  摇摆用户: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-100' },
  偶尔使用: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-100' },
  被竞品截流: { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-100' },
};

const RELATION_ORDER: Record<PaisouUserStory['relation'], number> = {
  忠实粉: 0,
  摇摆用户: 1,
  偶尔使用: 2,
  被竞品截流: 3,
};

const ONION_STATUS_META: Record<PaisouUserStory['onionStatus'], { title: string; description: string; tone: string }> = {
  洋葱价值样本: {
    title: '洋葱价值已经被验证',
    description: '这些学生已经在用洋葱，重点看洋葱为什么能被留下。',
    tone: 'border-emerald-100 bg-emerald-50 text-emerald-700',
  },
  场景型使用: {
    title: '洋葱在特定场景会赢',
    description: '这些学生会在竞品和洋葱之间切换，重点看洋葱赢下的是哪一类任务。',
    tone: 'border-amber-100 bg-amber-50 text-amber-700',
  },
  '机会/边界样本': {
    title: '洋葱还没打进去的边界',
    description: '这些学生当前并不是洋葱拍搜用户，重点看洋葱要证明什么价值才可能进入。',
    tone: 'border-rose-100 bg-rose-50 text-rose-700',
  },
};

const ONION_STATUS_ORDER: PaisouUserStory['onionStatus'][] = ['洋葱价值样本', '场景型使用', '机会/边界样本'];

const GROUPED_PAISOU_USERS = ONION_STATUS_ORDER.map((status) => ({
  status,
  users: PAISOU_USERS
    .filter((user) => user.onionStatus === status)
    .sort((a, b) => RELATION_ORDER[a.relation] - RELATION_ORDER[b.relation]),
}));

const COMPETITOR_ROWS = [
  { name: '洋葱AI拍搜', fit: '愿意用、能看懂、感觉能学透', scene: '难题复盘、找卡点、知识点补充', risk: '速度和准确性会影响高压场景' },
  { name: '作业帮', fit: '快、题库强、答案路径明确', scene: '赶作业、刷题、快速确认答案', risk: 'AI讲解和情绪价值不足' },
  { name: '豆包 / 豆包爱学', fit: '可追问、对话感强、情绪价值高', scene: '思路卡点、想继续问为什么', risk: '难题准确性和响应稳定性' },
  { name: '快对 / 小猿', fit: '低成本核答案、题库路径熟悉', scene: '简单题和标准答案确认', risk: '深度理解与学习闭环较弱' },
  { name: '学习机', fit: '入口顺手、学习生态完整', scene: '低龄学生、家长参与、硬件使用习惯', risk: '灵活追问和品牌情感不一定强' },
];

const ONION_STRENGTH_ROWS = [
  {
    title: '听得懂：把题翻译成学生能接住的话',
    description: '这类原声指向洋葱最稳定的正向感知：不是只给答案，而是用通俗语言、举例和视频课把知识点讲到学生能懂。',
    quotes: [
      { user: '吴语遥', text: '6 点放学之后就到家，7点钟，然后写作业写到 8 点多。就是会上课，用洋葱上课，对。\n就是上一些在学校没听的，听数学、物理这些课学校没听懂。' },
      { user: '徐同学', text: '洋葱的详细会更精准。\n洋葱使用起来的话，对这类题可能会更加掌握一点，因为它的解析，毕竟这毕竟会完整更完整一点。\n就是更全面、更详细。更能让大家看得懂的一点。' },
      { user: '徐同学', text: '就是洋葱会用一些从你理解得到的角度。跟你讲，然后你不懂，你问他个别，他还会跟你详细讲，举例子这种。' },
      { user: '徐同学', text: '就比如你一道题不会，他会从通俗易懂的，就比如。在，就比如像拿起杯子一样，这种他会通过这种举例子的方式。' },
      { user: '徐同学', text: '它会翻译成你能听得懂的那种通俗语言。不会是那种文绉绉的感觉。' },
      { user: '吕同学', text: '知识点讲解，我要知道他每步能用到哪个知识点，我可能后面解到的就会轻松点。\n还不错。' },
      { user: '吕同学', text: '我一般是这么用，先看一眼步骤，然后如果这里面知识点没记牢的话，就去洋葱看一眼这个知识点，然后再回来再推一遍。' },
    ],
  },
  {
    title: '愿意用：不是最快，但在“想弄懂”时会被选中',
    description: '这些原声解释了洋葱为什么还会被用：当学生不只是赶作业，而是想把题真的弄明白，洋葱会进入工具组合。',
    quotes: [
      { user: '诺诗', text: '作业帮。我想一下，洋葱，应该是。\n在洋葱搜不到一样的题，就会用作业帮去搜。' },
      { user: '徐同学', text: '有的时候会觉得无所谓，然后可能有的时候就会用洋葱了。\n时间比较充足，会洋葱。' },
      { user: '徐同学', text: '拍完题之后会洋葱的话，它会先给一个思路，先看思路。' },
      { user: '徐同学', text: '拍题工程功能里那洋葱就是洋葱，适合更精细化的操作，然后豆包适合你，时间不够了。然后临时。' },
      { user: '徐同学', text: '在时间充足的时候，就是比较适合有耐心的一些学生。\n目的是就是首先把这种题弄懂。然后就是。' },
      { user: '小林', text: '完完全全搞不懂的话，那可以用洋葱。有一丢丢思路，做了答案之后感觉不对劲再去问豆包。' },
      { user: '小林', text: '那肯定是洋葱啊。\n它可以给我上课。' },
      { user: '小林', text: '解题、做视频才会找洋葱。' },
    ],
  },
  {
    title: '有趣和亲近：讲题不只是严肃纠错',
    description: '这里的重点不是“可爱标签”，而是学生明确把洋葱和作业帮的讲题体验区分开：有人设、有语气、有陪伴感，因而更愿意继续看。',
    quotes: [
      { user: '诺诗', text: '两个相比下来的话。洋洋葱更有，哈哈哈，洋洋葱更AI。因为作业帮它是有这种视频讲解的。' },
    ],
  },
  {
    title: '学得透：从一道题延展到一类题',
    description: '这些证据说明洋葱被认可的不是“查到答案”，而是把题目变成知识点、同类题和可迁移方法。',
    quotes: [
      { user: '吴语遥', text: '复习的方法就是会在那个，就是洋葱里面会找一些。试卷然后让我父母打印下来就写了，不会就会用我的学习机，然后盯着学习，就会出别的那种类似的题目。' },
      { user: '吴语遥', text: '就是找到，在洋葱里面找到题，然后发给我妈，让我妈给我打印下来。来写完之后就是用学习机上面的那个批改的人批它，批。批了之后发现有错题，顶阵之后不会就点那个，点它那个 AI 精准学。给我讲那道题。' },
      { user: '徐同学', text: '让他就比如说还是看不懂，让他多讲解。\n点一两次可能看不懂，第三次一般都会了。' },
      { user: '徐同学', text: '就会。它板块比较多，从多个板块说吧。就比如同步的、重难点的。什么？什么？复习预习试卷库这种。' },
      { user: '徐同学', text: '只要把题弄懂就不会反对，主要是同类型的题得弄明白。\n对，只要把这类题目弄懂，下次弄到这类题，至少大概率不会错了就可以。' },
      { user: '诺诗', text: '就是说洋葱它会一步一步来，就不会像作业帮那样子莫名其妙地出现一个步骤。我现在还没搞懂这个步骤是哪里来的，对。' },
      { user: '诺诗', text: '让我可以更好地理解那个题目，然后学会解题。举一反三。' },
      { user: '诺诗', text: '作业写完之后，我首先会拿出正确答案，然后把错误的题目圈出来，然后再去用洋葱。' },
      { user: '诺诗', text: '可能是第，我的理由是第一个就是突然弄懂。\n对，就是让他那个解题思路或者是那个解析的时候恍然大悟，原来这个题是这么做的。对。' },
      { user: '吕同学', text: '10 次得有 5 次吧。有一半。\n我这个自己思路推，能把这题推出来。' },
      { user: '小林', text: '遇到就是。在洋葱课上面上过有一点类似的，有一点点印象，但是忘记了该怎么做的题。' },
      { user: '小林', text: '每次都这样。每次都这样，嗯。你之后我再把作业做完了之后，我再回去把这个视频给找到，然后我再记。' },
      { user: '小林', text: '基本上可能就是用了洋葱，我上了一两节课，因为我上的课我要边做笔记边上课嘛。就花掉了一半个小时间，然后两节课的话就是一个小时左右的时间，然后这一个多小时间我累了，我就去玩了，去做一些实际活动。' },
    ],
  },
  {
    title: '信任与留存：愿意给分、愿意推荐、愿意回来',
    description: '这类证据不是讲单次功能，而是讲洋葱为什么能留在学生和家长心智里：课程可信、能上课、能提分、能让家长相信。',
    quotes: [
      { user: '徐同学', text: '就是洋葱这种，它还是比较信任。' },
      { user: '小林', text: '可以。豆包的话满分 10 分，给他打分，以后这个太贵，不怎么用。先暂时给它打个 10 分吧。然后就洋葱，我也给它打 10 分吧。' },
      { user: '小林', text: '这个拍题的功能吗？对。没有什么太多的，我觉得现在这个样子就不错了。' },
    ],
  },
];

const USER_EXTRA_QUOTES: Record<string, string[]> = {
  'wu-yuyao': [
    '他讲得有点过于深奥。',
    '老师有些题目不会讲，只会讲那种特别难的题目。',
  ],
  'xu-tongxue': [
    '因为豆包会更快一点。',
    '洋葱的详细会更精准一点。',
    '他会从通俗易懂的角度，通过举例子的方式讲。',
  ],
  'xiao-jie': [
    '解析完整，拍出来的题都很准确，还会有举一反三的类似题给我。',
    '科大讯飞的视频讲解还有解析，我能明白。',
    '同类题会做了，才是完美体验。',
  ],
  'ding-tongxue': [
    '要继续写作业，能够越快越好。',
    '脑子转不过来弯的时候，就会看视频讲解。',
  ],
  'lv-tongxue': [
    '作业帮我就有一个作业帮就行了。',
    '如果这里面知识点没记牢的话，就去洋葱看一眼这个知识点，然后再回来再推一遍。',
  ],
  nuoshi: [
    '作业帮他讲得太无聊了。',
    '比较温柔、委婉、有耐心。',
    '像朋友，因为他说话不像老师那么严肃。',
  ],
  mengmei: [
    '我希望他能根据我的年级，给出适合当前年级的解题过程。',
    'DeepSeek 的方法太过高端，实在是看不懂。',
  ],
  xiaolin: [
    '完完全全搞不懂的话，那可以用洋葱。',
    '那肯定是洋葱啊。',
    '它可以给我上课。',
  ],
};

function relationClass(relation: PaisouUserStory['relation']) {
  const style = RELATION_STYLE[relation];
  return cn('border px-2 py-0.5 text-[11px] font-bold', style.bg, style.text, style.border);
}

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full border border-gray-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-gray-500">
      {children}
    </span>
  );
}

function proofMomentTitle(user: PaisouUserStory) {
  if (user.onionStatus === '机会/边界样本') return '洋葱还没打动他的那一刻';
  if (user.onionStatus === '场景型使用') return '洋葱被选中的场景';
  return '洋葱打动他的那一次';
}

function ChainRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-1.5 rounded-xl border border-gray-100 bg-[#FAFAF8] p-3 sm:grid-cols-[112px_1fr]">
      <p className="text-[11px] font-black text-gray-400">{label}</p>
      <div className="text-[12.5px] font-semibold leading-5 text-gray-700">{children}</div>
    </div>
  );
}

function findScrollParent(element: HTMLElement | null) {
  let parent = element?.parentElement ?? null;

  while (parent) {
    const { overflowY } = window.getComputedStyle(parent);
    if (/(auto|scroll|overlay)/.test(overflowY) && parent.scrollHeight > parent.clientHeight) {
      return parent;
    }
    parent = parent.parentElement;
  }

  return null;
}

function scrollPageToTop(element: HTMLElement | null) {
  const scrollParent = findScrollParent(element);
  scrollParent?.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
}

function storyRole(user: PaisouUserStory) {
  return `${user.region}${user.grade}学生，${user.learningStatus}`;
}

function storyActivity(user: PaisouUserStory) {
  return user.currentGoal;
}

function storyValue(user: PaisouUserStory) {
  return user.answerVsLearn;
}

function storySentence(user: PaisouUserStory) {
  return `作为一个${storyRole(user)}，我想要${storyActivity(user)}，以便${storyValue(user)}。`;
}

function storyBoundaryNote(user: PaisouUserStory) {
  if (user.onionStatus === '机会/边界样本') {
    return '这个故事的重点不是证明他已经在用洋葱，而是说明洋葱需要证明什么，才可能进入他的工具组合。';
  }
  if (user.onionStatus === '场景型使用') {
    return '这个故事只在特定学习场景中成立：洋葱会被选择，但也会在更快、更直接的场景里被替代。';
  }
  return '这个故事解释的是洋葱已经被选择的原因，同时保留它仍可能被竞品替代的边界。';
}

function MetricCard({
  icon,
  title,
  value,
  note,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
  note: string;
}) {
  return (
    <article className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="flex items-center gap-2 text-[11px] font-bold text-gray-500">
        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#fff2ed] text-[#e65532]">{icon}</span>
        {title}
      </div>
      <p className="mt-3 text-[18px] font-black leading-snug text-gray-900">{value}</p>
      <p className="mt-2 text-[11px] leading-5 text-gray-500">{note}</p>
    </article>
  );
}

function DataSignalsSection() {
  return (
    <section className="mt-6 rounded-[22px] border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-[11px] font-black tracking-[0.16em] text-[#e65532]">
            <BarChart3 size={15} />
            问卷星 + AI访谈
          </div>
          <h2 className="mt-2 text-[20px] font-black text-gray-900">这 8 个用户背后的样本信号</h2>
          <p className="mt-1 text-[12px] leading-6 text-gray-500">
            问卷星提供大样本代表性，AI访谈提供真实原声；这里展示的是聚合信号和脱敏证据，不直接暴露原始数据。
          </p>
        </div>
        <span className="rounded-full border border-[#f0ded8] bg-[#fff8f5] px-3 py-1 text-[11px] font-bold text-[#b84a2f]">
          不是孤例，而是一组可被样本解释的用户故事
        </span>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-4">
        {PAISOU_SURVEY_SIGNALS.sample.map((item) => (
          <div key={item.label} className="rounded-2xl border border-gray-100 bg-[#FAFAF8] p-4">
            <p className="text-[11px] font-bold text-gray-500">{item.label}</p>
            <p className="mt-2 text-[24px] font-black text-gray-900">{item.value}</p>
            <p className="mt-1 text-[11px] leading-5 text-gray-500">{item.note}</p>
          </div>
        ))}
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="rounded-2xl border border-gray-100 bg-white p-4">
          <h3 className="text-[12px] font-black text-gray-900">最常用拍搜工具</h3>
          <div className="mt-4 space-y-3">
            {PAISOU_SURVEY_SIGNALS.toolShare.map((tool) => (
              <div key={tool.name}>
                <div className="flex items-center justify-between gap-3 text-[12px]">
                  <span className="font-bold text-gray-800">{tool.name}</span>
                  <span className="font-black text-gray-900">{tool.value}%</span>
                </div>
                <div className="mt-1 h-2 overflow-hidden rounded-full bg-gray-100">
                  <div
                    className="h-full rounded-full bg-[#e65532]"
                    style={{ width: `${tool.value}%` }}
                  />
                </div>
                <p className="mt-1 text-[11px] leading-5 text-gray-500">{tool.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-4">
          <h3 className="text-[12px] font-black text-gray-900">按学段看工具分流</h3>
          <div className="mt-4 space-y-3">
            {PAISOU_SURVEY_SIGNALS.stageShare.map((stage) => (
              <div key={stage.stage} className="grid gap-2 rounded-xl bg-[#FAFAF8] p-3 sm:grid-cols-[52px_1fr]">
                <p className="text-[12px] font-black text-gray-900">{stage.stage}</p>
                <div className="grid gap-2 text-[11px] font-semibold text-gray-600 sm:grid-cols-3">
                  <span>洋葱 {stage.onion}%</span>
                  <span>作业帮 {stage.homework}%</span>
                  <span>豆包 {stage.doubao}%</span>
                </div>
              </div>
            ))}
          </div>
          <p className="mt-3 text-[11px] leading-5 text-gray-500">
            洋葱在小学和初中保持第一常用，但高中阶段作业帮、豆包分流更明显。
          </p>
        </div>
      </div>

      <div className="mt-4 grid gap-3 lg:grid-cols-5">
        {PAISOU_INTERVIEW_EVIDENCE.map((item) => (
          <div key={item.theme} className="rounded-2xl border border-gray-100 bg-[#fffdf9] p-3">
            <p className="text-[11px] font-black text-[#b84a2f]">{item.theme}</p>
            <blockquote className="mt-2 text-[12px] font-bold leading-5 text-gray-900">“{item.quote}”</blockquote>
            <p className="mt-2 text-[11px] leading-5 text-gray-500">{item.note}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function ToolSwitchSection() {
  return (
    <section className="mt-6 rounded-[22px] border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="flex items-center gap-2">
        <Compass size={16} className="text-[#e65532]" />
        <h2 className="text-[16px] font-black text-gray-900">学生为什么在不同工具间切换</h2>
      </div>
      <div className="mt-4 overflow-hidden rounded-2xl border border-gray-100">
        <div className="grid grid-cols-[0.75fr_1.2fr_1.2fr_1fr] bg-[#FAFAF8] px-4 py-3 text-[11px] font-bold text-gray-500">
          <span>工具</span>
          <span>用户感知</span>
          <span>赢的场景</span>
          <span>风险</span>
        </div>
        {COMPETITOR_ROWS.map((row) => (
          <div key={row.name} className="grid grid-cols-[0.75fr_1.2fr_1.2fr_1fr] border-t border-gray-100 px-4 py-3 text-[12px] leading-5">
            <strong className="text-gray-900">{row.name}</strong>
            <span className="text-gray-600">{row.fit}</span>
            <span className="text-gray-600">{row.scene}</span>
            <span className="text-gray-500">{row.risk}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

function OnionStrengthSection() {
  return (
    <section className="mt-6 rounded-[22px] border border-[#f0ded8] bg-[#fffaf7] p-5 shadow-sm sm:p-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-[11px] font-black tracking-[0.16em] text-[#e65532]">
            <Sparkles size={15} />
            文字记录里的正向信号
          </div>
          <h2 className="mt-2 text-[20px] font-black text-gray-900">学生觉得洋葱拍搜好的地方</h2>
          <p className="mt-1 max-w-3xl text-[12px] leading-6 text-gray-500">
            这些不是抽象卖点，而是从妙记文字记录中摘出的学生原声。原声不做改写，只通过选取更完整的原句片段来保证语义连贯。
          </p>
        </div>
        <span className="rounded-full border border-[#f0ded8] bg-white px-3 py-1 text-[11px] font-bold text-[#b84a2f]">
          {ONION_STRENGTH_ROWS.reduce((sum, item) => sum + item.quotes.length, 0)} 条原声证据
        </span>
      </div>

      <div className="mt-5 space-y-3 lg:hidden">
        {ONION_STRENGTH_ROWS.map((item, index) => (
          <OnionStrengthCard key={item.title} item={item} index={index} />
        ))}
      </div>

      <div className="mt-5 hidden gap-3 lg:grid lg:grid-cols-2 lg:items-start">
        {[0, 1].map((column) => (
          <div key={column} className="space-y-3">
            {ONION_STRENGTH_ROWS.map((item, index) => (
              index % 2 === column ? <OnionStrengthCard key={item.title} item={item} index={index} /> : null
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}

function OnionStrengthCard({
  item,
  index,
}: {
  item: (typeof ONION_STRENGTH_ROWS)[number];
  index: number;
}) {
  return (
    <article className="rounded-2xl border border-[#f1ded6] bg-white p-4">
      <div className="flex items-center gap-2">
        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#fff2ed] text-[12px] font-black text-[#e65532]">
          {index + 1}
        </span>
        <h3 className="text-[13px] font-black leading-5 text-gray-900">{item.title}</h3>
      </div>
      <p className="mt-3 text-[12px] leading-6 text-gray-600">{item.description}</p>
      <div className="mt-3 space-y-2">
        {item.quotes.map((quote) => (
          <blockquote key={`${quote.user}-${quote.text}`} className="rounded-xl border border-gray-100 bg-[#FAFAF8] p-3">
            <p className="text-[11px] font-black text-[#b84a2f]">{quote.user}</p>
            <div className="mt-2 space-y-2">
              {quote.text.split('\n').map((line, lineIndex) => (
                <p key={`${quote.user}-${lineIndex}`} className="text-[12px] font-semibold leading-5 text-gray-800">“{line}”</p>
              ))}
            </div>
          </blockquote>
        ))}
      </div>
    </article>
  );
}

export function PaisouOnionPraisePage() {
  const totalQuotes = ONION_STRENGTH_ROWS.reduce((sum, item) => sum + item.quotes.length, 0);

  return (
    <div className="min-h-full bg-[#F7F4EE]">
      <main className="mx-auto max-w-7xl px-5 py-6 sm:px-8">
        <section className="rounded-[24px] border border-[#E8E2D9] bg-white p-6 shadow-[0_12px_35px_rgba(30,35,40,0.06)] sm:p-8">
          <div className="grid gap-6 lg:grid-cols-[1.35fr_0.65fr] lg:items-end">
            <div>
              <div className="flex items-center gap-2 text-[11px] font-black tracking-[0.18em] text-[#e65532]">
                <Sparkles size={15} />
                拍搜调研 · 洋葱好评
              </div>
              <h1 className="mt-3 text-[28px] font-black leading-tight text-[#242421] sm:text-[38px]">
                学生为什么还会选择洋葱：听得懂、愿意学、感觉能学透。
              </h1>
              <p className="mt-4 max-w-4xl text-[13px] leading-7 text-gray-600">
                这一页只承载正向证据：把妙记文字记录中提到洋葱好的地方集中展示。用户原声保持原文，不改写、不补字。
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
              <div className="rounded-2xl border border-[#f0ded8] bg-[#fff8f5] p-4">
                <p className="text-[11px] font-black text-[#b84a2f]">证据规模</p>
                <p className="mt-2 text-[30px] font-black text-gray-900">{totalQuotes}</p>
                <p className="text-[11px] leading-5 text-gray-500">条来自文字记录的正向原声</p>
              </div>
              <div className="rounded-2xl border border-gray-100 bg-[#FAFAF8] p-4">
                <p className="text-[11px] font-black text-gray-500">阅读方式</p>
                <p className="mt-2 text-[13px] font-bold leading-6 text-gray-800">
                  每条只展示文字记录里的学生原声；为保证能读懂，会选取相对完整的原句片段。
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-5 grid gap-3 md:grid-cols-5">
          {ONION_STRENGTH_ROWS.map((item, index) => (
            <div key={item.title} className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
              <p className="text-[11px] font-black text-[#e65532]">0{index + 1}</p>
              <h2 className="mt-2 text-[13px] font-black leading-5 text-gray-900">{item.title}</h2>
              <p className="mt-2 text-[11px] leading-5 text-gray-500">{item.quotes.length} 条证据</p>
            </div>
          ))}
        </section>

        <OnionStrengthSection />
      </main>
    </div>
  );
}

function UserCard({ user }: { user: PaisouUserStory }) {
  const navigate = useNavigate();
  const [quotesExpanded, setQuotesExpanded] = React.useState(false);
  const extraQuotes = USER_EXTRA_QUOTES[user.id] ?? [];
  const displayedQuotes = quotesExpanded ? [user.quote, ...extraQuotes] : [user.quote];
  const statusMeta = ONION_STATUS_META[user.onionStatus];
  const judgmentTitle = user.onionStatus === '洋葱价值样本'
    ? '洋葱为什么被留下'
    : user.onionStatus === '场景型使用'
      ? '洋葱在哪些场景会赢'
      : '洋葱还要证明什么';
  const positiveLabel = user.onionStatus === '机会/边界样本' ? '可争取价值：' : '洋葱价值：';
  const riskLabel = user.onionStatus === '机会/边界样本' ? '现实阻力：' : '会被替代：';
  const openUserDetail = () => {
    window.sessionStorage.setItem(OVERVIEW_SCROLL_TARGET_KEY, user.id);
    navigate(`/projects/paisou_project/qualitative/users/${user.id}`);
  };

  return (
    <article
      id={`paisou-user-card-${user.id}`}
      className="group flex h-full flex-col rounded-2xl border border-gray-200 bg-white p-4 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:border-[#e65532]/60 hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-[17px] font-black text-gray-900">{user.name}</h3>
            <span className={relationClass(user.relation)}>{user.relation}</span>
          </div>
          <p className="mt-1 text-[11px] font-semibold text-gray-400">
            {user.region} · {user.grade} · {user.subjects.join('/')}
          </p>
        </div>
        <button
          type="button"
          onClick={openUserDetail}
          className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-300 transition-colors hover:border-[#e65532]/40 hover:text-[#e65532]"
          aria-label={`查看${user.name}详情`}
        >
          <ArrowRight size={16} />
        </button>
      </div>

      <div className="mt-4 rounded-xl border border-[#f0ded8] bg-[#fff8f5] p-3.5">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className={cn('rounded-full border px-2 py-0.5 text-[10px] font-black', statusMeta.tone)}>
            {user.onionStatus}
          </span>
          <span className="rounded-full border border-[#f0ded8] bg-white px-2 py-0.5 text-[10px] font-bold text-[#a45138]">
            {user.pressure.split('：')[0]}
          </span>
        </div>
        <p className="mt-2.5 text-[13px] font-black leading-5 text-gray-900">{user.oneLine}</p>
        <p className="mt-2 text-[11px] leading-5 text-gray-500">{user.onionStatusNote}</p>
      </div>

      <div className="mt-3 grid gap-2">
        <div className="rounded-xl border border-gray-100 bg-[#FAFAF8] p-3">
          <p className="text-[10px] font-black tracking-widest text-gray-400">学习状态</p>
          <p className="mt-1 text-[12px] leading-5 text-gray-700">{user.learningStatus}</p>
        </div>
        <div className="grid gap-2 sm:grid-cols-2">
          <div className="rounded-xl border border-gray-100 bg-white p-3">
            <p className="text-[10px] font-black tracking-widest text-gray-400">当前目标</p>
            <p className="mt-1 text-[12px] font-bold leading-5 text-gray-800">{user.currentGoal}</p>
          </div>
          <div className="rounded-xl border border-gray-100 bg-white p-3">
            <p className="text-[10px] font-black tracking-widest text-gray-400">需求倾向</p>
            <p className="mt-1 text-[12px] font-bold leading-5 text-gray-800">{user.answerVsLearn}</p>
          </div>
        </div>
      </div>

      <div className="mt-3 rounded-xl border border-gray-100 bg-white p-3">
        <p className="text-[10px] font-black tracking-widest text-gray-400">使用工具</p>
        <div className="mt-2 flex flex-wrap items-center gap-1.5 text-[11px] font-semibold text-gray-600">
          {user.tools.map((tool, index) => (
            <React.Fragment key={tool}>
              {index > 0 && <span className="text-gray-300">/</span>}
              <span className={cn(
                'rounded-full border px-2 py-0.5',
                tool.includes('洋葱') ? 'border-[#f0ded8] bg-[#fff8f5] text-[#d34b2a]' : 'border-gray-200 bg-gray-50 text-gray-500',
              )}>
                {tool}
              </span>
            </React.Fragment>
          ))}
        </div>
        <p className="mt-2 text-[11px] leading-5 text-gray-500">
          <strong className="text-gray-700">常切工具：</strong>{user.primaryCompetitor}
        </p>
      </div>

      <div className="mt-3 rounded-xl border border-[#f0ded8] bg-[#fff8f5] p-3">
        <p className="text-[10px] font-black tracking-widest text-[#b84a2f]">{proofMomentTitle(user)}</p>
        <p className="mt-1.5 overflow-hidden text-[12px] font-bold leading-5 text-gray-800 [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:3]">
          {user.scene}
        </p>
      </div>

      <div className="mt-3 rounded-xl border border-gray-100 bg-gray-50 px-3 py-2.5">
        <div className="flex items-center justify-between gap-2">
          <span className="text-[10px] font-black tracking-widest text-gray-400">用户原声</span>
          {extraQuotes.length > 0 && (
            <button
              type="button"
              onClick={() => setQuotesExpanded((value) => !value)}
              className="rounded-full border border-gray-200 bg-white px-2 py-0.5 text-[10px] font-bold text-gray-500 hover:border-[#e65532]/40 hover:text-[#e65532]"
            >
              {quotesExpanded ? '收起' : '展开'}
            </button>
          )}
        </div>
        <div className="mt-2 space-y-2">
          {displayedQuotes.map((quote) => (
            <blockquote key={quote} className="text-[12px] leading-5 text-gray-600">
              “{quote}”
            </blockquote>
          ))}
        </div>
      </div>

      <div className="mt-3 flex-1 rounded-xl border border-[#E8E2D9] bg-[#fffdf9] p-3">
        <p className="text-[10px] font-black tracking-widest text-[#b7793b]">{judgmentTitle}</p>
        <div className="mt-2 grid gap-2.5">
          <p className="text-[12px] leading-5 text-gray-700">
            <strong className="text-emerald-700">{positiveLabel}</strong>{user.retention}
          </p>
          <p className="text-[12px] leading-5 text-gray-700">
            <strong className="text-rose-700">{riskLabel}</strong>{user.risk}
          </p>
          <p className="rounded-lg bg-white px-2.5 py-2 text-[11px] leading-5 text-gray-500">
            <strong className="text-gray-700">关键变量：</strong>{user.pressure}
          </p>
        </div>
      </div>
      <button
        type="button"
        onClick={openUserDetail}
        className="mt-3 inline-flex items-center justify-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3 py-2 text-[12px] font-bold text-gray-600 transition-colors hover:border-[#e65532]/40 hover:text-[#e65532]"
      >
        查看完整故事
        <ArrowRight size={14} />
      </button>
    </article>
  );
}

function OverviewPage() {
  React.useEffect(() => {
    const targetUserId = window.sessionStorage.getItem(OVERVIEW_SCROLL_TARGET_KEY);
    if (!targetUserId) return;

    window.sessionStorage.removeItem(OVERVIEW_SCROLL_TARGET_KEY);
    window.requestAnimationFrame(() => {
      document
        .getElementById(`paisou-user-card-${targetUserId}`)
        ?.scrollIntoView({ block: 'center', behavior: 'auto' });
    });
  }, []);

  return (
    <div className="min-h-full bg-[#f8f8f5]">
      <main className="mx-auto max-w-7xl px-5 py-6 sm:px-8">
        <section className="rounded-[24px] border border-[#E8E2D9] bg-white p-6 shadow-[0_12px_35px_rgba(30,35,40,0.06)] sm:p-8">
          <div className="max-w-4xl">
            <div className="flex items-center gap-2 text-[11px] font-black tracking-[0.18em] text-[#e65532]">
              <Users2 size={15} />
              拍搜调研 · 8个真实学生故事
            </div>
            <h1 className="mt-3 text-[28px] font-black leading-tight text-[#242421] sm:text-[38px]">
              学生不是一直只想要答案；当任务从赶作业变成想学懂，洋葱仍然会被选择。
            </h1>
          </div>
        </section>

        <section className="mt-5 grid gap-4 md:grid-cols-3">
          <MetricCard
            icon={<Clock3 size={15} />}
            title="核心切换"
            value="时间紧迫度 × 题目难度"
            note="赶作业时先要快；完全不懂、难题复盘和知识点缺口出现时，学生才会愿意花时间学懂。"
          />
          <MetricCard
            icon={<BookOpenCheck size={15} />}
            title="洋葱优势场景"
            value="愿意用、能看懂、感觉能学透"
            note="洋葱最能赢的是难题复盘、找卡点和讲清楚，而不是所有场景都比竞品更快。"
          />
          <MetricCard
            icon={<Gauge size={15} />}
            title="竞品截流场景"
            value="高压作业与低成本核答案"
            note="作业帮、快对、豆包和学习机会在速度、入口、追问和题库上分别截流不同学生。"
          />
        </section>

        <ToolSwitchSection />

        <section className="mt-6">
          <div className="mb-3 flex flex-wrap items-start justify-between gap-2">
            <h2 className="text-[18px] font-black text-gray-900">8 个真实学生用户故事</h2>
          </div>
          <div className="space-y-5">
            {GROUPED_PAISOU_USERS.map((group) => {
              const meta = ONION_STATUS_META[group.status];
              return (
                <section key={group.status} className="rounded-[22px] border border-gray-200 bg-white/70 p-4">
                  <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <h3 className="text-[15px] font-black text-gray-900">{meta.title}</h3>
                      <p className="mt-1 text-[11px] leading-5 text-gray-500">{meta.description}</p>
                    </div>
                    <span className={cn('rounded-full border px-3 py-1 text-[11px] font-black', meta.tone)}>
                      {group.users.length} 人
                    </span>
                  </div>
                  <div className="grid gap-4 lg:grid-cols-2 2xl:grid-cols-3">
                    {group.users.map((user) => <UserCard key={user.id} user={user} />)}
                  </div>
                </section>
              );
            })}
          </div>
        </section>

        <DataSignalsSection />
      </main>
    </div>
  );
}

function DetailSection({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center gap-2">
        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#fff2ed] text-[#e65532]">{icon}</span>
        <h2 className="text-[15px] font-black text-gray-900">{title}</h2>
      </div>
      {children}
    </section>
  );
}

function BulletList({ items, positive }: { items: string[]; positive: boolean }) {
  const Icon = positive ? CheckCircle2 : XCircle;
  return (
    <div className="space-y-2">
      {items.map((item) => (
        <div key={item} className="flex gap-2.5">
          <Icon size={15} className={cn('mt-0.5 shrink-0', positive ? 'text-emerald-500' : 'text-rose-500')} />
          <p className="text-[12.5px] leading-5 text-gray-600">{item}</p>
        </div>
      ))}
    </div>
  );
}

function UserDetailPage({ user }: { user: PaisouUserStory }) {
  const navigate = useNavigate();
  const pageRef = React.useRef<HTMLDivElement>(null);
  const statusMeta = ONION_STATUS_META[user.onionStatus];
  const relationshipTitle = user.onionStatus === '机会/边界样本'
    ? '当前为什么没选洋葱 / 洋葱可争取什么'
    : user.onionStatus === '场景型使用'
      ? '洋葱在哪些场景会赢 / 什么场景切走'
      : '洋葱为什么被选择 / 什么场景会切走';
  const positiveHeading = user.onionStatus === '机会/边界样本' ? '洋葱可争取的价值' : '洋葱赢的理由';
  const negativeHeading = user.onionStatus === '机会/边界样本' ? '当前没有打进去的原因' : '切到竞品的理由';
  const judgmentHeading = user.onionStatus === '机会/边界样本' ? '机会判断' : '与洋葱的真实关系';
  const retentionHeading = user.onionStatus === '洋葱价值样本'
    ? '为什么会继续用洋葱'
    : user.onionStatus === '场景型使用'
      ? '洋葱能赢下的条件'
      : '洋葱要先证明什么';
  const riskHeading = user.onionStatus === '机会/边界样本' ? '真实阻力' : '仍会被替代的场景';

  React.useLayoutEffect(() => {
    scrollPageToTop(pageRef.current);
    window.requestAnimationFrame(() => scrollPageToTop(pageRef.current));
  }, [user.id]);

  return (
    <div ref={pageRef} className="min-h-full bg-[#f8f8f5]">
      <main className="mx-auto max-w-6xl px-5 py-6 sm:px-8">
        <button
          onClick={() => navigate('/projects/paisou_project/qualitative')}
          className="mb-4 flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-[12px] font-semibold text-gray-500 hover:border-[#e65532]/40 hover:text-[#e65532]"
        >
          <ArrowLeft size={14} />
          返回 8 个用户卡片
        </button>

        <section className="overflow-hidden rounded-[24px] border border-[#E8E2D9] bg-white shadow-[0_12px_35px_rgba(30,35,40,0.06)]">
          <div className="grid gap-5 p-6 lg:grid-cols-[1.2fr_0.8fr] lg:p-8">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className={cn('rounded-full border px-2.5 py-1 text-[11px] font-black', statusMeta.tone)}>
                  {user.onionStatus}
                </span>
                <span className={relationClass(user.relation)}>{user.relation}</span>
                <Pill>{user.pressure}</Pill>
              </div>
              <h1 className="mt-4 text-[32px] font-black text-gray-900 sm:text-[42px]">{user.name}</h1>
              <p className="mt-2 text-[13px] font-semibold text-gray-400">
                {user.region} · {user.grade} · {user.subjects.join('/')} · {user.learningStatus}
              </p>
              <p className="mt-5 max-w-3xl text-[20px] font-black leading-8 text-gray-900">{user.oneLine}</p>
              <p className="mt-3 max-w-3xl rounded-2xl border border-gray-100 bg-[#FAFAF8] p-4 text-[13px] font-semibold leading-6 text-gray-600">
                {user.onionStatusNote}
              </p>
              <blockquote className="mt-5 rounded-2xl border border-[#f0ded8] bg-[#fff8f5] p-4 text-[14px] font-semibold leading-7 text-gray-700">
                “{user.quote}”
              </blockquote>
            </div>
            <div className="rounded-2xl border border-gray-100 bg-[#FAFAF8] p-5">
              <p className="text-[11px] font-black tracking-widest text-gray-400">用户档案</p>
              <div className="mt-4 space-y-3 text-[12.5px]">
                <div><strong className="text-gray-900">当前目标：</strong><span className="text-gray-600">{user.currentGoal}</span></div>
                <div><strong className="text-gray-900">需求倾向：</strong><span className="text-gray-600">{user.answerVsLearn}</span></div>
                <div><strong className="text-gray-900">使用工具：</strong><span className="text-gray-600">{user.tools.join(' / ')}</span></div>
                <div><strong className="text-gray-900">主要竞品：</strong><span className="text-gray-600">{user.primaryCompetitor}</span></div>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-6 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <BookOpenCheck size={16} color={ACCENT} />
                <h2 className="text-[15px] font-black text-gray-900">用户故事结构</h2>
              </div>
              <p className="mt-2 text-[12px] leading-6 text-gray-500">
                先把这个学生作为一个独立故事读清楚：他是谁、想完成什么、洋葱在什么场景里有价值，以及这个判断靠什么证据成立。
              </p>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {['独立故事', '价值清楚', '有原声证据', '有切换边界'].map((item) => (
                <Pill key={item}>{item}</Pill>
              ))}
            </div>
          </div>

          <div className="mt-4 rounded-2xl border border-[#f0ded8] bg-[#fff8f5] p-4">
            <p className="text-[11px] font-black tracking-widest text-[#b84a2f]">一句话用户故事</p>
            <p className="mt-2 text-[18px] font-black leading-7 text-gray-900">{user.oneLine}</p>
            <p className="mt-3 text-[13px] font-semibold leading-6 text-gray-700">{storySentence(user)}</p>
          </div>

          <div className="mt-4 grid gap-3 md:grid-cols-3">
            <div className="rounded-2xl border border-gray-100 bg-[#FAFAF8] p-4">
              <p className="text-[11px] font-black text-gray-400">角色</p>
              <p className="mt-2 text-[13px] font-bold leading-6 text-gray-800">{storyRole(user)}</p>
            </div>
            <div className="rounded-2xl border border-gray-100 bg-[#FAFAF8] p-4">
              <p className="text-[11px] font-black text-gray-400">想完成的事</p>
              <p className="mt-2 text-[13px] font-bold leading-6 text-gray-800">{storyActivity(user)}</p>
            </div>
            <div className="rounded-2xl border border-gray-100 bg-[#FAFAF8] p-4">
              <p className="text-[11px] font-black text-gray-400">对他的价值</p>
              <p className="mt-2 text-[13px] font-bold leading-6 text-gray-800">{storyValue(user)}</p>
            </div>
          </div>

          <div className="mt-4 grid gap-3 lg:grid-cols-2">
            <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-4">
              <p className="text-[11px] font-black text-emerald-700">故事成立证据</p>
              <div className="mt-3 space-y-2 text-[12.5px] leading-6 text-gray-700">
                <p><strong className="text-gray-900">前提：</strong>{user.learningStatus}；{user.pressure}</p>
                <p><strong className="text-gray-900">触发：</strong>{user.scene}</p>
                <p><strong className="text-gray-900">原声：</strong>“{user.quote}”</p>
              </div>
            </div>
            <div className="rounded-2xl border border-amber-100 bg-amber-50 p-4">
              <p className="text-[11px] font-black text-amber-700">故事边界</p>
              <div className="mt-3 space-y-2 text-[12.5px] leading-6 text-gray-700">
                <p><strong className="text-gray-900">洋葱成立处：</strong>{user.retention}</p>
                <p><strong className="text-gray-900">切走风险：</strong>{user.risk}</p>
                <p className="text-[12px] text-gray-500">{storyBoundaryNote(user)}</p>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-6 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2">
            <Route size={16} color={ACCENT} />
            <h2 className="text-[15px] font-black text-gray-900">用户选择链路</h2>
          </div>
          <p className="mt-2 text-[12px] leading-6 text-gray-500">
            按“是谁 - 什么状态 - 想要什么 - 用了什么 - 证明时刻 - 原声 - 留下/切走边界”的顺序看，避免把用户直接压缩成一个标签。
          </p>
          <div className="mt-4 grid gap-2">
            <ChainRow label="是谁">
              {user.region} · {user.grade} · {user.subjects.join('/')}
            </ChainRow>
            <ChainRow label="是什么状态">
              {user.learningStatus}；{user.pressure}
            </ChainRow>
            <ChainRow label="想要什么">
              {user.currentGoal}；{user.answerVsLearn}
            </ChainRow>
            <ChainRow label="用了什么">
              {user.tools.join(' / ')}；主要截流：{user.primaryCompetitor}
            </ChainRow>
            <ChainRow label={proofMomentTitle(user)}>
              {user.scene}
            </ChainRow>
            <ChainRow label="用户原声">
              “{user.quote}”
            </ChainRow>
            <ChainRow label="留下/切走边界">
              {user.retention} {user.risk}
            </ChainRow>
          </div>
        </section>

        <div className="mt-6 grid gap-5 lg:grid-cols-[1.25fr_0.75fr]">
          <div className="space-y-5">
            <DetailSection icon={<Search size={15} />} title="使用场景">
              <p className="text-[13px] leading-7 text-gray-600">{user.scene}</p>
            </DetailSection>

            <DetailSection icon={<Target size={15} />} title="JTBD">
              <p className="rounded-xl border border-gray-100 bg-[#FAFAF8] p-4 text-[14px] font-semibold leading-7 text-gray-800">{user.jtbd}</p>
            </DetailSection>

            <DetailSection icon={<Route size={15} />} title={relationshipTitle}>
              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <h3 className="mb-3 text-[12px] font-black text-emerald-700">{positiveHeading}</h3>
                  <BulletList items={user.whyOnionWins} positive />
                </div>
                <div>
                  <h3 className="mb-3 text-[12px] font-black text-rose-700">{negativeHeading}</h3>
                  <BulletList items={user.whySwitches} positive={false} />
                </div>
              </div>
            </DetailSection>
          </div>

          <div className="space-y-5">
            <DetailSection icon={<Brain size={15} />} title={judgmentHeading}>
              <div className="space-y-3">
                <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-3">
                  <p className="text-[11px] font-bold text-emerald-700">{retentionHeading}</p>
                  <p className="mt-1.5 text-[12px] leading-5 text-gray-700">{user.retention}</p>
                </div>
                <div className="rounded-xl border border-rose-100 bg-rose-50 p-3">
                  <p className="text-[11px] font-bold text-rose-700">{riskHeading}</p>
                  <p className="mt-1.5 text-[12px] leading-5 text-gray-700">{user.risk}</p>
                </div>
              </div>
            </DetailSection>

            <DetailSection icon={<Sparkles size={15} />} title="营销启发">
              <div className="space-y-3">
                <div>
                  <p className="text-[10px] font-bold tracking-widest text-gray-400">传播角度</p>
                  <p className="mt-1 text-[13px] font-bold leading-6 text-gray-900">{user.marketing.angle}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold tracking-widest text-gray-400">素材钩子</p>
                  <p className="mt-1 text-[13px] leading-6 text-gray-700">“{user.marketing.hook}”</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold tracking-widest text-gray-400">适合渠道</p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {user.marketing.channels.map((channel) => <Pill key={channel}>{channel}</Pill>)}
                  </div>
                </div>
                <div className="rounded-xl border border-amber-100 bg-amber-50 p-3">
                  <p className="text-[10px] font-bold tracking-widest text-amber-700">避免话术</p>
                  <p className="mt-1 text-[12px] leading-5 text-gray-700">{user.marketing.avoid}</p>
                </div>
              </div>
            </DetailSection>
          </div>
        </div>

        <section className="mt-6 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2">
            <MessageSquareQuote size={16} color={ACCENT} />
            <h2 className="text-[15px] font-black text-gray-900">业务阅读提示</h2>
          </div>
          <p className="mt-3 text-[12.5px] leading-6 text-gray-600">
            这张详情页不是把用户归纳成抽象标签，而是保留一个真实学生的使用链路。投放和内容团队应从这里判断：这个学生在哪个状态会被洋葱打动，在哪个状态会被竞品截走，以及哪一句话最可能让他愿意试一次。
          </p>
        </section>
      </main>
    </div>
  );
}

export default function PaisouUserStoriesPage() {
  const { userId } = useParams<{ userId?: string }>();
  const user = userId ? PAISOU_USERS.find((item) => item.id === userId) : undefined;

  if (!userId) return <OverviewPage />;
  if (!user) {
    return (
      <div className="flex h-full flex-col items-center justify-center bg-[#f8f8f5] text-center">
        <ExternalLink size={26} className="text-gray-300" />
        <p className="mt-3 text-[14px] font-bold text-gray-700">没有找到这个用户故事</p>
        <a href="/projects/paisou_project/qualitative" className="mt-2 text-[12px] font-semibold text-[#e65532]">
          返回拍搜用户卡片
        </a>
      </div>
    );
  }
  return <UserDetailPage user={user} />;
}
