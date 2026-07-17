import React from 'react';
import { ArrowDown, Check, FileText, Target } from 'lucide-react';
import EvidenceAudioClips from '@/components/EvidenceAudioClips';
import { FAMILY_STORY_PERSONAS } from '@/pages/FamilyPackage/TypicalFamilyStories';
import {
  familyCoreConclusions,
  type FamilyConclusionEvidence,
  type FamilyCoreConclusion,
} from '@/pages/JiatingbaoCoreConclusions/jiatingbaoCoreConclusionsData';
import { JIATINGBAO_CLIP_MAP } from '@/utils/jiatingbaoClipLookup';
import './JiatingbaoConclusionsV2.css';

const CHAPTERS = ['开场', '研究概览', '购买决策', '机会人群地图', '典型家庭故事'];

const TICKER_QUOTES = [
  '我还是以哥哥的标准来推荐，就是暑假预习初中，还有一个思维拓展。',
  '主要考虑的是哥哥，妹妹顺带着用；但如果没有妹妹的权益，可能就会买个短期课，不会买家庭包了，毕竟7000多块钱也不便宜。',
  '因为她平时学习也是非常主动的，非常自律。',
  '姐姐小升初的时候，好像周边的人都在补（提前学），我顶住压力没有给报班，现在想起来有点后悔。',
  '可以买最好，但是一定要发挥出东西。不能说放在那里，你就是再便宜的东西放在那里，它也浪费钱。',
];

const BACKGROUND_PHENOMENA = [
  {
    label: '超出预期',
    text: '小低+初中、小低+高中、小高+高中等组合表现突出，当属明星组合',
    color: '#3DBFBF',
  },
  {
    label: '不及预期',
    text: '初中+高中：看起来适配家庭包，但实际转化表现相对平平',
    color: '#FF4D8B',
  },
  {
    label: '潜力机会',
    text: '家庭包并不只被“多孩+含高中”驱动，可能存在新的购买逻辑；小高+小高、单孩小升初也有机会',
    color: '#F0B429',
  },
];

const RESEARCH_GOALS = [
  {
    title: '识别机会人群：哪些家庭组合最值得优先转化？',
    text: '家庭包是否真的主要服务“含高中跨学段多孩家庭”？小低+初中、小高+高中、小低+高中为什么表现好？初中+高中为什么不如预期？小高+小高、单孩小升初是否能成为新增机会？',
  },
  {
    title: '拆解购买动机：家庭包在家长心里解决了什么问题？',
    text: '家长买的到底是“小初高全覆盖”，还是当前孩子的升学/补弱/预习需求？另一个孩子或未来学段在决策里扮演什么角色？“比分开买省心省钱”是在什么条件下才成立？',
  },
  {
    title: '定位未成交卡点：知道家庭包但没买的人，卡在哪里？',
    text: '未成交是因为价格高、孩子坚持不了、权益浪费、当前用不上，还是销售没有讲透？其他组合品是如何替代家庭包、降低家长顾虑的？',
  },
  {
    title: '放大长期价值：家庭包要持续扩大销量，需要证明什么？',
    text: '6 年有效期和跨学段覆盖只有在“未来真的会用上”时才有价值。产品和销售需要怎样证明学习路径、使用效果和家庭复用机制，才能降低家长对长期包的观望？',
  },
];

const METHODS = [
  {
    value: '11',
    title: '深度访谈',
    text: '还原已购/未购家长的真实购买路径、需求触发、产品比较、下单理由和顾虑',
  },
  {
    value: '29',
    title: '招募简访',
    text: '补充“知道但没买”的轻量证据，识别观望、用不上、只想先试等卡点',
  },
  {
    value: '8000+',
    title: '问卷调研',
    text: '清洗后样本用于观测大盘家庭结构、孩子年级结构等客观数据（单孩 27%，二孩 60%，三孩 13%）',
  },
  {
    value: '1000+',
    title: '销售录音分析',
    text: '判断不同学段、不同家庭组合下的家庭包转化表现和客单/ARPU变化',
  },
];

function EvidenceQuote({ item }: { item: FamilyConclusionEvidence }) {
  const clip = item.clipCaption ? JIATINGBAO_CLIP_MAP[item.clipCaption] : undefined;
  return (
    <blockquote className="jtb-v2-source-quote">
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
                  <EvidenceQuote key={`${evidence.quote}-${evidence.source}`} item={evidence} />
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
  const [activeStoryId, setActiveStoryId] = React.useState(FAMILY_STORY_PERSONAS[0].id);

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
  const activeStory = FAMILY_STORY_PERSONAS.find((item) => item.id === activeStoryId) ?? FAMILY_STORY_PERSONAS[0];

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
          <h1>家庭包<span>用户调研</span></h1>
          <p className="jtb-v2-hero-sub">谁会买、为什么买、怎么让更多同类用户买</p>
          <p className="jtb-v2-hero-desc">业务侧最核心的目标是提升家庭包订单占比。<br />哪些家庭真的有转化机会，哪些卖点真正成立，哪些顾虑需要提前处理。</p>
          <div className="jtb-v2-stats">
            <div><strong>11</strong><span>深度访谈</span></div>
            <div><strong>29</strong><span>招募简访</span></div>
            <div><strong>8000+</strong><span>问卷样本</span></div>
            <div><strong>1000+</strong><span>销售录音</span></div>
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

      <Wave from="#FEFDF9" to="#FEFDF9" />

      <section
        ref={(node) => {
          sectionRefs.current[1] = node;
        }}
        className="jtb-v2-section jtb-v2-bg-paper"
      >
        <div className="jtb-v2-wrap">
          <div className="jtb-v2-blob jtb-v2-blob-teal" />
          <header className="jtb-v2-chapter jtb-v2-reveal">
            <p>主页面 1 · 研究概览</p>
            <h2>家庭包后续放量不能只依赖统一话术<br /><span>也不能简单认为“多孩家庭都适合家庭包”</span></h2>
            <div>业务需要进一步知道：哪些家庭真的有转化机会，哪些卖点真正成立，哪些顾虑需要提前处理。</div>
          </header>

          <div className="jtb-v2-overview-intro jtb-v2-reveal">
            <p>家庭包上线前，业务核心预期是通过「小初高 6 年全覆盖」、「多孩共学」、「费用均摊」等卖点，拉动更高客单和 ARPU；上线后，数据确实显示家庭包带来了增量，但增长背后出现了一些和原预期不完全一致的现象：</p>
          </div>

          <div className="jtb-v2-phenomena">
            {BACKGROUND_PHENOMENA.map((item) => (
              <article key={item.label} className="jtb-v2-reveal" style={{ '--phenomenon-color': item.color } as React.CSSProperties}>
                <span>{item.label}</span><p>{item.text}</p>
              </article>
            ))}
          </div>

          <div className="jtb-v2-goal-title jtb-v2-reveal">
            <Target size={20} />
            <div><strong>研究目标</strong><p>必须进一步回答“谁会买、为什么买、怎么让更多同类用户买”。</p></div>
          </div>
          <div className="jtb-v2-goals">
            {RESEARCH_GOALS.map((goal, index) => (
              <article key={goal.title} className="jtb-v2-reveal">
                <span>{index + 1}</span><div><h3>{goal.title}</h3><p>{goal.text}</p></div>
              </article>
            ))}
          </div>

          <div className="jtb-v2-method-heading jtb-v2-reveal">方法与样本</div>
          <div className="jtb-v2-methods">
            {METHODS.map((method) => (
              <article key={method.title} className="jtb-v2-reveal">
                <strong>{method.value}</strong><h3>{method.title}</h3><p>{method.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <Wave from="#FEFDF9" to="#F7F5EF" flip />

      <section
        ref={(node) => {
          sectionRefs.current[2] = node;
        }}
        className="jtb-v2-section jtb-v2-bg-soft"
      >
        <div className="jtb-v2-wrap jtb-v2-wide">
          <header className="jtb-v2-chapter jtb-v2-reveal">
            <p>主页面 2 · 购买决策</p>
            <h2>家长并不是先被“家庭包”吸引<br /><span>而是先有一个孩子具体的学习问题</span></h2>
            <div>当这个问题足够明确时，家庭包才有机会进入决策。</div>
          </header>
          <div className="jtb-v2-document-stack">
            {purchaseConclusions.map((item, index) => (
              <ConclusionDocument key={item.id} item={item} color={index === 0 ? '#FF6B3D' : '#FF4D8B'} />
            ))}
          </div>
        </div>
      </section>

      <Wave from="#F7F5EF" to="#FFF8F0" />

      <section
        ref={(node) => {
          sectionRefs.current[3] = node;
        }}
        className="jtb-v2-section jtb-v2-bg-warm"
      >
        <div className="jtb-v2-wrap jtb-v2-wide">
          <header className="jtb-v2-chapter jtb-v2-reveal">
            <p>主页面 3 · 机会人群地图</p>
            <h2>不同二胎家庭结构的机会潜力<br /><span>不作为最终推课方案</span></h2>
            <div>该部分仅为通过调研了解不同二胎家庭结构的机会潜力的渠道。</div>
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

      <Wave from="#FFF8F0" to="#FEFDF9" flip />

      <section
        ref={(node) => {
          sectionRefs.current[4] = node;
        }}
        className="jtb-v2-section jtb-v2-bg-paper"
      >
        <div className="jtb-v2-wrap jtb-v2-wide">
          <header className="jtb-v2-chapter jtb-v2-reveal">
            <p>主页面 4 · 典型家庭故事</p>
            <h2>4 个代表家庭的故事<br /><span>对应 4 类值得识别和转化的机会人群</span></h2>
            <div>画像信息、代表案例、核心特征、业务启发和访谈故事均来自原始文档。</div>
          </header>

          <div className="jtb-v2-story-tabs jtb-v2-reveal">
            {FAMILY_STORY_PERSONAS.map((persona) => (
              <button
                key={persona.id}
                type="button"
                className={persona.id === activeStory.id ? 'is-active' : ''}
                style={persona.id === activeStory.id ? { background: persona.accent, borderColor: persona.accent } : undefined}
                onClick={() => setActiveStoryId(persona.id)}
              >
                {persona.keyword}
              </button>
            ))}
          </div>

          <article className="jtb-v2-story jtb-v2-reveal" style={{ '--story-color': activeStory.accent } as React.CSSProperties}>
            <header>
              <span>{activeStory.index}</span>
              <div><small>{activeStory.keyword}</small><h3>{activeStory.title}</h3><p>{activeStory.tagline}</p></div>
            </header>

            <div className="jtb-v2-story-profile">
              <section><strong>销售特征识别标签</strong><ul>{activeStory.portrait.recognitionLabels.map((item) => <li key={item}>{item}</li>)}</ul></section>
              <section><strong>基本情况</strong><ul>{activeStory.portrait.basicSituation.map((item) => <li key={item}>{item}</li>)}</ul></section>
              <section><strong>购买动机</strong><ul>{activeStory.portrait.purchaseMotivation.map((item) => <li key={item}>{item}</li>)}</ul></section>
              <section><strong>家庭包为什么成立</strong><ul>{activeStory.portrait.familyPackageReasons.map((item) => <li key={item}>{item}</li>)}</ul></section>
              <section><strong>关键顾虑及化解方式</strong><p>{activeStory.portrait.concernIntro}</p><ul>{activeStory.portrait.concerns.map((item) => <li key={item}>{item}</li>)}</ul></section>
            </div>

            <div className="jtb-v2-story-case">
              <span>代表案例</span><h3>{activeStory.story.banner}</h3>
              <p><strong>核心特征：</strong>{activeStory.story.coreFeature}</p>
              <p><strong>业务启发：</strong>{activeStory.story.businessInsight}</p>
            </div>

            <div className="jtb-v2-story-narrative">
              {activeStory.story.narrative.map((segment, segmentIndex) => (
                <section key={segment.heading}>
                  <b>{segmentIndex + 1}</b>
                  <div>
                    <h4>{segment.heading}</h4>
                    {segment.points.map((point) => (
                      <div key={point.text} className="jtb-v2-story-point">
                        <p>{point.text}</p>
                        {point.quotes?.map((quote) => (
                          <blockquote key={quote}>「{quote}」</blockquote>
                        ))}
                      </div>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          </article>
        </div>
      </section>

      <footer className="jtb-v2-footer">
        <span>⭐</span><strong>洋葱学园 · 用户研究团队</strong>
        <p>内容来源：《【网站素材】家庭包用户调研》</p>
      </footer>
    </div>
  );
}
