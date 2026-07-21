import { QueryClient } from '@tanstack/react-query';
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60, // 1 minute
      gcTime: 1000 * 60 * 60 * 24, // 24 hours - cần đủ lớn để cache được persist & khôi phục sau khi reload
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

/**
 * Persister lưu cache của TanStack Query xuống localStorage.
 * Nhờ đó khi người dùng F5/reload trang, dữ liệu cũ được hiển thị ngay lập tức
 * (từ localStorage) trong khi React Query fetch lại ngầm ở nền nếu dữ liệu đã stale.
 */
export const localStoragePersister = createSyncStoragePersister({
  storage: window.localStorage,
  key: 'RESEARCHPULSE_QUERY_CACHE',
  throttleTime: 1000,
});
