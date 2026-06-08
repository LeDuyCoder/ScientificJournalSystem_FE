import { Routes, Route } from "react-router-dom";
import LandingPage from "../../features/landing/pages/LandingPage";
import JournalDetailPage from "../../features/journal/pages/JournalDetailPage";
import CatalogSearchPage from "../../features/catalog/pages/CatalogSearchPage";
import ArticleListPage from "../../features/article/pages/ArticleListPage";
import ArticleDetailPage from "../../features/article/pages/ArticleDetailPage";
import DashboardPage from "../../features/dashboard/pages/DashboardPage";
import RegisterPage from "../../features/auth/pages/RegisterPage";
import LoginPage from "../../features/auth/pages/LoginPage";
import { KeywordListPage, KeywordArticlesPage } from "../../features/keywords";
import { LoginRouteCheck } from "./ProtectedRoute";
import HomeRoute from "./HomeRoute";
export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<LoginRouteCheck />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>

      {/* Public pages */}
      <Route path="/articles" element={<ArticleListPage />} />
      <Route path="/articles/:id" element={<ArticleDetailPage />} />
      <Route path="/journals/:id" element={<JournalDetailPage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/catalog" element={<CatalogSearchPage />} />
      <Route path="/search" element={<CatalogSearchPage />} />
      <Route path="/keywords" element={<KeywordListPage />} />
      <Route path="/keywords/:keywordId/articles" element={<KeywordArticlesPage />} />

      {/* Fallback */}
      <Route path="/" element={<HomeRoute />} />
      <Route path="*" element={<LandingPage />} />
    </Routes>
  );
}
