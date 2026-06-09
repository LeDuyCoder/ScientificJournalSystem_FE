/**
 * File source thuộc hệ thống FE ResearchPulse.
 *
 * File: features\author\api\author.httpClient.js
 */
import httpClient from '../../../shared/services/httpClient';

/**
 * Get author subject areas breakdown analysis
 * @param {number|string} id - Author ID
 * @returns {Promise} Axios promise
 */
export const getAuthorAreasBreakdownApi = (id) => {
  return httpClient.get(`/author/${id}/areas-breakdown`);
};

/**
 * Get articles list written by author
 * @param {number|string} id - Author ID
 * @returns {Promise} Axios promise
 */
export const getAuthorArticlesApi = (id) => {
  return httpClient.get(`/author/${id}/articles`);
};

/**
 * Get authors global leaderboard ranking list
 * @returns {Promise} Axios promise
 */
export const getAuthorLeaderboardApi = () => {
  return httpClient.get('/author/leaderboard');
};
