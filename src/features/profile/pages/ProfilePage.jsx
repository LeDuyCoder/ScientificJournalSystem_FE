import "../styles/ProfilePage.css";
import Header from "../../landing/components/Header";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../../auth/hooks/useAuth";

export default function ProfilePage() {
  const { user, fetchProfile, updateProfile, deleteAccount, isLoading, error } =
    useAuth();
  const navigate = useNavigate();

  // Modal xác nhận xóa tài khoản
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Dữ liệu form
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    role: "",
    gender: true,
    date_of_birth: "",
    url_image: "",
  });

  // Kiểm tra đăng nhập & Điều hướng Guest User (Hỗ trợ cả token lẫn trạng thái null từ hook)
  useEffect(() => {
    const token = localStorage.getItem("researchpulse_token");

    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  // Gọi API lấy profile - Không gây lặp loading nhờ điều kiện render an toàn bên dưới
  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  // Đổ dữ liệu user vào form
  useEffect(() => {
    if (user) {
      setFormData({
        first_name: user.first_name || "",
        last_name: user.last_name || "",
        email: user.email || "",
        role: user.role || "",
        gender: user.gender ?? true,
        date_of_birth: user.date_of_birth || "",
        url_image: user.url_image || "",
      });
    }
  }, [user]);

  // Cập nhật thông tin - Đã lọc sạch Payload chuẩn hóa theo đúng yêu cầu task
  const handleSave = async () => {
    try {
      await updateProfile({
        first_name: formData.first_name,
        last_name: formData.last_name,
        gender: formData.gender,
        date_of_birth: formData.date_of_birth,
        url_image: formData.url_image,
      });
      alert("Cập nhật thành công");
    } catch (err) {
      console.error(err);
      alert("Cập nhật thất bại");
    }
  };

  // Logic xóa tài khoản thực tế sử dụng điều hướng navigate
  const handleDelete = async () => {
    if (deleteAccount) {
      try {
        await deleteAccount();
        alert("Xóa tài khoản thành công");
        navigate("/login");
      } catch (err) {
        console.error(err);
        alert("Xóa tài khoản thất bại");
      }
    } else {
      alert("Chức năng xóa tài khoản đang chờ backend hoàn thiện.");
    }
    setShowDeleteModal(false);
  };

  // Sửa lỗi Loading State lặp (Chỉ hiển thị loading khi chưa có dữ liệu user)
  if (isLoading && !user) {
    return (
      <>
        <Header />
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Đang tải dữ liệu...</p>
        </div>
      </>
    );
  }

  // Error State - Hiển thị lỗi tường minh
  if (error) {
    return (
      <>
        <Header />
        <div className="error-state">
          <div className="error-box">
            <h3>Đã xảy ra lỗi</h3>
            <p>{error}</p>
            <button onClick={() => fetchProfile()} className="retry-btn">
              Thử lại
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />

      <div className="profile-page">
        <div className="profile-container">
          {/* Tiêu đề trang */}
          <div className="page-header">
            <h1>Hồ sơ</h1>
            <p>Quản lý thông tin cá nhân và thiết lập tài khoản của bạn.</p>
          </div>

          {/* Breadcrumb */}
          <div className="breadcrumb">
            Tổng quan
            <span>&gt;</span>
            Hồ sơ cá nhân
          </div>

          <div className="profile-content">
            {/* Sidebar */}
            <div className="profile-sidebar">
              <div className="avatar">
                {formData.url_image ? (
                  <img
                    src={formData.url_image}
                    alt="avatar"
                    className="avatar-image"
                    onError={(e) => {
                      // Xử lý link ảnh hỏng: Ẩn thẻ img để fallback hiển thị Initials chữ cái đầu
                      e.target.style.display = "none";
                      e.target.parentElement.classList.add("avatar-fallback");
                    }}
                  />
                ) : null}
                <span className="avatar-initials">
                  {formData.first_name
                    ? formData.first_name.charAt(0).toUpperCase()
                    : "U"}
                </span>
              </div>

              <h2>
                {formData.last_name} {formData.first_name}
              </h2>

              <div className="role-badge">
                {formData.role || "Nhà nghiên cứu"}
              </div>

              {/* Status Badge động theo trạng thái is_active từ API */}
              <div
                className={`status-badge ${(user?.is_active ?? true) ? "active" : "inactive"}`}
              >
                {(user?.is_active ?? true) ? "Active" : "Inactive"}
              </div>

              <hr />

              <div className="activity-title">Hoạt động</div>

              <div className="stat-row">
                <span>Dự án đang theo dõi</span>
                <strong>2</strong>
              </div>

              <div className="stat-row">
                <span>Từ khóa đã lưu</span>
                <strong>5</strong>
              </div>
            </div>

            {/* Nội dung chính */}
            <div className="profile-card">
              <h2>Thông tin tài khoản</h2>

              <div className="form-grid">
                {/* Họ */}
                <div className="form-group">
                  <label>HỌ</label>
                  <input
                    type="text"
                    value={formData.last_name}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        last_name: e.target.value,
                      })
                    }
                  />
                </div>

                {/* Tên */}
                <div className="form-group">
                  <label>TÊN</label>
                  <input
                    type="text"
                    value={formData.first_name}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        first_name: e.target.value,
                      })
                    }
                  />
                </div>

                {/* Email (Readonly) */}
                <div className="form-group">
                  <label>ĐỊA CHỈ EMAIL</label>
                  <input
                    type="email"
                    value={formData.email}
                    readOnly
                    className="readonly-input"
                  />
                </div>

                {/* Vai trò (Readonly - Đảm bảo an toàn không cho tự thay đổi ADMINISTRATOR) */}
                <div className="form-group">
                  <label>VAI TRÒ / CHỨC DANH</label>
                  <input
                    type="text"
                    value={formData.role || "Nhà nghiên cứu"}
                    readOnly
                    className="readonly-input"
                  />
                </div>

                {/* Giới tính */}
                <div className="form-group">
                  <label>GIỚI TÍNH</label>
                  <select
                    value={formData.gender ? "male" : "female"}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        gender: e.target.value === "male",
                      })
                    }
                  >
                    <option value="male">Nam</option>
                    <option value="female">Nữ</option>
                  </select>
                </div>

                {/* Ngày sinh */}
                <div className="form-group">
                  <label>NGÀY SINH</label>
                  <input
                    type="date"
                    value={formData.date_of_birth}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        date_of_birth: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              {/* Avatar URL */}
              <div className="form-group full-width">
                <label>AVATAR URL</label>
                <input
                  type="text"
                  value={formData.url_image}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      url_image: e.target.value,
                    })
                  }
                  placeholder="https://example.com/avatar.png"
                />
              </div>

              {/* Nút lưu */}
              <div className="button-area">
                <button className="save-btn" onClick={handleSave}>
                  Lưu thay đổi
                </button>
              </div>

              {/* Danger Zone */}
              <div className="danger-zone">
                <h3>Danger Zone</h3>
                <p>Hành động này sẽ xóa tài khoản vĩnh viễn.</p>
                <button
                  className="delete-btn"
                  onClick={() => setShowDeleteModal(true)}
                >
                  Xóa tài khoản
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal xác nhận xóa */}
      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Xác nhận xóa tài khoản</h3>
            <p>
              Bạn có chắc muốn xóa tài khoản này không? Hành động này không thể
              hoàn tác.
            </p>
            <div className="modal-actions">
              <button
                className="cancel-btn"
                onClick={() => setShowDeleteModal(false)}
              >
                Hủy
              </button>
              <button className="delete-confirm-btn" onClick={handleDelete}>
                Xóa tài khoản
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
