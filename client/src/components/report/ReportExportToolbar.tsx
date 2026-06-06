import React from 'react';
import { Download, FileText, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

type ExportType = 'word' | 'pdf';

interface Props {
  iframeRef: React.RefObject<HTMLIFrameElement>;
  sourceUrl: string;
  fileName: string;
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

function buildWordHtml(rawHtml: string, sourceUrl: string) {
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
  const bodyHtml = doc.body.innerHTML;

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
  </style>
</head>
<body>
${bodyHtml}
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

async function exportWord(sourceUrl: string, fileName: string) {
  const res = await fetch(sourceUrl);
  if (!res.ok) throw new Error('报告内容获取失败');
  const html = await res.text();
  const wordHtml = buildWordHtml(html, sourceUrl);
  downloadBlob(
    new Blob(['\ufeff', wordHtml], { type: 'application/msword;charset=utf-8' }),
    `${fileName}.doc`,
  );
}

async function exportPdf(iframe: HTMLIFrameElement, fileName: string) {
  await waitForIframeReady(iframe);

  const doc = iframe.contentDocument;
  if (!doc?.body) throw new Error('报告页面尚未加载完成');

  const [{ default: html2canvas }, { default: jsPDF }] = await Promise.all([
    import('html2canvas'),
    import('jspdf'),
  ]);

  const target = doc.body;
  const canvas = await html2canvas(target, {
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

  const pdf = new jsPDF('p', 'mm', 'a4');
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const imgWidth = pageWidth;
  const imgHeight = (canvas.height * imgWidth) / canvas.width;

  let remainingHeight = imgHeight;
  let y = 0;

  pdf.addImage(canvas.toDataURL('image/jpeg', 0.95), 'JPEG', 0, y, imgWidth, imgHeight);
  remainingHeight -= pageHeight;

  while (remainingHeight > 0) {
    y -= pageHeight;
    pdf.addPage();
    pdf.addImage(canvas.toDataURL('image/jpeg', 0.95), 'JPEG', 0, y, imgWidth, imgHeight);
    remainingHeight -= pageHeight;
  }

  pdf.save(`${fileName}.pdf`);
}

export default function ReportExportToolbar({ iframeRef, sourceUrl, fileName }: Props) {
  const [exporting, setExporting] = React.useState<ExportType | null>(null);

  const handleExport = async (type: ExportType) => {
    if (exporting) return;
    setExporting(type);
    try {
      if (type === 'word') {
        await exportWord(sourceUrl, fileName);
      } else {
        const iframe = iframeRef.current;
        if (!iframe) throw new Error('报告页面尚未加载完成');
        await exportPdf(iframe, fileName);
      }
      toast.success(type === 'word' ? 'Word 文档已导出' : 'PDF 已导出');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : '导出失败，请稍后重试');
    } finally {
      setExporting(null);
    }
  };

  const buttonClass =
    'inline-flex items-center gap-1.5 h-8 px-3 rounded-lg border border-gray-200 bg-white/95 text-[12px] font-semibold text-gray-600 shadow-sm hover:text-[#FF5722] hover:border-[#FFCCBC] transition-colors disabled:opacity-60';

  return (
    <div
      className="shrink-0 flex items-center justify-end gap-2 px-5 py-2 border-b border-gray-100"
      style={{ background: '#FEFDF9' }}
    >
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
  );
}
