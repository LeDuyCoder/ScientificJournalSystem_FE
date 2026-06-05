import { useState, useEffect, useCallback } from 'react';
import {
  getDashboardProjectsApi,
  getProjectAnalyticsApi,
  getTrendingKeywordsApi,
  getTopAuthorsApi,
} from '../api/dashboardApi';

export default function useDashboard() {
  const [projects, setProjects] = useState([]);
  const [analytics, setAnalytics] = useState(null); // from first project
  const [trendingKeywords, setTrendingKeywords] = useState([]);
  const [topAuthors, setTopAuthors] = useState([]);

  const [loadingProjects, setLoadingProjects] = useState(true);
  const [loadingAnalytics, setLoadingAnalytics] = useState(false);
  const [loadingKeywords, setLoadingKeywords] = useState(false);
  const [loadingAuthors, setLoadingAuthors] = useState(true);

  const [errorProjects, setErrorProjects] = useState(null);
  const [errorAnalytics, setErrorAnalytics] = useState(null);
  const [errorKeywords, setErrorKeywords] = useState(null);
  const [errorAuthors, setErrorAuthors] = useState(null);

  const fetchProjects = useCallback(async () => {
    setLoadingProjects(true);
    setErrorProjects(null);
    try {
      const res = await getDashboardProjectsApi();
      const data = res.data?.data || res.data || [];
      const list = Array.isArray(data) ? data : [];
      setProjects(list);
      return list;
    } catch (err) {
      setErrorProjects(err.response?.data?.message || err.message || 'Không thể tải projects');
      return [];
    } finally {
      setLoadingProjects(false);
    }
  }, []);

  const fetchAnalytics = useCallback(async (projectId) => {
    if (!projectId) return;
    setLoadingAnalytics(true);
    setErrorAnalytics(null);
    try {
      const res = await getProjectAnalyticsApi(projectId);
      setAnalytics(res.data?.data || res.data || null);
    } catch (err) {
      setErrorAnalytics(err.response?.data?.message || err.message || 'Không thể tải xu hướng');
    } finally {
      setLoadingAnalytics(false);
    }
  }, []);

  const fetchKeywords = useCallback(async (projectId) => {
    if (!projectId) return;
    setLoadingKeywords(true);
    setErrorKeywords(null);
    try {
      const res = await getTrendingKeywordsApi(projectId, 12);
      const data = res.data?.data || res.data || [];
      setTrendingKeywords(Array.isArray(data) ? data : []);
    } catch (err) {
      setErrorKeywords(err.response?.data?.message || err.message || 'Không thể tải keywords');
    } finally {
      setLoadingKeywords(false);
    }
  }, []);

  const fetchAuthors = useCallback(async () => {
    setLoadingAuthors(true);
    setErrorAuthors(null);
    try {
      const res = await getTopAuthorsApi();
      const data = res.data?.data || res.data || [];
      setTopAuthors(Array.isArray(data) ? data.slice(0, 5) : []);
    } catch (err) {
      setErrorAuthors(err.response?.data?.message || err.message || 'Không thể tải top authors');
    } finally {
      setLoadingAuthors(false);
    }
  }, []);

  useEffect(() => {
    const init = async () => {
      const [list] = await Promise.all([fetchProjects(), fetchAuthors()]);
      if (list && list.length > 0) {
        const firstId = list[0]?.id;
        fetchAnalytics(firstId);
        fetchKeywords(firstId);
      } else {
        setLoadingAnalytics(false);
        setLoadingKeywords(false);
      }
    };
    init();
  }, [fetchProjects, fetchAuthors, fetchAnalytics, fetchKeywords]);

  // Derived stat card data from projects list
  const summaryStats = {
    projectCount: projects.length,
    journalCount: projects.reduce((acc, p) => acc + (p.journal_count || p.journals?.length || 0), 0),
    articleCount: projects.reduce((acc, p) => acc + (p.article_count || 0), 0),
    keywordCount: projects.reduce((acc, p) => acc + (p.keyword_count || 0), 0),
  };

  return {
    projects,
    analytics,
    trendingKeywords,
    topAuthors,
    summaryStats,
    loadingProjects,
    loadingAnalytics,
    loadingKeywords,
    loadingAuthors,
    errorProjects,
    errorAnalytics,
    errorKeywords,
    errorAuthors,
  };
}
