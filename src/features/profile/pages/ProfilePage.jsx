import "../styles/ProfilePage.css";
import Header from "../../landing/components/Header";

export default function ProfilePage() {
  return (
    <>
      <Header />
      <div className="profile-page">
        <div className="profile-container">
          <div className="breadcrumb">
            Tổng quan <span>&gt;</span> Hồ sơ cá nhân
          </div>

          <div className="profile-content">
            <div className="profile-sidebar">
              <div className="avatar">H</div>

              <h2>Phùng Hào</h2>

              <p className="role">Nhà nghiên cứu</p>

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

            <div className="profile-card">
              <h2>Thông tin tài khoản</h2>

              <div className="form-row">
                <div className="form-group">
                  <label>HỌ VÀ TÊN</label>
                  <input type="text" value="Phùng Hào" readOnly />
                </div>

                <div className="form-group">
                  <label>VAI TRÒ / CHỨC DANH</label>
                  <input type="text" value="Nhà nghiên cứu" readOnly />
                </div>
              </div>

              <div className="form-group full-width">
                <label>ĐỊA CHỈ EMAIL</label>

                <input type="email" value="phunghao2701@gmail.com" readOnly />
              </div>

              <div className="button-area">
                <button className="save-btn">Lưu thay đổi</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
