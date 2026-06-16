import React from 'react';
import { Sparkles, Target, Users, ShoppingBag, MapPin, Lightbulb } from 'lucide-react';
import {
  JTB_INTERVIEWS,
  JTB_MATRIX,
  JTB_UNPURCHASED_PRIORITY,
  buildJiatingbaoProject,
} from '../../store/jiatingbaoData';

function renderHighlighted(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) =>
    part.startsWith('**') && part.endsWith('**') ? (
      <strong key={i} className="font-semibold text-gray-900">{part.slice(2, -2)}</strong>
    ) : (
      <span key={i}>{part}</span>
    ),
  );
}

function Metric({ icon: Icon, label, value, note }: { icon: typeof Users; label: string; value: string; note: string }) {
  return (
    <div className="bg-white p-4">
      <div className="flex items-center gap-2 text-xs font-bold text-[#777]">
        <Icon size={14} className="text-[#e65532]" />
        {label}
      </div>
      <div className="mt-3 text-2xl font-bold text-[#252525]">{value}</div>
      <div className="mt-1 text-[11px] text-[#999]">{note}</div>
    </div>
  );
}

const CELL_TONE: Record<string, string> = {
  P0: 'bg-[#e65532]/8 border-[#e65532]/30',
  P1: 'bg-amber-50 border-amber-200',
  P2: 'bg-sky-50 border-sky-200',
  '—': 'bg-gray-50 border-gray-200',
};

export default function FamilyOverview() {
  const project = buildJiatingbaoProject();
  const summary = project.summaryData!;

  const purchased = JTB_INTERVIEWS.filter((i) => i.status === '已购').length;
  const unpurchased = JTB_INTERVIEWS.filter((i) => i.status === '未购').length;
  const regions = Array.from(new Set(JTB_INTERVIEWS.map((i) => i.region.slice(0, 2))));

  return (
    <main className="min-h-full bg-[#f8f8f5] px-5 py-5">
      <div className="mx-auto max-w-[1180px]">
        {/* Header */}
        <header className="border-b border-[#d8d7d0] pb-4">
          <div className="text-xs font-bold text-[#e65532]">洋葱家庭包 · 定性调研</div>
          <h1 className="mt-1 text-2xl font-bold text-[#252525]">项目总览</h1>
          <p className="mt-1 text-sm text-[#777]">
            围绕「6 年多孩家庭包」的购买动机、决策路径与使用预期，访谈 11 位家庭，提炼分层洞察与机会点。
          </p>
        </header>

        {/* Metrics */}
        <section className="mt-5 grid gap-px border border-[#d8d7d0] bg-[#d8d7d0] sm:grid-cols-2 lg:grid-cols-4">
          <Metric icon={Users} label="受访家庭" value={String(JTB_INTERVIEWS.length)} note="多孩家庭为主" />
          <Metric icon={ShoppingBag} label="已购 / 未购" value={`${purchased} / ${unpurchased}`} note="覆盖首购·续购·升单·未购" />
          <Metric icon={MapPin} label="地区覆盖" value={String(regions.length)} note={regions.join(' · ')} />
          <Metric icon={Target} label="核心洞察" value="7" note="决策锚点 / 价值感知 / 机会点等" />
        </section>

        {/* Research background */}
        <section className="mt-5 rounded-xl border border-[#d8d7d0] bg-white p-5">
          <div className="flex items-center gap-2">
            <Lightbulb size={15} className="text-[#e65532]" />
            <h2 className="text-base font-bold text-[#252525]">研究背景</h2>
          </div>
          <p className="mt-2 text-sm leading-7 text-[#555]">{summary.methodology}</p>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400">核心发现</p>
              <ul className="mt-2 space-y-2">
                {summary.coreFindings.map((f, i) => (
                  <li key={i} className="flex gap-2 text-[13px] leading-6 text-[#444]">
                    <span className="mt-0.5 shrink-0 text-xs font-bold text-[#e65532]">0{i + 1}</span>
                    {f}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400">行动建议</p>
              <ul className="mt-2 space-y-2">
                {summary.actionItems.map((a, i) => (
                  <li key={i} className="flex gap-2 text-[13px] leading-6 text-[#444]">
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[#37a87a]" />
                    {a}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Priority matrix */}
        <section className="mt-5 rounded-xl border border-[#d8d7d0] bg-white p-5">
          <div className="flex items-center gap-2">
            <Target size={15} className="text-[#e65532]" />
            <h2 className="text-base font-bold text-[#252525]">已购用户优先级矩阵</h2>
            <span className="text-[11px] text-gray-400">大盘规模 × 转化率 · 按年级组合分层</span>
          </div>

          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[640px] border-collapse text-left">
              <thead>
                <tr>
                  <th className="w-[120px] border border-[#e5e4de] bg-[#faf9f6] p-3 text-[12px] font-bold text-gray-400" />
                  <th className="border border-[#e5e4de] bg-[#faf9f6] p-3 text-[12px] font-bold text-[#555]">大盘规模大（&gt;3%）</th>
                  <th className="border border-[#e5e4de] bg-[#faf9f6] p-3 text-[12px] font-bold text-[#555]">大盘规模小（&lt;3%）</th>
                </tr>
              </thead>
              <tbody>
                {(['高', '低'] as const).map((conv) => (
                  <tr key={conv}>
                    <td className="border border-[#e5e4de] bg-[#faf9f6] p-3 text-[12px] font-bold text-[#555]">
                      转化率{conv}（{conv === '高' ? '>5%' : '<3%'}）
                    </td>
                    {(['大', '小'] as const).map((scale) => {
                      const cell = JTB_MATRIX.find((c) => c.conversion === conv && c.scale === scale);
                      if (!cell) return <td key={scale} className="border border-[#e5e4de] p-3" />;
                      return (
                        <td key={scale} className={`border border-[#e5e4de] p-3 align-top ${CELL_TONE[cell.priority] ?? ''}`}>
                          <span className="inline-block rounded-md bg-white/70 px-1.5 py-0.5 text-[11px] font-extrabold text-[#e65532]">
                            {cell.priority}
                          </span>
                          <ul className="mt-2 space-y-1">
                            {cell.combos.map((c, i) => (
                              <li key={i} className="text-[12px] leading-5 text-[#444]">· {c}</li>
                            ))}
                          </ul>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-3 rounded-lg bg-[#faf9f6] px-3 py-2.5">
            <span className="text-[12px] font-bold text-[#555]">未购人群优先级：</span>
            <span className="text-[12px] text-[#666]">{JTB_UNPURCHASED_PRIORITY.join(' / ')}</span>
          </div>
        </section>

        {/* Quick insight teaser */}
        <section className="mt-5 rounded-xl border border-[#e65532]/20 bg-[#e65532]/[0.04] p-5">
          <div className="flex items-center gap-2">
            <Sparkles size={15} className="text-[#e65532]" />
            <h2 className="text-base font-bold text-[#252525]">一句话结论</h2>
          </div>
          <p className="mt-2 text-sm leading-7 text-[#555]">
            {renderHighlighted(
              '家庭包卖的不是「更多课程」，而是**一套被规划好、被看见、能闭环**的多孩长期学习方案：用**大孩升学**促成交、用**二孩权益与 6 年价值**把高客单价合理化，再用**学习规划感 + 学习闭环**打消「怕浪费、不坚持」的共性顾虑。详见「核心洞察」与「用户访谈」。',
            )}
          </p>
        </section>
      </div>
    </main>
  );
}
