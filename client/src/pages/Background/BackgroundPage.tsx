import { ArrowUpRight, ExternalLink, FileText, Link2, Sparkles } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useParams } from 'react-router-dom';
import {
  DEFAULT_PROJECT_BACKGROUND,
  PROJECT_BACKGROUNDS,
} from '../../content/projectBackgrounds';
import PaisouUnderConstruction from '../Paisou/PaisouUnderConstruction';

export default function BackgroundPage() {
  const { projectId } = useParams<{ projectId: string }>();
  if (projectId === 'paisou_project') {
    return <PaisouUnderConstruction section="调研背景" hint="调研背景与资料索引还在整理，完成后会在此呈现。" />;
  }
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
          {background.projectLead && (
            <p className="mt-4 inline-flex items-center gap-2 rounded-full border border-[#E4DED5] bg-white px-4 py-2 text-[13px] font-bold text-[#5F5851]">
              <span className="text-[#9A948B]">项目负责人</span>
              <span className="text-[#292724]">{background.projectLead}</span>
            </p>
          )}
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
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-[#F0B39F] bg-[#FFF4EF] px-2.5 py-1 text-[10px] font-black text-[#D84E2C]">
                        点击打开
                        <ArrowUpRight size={12} />
                      </span>
                    ) : (
                      <span className="rounded-full bg-[#F1EFEA] px-2.5 py-1 text-[10px] font-bold text-[#9A948B]">
                        链接待补充
                      </span>
                    )}
                  </div>
                  <h2 className="mt-5 text-[15px] font-black">{resource.label}</h2>
                  <p className="mt-2 text-[12px] leading-6 text-[#77716A]">{resource.description}</p>
                  {resource.url && (
                    <div className="mt-4 flex items-center justify-between rounded-2xl border border-[#F0E0D8] bg-[#FFF9F6] px-3.5 py-3 text-[11px] font-bold text-[#C74E2F]">
                      <span className="inline-flex items-center gap-2">
                        <ExternalLink size={13} />
                        外部链接
                      </span>
                      <span className="text-[#E65532]">查看资料</span>
                    </div>
                  )}
                </>
              );

              return resource.url ? (
                <a
                  key={resource.label}
                  href={resource.url}
                  target="_blank"
                  rel="noreferrer"
                  className="group block rounded-[22px] border border-[#E4DED5] bg-white p-5 shadow-[0_10px_30px_rgba(61,49,37,.04)] ring-1 ring-transparent transition-all hover:-translate-y-0.5 hover:border-[#E65532] hover:shadow-[0_18px_45px_rgba(230,85,50,.14)] hover:ring-[#F5B8A5] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E65532]"
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
