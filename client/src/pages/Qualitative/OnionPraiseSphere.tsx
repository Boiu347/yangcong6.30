import React from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface OnionQuote {
  id: string;
  user: string;
  shortQuote: string;
  fullQuote: string;
  context: string;
  whyPositive: string;
  tags: string[];
  source: string;
}

const ONION_QUOTES: OnionQuote[] = [
  {
    id: 'xu-01',
    user: '徐同学',
    shortQuote: '从你理解得到的角度讲',
    fullQuote: '洋葱会用一些从你理解得到的角度跟你讲，然后你不懂……他还会跟你详细讲，举例子这种。',
    context: '用户在对比不同解题工具时，强调洋葱不是只给答案，而是会把讲解转换成学生能接住的表达。',
    whyPositive: '正向点在于讲题语言贴近学生理解路径，并通过举例补足认知台阶。',
    tags: ['听得懂', '讲题细', '举例讲解'],
    source: '用户2 徐同学访谈',
  },
  {
    id: 'xu-02',
    user: '徐同学',
    shortQuote: '一道题不会，会通俗易懂地讲',
    fullQuote: '就比如你一道题不会，他会从通俗易懂的……他会通过这种举例子的方式。',
    context: '用户描述拍题后遇到不会的题时，洋葱的价值不是跳步骤，而是用通俗方式把题讲开。',
    whyPositive: '说明洋葱拍搜在“不会题”的场景里能承担解释和教学功能。',
    tags: ['通俗易懂', '不会题', '举例讲解'],
    source: '用户2 徐同学访谈',
  },
  {
    id: 'xu-03',
    user: '徐同学',
    shortQuote: '翻译成能听懂的通俗语言',
    fullQuote: '它会翻译成你能听得懂的那种通俗语言，不会是那种文绉绉的感觉。',
    context: '用户继续解释为什么洋葱讲解更容易吸收，核心是把学科语言转成学生语言。',
    whyPositive: '正向点在于降低理解门槛，避免解析看起来正确但学生读不进去。',
    tags: ['听得懂', '学生语言', '降低门槛'],
    source: '用户2 徐同学访谈',
  },
  {
    id: 'xu-04',
    user: '徐同学',
    shortQuote: '同类题之后都会做了',
    fullQuote: '同类题之后都会做了。就是洋葱里。',
    context: '访谈问理想的拍题/讲题效果时，用户把“学会同类题”直接指向洋葱。',
    whyPositive: '说明洋葱的目标不只是解出当前题，而是形成题型迁移。',
    tags: ['学会一类题', '题型迁移', '理想效果'],
    source: '用户2 徐同学访谈',
  },
  {
    id: 'xu-05',
    user: '徐同学',
    shortQuote: '知识点涵盖完全，基本不会错',
    fullQuote: '就是它基本上有些知识可能把所有知识点都给涵盖完全了，基本上就已经不会错了。',
    context: '用户评价洋葱对知识点覆盖的完整度，认为覆盖完整后能减少同类错误。',
    whyPositive: '正向点在于系统性补知识点，而不是孤立解释一道题。',
    tags: ['知识点完整', '少犯错', '系统学习'],
    source: '用户2 徐同学访谈',
  },
  {
    id: 'xu-06',
    user: '徐同学',
    shortQuote: '适合更精细化的操作',
    fullQuote: '洋葱就是……适合更精细化的操作，然后豆包适合你时间不够了。',
    context: '用户对比豆包和洋葱：时间紧时用豆包，想把题真正弄懂时更适合洋葱。',
    whyPositive: '明确了洋葱在深度讲解、精细理解上的优势定位。',
    tags: ['精细讲解', '竞品对比', '深度理解'],
    source: '用户2 徐同学访谈',
  },
  {
    id: 'xu-07',
    user: '徐同学',
    shortQuote: '讲题、解题思路、相同题类型',
    fullQuote: '讲题，解题思路。给相同题的类型。',
    context: '用户总结洋葱拍搜对自己最有用的部分：讲题、拆解思路、补充同类型题。',
    whyPositive: '直接命中拍搜业务价值：从答案走向思路和题型训练。',
    tags: ['解题思路', '同类题', '讲题'],
    source: '用户2 徐同学访谈',
  },
  {
    id: 'xu-08',
    user: '徐同学',
    shortQuote: '先把这种题弄懂',
    fullQuote: '在时间充足的时候，就是比较适合有耐心的一些学生。目的是就是首先把这种题弄懂。这类题。',
    context: '用户说明洋葱更适合愿意花时间理解的人，目标是把这一类题真正弄懂。',
    whyPositive: '说明洋葱拍搜能承接“深度学习”场景，而不是只服务快速抄答案。',
    tags: ['弄懂一类题', '耐心学习', '深度场景'],
    source: '用户2 徐同学访谈',
  },
  {
    id: 'xp-01',
    user: '新鹏',
    shortQuote: '练题一般用洋葱',
    fullQuote: '拍题，然后极少情况下会用作业帮练题，因为作业帮那题全是也没啥难度，所以我一般练题都用洋葱的。',
    context: '用户谈到拍题和练题工具选择时，把洋葱作为主要练题渠道，并把作业帮作为低频替代。',
    whyPositive: '正向点在于洋葱题目难度和练习价值被学生认可。',
    tags: ['练题价值', '竞品对比', '题目质量'],
    source: '用户5 新鹏访谈',
  },
  {
    id: 'xp-02',
    user: '新鹏',
    shortQuote: '先看步骤，再去洋葱看知识点',
    fullQuote: '我一般是这么用，先看一眼步骤，然后如果这里面知识点没记牢的话，就去洋葱看一眼这个知识点，然后再回来再推一遍。',
    context: '用户描述自己的解题链路：先看解析步骤，发现知识点薄弱后回到洋葱补知识点，再重新推题。',
    whyPositive: '说明洋葱在拍题后能补上知识点复习，帮助学生重新独立解题。',
    tags: ['知识点补齐', '重新推题', '解题闭环'],
    source: '用户5 新鹏访谈',
  },
  {
    id: 'xp-03',
    user: '新鹏',
    shortQuote: '洋葱知识点能帮你弄懂',
    fullQuote: '大多数情况能弄懂，其实是指的洋葱的知识点能帮你弄懂……对啊。',
    context: '用户被追问“大多数情况能弄懂”具体来自哪里时，明确指向洋葱的知识点讲解。',
    whyPositive: '把“能弄懂”的因果归因到洋葱内容本身，而不是偶然做对。',
    tags: ['能弄懂', '知识点讲解', '学习效果'],
    source: '用户5 新鹏访谈',
  },
  {
    id: 'xp-04',
    user: '新鹏',
    shortQuote: '题库扩充后识别会更准',
    fullQuote: '可能会更准吧。建议的话就扩充一些题库之类的，就这样识别可能会更准。',
    context: '用户在肯定拍搜方向的基础上提出改进建议，希望题库更全、识别更准。',
    whyPositive: '这是面向拍搜能力的建设性反馈，说明用户认可当前路径并期待增强。',
    tags: ['拍搜识别', '题库', '改进建议'],
    source: '用户5 新鹏访谈',
  },
  {
    id: 'ns-01',
    user: '诺诗',
    shortQuote: '洋葱应该是最常用的',
    fullQuote: '洋葱，应该是。在洋葱搜不到一样的题，就会用作业帮去搜。',
    context: '用户被问常用工具时先回答洋葱，并说明只有洋葱搜不到同题时才转向作业帮。',
    whyPositive: '体现洋葱在拍搜/搜题场景中的优先级高于竞品。',
    tags: ['首选工具', '竞品对比', '搜题'],
    source: '用户6 诺诗访谈',
  },
  {
    id: 'ns-02',
    user: '诺诗',
    shortQuote: '更容易理解，也更有兴趣',
    fullQuote: '更容易理解。让我更有兴趣一点。作业帮他讲得太无聊了。',
    context: '用户对比洋葱和作业帮，认为洋葱讲解更容易理解，也更能激发兴趣。',
    whyPositive: '正向点同时覆盖理解效率和学习意愿。',
    tags: ['更易理解', '更有兴趣', '竞品对比'],
    source: '用户6 诺诗访谈',
  },
  {
    id: 'ns-03',
    user: '诺诗',
    shortQuote: '比较温柔、委婉、有耐心',
    fullQuote: '比较温柔的，委婉啊……有耐心。朋友。因为他说话不像老师。',
    context: '用户描述喜欢洋葱讲解角色的原因，认为它不像老师训导，更像朋友陪伴。',
    whyPositive: '说明洋葱的讲解人格能降低学生压力，让拍题后的学习更愿意继续。',
    tags: ['有耐心', '朋友感', '低压力'],
    source: '用户6 诺诗访谈',
  },
  {
    id: 'ns-04',
    user: '诺诗',
    shortQuote: '一步一步来，不会突然冒步骤',
    fullQuote: '洋葱它会一步一步来，就不会像作业帮那样子莫名其妙地出现一个步骤。我现在还没搞懂这个步骤是哪里来的。',
    context: '用户对比作业帮解析，认为洋葱不会跳步，步骤来源更清楚。',
    whyPositive: '命中拍搜解析最关键的问题：学生需要知道每一步从哪里来。',
    tags: ['不跳步', '步骤清楚', '竞品对比'],
    source: '用户6 诺诗访谈',
  },
  {
    id: 'ns-05',
    user: '诺诗',
    shortQuote: '先说思路，再从第一步开始',
    fullQuote: '先说了我们思路，然后再从思路中的第一步开始。',
    context: '用户说明洋葱的讲题顺序：先搭建解题思路，再展开步骤。',
    whyPositive: '说明洋葱不是堆答案步骤，而是先帮助学生形成解题框架。',
    tags: ['解题思路', '步骤拆解', '讲题结构'],
    source: '用户6 诺诗访谈',
  },
  {
    id: 'ns-06',
    user: '诺诗',
    shortQuote: '会有恍然大悟的感觉',
    fullQuote: '就是让他那个解题思路或者是那个解析的时候恍然大悟，原来这个题是这么做的。',
    context: '用户描述理想讲解效果时，用“恍然大悟”来表达理解被打通的瞬间。',
    whyPositive: '体现洋葱讲解能让学生从看懂答案走向理解题目本质。',
    tags: ['恍然大悟', '理解打通', '解题思路'],
    source: '用户6 诺诗访谈',
  },
  {
    id: 'ns-07',
    user: '诺诗',
    shortQuote: '看一点点就想起知识点',
    fullQuote: '比如上次做几何题的时候……看了前面的一点点……突然想起来老师在课上讲过这个知识点，然后就会了。',
    context: '用户举几何题例子：看洋葱解析前面一点，就唤起课堂知识点并完成解题。',
    whyPositive: '说明洋葱拍搜能够激活已有知识，而不是替学生直接完成。',
    tags: ['激活知识点', '几何题', '独立解题'],
    source: '用户6 诺诗访谈',
  },
  {
    id: 'ns-08',
    user: '诺诗',
    shortQuote: '想到知识点就有解题思路',
    fullQuote: '他考的是哪个知识点……想到这个知识点的时候……有解题思路的。',
    context: '用户解释自己如何从题目回到知识点，再从知识点生成解题思路。',
    whyPositive: '说明洋葱把题和知识点连接起来，帮助学生建立可迁移的思考路径。',
    tags: ['知识点定位', '解题思路', '迁移'],
    source: '用户6 诺诗访谈',
  },
  {
    id: 'ns-09',
    user: '诺诗',
    shortQuote: '自己写一遍，再标重点步骤',
    fullQuote: '我会先自己写一遍，然后再用红笔在旁边把那个一些重点和一些步骤再写下来。',
    context: '用户说自己会先独立完成，再根据解析把重点和关键步骤整理出来。',
    whyPositive: '说明洋葱解析能支持学生形成复盘和错题整理动作。',
    tags: ['复盘', '重点步骤', '主动整理'],
    source: '用户6 诺诗访谈',
  },
  {
    id: 'ns-10',
    user: '诺诗',
    shortQuote: '写对题，还学会一种题型',
    fullQuote: '来源于我把这道题写对，然后学会了一种题型。',
    context: '用户描述成就感来源，不只是做对当前题，还包括学会一种题型。',
    whyPositive: '直接对应拍搜的更高价值：从单题结果升级为题型能力。',
    tags: ['学会一类题', '成就感', '题型能力'],
    source: '用户6 诺诗访谈',
  },
  {
    id: 'xl-01',
    user: '小林',
    shortQuote: '边听洋葱课才能边写',
    fullQuote: '数学我都要边听你们洋葱的课我才能边写。先听完再写作业。',
    context: '用户在作业场景中把洋葱课作为写题前的必要支撑，先听课再做题。',
    whyPositive: '说明洋葱视频/课程能在拍搜之外承接“补课后再做题”的学习链路。',
    tags: ['推荐视频', '先学后做', '作业场景'],
    source: '用户8 小林访谈',
  },
  {
    id: 'xl-02',
    user: '小林',
    shortQuote: '听完后就会很多了',
    fullQuote: '听的话可能会错很多，或者根本不会写。听完后就会很多了呀。',
    context: '用户解释听洋葱课前后做题差异：不听时不会写或错很多，听完后明显会做更多。',
    whyPositive: '直接体现洋葱视频对做题正确率和动笔能力的帮助。',
    tags: ['听完会做', '正确率', '推荐视频有效'],
    source: '用户8 小林访谈',
  },
  {
    id: 'xl-03',
    user: '小林',
    shortQuote: '不看错八道，看了可能错五道',
    fullQuote: '如果有10道的话，可能会错5道吧。之前不看洋葱做作业能错几道啊？能错八道。',
    context: '用户用错题数量对比说明洋葱课带来的改善，从不看错八道到看后约错五道。',
    whyPositive: '虽然不是完全正确，但用户清楚感知到洋葱降低了错误率。',
    tags: ['少错题', '效果感知', '作业提升'],
    source: '用户8 小林访谈',
  },
  {
    id: 'xl-04',
    user: '小林',
    shortQuote: '去看看洋葱，再重新做一遍',
    fullQuote: '去看看洋葱呗，我先再把洋葱的课看一遍。我就把洋葱课上的题当做例题了，我看完之后我再重新去做一遍。',
    context: '用户遇到题不会时，会先看洋葱课程，把课程例题当作参照，再回到原题重做。',
    whyPositive: '说明洋葱能把拍题后的卡点转成“看例题-再尝试”的学习闭环。',
    tags: ['例题迁移', '重新做题', '学习闭环'],
    source: '用户8 小林访谈',
  },
  {
    id: 'xl-05',
    user: '小林',
    shortQuote: '用相关课程把知识记下来',
    fullQuote: '因为洋葱它不是说会给我们相关的课程嘛……都用洋葱去看这些相关的课程，然后把这些知识记下来。',
    context: '用户说明拍题后相关课程的价值：不是只看答案，而是把相关知识系统记下来。',
    whyPositive: '对应拍搜里的推荐课程能力，帮助学生补知识而不是只补答案。',
    tags: ['相关课程', '记知识', '系统学习'],
    source: '用户8 小林访谈',
  },
  {
    id: 'xl-06',
    user: '小林',
    shortQuote: '第一时间先点拍题和推荐视频',
    fullQuote: '先会用洋葱吧。第一时间先去点拍题。推荐视频。',
    context: '用户被问遇到不会题第一步怎么做时，回答先用洋葱、点拍题，并看推荐视频。',
    whyPositive: '直接证明洋葱拍搜和推荐视频在真实不会题场景里的首选地位。',
    tags: ['拍题首选', '推荐视频', '不会题'],
    source: '用户8 小林访谈',
  },
  {
    id: 'xl-07',
    user: '小林',
    shortQuote: '看视频、记笔记、研解半个多小时',
    fullQuote: '加上视频的话。10分，然后做完了，再去把这个课程重新看一遍，我有一个自己的笔记本……专门来记这些课程上面问题的笔记本。一个视频，看视频的时间加记笔记的时间加研解的时间，半个多小时。2遍以上。',
    context: '用户会围绕推荐视频做完整学习动作：看视频、做题、回看、记笔记、研究解析，并且反复看。',
    whyPositive: '说明洋葱拍搜能触发深度学习行为，而不是一次性查答案。',
    tags: ['深度学习', '记笔记', '反复观看'],
    source: '用户8 小林访谈',
  },
  {
    id: 'xl-08',
    user: '小林',
    shortQuote: '有了题型思路，其他就会做',
    fullQuote: '洋葱它的课程里面……老师们都会给我们出一些题，给我们当做例题来讲。我也把这些当做例题了，我有了这种题型的大概思路之后，我其他的我就会做了。',
    context: '用户把课程题当例题，获得题型思路后迁移到其他题。',
    whyPositive: '直接说明洋葱在题型迁移和举一反三上的价值。',
    tags: ['题型思路', '举一反三', '例题迁移'],
    source: '用户8 小林访谈',
  },
  {
    id: 'xl-09',
    user: '小林',
    shortQuote: '10次有6次能做对',
    fullQuote: '10次有6次能做对。',
    context: '用户在讲完“看洋葱例题后再做同类题”的链路后，给出成功率感知。',
    whyPositive: '即便不是百分百，也说明用户感到洋葱能显著提高同类题做对概率。',
    tags: ['做对概率', '同类题', '效果感知'],
    source: '用户8 小林访谈',
  },
  {
    id: 'xl-10',
    user: '小林',
    shortQuote: '完完全全不懂就用洋葱',
    fullQuote: '完完全全搞不懂的话，那可以用洋葱。有一丢丢思路，做了答案之后感觉不对劲再去问豆包。',
    context: '用户区分工具使用场景：完全不懂时用洋葱，有一点思路但想校验时再问豆包。',
    whyPositive: '说明洋葱更适合从零讲懂、搭建基础理解的场景。',
    tags: ['从零讲懂', '竞品对比', '场景分工'],
    source: '用户8 小林访谈',
  },
  {
    id: 'xl-11',
    user: '小林',
    shortQuote: '肯定是洋葱，它可以给我上课',
    fullQuote: '那肯定是洋葱啊。它可以给我上课。我能听。能听得懂。',
    context: '用户在选择工具时明确偏向洋葱，理由是洋葱能像上课一样讲，并且自己听得懂。',
    whyPositive: '浓缩了洋葱拍搜差异：不仅回答问题，还能教学。',
    tags: ['能上课', '听得懂', '工具首选'],
    source: '用户8 小林访谈',
  },
  {
    id: 'xl-12',
    user: '小林',
    shortQuote: '有帮助，提分30多分',
    fullQuote: '有帮助。提分。30多分。平时都是只能考60多分的……没想到一下子提了30多。',
    context: '用户谈洋葱对学习结果的帮助时，把帮助具体化为分数提升。',
    whyPositive: '这是最直接的业务价值表达：学生把提分结果归因到洋葱学习帮助。',
    tags: ['提分', '学习结果', '强证据'],
    source: '用户8 小林访谈',
  },
];

const SPHERE_RADIUS = 224;

function getSpherePoint(index: number, total: number) {
  const offset = 2 / total;
  const increment = Math.PI * (3 - Math.sqrt(5));
  const y = index * offset - 1 + offset / 2;
  const radius = Math.sqrt(1 - y * y);
  const phi = index * increment;

  return {
    x: Math.cos(phi) * radius,
    y,
    z: Math.sin(phi) * radius,
  };
}

function QuoteDetailModal({
  quote,
  onClose,
}: {
  quote: OnionQuote | null;
  onClose: () => void;
}) {
  React.useEffect(() => {
    if (!quote) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [quote, onClose]);

  if (!quote) return null;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/35 px-4 py-6"
      role="dialog"
      aria-modal="true"
      aria-label={`${quote.user}的洋葱拍搜原声`}
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl rounded-lg bg-[#FEFDF9] border border-[#E8E2D9] shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 border-b border-[#E8E2D9] px-6 py-5">
          <div>
            <div className="flex items-center gap-2 text-[12px] text-gray-500">
              <span className="rounded-full bg-[#F4E9DF] px-2 py-0.5 font-semibold text-[#B66A45]">
                {quote.user}
              </span>
              <span>{quote.source}</span>
            </div>
            <h3 className="mt-3 text-[20px] font-bold leading-snug text-gray-950">
              “{quote.shortQuote}”
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700"
            aria-label="关闭"
          >
            <X size={18} />
          </button>
        </div>

        <div className="space-y-5 px-6 py-5">
          <div>
            <p className="mb-2 text-[12px] font-semibold text-[#B66A45]">完整原声</p>
            <p className="text-[18px] font-semibold leading-relaxed text-gray-900">
              “{quote.fullQuote}”
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <p className="mb-2 text-[12px] font-semibold text-gray-500">上下文</p>
              <p className="text-[14px] leading-relaxed text-gray-700">{quote.context}</p>
            </div>
            <div>
              <p className="mb-2 text-[12px] font-semibold text-gray-500">为什么是正向</p>
              <p className="text-[14px] leading-relaxed text-gray-700">{quote.whyPositive}</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {quote.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-[#E8E2D9] bg-white px-2.5 py-1 text-[12px] font-medium text-gray-600"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function OnionPraiseSphere() {
  const [selectedQuote, setSelectedQuote] = React.useState<OnionQuote | null>(null);
  const [rotation, setRotation] = React.useState(0);
  const [paused, setPaused] = React.useState(false);
  const points = React.useMemo(
    () => ONION_QUOTES.map((_, index) => getSpherePoint(index, ONION_QUOTES.length)),
    [],
  );

  React.useEffect(() => {
    let frame = 0;
    let last = performance.now();

    const tick = (time: number) => {
      const delta = time - last;
      last = time;
      if (!paused) {
        setRotation((value) => value + delta * 0.00022);
      }
      frame = window.requestAnimationFrame(tick);
    };

    frame = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frame);
  }, [paused]);

  return (
    <section className="rounded-lg border border-[#E8E2D9] bg-[#FEFDF9] px-5 py-5 shadow-[3px_4px_0_rgba(0,0,0,0.04)]">
      <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-[12px] font-semibold text-[#B66A45]">洋葱拍搜正向原声</p>
          <h3 className="mt-1 text-[18px] font-bold text-gray-950">学生说得清楚：洋葱不是只给答案，而是帮他把题听懂</h3>
        </div>
        <div className="flex flex-wrap gap-2 text-[12px] text-gray-500">
          <span className="rounded-full border border-[#E8E2D9] bg-white px-2.5 py-1">讲题细</span>
          <span className="rounded-full border border-[#E8E2D9] bg-white px-2.5 py-1">推荐视频有效</span>
          <span className="rounded-full border border-[#E8E2D9] bg-white px-2.5 py-1">学会一类题</span>
          <span className="rounded-full border border-[#E8E2D9] bg-white px-2.5 py-1">{ONION_QUOTES.length} 条拍搜相关原声</span>
        </div>
      </div>

      <div className="hidden md:block">
        <div
          className="relative isolate mx-auto h-[520px] max-w-[760px] overflow-hidden"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <div className="absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#E8E2D9]" />
          <div className="absolute left-1/2 top-1/2 h-[420px] w-[160px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#EFE8DE]" />
          <div className="absolute left-1/2 top-1/2 h-[160px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#EFE8DE]" />

          {ONION_QUOTES.map((quote, index) => {
            const point = points[index];
            const cos = Math.cos(rotation);
            const sin = Math.sin(rotation);
            const x = (point.x * cos - point.z * sin) * SPHERE_RADIUS;
            const z = (point.x * sin + point.z * cos) * SPHERE_RADIUS;
            const y = point.y * SPHERE_RADIUS * 0.82;
            const depth = (z / SPHERE_RADIUS + 1) / 2;
            const scale = 0.72 + depth * 0.38;
            const opacity = 0.42 + depth * 0.58;

            return (
              <button
                key={quote.id}
                type="button"
                onClick={() => setSelectedQuote(quote)}
                className={cn(
                  'absolute left-1/2 top-1/2 max-w-[190px] rounded-full border px-3 py-1.5 text-center text-[12px] font-semibold leading-snug',
                  'bg-white/95 text-gray-700 shadow-sm transition-colors hover:border-[#D99065] hover:text-[#B66A45] focus:outline-none focus:ring-2 focus:ring-[#D99065]/40',
                )}
                style={
                  {
                    transform: `translate(-50%, -50%) translate(${x}px, ${y}px) scale(${scale})`,
                    opacity,
                    zIndex: Math.round(depth * 100),
                  } as React.CSSProperties
                }
              >
                {quote.shortQuote}
              </button>
            );
          })}
        </div>
      </div>

      <div className="md:hidden">
        <div className="flex snap-x gap-3 overflow-x-auto pb-2">
          {ONION_QUOTES.map((quote) => (
            <button
              key={quote.id}
              type="button"
              onClick={() => setSelectedQuote(quote)}
              className="min-w-[76%] snap-start rounded-lg border border-[#E8E2D9] bg-white p-4 text-left shadow-sm"
            >
              <span className="text-[12px] font-semibold text-[#B66A45]">{quote.user}</span>
              <p className="mt-2 text-[15px] font-bold leading-snug text-gray-900">“{quote.shortQuote}”</p>
              <p className="mt-2 line-clamp-3 text-[13px] leading-relaxed text-gray-600">{quote.context}</p>
            </button>
          ))}
        </div>
      </div>

      <QuoteDetailModal quote={selectedQuote} onClose={() => setSelectedQuote(null)} />
    </section>
  );
}
