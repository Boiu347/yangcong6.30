import React, { useEffect, useMemo, useState } from 'react';
import {
  ArrowLeft,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  FileText,
  MessageSquareQuote,
  Monitor,
  Search,
  ShoppingCart,
} from 'lucide-react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { citeMatches, useCiteKey } from '../../components/siteAssistant/evidenceHighlight';
import { useProjects } from '../../store/useProjectStore';
import EvidenceAudioClips from '../../components/EvidenceAudioClips';
import SegmentLabelChips from '../../components/SegmentLabelChips';
import { lookupClips } from '../../utils/sourceUtils';
import type { Sentiment } from '../../types/voc';
import {
  buildCategoryInsightData,
  findDirectionDefinition,
  INSIGHT_CATEGORY_CONFIGS,
  pickDirectionQuotes,
  QUALITATIVE_RESEARCH_SLUGS,
  type CategoryQuote,
  type InsightCategorySlug,
} from './categoryInsights';

const PAGE_SIZE = 8;

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

export default function InsightTopicQuotesPage() {
  const navigate = useNavigate();
  const projects = useProjects();
  const params = useParams();
  const slug = params.dimension;
  const topic = params.topic;
  const [query, setQuery] = useState('');
  const [projectFilter, setProjectFilter] = useState<string>('all');
  const [page, setPage] = useState(1);
  const validSlug = isInsightCategorySlug(slug);
  const safeSlug: InsightCategorySlug = validSlug ? slug : 'app-experience';
  const definition = topic ? findDirectionDefinition(safeSlug, topic) : undefined;
  const config = INSIGHT_CATEGORY_CONFIGS[safeSlug];
  const Icon = iconMap[safeSlug];
  const data = useMemo(() => buildCategoryInsightData(projects, safeSlug), [projects, safeSlug]);
  const topicQuotes = useMemo(
    () => (definition ? pickDirectionQuotes(definition, data.quotes) : []),
    [data.quotes, definition],
  );

  const projectOptions = useMemo(() => {
    const order: string[] = [];
    const names = new Map<string, string>();
    const counts = new Map<string, number>();
    topicQuotes.forEach((quote) => {
      if (!names.has(quote.projectId)) {
        names.set(quote.projectId, quote.projectName);
        order.push(quote.projectId);
      }
      counts.set(quote.projectId, (counts.get(quote.projectId) ?? 0) + 1);
    });
    return order.map((id) => ({ id, name: names.get(id) ?? id, count: counts.get(id) ?? 0 }));
  }, [topicQuotes]);

  const filteredQuotes = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return topicQuotes.filter((quote) => {
      if (projectFilter !== 'all' && quote.projectId !== projectFilter) return false;
      if (!normalized) return true;
      const haystack = [
        quote.text,
        quote.respondent,
        quote.sourceName,
        quote.projectName,
        quote.subSubCategory,
        quote.quoteSummary,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      return haystack.includes(normalized);
    });
  }, [query, projectFilter, topicQuotes]);

  useEffect(() => {
    setPage(1);
  }, [query, projectFilter, safeSlug, topic]);

  useEffect(() => {
    setProjectFilter('all');
  }, [safeSlug, topic]);

  // 有引用跳转时：清掉搜索/项目过滤，并翻到包含被引用原话的那一页，确保全局高亮能定位
  const citeKey = useCiteKey();
  useEffect(() => {
    if (!citeKey) return;
    const index = topicQuotes.findIndex((quote) => citeMatches(quote.text, citeKey));
    if (index < 0) return;
    setQuery('');
    setProjectFilter('all');
    const targetPage = Math.floor(index / PAGE_SIZE) + 1;
    // 延后一个 tick，避免被上面「过滤变化重置到第 1 页」的副作用覆盖
    const timer = setTimeout(() => setPage(targetPage), 0);
    return () => clearTimeout(timer);
  }, [citeKey, topicQuotes]);

  const totalPages = Math.max(1, Math.ceil(filteredQuotes.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pageQuotes = filteredQuotes.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);
  const projectCount = new Set(topicQuotes.map((quote) => quote.projectId)).size;
  const sourceCount = new Set(topicQuotes.map((quote) => quote.sourceId)).size;
  const visibleKeywords = definition ? getVisibleKeywords(definition.keywords) : [];

  if (!validSlug || !topic) {
    return <Navigate to="/qualitative-research" replace />;
  }

  if (!definition) {
    return <Navigate to={`/qualitative-research/${safeSlug}`} replace />;
  }

  return (
    <main className="min-h-[calc(100vh-52px)] bg-[#f4f5f2]">
      <section className="border-b border-[#e2dfd7] bg-white">
        <div className="mx-auto max-w-6xl px-4 py-7 sm:px-6">
          <button
            type="button"
            onClick={() => navigate(`/qualitative-research/${safeSlug}`)}
            className="mb-4 inline-flex h-9 items-center gap-1.5 rounded-md border border-[#ded8cd] bg-white px-3 text-sm font-bold text-[#5f5a52] transition hover:bg-[#f7f4ee]"
          >
            <ArrowLeft size={15} />
            返回{config.title}
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
                  Topic Evidence
                </span>
              </div>
              <h1 className="text-[26px] font-extrabold leading-tight text-[#25231f] sm:text-[32px]">
                {definition.title}
              </h1>
              <p className="mt-3 max-w-3xl text-[15px] leading-7 text-[#5f5a52]">
                {definition.businessImpact}
              </p>
              <div className="mt-4 flex flex-wrap items-center gap-2">
                <span className="text-xs font-extrabold tracking-[0.12em] text-[#8a857d]">本维度重点词</span>
                {visibleKeywords.map((keyword) => (
                  <span key={keyword} className="rounded-full px-2.5 py-1 text-xs font-bold" style={{ backgroundColor: config.tint, color: config.color }}>
                    {keyword}
                  </span>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2 lg:w-[320px]">
              <TopMetric label="原声" value={topicQuotes.length} color={config.color} />
              <TopMetric label="项目" value={projectCount} color={config.color} />
              <TopMetric label="材料" value={sourceCount} color={config.color} />
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
        <div className="mb-5 rounded-lg border border-[#e4dfd6] bg-white p-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-lg font-extrabold text-[#25231f]">该维度全部用户原声</h2>
              <p className="mt-1 text-sm text-[#7a746b]">
                原始子议题仍保留在卡片里，方便继续追溯材料和访谈来源。
              </p>
            </div>
            <div className="relative w-full lg:w-[360px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9a948b]" size={16} />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="搜索关键词、来源、子议题"
                className="h-10 w-full rounded-md border border-[#ddd8ce] bg-[#fbfaf7] pl-9 pr-3 text-sm text-[#2b2925] outline-none transition placeholder:text-[#aaa49a] focus:border-[#c6bcae] focus:bg-white"
              />
            </div>
          </div>
          {projectOptions.length > 1 && (
            <div className="mt-3 flex flex-wrap items-center gap-1.5">
              <span className="mr-1 text-xs font-bold text-[#8a857d]">项目</span>
              <button
                type="button"
                onClick={() => setProjectFilter('all')}
                className={`rounded-full border px-2.5 py-1 text-xs font-bold transition ${
                  projectFilter === 'all'
                    ? 'border-[#e65532] bg-[#fff1ed] text-[#e65532]'
                    : 'border-[#ded8cd] bg-white text-[#6f6a63] hover:bg-[#f7f4ee]'
                }`}
              >
                全部 ({topicQuotes.length})
              </button>
              {projectOptions.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setProjectFilter(opt.id)}
                  className={`rounded-full border px-2.5 py-1 text-xs font-bold transition ${
                    projectFilter === opt.id
                      ? 'border-[#e65532] bg-[#fff1ed] text-[#e65532]'
                      : 'border-[#ded8cd] bg-white text-[#6f6a63] hover:bg-[#f7f4ee]'
                  }`}
                >
                  {opt.name} ({opt.count})
                </button>
              ))}
            </div>
          )}
          <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-[#8a857d]">
            <span className="rounded-full bg-[#f4f2ec] px-2.5 py-1">
              当前结果 {filteredQuotes.length} / 本维度 {topicQuotes.length}
            </span>
            <span className="rounded-full bg-[#f4f2ec] px-2.5 py-1">
              第 {safePage} / {totalPages} 页
            </span>
            {query.trim() && (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="rounded-full border border-[#ded8cd] bg-white px-2.5 py-1 font-bold text-[#6f6a63] hover:bg-[#f7f4ee]"
              >
                清除搜索
              </button>
            )}
          </div>
        </div>

        {pageQuotes.length > 0 ? (
          <div className="grid gap-4 lg:grid-cols-2">
            {pageQuotes.map((quote) => (
              <QuoteCard key={quote.id} quote={quote} query={query} keywords={visibleKeywords} color={config.color} />
            ))}
          </div>
        ) : (
          <div className="rounded-lg border border-dashed border-[#d8d1c5] bg-white p-10 text-center">
            <MessageSquareQuote className="mx-auto mb-3 text-[#aaa49a]" size={28} />
            <div className="text-base font-extrabold text-[#34312c]">没有找到匹配原声</div>
            <p className="mt-2 text-sm text-[#7a746b]">换一个关键词，或返回维度页查看其他维度。</p>
          </div>
        )}

        {filteredQuotes.length > 0 && (
          <Pagination page={safePage} totalPages={totalPages} onPageChange={setPage} />
        )}
      </section>
    </main>
  );
}

function isInsightCategorySlug(value: string | undefined): value is InsightCategorySlug {
  return QUALITATIVE_RESEARCH_SLUGS.includes(value as InsightCategorySlug);
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

function QuoteCard({
  quote,
  query,
  keywords,
  color,
}: {
  quote: CategoryQuote;
  query: string;
  keywords: string[];
  color: string;
}) {
  return (
    <article data-evidence-card className="rounded-lg border border-[#e3dfd6] bg-white p-4 shadow-sm">
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <span className="rounded-full bg-[#f4f2ec] px-2.5 py-1 text-xs font-bold text-[#5f5a52]">
          <HighlightedText text={quote.projectName} query={query} />
        </span>
        <span
          className="rounded-full px-2.5 py-1 text-xs font-bold"
          style={{ backgroundColor: sentimentMeta[quote.sentiment].bg, color: sentimentMeta[quote.sentiment].color }}
        >
          {sentimentMeta[quote.sentiment].label}
        </span>
        <span className="rounded-full px-2.5 py-1 text-xs font-bold" style={{ backgroundColor: '#fff1ed', color }}>
          {quote.userRole}
        </span>
      </div>

      <blockquote className="border-l-4 pl-4" style={{ borderColor: color }}>
        <p className="text-[15px] leading-7 text-[#2f2b26]">
          <HighlightedText text={quote.text} query={query} keywords={keywords} />
        </p>
      </blockquote>

      <SegmentLabelChips text={quote.text} className="mt-3" />

      {(() => {
        const clips = quote.clips ?? lookupClips(quote.text);
        return clips.length > 0 ? (
          <div className="mt-3">
            <EvidenceAudioClips clips={clips} />
          </div>
        ) : null;
      })()}

      <div className="mt-4 grid gap-2 text-xs text-[#7a746b] sm:grid-cols-2">
        <MetaItem icon={<FileText size={13} />} label="来源">
          <HighlightedText text={quote.sourceName} query={query} keywords={keywords} />
        </MetaItem>
        <MetaItem icon={<MessageSquareQuote size={13} />} label="子议题">
          <HighlightedText text={quote.subSubCategory} query={query} keywords={keywords} />
        </MetaItem>
      </div>
      {quote.respondent && (
        <div className="mt-2 text-xs text-[#9a948b]">
          用户：<HighlightedText text={quote.respondent} query={query} keywords={keywords} />
        </div>
      )}
    </article>
  );
}

function MetaItem({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) {
  return (
    <div className="flex min-w-0 items-start gap-1.5 rounded-md bg-[#fbfaf7] px-2.5 py-2">
      <span className="mt-0.5 shrink-0 text-[#9a948b]">{icon}</span>
      <div className="min-w-0">
        <div className="font-bold text-[#8a857d]">{label}</div>
        <div className="mt-0.5 break-words text-[#5f5a52]">{children}</div>
      </div>
    </div>
  );
}

function Pagination({
  page,
  totalPages,
  onPageChange,
}: {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) {
  const pages = getVisiblePages(page, totalPages);
  return (
    <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
      <button
        type="button"
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
        className="inline-flex h-9 items-center gap-1 rounded-md border border-[#ded8cd] bg-white px-3 text-sm font-bold text-[#5f5a52] disabled:cursor-not-allowed disabled:opacity-40"
      >
        <ChevronLeft size={15} />
        上一页
      </button>
      {pages.map((item, index) =>
        item === 'ellipsis' ? (
          <span key={`ellipsis-${index}`} className="px-1 text-[#9a948b]">
            ...
          </span>
        ) : (
          <button
            key={item}
            type="button"
            onClick={() => onPageChange(item)}
            className={`h-9 min-w-9 rounded-md border px-3 text-sm font-bold ${
              item === page
                ? 'border-[#e65532] bg-[#fff1ed] text-[#e65532]'
                : 'border-[#ded8cd] bg-white text-[#5f5a52] hover:bg-[#f7f4ee]'
            }`}
          >
            {item}
          </button>
        ),
      )}
      <button
        type="button"
        disabled={page >= totalPages}
        onClick={() => onPageChange(page + 1)}
        className="inline-flex h-9 items-center gap-1 rounded-md border border-[#ded8cd] bg-white px-3 text-sm font-bold text-[#5f5a52] disabled:cursor-not-allowed disabled:opacity-40"
      >
        下一页
        <ChevronRight size={15} />
      </button>
    </div>
  );
}

function getVisiblePages(page: number, totalPages: number): Array<number | 'ellipsis'> {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }
  const pages = new Set([1, totalPages, page - 1, page, page + 1].filter((value) => value >= 1 && value <= totalPages));
  const sorted = [...pages].sort((a, b) => a - b);
  return sorted.flatMap((value, index) => {
    const previous = sorted[index - 1];
    if (previous && value - previous > 1) return ['ellipsis' as const, value];
    return [value];
  });
}

function HighlightedText({ text, query, keywords = [] }: { text?: string; query: string; keywords?: string[] }) {
  const value = text ?? '';
  const keyword = query.trim();
  const activeKeywords = keyword ? [keyword] : keywords.filter((item) => item.trim());
  if (activeKeywords.length === 0) return <>{value}</>;

  const regex = new RegExp(`(${activeKeywords.map(escapeRegExp).join('|')})`, 'gi');
  const parts = value.split(regex);
  return (
    <>
      {parts.map((part, index) =>
        activeKeywords.some((item) => item.toLowerCase() === part.toLowerCase()) ? (
          <mark key={`${part}-${index}`} className="rounded bg-[#fff0a8] px-0.5 font-extrabold text-[#6f4a00]">
            {part}
          </mark>
        ) : (
          <React.Fragment key={`${part}-${index}`}>{part}</React.Fragment>
        ),
      )}
    </>
  );
}

function getVisibleKeywords(keywords: string[]): string[] {
  return [...new Set(keywords)]
    .filter((keyword) => keyword.trim().length > 0 && keyword.trim().length <= 6)
    .slice(0, 8);
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
