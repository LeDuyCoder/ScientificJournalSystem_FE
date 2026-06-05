import { useState, useCallback } from 'react';
import { getCountryStatsApi, getRegionStatsApi } from '../api/zone.api';

export default function useZoneStats() {
  const [countryStats, setCountryStats] = useState([]);
  const [regionStats, setRegionStats] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCountryStats = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await getCountryStatsApi();
      if (response.data && response.data.success !== false) {
        setCountryStats(response.data.data || []);
      } else {
        throw new Error(response.data?.message || 'Failed to fetch country stats');
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchRegionStats = useCallback(async (params) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await getRegionStatsApi(params);
      if (response.data && response.data.success !== false) {
        setRegionStats(response.data.data || []);
      } else {
        throw new Error(response.data?.message || 'Failed to fetch region stats');
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    countryStats,
    regionStats,
    isLoading,
    error,
    fetchCountryStats,
    fetchRegionStats,
  };
}
