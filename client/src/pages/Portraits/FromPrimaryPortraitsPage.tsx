import React from 'react';
import { motion } from 'motion/react';
import {
  AlertTriangle,
  ArrowRight,
  ExternalLink,
  GitCompare,
  Heart,
  Lightbulb,
  MapPin,
  Quote,
  Target,
  ThumbsDown,
  ThumbsUp,
  UserRound,
  Users,
} from 'lucide-react';
import {
  FROM_PRIMARY_PERSONAS,
  PORTRAIT_INTRO,
  PORTRAIT_OVERVIEW,
  PORTRAIT_SOURCES,
  getComparisonMatrix,
  type FromPrimaryPersona,
  type PersonaAttribute,
} from './fromPrimaryPersonas';

const INK = '#292521';
const MUTED = '#746E67';

const ATTRIBUTE_ICON: Record<PersonaAttribute['key'], React.ComponentType<{ size?: number }>> = {
  situation: Users,
  need: Target,
  pain: AlertTriangle,
  preference: Heart,
};

const reveal = {
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-48px' },
  transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] as const },
};

export default function FromPrimaryPortraitsPage() {
  const personas = FROM_PRIMARY_PERSONAS;
  const [activeId, setActiveId] = React.useState('overview');
  const sectionRefs = React.useRef<Record<string, HTMLElement | null>>({});

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target instanceof HTMLElement && visible.target.dataset.sectionId) {
          setActiveId(visible.target.dataset.sectionId);
        }
      },
      { rootMargin: '-42% 0px -42% 0px', threshold: [0, 0.2, 0.5] },
    );
    Object.values(sectionRefs.current).forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const jumpTo = (id: string) => {
    sectionRefs.current[id]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <main className="bg-[#f8f8f5]">
      <IntroHero />

      <nav className="sticky top-0 z-20 border-y border-[#e4e2da] bg-[#f8f8f5]/92 backdrop-blur">
        <div className="mx-auto flex max-w-[1180px] items-stretch gap-0.5 overflow-x-auto px-5">
          <NavButton
            label="总览对比"
            active={activeId === 'overview'}
            accent="#C9622E"
            onClick={() => jumpTo('overview')}
          />
          {personas.map((persona) => (
            <NavButton
              key={persona.id}
              label={persona.name}
              index={persona.index}
              active={activeId === persona.id}
              accent={persona.accent}
              onClick={() => jumpTo(persona.id)}
            />
          ))}
        </div>
      </nav>

      <PortraitOverview
        registerRef={(el) => {
          sectionRefs.current.overview = el;
        }}
        onJump={jumpTo}
      />

      {personas.map((persona) => (
        <PersonaChapter
          key={persona.id}
          persona={persona}
          registerRef={(el) => {
            sectionRefs.current[persona.id] = el;
          }}
        />
      ))}

      <SourcesFooter />
    </main>
  );
}

function NavButton({
  label,
  index,
  active,
  accent,
  onClick,
}: {
  label: string;
  index?: string;
  active: boolean;
  accent: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="group relative flex shrink-0 items-center gap-2 py-3.5 pl-1 pr-4 text-left"
    >
      {index && (
        <span
          className="grid h-6 w-6 place-items-center rounded-full text-[10px] font-black"
          style={{
            background: active ? accent : `${accent}18`,
            color: active ? '#fff' : accent,
          }}
        >
          {index}
        </span>
      )}
      <span
        className="whitespace-nowrap text-[13px]"
        style={{ color: active ? INK : MUTED, fontWeight: active ? 800 : 500 }}
      >
        {label}
      </span>
      {active && (
        <motion.span layoutId="portrait-nav-underline" className="absolute inset-x-1 bottom-0 h-0.5" style={{ background: accent }} />
      )}
    </button>
  );
}

function IntroHero() {
  return (
    <header className="border-b border-[#e4e2da] bg-[#f4f2ec]">
      <div className="mx-auto max-w-[1180px] px-5 py-10 md:py-14">
        <motion.div {...reveal}>
          <div className="flex items-center gap-2 text-[#C9622E]">
            <Users size={16} />
            <span className="text-[11px] font-black tracking-[0.14em]">{PORTRAIT_INTRO.eyebrow}</span>
          </div>
          <h1 className="mt-3 text-3xl font-black leading-tight text-[#292521] md:text-[40px]">{PORTRAIT_INTRO.title}</h1>
          <p className="mt-3 max-w-3xl text-base leading-7 text-[#4a453f]">{PORTRAIT_INTRO.lead}</p>
          <p className="mt-2 text-sm leading-6 text-[#746E67]">{PORTRAIT_INTRO.note}</p>
        </motion.div>
      </div>
    </header>
  );
}

function PortraitOverview({
  registerRef,
  onJump,
}: {
  registerRef: (el: HTMLElement | null) => void;
  onJump: (id: string) => void;
}) {
  const matrix = getComparisonMatrix();
  const { coreJudgment, classificationLogic } = PORTRAIT_OVERVIEW;

  return (
    <section ref={registerRef} data-section-id="overview" className="scroll-mt-14 border-b border-[#e4e2da] bg-white">
      <div className="mx-auto max-w-[1180px] px-5 py-12 md:py-16">
        <motion.div {...reveal} className="flex items-center gap-2 text-[#C9622E]">
          <GitCompare size={16} />
          <h2 className="text-lg font-black text-[#292521]">画像总览 · 类型怎么分、彼此差在哪</h2>
        </motion.div>

        <div className="mt-8 grid gap-5 lg:grid-cols-2">
          <motion.div {...reveal} className="rounded-xl border border-[#eadfce] bg-[#fffaf6] p-5 md:p-6">
            <div className="text-xs font-black tracking-wide text-[#C9622E]">{coreJudgment.title}</div>
            <p className="mt-3 text-[15px] font-semibold leading-8 text-[#332f2a]">
              {coreJudgment.text.split(/(兴趣启蒙型|学科启蒙打底型)/).map((part, i) =>
                coreJudgment.highlight.includes(part) ? (
                  <span key={i} className="rounded bg-[#C9622E]/12 px-1 text-[#C9622E]">
                    {part}
                  </span>
                ) : (
                  <span key={i}>{part}</span>
                ),
              )}
            </p>
          </motion.div>

          <motion.div {...reveal} className="rounded-xl border border-[#e4e2da] bg-[#fafaf7] p-5 md:p-6">
            <div className="text-xs font-black tracking-wide text-[#746E67]">{classificationLogic.title}</div>
            <p className="mt-3 text-sm leading-7 text-[#4a453f]">{classificationLogic.text}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {FROM_PRIMARY_PERSONAS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => onJump(p.id)}
                  className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold transition-opacity hover:opacity-80"
                  style={{ borderColor: p.accent, color: p.accent }}
                >
                  {p.name}
                  <ArrowRight size={12} />
                </button>
              ))}
            </div>
          </motion.div>
        </div>

        {/* 四维横向对比表 */}
        <motion.div {...reveal} className="mt-8 overflow-hidden rounded-xl border border-[#e4e2da]">
          <div className="border-b border-[#e4e2da] bg-[#fafaf7] px-4 py-3">
            <div className="text-sm font-black text-[#292521]">四类画像 · 四维对比</div>
            <p className="mt-1 text-xs text-[#746E67]">横向扫读差异；点击上方标签可跳到单类详情。</p>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-[960px] w-full text-left text-sm">
              <thead>
                <tr className="border-b border-[#eceae3] bg-white text-xs font-black text-[#888]">
                  <th className="w-28 px-4 py-3">维度</th>
                  {FROM_PRIMARY_PERSONAS.map((p) => (
                    <th key={p.id} className="px-4 py-3" style={{ color: p.accent }}>
                      {p.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {matrix.map((row) => (
                  <tr key={row.dimension} className="border-b border-[#f0efea] align-top last:border-0">
                    <td className="px-4 py-4 text-xs font-black text-[#555]">{row.dimension}</td>
                    {row.cells.map((cell) => (
                      <td key={cell.personaId} className="px-4 py-4 text-xs leading-6 text-[#4a453f]">
                        {cell.value}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* 类型卡片速览：定义 + 产品机会 */}
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {FROM_PRIMARY_PERSONAS.map((persona, i) => (
            <motion.button
              {...reveal}
              transition={{ ...reveal.transition, delay: i * 0.04 }}
              key={persona.id}
              onClick={() => onJump(persona.id)}
              className="rounded-xl border border-[#e7e5de] bg-white p-5 text-left transition-shadow hover:shadow-sm"
            >
              <div className="flex items-center gap-2">
                <span className="text-lg font-black" style={{ color: persona.accent }}>
                  {persona.index}
                </span>
                <span className="text-base font-black text-[#292521]">{persona.name}</span>
                <span
                  className="rounded px-1.5 py-0.5 text-[10px] font-black"
                  style={{ background: persona.accentSoft, color: persona.accent }}
                >
                  {persona.keyword}
                </span>
              </div>
              <p className="mt-2 text-sm leading-6 text-[#4a453f]">{persona.definition}</p>
              <p className="mt-3 text-xs leading-5 text-[#746E67]">
                <span className="font-black text-[#555]">产品机会 · </span>
                {persona.productOpportunity}
              </p>
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  );
}

function PersonaChapter({
  persona,
  registerRef,
}: {
  persona: FromPrimaryPersona;
  registerRef: (el: HTMLElement | null) => void;
}) {
  return (
    <section ref={registerRef} data-section-id={persona.id} className="scroll-mt-14 border-b border-[#e4e2da]">
      <div className="mx-auto max-w-[1180px] px-5 py-12 md:py-16">
        {/* 章节头 */}
        <motion.div {...reveal} className="flex items-start gap-4">
          <span className="text-4xl font-black leading-none md:text-6xl" style={{ color: persona.accent }}>
            {persona.index}
          </span>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-2xl font-black text-[#292521]">{persona.name}</h2>
              <span
                className="rounded px-2 py-0.5 text-[11px] font-black"
                style={{ background: persona.accentSoft, color: persona.accent }}
              >
                {persona.keyword}
              </span>
            </div>
            <p className="mt-2 text-base font-semibold text-[#4a453f]">{persona.tagline}</p>
          </div>
        </motion.div>

        {/* 类型定义 + 边界 + 产品机会 —— 主内容区 */}
        <div className="mt-8 grid gap-4 lg:grid-cols-3">
          <motion.div {...reveal} className="rounded-xl border border-[#e7e5de] bg-white p-5 lg:col-span-1">
            <SectionLabel icon={Users} label="类型定义" accent={persona.accent} />
            <p className="mt-3 text-sm leading-7 text-[#3f3a35]">{persona.definition}</p>
          </motion.div>
          <motion.div {...reveal} className="rounded-xl border border-[#e7e5de] bg-white p-5 lg:col-span-1">
            <SectionLabel icon={GitCompare} label="与其他类型的边界" accent={persona.accent} />
            <p className="mt-3 text-sm leading-7 text-[#3f3a35]">{persona.boundary}</p>
          </motion.div>
          <motion.div {...reveal} className="rounded-xl border border-[#e7e5de] bg-white p-5 lg:col-span-1">
            <SectionLabel icon={Lightbulb} label="产品机会（来自偏好）" accent={persona.accent} />
            <p className="mt-3 text-sm leading-7 text-[#3f3a35]">{persona.productOpportunity}</p>
          </motion.div>
        </div>

        {/* 四维属性 */}
        <div className="mt-6 grid gap-px overflow-hidden rounded-xl border border-[#e4e2da] bg-[#e4e2da] sm:grid-cols-2 lg:grid-cols-4">
          {persona.attributes.map((attr, i) => {
            const Icon = ATTRIBUTE_ICON[attr.key];
            return (
              <motion.div
                {...reveal}
                transition={{ ...reveal.transition, delay: i * 0.04 }}
                key={attr.key}
                className="bg-white p-4"
              >
                <div className="flex items-center gap-2" style={{ color: persona.accent }}>
                  <Icon size={14} />
                  <span className="text-[11px] font-black">{attr.label}</span>
                </div>
                <p className="mt-2 text-xs leading-6 text-[#4a453f]">{attr.value}</p>
              </motion.div>
            );
          })}
        </div>

        {/* 典型案例 */}
        {persona.cases.length > 0 && (
          <motion.div {...reveal} className="mt-6 flex flex-wrap gap-3">
            {persona.cases.map((c) => (
              <div
                key={`${c.brand}-${c.tone}`}
                className="flex items-start gap-2 rounded-lg border bg-white px-3 py-2.5"
                style={{ borderColor: c.tone === 'positive' ? '#cfe6dc' : '#f0d6cd' }}
              >
                {c.tone === 'positive' ? (
                  <ThumbsUp size={14} className="mt-0.5 shrink-0 text-[#2F8272]" />
                ) : (
                  <ThumbsDown size={14} className="mt-0.5 shrink-0 text-[#C9622E]" />
                )}
                <div>
                  <span className="text-xs font-black text-[#292521]">{c.brand}</span>
                  <span className="mx-1.5 text-[#ccc]">·</span>
                  <span className="text-xs text-[#5c564f]">{c.note}</span>
                </div>
              </div>
            ))}
          </motion.div>
        )}

        {/* 轻量证据：代表用户 + 1 条原声 */}
        <motion.div
          {...reveal}
          className="mt-8 rounded-xl border border-dashed border-[#ddd8cf] bg-[#fafaf7] p-5 md:p-6"
        >
          <div className="mb-4 text-[11px] font-black tracking-wide text-[#9a938a]">代表用户 · 感受一下真人</div>
          <div className="grid gap-4 md:grid-cols-[minmax(0,280px)_minmax(0,1fr)] md:items-start">
            <div className="flex items-start gap-3">
              <span
                className="grid h-10 w-10 shrink-0 place-items-center rounded-full text-white"
                style={{ background: persona.accent }}
              >
                <UserRound size={18} />
              </span>
              <div>
                <div className="text-sm font-black text-[#292521]">{persona.representative.title}</div>
                <div className="mt-1 flex items-center gap-1 text-[11px] font-semibold" style={{ color: persona.accent }}>
                  <MapPin size={11} />
                  {persona.representative.region} · {persona.representative.grade} · {persona.representative.role}
                </div>
                <p className="mt-2 text-xs leading-6 text-[#5c564f]">{persona.representative.snapshot}</p>
              </div>
            </div>
            <blockquote
              className="relative rounded-lg p-4"
              style={{ background: persona.accentSoft }}
            >
              <Quote size={28} className="absolute right-2 top-2 opacity-15" style={{ color: persona.accent }} />
              <p className="text-sm font-semibold leading-7 text-[#332f2a]">“{persona.representative.quote}”</p>
            </blockquote>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function SectionLabel({
  icon: Icon,
  label,
  accent,
}: {
  icon: React.ComponentType<{ size?: number }>;
  label: string;
  accent: string;
}) {
  return (
    <div className="flex items-center gap-2" style={{ color: accent }}>
      <Icon size={15} />
      <span className="text-xs font-black tracking-wide">{label}</span>
    </div>
  );
}

function SourcesFooter() {
  return (
    <footer className="bg-[#f4f2ec]">
      <div className="mx-auto max-w-[1180px] px-5 py-10">
        <div className="mb-3 text-xs font-black tracking-wide text-[#9a938a]">数据来源</div>
        <div className="grid gap-2 md:grid-cols-3">
          {PORTRAIT_SOURCES.map((s) => (
            <a
              key={s.url}
              href={s.url}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-between gap-3 rounded-lg border border-[#e2ddd3] bg-white px-3.5 py-2.5 text-xs font-bold text-[#4f4b45] transition-colors hover:border-[#C9622E] hover:text-[#C9622E]"
            >
              <span className="truncate">{s.label}</span>
              <ExternalLink size={13} className="shrink-0" />
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
