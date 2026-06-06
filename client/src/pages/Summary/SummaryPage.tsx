import React from 'react';
import ReportExportToolbar from '../../components/report/ReportExportToolbar';

export default function SummaryPage() {
  const iframeRef = React.useRef<HTMLIFrameElement>(null);

  return (
    <div className="flex flex-col h-full min-h-0">
      <ReportExportToolbar
        iframeRef={iframeRef}
        sourceUrl="/story.html"
        fileName="项目总结"
      />
      <iframe
        ref={iframeRef}
        src="/story.html"
        title="竞品用户研究叙事报告"
        className="w-full flex-1 min-h-0 border-0"
      />
    </div>
  );
}
