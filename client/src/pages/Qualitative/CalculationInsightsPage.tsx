import React from 'react';
import {
  ArrowRight,
  BarChart3,
  BookOpenCheck,
  BriefcaseBusiness,
  CircleAlert,
  Compass,
  Lightbulb,
  Scale,
} from 'lucide-react';
import {
  CALCULATION_INSIGHT_THEMES,
  CalculationInsightTheme,
  InsightEvidenceType,
} from '../../store/calculationInsightsData';
import { cn } from '@/lib/utils';

const TYPE_STYLES: Record<InsightEvidenceType, string> = {
  问卷定量: 'bg-blue-50 text-blue-700 border-blue-100',
  行业数据: 'bg-teal-50 text-teal-700 border-teal-100',
  业务数据: 'bg-amber-50 text-amber-700 border-amber-100',
  案头研究: 'bg-violet-50 text-violet-700 border-violet-100',
  策略推演: 'bg-rose-50 text-rose-700 border-rose-100',
};

const THEME_COLORS: Record<CalculationInsightTheme['id'], string> = {
  segments: '#5B7BBF',
  decision: '#BF9455',
  service: '#4BA69E',
  renewal: '#E07A6E',
};

function SourceBadge({ source }: { source: string }) {
  return (
    <span className="inline-flex items-center rounded-full border border-gray-200 bg-white px-2 py-0.5 text-[10px] font-medium text-gray-500">
      {source}
    </span>
  );
}

export default function CalculationInsightsPage() {
  const [activeId, setActiveId] = React.useState<CalculationInsightTheme['id']>('segments');
  const theme = CALCULATION_INSIGHT_THEMES.find((item) => item.id === activeId)
    ?? CALCULATION_INSIGHT_THEMES[0];
  const color = THEME_COLORS[theme.id];

  return (
    <div className="flex h-full min-h-0 flex-col bg-[#F6F7F5]">
      <header className="shrink-0 border-b border-[#E8E2D9] bg-[#FEFDF9] px-4 pt-4 sm:px-6">
        <div className="mx-auto flex max-w-[1240px] items-start gap-3">
          <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#FF5722]/10 text-[#FF5722]">
            <BarChart3 size={16} />
          </div>
          <div>
            <h2 className="text-[16px] font-bold text-gray-900">行业研究洞察</h2>
            <p className="mt-0.5 text-[11px] text-gray-400">
              定量问卷为主证据，结合行业研究、业务数据与策略分析
            </p>
          </div>
        </div>

        <div className="mx-auto mt-4 flex max-w-[1240px] overflow-x-auto">
          {CALCULATION_INSIGHT_THEMES.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveId(item.id)}
              className={cn(
                'relative shrink-0 px-4 py-3 text-[13px] font-medium transition-colors sm:px-5',
                activeId === item.id ? 'font-bold' : 'text-gray-500 hover:text-gray-700',
              )}
              style={activeId === item.id ? { color: THEME_COLORS[item.id] } : undefined}
            >
              {item.tab}
              {activeId === item.id && (
                <span
                  className="absolute inset-x-3 bottom-0 h-0.5 rounded-full"
                  style={{ backgroundColor: THEME_COLORS[item.id] }}
                />
              )}
            </button>
          ))}
        </div>
      </header>

      <main className="min-h-0 flex-1 overflow-y-auto">
        <div className="mx-auto max-w-[1240px] space-y-5 px-4 py-6 sm:px-6 sm:py-8">
          <section
            className="overflow-hidden rounded-[24px] border bg-white shadow-[0_12px_35px_rgba(30,35,40,0.06)]"
            style={{ borderColor: `${color}35` }}
          >
            <div className="grid gap-8 p-6 lg:grid-cols-[1.45fr_0.8fr] lg:p-8">
              <div>
                <p className="text-[11px] font-bold tracking-[0.16em]" style={{ color }}>
                  {theme.eyebrow}
                </p>
                <h1 className="mt-3 max-w-4xl text-[26px] font-black leading-[1.3] text-[#242421] sm:text-[32px]">
                  {theme.title}
                </h1>
                <p className="mt-4 max-w-4xl text-[14px] leading-7 text-gray-600">
                  {theme.thesis}
                </p>
              </div>

              <div className="rounded-2xl border border-gray-100 bg-[#F8F8F6] p-4">
                <div className="flex items-center gap-2 text-[11px] font-bold text-gray-500">
                  <Compass size={13} style={{ color }} />
                  本主题涉及的方案
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {theme.involved.map((name) => (
                    <span
                      key={name}
                      className="rounded-full border bg-white px-3 py-1.5 text-[11px] font-semibold text-gray-700"
                      style={{ borderColor: `${color}35` }}
                    >
                      {name}
                    </span>
                  ))}
                </div>
                <p className="mt-4 border-t border-gray-200 pt-3 text-[11px] leading-5 text-gray-400">
                  竞品仅在支持当前结论时出现，完整详情仍在“竞品与市场”页查看。
                </p>
              </div>
            </div>
          </section>

          <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {theme.metrics.map((metric) => (
              <article key={`${metric.value}-${metric.label}`} className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
                <div className="flex items-start justify-between gap-2">
                  <span className="text-[25px] font-black tracking-tight" style={{ color }}>
                    {metric.value}
                  </span>
                  <span className={cn('rounded-full border px-2 py-0.5 text-[9px] font-semibold', TYPE_STYLES[metric.type])}>
                    {metric.type}
                  </span>
                </div>
                <h3 className="mt-2 text-[13px] font-bold text-gray-900">{metric.label}</h3>
                <p className="mt-1.5 min-h-[42px] text-[11px] leading-[1.65] text-gray-500">{metric.detail}</p>
                <div className="mt-3 flex flex-wrap items-center gap-1.5 border-t border-gray-100 pt-3">
                  <span className="text-[9px] text-gray-400">{metric.scope}</span>
                  <SourceBadge source={metric.source} />
                </div>
              </article>
            ))}
          </section>

          <section className="rounded-[22px] border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="flex items-center gap-2">
              <Scale size={16} style={{ color }} />
              <h2 className="text-[15px] font-bold text-gray-900">{theme.comparisonTitle}</h2>
            </div>
            <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {theme.comparisons.map((item) => (
                <article key={item.name} className="rounded-2xl border border-gray-100 bg-[#FAFAF8] p-4">
                  <div className="flex items-center gap-2">
                    <span
                      className="flex h-7 w-7 items-center justify-center rounded-lg text-[11px] font-black text-white"
                      style={{ backgroundColor: item.color }}
                    >
                      {item.name.charAt(0)}
                    </span>
                    <div>
                      <h3 className="text-[12px] font-bold text-gray-900">{item.name}</h3>
                      <p className="text-[9px] font-medium text-gray-400">{item.role}</p>
                    </div>
                  </div>
                  <div className="mt-3 space-y-2 text-[11px] leading-[1.6]">
                    <p className="text-gray-600"><strong className="text-gray-800">优势：</strong>{item.strength}</p>
                    <p className="text-gray-500"><strong className="text-gray-700">缺口：</strong>{item.gap}</p>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="grid gap-4 lg:grid-cols-2">
            <article className="rounded-[22px] border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
              <div className="flex items-center gap-2">
                <BookOpenCheck size={16} style={{ color }} />
                <h2 className="text-[15px] font-bold text-gray-900">证据意味着什么</h2>
              </div>
              <div className="mt-4 space-y-3">
                {theme.interpretations.map((text, index) => (
                  <div key={text} className="flex gap-3 rounded-xl bg-[#F8F8F6] px-3.5 py-3">
                    <span
                      className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[9px] font-bold text-white"
                      style={{ backgroundColor: color }}
                    >
                      {index + 1}
                    </span>
                    <p className="text-[12px] leading-6 text-gray-600">{text}</p>
                  </div>
                ))}
              </div>
            </article>

            <article className="rounded-[22px] border p-5 shadow-sm sm:p-6" style={{ borderColor: `${color}35`, backgroundColor: `${color}08` }}>
              <div className="flex items-center gap-2">
                <BriefcaseBusiness size={16} style={{ color }} />
                <h2 className="text-[15px] font-bold text-gray-900">业务启示</h2>
              </div>
              <div className="mt-4 space-y-3">
                {theme.actions.map((text) => (
                  <div key={text} className="flex gap-2.5">
                    <ArrowRight size={14} className="mt-1 shrink-0" style={{ color }} />
                    <p className="text-[12px] font-medium leading-6 text-gray-700">{text}</p>
                  </div>
                ))}
              </div>
              <div className="mt-5 flex items-start gap-2 rounded-xl border border-white/70 bg-white/70 px-3.5 py-3">
                <Lightbulb size={14} className="mt-0.5 shrink-0" style={{ color }} />
                <p className="text-[11px] leading-5 text-gray-500">
                  这里给出的是当前证据下的优先行动方向，策略推演仍需通过产品实验和转化数据验证。
                </p>
              </div>
            </article>
          </section>

          <section className="flex items-start gap-2 rounded-xl border border-amber-100 bg-amber-50/70 px-4 py-3">
            <CircleAlert size={14} className="mt-0.5 shrink-0 text-amber-600" />
            <p className="text-[10px] leading-5 text-amber-800">
              <strong>口径说明：</strong>{theme.caveat}
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
