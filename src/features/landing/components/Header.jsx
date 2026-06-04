import { useState, useEffect, useRef } from 'react';
import { useTranslation } from '../../../shared/hooks/useTranslation';
import Icon from '../../../shared/components/Icon';

export default function Header() {
  const { language, setLanguage, t } = useTranslation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);
  const langDropdownRef = useRef(null);

  // Monitor scroll for sticky styles
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (langDropdownRef.current && !langDropdownRef.current.contains(event.target)) {
        setIsLangDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navLinks = [
    { key: 'search', icon: 'lucide:search', href: '#search-sandbox' },
    { key: 'trends', icon: 'lucide:trending-up', href: '#features' },
    { key: 'geography', icon: 'lucide:map', href: '#how-to-use' },
    { key: 'authors', icon: 'lucide:users', href: '#footer-cta' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-dark-bg/85 backdrop-blur-md border-b border-white/6 shadow-xl py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-12">
          {/* Logo Brand */}
          <div className="flex items-center space-x-3 cursor-pointer group">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-cyan-400 to-indigo-600 flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.3)] group-hover:scale-105 transition-transform duration-300">
              <Icon icon="lucide:activity" className="text-white text-xl" />
            </div>
            <span className="font-display font-bold text-xl tracking-tight text-white group-hover:text-cyan-400 transition-colors duration-300">
              ResearchPulse
            </span>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <a
                key={link.key}
                href={link.href}
                className="font-sans font-medium text-sm text-gray-300 hover:text-white transition-colors duration-200 relative group py-2"
              >
                {t(link.key)}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-400 to-indigo-500 transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
          </nav>

          {/* Right Action buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Language Selector Dropdown */}
            <div className="relative" ref={langDropdownRef}>
              <button
                onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
                className="flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 text-gray-300 hover:text-white text-xs font-semibold tracking-wide transition-all duration-200"
              >
                <Icon icon="lucide:globe" className="text-sm text-cyan-400" />
                <span>{language === 'vi' ? 'Tiếng Việt' : 'English'}</span>
                <Icon
                  icon="lucide:chevron-down"
                  className={`text-[10px] transition-transform duration-200 ${
                    isLangDropdownOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {/* Dropdown Menu */}
              {isLangDropdownOpen && (
                <div className="absolute right-0 mt-2 w-36 rounded-xl bg-dark-card border border-white/10 shadow-2xl py-1 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  <button
                    onClick={() => {
                      setLanguage('vi');
                      setIsLangDropdownOpen(false);
                    }}
                    className={`flex items-center justify-between w-full px-4 py-2 text-xs font-medium text-left ${
                      language === 'vi'
                        ? 'text-cyan-400 bg-white/5'
                        : 'text-gray-300 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <span>Tiếng Việt</span>
                    {language === 'vi' && <Icon icon="lucide:check" className="text-cyan-400 text-xs" />}
                  </button>
                  <button
                    onClick={() => {
                      setLanguage('en');
                      setIsLangDropdownOpen(false);
                    }}
                    className={`flex items-center justify-between w-full px-4 py-2 text-xs font-medium text-left ${
                      language === 'en'
                        ? 'text-cyan-400 bg-white/5'
                        : 'text-gray-300 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <span>English</span>
                    {language === 'en' && <Icon icon="lucide:check" className="text-cyan-400 text-xs" />}
                  </button>
                </div>
              )}
            </div>

            {/* Sign In Button */}
            <button className="text-sm font-semibold text-gray-300 hover:text-white transition-colors duration-200 px-3 py-2 cursor-pointer">
              {t('signIn')}
            </button>

            {/* Sign Up Button */}
            <button className="px-5 py-2.5 rounded-full bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white text-xs font-bold tracking-wide shadow-[0_0_15px_rgba(6,182,212,0.25)] hover:shadow-[0_0_20px_rgba(6,182,212,0.45)] hover:scale-102 transition-all duration-200 cursor-pointer">
              {t('signUp')}
            </button>
          </div>

          {/* Mobile Menu Hamburger Button */}
          <div className="flex md:hidden items-center space-x-3">
            {/* Mobile Language Selector Shortcut */}
            <button
              onClick={() => setLanguage(language === 'vi' ? 'en' : 'vi')}
              className="p-2 rounded-lg bg-white/5 border border-white/10 text-gray-300"
              aria-label="Toggle language"
            >
              <Icon icon="lucide:globe" className="text-sm text-cyan-400" />
            </button>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition-colors duration-200"
              aria-label="Toggle menu"
            >
              <Icon icon={isMobileMenuOpen ? 'lucide:x' : 'lucide:menu'} className="text-xl" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Backdrop */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-dark-bg/60 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Drawer Menu */}
      <div
        className={`fixed top-0 right-0 bottom-0 w-72 bg-dark-card border-l border-white/8 z-50 md:hidden p-6 shadow-2xl transition-transform duration-300 ease-in-out transform ${
          isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between mb-8">
          <span className="font-display font-bold text-lg tracking-tight text-white">
            Menu
          </span>
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="p-2 rounded-lg bg-white/5 text-gray-400 hover:text-white"
          >
            <Icon icon="lucide:x" className="text-lg" />
          </button>
        </div>

        {/* Navigation Links in Drawer */}
        <nav className="flex flex-col space-y-4 mb-8">
          {navLinks.map((link) => (
            <a
              key={link.key}
              href={link.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center space-x-3 p-3 rounded-xl bg-white/3 hover:bg-white/6 text-gray-300 hover:text-white font-medium text-sm transition-all duration-200"
            >
              <Icon icon={link.icon} className="text-cyan-400 text-lg" />
              <span>{t(link.key)}</span>
            </a>
          ))}
        </nav>

        {/* Language selector toggle in Drawer */}
        <div className="border-t border-white/8 pt-6 mb-6">
          <p className="text-xs text-gray-400 font-semibold mb-3 tracking-wider uppercase">Language</p>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setLanguage('vi')}
              className={`py-2 rounded-lg text-xs font-semibold border ${
                language === 'vi'
                  ? 'border-cyan-400 text-cyan-400 bg-cyan-400/5'
                  : 'border-white/10 text-gray-400 hover:text-white'
              }`}
            >
              Tiếng Việt
            </button>
            <button
              onClick={() => setLanguage('en')}
              className={`py-2 rounded-lg text-xs font-semibold border ${
                language === 'en'
                  ? 'border-cyan-400 text-cyan-400 bg-cyan-400/5'
                  : 'border-white/10 text-gray-400 hover:text-white'
              }`}
            >
              English
            </button>
          </div>
        </div>

        {/* Actions in Drawer */}
        <div className="flex flex-col space-y-3 pt-4 border-t border-white/8">
          <button className="w-full py-3 rounded-xl bg-white/5 hover:bg-white/10 text-gray-200 hover:text-white text-sm font-semibold transition-all duration-200">
            {t('signIn')}
          </button>
          <button className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white text-sm font-bold shadow-[0_0_15px_rgba(6,182,212,0.25)] transition-all duration-200">
            {t('signUp')}
          </button>
        </div>
      </div>
    </header>
  );
}
