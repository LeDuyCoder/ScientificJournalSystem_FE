const ADMIN_MENU = [
  // Trang tổng quan: Total Journals, Total Articles, Pending Reviews, Active Users,
  // Publication Trends chart, Recent Activity, Volume & Issue Status table.
  { key: 'dashboard', label: 'Dashboard', icon: 'lucide:layout-dashboard', path: '/admin/dashboard' },

  // Quản lý danh sách journal (sẽ phát triển ở issue khác).
  { key: 'journals', label: 'Journals', icon: 'lucide:book-open', path: '/admin/journals' },

  // Article Repository + Update Article (Issue 1 - phần còn lại).
  { key: 'articles', label: 'Articles', icon: 'lucide:file-text', path: '/admin/articles' },

  // Quản lý Volume/Issue (liên quan tới issue khác, dùng chung journal context).
  { key: 'volumes', label: 'Volumes', icon: 'lucide:layers', path: '/admin/volumes' },

  // Trang tài khoản admin (đổi mật khẩu, thông tin cá nhân...).
  { key: 'account', label: 'Account', icon: 'lucide:user', path: '/admin/account' },
];

export default ADMIN_MENU;