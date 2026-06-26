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
const QUICK_ACCESS_ITEMS = [
  { icon: 'lucide:search', label: 'Tìm kiếm', path: '/catalog' },
  { icon: 'lucide:book-open', label: 'Tạp chí', path: '/catalog' },
  { icon: 'lucide:globe', label: 'Địa lý', path: '/geography' },
  { icon: 'lucide:trophy', label: 'Leaderboard', path: '/authors' },
];

/**
 * QuickAccessGrid — 4 card điều hướng nhanh
 */
export default function QuickAccessGrid() {
  const navigate = useNavigate();

  return (
    <section className="quick-access-card">
      <header className="quick-access-header">
        <Icon className="quick-access-header-icon" icon="lucide:zap" width={16} />
        <span>Truy cập nhanh</span>
      </header>

      <div className="quick-access-body">
        <div className="quick-access-grid">
          {QUICK_ACCESS_ITEMS.map((item) => (
            <button
              key={item.label}
              type="button"
              className="quick-access-item"
              onClick={() => navigate(item.path)}
            >
              <span className="quick-access-icon">
                <Icon icon={item.icon} width={18} />
              </span>
              <span className="quick-access-label">{item.label}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
