import React from 'react';
import ReportExportToolbar from '../../components/report/ReportExportToolbar';

/** 家庭包项目的内嵌 HTML 报告（项目总结 / 核心洞察），与「从小学」story.html 同样的呈现方式 */
export default function FamilyReport({ src, fileName, title }: { src: string; fileName: string; title: string }) {
  const iframeRef = React.useRef<HTMLIFrameElement>(null);
  return (
    <div className="flex h-full min-h-0 flex-col">
      <ReportExportToolbar
        iframeRef={iframeRef as React.RefObject<HTMLIFrameElement>}
        sourceUrl={src}
        fileName={fileName}
      />
      <iframe ref={iframeRef} src={src} title={title} className="min-h-0 w-full flex-1 border-0" />
    </div>
  );
}
