import React from 'react';
import {
  ArrowDown,
  ArrowRight,
  Check,
  ExternalLink,
  FileText,
  Headphones,
  Quote,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import EvidenceAudioClips from '@/components/EvidenceAudioClips';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  familyCoreConclusions,
  type FamilyConclusionEvidence,
  type FamilyCoreConclusion,
} from '@/pages/JiatingbaoCoreConclusions/jiatingbaoCoreConclusionsData';
import { resolveJiatingbaoEvidenceAudio } from '@/utils/jiatingbaoEvidenceAudio';
import './JiatingbaoConclusionsV3.css';

const RESEARCH_RESOURCES = [
  {
    group: '研究规划',
    links: [
      {
        label: '【研究方案】家庭包用户调研',
        url: 'https://guanghe.feishu.cn/wiki/SW7FwtXejisq42kR241cdjuPnAd',
      },
    ],
  },
  {
    group: '访谈相关信息',
    links: [
      {
        label: '【访谈纪要】家庭包用户调研',
        url: 'https://guanghe.feishu.cn/wiki/U7MvwNaI9iLmABkJdiLclBOinGc',
      },
      {
        label: '【访谈逐字稿】家庭包用户调研',
        url: 'https://guanghe.feishu.cn/wiki/UhkjwjEv3iWWgakQyA2cmx1cndg',
      },
    ],
  },
  {
    group: '调研结论小结',
    links: [
      {
        label: '【洞察小结】家庭包用户调研',
        url: 'https://guanghe.feishu.cn/wiki/F5AZwBUUciIht0k706BcEzgInxe',
      },
      {
        label: '家庭包用户购买决策洞察',
        url: 'https://guanghe.feishu.cn/wiki/V9utwegDYipqxIkslIfcTL0Inud',
      },
    ],
  },
] as const;

const purchaseConclusions = familyCoreConclusions.filter(
  (item) => item.dimension === 'purchase',
);
const audienceConclusions = familyCoreConclusions.filter(
  (item) => item.dimension === 'audience',
);

type ModuleTone = 'purchase' | 'audience';

const CHAPTERS = [
  {
    id: 'jtb-v3-purchase',
    no: '01',
    q: '为什么购买，为什么犹豫',
    hint: '成立原因 → 未成交卡点',
    accent: 'purchase' as const,
    modules: purchaseConclusions.map((item, index) => ({
      id: `jtb-v3-${item.id}`,
      label: item.title,
      code: String(index + 1).padStart(2, '0'),
    })),
  },
  {
    id: 'jtb-v3-audience',
    no: '02',
    q: '不同组合，不同机会',
    hint: '小低组 / 小高组 / 其他潜力组合',
    accent: 'audience' as const,
    modules: audienceConclusions.map((item, index) => ({
      id: `jtb-v3-${item.id}`,
      label: item.title,
      code: String(index + 3).padStart(2, '0'),
    })),
  },
] as const;

function getScrollParent(el: HTMLElement | null): HTMLElement | null {
  let node = el?.parentElement ?? null;
  while (node) {
    const { overflowY } = getComputedStyle(node);
    if (
      (overflowY === 'auto' || overflowY === 'scroll') &&
      node.scrollHeight > node.clientHeight
    ) {
      return node;
    }
    node = node.parentElement;
  }
  return null;
}

function Hi({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span className={`jtb-v3-hi ${className}`.trim()}>
      <span data-v3-highlight className="jtb-v3-hi-mark" aria-hidden="true" />
      {children}
    </span>
  );
}

function ResearchDrawer() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <button className="jtb-v3-research-trigger" type="button">
          <FileText size={16} aria-hidden="true" />
          <span>研究资料</span>
          <b>5</b>
        </button>
      </SheetTrigger>
      <SheetContent className="jtb-v3-research-sheet" side="right">
        <SheetHeader className="jtb-v3-research-header">
          <span className="jtb-v3-research-kicker">
            家庭包用户调研资料 · 05
          </span>
          <SheetTitle className="jtb-v3-research-title">研究资料</SheetTitle>
          <SheetDescription className="jtb-v3-research-description">
            家庭包用户调研的研究规划、访谈材料与结论小结。
          </SheetDescription>
        </SheetHeader>

        <nav className="jtb-v3-research-groups" aria-label="家庭包研究资料">
          {RESEARCH_RESOURCES.map((resource, groupIndex) => (
            <section className="jtb-v3-research-group" key={resource.group}>
              <div className="jtb-v3-research-group-title">
                <span>{String(groupIndex + 1).padStart(2, '0')}</span>
                <h3>{resource.group}</h3>
              </div>
              <div className="jtb-v3-research-links">
                {resource.links.map((link) => (
                  <a
                    href={link.url}
                    key={link.url}
                    rel="noreferrer"
                    target="_blank"
                  >
                    <span>{link.label}</span>
                    <ExternalLink size={14} aria-hidden="true" />
                  </a>
                ))}
              </div>
            </section>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  );
}

function EvidenceQuote({ item }: { item: FamilyConclusionEvidence }) {
  const audio = resolveJiatingbaoEvidenceAudio(item);
  const spoken = audio.spokenText?.trim();
  const showSpoken = Boolean(spoken && spoken !== item.quote);

  return (
    <blockquote className="jtb-v3-voice" data-v3-voice>
      <div className="jtb-v3-voice-meta">
        {audio.clips.length > 0 ? (
          <Headphones size={13} aria-hidden="true" />
        ) : (
          <Quote size={13} aria-hidden="true" />
        )}
        <span>{audio.clips.length > 0 ? audio.label : '访谈原声'}</span>
      </div>
      {/* 有录音时优先展示实际播出文案，避免「字」和「声」错位 */}
      <p>“{showSpoken ? spoken : item.quote}”</p>
      {showSpoken ? (
        <p className="jtb-v3-voice-excerpt">研究摘录：{item.quote}</p>
      ) : null}
      <footer>— {item.source}</footer>
      {audio.clips.length > 0 ? (
        <EvidenceAudioClips clips={audio.clips} className="jtb-v3-audio" />
      ) : null}
    </blockquote>
  );
}

function KeyPointFlow({
  points,
  evidence,
  flow,
}: {
  points: string[];
  evidence?: FamilyConclusionEvidence[];
  flow: boolean;
}) {
  return (
    <div
      className={flow ? 'jtb-v3-flow' : 'jtb-v3-keypoints'}
      data-v3-flow={flow ? true : undefined}
    >
      {points.map((keyPoint, keyPointIndex) => {
        const matchingEvidence =
          evidence?.filter(
            (item) => item.keyPointIndex === keyPointIndex,
          ) ?? [];

        return (
          <div
            className={flow ? 'jtb-v3-flow-step' : 'jtb-v3-keypoint'}
            data-v3-flow-step={flow ? true : undefined}
            key={keyPoint}
          >
            <div className={flow ? 'jtb-v3-flow-line' : 'jtb-v3-keypoint-line'}>
              {flow ? (
                <span>{String(keyPointIndex + 1).padStart(2, '0')}</span>
              ) : (
                <Check size={15} aria-hidden="true" />
              )}
              <p>{keyPoint}</p>
            </div>
            {matchingEvidence.length > 0 && (
              <div className="jtb-v3-voice-grid">
                {matchingEvidence.map((item) => (
                  <EvidenceQuote
                    item={item}
                    key={`${item.quote}-${item.source}`}
                  />
                ))}
              </div>
            )}
            {flow && keyPointIndex < points.length - 1 ? (
              <ArrowDown
                className="jtb-v3-flow-arrow"
                size={16}
                aria-hidden="true"
              />
            ) : null}
          </div>
        );
      })}
    </div>
  );
}

function StoryModule({
  item,
  number,
  tone,
}: {
  item: FamilyCoreConclusion;
  number: string;
  tone: ModuleTone;
}) {
  const useFlow =
    item.id === 'purchase-reasons' || item.id === 'purchase-barriers';

  return (
    <section
      className={`jtb-v3-module is-${tone}`}
      data-v3-module
      id={`jtb-v3-${item.id}`}
    >
      <span className="jtb-v3-module-line" data-v3-module-line aria-hidden="true" />
      <header className="jtb-v3-module-header">
        <div data-v3-module-code>
          <p className="jtb-v3-module-code">
            <span>M{number}</span>
            <i />
          </p>
          <p className="jtb-v3-module-label">{item.title}</p>
        </div>
        <div data-v3-module-title>
          <h3>{item.conclusion}</h3>
        </div>
      </header>

      <div className="jtb-v3-module-body">
        {item.points.map((point, pointIndex) => {
          const unassignedEvidence =
            point.evidence?.filter(
              (evidence) =>
                !point.keyPoints?.length ||
                evidence.keyPointIndex == null ||
                evidence.keyPointIndex >= point.keyPoints.length,
            ) ?? [];

          return (
            <article
              className="jtb-v3-point"
              data-v3-point
              key={point.title}
            >
              <header>
                <span>{String(pointIndex + 1).padStart(2, '0')}</span>
                <h4>{point.title}</h4>
              </header>
              <p className="jtb-v3-point-text">{point.text}</p>

              {point.keyPoints && point.keyPoints.length > 0 ? (
                <KeyPointFlow
                  evidence={point.evidence}
                  flow={useFlow}
                  points={point.keyPoints}
                />
              ) : null}

              {unassignedEvidence.length > 0 ? (
                <div className="jtb-v3-voice-grid is-unassigned">
                  {unassignedEvidence.map((evidence) => (
                    <EvidenceQuote
                      item={evidence}
                      key={`${evidence.quote}-${evidence.source}`}
                    />
                  ))}
                </div>
              ) : null}
            </article>
          );
        })}
      </div>

      {item.actions.length > 0 ? (
        <aside className="jtb-v3-actions" data-v3-actions>
          <h4>业务启发</h4>
          <ol>
            {item.actions.map((action, actionIndex) => (
              <li key={action}>
                <b>{String(actionIndex + 1).padStart(2, '0')}</b>
                <p>{action}</p>
              </li>
            ))}
          </ol>
        </aside>
      ) : null}

      <footer className="jtb-v3-evidence-note">
        <FileText size={14} aria-hidden="true" />
        <span>{item.evidenceNote}</span>
      </footer>
    </section>
  );
}

export default function JiatingbaoConclusionsV3() {
  const navigate = useNavigate();
  const pageRef = React.useRef<HTMLDivElement>(null);
  const progressRef = React.useRef<HTMLDivElement>(null);
  const jumpTimerRef = React.useRef<number | null>(null);
  const landingTweenRef = React.useRef<gsap.core.Tween | null>(null);
  const landingFeedbackRef = React.useRef<(target: HTMLElement) => void>(
    () => undefined,
  );
  const [barAccent, setBarAccent] = React.useState<'purchase' | 'audience'>(
    'purchase',
  );

  const jumpToId = React.useCallback((id: string) => {
    const target = document.getElementById(id);
    if (!target) return;
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    if (jumpTimerRef.current !== null)
      window.clearTimeout(jumpTimerRef.current);
    jumpTimerRef.current = window.setTimeout(() => {
      landingFeedbackRef.current(target);
    }, 520);
  }, []);

  React.useLayoutEffect(() => {
    const page = pageRef.current;
    const progress = progressRef.current;
    if (!page || !progress) return undefined;

    gsap.registerPlugin(ScrollTrigger);
    const scroller = getScrollParent(page);
    const scrollerVars = scroller ? { scroller } : {};
    const media = gsap.matchMedia();

    media.add(
      {
        motionSafe: '(prefers-reduced-motion: no-preference)',
        reduceMotion: '(prefers-reduced-motion: reduce)',
      },
      (context) => {
        const reduceMotion = Boolean(context.conditions?.reduceMotion);

        gsap.set(progress, { scaleX: 0, transformOrigin: 'left center' });
        ScrollTrigger.create({
          trigger: page,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.2,
          ...scrollerVars,
          onUpdate: (self) => gsap.set(progress, { scaleX: self.progress }),
        });

        if (reduceMotion || document.visibilityState !== 'visible') {
          landingFeedbackRef.current = () => undefined;
          return undefined;
        }

        const heroNodes = gsap.utils
          .toArray<HTMLElement>(
            '[data-v3-hero-kicker], [data-v3-hero-title], [data-v3-hero-copy], [data-v3-hero-stat], [data-v3-hero-cue]',
            page,
          );
        const heroHighlights = gsap.utils.toArray<HTMLElement>(
          '[data-v3-hero-title] [data-v3-highlight]',
          page,
        );

        gsap.set(heroNodes, { autoAlpha: 0, y: 18 });
        gsap.set(heroHighlights, { scaleX: 0, transformOrigin: 'left center' });

        const heroTimeline = gsap.timeline({
          defaults: { duration: 0.55, ease: 'power2.out' },
        });
        heroTimeline
          .to('[data-v3-hero-kicker]', { autoAlpha: 1, y: 0 }, 0)
          .to('[data-v3-hero-title]', { autoAlpha: 1, y: 0 }, 0.12)
          .to(
            heroHighlights,
            { scaleX: 1, duration: 0.48, stagger: 0.1 },
            0.36,
          )
          .to(
            '[data-v3-hero-copy]',
            { autoAlpha: 1, y: 0, stagger: 0.06 },
            0.4,
          )
          .to(
            '[data-v3-hero-stat]',
            { autoAlpha: 1, y: 0, stagger: 0.08 },
            0.52,
          )
          .to('[data-v3-hero-cue]', { autoAlpha: 1, y: 0 }, 0.72);

        gsap.utils
          .toArray<HTMLElement>('[data-v3-highlight]', page)
          .filter((mark) => !mark.closest('[data-v3-hero-title]'))
          .forEach((mark) => {
            gsap.fromTo(
              mark,
              { scaleX: 0, transformOrigin: 'left center' },
              {
                scaleX: 1,
                duration: 0.6,
                ease: 'power2.out',
                scrollTrigger: {
                  trigger: mark.parentElement ?? mark,
                  start: 'top 84%',
                  once: true,
                  ...scrollerVars,
                },
              },
            );
          });

        const navCards = gsap.utils.toArray<HTMLElement>(
          '[data-v3-nav-card]',
          page,
        );
        if (navCards.length) {
          gsap.fromTo(
            navCards,
            { autoAlpha: 0, y: 22 },
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.58,
              stagger: 0.1,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: '[data-v3-nav-grid]',
                start: 'top 84%',
                once: true,
                ...scrollerVars,
              },
            },
          );
        }

        gsap.utils
          .toArray<HTMLElement>('[data-v3-chapter-marker]', page)
          .forEach((marker) => {
            const number = marker.querySelector<HTMLElement>(
              '[data-v3-chapter-number]',
            );
            const label = marker.querySelector<HTMLElement>(
              '[data-v3-chapter-label]',
            );
            const timeline = gsap.timeline({
              scrollTrigger: {
                trigger: marker,
                start: 'top 86%',
                once: true,
                ...scrollerVars,
              },
            });
            if (number) {
              timeline.fromTo(
                number,
                { autoAlpha: 0, scale: 0.72, rotation: -10 },
                {
                  autoAlpha: 1,
                  scale: 1,
                  rotation: 0,
                  duration: 0.48,
                  ease: 'back.out(1.7)',
                },
              );
            }
            if (label) {
              timeline.fromTo(
                label,
                { autoAlpha: 0, x: -10 },
                { autoAlpha: 1, x: 0, duration: 0.42, ease: 'power2.out' },
                '<0.12',
              );
            }
          });

        gsap.utils
          .toArray<HTMLElement>('[data-v3-module]', page)
          .forEach((module) => {
            const line = module.querySelector<HTMLElement>(
              '[data-v3-module-line]',
            );
            const code = module.querySelector<HTMLElement>(
              '[data-v3-module-code]',
            );
            const title = module.querySelector<HTMLElement>(
              '[data-v3-module-title]',
            );
            const timeline = gsap.timeline({
              scrollTrigger: {
                trigger: module,
                start: 'top 82%',
                once: true,
                ...scrollerVars,
              },
            });
            if (line) {
              timeline.fromTo(
                line,
                { scaleX: 0, transformOrigin: 'left center' },
                { scaleX: 1, duration: 0.68, ease: 'power2.out' },
              );
            }
            if (code) {
              timeline.fromTo(
                code,
                { autoAlpha: 0, x: -14 },
                { autoAlpha: 1, x: 0, duration: 0.46, ease: 'power2.out' },
                '<0.08',
              );
            }
            if (title) {
              timeline.fromTo(
                title,
                { autoAlpha: 0, y: 14 },
                { autoAlpha: 1, y: 0, duration: 0.5, ease: 'power2.out' },
                '<0.1',
              );
            }
          });

        gsap.utils
          .toArray<HTMLElement>('[data-v3-point]', page)
          .forEach((point) => {
            gsap.fromTo(
              point,
              { autoAlpha: 0, y: 22 },
              {
                autoAlpha: 1,
                y: 0,
                duration: 0.55,
                ease: 'power2.out',
                immediateRender: false,
                scrollTrigger: {
                  trigger: point,
                  start: 'top 88%',
                  once: true,
                  ...scrollerVars,
                },
              },
            );
          });

        gsap.utils
          .toArray<HTMLElement>('[data-v3-flow]', page)
          .forEach((flow) => {
            const steps = gsap.utils.toArray<HTMLElement>(
              '[data-v3-flow-step]',
              flow,
            );
            gsap.fromTo(
              steps,
              { autoAlpha: 0, x: -16 },
              {
                autoAlpha: 1,
                x: 0,
                duration: 0.5,
                stagger: 0.14,
                ease: 'power2.out',
                scrollTrigger: {
                  trigger: flow,
                  start: 'top 84%',
                  once: true,
                  ...scrollerVars,
                },
              },
            );
          });

        gsap.utils
          .toArray<HTMLElement>('[data-v3-voice]', page)
          .forEach((voice) => {
            gsap.fromTo(
              voice,
              { autoAlpha: 0, y: 14 },
              {
                autoAlpha: 1,
                y: 0,
                duration: 0.45,
                ease: 'power2.out',
                immediateRender: false,
                scrollTrigger: {
                  trigger: voice,
                  start: 'top 90%',
                  once: true,
                  ...scrollerVars,
                },
              },
            );
          });

        landingFeedbackRef.current = (target) => {
          const focus =
            target.querySelector<HTMLElement>('[data-v3-module-title]') ??
            target.querySelector<HTMLElement>('h2, h3') ??
            target;
          landingTweenRef.current?.kill();
          landingTweenRef.current = gsap.fromTo(
            focus,
            { autoAlpha: 0.58, x: 12 },
            {
              autoAlpha: 1,
              x: 0,
              duration: 0.58,
              ease: 'power3.out',
              overwrite: 'auto',
              clearProps: 'transform,opacity,visibility',
            },
          );
        };

        requestAnimationFrame(() => ScrollTrigger.refresh());
        return () => {
          landingFeedbackRef.current = () => undefined;
        };
      },
      page,
    );

    return () => {
      media.revert();
      landingTweenRef.current?.kill();
      landingTweenRef.current = null;
      if (jumpTimerRef.current !== null)
        window.clearTimeout(jumpTimerRef.current);
    };
  }, []);

  React.useEffect(() => {
    const page = pageRef.current;
    if (!page) return undefined;
    const scroller = getScrollParent(page);
    const chapterEls = CHAPTERS.map((chapter) =>
      document.getElementById(chapter.id),
    ).filter((el): el is HTMLElement => Boolean(el));

    if (!chapterEls.length) return undefined;

    const io = new IntersectionObserver(
      (entries) => {
        const hit = entries
          .filter((entry) => entry.isIntersecting)
          .sort(
            (a, b) => a.boundingClientRect.top - b.boundingClientRect.top,
          )[0];
        if (!hit) return;
        const chapter = CHAPTERS.find((item) => item.id === hit.target.id);
        if (chapter) setBarAccent(chapter.accent);
      },
      {
        root: scroller,
        rootMargin: '-42% 0px -42% 0px',
        threshold: 0,
      },
    );

    chapterEls.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <div className="jtb-v3-page" ref={pageRef}>
      <div
        className={`jtb-v3-progress is-${barAccent}`}
        aria-hidden="true"
      >
        <div ref={progressRef} />
      </div>
      <ResearchDrawer />

      <main>
        <section className="jtb-v3-hero" id="jtb-v3-hero">
          <div className="jtb-v3-hero-ring" aria-hidden="true" />
          <div className="jtb-v3-hero-inner">
            <p className="jtb-v3-kicker" data-v3-hero-kicker>
              洋葱学园 / 家庭包用户调研 · 研究结论
            </p>
            <h1 data-v3-hero-title>
              先解决一个孩子的
              <Hi>明确需求</Hi>
              ，
              <br className="jtb-v3-br" />
              再让另一个孩子的
              <Hi>长期价值</Hi>
              完成加码。
            </h1>
            <p className="jtb-v3-hero-subtitle" data-v3-hero-copy>
              购买决策与机会人群地图
            </p>
            <p className="jtb-v3-hero-lead" data-v3-hero-copy>
              家庭包并非以“家庭”进入家长心智，而是先从某个孩子的具体学习场景切入。
            </p>

            <div className="jtb-v3-hero-facts">
              {[
                ['主需求', '一个孩子当下明确'],
                ['价值加码', '另一个孩子也能用'],
                ['推动成交', '对比辅导班更值得'],
              ].map(([label, value]) => (
                <div data-v3-hero-stat key={label}>
                  <span>{label}</span>
                  <strong>{value}</strong>
                </div>
              ))}
            </div>

            <button
              className="jtb-v3-hero-cue"
              data-v3-hero-cue
              onClick={() => jumpToId('jtb-v3-nav')}
              type="button"
            >
              继续阅读研究结论
              <ArrowDown size={16} aria-hidden="true" />
            </button>
          </div>
        </section>

        <section className="jtb-v3-nav" id="jtb-v3-nav">
          <div className="jtb-v3-section-inner">
            <p className="jtb-v3-nav-kicker">两个研究问题 · 五个内容模组</p>
            <div className="jtb-v3-nav-grid" data-v3-nav-grid>
              {CHAPTERS.map((chapter) => (
                <article
                  className={`jtb-v3-nav-card is-${chapter.accent}`}
                  data-v3-nav-card
                  key={chapter.id}
                >
                  <button
                    className="jtb-v3-nav-main"
                    onClick={() => jumpToId(chapter.id)}
                    type="button"
                  >
                    <span>{chapter.no}</span>
                    <h2>{chapter.q}</h2>
                    <p>{chapter.hint}</p>
                  </button>
                  <div className="jtb-v3-nav-modules">
                    {chapter.modules.map((module) => (
                      <button
                        key={module.id}
                        onClick={() => jumpToId(module.id)}
                        type="button"
                      >
                        <b>M{module.code}</b>
                        <span>{module.label}</span>
                        <ArrowRight size={14} aria-hidden="true" />
                      </button>
                    ))}
                  </div>
                  <button
                    className="jtb-v3-nav-enter"
                    onClick={() => jumpToId(chapter.id)}
                    type="button"
                  >
                    进入本章
                    <ArrowRight size={16} aria-hidden="true" />
                  </button>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section
          className="jtb-v3-chapter is-purchase"
          id="jtb-v3-purchase"
        >
          <div className="jtb-v3-section-inner">
            <div className="jtb-v3-chapter-marker" data-v3-chapter-marker>
              <span data-v3-chapter-number>01</span>
              <span data-v3-chapter-label>购买决策 · 为什么买，为什么犹豫</span>
            </div>
            <h2>
              为什么购买，
              <br className="jtb-v3-br" />
              为什么犹豫
            </h2>
            <p className="jtb-v3-chapter-lead">
              按照「成立原因 → 未成交卡点」的原始顺序呈现。
            </p>

            <div className="jtb-v3-modules">
              {purchaseConclusions.map((item, index) => (
                <StoryModule
                  item={item}
                  key={item.id}
                  number={String(index + 1).padStart(2, '0')}
                  tone="purchase"
                />
              ))}
            </div>
          </div>
        </section>

        <section
          className="jtb-v3-chapter is-audience"
          id="jtb-v3-audience"
        >
          <div className="jtb-v3-section-inner">
            <div className="jtb-v3-chapter-marker" data-v3-chapter-marker>
              <span data-v3-chapter-number>02</span>
              <span data-v3-chapter-label>
                机会人群地图 · 不同组合，不同机会
              </span>
            </div>
            <h2>
              不同组合，
              <br className="jtb-v3-br" />
              不同机会
            </h2>
            <p className="jtb-v3-chapter-lead">
              该部分仅为通过调研了解不同二胎家庭结构机会潜力的渠道，不作为最终推课方案。
            </p>

            <div className="jtb-v3-modules">
              {audienceConclusions.map((item, index) => (
                <StoryModule
                  item={item}
                  key={item.id}
                  number={String(index + 3).padStart(2, '0')}
                  tone="audience"
                />
              ))}
            </div>
          </div>
        </section>

        <section className="jtb-v3-next">
          <div className="jtb-v3-section-inner jtb-v3-next-inner">
            <div>
              <span>继续阅读</span>
              <h2>典型家庭故事</h2>
              <p>沿着真实家庭的选择过程，继续查看结论如何发生。</p>
            </div>
            <button
              onClick={() =>
                navigate('/projects/jiatingbao_project/family-stories')
              }
              type="button"
            >
              进入下一页
              <ArrowRight size={18} aria-hidden="true" />
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}
