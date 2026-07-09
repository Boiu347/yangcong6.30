import React from 'react';
import {
  Target,
  ClipboardList,
  Users,
  BarChart3,
  Quote as QuoteIcon,
  Lightbulb,
  Sparkles,
  Eye,
  ShieldCheck,
  Unplug,
} from 'lucide-react';
import { cn } from '@/lib/utils';

// ── 图片资源 ────────────────────────────────────────────────────────────────
const IMG = {
  positioning: '/competitive2/positioning.png',
  grade: '/competitive2/grade.png',
  courseSystem: '/competitive2/course-system.png',
  knowledge: '/competitive2/knowledge-coverage.png',
  teacher: '/competitive2/teacher-team.png',
  thinking: '/competitive2/thinking-models.png',
  radar: '/competitive2/radar.png',
};

// ── 品牌配色 ────────────────────────────────────────────────────────────────
const BRAND_COLOR: Record<string, string> = {
  'NB实验室': '#7578C8',
  妙懂: '#A87DB0',
  '物理十分通/万物指南': '#5AABB8',
  '洋葱·从小学物理': '#E65532',
  学而思科学: '#D49E55',
};
const brandColor = (b: string) => BRAND_COLOR[b] ?? '#9090A8';

// ── 富文本：**加粗** ─────────────────────────────────────────────────────────
function RichText({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return (
    <>
      {parts.map((p, i) =>
        p.startsWith('**') && p.endsWith('**') ? (
          <strong key={i} className="font-bold text-[#2C2823]">
            {p.slice(2, -2)}
          </strong>
        ) : (
          <span key={i}>{p}</span>
        ),
      )}
    </>
  );
}

// ── 基础排版组件 ─────────────────────────────────────────────────────────────
function MajorTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-4 mt-2 flex items-center gap-2.5">
      <span className="h-5 w-1.5 rounded-full bg-[#E65532]" />
      <h3 className="text-[18px] font-black tracking-[-0.01em] text-[#2C2823] md:text-[20px]">
        {children}
      </h3>
    </div>
  );
}

function SubTitle({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-2.5 mt-5 text-[13px] font-bold text-[#C74E2F]">{children}</p>
  );
}

function Lead({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-2 mt-3.5 flex items-start gap-2">
      <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-[#E65532]" />
      <p className="text-[14.5px] font-bold leading-7 text-[#2C2823]">{children}</p>
    </div>
  );
}

function Para({ text }: { text: string }) {
  return (
    <p className="mb-2 text-[14px] leading-7 text-[#5B554E]">
      <RichText text={text} />
    </p>
  );
}

function Bullets({ items }: { items: string[] }) {
  return (
    <ul className="mb-2 ml-1 space-y-1.5">
      {items.map((it, i) => (
        <li key={i} className="flex items-start gap-2 text-[13.5px] leading-7 text-[#5B554E]">
          <span className="mt-[10px] h-1 w-1 shrink-0 rounded-full bg-[#B8AFA2]" />
          <span>
            <RichText text={it} />
          </span>
        </li>
      ))}
    </ul>
  );
}

function Evidence({ label = '论据支撑', items }: { label?: string; items: string[] }) {
  return (
    <div className="my-2.5 rounded-2xl border border-[#EFE7DA] bg-[#FBF8F3] px-4 py-3">
      <div className="mb-2 flex items-center gap-1.5 text-[11px] font-bold tracking-wide text-[#B58A5B]">
        <QuoteIcon size={12} />
        {label}
      </div>
      <div className="space-y-2">
        {items.map((q, i) => (
          <div key={i} className="flex gap-2 border-l-2 border-[#E7C9A8] pl-3">
            <p className="text-[12.5px] italic leading-6 text-[#6B655C]">
              <RichText text={q} />
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

function Note({ children, label = '模块洞察' }: { children: React.ReactNode; label?: string }) {
  return (
    <div className="my-3 rounded-2xl border border-[#F0C9B9] bg-gradient-to-br from-[#FFF6F1] to-[#FFF0E8] px-4 py-3.5">
      <div className="mb-1 flex items-center gap-1.5 text-[11px] font-black tracking-wide text-[#D8552E]">
        <Lightbulb size={13} />
        {label}
      </div>
      <p className="text-[13.5px] leading-7 text-[#5B4A40]">{children}</p>
    </div>
  );
}

function Figure({ src, caption }: { src: string; caption?: string }) {
  return (
    <figure className="my-3.5">
      <div className="overflow-hidden rounded-2xl border border-[#E4DED5] bg-white shadow-[0_8px_24px_rgba(61,49,37,0.06)]">
        <img src={src} alt={caption ?? ''} className="block w-full" loading="lazy" />
      </div>
      {caption && (
        <figcaption className="mt-2 text-center text-[11.5px] text-[#9A948B]">{caption}</figcaption>
      )}
    </figure>
  );
}

// ── 竞品横向对比条 ───────────────────────────────────────────────────────────
type CompareItem = { brand: string; text: string };
function Compare({ items }: { items: CompareItem[] }) {
  return (
    <div className="mt-2 space-y-2.5">
      {items.map((it) => {
        const c = brandColor(it.brand);
        return (
          <div
            key={it.brand}
            className="rounded-2xl border border-[#E9E2D7] bg-white p-3.5"
            style={{ boxShadow: '2px 3px 0 rgba(0,0,0,0.03)' }}
          >
            <div className="mb-1.5 flex items-center gap-2">
              <span
                className="flex h-5 min-w-5 items-center justify-center rounded-md px-1.5 text-[10px] font-bold text-white"
                style={{ backgroundColor: c }}
              >
                {it.brand.replace('·从小学物理', '').charAt(0)}
              </span>
              <span className="text-[13px] font-bold" style={{ color: c }}>
                {it.brand}
              </span>
            </div>
            <p className="text-[13px] leading-7 text-[#5B554E]">
              <RichText text={it.text} />
            </p>
          </div>
        );
      })}
    </div>
  );
}

// ── 研究目标卡片 ─────────────────────────────────────────────────────────────
function Goals({ items }: { items: { title: string; q: string; v: string }[] }) {
  return (
    <div className="mt-3 grid gap-3 md:grid-cols-3">
      {items.map((g, i) => (
        <div key={i} className="flex flex-col rounded-2xl border border-[#E4DED5] bg-white p-4">
          <div className="mb-2 flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#FFF0EA] text-[12px] font-black text-[#E65532]">
              {i + 1}
            </span>
            <span className="text-[14px] font-black text-[#2C2823]">{g.title}</span>
          </div>
          <p className="mb-2 text-[12.5px] leading-6 text-[#6B655C]">
            <span className="font-bold text-[#C74E2F]">研究需回答：</span>
            {g.q}
          </p>
          <p className="mt-auto rounded-xl bg-[#F7F5F0] px-3 py-2 text-[12px] leading-6 text-[#6B655C]">
            <span className="font-bold text-[#8A6A3E]">业务价值：</span>
            {g.v}
          </p>
        </div>
      ))}
    </div>
  );
}

// ── 研究方法卡片 ─────────────────────────────────────────────────────────────
function Methods({ items }: { items: { title: string; text: string; tag: string }[] }) {
  return (
    <div className="mt-3 grid gap-3 md:grid-cols-2">
      {items.map((m, i) => (
        <div key={i} className="rounded-2xl border border-[#E4DED5] bg-white p-4">
          <div className="mb-1.5 flex items-center justify-between">
            <span className="text-[14px] font-black text-[#2C2823]">{m.title}</span>
            <span className="rounded-full bg-[#FFF0EA] px-2.5 py-0.5 text-[11px] font-bold text-[#E65532]">
              {m.tag}
            </span>
          </div>
          <p className="text-[13px] leading-7 text-[#5B554E]">
            <RichText text={m.text} />
          </p>
        </div>
      ))}
    </div>
  );
}

// ── 用户画像表格 ─────────────────────────────────────────────────────────────
type PersonaRow = { label: string; value: string | string[] };
function PersonaTable({ rows, color }: { rows: PersonaRow[]; color: string }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-[#E4DED5] bg-white">
      {rows.map((r, i) => (
        <div
          key={r.label}
          className={cn('grid grid-cols-[92px_1fr] md:grid-cols-[120px_1fr]', i !== 0 && 'border-t border-[#EFE9E0]')}
        >
          <div
            className="px-3 py-3 text-[12.5px] font-bold text-white md:px-4"
            style={{ backgroundColor: color }}
          >
            {r.label}
          </div>
          <div className="px-3 py-3 md:px-4">
            {Array.isArray(r.value) ? (
              <ul className="space-y-1">
                {r.value.map((v, j) => (
                  <li key={j} className="flex items-start gap-1.5 text-[13px] leading-6 text-[#5B554E]">
                    <span className="mt-[9px] h-1 w-1 shrink-0 rounded-full bg-[#B8AFA2]" />
                    <span>
                      <RichText text={v} />
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-[13px] leading-6 text-[#5B554E]">
                <RichText text={r.value} />
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

// ── 代表案例故事 ─────────────────────────────────────────────────────────────
type StoryItem = { text: string; subs?: { text: string; quotes?: string[] }[] };
function Story({ title, core, items }: { title: string; core: string; items: StoryItem[] }) {
  return (
    <div className="mt-4 rounded-2xl border border-[#E4DED5] bg-gradient-to-br from-white to-[#FBF9F5] p-5">
      <div className="mb-3 flex items-start gap-2">
        <Sparkles size={16} className="mt-0.5 shrink-0 text-[#E65532]" />
        <h4 className="text-[15px] font-black leading-6 text-[#2C2823]">{title}</h4>
      </div>
      <p className="mb-4 rounded-xl bg-[#FFF0EA] px-3.5 py-2.5 text-[13px] leading-6 text-[#8A4A31]">
        <span className="font-bold">核心特征：</span>
        {core}
      </p>
      <ol className="space-y-3.5">
        {items.map((it, i) => (
          <li key={i} className="flex gap-2.5">
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#2C2823] text-[11px] font-bold text-white">
              {i + 1}
            </span>
            <div className="flex-1">
              <p className="text-[13.5px] font-semibold leading-7 text-[#2C2823]">
                <RichText text={it.text} />
              </p>
              {it.subs && (
                <div className="mt-1.5 space-y-2 border-l border-[#EAE3D8] pl-3">
                  {it.subs.map((s, j) => (
                    <div key={j}>
                      <p className="text-[13px] leading-7 text-[#5B554E]">
                        <RichText text={s.text} />
                      </p>
                      {s.quotes && (
                        <div className="mt-1.5 space-y-1.5">
                          {s.quotes.map((q, k) => (
                            <p
                              key={k}
                              className="border-l-2 border-[#E7C9A8] bg-[#FBF8F3] px-3 py-1.5 text-[12px] italic leading-6 text-[#6B655C]"
                            >
                              {q}
                            </p>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// 主页面 1：研究概览
// ════════════════════════════════════════════════════════════════════════════
function OverviewBackground() {
  return (
    <div>
      <Lead>调研背景</Lead>
      <Para text="《从小学物理》自推出以来取得了一定销售成果，但增长路径仍未完全清晰。随着生物 / 地理等系列课的陆续推出，业务希望通过调研，挖掘成交用户的购买动因，推动《从小学系列课程》升级为“规模化爆品”，加快营收目标的达成。" />
      <SubTitle>研究目标</SubTitle>
      <Goals
        items={[
          {
            title: '识别核心人群',
            q: '目标用户是谁？课程应优先面向哪类家庭，才能确保收益最大？',
            v: '帮助业务明确优先转化的人群，避免泛泛地"卖给所有小学家长"，提升投放、话术和销售资源的命中率。',
          },
          {
            title: '明确产品定位',
            q: '激烈的市场竞争中，洋葱应主打哪种定位，才能占住用户心智？',
            v: '帮助确定产品包装和核心卖点，统一商详页、直播间、销售话术和内容素材的表达方向。',
          },
          {
            title: '验证竞品差异',
            q: '家长如何看待洋葱与妙懂等竞品的差异？不同人群为什么选洋葱、为什么选竞品？',
            v: '帮助提炼"人群 × 产品 × 卖点"的策略，明确对不同竞品该怎么打、该避开什么战场。',
          },
        ]}
      />
    </div>
  );
}

function OverviewMethod() {
  return (
    <div>
      <Lead>研究方法与样本构成</Lead>
      <Methods
        items={[
          {
            title: '用户访谈',
            tag: '8 位成交家长',
            text: '围绕购买触发、竞品比较、下单原因、使用体验、推荐 / 不推荐理由展开。',
          },
          {
            title: '问卷调研',
            tag: '81 份问卷',
            text: '针对《从小学物理》已购用户，重点分析用户画像、认知渠道、购买动机、后续物化生地课程意向。',
          },
          {
            title: '销售数据分析',
            tag: '内部数据',
            text: '结合从小学物理 / 地理 / 生物已购用户年级、渠道、购买时用户状态等销售数据。',
          },
          {
            title: '行业 / 竞品研究',
            tag: '桌面 + 走查',
            text: '对妙懂物理、NB 实验室、物理十分通 / 万物指南等产品进行桌面研究、体验评估与横向对比。',
          },
        ]}
      />
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// 主页面 2：核心结论
// ════════════════════════════════════════════════════════════════════════════
function ConclusionDeal() {
  return (
    <div>
      <MajorTitle>品类动机 —— 为初中理科学习买一份"确定感"</MajorTitle>

      <SubTitle>用研洞察：品类成立的原因是什么？</SubTitle>
      <Lead>前提：兴趣是入口，孩子喜欢家长才会考虑</Lead>
      <Evidence
        items={[
          '问卷「成交被打动因素」排名：趣味动画课（TOP 1）53%；孩子喜欢（TOP 2）40%。',
          '用户 7｜二年级｜山东潍坊：「首先是孩子能看得进去，看得进去的话，想教他的知识，他才能听进去、学进去。」',
          '用户 4｜二年级｜北京顺义：「我是基于我们家孩子喜欢，我才付费去买这个课程的。」',
        ]}
      />
      <Lead>核心：「未来学科价值」才是最终合理化购买的理由</Lead>
      <Evidence
        items={[
          '用户 3｜二年级｜广东中山：「因为以后到初中也会学到物理，可以提前让他认识、知道一些跟物理相关的知识。」',
          '用户 7｜二年级｜山东潍坊：「初中、高中肯定都会有这个课程，提前在小学阶段让他先接触一下，之后学起来可能不会很吃力。」',
          '用户 8｜一年级｜安徽合肥：「最少他上初中、高中学习物理不会那么吃力吧？因为他小时候就喜欢接触，应该是有点帮助。」',
          '问卷「对课程的学习预期」：孩子未来进入初中后学理科时能更快听懂（TOP 1）31%。',
          '竞品分析：物理十分通卖"孩子将来上初中物理会跟不上"的预防焦虑，妙懂卖"初中物理课听不懂、我辅导不了"的辅导焦虑，NB 实验室卖"初高中实验全覆盖"；本质上都在指向「学科」。',
        ]}
      />

      <SubTitle>业务启发：结合品类需求，洋葱该占据哪类细分市场？</SubTitle>
      <Lead>
        产品定位：家长需求介于「纯兴趣启蒙」和「小初衔接提前学」之间，更准确的品类位置是 **学科启蒙**，而这部分恰好是竞品未占据的蓝海
      </Lead>
      <Evidence
        items={[
          '「不需要提前学完初中内容，能确保以后正式学时不陌生就可以了。」',
          '「到真正学物理的时候，讲到的时候孩子都知道，比其他同学更好吸收。」',
          '「初中学印象中有这个东西，不排斥这个学科就好。」',
        ]}
      />
      <Figure src={IMG.positioning} caption="问卷「家长对课程的定位」" />
      <Bullets
        items={[
          '**兴趣启蒙：竞争激烈，红海市场** —— 一边有更方便、更实惠、更护眼的绘本 / 科普类书籍，一边有更有趣、更主流的线上化竞品（如斑马、叫叫等），洋葱做「课」起家，在纯启蒙领域不一定有优势。',
          '**小初衔接提前学：需求和课程方案不匹配** —— 有「提前学理科」需求的用户，更希望直接对标课本教材，可以购买洋葱小初 6 年卡，直接学习【初中物理同步课】。',
        ]}
      />
      <Lead>
        目标人群：小学 1-4 年级家长，既没有学前（3-6 岁）的纯兴趣启蒙诉求，也不到小高（5-6 年级）的强应试衔接焦虑，是"低压力学科启蒙"的核心受众
      </Lead>
      <Evidence
        label="内部销售数据"
        items={[
          '截至 5 月 12 日，《从小学系列课程》已购用户整体——1-3 年级占比 77%（新媒体近 7 成），从 5 年级开始断崖式下降。',
        ]}
      />
      <Figure src={IMG.grade} caption="已购用户年级分布" />

      <MajorTitle>产品决策 —— 相比竞品，洋葱缺少清晰的课程记忆点</MajorTitle>

      <SubTitle>用户洞察：家长被什么吸引下单？</SubTitle>
      <Lead>竞品：更多来自"单点爆破"</Lead>
      <Bullets
        items={[
          'NB 实验室：模拟触屏操作方便，能规避危险实验；',
          '线上实验直播课：真人老师动手实验，参与感强；',
          '妙懂物理：AR 形式有趣；',
          '万物指南：不刷题的吴姥姥，IP 权威。',
        ]}
      />
      <Evidence
        items={[
          'NB 实验室 · 用户 1｜二年级｜山东济宁：「操作比较方便，演示的操作看上去比较直观。」「比较吸引我的就是有一些危险的实验，可以在安全的情况下让孩子了解到。」',
          '学而思科学 / 赛先生 · 用户 8｜一年级｜安徽合肥：「讲得特别好，老师特别有吸引力。」「老师备课备得好，孩子很感兴趣。」「会寄实验器材、材料，让我们自己来做，也很棒。」',
          '妙懂物理 · 用户 5｜三年级｜重庆渝中：「我想让他玩那个 AR，但是买了以后他就只玩 AR，里面的东西他也不太爱看。」',
          '万物指南 · 用户 1｜二年级｜山东济宁：「万物指南的团队比较靠谱，不是那个不刷题的吴姥姥吗？她既然荣誉加身、比较爱惜羽毛，也不会去找不靠谱的团队合作。」',
        ]}
      />
      <Lead>洋葱：主要来自"品牌信任"和"顺手加购"</Lead>
      <Note label="洋葱困境">
        洋葱目前既不是妙懂（有 AR + 竞技），也不是物理十分通（有超级 IP），如果只用"动画易懂 + 教材同步"去卖，不仅在达人面前是一个没有独特故事可讲的产品，家长也无法清晰感知产品价值。
      </Note>
      <Bullets items={['信任洋葱的品牌；', '买小学 / 全科课包时顺手加购。']} />
      <Evidence
        items={[
          '用户 4｜二年级｜北京顺义：「名校的光环，就是觉得这个人还是挺信得过的。」「就基于他信任，然后其他的话都是随缘。」',
          '用户 8｜一年级｜安徽合肥：「因为给姐姐买了高中物理，然后就顺着推荐；弟弟看到里面有从小学物理就想学，后来发现要收费，我就买了。」',
        ]}
      />

      <SubTitle>业务启发：洋葱的最大优势不是和竞品拼单一功能，而是要塑造【最专业的学科启蒙课】</SubTitle>
      <Lead>一、系统性</Lead>
      <Bullets items={['课程设计系统：目录框架式设计，将 300+ 个生活现象融入三大篇章，从基础到挑战的梯度启蒙。']} />
      <Figure src={IMG.courseSystem} caption="课程设计系统：三大篇章 · 300+ 生活现象" />
      <Bullets items={['知识点覆盖系统：启蒙内容与人教版初中教材开篇要求一致，衔接不脱节。']} />
      <Figure src={IMG.knowledge} caption="知识点覆盖系统：对齐人教版初中教材" />
      <Lead>二、专业性</Lead>
      <Bullets items={['老师专业：中考命题专家、竞赛专家、资深教研老师带队设计。']} />
      <Figure src={IMG.teacher} caption="教研团队：命题专家 · 竞赛专家 · 资深教研" />
      <Bullets items={['讲解专业：3 大独创思维模型，帮孩子从表象到本质、从现象到规律。']} />
      <Figure src={IMG.thinking} caption="3 大独创思维模型" />
      <Lead>三、丰富性</Lead>
      <Bullets items={['知识点丰富：小初 900+ 个知识点；', '实验丰富：300+ 个真动手实验。']} />
    </div>
  );
}

function ConclusionBlock() {
  return (
    <div>
      <SubTitle>用研洞察：哪些顾虑可能阻断家长下单？</SubTitle>
      <Lead>一、不确定孩子会不会坚持看</Lead>
      <Evidence
        items={[
          '用户 5｜三年级｜重庆渝中：「一年级让他看的时候他在看，但好像没有特别感兴趣……现在看的话就是真的还是挺认真的，挺感兴趣的。」',
          '用户 4｜二年级｜北京顺义：「有时候孩子会忘记看，所以会提醒孩子去看一下。」',
        ]}
      />
      <Lead>二、不确定看完到底有没有学到</Lead>
      <Evidence
        items={[
          '「我想知道他到底学了什么东西？学到了什么？学了多少？能记住什么？」',
          '「到初中正式学物理才能看出来，现在没法判断。」',
        ]}
      />

      <SubTitle>业务启发：洋葱该如何帮助家长打消顾虑？</SubTitle>
      <Lead>针对"不确定孩子会不会坚持看" —— 用数据和事实说话：清楚告诉家长我们有什么、孩子为什么喜欢</Lead>
      <Bullets
        items={[
          '**数千家庭的选择，买回家不吃灰：**"1353 个家庭，人均观看 86 次；购买后第 1 周人均观看 21.69 次，全量付费用户人均每月看 17 节"。',
          '**趣味动画课，孩子更能看得进去：**"650+ 节动画视频课，用孩子愿意看的形式传递知识，让物理从课本上的概念变成一个个好玩的小故事"。',
          '**跟着做的实验，动手把兴趣留住：**制作热气球、潜望镜、乐器、造云…… 300+ 个真动手实验，孩子能跟着亲手尝试，参与感拉满。',
        ]}
      />
      <Lead>针对"不确定看完到底有没有学到" —— 把"效果外化"前置为营销机制</Lead>
      <Bullets
        items={[
          '家长不一定要立刻看到成绩提升，但需要看到阶段性信号，例如孩子能解释一个生活现象、完成一个实验、讲出一个原理、做对相关题目。只要有这些可感知证据，家长对"未来有用"的信心就会增强。',
          '**多维数据的学情报告，定期推送家长：**包含时长 / 模块 / 知识点等数据的学情报告，每周通过 App、公众号推送给家长，清晰看到孩子学了啥、学会啥。',
        ]}
      />
    </div>
  );
}

function ConclusionExperience() {
  return (
    <div>
      <MajorTitle>典型使用场景</MajorTitle>
      <Para text="《从小学物理》的学习场景是碎片化、低压力、由兴趣触发的补充学习，常见于周末 / 假期、主科学习间隙、孩子主动感兴趣想看时。" />
      <Evidence
        items={[
          '用户 5｜三年级｜重庆渝中：「看这些的话就是零碎的时间看。比如吃饭……星期六、星期天出去玩，玩累了休息的时候他也可能去看一下。」',
          '用户 4｜二年级｜北京顺义：「洋葱学园的从小学物理，如果说我不是不管的话，他每天都会刷。」',
        ]}
      />
      <MajorTitle>体验优劣势</MajorTitle>
      <Note label="评估方式">
        逐一评估市面各产品（洋葱 & 竞品）的「体验优势」与「体验劣势」，每条结论后均跟随 1-2 条用户原话论据，作为竞品分析横向对比的体验侧输入。
      </Note>
      <Compare
        items={[
          {
            brand: '洋葱·从小学物理',
            text: '**优势：**每个模块讲解的知识点多、内容系统、层次清晰；时长短、无压力，孩子感兴趣愿意主动看。**劣势：**部分晦涩词语孩子不易理解、不够口语化；对物理的兴趣若未培养起来则不会主动看；课程内容与校内科学课不够同步。',
          },
          {
            brand: '物理十分通/万物指南',
            text: '**优势：**内容质量高、短而精、废话少，不像漫画书那样花里胡哨。**劣势：**视频看完了，家长不知道孩子吸收了多少。',
          },
          {
            brand: 'NB实验室',
            text: '**优势：**模拟实验比纯视频更有参与感，动画形式孩子喜欢，学完对理科兴趣整体提升。**劣势：**与真实实验有差别（亮度、气味、风险控制），缺少讲解和引导，更多是孩子自己动手探索。',
          },
          {
            brand: '妙懂',
            text: '**优势：**AR 看起来好玩、有题库。**劣势：**太正式，不是小孩能接受的语气，孩子看着感觉像在学习。',
          },
          {
            brand: '学而思科学',
            text: '**优势：**有真人老师及时反馈互动，动手实验比模拟实验和纯视频更有吸引力，后续还能参加比赛。**劣势：**部分理论讲解不够好、没用孩子的语言讲；以「参赛」为目的时性价比不高（进阶赛需额外付费）。',
          },
        ]}
      />
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// 主页面 3：用户画像和故事
// ════════════════════════════════════════════════════════════════════════════
function Persona1() {
  return (
    <div>
      <PersonaTable
        color="#E07A6E"
        rows={[
          { label: '学情特征', value: ['孩子低年级，家长不急于提分', '更在意孩子是否愿意看、是否不排斥理科'] },
          { label: '用户需求', value: '让孩子觉得物理有意思，愿意持续接触，防止未来畏难排斥' },
          {
            label: '核心痛点',
            value: '**孩子不喜欢，无法起到兴趣启蒙的效果：**课程太像上课、太正式、太无趣，孩子容易排斥',
          },
          { label: '课程偏好', value: '偏好动画、短视频、故事化、生活现象等孩子喜欢的内容' },
          {
            label: '典型案例',
            value: ['正面案例：洋葱（孩子喜欢看实验男做实验）', '负面案例：妙懂（太正式，不是小孩能接受的预期）'],
          },
        ]}
      />
      <Story
        title='代表案例：安徽合肥妈妈 —— 把《从小学物理》当作孩子愿意看的"理科兴趣入口"'
        core="不急着让孩子提前学完整套初中物理，也不会用成绩检验启蒙效果；她首先要的是孩子愿意看、听得懂、觉得好玩。"
        items={[
          {
            text: '两个孩子，姐姐高中，弟弟一年级。',
            subs: [
              { text: '她对孩子学习没有特别焦虑的强规划，一年级孩子目前没有报很多辅导班，整体掌握情况也不错。' },
              { text: '相比"必须学到什么程度"，她更在意的是孩子能不能先愿意接触、愿意听、愿意看下去。' },
            ],
          },
          {
            text: '她最初购买《从小学物理》，是给姐姐买高中物理时顺着推荐看到了小学课程；**弟弟看到里面有从小学物理后表现出兴趣**，她就顺手买了。',
            subs: [
              { text: '她对这门课的期待很轻，不会把这件事定义成明确的学习任务，也没有要求孩子每天固定学习。', quotes: ['「孩子喜欢学就学，多看一点总归有帮助。」'] },
              { text: '对她来说，小学阶段的物理启蒙不是为了马上衔接，而是因为孩子喜欢，先让孩子接触。', quotes: ['「因为学习是个长期的过程，不是一蹴而就的。所以也没什么目的，孩子喜欢学就学。」'] },
            ],
          },
          {
            text: '她认可洋葱的一点，是孩子确实"听得有兴趣"。',
            subs: [
              { text: '相比普通科普视频，这类内容更像是孩子愿意主动看的科学内容，能把孩子先拉进来。' },
              { text: '尤其是实验男做实验相关内容，对孩子很有吸引力。', quotes: ['「孩子喜欢看实验男，因为学而思的教具或课堂都不能做危险的实验，而实验男可以做一些家里做不到、且会爆炸的实验。」'] },
            ],
          },
        ]}
      />
    </div>
  );
}

function Persona2() {
  return (
    <div>
      <PersonaTable
        color="#D49E55"
        rows={[
          { label: '学情特征', value: ['不追求短期效果，但有明确【未来有用】的预期', '相对兴趣启蒙更加"功利"'] },
          { label: '用户需求', value: '为孩子建立理科思维框架，提前熟悉概念，初中学理科时更轻松' },
          {
            label: '核心痛点',
            value: '**"未来有用"达成路径缺失，缺少对「有用」的判断依据：**不知道孩子学到多少、记住多少、学科思维有没有变化',
          },
          { label: '课程偏好', value: '偏好【有趣但有用】的课程：生活化讲解、体系化大纲、轻量题目验证、能关联未来初中知识' },
          {
            label: '典型案例',
            value: '目前洋葱和竞品均未很好做到，同时**【效果外化】**也是差异化机会点，阶段性地让家长看到学科启蒙的效果',
          },
        ]}
      />
      <Story
        title='代表案例：北京昌平爸爸 —— 把理科启蒙当作"未来别被卡住"的长期打底'
        core='他不会用短期成绩检验课程价值，也不希望孩子过早进入刷题；但他明确要求课程"未来有用"，能帮助孩子建立理科接纳度、熟悉感和长期学习优势。'
        items={[
          {
            text: '两个孩子，课程主要买给三年级的大孩。',
            subs: [
              { text: '爸爸是文科背景，自己理科相对弱，所以希望孩子不要走自己的老路。' },
              { text: '他对孩子的理科学习有明确的长期规划：**小学阶段不一定要立刻见效，但不能让孩子未来初高中被理科限制。**' },
            ],
          },
          {
            text: '更在意的是：孩子未来能不能形成理科思维、能不能在初高中面对物理化学时不吃力，甚至大学选专业时不要因为理科弱而被动。',
            subs: [
              { text: '因此，他购买学而思科学、NB 实验室，不是单纯为了兴趣，而是带着"笨鸟先飞"的学科启蒙逻辑。', quotes: ['「希望孩子现在学一遍，初高中再学一遍时更轻松。」'] },
              { text: '对他来说，真正有价值的启蒙不是"看着玩"，而是和未来学科挂钩。', quotes: ['「学科启蒙为了以后中高考、初高中理科学习；兴趣启蒙要求更低，更像让孩子试水、培养兴趣。」', '「学的东西未来要有用，理科启蒙要和未来学科挂钩，不能只是玩一玩。」'] },
            ],
          },
          {
            text: '相比一次性的兴趣内容，他更看重一个产品能不能长期使用、能不能连接未来学习路径。',
            subs: [
              { text: '他选择 NB 实验室，是因为它覆盖小学到高中、能选教材版本、有实验、有知识闯关和习题，还能寒暑假按单元复习或预习。', quotes: ['「覆盖教材、覆盖小学到高中、能做实验、能做习题，说明产品具备学科启蒙属性。」'] },
              { text: '短期内并没有非常清晰的效果标准，主要用孩子是否接纳、是否愿意学来判断启蒙是否成立。', quotes: ['「孩子保持兴趣；孩子不逆反；布置任务时愿意点进去学；对科学书籍和理科内容接纳度提升。」'] },
            ],
          },
        ]}
      />
    </div>
  );
}

function Persona3() {
  return (
    <div>
      <PersonaTable
        color="#4BA69E"
        rows={[
          { label: '学情特征', value: ['家长看重实验，相信"实验是理科学习的核心"', '孩子对"科学实验"有兴趣'] },
          { label: '用户需求', value: '让孩子通过观察现象、动手操作来理解原理，而不是只看视频' },
          {
            label: '核心痛点',
            value: '**虚拟实验缺少动手感，无法替代真人实验：**容易停留在"看过"，孩子无法跟着一起动手做',
          },
          { label: '课程偏好', value: '偏好真实验、可动手、材料易获得、老师带做' },
          {
            label: '典型案例',
            value: ['正面案例：真人实验直播课（专业老师带着做实验讲解，孩子感兴趣、吸收得多）', '负面案例：NB 实验室（动手交互不能代替真实实验）'],
          },
        ]}
      />
      <Story
        title="代表案例：北京顺义妈妈 —— 相信实验和系统讲解，想让孩子在动手中真正理解物理"
        core="她相信兴趣重要，但更相信“实践出真知”；她要的不是孩子只看懂视频，而是能动手、能提问、能在实验中把抽象概念真正理解。"
        items={[
          {
            text: '家里一个二年级男孩，报过很多物理启蒙 / 实验课（从小学物理、NB 实验室、学而思自然博物、赛先生科学课等）。',
            subs: [{ text: '她不是随便买来试试，而是长期关注孩子的学习兴趣、学科启蒙和未来升学。' }],
          },
          {
            text: '她购买《从小学物理》，一方面是因为信任洋葱品牌，另一方面是**被实验吸引**，孩子也喜欢看实验男做实验。',
            subs: [
              { text: '购买前后的态度：', quotes: ['购买前：「我主要是看中他这个理科的同步校内，看他那实验做得也比较好，孩子看了也很感兴趣，我才又添加这笔钱买的从小学物理这个课程。」', '购买后：「洋葱如果不管的话每天都会看，喜欢看实验男做实验。」'] },
            ],
          },
          {
            text: '她对"好的理科启蒙"要求：**只有「知识讲解」和「动手实验」兼备，孩子才能真正印证理论知识。**',
            subs: [
              { text: '她对赛先生科学课评价高，就是因为有真人老师一边讲解一边带着做实验，孩子吸收更多、更有参与感。', quotes: ['「一定要有专业的老师带着做实验才效果好，孩子做实验时能问老师，老师能纠正过来。」', '「线上知识点、线下做实验直播课更全，有真人老师照顾得过来，孩子吸收得也多。」', '「实验肯定是重要的，理科就是实践出真知，自己看肯定不如自己动手。」'] },
              { text: '相比之下，NB 实验室动手操作多但讲解弱，洋葱内容讲解系统但实验动手不足。', quotes: ['「（NB）没讲解，更多动手操作，家长在旁边需要多一点。」'] },
            ],
          },
          {
            text: '她对洋葱的期待很明确：保持内容系统和趣味的优势、把专业概念讲得更儿童化、把实验做得更可操作。',
          },
        ]}
      />
    </div>
  );
}

function Persona4() {
  return (
    <div>
      <PersonaTable
        color="#5B7BBF"
        rows={[
          { label: '学情特征', value: ['所在地区科学是主课，会像语数英一样有考试', '家长希望帮助校内科学学习'] },
          { label: '用户需求', value: '让孩子学透校内科学课的知识，不只是背概念、背实验结论' },
          {
            label: '核心痛点',
            value: '**课程内容需和教材知识点顺序保持一致：**若不能按年级、教材、知识点查找，实际会影响使用率',
          },
          { label: '课程偏好', value: '偏好对标教材、按年级 / 教材版本 / 知识点组织、能快速搜索的产品' },
          {
            label: '典型案例',
            value: '洋葱：有些学校科学课的知识点在洋葱没有（需要更强的年级、教材、知识点检索匹配）',
          },
        ]}
      />
      <Story
        title="代表案例：河南郑州妈妈 —— 把《从小学物理》当作小学科学课的辅助工具"
        core="她不是为了启蒙或提前学，而是希望课程能帮孩子学透校内科学课；她最看重能不能对标教材，让孩子不再死记硬背，而能真的理解书本内容背后的原理。"
        items={[
          {
            text: '一个四年级孩子，郑州的科学课是需要考试的主课：**期中期末要考，平时也有单元测。**',
          },
          {
            text: '打动她购买的，是科学课占据了很多学习时间，孩子平时更多靠背书，容易背不下来、理解不透。她希望用动画视频帮孩子把校内科学里的抽象知识点讲明白。',
            subs: [
              { text: '', quotes: ['「孩子日常单元课，在科学上占据很多时间，老师会梳理知识点——实验、名词解释都需要背。」', '「不希望孩子死记硬背，刚好有这个课。」'] },
            ],
          },
          {
            text: '她对《从小学物理》的期待和使用场景很具体：',
            subs: [
              { text: '**期待 · 校内同步：**能对标校内知识点，孩子哪个单元不理解就能快速找到对应视频看。', quotes: ['「可以研究各个地区的课本，根据课本有相关知识点，一找就能找到知识点。」'] },
              { text: '**场景 · 查漏补缺：**并不强求系统学完整套课程，而是当作一种"知识点复习 / 理解工具"。', quotes: ['「洋葱主要是用来复习知识点，这个单元需要考试，或者某个知识点有明显缺漏需要看。」'] },
            ],
          },
          {
            text: '使用落差明显：课程虽然动画不枯燥，但不够同步，四年级上册的一些内容找不到。',
            subs: [
              { text: '如果不能按年级、教材、知识点检索，这门课的使用频率就会降低，容易变成"想起来划两下"的补充内容。', quotes: ['「之前以为顺序不一样但知识点都有，后面发现不一样（四上的内容找不到）。」', '「如果没那么同步，可能想起来了去划两下，或者哪个知识点真的不理解，平时用不到。」'] },
            ],
          },
        ]}
      />
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// 主页面 4：竞品分析
// ════════════════════════════════════════════════════════════════════════════
function CompetitiveIntro() {
  return (
    <div className="mb-4">
      <Para text="主要来自产品走查体验、多个产品间的亲身对比，并结合用户访谈的结论共同输出。" />
      <Para text="将「从小学物理三家竞品横向对比表」中的打分做成雷达图，更清晰直观地看到每个维度上的优劣势。" />
      <Figure src={IMG.radar} caption="三家竞品横向对比 · 能力雷达图" />
      <Note label="核心结论">
        从获客链路看，竞品各有强钩子，但**共同短板是"学到了什么"没有被证明**。洋葱如果只补流量和卖点，会陷入红海；真正的机会是**把"孩子爱看"升级成"孩子说得出、做得出、家长看得见"**。
      </Note>
    </div>
  );
}

function CompetitiveSeen() {
  return (
    <div>
      <Note>
        竞品被看见，靠的不是"产品完整性"，而是一个能快速破圈的入口：NB 靠实验爆款、妙懂靠 AR 视觉演示、物理十分通靠吴姥姥 IP、洋葱目前更多靠品牌顺带触达，「从小学物理」本身的独立声量还弱。
      </Note>
      <SubTitle>横向对比</SubTitle>
      <Compare
        items={[
          { brand: 'NB实验室', text: '靠虚拟实验和爆款实验梗被看见，小红书 / 短视频里"加钠、爆炸、馒头"等内容天然有传播性，也有较强 B 端进校背书反哺 C 端认知。' },
          { brand: '妙懂', text: '靠直播间 AR 演示被看见，AR 是非常直观的视觉钩子，家长不用理解课程体系，只要看到孩子能拖动、旋转、互动，就会觉得"这个东西不一样"。' },
          { brand: '物理十分通/万物指南', text: '靠吴姥姥 IP 和短视频内容被看见，入口不是课程本身，而是"权威老师讲物理""不刷题的吴姥姥"这个人格化内容资产。' },
          { brand: '洋葱·从小学物理', text: '被看见主要依赖洋葱品牌、已有用户、达人混场或大会员顺带推荐；但"从小学物理"本身还缺少像 AR、吴姥姥、爆炸实验那样的独立破圈符号。' },
        ]}
      />
    </div>
  );
}

function CompetitiveStand() {
  return (
    <div>
      <Note>
        信任资产和成交扳机各不相同：NB 靠学校老师规模背书 / 虚拟实验，物理十分通靠吴姥姥和教授权威，妙懂靠教材同步和 AR 体验。洋葱有学生口碑和强品牌背书，但还**需要把"洋葱成立"转化成"从小学物理成立"**。
      </Note>
      <SubTitle>横向对比</SubTitle>
      <Compare
        items={[
          { brand: 'NB实验室', text: '**信任资产：**最强在 B 端，学校、老师、学生使用规模构成硬背书，家长会觉得"学校都在用，应该靠谱"。**成交扳机：**靠"虚拟实验好玩 + 终身 / 长期卡划算 + 学校背书"，把购买理由讲成——孩子从小学到高中都能用，在家也能做实验。' },
          { brand: '妙懂', text: '**信任资产：**来自教材同步、真题、AR 工具感和 App 评分，靠"看起来像一套能帮助孩子学懂的工具"建立信任。**成交扳机：**靠 AR 的即时体验和"孩子学不懂，让 TA 玩妙懂"的心智，家长买的是一种轻松解决辅导困难的想象。' },
          { brand: '物理十分通/万物指南', text: '**信任资产：**最集中在吴姥姥 IP，教授身份、央视报道、内容权威感让家长降低判断成本。**成交扳机：**靠吴姥姥权威、试听内容、赠品堆料和价格摊薄，把下单包装成低风险、高权威、高性价比的选择。' },
          { brand: '洋葱·从小学物理', text: '**信任资产：**洋葱本身有学校、教师、品牌、课程体系积累，也有创始人 / 教研老师背书；但这些还没充分落到"从小学物理为什么专业、为什么适合小学启蒙"上。**成交扳机：**靠孩子喜欢看动画、实验男有吸引力、洋葱品牌可信、课程永久有效 / 顺手加购，但缺少一个让家长立刻感知"非买不可"的强理由。' },
        ]}
      />
    </div>
  );
}

function CompetitiveBreak() {
  return (
    <div>
      <Note>
        四个产品最终都**断在"效果不可见"**。竞品都能解决"被看见"和"被购买"，但很少真正解决"孩子到底学到了什么"。这正是洋葱从小学物理最值得抢的位置：不只让孩子看懂，还要让家长看见孩子学会了。
      </Note>
      <SubTitle>横向对比</SubTitle>
      <Compare
        items={[
          { brand: 'NB实验室', text: '强在实验和学校背书，但 C 端家庭使用容易变浅。长期卡能锁住用户，却不等于孩子长期学；家长仍缺少稳定的学习效果感知。' },
          { brand: '妙懂', text: '强在第一眼 AR，但 AR 新鲜感可能衰减。低龄孩子容易只玩不学，高龄孩子可能觉得形式偏低幼；它能吸引注意，却不一定能证明掌握。' },
          { brand: '物理十分通/万物指南', text: '强在吴姥姥 IP，但 IP 主要在获客阶段有效，进入 App 后孩子是否持续看、是否吸收，家长不一定知道。' },
          { brand: '洋葱·从小学物理', text: '内容系统、动画易进入，但断在效果外化不足：孩子看了多少、听懂多少、能不能说出原理、是否形成学科启蒙效果，家长还缺少明确反馈。' },
        ]}
      />
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// Tab 结构
// ════════════════════════════════════════════════════════════════════════════
type SubTab = { key: string; label: string; render: () => React.ReactNode };
type MainTab = {
  key: string;
  label: string;
  icon: React.ComponentType<{ size?: number }>;
  intro?: () => React.ReactNode;
  subs: SubTab[];
};

const TABS: MainTab[] = [
  {
    key: 'overview',
    label: '研究概览',
    icon: Target,
    subs: [
      { key: 'background', label: '背景与目的', render: () => <OverviewBackground /> },
      { key: 'method', label: '方法与样本', render: () => <OverviewMethod /> },
    ],
  },
  {
    key: 'conclusions',
    label: '核心结论',
    icon: ClipboardList,
    subs: [
      { key: 'deal', label: '成交原因', render: () => <ConclusionDeal /> },
      { key: 'block', label: '未成交卡点', render: () => <ConclusionBlock /> },
      { key: 'experience', label: '产品体验', render: () => <ConclusionExperience /> },
    ],
  },
  {
    key: 'personas',
    label: '用户画像和故事',
    icon: Users,
    subs: [
      { key: 'p1', label: '兴趣启蒙型', render: () => <Persona1 /> },
      { key: 'p2', label: '学科启蒙打底型', render: () => <Persona2 /> },
      { key: 'p3', label: '实验探究型', render: () => <Persona3 /> },
      { key: 'p4', label: '校内科学课助力型', render: () => <Persona4 /> },
    ],
  },
  {
    key: 'competitive',
    label: '竞品分析',
    icon: BarChart3,
    intro: () => <CompetitiveIntro />,
    subs: [
      { key: 'seen', label: '靠什么被看见', render: () => <CompetitiveSeen /> },
      { key: 'stand', label: '靠什么成立', render: () => <CompetitiveStand /> },
      { key: 'break', label: '断裂在哪里', render: () => <CompetitiveBreak /> },
    ],
  },
];

const SUB_ICON: Record<string, React.ComponentType<{ size?: number }>> = {
  seen: Eye,
  stand: ShieldCheck,
  break: Unplug,
};

// ════════════════════════════════════════════════════════════════════════════
// 主组件
// ════════════════════════════════════════════════════════════════════════════
export default function Competitive2Page() {
  const [mainKey, setMainKey] = React.useState(TABS[0].key);
  const [subKey, setSubKey] = React.useState(TABS[0].subs[0].key);

  const main = TABS.find((t) => t.key === mainKey) ?? TABS[0];
  const sub = main.subs.find((s) => s.key === subKey) ?? main.subs[0];

  const selectMain = (k: string) => {
    const t = TABS.find((x) => x.key === k);
    if (!t) return;
    setMainKey(k);
    setSubKey(t.subs[0].key);
  };

  return (
    <div className="min-h-full bg-[#F7F5F0]">
      {/* 页面头部 */}
      <div className="border-b border-[#E4DED5] bg-white">
        <div className="mx-auto max-w-[1000px] px-5 pt-7 md:px-8">
          <div className="mb-2 flex items-center gap-2 text-[11px] font-bold tracking-[0.18em] text-[#E65532]">
            <span className="h-0.5 w-6 rounded-full bg-[#E65532]" />
            竞品分析 2 · 售卖策略调研
          </div>
          <h1 className="text-[26px] font-black tracking-[-0.02em] text-[#2C2823] md:text-[32px]">
            从小学系列售卖策略调研
          </h1>
          <p className="mt-2 max-w-2xl text-[13.5px] leading-6 text-[#77716A]">
            围绕《从小学物理》的成交动因、用户画像与竞品格局，回答"卖给谁、主打什么定位、怎么打竞品"三个核心问题。
          </p>

          {/* 一级 Tab */}
          <div className="-mb-px mt-5 flex items-center gap-1 overflow-x-auto">
            {TABS.map((t) => {
              const Icon = t.icon;
              const active = t.key === mainKey;
              return (
                <button
                  key={t.key}
                  onClick={() => selectMain(t.key)}
                  className={cn(
                    'relative flex shrink-0 items-center gap-1.5 whitespace-nowrap px-3.5 py-2.5 text-[13.5px] transition-colors md:px-4',
                    active ? 'font-bold text-[#E65532]' : 'font-medium text-[#8A847C] hover:text-[#5B554E]',
                  )}
                >
                  <Icon size={15} />
                  {t.label}
                  {active && <span className="absolute inset-x-3 bottom-0 h-0.5 rounded-full bg-[#E65532]" />}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 内容区 */}
      <div className="mx-auto max-w-[1000px] px-5 py-6 md:px-8 md:py-8">
        {main.intro && main.intro()}

        {/* 二级 Tab（子页面） */}
        <div className="mb-5 flex flex-wrap items-center gap-1.5 rounded-2xl border border-[#E9E2D7] bg-white p-1.5">
          {main.subs.map((s, i) => {
            const active = s.key === subKey;
            const Icon = SUB_ICON[s.key];
            return (
              <button
                key={s.key}
                onClick={() => setSubKey(s.key)}
                className={cn(
                  'flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-[13px] font-semibold transition-all',
                  active ? 'bg-[#E65532] text-white shadow-sm' : 'text-[#6B655C] hover:bg-[#F4F1EB]',
                )}
              >
                {Icon ? (
                  <Icon size={14} />
                ) : (
                  <span
                    className={cn(
                      'flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-bold',
                      active ? 'bg-white/25 text-white' : 'bg-[#F0EBE2] text-[#9A948B]',
                    )}
                  >
                    {i + 1}
                  </span>
                )}
                {s.label}
              </button>
            );
          })}
        </div>

        {/* 子页面内容 */}
        <div className="rounded-[24px] border border-[#E4DED5] bg-white px-5 py-6 shadow-[0_12px_40px_rgba(61,49,37,0.05)] md:px-8 md:py-7">
          {sub.render()}
        </div>
      </div>
    </div>
  );
}
