import { useTranslation } from "react-i18next";
/**
 * File source thuộc hệ thống FE ResearchPulse.
 *
 * File: features\dashboard\components\QuickAccessGrid.jsx
 */
import { Icon } from '@iconify/react';
import { useNavigate } from 'react-router-dom';
import '../Dashboard.css';

/**
 * QUICK_ACCESS_ITEMS — constant config, dễ mở rộng sau này
 */
export default function QuickAccessGrid() {
  const {
    t
  } = useTranslation();
  const navigate = useNavigate();

  const QUICK_ACCESS_ITEMS = [{
    icon: 'lucide:search',
    label: t("search"),
    desc: t("dashboard.khamPhaBaiBaoDeTai"),
    path: '/catalog',
    color: 'var(--primary)',
    bg: 'var(--primary-light)'
  }, {
    icon: 'lucide:book-open',
    label: t("typeJournal"),
    desc: t("dashboard.xepHangQ1q4KhoaHoc"),
    path: '/catalog',
    color: 'var(--primary)',
    bg: 'var(--primary-light)'
  }, {
    icon: 'lucide:globe',
    label: t("geography"),
    desc: t("dashboard.banDoPhanBoTacGia"),
    path: '/geography',
    color: 'var(--primary)',
    bg: 'var(--primary-light)'
  }, {
    icon: 'lucide:trophy',
    label: 'Leaderboard',
    desc: t("dashboard.xepHangTacGiaNoiBat"),
    path: '/authors',
    color: 'var(--primary)',
    bg: 'var(--primary-light)'
  }];
  return <section className="quick-access-card">
      <header className="quick-access-header">
        <Icon className="quick-access-header-icon" icon="lucide:zap" width={16} />
        <span>{t("dashboard.truyCapNhanh")}</span>
      </header>

      <div className="quick-access-body">
        <div className="premium-qa-grid">
          {QUICK_ACCESS_ITEMS.map(item => <button key={item.label} type="button" className="premium-qa-tile" onClick={() => navigate(item.path)}>
              <div className="premium-qa-icon-wrapper" style={{
            backgroundColor: item.bg,
            color: item.color
          }}>
                <Icon icon={item.icon} width={20} />
              </div>
              <div className="premium-qa-content">
                <span className="premium-qa-title">{item.label}</span>
                <span className="premium-qa-desc">{item.desc}</span>
              </div>
            </button>)}
        </div>
      </div>
    </section>;
}