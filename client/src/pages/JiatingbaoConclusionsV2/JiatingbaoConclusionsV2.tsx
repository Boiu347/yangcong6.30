import React from 'react';
import { ArrowDown, Check, FileText } from 'lucide-react';
import EvidenceAudioClips from '@/components/EvidenceAudioClips';
import {
  familyCoreConclusions,
  type FamilyConclusionEvidence,
  type FamilyCoreConclusion,
} from '@/pages/JiatingbaoCoreConclusions/jiatingbaoCoreConclusionsData';
import { JIATINGBAO_CLIP_MAP } from '@/utils/jiatingbaoClipLookup';
import './JiatingbaoConclusionsV2.css';

const CHAPTERS = ['开场', '购买决策', '机会人群地图'];

const TICKER_QUOTES = [
  '我还是以哥哥的标准来推荐，就是暑假预习初中，还有一个思维拓展。',
  '主要考虑的是哥哥，妹妹顺带着用；但如果没有妹妹的权益，可能就会买个短期课，不会买家庭包了，毕竟7000多块钱也不便宜。',
  '会不会看一会就不看了？',
  '花这么多钱不一定见到提分效果吧，高中有效果再买吧。',
  '这个涵盖的跨度时间太长，不确定性比较高，我不确定后面会不会有别的更好的替代。',
];

function EvidenceQuote({ item, color }: { item: FamilyConclusionEvidence; color: string }) {
  const clip = item.clipCaption ? JIATINGBAO_CLIP_MAP[item.clipCaption] : undefined;
  return (
    <blockquote className="jtb-v2-source-quote" style={{ borderLeftColor: color }}>
      <p>「{item.quote}」</p>
      <small>— {item.source}</small>
      {clip && <EvidenceAudioClips clips={[clip]} className="jtb-v2-audio" />}
    </blockquote>
  );
}

function Wave({ from, to, flip = false }: { from: string; to: string; flip?: boolean }) {
  return (
    <div className="jtb-v2-wave" style={{ background: to }}>
      <svg viewBox="0 0 1200 40" preserveAspectRatio="none">
        <path
          d={
            flip
              ? 'M0,10 Q200,40 400,15 Q600,0 800,20 Q1000,38 1200,15 L1200,0 L0,0Z'
              : 'M0,20 Q150,0 300,20 Q450,40 600,20 Q750,0 900,20 Q1050,40 1200,20 L1200,0 L0,0Z'
          }
          fill={from}
        />
      </svg>
    </div>
  );
}

function ConclusionDocument({ item, color }: { item: FamilyCoreConclusion; color: string }) {
  return (
    <article className="jtb-v2-document-card jtb-v2-reveal">
      <header>
        <span style={{ color }}>用研洞察</span>
        <h3>{item.title}</h3>
        <p>{item.conclusion}</p>
      </header>

      <div className="jtb-v2-document-points">
        {item.points.map((point, pointIndex) => (
          <section key={point.title}>
            <div className="jtb-v2-point-heading">
              <b style={{ background: color }}>{String(pointIndex + 1).padStart(2, '0')}</b>
              <h4>{point.title}</h4>
            </div>
            <p>{point.text}</p>
            {point.keyPoints && point.keyPoints.length > 0 && (
              <ul>
                {point.keyPoints.map((keyPoint) => (
                  <li key={keyPoint}><Check size={14} style={{ color }} />{keyPoint}</li>
                ))}
              </ul>
            )}
            {point.evidence && point.evidence.length > 0 && (
              <div className="jtb-v2-source-grid">
                {point.evidence.map((evidence) => (
                  <EvidenceQuote
                    key={`${evidence.quote}-${evidence.source}`}
                    item={evidence}
                    color={color}
                  />
                ))}
              </div>
            )}
          </section>
        ))}
      </div>

      {item.actions.length > 0 && (
        <aside className="jtb-v2-document-actions">
          <span>业务启发</span>
          {item.actions.map((action, actionIndex) => (
            <div key={action}><b>{actionIndex + 1}</b><p>{action}</p></div>
          ))}
        </aside>
      )}

      <footer><FileText size={13} />{item.evidenceNote}</footer>
    </article>
  );
}

export default function JiatingbaoConclusionsV2() {
  const pageRef = React.useRef<HTMLDivElement>(null);
  const sectionRefs = React.useRef<Array<HTMLElement | null>>([]);
  const [activeChapter, setActiveChapter] = React.useState(0);
  const [progress, setProgress] = React.useState(0);

  React.useEffect(() => {
    const page = pageRef.current;
    const scrollRoot = page?.parentElement;
    if (!page || !scrollRoot) return;

    const updateProgress = () => {
      const available = scrollRoot.scrollHeight - scrollRoot.clientHeight;
      setProgress(available > 0 ? (scrollRoot.scrollTop / available) * 100 : 0);
    };
    updateProgress();
    scrollRoot.addEventListener('scroll', updateProgress, { passive: true });

    const revealObserver = new IntersectionObserver(
      (entries) => entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add('is-visible');
      }),
      { root: scrollRoot, threshold: 0.06 },
    );
    page.querySelectorAll('.jtb-v2-reveal').forEach((node) => revealObserver.observe(node));

    const chapterObserver = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((left, right) => right.intersectionRatio - left.intersectionRatio)[0];
        if (!visible) return;
        const index = sectionRefs.current.findIndex((section) => section === visible.target);
        if (index >= 0) setActiveChapter(index);
      },
      { root: scrollRoot, threshold: [0.15, 0.35, 0.6] },
    );
    sectionRefs.current.forEach((section) => section && chapterObserver.observe(section));

    return () => {
      scrollRoot.removeEventListener('scroll', updateProgress);
      revealObserver.disconnect();
      chapterObserver.disconnect();
    };
  }, []);

  const purchaseConclusions = familyCoreConclusions.filter((item) => item.dimension === 'purchase');
  const audienceConclusions = familyCoreConclusions.filter((item) => item.dimension === 'audience');

  const goToChapter = (index: number) => {
    sectionRefs.current[index]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div ref={pageRef} className="jtb-v2">
      <div className="jtb-v2-progress" style={{ width: `${progress}%` }} />
      <nav className="jtb-v2-dots" aria-label="章节导航">
        {CHAPTERS.map((chapter, index) => (
          <button
            key={chapter}
            type="button"
            aria-label={chapter}
            data-tip={chapter}
            className={activeChapter === index ? 'is-active' : ''}
            onClick={() => goToChapter(index)}
          />
        ))}
      </nav>

      <section
        ref={(node) => {
          sectionRefs.current[0] = node;
        }}
        className="jtb-v2-hero"
      >
        <span className="jtb-v2-star jtb-v2-star-a">⭐</span>
        <span className="jtb-v2-star jtb-v2-star-b">✨</span>
        <span className="jtb-v2-star jtb-v2-star-c">★</span>
        <span className="jtb-v2-star jtb-v2-star-d">✨</span>
        <div className="jtb-v2-family-art" aria-hidden="true">
          <svg width="180" height="150" viewBox="0 0 180 150" fill="none">
            <ellipse cx="90" cy="86" rx="72" ry="54" fill="#3DBFBF" opacity=".2" />
            <circle cx="60" cy="48" r="16" fill="#FFD23F" stroke="#2A2A2A" strokeWidth="2" />
            <rect x="49" y="64" width="22" height="34" rx="6" fill="#FF6B3D" stroke="#2A2A2A" strokeWidth="2" />
            <circle cx="122" cy="51" r="15" fill="#FFB3C6" stroke="#2A2A2A" strokeWidth="2" />
            <rect x="111" y="66" width="22" height="32" rx="6" fill="#5B8FED" stroke="#2A2A2A" strokeWidth="2" />
            <path d="M71 74 Q90 62 111 75" stroke="#2A2A2A" strokeWidth="2" strokeLinecap="round" />
            <path d="M54 98 L48 126 M66 98 L71 126 M116 98 L111 126 M128 98 L134 126" stroke="#2A2A2A" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>

        <div className="jtb-v2-hero-content jtb-v2-reveal">
          <div className="jtb-v2-hero-tag">洋葱学园 · 家庭包用户调研 · 2026</div>
          <h1>家庭包<span>结论速览</span></h1>
          <p className="jtb-v2-hero-sub">购买决策与机会人群地图</p>
          <p className="jtb-v2-hero-desc">内容仅对应《家庭包用户调研》主页面 2、3</p>
          <div className="jtb-v2-stats">
            <div><strong>2</strong><span>购买决策板块</span></div>
            <div><strong>3</strong><span>机会人群组</span></div>
            <div><strong>5</strong><span>核心结论</span></div>
          </div>
        </div>

        <button type="button" className="jtb-v2-scroll-cue" onClick={() => goToChapter(1)}>
          向下探索 <ArrowDown size={19} />
        </button>
        <div className="jtb-v2-ticker-wrap">
          <div className="jtb-v2-ticker">
            {[...TICKER_QUOTES, ...TICKER_QUOTES].map((quote, index) => (
              <span key={`${quote}-${index}`}><i />「{quote}」</span>
            ))}
          </div>
        </div>
      </section>

      <Wave from="#FEFDF9" to="#F7F5EF" />

      <section
        ref={(node) => {
          sectionRefs.current[1] = node;
        }}
        className="jtb-v2-section jtb-v2-bg-soft"
      >
        <div className="jtb-v2-wrap jtb-v2-wide">
          <header className="jtb-v2-chapter jtb-v2-reveal">
            <p>主页面 2 · 购买决策</p>
            <h2>家长并不是先被“家庭包”这个概念吸引<br /><span>而是先有一个孩子具体的学习问题</span></h2>
            <div>当这个问题足够明确时，家庭包才有机会进入决策。</div>
          </header>
          <div className="jtb-v2-document-stack">
            {purchaseConclusions.map((item, index) => (
              <ConclusionDocument key={item.id} item={item} color={index === 0 ? '#FF6B3D' : '#FF4D8B'} />
            ))}
          </div>
        </div>
      </section>

      <Wave from="#F7F5EF" to="#FFF8F0" flip />

      <section
        ref={(node) => {
          sectionRefs.current[2] = node;
        }}
        className="jtb-v2-section jtb-v2-bg-warm"
      >
        <div className="jtb-v2-wrap jtb-v2-wide">
          <header className="jtb-v2-chapter jtb-v2-reveal">
            <p>主页面 3 · 机会人群地图</p>
            <h2>不同二胎家庭结构的机会潜力<br /><span>不作为最终推课方案</span></h2>
            <div>该部分仅为通过调研了解不同二胎家庭结构的机会潜力的渠道，不作为最终推课方案。</div>
          </header>
          <div className="jtb-v2-document-stack">
            {audienceConclusions.map((item, index) => (
              <ConclusionDocument
                key={item.id}
                item={item}
                color={['#3DBFBF', '#5B8FED', '#F0B429'][index] ?? '#3DBFBF'}
              />
            ))}
          </div>
        </div>
      </section>

      <footer className="jtb-v2-footer">
        <span>⭐</span><strong>洋葱学园 · 用户研究团队</strong>
        <p>内容来源：《【网站素材】家庭包用户调研》主页面 2、3</p>
      </footer>
    </div>
  );
}
