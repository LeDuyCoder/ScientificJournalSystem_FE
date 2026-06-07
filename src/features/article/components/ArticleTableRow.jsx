import React from 'react';
import { Badge, Button } from 'react-bootstrap';
import { Icon } from '@iconify/react';
import { useNavigate } from 'react-router-dom';

export default function ArticleTableRow({ article, index, onDetailClick }) {
  const navigate = useNavigate();

  // Helper to assign colors to topics
  const getTopicStyle = (topic) => {
    if (!topic) return { bg: 'var(--bg-main)', color: 'var(--text-muted)' };
    const name = String(topic).toLowerCase();
    if (name.includes('machine learning') || name.includes('ml')) {
      return { bg: 'var(--primary-light)', color: 'var(--primary)' }; // Blue
    }
    if (name.includes('computer science') || name.includes('cs')) {
      return { bg: 'rgba(6, 182, 212, 0.1)', color: '#0891b2' }; // Cyan
    }
    if (name.includes('medicine') || name.includes('bio')) {
      return { bg: 'rgba(16, 185, 129, 0.1)', color: '#059669' }; // Emerald/Green
    }
    if (name.includes('physic')) {
      return { bg: 'rgba(245, 158, 11, 0.1)', color: '#d97706' }; // Amber
    }
    return { bg: 'rgba(139, 92, 246, 0.1)', color: '#7c3aed' }; // Violet
  };

  const topicStyle = getTopicStyle(article.primary_topic);

  // Copy DOI link to clipboard
  const handleCopyDoi = (e, doi) => {
    e.stopPropagation();
    if (!doi) return;
    navigator.clipboard.writeText(doi);
    alert('Đã sao chép mã DOI vào bộ nhớ tạm: ' + doi);
  };

  const handleJournalClick = (e, journalId) => {
    e.stopPropagation();
    if (journalId) {
      navigate(`/journals/${journalId}`);
    }
  };

  return (
    <tr 
      onClick={() => onDetailClick(article.article_id)}
      style={{
        cursor: 'pointer',
        borderBottom: '1px solid var(--border)',
        transition: 'all 0.15s'
      }}
      className="align-middle article-table-row"
    >
      {/* Index */}
      <td className="text-muted-custom ps-3 font-display" style={{ width: '40px', fontSize: '0.8rem' }}>
        {index + 1}
      </td>

      {/* Article Title */}
      <td style={{ maxWidth: '400px' }} className="py-3">
        <div 
          className="text-main font-weight-semibold hover:text-primary transition-colors duration-150 text-sm"
          style={{ 
            lineHeight: '1.4', 
            fontWeight: 600,
            overflow: 'hidden',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical'
          }}
        >
          {article.title}
        </div>
        {article.abstract && (
          <div 
            className="text-muted-custom mt-1 text-xs" 
            style={{ 
              fontWeight: 400,
              overflow: 'hidden',
              display: '-webkit-box',
              WebkitLineClamp: 1,
              WebkitBoxOrient: 'vertical'
            }}
          >
            {article.abstract}
          </div>
        )}
      </td>

      {/* Journal Name */}
      <td style={{ maxWidth: '180px' }}>
        {article.journal ? (
          <div 
            onClick={(e) => handleJournalClick(e, article.journal.journal_id)}
            className="text-main hover:text-primary text-sm text-truncate"
            style={{ textDecoration: 'none', cursor: 'pointer', fontWeight: 500 }}
          >
            {article.journal.display_name}
          </div>
        ) : (
          <span className="text-muted text-xs">Chưa có thông tin journal</span>
        )}
      </td>

      {/* Publication Year */}
      <td className="text-center font-display" style={{ width: '80px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
        {article.publication_year}
      </td>

      {/* DOI */}
      <td style={{ maxWidth: '160px' }}>
        {article.doi ? (
          <div className="d-flex align-items-center gap-1.5">
            <span className="text-muted-custom text-xs text-truncate font-display" style={{ fontSize: '0.75rem' }}>
              {article.doi}
            </span>
            <Button 
              variant="link" 
              className="p-0 text-muted-custom hover:text-dark d-flex align-items-center"
              onClick={(e) => handleCopyDoi(e, article.doi)}
              title="Copy DOI"
            >
              <Icon icon="lucide:copy" width="12" />
            </Button>
          </div>
        ) : (
          <span className="text-muted text-xs">—</span>
        )}
      </td>

      {/* Topic Badge */}
      <td style={{ width: '130px' }}>
        <span 
          className="px-2 py-1 rounded text-xs font-weight-bold"
          style={{
            backgroundColor: topicStyle.bg,
            color: topicStyle.color,
            fontSize: '0.7rem'
          }}
        >
          {article.primary_topic || 'Chưa phân loại'}
        </span>
      </td>

      {/* Open Access */}
      <td className="text-center" style={{ width: '80px' }}>
        {article.is_open_access ? (
          <span 
            className="px-2 py-0.5 rounded text-xs font-weight-bold"
            style={{
              backgroundColor: 'rgba(16, 185, 129, 0.1)',
              color: '#059669',
              fontSize: '0.7rem'
            }}
          >
            OA
          </span>
        ) : (
          <span className="text-muted-custom text-xs">—</span>
        )}
      </td>

      {/* Actions */}
      <td className="text-end pe-3" style={{ width: '80px' }}>
        <span 
          className="text-primary hover:text-dark font-semibold text-xs d-flex align-items-center justify-content-end gap-0.5"
          style={{ transition: 'color 0.15s' }}
        >
          Chi tiết
          <Icon icon="lucide:arrow-right" width="12" />
        </span>
      </td>
    </tr>
  );
}
