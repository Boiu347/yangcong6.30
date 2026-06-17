import {
  BookOpen,
  ChevronDown,
  ChevronRight,
  FileText,
  Lightbulb,
  MessageSquareQuote,
  Monitor,
  ShieldAlert,
  ShoppingCart,
  Sparkles,
  Target,
  Users,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { useProjects } from '../../store/useProjectStore';
import type { Sentiment } from '../../types/voc';
import {
  buildCategoryInsightData,
  CATEGORY_EXECUTIVE_SUMMARIES,
  DIRECTION_DEFINITIONS,
  INSIGHT_CATEGORY_CONFIGS,
  type BusinessDirection,
  type CategoryQuote,
  type DirectionDefinition,
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
                  {config.eyebrow}
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
              <TopMetric label="原声" value={data.totalQuotes} color={config.color} />
              <TopMetric label="项目" value={data.totalProjects} color={config.color} />
              <TopMetric label="材料" value={data.totalSources} color={config.color} />
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
        <div className="mb-6 grid gap-3 lg:grid-cols-3">
          <ExecutiveCard
            icon={<Lightbulb size={16} />}
            label="机会点"
            text={summary.opportunity}
            color={config.color}
          />
          <ExecutiveCard
            icon={<ShieldAlert size={16} />}
            label="风险点"
            text={summary.risk}
            color={config.color}
          />
          <ExecutiveCard
            icon={<Target size={16} />}
            label="建议动作"
            text={summary.action}
            color={config.color}
          />
        </div>

        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-extrabold text-[#25231f]">业务方向判断</h2>
            <p className="mt-1 text-sm text-[#7a746b]">
              默认只展示最需要业务方理解的判断，原声作为证据展开查看。
            </p>
          </div>
        </div>

        <div className="grid gap-4">
          {directions.map((direction, index) => (
            <DirectionCard
              key={direction.id}
              direction={direction}
              index={index + 1}
              color={config.color}
              tint={config.tint}
            />
          ))}
        </div>
      </section>
    </main>
  );
}

function buildBusinessDirections(slug: InsightCategorySlug, quotes: CategoryQuote[]): BusinessDirection[] {
  return DIRECTION_DEFINITIONS[slug].map((definition) => {
    const matched = pickDirectionQuotes(definition, quotes);
    const usableQuotes = matched.length > 0 ? matched : quotes.slice(0, 6);
    const sentimentCounts = countSentiments(usableQuotes);
    return {
      id: definition.id,
      title: definition.title,
      businessImpact: definition.businessImpact,
      findings: definition.findings,
      action: definition.action,
      quotes: usableQuotes,
      representativeQuotes: pickRepresentativeQuotes(usableQuotes),
      projectNames: [...new Set(usableQuotes.map((quote) => quote.projectName))],
      sourceCount: new Set(usableQuotes.map((quote) => quote.sourceId)).size,
      sentimentCounts,
    };
  });
}

function pickDirectionQuotes(definition: DirectionDefinition, quotes: CategoryQuote[]): CategoryQuote[] {
  const keywords = definition.keywords.map((keyword) => keyword.toLowerCase());
  return quotes.filter((quote) => {
    const haystack = `${quote.text} ${quote.subSubCategory} ${quote.dimension} ${quote.quoteSummary ?? ''}`.toLowerCase();
    return keywords.some((keyword) => haystack.includes(keyword));
  });
}

function pickRepresentativeQuotes(quotes: CategoryQuote[]): CategoryQuote[] {
  return [...quotes]
    .sort((a, b) => scoreQuote(b) - scoreQuote(a))
    .slice(0, 2);
}

function scoreQuote(quote: CategoryQuote) {
  let score = 0;
  if (quote.respondent) score += 2;
  if (quote.sourceName) score += 1;
  if (quote.text.length > 24 && quote.text.length < 120) score += 2;
  if (quote.sentiment === 'negative') score += 1;
  return score;
}

function countSentiments(quotes: CategoryQuote[]): Record<Sentiment, number> {
  return {
    positive: quotes.filter((quote) => quote.sentiment === 'positive').length,
    neutral: quotes.filter((quote) => quote.sentiment === 'neutral').length,
    negative: quotes.filter((quote) => quote.sentiment === 'negative').length,
  };
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

function ExecutiveCard({
  icon,
  label,
  text,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  text: string;
  color: string;
}) {
  return (
    <div className="rounded-lg border border-[#e5e1d8] bg-white p-4">
      <div className="mb-2 flex items-center gap-2 text-sm font-bold text-[#2b2925]">
        <span style={{ color }}>{icon}</span>
        {label}
      </div>
      <p className="text-sm leading-6 text-[#5f5a52]">{text}</p>
    </div>
  );
}

function DirectionCard({
  direction,
  index,
  color,
  tint,
}: {
  direction: BusinessDirection;
  index: number;
  color: string;
  tint: string;
}) {
  const [expanded, setExpanded] = useState(false);
  const evidenceGroups = groupEvidence(direction.quotes);

  return (
    <article className="overflow-hidden rounded-lg border border-[#e3dfd6] bg-white shadow-sm">
      <div className="grid gap-0 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="p-5">
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
            {direction.projectNames.length > 3 && (
              <span className="text-xs text-[#9a948b]">+{direction.projectNames.length - 3}</span>
            )}
          </div>

          <h3 className="text-xl font-extrabold leading-snug text-[#25231f]">{direction.title}</h3>
          <p className="mt-3 text-sm leading-6 text-[#5f5a52]">{direction.businessImpact}</p>

          <div className="mt-4 grid gap-2 sm:grid-cols-3">
            <MiniMetric icon={<MessageSquareQuote size={14} />} label="证据原声" value={direction.quotes.length} />
            <MiniMetric icon={<FileText size={14} />} label="来源材料" value={direction.sourceCount} />
            <MiniMetric icon={<Users size={14} />} label="涉及项目" value={direction.projectNames.length} />
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
        </div>

        <div className="border-t border-[#eee9df] bg-[#fbfaf7] p-5 lg:border-l lg:border-t-0">
          <div className="mb-3 flex items-center justify-between">
            <div className="text-sm font-bold text-[#2b2925]">代表原声</div>
            <SentimentPills counts={direction.sentimentCounts} />
          </div>

          <div className="space-y-3">
            {direction.representativeQuotes.map((quote) => (
              <QuotePreview key={quote.id} quote={quote} color={color} />
            ))}
          </div>

          <button
            type="button"
            onClick={() => setExpanded((value) => !value)}
            className="mt-4 inline-flex h-9 items-center gap-1.5 rounded-md border border-[#ded8cd] bg-white px-3 text-sm font-bold text-[#5f5a52] transition hover:bg-[#f7f4ee]"
          >
            {expanded ? '收起证据' : '查看全部证据'}
            <ChevronDown size={14} className={expanded ? 'rotate-180 transition' : 'transition'} />
          </button>
        </div>
      </div>

      {expanded && (
        <div className="border-t border-[#eee9df] bg-white p-5">
          <div className="mb-4 flex items-center gap-2 text-sm font-bold text-[#2b2925]">
            <Sparkles size={15} style={{ color }} />
            证据明细
          </div>
          <div className="grid gap-4 lg:grid-cols-2">
            {Object.entries(evidenceGroups).map(([projectName, quotes]) => (
              <EvidenceGroup key={projectName} projectName={projectName} quotes={quotes} color={color} />
            ))}
          </div>
        </div>
      )}
    </article>
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

function groupEvidence(quotes: CategoryQuote[]) {
  return quotes.reduce<Record<string, CategoryQuote[]>>((acc, quote) => {
    if (!acc[quote.projectName]) acc[quote.projectName] = [];
    acc[quote.projectName].push(quote);
    return acc;
  }, {});
}

function EvidenceGroup({
  projectName,
  quotes,
  color,
}: {
  projectName: string;
  quotes: CategoryQuote[];
  color: string;
}) {
  const visibleQuotes = quotes.slice(0, 8);
  return (
    <section className="rounded-lg border border-[#e8e3da] bg-[#fbfaf7] p-4">
      <div className="mb-3 flex items-center gap-2">
        <ChevronRight size={15} style={{ color }} />
        <h4 className="text-sm font-bold text-[#34312c]">{projectName}</h4>
        <span className="text-xs text-[#9a948b]">{quotes.length}</span>
      </div>
      <div className="space-y-2">
        {visibleQuotes.map((quote) => (
          <div key={quote.id} className="rounded-md bg-white p-3">
            <div className="mb-1 flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-[#6f6a63]">{quote.subSubCategory}</span>
              <span
                className="rounded-full px-2 py-0.5 text-[10px] font-bold"
                style={{ backgroundColor: sentimentMeta[quote.sentiment].bg, color: sentimentMeta[quote.sentiment].color }}
              >
                {sentimentMeta[quote.sentiment].label}
              </span>
            </div>
            <p className="text-sm leading-6 text-[#46413a]">{quote.text}</p>
            <div className="mt-2 text-xs text-[#9a948b]">{quote.sourceName}</div>
          </div>
        ))}
      </div>
      {quotes.length > visibleQuotes.length && (
        <div className="mt-2 text-xs text-[#9a948b]">已显示前 {visibleQuotes.length} 条，其余证据可按来源材料继续追溯。</div>
      )}
    </section>
  );
}
