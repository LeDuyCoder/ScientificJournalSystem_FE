/**
 * File source thuộc hệ thống FE ResearchPulse.
 *
 * File: features/wallet/components/CoinBalanceBadge.jsx
 *
 * Component hiển thị số dư coin dạng badge pill sang trọng.
 */
import { useEffect } from 'react';
import Icon from '../../../shared/components/Icon';
import { useWalletStore } from '../../../app/store/walletStore';

export default function CoinBalanceBadge({ className = '' }) {
  const { balance, fetchWallet, isFetched, isLoading } = useWalletStore();

  useEffect(() => {
    // Chỉ gọi API nếu chưa fetch lần nào
    if (!isFetched) {
      fetchWallet();
    }
  }, [isFetched, fetchWallet]);

  // Format số dư: chỉ hiện thập phân khi không tròn (e.g., 1,250 hoặc 1,250.50)
  const isWholeNumber = Number.isInteger(balance);
  const formattedBalance = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: isWholeNumber ? 0 : 2,
    maximumFractionDigits: isWholeNumber ? 0 : 2
  }).format(balance);

  return (
    <div
      className={`d-inline-flex align-items-center gap-2 px-3 py-1 ${className}`}
      style={{
        background: 'rgba(0, 0, 0, 0.04)',
        borderRadius: '50rem',
        border: '1px solid rgba(0, 0, 0, 0.05)',
      }}
    >
      <div
        className="d-flex align-items-center justify-content-center"
        style={{
          width: '20px',
          height: '20px',
          borderRadius: '50%',
          background: 'rgba(255, 122, 51, 0.1)',
        }}
      >
        <Icon 
          icon="solar:wallet-bold" 
          width="12" 
          style={{ color: '#ff7a33' }} 
        />
      </div>
      <span
        className="text-main"
        style={{
          fontFamily: 'var(--font-display)',
          fontWeight: 700,
          fontSize: '13px',
          lineHeight: 1
        }}
      >
        {isLoading && !isFetched ? '...' : formattedBalance}
      </span>
    </div>
  );
}
