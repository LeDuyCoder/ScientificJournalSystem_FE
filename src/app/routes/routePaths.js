// routePaths.js
// Tập trung tất cả đường dẫn route vào một chỗ.
// Tránh hardcode string rải rác trong nhiều file — dễ sửa, dễ tìm.

const ROUTES = {
  HOME:         "/",
  DASHBOARD:    "/dashboard",
  CATALOG:      "/catalog",
  SEARCH:       "/search",
  ARTICLES:     "/articles",
  ARTICLE_DETAIL: "/articles/:id",
  JOURNAL_DETAIL: "/journals/:id",
  LOGIN:        "/login",
  REGISTER:     "/register",
  VERIFY_EMAIL: "/verify-email",   // ← route mới cho trang kích hoạt tài khoản

  // ─── Admin routes ───
  ADMIN_DASHBOARD:    "/admin/dashboard",
  ADMIN_ARTICLES:     "/admin/articles",
  ADMIN_ARTICLE_EDIT: "/admin/articles/:id",
};

export default ROUTES;