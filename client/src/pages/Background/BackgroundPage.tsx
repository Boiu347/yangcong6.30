import { ArrowUpRight, FileText, Link2, Sparkles } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useParams } from 'react-router-dom';
import {
  DEFAULT_PROJECT_BACKGROUND,
  PROJECT_BACKGROUNDS,
} from '../../content/projectBackgrounds';

export default function BackgroundPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const background = PROJECT_BACKGROUNDS[projectId ?? ''] ?? DEFAULT_PROJECT_BACKGROUND;

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
        </header>

        <div className="grid items-start gap-7 lg:grid-cols-[minmax(0,1fr)_320px]">
          <article className="rounded-[28px] border border-[#E4DED5] bg-white px-6 py-7 shadow-[0_18px_60px_rgba(61,49,37,.06)] md:px-10 md:py-10">
            <div className="prose prose-stone max-w-none prose-headings:tracking-[-0.025em] prose-headings:text-[#292724] prose-h1:hidden prose-h2:mt-10 prose-h2:text-[23px] prose-h3:text-[18px] prose-p:leading-8 prose-li:leading-7 prose-strong:text-[#3B342E] prose-table:text-sm">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{background.markdown}</ReactMarkdown>
            </div>
          </article>

          <aside className="space-y-4 lg:sticky lg:top-8">
            <div className="rounded-[24px] bg-[#292724] p-6 text-white">
              <div className="flex items-center gap-2 text-[11px] font-bold tracking-[0.14em] text-[#FF9C7D]">
                <Link2 size={15} />
                相关资料
              </div>
              <p className="mt-4 text-[13px] leading-6 text-[#D5D0C9]">
                将会议上下文与研究结论放在同一入口，方便回看关键讨论和决策依据。
              </p>
            </div>

            {background.resources.map((resource, index) => {
              const Icon = index === 0 ? FileText : Sparkles;
              const content = (
                <>
                  <div className="flex items-start justify-between gap-4">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FFF0EA] text-[#E65532]">
                      <Icon size={19} />
                    </span>
                    {resource.url ? (
                      <ArrowUpRight size={17} className="text-[#E65532]" />
                    ) : (
                      <span className="rounded-full bg-[#F1EFEA] px-2.5 py-1 text-[10px] font-bold text-[#9A948B]">
                        链接待补充
                      </span>
                    )}
                  </div>
                  <h2 className="mt-5 text-[15px] font-black">{resource.label}</h2>
                  <p className="mt-2 text-[12px] leading-6 text-[#77716A]">{resource.description}</p>
                </>
              );

              return resource.url ? (
                <a
                  key={resource.label}
                  href={resource.url}
                  target="_blank"
                  rel="noreferrer"
                  className="block rounded-[22px] border border-[#E4DED5] bg-white p-5 transition-all hover:-translate-y-0.5 hover:border-[#E9A58E] hover:shadow-lg"
                >
                  {content}
                </a>
              ) : (
                <div
                  key={resource.label}
                  aria-disabled="true"
                  className="rounded-[22px] border border-[#E4DED5] bg-white/75 p-5"
                >
                  {content}
                </div>
              );
            })}
          </aside>
        </div>
      </div>
    </main>
  );
}
