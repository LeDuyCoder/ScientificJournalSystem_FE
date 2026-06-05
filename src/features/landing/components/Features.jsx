import { useTranslation } from 'react-i18next';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Icon from '../../../shared/components/Icon';

/**
 * Reusable Feature Card Component
 */
function FeatureCard({ icon, title, description }) {
  return (
    <Card 
      className="glass-card rounded-4 p-4 h-100 text-start border border-white-5 position-relative overflow-hidden"
      style={{
        backgroundColor: 'rgba(14, 19, 34, 0.65)',
        backdropFilter: 'blur(8px)',
        transition: 'all 0.3s ease'
      }}
    >
      {/* Icon Wrapper */}
      <div 
        className="d-flex align-items-center justify-content-center mb-4"
        style={{
          width: '48px',
          height: '48px',
          borderRadius: '12px',
          backgroundColor: 'rgba(0, 210, 255, 0.08)',
          border: '1px solid rgba(0, 210, 255, 0.2)',
          color: '#00d2ff',
          transition: 'all 0.3s ease'
        }}
      >
        <Icon icon={icon} className="fs-4 text-info" />
      </div>

      {/* Card Content */}
      <Card.Title 
        className="font-display text-white mb-2" 
        style={{ fontWeight: 700, fontSize: '1.1rem', letterSpacing: '0.01em' }}
      >
        {title}
      </Card.Title>
      <Card.Text 
        className="text-white-50 leading-relaxed mb-0" 
        style={{ fontSize: '0.85rem', lineHeight: 1.6 }}
      >
        {description}
      </Card.Text>
    </Card>
  );
}

export default function Features() {
  const { t } = useTranslation();

  const featureList = [
    {
      icon: 'lucide:search-code',
      titleKey: 'feature1Title',
      descKey: 'feature1Desc',
    },
    {
      icon: 'lucide:trending-up-down',
      titleKey: 'feature2Title',
      descKey: 'feature2Desc',
    },
    {
      icon: 'lucide:bell-ring',
      titleKey: 'feature3Title',
      descKey: 'feature3Desc',
    },
    {
      icon: 'lucide:folder-heart',
      titleKey: 'feature4Title',
      descKey: 'feature4Desc',
    },
    {
      icon: 'lucide:file-bar-chart',
      titleKey: 'feature5Title',
      descKey: 'feature5Desc',
    },
    {
      icon: 'lucide:gift',
      titleKey: 'feature6Title',
      descKey: 'feature6Desc',
    },
  ];

  return (
    <section id="features" className="py-5 relative" style={{ backgroundColor: '#090d16', overflow: 'hidden' }}>
      {/* Subtle glowing lights behind features */}
      <div 
        className="position-absolute pointer-events-none"
        style={{
          top: '20%',
          left: '10%',
          width: '300px',
          height: '300px',
          backgroundColor: 'rgba(0, 210, 255, 0.05)',
          borderRadius: '50%',
          filter: 'blur(100px)'
        }}
      />
      <div 
        className="position-absolute pointer-events-none"
        style={{
          bottom: '20%',
          right: '10%',
          width: '300px',
          height: '300px',
          backgroundColor: 'rgba(122, 0, 255, 0.05)',
          borderRadius: '50%',
          filter: 'blur(100px)'
        }}
      />

      <Container className="position-relative z-3 py-5">
        
        {/* Section Header */}
        <div className="text-center mb-5">
          <div className="d-inline-flex align-items-center gap-2 mb-2 text-info text-xs font-bold tracking-wider text-uppercase" style={{ fontSize: '0.75rem' }}>
            <span style={{ width: '24px', height: '1px', backgroundColor: 'rgba(0, 210, 255, 0.4)' }} />
            <span>{t('featuresSubtitle')}</span>
          </div>
          <h2 
            className="font-display text-white" 
            style={{ fontWeight: 800, fontSize: 'calc(1.5rem + 1.2vw)', letterSpacing: '-0.01em' }}
          >
            {t('featuresTitle')}
          </h2>
        </div>

        {/* Grid of Feature Cards */}
        <Row className="g-4">
          {featureList.map((feature, index) => (
            <Col xs={12} md={6} lg={4} key={index}>
              <FeatureCard
                icon={feature.icon}
                title={t(feature.titleKey)}
                description={t(feature.descKey)}
              />
            </Col>
          ))}
        </Row>

      </Container>
    </section>
  );
}
