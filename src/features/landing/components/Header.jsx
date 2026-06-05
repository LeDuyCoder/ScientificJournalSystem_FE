import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Button from 'react-bootstrap/Button';
import Offcanvas from 'react-bootstrap/Offcanvas';
import Icon from '../../../shared/components/Icon';
import useAuth from '../../auth/hooks/useAuth';

export default function Header() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const auth = useAuth ? useAuth() : { user: null, logout: () => {} };
  const { user, logout } = auth;
  const language = i18n.language || 'vi';

  const [isScrolled, setIsScrolled] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

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

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
    localStorage.setItem('researchpulse_lang', lang);
  };

  const handleAuthRedirect = () => {
    navigate('/login');
  };

  return (
    <>
      <Navbar
        expand="md"
        fixed="top"
        className={`transition-all duration-300 py-3 ${
          isScrolled ? 'sticky-scrolled' : 'bg-transparent'
        }`}
        style={{
          borderBottom: isScrolled ? 'none' : '1px solid var(--border)',
          background: isScrolled ? 'var(--bg-card)' : 'transparent',
          backdropFilter: isScrolled ? 'blur(12px)' : 'none'
        }}
      >
        <Container>
          {/* Logo Brand */}
          <Navbar.Brand 
            onClick={() => navigate('/')}
            className="d-flex align-items-center text-main font-weight-bold"
            style={{ fontFamily: 'var(--font-display)', fontWeight: 800, cursor: 'pointer' }}
          >
            <div 
              className="d-flex align-items-center justify-content-center me-2"
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: 'var(--btn-dark)',
                boxShadow: '0 0 10px rgba(7, 26, 28, 0.15)'
              }}
            >
              <Icon icon="lucide:activity" className="text-white text-sm" />
            </div>
            ResearchPulse
          </Navbar.Brand>

          {/* Hamburger toggle for mobile */}
          <Navbar.Toggle 
            aria-controls="basic-navbar-nav" 
            onClick={() => setShowMobileMenu(true)} 
            className="border-0 bg-transparent text-main p-0"
          >
            <Icon icon="lucide:menu" className="fs-3 text-main" />
          </Navbar.Toggle>

          {/* Desktop Navigation Link Items */}
          <Navbar.Collapse id="basic-navbar-nav" className="d-none d-md-flex justify-content-between align-items-center w-full">
            <Nav className="mx-auto align-items-center" style={{ gap: '10px' }}>
              <Nav.Link 
                onClick={() => navigate('/catalog')} 
                className="px-3 py-1.5 text-sm font-semibold d-flex align-items-center gap-1.5"
                style={{
                  borderRadius: '6px',
                  backgroundColor: window.location.pathname.startsWith('/catalog') || window.location.pathname.startsWith('/search') ? 'var(--primary-light)' : 'transparent',
                  color: window.location.pathname.startsWith('/catalog') || window.location.pathname.startsWith('/search') ? 'var(--primary)' : 'var(--text-muted)',
                  border: window.location.pathname.startsWith('/catalog') || window.location.pathname.startsWith('/search') ? '1px solid var(--border)' : '1px solid transparent',
                  transition: 'all 0.2s'
                }}
              >
                <Icon icon="lucide:search" width="14" />
                {t('search')}
              </Nav.Link>
              <Nav.Link 
                onClick={() => navigate('/')} 
                className="px-3 py-1.5 text-sm font-semibold d-flex align-items-center gap-1.5"
                style={{
                  borderRadius: '6px',
                  backgroundColor: (window.location.pathname.includes('/journals') && !window.location.pathname.startsWith('/catalog')) || window.location.pathname === '/' ? 'var(--primary-light)' : 'transparent',
                  color: (window.location.pathname.includes('/journals') && !window.location.pathname.startsWith('/catalog')) || window.location.pathname === '/' ? 'var(--primary)' : 'var(--text-muted)',
                  border: (window.location.pathname.includes('/journals') && !window.location.pathname.startsWith('/catalog')) || window.location.pathname === '/' ? '1px solid var(--border)' : '1px solid transparent',
                  transition: 'all 0.2s'
                }}
              >
                <Icon icon="lucide:book-open" width="14" />
                {t('journals')}
              </Nav.Link>
              <Nav.Link 
                onClick={() => navigate('/articles')} 
                className="px-3 py-1.5 text-sm font-semibold d-flex align-items-center gap-1.5"
                style={{
                  borderRadius: '6px',
                  backgroundColor: window.location.pathname.startsWith('/articles') ? 'var(--primary-light)' : 'transparent',
                  color: window.location.pathname.startsWith('/articles') ? 'var(--primary)' : 'var(--text-muted)',
                  border: window.location.pathname.startsWith('/articles') ? '1px solid var(--border)' : '1px solid transparent',
                  transition: 'all 0.2s'
                }}
              >
                <Icon icon="lucide:file-text" width="14" />
                {t('articles')}
              </Nav.Link>
              <Nav.Link 
                onClick={() => navigate('/')} 
                className="px-3 py-1.5 text-sm font-semibold d-flex align-items-center gap-1.5 text-muted-custom"
                style={{ borderRadius: '6px', transition: 'all 0.2s' }}
              >
                <Icon icon="lucide:users" width="14" />
                {t('authors')}
              </Nav.Link>
            </Nav>

            <div className="d-flex align-items-center gap-3">
              {/* Language Dropdown Selector */}
              <NavDropdown
                title={
                  <span className="d-flex align-items-center text-muted-custom hover:text-main text-xs font-semibold uppercase">
                    <Icon icon="lucide:languages" className="me-1" />
                    {language.startsWith('vi') ? 'Tiếng Việt' : 'English'}
                  </span>
                }
                id="language-nav-dropdown"
                align="end"
                className="bg-transparent border-0"
              >
                <NavDropdown.Item 
                  onClick={() => changeLanguage('vi')}
                  className={`d-flex align-items-center justify-content-between text-xs py-2 ${
                    language.startsWith('vi') ? 'text-primary' : 'text-dark'
                  }`}
                >
                  <span>Tiếng Việt</span>
                  {language.startsWith('vi') && <Icon icon="lucide:check" className="text-primary text-xs ms-2" />}
                </NavDropdown.Item>
                <NavDropdown.Item 
                  onClick={() => changeLanguage('en')}
                  className={`d-flex align-items-center justify-content-between text-xs py-2 ${
                    language.startsWith('en') ? 'text-primary' : 'text-dark'
                  }`}
                >
                  <span>English</span>
                  {language.startsWith('en') && <Icon icon="lucide:check" className="text-primary text-xs ms-2" />}
                </NavDropdown.Item>
              </NavDropdown>

              {/* Theme Toggle Sun/Moon Icon */}
              <div 
                className="text-muted-custom hover:text-main" 
                style={{ cursor: 'pointer' }}
                onClick={() => alert('Đang áp dụng giao diện sáng của ResearchPulse')}
              >
                <Icon icon="lucide:sun" width="18" className="text-warning" />
              </div>

              {/* Notification icon */}
              {user && (
                <div className="text-muted-custom hover:text-main position-relative" style={{ cursor: 'pointer' }}>
                  <Icon icon="lucide:bell" width="18" />
                  <span className="position-absolute top-0 start-100 translate-middle p-1 bg-danger border border-light rounded-circle">
                    <span className="visually-hidden">New alerts</span>
                  </span>
                </div>
              )}

              {/* User Authentication Display/Buttons */}
              {user ? (
                <div className="d-flex align-items-center gap-3">
                  <div className="d-flex align-items-center gap-2">
                    <div 
                      className="d-flex align-items-center justify-content-center text-white text-xs font-bold font-display"
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        background: 'var(--btn-dark)',
                        boxShadow: '0 0 8px rgba(7, 26, 28, 0.15)'
                      }}
                    >
                      {user.username ? user.username.charAt(0).toUpperCase() : 'U'}
                    </div>
                  </div>
                  <Button
                    variant="link"
                    className="text-muted-custom hover:text-danger text-xs font-semibold p-0 text-decoration-none"
                    onClick={logout}
                  >
                    {language.startsWith('vi') ? 'Đăng xuất' : 'Sign Out'}
                  </Button>
                </div>
              ) : (
                <>
                  <Button 
                    variant="link" 
                    className="text-muted-custom hover:text-main text-xs font-semibold text-decoration-none"
                    onClick={handleAuthRedirect}
                  >
                    {t('signIn')}
                  </Button>
                  <Button 
                    className="btn-primary-glow rounded-pill px-4 py-2 text-xs font-bold"
                    onClick={handleAuthRedirect}
                  >
                    {t('signUp')}
                  </Button>
                </>
              )}
            </div>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Mobile Menu Drawer (Offcanvas) */}
      <Offcanvas
        show={showMobileMenu}
        onHide={() => setShowMobileMenu(false)}
        placement="end"
        className="bg-white text-dark border-start border-light"
        style={{ width: '280px', backgroundColor: 'var(--bg-card)', color: 'var(--text-main)' }}
      >
        <Offcanvas.Header closeButton closeVariant="dark" className="border-bottom border-light py-4">
          <Offcanvas.Title 
            className="d-flex align-items-center text-main" 
            style={{ fontFamily: 'var(--font-display)', fontWeight: 800 }}
          >
            <div 
              className="d-flex align-items-center justify-content-center me-2"
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '6px',
                background: 'var(--btn-dark)'
              }}
            >
              <Icon icon="lucide:activity" className="text-white text-xs" />
            </div>
            ResearchPulse
          </Offcanvas.Title>
        </Offcanvas.Header>

        <Offcanvas.Body className="d-flex flex-column justify-content-between py-4">
          <Nav className="flex-column gap-3 mb-4">
            <Nav.Link 
              onClick={() => {
                setShowMobileMenu(false);
                navigate('/catalog');
              }}
              className="text-muted-custom hover:text-main py-2 text-sm font-semibold border-bottom border-light"
            >
              {t('search')}
            </Nav.Link>
            <Nav.Link 
              onClick={() => {
                setShowMobileMenu(false);
                navigate('/');
              }}
              className="text-muted-custom hover:text-main py-2 text-sm font-semibold border-bottom border-light"
            >
              {t('journals')}
            </Nav.Link>
            <Nav.Link 
              onClick={() => {
                setShowMobileMenu(false);
                navigate('/articles');
              }}
              className="text-muted-custom hover:text-main py-2 text-sm font-semibold border-bottom border-light"
              style={{
                color: window.location.pathname.startsWith('/articles') ? 'var(--primary)' : 'var(--text-muted)'
              }}
            >
              {t('articles')}
            </Nav.Link>
            <Nav.Link 
              href="#features" 
              onClick={() => setShowMobileMenu(false)}
              className="text-muted-custom hover:text-main py-2 text-sm font-semibold border-bottom border-light"
            >
              {t('features')}
            </Nav.Link>
            <Nav.Link 
              href="#how-to-use" 
              onClick={() => setShowMobileMenu(false)}
              className="text-muted-custom hover:text-main py-2 text-sm font-semibold border-bottom border-light"
            >
              {t('howToUse')}
            </Nav.Link>
          </Nav>

          <div className="d-flex flex-column gap-3">
            {/* Mobile Language Switches */}
            <div className="d-flex align-items-center justify-content-center gap-4 py-2 border-top border-bottom border-light mb-2">
              <Button
                variant="link"
                onClick={() => changeLanguage('vi')}
                className={`text-decoration-none text-xs font-bold p-0 ${
                  language.startsWith('vi') ? 'text-primary' : 'text-muted-custom'
                }`}
              >
                Tiếng Việt
              </Button>
              <span className="text-muted-custom">|</span>
              <Button
                variant="link"
                onClick={() => changeLanguage('en')}
                className={`text-decoration-none text-xs font-bold p-0 ${
                  language.startsWith('en') ? 'text-primary' : 'text-muted-custom'
                }`}
              >
                English
              </Button>
            </div>

            {/* Mobile Auth options */}
            {user ? (
              <div className="d-flex flex-column gap-3">
                <Button
                  variant="outline-primary"
                  className="w-100 rounded-pill py-2.5 text-xs font-bold"
                  onClick={() => {
                    setShowMobileMenu(false);
                    navigate('/dashboard');
                  }}
                >
                  <Icon icon="lucide:layout-dashboard" className="me-1" />
                  {language.startsWith('vi') ? 'Bảng điều khiển' : 'Go to Dashboard'}
                </Button>
                <div className="d-flex align-items-center justify-content-center gap-2 p-2 rounded-3 bg-light">
                  <div 
                    className="d-flex align-items-center justify-content-center text-white text-xs font-bold"
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      background: 'var(--btn-dark)'
                    }}
                  >
                    {user.username ? user.username.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <span className="text-xs text-main font-weight-bold">
                    {user.username || 'User'}
                  </span>
                </div>
                <Button
                  variant="outline-danger"
                  className="w-100 rounded-pill py-2 text-xs font-bold"
                  onClick={() => {
                    logout();
                    setShowMobileMenu(false);
                  }}
                >
                  {language.startsWith('vi') ? 'Đăng xuất' : 'Sign Out'}
                </Button>
              </div>
            ) : (
              <div className="d-flex flex-column gap-2">
                <Button 
                  variant="outline-secondary" 
                  className="w-100 rounded-pill py-2.5 text-xs text-main border-secondary hover:bg-light"
                  onClick={() => {
                    setShowMobileMenu(false);
                    handleAuthRedirect();
                  }}
                >
                  {t('signIn')}
                </Button>
                <Button 
                  className="btn-primary-glow w-100 rounded-pill py-2.5 text-xs font-bold"
                  onClick={() => {
                    setShowMobileMenu(false);
                    handleAuthRedirect();
                  }}
                >
                  {t('signUp')}
                </Button>
              </div>
            )}
          </div>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
}
