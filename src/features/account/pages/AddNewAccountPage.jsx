import React from 'react';
import { Card, Row, Col } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import Icon from '../../../shared/components/Icon';
import UserAccountForm from '../components/UserAccountForm';
import { useAdminStore } from '../../../app/store/adminStore';
import ROUTES from '../../../app/routes/routePaths';

/**
 * AddNewAccountPage Component
 * Trang thêm tài khoản người dùng mới trên hệ thống ResearchPulse (Page 17).
 */
export default function AddNewAccountPage() {
  const navigate = useNavigate();
  const { addUser } = useAdminStore();

  /**
   * Hàm callback được gọi sau khi submit form thêm tài khoản thành công.
   * Thêm người dùng mới vào kho lưu trữ Zustand và quay trở lại trang danh mục.
   */
  const handleFormSubmit = (payload) => {
    addUser(payload);
    alert('Thêm tài khoản mới thành công!');
    navigate(ROUTES.ADMIN_USERS);
  };

  return (
    <div className="container-fluid py-2">
      {/* Page Breadcrumbs - Sử dụng hằng số ROUTES */}
      <nav className="mb-2">
        <div className="d-flex align-items-center gap-2 text-xs text-muted-custom fw-semibold select-none" style={{ fontSize: '0.78rem' }}>
          <Link to={ROUTES.ADMIN_USERS} className="text-decoration-none text-muted-custom hover-primary">Account</Link>
          <span className="text-muted-custom opacity-50">&gt;</span>
          <Link to={ROUTES.ADMIN_USERS} className="text-decoration-none text-muted-custom hover-primary">User Directory</Link>
          <span className="text-muted-custom opacity-50">&gt;</span>
          <span className="text-main">New Account</span>
        </div>
      </nav>

      {/* Main title banner matching Page 17 */}
      <div className="mb-4">
        <h1 className="font-display fw-bold text-main mb-1.5" style={{ fontSize: '1.8rem', letterSpacing: '-0.02em' }}>Thêm tài khoản mới</h1>
        <p className="text-muted-custom small mb-0" style={{ maxWidth: '750px', fontSize: '0.85rem', lineHeight: '1.5' }}>
          Vui lòng điền đầy đủ các thông tin bên dưới để tạo tài khoản người dùng mới trên hệ thống ResearchPulse. Tất cả các trường đánh dấu (*) là bắt buộc.
        </p>
      </div>

      <div className="mx-auto" style={{ maxWidth: '820px' }}>
        {/* Core Account Form card */}
        <Card className="p-4 p-md-5 rounded-4 border bg-white shadow-sm mb-4">
          <UserAccountForm 
            isEdit={false}
            onSubmit={handleFormSubmit}
            onCancel={() => navigate(ROUTES.ADMIN_USERS)}
          />
        </Card>

        {/* Informational Feature Highlights (Page 17 bottom cards) */}
        <Row className="g-3 mb-5">
          {/* Card 1: Thông báo tự động */}
          <Col xs={12} md={4}>
            <Card className="p-4 border h-100 rounded-3" style={{ backgroundColor: '#fef2f2', borderColor: '#fee2e2', boxShadow: 'none' }}>
              <div className="d-flex flex-column align-items-start gap-3">
                <div 
                  className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
                  style={{ width: '32px', height: '32px', backgroundColor: '#fee2e2', color: '#ef4444' }}
                >
                  <Icon icon="lucide:mail" width="16" />
                </div>
                <div>
                  <h6 className="fw-bold mb-1.5" style={{ fontSize: '0.85rem', color: '#7f1d1d' }}>Thông báo tự động</h6>
                  <p className="small mb-0 lh-sm" style={{ fontSize: '0.78rem', color: '#991b1b', opacity: 0.95 }}>
                    Hệ thống sẽ tự động gửi email kích hoạt và hướng dẫn đăng nhập đến người dùng ngay sau khi tạo.
                  </p>
                </div>
              </div>
            </Card>
          </Col>

          {/* Card 2: Phân quyền thông minh */}
          <Col xs={12} md={4}>
            <Card className="p-4 border h-100 rounded-3" style={{ backgroundColor: '#f0f9ff', borderColor: '#e0f2fe', boxShadow: 'none' }}>
              <div className="d-flex flex-column align-items-start gap-3">
                <div 
                  className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
                  style={{ width: '32px', height: '32px', backgroundColor: '#e0f2fe', color: '#0ea5e9' }}
                >
                  <Icon icon="lucide:shield-check" width="16" />
                </div>
                <div>
                  <h6 className="fw-bold mb-1.5" style={{ fontSize: '0.85rem', color: '#0c4a6e' }}>Phân quyền thông minh</h6>
                  <p className="small mb-0 lh-sm" style={{ fontSize: '0.78rem', color: '#075985', opacity: 0.95 }}>
                    Vai trò xác định các quyền truy cập vào dữ liệu dự án và các báo cáo khoa học quan trọng.
                  </p>
                </div>
              </div>
            </Card>
          </Col>

          {/* Card 3: Lịch sử thao tác */}
          <Col xs={12} md={4}>
            <Card className="p-4 border h-100 rounded-3" style={{ backgroundColor: '#f8fafc', borderColor: '#e2e8f0', boxShadow: 'none' }}>
              <div className="d-flex flex-column align-items-start gap-3">
                <div 
                  className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
                  style={{ width: '32px', height: '32px', backgroundColor: '#e2e8f0', color: '#64748b' }}
                >
                  <Icon icon="lucide:clock" width="16" />
                </div>
                <div>
                  <h6 className="fw-bold mb-1.5" style={{ fontSize: '0.85rem', color: '#1e293b' }}>Lịch sử thao tác</h6>
                  <p className="small mb-0 lh-sm" style={{ fontSize: '0.78rem', color: '#475569', opacity: 0.95 }}>
                    Mọi hành động tạo tài khoản đều được ghi lại trong nhật ký hệ thống để đảm bảo tính minh bạch.
                  </p>
                </div>
              </div>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
}
