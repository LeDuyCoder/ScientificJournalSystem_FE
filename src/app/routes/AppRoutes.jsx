import { Routes, Route } from 'react-router-dom';

import LandingPage from '../../features/landing/pages/LandingPage';
import JournalDetailPage from '../../features/journal/pages/JournalDetailPage';
import CatalogSearchPage from '../../features/catalog/pages/CatalogSearchPage';
import ArticleListPage from '../../features/article/pages/ArticleListPage';
import ArticleDetailPage from '../../features/article/pages/ArticleDetailPage';
import DashboardPage from '../../features/dashboard/pages/DashboardPage';

import RegisterPage from '../../features/auth/pages/RegisterPage';
import LoginPage from '../../features/auth/pages/LoginPage';
import ProfilePage from "../../features/profile/pages/ProfilePage";
import VerifyEmailPage from '../../features/auth/pages/VerifyEmailPage';

import ProtectedRoute from './ProtectedRoute';
import PublicRoute from './PublicRoute';

import {
  KeywordListPage,
  KeywordArticlesPage,
} from '../../features/keywords';
import AuthorLeaderboardPage from '../../features/author/pages/AuthorLeaderboardPage';
import AuthorDetailPage from '../../features/author/pages/AuthorDetailPage';
import AuthorListPage from '../../features/author/pages/AuthorListPage';
import TopicDetailPage from '../../features/topic/pages/TopicDetailPage';
import AdminDashboardPage from '../../features/admin/pages/AdminDashboardPage';
import UpdateArticlePage from '../../features/admin/pages/UpdateArticlePage';
import ArticleRepositoryPage from '../../features/admin/pages/ArticleRepositoryPage';

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
        <Route path="/authors/leaderboard" element={<AuthorLeaderboardPage />} />
        <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
        <Route path="/admin/articles" element={<ArticleRepositoryPage />} />
        <Route path="/admin/articles/:id" element={<UpdateArticlePage />} />
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
      <Route path="/profile" element={<ProfilePage />} />

      <Route path="/keywords" element={<KeywordListPage />} />
      <Route path="/keywords/:keywordId/articles" element={<KeywordArticlesPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      <Route path="/geography" element={<GeographyPage />} />

      <Route path="/topics/:topicId" element={<TopicDetailPage />} />

      {/* TODO: route tạm để preview UI Admin Dashboard không cần login.
          Xóa route này khi vấn đề đăng nhập đã được xử lý xong. */}
      <Route path="/admin-preview" element={<AdminDashboardPage />} />
      <Route path="/admin-preview/articles" element={<ArticleRepositoryPage />} />
      <Route path="/admin-preview/articles/:id" element={<UpdateArticlePage />} />

      <Route path="*" element={<LandingPage />} />


    </Routes>
  );
}