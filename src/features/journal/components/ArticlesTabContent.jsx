import React from 'react';
import { Card, Button, Badge } from 'react-bootstrap';
import { Icon } from '@iconify/react';
import LoadingSkeleton from '../../../shared/components/LoadingSkeleton';

export default function ArticlesTabContent({ recentArticles = [], loading, onArticleClick }) {
  if (loading) {
    return (
      <div className="d-flex flex-column gap-3">
        {[1, 2].map(i => (
          <div 
            key={i} 
            className="journal-dark-card p-4"
            style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '12px' }}
          >
            <LoadingSkeleton width="120px" height="18px" className="mb-2" />
            <LoadingSkeleton width="80%" height="28px" className="mb-3" />
            <LoadingSkeleton width="200px" height="16px" className="mb-3" />
            <LoadingSkeleton width="100%" height="60px" />
          </div>
        ))}
      </div>
    );
  }

  if (!recentArticles || recentArticles.length === 0) {
    return (
      <div 
        className="journal-dark-card p-5 text-center text-muted-custom"
        style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '12px' }}
      >
        Journal này chưa có bài báo gần đây.
      </div>
    );
  }

  return (
    <div className="d-flex flex-column gap-3 text-start">
      {recentArticles.map((article) => (
        <Card 
          key={article.id} 
          className="journal-dark-card p-4 border-0" 
          style={{ 
            backgroundColor: 'var(--bg-card)',
            boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
            border: '1px solid var(--border)',
            borderRadius: '12px'
          }}
        >
          {/* Metadata Row */}
          <div className="d-flex align-items-center gap-3 mb-2 flex-wrap" style={{ fontSize: '0.85rem' }}>
            <Badge 
              className="font-display px-2 py-1" 
              style={{ 
                backgroundColor: 'var(--primary-light)', 
                color: 'var(--primary)', 
                border: '1px solid var(--border)' 
              }}
            >
              {article.publication_year}
            </Badge>
            {article.doi && (
              <span className="text-muted-custom d-flex align-items-center gap-1">
                <Icon icon="lucide:link-2" width="14" />
                DOI: {article.doi}
              </span>
            )}
          </div>

          {/* Title */}
          <h4 
            className="font-display fw-bold text-main mb-2 transition-colors duration-150" 
            style={{ fontSize: '1.2rem', cursor: 'pointer', lineHeight: '1.4' }} 
            onClick={() => onArticleClick && onArticleClick(article.id)}
            onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--primary)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-main)'; }}
          >
            {article.title}
          </h4>

          {/* Authors */}
          {article.authors && (
            <div className="text-muted-custom mb-3 d-flex align-items-center gap-2" style={{ fontSize: '0.9rem' }}>
              <Icon icon="lucide:users" width="16" className="text-primary" />
              <span>{article.authors}</span>
            </div>
          )}

          {/* Abstract */}
          {article.abstract && (
            <p className="text-muted-custom mb-4 leading-relaxed" style={{ fontSize: '0.95rem', display: '-webkit-box', WebkitLineClamp: '3', WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
              {article.abstract}
            </p>
          )}

          {/* Action button */}
          <div className="mt-auto d-flex justify-content-end">
            <Button
              variant="outline-primary"
              onClick={() => onArticleClick && onArticleClick(article.id)}
              className="d-flex align-items-center gap-2 px-3 py-1.5"
              style={{
                borderRadius: '6px',
                border: '1px solid var(--primary)',
                color: 'var(--primary)',
                fontSize: '0.85rem',
                fontWeight: 600
              }}
            >
              Xem chi tiết
              <Icon icon="lucide:arrow-right" width="14" />
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
}
