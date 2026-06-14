import AdminSidebar from '../../features/admin/components/AdminSidebar';
import AdminHeader from '../../features/admin/components/AdminHeader';
import AdminFooter from '../../features/admin/components/AdminFooter';
import '../../features/admin/admin.css';

export default function AdminLayout({ children }) {
  return (
    <div className="admin-layout">
      {/* Sidebar cố định bên trái, tái sử dụng cho mọi page Admin */}
      <AdminSidebar />

      {/* Khu vực chính: Header trên cùng, nội dung page ở giữa, Footer dưới cùng */}
      <div className="admin-main">
        <AdminHeader />

        {/* children = nội dung riêng của từng Admin page (Dashboard, Articles...) */}
        <main className="admin-content">{children}</main>

        <AdminFooter />
      </div>
    </div>
  );
}