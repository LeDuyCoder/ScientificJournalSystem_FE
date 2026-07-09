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

/**
 * Lấy danh sách gói coin đang bán (không cần đăng nhập).
 * Endpoint: GET /coin-packages
 *
 * @returns {Promise<Object>} Response: { success, code, data: [...packages] }
 */
export const getCoinPackages = async () => {
  const response = await api.get('/coin-packages');
  return response.data;
};

/**
 * Tạo giao dịch thanh toán.
 * Endpoint: POST /payments/create
 *
 * @param {Object} payload
 * @param {string} payload.packageId - ID của gói coin đã chọn.
 * @param {string} payload.paymentMethod - Phương thức thanh toán (vnpay, momo...).
 * @returns {Promise<Object>} Response: { success, data: { transactionId, paymentUrl, payment } }
 */
export const createPayment = async ({ packageId, paymentMethod = 'vnpay' }) => {
  const response = await api.post('/payments/create', { packageId, paymentMethod });
  return response.data;
};

/**
 * Lấy trạng thái giao dịch thanh toán.
 * Endpoint: GET /payments/{transactionId}
 *
 * @param {string} transactionId
 * @returns {Promise<Object>} Transaction detail.
 */
export const getPaymentStatus = async (transactionId) => {
  const response = await api.get(`/payments/${transactionId}`);
  return response.data;
};

/**
 * Gọi backend VNPay IPN với query string VNPay redirect về FE.
 * Endpoint: GET /payments/vnpay/ipn?...vnpay_query
 *
 * @param {string} queryString - Query string có hoặc không có dấu ? đầu chuỗi.
 * @returns {Promise<Object>} VNPay IPN response: { RspCode, Message }
 */
export const confirmVnpayIpn = async (queryString = '') => {
  const normalizedQuery = queryString.startsWith('?') ? queryString.slice(1) : queryString;
  const url = normalizedQuery ? `/payments/vnpay/ipn?${normalizedQuery}` : '/payments/vnpay/ipn';
  const response = await api.get(url);
  return response.data;
};
