import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import Icon from '../../../shared/components/Icon';
import useAuth from '../../auth/hooks/useAuth';

export default function Header() {
  const { t, i18n } = useTranslation();
  const { user, fetchProfile, logout } = useAuth();
  const language = i18n.language || 'vi';
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);
  const langDropdownRef = useRef(null);

  // Load user profile on mount if token exists
  useEffect(() => {
    const token = localStorage.getItem('researchpulse_token');
    if (token) {
      fetchProfile();
    }
  }, [fetchProfile]);

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
    <>
      <header
        className={`fixed-top z-50 ${
          isScrolled
            ? 'sticky-scrolled shadow py-2'
            : 'bg-transparent py-4'
        }`}
        style={{ transition: 'all 0.3s ease' }}
      >
        <div className="container-xl px-3">
        <div className="d-flex align-items-center justify-content-between" style={{ height: '3rem' }}>
          {/* Logo Brand */}
          <div className="d-flex align-items-center gap-2 cursor-pointer group">
            <div className="d-flex align-items-center justify-content-center bg-brand-gradient rounded-3" style={{ width: '2.25rem', height: '2.25rem', boxShadow: '0 0 15px rgba(6,182,212,0.3)' }}>
              <Icon icon="lucide:activity" className="text-white fs-5" />
            </div>
            <span className="fw-bold fs-5 text-white group-hover-cyan">
              ResearchPulse
            </span>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="d-none d-md-flex align-items-center gap-4">
            {navLinks.map((link) => (
              <a
                key={link.key}
                href={link.href}
                className="nav-link-custom text-sm"
              >
                {t(link.key)}
              </a>
            ))}
          </nav>

          {/* Right Action buttons */}
          <div className="d-none d-md-flex align-items-center gap-3">
            {/* Language Selector Dropdown */}
            <div className="position-relative" ref={langDropdownRef}>
              <button
                onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
                className="d-flex align-items-center gap-2 px-3 py-1.5 rounded-pill bg-white/5 border border-white/10 hover-bg-white-10 text-gray-300 text-xs font-semibold"
                style={{ transition: 'all 0.2s ease', color: '#adb5bd' }}
              >
                <Icon icon="lucide:globe" className="text-cyan-400 text-sm" />
                <span>{language.startsWith('vi') ? 'Tiếng Việt' : 'English'}</span>
                <Icon
                  icon="lucide:chevron-down"
                  className={`text-xs transition-transform ${
                    isLangDropdownOpen ? 'rotate-180' : ''
                  }`}
                  style={{ fontSize: '10px' }}
                />
              </button>

              {/* Dropdown Menu */}
              {isLangDropdownOpen && (
                <div 
                  className="position-absolute end-0 mt-2 rounded-3 bg-dark-card border border-white/10 shadow py-1 z-50"
                  style={{ width: '9rem' }}
                >
                  <button
                    onClick={() => {
                      i18n.changeLanguage('vi');
                      localStorage.setItem('researchpulse_lang', 'vi');
                      setIsLangDropdownOpen(false);
                    }}
                    className={`d-flex align-items-center justify-content-between w-100 border-0 px-3 py-2 text-xs fw-medium text-start bg-transparent ${
                      language.startsWith('vi') ? 'text-cyan-400 bg-white/5' : 'text-gray-300'
                    }`}
                  >
                    <span>Tiếng Việt</span>
                    {language.startsWith('vi') && <Icon icon="lucide:check" className="text-cyan-400 text-xs" />}
                  </button>
                  <button
                    onClick={() => {
                      i18n.changeLanguage('en');
                      localStorage.setItem('researchpulse_lang', 'en');
                      setIsLangDropdownOpen(false);
                    }}
                    className={`d-flex align-items-center justify-content-between w-100 border-0 px-3 py-2 text-xs fw-medium text-start bg-transparent ${
                      language.startsWith('en') ? 'text-cyan-400 bg-white/5' : 'text-gray-300'
                    }`}
                  >
                    <span>English</span>
                    {language.startsWith('en') && <Icon icon="lucide:check" className="text-cyan-400 text-xs" />}
                  </button>
                </div>
              )}
            </div>

            {user ? (
              <div className="d-flex align-items-center gap-3">
                <div className="d-flex align-items-center gap-2">
                  <div className="d-flex align-items-center justify-content-center rounded-circle bg-brand-gradient text-white text-xs font-bold" style={{ width: '2.1rem', height: '2.1rem' }}>
                    {user.username ? user.username.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <span className="text-xs text-gray-300 font-semibold d-none d-lg-inline-block">
                    {user.username || 'User'}
                  </span>
                </div>
                <button
                  onClick={logout}
                  className="btn btn-link text-decoration-none text-xs font-semibold text-gray-400 hover-text-red px-3 py-2 border-0"
                  style={{ color: '#adb5bd' }}
                >
                  {language.startsWith('vi') ? 'Đăng xuất' : 'Sign Out'}
                </button>
              </div>
            ) : (
              <>
                {/* Sign In Button */}
                <button className="btn btn-link text-decoration-none text-sm font-semibold text-gray-300 hover:text-white px-3 py-2 border-0">
                  {t('signIn')}
                </button>

                {/* Sign Up Button */}
                <button className="btn rounded-pill bg-brand-gradient text-white text-xs font-bold px-4 py-2 border-0 shadow btn-primary-glow">
                  {t('signUp')}
                </button>
              </>
            )}
          </div>

          {/* Mobile Menu Hamburger Button */}
          <div className="d-flex d-md-none align-items-center gap-2">
            {/* Mobile Language Selector Shortcut */}
            <button
              onClick={() => {
                const nextLang = language.startsWith('vi') ? 'en' : 'vi';
                i18n.changeLanguage(nextLang);
                localStorage.setItem('researchpulse_lang', nextLang);
              }}
              className="btn border border-white/10 bg-white/5 p-2 text-light"
              aria-label="Toggle language"
            >
              <Icon icon="lucide:globe" className="text-cyan-400" />
            </button>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="btn border border-white/10 bg-white/5 p-2 text-light"
              aria-label="Toggle menu"
            >
              <Icon icon={isMobileMenuOpen ? 'lucide:x' : 'lucide:menu'} />
            </button>
          </div>
        </div>
      </div>
    </header>

    {/* Mobile Drawer Backdrop */}
      {isMobileMenuOpen && (
        <div
          className="fixed-top bottom-0 backdrop-blur-sm z-40 d-md-none"
          onClick={() => setIsMobileMenuOpen(false)}
          style={{ right: 0, left: 0, backgroundColor: 'rgba(9, 13, 22, 0.6)' }}
        />
      )}

      {/* Mobile Drawer Menu */}
      <div
        className="fixed-top bottom-0 ms-auto bg-dark-card border-start border-white/8 z-50 p-4 shadow-lg transition-transform d-md-none"
        style={{
          width: '18rem',
          transform: isMobileMenuOpen ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.3s ease-in-out',
        }}
      >
        <div className="d-flex align-items-center justify-content-between mb-4">
          <span className="fw-bold text-white fs-5">Menu</span>
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="btn p-2 rounded-3 bg-white/5 text-gray-400 border-0"
          >
            <Icon icon="lucide:x" className="text-lg" />
          </button>
        </div>

        {/* Navigation Links in Drawer */}
        <nav className="d-flex flex-column gap-2 mb-4">
          {navLinks.map((link) => (
            <a
              key={link.key}
              href={link.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className="drawer-link"
            >
              <Icon icon={link.icon} className="drawer-link-icon" />
              <span>{t(link.key)}</span>
            </a>
          ))}
        </nav>

        {/* Language selector toggle in Drawer */}
        <div className="border-top border-white/8 pt-3 mb-4">
          <p className="text-xs text-gray-400 fw-semibold mb-2 tracking-wider text-uppercase">Language</p>
          <div className="row g-2">
            <div className="col-6">
              <button
                onClick={() => {
                  i18n.changeLanguage('vi');
                  localStorage.setItem('researchpulse_lang', 'vi');
                }}
                className={`btn btn-sm w-100 fw-semibold ${
                  language.startsWith('vi')
                    ? 'border-cyan-400 text-cyan-400 bg-cyan-400/5'
                    : 'border-white/10 text-gray-400'
                }`}
              >
                Tiếng Việt
              </button>
            </div>
            <div className="col-6">
              <button
                onClick={() => {
                  i18n.changeLanguage('en');
                  localStorage.setItem('researchpulse_lang', 'en');
                }}
                className={`btn btn-sm w-100 fw-semibold ${
                  language.startsWith('en')
                    ? 'border-cyan-400 text-cyan-400 bg-cyan-400/5'
                    : 'border-white/10 text-gray-400'
                }`}
              >
                English
              </button>
            </div>
          </div>
        </div>

        {/* Actions in Drawer */}
        <div className="d-flex flex-column gap-2 pt-3 border-top border-white/8">
          {user ? (
            <div className="d-flex flex-column gap-2">
              <div className="d-flex align-items-center gap-2 p-2.5 rounded-3 bg-white/3">
                <div className="d-flex align-items-center justify-content-center bg-brand-gradient rounded-circle text-white fw-bold" style={{ width: '2rem', height: '2rem' }}>
                  {user.username ? user.username.charAt(0).toUpperCase() : 'U'}
                </div>
                <span className="text-sm text-white fw-medium">
                  {user.username || 'User'}
                </span>
              </div>
              <button
                onClick={() => {
                  logout();
                  setIsMobileMenuOpen(false);
                }}
                className="btn btn-outline-danger w-100 py-2.5 rounded-3 text-sm fw-semibold"
              >
                {language.startsWith('vi') ? 'Đăng xuất' : 'Sign Out'}
              </button>
            </div>
          ) : (
            <>
              <button className="btn btn-outline-light w-100 py-2.5 rounded-3 text-sm fw-semibold">
                {t('signIn')}
              </button>
              <button className="btn bg-brand-gradient text-white w-100 py-2.5 rounded-3 text-sm fw-bold border-0">
                {t('signUp')}
              </button>
            </>
          )}
        </div>
      </div>
    </>
  );
}
