import { useTranslation } from "react-i18next";
import { t } from "i18next";
import "../styles/ProfilePage.css";
import Header from "../../landing/components/Header";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../../auth/hooks/useAuth";
import { isAuthenticated as isAuthenticatedUtil } from "../../../shared/utils/auth";
export default function ProfilePage() {
  const { t: _t } = useTranslation();
  const {
    user,
    isAuthenticated,
    fetchProfile,
    updateProfile,
    deleteAccount,
    isLoading,
    error
  } = useAuth();
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
    url_image: ""
  });
  const computedIsAuthenticated = useMemo(() => {
    if (user) return true;
    if (isAuthenticated) return true;
    // Nếu Zustand chưa hydrate kịp nhưng util kiểm tra cookie vẫn hợp lệ
    // thì cũng xem như đã đăng nhập để tránh render sai.
    return false;
  }, [isAuthenticated, user]);

  // Gọi API profile nếu đã auth.
  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      // nếu store chưa hydrate nhưng cookie vẫn tồn tại thì thử kiểm tra util
      const shouldFetch = computedIsAuthenticated || (await isAuthenticatedUtil());
      if (!cancelled && shouldFetch) {
        try {
          await fetchProfile();
        } catch (e) {
          // nếu BE trả lỗi nhưng cookie vẫn có (hoặc endpoint không khớp payload),
          // tránh hard-crash và để UI hiển thị error state từ hook.
        }
      }
    };
    run();
    return () => {
      cancelled = true;
    };
  }, [computedIsAuthenticated, fetchProfile]);

  // Đổ dữ liệu user vào form
  useEffect(() => {
    if (user) {
      setFormData({
        first_name: user.first_name || "",
        last_name: user.last_name || "",
        email: user.email || "",
        role: user.role || "",
        gender: user.gender ?? true,
        date_of_birth: (() => {
          const v = user.date_of_birth;
          if (!v) return "";
          // input[type=date] cần yyyy-MM-dd
          if (typeof v === 'string') {
            // nếu backend trả ISO: 2005-02-27T17:00:00.000Z
            if (v.includes('T')) return v.slice(0, 10);
            return v;
          }
          // nếu backend trả Date object
          if (v instanceof Date) return v.toISOString().slice(0, 10);
          return String(v);
        })(),
        url_image: user.url_image || ""
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
        url_image: formData.url_image
      });
      alert(t("profile.capNhatThanhCong"));
    } catch (err) {
      console.error(err);
      alert(t("profile.capNhatThatBai"));
    }
  };

  // Logic xóa tài khoản thực tế sử dụng điều hướng navigate
  const handleDelete = async () => {
    if (deleteAccount) {
      try {
        await deleteAccount();
        alert(t("profile.xoaTaiKhoanThanhCong"));
        navigate("/login");
      } catch (err) {
        console.error(err);
        alert(t("profile.xoaTaiKhoanThatBai"));
      }
    } else {
      alert(t("profile.chucNangXoaTaiKhoanDangChoBack"));
    }
    setShowDeleteModal(false);
  };

  // Sửa lỗi Loading State lặp (Chỉ hiển thị loading khi chưa có dữ liệu user)
  if (isLoading && !user) {
    return <>
        <Header />
        <div className="loading-state">
          <div className="spinner"></div>
          <p>{t("journal.dangTaiDuLieu")}</p>
        </div>
      </>;
  }

  // Error State - Hiển thị lỗi tường minh
  if (error) {
    return <>
        <Header />
        <div className="error-state">
          <div className="error-box">
            <h3>{t("profile.daXayRaLoi")}</h3>
            <p>{error}</p>
            <button onClick={() => fetchProfile()} className="retry-btn">{t("article.thuLai")}</button>
          </div>
        </div>
      </>;
  }
  return <>
      <Header />

      {!computedIsAuthenticated ? <div className="profile-page">
          <div className="profile-container">
            <div className="page-header">
              <h1>{t("profile.hoSo")}</h1>
              <p>{t("profile.quanLyThongTinCaNhanVaThietLap")}</p>
            </div>

            <div style={{
          background: "white",
          borderRadius: "20px",
          padding: "60px 40px",
          textAlign: "center",
          marginTop: "40px",
          boxShadow: "0 2px 10px rgba(0, 0, 0, 0.06)"
        }}>
              <h2 style={{
            marginBottom: "16px"
          }}>{t("profile.vuiLongDangNhap")}</h2>
              <p style={{
            color: "#666",
            marginBottom: "32px",
            fontSize: "16px"
          }}>{t("profile.banCanDangNhapDeXemVaQuanLyHoS")}</p>
              <button onClick={() => navigate("/login")} style={{
            background: "#ff7a30",
            color: "white",
            border: "none",
            padding: "12px 32px",
            borderRadius: "10px",
            fontSize: "16px",
            fontWeight: "600",
            cursor: "pointer",
            marginRight: "12px"
          }}>{t("signIn")}</button>
              <button onClick={() => navigate("/register")} style={{
            background: "transparent",
            color: "#ff7a30",
            border: "2px solid #ff7a30",
            padding: "10px 30px",
            borderRadius: "10px",
            fontSize: "16px",
            fontWeight: "600",
            cursor: "pointer"
          }}>{t("profile.dangKi")}</button>
            </div>
          </div>
        </div> : <div className="profile-page">
          <div className="profile-container">
            <div className="page-header">
              <h1>{t("profile.hoSo")}</h1>
              <p>{t("profile.quanLyThongTinCaNhanVaThietLap")}</p>
            </div>

            <div className="breadcrumb">{t("author.tongQuan")}<span>&gt;</span>{t("profile.hoSoCaNhan")}</div>

            <div className="profile-content">
              <div className="profile-sidebar">
                <div className="avatar">
                  {formData.url_image ? <img src={formData.url_image} alt="avatar" className="avatar-image" onError={e => {
                e.target.style.display = "none";
                if (e.target.nextElementSibling) {
                  e.target.nextElementSibling.style.display = "flex";
                }
              }} /> : <span className="avatar-initials" style={{
                display: formData.url_image ? "none" : "flex",
                alignItems: "center",
                justifyContent: "center"
              }}>
                    {formData.first_name ? formData.first_name.charAt(0).toUpperCase() : formData.last_name ? formData.last_name.charAt(0).toUpperCase() : "U"}
                  </span>}
                  
                </div>

                <h2>
                  {formData.last_name} {formData.first_name}
                </h2>

                <div className="role-badge">
                  {formData.role || t("auth.nhaNghienCuu")}
                </div>

                <div className={`status-badge ${user?.is_active ?? true ? "active" : "inactive"}`}>
                  {user?.is_active ?? true ? "Active" : "Inactive"}
                </div>

                <hr />

                <div className="activity-title">{t("admin.hoatDong")}</div>

                <div className="stat-row">
                  <span>{t("profile.duAnDangTheoDoi")}</span>
                  <strong>2</strong>
                </div>

                <div className="stat-row">
                  <span>{t("profile.tuKhoaDaLuu")}</span>
                  <strong>5</strong>
                </div>
              </div>

              <div className="profile-card">
                <h2>{t("profile.thongTinTaiKhoan")}</h2>

                <div className="form-grid">
                  <div className="form-group">
                    <label>{t("profile.ho")}</label>
                    <input type="text" value={formData.last_name} onChange={e => setFormData({
                  ...formData,
                  last_name: e.target.value
                })} />
                  </div>

                  <div className="form-group">
                    <label>{t("profile.ten")}</label>
                    <input type="text" value={formData.first_name} onChange={e => setFormData({
                  ...formData,
                  first_name: e.target.value
                })} />
                  </div>

                  <div className="form-group">
                    <label>{t("auth.diaChiEmail")}</label>
                    <input type="email" value={formData.email} readOnly className="readonly-input" />
                  </div>

                  <div className="form-group">
                    <label>{t("profile.vaiTroChucDanh")}</label>
                    <input type="text" value={formData.role || t("auth.nhaNghienCuu")} readOnly className="readonly-input" />
                  </div>

                  <div className="form-group">
                    <label>{t("profile.gioiTinh")}</label>
                    <select value={formData.gender ? "male" : "female"} onChange={e => setFormData({
                  ...formData,
                  gender: e.target.value === "male"
                })}>
                      <option value="male">Nam</option>
                      <option value="female">{t("auth.nu")}</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>{t("profile.ngaySinh")}</label>
                    <input type="date" value={formData.date_of_birth} onChange={e => setFormData({
                  ...formData,
                  date_of_birth: e.target.value
                })} />
                  </div>
                </div>

                <div className="form-group full-width">
                  <label>AVATAR URL</label>
                  <input type="text" value={formData.url_image} onChange={e => setFormData({
                ...formData,
                url_image: e.target.value
              })} placeholder={t("profile.httpsexamplecomavatarpng")} />
                </div>

                <div className="button-area">
                  <button className="save-btn" onClick={handleSave}>{t("admin.luuThayDoi")}</button>
                </div>

                <div className="danger-zone">
                  <h3>Danger Zone</h3>
                  <p>{t("profile.hanhDongNaySeXoaTaiKhoanVinhVi")}</p>
                  <button className="delete-btn" onClick={() => setShowDeleteModal(true)}>{t("profile.xoaTaiKhoan")}</button>
                </div>
              </div>
            </div>
          </div>
        </div>}

      {showDeleteModal && isAuthenticated && <div className="modal-overlay">
          <div className="modal-content">
            <h3>{t("profile.xacNhanXoaTaiKhoan")}</h3>
            <p>{t("profile.banCoChacMuonXoaTaiKhoanNayKho")}</p>
            <div className="modal-actions">
              <button className="cancel-btn" onClick={() => setShowDeleteModal(false)}>{t("admin.huy")}</button>
              <button className="delete-confirm-btn" onClick={handleDelete}>{t("profile.xoaTaiKhoan")}</button>
            </div>
          </div>
        </div>}
    </>;
}