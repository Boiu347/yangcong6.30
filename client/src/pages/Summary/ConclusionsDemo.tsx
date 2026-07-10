import React from 'react';
import {
  BookOpenCheck,
  ChevronRight,
  Lightbulb,
  SearchCheck,
  Sparkles,
  Target,
} from 'lucide-react';
import { reportConclusions, type ResearchConclusion } from './FromPrimaryMergedReport';
import { HighlightText } from '@/components/report/HighlightText';
import { KeyStat, extractStats, type Stat } from '@/components/report/KeyStat';
import { Disclosure } from '@/components/report/Disclosure';
import { firstSentence, restAfterFirstSentence } from '@/components/report/reportText';

// Demo：把「调研结论」从「文档式仓库」改成「地图式浏览」
//   降噪原则：全页只用一个强调色；维度色仅作小色点区分；单列阅读动线；每卡只保留一个折叠。

const ACCENT = '#E95B35';
const BORDER = '#ECE6DD';

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

function firstStatOf(items: ResearchConclusion[]): Stat | null {
  for (const item of items) {
    const stats = extractStats(`${item.conclusion} ${item.evidenceNote}`, 1);
    if (stats.length > 0) return stats[0];
  }
  return null;
}

export default function ConclusionsDemo() {
  const jumpTo = React.useCallback((id: string) => {
    document.getElementById(`demo-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  return (
    <main className="min-h-full bg-[#FAF8F4] text-[#2A2621]">
      <div className="mx-auto max-w-[860px] px-5 py-9 md:px-6">
        <header>
          <p className="text-[12px] font-bold tracking-[0.14em] text-[#B29B7E]">从小学系列售卖策略调研 · DEMO</p>
          <h1 className="mt-2.5 text-[28px] font-black leading-tight md:text-[34px]">结论速览</h1>
          <p className="mt-2.5 text-[14px] font-medium leading-7 text-[#8A8279]">
            先看这面墙的 5 句结论，30 秒抓住全貌；想深挖某一块，点卡片跳到详情。
          </p>
        </header>

        {/* ① 结论速览墙 */}
        <section className="mt-6 grid gap-2.5 sm:grid-cols-2">
          {DIMS.map((dim) => {
            const items = itemsOf(dim.id);
            if (items.length === 0) return null;
            const Icon = dim.icon;
            const headline = firstSentence(items[0].insight);
            const stat = firstStatOf(items);
            return (
              <button
                key={dim.id}
                type="button"
                onClick={() => jumpTo(dim.id)}
                className="group flex h-full flex-col rounded-[14px] border bg-white p-4 text-left transition hover:border-[#DcCFbf]"
                style={{ borderColor: BORDER }}
              >
                <div className="flex items-center gap-2">
                  <span className="size-1.5 rounded-full" style={{ backgroundColor: dim.color }} />
                  <span className="text-[12.5px] font-bold text-[#6F675E]">{dim.label}</span>
                  <span className="ml-auto text-[11px] font-semibold text-[#C3B9AC]">{items.length} 条</span>
                </div>

                <p className="mt-2.5 line-clamp-2 min-h-[44px] text-[15px] font-bold leading-6 text-[#2A2621]">
                  {headline}
                </p>

                <div className="mt-3 flex items-baseline gap-2 border-t pt-3" style={{ borderColor: BORDER }}>
                  {stat ? (
                    <>
                      <span className="text-[22px] font-black leading-none" style={{ color: ACCENT }}>
                        {stat.value}
                      </span>
                      {stat.label && <span className="text-[11px] font-semibold text-[#9A8F82]">{stat.label}</span>}
                    </>
                  ) : (
                    <span className="text-[12px] font-semibold text-[#C3B9AC]">查看结论</span>
                  )}
                  <ChevronRight
                    size={15}
                    className="ml-auto text-[#C3B9AC] transition group-hover:translate-x-0.5"
                  />
                </div>
              </button>
            );
          })}
        </section>

        {/* ② 详情区（单列 · 瘦身版） */}
        <section className="mt-10 space-y-9">
          {DIMS.map((dim) => {
            const items = itemsOf(dim.id);
            if (items.length === 0) return null;
            return (
              <div key={dim.id} id={`demo-${dim.id}`} className="scroll-mt-4">
                <div className="mb-3.5 flex items-center gap-2">
                  <span className="size-2 rounded-full" style={{ backgroundColor: dim.color }} />
                  <h2 className="text-[17px] font-black text-[#2A2621]">{dim.label}</h2>
                  <span className="text-[12px] font-semibold text-[#C3B9AC]">{items.length} 条结论</span>
                </div>

                <div className="space-y-2.5">
                  {items.map((item, index) => (
                    <ConclusionCard key={item.id} item={item} index={index + 1} />
                  ))}
                </div>
              </div>
            );
          })}
        </section>

        <footer className="mt-12 text-center text-[12px] font-medium text-[#B7AEA3]">
          Demo · 仅用于对比新版「速览优先 + 详情瘦身」的浏览体验，数据同「调研结论」。
        </footer>
      </div>
    </main>
  );
}

function ConclusionCard({ item, index }: { item: ResearchConclusion; index: number }) {
  const headline = firstSentence(item.insight);
  const rest = restAfterFirstSentence(item.insight);
  const stats = extractStats(`${item.conclusion} ${item.evidenceNote}`);
  const points = item.conclusions.slice(0, 3);
  const hasMore = Boolean(rest) || item.actions.length > 0 || Boolean(item.evidenceNote);

  return (
    <article className="rounded-[14px] border bg-white p-5" style={{ borderColor: BORDER }}>
      {/* 金句：一级信息 */}
      <div className="flex gap-3">
        <span className="mt-0.5 text-[13px] font-black tabular-nums text-[#D8CDBE]">{String(index).padStart(2, '0')}</span>
        <p className="text-[16px] font-bold leading-7 text-[#2A2621]">
          <HighlightText color={ACCENT}>{headline}</HighlightText>
        </p>
      </div>

      {stats.length > 0 && <KeyStat stats={stats} color={ACCENT} className="mt-3.5 pl-7" />}

      {/* 核心要点：二级信息 */}
      {points.length > 0 && (
        <ul className="mt-3.5 space-y-1.5 pl-7">
          {points.map((pt) => (
            <li key={pt} className="flex items-start gap-2 text-[13.5px] font-medium leading-6 text-[#5A544C]">
              <span className="mt-[9px] size-1 shrink-0 rounded-full" style={{ background: `${ACCENT}88` }} />
              <span>
                <HighlightText color={ACCENT}>{pt}</HighlightText>
              </span>
            </li>
          ))}
        </ul>
      )}

      {/* 三级信息：合并为单个折叠 */}
      {hasMore && (
        <div className="mt-3.5 pl-7">
          <Disclosure label="展开完整洞察与建议" color={ACCENT}>
            <div className="space-y-4">
              {rest && (
                <p className="text-[13.5px] font-medium leading-7 text-[#5A544C]">
                  <HighlightText color={ACCENT}>{rest}</HighlightText>
                </p>
              )}
              {item.actions.length > 0 && (
                <div>
                  <p className="mb-1.5 text-[12px] font-bold text-[#8A8279]">建议行动</p>
                  <ul className="space-y-1.5">
                    {item.actions.map((action) => (
                      <li key={action} className="rounded-[10px] bg-[#FBFAF7] px-3 py-2 text-[13px] font-medium leading-6 text-[#4A453F]">
                        {action}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {item.evidenceNote && (
                <p className="border-l-2 pl-3 text-[12px] font-medium leading-6 text-[#8A8279]" style={{ borderColor: BORDER }}>
                  {item.evidenceNote}
                </p>
              )}
            </div>
          </Disclosure>
        </div>
      )}
    </article>
  );
}
