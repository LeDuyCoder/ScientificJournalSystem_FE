/**
 * @file author.api.js
 * @description API service module quản lý các kết nối HTTP endpoints cho tính năng Tác giả.
 * 
 * Chức năng chính:
 * - Thực hiện các truy vấn HTTP GET tới backend server thông qua Axios client dùng chung.
 * - Cung cấp các hàm lấy danh sách tác giả, chi tiết tác giả, danh sách bài báo của tác giả và bảng xếp hạng.
 */

import api from '../../../shared/services/api';

/**
 * Gọi API lấy phân tích phần trăm đóng góp theo lĩnh vực nghiên cứu của tác giả
 * @param {number|string} id - ID của tác giả
 * @returns {Promise} Axios promise
 */
export const getAuthorAreasBreakdownApi = (id) => {
  return api.get(`/author/${id}/areas-breakdown`);
};

/**
 * Gọi API lấy danh sách các bài báo khoa học đã xuất bản của tác giả
 * @param {number|string} id - ID của tác giả
 * @returns {Promise} Axios promise
 */
export const getAuthorArticlesApi = (id) => {
  return api.get(`/author/${id}/articles`);
};

/**
 * Gọi API lấy danh sách xếp hạng tác giả toàn cầu (Leaderboard)
 * @returns {Promise} Axios promise
 */
export const getAuthorLeaderboardApi = () => {
  return api.get('/author/leaderboard');
};

/**
 * Gọi API lấy danh sách tác giả đăng ký trong hệ thống (Hỗ trợ phân trang, lọc và tìm kiếm)
 * @param {Object} params - Các tham số tìm kiếm lọc (page, limit, search, sort, subject_area, country)
 * @returns {Promise} Axios promise
 */
export const getAuthorsApi = (params) => {
  return api.get('/author', { params });
};

/**
 * Gọi API lấy thông tin hồ sơ học thuật chi tiết của một tác giả
 * @param {number|string} id - ID của tác giả
 * @returns {Promise} Axios promise
 */
export const getAuthorDetailApi = (id) => {
  return api.get(`/author/${id}`);
};
