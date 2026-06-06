import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ROUTES from './routePaths';  // ← import constants

import LandingPage        from '../../features/landing/pages/LandingPage';
import JournalDetailPage  from '../../features/journal/pages/JournalDetailPage';
import CatalogSearchPage  from '../../features/catalog/pages/CatalogSearchPage';
import ArticleListPage    from '../../features/article/pages/ArticleListPage';
import ArticleDetailPage  from '../../features/article/pages/ArticleDetailPage';
import DashboardPage      from '../../features/dashboard/pages/DashboardPage';
import RegisterPage       from '../../features/auth/pages/RegisterPage';
import LoginPage          from '../../features/auth/pages/LoginPage';
import VerifyEmailPage    from '../../features/auth/pages/VerifyEmailPage';  // ← mới

export default function AppRoutes() {
  return (
    <Routes>
      <Route path={ROUTES.HOME}            element={<LandingPage />} />
      <Route path={ROUTES.DASHBOARD}       element={<DashboardPage />} />
      <Route path={ROUTES.JOURNAL_DETAIL}  element={<JournalDetailPage />} />
      <Route path={ROUTES.CATALOG}         element={<CatalogSearchPage />} />
      <Route path={ROUTES.SEARCH}          element={<CatalogSearchPage />} />
      <Route path={ROUTES.ARTICLES}        element={<ArticleListPage />} />
      <Route path={ROUTES.ARTICLE_DETAIL}  element={<ArticleDetailPage />} />
      <Route path={ROUTES.REGISTER}        element={<RegisterPage />} />
      <Route path={ROUTES.LOGIN}           element={<LoginPage />} />
      <Route path={ROUTES.VERIFY_EMAIL}    element={<VerifyEmailPage />} />  {/* ← mới */}
      {/* Fallback */}
      <Route path="*"                      element={<LandingPage />} />
    </Routes>
  );
}