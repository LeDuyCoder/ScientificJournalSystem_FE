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
