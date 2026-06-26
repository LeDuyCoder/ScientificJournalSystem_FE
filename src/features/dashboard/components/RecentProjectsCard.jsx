/**
 * File source thuộc hệ thống FE ResearchPulse.
 *
 * File: features\dashboard\components\RecentProjectsCard.jsx
 */
import { Icon } from '@iconify/react';
import { EntityCard } from '../../../shared/components/Card';
import { truncate } from '../../../shared/utils/formatNumber';

/** Status badge config */
const STATUS_CONFIG = {
  active: { label: 'Hoạt động', bg: 'var(--bg-chip)', color: 'var(--text-main)', border: 'var(--border)' },
  new: { label: 'New', bg: 'var(--primary-light)', color: 'var(--primary)', border: 'transparent' },
  paused: { label: 'Tạm dừng', bg: 'var(--bg-section)', color: 'var(--text-muted)', border: 'var(--border)' },
  archived: { label: 'Lưu trữ', bg: 'var(--bg-section)', color: 'var(--text-muted)', border: 'var(--border)' },
};

function ProjectStatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status?.toLowerCase()] ?? STATUS_CONFIG.active;
  return (
    <span
      className="d-inline-block px-2 py-1 rounded-pill font-display"
      style={{
        fontSize: '0.7rem', fontWeight: 600,
        backgroundColor: cfg.bg, color: cfg.color,
        border: `1px solid ${cfg.border}`,
      }}
    >
      {cfg.label}
    </span>
  );
}

/**
 * RecentProjectItem — một row project trong danh sách
 */
function RecentProjectItem({ project, onClick }) {
  const name = project.project_name ?? project.name ?? project.title ?? 'Untitled';
  const journalCount = project.journal_count ?? project.journals?.length ?? 0;
  const articleCount = project.article_count ?? 0;
  const status = project.status ?? 'active';

  // Avatar initials from name (Up to 3 letters)
  const initials = name
    .split(' ')
    .filter(w => w.length > 0)
    .slice(0, 3)
    .map(w => w[0]?.toUpperCase() ?? '')
    .join('');

  return (
    <div
      className="d-flex align-items-center gap-3 py-3 px-3 rounded-3"
      style={{
        cursor: 'pointer',
        transition: 'background 0.15s ease',
        borderBottom: '1px solid var(--border)',
      }}
      onClick={onClick}
      onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--bg-section)'}
      onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
    >
      {/* Avatar */}
      <div
        className="d-flex align-items-center justify-content-center flex-shrink-0 text-white font-display"
        style={{
          width: 40, height: 40, borderRadius: 10,
          background: 'var(--btn-dark)',
          fontSize: initials.length >= 3 ? '0.65rem' : '0.75rem', fontWeight: 700,
        }}
      >
        {initials}
      </div>

      {/* Info */}
      <div className="flex-grow-1 min-w-0">
        <div className="text-main fw-semibold text-truncate" style={{ fontSize: '0.85rem' }}>
          {truncate(name, 32)}
        </div>
        <div className="text-muted-custom" style={{ fontSize: '0.72rem' }}>
          {journalCount} journals · {articleCount} bài báo
        </div>
      </div>

      {/* Status */}
      <ProjectStatusBadge status={status} />
    </div>
  );
}

/**
 * RecentProjectsCard — card chứa danh sách 3 project gần đây
 */
export default function RecentProjectsCard({ projects, loading, error, onViewAll, onProjectClick }) {
  const actions = onViewAll ? (
    <button
      className="btn btn-link p-0 text-decoration-none"
      onClick={onViewAll}
      style={{ fontSize: '0.75rem', color: 'var(--primary)' }}
      onMouseEnter={(e) => {
        e.currentTarget.style.textDecoration = 'underline';
        e.currentTarget.style.textUnderlineOffset = '4px';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.textDecoration = 'none';
      }}
    >
      Xem tất cả →
    </button>
  ) : null;

  const description = (
    <div className="px-1">
      {loading ? (
        [1, 2, 3].map(i => (
          <div key={i} className="d-flex align-items-center gap-3 px-3 py-3">
            <div className="skeleton-shimmer rounded-3" style={{ width: 40, height: 40, flexShrink: 0 }} />
            <div className="flex-grow-1">
              <div className="skeleton-shimmer rounded mb-1" style={{ width: '70%', height: 14 }} />
              <div className="skeleton-shimmer rounded" style={{ width: '50%', height: 11 }} />
            </div>
          </div>
        ))
      ) : error ? (
        <div className="text-center py-5 px-3">
          <Icon icon="lucide:alert-circle" width={32} style={{ color: '#ef4444' }} />
          <p className="text-muted-custom mt-2 mb-0" style={{ fontSize: '0.8rem' }}>{error}</p>
        </div>
      ) : projects.length === 0 ? (
        <div className="text-center py-5 px-3">
          <Icon icon="lucide:folder-plus" width={36} style={{ color: 'var(--text-muted)' }} />
          <p className="text-main fw-semibold mt-2 mb-1" style={{ fontSize: '0.85rem' }}>
            Chưa có project nào
          </p>
          <p className="text-muted-custom mb-0" style={{ fontSize: '0.75rem' }}>
            Tạo project đầu tiên để bắt đầu theo dõi.
          </p>
        </div>
      ) : (
        projects.slice(0, 3).map((p, i) => (
          <RecentProjectItem
            key={p.project_id ?? p.id ?? i}
            project={p}
            onClick={() => onProjectClick?.(p)}
          />
        ))
      )}
    </div>
  );

  return (
    <EntityCard
      className="h-100"
      title={(
        <span className="d-flex align-items-center gap-2">
          <Icon icon="lucide:folder-open" width={16} style={{ color: 'var(--primary)' }} />
          <span>Projects gần đây</span>
        </span>
      )}
      actions={actions}
      description={description}
      bodyClassName="flex-column align-items-stretch"
    />
  );
}
