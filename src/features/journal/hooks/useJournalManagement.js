/**
 * Hook / Zustand Store quản lý trạng thái tập trung cho phân hệ Journal, Volume, Issue.
 * Thỏa mãn tiêu chuẩn: Comment mô tả ngắn gọn cho từng hàm xử lý.
 */
import { create } from 'zustand';
import { INITIAL_JOURNALS, INITIAL_VOLUMES, INITIAL_ISSUES } from '../constants/journalMockData';

export const useJournalManagement = create((set, get) => ({
  // --- STATE SYSTEM ---
  journals: [],
  volumes: [],
  issues: [],
  currentJournal: null,  // Lưu trữ tạp chí đang hoạt động/được chọn trong khu vực quản lý
  selectedVolume: null,   // Lưu trữ Volume đang được xem chi tiết để render ra Issue tương ứng
  loading: false,
  error: null,

  // --- FUNCTIONS / ACTIONS ---

  /** Khởi tạo dữ liệu gốc ban đầu cho toàn bộ feature nếu dữ liệu chưa có sẵn */
  fetchInitialData: () => {
    // Chỉ nạp dữ liệu khi mảng journals trống để tránh ghi đè dữ liệu Admin vừa thêm/sửa
    if (get().journals && get().journals.length > 0) {
      return;
    }
    
    set({ loading: true, error: null });
    try {
      // Đổ dữ liệu từ Mock Constants vào State quản lý tập trung
      set({ 
        journals: INITIAL_JOURNALS, 
        volumes: INITIAL_VOLUMES, 
        issues: INITIAL_ISSUES,
        currentJournal: INITIAL_JOURNALS[0],
        loading: false 
      });
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },

  /** Đặt tạp chí đang hoạt động hiện tại (Ứng dụng cho Switch Journal Modal) */
  setCurrentJournal: (journalId) => {
    const targetJournal = get().journals.find(j => j.id === journalId);
    set({ currentJournal: targetJournal, selectedVolume: null }); // Reset lại volume khi chuyển đổi tạp chí
  },

  /** Thêm mới một Tạp chí (Journal) vào danh sách tổng */
  addJournal: (journalData) => {
    const newJournal = {
      id: `J_${Date.now()}`,
      ...journalData,
      status: 'Active',
      lastUpdated: new Date().toISOString().split('T')[0]
    };
    set((state) => ({ 
      journals: [newJournal, ...state.journals]
    }));
  },

  /** Cập nhật thông tin chi tiết cấu hình của Journal (Dùng cho Edit Journal) */
  updateJournal: (id, updatedData) => {
    set((state) => ({
      journals: state.journals.map(j => j.id === id ? { ...j, ...updatedData } : j),
      currentJournal: state.currentJournal?.id === id ? { ...state.currentJournal, ...updatedData } : state.currentJournal
    }));
  },

  /** Đặt Volume đang chọn để thực hiện lọc danh sách Issue hiển thị song song */
  setSelectedVolume: (volumeId) => {
    set({ selectedVolume: volumeId });
  },

  /** Tạo một Volume mới liên kết vào Journal hiện tại đang quản lý */
  createVolume: (volumeFields) => {
    const activeJournalId = get().currentJournal?.id;
    const newVol = {
      id: `V_${Date.now()}`,
      journalId: activeJournalId,
      totalIssues: 0,
      totalArticles: 0,
      ...volumeFields
    };
    
    set((state) => ({ 
      volumes: [...(state.volumes || []), newVol],
      selectedVolume: state.selectedVolume ? state.selectedVolume : newVol.id 
    }));
  },

  /** Tạo một Issue mới gắn chặt vào Volume đang được chỉ định xem và cập nhật totalIssues của Volume tương ứng */
  createIssue: (issueFields) => {
    const activeVolumeId = get().selectedVolume;
    const newIssue = {
      id: `I_${Date.now()}`,
      volumeId: activeVolumeId,
      status: 'Scheduled',
      ...issueFields
    };
    
    set((state) => {
      // Tăng số lượng issue của Volume tương ứng trong mảng volumes
      const updatedVolumes = (state.volumes || []).map(vol => 
        vol.id === activeVolumeId 
          ? { ...vol, totalIssues: (vol.totalIssues || 0) + 1 }
          : vol
      );
      
      return {
        issues: [...(state.issues || []), newIssue],
        volumes: updatedVolumes
      };
    });
  }
}));