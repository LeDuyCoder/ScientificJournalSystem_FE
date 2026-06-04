import { useTranslation } from 'react-i18next';
import Icon from '../../../shared/components/Icon';

export default function FooterCTA() {
  const { t } = useTranslation();

  return (
    <section id="footer-cta" className="py-28 bg-[#090d16] relative overflow-hidden text-center border-t border-white/5">
      {/* Background Spotlight glow effect */}
      <div className="absolute -bottom-48 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-gradient-to-t from-cyan-500/15 to-indigo-500/0 rounded-full blur-[100px] pointer-events-none" />
      
      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
        
        {/* Main Heading */}
        <h2 className="font-display font-extrabold text-3xl sm:text-5xl text-white tracking-tight leading-tight mb-4">
          {t('ctaHeading')}
        </h2>
        
        {/* Sub Heading */}
        <p className="font-sans text-gray-400 text-sm sm:text-base md:text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
          {t('ctaSubheading')}
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
          {/* Try Searching Now Button */}
          <a
            href="#search-sandbox"
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-2.5 px-8 py-4 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 text-white font-semibold text-sm tracking-wide transition-all duration-300 transform hover:-translate-y-0.5 cursor-pointer"
          >
            <Icon icon="lucide:search" className="text-cyan-400 text-lg" />
            <span>{t('ctaTryNowBtn')}</span>
          </a>

          {/* Create Free Account Button */}
          <button
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-2.5 px-8 py-4 rounded-full bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-bold text-sm tracking-wide transition-all duration-300 btn-primary-glow transform hover:-translate-y-0.5 cursor-pointer"
          >
            <Icon icon="lucide:user-plus" className="text-lg" />
            <span>{t('ctaCreateAccountBtn')}</span>
          </button>
        </div>

      </div>
    </section>
  );
}
