/**
 * File source thuộc hệ thống FE ResearchPulse.
 *
 * File: features\project\hooks\useProjectDetails.js
 */
import { useState, useCallback } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getProjectByIdApi,
  updateProjectApi,
  getRelatedArticlesApi,
  getProjectAnalyticsApi,
  getTrendingKeywordsApi,
  getWatchedKeywordArticlesApi,
  watchKeywordsApi,
  updateWatchedKeywordsApi,
  unwatchKeywordApi,
} from '../api/project.api';

export default function useProjectDetails(projectId) {
  const queryClient = useQueryClient();
  const [shouldFetchProject, setShouldFetchProject] = useState(false);
  const [shouldFetchArticles, setShouldFetchArticles] = useState(false);
  const [shouldFetchAnalytics, setShouldFetchAnalytics] = useState(false);
  const [shouldFetchKeywords, setShouldFetchKeywords] = useState(false);
  const [shouldFetchWatched, setShouldFetchWatched] = useState(false);

  const [articlesParams, setArticlesParams] = useState({ limit: 5 });
  const [keywordsParams, setKeywordsParams] = useState({ limit: 20, sortBy: 'count' });

  const [mutationLoading, setMutationLoading] = useState(false);
  const [mutationError, setMutationError] = useState(null);

  const { data: projectData, isLoading: projectLoading, error: projectError } = useQuery({
    queryKey: ['projects', 'detail', projectId],
    queryFn: async () => {
      const response = await getProjectByIdApi(projectId);
      if (response.data && response.data.success !== false) {
        return response.data.data;
      }
      throw new Error(response.data?.message || 'Failed to fetch project details');
    },
    staleTime: 30000,
    enabled: shouldFetchProject && !!projectId,
  });

  const { data: articlesData } = useQuery({
    queryKey: ['projects', 'detail', projectId, 'related-articles', articlesParams],
    queryFn: async () => {
      const response = await getRelatedArticlesApi(projectId, articlesParams.limit);
      if (response.data && response.data.success !== false) {
        return response.data.data || [];
      }
      return [];
    },
    staleTime: 30000,
    enabled: shouldFetchArticles && !!projectId,
  });

  const { data: analyticsData } = useQuery({
    queryKey: ['projects', 'detail', projectId, 'analytics'],
    queryFn: async () => {
      const response = await getProjectAnalyticsApi(projectId);
      if (response.data && response.data.success !== false) {
        return response.data.data;
      }
      return null;
    },
    staleTime: 30000,
    enabled: shouldFetchAnalytics && !!projectId,
  });

  const { data: keywordsData } = useQuery({
    queryKey: ['projects', 'detail', projectId, 'trending-keywords', keywordsParams],
    queryFn: async () => {
      const response = await getTrendingKeywordsApi(projectId, keywordsParams.limit, keywordsParams.sortBy);
      if (response.data) {
        return response.data.keywords || [];
      }
      return [];
    },
    staleTime: 30000,
    enabled: shouldFetchKeywords && !!projectId,
  });

  const { data: watchedData } = useQuery({
    queryKey: ['projects', 'detail', projectId, 'watched-articles'],
    queryFn: async () => {
      const response = await getWatchedKeywordArticlesApi(projectId);
      if (response.data && response.data.success !== false) {
        return response.data.data || [];
      }
      return [];
    },
    staleTime: 30000,
    enabled: shouldFetchWatched && !!projectId,
  });

  const project = projectData || null;
  const articles = articlesData || [];
  const analytics = analyticsData || null;
  const trendingKeywords = keywordsData || [];
  const watchedArticles = watchedData || [];

  const isLoading = projectLoading || mutationLoading;
  const error = (projectError ? projectError.message : null) || mutationError;

  const fetchProjectDetails = useCallback(async () => {
    if (!projectId) return;
    setShouldFetchProject(true);
  }, [projectId]);

  const updateProject = useCallback(async (updateData) => {
    if (!projectId) return;
    setMutationLoading(true);
    setMutationError(null);
    try {
      const response = await updateProjectApi(projectId, updateData);
      if (response.data && response.data.success !== false) {
        queryClient.setQueryData(['projects', 'detail', projectId], response.data.data);
        return response.data.data;
      } else {
        throw new Error(response.data?.message || 'Failed to update project');
      }
    } catch (err) {
      setMutationError(err.response?.data?.message || err.message);
      throw err;
    } finally {
      setMutationLoading(false);
    }
  }, [projectId, queryClient]);

  const fetchRelatedArticles = useCallback(async (limit = 5) => {
    if (!projectId) return;
    setArticlesParams({ limit });
    setShouldFetchArticles(true);
  }, [projectId]);

  const fetchAnalytics = useCallback(async () => {
    if (!projectId) return;
    setShouldFetchAnalytics(true);
  }, [projectId]);

  const fetchTrendingKeywords = useCallback(async (limit = 20, sortBy = 'count') => {
    if (!projectId) return;
    setKeywordsParams({ limit, sortBy });
    setShouldFetchKeywords(true);
  }, [projectId]);

  const fetchWatchedArticles = useCallback(async () => {
    if (!projectId) return;
    setShouldFetchWatched(true);
  }, [projectId]);

  const watchKeywords = useCallback(async (keywordsList) => {
    if (!projectId) return;
    setMutationLoading(true);
    setMutationError(null);
    try {
      const response = await watchKeywordsApi(projectId, keywordsList);
      queryClient.invalidateQueries({ queryKey: ['projects', 'detail', projectId] });
      return response.data;
    } catch (err) {
      setMutationError(err.response?.data?.message || err.message);
      throw err;
    } finally {
      setMutationLoading(false);
    }
  }, [projectId, queryClient]);

  const updateWatchedKeywords = useCallback(async (keywordsList) => {
    if (!projectId) return;
    setMutationLoading(true);
    setMutationError(null);
    try {
      const response = await updateWatchedKeywordsApi(projectId, keywordsList);
      queryClient.invalidateQueries({ queryKey: ['projects', 'detail', projectId] });
      return response.data;
    } catch (err) {
      setMutationError(err.response?.data?.message || err.message);
      throw err;
    } finally {
      setMutationLoading(false);
    }
  }, [projectId, queryClient]);

  const unwatchKeyword = useCallback(async (keywordId) => {
    if (!projectId) return;
    setMutationLoading(true);
    setMutationError(null);
    try {
      const response = await unwatchKeywordApi(projectId, keywordId);
      queryClient.invalidateQueries({ queryKey: ['projects', 'detail', projectId] });
      return response.data;
    } catch (err) {
      setMutationError(err.response?.data?.message || err.message);
      throw err;
    } finally {
      setMutationLoading(false);
    }
  }, [projectId, queryClient]);

  return {
    project,
    articles,
    analytics,
    trendingKeywords,
    watchedArticles,
    isLoading,
    error,
    fetchProjectDetails,
    updateProject,
    fetchRelatedArticles,
    fetchAnalytics,
    fetchTrendingKeywords,
    fetchWatchedArticles,
    watchKeywords,
    updateWatchedKeywords,
    unwatchKeyword,
  };
}
