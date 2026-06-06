import { Routes, Route } from 'react-router-dom';
import LandingPage from '../../features/landing/pages/LandingPage';
import JournalDetailPage from '../../features/journal/pages/JournalDetailPage';
import CatalogSearchPage from '../../features/catalog/pages/CatalogSearchPage';
import ArticleListPage from '../../features/article/pages/ArticleListPage';
import ArticleDetailPage from '../../features/article/pages/ArticleDetailPage';
import DashboardPage from '../../features/dashboard/pages/DashboardPage';
import RegisterPage from '../../features/auth/pages/RegisterPage';
import LoginPage from '../../features/auth/pages/LoginPage';
import AuthorListPage from '../../features/author/pages/AuthorListPage';
import AuthorLeaderboardPage from '../../features/author/pages/AuthorLeaderboardPage';
import AuthorDetailPage from '../../features/author/pages/AuthorDetailPage';

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
      
      {/* Tuyến đường liên quan đến tính năng Tác giả (Author Feature) */}
      {/* Trang Danh sách Nhà khoa học & Tác giả */}
      <Route path="/authors"     element={<AuthorListPage />} />
      {/* Trang Bảng xếp hạng Tác giả nổi bật */}
      <Route path="/authors/leaderboard" element={<AuthorLeaderboardPage />} />
      {/* Trang chi tiết thông tin hồ sơ của một Tác giả */}
      <Route path="/authors/:id"  element={<AuthorDetailPage />} />

      <Route path="/register"   element={<RegisterPage />} />
      <Route path="/login"      element={<LoginPage />} />
      {/* Fallback */}
      <Route path="*"           element={<LandingPage />} />
    </Routes>
  );
}


