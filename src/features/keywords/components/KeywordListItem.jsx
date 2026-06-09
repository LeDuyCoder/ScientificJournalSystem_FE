/**
 * File source thuộc hệ thống FE ResearchPulse.
 *
 * File: features\keywords\components\KeywordListItem.jsx
 */
import { Badge, Button } from 'react-bootstrap';
import { Icon } from '@iconify/react';

/**
 * Card hiển thị một keyword trong danh sách.
 */
export default function KeywordListItem({ keyword, onViewArticles }) {
  const keywordId = keyword.keyword_id || keyword.id || keyword.keywordId;
  const articleCount = Number(keyword.article_count || 0);

  return (
    <div
      className="journal-dark-card p-4 h-100"
      style={{
        background: 'linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.00))',
        backgroundColor: 'var(--bg-card)',
        border: '1px solid var(--border)',
        borderRadius: '16px',
        boxShadow: '0 12px 30px rgba(0,0,0,0.05)',
      }}
    >
      <div className="d-flex align-items-start justify-content-between gap-3 mb-3">
        <div>
          <div className="text-uppercase text-muted-custom mb-2" style={{ fontSize: '0.72rem', letterSpacing: '0.1em' }}>
            Research keyword
          </div>
          <h3 className="font-display text-main fw-bold mb-0" style={{ fontSize: '1.15rem', lineHeight: 1.35 }}>
            {keyword.display_name}
          </h3>
        </div>
        <Icon icon="lucide:sparkles" width="18" style={{ color: 'var(--text-muted)' }} />
      </div>

      <div className="d-flex align-items-center gap-2 flex-wrap mb-4">
        {articleCount > 0 && (
          <Badge className="text-white bg-black px-2 py-1" style={{ borderRadius: '999px' }}>
            {articleCount} bài báo
          </Badge>
        )}
        {(keyword.topic_name || keyword.topic) && (
          <Badge bg="light" text="dark" style={{ borderRadius: '999px', border: '1px solid var(--border)' }}>
            {keyword.topic_name || keyword.topic}
          </Badge>
        )}
      </div>

      <Button
        id={`keyword-view-${keywordId || keyword.display_name}`}
        type="button"
        disabled={!keywordId}
        onClick={() => keywordId && onViewArticles && onViewArticles(keywordId)}
        style={{
          backgroundColor: '#111',
          color: '#fff',
          border: '1px solid #111',
          borderRadius: '10px',
          fontWeight: 600,
          fontSize: '0.9rem',
          padding: '10px 16px',
        }}
        className="d-inline-flex align-items-center gap-2"
      >
        <span>Xem bài báo liên quan</span>
        <Icon icon="lucide:arrow-up-right" width="16" />
      </Button>
    </div>
  );
}
