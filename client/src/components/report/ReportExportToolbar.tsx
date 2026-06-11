import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  ChevronDown,
  ChevronUp,
  Download,
  FileText,
  Info,
  Loader2,
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

type ExportType = 'word' | 'pdf';

export interface ReportBriefing {
  title: string;
  summary: string;
  markdown: string;
}

interface Props {
  iframeRef: React.RefObject<HTMLIFrameElement>;
  sourceUrl: string;
  fileName: string;
  briefing?: ReportBriefing;
  showExportActions?: boolean;
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function absolutizeUrl(value: string, baseUrl: string) {
  try {
    return new URL(value, baseUrl).href;
  } catch {
    return value;
  }
}

function renderBriefingHtml(briefing: ReportBriefing) {
  const content = renderToStaticMarkup(
    <ReactMarkdown remarkPlugins={[remarkGfm]}>{briefing.markdown}</ReactMarkdown>,
  );
  return `
    <section class="project-briefing">
      <div class="briefing-kicker">项目背景 · 前情提要</div>
      <h1>${briefing.title}</h1>
      <div class="briefing-content">${content}</div>
    </section>
  `;
}

function buildWordHtml(rawHtml: string, sourceUrl: string, briefing?: ReportBriefing) {
  const baseUrl = new URL(sourceUrl, window.location.href).href;
  const doc = new DOMParser().parseFromString(rawHtml, 'text/html');

  doc.querySelectorAll('script').forEach((node) => node.remove());
  doc.querySelectorAll<HTMLElement>('[src]').forEach((node) => {
    const src = node.getAttribute('src');
    if (src) node.setAttribute('src', absolutizeUrl(src, baseUrl));
  });
  doc.querySelectorAll<HTMLAnchorElement | HTMLLinkElement>('[href]').forEach((node) => {
    const href = node.getAttribute('href');
    if (href && !href.startsWith('#')) node.setAttribute('href', absolutizeUrl(href, baseUrl));
  });

  const headHtml = doc.head.innerHTML.replace(
    /url\((['"]?)(?!data:|https?:|blob:)([^'")]+)\1\)/g,
    (_match, quote: string, assetPath: string) => `url(${quote}${absolutizeUrl(assetPath, baseUrl)}${quote})`,
  );
  const briefingHtml = briefing ? renderBriefingHtml(briefing) : '';

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  ${headHtml}
  <style>
    @page { size: A4; margin: 18mm; }
    body { font-family: "Noto Sans SC", "Microsoft YaHei", Arial, sans-serif; }
    img { max-width: 100%; height: auto; }
    * { animation: none !important; transition: none !important; }
    .rv { opacity: 1 !important; transform: none !important; }
    #nav, #prog, .scroll-c, .play-btn, .st { display: none !important; }
    #s0 { min-height: auto !important; padding-bottom: 32px !important; }
    .wrap { padding-top: 48px !important; padding-bottom: 48px !important; }
    .ticker { animation: none !important; transform: none !important; flex-wrap: wrap !important; width: auto !important; }
    .project-briefing { color: #292929; page-break-after: always; padding: 8px 4px 24px; }
    .project-briefing .briefing-kicker { color: #e65532; font-size: 11pt; font-weight: 700; margin-bottom: 12px; }
    .project-briefing h1 { font-size: 24pt; margin: 0 0 24px; }
    .project-briefing h2 { font-size: 17pt; margin-top: 28px; }
    .project-briefing h3 { font-size: 14pt; margin-top: 22px; }
    .project-briefing p, .project-briefing li { font-size: 10.5pt; line-height: 1.75; }
    .project-briefing blockquote { border-left: 3px solid #e65532; margin-left: 0; padding: 8px 14px; background: #fff7f3; color: #555; }
    .project-briefing table { border-collapse: collapse; width: 100%; margin: 14px 0; }
    .project-briefing th, .project-briefing td { border: 1px solid #d8d7d0; padding: 7px; vertical-align: top; font-size: 9.5pt; }
    .project-briefing th { background: #f4f3ee; }
    .project-briefing pre { background: #f4f3ee; padding: 12px; white-space: pre-wrap; }
  </style>
</head>
<body>
${briefingHtml}
${doc.body.innerHTML}
</body>
</html>`;
}

async function waitForIframeReady(iframe: HTMLIFrameElement) {
  const win = iframe.contentWindow;
  const doc = iframe.contentDocument;
  if (!win || !doc) throw new Error('报告页面尚未加载完成');

  if (doc.readyState !== 'complete') {
    await new Promise<void>((resolve) => {
      iframe.addEventListener('load', () => resolve(), { once: true });
    });
  }

  await doc.fonts?.ready.catch(() => undefined);
  await Promise.all(
    Array.from(doc.images)
      .filter((img) => !img.complete)
      .map((img) =>
        new Promise<void>((resolve) => {
          img.onload = () => resolve();
          img.onerror = () => resolve();
        }),
      ),
  );
}

async function exportWord(sourceUrl: string, fileName: string, briefing?: ReportBriefing) {
  const res = await fetch(sourceUrl);
  if (!res.ok) throw new Error('报告内容获取失败');
  const html = await res.text();
  const wordHtml = buildWordHtml(html, sourceUrl, briefing);
  downloadBlob(
    new Blob(['\ufeff', wordHtml], { type: 'application/msword;charset=utf-8' }),
    `${fileName}.doc`,
  );
}

function appendCanvasToPdf(
  pdf: import('jspdf').jsPDF,
  canvas: HTMLCanvasElement,
  addPageBefore: boolean,
) {
  if (addPageBefore) pdf.addPage();
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const imageHeight = (canvas.height * pageWidth) / canvas.width;
  const image = canvas.toDataURL('image/jpeg', 0.95);
  let remainingHeight = imageHeight;
  let y = 0;

  pdf.addImage(image, 'JPEG', 0, y, pageWidth, imageHeight);
  remainingHeight -= pageHeight;
  while (remainingHeight > 0) {
    y -= pageHeight;
    pdf.addPage();
    pdf.addImage(image, 'JPEG', 0, y, pageWidth, imageHeight);
    remainingHeight -= pageHeight;
  }
}

async function exportPdf(
  iframe: HTMLIFrameElement,
  fileName: string,
  briefingElement?: HTMLElement | null,
) {
  await waitForIframeReady(iframe);
  const doc = iframe.contentDocument;
  if (!doc?.body) throw new Error('报告页面尚未加载完成');

  const [{ default: html2canvas }, { default: jsPDF }] = await Promise.all([
    import('html2canvas'),
    import('jspdf'),
  ]);
  const pdf = new jsPDF('p', 'mm', 'a4');
  let hasContent = false;

  if (briefingElement) {
    const briefingCanvas = await html2canvas(briefingElement, {
      backgroundColor: '#ffffff',
      scale: Math.min(1.5, window.devicePixelRatio || 1),
      useCORS: true,
      windowWidth: briefingElement.scrollWidth,
      windowHeight: briefingElement.scrollHeight,
    });
    appendCanvasToPdf(pdf, briefingCanvas, false);
    hasContent = true;
  }

  const target = doc.body;
  const reportCanvas = await html2canvas(target, {
    backgroundColor: '#ffffff',
    scale: Math.min(2, window.devicePixelRatio || 1),
    useCORS: true,
    windowWidth: Math.max(doc.documentElement.scrollWidth, target.scrollWidth),
    windowHeight: Math.max(doc.documentElement.scrollHeight, target.scrollHeight),
    onclone: (clonedDoc) => {
      const style = clonedDoc.createElement('style');
      style.textContent = `
        * { animation: none !important; transition: none !important; }
        .rv { opacity: 1 !important; transform: none !important; }
        #nav, #prog, .scroll-c, .play-btn, .st { display: none !important; }
        #s0 { min-height: auto !important; padding-bottom: 32px !important; }
        .wrap { padding-top: 48px !important; padding-bottom: 48px !important; }
        .ticker { animation: none !important; transform: none !important; flex-wrap: wrap !important; width: auto !important; }
      `;
      clonedDoc.head.appendChild(style);
    },
  });
  appendCanvasToPdf(pdf, reportCanvas, hasContent);
  pdf.save(`${fileName}.pdf`);
}

function BriefingBody({ markdown }: { markdown: string }) {
  return (
    <div className="prose prose-sm max-w-none text-[#40403c] prose-headings:text-[#282826] prose-a:text-[#e65532] prose-table:text-xs">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{markdown}</ReactMarkdown>
    </div>
  );
}

export default function ReportExportToolbar({
  iframeRef,
  sourceUrl,
  fileName,
  briefing,
  showExportActions = true,
}: Props) {
  const [exporting, setExporting] = React.useState<ExportType | null>(null);
  const [briefingOpen, setBriefingOpen] = React.useState(false);
  const briefingExportRef = React.useRef<HTMLDivElement>(null);

  const handleExport = async (type: ExportType) => {
    if (exporting) return;
    setExporting(type);
    try {
      if (type === 'pdf' && briefing) {
        await new Promise<void>((resolve) => {
          requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
        });
      }
      if (type === 'word') {
        await exportWord(sourceUrl, fileName, briefing);
      } else {
        const iframe = iframeRef.current;
        if (!iframe) throw new Error('报告页面尚未加载完成');
        await exportPdf(iframe, fileName, briefing ? briefingExportRef.current : null);
      }
      toast.success(type === 'word' ? 'Word 文档已导出' : 'PDF 已导出');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : '导出失败，请稍后重试');
    } finally {
      setExporting(null);
    }
  };

  const buttonClass =
    'inline-flex items-center gap-1.5 h-8 px-3 rounded-md border border-gray-200 bg-white text-[12px] font-semibold text-gray-600 shadow-sm hover:text-[#e65532] hover:border-[#f2b5a4] transition-colors disabled:opacity-60';

  return (
    <div className="shrink-0 border-b border-gray-100 bg-[#FEFDF9]">
      <div className="flex min-h-12 flex-wrap items-center gap-2 px-3 py-2 sm:px-5">
        {briefing && (
          <button
            type="button"
            onClick={() => setBriefingOpen((open) => !open)}
            aria-expanded={briefingOpen}
            className="flex min-w-0 flex-1 items-center gap-2 rounded-md border border-[#f0d7cd] bg-[#fff8f4] px-3 py-2 text-left hover:border-[#e7a993]"
          >
            <Info size={15} className="shrink-0 text-[#e65532]" />
            <span className="shrink-0 text-xs font-bold text-[#b94428]">{briefing.title}</span>
            <span className="hidden min-w-0 truncate text-xs text-[#777] md:block">{briefing.summary}</span>
            {briefingOpen ? <ChevronUp size={14} className="ml-auto shrink-0 text-[#a45b46]" /> : <ChevronDown size={14} className="ml-auto shrink-0 text-[#a45b46]" />}
          </button>
        )}
        {showExportActions && (
          <div className="ml-auto flex shrink-0 items-center gap-2">
            <button
              type="button"
              disabled={!!exporting}
              onClick={() => void handleExport('word')}
              className={cn(buttonClass)}
            >
              {exporting === 'word' ? <Loader2 size={14} className="animate-spin" /> : <FileText size={14} />}
              导出 Word
            </button>
            <button
              type="button"
              disabled={!!exporting}
              onClick={() => void handleExport('pdf')}
              className={cn(buttonClass)}
            >
              {exporting === 'pdf' ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />}
              导出 PDF
            </button>
          </div>
        )}
      </div>

      {briefing && briefingOpen && (
        <section className="max-h-[46vh] overflow-y-auto border-t border-[#f0ded6] bg-white px-4 py-5 sm:px-8">
          <div className="mx-auto max-w-5xl">
            <div className="mb-4 text-[11px] font-bold tracking-wide text-[#e65532]">项目背景 · 不计入研究数据来源</div>
            <BriefingBody markdown={briefing.markdown} />
          </div>
        </section>
      )}

      {briefing && exporting === 'pdf' && (
        <div
          ref={briefingExportRef}
          aria-hidden="true"
          className="pointer-events-none fixed left-[-10000px] top-0 w-[794px] bg-white px-14 py-12 text-[#292929]"
        >
          <div className="mb-3 text-xs font-bold tracking-wide text-[#e65532]">项目背景 · 前情提要</div>
          <h1 className="mb-8 text-3xl font-bold">{briefing.title}</h1>
          <BriefingBody markdown={briefing.markdown} />
        </div>
      )}
    </div>
  );
}
