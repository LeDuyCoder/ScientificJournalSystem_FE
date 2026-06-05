import React from 'react';
import { Card, Badge } from 'react-bootstrap';
import { Icon } from '@iconify/react';
import { useNavigate } from 'react-router-dom';

export default function ArticleHeaderCard({ article }) {
  const navigate = useNavigate();

  if (!article) return null;

  // Extract author info
  let authorText = '';
  let mainAuthorInitials = 'A';
  let hasMultipleAuthors = false;
  let additionalCount = 0;

  if (article.authors) {
    if (Array.isArray(article.authors)) {
      if (article.authors.length > 0) {
        const firstAuthor = article.authors[0];
        authorText = typeof firstAuthor === 'string' ? firstAuthor.split(' (')[0] : firstAuthor.name || 'Tác giả';
        mainAuthorInitials = authorText.charAt(0).toUpperCase();
        if (article.authors.length > 1) {
          hasMultipleAuthors = true;
          additionalCount = article.authors.length - 1;
        }
      }
    } else if (typeof article.authors === 'string') {
      const splitAuthors = article.authors.split(',').map(s => s.trim());
      if (splitAuthors.length > 0) {
        authorText = splitAuthors[0].split(' (')[0];
        mainAuthorInitials = authorText.charAt(0).toUpperCase();
        if (splitAuthors.length > 1) {
          hasMultipleAuthors = true;
          additionalCount = splitAuthors.length - 1;
        }
      }
    }
  }

  // Get Quartile styling from DESIGN_SYSTEM
  const quartile = article.quartile || article.journal?.quartile || 'Q1';
  const getQuartileStyle = (q) => {
    const qUpper = String(q).toUpperCase();
    if (qUpper === 'Q1') {
      return {
        bg: 'rgba(47, 198, 70, 0.12)',
        color: 'var(--q1-color)',
        border: '1px solid rgba(47, 198, 70, 0.3)'
      };
    }
    if (qUpper === 'Q2') {
      return {
        bg: 'var(--primary-light)',
        color: 'var(--primary)',
        border: '1px solid rgba(255, 122, 51, 0.3)'
      };
    }
    return {
      bg: 'var(--bg-section)',
      color: 'var(--text-muted)',
      border: '1px solid var(--border)'
    };
  };

  const qStyle = getQuartileStyle(quartile);

  const handleJournalClick = () => {
    const journalId = article.journal?.journal_id || article.journal_id;
    if (journalId) {
      navigate(`/journals/${journalId}`);
    }
  };

  return (
    <Card 
      className="journal-dark-card border-0 p-4 mb-4" 
      style={{ 
        backgroundColor: 'var(--bg-card)', 
        border: '1px solid var(--border)',
        borderRadius: '16px',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.02)'
      }}
    >
      {/* Badges row */}
      <div className="d-flex flex-wrap gap-2 mb-3">
        <Badge 
          className="py-1.5 px-2.5 text-xs font-semibold" 
          style={{ 
            borderRadius: '6px', 
            fontSize: '0.75rem',
            backgroundColor: qStyle.bg,
            color: qStyle.color,
            border: qStyle.border
          }}
        >
          {quartile}
        </Badge>
        {article.is_open_access && (
          <Badge 
            className="py-1.5 px-2.5 text-xs font-semibold" 
            style={{ 
              borderRadius: '6px', 
              fontSize: '0.75rem',
              backgroundColor: 'rgba(47, 198, 70, 0.12)',
              color: 'var(--q1-color)',
              border: '1px solid rgba(47, 198, 70, 0.3)'
            }}
          >
            Open Access
          </Badge>
        )}
        {article.publication_year && (
          <Badge 
            className="py-1.5 px-2.5 text-xs font-semibold" 
            style={{ 
              borderRadius: '6px', 
              fontSize: '0.75rem',
              backgroundColor: 'var(--bg-chip)',
              color: 'var(--text-muted)',
              border: '1px solid var(--border)'
            }}
          >
            Năm xuất bản: {article.publication_year}
          </Badge>
        )}
      </div>

      {/* Title */}
      <h1 
        className="font-display text-main mb-3" 
        style={{ 
          fontSize: '2rem', 
          lineHeight: '1.3', 
          fontWeight: 700 
        }}
      >
        {article.title}
      </h1>

      {/* Main Author Row */}
      {authorText && (
        <div className="d-flex align-items-center gap-3 mb-4">
          <div 
            className="d-flex align-items-center justify-content-center text-white text-xs font-bold rounded-circle font-display"
            style={{
              width: '36px',
              height: '36px',
              background: 'linear-gradient(135deg, var(--btn-dark) 0%, var(--text-muted) 100%)',
              flexShrink: 0
            }}
          >
            {mainAuthorInitials}
          </div>
          <div>
            <div className="text-sm text-main font-weight-semibold" style={{ fontWeight: 600 }}>
              {authorText}
              {hasMultipleAuthors && (
                <span className="text-muted-custom font-weight-normal text-xs ms-1">
                  và {additionalCount} tác giả khác
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Journal Link */}
      {(article.journal?.display_name || article.journal_name) && (
        <div 
          className="d-flex align-items-center gap-2 text-muted-custom pt-3 border-top border-light" 
          style={{ fontSize: '0.9rem' }}
        >
          <Icon icon="lucide:book-open" className="text-primary" width="18" />
          <span>Xuất bản trong:</span>
          {article.journal?.journal_id || article.journal_id ? (
            <span 
              onClick={handleJournalClick}
              className="text-primary font-weight-semibold hover:text-dark transition-colors"
              style={{ cursor: 'pointer', fontWeight: 600, textDecoration: 'underline' }}
            >
              {article.journal?.display_name || article.journal_name}
            </span>
          ) : (
            <span className="text-main font-weight-semibold" style={{ fontWeight: 600 }}>
              {article.journal?.display_name || article.journal_name}
            </span>
          )}
        </div>
      )}
    </Card>
  );
}
