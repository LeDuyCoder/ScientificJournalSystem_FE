/**
 * File source thuộc hệ thống FE ResearchPulse.
 *
 * File: features/wallet/pages/TopUpPage.jsx
 *
 * Trang Nạp Coin — Route: /wallet/top-up
 *
 * Luồng:
 *  1. Fetch danh sách gói coin từ GET /coin-packages
 *  2. User chọn gói & phương thức thanh toán
 *  3. POST /payments/create → nhận paymentUrl
 *  4. Redirect sang paymentUrl (VNPay/MoMo sandbox)
 */
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { useWalletStore } from '../../../app/store/walletStore';
import ROUTES from '../../../app/routes/routePaths';
import { getCoinPackages } from '../api/walletApi';
import './TopUpPage.css';

// Gói nổi bật (package_id hoặc coin_amount nếu muốn cứng)
const RECOMMENDED_COIN_AMOUNT = 500;

// Danh sách phương thức thanh toán
const PAYMENT_METHODS = [
  { key: 'vnpay',  label: 'VNPay',         icon: 'simple-icons:vnpay',    color: '#0066cc' },
  { key: 'momo',   label: 'MoMo',          icon: 'simple-icons:momo',     color: '#ae2070', disabled: true },
];

// Lợi ích khi dùng ResearchPulse Coins
const BENEFITS = [
  {
    icon: 'lucide:file-text',
    iconBg: 'rgba(255, 122, 51, 0.12)',
    iconColor: '#ff7a33',
    title: 'Tài liệu Premium',
    desc: 'Truy cập hàng ngàn báo cáo nghiên cứu độc quyền và tạp chí khoa học hàng đầu thế giới.',
  },
  {
    icon: 'lucide:cpu',
    iconBg: 'rgba(99, 102, 241, 0.12)',
    iconColor: '#6366f1',
    title: 'Công cụ Dữ liệu AI',
    desc: 'Sử dụng sức mạnh AI để phân tích, tóm tắt và trích xuất dữ liệu từ tài liệu phức tạp.',
  },
  {
    icon: 'lucide:zap',
    iconBg: 'rgba(234, 179, 8, 0.12)',
    iconColor: '#ca8a04',
    title: 'Ưu tiên xử lý',
    desc: 'Yêu cầu nghiên cứu của bạn được ưu tiên xử lý nhanh hơn 3 lần so với tài khoản thường.',
  },
  {
    icon: 'lucide:shield-check',
    iconBg: 'rgba(34, 197, 94, 0.12)',
    iconColor: '#16a34a',
    title: 'Bảo mật & Không quảng cáo',
    desc: 'Trải nghiệm không gián đoạn, không quảng cáo, bảo mật tuyệt đối với tài khoản Premium.',
  },
];

export default function TopUpPage() {
  const navigate = useNavigate();
  const { balance, isFetched: walletFetched, fetchWallet } = useWalletStore();

  const [packages, setPackages] = useState([]);
  const [loadingPackages, setLoadingPackages] = useState(true);
  const [errorPackages, setErrorPackages] = useState(null);

  const [selectedPkgId, setSelectedPkgId] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('vnpay');

  // Fetch wallet nếu chưa có
  useEffect(() => {
    if (!walletFetched) {
      fetchWallet();
    }
  }, [walletFetched, fetchWallet]);

  // Fetch danh sách gói coin
  useEffect(() => {
    let mounted = true;
    setLoadingPackages(true);
    setErrorPackages(null);
    getCoinPackages()
      .then((res) => {
        if (!mounted) return;
        if (res?.success && Array.isArray(res.data)) {
          const activePackages = res.data.filter((p) => p.is_active !== false);
          setPackages(activePackages);
          // Auto-chọn gói recommended nếu có
          const rec = activePackages.find((p) => p.coin_amount === RECOMMENDED_COIN_AMOUNT);
          if (rec) setSelectedPkgId(rec.package_id);
        } else {
          setErrorPackages('Không thể tải danh sách gói coin.');
        }
      })
      .catch(() => {
        if (mounted) setErrorPackages('Lỗi kết nối, vui lòng thử lại.');
      })
      .finally(() => {
        if (mounted) setLoadingPackages(false);
      });
    return () => { mounted = false; };
  }, []);

  // Format số coin
  const formatCoin = (n) =>
    Number.isInteger(n)
      ? n.toLocaleString('en-US')
      : n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  // Format tiền VND
  const formatVND = (n) =>
    n.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });

  // Sang trang xác nhận thanh toán
  const handlePay = () => {
    if (!selectedPkgId) return;
    const params = new URLSearchParams({
      packageId: selectedPkgId,
      paymentMethod,
    });
    navigate(`${ROUTES.WALLET_CHECKOUT}?${params.toString()}`);
  };

  const selectedPkg = packages.find((p) => p.package_id === selectedPkgId);

  return (
    <div className="topup-page topup-in-layout">
      <div className="topup-inner">

        {/* ── Hero ── */}
        <div className="topup-hero">
          <div className="topup-hero__badge">
            <Icon icon="solar:wallet-bold" width={14} />
            ResearchPulse Coins
          </div>
          <h1 className="topup-hero__title">Nạp Coin vào tài khoản</h1>
          <p className="topup-hero__sub">
            Mở khoá những tiềm năng nghiên cứu vô hạn. Sử dụng Coin để truy cập các
            báo cáo độc quyền, công cụ phân tích dữ liệu AI và thư viện tài liệu chuyên sâu.
          </p>
        </div>

        {/* ── Wallet Balance Bar ── */}
        <div className="topup-wallet-bar">
          <div className="topup-wallet-bar__left">
            <div className="topup-wallet-bar__icon">
              <Icon icon="solar:wallet-bold" width={22} color="#ff7a33" />
            </div>
            <div>
              <div className="topup-wallet-bar__label">Số dư hiện tại</div>
              <div className="topup-wallet-bar__balance">
                {formatCoin(balance)}
                <span className="topup-wallet-bar__unit">Coins</span>
              </div>
            </div>
          </div>
          <Icon icon="lucide:chevron-right" width={18} style={{ color: 'var(--text-muted)' }} />
        </div>

        {/* ── Package Selection ── */}
        <div className="topup-section-title">Chọn gói coin phù hợp</div>

        {loadingPackages && (
          <div className="topup-loading-area">
            <div
              className="spinner-border spinner-border-sm"
              role="status"
              style={{ color: '#ff7a33' }}
            />
            <span>Đang tải gói coin...</span>
          </div>
        )}

        {!loadingPackages && errorPackages && (
          <div className="topup-empty">
            <Icon icon="lucide:wifi-off" width={32} style={{ marginBottom: 12, color: 'var(--text-muted)' }} />
            <p>{errorPackages}</p>
          </div>
        )}

        {!loadingPackages && !errorPackages && packages.length === 0 && (
          <div className="topup-empty">
            <Icon icon="lucide:package-x" width={32} style={{ marginBottom: 12 }} />
            <p>Hiện chưa có gói coin nào đang bán.</p>
          </div>
        )}

        {!loadingPackages && packages.length > 0 && (
          <div className="topup-packages-grid">
            {packages.map((pkg) => {
              const isRecommended = pkg.coin_amount === RECOMMENDED_COIN_AMOUNT;
              const isSelected = selectedPkgId === pkg.package_id;
              return (
                <button
                  key={pkg.package_id}
                  className={`topup-pkg-card ${isSelected ? 'selected' : ''}`}
                  onClick={() => setSelectedPkgId(pkg.package_id)}
                  type="button"
                  aria-pressed={isSelected}
                >
                  {isRecommended && (
                    <div className="topup-pkg-card__badge">Khuyến dùng</div>
                  )}

                  <div className="topup-pkg-card__check">
                    <Icon icon="lucide:check" width={12} color="#fff" />
                  </div>

                  <div className="topup-pkg-card__top-row">
                    <div className="topup-pkg-card__icon-wrap">
                      <div className="topup-pkg-card__icon">
                        <Icon icon="lucide:circle-dollar-sign" width={24} color="#ff7a33" />
                      </div>
                    </div>
                    <div className="topup-pkg-card__meta">
                      <div className="topup-pkg-card__label">ResearchPulse Coin</div>
                      <div className="topup-pkg-card__name">{pkg.name}</div>
                    </div>
                  </div>

                  <div className="topup-pkg-card__main">
                    <div className="topup-pkg-card__total-coin">
                      {formatCoin(pkg.total_coin)}
                    </div>
                    <div className="topup-pkg-card__coin-unit">Coins</div>
                  </div>

                  {pkg.bonus_coin > 0 ? (
                    <div className="topup-pkg-card__bonus">
                      <Icon icon="lucide:gift" width={11} />
                      +{formatCoin(pkg.bonus_coin)} bonus
                    </div>
                  ) : (
                    <div className="topup-pkg-card__bonus topup-pkg-card__bonus--muted">
                      <Icon icon="lucide:circle-off" width={11} />
                      Không có bonus
                    </div>
                  )}

                  <div className="topup-pkg-card__footer">
                    <div className="topup-pkg-card__price">{formatVND(pkg.price)}</div>
                    <div className="topup-pkg-card__footer-note">
                      {formatCoin(pkg.coin_amount)} coin gốc
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {/* ── Payment Method ── */}
        {!loadingPackages && packages.length > 0 && (
          <>
            <div className="topup-section-title">Phương thức thanh toán</div>
            <div className="topup-method-row">
              {PAYMENT_METHODS.map((m) => (
                <button
                  key={m.key}
                  type="button"
                  className={`topup-method-btn ${paymentMethod === m.key ? 'active' : ''}`}
                  onClick={() => !m.disabled && setPaymentMethod(m.key)}
                  disabled={m.disabled}
                  title={m.disabled ? 'Sắp ra mắt' : m.label}
                >
                  <Icon icon={m.icon} width={18} color={m.color} />
                  {m.label}
                  {m.disabled && (
                    <span style={{ fontSize: 10, marginLeft: 4, color: 'var(--text-muted)' }}>
                      (Sắp ra mắt)
                    </span>
                  )}
                </button>
              ))}
            </div>
          </>
        )}

        {/* ── CTA ── */}
        {!loadingPackages && packages.length > 0 && (
          <div className="topup-cta-row">
            <button
              className="topup-cta-btn"
              disabled={!selectedPkgId}
              onClick={handlePay}
              type="button"
            >
              <Icon icon="solar:wallet-bold" width={16} />
              Tiến hành nạp tiền
              {selectedPkg && ` — ${formatVND(selectedPkg.price)}`}
            </button>
            <div className="topup-cta-note">
              Giao dịch được bảo mật và mã hóa.
              <br />
              Coin sẽ được cộng sau khi thanh toán thành công.
            </div>
          </div>
        )}

        {/* ── Benefits Section ── */}
        <div className="topup-benefits">
          <div className="topup-benefits__title">
            Tại sao nên sử dụng ResearchPulse Coins?
          </div>
          <div className="topup-benefits__grid">
            {BENEFITS.map((b) => (
              <div className="topup-benefit-item" key={b.title}>
                <div
                  className="topup-benefit-item__icon"
                  style={{ background: b.iconBg }}
                >
                  <Icon icon={b.icon} width={18} color={b.iconColor} />
                </div>
                <div>
                  <div className="topup-benefit-item__title">{b.title}</div>
                  <div className="topup-benefit-item__desc">{b.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
