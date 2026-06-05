import { useState, useCallback } from 'react';
import {
  getAuthorAreasBreakdownApi,
  getAuthorArticlesApi,
  getAuthorLeaderboardApi,
} from '../api/author.api';

export default function useAuthors() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [authorArticles, setAuthorArticles] = useState([]);
  const [authorBreakdown, setAuthorBreakdown] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchLeaderboard = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await getAuthorLeaderboardApi();
      if (response.data && response.data.success !== false) {
        setLeaderboard(response.data.data || []);
      } else {
        throw new Error(response.data?.message || 'Failed to fetch author leaderboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchAuthorDetails = useCallback(async (authorId) => {
    if (!authorId) return;
    setIsLoading(true);
    setError(null);
    try {
      const [articlesRes, breakdownRes] = await Promise.all([
        getAuthorArticlesApi(authorId),
        getAuthorAreasBreakdownApi(authorId),
      ]);

      if (articlesRes.data && articlesRes.data.success !== false) {
        setAuthorArticles(articlesRes.data.data || []);
      }
      if (breakdownRes.data && breakdownRes.data.success !== false) {
        setAuthorBreakdown(breakdownRes.data.data || null);
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    leaderboard,
    authorArticles,
    authorBreakdown,
    isLoading,
    error,
    fetchLeaderboard,
    fetchAuthorDetails,
  };
}
