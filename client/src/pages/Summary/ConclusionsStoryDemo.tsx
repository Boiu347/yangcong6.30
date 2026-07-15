import {
  ArrowDown,
  ArrowRight,
  BookOpen,
  CircleCheck,
  Eye,
  FileText,
  Headphones,
  Lightbulb,
  Quote,
  Sparkles,
  Target,
  TriangleAlert,
} from 'lucide-react';
import EvidenceAudioClips from '@/components/EvidenceAudioClips';
import type { EvidenceClip } from '@/utils/evidenceClipLookup';
import { clipMetaByUrl } from './conclusionMaps';

const SOURCE_URL =
  'https://guanghe.feishu.cn/wiki/XvjcwdzsZiEiJ1kF9UOcburXnig?from=from_copylink';

const KEY_NUMBERS = [
  { value: '53%', label: '被趣味动画课打动' },
  { value: '40%', label: '因为孩子喜欢' },
  { value: '31%', label: '期待未来更快听懂理科' },
];

const COMPETITORS = [
  { name: 'NB 实验室', hook: '安全的触屏实验', tone: 'bg-[#DDF5EF]' },
  { name: '妙懂物理', hook: 'AR 直观 + 题库', tone: 'bg-[#E8E1FF]' },
  { name: '万物指南', hook: '权威 IP 背书', tone: 'bg-[#FFE8BA]' },
  { name: '真人实验课', hook: '老师带着做实验', tone: 'bg-[#FFDCD6]' },
];

const ACTIONS = [
  {
    number: '01',
    title: '先把专业概念讲成孩子的话',
    text: '优先优化概念儿童化、答题朗读和生活化解释，让低龄孩子真的听得懂。',
    icon: BookOpen,
  },
  {
    number: '02',
    title: '再让启蒙效果被家长看见',
    text: '用孩子复述、生活现象解释、实验成果和阶段报告，回答“到底学到了什么”。',
    icon: Eye,
  },
  {
    number: '03',
    title: '最后把课程价值压缩成一句话',
    text: '比纯兴趣内容更系统，比提前学课程更轻松——一门低压力的学科启蒙课。',
    icon: Target,
  },
];

function VoiceQuote({
  clipUrl,
  eyebrow,
  dark = false,
}: {
  clipUrl: string;
  eyebrow: string;
  dark?: boolean;
}) {
  const meta = clipMetaByUrl[clipUrl];
  const clips: EvidenceClip[] = [{ clipUrl, startTime: 0, duration: 0 }];

  return (
    <figure
      className={`border-l-2 pl-5 md:pl-7 ${
        dark ? 'border-[#C9FF5B]' : 'border-[#191816]'
      }`}
    >
      <div
        className={`mb-4 flex items-center gap-2 text-[11px] font-black tracking-[0.16em] ${
          dark ? 'text-[#C9FF5B]' : 'text-[#9C4A2F]'
        }`}
      >
        <Headphones size={14} />
        {eyebrow}
      </div>
      <blockquote
        className={`text-[20px] font-black leading-[1.65] md:text-[26px] ${
          dark ? 'text-white' : 'text-[#25211D]'
        }`}
      >
        “{meta?.text}”
      </blockquote>
      <figcaption
        className={`mt-4 text-[12px] font-bold ${
          dark ? 'text-white/55' : 'text-[#8A7E71]'
        }`}
      >
        — {meta?.source}
      </figcaption>
      <EvidenceAudioClips clips={clips} className="mt-4 max-w-[360px]" />
    </figure>
  );
}

function ChapterMarker({
  number,
  label,
  light = false,
}: {
  number: string;
  label: string;
  light?: boolean;
}) {
  return (
    <div
      className={`mb-8 flex items-center gap-3 text-[11px] font-black tracking-[0.16em] ${
        light ? 'text-white/60' : 'text-[#83796E]'
      }`}
    >
      <span
        className={`grid size-8 place-items-center rounded-full border ${
          light
            ? 'border-white/30 text-[#C9FF5B]'
            : 'border-[#BFB3A6] text-[#9C4A2F]'
        }`}
      >
        {number}
      </span>
      {label}
    </div>
  );
}

export default function ConclusionsStoryDemo() {
  return (
    <main className="min-h-full overflow-x-hidden bg-[#F6F0E7] text-[#191816]">
      <section className="relative isolate min-h-[calc(100vh-52px)] overflow-hidden border-b border-[#D7CCBF]">
        <div className="pointer-events-none absolute -right-24 top-14 -z-10 size-[420px] rounded-full border-[72px] border-[#E95B35]/10 md:size-[620px]" />
        <div className="mx-auto flex min-h-[calc(100vh-52px)] max-w-[1280px] flex-col px-5 py-8 md:px-10 md:py-12 lg:px-14">
          <div className="flex items-center justify-between border-b border-[#CFC3B5] pb-4">
            <p className="text-[11px] font-black tracking-[0.18em] text-[#9C4A2F]">
              FROM PRIMARY · RESEARCH DEMO
            </p>
            <a
              href={SOURCE_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-[12px] font-black text-[#5C554E] transition hover:text-[#E95B35]"
            >
              <FileText size={14} />
              查看研究素材
            </a>
          </div>

          <div className="grid flex-1 items-center gap-12 py-12 lg:grid-cols-[minmax(0,1.35fr)_minmax(300px,.65fr)] lg:gap-20">
            <div>
              <p className="mb-7 inline-flex items-center gap-2 rounded-full border border-[#CFC3B5] px-3 py-1.5 text-[11px] font-black tracking-[0.12em] text-[#73695F]">
                <Sparkles size={13} className="text-[#E95B35]" />
                一句话结论
              </p>
              <h1 className="max-w-[900px] text-[44px] font-black leading-[1.12] tracking-[-0.045em] sm:text-[58px] md:text-[72px] lg:text-[82px]">
                从小学物理，
                <br />
                卖的不是
                <span className="relative mx-2 inline-block">
                  <span className="absolute inset-x-[-4px] bottom-[5px] -z-10 h-[32%] -rotate-1 bg-[#FFCF4A]" />
                  更早学物理
                </span>
                ，
                <br />
                而是低压力的
                <br />
                <span className="text-[#E95B35]">学科启蒙。</span>
              </h1>
              <p className="mt-8 max-w-[680px] text-[17px] font-semibold leading-8 text-[#655D54] md:text-[20px] md:leading-9">
                孩子因为有趣愿意看，家长因为未来学理科
                <span className="font-black text-[#191816]">
                  不陌生、不畏难
                </span>
                而买单。
              </p>
            </div>

            <div className="self-end border-t border-[#BEB1A3] pt-6 lg:self-center">
              <p className="text-[11px] font-black tracking-[0.16em] text-[#9C4A2F]">
                读完只需记住三件事
              </p>
              <ol className="mt-5 space-y-5">
                {[
                  ['01', '核心人群', '小学 1—4 年级'],
                  ['02', '购买入口', '孩子愿意看'],
                  ['03', '成交理由', '未来学理科更轻松'],
                ].map(([number, label, value]) => (
                  <li
                    key={number}
                    className="grid grid-cols-[34px_86px_1fr] items-baseline border-b border-[#D9CEC1] pb-4"
                  >
                    <span className="text-[11px] font-black text-[#B0A397]">
                      {number}
                    </span>
                    <span className="text-[12px] font-bold text-[#83796E]">
                      {label}
                    </span>
                    <span className="text-[15px] font-black text-[#25211D]">
                      {value}
                    </span>
                  </li>
                ))}
              </ol>
            </div>
          </div>

          <a
            href="#buy-reason"
            className="flex w-fit items-center gap-2 pb-1 text-[12px] font-black tracking-[0.12em] text-[#655D54]"
          >
            继续往下看
            <ArrowDown size={16} className="animate-bounce" />
          </a>
        </div>
      </section>

      <section id="buy-reason" className="scroll-mt-16 bg-[#FFF4CC]">
        <div className="mx-auto max-w-[1280px] px-5 py-20 md:px-10 md:py-28 lg:px-14 lg:py-36">
          <ChapterMarker number="01" label="购买动机" />
          <div className="grid gap-14 lg:grid-cols-[minmax(0,.9fr)_minmax(0,1.1fr)] lg:gap-24">
            <div>
              <h2 className="text-[38px] font-black leading-[1.2] tracking-[-0.035em] md:text-[54px]">
                家长买的是兴趣，
                <br />
                还是升学？
              </h2>
              <p className="mt-7 max-w-[520px] text-[17px] font-semibold leading-8 text-[#695F4D]">
                两者都需要，但作用不同：
                <span className="font-black text-[#25211D]">
                  兴趣负责开门，未来学科价值负责买单。
                </span>
              </p>

              <div className="mt-12 grid grid-cols-3 border-y border-[#CDBE8B]">
                {KEY_NUMBERS.map((item) => (
                  <div
                    key={item.value}
                    className="border-r border-[#CDBE8B] px-3 py-6 last:border-r-0 md:px-5"
                  >
                    <p className="text-[32px] font-black tracking-[-0.04em] text-[#E95B35] md:text-[44px]">
                      {item.value}
                    </p>
                    <p className="mt-2 text-[11px] font-bold leading-5 text-[#746A56] md:text-[12px]">
                      {item.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="space-y-0">
                {[
                  ['孩子觉得有趣', '愿意点开、愿意继续看'],
                  ['家长开始考虑', '它不只是在“看热闹”'],
                  ['未来价值成立', '正式学理科时不陌生、不排斥'],
                ].map(([title, text], index) => (
                  <div
                    key={title}
                    className="relative grid grid-cols-[46px_1fr] gap-4 border-b border-[#D5C89A] py-6 first:pt-0"
                  >
                    <span className="text-[12px] font-black text-[#A5945C]">
                      0{index + 1}
                    </span>
                    <div>
                      <p className="text-[20px] font-black text-[#25211D]">
                        {title}
                      </p>
                      <p className="mt-1.5 text-[14px] font-semibold leading-6 text-[#7A6E57]">
                        {text}
                      </p>
                    </div>
                    {index < 2 && (
                      <ArrowDown
                        size={17}
                        className="absolute -bottom-[9px] left-[14px] z-10 bg-[#FFF4CC] text-[#A5945C]"
                      />
                    )}
                  </div>
                ))}
              </div>
              <div className="mt-12">
                <VoiceQuote
                  clipUrl="/clips/interview7/0208-01.mp3"
                  eyebrow="一句话听懂购买入口"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#1E2B24] text-white">
        <div className="mx-auto max-w-[1280px] px-5 py-20 md:px-10 md:py-28 lg:px-14 lg:py-36">
          <ChapterMarker number="02" label="品类位置" light />
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <h2 className="max-w-[760px] text-[38px] font-black leading-[1.18] tracking-[-0.035em] md:text-[56px]">
              它不该站在两端，
              <br />
              而应该占住
              <span className="text-[#C9FF5B]">中间。</span>
            </h2>
            <p className="max-w-[360px] text-[15px] font-semibold leading-7 text-white/60">
              纯兴趣内容太轻，提前学课程又太重。真正的机会，是把“有趣”和“未来有用”连起来。
            </p>
          </div>

          <div className="mt-16 md:mt-24">
            <div className="relative h-1 bg-white/20">
              <div className="absolute left-[15%] right-[15%] top-0 h-1 bg-gradient-to-r from-white/30 via-[#C9FF5B] to-white/30" />
              <div className="absolute left-1/2 top-1/2 size-6 -translate-x-1/2 -translate-y-1/2 rounded-full border-[6px] border-[#1E2B24] bg-[#C9FF5B] ring-2 ring-[#C9FF5B]" />
            </div>
            <div className="mt-7 grid grid-cols-3 gap-4">
              <div>
                <p className="text-[15px] font-black md:text-[18px]">
                  纯兴趣科普
                </p>
                <p className="mt-2 text-[11px] font-semibold leading-5 text-white/45 md:text-[13px]">
                  好玩，但容易看完就忘
                </p>
              </div>
              <div className="text-center">
                <p className="text-[17px] font-black text-[#C9FF5B] md:text-[22px]">
                  学科启蒙
                </p>
                <p className="mt-2 text-[11px] font-semibold leading-5 text-white/60 md:text-[13px]">
                  洋葱的机会位置
                </p>
              </div>
              <div className="text-right">
                <p className="text-[15px] font-black md:text-[18px]">
                  初中提前学
                </p>
                <p className="mt-2 text-[11px] font-semibold leading-5 text-white/45 md:text-[13px]">
                  有用，但低龄压力太大
                </p>
              </div>
            </div>
          </div>

          <div className="mt-20 grid gap-10 border-t border-white/15 pt-10 lg:grid-cols-[.8fr_1.2fr] lg:gap-20">
            <div>
              <p className="text-[11px] font-black tracking-[0.15em] text-[#C9FF5B]">
                核心目标人群
              </p>
              <p className="mt-4 text-[48px] font-black tracking-[-0.05em] md:text-[68px]">
                1—4 年级
              </p>
              <p className="mt-3 max-w-[420px] text-[14px] font-semibold leading-7 text-white/55">
                没有学前阶段的纯兴趣需求，也还没进入小高阶段的强应试焦虑，最适合低压力学科启蒙。
              </p>
            </div>
            <VoiceQuote
              clipUrl="/clips/interview8/0001-01.mp3"
              eyebrow="用户如何解释“未来有用”"
              dark
            />
          </div>
        </div>
      </section>

      <section className="bg-[#F5DCD5]">
        <div className="mx-auto max-w-[1280px] px-5 py-20 md:px-10 md:py-28 lg:px-14 lg:py-36">
          <ChapterMarker number="03" label="未成交卡点" />
          <div className="grid gap-14 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,.95fr)] lg:gap-24">
            <div>
              <p className="text-[18px] font-black text-[#9C4A2F]">
                真正的问题不是贵。
              </p>
              <h2 className="mt-4 text-[40px] font-black leading-[1.16] tracking-[-0.04em] md:text-[60px]">
                家长不知道，
                <br />
                启蒙到底有没有发生。
              </h2>

              <div className="mt-14 space-y-8">
                {[
                  {
                    icon: TriangleAlert,
                    title: '孩子会不会坚持看？',
                    text: '今天愿意点开，不代表下周还会主动使用。',
                  },
                  {
                    icon: Lightbulb,
                    title: '看完到底学到了什么？',
                    text: '爱看只能证明入口成立，不能证明孩子理解了。',
                  },
                ].map(({ icon: Icon, title, text }) => (
                  <div
                    key={title}
                    className="flex gap-5 border-t border-[#C99E93] pt-6"
                  >
                    <Icon size={24} className="mt-1 shrink-0 text-[#9C4A2F]" />
                    <div>
                      <p className="text-[22px] font-black">{title}</p>
                      <p className="mt-2 text-[14px] font-semibold leading-7 text-[#705A55]">
                        {text}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <VoiceQuote
                clipUrl="/clips/interview5/0057-01.mp3"
                eyebrow="最直接的用户追问"
              />
              <div className="mt-14 bg-[#191816] p-6 text-white md:p-9">
                <p className="text-[11px] font-black tracking-[0.15em] text-[#FFCF4A]">
                  机会不是再加内容
                </p>
                <p className="mt-4 text-[25px] font-black leading-[1.5]">
                  而是把启蒙效果，
                  <br />
                  变成家长看得见的信号。
                </p>
                <ul className="mt-7 space-y-4">
                  {[
                    '孩子能用自己的话复述原理',
                    '孩子能解释一个生活现象',
                    '家长能收到阶段学习报告',
                  ].map((item) => (
                    <li
                      key={item}
                      className="flex items-center gap-3 border-t border-white/15 pt-4 text-[13px] font-bold text-white/75"
                    >
                      <CircleCheck
                        size={17}
                        className="shrink-0 text-[#C9FF5B]"
                      />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#F6F0E7]">
        <div className="mx-auto max-w-[1280px] px-5 py-20 md:px-10 md:py-28 lg:px-14 lg:py-36">
          <ChapterMarker number="04" label="课程记忆点" />
          <div className="grid gap-10 lg:grid-cols-[.8fr_1.2fr] lg:gap-24">
            <div>
              <h2 className="text-[38px] font-black leading-[1.2] tracking-[-0.035em] md:text-[54px]">
                竞品都有一句
                <br />
                说得出口的理由。
              </h2>
              <p className="mt-7 max-w-[440px] text-[15px] font-semibold leading-7 text-[#746A60]">
                家长能复述单点钩子，才容易形成记忆。洋葱现在更多靠品牌信任和顺手加购，还缺一条课程自己的故事。
              </p>
            </div>

            <div className="border-t border-[#BFB3A6]">
              {COMPETITORS.map((item, index) => (
                <div
                  key={item.name}
                  className="grid grid-cols-[36px_minmax(110px,.7fr)_minmax(0,1.3fr)] items-center gap-3 border-b border-[#D4C8BA] py-5"
                >
                  <span className="text-[11px] font-black text-[#B2A598]">
                    0{index + 1}
                  </span>
                  <span className="text-[14px] font-black">{item.name}</span>
                  <span
                    className={`w-fit -rotate-1 px-2.5 py-1.5 text-[13px] font-black ${item.tone}`}
                  >
                    {item.hook}
                  </span>
                </div>
              ))}
              <div className="grid grid-cols-[36px_minmax(110px,.7fr)_minmax(0,1.3fr)] items-start gap-3 border-b border-[#191816] bg-[#191816] px-4 py-7 text-white md:px-6">
                <span className="text-[11px] font-black text-white/35">05</span>
                <div>
                  <p className="text-[14px] font-black">洋葱现在</p>
                  <p className="mt-2 text-[11px] font-semibold text-white/45">
                    品牌信任 / 顺手加购
                  </p>
                </div>
                <div>
                  <p className="text-[11px] font-black tracking-[0.12em] text-[#C9FF5B]">
                    建议定位
                  </p>
                  <p className="mt-2 text-[18px] font-black leading-7 md:text-[22px]">
                    最系统、够专业，
                    <br />
                    低龄孩子也能看懂的学科启蒙课
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-[#D7CCBF] bg-white">
        <div className="mx-auto max-w-[1280px] px-5 py-20 md:px-10 md:py-28 lg:px-14 lg:py-36">
          <ChapterMarker number="05" label="下一步行动" />
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <h2 className="max-w-[700px] text-[40px] font-black leading-[1.15] tracking-[-0.04em] md:text-[60px]">
              不再罗列更多结论，
              <br />
              先把三件事做实。
            </h2>
            <p className="max-w-[330px] text-[14px] font-semibold leading-7 text-[#746A60]">
              从内容、产品到售卖表达，行动顺序应围绕“听得懂、看得见、记得住”展开。
            </p>
          </div>

          <div className="mt-16 border-t-2 border-[#191816]">
            {ACTIONS.map(({ number, title, text, icon: Icon }) => (
              <div
                key={number}
                className="group grid gap-5 border-b border-[#CFC4B7] py-8 transition md:grid-cols-[70px_58px_minmax(220px,.75fr)_minmax(0,1.25fr)] md:items-center md:gap-8 md:py-10"
              >
                <span className="text-[13px] font-black text-[#A79A8D]">
                  {number}
                </span>
                <span className="grid size-12 place-items-center rounded-full bg-[#F1EBE2] text-[#E95B35] transition group-hover:bg-[#E95B35] group-hover:text-white">
                  <Icon size={21} />
                </span>
                <h3 className="text-[20px] font-black leading-8 md:text-[23px]">
                  {title}
                </h3>
                <p className="text-[14px] font-semibold leading-7 text-[#756C63]">
                  {text}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-16 grid gap-10 bg-[#FFF4CC] p-6 md:p-10 lg:grid-cols-[1fr_auto] lg:items-center">
            <VoiceQuote
              clipUrl="/clips/interview4/0048-01.mp3"
              eyebrow="效果外化已经有真实苗头"
            />
            <a
              href={SOURCE_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-12 items-center justify-center gap-2 bg-[#191816] px-5 text-[13px] font-black text-white transition hover:bg-[#E95B35]"
            >
              查看完整研究证据
              <ArrowRight size={16} />
            </a>
          </div>
        </div>
      </section>

      <footer className="bg-[#191816] px-5 py-8 text-white md:px-10">
        <div className="mx-auto flex max-w-[1280px] flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="flex items-center gap-2 text-[12px] font-black">
            <Quote size={14} className="text-[#C9FF5B]" />
            从小学物理结论速览 · 叙事版 Demo
          </p>
          <p className="text-[11px] font-semibold text-white/35">
            研究发现与业务建议已分层呈现，完整数据仍以原始研究文档为准。
          </p>
        </div>
      </footer>
    </main>
  );
}
