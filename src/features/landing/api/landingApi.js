import api from '../../../shared/services/api';

/**
 * Calls backend GET /search/:keyword endpoint to query global catalog.
 *
 * @param {string} keyword - The search term
 * @returns {Promise<Object>} Axios response promise
 */
export const searchGlobalApi = (keyword) => {
  return api.get(`/search/${encodeURIComponent(keyword)}`);
};
