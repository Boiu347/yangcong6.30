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
import ConclusionsDemo from './pages/Summary/ConclusionsDemo';
import CoreConclusionsReport from './pages/CoreConclusions/CoreConclusionsReport';
import JiatingbaoCoreConclusionsPage from './pages/JiatingbaoCoreConclusions/JiatingbaoCoreConclusionsPage';
import QualitativePage from './pages/Qualitative/QualitativePage';
import FamilyInsights from './pages/FamilyPackage/FamilyInsights';
import JiatingbaoConclusionsReport from './pages/JiatingbaoConclusions/JiatingbaoConclusionsReport';
import CompetitivePage from './pages/Competitive/CompetitivePage';
import Competitive2Page from './pages/Competitive2/Competitive2Page';
import QuantitativePage from './pages/Quantitative/QuantitativePage';
import MarketingPage from './pages/Marketing/MarketingPage';
import BackgroundPage from './pages/Background/BackgroundPage';
import FromPrimaryPortraitsPage from './pages/Portraits/FromPrimaryPortraitsPage';
import PortraitsV2Page from './pages/PortraitsV2/PortraitsV2Page';
import NotFound from './pages/NotFound/NotFound';

function ProjectIndexRedirect() {
  const { projectId } = useParams<{ projectId: string }>();
  if (projectId === 'paisou_project') return <Navigate to="qualitative" replace />;
  return <Navigate to="summary" replace />;
}

function ProjectCoreConclusionsPage() {
  const { projectId } = useParams<{ projectId: string }>();
  return projectId === 'jiatingbao_project' ? (
    <JiatingbaoCoreConclusionsPage />
  ) : (
    <CoreConclusionsReport />
  );
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
        <Route path="summary-demo" element={<ConclusionsDemo />} />
        <Route path="core-conclusions" element={<ProjectCoreConclusionsPage />} />
        <Route path="portraits" element={<FromPrimaryPortraitsPage />} />
        <Route path="portraits-v2" element={<PortraitsV2Page />} />
        <Route path="qualitative" element={<QualitativePage />} />
        <Route path="family-insights" element={<FamilyInsights />} />
        <Route path="research-conclusions" element={<JiatingbaoConclusionsReport />} />
        <Route path="qualitative/users/:userId" element={<QualitativePage />} />
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
