
//viết jsdoc cho tôi 

/**
 * Centralized object for defining all application route paths.
 *
 * @constant {Object}
 * @property {string} HOME - The landing/home page path ("/").
 * @property {string} DASHBOARD - The dashboard page path ("/dashboard").
 * @property {string} CATALOG - The catalog search page path ("/catalog").
 * @property {string} SEARCH - The general search page path ("/search").
 * @property {string} ARTICLES - The list of articles page path ("/articles").
 * @property {string} ARTICLE_DETAIL - The article detail page path template ("/articles/:id").
 * @property {string} JOURNAL_DETAIL - The journal detail page path template ("/journals/:id").
 * @property {string} LOGIN - The login page path ("/login").
 * @property {string} REGISTER - The registration page path ("/register").
 * @property {string} VERIFY_EMAIL - The email verification page path ("/verify-email").
 */
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