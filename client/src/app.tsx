import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import TopNavLayout from './components/layout/TopNavLayout';
import ProjectsPage from './pages/Projects/ProjectsPage';
import ProfilePage from './pages/Profile/ProfilePage';
import UsersPage from './pages/Users/UsersPage';
import SummaryPage from './pages/Summary/SummaryPage';
import QualitativePage from './pages/Qualitative/QualitativePage';
import CompetitivePage from './pages/Competitive/CompetitivePage';
import QuantitativePage from './pages/Quantitative/QuantitativePage';
import MarketingPage from './pages/Marketing/MarketingPage';
import ResearchReportsPage from './pages/Reports/ResearchReportsPage';
import NotFound from './pages/NotFound/NotFound';

const RoutesComponent = () => {
  return (
    <Routes>
      {/* Root → go to projects list */}
      <Route index element={<Navigate to="/projects" replace />} />

      {/* Top-level pages share the main layout with 项目库 / 用户档案 tabs */}
      <Route element={<MainLayout />}>
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/users" element={<UsersPage />} />
      </Route>

      {/* All project detail pages share the top tab bar */}
      <Route path="/projects/:projectId" element={<TopNavLayout />}>
        <Route index element={<Navigate to="summary" replace />} />
        <Route path="summary" element={<SummaryPage />} />
        <Route path="qualitative" element={<QualitativePage />} />
        <Route path="competitive" element={<CompetitivePage />} />
        <Route path="quantitative" element={<QuantitativePage />} />
        <Route path="marketing" element={<MarketingPage />} />
        <Route path="reports" element={<ResearchReportsPage />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default RoutesComponent;
