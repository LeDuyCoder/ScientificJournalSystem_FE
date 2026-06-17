import * as projectApi from '../../project/api/project.api';
import keywordApi from '../../keywords/api/keywordApi';

/**
 * Service xử lý logic Keyword Tracking (Trending, Watch List, Articles)
 */
const keywordService = {
  /**
   * Lấy danh sách keyword trending của dự án
   * @param {number|string} projectId - ID dự án
   * @param {number} limit - Giới hạn số lượng
   * @param {string} sortBy - Tiêu chí sắp xếp
   * @returns {Promise<Array>} Danh sách keyword
   */
  async getTrendingKeywords(projectId, limit = 20, sortBy = 'count') {
    const res = await projectApi.getTrendingKeywordsApi(projectId, limit, sortBy);
    return res.data?.data || res.data?.keywords || [];
  },

  /**
   * Lấy các bài báo liên quan đến các keyword đang theo dõi
   * @param {number|string} projectId - ID dự án
   * @returns {Promise<Array>} Danh sách bài báo
   */
  async getWatchedKeywordArticles(projectId, page = 1, limit = 10) {
    const res = await projectApi.getWatchedKeywordArticlesApi(projectId, page, limit);
    return res.data;
  },

  /**
   * Theo dõi danh sách keyword mới
   * @param {number|string} projectId - ID dự án
   * @param {Array<string>} keywordsList - Danh sách keyword
   * @returns {Promise<Object>} Kết quả trả về
   */
  async watchKeywords(projectId, keywordsList) {
    const res = await projectApi.watchKeywordsApi(projectId, keywordsList);
    return res.data;
  },

  /**
   * Cập nhật toàn bộ danh sách keyword đang theo dõi
   * @param {number|string} projectId - ID dự án
   * @param {Array<string>} keywordsList - Danh sách keyword
   * @returns {Promise<Object>} Kết quả trả về
   */
  async updateWatchedKeywords(projectId, keywordsList) {
    const res = await projectApi.updateWatchedKeywordsApi(projectId, keywordsList);
    return res.data;
  },

  /**
   * Xóa một keyword khỏi danh sách theo dõi
   * @param {number|string} projectId - ID dự án
   * @param {number|string} keywordId - ID keyword
   * @returns {Promise<Object>} Kết quả trả về
   */
  async unwatchKeyword(projectId, keywordId) {
    const res = await projectApi.unwatchKeywordApi(projectId, keywordId);
    return res.data;
  },

  /**
   * Đồng bộ danh sách từ khóa chuỗi (FE only workaround)
   */
  async syncProjectKeywordsFEOnly(projectId, keywordsList) {
    if (!keywordsList || !Array.isArray(keywordsList)) return;
    
    const finalIds = [];
    
    // Tìm hoặc tạo mới từng keyword
    for (const kwStr of keywordsList) {
      if (!kwStr.trim()) continue;
      
      try {
        // Tìm keyword có sẵn
        const searchRes = await keywordApi.getKeywords({ search: kwStr.trim() });
        const resData = searchRes.data;
        const items = Array.isArray(resData?.data) ? resData.data 
                    : Array.isArray(resData?.items) ? resData.items 
                    : Array.isArray(resData) ? resData 
                    : [];
        
        const exactMatch = items.find(i => (i.display_name || i.name || '').toLowerCase() === kwStr.trim().toLowerCase());
        
        if (exactMatch) {
          const idStr = exactMatch.keyword_id || exactMatch.id;
          if (idStr) finalIds.push(parseInt(idStr, 10));
        } else {
          // Tạo mới
          const createRes = await keywordApi.createKeyword({ display_name: kwStr.trim() });
          const newKw = createRes.data?.data || createRes.data;
          if (newKw) {
            const newIdStr = newKw.keyword_id || newKw.id;
            if (newIdStr) finalIds.push(parseInt(newIdStr, 10));
          }
        }
      } catch (err) {
        console.error('Error syncing keyword', kwStr, err);
      }
    }
    
    // Gán vào dự án bằng API watch
    if (finalIds.length > 0) {
      // Dùng updateWatchedKeywords (để ghi đè danh sách)
      await projectApi.updateWatchedKeywordsApi(projectId, finalIds);
    } else {
      // Xóa tất cả keyword nếu rỗng
      await projectApi.updateWatchedKeywordsApi(projectId, []);
    }
  }
};

export default keywordService;
