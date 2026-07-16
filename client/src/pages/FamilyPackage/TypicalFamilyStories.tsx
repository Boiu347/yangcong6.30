import React from 'react';
import { motion } from 'motion/react';
import {
  AlertTriangle,
  BookOpenCheck,
  CheckCircle2,
  ClipboardList,
  Lightbulb,
  Quote,
  Sparkles,
  Target,
  UserRound,
  Users,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { JTB_INTERVIEWS, type JtbInterview, type JtbOnion } from '@/store/jiatingbaoData';

const INK = '#292521';
const MUTED = '#746E67';

const reveal = {
  initial: { opacity: 0, y: 18 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-48px' },
  transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] as const },
};

type FamilyProfile = {
  id: string;
  interviewId: string;
  index: string;
  accent: string;
  name: string;
  keyword: string;
  profile: {
    feature: string;
    motive: string;
    reason: string;
    concern: string;
    representatives: string;
  };
  story: {
    banner: string;
    coreFeature: string;
    businessInsight: string;
  };
};

// 四类画像原文来自《家庭包用户购买决策洞察》“家庭包推课逻辑—要怎么推”。
// 代表家庭的学情、洞察、购买过程和原声直接读取 JTB_INTERVIEWS，不做二次改写。
const FAMILY_PROFILES: FamilyProfile[] = [
  {
    id: 'transition-window',
    interviewId: 'jtb_u1',
    index: '01',
    accent: '#C9622E',
    name: '小升初窗口驱动型',
    keyword: '升学触发',
    profile: {
      feature: '年级在小升初前后（5/6/7 年级），购买由某个孩子明确学习问题触发。',
      motive: '兼顾同步复习小学 + 提前学初中。',
      reason: '升学孩子的紧迫问题给购买理由，另一孩子权益让高客单不浪费。',
      concern: '提分效果不确定时，会退而买更短更便宜的方案。',
      representatives: 'P1 广州黄妈妈、P5 杭州叶妈妈、P6 镇江施爸爸。',
    },
    story: {
      banner: '代表案例：广东广州黄妈妈 —— 两个孩子都有需求，但家长更偏向让「好的更好」',
      coreFeature: '大孩强需求成交（小升初衔接），小孩权益负责把高客单价合理化，二者缺一不可。',
      businessInsight: '对「小高 + 小低」组合，应先抓大孩「紧急 + 重要」的升学，二孩打基础需求作为锦上添花。',
    },
  },
  {
    id: 'self-driven',
    interviewId: 'jtb_u2',
    index: '02',
    accent: '#3F5E8C',
    name: '拔尖自驱超前学型',
    keyword: '自主学习',
    profile: {
      feature: '成绩优秀（小学 95、初中 110+），已在 / 计划提前学。',
      motive: '需要覆盖初中 + 高中的同步、拔高资源。',
      reason: '下阶段内容现在就用得上、比单买划算、能支撑长期自主学习。',
      concern: '孩子是否一时兴起、能否适应录播、长期包会不会浪费。',
      representatives: 'P1 广州黄妈妈、P2 景德镇王妈妈。',
    },
    story: {
      banner: '代表案例：景德镇王妈妈 —— 孩子自己想往前学，家长才敢一次买到高中',
      coreFeature: '家长购买家庭包，是在支持一个自律、主动、愿意提前学的孩子；孩子的长期使用确定性，降低了家庭包的浪费风险。',
      businessInsight: '对这类家庭，最应该突出的是“孩子已经准备好了，这套资源能跟上她”（如：课程能否支持孩子自主学习、能否从初中自然接到高中、能否让孩子按自己的节奏往前走等）。',
    },
  },
  {
    id: 'experience-transfer',
    interviewId: 'jtb_u3',
    index: '03',
    accent: '#2F8272',
    name: '大孩经验迁移型',
    keyword: '经验复制',
    profile: {
      feature: '多胎隔段（初高中 + 小学），对辅导班态度中立 / 负面。',
      motive: '首购多由大孩中考复习触发，续购转向为小孩长期准备。',
      reason: '家庭包被看作提前准备、替代线下补课的方案。',
      concern: '会不会像老大一样买了没用起来、学情报告能否让家长持续看到效果。',
      representatives: 'P3 合肥张妈妈、P5 杭州叶妈妈。',
    },
    story: {
      banner: '代表案例：安徽合肥张妈妈 —— 两个孩子有主次，会在节点转化',
      coreFeature: '尽管希望都兼顾，但两个孩子有主次之分（初中 > 小学 > 高中），且会在特定节点发生需求转化。',
      businessInsight: '小学 + 初中二胎家庭有成功 / 踩坑经验，可借鉴到二孩；「提前学」是机会切口，学习能力需长期培养。',
    },
  },
  {
    id: 'resource-reserve',
    interviewId: 'jtb_u4',
    index: '04',
    accent: '#9A6B2F',
    name: '资源预置囤课型',
    keyword: '长期预置',
    profile: {
      feature: '关注“能学到高中 / 高考”“多个孩子都能用”。',
      motive: '没有明确学业危机，但希望提前备着。',
      reason: '性价比高（学到高中、多孩可用、分开买更麻烦）+ 内容资源丰富（像图书馆先放好）。',
      concern: '能否学到高中不浪费、时间太长孩子能否坚持、学情报告能否持续可见。',
      representatives: 'P3 合肥张妈妈、P4 九江刘爸爸、P5 杭州叶妈妈。',
    },
    story: {
      banner: '代表案例：江西九江刘爸爸 —— 精打细算，注重性价比',
      coreFeature: '希望 2 个孩子同时用到极致。基础要求：孩子愿意看；进阶要求：理科全学好；理想要求：2 个孩子全科覆盖学好。',
      businessInsight: '高消费、高风险下，核心命题是如何用孩子的持续使用、可信推荐与明确的多人使用规则打消顾虑。',
    },
  },
];

const ONION_SECTIONS: Array<{ key: keyof JtbOnion; label: string }> = [
  { key: 'cognition', label: '认知' },
  { key: 'understanding', label: '了解与比较' },
  { key: 'purchase', label: '购买决策' },
  { key: 'usage', label: '实际使用' },
  { key: 'expectation', label: '使用预期' },
  { key: 'feedback', label: '反馈与建议' },
];

function soft(color: string) {
  return `${color}12`;
}

function getInterview(id: string): JtbInterview {
  const interview = JTB_INTERVIEWS.find((item) => item.id === id);
  if (!interview) throw new Error(`Missing family interview: ${id}`);
  return interview;
}

export default function TypicalFamilyStories() {
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const sectionRefs = React.useRef<Record<string, HTMLElement | null>>({});
  const [activeId, setActiveId] = React.useState(FAMILY_PROFILES[0].id);
  const activeProfile = FAMILY_PROFILES.find((profile) => profile.id === activeId) ?? FAMILY_PROFILES[0];

  React.useEffect(() => {
    const root = scrollRef.current;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target instanceof HTMLElement && visible.target.dataset.id) {
          setActiveId(visible.target.dataset.id);
        }
      },
      { root, rootMargin: '-45% 0px -45% 0px', threshold: [0, 0.2, 0.5, 1] },
    );
    Object.values(sectionRefs.current).forEach((element) => element && observer.observe(element));
    return () => observer.disconnect();
  }, []);

  const jumpTo = (id: string) => {
    sectionRefs.current[id]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="flex h-full flex-col bg-[#f8f8f5]">
      <div ref={scrollRef} className="min-h-0 flex-1 overflow-y-auto">
        <div className="sticky top-0 z-20 border-b border-[#e4e2da] bg-white/95 px-5 py-3 backdrop-blur md:px-8">
          <div className="mx-auto max-w-[980px]">
            <div className="flex items-center gap-2" style={{ color: activeProfile.accent }}>
              <Sparkles size={15} />
              <span className="text-[11px] font-black tracking-[0.14em]">用户画像与典型家庭故事 · 家庭包购买决策</span>
            </div>
            <div className="mt-2.5 flex flex-wrap gap-1.5">
              {FAMILY_PROFILES.map((profile) => {
                const active = profile.id === activeId;
                return (
                  <button
                    key={profile.id}
                    onClick={() => jumpTo(profile.id)}
                    className={cn(
                      'flex items-center gap-1.5 rounded-xl px-3 py-2 text-[12.5px] font-bold transition-all',
                      active ? 'text-white shadow-sm' : 'bg-[#f4f1eb] text-[#6b655c] hover:bg-[#eee9e0]',
                    )}
                    style={active ? { background: profile.accent } : undefined}
                  >
                    <span className="text-[10px] font-black" style={!active ? { color: profile.accent } : undefined}>{profile.index}</span>
                    {profile.name}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-[980px] px-5 pb-10 md:px-8">
          <motion.header {...reveal} className="border-b border-[#e4e2da] py-9">
            <div className="flex items-center gap-2 text-[#e65532]">
              <Users size={17} />
              <span className="text-[11px] font-black tracking-[0.14em]">04 PERSONAS · 04 FAMILY STORIES</span>
            </div>
            <h1 className="mt-2 text-2xl font-black md:text-3xl" style={{ color: INK }}>用户画像与典型家庭故事</h1>
            <p className="mt-3 max-w-3xl text-[14px] font-medium leading-7" style={{ color: MUTED }}>
              四类画像按家长“做决策的底层动机”划分。同一家长可能同时具备多种特征，但每类代表一种不同的购买机制；每类选择一户代表家庭，还原真实访谈内容。
            </p>
          </motion.header>

          {FAMILY_PROFILES.map((profile) => (
            <article
              key={profile.id}
              data-id={profile.id}
              ref={(element) => { sectionRefs.current[profile.id] = element; }}
              className="scroll-mt-24 border-b border-[#e4e2da] py-10 last:border-0"
            >
              <ProfileAndStory profile={profile} interview={getInterview(profile.interviewId)} />
            </article>
          ))}

          <p className="mt-10 rounded-xl border border-[#e4e2da] bg-[#f4f2ec] p-4 text-[11px] leading-5" style={{ color: MUTED }}>
            数据来源：《家庭包用户购买决策洞察》四类购买用户画像，以及家庭包用户深度访谈原始记录。页面仅做结构化排版，学情、洞察、购买过程和用户原声均保留资料原文。
          </p>
        </div>
      </div>
    </div>
  );
}

function SectionHeader({ icon: Icon, label, subtitle, accent }: {
  icon: React.ComponentType<{ size?: number }>;
  label: string;
  subtitle: string;
  accent: string;
}) {
  return (
    <div className="flex items-start gap-3 border-b border-[#e4e2da] pb-3">
      <span className="mt-1 grid h-8 w-8 shrink-0 place-items-center rounded-lg" style={{ background: soft(accent), color: accent }}>
        <Icon size={16} />
      </span>
      <div>
        <h3 className="text-[17px] font-black" style={{ color: INK }}>{label}</h3>
        <p className="mt-0.5 text-[12.5px]" style={{ color: MUTED }}>{subtitle}</p>
      </div>
    </div>
  );
}

function ProfileAndStory({ profile, interview }: { profile: FamilyProfile; interview: JtbInterview }) {
  return (
    <>
      <motion.div {...reveal} className="flex items-end gap-3">
        <span className="text-5xl font-black leading-none md:text-6xl" style={{ color: profile.accent }}>{profile.index}</span>
        <div className="pb-1">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-2xl font-black md:text-3xl" style={{ color: INK }}>{profile.name}</h2>
            <span className="rounded px-2 py-0.5 text-[11px] font-black" style={{ background: soft(profile.accent), color: profile.accent }}>{profile.keyword}</span>
          </div>
          <p className="mt-1.5 text-[13px] font-semibold" style={{ color: MUTED }}>代表用户：{profile.profile.representatives}</p>
        </div>
      </motion.div>

      <section className="mt-8">
        <SectionHeader icon={Users} label="用户画像" subtitle={`${profile.name}：特征、动机、成立条件与核心顾虑`} accent={profile.accent} />
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {[
            { icon: UserRound, label: '画像特征', text: profile.profile.feature },
            { icon: Target, label: '购买动机', text: profile.profile.motive },
            { icon: CheckCircle2, label: '家庭包为何成立', text: profile.profile.reason },
            { icon: AlertTriangle, label: '核心顾虑', text: profile.profile.concern },
          ].map(({ icon: Icon, label, text }, index) => (
            <motion.div {...reveal} transition={{ ...reveal.transition, delay: index * 0.04 }} key={label} className="rounded-xl border border-[#e7e5de] bg-white p-5">
              <div className="flex items-center gap-2" style={{ color: profile.accent }}>
                <Icon size={15} />
                <span className="text-[12px] font-black">{label}</span>
              </div>
              <p className="mt-3 text-[13.5px] font-medium leading-7" style={{ color: '#4a453f' }}>{text}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="mt-12">
        <SectionHeader icon={BookOpenCheck} label="典型家庭故事" subtitle="代表家庭的学情、洞察、购买过程与原声" accent="#33302b" />

        <motion.div {...reveal} className="mt-5 rounded-xl px-5 py-5 text-center md:px-8" style={{ background: '#33302b' }}>
          <h3 className="text-[16px] font-black leading-snug text-white md:text-[19px]">{profile.story.banner}</h3>
          <div className="mt-3 flex flex-wrap justify-center gap-2">
            {[interview.combo, interview.status, interview.purchaseType, interview.region].filter(Boolean).map((item) => (
              <span key={item} className="rounded-full border border-white/20 bg-white/10 px-2.5 py-1 text-[11px] font-semibold text-white/85">{item}</span>
            ))}
          </div>
        </motion.div>

        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <motion.div {...reveal} className="rounded-xl border p-5" style={{ borderColor: `${profile.accent}44`, background: soft(profile.accent) }}>
            <div className="flex items-center gap-2" style={{ color: profile.accent }}>
              <Target size={15} />
              <span className="text-[12px] font-black">核心特征</span>
            </div>
            <p className="mt-3 text-[13.5px] font-semibold leading-7" style={{ color: INK }}>{profile.story.coreFeature}</p>
          </motion.div>
          <motion.div {...reveal} className="rounded-xl border border-[#e7e5de] bg-white p-5">
            <div className="flex items-center gap-2 text-[#9A6B2F]">
              <Lightbulb size={15} />
              <span className="text-[12px] font-black">业务启发</span>
            </div>
            <p className="mt-3 text-[13.5px] font-semibold leading-7" style={{ color: INK }}>{profile.story.businessInsight}</p>
          </motion.div>
        </div>

        <div className="mt-7">
          <SectionHeader icon={UserRound} label="家庭与学情" subtitle="访谈记录原文" accent={profile.accent} />
          <ol className="mt-4 space-y-3">
            {interview.study.map((item, index) => (
              <motion.li {...reveal} key={item} className="flex gap-3 rounded-xl border border-[#e7e5de] bg-white p-4">
                <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full text-[10px] font-black text-white" style={{ background: profile.accent }}>{index + 1}</span>
                <p className="text-[13px] leading-7" style={{ color: '#4a453f' }}>{item}</p>
              </motion.li>
            ))}
          </ol>
        </div>

        <div className="mt-7">
          <SectionHeader icon={Lightbulb} label="用研发现与洞察" subtitle="访谈纪要原文" accent={profile.accent} />
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {interview.insights.map((insight) => (
              <motion.div {...reveal} key={insight.title} className="rounded-xl border border-[#e7e5de] bg-white p-5">
                <h4 className="text-[14px] font-black" style={{ color: INK }}>{insight.title}</h4>
                <p className="mt-2 text-[13px] leading-7" style={{ color: '#4a453f' }}>{insight.detail}</p>
                {insight.quote && (
                  <blockquote className="mt-3 flex gap-2 rounded-lg px-3 py-2.5 text-[12.5px] italic leading-6" style={{ background: soft(profile.accent), color: MUTED }}>
                    <Quote size={14} className="mt-1 shrink-0" style={{ color: profile.accent }} />
                    <span>“{insight.quote}”</span>
                  </blockquote>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        <div className="mt-7">
          <SectionHeader icon={ClipboardList} label="从认知到使用" subtitle="购买过程与使用反馈原文" accent={profile.accent} />
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {ONION_SECTIONS.map(({ key, label }) => {
              const items = interview.onion[key];
              if (!items?.length) return null;
              return (
                <motion.div {...reveal} key={key} className="rounded-xl border border-[#e7e5de] bg-white p-5">
                  <h4 className="text-[13px] font-black" style={{ color: profile.accent }}>{label}</h4>
                  <ul className="mt-3 space-y-2">
                    {items.map((item) => (
                      <li key={item} className="flex gap-2 text-[13px] leading-7" style={{ color: '#4a453f' }}>
                        <span className="mt-[11px] h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: profile.accent }} />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              );
            })}
          </div>
        </div>

        <motion.div {...reveal} className="mt-7 rounded-xl border p-5" style={{ borderColor: `${profile.accent}55`, background: soft(profile.accent) }}>
          <div className="flex items-center gap-2" style={{ color: profile.accent }}>
            <Quote size={16} />
            <h4 className="text-[13px] font-black">关键原声</h4>
          </div>
          <div className="mt-3 space-y-2">
            {interview.quotes.map((quote) => (
              <blockquote key={quote} className="border-l-2 pl-3 text-[13px] font-medium italic leading-7" style={{ borderColor: profile.accent, color: '#4a453f' }}>“{quote}”</blockquote>
            ))}
          </div>
        </motion.div>
      </section>
    </>
  );
}
