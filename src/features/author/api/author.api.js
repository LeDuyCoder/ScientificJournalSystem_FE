/**
 * File source thuộc hệ thống FE ResearchPulse.
 *
 * File: features\author\api\author.httpClient.js
 */
import httpClient from '../../../shared/services/httpClient';

/**
 * Gọi API lấy danh sách các subject area học thuật.
 * @returns {Promise} Axios promise
 */
export const getSubjectAreasApi = () => {
  return httpClient.get('/subject-areas');
};

/**
 * Gọi API lấy phân tích phần trăm đóng góp theo lĩnh vực nghiên cứu của tác giả
 * @param {number|string} id - ID của tác giả
 * @returns {Promise} Axios promise
 */
export const getAuthorAreasBreakdownApi = (id) => {
  return httpClient.get(`/author/${id}/areas-breakdown`);
};

/**
 * Gọi API lấy danh sách các bài báo khoa học đã xuất bản của tác giả
 * @param {number|string} id - ID của tác giả
 * @returns {Promise} Axios promise
 */
export const getAuthorArticlesApi = (id) => {
  return httpClient.get(`/author/${id}/articles`);
};

/**
 * Gọi API lấy danh sách xếp hạng tác giả toàn cầu (Leaderboard)
 * @returns {Promise} Axios promise
 */
export const getAuthorLeaderboardApi = (params = {}) => {
  return httpClient.get('/author/leaderboard', { params });
};

/**
 * Gọi API lấy danh sách tác giả đăng ký trong hệ thống (Hỗ trợ phân trang, lọc và tìm kiếm)
 * @param {Object} params - Các tham số tìm kiếm lọc (page, limit, search, sort, subject_area, country)
 * @returns {Promise} Axios promise
 */
export const getAuthorsApi = (params) => {
  return httpClient.get('/author', { params });
};

/**
 * Gọi API lấy thông tin hồ sơ học thuật chi tiết của một tác giả
 * @param {number|string} id - ID của tác giả
 * @returns {Promise} Axios promise
 */
export const getAuthorDetailApi = (id) => {
  return httpClient.get(`/author/${id}`);
};
