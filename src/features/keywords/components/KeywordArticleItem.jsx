import { Badge, Button } from 'react-bootstrap';
import { Icon } from '@iconify/react';

/**
 * Item hiển thị bài báo liên quan đến keyword.
 */
export default function KeywordArticleItem({ article, onViewDetail }) {
  return (
    <div
      className="journal-dark-card p-4"
      style={{
        backgroundColor: 'var(--bg-card)',
        border: '1px solid var(--border)',
        borderRadius: '16px',
        boxShadow: '0 10px 28px rgba(0,0,0,0.04)',
      }}
    >
      <div className="d-flex align-items-center gap-2 flex-wrap mb-3">
        {article.publication_year && <Badge className="text-white bg-black px-2 py-1">{article.publication_year}</Badge>}
        {article.journal_name && (
          <span className="text-muted-custom d-inline-flex align-items-center gap-1" style={{ fontSize: '0.85rem' }}>
            <Icon icon="lucide:book-open" width="14" />
            {article.journal_name}
          </span>
        )}
        {article.citations_count > 0 && (
          <span className="text-muted-custom d-inline-flex align-items-center gap-1" style={{ fontSize: '0.85rem' }}>
            <Icon icon="lucide:quote" width="14" />
            {article.citations_count} citations
          </span>
        )}
      </div>

      <h2 className="font-display fw-bold text-main mb-2" style={{ fontSize: '1.15rem', lineHeight: 1.4 }}>
        {article.title}
      </h2>

      {article.doi && (
        <p className="text-muted-custom mb-3" style={{ fontSize: '0.88rem' }}>
          DOI: {article.doi}
        </p>
      )}

      {article.abstract && (
        <p className="text-muted-custom mb-4" style={{ fontSize: '0.95rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {article.abstract}
        </p>
      )}

      <Button
        type="button"
        onClick={() => onViewDetail && onViewDetail(article.article_id)}
        className="d-inline-flex align-items-center gap-2"
        style={{
          backgroundColor: '#111',
          color: '#fff',
          border: '1px solid #111',
          borderRadius: '10px',
          fontWeight: 600,
        }}
      >
        Xem chi tiết
        <Icon icon="lucide:arrow-right" width="16" />
      </Button>
    </div>
  );
}
