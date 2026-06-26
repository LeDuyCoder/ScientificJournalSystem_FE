/**
 * File source thuộc hệ thống FE ResearchPulse.
 *
 * File: features\dashboard\components\TrendingKeywordsCard.jsx
 */
import { Icon } from '@iconify/react';
import { EntityCard } from '../../../shared/components/Card';

/**
 * KeywordTag — một keyword pill
 */
function KeywordTag({ keyword, onClick }) {
  const name   = keyword.keyword ?? keyword.name ?? keyword;
  const growth = keyword.growth ?? keyword.count ?? null;

  return (
    <button
      className="d-inline-flex align-items-center gap-1 rounded-pill px-3 py-1 font-display"
      onClick={() => onClick?.(name)}
      style={{
        backgroundColor: 'var(--bg-chip)', color: 'var(--text-main)', border: '1px solid var(--border)',
        fontSize: '0.8rem', fontWeight: 500, cursor: 'pointer',
        transition: 'all 0.15s ease',
        letterSpacing: '0.01em',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.color = 'var(--primary)';
        e.currentTarget.style.borderColor = 'var(--primary)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.color = 'var(--text-main)';
        e.currentTarget.style.borderColor = 'var(--border)';
      }}
    >
      <span>{name}</span>
      {growth != null && (
        <span style={{ opacity: 0.6, fontSize: '0.7rem' }}>
          {growth > 0 ? `+${growth > 999 ? (growth/1000).toFixed(1)+'k' : growth}` : growth}
        </span>
      )}
    </button>
  );
}

/**
 * TrendingKeywordsCard — card trending keywords với pills
 */
export default function TrendingKeywordsCard({ keywords, loading, error, onKeywordClick, onViewMore }) {
  const actions = onViewMore ? (
    <button
      className="btn btn-link p-0 text-decoration-none"
      onClick={onViewMore}
      style={{ fontSize: '0.75rem', color: 'var(--primary)' }}
      onMouseEnter={(e) => {
        e.currentTarget.style.textDecoration = 'underline';
        e.currentTarget.style.textUnderlineOffset = '4px';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.textDecoration = 'none';
      }}
    >
      Xem thêm →
    </button>
  ) : null;

  const description = loading ? (
    <div className="d-flex flex-wrap gap-2">
      {[120, 80, 100, 90, 110, 70, 95].map((w, i) => (
        <div key={i} className="skeleton-shimmer rounded-pill" style={{ width: w, height: 28 }} />
      ))}
    </div>
  ) : error ? (
    <div className="text-center py-4">
      <Icon icon="lucide:alert-circle" width={28} style={{ color: '#ef4444' }} />
      <p className="text-muted-custom mt-2 mb-0" style={{ fontSize: '0.8rem' }}>{error}</p>
    </div>
  ) : keywords.length === 0 ? (
    <div className="text-center py-4">
      <Icon icon="lucide:tag" width={32} style={{ color: 'var(--text-muted)' }} />
      <p className="text-main fw-semibold mt-2 mb-1" style={{ fontSize: '0.85rem' }}>
        Chưa có keyword nào
      </p>
      <p className="text-muted-custom mb-0" style={{ fontSize: '0.75rem' }}>
        Thêm keyword vào project để bắt đầu theo dõi.
      </p>
    </div>
  ) : (
    <div className="d-flex flex-wrap gap-2">
      {keywords.map((kw, i) => (
        <KeywordTag
          key={i}
          keyword={kw}
          index={i}
          onClick={onKeywordClick}
        />
      ))}
    </div>
  );

  return (
    <EntityCard
      className="h-100"
      title={(
        <span className="d-flex align-items-center gap-2">
          <Icon icon="lucide:flame" width={16} style={{ color: 'var(--primary)' }} />
          <span>Trending Keywords</span>
        </span>
      )}
      actions={actions}
      description={description}
      bodyClassName="flex-column align-items-stretch"
    />
  );
}
