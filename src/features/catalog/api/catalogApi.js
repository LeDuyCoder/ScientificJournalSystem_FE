/**
 * File source thuộc hệ thống FE ResearchPulse.
 *
 * File: features\catalog\api\catalogApi.js
 */
import httpClient from '../../../shared/services/httpClient';

/**
 * Get catalog academic subject areas list
 * @returns {Promise} Axios promise
 */
export const getSubjectAreasApi = () => {
  return httpClient.get('/subject-areas');
};

/**
 * Get catalog academic subject categories list
 * @returns {Promise} Axios promise
 */
export const getSubjectCategoriesApi = () => {
  return httpClient.get('/subject-categories');
};

/**
 * Get historical rankings of a journal by journal ID
 * @param {number|string} id - Journal ID
 * @returns {Promise} Axios promise
 */
export const getJournalRankingsApi = (id) => {
  return httpClient.get(`/catalog/journals/${id}/rankings`);
};

/**
 * Get catalog volumes list (filterable by journal_id)
 * @param {Object} params - { journal_id }
 * @returns {Promise} Axios promise
 */
export const getCatalogVolumesApi = (params) => {
  return httpClient.get('/catalog/volumes', { params });
};

/**
 * Get catalog issues list (filterable by volume_id)
 * @param {Object} params - { volume_id }
 * @returns {Promise} Axios promise
 */
export const getCatalogIssuesApi = (params) => {
  return httpClient.get('/catalog/issues', { params });
};
