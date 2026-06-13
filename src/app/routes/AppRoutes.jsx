/**
 * File source thuộc hệ thống FE ResearchPulse.
 *
 * File: app/routes/AppRoutes.jsx
 */

import { Routes, Route } from 'react-router-dom';

import LandingPage from '../../features/landing/pages/LandingPage';
import JournalDetailPage from '../../features/journal/pages/JournalDetailPage';
import CatalogSearchPage from '../../features/catalog/pages/CatalogSearchPage';
import ArticleListPage from '../../features/article/pages/ArticleListPage';
import ArticleDetailPage from '../../features/article/pages/ArticleDetailPage';
import ArticleVisualDetailPage from '../../features/article/pages/ArticleVisualDetailPage';
import DashboardPage from '../../features/dashboard/pages/DashboardPage';

import RegisterPage from '../../features/auth/pages/RegisterPage';
import LoginPage from '../../features/auth/pages/LoginPage';
import ProfilePage from "../../features/profile/pages/ProfilePage";
import VerifyEmailPage from '../../features/auth/pages/VerifyEmailPage';

import ProtectedRoute from './ProtectedRoute';
import ProjectListPage from '../../features/project/pages/ProjectListPage';
import CreateProjectPage from '../../features/project/pages/CreateProjectPage';
import EditProjectPage from '../../features/project/pages/EditProjectPage';
import ProjectDetailPage from '../../features/project/pages/ProjectDetailPage';
import PublicRoute from './PublicRoute';

import {
  KeywordListPage,
  KeywordArticlesPage,
} from '../../features/keywords';
import AuthorLeaderboardPage from '../../features/author/pages/AuthorLeaderboardPage';
import AuthorDetailPage from '../../features/author/pages/AuthorDetailPage';
import AuthorListPage from '../../features/author/pages/AuthorListPage';
import TopicDetailPage from '../../features/topic/pages/TopicDetailPage';

/**
 * Nơi khai báo route chính của ứng dụng.

 *
 * Chính sách hiện tại:
 * - Các trang khám phá dữ liệu/bài báo cho phép guest truy cập công khai.
 * - Login/Register sử dụng PublicRoute.
 * - Dashboard yêu cầu đăng nhập.
 */
import ForgotPasswordPage from '../../features/auth/pages/ForgotPasswordPage';
import ResetPasswordPage from '../../features/auth/pages/ResetPasswordPage';

import GeographyPage from '../../features/zone/pages/GeographyPage';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/projects" element={<ProjectListPage />} />
        <Route path="/projects/create" element={<CreateProjectPage />} />
        <Route path="/projects/:id/edit" element={<EditProjectPage />} />
        <Route path="/projects/:id" element={<ProjectDetailPage />} />
        <Route path="/authors/leaderboard" element={<AuthorLeaderboardPage />} />
      </Route>

      <Route element={<PublicRoute />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>

      <Route path="/verify-email" element={<VerifyEmailPage />} />
      <Route path="/authors/:id" element={<AuthorDetailPage />} />
      <Route path="/authors" element={<AuthorListPage />} />
      <Route path="/journals/:id" element={<JournalDetailPage />} />
      <Route path="/catalog" element={<CatalogSearchPage />} />

      <Route path="/search" element={<CatalogSearchPage />} />
      <Route path="/articles" element={<ArticleListPage />} />
      <Route path="/articles/:id" element={<ArticleDetailPage />} />
      <Route path="/articles/:id/visual" element={<ArticleVisualDetailPage />} />
      <Route path="/profile" element={<ProfilePage />} />

      <Route path="/keywords" element={<KeywordListPage />} />
      <Route path="/keywords/:keywordId/articles" element={<KeywordArticlesPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      <Route path="/geography" element={<GeographyPage />} />

      <Route path="/topics/:topicId" element={<TopicDetailPage />} />
      <Route path="*" element={<LandingPage />} />


    </Routes>
  );
}