/**
 * File: features/project/components/UpgradePlanModal.jsx
 * Modal hiển thị so sánh gói Free vs VIP khi user bấm "Kích hoạt gói"
 */
import { useState } from 'react';
import { Modal, Spinner } from 'react-bootstrap';
import { Icon } from '@iconify/react';
import { useNavigate } from 'react-router-dom';
import ROUTES from '../../../app/routes/routePaths';
import { activateProjectApi } from '../api/project.api';
import { toast } from '../../../shared/utils/toast';
import { useWalletStore } from '../../../app/store/walletStore';
import './UpgradePlanModal.css';

const FREE_FEATURES = [
  { text: 'Tạo và quản lý dự án', included: true },
  { text: 'Theo dõi từ khóa cơ bản', included: true },
  { text: 'Xem bài báo liên quan', included: true },
  { text: 'Phân tích trending đa chiều', included: false },
  { text: 'Biểu đồ nâng cao (Chart)', included: false },
  { text: 'AI Chatbot hỗ trợ phân tích', included: false },
  { text: 'Tìm kiếm thông minh AI', included: false },
];

const VIP_FEATURES = [
  { text: 'Tất cả tính năng Free', icon: 'check' },
  { text: 'Phân tích trending đa chiều với nhiều loại biểu đồ', icon: 'star' },
  { text: 'Biểu đồ nâng cao: Line, Bar, Pie, Radar, Heatmap...', icon: 'star' },
  { text: 'AI Chatbot hỗ trợ phân tích & tìm kiếm thông minh', icon: 'star' },
  { text: 'So sánh xu hướng giữa các lĩnh vực', icon: 'star' },
  { text: 'Xuất báo cáo & dữ liệu phân tích', icon: 'star' },
  { text: 'Ưu tiên xử lý & hỗ trợ nhanh', icon: 'star' },
];

const UpgradePlanModal = ({ show, onHide, projectId, onSuccess }) => {
  const navigate = useNavigate();
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const fetchWallet = useWalletStore((state) => state.fetchWallet);

  const handleActivate = async () => {
    if (!projectId) {
      toast.error("Không tìm thấy dự án.");
      return;
    }
    try {
      setLoading(true);
      const res = await activateProjectApi(projectId, 25);
      if (res.data?.success) {
        toast.success("Kích hoạt dự án thành công!");
        setShowConfirm(false);
        onHide();
        fetchWallet();
        if (onSuccess) onSuccess();
      }
    } catch (error) {
      const errCode = error.response?.data?.code;
      if (errCode === 'INSUFFICIENT_BALANCE') {
        toast.warning("Số dư coin của bạn không đủ. Vui lòng nạp thêm!");
      } else if (errCode === 'PROJECT_ALREADY_ACTIVE') {
        toast.info("Dự án này đã được kích hoạt rồi.");
      } else {
        toast.error(error.response?.data?.message || "Có lỗi xảy ra, vui lòng thử lại sau.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Modal
        show={show}
        onHide={onHide}
        centered
        className="upgrade-modal-wrapper"
        dialogClassName="upgrade-modal"
      >
        <Modal.Header closeButton className="border-bottom-0 pb-0" />
        <Modal.Body>
          <div className="upgrade-modal-content">
            <div className="upgrade-modal-left">
              <div className="upgrade-modal-title">Nâng cấp trải nghiệm nghiên cứu</div>
              <div className="upgrade-modal-subtitle">
                Mở khóa bộ công cụ phân tích chuyên sâu, trực quan hóa dữ liệu đa chiều và trợ lý AI hỗ trợ nghiên cứu theo thời gian thực.
              </div>
              <div className="upgrade-modal-intro">
                <div className="upgrade-modal-intro__badge">
                  <Icon icon="lucide:shield-check" width="15" /> So sánh quyền lợi
                </div>
                <p className="upgrade-modal-intro__text mb-0">
                  Gói Free phù hợp để theo dõi cơ bản. Gói VIP dành cho nhu cầu phân tích trending chuyên sâu, trực quan hóa dữ liệu bằng nhiều biểu đồ và AI hỗ trợ khai phá insight nhanh hơn.
                </p>
              </div>
            </div>

            <div className="upgrade-modal-right">
              <div className="pricing-grid">
                {/* FREE Plan */}
                <div className="upgrade-plan-card upgrade-plan-card--free">
                  <span className="upgrade-plan-badge upgrade-plan-badge--free">
                    <Icon icon="lucide:user" width="13" /> Gói hiện tại
                  </span>
                  <div className="upgrade-plan-name">Free</div>
                  <div className="upgrade-plan-price">
                    <strong>0₫</strong> / vĩnh viễn
                  </div>
                  <div className="upgrade-plan-description">
                    Phù hợp để tạo dự án, quản lý từ khóa và theo dõi bài báo ở mức cơ bản.
                  </div>
                  <hr className="upgrade-plan-divider" />
                  <ul className="upgrade-plan-features">
                    {FREE_FEATURES.map((f, i) => (
                      <li key={i} className="upgrade-plan-feature">
                        <Icon
                          icon={f.included ? "lucide:check" : "lucide:x"}
                          width="16"
                          className={`upgrade-plan-feature-icon ${f.included ? 'upgrade-plan-feature-icon--check' : 'upgrade-plan-feature-icon--cross'}`}
                        />
                        <span style={!f.included ? { textDecoration: 'line-through', opacity: 0.5 } : {}}>
                          {f.text}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <button className="upgrade-plan-cta upgrade-plan-cta--free" disabled>
                    <Icon icon="lucide:check-circle" width="16" /> Gói hiện tại
                  </button>
                </div>

                {/* VIP Plan */}
                <div className="upgrade-plan-card upgrade-plan-card--vip">
                  <div className="upgrade-plan-recommended">Đề xuất</div>
                  <span className="upgrade-plan-badge upgrade-plan-badge--vip">
                    <Icon icon="lucide:crown" width="13" /> Premium
                  </span>
                  <div className="upgrade-plan-name">VIP</div>
                  <div className="upgrade-plan-price">
                    <strong>25 Coin</strong> / Project
                  </div>
                  <div className="upgrade-plan-description upgrade-plan-description--vip">
                    Dành cho người dùng cần phân tích chuyên sâu, dashboard đa biểu đồ và trợ lý AI để tăng tốc quá trình nghiên cứu.
                  </div>
                  <hr className="upgrade-plan-divider" />
                  <ul className="upgrade-plan-features">
                    {VIP_FEATURES.map((f, i) => (
                      <li key={i} className="upgrade-plan-feature">
                        <Icon
                          icon={f.icon === 'star' ? "lucide:sparkles" : "lucide:check"}
                          width="16"
                          className={`upgrade-plan-feature-icon ${f.icon === 'star' ? 'upgrade-plan-feature-icon--star' : 'upgrade-plan-feature-icon--check'}`}
                        />
                        <span>{f.text}</span>
                      </li>
                    ))}
                  </ul>
                  <button
                    className="upgrade-plan-cta upgrade-plan-cta--vip"
                    onClick={() => setShowConfirm(true)}
                  >
                    <Icon icon="lucide:zap" width="16" /> Nâng cấp VIP ngay
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal>

      {/* Confirmation Modal */}
      <Modal show={showConfirm} onHide={() => !loading && setShowConfirm(false)} centered backdrop="static" style={{ zIndex: 1060 }}>
        <Modal.Header closeButton={!loading}>
          <Modal.Title style={{ fontFamily: 'var(--font-display)', fontWeight: 700 }}>Xác nhận kích hoạt VIP</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p style={{ fontSize: '1rem', color: 'var(--text-main)', marginBottom: 0 }}>
            Bạn có chắc chắn muốn kích hoạt gói VIP cho dự án này không?<br />
            Bạn sẽ bị trừ <strong>25 Coin</strong> từ ví.
          </p>
        </Modal.Body>
        <Modal.Footer style={{ borderTop: 'none', paddingTop: 0 }}>
          <button className="btn btn-light" onClick={() => setShowConfirm(false)} disabled={loading} style={{ borderRadius: '8px', fontWeight: 600 }}>
            Hủy
          </button>
          <button className="btn btn-primary" onClick={handleActivate} disabled={loading} style={{ borderRadius: '8px', fontWeight: 600, background: 'linear-gradient(135deg, #ff702f, #f97316)', border: 'none', color: '#fff' }}>
            {loading ? <Spinner size="sm" /> : 'Xác nhận kích hoạt'}
          </button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default UpgradePlanModal;
