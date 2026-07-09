import React from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  AlertTriangle,
  ArrowRight,
  ChevronDown,
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
  initial: { opacity: 0, y: 22 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-56px' },
  transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
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
      { rootMargin: '-42% 0px -42% 0px', threshold: [0, 0.2, 0.5, 1] },
    );
    Object.values(sectionRefs.current).forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const jumpTo = React.useCallback((id: string) => {
    sectionRefs.current[id]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  return (
    <main className="bg-[#f8f8f5]">
      <IntroHero onJump={jumpTo} />

      <nav className="sticky top-0 z-20 border-y border-[#e4e2da] bg-[#f8f8f5]/92 backdrop-blur">
        <div className="mx-auto flex max-w-[1180px] items-stretch gap-0.5 overflow-x-auto px-5">
          <NavButton label="总览对比" active={activeId === 'overview'} accent="#C9622E" onClick={() => jumpTo('overview')} />
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
    <motion.button
      whileHover={{ y: active ? 0 : -1 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="group relative flex shrink-0 items-center gap-2 py-3.5 pl-1 pr-4 text-left"
    >
      {index && (
        <motion.span
          animate={{ scale: active ? 1.05 : 1 }}
          className="grid h-7 w-7 place-items-center rounded-full text-[10px] font-black transition-colors"
          style={{
            background: active ? accent : `${accent}18`,
            color: active ? '#fff' : accent,
          }}
        >
          {index}
        </motion.span>
      )}
      <span className="whitespace-nowrap text-[13px]" style={{ color: active ? INK : MUTED, fontWeight: active ? 800 : 500 }}>
        {label}
      </span>
      {active && (
        <motion.span layoutId="portrait-nav-underline" className="absolute inset-x-1 bottom-0 h-0.5" style={{ background: accent }} />
      )}
    </motion.button>
  );
}

function IntroHero({ onJump }: { onJump: (id: string) => void }) {
  return (
    <header className="border-b border-[#e4e2da] bg-[#f4f2ec]">
      <div className="mx-auto max-w-[1180px] px-5 py-10 md:py-14">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div className="flex items-center gap-2 text-[#C9622E]">
            <Users size={16} />
            <span className="text-[11px] font-black tracking-[0.14em]">{PORTRAIT_INTRO.eyebrow}</span>
          </div>
          <h1 className="mt-3 text-3xl font-black leading-tight text-[#292521] md:text-[40px]">{PORTRAIT_INTRO.title}</h1>
          <p className="mt-3 max-w-3xl text-base leading-7 text-[#4a453f]">{PORTRAIT_INTRO.lead}</p>
          <p className="mt-2 text-sm leading-6 text-[#746E67]">{PORTRAIT_INTRO.note}</p>
          <div className="mt-7 flex flex-wrap gap-2.5">
            {FROM_PRIMARY_PERSONAS.map((persona, i) => (
              <motion.button
                key={persona.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 + i * 0.08, duration: 0.4 }}
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => onJump(persona.id)}
                className="inline-flex items-center gap-2 rounded-full border bg-white px-3.5 py-1.5 text-xs font-bold shadow-sm"
                style={{ borderColor: persona.accent, color: persona.accent }}
              >
                <span className="font-black">{persona.index}</span>
                {persona.name}
                <ArrowRight size={12} className="opacity-60" />
              </motion.button>
            ))}
          </div>
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
  const [hoverCol, setHoverCol] = React.useState<string | null>(null);

  return (
    <section ref={registerRef} data-section-id="overview" className="scroll-mt-14 border-b border-[#e4e2da] bg-white">
      <div className="mx-auto max-w-[1180px] px-5 py-12 md:py-16">
        <motion.div {...reveal} className="flex items-center gap-2 text-[#C9622E]">
          <GitCompare size={16} />
          <h2 className="text-lg font-black text-[#292521]">画像总览 · 类型怎么分、彼此差在哪</h2>
        </motion.div>

        <div className="mt-8 grid gap-5 lg:grid-cols-2">
          <motion.div {...reveal} whileHover={{ y: -2 }} className="rounded-xl border border-[#eadfce] bg-[#fffaf6] p-5 md:p-6">
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

          <motion.div {...reveal} whileHover={{ y: -2 }} className="rounded-xl border border-[#e4e2da] bg-[#fafaf7] p-5 md:p-6">
            <div className="text-xs font-black tracking-wide text-[#746E67]">{classificationLogic.title}</div>
            <p className="mt-3 text-sm leading-7 text-[#4a453f]">{classificationLogic.text}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {FROM_PRIMARY_PERSONAS.map((p) => (
                <motion.button
                  key={p.id}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => onJump(p.id)}
                  className="inline-flex items-center gap-1.5 rounded-full border bg-white px-3 py-1 text-xs font-bold"
                  style={{ borderColor: p.accent, color: p.accent }}
                >
                  {p.name}
                  <ArrowRight size={12} />
                </motion.button>
              ))}
            </div>
          </motion.div>
        </div>

        {/* 可交互对比表：hover 高亮列，点击跳转 */}
        <motion.div {...reveal} className="mt-8 overflow-hidden rounded-xl border border-[#e4e2da]">
          <div className="border-b border-[#e4e2da] bg-[#fafaf7] px-4 py-3">
            <div className="text-sm font-black text-[#292521]">四类画像 · 四维对比</div>
            <p className="mt-1 text-xs text-[#746E67]">悬停或点击列头，高亮该类型并跳转详情。</p>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-[960px] w-full text-left text-sm">
              <thead>
                <tr className="border-b border-[#eceae3] bg-white text-xs font-black text-[#888]">
                  <th className="w-28 px-4 py-3">维度</th>
                  {FROM_PRIMARY_PERSONAS.map((p) => (
                    <th
                      key={p.id}
                      onMouseEnter={() => setHoverCol(p.id)}
                      onMouseLeave={() => setHoverCol(null)}
                      onClick={() => onJump(p.id)}
                      className="cursor-pointer px-4 py-3 transition-colors"
                      style={{
                        color: p.accent,
                        background: hoverCol === p.id ? p.accentSoft : undefined,
                      }}
                    >
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
                      <td
                        key={cell.personaId}
                        onMouseEnter={() => setHoverCol(cell.personaId)}
                        onMouseLeave={() => setHoverCol(null)}
                        onClick={() => onJump(cell.personaId)}
                        className="cursor-pointer px-4 py-4 text-xs leading-6 text-[#4a453f] transition-colors"
                        style={{ background: hoverCol === cell.personaId ? `${cell.accent}12` : undefined }}
                      >
                        {cell.value}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {FROM_PRIMARY_PERSONAS.map((persona, i) => (
            <motion.button
              {...reveal}
              transition={{ ...reveal.transition, delay: i * 0.05 }}
              whileHover={{ y: -3, boxShadow: '0 8px 24px rgba(0,0,0,0.06)' }}
              whileTap={{ scale: 0.99 }}
              key={persona.id}
              onClick={() => onJump(persona.id)}
              className="rounded-xl border border-[#e7e5de] bg-white p-5 text-left"
            >
              <div className="flex items-center gap-2">
                <span className="text-lg font-black" style={{ color: persona.accent }}>
                  {persona.index}
                </span>
                <span className="text-base font-black text-[#292521]">{persona.name}</span>
                <span className="rounded px-1.5 py-0.5 text-[10px] font-black" style={{ background: persona.accentSoft, color: persona.accent }}>
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
  const [showMoreQuotes, setShowMoreQuotes] = React.useState(false);
  const extraQuotes = persona.representative.extraQuotes ?? [];

  return (
    <section ref={registerRef} data-section-id={persona.id} className="scroll-mt-14 border-b border-[#e4e2da]">
      <div className="mx-auto max-w-[1180px] px-5 py-12 md:py-20">
        <motion.div {...reveal} className="flex items-start gap-4 md:gap-6">
          <motion.span
            initial={{ opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-5xl font-black leading-none md:text-7xl"
            style={{ color: persona.accent }}
          >
            {persona.index}
          </motion.span>
          <div className="pt-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-2xl font-black text-[#292521] md:text-3xl">{persona.name}</h2>
              <span className="rounded px-2 py-0.5 text-[11px] font-black" style={{ background: persona.accentSoft, color: persona.accent }}>
                {persona.keyword}
              </span>
            </div>
            <p className="mt-2 max-w-2xl text-base leading-7 text-[#4a453f]">{persona.tagline}</p>
          </div>
        </motion.div>

        {/* 用户画像：先讲这一类人 */}
        <motion.div {...reveal} className="mt-10">
          <ChapterSectionHeader label="用户画像" subtitle="这一类家长是谁、要什么、痛在哪、偏好什么" accent={persona.accent} />
        </motion.div>

        <div className="mt-5 space-y-5">
          <motion.div {...reveal} className="rounded-2xl border border-[#e7e5de] bg-white p-5 md:p-6" style={{ borderTopWidth: 3, borderTopColor: persona.accent }}>
            <div className="text-[11px] font-black tracking-wide" style={{ color: persona.accent }}>
              类型 {persona.index} · {persona.name}
            </div>
            <p className="mt-3 text-[15px] font-semibold leading-8 text-[#332f2a]">{persona.definition}</p>
          </motion.div>

          <ScrollBlock persona={persona} delay={0}>
            <SectionLabel icon={GitCompare} label="与其他类型的边界" accent={persona.accent} />
            <p className="mt-3 text-sm leading-7 text-[#3f3a35]">{persona.boundary}</p>
          </ScrollBlock>

          <ScrollBlock persona={persona} delay={0.05}>
            <SectionLabel icon={Lightbulb} label="产品机会（来自偏好）" accent={persona.accent} />
            <p className="mt-3 text-sm leading-7 text-[#3f3a35]">{persona.productOpportunity}</p>
          </ScrollBlock>

          <div className="grid gap-px overflow-hidden rounded-xl border border-[#e4e2da] bg-[#e4e2da] sm:grid-cols-2">
            {persona.attributes.map((attr, i) => {
              const Icon = ATTRIBUTE_ICON[attr.key];
              return (
                <motion.div
                  {...reveal}
                  transition={{ ...reveal.transition, delay: i * 0.07 }}
                  key={attr.key}
                  whileHover={{ backgroundColor: '#fffaf7' }}
                  className="bg-white p-4 transition-colors"
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

          {persona.cases.length > 0 && (
            <motion.div {...reveal} className="flex flex-wrap gap-3">
              {persona.cases.map((c) => (
                <motion.div
                  key={`${c.brand}-${c.tone}`}
                  whileHover={{ y: -2 }}
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
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>

        {/* 用户故事：再讲这一类人中的典型代表 */}
        <motion.div {...reveal} className="mt-12 md:mt-16">
          <ChapterSectionHeader label="用户故事" subtitle="该类型中的典型代表 · 真实访谈还原" accent="#3F5E8C" />
        </motion.div>

        <div className="mt-5 space-y-5">
          <RepresentativeUserCard persona={persona} />

          {persona.storyBeats.map((beat, i) => (
            <motion.article
              {...reveal}
              transition={{ ...reveal.transition, delay: Math.min(i * 0.06, 0.18) }}
              key={beat.heading}
              whileHover={{ x: 4 }}
              className="rounded-xl border border-[#d8e4ef] bg-[#f8fbfe] p-5"
            >
              <div className="flex items-center gap-3">
                <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-[#3F5E8C]/12 text-[11px] font-black text-[#3F5E8C]">
                  {i + 1}
                </span>
                <h4 className="text-[15px] font-black text-[#292521]">{beat.heading}</h4>
              </div>
              <div className="mt-3 space-y-3 pl-9">
                {beat.body && <p className="text-sm leading-7 text-[#4a453f]">{beat.body}</p>}
                {beat.points?.map((pt, j) => (
                  <div key={j} className="space-y-2">
                    {pt.text && (
                      <div className="flex items-start gap-2">
                        <span className="mt-[10px] h-1 w-1 shrink-0 rounded-full bg-[#3F5E8C]/60" />
                        <p className="text-sm leading-7 text-[#4a453f]">{pt.text}</p>
                      </div>
                    )}
                    {pt.quotes?.map((q, k) => (
                      <blockquote
                        key={k}
                        className="ml-4 border-l-2 border-[#c9d7e8] bg-white px-3.5 py-2 text-[13px] italic leading-6 text-[#5c564f]"
                      >
                        "{q}"
                      </blockquote>
                    ))}
                  </div>
                ))}
              </div>
            </motion.article>
          ))}

          <motion.blockquote
            {...reveal}
            className="relative overflow-hidden rounded-xl border border-[#d8e4ef] bg-[#eef4fa] p-5 md:p-6"
          >
            <Quote size={48} className="absolute -right-1 -top-1 text-[#3F5E8C]/15" />
            <p className="relative text-[11px] font-black tracking-wide text-[#3F5E8C]">代表原声</p>
            <p className="relative mt-2 text-[15px] font-semibold leading-8 text-[#332f2a]">"{persona.representative.quote}"</p>
          </motion.blockquote>

          {extraQuotes.length > 0 && (
            <div>
              <button
                type="button"
                onClick={() => setShowMoreQuotes((v) => !v)}
                className="flex items-center gap-1.5 text-xs font-bold text-[#3F5E8C] transition-colors hover:opacity-80"
              >
                <motion.span animate={{ rotate: showMoreQuotes ? 180 : 0 }}>
                  <ChevronDown size={14} />
                </motion.span>
                {showMoreQuotes ? '收起更多原声' : '展开更多原声'}
              </button>
              <AnimatePresence>
                {showMoreQuotes && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="mt-3 space-y-2 overflow-hidden"
                  >
                    {extraQuotes.map((q) => (
                      <blockquote key={q} className="rounded-lg border border-[#d8e4ef] bg-white px-4 py-3 text-sm leading-7 text-[#555]">
                        "{q}"
                      </blockquote>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function ChapterSectionHeader({
  label,
  subtitle,
  accent,
}: {
  label: string;
  subtitle: string;
  accent: string;
}) {
  return (
    <div className="flex items-start gap-3 border-b border-[#e4e2da] pb-4">
      <span className="mt-1 h-8 w-1 shrink-0 rounded-full" style={{ background: accent }} />
      <div>
        <h3 className="text-lg font-black text-[#292521]">{label}</h3>
        <p className="mt-1 text-sm text-[#746E67]">{subtitle}</p>
      </div>
    </div>
  );
}

function RepresentativeUserCard({ persona }: { persona: FromPrimaryPersona }) {
  const rep = persona.representative;
  return (
    <motion.div
      {...reveal}
      className="overflow-hidden rounded-2xl border border-[#d8e4ef] bg-white shadow-sm"
    >
      <div className="border-b border-[#e8eef3] bg-[#f8fbfe] px-5 py-4">
        <div className="text-[11px] font-black tracking-wide text-[#3F5E8C]">典型代表</div>
        <div className="mt-3 flex items-start gap-3">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[#3F5E8C] text-white">
            <UserRound size={20} />
          </span>
          <div>
            <div className="text-base font-black text-[#292521]">{rep.title}</div>
            <div className="mt-1 flex items-center gap-1 text-[12px] font-semibold text-[#3F5E8C]">
              <MapPin size={12} />
              {rep.region} · {rep.grade} · {rep.role}
            </div>
          </div>
        </div>
      </div>
      <div className="px-5 py-4">
        <p className="text-sm leading-7 text-[#4a453f]">{rep.snapshot}</p>
      </div>
    </motion.div>
  );
}

function ScrollBlock({
  persona,
  delay,
  children,
}: {
  persona: FromPrimaryPersona;
  delay?: number;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      {...reveal}
      transition={{ ...reveal.transition, delay }}
      className="rounded-xl border border-[#e7e5de] bg-white p-5 md:p-6"
      style={{ borderLeftWidth: 3, borderLeftColor: persona.accent }}
    >
      {children}
    </motion.div>
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
