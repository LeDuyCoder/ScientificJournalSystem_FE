import api from '../../../shared/services/api';

/**
 * Get detailed information for a journal by ID
 * @param {number|string} id - Journal ID
 * @returns {Promise} Axios promise
 */
export const getJournalByIdApi = (id) => {
  return api.get(`/journal/${id}`);
};

/**
 * Get historical rankings of a journal by journal ID
 * @param {number|string} id - Journal ID
 * @returns {Promise} Axios promise
 */
export const getJournalRankingsApi = (id) => {
  return api.get(`/catalog/journals/${id}/rankings`);
};

/**
 * Get catalog volumes list (filterable by journal_id)
 * @param {Object} params - { journal_id }
 * @returns {Promise} Axios promise
 */
export const getCatalogVolumesApi = (params) => {
  return api.get('/catalog/volumes', { params });
};

/**
 * Get catalog issues list (filterable by volume_id)
 * @param {Object} params - { volume_id }
 * @returns {Promise} Axios promise
 */
export const getCatalogIssuesApi = (params) => {
  return api.get('/catalog/issues', { params });
};

/**
 * Get recent articles for a journal (filterable by journal_id)
 * @param {Object} params - { journal_id }
 * @returns {Promise} Axios promise
 */
export const getJournalArticlesApi = (params) => {
  return api.get('/articles', { params });
};

/**
 * Follow a journal entry by ID
 * @param {number|string} id - Journal ID
 * @returns {Promise} Axios promise
 */
export const followJournalApi = (id) => {
  return api.post(`/journals/${id}/follow`);
};

/**
 * Add a journal entry to a project
 * @param {number|string} projectId - Project ID
 * @param {number|string} journalId - Journal ID
 * @returns {Promise} Axios promise
 */
export const addJournalToProjectApi = (projectId, journalId) => {
  return api.post(`/projects/${projectId}/journals`, { journalId });
};

/**
 * Search journals with filters, pagination, sorting
 * @param {Object} params - Query params (search, page, limit, subject_area_id, subject_category_id, is_open_access, quartile, sort)
 * @returns {Promise} Axios promise
 */
export const searchJournalsApi = (params) => {
  return api.get('/journal/', { params });
};
