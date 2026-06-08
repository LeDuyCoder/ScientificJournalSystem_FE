/**
 * File source thuộc hệ thống FE ResearchPulse.
 *
 * File: app\routes\AppRoutes.jsx
 */
import { Routes, Route } from 'react-router-dom';
import LandingPage from '../../features/landing/pages/LandingPage';
import JournalDetailPage from '../../features/journal/pages/JournalDetailPage';
import CatalogSearchPage from '../../features/catalog/pages/CatalogSearchPage';
import ArticleListPage from '../../features/article/pages/ArticleListPage';
import ArticleDetailPage from '../../features/article/pages/ArticleDetailPage';
import DashboardPage from '../../features/dashboard/pages/DashboardPage';
import RegisterPage from '../../features/auth/pages/RegisterPage';
import LoginPage from '../../features/auth/pages/LoginPage';
import ProtectedRoute from './ProtectedRoute';
import HomeRoute from './HomeRoute';
import { KeywordListPage, KeywordArticlesPage } from '../../features/keywords';
import PublicRoute from './PublicRoute';

/**
 * Nơi khai báo route chính của ứng dụng.
 *
 * Chính sách hiện tại:
 * - Các trang khám phá dữ liệu/bài báo cho phép guest truy cập công khai (Public).
 * - Login/Register được mở trực tiếp, không bọc PublicRoute để tránh việc
 * check cookie/token bất đồng bộ làm chặn chuyển trang.
 * - Những thao tác cần đăng nhập nên được chặn ở component/modal theo từng tính năng,
 * thay vì chặn toàn bộ route của trang.
 */
export default function AppRoutes() {
  return (
    <Routes>
      
      <Route path="/" element={<LandingPage />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<DashboardPage />} />
      </Route>

      <Route element={<PublicRoute />}>
        <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      </Route>

      <Route path="/journals/:id" element={<JournalDetailPage />} />
      <Route path="/catalog" element={<CatalogSearchPage />} />
      <Route path="/search" element={<CatalogSearchPage />} />
      <Route path="/articles" element={<ArticleListPage />} />
      <Route path="/articles/:id" element={<ArticleDetailPage />} />

      <Route path="/keywords" element={<KeywordListPage />} />
      <Route path="/keywords/:keywordId/articles" element={<KeywordArticlesPage />} />
      <Route path="*" element={<LandingPage />} />
    </Routes>
  );
}