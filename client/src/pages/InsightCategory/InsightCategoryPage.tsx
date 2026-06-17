import {
  ArrowUpRight,
  BookOpen,
  FileText,
  MessageSquareQuote,
  Monitor,
  ShoppingCart,
  Sparkles,
} from 'lucide-react';
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProjects } from '../../store/useProjectStore';
import type { Sentiment } from '../../types/voc';
import {
  buildCategoryInsightData,
  INSIGHT_CATEGORY_CONFIGS,
  type CategoryQuote,
  type InsightCategorySlug,
  type ProjectInsightGroup,
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
  const projects = useProjects();
  const navigate = useNavigate();
  const config = INSIGHT_CATEGORY_CONFIGS[slug];
  const Icon = iconMap[slug];
  const data = useMemo(() => buildCategoryInsightData(projects, slug), [projects, slug]);
  const topIssues = useMemo(() => {
    const issueMap = new Map<string, number>();
    data.groups.forEach((group) => {
      group.issueCounts.forEach((issue) => {
        issueMap.set(issue.name, (issueMap.get(issue.name) ?? 0) + issue.count);
      });
    });
    return [...issueMap.entries()]
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6);
  }, [data.groups]);

  return (
    <main className="flex-1 bg-[#f4f5f2]">
      <section className="border-b border-[#e5e2da] bg-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-7 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <div className="mb-3 flex items-center gap-2">
                <span
                  className="flex h-9 w-9 items-center justify-center rounded-lg"
                  style={{ backgroundColor: config.tint, color: config.color }}
                >
                  <Icon size={19} />
                </span>
                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8a857d]">
                  {config.eyebrow}
                </span>
              </div>
              <h1 className="text-[28px] font-extrabold leading-tight text-[#25231f] sm:text-[34px]">
                {config.title}
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-[#6f6a63]">
                {config.description}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:min-w-[420px]">
              <Metric label="覆盖项目" value={data.totalProjects} color={config.color} />
              <Metric label="原声证据" value={data.totalQuotes} color={config.color} />
              <Metric label="来源材料" value={data.totalFiles} color={config.color} />
              <Metric label="核心议题" value={topIssues.length} color={config.color} />
            </div>
          </div>

          <div className="grid gap-3 lg:grid-cols-[1.4fr_1fr]">
            <SentimentOverview counts={data.sentimentCounts} color={config.color} />
            <div className="rounded-lg border border-[#ebe7de] bg-[#fbfaf7] p-4">
              <div className="mb-3 flex items-center gap-2 text-sm font-bold text-[#2b2925]">
                <Sparkles size={15} style={{ color: config.color }} />
                高频子议题
              </div>
              {topIssues.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {topIssues.map((issue) => (
                    <span
                      key={issue.name}
                      className="rounded-full border border-[#e5e0d6] bg-white px-3 py-1 text-xs font-medium text-[#5f5a52]"
                    >
                      {issue.name} · {issue.count}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-[#9a948b]">{config.emptyHint}</p>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
        {data.groups.length === 0 ? (
          <div className="rounded-lg border border-dashed border-[#d8d2c8] bg-white px-6 py-12 text-center">
            <MessageSquareQuote className="mx-auto mb-3 text-[#b7afa3]" size={32} />
            <p className="text-sm font-semibold text-[#5f5a52]">{config.emptyHint}</p>
          </div>
        ) : (
          <div className="space-y-5">
            {data.groups.map((group) => (
              <ProjectInsightCard
                key={group.project.id}
                group={group}
                color={config.color}
                tint={config.tint}
                onOpenProject={() => navigate(`/projects/${group.project.id}/qualitative`)}
              />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

function Metric({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="rounded-lg border border-[#ebe7de] bg-[#fbfaf7] px-4 py-3">
      <div className="text-xs font-medium text-[#8a857d]">{label}</div>
      <div className="mt-1 text-2xl font-extrabold text-[#25231f]" style={{ color }}>
        {value}
      </div>
    </div>
  );
}

function SentimentOverview({
  counts,
  color,
}: {
  counts: Record<Sentiment, number>;
  color: string;
}) {
  const total = counts.positive + counts.neutral + counts.negative;
  return (
    <div className="rounded-lg border border-[#ebe7de] bg-[#fbfaf7] p-4">
      <div className="mb-3 flex items-center gap-2 text-sm font-bold text-[#2b2925]">
        <MessageSquareQuote size={15} style={{ color }} />
        情绪分布
      </div>
      <div className="mb-3 flex h-2 overflow-hidden rounded-full bg-[#ece8df]">
        {(['positive', 'neutral', 'negative'] as Sentiment[]).map((sentiment) => {
          const width = total ? `${(counts[sentiment] / total) * 100}%` : '0%';
          return (
            <div
              key={sentiment}
              style={{ width, backgroundColor: sentimentMeta[sentiment].color }}
            />
          );
        })}
      </div>
      <div className="grid grid-cols-3 gap-2">
        {(['positive', 'neutral', 'negative'] as Sentiment[]).map((sentiment) => (
          <div key={sentiment} className="rounded-md bg-white px-3 py-2">
            <div className="text-xs text-[#8a857d]">{sentimentMeta[sentiment].label}</div>
            <div className="text-lg font-bold text-[#2b2925]">{counts[sentiment]}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ProjectInsightCard({
  group,
  color,
  tint,
  onOpenProject,
}: {
  group: ProjectInsightGroup;
  color: string;
  tint: string;
  onOpenProject: () => void;
}) {
  const representativeQuotes = group.quotes.slice(0, 4);
  return (
    <article className="overflow-hidden rounded-lg border border-[#e5e1d8] bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="h-1" style={{ backgroundColor: color }} />
      <div className="p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0">
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <span
                className="inline-flex items-center rounded-md px-2 py-1 text-xs font-bold"
                style={{ backgroundColor: tint, color }}
              >
                {group.project.category || '研究项目'}
              </span>
              {group.project.status && (
                <span className="rounded-md bg-[#f4f2ec] px-2 py-1 text-xs font-medium text-[#6f6a63]">
                  {group.project.status}
                </span>
              )}
              {(group.project.methods ?? []).slice(0, 3).map((method) => (
                <span
                  key={method}
                  className="rounded-md border border-[#e5e1d8] px-2 py-1 text-xs font-medium text-[#6f6a63]"
                >
                  {method}
                </span>
              ))}
            </div>
            <h2 className="text-xl font-extrabold leading-snug text-[#25231f]">
              {group.project.name}
            </h2>
          </div>

          <button
            type="button"
            onClick={onOpenProject}
            className="inline-flex shrink-0 items-center gap-1.5 rounded-md border border-[#e5e1d8] bg-white px-3 py-2 text-xs font-bold text-[#5f5a52] transition hover:border-[#d0c8bc] hover:bg-[#faf8f2]"
          >
            查看项目
            <ArrowUpRight size={13} />
          </button>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <SmallStat icon={<MessageSquareQuote size={14} />} label="匹配原声" value={group.quotes.length} />
          <SmallStat icon={<FileText size={14} />} label="来源材料" value={group.fileCount} />
          <SmallStat icon={<Sparkles size={14} />} label="子议题" value={group.issueCounts.length} />
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {group.issueCounts.slice(0, 6).map((issue) => (
            <span
              key={issue.name}
              className="rounded-full bg-[#f6f4ef] px-3 py-1 text-xs font-medium text-[#625d55]"
            >
              {issue.name} · {issue.count}
            </span>
          ))}
        </div>

        <div className="mt-5 grid gap-3 lg:grid-cols-2">
          {representativeQuotes.map((quote) => (
            <QuoteEvidence key={quote.id} quote={quote} color={color} tint={tint} />
          ))}
        </div>
      </div>
    </article>
  );
}

function SmallStat({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
}) {
  return (
    <div className="flex items-center gap-3 rounded-lg bg-[#fbfaf7] px-3 py-2.5">
      <span className="text-[#9a948b]">{icon}</span>
      <div>
        <div className="text-xs text-[#8a857d]">{label}</div>
        <div className="text-sm font-extrabold text-[#2b2925]">{value}</div>
      </div>
    </div>
  );
}

function QuoteEvidence({
  quote,
  color,
  tint,
}: {
  quote: CategoryQuote;
  color: string;
  tint: string;
}) {
  return (
    <blockquote className="relative rounded-lg border border-[#e8e3da] bg-[#fbfaf7] p-4">
      <div
        className="absolute left-0 top-4 h-10 w-1 rounded-r-full"
        style={{ backgroundColor: color }}
      />
      <div className="mb-2 flex flex-wrap items-center gap-2 pl-1">
        <span
          className="inline-flex h-6 w-6 items-center justify-center rounded-md"
          style={{ backgroundColor: tint, color }}
        >
          <MessageSquareQuote size={13} />
        </span>
        <span className="text-xs font-bold text-[#5f5a52]">{quote.subDimension}</span>
        <span
          className="rounded-full px-2 py-0.5 text-[11px] font-bold"
          style={{
            backgroundColor: sentimentMeta[quote.sentiment].bg,
            color: sentimentMeta[quote.sentiment].color,
          }}
        >
          {sentimentMeta[quote.sentiment].label}
        </span>
      </div>
      <p className="line-clamp-4 text-sm leading-6 text-[#34312c]">{quote.text}</p>
      <footer className="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-xs text-[#8a857d]">
        {quote.respondent && <span>{quote.respondent}</span>}
        <span>{quote.sourceName}</span>
      </footer>
    </blockquote>
  );
}
