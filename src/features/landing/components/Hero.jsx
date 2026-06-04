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
    <section className="relative min-h-screen flex flex-col justify-between pt-32 pb-16 overflow-hidden grid-bg">
      {/* Radial overlay to fade out the grid pattern */}
      <div className="absolute inset-0 radial-fade pointer-events-none" />

      {/* Hero content container */}
      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex-grow flex flex-col justify-center items-center z-10">
        
        {/* Animated OpenAlex Badge */}
        <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-cyan-950/40 border border-cyan-800/30 text-cyan-400 text-xs font-semibold tracking-wide mb-8 animate-fade-in">
          <Icon icon="lucide:sparkles" className="text-yellow-400 animate-pulse" />
          <span>{t('badgeText')}</span>
        </div>

        {/* Main Heading */}
        <h1 className="font-display font-extrabold text-4xl sm:text-6xl md:text-7xl text-white tracking-tight leading-tight max-w-4xl mb-6">
          {t('headingPrefix')}
          <span className="inline-block whitespace-nowrap bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-400 bg-clip-text text-transparent glow-text-cyan">
            {t('headingHighlight')}
          </span>
        </h1>

        {/* Sub Heading */}
        <p className="font-sans text-gray-400 text-base sm:text-lg md:text-xl max-w-2xl mb-10 leading-relaxed">
          {t('subheading')}
        </p>

        {/* Action CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20 w-full sm:w-auto">
          {/* Start Searching Button */}
          <a
            href="#search-sandbox"
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-2.5 px-8 py-4 rounded-full bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-bold text-sm tracking-wide transition-all duration-300 btn-primary-glow transform hover:-translate-y-0.5 cursor-pointer"
          >
            <Icon icon="lucide:rocket" className="text-lg" />
            <span>{t('ctaSearch')}</span>
          </a>

          {/* View Trends Button */}
          <a
            href="#features"
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-2.5 px-8 py-4 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 text-white font-semibold text-sm tracking-wide transition-all duration-300 transform hover:-translate-y-0.5 cursor-pointer"
          >
            <Icon icon="lucide:bar-chart-2" className="text-lg text-cyan-400" />
            <span>{t('ctaTrends')}</span>
          </a>
        </div>
      </div>

      {/* Stats Counter Row Container */}
      <div className="relative w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-0 border-t border-white/6 pt-10 pb-6 text-center">
          {stats.map((stat, idx) => (
            <div 
              key={idx} 
              className={`flex flex-col items-center justify-center px-4 ${
                idx > 0 ? 'md:border-l md:border-white/8' : ''
              }`}
            >
              {/* Stat Value */}
              <span className={`font-display font-extrabold text-2xl sm:text-3xl lg:text-4xl tracking-tight mb-2 ${stat.color}`}>
                {t(stat.valueKey)}
              </span>
              {/* Stat Label */}
              <span className="font-sans text-[10px] sm:text-xs text-gray-500 font-bold tracking-widest uppercase">
                {t(stat.labelKey)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
