/**
 * File source thuộc hệ thống FE ResearchPulse.
 *
 * File: features\project\hooks\useProjects.js
 */
import { useState, useCallback } from 'react';
import { getProjectsApi, createProjectApi, deleteProjectApi, restoreProjectApi } from '../api/project.api';

export default function useProjects() {
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchProjects = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await getProjectsApi();
      if (response.data && response.data.success !== false) {
        setProjects(response.data.data || []);
      } else {
        throw new Error(response.data?.message || 'Failed to fetch projects');
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createProject = useCallback(async (projectData) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await createProjectApi(projectData);
      if (response.data && response.data.success !== false) {
        await fetchProjects();
        return response.data.data;
      } else {
        throw new Error(response.data?.message || 'Failed to create project');
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [fetchProjects]);

  const deleteProject = useCallback(async (id) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await deleteProjectApi(id);
      if (response.data && response.data.success !== false) {
        setProjects((prev) =>
          prev.map((p) => (String(p.project_id) === String(id) ? { ...p, status: 'DELETED' } : p))
        );
        return response.data;
      } else {
        throw new Error(response.data?.message || 'Failed to delete project');
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const restoreProject = useCallback(async (id) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await restoreProjectApi(id);
      if (response.data && response.data.success !== false) {
        const newStatus = response.data.data?.status || 'ACTIVE';
        setProjects((prev) =>
          prev.map((p) => (String(p.project_id) === String(id) ? { ...p, status: newStatus } : p))
        );
        return response.data;
      } else {
        throw new Error(response.data?.message || 'Failed to restore project');
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    projects,
    isLoading,
    error,
    fetchProjects,
    createProject,
    deleteProject,
    restoreProject,
  };
}
