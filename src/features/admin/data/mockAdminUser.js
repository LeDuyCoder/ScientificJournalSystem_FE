/**
 * Cấu trúc:
 * - name:             tên hiển thị của admin (VD: "Admin User").
 * - role:             vai trò/chức danh hiển thị dưới tên (VD: "Editor-in-Chief").
 * - avatarUrl:        URL ảnh đại diện. Hiện dùng ảnh placeholder từ pravatar,
 *                     khi có API thật sẽ thay bằng user.avatarUrl từ store.
 * - notificationCount: số lượng thông báo chưa đọc, dùng để hiển thị
 *                     badge đỏ nhỏ trên icon chuông ở AdminHeader.
 *                     Nếu = 0 thì AdminHeader sẽ ẩn badge này.
 */

export const mockAdminUser = {
  name: 'Admin User',
  role: 'Editor-in-Chief',
  avatarUrl: 'https://i.pravatar.cc/80?img=12',
  notificationCount: 1,
};