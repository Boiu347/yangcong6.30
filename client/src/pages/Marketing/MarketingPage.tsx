import React from 'react';
import ReportExportToolbar from '../../components/report/ReportExportToolbar';

export default function MarketingPage() {
  const iframeRef = React.useRef<HTMLIFrameElement>(null);

  return (
    <div className="flex flex-col h-full min-h-0">
      <ReportExportToolbar
        iframeRef={iframeRef}
        sourceUrl="/marketing/index.html"
        fileName="营销落地"
      />
      <iframe
        ref={iframeRef}
        src="/marketing/index.html"
        title="从小学系列 · 品牌定位与卖点支撑"
        className="w-full flex-1 border-0 min-h-0"
      />
    </div>
  );
}
