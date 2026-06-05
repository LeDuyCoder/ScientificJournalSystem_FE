import api from '../../../shared/services/api';

/**
 * Get articles belonging to a specific topic ID
 * @param {number|string} id - Topic ID
 * @returns {Promise} Axios promise
 */
export const getTopicArticlesApi = (id) => {
  return api.get(`/topics/${id}/articles`);
};
