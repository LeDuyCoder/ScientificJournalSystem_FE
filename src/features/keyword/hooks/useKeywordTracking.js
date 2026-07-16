import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import keywordService from '../services/keywordService';
import projectService from '../../project/services/projectService';

export const useKeywordTracking = (projectId) => {
  const queryClient = useQueryClient();
  const [watchArticlesPage, setWatchArticlesPage] = useState(1);
  const [keywordArticlesPage, setKeywordArticlesPage] = useState(1);
  const [actionLoading, setActionLoading] = useState(false);

  const { data: projectData, isLoading: projectLoading, error: projectError } = useQuery({
    queryKey: ['project', projectId, 'details'],
    queryFn: async () => {
      if (!projectId) return null;
      const pData = await projectService.getProjectById(projectId);
      return pData?.data || pData || null;
    },
    enabled: !!projectId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  const { data: trendingKeywords, isLoading: trendingLoading } = useQuery({
    queryKey: ['project', projectId, 'trending-keywords'],
    queryFn: async () => {
      if (!projectId) return [];
      const tData = await keywordService.getTrendingKeywords(projectId);
      return Array.isArray(tData) ? tData : [];
    },
    enabled: !!projectId,
    staleTime: 5 * 60 * 1000,
  });

  const { data: watchArticlesData, isLoading: watchArticlesLoading, isFetching: watchArticlesFetching } = useQuery({
    queryKey: ['project', projectId, 'articles', { page: watchArticlesPage, limit: 10 }],
    queryFn: async () => {
      if (!projectId) return null;
      return await keywordService.getWatchedKeywordArticles(projectId, watchArticlesPage, 10, 'all');
    },
    enabled: !!projectId,
    staleTime: 5 * 60 * 1000,
  });

  const { data: keywordArticlesData, isLoading: keywordArticlesLoading, isFetching: keywordArticlesFetching } = useQuery({
    queryKey: ['project', projectId, 'keyword-articles', { page: keywordArticlesPage, limit: 10 }],
    queryFn: async () => {
      if (!projectId) return null;
      return await keywordService.getWatchedKeywordArticles(projectId, keywordArticlesPage, 10, 'keyword');
    },
    enabled: !!projectId,
    staleTime: 5 * 60 * 1000,
  });

  let watchedKeywords = [];
  if (projectData) {
    let kwData = projectData.watched_keywords || projectData.keywords || [];
    if (typeof kwData === 'string') {
      kwData = kwData.split(',').map(s => s.trim()).filter(Boolean);
    }
    watchedKeywords = Array.isArray(kwData) ? kwData : [];
  }

  const watchArticles = Array.isArray(watchArticlesData?.data || watchArticlesData?.articles) ? (watchArticlesData?.data || watchArticlesData?.articles) : [];
  const watchArticlesPagination = {
    page: watchArticlesData?.pagination?.page || 1,
    limit: watchArticlesData?.pagination?.limit || 10,
    total: watchArticlesData?.pagination?.total || 0,
    totalPages: watchArticlesData?.pagination?.total_pages || 1,
  };

  const keywordArticles = Array.isArray(keywordArticlesData?.data || keywordArticlesData?.articles) ? (keywordArticlesData?.data || keywordArticlesData?.articles) : [];
  const keywordArticlesPagination = {
    page: keywordArticlesData?.pagination?.page || 1,
    limit: keywordArticlesData?.pagination?.limit || 10,
    total: keywordArticlesData?.pagination?.total || 0,
    totalPages: keywordArticlesData?.pagination?.total_pages || 1,
  };

  const addKeywordWatch = async (keywordStr) => {
    setActionLoading(true);
    try {
      await keywordService.watchKeywords(projectId, [keywordStr]);
      queryClient.invalidateQueries({ queryKey: ['project', projectId] });
      return true;
    } catch (err) {
      console.error("Error adding keyword", err);
      throw err;
    } finally {
      setActionLoading(false);
    }
  };

  const removeKeywordWatch = async (keywordId) => {
    setActionLoading(true);
    try {
      await keywordService.unwatchKeyword(projectId, keywordId);
      queryClient.invalidateQueries({ queryKey: ['project', projectId] });
      return true;
    } catch (err) {
      console.error("Error removing keyword", err);
      throw err;
    } finally {
      setActionLoading(false);
    }
  };

  const refetchAll = () => {
    queryClient.invalidateQueries({ queryKey: ['project', projectId] });
  };

  return {
    project: projectData,
    trendingKeywords: trendingKeywords || [],
    watchArticles,
    keywordArticles,
    watchedKeywords,
    watchArticlesPagination,
    keywordArticlesPagination,
    loading: projectLoading || trendingLoading || watchArticlesLoading || keywordArticlesLoading,
    error: projectError ? "Failed to load keyword tracking data. Please try again." : null,
    actionLoading,
    isFetching: watchArticlesFetching || keywordArticlesFetching,
    addKeywordWatch,
    removeKeywordWatch,
    refetch: refetchAll,
    fetchWatchArticles: setWatchArticlesPage,
    fetchKeywordArticles: setKeywordArticlesPage
  };
};
