import React from 'react';
import { motion } from 'motion/react';
import {
  AlertTriangle,
  ExternalLink,
  Heart,
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
  PORTRAIT_SOURCES,
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
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
};

export default function FromPrimaryPortraitsPage() {
  const personas = FROM_PRIMARY_PERSONAS;
  const [activeId, setActiveId] = React.useState(personas[0]?.id ?? '');
  const sectionRefs = React.useRef<Record<string, HTMLElement | null>>({});

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target instanceof HTMLElement && visible.target.dataset.personaId) {
          setActiveId(visible.target.dataset.personaId);
        }
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: [0, 0.25, 0.5, 1] },
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

      {/* 吸顶画像导航 */}
      <nav className="sticky top-0 z-20 border-y border-[#e4e2da] bg-[#f8f8f5]/92 backdrop-blur">
        <div className="mx-auto flex max-w-[1180px] items-stretch gap-1 overflow-x-auto px-5">
          {personas.map((persona) => {
            const current = persona.id === activeId;
            return (
              <button
                key={persona.id}
                onClick={() => jumpTo(persona.id)}
                className="group relative flex shrink-0 items-center gap-2.5 py-3.5 pl-1 pr-5 text-left"
              >
                <span
                  className="grid h-7 w-7 place-items-center rounded-full text-[11px] font-black transition-colors"
                  style={{
                    background: current ? persona.accent : persona.accentSoft,
                    color: current ? '#fff' : persona.accent,
                  }}
                >
                  {persona.index}
                </span>
                <span
                  className="whitespace-nowrap text-[13px] transition-colors"
                  style={{ color: current ? INK : MUTED, fontWeight: current ? 800 : 500 }}
                >
                  {persona.name}
                </span>
                {current && (
                  <motion.span
                    layoutId="portrait-nav-underline"
                    className="absolute inset-x-1 bottom-0 h-0.5"
                    style={{ background: persona.accent }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </nav>

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

function IntroHero() {
  return (
    <header className="border-b border-[#e4e2da] bg-[#f4f2ec]">
      <div className="mx-auto max-w-[1180px] px-5 py-12 md:py-16">
        <motion.div {...reveal}>
          <div className="flex items-center gap-2 text-[#C9622E]">
            <Users size={16} />
            <span className="text-[11px] font-black tracking-[0.14em]">{PORTRAIT_INTRO.eyebrow}</span>
          </div>
          <h1 className="mt-3 text-3xl font-black leading-tight text-[#292521] md:text-[42px]">
            {PORTRAIT_INTRO.title}
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-[#4a453f] md:text-lg">{PORTRAIT_INTRO.lead}</p>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-[#746E67]">{PORTRAIT_INTRO.note}</p>
          <div className="mt-7 flex flex-wrap gap-2.5">
            {FROM_PRIMARY_PERSONAS.map((persona) => (
              <span
                key={persona.id}
                className="inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-xs font-bold"
                style={{ borderColor: persona.accent, color: persona.accent }}
              >
                <span className="font-black">{persona.index}</span>
                {persona.name}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </header>
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
    <section
      ref={registerRef}
      data-persona-id={persona.id}
      className="scroll-mt-14 border-b border-[#e4e2da]"
    >
      <div className="mx-auto max-w-[1180px] px-5 py-14 md:py-20">
        {/* 章节头 */}
        <motion.div {...reveal} className="flex items-start gap-4 md:gap-6">
          <span
            className="text-5xl font-black leading-none md:text-7xl"
            style={{ color: persona.accent, opacity: 0.9 }}
          >
            {persona.index}
          </span>
          <div className="pt-1">
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-black text-[#292521] md:text-3xl">{persona.name}</h2>
              <span
                className="rounded px-2 py-0.5 text-[11px] font-black"
                style={{ background: persona.accentSoft, color: persona.accent }}
              >
                {persona.keyword}
              </span>
            </div>
            <p className="mt-2 max-w-2xl text-base leading-7 text-[#4a453f]">{persona.tagline}</p>
          </div>
        </motion.div>

        {/* 四维属性卡 */}
        <div className="mt-9 grid gap-px overflow-hidden rounded-xl border border-[#e4e2da] bg-[#e4e2da] sm:grid-cols-2 lg:grid-cols-4">
          {persona.attributes.map((attr, i) => {
            const Icon = ATTRIBUTE_ICON[attr.key];
            return (
              <motion.div
                {...reveal}
                transition={{ ...reveal.transition, delay: i * 0.06 }}
                key={attr.key}
                className="flex flex-col gap-3 bg-white p-5"
              >
                <div className="flex items-center gap-2" style={{ color: persona.accent }}>
                  <Icon size={16} />
                  <span className="text-xs font-black tracking-wide">{attr.label}</span>
                </div>
                <p className="text-sm leading-6 text-[#3f3a35]">{attr.value}</p>
              </motion.div>
            );
          })}
        </div>

        {/* 代表案例：sticky 人物卡 + 滚动故事 */}
        <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,340px)_minmax(0,1fr)]">
          <div className="lg:sticky lg:top-[72px] lg:self-start">
            <RepresentativeCard persona={persona} />
          </div>

          <div className="space-y-5">
            <motion.div {...reveal} className="flex items-center gap-2">
              <span className="h-4 w-1 rounded" style={{ background: persona.accent }} />
              <h3 className="text-sm font-black tracking-wide text-[#292521]">代表案例 · 故事线</h3>
            </motion.div>

            {persona.representative.story.map((section, i) => (
              <motion.article
                {...reveal}
                transition={{ ...reveal.transition, delay: Math.min(i * 0.05, 0.2) }}
                key={section.heading}
                className="rounded-xl border border-[#e7e5de] bg-white p-5 md:p-6"
              >
                <div className="flex items-center gap-3">
                  <span
                    className="grid h-6 w-6 shrink-0 place-items-center rounded-full text-[11px] font-black"
                    style={{ background: persona.accentSoft, color: persona.accent }}
                  >
                    {i + 1}
                  </span>
                  <h4 className="text-[15px] font-black text-[#292521]">{section.heading}</h4>
                </div>
                <p className="mt-3 pl-9 text-sm leading-7 text-[#4a453f]">{section.body}</p>
              </motion.article>
            ))}

            {/* 金句卡 */}
            <div className="grid gap-3">
              {persona.representative.quotes.map((quote) => (
                <motion.blockquote
                  {...reveal}
                  key={quote}
                  className="relative overflow-hidden rounded-xl p-5 md:p-6"
                  style={{ background: persona.accentSoft }}
                >
                  <Quote
                    size={40}
                    className="absolute -right-1 -top-1 opacity-15"
                    style={{ color: persona.accent }}
                  />
                  <p className="relative text-[15px] font-semibold leading-8 text-[#332f2a] md:text-base">
                    “{quote}”
                  </p>
                </motion.blockquote>
              ))}
            </div>

            {/* 典型案例 正/负 */}
            <motion.div {...reveal} className="grid gap-3 sm:grid-cols-2">
              {persona.cases.map((c) => (
                <div
                  key={c.brand}
                  className="flex items-start gap-3 rounded-xl border bg-white p-4"
                  style={{ borderColor: c.tone === 'positive' ? '#cfe6dc' : '#f0d6cd' }}
                >
                  {c.tone === 'positive' ? (
                    <ThumbsUp size={17} className="mt-0.5 shrink-0 text-[#2F8272]" />
                  ) : (
                    <ThumbsDown size={17} className="mt-0.5 shrink-0 text-[#C9622E]" />
                  )}
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-black text-[#292521]">{c.brand}</span>
                      <span
                        className="rounded px-1.5 py-0.5 text-[10px] font-bold"
                        style={{
                          background: c.tone === 'positive' ? '#eaf5f0' : '#fbeee8',
                          color: c.tone === 'positive' ? '#2F8272' : '#C9622E',
                        }}
                      >
                        {c.tone === 'positive' ? '正面案例' : '负面案例'}
                      </span>
                    </div>
                    <p className="mt-1.5 text-xs leading-5 text-[#5c564f]">{c.note}</p>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

function RepresentativeCard({ persona }: { persona: FromPrimaryPersona }) {
  const rep = persona.representative;
  return (
    <motion.div {...reveal} className="overflow-hidden rounded-2xl border border-[#e7e5de] bg-white">
      <div className="px-5 pt-5 pb-4" style={{ background: persona.accentSoft }}>
        <div className="flex items-center gap-3">
          <span
            className="grid h-12 w-12 place-items-center rounded-full text-white"
            style={{ background: persona.accent }}
          >
            <UserRound size={22} />
          </span>
          <div>
            <div className="text-base font-black text-[#292521]">{rep.title}</div>
            <div className="mt-1 flex items-center gap-1.5 text-xs font-semibold" style={{ color: persona.accent }}>
              <MapPin size={12} />
              {rep.region} · {rep.grade} · {rep.role}
            </div>
          </div>
        </div>
      </div>
      <div className="px-5 py-4">
        <div className="text-[11px] font-black tracking-wide text-[#9a938a]">核心特征</div>
        <p className="mt-2 text-sm leading-7 text-[#3f3a35]">{rep.coreTrait}</p>
      </div>
    </motion.div>
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
