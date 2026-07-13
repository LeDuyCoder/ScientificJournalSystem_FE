/**
 * File source thuộc hệ thống FE ResearchPulse.
 *
 * File: features\project\api\project.api.js
 */
import api from '../../../shared/services/api';

/**
 * Get user projects list
 * @returns {Promise} Axios promise
 */
export const getProjectsApi = () => {
  return api.get('/projects');
};

/**
 * Create a new project
 * @param {Object} data - { title, subject_area, subject_category_ids, journal_ids }
 * @returns {Promise} Axios promise
 */
export const createProjectApi = (data) => {
  return api.post('/projects', data);
};

/**
 * Get project details by ID
 * @param {number|string} id - Project ID
 * @returns {Promise} Axios promise
 */
export const getProjectByIdApi = (id) => {
  return api.get(`/projects/${id}`);
};

/**
 * Get project overview statistics and charts
 * @param {number|string} id - Project ID
 * @returns {Promise} Axios promise
 */
export const getProjectOverviewApi = (id) => {
  return api.get(`/projects/${id}/overview`);
};

/**
 * Update project details by ID
 * @param {number|string} id - Project ID
 * @param {Object} data - { title, subject_area, subject_category_ids, journal_ids }
 * @returns {Promise} Axios promise
 */
export const updateProjectApi = (id, data) => {
  return api.put(`/projects/${id}`, data);
};

/**
 * Delete a project by ID
 * @param {number|string} id - Project ID
 * @returns {Promise} Axios promise
 */
export const deleteProjectApi = (id) => {
  return api.delete(`/projects/${id}`);
};

/**
 * Restore a deleted project by ID
 * @param {number|string} id - Project ID
 * @returns {Promise} Axios promise
 */
export const restoreProjectApi = (id) => {
  return api.put(`/projects/${id}/restore`);
};

/**
 * Get project-related articles stream
 * @param {number|string} id - Project ID
 * @param {number} limit - Maximum articles count
 * @returns {Promise} Axios promise
 */
export const getRelatedArticlesApi = (id, limit = 5) => {
  return api.get(`/projects/${id}/related-articles`, {
    params: { limit },
  });
};

/**
 * Get project statistics for charts
 * @param {number|string} id - Project ID
 * @returns {Promise} Axios promise
 */
export const getProjectAnalyticsApi = (id) => {
  return api.get(`/projects/${id}/analytics`);
};

/**
 * Get project top trending keywords
 * @param {number|string} id - Project ID
 * @param {number} limit - Keywords count limit
 * @param {string} sortBy - sort criterion: 'count' or 'score'
 * @returns {Promise} Axios promise
 */
export const getTrendingKeywordsApi = (id, limit = 20, sortBy = 'count') => {
  return api.get(`/projects/${id}/keywords/trending`, {
    params: { limit, sort_by: sortBy },
  });
};

/**
 * Get latest articles from watched keywords
 * @param {number|string} id - Project ID
 * @returns {Promise} Axios promise
 */
export const getWatchedKeywordArticlesApi = (id, page = 1, limit = 10, filter = 'all') => {
  return api.get(`/projects/${id}/keywords/watch/articles`, {
    params: { page, limit, filter }
  });
};

/**
 * Watch new keyword list for a project
 * @param {number|string} id - Project ID
 * @param {Array<string>} keywords - Keywords array
 * @returns {Promise} Axios promise
 */
export const watchKeywordsApi = (id, keywords) => {
  return api.post(`/projects/${id}/keywords/watch`, { keyword_ids: keywords });
};

/**
 * Override/Update keywords watch-list for a project
 * @param {number|string} id - Project ID
 * @param {Array<string>} keywords - Keywords array
 * @returns {Promise} Axios promise
 */
export const updateWatchedKeywordsApi = (id, keywords) => {
  return api.put(`/projects/${id}/keywords/watch`, { keyword_ids: keywords });
};

/**
 * Unwatch/Remove a keyword from project watch-list
 * @param {number|string} id - Project ID
 * @param {number|string} keywordId - Keyword entry ID
 * @returns {Promise} Axios promise
 */
export const unwatchKeywordApi = (id, keywordId) => {
  return api.delete(`/projects/${id}/keywords/${keywordId}`);
};

/**
 * Activate a project to VIP
 * @param {number|string} id - Project ID
 * @param {number} coinAmount - Amount of coins to deduct
 * @returns {Promise} Axios promise
 */
export const activateProjectApi = (id, coinAmount) => {
  return api.put(`/projects/${id}/activate`, { coinAmount });
};

/**
 * Get project members list
 * @param {number|string} id - Project ID
 * @returns {Promise} Axios promise
 */
export const getProjectMembersApi = (id) => {
  return api.get(`/projects/${id}/members`);
};

/**
 * Invite a member to the project
 * @param {number|string} id - Project ID
 * @param {string} email - User email
 * @param {string} role - Role (OWNER, ADMIN, MEMBER, VIEWER)
 * @returns {Promise} Axios promise
 */
export const inviteProjectMemberApi = (id, email, role) => {
  return api.post(`/projects/${id}/members/invite`, { email, role });
};

/**
 * Update project member role
 * @param {number|string} id - Project ID
 * @param {string} userId - User ID
 * @param {string} role - New role
 * @returns {Promise} Axios promise
 */
export const updateProjectMemberRoleApi = (id, userId, role) => {
  return api.put(`/projects/${id}/members/${userId}/role`, { role });
};

/**
 * Remove a member or cancel invitation
 * @param {number|string} id - Project ID
 * @param {string} userId - User ID
 * @returns {Promise} Axios promise
 */
export const removeProjectMemberApi = (id, userId) => {
  return api.delete(`/projects/${id}/members/${userId}`);
};

/**
 * Accept project invitation via email token
 * @param {string} token - JWT Token
 * @returns {Promise} Axios promise
 */
export const acceptProjectInviteApi = (token) => {
  return api.get(`/projects/project-invite/accept`, {
    params: { token }
  });
};

