import { useTranslation } from 'react-i18next';
import Icon from '../../../shared/components/Icon';

export default function Footer() {
  const { t } = useTranslation();

  const links = [
    { key: 'aboutUs', href: '#' },
    { key: 'api', href: '#' },
    { key: 'policy', href: '#' },
    { key: 'contact', href: '#' },
  ];

  return (
    <footer className="bg-dark-bg border-top border-white/5 py-5 position-relative z-10">
      <div className="mx-auto px-3 px-sm-4 px-lg-5" style={{ maxWidth: '80rem' }}>
        <div className="d-flex flex-column flex-md-row align-items-center justify-content-between gap-4">

          {/* Left Column: Logo & project info */}
          <div className="d-flex flex-column align-items-center align-items-md-start text-center text-md-start gap-2">
            <div className="d-flex align-items-center gap-2">
              <div 
                className="rounded-3 bg-brand-gradient d-flex align-items-center justify-content-center btn-primary-glow"
                style={{ width: '1.75rem', height: '1.75rem' }}
              >
                <Icon icon="lucide:activity" className="text-white fs-6" />
              </div>
              <span className="fw-bold text-white fs-6" style={{ fontFamily: 'var(--font-display)', letterSpacing: '-0.01em' }}>
                ResearchPulse
              </span>
            </div>
            <span className="text-secondary" style={{ fontSize: '0.75rem', color: '#6c757d', maxWidth: '24rem' }}>
              {t('footerCredit')}
            </span>
          </div>

          {/* Center Column: Links */}
          <nav className="d-flex flex-wrap justify-content-center gap-4">
            {links.map((link) => (
              <a
                key={link.key}
                href={link.href}
                className="text-decoration-none text-secondary hover-text-white transition-colors"
                style={{ fontSize: '0.75rem', fontWeight: 600 }}
              >
                {t(link.key)}
              </a>
            ))}
          </nav>

          {/* Right Column: Copyright */}
          <div className="text-secondary text-center text-md-end" style={{ fontSize: '0.75rem' }}>
            <span>&copy; {new Date().getFullYear()} ResearchPulse Team</span>
          </div>

        </div>
      </div>
    </footer>
  );
}
