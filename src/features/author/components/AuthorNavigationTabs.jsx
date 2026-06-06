/**
 * @file AuthorNavigationTabs.jsx
 * @description Component thanh điều hướng phụ (Sub-navigation) cho phép chuyển đổi nhanh
 * giữa trang Danh sách tác giả (/authors) và trang Bảng xếp hạng (/authors/leaderboard).
 * 
 * Chức năng chính:
 * - Hiển thị hai tab điều hướng: Danh sách tác giả và Bảng xếp hạng.
 * - Sử dụng màu chủ đạo của dự án (var(--primary)) cho tab đang hoạt động (active state).
 * - Sử dụng các icon trực quan cho từng lựa chọn tab.
 */

import { Nav } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../shared/components/Icon';

/**
 * Component thanh chuyển đổi Tab danh sách và bảng xếp hạng.
 * 
 * @param {Object} props - Thuộc tính truyền vào component.
 * @param {string} props.activeTab - Tab đang được chọn hiện tại ("list" hoặc "leaderboard").
 * @returns {JSX.Element} Giao diện thanh tab điều hướng phụ.
 */
export default function AuthorNavigationTabs({ activeTab }) {
  const navigate = useNavigate();

  return (
    <Nav 
      variant="tabs" 
      activeKey={activeTab}
      className="tab-nav-custom mb-4 border-0 d-flex flex-nowrap overflow-auto"
      style={{ gap: '4px' }}
    >
      {/* Tab điều hướng Danh sách tác giả */}
      <Nav.Item>
        <Nav.Link 
          eventKey="list" 
          onClick={() => navigate('/authors')}
          className="d-flex align-items-center gap-2 px-3 py-2 text-nowrap"
          style={{
            fontWeight: activeTab === 'list' ? 700 : 500, // Đặt font weight đậm hơn cho tab đang chọn
            cursor: 'pointer'
          }}
        >
          <Icon icon="lucide:users" width="16" />
          Danh sách tác giả
        </Nav.Link>
      </Nav.Item>

      {/* Tab điều hướng Bảng xếp hạng */}
      <Nav.Item>
        <Nav.Link 
          eventKey="leaderboard" 
          onClick={() => navigate('/authors/leaderboard')}
          className="d-flex align-items-center gap-2 px-3 py-2 text-nowrap"
          style={{
            fontWeight: activeTab === 'leaderboard' ? 700 : 500, // Đặt font weight đậm hơn cho tab đang chọn
            cursor: 'pointer'
          }}
        >
          <Icon icon="lucide:trophy" width="16" />
          Bảng xếp hạng
        </Nav.Link>
      </Nav.Item>
    </Nav>
  );
}
