import { useTranslation } from 'react-i18next';
import Icon from '../../../shared/components/Icon';

export default function Hero() {
  const { t } = useTranslation();

  const stats = [
    { valueKey: 'papersValue', labelKey: 'papersLabel', color: 'text-cyan-400' },
    { valueKey: 'periodValue', labelKey: 'periodLabel', color: 'text-white' },
    { valueKey: 'keywordsValue', labelKey: 'keywordsLabel', color: 'text-cyan-400 font-sans' },
    { valueKey: 'freeValue', labelKey: 'freeLabel', color: 'text-green-400' },
  ];

  return (
    <section 
      className="position-relative min-vh-100 d-flex flex-column justify-between overflow-hidden grid-bg"
      style={{ paddingTop: '8rem', paddingBottom: '4rem' }}
    >
      {/* Radial overlay to fade out the grid pattern */}
      <div className="position-absolute w-100 h-100 radial-fade pe-none" style={{ top: 0, left: 0 }} />

      {/* Hero content container */}
      <div 
        className="position-relative mx-auto px-3 px-sm-4 px-lg-5 text-center flex-grow-1 d-flex flex-column align-items-center justify-content-center"
        style={{ maxWidth: '64rem', zIndex: 10 }}
      >
        
        {/* Animated OpenAlex Badge */}
        <div 
          className="d-inline-flex align-items-center gap-2 px-3 py-2 rounded-pill bg-white/5 border border-white/10 text-cyan-400 text-xs fw-semibold mb-4 animate-fade-in"
          style={{ letterSpacing: '0.05em' }}
        >
          <Icon icon="lucide:sparkles" className="text-warning animate-pulse" />
          <span>{t('badgeText')}</span>
        </div>

        {/* Main Heading */}
        <h1 
          className="text-white hero-title mx-auto mb-4"
          style={{ maxWidth: '56rem' }}
        >
          {t('headingPrefix')}{' '}
          <span className="d-inline-block text-nowrap text-gradient-cyan-indigo glow-text-cyan">
            {t('headingHighlight')}
          </span>
        </h1>

        {/* Sub Heading */}
        <p 
          className="text-secondary fs-5 mx-auto mb-5 lh-lg"
          style={{ maxWidth: '42rem', color: '#adb5bd' }}
        >
          {t('subheading')}
        </p>

        {/* Action CTA Buttons */}
        <div className="d-flex flex-column flex-sm-row align-items-center justify-content-center gap-3 mb-5 w-100 w-sm-auto">
          {/* Start Searching Button */}
          <a
            href="#search-sandbox"
            className="w-100 w-sm-auto btn rounded-pill bg-brand-gradient text-white fw-bold px-4 py-3 border-0 btn-primary-glow d-inline-flex align-items-center justify-content-center gap-2 cursor-pointer btn-hover-transform text-decoration-none"
          >
            <span>🚀</span>
            <span>{t('ctaSearch')}</span>
          </a>

          {/* View Trends Button */}
          <a
            href="#features"
            className="w-100 w-sm-auto btn rounded-pill bg-white/5 border border-white/10 text-white fw-semibold px-4 py-3 d-inline-flex align-items-center justify-content-center gap-2 cursor-pointer btn-hover-transform text-decoration-none hover-bg-white-10"
          >
            <span>📊</span>
            <span>{t('ctaTrends')}</span>
          </a>
        </div>
      </div>

      {/* Stats Counter Row Container */}
      <div className="position-relative w-100 mx-auto px-3 px-sm-4 px-lg-5" style={{ maxWidth: '72rem', zIndex: 10 }}>
        <div className="row row-cols-2 row-cols-md-4 g-4 g-md-0 border-top border-white/8 pt-5 pb-3 text-center">
          {stats.map((stat, idx) => (
            <div 
              key={idx} 
              className={`col d-flex flex-column align-items-center justify-content-center px-3 ${
                idx > 0 ? 'border-start-md' : ''
              }`}
            >
              {/* Stat Value */}
              <span 
                className={`fs-3 fs-md-2 mb-2 ${stat.color}`}
                style={{ fontFamily: 'var(--font-display)', fontWeight: 800 }}
              >
                {t(stat.valueKey)}
              </span>
              {/* Stat Label */}
              <span 
                className="text-secondary fw-bold text-uppercase"
                style={{ fontSize: '10px', letterSpacing: '0.15em' }}
              >
                {t(stat.labelKey)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
