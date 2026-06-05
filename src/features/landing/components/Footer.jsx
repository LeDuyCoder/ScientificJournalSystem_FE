import { useTranslation } from 'react-i18next';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Nav from 'react-bootstrap/Nav';
import Icon from '../../../shared/components/Icon';

export default function Footer() {
  const { t } = useTranslation();

  const links = [
    { key: 'aboutUs', href: '#' },
    { key: 'api', href: '#' },
    { key: 'policy', href: '#' },
    { key: 'contact', href: '#' },
  ];

  return (
    <footer className="border-top border-white-5 py-5 position-relative z-3 bg-dark-bg">
      <Container>
        <Row className="align-items-center justify-content-between gy-4 gy-md-0">

          {/* Left Column: Logo & project info */}
          <Col xs={12} md={4} className="text-center text-md-start d-flex flex-column align-items-center align-items-md-start gap-2">
            <div className="d-flex align-items-center gap-2">
              <div 
                className="d-flex align-items-center justify-content-center text-white"
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '6px',
                  background: 'linear-gradient(135deg, #00d2ff 0%, #7a00ff 100%)',
                  boxShadow: '0 0 10px rgba(0, 210, 255, 0.2)'
                }}
              >
                <Icon icon="lucide:activity" className="fs-6" />
              </div>
              <span className="font-display font-bold text-white mb-0" style={{ fontWeight: 700, fontSize: '1rem' }}>
                ResearchPulse
              </span>
            </div>
            <span className="text-white-50 max-w-xs" style={{ fontSize: '0.75rem', maxWidth: '300px', lineHeight: 1.4 }}>
              {t('footerCredit')}
            </span>
          </Col>

          {/* Center Column: Links */}
          <Col xs={12} md={4} className="d-flex justify-content-center">
            <Nav className="gap-3 flex-wrap justify-content-center">
              {links.map((link) => (
                <Nav.Link
                  key={link.key}
                  href={link.href}
                  className="text-white-50 hover:text-white p-0 text-decoration-none font-semibold text-xs"
                  style={{ fontSize: '0.75rem', transition: 'color 0.2s ease' }}
                >
                  {t(link.key)}
                </Nav.Link>
              ))}
            </Nav>
          </Col>

          {/* Right Column: Copyright */}
          <Col xs={12} md={4} className="text-center text-md-end text-white-50" style={{ fontSize: '0.75rem' }}>
            <span>&copy; {new Date().getFullYear()} ResearchPulse Team</span>
          </Col>

        </Row>
      </Container>
    </footer>
  );
}
