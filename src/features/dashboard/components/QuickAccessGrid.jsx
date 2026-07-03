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
/**
 * QUICK_ACCESS_ITEMS — constant config với màu sắc và mô tả chi tiết
 */
const QUICK_ACCESS_ITEMS = [
  { 
    icon: 'lucide:search', 
    label: 'Tìm kiếm', 
    desc: 'Khám phá bài báo & đề tài',
    path: '/catalog',
    color: 'var(--primary)',
    bg: 'var(--primary-light)'
  },
  { 
    icon: 'lucide:book-open', 
    label: 'Tạp chí', 
    desc: 'Xếp hạng Q1-Q4 khoa học',
    path: '/catalog',
    color: 'var(--primary)',
    bg: 'var(--primary-light)'
  },
  { 
    icon: 'lucide:globe', 
    label: 'Địa lý', 
    desc: 'Bản đồ phân bố tác giả',
    path: '/geography',
    color: 'var(--primary)',
    bg: 'var(--primary-light)'
  },
  { 
    icon: 'lucide:trophy', 
    label: 'Leaderboard', 
    desc: 'Xếp hạng tác giả nổi bật',
    path: '/authors',
    color: 'var(--primary)',
    bg: 'var(--primary-light)'
  },
];

/**
 * QuickAccessGrid — 4 card điều hướng nhanh, thiết kế hiện đại 2x2
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
        <div className="premium-qa-grid">
          {QUICK_ACCESS_ITEMS.map((item) => (
            <button
              key={item.label}
              type="button"
              className="premium-qa-tile"
              onClick={() => navigate(item.path)}
            >
              <div 
                className="premium-qa-icon-wrapper" 
                style={{ backgroundColor: item.bg, color: item.color }}
              >
                <Icon icon={item.icon} width={20} />
              </div>
              <div className="premium-qa-content">
                <span className="premium-qa-title">{item.label}</span>
                <span className="premium-qa-desc">{item.desc}</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
