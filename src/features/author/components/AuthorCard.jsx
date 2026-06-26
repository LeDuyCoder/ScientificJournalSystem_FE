/**
 * @file AuthorCard.jsx
 * @description Component thẻ hiển thị thông tin tóm tắt của một tác giả.
 */

import { useNavigate } from 'react-router-dom';
import { EntityCard } from '../../../shared/components/Card';
import AuthorAvatar from './AuthorAvatar';

export default function AuthorCard({ author }) {
  const navigate = useNavigate();

  if (!author) return null;

  const id = author.author_id ?? author.id;
  const name = author.display_name ?? author.full_name ?? author.name ?? 'Tác giả';
  const institution1 = author.institution_1 ?? author.affiliation ?? author.institution ?? '—';
  const institution2 = author.institution_2 ?? author.department ?? '';
  const hIndex = author.h_index ?? author.hindex ?? 0;
  const citations = author.citation_count ?? author.citations ?? 0;
  const articlesCount = author.article_count ?? author.papers ?? author.article_count ?? 0;
  const tags = Array.isArray(author.subject_areas)
    ? author.subject_areas
    : author.subject_area
      ? [author.subject_area]
      : [];
  const avatarUrl = author.url_image || author.avatar_url || '';
  const avatarColor = author.avatar_color ?? '#FF7A33';

  const formatLocalNumber = (num) => {
    if (num == null) return '0';
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };

  const handleCardClick = () => {
    if (id) navigate(`/authors/${id}`);
  };

  return (
    <EntityCard
      onClick={handleCardClick}
      className="h-100"
      media={<AuthorAvatar name={name} url={avatarUrl} size="md" bgColor={avatarColor} className="flex-shrink-0" />}
      title={name}
      subtitle={
        <>
          <div className="text-truncate">{institution1}</div>
          {institution2 && <div className="text-truncate mt-1" style={{ fontSize: '0.85em', opacity: 0.8 }}>{institution2}</div>}
        </>
      }
      meta={
        <div className="author-card-metrics mt-3">
          <div>
            <div className="author-metric-label">H-index</div>
            <div className="author-metric-value">{hIndex}</div>
          </div>
          <div>
            <div className="author-metric-label">Trích dẫn</div>
            <div className="author-metric-value">{formatLocalNumber(citations)}</div>
          </div>
          <div>
            <div className="author-metric-label">Bài báo</div>
            <div className="author-metric-value">{formatLocalNumber(articlesCount)}</div>
          </div>
        </div>
      }
      footer={
        <div className="d-flex flex-wrap gap-1.5 pt-2 border-top">
          {tags.length === 0 ? (
            <span className="author-tag-empty">Chưa cập nhật lĩnh vực</span>
          ) : (
            tags.map((tag, idx) => (
              <span
                key={idx}
                className="author-tag"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/catalog?search=${encodeURIComponent(tag)}`);
                }}
              >
                {tag}
              </span>
            ))
          )}
        </div>
      }
    />
  );
}
