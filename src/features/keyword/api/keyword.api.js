import api from '../../../shared/services/api';

/**
 * Get lists or search systems keywords dictionary
 * @param {Object} params - { search, limit, page }
 * @returns {Promise} Axios promise
 */
export const getKeywordsApi = (params) => {
  return api.get('/keywords', { params });
};

/**
 * Create a new system keyword
 * @param {Object} data - { name }
 * @returns {Promise} Axios promise
 */
export const createKeywordApi = (data) => {
  return api.post('/keywords', data);
};

/**
 * Get keyword details by ID
 * @param {number|string} id - Keyword ID
 * @returns {Promise} Axios promise
 */
export const getKeywordByIdApi = (id) => {
  return api.get(`/keywords/${id}`);
};

/**
 * Update a keyword label
 * @param {number|string} id - Keyword ID
 * @param {Object} data - { name }
 * @returns {Promise} Axios promise
 */
export const updateKeywordApi = (id, data) => {
  return api.put(`/keywords/${id}`, data);
};

/**
 * Soft delete a system keyword by ID
 * @param {number|string} id - Keyword ID
 * @returns {Promise} Axios promise
 */
export const deleteKeywordApi = (id) => {
  return api.delete(`/keywords/${id}`);
};

/**
 * Restore a soft-deleted keyword by ID
 * @param {number|string} id - Keyword ID
 * @returns {Promise} Axios promise
 */
export const restoreKeywordApi = (id) => {
  return api.patch(`/keywords/${id}/restore`);
};
