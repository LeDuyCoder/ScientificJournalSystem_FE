import api from '../../../shared/services/api';

/**
 * Get list of journals, with pagination, filtering, and search support
 * @param {Object} params - { page, limit, search }
 * @returns {Promise} Axios promise
 */
export const getJournalsApi = (params) => {
  return api.get('/journal', { params });
};

/**
 * Create a new journal
 * @param {Object} data - { display_name, issn, ... }
 * @returns {Promise} Axios promise
 */
export const createJournalApi = (data) => {
  return api.post('/journal', data);
};

/**
 * Get detailed information for a journal by ID
 * @param {number|string} id - Journal ID
 * @returns {Promise} Axios promise
 */
export const getJournalByIdApi = (id) => {
  return api.get(`/journal/${id}`);
};

/**
 * Update a journal's details by ID
 * @param {number|string} id - Journal ID
 * @param {Object} data - New journal details
 * @returns {Promise} Axios promise
 */
export const updateJournalApi = (id, data) => {
  return api.put(`/journal/${id}`, data);
};

/**
 * Delete a journal entry by ID
 * @param {number|string} id - Journal ID
 * @returns {Promise} Axios promise
 */
export const deleteJournalApi = (id) => {
  return api.delete(`/journal/${id}`);
};

/**
 * Restore a soft-deleted journal entry by ID
 * @param {number|string} id - Journal ID
 * @returns {Promise} Axios promise
 */
export const restoreJournalApi = (id) => {
  return api.patch(`/journal/${id}`);
};
