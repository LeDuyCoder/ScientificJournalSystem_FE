import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';
import AdminFooter from './AdminFooter';

/**
 * AdminLayout
 * Master wrapper layout for administrative dashboards and operations.
 * Organizes layout with: Sidebar (Left) + Header, Outlet, Footer (Right column)
 */
export default function AdminLayout() {
  return (
    <div className="d-flex min-vh-100" style={{ backgroundColor: '#f8fafc' }}>
      {/* Sidebar navigation */}
      <AdminSidebar />

      {/* Main content body container */}
      <div className="d-flex flex-column flex-grow-1" style={{ minWidth: 0 }}>
        {/* Top bar header */}
        <AdminHeader />

        {/* Scrollable page body */}
        <div className="p-4 flex-grow-1 d-flex flex-column" style={{ minHeight: 'calc(100vh - 140px)' }}>
          <Outlet />
        </div>

        {/* Bottom copyright & information footer */}
        <AdminFooter />
      </div>
    </div>
  );
}
