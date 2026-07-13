import { useState, useCallback, useEffect } from 'react';
import keywordService from '../services/keywordService';
import projectService from '../../project/services/projectService';

export const useKeywordTracking = (projectId) => {
  const [project, setProject] = useState(null);
  const [trendingKeywords, setTrendingKeywords] = useState([]);
  const [watchArticles, setWatchArticles] = useState([]);
  const [watchedKeywords, setWatchedKeywords] = useState([]);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const [watchArticlesPagination, setWatchArticlesPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 1 });
  
  const [keywordArticles, setKeywordArticles] = useState([]);
  const [keywordArticlesPagination, setKeywordArticlesPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 1 });

  const fetchWatchArticles = useCallback(async (page = 1) => {
    if (!projectId) return;
    try {
      const res = await keywordService.getWatchedKeywordArticles(projectId, page, 10, 'all');
      const dataArr = res?.data || res?.articles || [];
      setWatchArticles(Array.isArray(dataArr) ? dataArr : []);
      if (res?.pagination) {
        setWatchArticlesPagination({
          page: res.pagination.page || 1,
          limit: res.pagination.limit || 10,
          total: res.pagination.total || 0,
          totalPages: res.pagination.total_pages || 1,
        });
      }
    } catch (err) {
      console.error("Error fetching watch articles", err);
    }
  }, [projectId]);

  const fetchKeywordArticles = useCallback(async (page = 1) => {
    if (!projectId) return;
    try {
      const res = await keywordService.getWatchedKeywordArticles(projectId, page, 10, 'keyword');
      const dataArr = res?.data || res?.articles || [];
      setKeywordArticles(Array.isArray(dataArr) ? dataArr : []);
      if (res?.pagination) {
        setKeywordArticlesPagination({
          page: res.pagination.page || 1,
          limit: res.pagination.limit || 10,
          total: res.pagination.total || 0,
          totalPages: res.pagination.total_pages || 1,
        });
      }
    } catch (err) {
      console.error("Error fetching keyword articles", err);
    }
  }, [projectId]);

  /**
   * Lấy toàn bộ dữ liệu cần thiết cho màn hình Keyword Tracking
   */
  const fetchAllData = useCallback(async () => {
    if (!projectId) return;
    setLoading(true);
    setError(null);
    try {
      // 1. Get Project Detail
      const pData = await projectService.getProjectById(projectId);
      const proj = pData?.data || pData || null;
      setProject(proj);
      
      let kwData = proj?.watched_keywords || proj?.keywords || [];
      if (typeof kwData === 'string') {
        kwData = kwData.split(',').map(s => s.trim()).filter(Boolean);
      }
      setWatchedKeywords(Array.isArray(kwData) ? kwData : []);

      // 2. Get Trending Keywords
      const tData = await keywordService.getTrendingKeywords(projectId);
      setTrendingKeywords(Array.isArray(tData) ? tData : []);

      // 3. Get Watch Articles
      await Promise.all([
        fetchWatchArticles(1),
        fetchKeywordArticles(1)
      ]);

    } catch (err) {
      console.error("Error fetching keyword tracking data", err);
      setError("Failed to load keyword tracking data. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [projectId, fetchWatchArticles, fetchKeywordArticles]);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  /**
   * Thêm một keyword vào danh sách theo dõi
   * @param {string} keywordStr Tên keyword
   */
  const addKeywordWatch = async (keywordStr) => {
    setActionLoading(true);
    try {
      await keywordService.watchKeywords(projectId, [keywordStr]);
      await fetchAllData();
      return true;
    } catch (err) {
      console.error("Error adding keyword", err);
      throw err;
    } finally {
      setActionLoading(false);
    }
  };

  /**
   * Bỏ theo dõi một keyword
   * @param {number|string} keywordId ID của keyword
   */
  const removeKeywordWatch = async (keywordId) => {
    setActionLoading(true);
    try {
      await keywordService.unwatchKeyword(projectId, keywordId);
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
    keywordArticles,
    watchedKeywords,
    watchArticlesPagination,
    keywordArticlesPagination,
    loading,
    error,
    actionLoading,
    addKeywordWatch,
    removeKeywordWatch,
    refetch: fetchAllData,
    fetchWatchArticles,
    fetchKeywordArticles
  };
};
