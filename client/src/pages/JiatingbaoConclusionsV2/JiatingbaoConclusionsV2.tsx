import React from 'react';
import {
  ArrowDown,
  ArrowRight,
  Check,
  Lightbulb,
  ShieldAlert,
  Sparkles,
  Target,
} from 'lucide-react';
import EvidenceAudioClips from '@/components/EvidenceAudioClips';
import { clipsForQuote } from '@/utils/sourceUtils';
import './JiatingbaoConclusionsV2.css';

const CHAPTERS = ['开场', '真实动机', '成交机制', '共性顾虑', '机会人群', '下一步'];

const TICKER_QUOTES = [
  '主要考虑的是哥哥，妹妹顺带着用。',
  '因为她平时学习也是非常主动的，非常自律。',
  '姐姐小升初的时候没有提前学，现在想起来有点后悔。',
  '不想等出现问题的时候再来，就提前去做一些准备吧。',
  '可以买最好，但是一定要发挥出东西。',
];

const MOTIVATION_QUOTES = [
  {
    avatar: '黄',
    label: '小升初窗口驱动',
    color: '#FF6B3D',
    text: '主要考虑的是哥哥，妹妹顺带着用；但如果没有妹妹的权益，可能就会买个短期课，不会买家庭包了。',
    source: '黄妈妈｜广州｜3年级&6年级',
  },
  {
    avatar: '张',
    label: '大孩经验迁移',
    color: '#3DBFBF',
    text: '姐姐小升初的时候，好像周边的人都在补（提前学），我顶住压力没有给报班，现在想起来有点后悔。',
    source: '张妈妈｜合肥｜4年级&初三',
  },
  {
    avatar: '刘',
    label: '资源提前配置',
    color: '#5B8FED',
    text: '不想等出现问题的时候再来，就提前去做一些准备吧。',
    source: '刘爸爸｜九江｜1年级&6年级',
  },
];

const PERSONA_CARDS = [
  {
    id: 'window',
    tab: '升学窗口',
    title: '小升初窗口驱动型',
    signal: '一个孩子马上要用，另一个孩子未来能接上',
    reason: '当下的升学任务负责触发，次孩权益让 6 年家庭包从“太长”变成“不浪费”。',
    quote: '如果没有妹妹的权益，可能就会买个短期课，不会买家庭包了。',
    source: '黄妈妈｜广州',
    color: '#FF6B3D',
  },
  {
    id: 'self',
    tab: '拔尖自驱',
    title: '拔尖自驱超前学型',
    signal: '孩子主动想学，家长相信她能长期坚持',
    reason: '自律和超前学习让未来资源不再是囤课，而是孩子会逐步兑现的成长阶梯。',
    quote: '因为她平时学习也是非常主动的，非常自律。',
    source: '王妈妈｜景德镇',
    color: '#5B8FED',
  },
  {
    id: 'transfer',
    tab: '经验迁移',
    title: '大孩经验迁移型',
    signal: '老大走过弯路，老二要更早准备',
    reason: '线下补课、升学压力和准备不足的经历，被迁移为小孩的长期学习规划。',
    quote: '姐姐小升初的时候没有提前学，现在想起来有点后悔。',
    source: '张妈妈｜合肥',
    color: '#3DBFBF',
  },
  {
    id: 'reserve',
    tab: '资源预置',
    title: '家庭资源预置型',
    signal: '先把资源放在家里，需要时随时启动',
    reason: '多孩复用、覆盖完整和持续使用共同成立时，家庭包才像一座真正有价值的资源库。',
    quote: '可以买最好，但是一定要发挥出东西。再便宜的东西放在那里，它也浪费钱。',
    source: '刘爸爸｜九江',
    color: '#F0B429',
  },
];

const PAIN_QUOTES = [
  {
    label: '能不能坚持',
    text: '会不会看一会就不看了？',
    source: '叶妈妈｜杭州',
    color: '#FF4D8B',
  },
  {
    label: '能不能适应',
    text: '主要担忧是小孩不适应这个课，买了浪费。',
    source: '黄妈妈｜广州',
    color: '#5B8FED',
  },
  {
    label: '有没有效果',
    text: '花这么多钱不一定见到提分效果吧，高中有效果再买吧。',
    source: '施爸爸｜镇江',
    color: '#FF6B3D',
  },
  {
    label: '未来会不会更好',
    text: '这个涵盖的跨度时间太长，不确定性比较高，我不确定后面会不会有别的更好的替代。',
    source: '未购用户｜学龄前&3年级',
    color: '#3DBFBF',
  },
];

const ACTIONS = [
  {
    title: '先证明“现在马上能用”',
    text: '从主孩当前最紧迫的学习任务切入，讲清暑假预习、升学衔接或同步补弱怎么落地。',
    quote: '我还是以哥哥的标准来推荐，就是暑假预习初中，还有一个思维拓展。',
  },
  {
    title: '再画出“未来怎么接上”',
    text: '把不同孩子、不同学段和 6 年权益画成家庭学习路线，让长期权益不再抽象。',
    quote: '希望他俩一起用，都要发挥最大的功效，要把我花的钱大部分学过来。',
  },
  {
    title: '持续给出“学了有效”的证据',
    text: '用试听反馈、学习时长、知识点掌握、错题和阶段报告，降低买了不用与效果不可见的风险。',
    quote: '不确定孩子学得到底怎么样，如果后面好，我肯定会一次性投入。',
  },
];

function AudioEvidence({ quote }: { quote: string }) {
  const clips = clipsForQuote(quote);
  if (clips.length === 0) return null;
  return <EvidenceAudioClips clips={clips} className="jtb-v2-audio" />;
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

export default function JiatingbaoConclusionsV2() {
  const pageRef = React.useRef<HTMLDivElement>(null);
  const sectionRefs = React.useRef<Array<HTMLElement | null>>([]);
  const [activeChapter, setActiveChapter] = React.useState(0);
  const [progress, setProgress] = React.useState(0);
  const [activePersona, setActivePersona] = React.useState(PERSONA_CARDS[0].id);

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
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add('is-visible');
        });
      },
      { root: scrollRoot, threshold: 0.08 },
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
      { root: scrollRoot, threshold: [0.2, 0.45, 0.7] },
    );
    sectionRefs.current.forEach((section) => section && chapterObserver.observe(section));

    return () => {
      scrollRoot.removeEventListener('scroll', updateProgress);
      revealObserver.disconnect();
      chapterObserver.disconnect();
    };
  }, []);

  const currentPersona = PERSONA_CARDS.find((persona) => persona.id === activePersona) ?? PERSONA_CARDS[0];

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
          <div className="jtb-v2-hero-tag">洋葱学园 · 家庭包用户研究 · 2026</div>
          <h1>家庭包<span>用户调研</span></h1>
          <p className="jtb-v2-hero-sub">家长不是在买 6 年课程，而是在买「未来不被动」</p>
          <p className="jtb-v2-hero-desc">11 组家庭访谈，4 类典型画像，<br />一套让高客单价成立的风险消解机制</p>
          <div className="jtb-v2-stats">
            <div><strong>11</strong><span>访谈家庭</span></div>
            <div><strong>4</strong><span>典型画像</span></div>
            <div><strong>6</strong><span>年长期权益</span></div>
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
            <p>01 · 真实动机</p>
            <h2>家长说「想让两个孩子都能用」<br /><span>真正要的是「未来不被动」</span></h2>
            <div>家庭包从来不是先以“全家共享”进入心智，而是先解决某个孩子眼前最具体的学习任务。</div>
          </header>

          <div className="jtb-v2-bubbles">
            {MOTIVATION_QUOTES.map((item, index) => (
              <article key={item.source} className={`jtb-v2-bubble ${index % 2 ? 'is-right' : ''} jtb-v2-reveal`}>
                <div className="jtb-v2-avatar" style={{ background: item.color }}>{item.avatar}</div>
                <div className="jtb-v2-message">
                  <span style={{ background: item.color }}>{item.label}</span>
                  <p>「{item.text}」</p>
                  <small>— {item.source}</small>
                  <AudioEvidence quote={item.text} />
                </div>
              </article>
            ))}
          </div>

          <div className="jtb-v2-tension jtb-v2-reveal">
            <div>
              <b>🎯</b><small>真正触发购买的</small>
              <strong>主孩当下有明确任务</strong>
              <p>小升初、同步补弱、提前预习，决定家长为什么现在就要解决。</p>
            </div>
            <ArrowRight />
            <div>
              <b>🏠</b><small>让长期包成立的</small>
              <strong>另一个孩子未来能接上</strong>
              <p>次孩不一定触发购买，但会改变“值不值”和“会不会浪费”的判断。</p>
            </div>
          </div>

          <div className="jtb-v2-insight jtb-v2-insight-teal jtb-v2-reveal">
            <span>研究发现</span>
            <p>家庭包的核心公式不是“多孩 + 6 年”，而是<strong>当前孩子马上能用 + 另一个孩子未来能接上 + 比未来补课更省心</strong>。</p>
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
        <div className="jtb-v2-wrap">
          <header className="jtb-v2-chapter jtb-v2-reveal">
            <p>02 · 成交机制</p>
            <h2>四类家庭，四种不同的入场方式<br /><span className="is-yellow">但都在寻找同一种确定性</span></h2>
            <div>切换画像查看成交逻辑。家庭结构只是表象，真正决定怎么卖的是家长的底层动机。</div>
          </header>

          <div className="jtb-v2-tabs jtb-v2-reveal">
            {PERSONA_CARDS.map((persona) => (
              <button
                key={persona.id}
                type="button"
                className={activePersona === persona.id ? 'is-active' : ''}
                style={activePersona === persona.id ? { background: persona.color, borderColor: persona.color } : undefined}
                onClick={() => setActivePersona(persona.id)}
              >
                {persona.tab}
              </button>
            ))}
          </div>

          <article className="jtb-v2-persona-card jtb-v2-reveal" style={{ '--persona-color': currentPersona.color } as React.CSSProperties}>
            <div className="jtb-v2-persona-head">
              <i />
              <div><small>当前画像</small><h3>{currentPersona.title}</h3></div>
              <span>{currentPersona.tab}</span>
            </div>
            <div className="jtb-v2-persona-signal">
              <small>销售最该识别的信号</small>
              <strong>{currentPersona.signal}</strong>
            </div>
            <p className="jtb-v2-persona-reason">{currentPersona.reason}</p>
            <blockquote>
              「{currentPersona.quote}」
              <small>— {currentPersona.source}</small>
              <AudioEvidence quote={currentPersona.quote} />
            </blockquote>
          </article>

          <div className="jtb-v2-insight jtb-v2-insight-yellow jtb-v2-reveal">
            <span>跨画像共同机制</span>
            <p>高客单价不是靠堆卖点说服，而是靠<strong>找到一个家长愿意相信的理由</strong>：孩子会用、权益不浪费、未来补救更贵。</p>
          </div>
        </div>
      </section>

      <Wave from="#F7F5EF" to="#FEFDF9" />

      <section
        ref={(node) => {
          sectionRefs.current[3] = node;
        }}
        className="jtb-v2-section jtb-v2-bg-paper"
      >
        <div className="jtb-v2-wrap">
          <div className="jtb-v2-blob jtb-v2-blob-rose" />
          <header className="jtb-v2-chapter jtb-v2-reveal">
            <p>03 · 共性顾虑</p>
            <h2><span className="is-rose">6 年权益</span>，三层共同的不确定</h2>
            <div>家长不是看不懂家庭包的覆盖范围，而是无法确认今天的投入能否在未来持续兑现。</div>
          </header>

          <div className="jtb-v2-big-pain jtb-v2-reveal">
            <span>跨家庭共性卡点</span>
            <strong>「不是单纯嫌贵，<br />而是不知道买了会不会用、用了有没有效果」</strong>
            <small>下面的原声来自已购与未购家庭</small>
          </div>

          <div className="jtb-v2-quote-wall">
            {PAIN_QUOTES.map((item) => (
              <blockquote key={item.text} className="jtb-v2-reveal">
                <strong style={{ color: item.color }}>{item.label}</strong>
                <p>「{item.text}」</p>
                <small>— {item.source}</small>
                <AudioEvidence quote={item.text} />
              </blockquote>
            ))}
          </div>

          <div className="jtb-v2-pain-tags jtb-v2-reveal">
            <span>孩子坚持不了</span><span>长期效果看不见</span><span>未来出现更好选择</span>
            <span>平台与课程能否持续</span><span>先买短包验证更安全</span>
          </div>

          <div className="jtb-v2-insight jtb-v2-insight-rose jtb-v2-reveal">
            <span>关键发现</span>
            <p>未购不是没有需求，而是家长用<strong>“先买短期课试试”</strong>来对抗长期不确定。家庭包真正的对手，是更容易验证的小步决策。</p>
          </div>
        </div>
      </section>

      <Wave from="#FEFDF9" to="#FFF8F0" flip />

      <section
        ref={(node) => {
          sectionRefs.current[4] = node;
        }}
        className="jtb-v2-section jtb-v2-bg-warm"
      >
        <div className="jtb-v2-wrap">
          <header className="jtb-v2-chapter jtb-v2-reveal">
            <p>04 · 机会人群</p>
            <h2>不要先问“是不是多孩”<br /><span>先问“谁现在必须解决问题”</span></h2>
            <div>主孩需求决定成交，次孩权益合理化价格。年级组合决定有没有机会，底层动机决定怎么推进。</div>
          </header>

          <blockquote className="jtb-v2-feature-quote jtb-v2-reveal">
            <span>✦ 真实用户反馈</span>
            <p>「主要考虑的是哥哥，妹妹顺带着用；但如果没有妹妹的权益，可能就会买个短期课。」</p>
            <small>— 黄妈妈｜广州｜家庭包购买机制的典型表达</small>
            <AudioEvidence quote="主要考虑的是哥哥，妹妹顺带着用；但如果没有妹妹的权益，可能就会买个短期课，不会买家庭包了。" />
          </blockquote>

          <div className="jtb-v2-opportunity jtb-v2-reveal">
            <h3>家庭包最值得优先转化的，不是“孩子最多”的家庭，<br /><span>而是当下需求强、未来权益能接续、家长又能看见长期价值的家庭。</span></h3>
            <p>销售先识别升学窗口、自主学习能力、大孩经验迁移和资源预置动机，再决定讲衔接、成长、避坑还是家庭资源库。</p>
          </div>

          <div className="jtb-v2-pillars">
            <article className="jtb-v2-reveal"><b>🎯</b><strong>马上能用</strong><p>主孩有明确任务，家庭包先解决今天的问题。</p></article>
            <article className="jtb-v2-reveal"><b>🔗</b><strong>未来接上</strong><p>另一个孩子能承接权益，长期覆盖才不浪费。</p></article>
            <article className="jtb-v2-reveal"><b>📈</b><strong>持续有效</strong><p>学习过程和阶段结果可见，家长才敢长期投入。</p></article>
          </div>

          <div className="jtb-v2-honest jtb-v2-reveal">
            <span><ShieldAlert size={16} /> 同时：不能被“性价比”掩盖的风险</span>
            <p>内容再多、孩子数量再多，如果孩子不用或家长看不到效果，长期包依然会被判断为浪费。</p>
          </div>
        </div>
      </section>

      <Wave from="#FFF8F0" to="#F7F5EF" />

      <section
        ref={(node) => {
          sectionRefs.current[5] = node;
        }}
        className="jtb-v2-section jtb-v2-bg-soft"
      >
        <div className="jtb-v2-wrap">
          <header className="jtb-v2-chapter jtb-v2-reveal">
            <p>05 · 下一步</p>
            <h2>还差最后一步<br /><span className="is-teal">把 6 年确定性变成看得见的证据</span></h2>
            <div>家庭包已经具备覆盖和性价比优势，下一步要把“为什么现在买、未来怎么用、效果如何验证”串成一条完整链路。</div>
          </header>

          <div className="jtb-v2-actions">
            {ACTIONS.map((action, index) => (
              <article key={action.title} className="jtb-v2-reveal">
                <span>{index + 1}</span>
                <div>
                  <h3>{action.title}</h3>
                  <p>{action.text}</p>
                  <blockquote>「{action.quote}」</blockquote>
                  <AudioEvidence quote={action.quote} />
                </div>
              </article>
            ))}
          </div>

          <div className="jtb-v2-final jtb-v2-reveal">
            <Sparkles size={22} />
            <p>家庭包不是一次性卖出 6 年内容，<br /><strong>而是持续证明：今天买得对，明天用得上，未来不会浪费。</strong></p>
          </div>

          <div className="jtb-v2-summary-grid jtb-v2-reveal">
            <div><Target /><strong>识别</strong><span>先找主孩的当下任务</span></div>
            <div><Lightbulb /><strong>解释</strong><span>再画多孩的接续路径</span></div>
            <div><Check /><strong>验证</strong><span>持续外化学习过程</span></div>
          </div>
        </div>
      </section>

      <footer className="jtb-v2-footer">
        <span>⭐</span>
        <strong>洋葱学园 · 用户研究团队</strong>
        <p>家庭包用户购买决策研究 · 2026 · 内部资料</p>
      </footer>
    </div>
  );
}
