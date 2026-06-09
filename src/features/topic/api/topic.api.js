/**
 * File source thuộc hệ thống FE ResearchPulse.
 *
 * File: features\topic\api\topic.httpClient.js
 */
import httpClient from '../../../shared/services/httpClient';

/**
 * Get articles belonging to a specific topic ID
 * @param {number|string} id - Topic ID
 * @returns {Promise} Axios promise
 */
export const getTopicArticlesApi = (id) => {
  return httpClient.get(`/topics/${id}/articles`);
};

/**
 * Lấy danh sách topics để hiển thị trong filter bài báo.
 *
 * @param {Object} params - Query params gửi lên backend.
 * @returns {Promise} Axios response chứa danh sách topics.
 */
export const getTopicsApi = (params = {}) => {
  return httpClient.get('/topics', { params });
};
