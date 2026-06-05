import { useState } from 'react';
import { searchGlobalApi } from '../api/article.api';

/**
 * Custom hook to coordinate states and logic for the Sandbox search.
 * It manages search inputs, loading states, and handles fallback simulation
 * when the backend API request fails.
 */
export default function useSandboxSearch() {
  const [searchValue, setSearchValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [searchResult, setSearchResult] = useState(null);
  const [error, setError] = useState(null);

  const handleTagClick = (tag) => {
    setSearchValue(tag);
    setSearchResult(null);
    setError(null);
  };

  const handleSearchSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!searchValue.trim()) return;

    setIsLoading(true);
    setSearchResult(null);
    setError(null);

    try {
      // Execute the API request through the decoupled API wrapper
      const response = await searchGlobalApi(searchValue);

      if (response.data && response.data.success !== false) {
        const items = response.data.data || [];
        
        setSearchResult({
          keyword: searchValue,
          items: items,
          isRealData: true,
        });
      } else {
        throw new Error(response.data?.message || 'Invalid backend format');
      }
    } catch (err) {
      console.error('Backend API search failed:', err);
      const errMsg = err.response?.data?.message || err.message || 'API request failed';
      setError(errMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    searchValue,
    setSearchValue,
    isLoading,
    searchResult,
    setSearchResult,
    error,
    setError,
    handleTagClick,
    handleSearchSubmit,
  };
}
