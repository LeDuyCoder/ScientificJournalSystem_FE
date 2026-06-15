import React from 'react';
import { Card } from 'react-bootstrap';
import { useNavigate, useParams, Link } from 'react-router-dom';
import UserAccountForm from '../components/UserAccountForm';
import { useAdminStore } from '../../../app/store/adminStore';
import Icon from '../../../shared/components/Icon';
import ROUTES from '../../../app/routes/routePaths';

/**
 * UpdateUserAccountPage Component
 * Trang cập nhật thông tin tài khoản người dùng có sẵn trên hệ thống (Page 13).
 */
export default function UpdateUserAccountPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { users, updateUser } = useAdminStore();

  // Tìm kiếm thông tin người dùng cụ thể dựa trên ID truyền vào từ URL param
  const userItem = users.find((u) => u.id === id);

  /**
   * Hàm callback được gọi sau khi submit form cập nhật tài khoản thành công.
   * Cập nhật thông tin mới vào kho lưu trữ Zustand và quay trở lại trang danh mục.
   */
  const handleFormSubmit = (payload) => {
    updateUser(id, payload);
    alert('Cập nhật thông tin người dùng thành công!');
    navigate(ROUTES.ADMIN_USERS);
  };

  if (!userItem) {
    return (
      <div className="container-fluid py-4 text-center">
        <div className="alert alert-danger border-0 rounded-4 p-4 shadow-sm mx-auto" style={{ maxWidth: '600px' }}>
          <Icon icon="lucide:alert-triangle" width="32" className="text-danger mb-2" />
          <h5 className="fw-bold mb-1">Không tìm thấy người dùng</h5>
          <p className="mb-3 small">Tài khoản này có thể đã bị xóa hoặc không tồn tại trên hệ thống.</p>
          <button onClick={() => navigate(ROUTES.ADMIN_USERS)} className="btn btn-outline-danger btn-sm rounded-pill px-4">
            Quay lại Danh sách
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid py-2">
      {/* Page Breadcrumbs - Sử dụng hằng số ROUTES */}
      <nav aria-label="breadcrumb" className="mb-3">
        <ol className="breadcrumb text-muted-custom small mb-0">
          <li className="breadcrumb-item"><Link to={ROUTES.ADMIN_USERS} className="text-decoration-none text-muted-custom hover-primary">Account</Link></li>
          <li className="breadcrumb-item"><Link to={ROUTES.ADMIN_USERS} className="text-decoration-none text-muted-custom hover-primary">User Directory</Link></li>
          <li className="breadcrumb-item active" aria-current="page">Update User</li>
        </ol>
      </nav>

      {/* Main title block matching Page 13 */}
      <div className="mb-4">
        <h1 className="font-display fw-bold text-main mb-1" style={{ fontSize: '1.8rem' }}>Cập nhật thông tin người dùng</h1>
        <p className="text-muted-custom small mb-0" style={{ maxWidth: '750px' }}>
          Modify profile settings, adjust organizational roles, and update security credentials for this platform contributor.
        </p>
      </div>

      <div className="mx-auto" style={{ maxWidth: '800px' }}>
        {/* Core Account Form card */}
        <Card className="p-4 p-md-5 rounded-4 border bg-white shadow-sm mb-5">
          <UserAccountForm 
            isEdit={true}
            initialData={userItem}
            onSubmit={handleFormSubmit}
            onCancel={() => navigate(ROUTES.ADMIN_USERS)}
          />
        </Card>
      </div>
    </div>
  );
}
