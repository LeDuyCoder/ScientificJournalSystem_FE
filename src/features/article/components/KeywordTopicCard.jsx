import React from 'react';
import { Card, Badge } from 'react-bootstrap';
import { Icon } from '@iconify/react';
import { useNavigate } from 'react-router-dom';

export default function KeywordTopicCard({ primaryTopic, keywords }) {
  const navigate = useNavigate();

  // Parse keywords if string or array
  let keywordList = [];
  if (keywords) {
    if (Array.isArray(keywords)) {
      keywordList = keywords;
    } else if (typeof keywords === 'string') {
      keywordList = keywords.split(',').map(s => s.trim()).filter(Boolean);
    }
  }

  const handleTagClick = (tag) => {
    navigate(`/catalog?search=${encodeURIComponent(tag)}`);
  };

  const hasContent = primaryTopic || keywordList.length > 0;

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
      <h5 className="font-display font-weight-bold text-main mb-3 d-flex align-items-center gap-2">
        <Icon icon="lucide:tags" className="text-primary" />
        Từ khóa & Chủ đề (Keywords & Topics)
      </h5>

      {!hasContent ? (
        <span className="text-muted-custom text-sm">Chưa có thông tin từ khóa.</span>
      ) : (
        <div className="d-flex flex-wrap gap-2">
          {/* Primary Topic */}
          {primaryTopic && (
            <Badge
              onClick={() => handleTagClick(primaryTopic)}
              className="py-2 px-3 text-xs font-semibold"
              style={{
                cursor: 'pointer',
                borderRadius: '8px',
                backgroundColor: 'var(--primary-light)',
                color: 'var(--primary)',
                border: '1px solid rgba(255, 122, 51, 0.3)',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--primary)';
                e.currentTarget.style.color = '#FFFFFF';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--primary-light)';
                e.currentTarget.style.color = 'var(--primary)';
              }}
            >
              Chủ đề: {primaryTopic}
            </Badge>
          )}

          {/* Keywords */}
          {keywordList.map((kw, index) => (
            <Badge
              key={index}
              onClick={() => handleTagClick(kw)}
              className="py-2 px-3 text-xs font-semibold"
              style={{
                cursor: 'pointer',
                borderRadius: '8px',
                backgroundColor: 'var(--bg-chip)',
                color: 'var(--text-main)',
                border: '1px solid var(--border)',
                transition: 'all 0.2s'
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
              {kw}
            </Badge>
          ))}
        </div>
      )}
    </Card>
  );
}
