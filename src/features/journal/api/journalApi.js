/**
 * File source thuộc hệ thống FE ResearchPulse.
 *
 * File: features\journal\api\journalApi.js
 */
import httpClient from '../../../shared/services/httpClient';

/**
 * Get detailed information for a journal by ID
 * @param {number|string} id - Journal ID
 * @returns {Promise} Axios promise
 */
export const getJournalByIdApi = (id) => {
  return httpClient.get(`/journal/${id}`);
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

/**
 * Get recent articles for a journal (filterable by journal_id)
 * @param {Object} params - { journal_id }
 * @returns {Promise} Axios promise
 */
export const getJournalArticlesApi = (params) => {
  return httpClient.get('/articles', { params });
};

/**
 * Follow a journal entry by ID
 * @param {number|string} id - Journal ID
 * @returns {Promise} Axios promise
 */
export const followJournalApi = (id) => {
  return httpClient.post(`/journals/${id}/follow`);
};

/**
 * Add a journal entry to a project
 * @param {number|string} projectId - Project ID
 * @param {number|string} journalId - Journal ID
 * @returns {Promise} Axios promise
 */
export const addJournalToProjectApi = (projectId, journalId) => {
  return httpClient.post(`/projects/${projectId}/journals`, { journalId });
};

/**
 * Search journals with filters, pagination, sorting.
 * @param {Object} params - Query params (search, page, limit, sort, subject_area_ids, subject_category_ids, is_open_access, quartiles)
 * @returns {Promise} Axios promise
 */
export const searchJournalsApi = (params) => {
  return httpClient.get('/journal/', { params });
};
