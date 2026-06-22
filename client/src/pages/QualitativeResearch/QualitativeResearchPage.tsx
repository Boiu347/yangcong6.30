import { BookOpen, ChevronRight, MessageSquareQuote, Monitor, ShoppingCart } from 'lucide-react';
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProjects } from '../../store/useProjectStore';
import {
  buildBusinessDirections,
  buildCategoryInsightData,
  CATEGORY_EXECUTIVE_SUMMARIES,
  INSIGHT_CATEGORY_CONFIGS,
  QUALITATIVE_RESEARCH_SLUGS,
  type CategoryQuote,
  type InsightCategorySlug,
} from '../InsightCategory/categoryInsights';

const iconMap = {
  'app-experience': Monitor,
  'course-experience': BookOpen,
  'purchase-decision': ShoppingCart,
} satisfies Record<InsightCategorySlug, typeof Monitor>;

export default function QualitativeResearchPage() {
  const navigate = useNavigate();
  const projects = useProjects();
  const cards = useMemo(
    () =>
      QUALITATIVE_RESEARCH_SLUGS.map((slug) => {
        const data = buildCategoryInsightData(projects, slug);
        const directions = buildBusinessDirections(slug, data.quotes);
        const directionQuotes = directions.flatMap((direction) => direction.quotes);
        const projectNames = [...new Set(directionQuotes.map((quote) => quote.projectName))];
        return {
          slug,
          data,
          quoteCount: directionQuotes.length,
          sourceCount: new Set(directionQuotes.map((quote) => quote.sourceId)).size,
          projectNames,
          representativeQuote: pickRepresentativeQuote(directionQuotes),
        };
      }),
    [projects],
  );

  return (
    <main className="min-h-[calc(100vh-52px)] bg-[#f4f5f2]">
      <section className="border-b border-[#e2dfd7] bg-white">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
          <div className="max-w-3xl">
            <div className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-[#928b80]">
              Qualitative Research
            </div>
            <h1 className="text-[30px] font-extrabold leading-tight text-[#25231f] sm:text-[38px]">
              定性调研
            </h1>
            <p className="mt-3 text-[15px] leading-7 text-[#5f5a52]">
              把定性调研项目里的用户原声按业务方向整理成三张卡，先看判断，再点进去查证据。
              当前仅纳入项目方法包含“定性调研”的项目。
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
        <div className="grid gap-4 lg:grid-cols-3">
          {cards.map(({ slug, data, quoteCount, sourceCount, projectNames, representativeQuote }) => {
            const config = INSIGHT_CATEGORY_CONFIGS[slug];
            const summary = CATEGORY_EXECUTIVE_SUMMARIES[slug];
            const Icon = iconMap[slug];

            return (
              <button
                key={slug}
                type="button"
                onClick={() => navigate(`/qualitative-research/${slug}`)}
                className="group flex h-full flex-col rounded-lg border border-[#e3dfd6] bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-[#d5cbbd] hover:shadow-md"
              >
                <div className="mb-4 flex items-start justify-between gap-3">
                  <span
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg"
                    style={{ backgroundColor: config.tint, color: config.color }}
                  >
                    <Icon size={20} />
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-[#8a857d] group-hover:text-[#e65532]">
                    查看原声
                    <ChevronRight size={14} />
                  </span>
                </div>

                <h2 className="text-xl font-extrabold text-[#25231f]">{config.title}</h2>
                <p className="mt-2 line-clamp-3 text-sm leading-6 text-[#5f5a52]">{summary.verdict}</p>

                <div className="mt-4 grid grid-cols-3 gap-2">
                  <CardMetric label="原声" value={quoteCount} color={config.color} />
                  <CardMetric label="项目" value={data.totalProjects} color={config.color} />
                  <CardMetric label="材料" value={sourceCount} color={config.color} />
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {projectNames.length > 0 ? (
                    projectNames.map((name) => (
                      <span key={name} className="rounded-full bg-[#f4f2ec] px-2.5 py-1 text-xs font-medium text-[#6f6a63]">
                        {name}
                      </span>
                    ))
                  ) : (
                    <span className="rounded-full bg-[#f4f2ec] px-2.5 py-1 text-xs font-medium text-[#8a857d]">
                      暂无匹配项目
                    </span>
                  )}
                </div>

                <div className="mt-4 rounded-lg border border-[#ebe7de] bg-[#fbfaf7] p-3">
                  <div className="mb-2 flex items-center gap-1.5 text-xs font-bold text-[#6f6a63]">
                    <MessageSquareQuote size={13} style={{ color: config.color }} />
                    代表原声
                  </div>
                  {representativeQuote ? (
                    <>
                      <p className="line-clamp-4 text-sm leading-6 text-[#34312c]">
                        {representativeQuote.text}
                      </p>
                      <div className="mt-2 text-xs text-[#9a948b]">
                        {representativeQuote.projectName} / {representativeQuote.sourceName}
                      </div>
                    </>
                  ) : (
                    <p className="text-sm leading-6 text-[#8a857d]">{config.emptyHint}</p>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </section>
    </main>
  );
}

function CardMetric({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="rounded-md bg-[#f7f5ef] px-2.5 py-2">
      <div className="text-[11px] font-medium text-[#8a857d]">{label}</div>
      <div className="mt-0.5 text-lg font-extrabold" style={{ color }}>
        {value}
      </div>
    </div>
  );
}

function pickRepresentativeQuote(quotes: CategoryQuote[]): CategoryQuote | undefined {
  return [...quotes].sort((a, b) => scoreQuote(b) - scoreQuote(a))[0];
}

function scoreQuote(quote: CategoryQuote): number {
  let score = 0;
  if (quote.respondent) score += 2;
  if (quote.text.length > 24 && quote.text.length < 140) score += 2;
  if (quote.sentiment === 'negative') score += 1;
  return score;
}
