import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';
import AdminFooter from './AdminFooter';
import '../../features/admin/admin.css';

/**
 * AdminLayout
 * Layout chính cho khu vực quản trị viên (Admin).
 * Hỗ trợ cả cơ chế lồng route của react-router-dom (Outlet) và cơ chế bọc component con (children).
 */
export default function AdminLayout({ children }) {
  return (
    <div className="d-flex min-vh-100" style={{ backgroundColor: '#f8fafc' }}>
      {/* Sidebar điều hướng cố định bên trái */}
      <AdminSidebar />

      {/* Vùng nội dung chính bên phải */}
      <div className="d-flex flex-column flex-grow-1" style={{ minWidth: 0 }}>
        {/* Header trên cùng */}
        <AdminHeader />

        {/* Nội dung trang hiển thị ở giữa */}
        <div className="p-4 flex-grow-1 d-flex flex-column" style={{ minHeight: 'calc(100vh - 140px)' }}>
          {children || <Outlet />}
        </div>

        {/* Footer dưới cùng */}
        <AdminFooter />
      </div>
    </div>
  );
}

