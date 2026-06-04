import { useTranslation } from '../../../shared/hooks/useTranslation';
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
    <footer className="bg-dark-bg border-t border-white/5 py-12 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">

          {/* Left Column: Logo & project info */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left space-y-3">
            <div className="flex items-center space-x-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-cyan-400 to-indigo-600 flex items-center justify-center shadow-[0_0_10px_rgba(6,182,212,0.2)]">
                <Icon icon="lucide:activity" className="text-white text-sm" />
              </div>
              <span className="font-display font-bold text-white text-base tracking-tight">
                ResearchPulse
              </span>
            </div>
            <span className="font-sans text-xs text-gray-500 max-w-sm">
              {t('footerCredit')}
            </span>
          </div>

          {/* Center Column: Links */}
          <nav className="flex flex-wrap justify-center gap-x-8 gap-y-3">
            {links.map((link) => (
              <a
                key={link.key}
                href={link.href}
                className="font-sans text-xs font-semibold text-gray-400 hover:text-white transition-colors duration-200"
              >
                {t(link.key)}
              </a>
            ))}
          </nav>

          {/* Right Column: Copyright */}
          <div className="font-sans text-xs text-gray-500 text-center md:text-right">
            <span>&copy; {new Date().getFullYear()} ResearchPulse Team</span>
          </div>

        </div>
      </div>
    </footer>
  );
}
