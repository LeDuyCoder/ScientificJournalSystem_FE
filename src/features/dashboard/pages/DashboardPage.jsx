import { useTranslation } from "react-i18next";
/**
 * File source thuộc hệ thống FE ResearchPulse.
 *
 * File: features\dashboard\pages\DashboardPage.jsx
 */
import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import { Icon } from "@iconify/react";
import Header from "../../landing/components/Header";
import { useUserStore } from "../../../app/store/userStore";
import useDashboard from "../hooks/useDashboard";
import DashboardStatCards from "../components/DashboardStatCards";
import PublicationTrendChart from "../components/PublicationTrendChart";
import RecentProjectsCard from "../components/RecentProjectsCard";
import TrendingKeywordsCard from "../components/TrendingKeywordsCard";
import QuickAccessGrid from "../components/QuickAccessGrid";
import TopAuthorsTable from "../components/TopAuthorsTable";
import AuthRequiredModal from "../../../shared/components/AuthRequiredModal";
import PrimaryButton from "../../../shared/components/Button/PrimaryButton";

/**
 * DashboardPage — Trang Tổng quan / Dashboard
 * Route: /dashboard
 *
 * Layout:
 *  Header → WelcomeSection → StatCards →
 *  [Chart 70% | RecentProjects 30%] →
 *  [TrendingKeywords | QuickAccess] →
 *  TopAuthorsTable
 */
export default function DashboardPage() {
  const {
    t
  } = useTranslation();
  const navigate = useNavigate();
  const email = useUserStore(state => state.email);

  // Year range select state for publication trends ('5', '10', 'all')
  const [trendRange, setTrendRange] = useState("5");
  const {
    projects,
    analytics,
    trendingKeywords,
    topAuthors,
    summaryStats,
    loadingProjects,
    loadingAnalytics,
    loadingKeywords,
    loadingAuthors,
    errorProjects,
    errorAnalytics,
    errorKeywords,
    errorAuthors,
    refetchAnalytics
  } = useDashboard(email, trendRange);

  // Quick search state
  const [quickSearch, setQuickSearch] = useState("");

  // Auth modal (for "Tạo Project mới" when guest)
  const [showAuthModal, setShowAuthModal] = useState(false);
  const handleQuickSearch = useCallback(e => {
    if (e.key === "Enter" && quickSearch.trim()) {
      navigate(`/catalog?search=${encodeURIComponent(quickSearch.trim())}`);
    }
  }, [quickSearch, navigate]);
  const handleCreateProject = () => {
    if (!email) {
      setShowAuthModal(true);
    } else {
      navigate("/projects/create");
    }
  };
  const handleProjectClick = project => {
    const id = project.project_id ?? project.id;
    if (id) navigate(`/projects/${id}`);
  };
  const handleAuthorClick = author => {
    const id = author.author_id ?? author.id;
    if (id) navigate(`/authors/${id}`);
  };
  const handleKeywordClick = keyword => {
    navigate(`/catalog?search=${encodeURIComponent(keyword)}`);
  };
  return <div className="min-vh-100" style={{
    backgroundColor: "var(--bg-main)",
    color: "var(--text-main)",
    paddingTop: "80px"
  }}>
      {/* Sticky Navbar */}
      <Header />

      <Container className="py-4">
        {/* ── Welcome Hero Banner ─────────────────────────────────── */}
        <div
          className="p-4 p-md-5 mb-4 position-relative overflow-hidden"
          style={{
            backgroundColor: "var(--bg-card)",
            border: "1px solid var(--border)",
            borderRadius: "20px",
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.03)"
          }}
        >
          <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between gap-4 position-relative" style={{ zIndex: 1 }}>
            <div>
              <div
                className="d-inline-flex align-items-center gap-2 px-3 py-1 mb-3 rounded-pill"
                style={{
                  backgroundColor: "var(--primary-light)",
                  color: "var(--primary)",
                  fontSize: "0.8rem",
                  fontWeight: "600"
                }}
              >
                <Icon icon="lucide:sparkles" width={14} />
                <span>ResearchPulse Analytics</span>
              </div>
              <h1
                className="font-display fw-bold text-main mb-2"
                style={{
                  fontSize: "calc(1.5rem + 0.8vw)",
                  letterSpacing: "-0.02em"
                }}
              >
                {t("dashboard.chaoMungBanDenVoiResearchpulse")}
              </h1>
              <p
                className="text-muted-custom mb-0 font-display"
                style={{
                  fontSize: "0.95rem",
                  maxWidth: "640px"
                }}
              >
                {t("dashboard.khamPhaXuHuongXepHangTapChiVaC")}
              </p>
            </div>
            <div className="d-flex align-items-center gap-3 flex-shrink-0">
              <PrimaryButton
                className="px-4 py-2.5 d-inline-flex align-items-center gap-2"
                onClick={handleCreateProject}
              >
                <Icon icon="lucide:plus" width={18} />
                <span>{t("dashboard.taoProject")}</span>
              </PrimaryButton>
            </div>
          </div>
        </div>

        {/* ── Stat Cards ──────────────────────────────────────────── */}
        <DashboardStatCards stats={summaryStats} loading={loadingProjects} />

        {/* ── Chart + Recent Projects ─────────────────────────────── */}
        <Row className="g-3 mb-3">
          <Col xs={12} lg={8}>
            <PublicationTrendChart analytics={analytics} loading={loadingAnalytics} error={errorAnalytics} onRetry={() => refetchAnalytics()} selectedRange={trendRange} onRangeChange={setTrendRange} />
          </Col>
          <Col xs={12} lg={4}>
            <RecentProjectsCard projects={projects} loading={loadingProjects} error={errorProjects} onViewAll={() => navigate("/projects")} onProjectClick={handleProjectClick} />
          </Col>
        </Row>

        {/* ── Trending Keywords + Quick Access ────────────────────── */}
        <Row className="g-3 mb-4">
          <Col xs={12} md={6}>
            <TrendingKeywordsCard keywords={trendingKeywords} loading={loadingKeywords} error={errorKeywords} onKeywordClick={handleKeywordClick} onViewMore={() => navigate("/catalog")} />
          </Col>
          <Col xs={12} md={6}>
            <QuickAccessGrid />
          </Col>
        </Row>

        {/* ── Top Authors Table ────────────────────────────────────── */}
        <TopAuthorsTable authors={topAuthors} loading={loadingAuthors} error={errorAuthors} onAuthorClick={handleAuthorClick} onViewAll={() => navigate("/authors")} />
      </Container>

      {/* Auth modal for guests clicking "Tạo Project mới" */}
      <AuthRequiredModal show={showAuthModal} onHide={() => setShowAuthModal(false)} />
    </div>;
}