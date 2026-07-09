/**
 * File source thuộc hệ thống FE ResearchPulse.
 *
 * File: features\landing\components\Header.jsx
 */
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useLocation } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Offcanvas from "react-bootstrap/Offcanvas";
import Dropdown from "react-bootstrap/Dropdown";
import Button from "react-bootstrap/Button";
import Icon from "../../../shared/components/Icon";
import useAuth from "../../auth/hooks/useAuth";
import { useUserStore } from "../../../app/store/userStore";
import ROUTES from "../../../app/routes/routePaths";
import CoinBalanceBadge from "../../wallet/components/CoinBalanceBadge";

export default function Header() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const pathname = location.pathname;
  const auth = useAuth?.() ?? { logout: () => {} };
  const { logout } = auth;
  const email = useUserStore((state) => state.email);
  const userRole = auth.user?.role;
  const accountManagementRoute = userRole === 'ADMINISTRATOR' ? ROUTES.ADMIN_USERS : ROUTES.PROFILE;
  const language = i18n.language || "vi";

  const [isScrolled, setIsScrolled] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
    localStorage.setItem("researchpulse_lang", lang);
  };

  const handleAuthLogin = () => {
    navigate(ROUTES.LOGIN);
  };
  const handleAuthRegister = () => {
    navigate(ROUTES.REGISTER);
  };

  const navItems = [
    { label: "Tổng quan", icon: "lucide:layout-dashboard", path: ROUTES.DASHBOARD },
    { label: "Dự án", icon: "lucide:folder", path: ROUTES.PROJECTS },
    { label: t("search"), icon: "lucide:search", path: ROUTES.CATALOG },
    { label: "Bài báo", icon: "lucide:file-text", path: ROUTES.ARTICLES },
    { label: "Tác Giả", icon: "lucide:users", path: ROUTES.AUTHORS },
  ];

  const navLinkStyle = {
    borderBottom: "2px solid transparent",
    color: "var(--text-muted)",
    transition: "color 0.18s ease, border-color 0.18s ease",
    fontWeight: 600,
  };

  const dropdownMenuStyle = {
    minWidth: "190px",
    "--bs-dropdown-link-active-bg": "rgba(0, 0, 0, 0.06)",
    "--bs-dropdown-link-active-color": "var(--text-main)",
    "--bs-dropdown-link-hover-bg": "rgba(0, 0, 0, 0.04)",
    "--bs-dropdown-link-hover-color": "var(--text-main)",
  };

  return (
    <>
      <Navbar
        expand="md"
        fixed="top"
        className={`transition-all duration-300 py-3 ${
          isScrolled ? "sticky-scrolled" : "bg-transparent"
        }`}
        style={{
          borderBottom: isScrolled ? "none" : "1px solid var(--border)",
          background: isScrolled ? "var(--bg-card)" : "transparent",
          backdropFilter: isScrolled ? "blur(12px)" : "none",
        }}
      >
        <Container>
          {/* Logo Brand */}
          <Navbar.Brand
            onClick={() => navigate(ROUTES.HOME)}
            className="d-flex align-items-center text-main font-weight-bold"
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 800,
              cursor: "pointer",
            }}
          >
            <div
              className="d-flex align-items-center justify-content-center me-2"
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "8px",
                background: "var(--btn-dark)",
                boxShadow: "0 0 10px rgba(7, 26, 28, 0.15)",
              }}
            >
              <Icon icon="lucide:activity" className="text-white text-sm" />
            </div>
            ResearchPulse
          </Navbar.Brand>

          {/* Hamburger toggle for mobile */}
          <Navbar.Toggle
            aria-controls="basic-navbar-nav"
            onClick={() => setShowMobileMenu(true)}
            className="border-0 bg-transparent text-main p-0"
          >
            <Icon icon="lucide:menu" className="fs-3 text-main" />
          </Navbar.Toggle>

          {/* Desktop Navigation Link Items */}
          <Navbar.Collapse
            id="basic-navbar-nav"
            className="d-none d-md-flex justify-content-between align-items-center w-full"
          >
            <Nav className="mx-auto align-items-center" style={{ gap: "10px" }}>
              {navItems.map((item) => (
                <Nav.Link
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className="px-2 py-1 text-sm d-flex align-items-center gap-1 bg-transparent"
                  style={navLinkStyle}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = "var(--primary)";
                    e.currentTarget.style.borderBottomColor = "var(--primary)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = "var(--text-muted)";
                    e.currentTarget.style.borderBottomColor = "transparent";
                  }}
                >
                  <Icon icon={item.icon} width="14" />
                  {item.label}
                </Nav.Link>
              ))}
            </Nav>

            <div className="d-flex align-items-center gap-3">
              {/* Notification icon */}
              {email && (
                <div
                  className="text-muted-custom hover:text-main position-relative"
                  style={{ cursor: "pointer" }}
                >
                  <Icon icon="lucide:bell" width="18" />
                  <span className="position-absolute top-0 start-100 translate-middle p-1 bg-danger border border-light rounded-circle">
                    <span className="visually-hidden">New alerts</span>
                  </span>
                </div>
              )}

              <Dropdown align="end">
                <Dropdown.Toggle
                  as="button"
                  type="button"
                  className="border-0 bg-transparent d-inline-flex align-items-center justify-content-center p-0 text-muted-custom"
                  style={{ width: "32px", height: "32px", cursor: "pointer" }}
                  aria-label="Mở cài đặt giao diện"
                >
                  <Icon icon="lucide:settings" width="18" />
                </Dropdown.Toggle>
                <Dropdown.Menu className="border-0 shadow-sm mt-2" style={dropdownMenuStyle}>
                  <div className="px-3 py-2 text-xs font-bold text-main border-bottom pb-2 mb-1">
                    Cài đặt
                  </div>
                  <Dropdown.Item
                    onClick={() => changeLanguage("vi")}
                    className={`d-flex align-items-center justify-content-between text-xs py-2 ${
                      language.startsWith("vi") ? "text-primary" : "text-dark"
                    }`}
                  >
                    <span>Tiếng Việt</span>
                    {language.startsWith("vi") && (
                      <Icon icon="lucide:check" className="text-primary text-xs ms-2" />
                    )}
                  </Dropdown.Item>
                  <Dropdown.Item
                    onClick={() => changeLanguage("en")}
                    className={`d-flex align-items-center justify-content-between text-xs py-2 ${
                      language.startsWith("en") ? "text-primary" : "text-dark"
                    }`}
                  >
                    <span>English</span>
                    {language.startsWith("en") && (
                      <Icon icon="lucide:check" className="text-primary text-xs ms-2" />
                    )}
                  </Dropdown.Item>
                  <Dropdown.Divider />
                  <Dropdown.Item
                    onClick={() => alert("Đang áp dụng giao diện sáng của ResearchPulse")}
                    className="d-flex align-items-center gap-2 text-xs py-2 text-main"
                  >
                    <Icon icon="lucide:sun" width="14" className="text-warning" />
                    <span>Giao diện sáng</span>
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>

              {/* User Authentication Display/Buttons */}
              {email ? (
                <>
                  <CoinBalanceBadge />
                  <Dropdown align="end">
                    <Dropdown.Toggle
                    as="button"
                    type="button"
                    className="border-0 bg-transparent d-inline-flex align-items-center justify-content-center p-0 text-muted-custom hover:text-primary"
                    style={{
                      width: "32px",
                      height: "32px",
                      cursor: "pointer",
                      transition: "color 0.15s ease",
                    }}
                    aria-label="Tài khoản người dùng"
                  >
                    <Icon icon="lucide:user" width="18" />
                  </Dropdown.Toggle>

                  <Dropdown.Menu className="border-0 shadow-sm mt-2" style={dropdownMenuStyle}>
                    <div className="px-3 py-2 text-xs font-bold text-main border-bottom pb-2 mb-1">
                      <span>Người dùng</span>
                      <div
                        className="text-muted-custom font-normal mt-0.5 text-truncate"
                        style={{ fontSize: "10px", color: "var(--text-muted)" }}
                      >
                        {email}
                      </div>
                    </div>
                    <Dropdown.Item
                      onClick={() => navigate(ROUTES.WALLET_TOP_UP)}
                      className="d-flex align-items-center gap-2 text-xs py-2 text-main"
                    >
                      <Icon
                        icon="solar:wallet-bold"
                        width="14"
                        style={{ color: '#ff7a33' }}
                      />
                      <span className="font-weight-bold" style={{ color: 'var(--text-main)' }}>Nạp Coin</span>
                    </Dropdown.Item>
                    <Dropdown.Item
                      onClick={() => navigate(ROUTES.DASHBOARD)}
                      className="d-flex align-items-center gap-2 text-xs py-2 text-main"
                    >
                      <Icon
                        icon="lucide:layout-dashboard"
                        width="14"
                        className="text-muted-custom"
                      />
                      <span>Bảng điều khiển</span>
                    </Dropdown.Item>
                    <Dropdown.Item
                      onClick={() => navigate(accountManagementRoute)}
                      className="d-flex align-items-center gap-2 text-xs py-2 text-main"
                    >
                      <Icon
                        icon="lucide:users"
                        width="14"
                        className="text-muted-custom"
                      />
                      <span>Quản trị tài khoản</span>
                    </Dropdown.Item>
                    <Dropdown.Item
                      onClick={logout}
                      className="d-flex align-items-center gap-2 text-xs py-2 text-danger"
                    >
                      <Icon icon="lucide:log-out" width="14" />
                      <span>Đăng xuất</span>
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
                </>
              ) : (
                <>
                  <Button
                    variant="outline-secondary"
                    className="text-xs rounded-pill px-3"
                    onClick={handleAuthLogin}
                  >
                    {t("signIn")}
                  </Button>
                  <Button
                    className="btn-primary-glow border-0 text-white text-xs rounded-pill px-3"
                    onClick={handleAuthRegister}
                  >
                    {t("signUp")}
                  </Button>
                </>
              )}
            </div>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Mobile Menu Drawer (Offcanvas) */}
      <Offcanvas
        show={showMobileMenu}
        onHide={() => setShowMobileMenu(false)}
        placement="end"
        className="bg-white text-dark border-start border-light"
        style={{
          width: "280px",
          backgroundColor: "var(--bg-card)",
          color: "var(--text-main)",
        }}
      >
        <Offcanvas.Header
          closeButton
          closeVariant="dark"
          className="border-bottom border-light py-4"
        >
          <Offcanvas.Title
            className="d-flex align-items-center text-main"
            style={{ fontFamily: "var(--font-display)", fontWeight: 800 }}
          >
            <div
              className="d-flex align-items-center justify-content-center me-2"
              style={{
                width: "28px",
                height: "28px",
                borderRadius: "6px",
                background: "var(--btn-dark)",
              }}
            >
              <Icon icon="lucide:activity" className="text-white text-xs" />
            </div>
            ResearchPulse
          </Offcanvas.Title>
        </Offcanvas.Header>

        <Offcanvas.Body className="d-flex flex-column justify-content-between py-4">
          <Nav className="flex-column gap-3 mb-4">
            <Nav.Link
              onClick={() => {
                setShowMobileMenu(false);
                navigate(ROUTES.DASHBOARD);
              }}
              className="text-muted-custom hover:text-main py-2 text-sm font-semibold border-bottom border-light"
            >
              Tổng quan
            </Nav.Link>
            <Nav.Link
              onClick={() => {
                setShowMobileMenu(false);
                navigate(ROUTES.PROJECTS);
              }}
              className="text-muted-custom hover:text-main py-2 text-sm font-semibold border-bottom border-light"
              style={{
                color: pathname.startsWith(ROUTES.PROJECTS)
                  ? "var(--primary)"
                  : "var(--text-muted)",
                fontWeight: pathname.startsWith(ROUTES.PROJECTS) ? 700 : 600,
              }}
            >
              Dự án
            </Nav.Link>
            <Nav.Link
              onClick={() => {
                setShowMobileMenu(false);
                navigate(ROUTES.CATALOG);
              }}
              className="text-muted-custom hover:text-main py-2 text-sm font-semibold border-bottom border-light"
            >
              {t("search")}
            </Nav.Link>
            <Nav.Link
              onClick={() => {
                setShowMobileMenu(false);
                navigate(ROUTES.ARTICLES);
              }}
              className="text-muted-custom hover:text-main py-2 text-sm font-semibold border-bottom border-light"
              style={{
                color: pathname.startsWith(ROUTES.ARTICLES)
                  ? "var(--primary)"
                  : "var(--text-muted)",
                fontWeight: pathname.startsWith(ROUTES.ARTICLES) ? 700 : 600,
              }}
            >
              Bài báo
            </Nav.Link>
          </Nav>

          <div className="d-flex flex-column gap-3">
            {/* Mobile Language Switches */}
            <div className="d-flex align-items-center justify-content-center gap-4 py-2 border-top border-bottom border-light mb-2">
              <Button
                variant="link"
                onClick={() => changeLanguage("vi")}
                className={`text-decoration-none text-xs font-bold p-0 ${
                  language.startsWith("vi")
                    ? "text-primary"
                    : "text-muted-custom"
                }`}
              >
                Tiếng Việt
              </Button>
              <span className="text-muted-custom">|</span>
              <Button
                variant="link"
                onClick={() => changeLanguage("en")}
                className={`text-decoration-none text-xs font-bold p-0 ${
                  language.startsWith("en")
                    ? "text-primary"
                    : "text-muted-custom"
                }`}
              >
                English
              </Button>
            </div>

            {/* Mobile Auth options */}
            {email ? (
              <div className="d-flex flex-column gap-3">
                <Button
                  variant="outline-primary"
                  className="w-100 rounded-pill py-2.5 text-xs font-bold"
                  onClick={() => {
                    setShowMobileMenu(false);
                    navigate(ROUTES.DASHBOARD);
                  }}
                >
                  <Icon icon="lucide:layout-dashboard" className="me-1" />
                  {language.startsWith("vi")
                    ? "Bảng điều khiển"
                    : "Go to Dashboard"}
                </Button>
                <div
                  className="d-flex align-items-center justify-content-center gap-2 p-2.5 rounded-3 border"
                  style={{ background: "#f8fafc" }}
                >
                  <div
                    className="d-flex align-items-center justify-content-center text-white"
                    style={{
                      width: "28px",
                      height: "28px",
                      borderRadius: "50%",
                      background: "var(--primary)",
                      boxShadow: "0 0 6px rgba(255, 122, 51, 0.15)",
                    }}
                  >
                    <Icon icon="lucide:user" width="14" />
                  </div>
                  <div className="text-start">
                    <div
                      className="text-xs text-main font-bold"
                      style={{ lineHeight: "1.2" }}
                    >
                      Người dùng
                    </div>
                    <div
                      className="text-xxs text-muted"
                      style={{ fontSize: "9px", marginTop: "1px" }}
                    >
                      {email}
                    </div>
                  </div>
                  <div className="ms-auto">
                    <CoinBalanceBadge />
                  </div>
                </div>
                <Button
                  variant="danger"
                  className="w-100 rounded-pill py-2 text-xs font-bold"
                  onClick={() => {
                    logout();
                    setShowMobileMenu(false);
                  }}
                >
                  {language.startsWith("vi") ? "Đăng xuất" : "Sign Out"}
                </Button>
              </div>
            ) : (
              <div className="d-flex flex-column gap-2">
                <Button
                  variant="outline-primary"
                  className="w-100 rounded-pill py-2.5 text-xs font-bold"
                  onClick={() => {
                    setShowMobileMenu(false);
                    handleAuthLogin();
                  }}
                >
                  {t("signIn")}
                </Button>
                <Button
                  className="btn-primary-glow w-100 rounded-pill py-2.5 text-xs font-bold border-0 text-white"
                  onClick={() => {
                    setShowMobileMenu(false);
                    handleAuthRegister();
                  }}
                >
                  {t("signUp")}
                </Button>
              </div>
            )}
          </div>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
}
