import api from '../../../shared/services/api';

/**
 * Calls backend GET /articles endpoint with keywords query parameters.
 *
 * @param {string} keywords - Comma-separated search keywords
 * @param {number} page - Page number
 * @param {number} limit - Items limit per page
 * @returns {Promise<Object>} Axios response promise
 */
export const searchArticlesApi = (keywords, page = 1, limit = 10) => {
  return api.get('/articles', {
    params: {
      keywords,
      page,
      limit,
    },
  });
};

/**
 * Create a new article entry
 * @param {Object} data - Article fields
 * @returns {Promise} Axios promise
 */
export const createArticleApi = (data) => {
  return api.post('/articles', data);
};

/**
 * Get detailed article by ID
 * @param {number|string} id - Article ID
 * @returns {Promise} Axios promise
 */
export const getArticleByIdApi = (id) => {
  return api.get(`/articles/${id}`);
};

/**
 * Update article details by ID
 * @param {number|string} id - Article ID
 * @param {Object} data - Updated article fields
 * @returns {Promise} Axios promise
 */
export const updateArticleApi = (id, data) => {
  return api.put(`/articles/${id}`, data);
};

/**
 * Soft delete an article by ID
 * @param {number|string} id - Article ID
 * @returns {Promise} Axios promise
 */
export const deleteArticleApi = (id) => {
  return api.delete(`/articles/${id}`);
};

/**
 * Restore a soft-deleted article by ID
 * @param {number|string} id - Article ID
 * @returns {Promise} Axios promise
 */
export const restoreArticleApi = (id) => {
  return api.patch(`/articles/${id}/restore`);
};

