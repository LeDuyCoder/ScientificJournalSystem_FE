import { useTranslation } from "react-i18next";
/**
 * File source thuộc hệ thống FE ResearchPulse.
 *
 * File: features\dashboard\components\DashboardStatCards.jsx
 */
import { Row, Col } from 'react-bootstrap';
import StatCard from './StatCard';

/**
 * DashboardStatCards — renders 4 stat cards in a responsive grid.
 * Desktop: 4 columns | Tablet: 2×2 | Mobile: 1 column
 */
export default function DashboardStatCards({
  stats,
  loading
}) {
  const {
    t
  } = useTranslation();
  const cards = [{
    icon: 'lucide:folder-open',
    accentColor: 'var(--text-main)',
    value: stats?.projectCount,
    label: t("dashboard.projectsDangTheoDoi"),
    growth: null,
    growthLabel: ''
  }, {
    icon: 'lucide:hash',
    accentColor: 'var(--text-main)',
    value: stats?.keywordCount,
    label: t("dashboard.keywordsDangWatch"),
    growth: null,
    growthLabel: ''
  }, {
    icon: 'lucide:file-text',
    accentColor: 'var(--text-main)',
    value: stats?.articleCount,
    label: t("dashboard.baiBaoTrongProjects"),
    growth: null,
    growthLabel: ''
  }, {
    icon: 'lucide:book-open',
    accentColor: 'var(--text-main)',
    value: stats?.journalCount,
    label: t("dashboard.journalsTheoDoi"),
    growth: null,
    growthLabel: ''
  }];
  return <Row className="g-3 mb-4">
      {cards.map((card, idx) => <Col xs={6} lg={3} key={idx}>
          <StatCard {...card} loading={loading} />
        </Col>)}
    </Row>;
}