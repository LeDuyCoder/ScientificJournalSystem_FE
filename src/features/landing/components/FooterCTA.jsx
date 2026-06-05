import { useTranslation } from 'react-i18next';

export default function FooterCTA() {
  const { t } = useTranslation();

  return (
    <section id="footer-cta" className="position-relative bg-dark-bg overflow-hidden text-center border-top border-white/5" style={{ paddingTop: '7rem', paddingBottom: '7rem' }}>
      {/* Background Spotlight glow effect */}
      <div 
        className="position-absolute rounded-circle pe-none" 
        style={{ bottom: '-12rem', left: '50%', transform: 'translateX(-50%)', width: '600px', height: '350px', background: 'radial-gradient(ellipse at center, rgba(0, 210, 255, 0.15) 0%, rgba(122, 0, 255, 0) 70%)', filter: 'blur(100px)' }} 
      />
      
      <div className="position-relative mx-auto px-3 px-sm-4 px-lg-5" style={{ maxWidth: '56rem', zIndex: 10 }}>
        
        {/* Main Heading */}
        <h2 className="text-white fw-bold mb-3" style={{ fontFamily: 'var(--font-display)', fontSize: 'calc(1.625rem + 2vw)', letterSpacing: '-0.01em' }}>
          {t('ctaHeading')}
        </h2>
        
        {/* Sub Heading */}
        <p className="text-secondary fs-5 mx-auto mb-5 lh-lg" style={{ color: '#adb5bd', maxWidth: '42rem' }}>
          {t('ctaSubheading')}
        </p>

        {/* Buttons */}
        <div className="d-flex flex-column flex-sm-row align-items-center justify-content-center gap-3 w-100 w-sm-auto">
          {/* Try Searching Now Button */}
          <a
            href="#search-sandbox"
            className="w-100 w-sm-auto btn rounded-pill bg-white/5 border border-white/10 text-white fw-semibold px-4 py-3 d-inline-flex align-items-center justify-content-center gap-2 cursor-pointer btn-hover-transform text-decoration-none hover-bg-white-10"
          >
            <span>🔍</span>
            <span>{t('ctaTryNowBtn')}</span>
          </a>

          {/* Create Free Account Button */}
          <button
            className="w-100 w-sm-auto btn rounded-pill bg-brand-gradient text-white fw-bold px-4 py-3 border-0 btn-primary-glow d-inline-flex align-items-center justify-content-center gap-2 cursor-pointer btn-hover-transform"
          >
            <span>👤</span>
            <span>{t('ctaCreateAccountBtn')}</span>
          </button>
        </div>

      </div>
    </section>
  );
}
