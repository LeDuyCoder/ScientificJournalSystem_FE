import { useTranslation } from 'react-i18next';

/**
 * Reusable StepItem component
 */
function StepItem({ number, title, description }) {
  return (
    <div className="col d-flex flex-column align-items-center text-center px-3 position-relative z-1 group">
      {/* Circle Number Badge */}
      <div
        className="rounded-circle bg-brand-gradient d-flex align-items-center justify-content-center text-white fw-bold btn-primary-glow group-hover-scale mb-4"
        style={{ width: '3.5rem', height: '3.5rem', fontFamily: 'var(--font-display)', fontSize: '1.25rem', transition: 'all 0.3s ease' }}
      >
        {number}
      </div>

      {/* Step Content */}
      <h3
        className="fw-bold text-white fs-6 mb-2 group-hover-cyan transition-colors"
        style={{ fontFamily: 'var(--font-display)', letterSpacing: '0.02em' }}
      >
        {title}
      </h3>
      <p className="text-secondary fs-6 mb-0" style={{ color: '#adb5bd', lineHeight: 1.5, maxWidth: '18rem' }}>
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
    <section id="how-to-use" className="position-relative bg-dark-bg border-top border-white/5" style={{ paddingTop: '6rem', paddingBottom: '6rem' }}>
      <div className="position-relative mx-auto px-3 px-sm-4 px-lg-5" style={{ maxWidth: '72rem' }}>

        {/* Section Header */}
        <div className="text-center mb-5">
          <div className="d-inline-flex align-items-center gap-2 text-cyan-400 text-xs fw-bold text-uppercase mb-3" style={{ letterSpacing: '0.15em' }}>
            <span style={{ width: '1.5rem', height: '1px', backgroundColor: 'rgba(0, 210, 255, 0.3)' }} />
            <span>{t('howToUseSubtitle')}</span>
          </div>
          <h2 className="text-white fw-bold mb-3" style={{ fontFamily: 'var(--font-display)', fontSize: 'calc(1.5rem + 1.5vw)', letterSpacing: '-0.01em' }}>
            {t('howToUseTitle')}
          </h2>
          <p className="text-secondary fs-6 mx-auto mb-0" style={{ color: '#adb5bd', maxWidth: '28rem' }}>
            {t('howToUseDesc')}
          </p>
        </div>

        {/* Steps container (Desktop: horizontal connecting line, Mobile: vertical stack) */}
        <div className="position-relative">
          {/* Horizontal dotted connector line (hidden on mobile, visible on lg screens) */}
          <div
            className="position-absolute start-0 end-0 border-top border-dashed border-white/10 d-none d-lg-block"
            style={{ top: '1.75rem', zIndex: 0, left: '10%', right: '10%' }}
          />

          {/* Steps layout grid */}
          <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-4 g-5 g-lg-4 position-relative z-1">
            {steps.map((step) => (
              <StepItem
                key={step.number}
                number={step.number}
                title={t(step.titleKey)}
                description={t(step.descKey)}
              />
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
