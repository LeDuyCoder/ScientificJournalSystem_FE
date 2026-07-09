/**
 * File source thuộc hệ thống FE ResearchPulse.
 *
 * File: features/wallet/api/walletApi.js
 *
 * API service để tương tác với endpoint ví coin.
 */
import api from '../../../shared/services/api';

/**
 * Lấy thông tin ví coin của user hiện tại.
 * Endpoint: GET /wallet/me
 *
 * @returns {Promise<Object>} Wallet data: { wallet_id, user_id, balance, total_deposit, total_spent, ... }
 */
export const getMyWallet = async () => {
  const response = await api.get('/wallet/me');
  return response.data;
};
