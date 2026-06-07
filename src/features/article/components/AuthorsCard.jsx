import React from 'react';
import { Card } from 'react-bootstrap';
import { Icon } from '@iconify/react';
import { useNavigate } from 'react-router-dom';

export default function AuthorsCard({ authors }) {
  const navigate = useNavigate();

  // Robust parsing of authors
  let parsedAuthors = [];
  if (authors) {
    if (Array.isArray(authors)) {
      parsedAuthors = authors.map(author => {
        if (typeof author === 'string') {
          const match = author.match(/^(.*?)(?:\s*\((.*?)\))?$/);
          return {
            name: match ? match[1].trim() : author,
            institution: match && match[2] ? match[2].trim() : ''
          };
        } else if (typeof author === 'object' && author !== null) {
          return {
            name: author.name || author.author_name || 'Tác giả',
            institution: author.institution || author.affiliation || ''
          };
        }
        return null;
      }).filter(Boolean);
    } else if (typeof authors === 'string') {
      parsedAuthors = authors.split(',').map(authorStr => {
        const trimmed = authorStr.trim();
        const match = trimmed.match(/^(.*?)(?:\s*\((.*?)\))?$/);
        return {
          name: match ? match[1].trim() : trimmed,
          institution: match && match[2] ? match[2].trim() : ''
        };
      }).filter(Boolean);
    }
  }

  const handleAuthorClick = (name) => {
    navigate(`/catalog?search=${encodeURIComponent(name)}`);
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
      <h5 className="font-display font-weight-bold text-main mb-3 d-flex align-items-center gap-2 border-bottom border-light pb-2">
        <Icon icon="lucide:users" className="text-primary" />
        Nhóm Tác giả (Authors)
      </h5>

      {parsedAuthors.length === 0 ? (
        <span className="text-muted-custom text-sm">Chưa cập nhật thông tin tác giả.</span>
      ) : (
        <div className="d-flex flex-column gap-3">
          {parsedAuthors.map((author, index) => {
            const initial = author.name.charAt(0).toUpperCase();
            return (
              <div 
                key={index} 
                className="d-flex align-items-start gap-3 p-2 rounded-3 hover:bg-light transition-all"
                style={{ transition: 'all 0.2s' }}
              >
                {/* Avatar */}
                <div 
                  className="d-flex align-items-center justify-content-center text-white text-xs font-bold rounded-circle font-display"
                  style={{
                    width: '32px',
                    height: '32px',
                    background: 'linear-gradient(135deg, var(--btn-dark) 0%, var(--primary) 100%)',
                    flexShrink: 0
                  }}
                >
                  {initial}
                </div>
                {/* Info */}
                <div className="flex-grow-1">
                  <div 
                    onClick={() => handleAuthorClick(author.name)}
                    className="text-sm text-main font-weight-semibold hover:text-primary transition-colors"
                    style={{ cursor: 'pointer', fontWeight: 600, textDecoration: 'none' }}
                  >
                    {author.name}
                  </div>
                  {author.institution && (
                    <div className="text-muted-custom text-xs mt-0.5" style={{ fontSize: '0.75rem' }}>
                      <Icon icon="lucide:building" width="12" className="me-1 opacity-75" />
                      {author.institution}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
}
