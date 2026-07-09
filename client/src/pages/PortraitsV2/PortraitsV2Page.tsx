import React from 'react';
import { motion } from 'motion/react';
import {
  AlertTriangle,
  ArrowRight,
  Heart,
  PlayCircle,
  Quote,
  RotateCw,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Target,
  ThumbsDown,
  ThumbsUp,
  Users,
} from 'lucide-react';

// ════════════════════════════════════════════════════════════════════════════
// 用户画像 V2 · 对齐《小学家长画像白皮书》「典型用户代表」的共性版式
//   共性固定模块：① 人设横幅 ② 家庭情况 ③ 核心特征 ⑤ 高亮原声 ⑥ 洋葱评价 ＋ 画像四维
//   ④ 教育逻辑可视化：可插拔槽位（chart.type），每个典型用户可用不同图式
//   首个人物：从小学物理 · 兴趣启蒙型 · 安徽合肥妈妈 → 图式：兴趣自驱正循环飞轮
// ════════════════════════════════════════════════════════════════════════════

const BANNER = '#3F5E8C'; // 白皮书人设横幅蓝
const AXIS = '#C9622E'; // 高亮橙
const AXIS_SOFT = 'rgba(201, 98, 46, 0.10)';
const INK = '#292521';
const MUTED = '#746E67';

const reveal = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-48px' },
  transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
};

// ── 可插拔图式类型 ───────────────────────────────────────────────────────────
type FlywheelChart = {
  type: 'flywheel';
  engine: { title: string; sub: string };
  nodes: { icon: React.ComponentType<{ size?: number }>; title: string; desc: string }[];
  loopNote: string;
};
// 后续其他典型用户可扩展：三角递进 / 决策流程 / 情绪曲线 / 前后对比 / 矛盾三角 等
type PersonaChart = FlywheelChart;

interface PersonaV2 {
  type: { index: string; name: string; keyword: string };
  banner: string;
  coreFeature: string;
  family: { k: string; v: string }[];
  chart: PersonaChart;
  heroQuote: string;
  moreQuotes: string[];
  onion: { purpose: string; cases: { tone: 'positive' | 'negative'; brand: string; note: string }[] };
  attributes: { icon: React.ComponentType<{ size?: number }>; label: string; value: string }[];
}

// ── 兴趣启蒙型 · 数据 ────────────────────────────────────────────────────────
const PERSONA: PersonaV2 = {
  type: { index: '01', name: '兴趣启蒙型', keyword: '入口' },
  banner: '安徽合肥妈妈 —— 把《从小学物理》当作孩子愿意看的「理科兴趣入口」',
  coreFeature:
    '不急着让孩子提前学完整套初中物理，也不用成绩检验启蒙效果；她首先要的，是孩子愿意看、听得懂、觉得好玩。',
  family: [
    { k: '妈妈', v: '主要负责孩子学习，无强规划、不焦虑' },
    { k: '孩子', v: '两个：姐姐高中、弟弟一年级' },
    { k: '弟弟学情', v: '没报很多辅导班，整体掌握情况也不错' },
    { k: '购买方式', v: '给姐姐买高中物理时，顺着推荐加购《从小学物理》' },
  ],
  chart: {
    type: 'flywheel',
    engine: { title: '兴趣', sub: '孩子喜欢 = 她唯一检验的「效果」' },
    nodes: [
      { icon: Heart, title: '孩子喜欢', desc: '孩子能看得进去，家长才会考虑——兴趣是唯一入口' },
      { icon: ShoppingBag, title: '顺手加购', desc: '给姐姐买高中物理时顺带加购，期待很轻、门槛很低' },
      { icon: PlayCircle, title: '主动看 · 不用催', desc: '实验男 / 动画有吸引力，不主动管也每天自己看' },
      { icon: ShieldCheck, title: '不排斥理科', desc: '先建立熟悉与好感，未来正式学理科时更从容' },
    ],
    loopNote: '孩子越喜欢 → 越愿意看 → 越不排斥 → 更喜欢，形成兴趣自驱的正循环（反之一旦「不喜欢」就整条断裂）。',
  },
  heroQuote: '孩子喜欢学就学，多看一点总归有帮助。',
  moreQuotes: [
    '因为学习是个长期的过程，不是一蹴而就的。所以也没什么目的，孩子喜欢学就学。',
    '孩子喜欢看实验男，因为学而思的教具或课堂都不能做危险的实验，而实验男可以做一些家里做不到、且会爆炸的实验。',
  ],
  onion: {
    purpose: '把《从小学物理》当作孩子愿意看的「理科兴趣入口」——先让孩子接触、不排斥，未来学理科时更从容。',
    cases: [
      { tone: 'positive', brand: '洋葱', note: '孩子喜欢看实验男做实验，愿意主动看' },
      { tone: 'negative', brand: '妙懂', note: '太正式，不是小孩能接受的预期' },
    ],
  },
  attributes: [
    { icon: Users, label: '学情特征', value: '孩子低年级，家长不急于提分；更在意孩子是否愿意看、是否不排斥理科。' },
    { icon: Target, label: '用户需求', value: '让孩子觉得物理有意思，愿意持续接触，防止未来畏难排斥。' },
    { icon: AlertTriangle, label: '核心痛点', value: '课程太像上课、太正式、太无趣，孩子容易排斥，起不到兴趣启蒙效果。' },
    { icon: Heart, label: '课程偏好', value: '偏好动画、短视频、故事化、生活现象等孩子喜欢的内容。' },
  ],
};

// ════════════════════════════════════════════════════════════════════════════
export default function PortraitsV2Page() {
  const p = PERSONA;
  return (
    <main className="min-h-full bg-[#f8f8f5]">
      <div className="mx-auto max-w-[940px] px-5 py-8 md:py-12">
        <TypeEyebrow type={p.type} />
        <PersonaBanner banner={p.banner} />
        <CoreAndFamily coreFeature={p.coreFeature} family={p.family} />
        <ChartSection chart={p.chart} />
        <QuoteSection heroQuote={p.heroQuote} moreQuotes={p.moreQuotes} />
        <OnionSection onion={p.onion} />
        <AttributesSection attributes={p.attributes} />
        <FooterNote />
      </div>
    </main>
  );
}

// ── 类型标识 ─────────────────────────────────────────────────────────────────
function TypeEyebrow({ type }: { type: PersonaV2['type'] }) {
  return (
    <div className="mb-4 flex flex-wrap items-center gap-2" style={{ color: AXIS }}>
      <Sparkles size={15} />
      <span className="text-[11px] font-black tracking-[0.14em]">用户画像 V2 · 从小学物理</span>
      <span className="rounded px-1.5 py-0.5 text-[10px] font-black" style={{ background: AXIS_SOFT, color: AXIS }}>
        类型 {type.index} · {type.name} · {type.keyword}
      </span>
    </div>
  );
}

// ── ① 人设横幅 ───────────────────────────────────────────────────────────────
function PersonaBanner({ banner }: { banner: string }) {
  return (
    <motion.div {...reveal} className="rounded-xl px-5 py-4 text-center md:py-5" style={{ background: BANNER }}>
      <h1 className="text-[17px] font-black leading-snug text-white md:text-[20px]">{banner}</h1>
    </motion.div>
  );
}

// ── ② 核心特征 + ③ 家庭情况（无照片）─────────────────────────────────────────
function CoreAndFamily({ coreFeature, family }: { coreFeature: string; family: PersonaV2['family'] }) {
  return (
    <motion.div {...reveal} className="mt-5 grid gap-4 md:grid-cols-2">
      <div className="rounded-xl border border-dashed border-[#c7d0dd] bg-[#f8fbfe] p-4 md:p-5">
        <div className="text-[12px] font-black" style={{ color: BANNER }}>
          家庭情况
        </div>
        <dl className="mt-3 space-y-2">
          {family.map((r) => (
            <div key={r.k} className="flex gap-2 text-[13px] leading-6">
              <dt className="w-16 shrink-0 font-bold text-[#5c6a80]">{r.k}</dt>
              <dd className="flex-1 text-[#4a453f]">{r.v}</dd>
            </div>
          ))}
        </dl>
      </div>
      <div className="rounded-xl border p-4 md:p-5" style={{ borderColor: '#eadfce', background: '#fffaf6' }}>
        <div className="text-[12px] font-black" style={{ color: AXIS }}>
          核心特征
        </div>
        <p className="mt-3 text-[14px] font-semibold leading-8" style={{ color: INK }}>
          {coreFeature}
        </p>
      </div>
    </motion.div>
  );
}

// ── ④ 教育逻辑可视化（可插拔槽位）────────────────────────────────────────────
function ChartSection({ chart }: { chart: PersonaChart }) {
  return (
    <section className="mt-8">
      <div className="mb-4 flex items-center gap-2">
        <span className="h-5 w-1 rounded-full" style={{ background: AXIS }} />
        <h2 className="text-[15px] font-black" style={{ color: INK }}>
          教育逻辑 · 兴趣自驱正循环
        </h2>
        <span className="hidden text-[12px] sm:inline" style={{ color: MUTED }}>
          这类家长为什么买、为什么用得下去
        </span>
      </div>
      {chart.type === 'flywheel' && <Flywheel chart={chart} />}
    </section>
  );
}

// ── 图式：兴趣自驱飞轮 ───────────────────────────────────────────────────────
function Flywheel({ chart }: { chart: FlywheelChart }) {
  return (
    <motion.div {...reveal} className="rounded-2xl border border-[#e7e5de] bg-white p-5 md:p-7">
      <div className="relative rounded-[26px] border-2 border-dashed p-5 md:p-7" style={{ borderColor: '#eccdb9' }}>
        {/* 引擎标签 */}
        <div className="mb-5 flex justify-center">
          <div className="flex items-center gap-2 rounded-full px-4 py-2 text-white shadow-sm" style={{ background: AXIS }}>
            <RotateCw size={15} />
            <span className="text-[13px] font-black">
              引擎：{chart.engine.title}
            </span>
            <span className="hidden text-[11px] font-semibold opacity-90 sm:inline">· {chart.engine.sub}</span>
          </div>
        </div>

        {/* 四节点：桌面横向带箭头，移动纵向 */}
        <div className="grid items-stretch gap-3 md:grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr]">
          {chart.nodes.map((node, i) => {
            const Icon = node.icon;
            const isStart = i === 0;
            return (
              <React.Fragment key={node.title}>
                <motion.div
                  {...reveal}
                  transition={{ ...reveal.transition, delay: i * 0.07 }}
                  className="rounded-xl border bg-white p-3.5"
                  style={{
                    borderColor: isStart ? AXIS : '#e7e5de',
                    background: isStart ? AXIS_SOFT : '#ffffff',
                    borderWidth: isStart ? 2 : 1,
                  }}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="grid h-7 w-7 shrink-0 place-items-center rounded-full text-white"
                      style={{ background: AXIS }}
                    >
                      <Icon size={15} />
                    </span>
                    <span className="text-[10px] font-black" style={{ color: AXIS }}>
                      0{i + 1}
                    </span>
                    <span className="text-[13.5px] font-black leading-tight" style={{ color: INK }}>
                      {node.title}
                    </span>
                  </div>
                  <p className="mt-2 text-[12px] leading-6" style={{ color: '#5c564f' }}>
                    {node.desc}
                  </p>
                </motion.div>
                {i < chart.nodes.length - 1 && (
                  <div className="flex items-center justify-center py-0.5 md:py-0">
                    <ArrowRight size={18} className="rotate-90 text-[#d3a98f] md:rotate-0" />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* 循环回箭头 */}
        <div className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-[#fdf4ee] px-4 py-2.5">
          <RotateCw size={15} className="shrink-0" style={{ color: AXIS }} />
          <p className="text-[12px] font-semibold leading-6" style={{ color: '#7a5a48' }}>
            {chart.loopNote}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

// ── ⑤ 高亮原声 ───────────────────────────────────────────────────────────────
function QuoteSection({ heroQuote, moreQuotes }: { heroQuote: string; moreQuotes: string[] }) {
  return (
    <section className="mt-6">
      <motion.blockquote
        {...reveal}
        className="relative overflow-hidden rounded-2xl border p-6 md:p-7"
        style={{ borderColor: '#eadfce', background: '#fffaf6' }}
      >
        <Quote size={54} className="absolute -right-1 -top-1 opacity-[0.12]" style={{ color: AXIS }} />
        <p className="relative text-[11px] font-black tracking-wide" style={{ color: AXIS }}>
          代表原声
        </p>
        <p className="relative mt-2 text-[19px] font-black leading-9" style={{ color: INK }}>
          「{heroQuote}」
        </p>
      </motion.blockquote>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        {moreQuotes.map((q) => (
          <motion.blockquote
            {...reveal}
            key={q}
            className="rounded-xl border border-[#e7e5de] bg-white px-4 py-3 text-[13px] italic leading-7"
            style={{ color: '#5c564f' }}
          >
            「{q}」
          </motion.blockquote>
        ))}
      </div>
    </section>
  );
}

// ── ⑥ 使用洋葱 & 评价 ────────────────────────────────────────────────────────
function OnionSection({ onion }: { onion: PersonaV2['onion'] }) {
  return (
    <motion.section {...reveal} className="mt-8 rounded-xl border border-[#e7e5de] bg-white p-4 md:p-5">
      <div className="mb-3 flex items-center gap-2">
        <span className="h-5 w-1 rounded-full" style={{ background: BANNER }} />
        <h2 className="text-[15px] font-black" style={{ color: INK }}>
          使用洋葱的目的 & 评价
        </h2>
      </div>
      <p className="text-[13px] leading-7" style={{ color: '#4a453f' }}>
        {onion.purpose}
      </p>
      <div className="mt-3 flex flex-wrap gap-3">
        {onion.cases.map((c) => (
          <div
            key={c.brand}
            className="flex items-start gap-2 rounded-lg border bg-white px-3.5 py-2.5"
            style={{ borderColor: c.tone === 'positive' ? '#cfe6dc' : '#f0d6cd' }}
          >
            {c.tone === 'positive' ? (
              <ThumbsUp size={14} className="mt-0.5 shrink-0 text-[#2F8272]" />
            ) : (
              <ThumbsDown size={14} className="mt-0.5 shrink-0 text-[#C9622E]" />
            )}
            <div className="text-[12.5px]">
              <span className="font-black" style={{ color: INK }}>
                {c.tone === 'positive' ? '正面 · ' : '负面 · '}
                {c.brand}
              </span>
              <span className="mx-1.5 text-[#ccc]">·</span>
              <span style={{ color: '#5c564f' }}>{c.note}</span>
            </div>
          </div>
        ))}
      </div>
    </motion.section>
  );
}

// ── 这一类人 · 画像四维 ──────────────────────────────────────────────────────
function AttributesSection({ attributes }: { attributes: PersonaV2['attributes'] }) {
  return (
    <section className="mt-8">
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <span className="h-5 w-1 rounded-full" style={{ background: '#9a938a' }} />
        <h2 className="text-[15px] font-black" style={{ color: INK }}>
          这一类人 · 画像四维
        </h2>
        <span className="text-[12px]" style={{ color: MUTED }}>
          由这位代表抽象出的「兴趣启蒙型」共性
        </span>
      </div>
      <div className="grid gap-px overflow-hidden rounded-xl border border-[#e4e2da] bg-[#e4e2da] sm:grid-cols-2">
        {attributes.map((attr, i) => {
          const Icon = attr.icon;
          return (
            <motion.div {...reveal} transition={{ ...reveal.transition, delay: i * 0.05 }} key={attr.label} className="bg-white p-4">
              <div className="flex items-center gap-2" style={{ color: AXIS }}>
                <Icon size={14} />
                <span className="text-[12px] font-black">{attr.label}</span>
              </div>
              <p className="mt-2 text-[13px] leading-7" style={{ color: '#4a453f' }}>
                {attr.value}
              </p>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}

function FooterNote() {
  return (
    <p className="mt-8 rounded-xl border border-[#e4e2da] bg-[#f4f2ec] p-4 text-[11px] leading-5" style={{ color: MUTED }}>
      共性版式（对齐白皮书「典型用户代表」）：人设横幅 → 家庭情况 → 核心特征 → 教育逻辑可视化 → 高亮原声 → 洋葱评价 →
      画像四维。其中「教育逻辑可视化」为可插拔槽位，不同典型用户可用不同图式；本页兴趣启蒙型采用「兴趣自驱正循环飞轮」。
      数据来源：从小学系列售卖策略调研 · 访谈纪要与「用户画像和故事」。其余类型将按同一共性版式、各自的图式补齐。
    </p>
  );
}
