/**
 * File source thuộc hệ thống FE ResearchPulse.
 *
 * File: features\project\hooks\useProjects.js
 */
import { useState, useCallback } from 'react';
import projectService from '../services/projectService';

export default function useProjects() {
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Fetch tất cả project của người dùng
   */
  const fetchProjects = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await projectService.getAllProjects();
      setProjects(data || []);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Tạo project mới
   * @param {Object} projectData 
   * @returns {Object} Project vừa tạo
   */
  const createProject = useCallback(async (projectData) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await projectService.createProject(projectData);
      if (response && response.success !== false) {
        await fetchProjects();
        return response.data;
      } else {
        throw new Error(response?.message || 'Failed to create project');
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [fetchProjects]);

  /**
   * Xóa project
   * @param {number|string} id 
   */
  const deleteProject = useCallback(async (id) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await projectService.deleteProject(id);
      if (response && response.success !== false) {
        setProjects((prev) => prev.filter((p) => String(p.project_id) !== String(id)));
        return response;
      } else {
        throw new Error(response?.message || 'Failed to delete project');
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
  };
}
