import React from 'react';
import {
  ArrowRight,
  BookOpenCheck,
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
//   ① 顶部结论速览墙：一眼看完 5 个维度的结论钩子
//   ② 详情默认瘦身：只给金句 + 短要点，完整洞察 / 建议行动 / 来源折叠

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
    <main className="min-h-full bg-[#F8F6F1] text-[#292521]">
      <header className="px-5 pt-8 md:px-8">
        <div className="mx-auto max-w-[1120px]">
          <p className="text-[12px] font-black tracking-[0.16em] text-[#E95B35]">从小学系列售卖策略调研 · DEMO</p>
          <h1 className="mt-3 text-[30px] font-black leading-tight md:text-[40px]">结论速览</h1>
          <p className="mt-3 max-w-2xl text-[14px] font-semibold leading-7 text-[#8A8279]">
            先给全貌：5 个维度的结论钩子一眼看完；想深挖再点开。90% 的人看完这面墙 + 金句就够了。
          </p>
        </div>
      </header>

      {/* ① 结论速览墙 */}
      <section className="px-5 pt-6 md:px-8">
        <div className="mx-auto grid max-w-[1120px] gap-3 sm:grid-cols-2 lg:grid-cols-3">
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
                className="group flex flex-col rounded-[18px] border bg-white p-5 text-left transition hover:-translate-y-0.5 hover:shadow-[0_16px_36px_rgba(55,44,34,.09)]"
                style={{ borderColor: `${dim.color}33` }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="grid size-9 place-items-center rounded-full" style={{ backgroundColor: `${dim.color}18`, color: dim.color }}>
                      <Icon size={18} />
                    </span>
                    <span className="text-[14px] font-black" style={{ color: dim.color }}>
                      {dim.label}
                    </span>
                  </div>
                  <span className="text-[11px] font-bold text-[#B7ADA1]">{items.length} 条</span>
                </div>

                <p className="mt-3 min-h-[52px] text-[16px] font-black leading-7 text-[#292521]">
                  <HighlightText color={dim.color}>{headline}</HighlightText>
                </p>

                <div className="mt-auto flex items-end justify-between pt-3">
                  {stat ? (
                    <div>
                      <div className="text-[26px] font-black leading-none" style={{ color: dim.color }}>
                        {stat.value}
                      </div>
                      {stat.label && <div className="mt-1 text-[11px] font-bold text-[#9A8F82]">{stat.label}</div>}
                    </div>
                  ) : (
                    <span />
                  )}
                  <span className="flex items-center gap-1 text-[11px] font-black opacity-0 transition group-hover:opacity-100" style={{ color: dim.color }}>
                    看详情 <ArrowRight size={12} />
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* ② 详情区（瘦身版） */}
      <section className="px-5 py-8 md:px-8">
        <div className="mx-auto max-w-[1120px] space-y-10">
          {DIMS.map((dim) => {
            const items = itemsOf(dim.id);
            if (items.length === 0) return null;
            const Icon = dim.icon;
            return (
              <div key={dim.id} id={`demo-${dim.id}`} className="scroll-mt-6">
                <div className="mb-4 flex items-center gap-2.5">
                  <span className="grid size-8 place-items-center rounded-full" style={{ backgroundColor: `${dim.color}18`, color: dim.color }}>
                    <Icon size={17} />
                  </span>
                  <h2 className="text-[20px] font-black" style={{ color: '#292521' }}>
                    {dim.label}
                  </h2>
                  <span className="text-[12px] font-bold text-[#B7ADA1]">{items.length} 条结论</span>
                </div>

                <div className="grid gap-3 lg:grid-cols-2">
                  {items.map((item) => (
                    <ConclusionCard key={item.id} item={item} color={dim.color} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <footer className="px-5 pb-10 text-center text-[12px] font-semibold text-[#A19990] md:px-8">
        Demo · 仅用于对比新版「速览优先 + 详情瘦身」的浏览体验；数据同「调研结论」。
      </footer>
    </main>
  );
}

function ConclusionCard({ item, color }: { item: ResearchConclusion; color: string }) {
  const headline = firstSentence(item.insight);
  const rest = restAfterFirstSentence(item.insight);
  const stats = extractStats(`${item.conclusion} ${item.evidenceNote}`);
  const points = item.conclusions.slice(0, 3);

  return (
    <article
      className="flex flex-col rounded-[16px] border bg-white p-5"
      style={{ borderColor: `${color}26` }}
    >
      <p className="text-[11px] font-black tracking-[0.08em]" style={{ color }}>
        {item.title}
      </p>

      {/* 金句：一级信息 */}
      <p className="mt-2 text-[18px] font-black leading-7 text-[#292521]">
        <HighlightText color={color}>{headline}</HighlightText>
      </p>

      {stats.length > 0 && <KeyStat stats={stats} color={color} className="mt-3" />}

      {/* 核心结论短要点：二级信息 */}
      {points.length > 0 && (
        <ul className="mt-3 space-y-1.5">
          {points.map((pt) => (
            <li key={pt} className="flex items-start gap-2 text-[13.5px] font-semibold leading-6 text-[#4a453f]">
              <span className="mt-[9px] size-1 shrink-0 rounded-full" style={{ background: `${color}99` }} />
              <span>
                <HighlightText color={color}>{pt}</HighlightText>
              </span>
            </li>
          ))}
        </ul>
      )}

      {/* 三级信息：折叠 */}
      <div className="mt-3 space-y-2">
        {rest && (
          <Disclosure label="展开完整洞察" color={color} icon={<BookOpenCheck size={13} />}>
            <p className="text-[13.5px] font-medium leading-7 text-[#4a453f]">
              <HighlightText color={color}>{rest}</HighlightText>
            </p>
          </Disclosure>
        )}
        {item.actions.length > 0 && (
          <Disclosure label="建议行动" color={color} icon={<Target size={13} />} count={item.actions.length}>
            <ul className="space-y-1.5">
              {item.actions.map((action) => (
                <li key={action} className="rounded-[10px] bg-[#FBFAF7] px-3 py-2 text-[13px] font-semibold leading-6 text-[#403A34]">
                  {action}
                </li>
              ))}
            </ul>
          </Disclosure>
        )}
        {item.evidenceNote && (
          <Disclosure label="查看来源" color={color} icon={<Lightbulb size={13} />}>
            <p className="rounded-[10px] border border-[#E6DDD3] bg-[#FBFAF7] px-3 py-2 text-[12px] font-semibold leading-6 text-[#7D746A]">
              {item.evidenceNote}
            </p>
          </Disclosure>
        )}
      </div>
    </article>
  );
}
