import {
  ArrowLeft,
  BookOpen,
  ChevronRight,
  FileText,
  MessageSquareQuote,
  Monitor,
  ShoppingCart,
  Target,
  Users,
} from 'lucide-react';
import type React from 'react';
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProjects } from '../../store/useProjectStore';
import type { Sentiment } from '../../types/voc';
import {
  buildBusinessDirections,
  buildCategoryInsightData,
  CATEGORY_EXECUTIVE_SUMMARIES,
  INSIGHT_CATEGORY_CONFIGS,
  type BusinessDirection,
  type CategoryQuote,
  type InsightCategorySlug,
} from './categoryInsights';

const iconMap = {
  'app-experience': Monitor,
  'course-experience': BookOpen,
  'purchase-decision': ShoppingCart,
} satisfies Record<InsightCategorySlug, typeof Monitor>;

const sentimentMeta: Record<Sentiment, { label: string; color: string; bg: string }> = {
  positive: { label: '正向', color: '#168a55', bg: '#eaf8f0' },
  neutral: { label: '中性', color: '#6f6a63', bg: '#f2f1ed' },
  negative: { label: '负向', color: '#bf3b2b', bg: '#fff0ec' },
};

interface InsightCategoryPageProps {
  slug: InsightCategorySlug;
}

export default function InsightCategoryPage({ slug }: InsightCategoryPageProps) {
  const navigate = useNavigate();
  const projects = useProjects();
  const config = INSIGHT_CATEGORY_CONFIGS[slug];
  const summary = CATEGORY_EXECUTIVE_SUMMARIES[slug];
  const Icon = iconMap[slug];
  const data = useMemo(() => buildCategoryInsightData(projects, slug), [projects, slug]);
  const directions = useMemo(() => buildBusinessDirections(slug, data.quotes), [data.quotes, slug]);

  return (
    <main className="min-h-[calc(100vh-52px)] bg-[#f4f5f2]">
      <section className="border-b border-[#e2dfd7] bg-white">
        <div className="mx-auto max-w-6xl px-4 py-7 sm:px-6">
          <button
            type="button"
            onClick={() => navigate('/qualitative-research')}
            className="mb-4 inline-flex h-9 items-center gap-1.5 rounded-md border border-[#ded8cd] bg-white px-3 text-sm font-bold text-[#5f5a52] transition hover:bg-[#f7f4ee]"
          >
            <ArrowLeft size={15} />
            返回定性调研
          </button>

          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <div className="mb-3 flex items-center gap-2">
                <span
                  className="flex h-9 w-9 items-center justify-center rounded-lg"
                  style={{ backgroundColor: config.tint, color: config.color }}
                >
                  <Icon size={19} />
                </span>
                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[#928b80]">
                  Topic Map
                </span>
              </div>
              <h1 className="text-[28px] font-extrabold leading-tight text-[#25231f] sm:text-[34px]">
                {config.title}
              </h1>
              <p className="mt-3 max-w-3xl text-[15px] leading-7 text-[#5f5a52]">
                {summary.verdict}
              </p>
            </div>
            <div className="grid grid-cols-3 gap-2 lg:w-[320px]">
              <TopMetric label="维度" value={directions.length} color={config.color} />
              <TopMetric label="原声" value={data.totalQuotes} color={config.color} />
              <TopMetric label="项目" value={data.totalProjects} color={config.color} />
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
        <div className="mb-5 rounded-lg border border-[#e4dfd6] bg-white p-4">
          <h2 className="text-lg font-extrabold text-[#25231f]">业务维度</h2>
          <p className="mt-1 text-sm leading-6 text-[#7a746b]">
            先按业务方可读的维度理解问题，再点开查看该维度下的全部用户原声。
          </p>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          {directions.map((direction, index) => (
            <DirectionCard
              key={direction.id}
              direction={direction}
              index={index + 1}
              color={config.color}
              tint={config.tint}
              onOpen={() => navigate(`/qualitative-research/${slug}/${direction.id}`)}
            />
          ))}
        </div>
      </section>
    </main>
  );
}

function DirectionCard({
  direction,
  index,
  color,
  tint,
  onOpen,
}: {
  direction: BusinessDirection;
  index: number;
  color: string;
  tint: string;
  onOpen: () => void;
}) {
  const disabled = direction.quotes.length === 0;
  const representativeQuote = direction.representativeQuotes[0];

  return (
    <article
      className={`rounded-lg border bg-white p-5 shadow-sm transition ${
        disabled ? 'border-[#e7e1d8] opacity-60' : 'border-[#e3dfd6] hover:-translate-y-0.5 hover:shadow-md'
      }`}
    >
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <span
          className="inline-flex h-7 min-w-7 items-center justify-center rounded-md px-2 text-xs font-extrabold"
          style={{ backgroundColor: tint, color }}
        >
          {String(index).padStart(2, '0')}
        </span>
        {direction.projectNames.slice(0, 3).map((name) => (
          <span key={name} className="rounded-full bg-[#f4f2ec] px-2.5 py-1 text-xs font-medium text-[#6f6a63]">
            {name}
          </span>
        ))}
        {direction.projectNames.length === 0 && (
          <span className="rounded-full bg-[#f4f2ec] px-2.5 py-1 text-xs font-medium text-[#8a857d]">
            暂无匹配原声
          </span>
        )}
      </div>

      <h3 className="text-xl font-extrabold leading-snug text-[#25231f]">{direction.title}</h3>
      <p className="mt-3 text-sm leading-6 text-[#5f5a52]">{direction.businessImpact}</p>

      <div className="mt-4 grid gap-2 sm:grid-cols-3">
        <MiniMetric icon={<MessageSquareQuote size={14} />} label="原声" value={direction.quotes.length} />
        <MiniMetric icon={<FileText size={14} />} label="材料" value={direction.sourceCount} />
        <MiniMetric icon={<Users size={14} />} label="项目" value={direction.projectNames.length} />
      </div>

      <div className="mt-4">
        <div className="mb-2 text-xs font-bold text-[#8a857d]">关键发现</div>
        <ul className="space-y-1.5">
          {direction.findings.map((finding) => (
            <li key={finding} className="flex gap-2 text-sm leading-6 text-[#46413a]">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full" style={{ backgroundColor: color }} />
              <span>{finding}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-4 rounded-lg border border-[#ebe7de] bg-[#fbfaf7] p-3">
        <div className="mb-1 flex items-center gap-2 text-xs font-bold text-[#6f6a63]">
          <Target size={13} style={{ color }} />
          建议动作
        </div>
        <p className="text-sm leading-6 text-[#46413a]">{direction.action}</p>
      </div>

      <div className="mt-4">
        <div className="mb-2 flex items-center justify-between gap-2">
          <div className="text-xs font-bold text-[#8a857d]">代表原声</div>
          <SentimentPills counts={direction.sentimentCounts} />
        </div>
        {representativeQuote ? (
          <QuotePreview quote={representativeQuote} color={color} />
        ) : (
          <div className="rounded-lg border border-dashed border-[#d8d1c5] bg-[#fbfaf7] p-4 text-sm text-[#8a857d]">
            暂无匹配原声，后续补充访谈材料后自动进入该维度。
          </div>
        )}
      </div>

      <button
        type="button"
        disabled={disabled}
        onClick={onOpen}
        className="mt-4 inline-flex h-9 items-center gap-1.5 rounded-md border border-[#ded8cd] bg-white px-3 text-sm font-bold text-[#5f5a52] transition hover:bg-[#f7f4ee] disabled:cursor-not-allowed disabled:opacity-50"
      >
        查看全部原声
        <ChevronRight size={14} />
      </button>
    </article>
  );
}

function TopMetric({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="rounded-lg border border-[#ebe7de] bg-[#fbfaf7] px-3 py-3">
      <div className="text-xs font-medium text-[#8a857d]">{label}</div>
      <div className="mt-1 text-2xl font-extrabold" style={{ color }}>
        {value}
      </div>
    </div>
  );
}

function MiniMetric({ icon, label, value }: { icon: React.ReactNode; label: string; value: number }) {
  return (
    <div className="flex items-center gap-2 rounded-lg bg-[#f7f5ef] px-3 py-2">
      <span className="text-[#9a948b]">{icon}</span>
      <div>
        <div className="text-[11px] text-[#8a857d]">{label}</div>
        <div className="text-sm font-extrabold text-[#2b2925]">{value}</div>
      </div>
    </div>
  );
}

function SentimentPills({ counts }: { counts: Record<Sentiment, number> }) {
  return (
    <div className="flex items-center gap-1">
      {(['positive', 'neutral', 'negative'] as Sentiment[]).map((sentiment) => (
        <span
          key={sentiment}
          className="rounded-full px-2 py-0.5 text-[10px] font-bold"
          style={{ backgroundColor: sentimentMeta[sentiment].bg, color: sentimentMeta[sentiment].color }}
        >
          {sentimentMeta[sentiment].label} {counts[sentiment]}
        </span>
      ))}
    </div>
  );
}

function QuotePreview({ quote, color }: { quote: CategoryQuote; color: string }) {
  return (
    <blockquote className="rounded-lg border border-[#e8e3da] bg-white p-3">
      <div className="mb-2 flex items-center gap-2">
        <span className="h-2 w-2 rounded-full" style={{ backgroundColor: color }} />
        <span className="truncate text-xs font-bold text-[#6f6a63]">{quote.respondent || quote.sourceName}</span>
      </div>
      <p className="line-clamp-4 text-sm leading-6 text-[#34312c]">{quote.text}</p>
      <div className="mt-2 text-xs text-[#9a948b]">{quote.projectName}</div>
    </blockquote>
  );
}
