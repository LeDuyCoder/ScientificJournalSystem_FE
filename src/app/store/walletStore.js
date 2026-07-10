/**
 * File source thuộc hệ thống FE ResearchPulse.
 *
 * File: app/store/walletStore.js
 *
 * Zustand store quản lý trạng thái ví coin của người dùng toàn cục.
 */
import { create } from 'zustand';
import { getMyWallet } from '../../features/wallet/api/walletApi';

export const useWalletStore = create((set, get) => ({
  balance: 0,
  totalDeposit: 0,
  totalSpent: 0,
  isLoading: false,
  error: null,
  walletId: null,
  isFetched: false,

  /**
   * Fetch thông tin ví từ backend và lưu vào store.
   */
  fetchWallet: async () => {
    // Tránh fetch trùng lặp nếu đang loading
    if (get().isLoading) return;

    set({ isLoading: true, error: null });
    try {
      const response = await getMyWallet();
      if (response && response.success && response.data) {
        const { balance, total_deposit, total_spent, wallet_id } = response.data;
        set({
          balance: balance ?? 0,
          totalDeposit: total_deposit ?? 0,
          totalSpent: total_spent ?? 0,
          walletId: wallet_id || null,
          isFetched: true,
          error: null
        });
      } else {
        set({ error: response?.message || 'Không thể lấy thông tin ví' });
      }
    } catch (err) {
      set({ error: err.response?.data?.message || err.message || 'Lỗi kết nối ví' });
    } finally {
      set({ isLoading: false });
    }
  },

  /**
   * Cập nhật số dư thủ công (ví dụ sau khi tiêu coin hoặc nạp thành công ở FE)
   */
  setBalance: (newBalance) => set({ balance: newBalance }),

  /**
   * Xóa thông tin ví khi đăng xuất
   */
  clearWallet: () => set({
    balance: 0,
    totalDeposit: 0,
    totalSpent: 0,
    isLoading: false,
    error: null,
    walletId: null,
    isFetched: false
  })
}));
