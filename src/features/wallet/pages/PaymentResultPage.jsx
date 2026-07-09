import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';
import Header from '../../landing/components/Header';
import ROUTES from '../../../app/routes/routePaths';
import { useWalletStore } from '../../../app/store/walletStore';
import { confirmVnpayIpn, getMyWallet, getPaymentStatus } from '../api/walletApi';
import './PaymentResultPage.css';

export default function PaymentResultPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { setBalance, fetchWallet } = useWalletStore();

  const [stage, setStage] = useState('pending');
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [payment, setPayment] = useState(null);
  const [walletBalance, setWalletBalance] = useState(null);

  const searchParams = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const transactionId =
    searchParams.get('transactionId') ||
    searchParams.get('vnp_TxnRef') ||
    searchParams.get('txnRef') ||
    '';

  useEffect(() => {
    let mounted = true;

    const runFlow = async () => {
      setLoading(true);
      setErrorMessage('');
      setStage('pending');

      try {
        const ipnResponse = await confirmVnpayIpn(location.search);
        const rspCode = ipnResponse?.RspCode;
        const ipnSuccess = rspCode === '00';

        let paymentData = null;
        if (transactionId) {
          try {
            const paymentRes = await getPaymentStatus(transactionId);
            paymentData = paymentRes?.data || null;
            if (mounted) setPayment(paymentData);
          } catch {
            // keep IPN result if payment detail fails
          }
        }

        if (!mounted) return;

        const paymentStatus = paymentData?.payment_status;
        const hasPaymentStatus = Boolean(paymentStatus);
        const shouldShowSuccess = paymentStatus === 'success' || (!hasPaymentStatus && ipnSuccess);
        const shouldShowFailed =
          paymentStatus === 'failed' ||
          paymentStatus === 'cancelled' ||
          paymentStatus === 'refunded' ||
          (!hasPaymentStatus && (rspCode === '24' || rspCode === '97' || ipnSuccess === false));

        // Chỉ refresh ví khi backend payment thật sự success, hoặc không lấy được payment detail nhưng IPN báo success.
        if (shouldShowSuccess) {
          try {
            const walletRes = await getMyWallet();
            const balance = walletRes?.data?.balance;
            if (typeof balance === 'number') {
              setWalletBalance(balance);
              setBalance(balance);
            }
            fetchWallet();
          } catch {
            // ignore wallet refresh failure in result UI
          }
        }

        if (shouldShowSuccess) {
          setStage('success');
        } else if (shouldShowFailed) {
          setStage('failed');
          setErrorMessage(paymentData?.note || ipnResponse?.Message || 'Giao dịch chưa được xác nhận thành công.');
        } else {
          setStage('pending');
          setErrorMessage(paymentData?.note || ipnResponse?.Message || 'Hệ thống đang chờ xác nhận giao dịch từ VNPay.');
        }
      } catch (err) {
        if (!mounted) return;
        setStage('failed');
        setErrorMessage(err?.response?.data?.message || err?.message || 'Không thể xác minh giao dịch.');
      } finally {
        if (mounted) setLoading(false);
      }
    };

    runFlow();
    return () => {
      mounted = false;
    };
  }, [location.search, transactionId, fetchWallet, setBalance]);

  const formatCoin = (n) =>
    Number.isInteger(n)
      ? Number(n || 0).toLocaleString('en-US')
      : Number(n || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const formatVND = (n) => Number(n || 0).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });

  const statusUI = {
    success: {
      iconClass: 'success',
      icon: 'lucide:badge-check',
      title: 'Thanh toán thành công',
      subtitle: 'Giao dịch của bạn đã được xác nhận. Coin sẽ được cộng vào ví ngay khi hệ thống hoàn tất đồng bộ.',
    },
    failed: {
      iconClass: 'failed',
      icon: 'lucide:circle-x',
      title: 'Thanh toán thất bại',
      subtitle: 'Giao dịch chưa hoàn tất. Bạn có thể thử lại với gói coin khác hoặc kiểm tra phương thức thanh toán.',
    },
    pending: {
      iconClass: 'pending',
      icon: 'lucide:clock-3',
      title: 'Đang xác nhận giao dịch',
      subtitle: 'Hệ thống đang xử lý kết quả thanh toán từ VNPay. Vui lòng đợi trong giây lát hoặc thử tải lại trang.',
    },
  };

  const currentStatus = statusUI[stage];

  return (
    <div className="payment-result-page">
      <Header />
      <div className="payment-result-inner">
        <div className="payment-result-shell">
          <div className={`payment-result-icon ${currentStatus.iconClass}`}>
            {loading ? (
              <span className="spinner-border spinner-border-sm" role="status" />
            ) : (
              <Icon icon={currentStatus.icon} width={38} />
            )}
          </div>

          <h1 className="payment-result-title">{loading ? 'Đang kiểm tra giao dịch...' : currentStatus.title}</h1>
          <p className="payment-result-subtitle">
            {loading ? 'Hệ thống đang đồng bộ trạng thái thanh toán với VNPay và ví coin của bạn.' : currentStatus.subtitle}
          </p>

          <div className="payment-result-card">
            <div className="payment-result-balance">
              <div>
                <div className="payment-result-balance__label">Số dư ví hiện tại</div>
                <div className="payment-result-balance__value">
                  {walletBalance == null ? '—' : formatCoin(walletBalance)} Coins
                </div>
              </div>
              {payment?.payment_status && (
                <div className="payment-result-info" style={{ minWidth: 150 }}>
                  <div className="payment-result-info__label">Trạng thái</div>
                  <div className="payment-result-info__value">{payment.payment_status}</div>
                </div>
              )}
            </div>

            <div className="payment-result-grid">
              <div className="payment-result-info">
                <div className="payment-result-info__label">Mã giao dịch</div>
                <div className="payment-result-info__value">{payment?.transaction_id || transactionId || '—'}</div>
              </div>
              <div className="payment-result-info">
                <div className="payment-result-info__label">Phương thức</div>
                <div className="payment-result-info__value">{payment?.payment_method || 'vnpay'}</div>
              </div>
              <div className="payment-result-info">
                <div className="payment-result-info__label">Gói coin</div>
                <div className="payment-result-info__value">{payment?.package_name || 'Gói coin đã chọn'}</div>
              </div>
              <div className="payment-result-info">
                <div className="payment-result-info__label">Số tiền</div>
                <div className="payment-result-info__value">{payment?.amount ? formatVND(payment.amount) : '—'}</div>
              </div>
              <div className="payment-result-info">
                <div className="payment-result-info__label">Tổng coin nhận</div>
                <div className="payment-result-info__value">{payment?.total_coin ? `${formatCoin(payment.total_coin)} Coins` : '—'}</div>
              </div>
              <div className="payment-result-info">
                <div className="payment-result-info__label">Thời gian</div>
                <div className="payment-result-info__value">{payment?.paid_at || payment?.created_at || '—'}</div>
              </div>
            </div>
          </div>

          {!loading && stage === 'failed' && errorMessage && (
            <div className="payment-result-alert failed">
              <Icon icon="lucide:triangle-alert" width={16} style={{ marginTop: 2, flexShrink: 0 }} />
              <span>{errorMessage}</span>
            </div>
          )}

          {!loading && stage === 'pending' && errorMessage && (
            <div className="payment-result-alert pending">
              <Icon icon="lucide:info" width={16} style={{ marginTop: 2, flexShrink: 0 }} />
              <span>{errorMessage}</span>
            </div>
          )}

          <div className="payment-result-actions">
            {stage === 'success' ? (
              <>
                <button type="button" className="payment-result-btn primary" onClick={() => navigate(ROUTES.WALLET_TOP_UP)}>
                  <Icon icon="lucide:wallet" width={16} />
                  Nạp thêm coin
                </button>
                <button type="button" className="payment-result-btn" onClick={() => navigate(ROUTES.DASHBOARD)}>
                  <Icon icon="lucide:layout-dashboard" width={16} />
                  Quay về Dashboard
                </button>
              </>
            ) : stage === 'failed' ? (
              <>
                <button type="button" className="payment-result-btn primary" onClick={() => navigate(ROUTES.WALLET_TOP_UP)}>
                  <Icon icon="lucide:rotate-ccw" width={16} />
                  Thử lại
                </button>
                <button type="button" className="payment-result-btn" onClick={() => navigate(-1)}>
                  <Icon icon="lucide:arrow-left" width={16} />
                  Quay lại
                </button>
              </>
            ) : (
              <>
                <button type="button" className="payment-result-btn primary" onClick={() => window.location.reload()}>
                  <Icon icon="lucide:refresh-cw" width={16} />
                  Kiểm tra lại trạng thái
                </button>
                <button type="button" className="payment-result-btn" onClick={() => navigate(ROUTES.WALLET_TOP_UP)}>
                  <Icon icon="lucide:wallet" width={16} />
                  Về trang nạp coin
                </button>
              </>
            )}
          </div>

          <div className="payment-result-footer-note">
            <Icon icon="lucide:shield-check" width={14} />
            Kết quả được đồng bộ từ VNPay và hệ thống ví coin của ResearchPulse.
          </div>
        </div>
      </div>
    </div>
  );
}
