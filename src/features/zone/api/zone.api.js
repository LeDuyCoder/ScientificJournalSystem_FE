import api from '../../../shared/services/api';

/**
 * Get publication volume stats by country
 * @returns {Promise} Axios promise
 */
export const getCountryStatsApi = () => {
  return api.get('/zones/countries/stats');
};

/**
 * Get publication volume stats by global regions
 * @param {Object} params - Query params if any
 * @returns {Promise} Axios promise
 */
export const getRegionStatsApi = (params) => {
  return api.get('/zones/regions/stats', { params });
};

/**
 * Get internal regional publication stats within a specific country code
 * @param {string} code - Country code
 * @returns {Promise} Axios promise
 */
export const getCountryRegionStatsApi = (code) => {
  return api.get(`/zones/countries/${code}/regions/stats`);
};
