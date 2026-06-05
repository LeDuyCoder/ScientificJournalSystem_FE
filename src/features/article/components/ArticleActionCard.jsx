import React, { useState } from 'react';
import { Card, Button, Spinner } from 'react-bootstrap';
import { Icon } from '@iconify/react';

export default function ArticleActionCard({ 
  article, 
  isBookmarked, 
  onBookmarkToggle, 
  isBookmarkLoading, 
  isLoggedIn 
}) {
  const [showCopiedToast, setShowCopiedToast] = useState(false);

  const handleCopyDoi = () => {
    if (!article?.doi) return;
    navigator.clipboard.writeText(article.doi);
    setShowCopiedToast(true);
    setTimeout(() => {
      setShowCopiedToast(false);
    }, 2500);
  };

  const handleOpenSource = () => {
    if (!article?.doi) return;
    const url = article.doi.startsWith('http') ? article.doi : `https://doi.org/${article.doi}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <Card 
      className="journal-dark-card border-0 p-4 mb-4 position-relative" 
      style={{ 
        backgroundColor: 'var(--bg-card)', 
        border: '1px solid var(--border)',
        borderRadius: '16px',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.02)'
      }}
    >
      <h5 className="font-display font-weight-bold text-main mb-3 d-flex align-items-center gap-2 border-bottom border-light pb-2">
        <Icon icon="lucide:sliders" className="text-primary" />
        Hành động (Actions)
      </h5>

      {/* Floating Copied Message */}
      {showCopiedToast && (
        <div 
          className="position-absolute start-50 translate-middle-x px-3 py-1.5 rounded text-white text-xs d-flex align-items-center gap-1.5 shadow"
          style={{
            top: '-20px',
            backgroundColor: 'var(--btn-dark)',
            border: '1px solid var(--primary)',
            zIndex: 100,
            whiteSpace: 'nowrap',
            animation: 'fadeInUp 0.2s ease-out'
          }}
        >
          <Icon icon="lucide:check-circle" className="text-success" />
          <span>Đã sao chép mã DOI!</span>
        </div>
      )}

      <div className="d-flex flex-column gap-3">
        {/* Bookmark Button */}
        <Button
          onClick={onBookmarkToggle}
          disabled={isBookmarkLoading}
          className="w-full d-flex align-items-center justify-content-center gap-2 py-2.5 font-semibold text-sm transition-all"
          style={{
            borderRadius: '8px',
            backgroundColor: isBookmarked ? 'var(--primary-light)' : 'transparent',
            color: isBookmarked ? 'var(--primary)' : 'var(--text-main)',
            border: isBookmarked ? '1px solid var(--primary)' : '1px solid var(--border)',
          }}
          onMouseEnter={(e) => {
            if (!isBookmarked) {
              e.currentTarget.style.borderColor = 'var(--primary)';
              e.currentTarget.style.color = 'var(--primary)';
            }
          }}
          onMouseLeave={(e) => {
            if (!isBookmarked) {
              e.currentTarget.style.borderColor = 'var(--border)';
              e.currentTarget.style.color = 'var(--text-main)';
            }
          }}
        >
          {isBookmarkLoading ? (
            <Spinner animation="border" size="sm" className="text-primary" />
          ) : (
            <Icon 
              icon={isBookmarked ? "lucide:bookmark-check" : "lucide:bookmark"} 
              width="18" 
              className={isBookmarked ? "text-primary" : ""}
            />
          )}
          <span>{isBookmarked ? 'Đã bookmark bài báo' : 'Bookmark bài báo'}</span>
        </Button>

        {/* Copy DOI Button */}
        {article?.doi && (
          <Button
            onClick={handleCopyDoi}
            className="w-full d-flex align-items-center justify-content-center gap-2 py-2.5 font-semibold text-sm transition-all bg-transparent text-main"
            style={{
              borderRadius: '8px',
              border: '1px solid var(--border)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--primary)';
              e.currentTarget.style.color = 'var(--primary)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--border)';
              e.currentTarget.style.color = 'var(--text-main)';
            }}
          >
            <Icon icon="lucide:copy" width="18" />
            <span>Copy mã DOI</span>
          </Button>
        )}

        {/* View Source Button */}
        {article?.doi && (
          <Button
            onClick={handleOpenSource}
            className="w-full d-flex align-items-center justify-content-center gap-2 py-2.5 font-semibold text-sm btn-dark-solid"
            style={{
              borderRadius: '8px'
            }}
          >
            <Icon icon="lucide:external-link" width="18" />
            <span>Xem nguồn bài báo</span>
          </Button>
        )}
      </div>

      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translate(-50%, 10px);
          }
          to {
            opacity: 1;
            transform: translate(-50%, 0);
          }
        }
      `}</style>
    </Card>
  );
}
