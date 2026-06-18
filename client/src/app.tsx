import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import TopNavLayout from './components/layout/TopNavLayout';
import ProjectsPage from './pages/Projects/ProjectsPage';
import ProfilePage from './pages/Profile/ProfilePage';
import InsightCategoryPage from './pages/InsightCategory/InsightCategoryPage';
import QualitativeResearchPage from './pages/QualitativeResearch/QualitativeResearchPage';
import SummaryPage from './pages/Summary/SummaryPage';
import QualitativePage from './pages/Qualitative/QualitativePage';
import CompetitivePage from './pages/Competitive/CompetitivePage';
import QuantitativePage from './pages/Quantitative/QuantitativePage';
import MarketingPage from './pages/Marketing/MarketingPage';
import BackgroundPage from './pages/Background/BackgroundPage';
import NotFound from './pages/NotFound/NotFound';

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
        <Route path="/app-experience" element={<Navigate to="/qualitative-research/app-experience" replace />} />
        <Route path="/course-experience" element={<Navigate to="/qualitative-research/course-experience" replace />} />
        <Route path="/purchase-decision" element={<Navigate to="/qualitative-research/purchase-decision" replace />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Route>

      {/* All project detail pages share the top tab bar */}
      <Route path="/projects/:projectId" element={<TopNavLayout />}>
        <Route index element={<Navigate to="summary" replace />} />
        <Route path="background" element={<BackgroundPage />} />
        <Route path="summary" element={<SummaryPage />} />
        <Route path="qualitative" element={<QualitativePage />} />
        <Route path="competitive" element={<CompetitivePage />} />
        <Route path="quantitative" element={<QuantitativePage />} />
        <Route path="marketing" element={<MarketingPage />} />
        <Route path="reports" element={<Navigate to="../summary" replace />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default RoutesComponent;
