import { useTranslation } from 'react-i18next';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

/**
 * Reusable StepItem component
 */
function StepItem({ number, title, description }) {
  return (
    <div className="d-flex flex-column align-items-center text-center px-3 position-relative z-3 group">
      {/* Circle Number Badge */}
      <div 
        className="d-flex align-items-center justify-content-center text-white font-display mb-4"
        style={{
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #00d2ff 0%, #7a00ff 100%)',
          fontWeight: 800,
          fontSize: '1.25rem',
          boxShadow: '0 0 20px rgba(0, 210, 255, 0.4)'
        }}
      >
        {number}
      </div>

      {/* Step Content */}
      <h3 
        className="font-display text-white mb-2" 
        style={{ fontWeight: 700, fontSize: '1.05rem', letterSpacing: '0.02em' }}
      >
        {title}
      </h3>
      <p 
        className="text-white-50 leading-relaxed mx-auto" 
        style={{ fontSize: '0.85rem', maxWidth: '240px', lineHeight: 1.6 }}
      >
        {description}
      </p>
    </div>
  );
}

export default function HowToUse() {
  const { t } = useTranslation();

  const steps = [
    { number: 1, titleKey: 'step1Title', descKey: 'step1Desc' },
    { number: 2, titleKey: 'step2Title', descKey: 'step2Desc' },
    { number: 3, titleKey: 'step3Title', descKey: 'step3Desc' },
    { number: 4, titleKey: 'step4Title', descKey: 'step4Desc' },
  ];

  return (
    <section id="how-to-use" className="py-5 bg-dark-bg border-top border-white-5">
      <Container className="py-5 position-relative">
        
        {/* Section Header */}
        <div className="text-center mb-5">
          <div className="d-inline-flex align-items-center gap-2 mb-2 text-info text-xs font-bold tracking-wider text-uppercase" style={{ fontSize: '0.75rem' }}>
            <span style={{ width: '24px', height: '1px', backgroundColor: 'rgba(0, 210, 255, 0.4)' }} />
            <span>{t('howToUseSubtitle')}</span>
          </div>
          <h2 
            className="font-display text-white mb-3" 
            style={{ fontWeight: 800, fontSize: 'calc(1.5rem + 1.2vw)', letterSpacing: '-0.01em' }}
          >
            {t('howToUseTitle')}
          </h2>
          <p 
            className="text-white-50 mx-auto" 
            style={{ fontSize: '0.9rem', maxWidth: '420px', lineHeight: 1.5 }}
          >
            {t('howToUseDesc')}
          </p>
        </div>

        {/* Steps container */}
        <div className="position-relative">
          {/* Horizontal dotted connector line (hidden on mobile, visible on desktop) */}
          <div 
            className="position-absolute d-none d-lg-block w-75 pointer-events-none"
            style={{
              top: '28px',
              left: '12.5%',
              height: '1px',
              borderTop: '2px dashed rgba(255, 255, 255, 0.08)',
              zIndex: 1
            }}
          />
          
          {/* Steps layout grid */}
          <Row className="gy-5 gy-lg-0 justify-content-center">
            {steps.map((step) => (
              <Col xs={12} sm={6} lg={3} key={step.number}>
                <StepItem
                  number={step.number}
                  title={t(step.titleKey)}
                  description={t(step.descKey)}
                />
              </Col>
            ))}
          </Row>
        </div>

      </Container>
    </section>
  );
}
