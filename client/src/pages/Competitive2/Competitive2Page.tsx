import React from 'react';
import { BarChart3, Eye, ShieldCheck, Unplug, Lightbulb } from 'lucide-react';
import { cn } from '@/lib/utils';

// ── 图片资源 ────────────────────────────────────────────────────────────────
const IMG = {
  radar: '/competitive2/radar.png',
};

// ── 品牌配色 ────────────────────────────────────────────────────────────────
const BRAND_COLOR: Record<string, string> = {
  'NB实验室': '#7578C8',
  妙懂: '#A87DB0',
  '物理十分通/万物指南': '#5AABB8',
  '洋葱·从小学物理': '#E65532',
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

function Para({ text }: { text: string }) {
  return (
    <p className="mb-2 text-[14px] leading-7 text-[#5B554E]">
      <RichText text={text} />
    </p>
  );
}

function SubTitle({ children }: { children: React.ReactNode }) {
  return <p className="mb-2.5 mt-5 text-[13px] font-bold text-[#C74E2F]">{children}</p>;
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
            <div className="space-y-1.5">
              {it.text.split('\n').map((line, idx) => (
                <p key={idx} className="text-[13px] leading-7 text-[#5B554E]">
                  <RichText text={line} />
                </p>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ── 竞品分析主页面：概述（雷达图 + 核心结论） ───────────────────────────────
function CompetitiveIntro() {
  return (
    <div className="mb-5">
      <Para text="主要来自产品走查体验、多个产品间的亲身对比，并结合用户访谈的结论共同输出。" />
      <Para text="将「从小学物理三家竞品横向对比表」中的打分做成雷达图，更清晰直观地看到每个维度上的优劣势。" />
      <Figure src={IMG.radar} caption="三家竞品横向对比 · 能力雷达图" />
      <Note label="核心结论">
        从获客链路看，竞品各有强钩子，但**共同短板是"学到了什么"没有被证明**。洋葱如果只补流量和卖点，会陷入红海；真正的机会是**把"孩子爱看"升级成"孩子说得出、做得出、家长看得见"**。
      </Note>
    </div>
  );
}

// ── 子页面 a：靠什么被看见 ───────────────────────────────────────────────────
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

// ── 子页面 b：靠什么成立 ─────────────────────────────────────────────────────
function CompetitiveStand() {
  return (
    <div>
      <Note>
        信任资产和成交扳机各不相同：NB 靠学校老师规模背书 / 虚拟实验，物理十分通靠吴姥姥和教授权威，妙懂靠教材同步和 AR 体验。洋葱有学生口碑和强品牌背书，但还**需要把"洋葱成立"转化成"从小学物理成立"**。
      </Note>
      <SubTitle>横向对比</SubTitle>
      <Compare
        items={[
          { brand: 'NB实验室', text: '**信任资产：**最强在 B 端，学校、老师、学生使用规模构成硬背书，家长会觉得"学校都在用，应该靠谱"。\n**成交扳机：**靠"虚拟实验好玩 + 终身 / 长期卡划算 + 学校背书"，把购买理由讲成——孩子从小学到高中都能用，在家也能做实验。' },
          { brand: '妙懂', text: '**信任资产：**来自教材同步、真题、AR 工具感和 App 评分，靠"看起来像一套能帮助孩子学懂的工具"建立信任。\n**成交扳机：**靠 AR 的即时体验和"孩子学不懂，让 TA 玩妙懂"的心智，家长买的是一种轻松解决辅导困难的想象。' },
          { brand: '物理十分通/万物指南', text: '**信任资产：**最集中在吴姥姥 IP，教授身份、央视报道、内容权威感让家长降低判断成本。\n**成交扳机：**靠吴姥姥权威、试听内容、赠品堆料和价格摊薄，把下单包装成低风险、高权威、高性价比的选择。' },
          { brand: '洋葱·从小学物理', text: '**信任资产：**洋葱本身有学校、教师、品牌、课程体系积累，也有创始人 / 教研老师背书；但这些还没充分落到"从小学物理为什么专业、为什么适合小学启蒙"上。\n**成交扳机：**靠孩子喜欢看动画、实验男有吸引力、洋葱品牌可信、课程永久有效 / 顺手加购，但缺少一个让家长立刻感知"非买不可"的强理由。' },
        ]}
      />
    </div>
  );
}

// ── 子页面 c：断裂在哪里 ─────────────────────────────────────────────────────
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

// ── 子页面 tab 定义 ──────────────────────────────────────────────────────────
const SUBTABS: { key: string; label: string; icon: React.ComponentType<{ size?: number }>; render: () => React.ReactNode }[] = [
  { key: 'seen', label: '靠什么被看见', icon: Eye, render: () => <CompetitiveSeen /> },
  { key: 'stand', label: '靠什么成立', icon: ShieldCheck, render: () => <CompetitiveStand /> },
  { key: 'break', label: '断裂在哪里', icon: Unplug, render: () => <CompetitiveBreak /> },
];

// ════════════════════════════════════════════════════════════════════════════
// 主组件（作为「从小学」项目下的一个 tab，子页面才是 tab 栏）
// ════════════════════════════════════════════════════════════════════════════
export default function Competitive2Page() {
  const [subKey, setSubKey] = React.useState(SUBTABS[0].key);
  const active = SUBTABS.find((s) => s.key === subKey) ?? SUBTABS[0];

  return (
    <div className="flex h-full flex-col bg-[#F7F5F0]">
      {/* 顶部标题 + 子页面 tab 栏 */}
      <div className="shrink-0 border-b border-[#E4DED5] bg-white px-5 py-3 md:px-8">
        <div className="mx-auto max-w-[1000px]">
          <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
            <div className="flex items-center gap-2">
              <BarChart3 size={18} className="text-[#E65532]" />
              <h2 className="text-[16px] font-black text-[#2C2823]">竞品分析</h2>
            </div>
            <span className="text-[12px] text-[#9A948B]">从小学系列售卖策略调研 · 产品走查 + 用户访谈</span>
          </div>

          <div className="mt-3 flex flex-wrap gap-1.5">
            {SUBTABS.map((s) => {
              const isActive = s.key === subKey;
              const Icon = s.icon;
              return (
                <button
                  key={s.key}
                  onClick={() => setSubKey(s.key)}
                  className={cn(
                    'flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-[13px] font-semibold transition-all',
                    isActive ? 'bg-[#E65532] text-white shadow-sm' : 'bg-[#F4F1EB] text-[#6B655C] hover:bg-[#EEE9E0]',
                  )}
                >
                  <Icon size={14} />
                  {s.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 内容区 */}
      <div className="min-h-0 flex-1 overflow-y-auto px-5 py-6 md:px-8">
        <div className="mx-auto max-w-[1000px]">
          <CompetitiveIntro />
          <div className="rounded-[24px] border border-[#E4DED5] bg-white px-5 py-6 shadow-[0_12px_40px_rgba(61,49,37,0.05)] md:px-8 md:py-7">
            {active.render()}
          </div>
        </div>
      </div>
    </div>
  );
}
