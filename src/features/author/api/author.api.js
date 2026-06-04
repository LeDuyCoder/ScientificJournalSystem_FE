import api from '../../../shared/services/api';

/**
 * Get author subject areas breakdown analysis
 * @param {number|string} id - Author ID
 * @returns {Promise} Axios promise
 */
export const getAuthorAreasBreakdownApi = (id) => {
  return api.get(`/author/${id}/areas-breakdown`);
};

/**
 * Get articles list written by author
 * @param {number|string} id - Author ID
 * @returns {Promise} Axios promise
 */
export const getAuthorArticlesApi = (id) => {
  return api.get(`/author/${id}/articles`);
};

/**
 * Get authors global leaderboard ranking list
 * @returns {Promise} Axios promise
 */
export const getAuthorLeaderboardApi = () => {
  return api.get('/author/leaderboard');
};
