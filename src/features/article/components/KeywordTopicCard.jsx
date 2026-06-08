/**
 * File source thuộc hệ thống FE ResearchPulse.
 *
 * File: features\article\components\KeywordTopicCard.jsx
 */
import { Card, Badge } from 'react-bootstrap';
import { Icon } from '@iconify/react';
import { useNavigate } from 'react-router-dom';
import { normalizeKeywords } from '../utils/articleFormatters';

export default function KeywordTopicCard({ primaryTopic, keywords, topics = [] }) {
  const navigate = useNavigate();
  const keywordList = normalizeKeywords(keywords);

  const topicList = Array.isArray(topics)
    ? topics.filter((topic) => topic?.display_name)
    : [];

  const fallbackTopic = primaryTopic
    ? [{ topic_id: null, display_name: primaryTopic, is_primary: true }]
    : [];

  const displayTopics = topicList.length > 0 ? topicList : fallbackTopic;

  /**
   * Điều hướng khi bấm vào keyword trong trang chi tiết bài báo.
   *
   * - Nếu BE trả `keyword_id`, đi thẳng tới danh sách bài báo theo keyword.
   * - Nếu chỉ có text keyword, dùng trang keyword list và truyền query search.
   */
  const handleKeywordClick = (keyword) => {
    if (keyword.keyword_id) {
      navigate(`/keywords/${keyword.keyword_id}/articles`);
    } else {
      navigate(`/keywords?keyword=${encodeURIComponent(keyword.display_name)}`);
    }
  };

  /**
   * Topic hiện chưa có route public đầy đủ như keyword.
   * Nếu có `topic_id` thì đi theo route topic; nếu không thì fallback về catalog search.
   */
  const handleTopicClick = (topic) => {
    if (topic.topic_id) {
      navigate(`/topics/${topic.topic_id}/articles`);
      return;
    }
    navigate(`/catalog?search=${encodeURIComponent(topic.display_name)}`);
  };

  const hasContent = displayTopics.length > 0 || keywordList.length > 0;

  return (
    <Card
      className="journal-dark-card border-0 p-4 mb-4"
      style={{
        backgroundColor: 'var(--bg-card)',
        border: '1px solid var(--border)',
        borderRadius: '16px',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.02)',
      }}
    >
      <h5 className="font-display font-weight-bold text-main mb-3 d-flex align-items-center gap-2">
        <Icon icon="lucide:tags" style={{ color: 'var(--primary)' }} width="20" />
        Từ khóa & Chủ đề (Keywords & Topics)
      </h5>

      {!hasContent ? (
        <span className="text-muted-custom text-sm">Chưa có thông tin từ khóa hoặc chủ đề.</span>
      ) : (
        <div className="d-flex flex-wrap gap-2">
          {displayTopics.map((topic) => (
            <Badge
              key={`topic-${topic.topic_id || topic.display_name}`}
              onClick={() => handleTopicClick(topic)}
              className="py-2 px-3 text-xs font-semibold d-inline-flex align-items-center gap-1"
              style={{
                cursor: 'pointer',
                borderRadius: '8px',
                backgroundColor: topic.is_primary ? 'var(--primary-light)' : 'var(--bg-chip)',
                color: topic.is_primary ? 'var(--primary)' : 'var(--text-main)',
                border: topic.is_primary
                  ? '1px solid rgba(255, 122, 51, 0.3)'
                  : '1px solid var(--border)',
                transition: 'all 0.2s',
              }}
            >
              {topic.is_primary && <Icon icon="lucide:star" width="12" />}
              {topic.display_name}
            </Badge>
          ))}

          {keywordList.map((keyword) => (
            <Badge
              key={`keyword-${keyword.keyword_id || keyword.display_name}`}
              onClick={() => handleKeywordClick(keyword)}
              className="py-2 px-3 text-xs font-semibold"
              style={{
                cursor: 'pointer',
                borderRadius: '8px',
                backgroundColor: 'var(--bg-chip)',
                color: 'var(--text-main)',
                border: '1px solid var(--border)',
                transition: 'all 0.2s',
              }}
            >
              {keyword.display_name}
            </Badge>
          ))}
        </div>
      )}
    </Card>
  );
}
