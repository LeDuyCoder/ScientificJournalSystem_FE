import { useState, useCallback } from 'react';
import {
  getKeywordsApi,
  createKeywordApi,
  updateKeywordApi,
  deleteKeywordApi,
  restoreKeywordApi,
} from '../api/keyword.api';

export default function useKeywords() {
  const [keywords, setKeywords] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0 });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchKeywords = useCallback(async (params = {}) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await getKeywordsApi(params);
      if (response.data && response.data.success !== false) {
        setKeywords(response.data.data || []);
        if (response.data.pagination) {
          setPagination(response.data.pagination);
        }
      } else {
        throw new Error(response.data?.message || 'Failed to fetch keywords');
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createKeyword = useCallback(async (data) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await createKeywordApi(data);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateKeyword = useCallback(async (id, data) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await updateKeywordApi(id, data);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const deleteKeyword = useCallback(async (id) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await deleteKeywordApi(id);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const restoreKeyword = useCallback(async (id) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await restoreKeywordApi(id);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    keywords,
    pagination,
    isLoading,
    error,
    fetchKeywords,
    createKeyword,
    updateKeyword,
    deleteKeyword,
    restoreKeyword,
  };
}
