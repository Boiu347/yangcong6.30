import React from 'react';
import { useParams } from 'react-router-dom';
import ReportExportToolbar from '../../components/report/ReportExportToolbar';
import QuantitativePage from '../Quantitative/QuantitativePage';
import FamilyReport from '../FamilyPackage/FamilyReport';
import PaisouUnderConstruction from '../Paisou/PaisouUnderConstruction';
import fromPrimaryBriefing from '../../content/from-primary-brief.md?raw';
import FromPrimaryMergedReport from './FromPrimaryMergedReport';

const FROM_PRIMARY_BRIEFING = {
  title: '前情提要',
  summary: '从增长目标、研究问题与目标人群三个方面，说明本次“从小学”研究为何开展。',
  markdown: fromPrimaryBriefing,
};

export default function SummaryPage() {
  const iframeRef = React.useRef<HTMLIFrameElement>(null);
  const { projectId } = useParams<{ projectId: string }>();
  if (projectId === 'jisuanying_project') {
    return (
      <div className="flex h-full min-h-0 flex-col">
        <div className="min-h-0 flex-1 overflow-y-auto">
          <QuantitativePage />
        </div>
      </div>
    );
  }
  if (projectId === 'jiatingbao_project')
    return <FamilyReport src="/jiatingbao-overview.html" fileName="洋葱家庭包用户调研·项目总结" title="项目总结" />;
  if (projectId === 'paisou_project')
    return <PaisouUnderConstruction section="项目总结" hint="项目总结与核心结论还在汇总，完成后会在此呈现。" />;
  if (!projectId || projectId === 'default_project') return <FromPrimaryMergedReport />;
  return (
    <div className="flex h-full min-h-0 flex-col">
      <ReportExportToolbar
        iframeRef={iframeRef}
        sourceUrl="/story.html"
        fileName="从小学用户调研"
        briefing={FROM_PRIMARY_BRIEFING}
        showBriefingPanel={false}
      />
      <iframe ref={iframeRef} src="/story.html" title="项目总结" className="min-h-0 w-full flex-1 border-0" />
    </div>
  );
}
