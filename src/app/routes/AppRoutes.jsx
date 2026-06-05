import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LandingPage from '../../features/landing/pages/LandingPage';
import JournalDetailPage from '../../features/journal/pages/JournalDetailPage';
import CatalogSearchPage from '../../features/catalog/pages/CatalogSearchPage';
import ArticleListPage from '../../features/article/pages/ArticleListPage';
import ArticleDetailPlaceholderPage from '../../features/article/pages/ArticleDetailPlaceholderPage';
import DashboardPage from '../../features/dashboard/pages/DashboardPage';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/"           element={<LandingPage />} />
      <Route path="/dashboard"  element={<DashboardPage />} />
      <Route path="/journals/:id" element={<JournalDetailPage />} />
      <Route path="/catalog"    element={<CatalogSearchPage />} />
      <Route path="/search"     element={<CatalogSearchPage />} />
      <Route path="/articles"   element={<ArticleListPage />} />
      <Route path="/articles/:id" element={<ArticleDetailPlaceholderPage />} />
      {/* Fallback */}
      <Route path="*"           element={<LandingPage />} />
    </Routes>
  );
}

