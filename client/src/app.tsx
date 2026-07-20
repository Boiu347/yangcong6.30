import React from 'react';
import { Route, Routes, Navigate, useParams } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import TopNavLayout from './components/layout/TopNavLayout';
import ProjectsPage from './pages/Projects/ProjectsPage';
import ProfilePage from './pages/Profile/ProfilePage';
import LearningAnalysisPage from './pages/LearningAnalysis/LearningAnalysisPage';
import InsightCategoryPage from './pages/InsightCategory/InsightCategoryPage';
import InsightTopicQuotesPage from './pages/InsightCategory/InsightTopicQuotesPage';
import QualitativeResearchPage from './pages/QualitativeResearch/QualitativeResearchPage';
import SummaryPage from './pages/Summary/SummaryPage';
import ConclusionsDemo from './pages/Summary/ConclusionsStoryDemo';
import ConclusionsLegacyDemo from './pages/Summary/ConclusionsDemo';
import CoreConclusionsReport from './pages/CoreConclusions/CoreConclusionsReport';
import JiatingbaoConclusionsDemo from './pages/JiatingbaoConclusionsDemo/JiatingbaoConclusionsDemo';
import JiatingbaoConclusionsV2 from './pages/JiatingbaoConclusionsV2/JiatingbaoConclusionsV2';
import JiatingbaoConclusionsV3 from './pages/JiatingbaoConclusionsV3/JiatingbaoConclusionsV3';
import QualitativePage from './pages/Qualitative/QualitativePage';
import TypicalFamilyStories from './pages/FamilyPackage/TypicalFamilyStories';
import JiatingbaoConclusionsReport from './pages/JiatingbaoConclusions/JiatingbaoConclusionsReport';
import CompetitivePage from './pages/Competitive/CompetitivePage';
import Competitive2Page from './pages/Competitive2/Competitive2Page';
import QuantitativePage from './pages/Quantitative/QuantitativePage';
import MarketingPage from './pages/Marketing/MarketingPage';
import BackgroundPage from './pages/Background/BackgroundPage';
import PortraitsV2Page from './pages/PortraitsV2/PortraitsV2Page';
import NotFound from './pages/NotFound/NotFound';

function ProjectIndexRedirect() {
  const { projectId } = useParams<{ projectId: string }>();
  if (projectId === 'paisou_project') return <Navigate to="qualitative" replace />;
  if (projectId === 'jiatingbao_project') return <Navigate to="background" replace />;
  return <Navigate to="summary" replace />;
}

function ProjectCoreConclusionsPage() {
  const { projectId } = useParams<{ projectId: string }>();
  return projectId === 'jiatingbao_project' ? (
    <JiatingbaoConclusionsReport />
  ) : (
    <CoreConclusionsReport />
  );
}

function ProjectConclusionsDemoPage() {
  const { projectId } = useParams<{ projectId: string }>();
  return projectId === 'jiatingbao_project' ? <JiatingbaoConclusionsDemo /> : <ConclusionsDemo />;
}

function ProjectQualitativePage() {
  const { projectId } = useParams<{ projectId: string }>();
  if (projectId === 'jiatingbao_project') return <Navigate to="../core-conclusions" replace />;
  return <QualitativePage />;
}

const RoutesComponent = () => {
  return (
    <Routes>
      {/* Root → go to projects list */}
      <Route index element={<Navigate to="/projects" replace />} />

      {/* Top-level pages share the main layout with 项目库 / 用户档案 tabs */}
      <Route element={<MainLayout />}>
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/qualitative-research" element={<QualitativeResearchPage />} />
        <Route path="/qualitative-research/app-experience" element={<InsightCategoryPage slug="app-experience" />} />
        <Route path="/qualitative-research/course-experience" element={<InsightCategoryPage slug="course-experience" />} />
        <Route path="/qualitative-research/purchase-decision" element={<InsightCategoryPage slug="purchase-decision" />} />
        <Route path="/qualitative-research/:dimension/:topic" element={<InsightTopicQuotesPage />} />
        <Route path="/app-experience" element={<Navigate to="/qualitative-research/app-experience" replace />} />
        <Route path="/course-experience" element={<Navigate to="/qualitative-research/course-experience" replace />} />
        <Route path="/purchase-decision" element={<Navigate to="/qualitative-research/purchase-decision" replace />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/learning-analysis" element={<LearningAnalysisPage />} />
      </Route>

      {/* All project detail pages share the top tab bar */}
      <Route path="/projects/:projectId" element={<TopNavLayout />}>
        <Route index element={<ProjectIndexRedirect />} />
        <Route path="background" element={<BackgroundPage />} />
        <Route path="summary" element={<SummaryPage />} />
        <Route path="summary-demo" element={<ProjectConclusionsDemoPage />} />
        <Route path="summary-demo-legacy" element={<ConclusionsLegacyDemo />} />
        <Route path="core-conclusions" element={<ProjectCoreConclusionsPage />} />
        <Route path="conclusions-demo" element={<Navigate to="../summary-demo" replace />} />
        <Route path="conclusions-v2" element={<JiatingbaoConclusionsV2 />} />
        <Route path="conclusions-v3" element={<JiatingbaoConclusionsV3 />} />
        <Route path="portraits" element={<PortraitsV2Page />} />
        <Route path="portraits-v2" element={<Navigate to="../portraits" replace />} />
        <Route path="qualitative" element={<ProjectQualitativePage />} />
        <Route path="family-stories" element={<TypicalFamilyStories />} />
        <Route path="family-insights" element={<Navigate to="../core-conclusions" replace />} />
        <Route path="research-conclusions" element={<Navigate to="../core-conclusions" replace />} />
        <Route path="qualitative/users/:userId" element={<ProjectQualitativePage />} />
        <Route path="onion-praise" element={<Navigate to="../qualitative" replace />} />
        <Route path="competitive" element={<CompetitivePage />} />
        <Route path="competitive-2" element={<Competitive2Page />} />
        <Route path="quantitative" element={<QuantitativePage />} />
        <Route path="marketing" element={<MarketingPage />} />
        <Route path="reports" element={<Navigate to="../summary" replace />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default RoutesComponent;
