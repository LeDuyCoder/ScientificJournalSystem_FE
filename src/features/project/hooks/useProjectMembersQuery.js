import { useQuery } from '@tanstack/react-query';
import projectService from '../services/projectService';

export const useProjectMembersQuery = (projectId) => {
  return useQuery({
    queryKey: ['project', projectId, 'members'],
    queryFn: async () => {
      if (!projectId) return [];
      return await projectService.getProjectMembers(projectId);
    },
    enabled: !!projectId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};
