import {
  BookOpen,
  Check,
  ChevronDown,
  ChevronRight,
  FileText,
  Layers,
  MessageSquareQuote,
  Monitor,
  ShoppingCart,
  Sparkles,
  UserRound,
  Users,
  X,
} from 'lucide-react';
import { useMemo, useState, type ReactNode } from 'react';
import { useProjects } from '../../store/useProjectStore';
import type { Sentiment } from '../../types/voc';
import {
  buildCategoryInsightData,
  countBy,
  INSIGHT_CATEGORY_CONFIGS,
  SENTIMENTS,
  type CategoryQuote,
  type InsightCategorySlug,
  type UserRole,
} from './categoryInsights';

const iconMap = {
  'app-experience': Monitor,
  'course-experience': BookOpen,
  'purchase-decision': ShoppingCart,
} satisfies Record<InsightCategorySlug, typeof Monitor>;

const roleColors: Record<UserRole, string> = {
  家长: '#f97316',
  学生: '#3b82f6',
  其他: '#6b7280',
};

const sentimentMeta: Record<Sentiment, { label: string; color: string; bg: string }> = {
  positive: { label: '正向', color: '#168a55', bg: '#eaf8f0' },
  neutral: { label: '中性', color: '#6f6a63', bg: '#f2f1ed' },
  negative: { label: '负向', color: '#bf3b2b', bg: '#fff0ec' },
};

interface InsightCategoryPageProps {
  slug: InsightCategorySlug;
}

type QuoteTree = Record<string, Record<string, CategoryQuote[]>>;

export default function InsightCategoryPage({ slug }: InsightCategoryPageProps) {
  const projects = useProjects();
  const config = INSIGHT_CATEGORY_CONFIGS[slug];
  const Icon = iconMap[slug];
  const data = useMemo(() => buildCategoryInsightData(projects, slug), [projects, slug]);

  const [projectFilters, setProjectFilters] = useState<string[]>([]);
  const [sourceFilters, setSourceFilters] = useState<string[]>([]);
  const [issueFilters, setIssueFilters] = useState<string[]>([]);
  const [sentimentFilters, setSentimentFilters] = useState<Sentiment[]>([]);

  const filterOptions = useMemo(() => {
    const projectMap = new Map<string, string>();
    const sourceMap = new Map<string, string>();
    const issueMap = new Map<string, string>();

    data.quotes.forEach((quote) => {
      projectMap.set(quote.projectId, quote.projectName);
      sourceMap.set(quote.sourceId, quote.sourceName);
      issueMap.set(quote.subSubCategory, quote.subSubCategory);
    });

    return {
      projects: [...projectMap.entries()].map(([value, label]) => ({ value, label })),
      sources: [...sourceMap.entries()].map(([value, label]) => ({ value, label })),
      issues: [...issueMap.entries()].map(([value, label]) => ({ value, label })),
    };
  }, [data.quotes]);

  const filteredQuotes = useMemo(
    () =>
      data.quotes.filter((quote) => {
        if (projectFilters.length > 0 && !projectFilters.includes(quote.projectId)) return false;
        if (sourceFilters.length > 0 && !sourceFilters.includes(quote.sourceId)) return false;
        if (issueFilters.length > 0 && !issueFilters.includes(quote.subSubCategory)) return false;
        if (sentimentFilters.length > 0 && !sentimentFilters.includes(quote.sentiment)) return false;
        return true;
      }),
    [data.quotes, issueFilters, projectFilters, sentimentFilters, sourceFilters],
  );

  const filteredSentiments = useMemo(() => countSentiment(filteredQuotes), [filteredQuotes]);
  const projectCount = new Set(filteredQuotes.map((quote) => quote.projectId)).size;
  const sourceCount = new Set(filteredQuotes.map((quote) => quote.sourceId)).size;
  const topIssues = countBy(filteredQuotes, (quote) => quote.subSubCategory).slice(0, 6);
  const hasFilters =
    projectFilters.length > 0 ||
    sourceFilters.length > 0 ||
    issueFilters.length > 0 ||
    sentimentFilters.length > 0;

  function clearFilters() {
    setProjectFilters([]);
    setSourceFilters([]);
    setIssueFilters([]);
    setSentimentFilters([]);
  }

  return (
    <main className="min-h-[calc(100vh-52px)] bg-neutral-50">
      <section className="border-b border-neutral-200 bg-white">
        <div className="mx-auto max-w-[1400px] px-4 py-7 sm:px-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <div className="mb-3 flex items-center gap-2">
                <span
                  className="flex h-9 w-9 items-center justify-center rounded-lg"
                  style={{ backgroundColor: config.tint, color: config.color }}
                >
                  <Icon size={19} />
                </span>
                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-400">
                  {config.eyebrow}
                </span>
              </div>
              <h1 className="text-[28px] font-extrabold leading-tight text-neutral-900 sm:text-[34px]">
                {config.title}
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-neutral-500">
                {config.description}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1400px] px-4 py-6 sm:px-6">
        <SummaryCard
          color={config.color}
          description={buildSummaryText(config.title, filteredQuotes, topIssues)}
        />

        <div className="mb-6 flex flex-wrap items-center gap-3">
          <FilterPopover
            icon={<Layers size={14} />}
            placeholder="项目筛选"
            options={filterOptions.projects}
            selected={projectFilters}
            onChange={setProjectFilters}
          />
          <FilterPopover
            icon={<FileText size={14} />}
            placeholder="来源材料"
            options={filterOptions.sources}
            selected={sourceFilters}
            onChange={setSourceFilters}
          />
          <FilterPopover
            icon={<ChevronRight size={14} />}
            placeholder="子议题"
            options={filterOptions.issues}
            selected={issueFilters}
            onChange={setIssueFilters}
          />
          <FilterPopover
            icon={<MessageSquareQuote size={14} />}
            placeholder="情绪筛选"
            options={SENTIMENTS.map((sentiment) => ({
              value: sentiment,
              label: sentimentMeta[sentiment].label,
            }))}
            selected={sentimentFilters}
            onChange={(value) => setSentimentFilters(value as Sentiment[])}
          />
          {hasFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="inline-flex h-9 items-center gap-1.5 rounded-md px-3 text-sm font-medium text-neutral-500 transition hover:bg-white hover:text-neutral-800"
            >
              <X size={14} />
              清除筛选
            </button>
          )}
        </div>

        <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
          <StatCard icon={<MessageSquareQuote size={16} />} label="引言总数" value={filteredQuotes.length} color={config.color} />
          <StatCard icon={<Users size={16} />} label="覆盖项目" value={projectCount} color={config.color} />
          <DistributionCard label="身份分布" quotes={filteredQuotes} getKey={(quote) => quote.userRole} color={config.color} />
          <DistributionCard label="情绪分布" quotes={filteredQuotes} getKey={(quote) => sentimentMeta[quote.sentiment].label} color={config.color} />
        </div>

        {filteredQuotes.length === 0 ? (
          <div className="rounded-lg border border-dashed border-neutral-200 bg-white px-6 py-14 text-center text-neutral-400">
            <MessageSquareQuote className="mx-auto mb-3 opacity-50" size={36} />
            <p className="text-sm">{config.emptyHint}</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <RoleColumn
                role="家长"
                quotes={filteredQuotes.filter((quote) => quote.userRole === '家长')}
                color={config.color}
              />
              <RoleColumn
                role="学生"
                quotes={filteredQuotes.filter((quote) => quote.userRole === '学生')}
                color={config.color}
              />
            </div>
            {filteredQuotes.some((quote) => quote.userRole === '其他') && (
              <div className="mt-6">
                <RoleColumn
                  role="其他"
                  quotes={filteredQuotes.filter((quote) => quote.userRole === '其他')}
                  color={config.color}
                />
              </div>
            )}
          </>
        )}
      </section>
    </main>
  );
}

function buildSummaryText(title: string, quotes: CategoryQuote[], topIssues: Array<{ name: string; count: number }>) {
  if (quotes.length === 0) return `当前筛选条件下暂无${title}相关原声。`;
  const issueText = topIssues.length > 0 ? topIssues.map((issue) => issue.name).join('、') : '暂无明显集中议题';
  const projects = new Set(quotes.map((quote) => quote.projectName)).size;
  return `当前共聚合 ${quotes.length} 条${title}原声，覆盖 ${projects} 个项目。高频议题集中在 ${issueText}，可用于快速定位用户在该分类下的主要判断依据。`;
}

function countSentiment(quotes: CategoryQuote[]): Record<Sentiment, number> {
  return {
    positive: quotes.filter((quote) => quote.sentiment === 'positive').length,
    neutral: quotes.filter((quote) => quote.sentiment === 'neutral').length,
    negative: quotes.filter((quote) => quote.sentiment === 'negative').length,
  };
}

function SummaryCard({ color, description }: { color: string; description: string }) {
  return (
    <div className="mb-6 overflow-hidden rounded-lg border border-neutral-200 bg-white">
      <div className="h-1" style={{ backgroundColor: color }} />
      <div className="p-5">
        <div className="mb-3 flex items-center gap-2">
          <Sparkles size={16} style={{ color }} />
          <span className="text-sm font-bold text-neutral-700">综合概要</span>
        </div>
        <p className="text-sm leading-6 text-neutral-600">{description}</p>
      </div>
    </div>
  );
}

function FilterPopover({
  icon,
  placeholder,
  options,
  selected,
  onChange,
}: {
  icon: ReactNode;
  placeholder: string;
  options: Array<{ value: string; label: string }>;
  selected: string[];
  onChange: (value: string[]) => void;
}) {
  const [open, setOpen] = useState(false);
  const selectedLabel = selected.length === 0 ? placeholder : `已选 ${selected.length} 项`;

  function toggle(value: string) {
    onChange(selected.includes(value) ? selected.filter((item) => item !== value) : [...selected, value]);
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="inline-flex h-9 items-center gap-1.5 rounded-md border border-neutral-200 bg-white px-3 text-sm text-neutral-700 transition hover:bg-neutral-50"
      >
        <span className="text-neutral-400">{icon}</span>
        <span className="max-w-[140px] truncate">{selectedLabel}</span>
        <ChevronDown size={14} className="text-neutral-400" />
      </button>

      {open && (
        <div className="absolute left-0 top-11 z-30 w-72 rounded-lg border border-neutral-200 bg-white p-2 shadow-lg">
          <div className="max-h-72 overflow-y-auto">
            {options.length === 0 ? (
              <div className="px-2 py-2 text-sm text-neutral-400">暂无选项</div>
            ) : (
              options.map((option) => {
                const checked = selected.includes(option.value);
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => toggle(option.value)}
                    className="flex w-full items-center gap-2 rounded-md px-2 py-2 text-left text-sm text-neutral-700 transition hover:bg-neutral-50"
                  >
                    <span
                      className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border ${
                        checked ? 'border-blue-500 bg-blue-500 text-white' : 'border-neutral-300'
                      }`}
                    >
                      {checked && <Check size={12} />}
                    </span>
                    <span className="truncate">{option.label}</span>
                  </button>
                );
              })
            )}
          </div>
          {selected.length > 0 && (
            <button
              type="button"
              onClick={() => onChange([])}
              className="mt-1 w-full border-t border-neutral-100 py-2 text-xs text-neutral-400 transition hover:text-neutral-700"
            >
              清除{placeholder}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  color,
}: {
  icon: ReactNode;
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div className="rounded-lg border border-neutral-200 bg-white p-4">
      <div className="mb-1 flex items-center gap-2">
        <span style={{ color }}>{icon}</span>
        <span className="text-xs text-neutral-500">{label}</span>
      </div>
      <span className="text-2xl font-bold text-neutral-900">{value}</span>
    </div>
  );
}

function DistributionCard<T extends string>({
  label,
  quotes,
  getKey,
  color,
}: {
  label: string;
  quotes: CategoryQuote[];
  getKey: (quote: CategoryQuote) => T;
  color: string;
}) {
  const entries = countBy(quotes, getKey).slice(0, 4);
  const total = quotes.length;
  return (
    <div className="rounded-lg border border-neutral-200 bg-white p-4">
      <span className="mb-2 block text-xs text-neutral-500">{label}</span>
      {entries.length === 0 ? (
        <span className="text-xs text-neutral-400">暂无数据</span>
      ) : (
        <div className="space-y-1.5">
          {entries.map((entry) => (
            <div key={entry.name} className="flex items-center gap-2">
              <span className="w-12 truncate text-xs text-neutral-700">{entry.name}</span>
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-neutral-100">
                <div
                  className="h-full rounded-full"
                  style={{ width: `${total ? (entry.count / total) * 100 : 0}%`, backgroundColor: color, opacity: 0.7 }}
                />
              </div>
              <span className="w-10 text-right text-xs text-neutral-500">{entry.count}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function RoleColumn({ role, quotes, color }: { role: UserRole; quotes: CategoryQuote[]; color: string }) {
  const tree = useMemo(() => buildQuoteTree(quotes), [quotes]);
  const projects = Object.keys(tree);

  return (
    <section>
      <div className="mb-4 flex items-center gap-2 border-b-2 pb-2" style={{ borderColor: roleColors[role] }}>
        <div className="h-3 w-3 rounded-full" style={{ backgroundColor: roleColors[role] }} />
        <h2 className="font-semibold text-neutral-800">{role}</h2>
        <span className="text-sm text-neutral-400">({quotes.length} 条引言)</span>
      </div>

      {quotes.length === 0 ? (
        <div className="rounded-lg border border-dashed border-neutral-200 bg-white px-4 py-8 text-sm text-neutral-400">
          暂无{role}引言
        </div>
      ) : (
        <div className="space-y-5">
          {projects.map((projectName) => (
            <ProjectSection
              key={projectName}
              projectName={projectName}
              groups={tree[projectName]}
              color={color}
            />
          ))}
        </div>
      )}
    </section>
  );
}

function buildQuoteTree(quotes: CategoryQuote[]): QuoteTree {
  const tree: QuoteTree = {};
  quotes.forEach((quote) => {
    const project = quote.subCategory || quote.projectName;
    const issue = quote.subSubCategory || '未分类';
    if (!tree[project]) tree[project] = {};
    if (!tree[project][issue]) tree[project][issue] = [];
    tree[project][issue].push(quote);
  });
  return tree;
}

function ProjectSection({
  projectName,
  groups,
  color,
}: {
  projectName: string;
  groups: Record<string, CategoryQuote[]>;
  color: string;
}) {
  const issues = Object.keys(groups).sort((a, b) => groups[b].length - groups[a].length);
  const total = issues.reduce((sum, issue) => sum + groups[issue].length, 0);

  return (
    <div>
      <div className="mb-2 flex items-center gap-2">
        <ChevronRight size={16} style={{ color }} />
        <h3 className="text-sm font-semibold text-neutral-700">{projectName}</h3>
        <span className="text-xs text-neutral-400">{total}</span>
      </div>
      <div className="space-y-3 border-l-2 border-neutral-100 pl-4">
        {issues.map((issue) => (
          <div key={issue}>
            <div className="mb-1.5 flex items-center gap-1.5">
              <div className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: color, opacity: 0.5 }} />
              <span className="text-xs font-medium text-neutral-500">{issue}</span>
              <span className="text-xs text-neutral-300">{groups[issue].length}</span>
            </div>
            <div className="space-y-2">
              {groups[issue].map((quote) => (
                <QuoteCard key={quote.id} quote={quote} color={color} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function QuoteCard({ quote, color }: { quote: CategoryQuote; color: string }) {
  return (
    <article className="overflow-hidden rounded-lg border border-neutral-200 bg-white">
      <div className="p-3">
        <div className="flex items-start gap-2.5">
          <div className="w-1 self-stretch rounded-full" style={{ backgroundColor: color, opacity: 0.35 }} />
          <div className="min-w-0 flex-1">
            <div className="mb-1.5 flex flex-wrap items-center gap-1.5">
              <span className="text-sm font-medium text-neutral-800">
                {quote.respondent || quote.userRole}
              </span>
              {quote.grade && <Badge>{quote.grade}</Badge>}
              {quote.schoolLevel && <Badge>{quote.schoolLevel}</Badge>}
              {quote.gender && <Badge>{quote.gender}</Badge>}
              <span
                className="rounded-full px-2 py-0.5 text-[10px] font-bold"
                style={{
                  backgroundColor: sentimentMeta[quote.sentiment].bg,
                  color: sentimentMeta[quote.sentiment].color,
                }}
              >
                {sentimentMeta[quote.sentiment].label}
              </span>
            </div>

            <p className="whitespace-pre-wrap text-sm leading-6 text-neutral-700">{quote.text}</p>

            {quote.quoteSummary && (
              <div className="mt-2">
                <span className="inline-block rounded bg-neutral-50 px-2 py-1 text-xs text-neutral-400">
                  摘要：{quote.quoteSummary}
                </span>
              </div>
            )}

            <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-neutral-400">
              <span className="inline-flex items-center gap-1">
                <UserRound size={12} />
                {quote.projectName}
              </span>
              <span className="inline-flex items-center gap-1">
                <FileText size={12} />
                {quote.sourceName}
              </span>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

function Badge({ children }: { children: ReactNode }) {
  return (
    <span className="rounded bg-neutral-100 px-1.5 py-0.5 text-[10px] font-medium text-neutral-500">
      {children}
    </span>
  );
}
