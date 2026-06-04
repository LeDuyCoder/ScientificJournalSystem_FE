import { useTranslation } from '../../../shared/hooks/useTranslation';

/**
 * Reusable StepItem component
 */
function StepItem({ number, title, description }) {
  return (
    <div className="flex flex-col items-center text-center px-4 relative z-10 group">
      {/* Circle Number Badge */}
      <div className="w-14 h-14 rounded-full bg-gradient-to-br from-cyan-400 to-indigo-600 flex items-center justify-center text-white font-display font-extrabold text-lg shadow-[0_0_20px_rgba(6,182,212,0.3)] group-hover:shadow-[0_0_25px_rgba(6,182,212,0.5)] group-hover:scale-110 transition-all duration-300 mb-6">
        {number}
      </div>

      {/* Step Content */}
      <h3 className="font-display font-bold text-white text-base sm:text-lg mb-3 tracking-wide group-hover:text-cyan-300 transition-colors duration-300">
        {title}
      </h3>
      <p className="font-sans text-gray-400 text-sm leading-relaxed max-w-xs">
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
    <section id="how-to-use" className="py-24 relative bg-dark-bg border-t border-white/5">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        
        {/* Section Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center space-x-2 text-cyan-400 text-xs font-bold tracking-widest uppercase mb-4">
            <span className="w-6 h-px bg-cyan-400/50" />
            <span>{t('howToUseSubtitle')}</span>
          </div>
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-white tracking-tight mb-4">
            {t('howToUseTitle')}
          </h2>
          <p className="font-sans text-gray-400 text-sm sm:text-base max-w-md mx-auto">
            {t('howToUseDesc')}
          </p>
        </div>

        {/* Steps container (Desktop: horizontal connecting line, Mobile: vertical stack) */}
        <div className="relative">
          {/* Horizontal dotted connector line (hidden on mobile, visible on lg screens) */}
          <div className="absolute top-7 left-[10%] right-[10%] h-0.5 border-t border-dashed border-white/10 hidden lg:block z-0" />
          
          {/* Steps layout grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-6 relative">
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
