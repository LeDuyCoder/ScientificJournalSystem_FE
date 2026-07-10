import { t } from "i18next";
import { useTranslation } from "react-i18next";
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
const FREE_FEATURES = [{
  text: t("project.taoVaQuanLyDuAn"),
  included: true
}, {
  text: t("project.theoDoiTuKhoaCoBan"),
  included: true
}, {
  text: t("article.xemBaiBaoLienQuan"),
  included: true
}, {
  text: t("project.phanTichTrendingDaChieu"),
  included: false
}, {
  text: t("project.bieuDoNangCaoChart"),
  included: false
}, {
  text: t("project.aiChatbotHoTroPhanTich"),
  included: false
}, {
  text: t("project.timKiemThongMinhAi"),
  included: false
}];
const VIP_FEATURES = [{
  text: t("project.tatCaTinhNangFree"),
  icon: 'check'
}, {
  text: t("project.phanTichTrendingDaChieuVoiNhie"),
  icon: 'star'
}, {
  text: t("project.bieuDoNangCaoLineBarPieRadarHe"),
  icon: 'star'
}, {
  text: t("project.aiChatbotHoTroPhanTichTimKiemT"),
  icon: 'star'
}, {
  text: t("project.soSanhXuHuongGiuaCacLinhVuc"),
  icon: 'star'
}, {
  text: t("project.xuatBaoCaoDuLieuPhanTich"),
  icon: 'star'
}, {
  text: t("project.uuTienXuLyHoTroNhanh"),
  icon: 'star'
}];
const UpgradePlanModal = ({
  show,
  onHide,
  projectId,
  onSuccess
}) => {
  const navigate = useNavigate();
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const fetchWallet = useWalletStore(state => state.fetchWallet);
  const handleActivate = async () => {
    const {
      t
    } = useTranslation();
    if (!projectId) {
      toast.error(t("project.khongTimThayDuAn"));
      return;
    }
    try {
      setLoading(true);
      const res = await activateProjectApi(projectId, 25);
      if (res.data?.success) {
        toast.success(t("project.kichHoatDuAnThanhCong"));
        setShowConfirm(false);
        onHide();
        fetchWallet();
        if (onSuccess) onSuccess();
      }
    } catch (error) {
      const errCode = error.response?.data?.code;
      if (errCode === 'INSUFFICIENT_BALANCE') {
        toast.warning(t("project.soDuCoinCuaBanKhongDuVuiLongNa"));
      } else if (errCode === 'PROJECT_ALREADY_ACTIVE') {
        toast.info(t("project.duAnNayDaDuocKichHoatRoi"));
      } else {
        toast.error(error.response?.data?.message || t("project.coLoiXayRaVuiLongThuLaiSau"));
      }
    } finally {
      setLoading(false);
    }
  };
  return <>
      <Modal show={show} onHide={onHide} centered className="upgrade-modal-wrapper" dialogClassName="upgrade-modal">
        <Modal.Header closeButton className="border-bottom-0 pb-0" />
        <Modal.Body>
          <div className="upgrade-modal-content">
            <div className="upgrade-modal-left">
              <div className="upgrade-modal-title">{t("project.nangCapTraiNghiemNghienCuu")}</div>
              <div className="upgrade-modal-subtitle">{t("project.moKhoaBoCongCuPhanTichChuyenSa")}</div>
              <div className="upgrade-modal-intro">
                <div className="upgrade-modal-intro__badge">
                  <Icon icon="lucide:shield-check" width="15" />{t("project.soSanhQuyenLoi")}</div>
                <p className="upgrade-modal-intro__text mb-0">{t("project.goiFreePhuHopDeTheoDoiCoBanGoi")}</p>
              </div>
            </div>

            <div className="upgrade-modal-right">
              <div className="pricing-grid">
                {/* FREE Plan */}
                <div className="upgrade-plan-card upgrade-plan-card--free">
                  <span className="upgrade-plan-badge upgrade-plan-badge--free">
                    <Icon icon="lucide:user" width="13" />{t("project.goiHienTai")}</span>
                  <div className="upgrade-plan-name">Free</div>
                  <div className="upgrade-plan-price">
                    <strong>0₫</strong>{t("project.vinhVien")}</div>
                  <div className="upgrade-plan-description">{t("project.phuHopDeTaoDuAnQuanLyTuKhoaVaT")}</div>
                  <hr className="upgrade-plan-divider" />
                  <ul className="upgrade-plan-features">
                    {FREE_FEATURES.map((f, i) => <li key={i} className="upgrade-plan-feature">
                        <Icon icon={f.included ? "lucide:check" : "lucide:x"} width="16" className={`upgrade-plan-feature-icon ${f.included ? 'upgrade-plan-feature-icon--check' : 'upgrade-plan-feature-icon--cross'}`} />
                        <span style={!f.included ? {
                      textDecoration: 'line-through',
                      opacity: 0.5
                    } : {}}>
                          {f.text}
                        </span>
                      </li>)}
                  </ul>
                  <button className="upgrade-plan-cta upgrade-plan-cta--free" disabled>
                    <Icon icon="lucide:check-circle" width="16" />{t("project.goiHienTai")}</button>
                </div>

                {/* VIP Plan */}
                <div className="upgrade-plan-card upgrade-plan-card--vip">
                  <div className="upgrade-plan-recommended">{t("project.deXuat")}</div>
                  <span className="upgrade-plan-badge upgrade-plan-badge--vip">
                    <Icon icon="lucide:crown" width="13" /> Premium
                  </span>
                  <div className="upgrade-plan-name">VIP</div>
                  <div className="upgrade-plan-price">
                    <strong>25 Coin</strong> / Project
                  </div>
                  <div className="upgrade-plan-description upgrade-plan-description--vip">{t("project.danhChoNguoiDungCanPhanTichChu")}</div>
                  <hr className="upgrade-plan-divider" />
                  <ul className="upgrade-plan-features">
                    {VIP_FEATURES.map((f, i) => <li key={i} className="upgrade-plan-feature">
                        <Icon icon={f.icon === 'star' ? "lucide:sparkles" : "lucide:check"} width="16" className={`upgrade-plan-feature-icon ${f.icon === 'star' ? 'upgrade-plan-feature-icon--star' : 'upgrade-plan-feature-icon--check'}`} />
                        <span>{f.text}</span>
                      </li>)}
                  </ul>
                  <button className="upgrade-plan-cta upgrade-plan-cta--vip" onClick={() => setShowConfirm(true)}>
                    <Icon icon="lucide:zap" width="16" />{t("project.nangCapVipNgay")}</button>
                </div>
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal>

      {/* Confirmation Modal */}
      <Modal show={showConfirm} onHide={() => !loading && setShowConfirm(false)} centered backdrop="static" style={{
      zIndex: 1060
    }}>
        <Modal.Header closeButton={!loading}>
          <Modal.Title style={{
          fontFamily: 'var(--font-display)',
          fontWeight: 700
        }}>{t("project.xacNhanKichHoatVip")}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p style={{
          fontSize: '1rem',
          color: 'var(--text-main)',
          marginBottom: 0
        }}>{t("project.banCoChacChanMuonKichHoatGoiVi")}<br />{t("project.banSeBiTru")}<strong>25 Coin</strong>{t("project.tuVi")}</p>
        </Modal.Body>
        <Modal.Footer style={{
        borderTop: 'none',
        paddingTop: 0
      }}>
          <button className="btn btn-light" onClick={() => setShowConfirm(false)} disabled={loading} style={{
          borderRadius: '8px',
          fontWeight: 600
        }}>{t("admin.huy")}</button>
          <button className="btn btn-primary" onClick={handleActivate} disabled={loading} style={{
          borderRadius: '8px',
          fontWeight: 600,
          background: 'linear-gradient(135deg, #ff702f, #f97316)',
          border: 'none',
          color: '#fff'
        }}>
            {loading ? <Spinner size="sm" /> : t("project.xacNhanKichHoat")}
          </button>
        </Modal.Footer>
      </Modal>
    </>;
};
export default UpgradePlanModal;