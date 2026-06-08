import React from 'react';
import { useParams } from 'react-router-dom';
import ReportExportToolbar from '../../components/report/ReportExportToolbar';

export default function SummaryPage() {
  const iframeRef = React.useRef<HTMLIFrameElement>(null);
  const { projectId } = useParams<{ projectId: string }>();
  const sourceUrl = projectId === 'jisuanying_project' ? '/jisuanying-story.html' : '/story.html';

  return (
    <div className="flex flex-col h-full min-h-0">
      <ReportExportToolbar
        iframeRef={iframeRef}
        sourceUrl={sourceUrl}
        fileName="项目总结"
      />
      <iframe
        ref={iframeRef}
        src={sourceUrl}
        title="计算营用户研究与续费诊断报告"
        className="w-full flex-1 min-h-0 border-0"
      />
    </div>
  );
}
