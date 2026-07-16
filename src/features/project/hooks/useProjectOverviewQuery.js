import { useQuery } from '@tanstack/react-query';
import projectService from '../services/projectService';

export const useProjectOverviewQuery = (projectId) => {
  return useQuery({
    queryKey: ['project', projectId, 'overview'],
    queryFn: async () => {
      if (!projectId) return null;
      return await projectService.getProjectOverview(projectId);
    },
    enabled: !!projectId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};
