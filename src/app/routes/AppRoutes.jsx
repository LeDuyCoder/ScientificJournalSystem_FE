import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LandingPage from '../../features/landing/pages/LandingPage';
import JournalDetailPage from '../../features/journal/pages/JournalDetailPage';
import CatalogSearchPage from '../../features/catalog/pages/CatalogSearchPage';
import ArticleListPage from '../../features/article/pages/ArticleListPage';
import ArticleDetailPage from '../../features/article/pages/ArticleDetailPage';
import DashboardPage from '../../features/dashboard/pages/DashboardPage';
import RegisterPage from '../../features/auth/pages/RegisterPage';
import LoginPage from '../../features/auth/pages/LoginPage';
import ForgotPasswordPage from '../../features/auth/pages/ForgotPasswordPage';
import ResetPasswordPage from '../../features/auth/pages/ResetPasswordPage';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/"           element={<LandingPage />} />
      <Route path="/dashboard"  element={<DashboardPage />} />
      <Route path="/journals/:id" element={<JournalDetailPage />} />
      <Route path="/catalog"    element={<CatalogSearchPage />} />
      <Route path="/search"     element={<CatalogSearchPage />} />
      <Route path="/articles"   element={<ArticleListPage />} />
      <Route path="/articles/:id" element={<ArticleDetailPage />} />
      <Route path="/register"   element={<RegisterPage />} />
      <Route path="/login"      element={<LoginPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      {/* Fallback */}
      <Route path="*"           element={<LandingPage />} />
    </Routes>
  );
}





