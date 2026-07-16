/**
 * File source thuộc hệ thống FE ResearchPulse.
 *
 * File: features\author\hooks\useAuthors.js
 */
import { useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  getAuthorsApi,
  getAuthorDetailApi,
  getAuthorAreasBreakdownApi,
  getAuthorArticlesApi,
  getAuthorLeaderboardApi,
  getSubjectAreasApi,
} from '../api/author.api';

// ── DỮ LIỆU GIẢ ĐỊNH DỰ PHÒNG ───────────────────
const MOCK_AUTHORS = [
  { id: '1', author_id: '1', name: 'GS. TS. Nguyễn Văn A', full_name: 'GS. TS. Nguyễn Văn A', institution_1: 'Đại học Bách Khoa Hà Nội', institution_2: 'Viện Công nghệ Thông tin và Truyền thông', email: 'a.nguyenvan@hust.edu.vn', h_index: 38, citation_count: 4520, article_count: 124, orcid: '0000-0002-1823-4567', avatar_color: '#FF7A33', bio: '...', homepage: '', subject_areas: ['Machine Learning', 'Computer Vision', 'Healthcare AI'] },
  { id: '2', author_id: '2', name: 'PGS. TS. Trần Thị B', full_name: 'PGS. TS. Trần Thị B', institution_1: 'Đại học Quốc gia TP.HCM', institution_2: 'Khoa Khoa học & Kỹ thuật Máy tính', email: 'ttb@hcmut.edu.vn', h_index: 29, citation_count: 2980, article_count: 87, orcid: '0000-0003-4567-8901', avatar_color: '#6366F1', bio: '...', homepage: '', subject_areas: ['Natural Language Processing', 'Deep Learning', 'Data Mining'] },
  { id: '3', author_id: '3', name: 'TS. Lê Văn C', full_name: 'TS. Lê Văn C', institution_1: 'Viện Hàn lâm Khoa học và Công nghệ Việt Nam', institution_2: 'Viện Vật lý', email: 'lvc@iop.vast.ac.vn', h_index: 22, citation_count: 1850, article_count: 56, orcid: '0000-0001-9876-5432', avatar_color: '#0EA5E9', bio: '...', homepage: '', subject_areas: ['Quantum Optics', 'Nanophotonics', 'Laser Physics'] },
  { id: '4', author_id: '4', name: 'Dr. Michael Jordan', full_name: 'Dr. Michael Jordan', institution_1: 'University of California, Berkeley', institution_2: 'Department of EECS', email: 'jordan@cs.berkeley.edu', h_index: 168, citation_count: 215000, article_count: 650, orcid: '0000-0002-2345-6789', avatar_color: '#D97706', bio: '...', homepage: '', subject_areas: ['Machine Learning', 'Optimization', 'Statistics'] }
];

const MOCK_LEADERBOARD = [
  { id: '1', author_id: '1', name: 'GS. TS. Nguyễn Văn A', subject_area: 'Computer Vision', article_count: 124, citation_count: 4520, papers: 124, citations: 4520 },
  { id: '2', author_id: '2', name: 'PGS. TS. Trần Thị B', subject_area: 'Deep Learning', article_count: 87, citation_count: 2980, papers: 87, citations: 2980 },
  { id: '3', author_id: '3', name: 'TS. Lê Văn C', subject_area: 'Quantum Optics', article_count: 56, citation_count: 1850, papers: 56, citations: 1850 },
  { id: '4', author_id: '4', name: 'Dr. Michael Jordan', subject_area: 'Machine Learning', article_count: 650, citation_count: 215000, papers: 650, citations: 215000 }
];

const createUnknownAuthorFallback = (authorId) => ({ id: String(authorId), author_id: String(authorId), name: `Tác giả #${authorId}`, full_name: `Tác giả #${authorId}`, institution_1: 'Chưa có dữ liệu từ API tác giả', institution_2: '', email: '', h_index: 0, citation_count: 0, article_count: 0, orcid: '', avatar_color: '#6366F1', bio: 'Hiện chưa tải được hồ sơ chi tiết của tác giả này từ backend.', homepage: '', subject_areas: [] });
const MOCK_ARTICLES_MAP = {
  '1': [{ article_id: '1', title: 'Attention Is All You Need for Medical Image Classification', journal_name: 'IEEE Transactions on Pattern Analysis and Machine Intelligence', publication_year: 2026, doi: '10.1109/TPAMI.2026.12345', citation_count: 42 }],
  '2': [{ article_id: '4', title: 'BERT-based Named Entity Recognition for Vietnamese Electronic Health Records', journal_name: 'Journal of Biomedical Informatics', publication_year: 2025, doi: '10.1016/j.jbi.2025.10425', citation_count: 15 }],
  '3': [{ article_id: '6', title: 'Coherent Control of Multi-Photon Transitions in Quantum Dot Systems', journal_name: 'Nature Photonics', publication_year: 2025, doi: '10.1038/s41566-025-0123-x', citation_count: 48 }],
  '4': [{ article_id: '8', title: 'An Introduction to Variational Autoencoders and Graphical Models', journal_name: 'Foundations and Trends in Machine Learning', publication_year: 2024, doi: '10.1561/2200000099', citation_count: 1450 }]
};
const MOCK_BREAKDOWNS_MAP = {
  '1': [{ subject_area: 'Machine Learning', count: 56, percentage: 45 }, { subject_area: 'Computer Vision', count: 37, percentage: 30 }],
  '2': [{ subject_area: 'Natural Language Processing', count: 42, percentage: 48 }, { subject_area: 'Deep Learning', count: 28, percentage: 32 }],
  '3': [{ subject_area: 'Quantum Optics', count: 28, percentage: 50 }, { subject_area: 'Nanophotonics', count: 18, percentage: 32 }],
  '4': [{ subject_area: 'Machine Learning', count: 350, percentage: 54 }, { subject_area: 'Optimization', count: 180, percentage: 28 }]
};

const normalizeAuthorRecord = (author) => {
  if (!author || typeof author !== 'object') return author;
  const rawName = author.display_name ?? author.full_name ?? author.name ?? '';
  const cleanedName = String(rawName).trim().replace(/^[\s;'"`]+/, '').trim() || 'Tác giả';
  return { ...author, full_name: cleanedName, name: cleanedName, institution_1: author.institution_1 ?? author.last_known_institution ?? author.institution ?? '', institution_2: author.institution_2 ?? author.department ?? author.affiliation ?? '', article_count: author.article_count ?? author.works_count ?? 0, citation_count: author.citation_count ?? author.cited_by_count ?? 0, homepage: author.homepage ?? author.homepage_url ?? '', bio: author.bio ?? author.description ?? '', orcid: author.orcid ?? '' };
};

const getAuthorMetric = (author, keys = []) => {
  for (const key of keys) {
    const value = Number(author?.[key]);
    if (!Number.isNaN(value)) return value;
  }
  return 0;
};

const sortAuthorsByImpact = (list = []) => {
  return [...list].sort((a, b) => {
    const hIndexDiff = getAuthorMetric(b, ['h_index', 'hindex']) - getAuthorMetric(a, ['h_index', 'hindex']);
    if (hIndexDiff !== 0) return hIndexDiff;
    const citationDiff = getAuthorMetric(b, ['citation_count', 'cited_by_count', 'citations']) - getAuthorMetric(a, ['citation_count', 'cited_by_count', 'citations']);
    if (citationDiff !== 0) return citationDiff;
    return getAuthorMetric(b, ['article_count', 'works_count', 'papers']) - getAuthorMetric(a, ['article_count', 'works_count', 'papers']);
  });
};

const normalizeAreasBreakdown = (data) => {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.items)) return data.items;
  if (Array.isArray(data?.breakdown)) return data.breakdown;
  if (Array.isArray(data?.data)) return data.data;
  if (typeof data === 'object') {
    const ignoredKeys = new Set(['author_id', 'orcid', 'display_name', 'full_name', 'name', 'success', 'message']);
    const keys = Object.keys(data).filter((key) => !ignoredKeys.has(key));
    if (keys.length > 0) {
      const items = keys.map((key) => {
        const value = data[key];
        if (typeof value === 'object' && value !== null) {
          return { subject_area: value.category_name ?? value.subject_area_name ?? value.subject_area ?? value.display_name ?? value.name ?? key, percentage: value.percentage ?? value.percent ?? 0, count: value.count ?? value.article_count ?? 0, ...value };
        }
        return { subject_area: key, percentage: Number(value) || 0, count: 0 };
      });
      if (items.some((item) => item.subject_area || item.percentage || item.count)) return items;
    }
    return [{ subject_area: data.subject_area ?? data.name ?? 'Lĩnh vực khác', percentage: data.percentage ?? data.percent ?? 0, count: data.count ?? data.article_count ?? 0 }];
  }
  return [];
};

const getPrimarySubjectAreaFromBreakdown = (breakdown = []) => {
  if (!Array.isArray(breakdown) || breakdown.length === 0) return '';
  const first = [...breakdown].sort((a, b) => (Number(b.percentage) || 0) - (Number(a.percentage) || 0))[0];
  return first?.category_name ?? first?.subject_area ?? first?.subject_area_name ?? first?.name ?? first?.display_name ?? '';
};

const enrichLeaderboardAuthors = (authors = [], breakdownMap = {}) => {
  return authors.map((author) => {
    const id = author.author_id ?? author.id;
    const breakdown = breakdownMap[id] || [];
    const primarySubjectArea = author.subject_area ?? author.field ?? author.area ?? getPrimarySubjectAreaFromBreakdown(breakdown);
    return { ...author, breakdown, primary_subject_area: primarySubjectArea };
  });
};

const extractItemsFromCollectionPayload = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.items)) return payload.items;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.rows)) return payload.rows;
  return [];
};

const extractPaginationFromPayload = (responseData, payload = {}) => {
  return responseData?.pagination || payload?.pagination || {};
};

const normalizeSubjectAreaItems = (payload) => {
  const items = extractItemsFromCollectionPayload(payload);
  return items.map((item) => ({ ...item, subject_area_id: item?.subject_area_id ?? item?.id ?? '', display_name: item?.display_name ?? item?.name ?? '' }));
};

export default function useAuthors() {
  const [authorsParams, setAuthorsParams] = useState(null);
  const [leaderboardParams, setLeaderboardParams] = useState(null);
  const [subjectAreasParams, setSubjectAreasParams] = useState(null);
  const [authorDetailId, setAuthorDetailId] = useState(null);
  const [authorArticlesParams, setAuthorArticlesParams] = useState(null);
  const [authorBreakdownId, setAuthorBreakdownId] = useState(null);

  // 1. Authors List
  const { data: authorsData, isLoading: loadingAuthors, error: errorAuthors } = useQuery({
    queryKey: ['authors', 'list', authorsParams],
    queryFn: async () => {
      try {
        const response = await getAuthorsApi(authorsParams);
        if (response.data && typeof response.data === 'object' && response.data.success !== false) {
          const payload = response.data.data;
          const items = extractItemsFromCollectionPayload(payload);
          const normalizedItems = items.map(normalizeAuthorRecord);
          const pagination = extractPaginationFromPayload(response.data, payload);
          const total = pagination.total ?? payload?.total ?? normalizedItems.length;
          const limit = pagination.limit ?? (parseInt(authorsParams.limit || '1', 10) || normalizedItems.length || 1);

          const sortedItems = (() => {
            if (authorsParams.sort === 'impact' || authorsParams.sort === 'h_index') return sortAuthorsByImpact(normalizedItems);
            if (authorsParams.sort === 'articles') return [...normalizedItems].sort((a, b) => getAuthorMetric(b, ['article_count', 'works_count', 'papers']) - getAuthorMetric(a, ['article_count', 'works_count', 'papers']));
            if (authorsParams.sort === 'citations') return [...normalizedItems].sort((a, b) => getAuthorMetric(b, ['citation_count', 'cited_by_count', 'citations']) - getAuthorMetric(a, ['citation_count', 'cited_by_count', 'citations']));
            return normalizedItems;
          })();
          return { authors: sortedItems, total, totalPages: Math.max(1, Math.ceil(total / limit)) };
        } else {
          throw new Error(response.data?.message || 'Failed to fetch authors');
        }
      } catch (err) {
        // Mock Fallback
        const keyword = (authorsParams.search || '').toLowerCase().trim();
        const area = (authorsParams.subject_area || '').trim();
        const sort = authorsParams.sort || '';
        let filtered = [...MOCK_AUTHORS];
        if (keyword) filtered = filtered.filter(a => a.name.toLowerCase().includes(keyword) || (a.institution_1 || '').toLowerCase().includes(keyword) || (a.institution_2 || '').toLowerCase().includes(keyword) || (a.orcid || '').includes(keyword) || a.subject_areas.some(tag => tag.toLowerCase().includes(keyword)));
        if (area) filtered = filtered.filter(a => a.subject_areas.includes(area));
        if (sort === 'impact' || sort === 'h_index') filtered = sortAuthorsByImpact(filtered);
        else if (sort === 'articles') filtered.sort((a, b) => getAuthorMetric(b, ['article_count', 'works_count', 'papers']) - getAuthorMetric(a, ['article_count', 'works_count', 'papers']));
        else if (sort === 'citations') filtered.sort((a, b) => getAuthorMetric(b, ['citation_count', 'cited_by_count', 'citations']) - getAuthorMetric(a, ['citation_count', 'cited_by_count', 'citations']));

        const page = parseInt(authorsParams.page || '1', 10);
        const limit = parseInt(authorsParams.limit || '10', 10);
        const startIndex = (page - 1) * limit;
        const paginated = filtered.slice(startIndex, startIndex + limit);
        return { authors: paginated, total: filtered.length, totalPages: Math.max(1, Math.ceil(filtered.length / limit)) };
      }
    },
    enabled: !!authorsParams,
  });

  const fetchAuthors = useCallback((params = {}) => setAuthorsParams(params), []);

  // 2. Author Detail
  const { data: currentAuthor, isLoading: loadingAuthorDetail, error: errorAuthorDetail } = useQuery({
    queryKey: ['authors', 'detail', authorDetailId],
    queryFn: async () => {
      try {
        const response = await getAuthorDetailApi(authorDetailId);
        if (response.data && typeof response.data === 'object' && response.data.success !== false) {
          return normalizeAuthorRecord(response.data.data || {});
        } else {
          throw new Error(response.data?.message || 'Failed to fetch author detail');
        }
      } catch (err) {
        return MOCK_AUTHORS.find(a => String(a.id) === String(authorDetailId)) || createUnknownAuthorFallback(authorDetailId);
      }
    },
    enabled: !!authorDetailId,
  });

  const fetchAuthorDetail = useCallback((id) => setAuthorDetailId(id), []);

  // 3. Author Articles
  const { data: authorArticlesData, isLoading: loadingArticles, error: errorArticles } = useQuery({
    queryKey: ['authors', 'articles', authorArticlesParams?.id, authorArticlesParams?.params],
    queryFn: async () => {
      const { id, params } = authorArticlesParams;
      try {
        const response = await getAuthorArticlesApi(id, params);
        if (response.data && typeof response.data === 'object' && response.data.success !== false) {
          return extractItemsFromCollectionPayload(response.data.data);
        } else {
          throw new Error(response.data?.message || 'Failed to fetch author articles');
        }
      } catch (err) {
        return MOCK_ARTICLES_MAP[String(id)] || [];
      }
    },
    enabled: !!authorArticlesParams,
  });

  const fetchAuthorArticles = useCallback((id, params = {}) => setAuthorArticlesParams({ id, params }), []);

  // 4. Author Areas Breakdown
  const { data: authorBreakdownData, isLoading: loadingAreas, error: errorAreas } = useQuery({
    queryKey: ['authors', 'areas-breakdown', authorBreakdownId],
    queryFn: async () => {
      try {
        const response = await getAuthorAreasBreakdownApi(authorBreakdownId);
        if (response.data && typeof response.data === 'object' && response.data.success !== false) {
          return normalizeAreasBreakdown(response.data.data);
        } else {
          throw new Error(response.data?.message || 'Failed to fetch areas breakdown');
        }
      } catch (err) {
        return MOCK_BREAKDOWNS_MAP[String(authorBreakdownId)] || [];
      }
    },
    enabled: !!authorBreakdownId,
  });

  const fetchAuthorAreasBreakdown = useCallback((id) => setAuthorBreakdownId(id), []);

  // Subject Areas
  const { data: subjectAreasData, isLoading: loadingSubjectAreas, error: errorSubjectAreas } = useQuery({
    queryKey: ['authors', 'subject-areas', subjectAreasParams],
    queryFn: async () => {
      const response = await getSubjectAreasApi(subjectAreasParams);
      if (response.data && typeof response.data === 'object' && response.data.success !== false) {
        return normalizeSubjectAreaItems(response.data.data);
      } else {
        throw new Error(response.data?.message || 'Failed to fetch subject areas');
      }
    },
    enabled: !!subjectAreasParams,
  });

  const fetchSubjectAreas = useCallback((params = {}) => setSubjectAreasParams(params), []);

  // 5. Leaderboard
  const { data: leaderboardData, isLoading: loadingLeaderboard, error: errorLeaderboard } = useQuery({
    queryKey: ['authors', 'leaderboard', leaderboardParams],
    queryFn: async () => {
      try {
        const response = await getAuthorLeaderboardApi(leaderboardParams);
        if (response.data && typeof response.data === 'object' && response.data.success !== false) {
          const rawData = Array.isArray(response.data.data) ? response.data.data : [];
          const normalizedData = rawData.map(normalizeAuthorRecord);
          
          const breakdownMap = {};
          await Promise.allSettled(
            normalizedData.map(async (author) => {
              const id = author.author_id ?? author.id;
              if (!id) return;
              try {
                const breakdownResponse = await getAuthorAreasBreakdownApi(id);
                if (breakdownResponse.data && typeof breakdownResponse.data === 'object' && breakdownResponse.data.success !== false) {
                  breakdownMap[id] = normalizeAreasBreakdown(breakdownResponse.data.data);
                }
              } catch (error) {}
            })
          );
          
          const enrichedList = enrichLeaderboardAuthors(normalizedData, breakdownMap);
          const pagination = response.data.pagination || {};
          const total = pagination.total ?? enrichedList.length;
          const limit = pagination.limit || 10;
          return { leaderboard: enrichedList, total, totalPages: pagination.total_pages ?? Math.max(1, Math.ceil(total / limit)) };
        } else {
          throw new Error(response.data?.message || 'Failed to fetch leaderboard');
        }
      } catch (err) {
        let list = MOCK_LEADERBOARD.map((item, idx) => ({ ...item, final_rank: idx + 1 }));
        const area = (leaderboardParams.subject_area || '').trim().toLowerCase();
        if (area) list = list.filter(item => item.subject_area.toLowerCase().includes(area));
        
        const page = parseInt(leaderboardParams.page || '1', 10);
        const limit = parseInt(leaderboardParams.limit || '10', 10);
        const startIndex = (page - 1) * limit;
        const total = list.length;
        return { leaderboard: list.slice(startIndex, startIndex + limit), total, totalPages: Math.max(1, Math.ceil(total / limit)) };
      }
    },
    enabled: !!leaderboardParams,
  });

  const fetchLeaderboard = useCallback((params = {}) => setLeaderboardParams(params), []);

  const fetchAuthorDetailsFull = useCallback(async (authorId) => {
    if (!authorId) return;
    setAuthorDetailId(authorId);
    setAuthorArticlesParams({ id: authorId, params: {} });
    setAuthorBreakdownId(authorId);
  }, []);

  return {
    authors: authorsData?.authors || [],
    totalAuthors: authorsData?.total || 0,
    currentAuthor: currentAuthor || null,
    authorArticles: authorArticlesData || [],
    authorBreakdown: authorBreakdownData || [],
    subjectAreas: subjectAreasData || [],
    leaderboard: leaderboardData?.leaderboard || [],
    totalLeaderboard: leaderboardData?.total || 0,
    leaderboardTotalPages: leaderboardData?.totalPages || 1,

    loadingAuthors,
    loadingAuthorDetail,
    loadingArticles,
    loadingAreas,
    loadingSubjectAreas,
    loadingLeaderboard,

    errorAuthors,
    errorAuthorDetail,
    errorArticles,
    errorAreas,
    errorSubjectAreas,
    errorLeaderboard,

    fetchAuthors,
    fetchAuthorDetail,
    fetchAuthorArticles,
    fetchAuthorAreasBreakdown,
    fetchSubjectAreas,
    fetchLeaderboard,
    totalPages: authorsData?.totalPages || 1,
    fetchAuthorDetailsFull,
  };
}
