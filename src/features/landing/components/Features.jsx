import { useTranslation } from 'react-i18next';
import Icon from '../../../shared/components/Icon';

/**
 * Reusable Feature Card Component
 */
function FeatureCard({ icon, color, title, description }) {
  return (
    <div className="col">
      <div className="glass-card rounded-3xl p-4 p-sm-5 d-flex flex-column align-items-start text-start position-relative group overflow-hidden h-100">
        {/* Decorative gradient light reflection */}
        <div 
          className="position-absolute w-100 h-100 bg-cyan-950/20 opacity-0 group-hover-opacity-100 pe-none" 
          style={{ top: 0, left: 0, background: 'linear-gradient(135deg, rgba(0, 210, 255, 0.08) 0%, rgba(122, 0, 255, 0) 100%)' }} 
        />
        
        {/* Icon Wrapper */}
        <div 
          className="rounded-3 bg-cyan-950/50 border-0 d-flex align-items-center justify-content-center mb-4 transition-all duration-300 group-hover-scale"
          style={{ width: '3rem', height: '3rem' }}
        >
          <Icon icon={icon} className={`${color} fs-4`} />
        </div>

        {/* Card Content */}
        <h3 
          className="fw-bold text-white fs-5 mb-3 group-hover-cyan transition-colors"
          style={{ fontFamily: 'var(--font-display)', letterSpacing: '0.02em' }}
        >
          {title}
        </h3>
        <p className="text-secondary fs-6 mb-0" style={{ color: '#adb5bd', lineHeight: 1.6 }}>
          {description}
        </p>
      </div>
    </div>
  );
}

export default function Features() {
  const { t } = useTranslation();

  const featureList = [
    {
      icon: 'lucide:search',
      color: 'text-cyan-400',
      titleKey: 'feature1Title',
      descKey: 'feature1Desc',
    },
    {
      icon: 'lucide:trending-up',
      color: 'text-blue-400',
      titleKey: 'feature2Title',
      descKey: 'feature2Desc',
    },
    {
      icon: 'lucide:bell',
      color: 'text-amber-400',
      titleKey: 'feature3Title',
      descKey: 'feature3Desc',
    },
    {
      icon: 'lucide:folder',
      color: 'text-emerald-400',
      titleKey: 'feature4Title',
      descKey: 'feature4Desc',
    },
    {
      icon: 'lucide:file-text',
      color: 'text-indigo-400',
      titleKey: 'feature5Title',
      descKey: 'feature5Desc',
    },
    {
      icon: 'lucide:gift',
      color: 'text-purple-400',
      titleKey: 'feature6Title',
      descKey: 'feature6Desc',
    },
  ];

  return (
    <section id="features" className="position-relative bg-dark-bg overflow-hidden" style={{ paddingTop: '6rem', paddingBottom: '6rem' }}>
      {/* Subtle glowing lights behind features */}
      <div 
        className="position-absolute rounded-circle pe-none" 
        style={{ top: '25%', left: '25%', width: '400px', height: '400px', backgroundColor: 'rgba(0, 210, 255, 0.05)', filter: 'blur(120px)' }} 
      />
      <div 
        className="position-absolute rounded-circle pe-none" 
        style={{ bottom: '25%', right: '25%', width: '400px', height: '400px', backgroundColor: 'rgba(122, 0, 255, 0.05)', filter: 'blur(120px)' }} 
      />

      <div className="position-relative mx-auto px-3 px-sm-4 px-lg-5" style={{ maxWidth: '72rem', zIndex: 10 }}>
        
        {/* Section Header */}
        <div className="text-center mb-5">
          <div className="text-cyan-400 text-xs fw-bold text-uppercase mb-3" style={{ letterSpacing: '0.15em' }}>
            — {t('featuresSubtitle')}
          </div>
          <h2 className="text-white fw-bold mb-3" style={{ fontFamily: 'var(--font-display)', fontSize: 'calc(1.5rem + 1.5vw)', letterSpacing: '-0.01em' }}>
            {t('featuresTitle')}
          </h2>
          <p className="text-secondary fs-6 mx-auto mb-0" style={{ color: '#adb5bd', maxWidth: '36rem' }}>
            {t('featuresDesc')}
          </p>
        </div>

        {/* 2x3 Grid of Feature Cards */}
        <div className="row row-cols-1 row-cols-md-2 g-4">
          {featureList.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              color={feature.color}
              title={t(feature.titleKey)}
              description={t(feature.descKey)}
            />
          ))}
        </div>

      </div>
    </section>
  );
}
