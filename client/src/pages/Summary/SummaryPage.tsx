import React from 'react';
import { useParams } from 'react-router-dom';
import ReportExportToolbar from '../../components/report/ReportExportToolbar';
import ComputingDashboard from './ComputingDashboard';
import fromPrimaryBriefing from '../../content/from-primary-brief.md?raw';

const FROM_PRIMARY_BRIEFING = {
  title: '前情提要',
  summary: '围绕“有戏、有差、有路”，补充从小学系列的市场空间、差异化定位、人群、渠道与 SKU/价格研究背景。',
  markdown: fromPrimaryBriefing,
};

export default function SummaryPage() {
  const iframeRef = React.useRef<HTMLIFrameElement>(null);
  const { projectId } = useParams<{ projectId: string }>();
  if (projectId === 'jisuanying_project') return <ComputingDashboard />;
  return (
    <div className="flex h-full min-h-0 flex-col">
      <ReportExportToolbar
        iframeRef={iframeRef}
        sourceUrl="/story.html"
        fileName="从小学用户调研"
        briefing={FROM_PRIMARY_BRIEFING}
      />
      <iframe ref={iframeRef} src="/story.html" title="项目总结" className="min-h-0 w-full flex-1 border-0" />
    </div>
  );
}
