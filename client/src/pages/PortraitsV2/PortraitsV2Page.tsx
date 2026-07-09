import React from 'react';
import { motion } from 'motion/react';
import {
  AlertTriangle,
  ArrowRight,
  Baby,
  Heart,
  Lightbulb,
  MessageSquareQuote,
  Quote,
  ShoppingBag,
  Sparkles,
  Target,
  ThumbsDown,
  ThumbsUp,
  Users,
  UserRound,
} from 'lucide-react';

// ════════════════════════════════════════════════════════════════════════════
// 用户画像 V2 · 叙事式人物画像（先做「兴趣启蒙型」）
// 数据来源：从小学系列售卖策略调研 · 访谈纪要 & 用户画像和故事
// ════════════════════════════════════════════════════════════════════════════

const ACCENT = '#C9622E';
const ACCENT_SOFT = 'rgba(201, 98, 46, 0.10)';
const INK = '#292521';
const MUTED = '#746E67';

const reveal = {
  initial: { opacity: 0, y: 22 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-56px' },
  transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
};

// ── 富文本：**加粗** 高亮 ─────────────────────────────────────────────────────
function Rich({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return (
    <>
      {parts.map((p, i) =>
        p.startsWith('**') && p.endsWith('**') ? (
          <span key={i} className="rounded px-1 font-bold" style={{ background: ACCENT_SOFT, color: ACCENT }}>
            {p.slice(2, -2)}
          </span>
        ) : (
          <span key={i}>{p}</span>
        ),
      )}
    </>
  );
}

// ── 兴趣启蒙型 · 数据 ────────────────────────────────────────────────────────
const PERSONA = {
  index: '01',
  name: '兴趣启蒙型',
  keyword: '入口',
  tagline: '把物理当作孩子「愿意看」的理科兴趣入口',
  definition:
    '低年级、低压力家庭：不急于提分，首要目标是让孩子愿意接触理科、不排斥未来学习。「兴趣」是入口，孩子喜欢，家长才会考虑。',
  signals: [
    { icon: Baby, label: '孩子低年级', desc: '1–4 年级为主，家长不急于提分' },
    { icon: Heart, label: '兴趣优先', desc: '在意孩子愿不愿看、排不排斥理科' },
    { icon: Sparkles, label: '低压力', desc: '不设固定任务，喜欢就多看一点' },
  ],
  attributes: [
    {
      key: 'situation',
      icon: Users,
      label: '学情特征',
      value: '孩子低年级，家长不急于提分；更在意孩子是否愿意看、是否不排斥理科。',
    },
    {
      key: 'need',
      icon: Target,
      label: '用户需求',
      value: '让孩子觉得物理有意思，愿意持续接触，防止未来畏难排斥。',
    },
    {
      key: 'pain',
      icon: AlertTriangle,
      label: '核心痛点',
      value: '孩子不喜欢，无法起到兴趣启蒙的效果——课程太像上课、太正式、太无趣，孩子容易排斥。',
    },
    {
      key: 'preference',
      icon: Heart,
      label: '课程偏好',
      value: '偏好动画、短视频、故事化、生活现象等孩子喜欢的内容。',
    },
  ],
  cases: [
    { tone: 'positive' as const, brand: '洋葱', note: '孩子喜欢看实验男做实验' },
    { tone: 'negative' as const, brand: '妙懂', note: '太正式，不是小孩能接受的预期' },
  ],
  // 心智链条：这一类家长「为什么买、为什么用得下去」
  chain: [
    { badge: '前提', title: '孩子喜欢', desc: '孩子能看得进去，家长才会考虑，兴趣是入口。' },
    { badge: '触发', title: '顺手加购', desc: '给大孩买课时顺带看到，期待很轻，喜欢就先接触。' },
    { badge: '体验', title: '愿意主动看', desc: '实验男 / 动画有吸引力，不用催也会自己看。' },
    { badge: '价值', title: '未来不排斥', desc: '先建立熟悉与好感，防止未来正式学理科时畏难。' },
  ],
  productOpportunity:
    '做足**趣味动画、短视频节奏、实验男**等「孩子愿意主动看」的入口内容；避免太正式、太像上课的表达。兴趣是把孩子拉进来的第一道门，也是这类家长唯一会检验的「效果」。',
  representative: {
    persona: '安徽合肥妈妈 —— 「理科兴趣入口」的轻规划实践者',
    region: '安徽合肥',
    grade: '弟弟一年级',
    role: '妈妈 · 主要负责孩子学习',
    snapshot:
      '不急着让孩子提前学完整套初中物理，也不会用成绩检验启蒙效果；她首先要的是孩子愿意看、听得懂、觉得好玩。',
    profile: [
      { k: '家庭结构', v: '两个孩子：姐姐高中、弟弟一年级' },
      { k: '学习规划', v: '无强规划；一年级没报很多辅导班，掌握情况也不错' },
      { k: '购买方式', v: '给姐姐买高中物理时，顺着推荐加购《从小学物理》' },
      { k: '对洋葱', v: '孩子喜欢看实验男，「不管的话每天都会看」' },
    ],
    heroQuote: '孩子喜欢学就学，多看一点总归有帮助。',
    beats: [
      {
        heading: '两个孩子，姐姐高中、弟弟一年级',
        points: [
          { text: '对孩子学习没有特别焦虑的强规划，一年级孩子目前没有报很多辅导班，整体掌握情况也不错。' },
          { text: '相比「必须学到什么程度」，她更在意孩子能不能先愿意接触、愿意听、愿意看下去。' },
        ],
      },
      {
        heading: '顺手加购，期待很轻',
        body: '最初购买《从小学物理》，是给姐姐买高中物理时顺着推荐看到了小学课程；弟弟看到里面有从小学物理后表现出兴趣，她就顺手买了。',
        points: [
          {
            text: '她对这门课的期待很轻，不会把它定义成明确的学习任务，也没要求孩子每天固定学习。',
            quotes: ['孩子喜欢学就学，多看一点总归有帮助。'],
          },
          {
            text: '对她来说，小学阶段的物理启蒙不是为了马上衔接，而是因为孩子喜欢，先让孩子接触。',
            quotes: ['因为学习是个长期的过程，不是一蹴而就的。所以也没什么目的，孩子喜欢学就学。'],
          },
        ],
      },
      {
        heading: '认可的是「听得有兴趣」',
        points: [
          { text: '相比普通科普视频，这类内容更像是孩子愿意主动看的科学内容，能把孩子先拉进来。' },
          {
            text: '尤其是实验男做实验相关内容，对孩子很有吸引力。',
            quotes: [
              '孩子喜欢看实验男，因为学而思的教具或课堂都不能做危险的实验，而实验男可以做一些家里做不到、且会爆炸的实验。',
            ],
          },
        ],
      },
    ],
  },
};

// ════════════════════════════════════════════════════════════════════════════
export default function PortraitsV2Page() {
  return (
    <main className="min-h-full bg-[#f8f8f5]">
      <Hero />
      <div className="mx-auto max-w-[1120px] space-y-8 px-5 py-10 md:py-14">
        <PersonaProfileSection />
        <MindChainSection />
        <RepresentativeSection />
        <FooterNote />
      </div>
    </main>
  );
}

// ── Hero ─────────────────────────────────────────────────────────────────────
function Hero() {
  return (
    <header className="border-b border-[#e4e2da] bg-[#f4f2ec]">
      <div className="mx-auto max-w-[1120px] px-5 py-10 md:py-14">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div className="flex items-center gap-2" style={{ color: ACCENT }}>
            <Sparkles size={16} />
            <span className="text-[11px] font-black tracking-[0.14em]">用户画像 V2 · 从小学物理</span>
          </div>
          <div className="mt-4 flex items-end gap-4">
            <span className="text-5xl font-black leading-none md:text-7xl" style={{ color: ACCENT }}>
              {PERSONA.index}
            </span>
            <div className="pb-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-3xl font-black leading-tight md:text-[40px]" style={{ color: INK }}>
                  {PERSONA.name}
                </h1>
                <span className="rounded px-2 py-0.5 text-[11px] font-black" style={{ background: ACCENT_SOFT, color: ACCENT }}>
                  {PERSONA.keyword}
                </span>
              </div>
              <p className="mt-2 text-base font-semibold" style={{ color: '#4a453f' }}>
                {PERSONA.tagline}
              </p>
            </div>
          </div>
          <p className="mt-4 max-w-3xl text-[15px] leading-8" style={{ color: '#4a453f' }}>
            {PERSONA.definition}
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            {PERSONA.signals.map((s, i) => {
              const Icon = s.icon;
              return (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 + i * 0.08, duration: 0.4 }}
                  className="rounded-xl border border-[#e7e3da] bg-white px-4 py-3"
                >
                  <div className="flex items-center gap-2" style={{ color: ACCENT }}>
                    <Icon size={15} />
                    <span className="text-[13px] font-black" style={{ color: INK }}>
                      {s.label}
                    </span>
                  </div>
                  <p className="mt-1.5 text-xs leading-5" style={{ color: MUTED }}>
                    {s.desc}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </header>
  );
}

// ── 画像四维 + 正反案例 ──────────────────────────────────────────────────────
function PersonaProfileSection() {
  return (
    <section>
      <SectionHeader label="用户画像" subtitle="这一类家长是谁、要什么、痛在哪、偏好什么" />
      <div className="mt-5 grid gap-px overflow-hidden rounded-2xl border border-[#e4e2da] bg-[#e4e2da] sm:grid-cols-2">
        {PERSONA.attributes.map((attr, i) => {
          const Icon = attr.icon;
          return (
            <motion.div
              {...reveal}
              transition={{ ...reveal.transition, delay: i * 0.06 }}
              key={attr.key}
              className="bg-white p-5"
            >
              <div className="flex items-center gap-2" style={{ color: ACCENT }}>
                <Icon size={15} />
                <span className="text-[12px] font-black">{attr.label}</span>
              </div>
              <p className="mt-2.5 text-[13.5px] leading-7" style={{ color: '#4a453f' }}>
                {attr.value}
              </p>
            </motion.div>
          );
        })}
      </div>

      <motion.div {...reveal} className="mt-4 flex flex-wrap gap-3">
        {PERSONA.cases.map((c) => (
          <div
            key={c.brand}
            className="flex items-start gap-2 rounded-xl border bg-white px-4 py-3"
            style={{ borderColor: c.tone === 'positive' ? '#cfe6dc' : '#f0d6cd' }}
          >
            {c.tone === 'positive' ? (
              <ThumbsUp size={15} className="mt-0.5 shrink-0 text-[#2F8272]" />
            ) : (
              <ThumbsDown size={15} className="mt-0.5 shrink-0 text-[#C9622E]" />
            )}
            <div>
              <span className="text-[13px] font-black" style={{ color: INK }}>
                {c.tone === 'positive' ? '正面案例 · ' : '负面案例 · '}
                {c.brand}
              </span>
              <span className="mx-1.5 text-[#ccc]">·</span>
              <span className="text-[13px]" style={{ color: '#5c564f' }}>
                {c.note}
              </span>
            </div>
          </div>
        ))}
      </motion.div>
    </section>
  );
}

// ── 心智链条骨架图（V2 亮点）─────────────────────────────────────────────────
function MindChainSection() {
  const chain = PERSONA.chain;
  const chainIcons = [Heart, ShoppingBag, Sparkles, ArrowRight];
  return (
    <section>
      <SectionHeader label="心智链条" subtitle="这一类家长为什么买、为什么用得下去" accent="#3F5E8C" />
      <motion.div {...reveal} className="mt-5 rounded-2xl border border-[#d8e4ef] bg-[#f8fbfe] p-5 md:p-7">
        <div className="grid gap-4 md:grid-cols-[repeat(4,1fr)] md:gap-2">
          {chain.map((node, i) => {
            const Icon = chainIcons[i] ?? Sparkles;
            return (
              <React.Fragment key={node.title}>
                <motion.div
                  {...reveal}
                  transition={{ ...reveal.transition, delay: i * 0.08 }}
                  className="relative rounded-xl border border-[#d3e0ee] bg-white p-4"
                >
                  <div className="flex items-center justify-between">
                    <span className="rounded-full bg-[#3F5E8C]/12 px-2 py-0.5 text-[10px] font-black text-[#3F5E8C]">
                      {node.badge}
                    </span>
                    <Icon size={16} className="text-[#3F5E8C]/70" />
                  </div>
                  <div className="mt-3 text-[15px] font-black" style={{ color: INK }}>
                    {node.title}
                  </div>
                  <p className="mt-1.5 text-xs leading-6" style={{ color: MUTED }}>
                    {node.desc}
                  </p>
                  {i < chain.length - 1 && (
                    <span className="absolute -right-3 top-1/2 z-10 hidden -translate-y-1/2 md:block">
                      <ArrowRight size={18} className="text-[#3F5E8C]/50" />
                    </span>
                  )}
                </motion.div>
              </React.Fragment>
            );
          })}
        </div>
      </motion.div>

      <motion.div {...reveal} className="mt-4 rounded-2xl border border-[#eadfce] bg-[#fffaf6] p-5 md:p-6">
        <div className="flex items-center gap-2" style={{ color: ACCENT }}>
          <Lightbulb size={16} />
          <span className="text-xs font-black tracking-wide">产品机会（来自偏好）</span>
        </div>
        <p className="mt-3 text-[14px] leading-8" style={{ color: '#332f2a' }}>
          <Rich text={PERSONA.productOpportunity} />
        </p>
      </motion.div>
    </section>
  );
}

// ── 典型代表 · 人物叙事 ──────────────────────────────────────────────────────
function RepresentativeSection() {
  const rep = PERSONA.representative;
  return (
    <section>
      <SectionHeader label="典型代表" subtitle="该类型中的典型代表 · 真实访谈还原" accent="#3F5E8C" />

      {/* 人设标题条 */}
      <motion.div {...reveal} className="mt-5 overflow-hidden rounded-2xl border border-[#d8e4ef] bg-white shadow-sm">
        <div className="bg-[#3F5E8C] px-5 py-4 md:px-6">
          <div className="flex items-start gap-3">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-white/15 text-white">
              <UserRound size={22} />
            </span>
            <div>
              <div className="text-[11px] font-black tracking-wide text-white/70">典型用户代表</div>
              <div className="mt-1 text-[17px] font-black leading-snug text-white">{rep.persona}</div>
              <div className="mt-1 text-[12px] font-semibold text-white/85">
                {rep.region} · {rep.grade} · {rep.role}
              </div>
            </div>
          </div>
        </div>

        {/* 家庭档案 */}
        <div className="grid gap-px bg-[#e8eef3] sm:grid-cols-2">
          {rep.profile.map((p) => (
            <div key={p.k} className="bg-white px-5 py-3.5">
              <div className="text-[10px] font-black tracking-wide text-[#3F5E8C]">{p.k}</div>
              <div className="mt-1 text-[13px] leading-6" style={{ color: '#4a453f' }}>
                {p.v}
              </div>
            </div>
          ))}
        </div>

        {/* 核心特征 */}
        <div className="border-t border-[#e8eef3] px-5 py-4 md:px-6">
          <p className="text-[13.5px] leading-7" style={{ color: '#4a453f' }}>
            {rep.snapshot}
          </p>
        </div>
      </motion.div>

      {/* 主金句 */}
      <motion.blockquote {...reveal} className="relative mt-4 overflow-hidden rounded-2xl border border-[#eadfce] bg-[#fffaf6] p-6 md:p-7">
        <Quote size={54} className="absolute -right-1 -top-1 opacity-[0.12]" style={{ color: ACCENT }} />
        <p className="relative text-[11px] font-black tracking-wide" style={{ color: ACCENT }}>
          代表原声
        </p>
        <p className="relative mt-2 text-[19px] font-black leading-9" style={{ color: INK }}>
          「{rep.heroQuote}」
        </p>
      </motion.blockquote>

      {/* 故事线 */}
      <div className="mt-5 space-y-4">
        {rep.beats.map((beat, i) => (
          <motion.article
            {...reveal}
            transition={{ ...reveal.transition, delay: Math.min(i * 0.06, 0.18) }}
            key={beat.heading}
            className="rounded-2xl border border-[#d8e4ef] bg-[#f8fbfe] p-5 md:p-6"
          >
            <div className="flex items-center gap-3">
              <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-[#3F5E8C]/12 text-[11px] font-black text-[#3F5E8C]">
                {i + 1}
              </span>
              <h4 className="text-[15px] font-black" style={{ color: INK }}>
                {beat.heading}
              </h4>
            </div>
            <div className="mt-3 space-y-3 pl-9">
              {beat.body && (
                <p className="text-[13.5px] leading-7" style={{ color: '#4a453f' }}>
                  {beat.body}
                </p>
              )}
              {beat.points?.map((pt, j) => (
                <div key={j} className="space-y-2">
                  {pt.text && (
                    <div className="flex items-start gap-2">
                      <span className="mt-[10px] h-1 w-1 shrink-0 rounded-full bg-[#3F5E8C]/60" />
                      <p className="text-[13.5px] leading-7" style={{ color: '#4a453f' }}>
                        {pt.text}
                      </p>
                    </div>
                  )}
                  {pt.quotes?.map((q, k) => (
                    <blockquote
                      key={k}
                      className="ml-4 flex gap-2 rounded-lg border-l-2 border-[#c9d7e8] bg-white px-3.5 py-2.5 text-[13px] leading-6"
                      style={{ color: '#5c564f' }}
                    >
                      <MessageSquareQuote size={14} className="mt-0.5 shrink-0 text-[#3F5E8C]/70" />
                      <span className="italic">「{q}」</span>
                    </blockquote>
                  ))}
                </div>
              ))}
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );
}

// ── 底部说明 ─────────────────────────────────────────────────────────────────
function FooterNote() {
  return (
    <motion.div {...reveal} className="rounded-2xl border border-[#e4e2da] bg-[#f4f2ec] p-5 text-xs leading-6" style={{ color: MUTED }}>
      数据来源：从小学系列售卖策略调研 · 访谈纪要（录音、逐字稿）与「用户画像和故事」。本页为「用户画像 V2」的首个人物画像（兴趣启蒙型），采用「人设标题 + 家庭档案 + 心智链条 + 高亮原声」的叙事式版式；其余类型（学科启蒙打底型 / 实验探究型 / 校内科学课助力型）将陆续补齐。
    </motion.div>
  );
}

// ── 通用小标题 ───────────────────────────────────────────────────────────────
function SectionHeader({ label, subtitle, accent = ACCENT }: { label: string; subtitle: string; accent?: string }) {
  return (
    <div className="flex items-start gap-3 border-b border-[#e4e2da] pb-4">
      <span className="mt-1 h-8 w-1 shrink-0 rounded-full" style={{ background: accent }} />
      <div>
        <h3 className="text-lg font-black" style={{ color: INK }}>
          {label}
        </h3>
        <p className="mt-1 text-sm" style={{ color: MUTED }}>
          {subtitle}
        </p>
      </div>
    </div>
  );
}
