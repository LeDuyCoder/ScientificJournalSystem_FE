import { Routes, Route } from 'react-router-dom';
import ROUTES from './routePaths';

import LandingPage from '../../features/landing/pages/LandingPage';
import JournalDetailPage from '../../features/journal/pages/JournalDetailPage';
import CatalogSearchPage from '../../features/catalog/pages/CatalogSearchPage';
import ArticleListPage from '../../features/article/pages/ArticleListPage';
import ArticleDetailPage from '../../features/article/pages/ArticleDetailPage';
import ArticleVisualDetailPage from '../../features/article/pages/ArticleVisualDetailPage';
import DashboardPage from '../../features/dashboard/pages/DashboardPage';

import RegisterPage from '../../features/auth/pages/RegisterPage';
import LoginPage from '../../features/auth/pages/LoginPage';
import ProfilePage from '../../features/profile/pages/ProfilePage';
import VerifyEmailPage from '../../features/auth/pages/VerifyEmailPage';

import ProtectedRoute from './ProtectedRoute';
import PublicRoute from './PublicRoute';
import AuthLayoutWithUser from '../layouts/AuthLayoutWithUser';

import ProjectListPage from '../../features/project/pages/ProjectListPage';
import CreateProjectPage from '../../features/project/pages/CreateProjectPage';
import EditProjectPage from '../../features/project/pages/EditProjectPage';
import ProjectDetailPage from '../../features/project/pages/ProjectDetailPage';

import AdminLayout from '../layouts/AdminLayout';
import UserDirectoryPage from '../../features/account/pages/UserDirectoryPage';
import AddNewAccountPage from '../../features/account/pages/AddNewAccountPage';
import UpdateUserAccountPage from '../../features/account/pages/UpdateUserAccountPage';
import SubmitArticlePage from '../../features/article/pages/SubmitArticlePage';

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

import ForgotPasswordPage from '../../features/auth/pages/ForgotPasswordPage';
import ResetPasswordPage from '../../features/auth/pages/ResetPasswordPage';

import GeographyPage from '../../features/zone/pages/GeographyPage';

// --- ĐỒNG BỘ ĐƯỜNG DẪN IMPORT THEO CHUẨN CỦA NHÓM ---
import JournalDirectoryPage from '../../features/journal/pages/JournalDirectoryPage';
import RepositoryManagementPage from '../../features/journal/pages/RepositoryManagementPage';

/**
 * Nơi khai báo route chính của ứng dụng.
 * Sử dụng hằng số ROUTES để tránh hardcode các đường dẫn chuỗi tĩnh trên toàn hệ thống.
 * 
 * Chính sách hiện tại:
 * - Các trang khám phá dữ liệu/bài báo cho phép guest truy cập công khai.
 * - Login/Register sử dụng PublicRoute.
 * - Dashboard yêu cầu đăng nhập.
 */
export default function AppRoutes() {
  return (
    <Routes>
      <Route path={ROUTES.HOME} element={<LandingPage />} />

      {/* Protected routes (Yêu cầu đăng nhập trước khi vào, không dùng Layout chính) */}
      <Route element={<ProtectedRoute />}>
        <Route path={ROUTES.DASHBOARD} element={<DashboardPage />} />
        <Route path={ROUTES.AUTHORS_LEADERBOARD} element={<AuthorLeaderboardPage />} />
        <Route path={ROUTES.ADMIN_DASHBOARD} element={<AdminDashboardPage />} />
        <Route path={ROUTES.ADMIN_ARTICLE_EDIT} element={<UpdateArticlePage />} />
        <Route path={ROUTES.ADMIN_ARTICLES} element={<AdminDashboardPage />} />
      </Route>

      {/* Public routes (Đăng nhập / Đăng ký) */}
      <Route element={<PublicRoute />}>
        <Route path={ROUTES.LOGIN} element={<LoginPage />} />
        <Route path={ROUTES.REGISTER} element={<RegisterPage />} />
      </Route>

      {/* Routes sử dụng layout chung có header/footer */}
      <Route element={<AuthLayoutWithUser />}>
        
        {/* 🔐 Tuyến đường yêu cầu bảo mật (Đã đăng nhập) */}
        <Route element={<ProtectedRoute />}>
          <Route path={ROUTES.DASHBOARD} element={<DashboardPage />} />
          
          <Route path={ROUTES.PROJECTS} element={<ProjectListPage />} />
          <Route path={ROUTES.PROJECT_CREATE} element={<CreateProjectPage />} />
          <Route path={ROUTES.PROJECT_EDIT} element={<EditProjectPage />} />
          <Route path={ROUTES.PROJECT_DETAIL} element={<ProjectDetailPage />} />

          <Route
            path={ROUTES.AUTHORS_LEADERBOARD}
            element={<AuthorLeaderboardPage />}
          />

          {/* Admin layouts & pages (Quản trị viên) */}
          <Route element={<AdminLayout />}>
            <Route path={ROUTES.ADMIN_USERS} element={<UserDirectoryPage />} />
            <Route path={ROUTES.ADMIN_USERS_CREATE} element={<AddNewAccountPage />} />
            <Route path={ROUTES.ADMIN_USERS_EDIT} element={<UpdateUserAccountPage />} />
            <Route path={ROUTES.ARTICLE_SUBMIT} element={<SubmitArticlePage />} />

            {/* 🚀 Các tuyến đường quản lý cấu trúc tạp chí dành cho Admin */}
            <Route path={ROUTES.ADMIN_JOURNALS} element={<JournalDirectoryPage />} />
            <Route path={ROUTES.ADMIN_REPOSITORY} element={<RepositoryManagementPage />} />
          </Route>
        </Route>

        {/* Public pages inside layout (Trang xem công khai nằm trong layout chung) */}
        <Route path={ROUTES.SEARCH} element={<CatalogSearchPage />} />
        <Route path={ROUTES.CATALOG} element={<CatalogSearchPage />} />

        <Route path={ROUTES.ARTICLES} element={<ArticleListPage />} />
        <Route path={ROUTES.ARTICLE_DETAIL} element={<ArticleDetailPage />} />
        <Route
          path={ROUTES.ARTICLE_VISUAL_DETAIL}
          element={<ArticleVisualDetailPage />}
        />

        <Route path={ROUTES.PROFILE} element={<ProfilePage />} />
        <Route path={ROUTES.VERIFY_EMAIL} element={<VerifyEmailPage />} />

        <Route path={ROUTES.AUTHORS} element={<AuthorListPage />} />
        <Route path={ROUTES.AUTHOR_DETAIL} element={<AuthorDetailPage />} />

        <Route path={ROUTES.JOURNALS} element={<JournalDetailPage />} />

        <Route path={ROUTES.KEYWORDS} element={<KeywordListPage />} />
        <Route
          path={ROUTES.KEYWORD_ARTICLES}
          element={<KeywordArticlesPage />}
        />

        <Route path={ROUTES.FORGOT_PASSWORD} element={<ForgotPasswordPage />} />
        <Route path={ROUTES.RESET_PASSWORD} element={<ResetPasswordPage />} />

        <Route path={ROUTES.GEOGRAPHY} element={<GeographyPage />} />

        <Route path={ROUTES.TOPIC_DETAIL} element={<TopicDetailPage />} />
      </Route>

      <Route path="/topics/:topicId" element={<TopicDetailPage />} />

      {/* Route tạm để preview UI Admin Dashboard không cần login. */}
      <Route path="/admin-preview" element={<AdminDashboardPage />} />
      <Route path="/admin-preview/articles/:id" element={<UpdateArticlePage />} />

      <Route path="*" element={<LandingPage />} />
    </Routes>
  );
}