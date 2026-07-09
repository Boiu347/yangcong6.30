import React from 'react';
import { motion } from 'motion/react';
import {
  AlertTriangle,
  CircleDot,
  Footprints,
  Heart,
  ImageOff,
  Sparkles,
  Target,
  ThumbsDown,
  ThumbsUp,
  Trophy,
  Users,
} from 'lucide-react';

// ════════════════════════════════════════════════════════════════════════════
// 用户画像 V2 · 复刻《小学家长画像白皮书》「典型用户代表」版式
// 结构对齐白皮书：人设横幅 → 家庭情况 → 内核/行为/结果 竖轴 → 洋葱评价 → 画像四维
// 首个人物：兴趣启蒙型 · 安徽合肥妈妈
// ════════════════════════════════════════════════════════════════════════════

const BANNER = '#3F5E8C'; // 白皮书人设横幅蓝
const AXIS = '#C9622E'; // 竖轴 / 高亮橙（对应白皮书红色竖轴）
const AXIS_SOFT = 'rgba(201, 98, 46, 0.10)';
const INK = '#292521';
const MUTED = '#746E67';

const reveal = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-48px' },
  transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
};

// ── 兴趣启蒙型 · 数据 ────────────────────────────────────────────────────────
const DATA = {
  type: { index: '01', name: '兴趣启蒙型', keyword: '入口' },
  banner: '安徽合肥妈妈 —— 把《从小学物理》当作孩子愿意看的「理科兴趣入口」',
  family: {
    caption: '用户真实照片（示意，请勿截屏传播）',
    rows: [
      { k: '妈妈', v: '主要负责孩子学习，对学习无强规划、不焦虑' },
      { k: '孩子', v: '两个：姐姐高中、弟弟一年级' },
      { k: '弟弟学情', v: '没报很多辅导班，整体掌握情况也不错' },
      { k: '购买方式', v: '给姐姐买高中物理时，顺着推荐加购《从小学物理》' },
    ],
    highlight: '核心特征：不急着让孩子提前学，也不用成绩检验启蒙；她首先要的是孩子愿意看、听得懂、觉得好玩。',
  },
  // 白皮书的灵魂：内核 → 行为 → 结果 竖轴
  axis: [
    {
      stage: '内核',
      icon: CircleDot,
      subtitle: '兴趣优先的「轻规划」教育观',
      desc: '把兴趣当入口、不追短期成绩，是一种长期主义式的低压力养育：不设固定任务，用「喜欢就多看一点」代替强规划。',
      good: ['兴趣是第一位，孩子喜欢家长才会考虑', '把学习看成长期过程，不急于一蹴而就'],
      bad: ['不接受太正式、太像上课的启蒙方式', '不用「学到多少 / 成绩」来检验启蒙效果'],
      quote: '因为学习是个长期的过程，不是一蹴而就的。所以也没什么目的，孩子喜欢学就学。',
    },
    {
      stage: '行为',
      icon: Footprints,
      subtitle: '被「孩子喜欢」驱动的轻决策',
      desc: '购买是顺手加购、期待很轻——不是被「有用」说服，而是被「孩子喜欢」触发；用起来也不强求，不定义成明确的学习任务。',
      good: ['给大孩买课时顺带加购，决策门槛低', '孩子表现出兴趣，就先让他接触'],
      bad: ['不要求孩子每天固定学习', '不把这门课定义成必须完成的任务'],
      quote: '孩子喜欢学就学，多看一点总归有帮助。',
    },
    {
      stage: '结果',
      icon: Trophy,
      subtitle: '孩子愿意主动看 = 她唯一在意的「效果」',
      desc: '对这类家长来说，启蒙成功的信号就是「孩子愿意主动看、不用催」，从而对理科建立好感、防止未来正式学时畏难排斥。',
      good: ['实验男 / 动画把孩子「先拉进来」', '不主动管，孩子每天也会自己看'],
      bad: ['普通科普视频拉不住孩子', '一旦变得像上课，孩子立刻排斥'],
      quote:
        '孩子喜欢看实验男，因为学而思的教具或课堂都不能做危险的实验，而实验男可以做一些家里做不到、且会爆炸的实验。',
    },
  ],
  onion: {
    purpose: '把《从小学物理》当作孩子愿意看的「理科兴趣入口」，先让孩子接触、不排斥，未来学理科时更从容。',
    cases: [
      { tone: 'positive' as const, brand: '洋葱', note: '孩子喜欢看实验男做实验，愿意主动看' },
      { tone: 'negative' as const, brand: '妙懂', note: '太正式，不是小孩能接受的预期' },
    ],
  },
  // 「这一类人」画像四维（辅助）
  attributes: [
    { icon: Users, label: '学情特征', value: '孩子低年级，家长不急于提分；更在意孩子是否愿意看、是否不排斥理科。' },
    { icon: Target, label: '用户需求', value: '让孩子觉得物理有意思，愿意持续接触，防止未来畏难排斥。' },
    { icon: AlertTriangle, label: '核心痛点', value: '课程太像上课、太正式、太无趣，孩子容易排斥，起不到兴趣启蒙效果。' },
    { icon: Heart, label: '课程偏好', value: '偏好动画、短视频、故事化、生活现象等孩子喜欢的内容。' },
  ],
};

// ════════════════════════════════════════════════════════════════════════════
export default function PortraitsV2Page() {
  return (
    <main className="min-h-full bg-[#f8f8f5]">
      <div className="mx-auto max-w-[960px] px-5 py-8 md:py-12">
        <TypeEyebrow />
        <PersonaBanner />
        <FamilyBlock />
        <AxisTimeline />
        <OnionBlock />
        <AttributesBlock />
        <FooterNote />
      </div>
    </main>
  );
}

// ── 类型标识 ─────────────────────────────────────────────────────────────────
function TypeEyebrow() {
  return (
    <div className="mb-4 flex items-center gap-2" style={{ color: AXIS }}>
      <Sparkles size={15} />
      <span className="text-[11px] font-black tracking-[0.14em]">用户画像 V2 · 从小学物理</span>
      <span className="rounded px-1.5 py-0.5 text-[10px] font-black" style={{ background: AXIS_SOFT, color: AXIS }}>
        类型 {DATA.type.index} · {DATA.type.name} · {DATA.type.keyword}
      </span>
    </div>
  );
}

// ── ① 人设横幅（蓝底白字）────────────────────────────────────────────────────
function PersonaBanner() {
  return (
    <motion.div {...reveal} className="rounded-xl px-5 py-4 text-center md:py-5" style={{ background: BANNER }}>
      <h1 className="text-[17px] font-black leading-snug text-white md:text-[20px]">{DATA.banner}</h1>
    </motion.div>
  );
}

// ── ② 家庭情况（照片位 + 虚线框）─────────────────────────────────────────────
function FamilyBlock() {
  const f = DATA.family;
  return (
    <motion.div {...reveal} className="mt-5 grid gap-4 md:grid-cols-[210px_1fr]">
      <div className="flex flex-col overflow-hidden rounded-xl border border-[#e4e2da] bg-white">
        <div className="flex flex-1 items-center justify-center bg-[#f1efe9] py-8 text-[#b8b2a8]">
          <ImageOff size={30} />
        </div>
        <div className="border-t border-[#eceae3] px-3 py-2 text-center text-[10px] leading-4 text-[#9a938a]">
          {f.caption}
        </div>
      </div>
      <div className="rounded-xl border border-dashed border-[#c7d0dd] bg-[#f8fbfe] p-4 md:p-5">
        <div className="text-[12px] font-black" style={{ color: BANNER }}>
          家庭情况
        </div>
        <dl className="mt-3 space-y-2">
          {f.rows.map((r) => (
            <div key={r.k} className="flex gap-2 text-[13px] leading-6">
              <dt className="w-16 shrink-0 font-bold text-[#5c6a80]">{r.k}</dt>
              <dd className="flex-1 text-[#4a453f]">{r.v}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-3 border-t border-[#e2e7ef] pt-3 text-[13px] font-semibold leading-7" style={{ color: INK }}>
          {f.highlight}
        </p>
      </div>
    </motion.div>
  );
}

// ── ③ 内核 → 行为 → 结果 竖轴（白皮书标志性骨架）─────────────────────────────
function AxisTimeline() {
  return (
    <section className="mt-8">
      <div className="mb-4 flex items-center gap-2">
        <span className="h-5 w-1 rounded-full" style={{ background: AXIS }} />
        <h2 className="text-[15px] font-black" style={{ color: INK }}>
          教育逻辑 · 内核 → 行为 → 结果
        </h2>
        <span className="text-[12px]" style={{ color: MUTED }}>
          她的教育理念怎么长出行为、行为又导向什么结果
        </span>
      </div>

      <div className="relative pl-11 md:pl-14">
        {/* 竖线 */}
        <span
          className="absolute left-4 top-3 bottom-3 w-0.5 md:left-5"
          style={{ background: `linear-gradient(${AXIS}, ${AXIS}55)` }}
        />
        <div className="space-y-5">
          {DATA.axis.map((node, i) => (
            <AxisNode key={node.stage} node={node} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function AxisNode({ node, index }: { node: (typeof DATA.axis)[number]; index: number }) {
  const Icon = node.icon;
  return (
    <motion.div {...reveal} transition={{ ...reveal.transition, delay: index * 0.08 }} className="relative">
      {/* 竖轴锚点 */}
      <span
        className="absolute -left-11 top-0 grid h-9 w-9 place-items-center rounded-full text-white shadow-sm md:-left-14 md:h-10 md:w-10"
        style={{ background: AXIS }}
      >
        <Icon size={18} />
      </span>
      <span className="absolute -left-11 top-10 w-9 text-center text-[11px] font-black md:-left-14 md:w-10 md:top-11" style={{ color: AXIS }}>
        {node.stage}
      </span>

      <div className="rounded-xl border border-[#e7e5de] bg-white p-4 md:p-5" style={{ borderLeftWidth: 3, borderLeftColor: AXIS }}>
        <div className="text-[15px] font-black" style={{ color: INK }}>
          {node.subtitle}
        </div>
        <p className="mt-2 text-[13px] leading-7" style={{ color: '#4a453f' }}>
          {node.desc}
        </p>

        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <ul className="space-y-1.5">
            {node.good.map((g) => (
              <li key={g} className="flex gap-2 text-[12.5px] leading-6" style={{ color: '#3f5a48' }}>
                <ThumbsUp size={13} className="mt-1 shrink-0 text-[#2F8272]" />
                <span>{g}</span>
              </li>
            ))}
          </ul>
          <ul className="space-y-1.5">
            {node.bad.map((b) => (
              <li key={b} className="flex gap-2 text-[12.5px] leading-6" style={{ color: '#7a5148' }}>
                <ThumbsDown size={13} className="mt-1 shrink-0 text-[#C9622E]" />
                <span>{b}</span>
              </li>
            ))}
          </ul>
        </div>

        <blockquote
          className="mt-3 rounded-lg border-l-2 px-3.5 py-2.5 text-[13px] italic leading-6"
          style={{ borderColor: AXIS, background: AXIS_SOFT, color: '#5c4a40' }}
        >
          「{node.quote}」
        </blockquote>
      </div>
    </motion.div>
  );
}

// ── ④ 使用洋葱 & 评价 ────────────────────────────────────────────────────────
function OnionBlock() {
  return (
    <motion.section {...reveal} className="mt-8 rounded-xl border border-[#e7e5de] bg-white p-4 md:p-5">
      <div className="mb-3 flex items-center gap-2">
        <span className="h-5 w-1 rounded-full" style={{ background: BANNER }} />
        <h2 className="text-[15px] font-black" style={{ color: INK }}>
          使用洋葱的目的 & 评价
        </h2>
      </div>
      <p className="text-[13px] leading-7" style={{ color: '#4a453f' }}>
        {DATA.onion.purpose}
      </p>
      <div className="mt-3 flex flex-wrap gap-3">
        {DATA.onion.cases.map((c) => (
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

// ── ⑤ 这一类人 · 画像四维（辅助）─────────────────────────────────────────────
function AttributesBlock() {
  return (
    <section className="mt-8">
      <div className="mb-4 flex items-center gap-2">
        <span className="h-5 w-1 rounded-full" style={{ background: '#9a938a' }} />
        <h2 className="text-[15px] font-black" style={{ color: INK }}>
          这一类人 · 画像四维
        </h2>
        <span className="text-[12px]" style={{ color: MUTED }}>
          由这位代表抽象出的「兴趣启蒙型」共性
        </span>
      </div>
      <div className="grid gap-px overflow-hidden rounded-xl border border-[#e4e2da] bg-[#e4e2da] sm:grid-cols-2">
        {DATA.attributes.map((attr, i) => {
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
      版式复刻《小学家长画像调研白皮书》「典型用户代表」：人设横幅 → 家庭情况 → 内核/行为/结果竖轴 → 洋葱评价 →
      画像四维。数据来源：从小学系列售卖策略调研 · 访谈纪要与「用户画像和故事」。其余类型（学科启蒙打底型 /
      实验探究型 / 校内科学课助力型）将按同一版式补齐。
    </p>
  );
}
