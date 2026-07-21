import { useTranslation } from "react-i18next";
/**
 * File source thuộc hệ thống FE ResearchPulse.
 *
 * File: features\article\components\ArticleStatsCards.jsx
 */
import { Row, Col, Card } from 'react-bootstrap';
import { Icon } from '@iconify/react';
export default function ArticleStatsCards({
  stats,
  isLoading
}) {
  const {
    t
  } = useTranslation();
  const formatNumber = num => {
    return new Intl.NumberFormat().format(num);
  };
  const statItems = [{
    label: t("article.tongBaiBao"),
    value: stats?.totalArticles || 0,
    icon: 'lucide:file-text'
  }, {
    label: 'Open Access',
    value: stats?.openAccessCount || 0,
    icon: 'lucide:unlock'
  }, {
    label: t("article.tongTacGia"),
    value: stats?.authorsCount || 0,
    icon: 'lucide:users'
  }, {
    label: t("typeArea"),
    value: stats?.topicsCount || 0,
    icon: 'lucide:layers'
  }];
  if (isLoading) {
    return <Row className="g-3 mb-4">
        {[1, 2, 3, 4].map(i => <Col key={i} xs={12} sm={6} md={3}>
            <Card className="article-stats-card" style={{
          height: '100px'
        }}>
              <div className="skeleton-shimmer position-absolute w-100 h-100" />
              <Card.Body className="d-flex align-items-center justify-content-between">
                <div>
                  <div className="skeleton-shimmer rounded mb-2" style={{
                width: '80px',
                height: '14px'
              }} />
                  <div className="skeleton-shimmer rounded" style={{
                width: '120px',
                height: '24px'
              }} />
                </div>
                <div className="skeleton-shimmer rounded-circle" style={{
              width: '40px',
              height: '40px'
            }} />
              </Card.Body>
            </Card>
          </Col>)}
      </Row>;
  }
  return <Row className="g-3 mb-4">
      {statItems.map((item, index) => <Col key={index} xs={12} sm={6} md={3}>
          <Card className="article-stats-card">
            <Card.Body className="d-flex align-items-center justify-content-between p-3">
              <div>
                <div className="text-muted-custom font-weight-bold mb-1" style={{
              fontSize: '0.75rem',
              letterSpacing: '0.05em',
              textTransform: 'uppercase'
            }}>
                  {item.label}
                </div>
                <h3 className="text-main mb-0 font-display font-weight-bold" style={{
              fontSize: '1.75rem'
            }}>
                  {formatNumber(item.value)}
                </h3>
              </div>
              <div className="article-stats-icon">
                <Icon icon={item.icon} width="22" height="22" />
              </div>
            </Card.Body>
          </Card>
        </Col>)}
    </Row>;
}