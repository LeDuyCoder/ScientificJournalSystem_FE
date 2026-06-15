import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Nav } from 'react-bootstrap';
import Icon from '../../shared/components/Icon';
import Logo from '../../shared/components/Logo';
import useAuth from '../../features/auth/hooks/useAuth';
import ROUTES from '../routes/routePaths';

/**
 * AdminSidebar Component
 * Render thanh điều hướng sidebar bên trái của trang Admin theo mẫu thiết kế.
 */
export default function AdminSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const pathname = location.pathname;
  const auth = useAuth() ?? { logout: () => {} };

  // Danh sách các mục menu trên sidebar - Sử dụng ROUTES thay vì hardcode
  const menuItems = [
    { label: 'Dashboard', path: ROUTES.DASHBOARD, icon: 'lucide:layout-dashboard' },
    { label: 'Journals', path: ROUTES.CATALOG, icon: 'lucide:book-open' },
    { label: 'Articles', path: ROUTES.ARTICLE_SUBMIT, icon: 'lucide:file-text' },
    { label: 'Volumes', path: ROUTES.DASHBOARD, icon: 'lucide:layers' },
    { label: 'Account', path: ROUTES.ADMIN_USERS, icon: 'lucide:user' },
  ];

  /**
   * Kiểm tra xem mục menu hiện tại có đang active (được chọn) hay không.
   */
  const isActive = (itemPath) => {
    if (itemPath === ROUTES.DASHBOARD) {
      return pathname === ROUTES.DASHBOARD;
    }
    return pathname.startsWith(itemPath);
  };

  return (
    <div 
      className="d-flex flex-column justify-content-between p-3 border-end bg-white"
      style={{ width: '260px', height: '100vh', position: 'sticky', top: 0, zIndex: 100 }}
    >
      <div>
        {/* Brand Logo header */}
        <div className="py-3 px-2 mb-4 border-bottom">
          <Logo onClick={() => navigate('/')} />
        </div>

        {/* Navigation Link Items */}
        <Nav className="flex-column gap-2">
          {menuItems.map((item, idx) => {
            const active = isActive(item.path);
            return (
              <Nav.Link
                key={idx}
                onClick={() => navigate(item.path)}
                className="d-flex align-items-center gap-3 px-3 py-2.5 rounded-3 sidebar-link text-decoration-none"
                style={{
                  fontSize: '0.9rem',
                  fontWeight: active ? '600' : '500',
                  color: active ? 'var(--primary)' : 'var(--text-muted)',
                  backgroundColor: active ? 'var(--primary-light)' : 'transparent',
                  border: active ? '1px solid var(--border)' : '1px solid transparent',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                <Icon icon={item.icon} width="18" style={{ color: active ? 'var(--primary)' : 'var(--text-muted)' }} />
                <span>{item.label}</span>
              </Nav.Link>
            );
          })}
        </Nav>
      </div>

      {/* Footer-aligned items inside the sidebar */}
      <div>
        <Nav className="flex-column gap-2">
          {/* Support Link */}
          <Nav.Link
            onClick={() => navigate(ROUTES.DASHBOARD)}
            className="d-flex align-items-center gap-3 px-3 py-2.5 rounded-3 text-muted-custom text-decoration-none"
            style={{ fontSize: '0.9rem', fontWeight: '500', cursor: 'pointer' }}
          >
            <Icon icon="lucide:help-circle" width="18" />
            <span>Support</span>
          </Nav.Link>

          {/* Sign Out Button */}
          <Nav.Link
            onClick={() => auth.logout()}
            className="d-flex align-items-center gap-3 px-3 py-2.5 rounded-3 text-danger text-decoration-none"
            style={{ fontSize: '0.9rem', fontWeight: '500', cursor: 'pointer' }}
          >
            <Icon icon="lucide:log-out" width="18" />
            <span>Sign Out</span>
          </Nav.Link>
        </Nav>
      </div>
    </div>
  );
}
