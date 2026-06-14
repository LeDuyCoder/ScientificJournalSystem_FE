import { NavLink } from 'react-router-dom';
import Icon from '../../../shared/components/Icon';
import ADMIN_MENU from '../constants/adminMenu';

export default function AdminSidebar() {
  return (
    <aside className="admin-sidebar">
      {/* Logo / tên hệ thống - dùng font-display theo quy tắc DESIGN_SYSTEM */}
      <div>
        <div className="admin-sidebar__brand">
          <span className="admin-sidebar__brand-icon">
            <Icon icon="lucide:atom" />
          </span>
          <span>ResearchPulse</span>
        </div>

        {/* Danh sách menu chính - map từ ADMIN_MENU để dễ thêm/sửa */}
        <nav className="admin-sidebar__menu">
          {ADMIN_MENU.map((item) => (
            <NavLink
              key={item.key}
              to={item.path}
              // NavLink tự thêm class "active" khi path khớp,
              // ta map sang class riêng để style theo design token
              className={({ isActive }) =>
                `admin-sidebar__item${isActive ? ' admin-sidebar__item--active' : ''}`
              }
            >
              <Icon icon={item.icon} className="admin-sidebar__item-icon" />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Khu vực dưới cùng: Support + Sign Out */}
      <div className="admin-sidebar__footer">
        <a href="#support" className="admin-sidebar__item">
          <Icon icon="lucide:help-circle" className="admin-sidebar__item-icon" />
          <span>Support</span>
        </a>
        <a href="/login" className="admin-sidebar__item">
          <Icon icon="lucide:log-out" className="admin-sidebar__item-icon" />
          <span>Sign Out</span>
        </a>
      </div>
    </aside>
  );
}