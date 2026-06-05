import api from '../../../shared/services/api';

/**
 * Lấy danh sách hoặc tìm kiếm bài báo khoa học
 * @param {Object} params - Tham số tìm kiếm, phân trang và sắp xếp (search, page, limit, sortBy, sortOrder)
 * @returns {Promise} Axios promise
 */
export const getArticlesListApi = (params) => {
  return api.get('/articles', { params });
};

/**
 * Lấy chi tiết bài báo theo ID
 * @param {number|string} id - ID bài báo
 * @returns {Promise} Axios promise
 */
export const getArticleDetailApi = (id) => {
  return api.get(`/articles/${id}`);
};

/**
 * Bookmark an article
 * @param {number|string} id - ID bài báo
 * @returns {Promise} Axios promise
 */
export const bookmarkArticleApi = (id) => {
  return api.post(`/articles/${id}/bookmark`);
};

