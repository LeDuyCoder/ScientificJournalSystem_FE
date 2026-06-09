/**
 * File source thuộc hệ thống FE ResearchPulse.
 *
 * File: features\article\api\articleApi.js
 */
import httpClient from '../../../shared/services/httpClient';

/**
 * Lấy danh sách hoặc tìm kiếm bài báo khoa học
 * @param {Object} params - Tham số tìm kiếm, phân trang và sắp xếp (search, page, limit, sortBy, sortOrder)
 * @returns {Promise} Axios promise
 */
export const getArticlesListApi = (params) => {
  return httpClient.get('/articles', { params });
};

/**
 * Lấy chi tiết bài báo theo ID
 * @param {number|string} id - ID bài báo
 * @returns {Promise} Axios promise
 */
export const getArticleDetailApi = (id) => {
  return httpClient.get(`/articles/${id}`);
};

/**
 * Bookmark an article
 * @param {number|string} id - ID bài báo
 * @returns {Promise} Axios promise
 */
export const bookmarkArticleApi = (id) => {
  return httpClient.post(`/articles/${id}/bookmark`);
};

