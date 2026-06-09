/**
 * File source thuộc hệ thống FE ResearchPulse.
 *
 * File: features\landing\api\landingApi.js
 */
import httpClient from '../../../shared/services/httpClient';

/**
 * Calls backend GET /search/:keyword endpoint to query global catalog.
 *
 * @param {string} keyword - The search term
 * @returns {Promise<Object>} Axios response promise
 */
export const searchGlobalApi = (keyword) => {
  return httpClient.get(`/search/${encodeURIComponent(keyword)}`);
};
