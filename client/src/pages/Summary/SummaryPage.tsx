import React from 'react';
import { useParams } from 'react-router-dom';
import ReportExportToolbar from '../../components/report/ReportExportToolbar';
import QuantitativePage from '../Quantitative/QuantitativePage';
import fromPrimaryBriefing from '../../content/from-primary-brief.md?raw';
import jisuanyingBriefing from '../../content/jisuanying-brief.md?raw';

const FROM_PRIMARY_BRIEFING = {
  title: '前情提要',
  summary: '从增长目标、研究问题与目标人群三个方面，说明本次“从小学”研究为何开展。',
  markdown: fromPrimaryBriefing,
};

const JISUANYING_BRIEFING = {
  title: '前情提要',
  summary: '说明计算营的调研目的，以及围绕市场、人群、产品价值和增长模型提出的四项研究假设。',
  markdown: jisuanyingBriefing,
};

export default function SummaryPage() {
  const iframeRef = React.useRef<HTMLIFrameElement>(null);
  const { projectId } = useParams<{ projectId: string }>();
  if (projectId === 'jisuanying_project') {
    return (
      <div className="flex h-full min-h-0 flex-col">
        <ReportExportToolbar
          iframeRef={iframeRef}
          sourceUrl="/"
          fileName="计算营用户研究"
          briefing={JISUANYING_BRIEFING}
          showExportActions={false}
        />
        <div className="min-h-0 flex-1 overflow-y-auto">
          <QuantitativePage />
        </div>
      </div>
    );
  }
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
