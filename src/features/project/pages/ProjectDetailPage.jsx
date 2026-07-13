import { useTranslation } from "react-i18next";
import { t } from "i18next";
import { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import ROUTES from '../../../app/routes/routePaths';
import { useKeywordTracking } from '../../keyword/hooks/useKeywordTracking';
import KeywordWatchList from '../../keyword/components/KeywordWatchList';
import AddKeywordModal from '../../keyword/components/AddKeywordModal';
import ManageKeywordsModal from '../../keyword/components/ManageKeywordsModal';
import UpgradePlanModal from '../components/UpgradePlanModal';
import ProjectMembersList from '../components/ProjectMembersList';
import InviteMemberModal from '../components/InviteMemberModal';
import { Icon } from '@iconify/react';
import { Modal } from 'react-bootstrap';
import Header from '../../landing/components/Header';
import PrimaryButton from '../../../shared/components/Button/PrimaryButton';
import projectService from '../../project/services/projectService';
import useAuth from '../../auth/hooks/useAuth';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, PieChart, Pie, Cell } from 'recharts';
const ProjectDetailPage = () => {
  const { t: _t } = useTranslation();
  const {
    id: projectId
  } = useParams();
  const navigate = useNavigate();
  const auth = useAuth();
  const currentUser = auth?.user;
  const {
    project,
    watchArticles,
    keywordArticles,
    watchedKeywords,
    watchArticlesPagination,
    keywordArticlesPagination,
    loading,
    error,
    actionLoading,
    addKeywordWatch,
    removeKeywordWatch,
    fetchWatchArticles,
    fetchKeywordArticles,
    refetch: refetchProjectDetails
  } = useKeywordTracking(projectId);
  const [activeTab, setActiveTab] = useState('articles'); // 'overview', 'articles', 'keywords'
  const [showAddModal, setShowAddModal] = useState(false);
  const [showManageModal, setShowManageModal] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [confirmModal, setConfirmModal] = useState({ show: false, userId: null });
  
  const [overviewData, setOverviewData] = useState(null);
  const [overviewLoading, setOverviewLoading] = useState(false);
  const [overviewError, setOverviewError] = useState(null);
  
  const [members, setMembers] = useState([]);
  const [membersLoading, setMembersLoading] = useState(false);
  const [membersActionLoading, setMembersActionLoading] = useState(false);

  const chartColors = ['#ff702f', '#ff9f68', '#ffc09b', '#334155', '#64748b', '#94a3b8'];
  const fetchProjectOverview = useCallback(async () => {
    if (!projectId) return;
    setOverviewLoading(true);
    setOverviewError(null);
    try {
      const data = await projectService.getProjectOverview(projectId);
      setOverviewData(data || null);
    } catch (err) {
      console.error('Error fetching project overview', err);
      setOverviewError(t("project.khongTheTaiDuLieuTongQuanVuiLo"));
    } finally {
      setOverviewLoading(false);
    }
  }, [projectId]);
  useEffect(() => {
    fetchProjectOverview();
  }, [fetchProjectOverview]);

  const fetchProjectMembers = useCallback(async () => {
    if (!projectId) return;
    setMembersLoading(true);
    try {
      const data = await projectService.getProjectMembers(projectId);
      setMembers(data || []);
    } catch (err) {
      console.error('Error fetching project members', err);
    } finally {
      setMembersLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    if (activeTab === 'members') {
      fetchProjectMembers();
    }
  }, [activeTab, fetchProjectMembers]);

  const handleInviteMember = async (email, role) => {
    setMembersActionLoading(true);
    try {
      await projectService.inviteProjectMember(projectId, email, role);
      setShowInviteModal(false);
      fetchProjectMembers();
    } catch (err) {
      console.error('Error inviting member', err);
      alert(err.response?.data?.message || 'Có lỗi xảy ra khi mời thành viên.');
    } finally {
      setMembersActionLoading(false);
    }
  };

  const handleChangeRole = async (userId, role) => {
    setMembersActionLoading(true);
    try {
      await projectService.updateProjectMemberRole(projectId, userId, role);
      fetchProjectMembers();
    } catch (err) {
      console.error('Error updating role', err);
      alert('Không thể cập nhật quyền.');
    } finally {
      setMembersActionLoading(false);
    }
  };

  const handleRemoveMember = (userId) => {
    setConfirmModal({ show: true, userId });
  };

  const confirmRemoveMember = async () => {
    if (!confirmModal.userId) return;
    setMembersActionLoading(true);
    setConfirmModal({ show: false, userId: null });
    try {
      await projectService.removeProjectMember(projectId, confirmModal.userId);
      fetchProjectMembers();
    } catch (err) {
      console.error('Error removing member', err);
      alert('Không thể xóa thành viên.');
    } finally {
      setMembersActionLoading(false);
    }
  };
  const formatNumber = value => Number(value || 0).toLocaleString('vi-VN');
  const formatDate = value => {
    if (!value) return t("author.chuaCapNhat");
    return new Date(value).toLocaleDateString('vi-VN');
  };
  const mapChartData = chart => {
    const labels = chart?.labels || [];
    const values = chart?.datasets?.[0]?.data || [];
    return labels.map((label, index) => ({
      name: label,
      value: values[index] || 0
    }));
  };
  const hasChartData = chart => mapChartData(chart).some(item => item.value > 0);
  const chartTooltipStyle = {
    backgroundColor: 'var(--bg-card)',
    border: '1px solid var(--border)',
    borderRadius: '12px',
    boxShadow: '0 12px 30px rgba(15, 23, 42, 0.08)',
    color: 'var(--text-main)',
    fontFamily: 'var(--font-display)',
    fontSize: '12px'
  };
  const renderEmptyChart = (message = t("project.chuaCoDuLieuBieuDo")) => <div className="d-flex flex-column align-items-center justify-content-center h-100 text-muted-custom py-5">
      <Icon icon="lucide:chart-no-axes-column" width="42" className="mb-2 opacity-50" />
      <span className="small">{message}</span>
    </div>;
  const renderDonutChart = (chart, centerLabel) => {
    let data = mapChartData(chart);
    if (!hasChartData(chart)) return renderEmptyChart();

    // Group items beyond top 5 into "Lĩnh vực khác" / "Nguồn khác"
    if (data.length > 5) {
      const sorted = [...data].sort((a, b) => b.value - a.value);
      const top5 = sorted.slice(0, 5);
      const remainingSum = sorted.slice(5).reduce((sum, item) => sum + item.value, 0);
      if (remainingSum > 0) {
        const otherLabel = centerLabel === 'Subject Areas' ? t("project.linhVucKhac") : t("project.nguonKhac");
        top5.push({
          name: otherLabel,
          value: remainingSum
        });
      }
      data = top5;
    }
    const total = data.reduce((sum, item) => sum + item.value, 0);
    return <div className="row align-items-center g-3">
        <div className="col-12 col-sm-6 d-flex justify-content-center position-relative">
          <div style={{
          width: '100%',
          height: '220px'
        }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={data} cx="50%" cy="50%" innerRadius={55} outerRadius={75} paddingAngle={3} dataKey="value" nameKey="name">
                  {data.map((_, index) => <Cell key={`cell-${index}`} fill={chartColors[index % chartColors.length]} />)}
                </Pie>
                <Tooltip contentStyle={chartTooltipStyle} formatter={value => [formatNumber(value), centerLabel]} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="position-absolute d-flex flex-column align-items-center justify-content-center" style={{
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
          pointerEvents: 'none'
        }}>
            <span className="fw-bold text-main" style={{
            fontSize: '1.25rem'
          }}>{formatNumber(total)}</span>
            <span className="text-muted-custom" style={{
            fontSize: '0.65rem',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            fontWeight: 600
          }}>{t("project.tongSo")}</span>
          </div>
        </div>
        <div className="col-12 col-sm-6">
          <div className="d-flex flex-column gap-2 pe-2 custom-scrollbar" style={{
          maxHeight: '200px',
          overflowY: 'auto'
        }}>
            {data.map((item, index) => {
            const percentage = total > 0 ? (item.value / total * 100).toFixed(1) : 0;
            return <div key={index} className="d-flex align-items-center justify-content-between py-1 border-bottom border-light-subtle">
                  <div className="d-flex align-items-center gap-2 text-truncate" style={{
                maxWidth: '70%'
              }}>
                    <span className="rounded-circle flex-shrink-0" style={{
                  width: 8,
                  height: 8,
                  backgroundColor: chartColors[index % chartColors.length]
                }} />
                    <span className="small text-main text-truncate fw-medium" title={item.name}>{item.name}</span>
                  </div>
                  <div className="small text-muted-custom text-nowrap">
                    <span className="fw-semibold text-main me-1">{formatNumber(item.value)}</span>
                    <span style={{
                  fontSize: '0.85em'
                }}>({percentage}%)</span>
                  </div>
                </div>;
          })}
          </div>
        </div>
      </div>;
  };
  const renderLineChart = chart => {
    const data = mapChartData(chart);
    if (!hasChartData(chart)) return renderEmptyChart();
    return <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data} margin={{
        top: 12,
        right: 18,
        left: -10,
        bottom: 8
      }}>
          <CartesianGrid stroke="var(--border)" strokeDasharray="4 4" vertical={false} />
          <XAxis dataKey="name" tick={{
          fill: 'var(--text-muted)',
          fontSize: 12,
          fontFamily: 'var(--font-display)'
        }} axisLine={false} tickLine={false} />
          <YAxis allowDecimals={false} tick={{
          fill: 'var(--text-muted)',
          fontSize: 12,
          fontFamily: 'var(--font-display)'
        }} axisLine={false} tickLine={false} />
          <Tooltip contentStyle={chartTooltipStyle} formatter={value => [formatNumber(value), chart?.datasets?.[0]?.label || 'Publications']} />
          <Line type="monotone" dataKey="value" stroke="var(--primary)" strokeWidth={3} dot={{
          r: 4,
          strokeWidth: 2,
          fill: 'var(--bg-card)',
          stroke: 'var(--primary)'
        }} activeDot={{
          r: 6,
          fill: 'var(--primary)'
        }} />
        </LineChart>
      </ResponsiveContainer>;
  };
  const renderOverviewTab = () => {
    const summary = overviewData?.summary || {};
    const charts = overviewData?.charts || {};
    const summaryCards = [{
      label: t("project.tongSoBaiBao"),
      value: formatNumber(summary.totalArticles),
      icon: 'lucide:file-text',
      tone: '#ff702f'
    }, {
      label: t("project.keywordTheoDoi"),
      value: formatNumber(summary.totalKeywords),
      icon: 'lucide:key-round',
      tone: '#f97316'
    }, {
      label: t("project.tongSoTapChi"),
      value: formatNumber(summary.totalJournals),
      icon: 'lucide:library',
      tone: '#334155'
    }, {
      label: t("project.capNhatGanNhat"),
      value: formatDate(summary.lastUpdatedAt),
      icon: 'lucide:calendar-clock',
      tone: '#64748b'
    }];
    if (overviewLoading) {
      return <div className="glass-card rounded-4 shadow-sm border p-5 text-center text-muted-custom">
          <div className="spinner-border" style={{
          color: 'var(--primary)'
        }} role="status" />
          <p className="small mb-0 mt-3">{t("project.dangTaiDuLieuTongQuan")}</p>
        </div>;
    }
    if (overviewError) {
      return <div className="glass-card rounded-4 shadow-sm border p-4 text-center">
          <Icon icon="lucide:circle-alert" width="42" className="text-danger mb-3" />
          <h6 className="fw-bold text-main">{t("article.khongTheTaiBieuDo")}</h6>
          <p className="text-muted-custom small">{overviewError}</p>
          <PrimaryButton className="px-3 py-2" onClick={fetchProjectOverview}>{t("article.thuLai")}</PrimaryButton>
        </div>;
    }
    return <div className="d-flex flex-column gap-4">
        <div className="row g-3">
          {summaryCards.map(card => <div className="col-12 col-sm-6 col-lg-3" key={card.label}>
              <div className="glass-card rounded-4 border shadow-sm p-3 h-100">
                <div className="d-flex justify-content-between align-items-start gap-3">
                  <div>
                    <div className="text-muted-custom small fw-semibold text-uppercase mb-2" style={{
                  letterSpacing: '.04em'
                }}>{card.label}</div>
                    <div className="fs-4 fw-bold text-main">{card.value}</div>
                  </div>
                  <div className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0" style={{
                width: 42,
                height: 42,
                backgroundColor: 'var(--primary-light)',
                color: card.tone
              }}>
                    <Icon icon={card.icon} width="20" />
                  </div>
                </div>
              </div>
            </div>)}
        </div>

        <div className="glass-card rounded-4 border shadow-sm p-4">
          <div className="mb-3">
            <h5 className="fw-bold text-main mb-1">{t("project.xuHuongXuatBan")}</h5>
            <p className="text-muted-custom small mb-0">{t("project.soLuongBaiBaoLienQuanTheoTungN")}</p>
          </div>
          {renderLineChart(charts.publicationTrend)}
        </div>

        <div className="row g-4">
          <div className="col-12 col-lg-6">
            <div className="glass-card rounded-4 border shadow-sm p-4 h-100">
              <h5 className="fw-bold text-main mb-1">{t("project.phanBoLinhVuc")}</h5>
              <p className="text-muted-custom small mb-3">{t("project.tyTrongBaiBaoTheoSubjectArea")}</p>
              {renderDonutChart(charts.subjectAreaDistribution, 'Subject Areas')}
            </div>
          </div>
          <div className="col-12 col-lg-6">
            <div className="glass-card rounded-4 border shadow-sm p-4 h-100">
              <h5 className="fw-bold text-main mb-1">{t("project.loaiNguonXuatBan")}</h5>
              <p className="text-muted-custom small mb-3">{t("project.phanBoTheoJournalConferenceBoo")}</p>
              {renderDonutChart(charts.publicationTypeDistribution, 'Publication Types')}
            </div>
          </div>
        </div>
      </div>;
  };
  const renderPagination = type => {
    const pagination = type === 'keywords' ? keywordArticlesPagination : watchArticlesPagination;
    const fetchFn = type === 'keywords' ? fetchKeywordArticles : fetchWatchArticles;
    if (!pagination || pagination.totalPages <= 1) return null;
    const {
      page,
      totalPages
    } = pagination;
    const pages = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (page <= 4) {
        pages.push(1, 2, 3, 4, 5, '...', totalPages);
      } else if (page >= totalPages - 3) {
        pages.push(1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', page - 1, page, page + 1, '...', totalPages);
      }
    }
    return <div className="d-flex justify-content-center mt-4">
        <ul className="pagination shadow-sm">
          <li className={`page-item ${page <= 1 ? 'disabled' : ''}`}>
            <button className="page-link text-dark" onClick={() => fetchFn(page - 1)} style={{
            cursor: page <= 1 ? 'not-allowed' : 'pointer'
          }}>
              <Icon icon="lucide:chevron-left" />
            </button>
          </li>
          {pages.map((p, idx) => <li key={idx} className={`page-item ${p === page ? 'active' : ''} ${p === '...' ? 'disabled' : ''}`}>
              <button className={`page-link ${p === page ? '' : 'text-dark'}`} style={p === page ? {
            backgroundColor: '#fd7e14',
            borderColor: '#fd7e14',
            color: '#fff',
            cursor: 'default'
          } : {
            cursor: p === '...' ? 'default' : 'pointer'
          }} onClick={() => p !== '...' && p !== page && fetchFn(p)}>
                {p}
              </button>
            </li>)}
          <li className={`page-item ${page >= totalPages ? 'disabled' : ''}`}>
            <button className="page-link text-dark" onClick={() => fetchFn(page + 1)} style={{
            cursor: page >= totalPages ? 'not-allowed' : 'pointer'
          }}>
              <Icon icon="lucide:chevron-right" />
            </button>
          </li>
        </ul>
      </div>;
  };
  if (loading) {
    return <div className="container-fluid py-4 grid-bg min-vh-100 d-flex justify-content-center align-items-center">
        <div className="spinner-border text-primary" role="status"></div>
      </div>;
  }
  if (error || !project) {
    return <div className="container-fluid py-4 grid-bg min-vh-100">
        <div className="container mx-auto" style={{
        maxWidth: '1000px',
        marginTop: '20px'
      }}>
          <div className="alert alert-danger border-0 rounded-4 shadow-sm p-4 d-flex align-items-center gap-3">
            <Icon icon="lucide:alert-triangle" width="24" className="text-danger flex-shrink-0" />
            <div>
              <h6 className="fw-bold mb-1">{t("project.khongTheTaiDuAn")}</h6>
              <p className="mb-0 small">{error || t("project.duAnKhongTonTaiHoacDaBiXoa")}</p>
            </div>
            <button className="btn btn-outline-danger btn-sm ms-auto" onClick={() => navigate(ROUTES.PROJECTS)}>{t("auth.quayLai")}</button>
          </div>
        </div>
      </div>;
  }
  const title = project.title || 'Untitled Project';
  const areaName = project.subject_area?.display_name || project.subject_area?.name || (typeof project.subject_area === 'string' ? project.subject_area : t("project.chuaXacDinhLinhVuc"));
  const createdAt = project.created_at ? new Date(project.created_at).toLocaleDateString('vi-VN') : 'N/A';
  const keywordCount = watchedKeywords?.length || 0;
  const articleCount = watchArticlesPagination?.total || 0;
  const isProjectActive = String(project.status || '').toUpperCase() === 'ACTIVE';
  return <div className="container-fluid pb-4 grid-bg min-vh-100 position-relative overflow-hidden" style={{
    paddingTop: '80px'
  }}>
      <div className="position-absolute w-100 h-100 radial-fade pe-none" style={{
      top: 0,
      left: 0,
      zIndex: 0
    }} />
      <Header />
      <div className="container mx-auto position-relative z-1" style={{
      maxWidth: '1200px',
      marginTop: '40px'
    }}>
        {/* Breadcrumb */}
        <nav aria-label="breadcrumb" className="mb-4">
          <ol className="breadcrumb mb-2 text-muted-custom small">
            <li className="breadcrumb-item"><Link to={ROUTES.DASHBOARD} className="text-decoration-none text-muted-custom hover-primary">{t("author.tongQuan")}</Link></li>
            <li className="breadcrumb-item"><Link to={ROUTES.PROJECTS} className="text-decoration-none text-muted-custom hover-primary">{t("project.duAnTheoDoi")}</Link></li>
            <li className="breadcrumb-item active" aria-current="page">{title}</li>
          </ol>
        </nav>

        {/* Header section (Mockup 3) */}
        <div className="glass-card rounded-4 shadow-sm border p-4 p-md-5 mb-4">
          <div className="d-flex flex-wrap justify-content-between align-items-start gap-3 mb-4">
            <div>
              <div className="d-flex align-items-center gap-2 mb-3">
                <span className="badge rounded-pill fw-medium" style={{
                backgroundColor: 'var(--primary-light)',
                color: 'var(--primary)'
              }}>
                  {areaName}
                </span>
                <span className="text-muted-custom small">{t("project.capNhatLuc")}{createdAt}</span>
              </div>
              <h1 className="font-display fw-bold text-main mb-0" style={{
              fontSize: '2rem'
            }}>{title}</h1>
            </div>
            <div className="d-flex gap-2">

              {!isProjectActive && <PrimaryButton className="px-3" style={{
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              border: 'none'
            }} onClick={() => setShowUpgradeModal(true)}>
                  <Icon icon="lucide:crown" width="16" />{t("project.kichHoatGoi")}</PrimaryButton>}

              <PrimaryButton className="px-3" variant={isProjectActive ? 'primary' : 'outline'} disabled={!isProjectActive} style={!isProjectActive ? {
              opacity: 0.5,
              cursor: 'not-allowed'
            } : {}} onClick={() => {
              if (!isProjectActive) return;
              const originUrl = import.meta.env.VITE_ORIGIN_URL || 'http://localhost:5174';
              window.location.href = `${originUrl}/project/${projectId}/dashboard`;
            }}>
                <Icon icon={isProjectActive ? "lucide:sparkles" : "lucide:lock"} width="16" />{t("project.phanTichChuyenSau")}</PrimaryButton>
            </div>
          </div>

          <div className="row g-4 mt-3 pt-4 border-top">
            <div className="col-6 col-md-3">
              <div className="text-muted-custom small mb-1 text-uppercase tracking-wider fw-semibold">{t("project.tuKhoaTheoDoi1")}</div>
              <div className="fs-3 fw-bold text-main">{keywordCount}</div>
            </div>
            <div className="col-6 col-md-3">
              <div className="text-muted-custom small mb-1 text-uppercase tracking-wider fw-semibold">{t("keywords.baiBaoLienQuan")}</div>
              <div className="fs-3 fw-bold text-main">{articleCount}</div>
            </div>
            <div className="col-6 col-md-3">
              <div className="text-muted-custom small mb-1 text-uppercase tracking-wider fw-semibold">{t("project.canhBaoMoi24h")}</div>
              <div className={`fs-3 fw-bold d-flex align-items-center gap-1 ${(project?.alerts_24h?.todayCount || 0) > 0 ? 'text-success' : 'text-main'}`}>
                <Icon icon="lucide:bell" width="20" /> {project?.alerts_24h?.todayCount || 0}
              </div>
            </div>
            <div className="col-6 col-md-3">
              <div className="text-muted-custom small mb-1 text-uppercase tracking-wider fw-semibold">{t("project.mucDoTangTruong")}</div>
              <div className={`fs-3 fw-bold d-flex align-items-center gap-1 ${(project?.alerts_24h?.growthRate || 0) > 0 ? 'text-success' : (project?.alerts_24h?.growthRate || 0) < 0 ? 'text-danger' : 'text-muted'}`}>
                <Icon icon={(project?.alerts_24h?.growthRate || 0) > 0 ? "lucide:trending-up" : (project?.alerts_24h?.growthRate || 0) < 0 ? "lucide:trending-down" : "lucide:minus"} width="24" /> 
                {(project?.alerts_24h?.growthRate || 0) > 0 ? '+' : ''}{project?.alerts_24h?.growthRate || 0}%
              </div>
            </div>
          </div>
        </div>

        <ul className="nav nav-tabs tab-nav-custom mb-4 border-bottom-0 gap-4" style={{
        paddingLeft: '1rem'
      }}>
          <li className="nav-item">
            <button className={`nav-link border-0 bg-transparent px-0 pb-3 fw-medium ${activeTab === 'overview' ? 'active' : 'text-muted-custom'}`} onClick={() => setActiveTab('overview')} style={activeTab === 'overview' ? {
            color: 'var(--primary)',
            borderBottom: '2px solid var(--primary)'
          } : undefined}>
              <Icon icon="lucide:bar-chart-2" width="18" className="me-2" />{t("project.tongQuanBieuDo")}</button>
          </li>
          <li className="nav-item">
            <button className={`nav-link border-0 bg-transparent px-0 pb-3 fw-medium ${activeTab === 'articles' ? 'active' : 'text-muted-custom'}`} onClick={() => setActiveTab('articles')} style={activeTab === 'articles' ? {
            color: 'var(--primary)',
            borderBottom: '2px solid var(--primary)'
          } : undefined}>
              <Icon icon="lucide:file-text" width="18" className="me-2" />{t("project.luongBaiBao")}{articleCount})
            </button>
          </li>
          <li className="nav-item">
            <button className={`nav-link border-0 bg-transparent px-0 pb-3 fw-medium ${activeTab === 'keywords' ? 'active' : 'text-muted-custom'}`} onClick={() => setActiveTab('keywords')} style={activeTab === 'keywords' ? {
            color: 'var(--primary)',
            borderBottom: '2px solid var(--primary)'
          } : undefined}>
              <Icon icon="lucide:key" width="18" className="me-2" />{t("project.keywordsGiamSat")}{keywordCount})
            </button>
          </li>
          <li className="nav-item">
            <button className={`nav-link border-0 bg-transparent px-0 pb-3 fw-medium ${activeTab === 'members' ? 'active' : 'text-muted-custom'}`} onClick={() => setActiveTab('members')} style={activeTab === 'members' ? {
            color: 'var(--primary)',
            borderBottom: '2px solid var(--primary)'
          } : undefined}>
              <Icon icon="lucide:users" width="18" className="me-2" />{t("project.thanhVien", "Thành viên")}
            </button>
          </li>
        </ul>

        {/* Tab Content */}
        <div className="mb-5">
          {activeTab === 'overview' && renderOverviewTab()}

          {activeTab === 'articles' && <div className="glass-card rounded-4 shadow-sm border p-4">
              <div className="mb-4">
                <h5 className="fw-bold text-main mb-1">{t("project.luongBaiVietCapNhat")}</h5>
                <p className="text-muted-custom small mb-0">{t("project.danhSachCacBaiBaoKhoaHocXuatBa")}</p>
              </div>

              {watchArticles.length === 0 ? <div className="text-center py-5 text-muted-custom">
                  <Icon icon="lucide:file-x" width="48" className="mb-3 opacity-50" />
                  <p className="mb-0">{t("project.chuaCoBaiBaoNaoKhopVoiTuKhoaCu")}</p>
                </div> : <div className="list-group list-group-flush border-top pt-2">
                  {watchArticles.map((article, index) => <div key={index} className="list-group-item bg-transparent px-0 py-3 border-bottom">
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <span className="text-muted-custom small">{article.journal_name || article.journal?.title || t("author.tapChiKhoaHoc")}</span>
                        <span className="text-muted-custom small">{article.publication_year || new Date(article.publication_date).getFullYear()}</span>
                      </div>
                      <Link to={`/articles/${article.article_id || article.id}/visual`} className="text-decoration-none">
                        <h6 className="fw-bold text-main mb-2 hover-primary lh-base">{article.title}</h6>
                      </Link>
                      <div className="d-flex justify-content-between align-items-center mt-2">
                        <div className="text-muted-custom small text-truncate pe-3">
                          {article.doi && <>
                              DOI: <a href={article.doi.startsWith('http') ? article.doi : `https://doi.org/${article.doi}`} target="_blank" rel="noopener noreferrer" className="text-muted-custom text-decoration-none hover-primary">{article.doi}</a>
                            </>}
                        </div>
                        <div className="d-flex gap-2 flex-wrap justify-content-end">
                          {article.matched_areas?.map((area, aIdx) => <span key={`area-${aIdx}`} className="badge fw-medium text-nowrap" style={{
                    fontSize: '0.7rem',
                    backgroundColor: 'var(--primary-light)',
                    color: 'var(--primary)',
                    border: 'none',
                    boxShadow: 'none'
                  }}>
                              <Icon icon="lucide:book-open" className="me-1" width="12" />
                              {area}
                            </span>)}
                          {article.matched_keywords?.map((kw, kwIdx) => <span key={`kw-${kwIdx}`} className="badge fw-medium text-nowrap" style={{
                    fontSize: '0.7rem',
                    backgroundColor: 'var(--primary-light)',
                    color: 'var(--primary)',
                    border: 'none',
                    boxShadow: 'none'
                  }}>
                              <Icon icon="lucide:sparkles" className="me-1" width="12" />
                              {kw}
                            </span>)}
                          {!article.matched_keywords?.length && !article.matched_areas?.length && <span className="badge fw-medium text-nowrap" style={{
                    fontSize: '0.7rem',
                    backgroundColor: 'var(--primary-light)',
                    color: 'var(--primary)',
                    border: 'none',
                    boxShadow: 'none'
                  }}>{t("project.doTrungKhopCao")}</span>}
                        </div>
                      </div>
                    </div>)}
                </div>}
              
              {renderPagination('articles')}
            </div>}

          {activeTab === 'keywords' && <div className="glass-card rounded-4 shadow-sm border p-4">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                  <h5 className="fw-bold text-main mb-1">{t("project.quanLyWatchlistTuKhoa")}</h5>
                  <p className="text-muted-custom small mb-0">{t("project.heThongSeLienTucQuetBaiBaoMoiV")}</p>
                </div>
                <PrimaryButton variant="outline" className="px-3 py-2" onClick={() => navigate(`/projects/${projectId}/edit`)}>
                  <Icon icon="lucide:edit-2" width="16" />{t("project.chinhSuaDanhSach")}</PrimaryButton>
              </div>

              <KeywordWatchList watchedKeywords={watchedKeywords} articles={keywordArticles} loading={loading} onManageClick={() => setShowManageModal(true)} />
              
              {renderPagination('keywords')}
            </div>}
            
          {activeTab === 'members' && (
            <ProjectMembersList 
              members={members} 
              loading={membersLoading} 
              onInviteClick={() => setShowInviteModal(true)}
              onChangeRole={handleChangeRole}
              onRemoveMember={handleRemoveMember}
              actionLoading={membersActionLoading}
              currentUser={currentUser}
            />
          )}
        </div>
      </div>

      {/* Modals */}
      <AddKeywordModal show={showAddModal} onHide={() => setShowAddModal(false)} onAdd={addKeywordWatch} actionLoading={actionLoading} />

      <ManageKeywordsModal show={showManageModal} onHide={() => setShowManageModal(false)} watchedKeywords={watchedKeywords} onRemove={removeKeywordWatch} actionLoading={actionLoading} />

      <InviteMemberModal 
        show={showInviteModal} 
        onHide={() => setShowInviteModal(false)} 
        onInvite={handleInviteMember} 
        actionLoading={membersActionLoading} 
      />

      <Modal show={confirmModal.show} onHide={() => setConfirmModal({ show: false, userId: null })} centered>
        <Modal.Header closeButton className="border-0 pb-0">
          <Modal.Title className="fw-bold text-main">
            {t("project.xoaThanhVienTitle", "Xóa thành viên")}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="text-muted-custom">{t("project.banCoChacMuonXoaThanhVien", "Bạn có chắc chắn muốn xóa thành viên này / hủy lời mời khỏi dự án không?")}</p>
        </Modal.Body>
        <Modal.Footer className="border-0 pt-0">
          <PrimaryButton variant="outline" className="px-4" onClick={() => setConfirmModal({ show: false, userId: null })}>
            {t("admin.huy", "Hủy")}
          </PrimaryButton>
          <button className="btn btn-danger px-4" onClick={confirmRemoveMember} style={{ fontWeight: 600, borderRadius: '12px' }}>
            {t("project.xoa", "Xóa")}
          </button>
        </Modal.Footer>
      </Modal>

      <UpgradePlanModal show={showUpgradeModal} onHide={() => setShowUpgradeModal(false)} projectId={projectId} onSuccess={() => {
      fetchProjectOverview();
      if (refetchProjectDetails) refetchProjectDetails();
      setShowUpgradeModal(false);
    }} />
    </div>;
};
export default ProjectDetailPage;