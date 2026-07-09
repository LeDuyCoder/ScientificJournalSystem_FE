import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Icon } from '@iconify/react';
import Header from '../../landing/components/Header';
import ROUTES from '../../../app/routes/routePaths';
import { getCoinPackages, createPayment } from '../api/walletApi';
import './WalletCheckoutPage.css';

const METHOD_UI = {
  vnpay: {
    name: 'VNPay',
    desc: 'Thanh toán nhanh qua cổng VNPay',
    icon: 'solar:wallet-bold',
    iconColor: '#ff7a33',
  },
  momo: {
    name: 'MoMo',
    desc: 'Sắp hỗ trợ trong thời gian tới',
    icon: 'solar:card-bold',
    iconColor: '#d946ef',
  },
};

export default function WalletCheckoutPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const packageId = searchParams.get('packageId') || '';
  const paymentMethod = searchParams.get('paymentMethod') || 'vnpay';

  const [pkg, setPkg] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    let mounted = true;

    if (!packageId) {
      setError('Thiếu thông tin gói coin. Vui lòng quay lại và chọn gói nạp.');
      setLoading(false);
      return undefined;
    }

    setLoading(true);
    setError('');

    getCoinPackages()
      .then((res) => {
        if (!mounted) return;
        if (res?.success && Array.isArray(res.data)) {
          const found = res.data.find((item) => item.package_id === packageId && item.is_active !== false);
          if (found) {
            setPkg(found);
          } else {
            setError('Không tìm thấy gói coin đã chọn hoặc gói đã ngừng bán.');
          }
        } else {
          setError('Không thể tải thông tin gói coin.');
        }
      })
      .catch(() => {
        if (mounted) setError('Lỗi kết nối. Vui lòng thử lại.');
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [packageId]);

  const formatCoin = (n) =>
    Number.isInteger(n)
      ? Number(n || 0).toLocaleString('en-US')
      : Number(n || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const formatVND = (n) => Number(n || 0).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });

  const totals = useMemo(() => {
    const amount = Number(pkg?.price || 0);
    const bonus = Number(pkg?.bonus_coin || 0);
    return {
      amount,
      fee: 0,
      discount: 0,
      grandTotal: amount,
      bonus,
    };
  }, [pkg]);

  const methodMeta = METHOD_UI[paymentMethod] || METHOD_UI.vnpay;

  const handleConfirmPayment = async () => {
    if (!pkg?.package_id) return;
    setSubmitError('');
    setSubmitting(true);

    try {
      const res = await createPayment({ packageId: pkg.package_id, paymentMethod });
      const paymentUrl = res?.data?.paymentUrl || res?.data?.payment_url;
      if (paymentUrl) {
        window.location.href = paymentUrl;
        return;
      }
      setSubmitError('Không nhận được URL thanh toán từ hệ thống.');
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || 'Tạo giao dịch thất bại.';
      setSubmitError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="wallet-checkout-page">
      <Header />
      <div className="wallet-checkout-inner">
        <div className="wallet-checkout-breadcrumb">
          <button type="button" onClick={() => navigate(ROUTES.WALLET_TOP_UP)}>Nạp Coin</button>
          <Icon icon="lucide:chevron-right" width={14} />
          <span>Xác nhận thanh toán</span>
        </div>

        <div className="wallet-checkout-hero">
          <div>
            <h1 className="wallet-checkout-title">Xác nhận thanh toán</h1>
            <p className="wallet-checkout-subtitle">
              Kiểm tra lại gói coin bạn đã chọn và xác nhận thanh toán qua cổng bảo mật trước khi hệ thống chuyển hướng sang VNPay.
            </p>
          </div>
          <div className="wallet-checkout-secure">
            <Icon icon="lucide:shield-check" width={16} />
            Bảo mật kết nối 256-bit
          </div>
        </div>

        {loading ? (
          <div className="checkout-state">
            <div>
              <div className="spinner-border spinner-border-sm" role="status" style={{ color: '#ff7a33' }} />
              <div style={{ marginTop: 12 }}>Đang tải thông tin gói coin...</div>
            </div>
          </div>
        ) : error ? (
          <div className="checkout-state">
            <div>
              <Icon icon="lucide:triangle-alert" width={30} style={{ color: '#dc2626', marginBottom: 10 }} />
              <div>{error}</div>
              <button type="button" className="checkout-back-btn" style={{ marginTop: 16 }} onClick={() => navigate(ROUTES.WALLET_TOP_UP)}>
                Quay lại trang nạp coin
              </button>
            </div>
          </div>
        ) : (
          <div className="wallet-checkout-grid">
            <div className="wallet-checkout-stack">
              <div className="wallet-checkout-card">
                <div className="wallet-checkout-card-title">
                  <span className="wallet-checkout-card-title__icon">
                    <Icon icon="lucide:coins" width={18} />
                  </span>
                  Thông tin nạp tiền
                </div>

                <div className="checkout-package-card">
                  <div className="checkout-package-icon">
                    <Icon icon="lucide:circle-dollar-sign" width={28} />
                  </div>
                  <div className="checkout-package-main">
                    <div className="checkout-package-name">{pkg?.name}</div>
                    <div className="checkout-package-meta">
                      {formatCoin(pkg?.coin_amount)} coin gốc
                      {pkg?.bonus_coin > 0 ? ` • +${formatCoin(pkg?.bonus_coin)} bonus` : ''}
                    </div>
                  </div>
                  <div className="checkout-package-coin">
                    {formatCoin(pkg?.total_coin)}
                    <span>Coins nhận được</span>
                  </div>
                </div>
              </div>

              <div className="wallet-checkout-card">
                <div className="wallet-checkout-card-title">
                  <span className="wallet-checkout-card-title__icon">
                    <Icon icon="lucide:credit-card" width={18} />
                  </span>
                  Phương thức thanh toán
                </div>

                <div className="checkout-method-list">
                  <div className="checkout-method-item active">
                    <div className="checkout-method-left">
                      <span className="checkout-method-icon">
                        <Icon icon={methodMeta.icon} width={20} color={methodMeta.iconColor} />
                      </span>
                      <div>
                        <div className="checkout-method-name">{methodMeta.name}</div>
                        <div className="checkout-method-desc">{methodMeta.desc}</div>
                      </div>
                    </div>
                    <Icon icon="lucide:badge-check" width={20} color="#ff7a33" />
                  </div>

                  <div className="checkout-method-item" style={{ opacity: 0.55 }}>
                    <div className="checkout-method-left">
                      <span className="checkout-method-icon">
                        <Icon icon="lucide:credit-card" width={20} color="#64748b" />
                      </span>
                      <div>
                        <div className="checkout-method-name">Thẻ nội địa</div>
                        <div className="checkout-method-desc">Sắp hỗ trợ</div>
                      </div>
                    </div>
                  </div>

                  <div className="checkout-method-item" style={{ opacity: 0.55 }}>
                    <div className="checkout-method-left">
                      <span className="checkout-method-icon">
                        <Icon icon="lucide:globe" width={20} color="#64748b" />
                      </span>
                      <div>
                        <div className="checkout-method-name">Thẻ quốc tế</div>
                        <div className="checkout-method-desc">Sắp hỗ trợ</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="wallet-checkout-card checkout-summary-card">
              <div className="wallet-checkout-card-title">
                <span className="wallet-checkout-card-title__icon">
                  <Icon icon="lucide:receipt-text" width={18} />
                </span>
                Tóm tắt thanh toán
              </div>

              <div className="checkout-summary-row">
                <span>Gói {formatCoin(pkg?.total_coin)} Coins</span>
                <strong>{formatVND(totals.amount)}</strong>
              </div>
              <div className="checkout-summary-row">
                <span>Phí dịch vụ</span>
                <strong>{formatVND(totals.fee)}</strong>
              </div>
              <div className="checkout-summary-row">
                <span>Khuyến mãi</span>
                <strong>—</strong>
              </div>

              <div className="checkout-summary-divider" />

              <div className="checkout-summary-total">
                <div>
                  <div className="checkout-summary-total__label">Tổng cộng</div>
                  <div className="checkout-summary-total__value">{formatVND(totals.grandTotal)}</div>
                </div>
                <div style={{ color: '#16a34a', fontSize: 12, fontWeight: 800 }}>
                  +{formatCoin(totals.bonus)} bonus
                </div>
              </div>

              <button type="button" className="checkout-pay-btn" onClick={handleConfirmPayment} disabled={submitting}>
                {submitting ? (
                  <>
                    <span className="spinner-border spinner-border-sm text-white" role="status" />
                    Đang chuyển hướng...
                  </>
                ) : (
                  <>
                    Xác nhận & Thanh toán
                    <Icon icon="lucide:arrow-right" width={16} />
                  </>
                )}
              </button>

              <button type="button" className="checkout-back-btn" onClick={() => navigate(-1)}>
                Quay lại chỉnh sửa gói
              </button>

              <div className="checkout-note">
                <Icon icon="lucide:lock-keyhole" width={14} style={{ marginTop: 2, flexShrink: 0 }} />
                <span>Bằng việc xác nhận, bạn đồng ý với điều khoản thanh toán và hệ thống sẽ chuyển bạn sang cổng VNPay bảo mật.</span>
              </div>

              {submitError && <div className="checkout-error-box">{submitError}</div>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
