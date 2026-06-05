import api from '../../../shared/services/api';

/**
 * Get list of user projects (for stat cards & recent projects)
 */
export const getDashboardProjectsApi = () => api.get('/projects');

/**
 * Get project analytics / publication trend for a given project
 * @param {number|string} projectId
 */
export const getProjectAnalyticsApi = (projectId) =>
  api.get(`/projects/${projectId}/analytics`);

/**
 * Get trending keywords for a given project
 * @param {number|string} projectId
 * @param {number} limit
 */
export const getTrendingKeywordsApi = (projectId, limit = 20) =>
  api.get(`/projects/${projectId}/keywords/trending`, { params: { limit } });

/**
 * Get top author leaderboard
 */
export const getTopAuthorsApi = () => api.get('/author/leaderboard');
