import { LanguageProvider } from '../../shared/hooks/useTranslation';
import Header from './components/Header';
import Hero from './components/Hero';
import Sandbox from './components/Sandbox';
import Features from './components/Features';
import HowToUse from './components/HowToUse';
import FooterCTA from './components/FooterCTA';
import Footer from './components/Footer';

export default function LandingPage() {
  return (
    <LanguageProvider>
      <div className="bg-dark-bg min-h-screen text-white font-sans antialiased overflow-x-hidden selection:bg-cyan-500/30 selection:text-white">

        {/* Sticky Header */}
        <Header />

        {/* Main Content Area */}
        <main>
          {/* Hero Section */}
          <Hero />

          {/* Try Now Sandbox Section */}
          <Sandbox />

          {/* Why use ResearchPulse Section */}
          <Features />

          {/* How to use Section */}
          <HowToUse />

          {/* Bottom Call to Action Section */}
          <FooterCTA />
        </main>

        {/* Footer */}
        <Footer />

      </div>
    </LanguageProvider>
  );
}
