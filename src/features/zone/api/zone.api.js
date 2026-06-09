/**
 * File source thuộc hệ thống FE ResearchPulse.
 *
 * File: features\zone\api\zone.httpClient.js
 */
import httpClient from '../../../shared/services/httpClient';

/**
 * Get publication volume stats by country
 * @returns {Promise} Axios promise
 */
export const getCountryStatsApi = () => {
  return httpClient.get('/zones/countries/stats');
};

/**
 * Get publication volume stats by global regions
 * @param {Object} params - Query params if any
 * @returns {Promise} Axios promise
 */
export const getRegionStatsApi = (params) => {
  return httpClient.get('/zones/regions/stats', { params });
};

/**
 * Get internal regional publication stats within a specific country code
 * @param {string} code - Country code
 * @returns {Promise} Axios promise
 */
export const getCountryRegionStatsApi = (code) => {
  return httpClient.get(`/zones/countries/${code}/regions/stats`);
};
