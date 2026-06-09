/**
 * File source thuộc hệ thống FE ResearchPulse.
 *
 * File: features\dashboard\api\dashboardApi.js
 */
import httpClient from '../../../shared/services/httpClient';

/**
 * Get list of user projects (stat cards & recent projects)
 * BE: GET /api/v1/projects  [requireAuth]
 */
export const getDashboardProjectsApi = () => httpClient.get('/projects');

/**
 * Get project analytics / publication trend
 * BE: GET /api/v1/projects/:id/analytics  [requireAuth]
 */
export const getProjectAnalyticsApi = (projectId) =>
  httpClient.get(`/projects/${projectId}/analytics`);

/**
 * Get trending keywords for a project
 * BE: GET /api/v1/projects/:id/keywords/trending  [requireAuth]
 * (via keyword route mounted under /projects)
 */
export const getTrendingKeywordsApi = (projectId, limit = 12) =>
  httpClient.get(`/projects/${projectId}/keywords/trending`, { params: { limit } });

/**
 * Get top author leaderboard
 * BE: GET /api/v1/author/leaderboard  [requireAuth]
 */
export const getTopAuthorsApi = (limit = 5) =>
  httpClient.get('/author/leaderboard', { params: { limit } });

/**
 * Get related articles for a project
 * BE: GET /api/v1/projects/:id/related-articles  [requireAuth]
 */
export const getRelatedArticlesApi = (projectId, limit = 5) =>
  httpClient.get(`/projects/${projectId}/related-articles`, { params: { limit } });
