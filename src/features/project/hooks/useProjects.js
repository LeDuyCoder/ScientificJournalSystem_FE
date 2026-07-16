/**
 * File source thuộc hệ thống FE ResearchPulse.
 *
 * File: features\project\hooks\useProjects.js
 */
import { useState, useCallback } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getProjectsApi, createProjectApi, deleteProjectApi, restoreProjectApi } from '../api/project.api';

export default function useProjects() {
  const queryClient = useQueryClient();
  const [mutationLoading, setMutationLoading] = useState(false);
  const [mutationError, setMutationError] = useState(null);

  const { data: projectsData, isLoading: queryLoading, error: queryError, refetch } = useQuery({
    queryKey: ['projects', 'list'],
    queryFn: async () => {
      const response = await getProjectsApi();
      if (response.data && response.data.success !== false) {
        return response.data.data || [];
      }
      throw new Error(response.data?.message || 'Failed to fetch projects');
    },
    staleTime: 300000,
  });

  const projects = projectsData || [];
  const isLoading = queryLoading || mutationLoading;
  const error = (queryError ? queryError.message : null) || mutationError;

  const createProject = useCallback(async (projectData) => {
    setMutationLoading(true);
    setMutationError(null);
    try {
      const response = await createProjectApi(projectData);
      if (response.data && response.data.success !== false) {
        queryClient.invalidateQueries({ queryKey: ['projects', 'list'] });
        return response.data.data;
      } else {
        throw new Error(response.data?.message || 'Failed to create project');
      }
    } catch (err) {
      setMutationError(err.response?.data?.message || err.message);
      throw err;
    } finally {
      setMutationLoading(false);
    }
  }, [queryClient]);

  const deleteProject = useCallback(async (id) => {
    setMutationLoading(true);
    setMutationError(null);
    try {
      const response = await deleteProjectApi(id);
      if (response.data && response.data.success !== false) {
        queryClient.setQueryData(['projects', 'list'], (prev) =>
          prev ? prev.map((p) => (String(p.project_id) === String(id) ? { ...p, status: 'DELETED' } : p)) : prev
        );
        return response.data;
      } else {
        throw new Error(response.data?.message || 'Failed to delete project');
      }
    } catch (err) {
      setMutationError(err.response?.data?.message || err.message);
      throw err;
    } finally {
      setMutationLoading(false);
    }
  }, [queryClient]);

  const restoreProject = useCallback(async (id) => {
    setMutationLoading(true);
    setMutationError(null);
    try {
      const response = await restoreProjectApi(id);
      if (response.data && response.data.success !== false) {
        const newStatus = response.data.data?.status || 'ACTIVE';
        queryClient.setQueryData(['projects', 'list'], (prev) =>
          prev ? prev.map((p) => (String(p.project_id) === String(id) ? { ...p, status: newStatus } : p)) : prev
        );
        return response.data;
      } else {
        throw new Error(response.data?.message || 'Failed to restore project');
      }
    } catch (err) {
      setMutationError(err.response?.data?.message || err.message);
      throw err;
    } finally {
      setMutationLoading(false);
    }
  }, [queryClient]);

  return {
    projects,
    isLoading,
    error,
    createProject,
    deleteProject,
    restoreProject,
    refetch,
  };
}
