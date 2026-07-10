import React from 'react';
import {
  BookOpenCheck,
  Lightbulb,
  SearchCheck,
  Sparkles,
  Target,
} from 'lucide-react';
import { reportConclusions, type ResearchConclusion } from './FromPrimaryMergedReport';
import { HighlightText } from '@/components/report/HighlightText';
import { KeyStat, extractStats } from '@/components/report/KeyStat';

// Demo：把「调研结论」从「文档式仓库」改成「层级清晰、一次看清」的浏览体验。
//   不用折叠/点击展开，靠字号-字重-颜色-留白的层级阶梯把主次拉开。
//   层级：主标题(title) > 副标题(conclusion) > 数字锚点 > 核心要点 > 支撑信息(行动/来源)

const ACCENT = '#E95B35';
const DIVIDER = '#F0EAE1';

const DIMS: { id: string; label: string; icon: typeof Lightbulb; color: string }[] = [
  { id: 'core', label: '核心洞察', icon: Lightbulb, color: '#E95B35' },
  { id: 'purchase', label: '购买决策', icon: Target, color: '#C58A3D' },
  { id: 'experience', label: '买后体验', icon: BookOpenCheck, color: '#2F9F8F' },
  { id: 'barrier', label: '购买卡点', icon: SearchCheck, color: '#D96D62' },
  { id: 'brand', label: '品牌差异', icon: Sparkles, color: '#5D78BD' },
];

function itemsOf(dimId: string): ResearchConclusion[] {
  return reportConclusions.filter((item) => item.dimension === dimId);
}

export default function ConclusionsDemo() {
  const jumpTo = React.useCallback((id: string) => {
    document.getElementById(`demo-item-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  return (
    <main className="min-h-full bg-[#FAF8F4] text-[#2A2621]">
      <div className="mx-auto max-w-[820px] px-5 py-9 md:px-6">
        <header>
          <p className="text-[12px] font-bold tracking-[0.14em] text-[#B29B7E]">从小学系列售卖策略调研 · DEMO</p>
          <h1 className="mt-2.5 text-[28px] font-black leading-tight md:text-[34px]">结论速览</h1>
          <p className="mt-2.5 text-[14px] font-medium leading-7 text-[#8A8279]">
            先扫一遍总览目录抓全貌，再往下逐条看；每条结论标题、要点、支撑信息层层分明。
          </p>
        </header>

        {/* 总览目录 */}
        <nav className="mt-6 rounded-[16px] border border-[#ECE6DD] bg-white p-5">
          <p className="text-[11px] font-black tracking-[0.12em] text-[#B29B7E]">总览目录</p>
          <div className="mt-3 space-y-3">
            {DIMS.map((dim) => {
              const items = itemsOf(dim.id);
              if (items.length === 0) return null;
              return (
                <div key={dim.id} className="flex flex-col gap-1.5 sm:flex-row sm:gap-3">
                  <div className="flex shrink-0 items-center gap-1.5 sm:w-24 sm:pt-0.5">
                    <span className="size-2 rounded-full" style={{ backgroundColor: dim.color }} />
                    <span className="text-[12.5px] font-black" style={{ color: dim.color }}>{dim.label}</span>
                  </div>
                  <ul className="flex flex-1 flex-wrap gap-x-4 gap-y-1">
                    {items.map((item) => (
                      <li key={item.id}>
                        <button
                          type="button"
                          onClick={() => jumpTo(item.id)}
                          className="text-left text-[13px] font-semibold text-[#4A453F] underline-offset-4 transition hover:text-[#E95B35] hover:underline"
                        >
                          {item.title}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </nav>

        {/* 详情区（单列 · 层级分明 · 不折叠） */}
        <section className="mt-10 space-y-12">
          {DIMS.map((dim) => {
            const items = itemsOf(dim.id);
            if (items.length === 0) return null;
            const Icon = dim.icon;
            return (
              <div key={dim.id} className="scroll-mt-4">
                {/* 维度分区标题：粘顶 + 图标色块，滚动时始终知道当前板块 */}
                <div
                  className="sticky top-0 z-10 -mx-1 mb-4 flex items-center gap-2.5 rounded-[12px] px-1 py-2 backdrop-blur"
                  style={{ backgroundColor: 'rgba(250,248,244,0.86)' }}
                >
                  <span
                    className="grid size-9 shrink-0 place-items-center rounded-[10px]"
                    style={{ backgroundColor: `${dim.color}1A`, color: dim.color }}
                  >
                    <Icon size={18} />
                  </span>
                  <h2 className="text-[19px] font-black leading-none text-[#2A2621]">{dim.label}</h2>
                  <span
                    className="ml-auto rounded-full px-2.5 py-1 text-[11.5px] font-bold"
                    style={{ backgroundColor: `${dim.color}14`, color: dim.color }}
                  >
                    {items.length} 条
                  </span>
                </div>

                <div className="space-y-4">
                  {items.map((item, index) => (
                    <ConclusionCard key={item.id} item={item} index={index + 1} color={dim.color} />
                  ))}
                </div>
              </div>
            );
          })}
        </section>

        <footer className="mt-12 text-center text-[12px] font-medium text-[#B7AEA3]">
          Demo · 仅用于对比新版「层级清晰 · 一次看清」的浏览体验，数据同「调研结论」。
        </footer>
      </div>
    </main>
  );
}

function ConclusionCard({ item, index, color = ACCENT }: { item: ResearchConclusion; index: number; color?: string }) {
  const stats = extractStats(`${item.conclusion} ${item.evidenceNote}`);

  return (
    <article
      id={`demo-item-${item.id}`}
      className="scroll-mt-16 overflow-hidden rounded-[16px] border border-[#ECE6DD] bg-white p-6 pl-7"
      style={{ boxShadow: `inset 4px 0 0 ${color}` }}
    >
      {/* 顶部：序号 */}
      <div className="flex items-center gap-2 text-[11px] font-black tracking-[0.1em]" style={{ color: `${color}80` }}>
        <span className="tabular-nums">{String(index).padStart(2, '0')}</span>
        <span className="h-px w-6" style={{ backgroundColor: `${color}40` }} />
      </div>

      {/* L1 主标题 */}
      <h3 className="mt-2.5 text-[20px] font-black leading-8 text-[#2A2621]">{item.title}</h3>

      {/* L2 副标题：一句话结论 */}
      <p className="mt-2 text-[14.5px] font-medium leading-7 text-[#6F675E]">
        <HighlightText color={color}>{item.conclusion}</HighlightText>
      </p>

      {/* L3 数字锚点 */}
      {stats.length > 0 && <KeyStat stats={stats} color={color} className="mt-4" />}

      {/* L4 核心要点 */}
      {item.conclusions.length > 0 && (
        <div className="mt-5 border-t pt-4" style={{ borderColor: DIVIDER }}>
          <p className="text-[11.5px] font-black tracking-[0.08em]" style={{ color }}>
            核心结论
          </p>
          <ul className="mt-2.5 space-y-2">
            {item.conclusions.map((point) => (
              <li key={point} className="flex items-start gap-2.5 text-[14px] font-medium leading-7 text-[#4A453F]">
                <span className="mt-[10px] size-1.5 shrink-0 rounded-full" style={{ background: `${color}99` }} />
                <span>
                  <HighlightText color={color}>{point}</HighlightText>
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* 支撑信息：建议行动（视觉降权） */}
      {item.actions.length > 0 && (
        <div className="mt-4 border-t pt-4" style={{ borderColor: DIVIDER }}>
          <p className="text-[11.5px] font-black tracking-[0.08em] text-[#A89C8C]">建议行动</p>
          <ul className="mt-2 space-y-1.5">
            {item.actions.map((action) => (
              <li key={action} className="flex items-start gap-2.5 text-[12.5px] font-medium leading-6 text-[#8A8279]">
                <span className="mt-[9px] size-1 shrink-0 rounded-full bg-[#CBBFAF]" />
                <span>{action}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* 支撑信息：来源（最弱） */}
      {item.evidenceNote && (
        <p className="mt-4 border-t pt-3 text-[11.5px] font-medium leading-6 text-[#B0A695]" style={{ borderColor: DIVIDER }}>
          {item.evidenceNote}
        </p>
      )}
    </article>
  );
}
