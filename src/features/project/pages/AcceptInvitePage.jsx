import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';
import ROUTES from '../../../app/routes/routePaths';
import projectService from '../services/projectService';
import PrimaryButton from '../../../shared/components/Button/PrimaryButton';
import Header from '../../landing/components/Header';

const AcceptInvitePage = () => {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('loading'); // loading, success, error
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const token = searchParams.get('token');
    if (!token) {
      setStatus('error');
      setErrorMessage(t("project.loiXacNhan", "Token xác nhận không hợp lệ hoặc đã hết hạn."));
      return;
    }

    const confirmInvite = async () => {
      try {
        await projectService.acceptProjectInvite(token);
        setStatus('success');
      } catch (error) {
        setStatus('error');
        setErrorMessage(error.response?.data?.message || t("project.daXayRaLoiKhiXacNhan", "Có lỗi xảy ra khi xác nhận lời mời."));
      }
    };

    confirmInvite();
  }, [searchParams]);

  return (
    <div className="container-fluid pb-4 grid-bg min-vh-100 position-relative overflow-hidden" style={{ paddingTop: '80px' }}>
      <Header />
      <div className="container mx-auto position-relative z-1 d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
        <div className="glass-card rounded-4 shadow-sm border p-5 text-center" style={{ maxWidth: '500px', width: '100%' }}>
          {status === 'loading' && (
            <>
              <div className="spinner-border text-primary mb-4" role="status" style={{ width: '3rem', height: '3rem' }}></div>
              <h4 className="fw-bold text-main mb-2">{t("project.dangXuLy", "Đang xử lý lời mời...")}</h4>
              <p className="text-muted-custom">{t("project.vuiLongChoTrongGiayLat", "Vui lòng chờ trong giây lát.")}</p>
            </>
          )}

          {status === 'success' && (
            <>
              <div className="rounded-circle bg-success bg-opacity-10 d-inline-flex p-3 mb-4">
                <Icon icon="lucide:check-circle" width="48" className="text-success" />
              </div>
              <h4 className="fw-bold text-main mb-2">{t("project.xacNhanThanhCong", "Xác nhận thành công!")}</h4>
              <p className="text-muted-custom mb-4">{t("project.banDaDuocThemVaoDuAnThanhCong", "Bạn đã được thêm vào dự án thành công. Bây giờ bạn có thể truy cập dự án.")}</p>
              <PrimaryButton className="w-100" onClick={() => navigate(ROUTES.PROJECTS)}>
                {t("project.chuyenDenDanhSachDuAn", "Chuyển đến danh sách dự án")}
              </PrimaryButton>
            </>
          )}

          {status === 'error' && (
            <>
              <div className="rounded-circle bg-danger bg-opacity-10 d-inline-flex p-3 mb-4">
                <Icon icon="lucide:x-circle" width="48" className="text-danger" />
              </div>
              <h4 className="fw-bold text-main mb-2">{t("project.xacNhanThatBai", "Xác nhận thất bại")}</h4>
              <p className="text-danger mb-4">{errorMessage}</p>
              <PrimaryButton variant="outline" className="w-100" onClick={() => navigate(ROUTES.HOME)}>
                {t("project.troVeTrangChu", "Trở về trang chủ")}
              </PrimaryButton>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AcceptInvitePage;
