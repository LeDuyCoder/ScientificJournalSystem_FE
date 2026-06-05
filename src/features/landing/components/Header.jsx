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
          isScrolled ? 'sticky-scrolled' : 'bg-transparent border-bottom border-white-50'
        }`}
        style={{
          borderBottom: isScrolled ? 'none' : '1px solid rgba(255, 255, 255, 0.05)',
          background: isScrolled ? 'rgba(9, 13, 22, 0.95)' : 'transparent',
          backdropFilter: isScrolled ? 'blur(12px)' : 'none'
        }}
      >
        <Container>
          {/* Logo Brand */}
          <Navbar.Brand 
            onClick={() => navigate('/')}
            className="d-flex align-items-center text-white font-weight-bold"
            style={{ fontFamily: 'var(--font-display)', fontWeight: 800, cursor: 'pointer' }}
          >
            <div 
              className="d-flex align-items-center justify-content-center me-2"
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #00d2ff 0%, #7a00ff 100%)',
                boxShadow: '0 0 10px rgba(0, 210, 255, 0.3)'
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
            className="border-0 bg-transparent text-white p-0"
          >
            <Icon icon="lucide:menu" className="fs-3" />
          </Navbar.Toggle>

          {/* Desktop Navigation Link Items */}
          <Navbar.Collapse id="basic-navbar-nav" className="d-none d-md-flex justify-content-between align-items-center w-full">
            <Nav className="mx-auto align-items-center" style={{ gap: '10px' }}>
              <Nav.Link 
                onClick={() => navigate('/catalog')} 
                className="px-3 py-1.5 text-sm font-semibold d-flex align-items-center gap-1.5"
                style={{
                  borderRadius: '6px',
                  backgroundColor: window.location.pathname.startsWith('/catalog') || window.location.pathname.startsWith('/search') ? '#161c2e' : 'transparent',
                  color: window.location.pathname.startsWith('/catalog') || window.location.pathname.startsWith('/search') ? '#00d2ff' : 'rgba(255, 255, 255, 0.6)',
                  border: window.location.pathname.startsWith('/catalog') || window.location.pathname.startsWith('/search') ? '1px solid rgba(0, 210, 255, 0.15)' : '1px solid transparent',
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
                  backgroundColor: (window.location.pathname.includes('/journals') && !window.location.pathname.startsWith('/catalog')) || window.location.pathname === '/' ? '#161c2e' : 'transparent',
                  color: (window.location.pathname.includes('/journals') && !window.location.pathname.startsWith('/catalog')) || window.location.pathname === '/' ? '#00d2ff' : 'rgba(255, 255, 255, 0.6)',
                  border: (window.location.pathname.includes('/journals') && !window.location.pathname.startsWith('/catalog')) || window.location.pathname === '/' ? '1px solid rgba(0, 210, 255, 0.15)' : '1px solid transparent',
                  transition: 'all 0.2s'
                }}
              >
                <Icon icon="lucide:book-open" width="14" />
                {t('journals')}
              </Nav.Link>
              <Nav.Link 
                onClick={() => navigate('/')} 
                className="px-3 py-1.5 text-sm font-semibold d-flex align-items-center gap-1.5 text-white-50"
                style={{ borderRadius: '6px', transition: 'all 0.2s' }}
              >
                <Icon icon="lucide:file-text" width="14" />
                {t('articles')}
              </Nav.Link>
              <Nav.Link 
                onClick={() => navigate('/')} 
                className="px-3 py-1.5 text-sm font-semibold d-flex align-items-center gap-1.5 text-white-50"
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
                  <span className="d-flex align-items-center text-gray-300 hover:text-white text-xs font-semibold uppercase">
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
                    language.startsWith('vi') ? 'text-info' : 'text-dark'
                  }`}
                >
                  <span>Tiếng Việt</span>
                  {language.startsWith('vi') && <Icon icon="lucide:check" className="text-info text-xs ms-2" />}
                </NavDropdown.Item>
                <NavDropdown.Item 
                  onClick={() => changeLanguage('en')}
                  className={`d-flex align-items-center justify-content-between text-xs py-2 ${
                    language.startsWith('en') ? 'text-info' : 'text-dark'
                  }`}
                >
                  <span>English</span>
                  {language.startsWith('en') && <Icon icon="lucide:check" className="text-info text-xs ms-2" />}
                </NavDropdown.Item>
              </NavDropdown>

              {/* Theme Toggle Moon Icon */}
              <div 
                className="text-secondary hover:text-white" 
                style={{ cursor: 'pointer' }}
                onClick={() => alert('Chế độ tối được tối ưu hóa mặc định cho nền tảng ResearchPulse')}
              >
                <Icon icon="lucide:moon" width="18" className="text-warning" />
              </div>

              {/* Notification icon */}
              {user && (
                <div className="text-secondary hover:text-white position-relative" style={{ cursor: 'pointer' }}>
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
                        background: 'linear-gradient(135deg, #00d2ff 0%, #7a00ff 100%)',
                        boxShadow: '0 0 8px rgba(0, 210, 255, 0.2)'
                      }}
                    >
                      {user.username ? user.username.charAt(0).toUpperCase() : 'U'}
                    </div>
                  </div>
                  <Button
                    variant="link"
                    className="text-white-50 hover:text-danger text-xs font-semibold p-0 text-decoration-none"
                    onClick={logout}
                  >
                    {language.startsWith('vi') ? 'Đăng xuất' : 'Sign Out'}
                  </Button>
                </div>
              ) : (
                <>
                  <Button 
                    variant="link" 
                    className="text-white-50 hover:text-white text-xs font-semibold text-decoration-none"
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
        className="bg-[#090d16] text-white border-start border-white-10"
        style={{ width: '280px', backgroundColor: '#090d16' }}
      >
        <Offcanvas.Header closeButton closeVariant="white" className="border-bottom border-white-10 py-4">
          <Offcanvas.Title 
            className="d-flex align-items-center text-white" 
            style={{ fontFamily: 'var(--font-display)', fontWeight: 800 }}
          >
            <div 
              className="d-flex align-items-center justify-content-center me-2"
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '6px',
                background: 'linear-gradient(135deg, #00d2ff 0%, #7a00ff 100%)'
              }}
            >
              <Icon icon="lucide:activity" className="text-white text-xs" />
            </div>
            ResearchPulse
          </Offcanvas.Title>
        </Offcanvas.Header>

        <Offcanvas.Body className="d-flex flex-col justify-content-between py-4">
          <Nav className="flex-column gap-3 mb-4">
            <Nav.Link 
              onClick={() => {
                setShowMobileMenu(false);
                navigate('/catalog');
              }}
              className="text-white-50 hover:text-white py-2 text-sm font-semibold border-bottom border-white-5"
            >
              {t('search')}
            </Nav.Link>
            <Nav.Link 
              onClick={() => {
                setShowMobileMenu(false);
                navigate('/');
              }}
              className="text-white-50 hover:text-white py-2 text-sm font-semibold border-bottom border-white-5"
            >
              {t('journals')}
            </Nav.Link>
            <Nav.Link 
              href="#features" 
              onClick={() => setShowMobileMenu(false)}
              className="text-white-50 hover:text-white py-2 text-sm font-semibold border-bottom border-white-5"
            >
              {t('features')}
            </Nav.Link>
            <Nav.Link 
              href="#how-to-use" 
              onClick={() => setShowMobileMenu(false)}
              className="text-white-50 hover:text-white py-2 text-sm font-semibold border-bottom border-white-5"
            >
              {t('howToUse')}
            </Nav.Link>
          </Nav>

          <div className="d-flex flex-column gap-3">
            {/* Mobile Language Switches */}
            <div className="d-flex align-items-center justify-content-center gap-4 py-2 border-top border-bottom border-white-5 mb-2">
              <Button
                variant="link"
                onClick={() => changeLanguage('vi')}
                className={`text-decoration-none text-xs font-bold p-0 ${
                  language.startsWith('vi') ? 'text-info' : 'text-white-50'
                }`}
              >
                Tiếng Việt
              </Button>
              <span className="text-white-10">|</span>
              <Button
                variant="link"
                onClick={() => changeLanguage('en')}
                className={`text-decoration-none text-xs font-bold p-0 ${
                  language.startsWith('en') ? 'text-info' : 'text-white-50'
                }`}
              >
                English
              </Button>
            </div>

            {/* Mobile Auth options */}
            {user ? (
              <div className="d-flex flex-column gap-3">
                <Button
                  variant="outline-info"
                  className="w-100 rounded-pill py-2.5 text-xs font-bold"
                  onClick={() => {
                    setShowMobileMenu(false);
                    navigate('/dashboard');
                  }}
                >
                  <Icon icon="lucide:layout-dashboard" className="me-1" />
                  {language.startsWith('vi') ? 'Bảng điều khiển' : 'Go to Dashboard'}
                </Button>
                <div className="d-flex align-items-center justify-content-center gap-2 p-2 rounded-3 bg-white-5">
                  <div 
                    className="d-flex align-items-center justify-content-center text-white text-xs font-bold"
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #00d2ff 0%, #7a00ff 100%)'
                    }}
                  >
                    {user.username ? user.username.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <span className="text-xs text-white font-weight-bold">
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
                  className="w-100 rounded-pill py-2.5 text-xs text-white border-white-20 hover:bg-white-5"
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
