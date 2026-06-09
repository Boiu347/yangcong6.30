import React from 'react';
import ReportExportToolbar from '../../components/report/ReportExportToolbar';

export default function ResearchReportsPage() {
  const iframeRef = React.useRef<HTMLIFrameElement>(null);
  return (
    <div className="flex h-full min-h-0 flex-col">
      <ReportExportToolbar
        iframeRef={iframeRef}
        sourceUrl="/jisuanying-story.html"
        fileName="计算营行业与用户研究整合报告"
      />
      <iframe
        ref={iframeRef}
        src="/jisuanying-story.html"
        title="计算营行业与用户研究整合报告"
        className="min-h-0 w-full flex-1 border-0"
      />
    </div>
  );
}
