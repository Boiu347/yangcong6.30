import React from 'react';
import {
  ArrowDown,
  ArrowRight,
  BookOpen,
  Check,
  CircleAlert,
  ExternalLink,
  FileText,
  Headphones,
  Quote,
  Sparkles,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import EvidenceAudioClips from '@/components/EvidenceAudioClips';
import { clipsForQuote } from '@/utils/sourceUtils';
import './JiatingbaoConclusionsV3.css';

const SOURCE_URL = 'https://guanghe.feishu.cn/wiki/HLzew9x1gisyRhkNbfmccO5En4b';

const DECISION_STEPS = [
  {
    no: '01',
    eyebrow: '当下成立',
    title: '一个孩子\n马上能用',
    detail: '小升初衔接、成绩补弱，或在问题发生前提前打底。',
  },
  {
    no: '02',
    eyebrow: '长期合理',
    title: '另一个孩子\n未来能接上',
    detail: '次孩不一定触发购买，却决定家长愿不愿意买 6 年。',
  },
  {
    no: '03',
    eyebrow: '风险反推',
    title: '分开买\n更贵更麻烦',
    detail: '把线下补课、重复购课和反复续费放进同一本账。',
  },
];

const BARRIERS = [
  {
    no: '01',
    title: '会不会坚持？',
    body: '周期越长，家长越担心“买了不用”。成交用户并非没有顾虑，而是找到了孩子自律、主动试听或熟人背书等信任理由。',
    quote: '会不会看一会就不看了？',
    source: '叶妈妈｜杭州｜5年级&高三',
  },
  {
    no: '02',
    title: '学了有没有用？',
    body: '覆盖范围容易理解，长期效果却难以验证。于是家长先买更短的组合品，用一次可见结果换下一次投入。',
    quote: '花这么多钱不一定见到提分效果吧，高中有效果再买吧。',
    source: '施爸爸｜镇江｜4年级&初一',
  },
  {
    no: '03',
    title: '未来会不会有更好的？',
    body: '6 年也意味着更多变化：平台能否持续、课程是否更新、孩子未来是否出现更适合的选择。',
    quote:
      '这个涵盖的跨度时间太长，不确定性比较高，我不确定后面会不会有别的更好的替代。',
    source: '未购用户｜家庭包销售录音',
  },
];

const AUDIENCE_GROUPS = [
  {
    tier: '优先识别',
    combo: '小低 + 初中',
    signal: '大孩解决问题，小孩承接未来',
    body: '初中孩子的学习问题形成主需求；小低孩子未来提前学，让 6 年权益显得确定、不浪费。',
    tone: 'hot',
  },
  {
    tier: '优先识别',
    combo: '小低 + 高中',
    signal: '大孩提供工具，小孩完整使用 6 年',
    body: '高中孩子需要一件自主解决问题的工具，小孩则让跨学段覆盖与长周期价值真正成立。',
    tone: 'hot',
  },
  {
    tier: '重点验证',
    combo: '小高 + 初中 / 高中',
    signal: '小升初窗口强，但效果顾虑仍在',
    body: '“不浪费、内容全、能学到高中”是优势；能否证明学习效果，决定家长是买家庭包还是先买短包。',
    tone: 'warm',
  },
  {
    tier: '条件机会',
    combo: '小低 + 小高',
    signal: '能学满 6 年，也最容易被替代',
    body: '如果小高存在“提前学 + 学到高中”的明确诉求，家庭包才比小学品、小初品更有说服力。',
    tone: 'warm',
  },
  {
    tier: '新增潜力',
    combo: '单孩小高 / 双小高',
    signal: '权益不浪费，覆盖更完整',
    body: '单孩小高不存在其他学段“用不了”的浪费感；双小高则让同一套长期权益的价值翻倍。',
    tone: 'cool',
  },
  {
    tier: '新增潜力',
    combo: '三孩跨学段',
    signal: '至少两个可用学段，权益 × 3',
    body: '人数不是唯一理由，但当真实需求覆盖两个以上学段，家庭包的稀缺性会显著上升。',
    tone: 'cool',
  },
];

const PLAYBOOK = [
  ['0', '先判断家庭中的学生个数，以及主需求发生在哪个孩子身上。'],
  ['1', '先讲当前孩子现在怎么用：什么问题、哪些内容、哪个节点马上能用。'],
  ['2', '再讲另一个孩子未来如何接上，把“暂时用不上”改写为“确定会用”。'],
  ['3', '最后算风险账：分开买、未来补课、反复选课续费，是否更贵更麻烦。'],
];

function SourceLink({ compact = false }: { compact?: boolean }) {
  return (
    <a
      href={SOURCE_URL}
      target="_blank"
      rel="noreferrer"
      className={`jtb-v3-source-link ${compact ? 'is-compact' : ''}`}
    >
      <FileText size={14} />
      飞书原始研究资料
      <ExternalLink size={12} />
    </a>
  );
}

function VoiceQuote({ quote, source }: { quote: string; source: string }) {
  const clips = clipsForQuote(quote);
  return (
    <blockquote className="jtb-v3-voice">
      <Quote size={15} />
      <p>“{quote}”</p>
      <footer>— {source}</footer>
      {clips.length > 0 && (
        <EvidenceAudioClips clips={clips} className="jtb-v3-audio" />
      )}
    </blockquote>
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

        gsap.set(progress, { transformOrigin: 'left center' });
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

        if (!motionSafe) return;

        const hero = gsap.timeline({ defaults: { ease: 'power3.out' } });
        hero
          .from('[data-v3-hero-kicker]', {
            autoAlpha: 0,
            y: 16,
            duration: 0.45,
          })
          .from(
            '[data-v3-hero-line]',
            { autoAlpha: 0, y: 42, rotateX: -8, duration: 0.75, stagger: 0.09 },
            '-=0.2',
          )
          .from(
            '[data-v3-hero-copy]',
            { autoAlpha: 0, y: 18, duration: 0.55, stagger: 0.08 },
            '-=0.35',
          )
          .from(
            '[data-v3-family-node]',
            { autoAlpha: 0, scale: 0.8, y: 18, duration: 0.5, stagger: 0.1 },
            '-=0.35',
          )
          .from(
            '[data-v3-family-line]',
            { scaleX: 0, duration: 0.45, stagger: 0.08 },
            '-=0.25',
          );

        const formulaSection =
          page.querySelector<HTMLElement>('[data-v3-formula]');
        if (formulaSection) {
          gsap
            .timeline({
              scrollTrigger: {
                scroller,
                trigger: formulaSection,
                start: 'top 72%',
                once: true,
              },
              defaults: { ease: 'power3.out' },
            })
            .from('[data-v3-formula-rule]', { scaleX: 0, duration: 0.65 })
            .from(
              '[data-v3-formula-card]',
              { autoAlpha: 0, y: 34, duration: 0.62, stagger: 0.13 },
              '-=0.35',
            )
            .from(
              '[data-v3-formula-result]',
              { autoAlpha: 0, scale: 0.9, duration: 0.5 },
              '-=0.15',
            );
        }

        gsap.utils
          .toArray<HTMLElement>('[data-v3-reveal]', page)
          .forEach((element) => {
            gsap.from(element, {
              autoAlpha: 0,
              y: 28,
              duration: 0.66,
              ease: 'power3.out',
              scrollTrigger: {
                scroller,
                trigger: element,
                start: 'top 84%',
                once: true,
              },
            });
          });

        gsap.from('[data-v3-audience-card]', {
          autoAlpha: 0,
          y: 30,
          duration: 0.62,
          ease: 'power3.out',
          stagger: 0.08,
          scrollTrigger: {
            scroller,
            trigger: '[data-v3-audience-grid]',
            start: 'top 78%',
            once: true,
          },
        });

        const refreshId = window.requestAnimationFrame(() =>
          ScrollTrigger.refresh(),
        );
        return () => window.cancelAnimationFrame(refreshId);
      },
      page,
    );

    return () => media.revert();
  }, []);

  const scrollToDecision = () => {
    pageRef.current
      ?.querySelector('#jtb-v3-decision')
      ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <main ref={pageRef} className="jtb-v3">
      <div ref={progressRef} className="jtb-v3-progress" />

      <section className="jtb-v3-hero">
        <div className="jtb-v3-hero-grid">
          <div className="jtb-v3-hero-copy">
            <div data-v3-hero-kicker className="jtb-v3-kicker">
              <Sparkles size={15} />
              家庭包用户购买决策洞察 · 结论速览 V3
            </div>
            <h1 aria-label="家长不是在为家庭买课">
              <span data-v3-hero-line>家长不是在</span>
              <span data-v3-hero-line>为“家庭”买课</span>
              <span data-v3-hero-line className="is-accent">
                而是先解决一个孩子
              </span>
              <span data-v3-hero-line className="is-accent">
                眼前的问题。
              </span>
            </h1>
            <p data-v3-hero-copy className="jtb-v3-hero-summary">
              当主孩的需求足够明确，另一个孩子的未来权益又能接上， 6
              年家庭包才从“高价长包”变成一笔值得的长期安排。
            </p>
            <div data-v3-hero-copy className="jtb-v3-hero-actions">
              <button type="button" onClick={scrollToDecision}>
                开始阅读 <ArrowDown size={16} />
              </button>
              <SourceLink compact />
            </div>
          </div>

          <div className="jtb-v3-family-diagram" aria-hidden="true">
            <span className="jtb-v3-diagram-label">一笔家庭账</span>
            <div data-v3-family-node className="jtb-v3-person is-main">
              <b>大孩</b>
              <span>当下刚需</span>
            </div>
            <i data-v3-family-line className="jtb-v3-connect is-a" />
            <div data-v3-family-node className="jtb-v3-person is-second">
              <b>小孩</b>
              <span>未来接上</span>
            </div>
            <i data-v3-family-line className="jtb-v3-connect is-b" />
            <div data-v3-family-node className="jtb-v3-package">
              <BookOpen size={24} />
              <b>家庭包</b>
              <span>6 年 · 跨学段</span>
            </div>
            <div className="jtb-v3-orbit" />
          </div>
        </div>
        <div className="jtb-v3-hero-note">
          <Headphones size={14} />
          <span>研究中的真实判断：</span>
          “主要考虑哥哥，妹妹顺带着用；但如果没有妹妹的权益，可能就会买个短期课。”
        </div>
      </section>

      <section
        id="jtb-v3-decision"
        className="jtb-v3-section jtb-v3-paper"
        data-v3-formula
      >
        <header className="jtb-v3-section-head" data-v3-reveal>
          <p>CHAPTER 01 / 购买为什么成立</p>
          <h2>
            家庭包成立，不靠一个卖点。
            <br />
            靠三件事同时为真。
          </h2>
          <span>三者缺一不可：先解决今天，再证明未来，最后算清风险账。</span>
        </header>

        <div className="jtb-v3-formula-rule" data-v3-formula-rule />
        <div className="jtb-v3-formula-grid">
          {DECISION_STEPS.map((step, index) => (
            <React.Fragment key={step.no}>
              <article data-v3-formula-card className="jtb-v3-formula-card">
                <div>
                  <span>{step.no}</span>
                  {step.eyebrow}
                </div>
                <h3>
                  {step.title.split('\n').map((line) => (
                    <React.Fragment key={line}>
                      {line}
                      <br />
                    </React.Fragment>
                  ))}
                </h3>
                <p>{step.detail}</p>
              </article>
              {index < DECISION_STEPS.length - 1 && (
                <span className="jtb-v3-plus">+</span>
              )}
            </React.Fragment>
          ))}
        </div>

        <div data-v3-formula-result className="jtb-v3-formula-result">
          <span>=</span>
          <div>
            <small>最终感知</small>
            <strong>不是便宜，而是值得。</strong>
          </div>
        </div>

        <div className="jtb-v3-quote-stage" data-v3-reveal>
          <p>最有说服力的，不是把 6 年均摊成每天多少钱。</p>
          <VoiceQuote
            quote="不想等出现问题的时候再来，到那个时候再赶，可能就真的只能跟着线下老师去补习班了。"
            source="刘爸爸｜九江｜1年级&6年级"
          />
        </div>
      </section>

      <section className="jtb-v3-section jtb-v3-dark">
        <header className="jtb-v3-section-head is-light" data-v3-reveal>
          <p>CHAPTER 02 / 为什么没有成交</p>
          <h2>
            真正拦住下单的，
            <br />
            不是价格，是“不确定”。
          </h2>
          <span>
            家长只愿为看得见的问题与可验证的效果付费，所以短包成了更安全的试错。
          </span>
        </header>

        <div className="jtb-v3-barrier-list">
          {BARRIERS.map((barrier) => (
            <article key={barrier.no} className="jtb-v3-barrier" data-v3-reveal>
              <div className="jtb-v3-barrier-index">{barrier.no}</div>
              <div className="jtb-v3-barrier-copy">
                <h3>{barrier.title}</h3>
                <p>{barrier.body}</p>
              </div>
              <VoiceQuote quote={barrier.quote} source={barrier.source} />
            </article>
          ))}
        </div>

        <aside className="jtb-v3-dark-answer" data-v3-reveal>
          <CircleAlert size={22} />
          <div>
            <small>问题的转译</small>
            <strong>家庭包要证明的不是“长期有效”，而是“长期过程可见”。</strong>
          </div>
        </aside>
      </section>

      <section className="jtb-v3-section jtb-v3-map">
        <header className="jtb-v3-section-head" data-v3-reveal>
          <p>CHAPTER 03 / 机会人群地图</p>
          <h2>
            不要先找“多孩家庭”。
            <br />
            先找需求能接力的家庭。
          </h2>
          <span>
            该地图用于识别二胎及多孩家庭的机会潜力，不直接等同于最终推课方案。
          </span>
        </header>

        <div className="jtb-v3-legend" data-v3-reveal>
          <span>
            <i className="is-hot" />
            需求已形成
          </span>
          <span>
            <i className="is-warm" />
            需要补足确定性
          </span>
          <span>
            <i className="is-cool" />
            新增潜力
          </span>
        </div>

        <div className="jtb-v3-audience-grid" data-v3-audience-grid>
          {AUDIENCE_GROUPS.map((group) => (
            <article
              key={group.combo}
              data-v3-audience-card
              className={`jtb-v3-audience-card is-${group.tone}`}
            >
              <div className="jtb-v3-audience-meta">
                <span>{group.tier}</span>
                <small>{group.signal}</small>
              </div>
              <h3>{group.combo}</h3>
              <p>{group.body}</p>
              <div className="jtb-v3-card-arrow">
                <ArrowRight size={18} />
              </div>
            </article>
          ))}
        </div>

        <div className="jtb-v3-map-conclusion" data-v3-reveal>
          <span>机会判断</span>
          <p>
            学段组合只是入口，真正决定转化的是：
            <b>一个需求够不够急，另一个需求能不能确定接上。</b>
          </p>
        </div>
      </section>

      <section className="jtb-v3-section jtb-v3-playbook">
        <header className="jtb-v3-section-head" data-v3-reveal>
          <p>EPILOGUE / 从洞察到表达</p>
          <h2>一次更有顺序的家庭包沟通。</h2>
        </header>

        <div className="jtb-v3-playbook-list">
          {PLAYBOOK.map(([no, text]) => (
            <div key={no} className="jtb-v3-playbook-row" data-v3-reveal>
              <span>{no}</span>
              <Check size={18} />
              <p>{text}</p>
            </div>
          ))}
        </div>

        <div className="jtb-v3-next" data-v3-reveal>
          <div>
            <small>NEXT CHAPTER</small>
            <h3>
              结论看完，去认识
              <br />
              这些判断背后的真实家庭。
            </h3>
            <p>4 个典型家庭，分别对应最值得识别和转化的 4 类机会人群。</p>
          </div>
          <button
            type="button"
            onClick={() =>
              navigate('/projects/jiatingbao_project/family-stories')
            }
          >
            查看典型家庭故事 <ArrowRight size={18} />
          </button>
        </div>

        <footer className="jtb-v3-footer">
          <SourceLink />
          <span>内容取自飞书《家庭包用户购买决策洞察》主页面 2 / 3</span>
        </footer>
      </section>
    </main>
  );
}
