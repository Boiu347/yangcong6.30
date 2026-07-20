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
import { JIATINGBAO_CLIP_MAP } from '@/utils/jiatingbaoClipLookup';
import { clipsForQuote } from '@/utils/sourceUtils';
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
  const mappedClip = item.clipCaption
    ? JIATINGBAO_CLIP_MAP[item.clipCaption]
    : undefined;
  const clips = mappedClip ? [mappedClip] : clipsForQuote(item.quote);

  return (
    <blockquote className="jtb-v3-evidence-quote">
      <Quote size={16} aria-hidden="true" />
      <p>“{item.quote}”</p>
      <footer>- {item.source}</footer>
      {clips.length > 0 && (
        <div className="jtb-v3-audio-wrap">
          <span>
            <Headphones size={13} aria-hidden="true" />
            真实访谈原声
          </span>
          <EvidenceAudioClips clips={clips} className="jtb-v3-audio" />
        </div>
      )}
    </blockquote>
  );
}

function ConclusionDocument({
  item,
  index,
  chapter,
}: {
  item: FamilyCoreConclusion;
  index: number;
  chapter: 'purchase' | 'audience';
}) {
  return (
    <article
      className={`jtb-v3-document is-${chapter} is-index-${index + 1}`}
      data-v3-section-reveal
      id={`jtb-v3-${item.id}`}
    >
      <header className="jtb-v3-document-header">
        <div className="jtb-v3-document-index" aria-hidden="true">
          {String.fromCharCode(97 + index)}
        </div>
        <div>
          <h3>{item.title}</h3>
          <p>{item.conclusion}</p>
        </div>
      </header>

      <div className="jtb-v3-points">
        {item.points.map((point, pointIndex) => {
          const unassignedEvidence =
            point.evidence?.filter(
              (evidence) =>
                !point.keyPoints?.length ||
                evidence.keyPointIndex == null ||
                evidence.keyPointIndex >= point.keyPoints.length,
            ) ?? [];

          return (
            <section
              className="jtb-v3-point"
              key={point.title}
              data-v3-point-reveal
            >
              <div className="jtb-v3-point-number">
                {String(pointIndex + 1).padStart(2, '0')}
              </div>
              <div className="jtb-v3-point-content">
                <h4>{point.title}</h4>
                <p className="jtb-v3-point-summary">{point.text}</p>

                {point.keyPoints && point.keyPoints.length > 0 && (
                  <div className="jtb-v3-keypoints">
                    {point.keyPoints.map((keyPoint, keyPointIndex) => {
                      const matchingEvidence =
                        point.evidence?.filter(
                          (evidence) =>
                            evidence.keyPointIndex === keyPointIndex,
                        ) ?? [];

                      return (
                        <div className="jtb-v3-keypoint" key={keyPoint}>
                          <div className="jtb-v3-keypoint-line">
                            <Check size={15} aria-hidden="true" />
                            <span>{keyPoint}</span>
                          </div>
                          {matchingEvidence.length > 0 && (
                            <div className="jtb-v3-evidence-grid">
                              {matchingEvidence.map((evidence) => (
                                <EvidenceQuote
                                  item={evidence}
                                  key={`${evidence.quote}-${evidence.source}`}
                                />
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}

                {unassignedEvidence.length > 0 && (
                  <div className="jtb-v3-evidence-grid is-unassigned">
                    {unassignedEvidence.map((evidence) => (
                      <EvidenceQuote
                        item={evidence}
                        key={`${evidence.quote}-${evidence.source}`}
                      />
                    ))}
                  </div>
                )}
              </div>
            </section>
          );
        })}
      </div>

      {item.actions.length > 0 && (
        <aside className="jtb-v3-actions">
          <div className="jtb-v3-actions-heading">
            <h4>业务启发</h4>
          </div>
          <div className="jtb-v3-actions-list">
            {item.actions.map((action, actionIndex) => (
              <div key={action}>
                <b>{String(actionIndex + 1).padStart(2, '0')}</b>
                <p>{action}</p>
              </div>
            ))}
          </div>
        </aside>
      )}

      <footer className="jtb-v3-evidence-note">
        <FileText size={14} aria-hidden="true" />
        <span>{item.evidenceNote}</span>
      </footer>
    </article>
  );
}

export default function JiatingbaoConclusionsV3() {
  const navigate = useNavigate();
  const pageRef = React.useRef<HTMLDivElement>(null);
  const progressRef = React.useRef<HTMLDivElement>(null);

  React.useLayoutEffect(() => {
    const page = pageRef.current;
    const progress = progressRef.current;
    const scroller = page?.parentElement;
    if (!page || !progress || !scroller) return undefined;

    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();

    media.add(
      {
        motionSafe: '(prefers-reduced-motion: no-preference)',
        reduceMotion: '(prefers-reduced-motion: reduce)',
      },
      (context) => {
        const { motionSafe } = context.conditions as { motionSafe: boolean };

        gsap.set(progress, { scaleX: 0, transformOrigin: 'left center' });
        gsap.to(progress, {
          scaleX: 1,
          ease: 'none',
          scrollTrigger: {
            scroller,
            trigger: page,
            start: 'top top',
            end: 'bottom bottom',
            scrub: 0.2,
          },
        });

        // Keep the research readable when the page is restored in a background tab.
        // GSAP's `from` tweens set their initial hidden state immediately, but a
        // background document may defer the first animation frame indefinitely.
        if (!motionSafe || document.visibilityState !== 'visible')
          return undefined;

        const heroTimeline = gsap.timeline({
          defaults: { duration: 0.62, ease: 'power3.out' },
        });
        heroTimeline
          .from('[data-v3-hero-kicker]', { autoAlpha: 0, y: 16 })
          .from(
            '[data-v3-hero-title]',
            { autoAlpha: 0, y: 34, stagger: 0.08 },
            '-=0.32',
          )
          .from(
            '[data-v3-hero-copy]',
            { autoAlpha: 0, y: 18, stagger: 0.08 },
            '-=0.28',
          )
          .from(
            '[data-v3-chapter-link]',
            { autoAlpha: 0, y: 22, stagger: 0.1 },
            '-=0.3',
          );

        gsap.utils
          .toArray<HTMLElement>('[data-v3-section-reveal]', page)
          .forEach((element) => {
            gsap.from(element, {
              y: 36,
              duration: 0.7,
              ease: 'power2.out',
              scrollTrigger: {
                scroller,
                trigger: element,
                start: 'top 88%',
                once: true,
              },
            });
          });

        gsap.utils
          .toArray<HTMLElement>('[data-v3-point-reveal]', page)
          .forEach((element) => {
            gsap.from(element, {
              y: 22,
              duration: 0.55,
              ease: 'power2.out',
              scrollTrigger: {
                scroller,
                trigger: element,
                start: 'top 91%',
                once: true,
              },
            });
          });

        requestAnimationFrame(() => ScrollTrigger.refresh());
        return undefined;
      },
      page,
    );

    return () => media.revert();
  }, []);

  return (
    <div className="jtb-v3-page" ref={pageRef}>
      <div className="jtb-v3-progress" aria-hidden="true">
        <div ref={progressRef} />
      </div>
      <ResearchDrawer />

      <main>
        <section className="jtb-v3-hero">
          <div className="jtb-v3-hero-inner">
            <div className="jtb-v3-hero-copy">
              <span className="jtb-v3-kicker" data-v3-hero-kicker>
                洋葱学园 / 家庭包用户调研
              </span>
              <h1>
                <span data-v3-hero-title>家庭包</span>
                <span data-v3-hero-title>结论速览</span>
              </h1>
              <p className="jtb-v3-hero-subtitle" data-v3-hero-copy>
                购买决策与机会人群地图
              </p>
              <p className="jtb-v3-hero-lead" data-v3-hero-copy>
                沿着家长的决策过程，读完购买原因、顾虑与不同家庭组合的机会。
              </p>
            </div>

            <nav className="jtb-v3-chapter-nav" aria-label="本页章节">
              <a href="#jtb-v3-purchase" data-v3-chapter-link>
                <div>
                  <span>主页面 2</span>
                  <b>购买决策</b>
                </div>
                <p>成立原因 / 未成交卡点</p>
                <ArrowDown size={18} aria-hidden="true" />
              </a>
              <a href="#jtb-v3-audience" data-v3-chapter-link>
                <div>
                  <span>主页面 3</span>
                  <b>机会人群地图</b>
                </div>
                <p>小低组 / 小高组 / 其他潜力组合</p>
                <ArrowDown size={18} aria-hidden="true" />
              </a>
            </nav>
          </div>
        </section>

        <div className="jtb-v3-reading-shell">
          <aside className="jtb-v3-journey-rail" aria-label="研究路径">
            <span>研究路径</span>
            <a href="#jtb-v3-purchase">
              <b>2</b>
              <div>
                购买决策
                <small>成立原因 / 未成交卡点</small>
              </div>
            </a>
            <a href="#jtb-v3-audience">
              <b>3</b>
              <div>
                机会人群地图
                <small>小低组 / 小高组 / 其他潜力组合</small>
              </div>
            </a>
          </aside>

          <div className="jtb-v3-reading-content">
            <section className="jtb-v3-chapter" id="jtb-v3-purchase">
              <header className="jtb-v3-chapter-header" data-v3-section-reveal>
                <span className="jtb-v3-chapter-tape">主页面 2 / 购买决策</span>
                <h2>为什么购买，为什么犹豫</h2>
                <p>按照“成立原因 → 未成交卡点”的原始顺序呈现。</p>
              </header>

              <div className="jtb-v3-documents">
                {purchaseConclusions.map((item, index) => (
                  <ConclusionDocument
                    chapter="purchase"
                    index={index}
                    item={item}
                    key={item.id}
                  />
                ))}
              </div>
            </section>

            <section
              className="jtb-v3-chapter is-audience"
              id="jtb-v3-audience"
            >
              <header className="jtb-v3-chapter-header" data-v3-section-reveal>
                <span className="jtb-v3-chapter-tape is-orange">
                  主页面 3 / 机会人群地图
                </span>
                <h2>不同组合，不同机会</h2>
                <p>
                  该部分仅为通过调研了解不同二胎家庭结构机会潜力的渠道，不作为最终推课方案。
                </p>
              </header>

              <div className="jtb-v3-documents">
                {audienceConclusions.map((item, index) => (
                  <ConclusionDocument
                    chapter="audience"
                    index={index}
                    item={item}
                    key={item.id}
                  />
                ))}
              </div>
            </section>

            <section className="jtb-v3-next" data-v3-section-reveal>
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
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
