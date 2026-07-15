import { ArrowUpRight, FileText } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useParams } from 'react-router-dom';
import {
  DEFAULT_PROJECT_BACKGROUND,
  PROJECT_BACKGROUNDS,
} from '../../content/projectBackgrounds';
import {
  extractResearchObjectives,
  normalizeMarkdownEmphasis,
} from '../../utils/markdownText';
import PaisouUnderConstruction from '../Paisou/PaisouUnderConstruction';

const objectiveStyles = [
  {
    accent: '#D94A3A',
    background: '#FFF5F2',
    border: '#F2C8C0',
    label: '#A5362B',
  },
  {
    accent: '#4D6FB8',
    background: '#F3F6FD',
    border: '#CAD5EF',
    label: '#38558F',
  },
  {
    accent: '#2F8A78',
    background: '#F1F8F6',
    border: '#C1DFD7',
    label: '#22695B',
  },
  {
    accent: '#A06A2B',
    background: '#FFF8EC',
    border: '#E9D2AD',
    label: '#7B4F1E',
  },
];

export default function BackgroundPage() {
  const { projectId } = useParams<{ projectId: string }>();
  if (projectId === 'paisou_project') {
    return (
      <PaisouUnderConstruction
        section="调研背景"
        hint="调研背景与资料索引还在整理，完成后会在此呈现。"
      />
    );
  }
  const background =
    PROJECT_BACKGROUNDS[projectId ?? ''] ?? DEFAULT_PROJECT_BACKGROUND;
  const normalizedMarkdown = normalizeMarkdownEmphasis(background.markdown);
  const researchSection = extractResearchObjectives(normalizedMarkdown);
  const backgroundDocument = background.resources.find(
    (resource) => resource.url,
  );

  const renderMarkdown = (markdown: string) => (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        strong: ({ children }) => (
          <strong className="font-bold text-[#3B342E]">{children}</strong>
        ),
      }}
    >
      {markdown}
    </ReactMarkdown>
  );

  return (
    <main className="min-h-full bg-[#F7F5F0] px-5 py-10 text-[#292724] md:px-10 md:py-16">
      <div className="mx-auto max-w-[1120px]">
        <header className="mb-10 max-w-3xl md:mb-14">
          <div className="mb-4 flex items-center gap-2 text-[11px] font-bold tracking-[0.18em] text-[#E65532]">
            <span className="h-0.5 w-6 rounded-full bg-[#E65532]" />
            {background.eyebrow}
          </div>
          <h1 className="text-[36px] font-black leading-tight tracking-[-0.045em] md:text-[52px]">
            {background.title}
          </h1>
          <p className="mt-5 text-[15px] leading-8 text-[#716C65] md:text-[17px]">
            {background.summary}
          </p>
          {background.projectLead && (
            <p className="mt-4 inline-flex items-center gap-2 rounded-full border border-[#E4DED5] bg-white px-4 py-2 text-[13px] font-bold text-[#5F5851]">
              <span className="text-[#9A948B]">项目负责人</span>
              <span className="text-[#292724]">{background.projectLead}</span>
            </p>
          )}
        </header>

        <article className="rounded-[28px] border border-[#E4DED5] bg-white px-6 py-7 shadow-[0_18px_60px_rgba(61,49,37,.06)] md:px-10 md:py-10 lg:px-12">
          <div className="prose prose-stone max-w-none prose-headings:tracking-[-0.025em] prose-headings:text-[#292724] prose-h1:hidden prose-h2:mt-10 prose-h2:text-[23px] prose-h3:text-[18px] prose-p:leading-8 prose-li:leading-7 prose-strong:text-[#3B342E] prose-table:text-sm">
            {researchSection ? (
              <>
                {renderMarkdown(researchSection.before)}

                <section
                  className="not-prose mt-10"
                  aria-labelledby="research-objectives"
                >
                  <h2
                    id="research-objectives"
                    className="text-[23px] font-black tracking-[-0.025em] text-[#292724]"
                  >
                    研究目标
                  </h2>
                  <div
                    className={`mt-5 grid gap-3 ${
                      researchSection.objectives.length === 4
                        ? 'md:grid-cols-2 xl:grid-cols-4'
                        : 'md:grid-cols-3'
                    }`}
                  >
                    {researchSection.objectives.map((objective, index) => {
                      const style =
                        objectiveStyles[index % objectiveStyles.length];
                      return (
                        <div
                          key={`${objective.number}-${objective.title}`}
                          className="flex min-h-[280px] flex-col rounded-[20px] border p-5"
                          style={{
                            backgroundColor: style.background,
                            borderColor: style.border,
                          }}
                        >
                          <span
                            className="flex h-8 w-8 items-center justify-center rounded-full text-[13px] font-black text-white"
                            style={{ backgroundColor: style.accent }}
                          >
                            {objective.number}
                          </span>
                          <h3
                            className="mt-5 text-[20px] font-black leading-tight tracking-[-0.035em]"
                            style={{ color: style.label }}
                          >
                            {objective.title}
                          </h3>
                          <div className="mt-5">
                            <p
                              className="text-[11px] font-black tracking-[0.08em]"
                              style={{ color: style.accent }}
                            >
                              研究需回答
                            </p>
                            <p className="mt-1.5 text-[13px] leading-6 text-[#514C46]">
                              {objective.question}
                            </p>
                          </div>
                          {objective.value && (
                            <div
                              className="mt-4 border-t pt-4"
                              style={{ borderColor: style.border }}
                            >
                              <p
                                className="text-[11px] font-black tracking-[0.08em]"
                                style={{ color: style.accent }}
                              >
                                业务价值
                              </p>
                              <p className="mt-1.5 text-[12px] leading-5 text-[#716C65]">
                                {objective.value}
                              </p>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </section>

                {backgroundDocument?.url && (
                  <a
                    href={backgroundDocument.url}
                    target="_blank"
                    rel="noreferrer"
                    className="not-prose group mt-5 flex flex-col gap-4 rounded-[18px] border border-[#E4DED5] bg-[#FAF8F4] px-5 py-4 transition-colors hover:border-[#E8A38F] hover:bg-[#FFF9F6] sm:flex-row sm:items-center sm:justify-between"
                  >
                    <span className="flex min-w-0 items-center gap-3.5">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#FFF0EA] text-[#D94A3A]">
                        <FileText size={18} />
                      </span>
                      <span className="min-w-0">
                        <span className="block text-[10px] font-black tracking-[0.12em] text-[#B25A43]">
                          研究方案文档
                        </span>
                        <span className="mt-1 block text-[15px] font-black text-[#352F2A]">
                          {backgroundDocument.label}
                        </span>
                        <span className="mt-1 block text-[12px] leading-5 text-[#77716A]">
                          {backgroundDocument.description}
                        </span>
                      </span>
                    </span>
                    <span className="inline-flex shrink-0 items-center gap-1.5 text-[12px] font-black text-[#C64A2E]">
                      查看文档
                      <ArrowUpRight size={14} />
                    </span>
                  </a>
                )}

                {researchSection.after && renderMarkdown(researchSection.after)}
              </>
            ) : (
              renderMarkdown(normalizedMarkdown)
            )}
          </div>
        </article>
      </div>
    </main>
  );
}
