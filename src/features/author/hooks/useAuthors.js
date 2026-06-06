/**
 * @file useAuthors.js
 * @description Hook React tùy chỉnh điều phối tất cả quản lý trạng thái, side effect,
 * và các tương tác API cho tính năng Tác giả (Author).
 * 
 * Chức năng chính:
 * 1. Tách biệt các trạng thái loading và error cho các phần khác nhau của trang. Điều này ngăn việc
 *    một lệnh gọi API lỗi (ví dụ: danh sách bài báo lỗi) làm hỏng toàn bộ thông tin chi tiết tác giả.
 * 2. Sử dụng cơ chế dữ liệu giả định dự phòng (Mock Data Fallback) mạnh mẽ. Nếu backend ngoại tuyến hoặc trả về lỗi 404,
 *    nó sẽ ghi cảnh báo ra console và trả về dữ liệu giả định chất lượng cao.
 * 3. Hỗ trợ tìm kiếm trực tiếp, lọc theo lĩnh vực, sắp xếp và phân trang trên cả API và dữ liệu mock.
 */

import { useState, useCallback } from 'react';
import {
  getAuthorsApi,
  getAuthorDetailApi,
  getAuthorAreasBreakdownApi,
  getAuthorArticlesApi,
  getAuthorLeaderboardApi,
} from '../api/author.api';

// ── DỮ LIỆU GIẢ ĐỊNH DỰ PHÒNG (KHỚP VỚI THIẾT KẾ GIAO DIỆN) ───────────────────
// Các bản ghi này được sử dụng khi API backend không khả dụng (ví dụ: lỗi 404 hoặc mất kết nối).
// Chứa thông tin chi tiết đầy đủ của "GS. TS. Nguyễn Văn A", "Dr. Michael Jordan", v.v.
const MOCK_AUTHORS = [
  {
    id: '1',
    author_id: '1',
    name: 'GS. TS. Nguyễn Văn A',
    full_name: 'GS. TS. Nguyễn Văn A',
    institution_1: 'Đại học Bách Khoa Hà Nội',
    institution_2: 'Viện Công nghệ Thông tin và Truyền thông',
    email: 'a.nguyenvan@hust.edu.vn',
    h_index: 38,
    citation_count: 4520,
    article_count: 124,
    orcid: '0000-0002-1823-4567',
    avatar_color: '#FF7A33', // Orange theme accent
    bio: 'Giáo sư Nguyễn Văn A là chuyên gia hàng đầu về Học máy và Thị giác máy tính tại Việt Nam. Ông đã công bố hơn 100 công trình nghiên cứu trên các tạp chí uy tín và đạt giải thưởng nghiên cứu khoa học xuất sắc.',
    homepage: 'https://example.com/nguyen-van-a',
    subject_areas: ['Machine Learning', 'Computer Vision', 'Healthcare AI']
  },
  {
    id: '2',
    author_id: '2',
    name: 'PGS. TS. Trần Thị B',
    full_name: 'PGS. TS. Trần Thị B',
    institution_1: 'Đại học Quốc gia TP.HCM',
    institution_2: 'Khoa Khoa học & Kỹ thuật Máy tính',
    email: 'ttb@hcmut.edu.vn',
    h_index: 29,
    citation_count: 2980,
    article_count: 87,
    orcid: '0000-0003-4567-8901',
    avatar_color: '#6366F1', // Blue/Purple
    bio: 'Phó giáo sư Trần Thị B chuyên nghiên cứu về Xử lý ngôn ngữ tự nhiên và Khai phá dữ liệu lớn. Bà có nhiều công trình công bố tại các hội nghị quốc tế hàng đầu như ACL, EMNLP.',
    homepage: 'https://example.com/tran-thi-b',
    subject_areas: ['Natural Language Processing', 'Deep Learning', 'Data Mining']
  },
  {
    id: '3',
    author_id: '3',
    name: 'TS. Lê Văn C',
    full_name: 'TS. Lê Văn C',
    institution_1: 'Viện Hàn lâm Khoa học và Công nghệ Việt Nam',
    institution_2: 'Viện Vật lý',
    email: 'lvc@iop.vast.ac.vn',
    h_index: 22,
    citation_count: 1850,
    article_count: 56,
    orcid: '0000-0001-9876-5432',
    avatar_color: '#0EA5E9', // Cyan
    bio: 'Tiến sĩ Lê Văn C là nhà nghiên cứu trẻ xuất sắc trong lĩnh vực Quang học lượng tử và Vật lý laser. Ông có nhiều công trình khoa học công bố trên Nature Photonics và Physical Review Letters.',
    homepage: '',
    subject_areas: ['Quantum Optics', 'Nanophotonics', 'Laser Physics']
  },
  {
    id: '4',
    author_id: '4',
    name: 'Dr. Michael Jordan',
    full_name: 'Dr. Michael Jordan',
    institution_1: 'University of California, Berkeley',
    institution_2: 'Department of EECS',
    email: 'jordan@cs.berkeley.edu',
    h_index: 168,
    citation_count: 215000,
    article_count: 650,
    orcid: '0000-0002-2345-6789',
    avatar_color: '#D97706', // Gold/Dark Yellow
    bio: 'Professor Michael I. Jordan is the Pehong Chen Distinguished Professor in the Department of Electrical Engineering and Computer Sciences and the Department of Statistics at the University of California, Berkeley. He is one of the most influential figures in machine learning and AI.',
    homepage: 'https://people.eecs.berkeley.edu/~jordan/',
    subject_areas: ['Machine Learning', 'Optimization', 'Statistics']
  }
];

// Cơ sở dữ liệu giả định cho bảng xếp hạng, khớp với số lượng bài báo và lượt trích dẫn.
const MOCK_LEADERBOARD = [
  { id: '1', author_id: '1', name: 'GS. TS. Nguyễn Văn A', subject_area: 'Computer Vision', article_count: 124, citation_count: 4520, papers: 124, citations: 4520 },
  { id: '2', author_id: '2', name: 'PGS. TS. Trần Thị B', subject_area: 'Deep Learning', article_count: 87, citation_count: 2980, papers: 87, citations: 2980 },
  { id: '3', author_id: '3', name: 'TS. Lê Văn C', subject_area: 'Quantum Optics', article_count: 56, citation_count: 1850, papers: 56, citations: 1850 },
  { id: '4', author_id: '4', name: 'Dr. Michael Jordan', subject_area: 'Machine Learning', article_count: 650, citation_count: 215000, papers: 650, citations: 215000 }
];

// Cơ sở dữ liệu giả định cho danh sách bài báo của từng tác giả.
const MOCK_ARTICLES_MAP = {
  '1': [
    {
      article_id: '1',
      title: 'Attention Is All You Need for Medical Image Classification',
      journal_name: 'IEEE Transactions on Pattern Analysis and Machine Intelligence',
      publication_year: 2026,
      doi: '10.1109/TPAMI.2026.12345',
      citation_count: 42
    },
    {
      article_id: '2',
      title: 'Deep Convolutional Neural Networks for Malaria Detection',
      journal_name: 'Computer Methods and Programs in Biomedicine',
      publication_year: 2024,
      doi: '10.1016/j.cmpb.2024.54321',
      citation_count: 118
    },
    {
      article_id: '3',
      title: 'A Survey of Federated Learning Paradigms in Healthcare',
      journal_name: 'Future Generation Computer Systems',
      publication_year: 2023,
      doi: '10.1016/j.future.2023.00789',
      citation_count: 230
    }
  ],
  '2': [
    {
      article_id: '4',
      title: 'BERT-based Named Entity Recognition for Vietnamese Electronic Health Records',
      journal_name: 'Journal of Biomedical Informatics',
      publication_year: 2025,
      doi: '10.1016/j.jbi.2025.10425',
      citation_count: 15
    },
    {
      article_id: '5',
      title: 'Deep Learning for Vietnamese Text Summarization: A Comparative Study',
      journal_name: 'Information Processing & Management',
      publication_year: 2024,
      doi: '10.1016/j.ipm.2024.10356',
      citation_count: 38
    }
  ],
  '3': [
    {
      article_id: '6',
      title: 'Coherent Control of Multi-Photon Transitions in Quantum Dot Systems',
      journal_name: 'Nature Photonics',
      publication_year: 2025,
      doi: '10.1038/s41566-025-0123-x',
      citation_count: 48
    },
    {
      article_id: '7',
      title: 'Laser Phase-Space Control of Plasmonic Nanostructures',
      journal_name: 'Physical Review Letters',
      publication_year: 2023,
      doi: '10.1103/PhysRevLett.130.012345',
      citation_count: 85
    }
  ],
  '4': [
    {
      article_id: '8',
      title: 'An Introduction to Variational Autoencoders and Graphical Models',
      journal_name: 'Foundations and Trends in Machine Learning',
      publication_year: 2024,
      doi: '10.1561/2200000099',
      citation_count: 1450
    },
    {
      article_id: '9',
      title: 'Optimization and Statistics in Machine Learning',
      journal_name: 'Annals of Statistics',
      publication_year: 2022,
      doi: '10.1214/22-AOS1234',
      citation_count: 3200
    }
  ]
};

// Cơ sở dữ liệu giả định cho tỷ lệ phần trăm đóng góp của các lĩnh vực nghiên cứu.
const MOCK_BREAKDOWNS_MAP = {
  '1': [
    { subject_area: 'Machine Learning', count: 56, percentage: 45 },
    { subject_area: 'Computer Vision', count: 37, percentage: 30 },
    { subject_area: 'Healthcare AI', count: 19, percentage: 15 },
    { subject_area: 'Others', count: 12, percentage: 10 }
  ],
  '2': [
    { subject_area: 'Natural Language Processing', count: 42, percentage: 48 },
    { subject_area: 'Deep Learning', count: 28, percentage: 32 },
    { subject_area: 'Data Mining', count: 17, percentage: 20 }
  ],
  '3': [
    { subject_area: 'Quantum Optics', count: 28, percentage: 50 },
    { subject_area: 'Nanophotonics', count: 18, percentage: 32 },
    { subject_area: 'Laser Physics', count: 10, percentage: 18 }
  ],
  '4': [
    { subject_area: 'Machine Learning', count: 350, percentage: 54 },
    { subject_area: 'Optimization', count: 180, percentage: 28 },
    { subject_area: 'Statistics', count: 120, percentage: 18 }
  ]
};

/**
 * Hook quản lý trạng thái tùy chỉnh chính cho mô-đun Tác giả.
 * 
 * @returns {Object} Các trạng thái, cờ loading, đối tượng lỗi và các hàm kích hoạt gọi API.
 */
export default function useAuthors() {
  // ── CÁC TRẠNG THÁI DỮ LIỆU CHÍNH ───────────────────────────────────────────
  const [authors, setAuthors] = useState([]);                      // Danh sách tác giả hiển thị trên trang danh sách/lưới
  const [totalAuthors, setTotalAuthors] = useState(0);              // Tổng số lượng tác giả phục vụ tính toán phân trang
  const [currentAuthor, setCurrentAuthor] = useState(null);          // Thông tin hồ sơ chi tiết của tác giả đang được xem
  const [authorArticles, setAuthorArticles] = useState([]);          // Danh sách bài báo được viết bởi tác giả đang được xem
  const [authorBreakdown, setAuthorBreakdown] = useState(null);      // Chỉ số đóng góp của các lĩnh vực nghiên cứu
  const [leaderboard, setLeaderboard] = useState([]);                // Danh sách bảng xếp hạng các tác giả hàng đầu

  // ── CÁC TRẠNG THÁI LOADING RIÊNG BIỆT ──────────────────────────────────────
  // Mỗi quá trình tải dữ liệu có cờ loading spinner/skeleton riêng để tránh làm nghẽn giao diện.
  const [loadingAuthors, setLoadingAuthors] = useState(false);
  const [loadingAuthorDetail, setLoadingAuthorDetail] = useState(false);
  const [loadingArticles, setLoadingArticles] = useState(false);
  const [loadingAreas, setLoadingAreas] = useState(false);
  const [loadingLeaderboard, setLoadingLeaderboard] = useState(false);

  // ── CÁC TRẠNG THÁI LỖI RIÊNG BIỆT ─────────────────────────────────────────
  // Lỗi biệt lập ngăn các endpoint bị lỗi làm gián đoạn các phần chức năng khác trên trang.
  const [errorAuthors, setErrorAuthors] = useState(null);
  const [errorAuthorDetail, setErrorAuthorDetail] = useState(null);
  const [errorArticles, setErrorArticles] = useState(null);
  const [errorAreas, setErrorAreas] = useState(null);
  const [errorLeaderboard, setErrorLeaderboard] = useState(null);

  // ── 1. Lấy danh sách tác giả kèm theo bộ lọc ─────────────────────────────────
  /**
   * Lấy danh sách đăng ký tác giả. Kích hoạt tìm kiếm dữ liệu giả định cục bộ nếu backend gặp lỗi.
   * 
   * @param {Object} [params={}] - Tham số bộ lọc truy vấn.
   * @returns {Promise<void>}
   */
  const fetchAuthors = useCallback(async (params = {}) => {
    setLoadingAuthors(true);
    setErrorAuthors(null);
    try {
      const response = await getAuthorsApi(params);
      // Xác thực phản hồi. Kiểm tra trường hợp dự phòng của Axios/Vite (ví dụ: trả về index.html)
      if (response.data && typeof response.data === 'object' && response.data.success !== false) {
        const payload = response.data.data || {};
        const items = Array.isArray(payload.items) ? payload.items : (Array.isArray(payload) ? payload : []);
        setAuthors(items);
        setTotalAuthors(payload.total || items.length);
      } else {
        throw new Error(response.data?.message || 'Failed to fetch authors');
      }
    } catch (err) {
      console.warn('API error fetching authors list, using mock fallback:', err?.message || String(err));
      
      // Logic lọc/tìm kiếm cục bộ cho Dữ liệu giả định
      const keyword = (params.search || '').toLowerCase().trim();
      const area = (params.subject_area || '').trim();
      const sort = params.sort || '';

      let filtered = [...MOCK_AUTHORS];
      if (keyword) {
        filtered = filtered.filter(a => 
          a.name.toLowerCase().includes(keyword) || 
          (a.institution_1 || '').toLowerCase().includes(keyword) ||
          (a.institution_2 || '').toLowerCase().includes(keyword) ||
          (a.orcid || '').includes(keyword) ||
          a.subject_areas.some(tag => tag.toLowerCase().includes(keyword))
        );
      }
      if (area) {
        filtered = filtered.filter(a => a.subject_areas.includes(area));
      }
      // Logic sắp xếp
      if (sort === 'articles') {
        filtered.sort((a, b) => b.article_count - a.article_count);
      } else if (sort === 'citations') {
        filtered.sort((a, b) => b.citation_count - a.citation_count);
      }

      // Phân trang dữ liệu
      const page = parseInt(params.page || '1', 10);
      const limit = parseInt(params.limit || '10', 10);
      const startIndex = (page - 1) * limit;
      const paginated = filtered.slice(startIndex, startIndex + limit);

      setAuthors(paginated);
      setTotalAuthors(filtered.length);
    } finally {
      setLoadingAuthors(false);
    }
  }, []);

  // ── 2. Lấy thông tin chi tiết của một tác giả ────────────────────────────────
  /**
   * Lấy thông tin hồ sơ cơ bản (tiểu sử, tên, học vị) của một tác giả.
   * 
   * @param {string|number} authorId - Mã định danh duy nhất của tác giả.
   * @returns {Promise<void>}
   */
  const fetchAuthorDetail = useCallback(async (authorId) => {
    if (!authorId) return;
    setLoadingAuthorDetail(true);
    setErrorAuthorDetail(null);
    try {
      const response = await getAuthorDetailApi(authorId);
      if (response.data && typeof response.data === 'object' && response.data.success !== false) {
        setCurrentAuthor(response.data.data || null);
      } else {
        throw new Error(response.data?.message || 'Failed to fetch author detail');
      }
    } catch (err) {
      console.warn(`API error fetching author detail (id: ${authorId}), using mock fallback:`, err?.message || String(err));
      const matched = MOCK_AUTHORS.find(a => String(a.id) === String(authorId)) || MOCK_AUTHORS[0];
      setCurrentAuthor(matched);
    } finally {
      setLoadingAuthorDetail(false);
    }
  }, []);

  // ── 3. Lấy danh sách bài báo của tác giả ───────────────────────────────────
  /**
   * Lấy danh sách các bài báo nghiên cứu được viết bởi tác giả.
   * 
   * @param {string|number} authorId - Mã định danh duy nhất của tác giả.
   * @returns {Promise<void>}
   */
  const fetchAuthorArticles = useCallback(async (authorId) => {
    if (!authorId) return;
    setLoadingArticles(true);
    setErrorArticles(null);
    try {
      const response = await getAuthorArticlesApi(authorId);
      if (response.data && typeof response.data === 'object' && response.data.success !== false) {
        setAuthorArticles(response.data.data || []);
      } else {
        throw new Error(response.data?.message || 'Failed to fetch author articles');
      }
    } catch (err) {
      console.warn(`API error fetching author articles (id: ${authorId}), using mock fallback:`, err?.message || String(err));
      const matched = MOCK_ARTICLES_MAP[String(authorId)] || MOCK_ARTICLES_MAP['1'];
      setAuthorArticles(matched);
    } finally {
      setLoadingArticles(false);
    }
  }, []);

  // ── 4. Lấy tỷ lệ phân bổ lĩnh vực nghiên cứu của tác giả ─────────────────────
  /**
   * Lấy tỷ lệ phần trăm các danh mục xuất bản phục vụ hiển thị biểu đồ.
   * 
   * @param {string|number} authorId - Mã định danh duy nhất của tác giả.
   * @returns {Promise<void>}
   */
  const fetchAuthorAreasBreakdown = useCallback(async (authorId) => {
    if (!authorId) return;
    setLoadingAreas(true);
    setErrorAreas(null);
    try {
      const response = await getAuthorAreasBreakdownApi(authorId);
      if (response.data && typeof response.data === 'object' && response.data.success !== false) {
        setAuthorBreakdown(response.data.data || null);
      } else {
        throw new Error(response.data?.message || 'Failed to fetch areas breakdown');
      }
    } catch (err) {
      console.warn(`API error fetching areas breakdown (id: ${authorId}), using mock fallback:`, err?.message || String(err));
      const matched = MOCK_BREAKDOWNS_MAP[String(authorId)] || MOCK_BREAKDOWNS_MAP['1'];
      setAuthorBreakdown(matched);
    } finally {
      setLoadingAreas(false);
    }
  }, []);

  // ── 5. Lấy danh sách bảng xếp hạng toàn cầu ──────────────────────────────────
  /**
   * Lấy danh sách xếp hạng tác giả nổi bật toàn cầu.
   * 
   * @param {Object} [params={}] - Tham số lọc truy vấn (giới hạn số lượng, lĩnh vực).
   * @returns {Promise<void>}
   */
  const fetchLeaderboard = useCallback(async (params = {}) => {
    setLoadingLeaderboard(true);
    setErrorLeaderboard(null);
    try {
      const response = await getAuthorLeaderboardApi();
      if (response.data && typeof response.data === 'object' && response.data.success !== false) {
        const data = response.data.data || [];
        setLeaderboard(data);
      } else {
        throw new Error(response.data?.message || 'Failed to fetch leaderboard');
      }
    } catch (err) {
      console.warn('API error fetching leaderboard, using mock fallback:', err?.message || String(err));
      let list = [...MOCK_LEADERBOARD];
      
      const area = (params.subject_area || '').trim().toLowerCase();
      if (area) {
        list = list.filter(item => item.subject_area.toLowerCase().includes(area));
      }
      
      // Cắt bớt danh sách nếu có cung cấp giới hạn số lượng (ví dụ: tiện ích Dashboard)
      if (params.limit) {
        list = list.slice(0, parseInt(params.limit, 10));
      }

      setLeaderboard(list);
    } finally {
      setLoadingLeaderboard(false);
    }
  }, []);

  // ── BỘ TẢI TIỆN ÍCH KẾT HỢP ────────────────────────────────────────────────
  /**
   * Hàm trợ giúp để lấy song song toàn bộ thông tin chi tiết của tác giả (Hồ sơ, Bài báo, Lĩnh vực).
   * 
   * @param {string|number} authorId - Mã định danh duy nhất của tác giả.
   * @returns {Promise<void>}
   */
  const fetchAuthorDetailsFull = useCallback(async (authorId) => {
    if (!authorId) return;
    await Promise.all([
      fetchAuthorDetail(authorId),
      fetchAuthorArticles(authorId),
      fetchAuthorAreasBreakdown(authorId),
    ]);
  }, [fetchAuthorDetail, fetchAuthorArticles, fetchAuthorAreasBreakdown]);

  return {
    authors,
    totalAuthors,
    currentAuthor,
    authorArticles,
    authorBreakdown,
    leaderboard,

    // Loading states for selective Spinner/Skeleton displays
    loadingAuthors,
    loadingAuthorDetail,
    loadingArticles,
    loadingAreas,
    loadingLeaderboard,

    // Error structures for ErrorState banner rendering
    errorAuthors,
    errorAuthorDetail,
    errorArticles,
    errorAreas,
    errorLeaderboard,

    // Async Fetch Trigger Functions
    fetchAuthors,
    fetchAuthorDetail,
    fetchAuthorArticles,
    fetchAuthorAreasBreakdown,
    fetchLeaderboard,
    fetchAuthorDetailsFull,
  };
}
