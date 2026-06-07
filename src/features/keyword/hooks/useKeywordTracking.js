import { useState, useCallback, useEffect } from 'react';
import {
  getTrendingKeywordsApi,
  getWatchedKeywordArticlesApi,
  watchKeywordsApi,
  unwatchKeywordApi,
  getProjectByIdApi
} from '../../project/api/project.api';

export const useKeywordTracking = (projectId) => {
  const [project, setProject] = useState(null);
  const [trendingKeywords, setTrendingKeywords] = useState([]);
  const [watchArticles, setWatchArticles] = useState([]);
  const [watchedKeywords, setWatchedKeywords] = useState([]);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchAllData = useCallback(async () => {
    if (!projectId) return;
    setLoading(true);
    setError(null);
    try {
      // 1. Get Project Detail
      const projectRes = await getProjectByIdApi(projectId);
      const pData = projectRes.data?.data || projectRes.data || null;
      setProject(pData);
      
      let kwData = pData?.watched_keywords || pData?.keywords || [];
      if (typeof kwData === 'string') {
        kwData = kwData.split(',').map(s => s.trim()).filter(Boolean);
      }
      setWatchedKeywords(Array.isArray(kwData) ? kwData : []);

      // 2. Get Trending Keywords
      const trendingRes = await getTrendingKeywordsApi(projectId);
      const tData = trendingRes.data?.data || trendingRes.data || [];
      setTrendingKeywords(Array.isArray(tData) ? tData : []);

      // 3. Get Watch Articles
      const articlesRes = await getWatchedKeywordArticlesApi(projectId);
      const aData = articlesRes.data?.data || articlesRes.data || [];
      setWatchArticles(Array.isArray(aData) ? aData : []);

    } catch (err) {
      console.error("Error fetching keyword tracking data", err);
      setError("Failed to load keyword tracking data. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  const addKeywordWatch = async (keywordStr) => {
    setActionLoading(true);
    try {
      await watchKeywordsApi(projectId, [keywordStr]);
      await fetchAllData();
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
      await unwatchKeywordApi(projectId, keywordId);
      await fetchAllData();
      return true;
    } catch (err) {
      console.error("Error removing keyword", err);
      throw err;
    } finally {
      setActionLoading(false);
    }
  };

  return {
    project,
    trendingKeywords,
    watchArticles,
    watchedKeywords,
    loading,
    error,
    actionLoading,
    addKeywordWatch,
    removeKeywordWatch,
    refetch: fetchAllData
  };
};
