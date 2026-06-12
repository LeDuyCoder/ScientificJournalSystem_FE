/**
 * File source thuộc hệ thống FE ResearchPulse.
 *
 * File: features\journal\components\ArticlesTabContent.jsx
 */
import { Card, Button } from 'react-bootstrap';
import { Icon } from '@iconify/react';
import LoadingSkeleton from '../../../shared/components/LoadingSkeleton';

export default function ArticlesTabContent({ recentArticles = [], loading, onArticleClick }) {
  if (loading) {
    return (
      <div className="d-flex flex-column gap-3">
        {[1, 2].map(i => (
          <section key={i} className="journal-surface p-4">
            <LoadingSkeleton width="120px" height="18px" className="mb-2" />
            <LoadingSkeleton width="80%" height="28px" className="mb-3" />
            <LoadingSkeleton width="200px" height="16px" className="mb-3" />
            <LoadingSkeleton width="100%" height="60px" />
          </section>
        ))}
      </div>
    );
  }

  if (!recentArticles || recentArticles.length === 0) {
    return (
      <section className="journal-surface journal-empty-state">
        Journal này chưa có bài báo gần đây.
      </section>
    );
  }

  return (
    <div className="d-flex flex-column gap-3 text-start">
      {recentArticles.map((article) => {
        const articleId = article.article_id || article.id;

        return (
          <Card key={articleId} className="journal-article-card">
            <div className="d-flex align-items-center gap-3 mb-2 flex-wrap">
              <span className="journal-badge journal-badge--accent">
                {article.publication_year || 'N/A'}
              </span>
              {article.doi && (
                <span className="text-muted-custom d-flex align-items-center gap-1 small">
                  <Icon icon="lucide:link-2" width="14" />
                  DOI: {article.doi}
                </span>
              )}
            </div>

            <h3 className="journal-article-title" onClick={() => onArticleClick && onArticleClick(articleId)}>
              {article.title}
            </h3>

            {article.authors && (
              <div className="text-muted-custom mb-3 d-flex align-items-center gap-2 small">
                <Icon icon="lucide:users" width="16" style={{ color: 'var(--text-muted)' }} />
                <span>{article.authors}</span>
              </div>
            )}

            {article.abstract && (
              <p className="journal-article-abstract">
                {article.abstract}
              </p>
            )}

            <div className="mt-auto d-flex justify-content-end">
              <Button onClick={() => onArticleClick && onArticleClick(articleId)} className="journal-text-btn px-3 py-1">
                Xem chi tiết
                <Icon icon="lucide:arrow-right" width="14" />
              </Button>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
