import { useTranslation } from 'react-i18next';
import Icon from '../../../shared/components/Icon';

/**
 * Reusable Feature Card Component
 */
function FeatureCard({ icon, title, description }) {
  return (
    <div className="glass-card rounded-3xl p-8 flex flex-col items-start text-left relative group overflow-hidden">
      {/* Decorative gradient light reflection */}
      <div className="absolute -inset-px bg-gradient-to-br from-cyan-500/10 to-indigo-500/0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      
      {/* Icon Wrapper */}
      <div className="w-12 h-12 rounded-2xl bg-cyan-950/50 border border-cyan-800/30 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:border-cyan-400/50 group-hover:bg-cyan-950/70 transition-all duration-300">
        <Icon icon={icon} className="text-cyan-400 text-xl" />
      </div>

      {/* Card Content */}
      <h3 className="font-display font-bold text-white text-lg sm:text-xl mb-3 tracking-wide group-hover:text-cyan-300 transition-colors duration-300">
        {title}
      </h3>
      <p className="font-sans text-gray-400 text-sm leading-relaxed">
        {description}
      </p>
    </div>
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
    <section id="features" className="py-24 relative bg-[#090d16] overflow-hidden">
      {/* Subtle glowing lights behind features */}
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-cyan-950/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-indigo-950/25 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 text-cyan-400 text-xs font-bold tracking-widest uppercase mb-4">
            <span className="w-6 h-px bg-cyan-400/50" />
            <span>{t('featuresSubtitle')}</span>
          </div>
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-white tracking-tight leading-tight">
            {t('featuresTitle')}
          </h2>
        </div>

        {/* 2x3 Grid of Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {featureList.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={t(feature.titleKey)}
              description={t(feature.descKey)}
            />
          ))}
        </div>

      </div>
    </section>
  );
}
