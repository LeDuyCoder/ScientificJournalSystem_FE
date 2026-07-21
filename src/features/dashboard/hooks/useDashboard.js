/**
 * File source thuộc hệ thống FE ResearchPulse.
 *
 * File: features\dashboard\hooks\useDashboard.js
 */
import { useQuery } from '@tanstack/react-query';
import { useCallback } from 'react';
import {
  getDashboardProjectsApi,
  getPublicationTrendsApi,
  getDashboardTrendingKeywordsApi,
  getTopAuthorsApi,
} from '../api/dashboardApi';
import { getAuthorAreasBreakdownApi } from '../../author/api/author.api';

const normalizeAuthorBreakdown = (response) => {
  if (!response?.data || typeof response.data !== 'object') return [];
  const payload = response.data.data;
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.breakdown)) return payload.breakdown;
  if (Array.isArray(payload?.data)) return payload.data;
  return [];
};

const getPrimarySubjectAreaFromBreakdown = (breakdown = []) => {
  if (!Array.isArray(breakdown) || breakdown.length === 0) return '';
  const primary = [...breakdown].sort((a, b) => (Number(b.percentage) || 0) - (Number(a.percentage) || 0))[0];
  return primary.category_name ?? primary.subject_area ?? primary.subject_area_name ?? primary.name ?? primary.display_name ?? '';
};

const normalizeTopAuthor = (author) => ({
  ...author,
  full_name: author.display_name ?? author.full_name ?? author.author_name ?? author.name ?? 'Unknown',
  article_count: author.article_count ?? author.papers ?? author.works_count ?? 0,
  citation_count: author.citation_count ?? author.citations ?? author.cited_by_count ?? 0,
});

/**
 * useDashboard — central data hook for the Dashboard/Tổng quan page.
 * Fetches projects, analytics, trending keywords and top authors in parallel using Tanstack Query.
 */
export default function useDashboard(currentUser, trendRange = '5') {
  // 1. Projects Query
  const {
    data: projectsData,
    isLoading: loadingProjects,
    error: projectsQueryError,
    refetch: refetchProjects
  } = useQuery({
    queryKey: ['dashboard', 'projects', currentUser],
    queryFn: async () => {
      const res = await getDashboardProjectsApi();
      const data = res.data?.data ?? res.data ?? [];
      return Array.isArray(data) ? data : [];
    },
    enabled: !!currentUser,
    staleTime: 7200000, // 2 hours
  });

  const projects = projectsData || [];
  const errorProjects = projectsQueryError 
    ? (projectsQueryError.response?.status === 401 ? 'Bạn cần đăng nhập để xem dashboard.' : projectsQueryError.response?.data?.message || projectsQueryError.message || 'Không thể tải projects.')
    : null;

  // 2. Analytics Query
  const {
    data: analyticsData,
    isLoading: loadingAnalytics,
    error: analyticsQueryError,
    refetch: refetchAnalytics
  } = useQuery({
    queryKey: ['dashboard', 'analytics', currentUser, trendRange],
    queryFn: async () => {
      const currentYear = new Date().getFullYear();
      const yearCount = Number(trendRange);
      const yearParams = Number.isFinite(yearCount)
        ? { fromYear: currentYear - yearCount + 1, toYear: currentYear }
        : {};
      const res = await getPublicationTrendsApi(yearParams);
      const trendData = res.data?.data ?? [];
      const rows = Array.isArray(trendData) ? trendData : [];
      return {
        years: rows.map((item) => item.year),
        series: [
          {
            label: 'dashboard.soBaiBaoXuatBan',
            data: rows.map((item) => item.totalPublications ?? 0),
          },
        ],
        rawData: rows,
      };
    },
    enabled: !!currentUser,
    staleTime: 7200000, // 2 hours
  });

  const analytics = analyticsData || { years: [], series: [], rawData: [] };
  const errorAnalytics = analyticsQueryError ? analyticsQueryError.response?.data?.message || analyticsQueryError.message || 'Không thể tải xu hướng xuất bản.' : null;

  // 3. Trending Keywords Query
  const {
    data: trendingKeywordsData,
    isLoading: loadingKeywords,
    error: keywordsQueryError,
    refetch: refetchKeywords
  } = useQuery({
    queryKey: ['dashboard', 'trendingKeywords', currentUser, trendRange],
    queryFn: async () => {
      const currentYear = new Date().getFullYear();
      const yearCount = Number(trendRange);
      const yearParams = Number.isFinite(yearCount)
        ? { fromYear: currentYear - yearCount + 1, toYear: currentYear }
        : {};
      const params = {
        limit: 10,
        metric: 'articleCount',
        ...yearParams,
      };
      const res = await getDashboardTrendingKeywordsApi(params);
      return res.data?.chart ?? res.data?.data?.chart ?? res.data ?? null;
    },
    enabled: !!currentUser,
    staleTime: 7200000, // 2 hours
  });

  const trendingKeywords = trendingKeywordsData || null;
  const errorKeywords = keywordsQueryError ? keywordsQueryError.response?.data?.message || keywordsQueryError.message || 'Không thể tải trending keywords.' : null;

  // 4. Top Authors Query
  const {
    data: topAuthorsData,
    isLoading: loadingAuthors,
    error: authorsQueryError,
    refetch: refetchAuthors
  } = useQuery({
    queryKey: ['dashboard', 'topAuthors'],
    queryFn: async () => {
      const res = await getTopAuthorsApi(5);
      const data = res.data?.data ?? res.data ?? [];
      const topAuthorsList = Array.isArray(data) ? data.slice(0, 5) : [];

      const breakdownResults = await Promise.allSettled(
        topAuthorsList.map(async (author) => {
          const id = author.author_id ?? author.id;
          if (!id) return { id: null, breakdown: [] };
          try {
            const breakdownResponse = await getAuthorAreasBreakdownApi(id);
            return { id, breakdown: normalizeAuthorBreakdown(breakdownResponse) };
          } catch {
            return { id, breakdown: [] };
          }
        })
      );

      const breakdownMap = breakdownResults.reduce((acc, result, index) => {
        const author = topAuthorsList[index];
        const id = author?.author_id ?? author?.id;
        if (!id) return acc;
        acc[id] = result.status === 'fulfilled' ? result.value.breakdown : [];
        return acc;
      }, {});

      return topAuthorsList.map((author) => {
        const normalized = normalizeTopAuthor(author);
        const id = normalized.author_id ?? normalized.id;
        const breakdown = id ? breakdownMap[id] || [] : [];
        const primary_subject_area = normalized.subject_area ?? normalized.field ?? normalized.area ?? getPrimarySubjectAreaFromBreakdown(breakdown);
        return {
          ...normalized,
          primary_subject_area,
        };
      });
    },
    enabled: !!currentUser,
    staleTime: 7200000, // 2 hours
  });

  const topAuthors = topAuthorsData || [];
  const errorAuthors = authorsQueryError ? authorsQueryError.response?.data?.message || authorsQueryError.message || 'Không thể tải top authors.' : null;

  // ── derived stat card data ───────────────────────────────────────────────
  const summaryStats = {
    projectCount:  projects.length,
    journalCount:  projects.reduce((acc, p) => acc + (p.journal_count  ?? p.journals?.length  ?? 0), 0),
    articleCount:  projects.reduce((acc, p) => acc + (p.article_count  ?? 0), 0),
    keywordCount:  projects.reduce((acc, p) => acc + (p.keyword_count  ?? 0), 0),
  };

  const refetchAll = useCallback(() => {
    if (!currentUser) return;
    refetchAnalytics();
    refetchProjects();
    refetchAuthors();
    refetchKeywords();
  }, [currentUser, refetchProjects, refetchAuthors, refetchAnalytics, refetchKeywords]);

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

    refetchProjects,
    refetchAnalytics,
    refetchKeywords,
    refetchAuthors,
    refetchAll,
  };
}
