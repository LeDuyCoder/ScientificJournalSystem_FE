import { useTranslation } from "react-i18next";
/**
 * File source thuộc hệ thống FE ResearchPulse.
 *
 * File: features\dashboard\components\TopAuthorsTable.jsx
 */
import { Icon } from '@iconify/react';
import { useNavigate } from 'react-router-dom';
import { EntityCard } from '../../../shared/components/Card';
import { formatCount } from '../../../shared/utils/formatNumber';
import { truncate } from '../../../shared/utils/formatNumber';

/** Rank badge — top 3 có màu riêng */
function RankBadge({
  rank
}) {
  const cfg = {
    1: {
      bg: 'rgba(245, 158, 11, 0.15)',
      color: '#d97706',
      icon: 'lucide:crown'
    },
    2: {
      bg: 'rgba(156, 163, 175, 0.15)',
      color: '#6b7280',
      icon: null
    },
    3: {
      bg: 'rgba(217, 119, 6, 0.1)',
      color: '#b45309',
      icon: null
    }
  }[rank] ?? {
    bg: 'transparent',
    color: 'var(--text-muted)',
    icon: null
  };
  return <div className="d-flex align-items-center justify-content-center rounded-circle flex-shrink-0" style={{
    width: 28,
    height: 28,
    backgroundColor: cfg.bg,
    color: cfg.color,
    fontSize: '0.75rem',
    fontWeight: 700
  }}>
      {cfg.icon ? <Icon icon={cfg.icon} width={12} /> : rank}
    </div>;
}

/** Author field badge */
function FieldBadge({
  field
}) {
  return <span className="px-2 py-1 rounded-pill d-none d-sm-inline" style={{
    fontSize: '0.65rem',
    fontWeight: 600,
    backgroundColor: 'var(--bg-section)',
    color: 'var(--text-muted)',
    border: '1px solid var(--border)',
    justifySelf: 'start'
  }}>
      {field}
    </span>;
}

/** Author avatar initials */
function AuthorAvatar({
  name
}) {
  const initials = (name || '?').split(' ').slice(0, 2).map(w => w[0]?.toUpperCase() ?? '').join('');
  return <div className="d-flex align-items-center justify-content-center flex-shrink-0 text-white" style={{
    width: 32,
    height: 32,
    borderRadius: '50%',
    background: 'var(--btn-dark)',
    fontSize: '0.7rem',
    fontWeight: 700
  }}>
      {initials}
    </div>;
}

/**
 * TopAuthorsTable — bảng top 5 tác giả nổi bật tuần này.
 * Reusable: có thể dùng lại cho Author Leaderboard page.
 */
export default function TopAuthorsTable({
  authors,
  loading,
  error,
  onAuthorClick,
  onViewAll
}) {
  const {
    t
  } = useTranslation();
  const navigate = useNavigate();
  const actions = onViewAll ? <button className="btn btn-link p-0 text-decoration-none" onClick={onViewAll} style={{
    fontSize: '0.75rem',
    color: 'var(--primary)'
  }} onMouseEnter={e => {
    e.currentTarget.style.textDecoration = 'underline';
    e.currentTarget.style.textUnderlineOffset = '4px';
  }} onMouseLeave={e => {
    e.currentTarget.style.textDecoration = 'none';
  }}>{t("dashboard.bangXepHang")}</button> : null;
  const description = loading ? <div className="p-4">
      {[1, 2, 3, 4, 5].map(i => <div key={i} className="d-flex align-items-center gap-3 py-2">
          <div className="skeleton-shimmer rounded-circle" style={{
        width: 28,
        height: 28
      }} />
          <div className="skeleton-shimmer rounded-circle" style={{
        width: 32,
        height: 32
      }} />
          <div className="flex-grow-1">
            <div className="skeleton-shimmer rounded mb-1" style={{
          width: '50%',
          height: 13
        }} />
            <div className="skeleton-shimmer rounded" style={{
          width: '30%',
          height: 10
        }} />
          </div>
          <div className="skeleton-shimmer rounded" style={{
        width: 60,
        height: 13
      }} />
        </div>)}
    </div> : error ? <div className="text-center py-5 px-4">
      <Icon icon="lucide:alert-circle" width={32} style={{
      color: '#ef4444'
    }} />
      <p className="text-muted-custom mt-2 mb-0" style={{
      fontSize: '0.8rem'
    }}>{error}</p>
    </div> : authors.length === 0 ? <div className="text-center py-5 px-4">
      <Icon icon="lucide:users" width={36} style={{
      color: 'var(--text-muted)'
    }} />
      <p className="text-main fw-semibold mt-2 mb-1" style={{
      fontSize: '0.85rem'
    }}>{t("dashboard.chuaCoDuLieuTacGia")}</p>
      <p className="text-muted-custom mb-0" style={{
      fontSize: '0.75rem'
    }}>{t("dashboard.duLieuLeaderboardSeHienThiODay")}</p>
    </div> : <div>
      {/* Table header */}
      <div className="d-none d-md-grid px-4 py-2 mb-2 rounded-3 mx-2 mt-2" style={{
      gridTemplateColumns: '40px 200px 1fr 80px 90px',
      gap: '12px',
      alignItems: 'center',
      backgroundColor: 'var(--bg-section)'
    }}>
        {['#', t("typeAuthor"), t("author.linhVuc"), t("articles"), 'Citations'].map(h => <span key={h} className="text-muted-custom" style={{
        fontSize: '0.7rem',
        fontWeight: 600,
        textTransform: 'uppercase',
        letterSpacing: '0.05em'
      }}>{h}</span>)}
      </div>

      {/* Rows */}
      <div className="d-flex flex-column gap-2 pb-3 px-2">
      {authors.map((author, i) => {
      const name = author.display_name ?? author.full_name ?? author.author_name ?? author.name ?? 'Unknown';
      const orcid = author.orcid ?? null;
      const field = author.subject_area ?? author.primary_subject_area ?? author.field ?? author.area ?? '—';
      const articles = author.article_count ?? author.papers ?? author.works_count ?? 0;
      const citations = author.citation_count ?? author.citations ?? author.cited_by_count ?? 0;
      const rank = i + 1;
      return <div key={author.author_id ?? author.id ?? i} className="d-flex d-md-grid px-3 py-3 align-items-center gap-3 font-display rounded-4" style={{
        gridTemplateColumns: '40px 200px 1fr 80px 90px',
        cursor: 'pointer',
        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        border: '1px solid transparent'
      }} onClick={() => onAuthorClick?.(author)} onMouseEnter={e => {
        e.currentTarget.style.backgroundColor = 'var(--bg-section)';
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.borderColor = 'var(--border)';
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.05)';
      }} onMouseLeave={e => {
        e.currentTarget.style.backgroundColor = 'transparent';
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.borderColor = 'transparent';
        e.currentTarget.style.boxShadow = 'none';
      }}>
            <RankBadge rank={rank} />
            <div className="d-flex align-items-center gap-2">
              <AuthorAvatar name={name} />
              <div className="text-truncate" style={{
            minWidth: 0
          }}>
                <div className="text-main fw-semibold" style={{
              fontSize: '0.85rem'
            }}>
                  {truncate(name, 24)}
                </div>
                {orcid ? <div className="text-muted-custom" style={{
              fontSize: '0.75rem'
            }}>
                    {truncate(orcid, 32)}
                  </div> : null}
              </div>
            </div>
            <FieldBadge field={field == "" ? "—" : field} />
            <span className="text-muted-custom" style={{
          fontSize: '0.85rem'
        }}>
              {formatCount(articles)}
            </span>
            <span style={{
          fontSize: '0.85rem',
          color: 'var(--text-main)',
          fontWeight: 600
        }}>
              ↑ {formatCount(citations)}
            </span>
          </div>;
    })}
      </div>
    </div>;
  return <EntityCard title={t("dashboard.topAuthorsTuanNay")} actions={actions} description={description} bodyClassName="flex-column align-items-stretch" />;
}