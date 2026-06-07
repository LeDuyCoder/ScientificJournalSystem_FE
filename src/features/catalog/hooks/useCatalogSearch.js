import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { searchJournalsApi } from '../../journal/api/journalApi';
import { getSubjectAreasApi, getSubjectCategoriesApi } from '../api/catalogApi';

export function useCatalogSearch(currentUser) {
  const [searchParams, setSearchParams] = useSearchParams();

  // Local Search Input value (not submitted yet)
  const [searchInput, setSearchInput] = useState(searchParams.get('search') || '');

  // Filter Categories dropdown lists
  const [subjectAreas, setSubjectAreas] = useState([]);
  const [subjectCategories, setSubjectCategories] = useState([]);
  const [loadingFilters, setLoadingFilters] = useState(false);

  // Results & Pagination States
  const [journals, setJournals] = useState([]);
  const [total, setTotal] = useState(0);
  const [loadingJournals, setLoadingJournals] = useState(false);
  const [error, setError] = useState(null);

  // Follow states cache
  const [followedJournals, setFollowedJournals] = useState({});

  // Auth modal toggle
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Parse filters from searchParams
  const search = searchParams.get('search') || '';
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '10', 10);
  const sort = searchParams.get('sort') || 'relevance';
  
  const selectedAreas = searchParams.getAll('area_id').map(id => String(id));
  const selectedCategories = searchParams.getAll('cat_id').map(id => String(id));
  
  // Access: open_access or subscription
  const selectedAccess = searchParams.getAll('access');
  // Quartiles: Q1, Q2, Q3, Q4
  const selectedQuartiles = searchParams.getAll('quartile');

  // Load subject filters from API (only when logged in — BE requires auth)
  useEffect(() => {
    async function loadFilters() {
      if (!currentUser) {
        // Subject areas/categories require auth — skip silently for guests
        setSubjectAreas([]);
        setSubjectCategories([]);
        return;
      }
      setLoadingFilters(true);
      try {
        const [areasRes, catsRes] = await Promise.all([
          getSubjectAreasApi(),
          getSubjectCategoriesApi()
        ]);
        
        if (areasRes.data?.success !== false) {
          setSubjectAreas(areasRes.data?.data?.items || areasRes.data?.data || []);
        } else {
          setSubjectAreas([]);
        }

        if (catsRes.data?.success !== false) {
          setSubjectCategories(catsRes.data?.data?.items || catsRes.data?.data || []);
        } else {
          setSubjectCategories([]);
        }
      } catch (err) {
        console.error('Failed to load catalog filters from backend API:', err);
        setSubjectAreas([]);
        setSubjectCategories([]);
      } finally {
        setLoadingFilters(false);
      }
    }

    loadFilters();
  }, [currentUser]);

  const selectedAreasStr = selectedAreas.join(',');
  const selectedCategoriesStr = selectedCategories.join(',');
  const selectedAccessStr = selectedAccess.join(',');
  const selectedQuartilesStr = selectedQuartiles.join(',');

  // Fetch journals based on filters & pagination
  const fetchJournals = useCallback(async () => {
    setLoadingJournals(true);
    setError(null);
    try {
      const params = {
        search,
        page,
        limit,
        sort,
        subject_area_ids: selectedAreas.join(','),
        subject_category_ids: selectedCategories.join(','),
        is_open_access: selectedAccess.includes('open_access') && !selectedAccess.includes('subscription') 
          ? true 
          : (!selectedAccess.includes('open_access') && selectedAccess.includes('subscription') ? false : undefined),
        quartiles: selectedQuartiles.join(',')
      };

      const response = await searchJournalsApi(params);
      
      if (response.data && response.data.success !== false) {
        const data = response.data.data || {};
        setJournals(data.items || []);
        setTotal(data.pagination?.total || data.total || (data.items || []).length);
      } else {
        throw new Error(response.data?.message || 'Invalid search format');
      }
    } catch (err) {
      const status = err.response?.status;
      if (status === 401) {
        setError('Bạn cần đăng nhập để tìm kiếm journal.');
      } else if (status === 404) {
        setError('Không tìm thấy dữ liệu.');
      } else {
        setError(err.response?.data?.message || err.message || 'Lỗi kết nối đến server.');
      }
      setJournals([]);
      setTotal(0);
    } finally {
      setLoadingJournals(false);
    }
  }, [search, page, limit, sort, selectedAreasStr, selectedCategoriesStr, selectedAccessStr, selectedQuartilesStr]);

  useEffect(() => {
    fetchJournals();
  }, [fetchJournals]);

  // Handle Search Input submit
  const handleSearchSubmit = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    
    const nextParams = new URLSearchParams(searchParams);
    if (searchInput.trim()) {
      nextParams.set('search', searchInput.trim());
    } else {
      nextParams.delete('search');
    }
    nextParams.set('page', '1'); // Reset to first page
    setSearchParams(nextParams);
  };

  // Tag suggestion search
  const searchForTag = (tag) => {
    setSearchInput(tag);
    const nextParams = new URLSearchParams(searchParams);
    nextParams.set('search', tag);
    nextParams.set('page', '1');
    setSearchParams(nextParams);
  };

  // Helper to toggle multi-select URL parameters
  const toggleParamValue = (key, value) => {
    const nextParams = new URLSearchParams(searchParams);
    const currentValues = nextParams.getAll(key);
    
    if (currentValues.includes(String(value))) {
      // Remove item
      const updated = currentValues.filter(v => v !== String(value));
      nextParams.delete(key);
      updated.forEach(v => nextParams.append(key, v));
    } else {
      // Add item
      nextParams.append(key, String(value));
    }
    
    nextParams.set('page', '1'); // Reset to page 1 on filter change
    setSearchParams(nextParams);
  };

  const handleQuartileToggle = (quartile) => {
    toggleParamValue('quartile', quartile);
  };

  const handleAccessToggle = (accessType) => {
    toggleParamValue('access', accessType);
  };

  const handleAreaToggle = (areaId) => {
    // If area is toggled off, also clear any selected categories belonging to it
    const nextParams = new URLSearchParams(searchParams);
    const currentAreas = nextParams.getAll('area_id').map(id => String(id));
    const areaIdStr = String(areaId);

    if (currentAreas.includes(areaIdStr)) {
      // Toggling off area
      const remainingAreas = currentAreas.filter(id => id !== areaIdStr);
      nextParams.delete('area_id');
      remainingAreas.forEach(id => nextParams.append('area_id', id));

      // Remove dependent categories
      const currentCats = nextParams.getAll('cat_id').map(id => String(id));
      const dependentCats = subjectCategories
        .filter(c => String(c.subject_area_id) === areaIdStr)
        .map(c => String(c.subject_category_id));
      
      const remainingCats = currentCats.filter(id => !dependentCats.includes(id));
      nextParams.delete('cat_id');
      remainingCats.forEach(id => nextParams.append('cat_id', id));
    } else {
      // Toggling on area
      nextParams.append('area_id', areaIdStr);
    }

    nextParams.set('page', '1');
    setSearchParams(nextParams);
  };

  const handleCategoryToggle = (catId) => {
    toggleParamValue('cat_id', catId);
  };

  // Dropdown Select handlers
  const onAreaSelect = (areaId) => {
    const nextParams = new URLSearchParams(searchParams);
    nextParams.delete('area_id');
    nextParams.delete('cat_id'); // Clear categories because area changed
    if (areaId && areaId !== 'all') {
      nextParams.set('area_id', String(areaId));
    }
    nextParams.set('page', '1');
    setSearchParams(nextParams);
  };

  const onCategorySelect = (catId) => {
    const nextParams = new URLSearchParams(searchParams);
    nextParams.delete('cat_id');
    if (catId && catId !== 'all') {
      nextParams.set('cat_id', String(catId));
    }
    nextParams.set('page', '1');
    setSearchParams(nextParams);
  };

  const onAccessSelect = (accessVal) => {
    const nextParams = new URLSearchParams(searchParams);
    nextParams.delete('access');
    if (accessVal && accessVal !== 'all') {
      nextParams.set('access', accessVal);
    }
    nextParams.set('page', '1');
    setSearchParams(nextParams);
  };

  const onQuartileSelect = (quartileVal) => {
    const nextParams = new URLSearchParams(searchParams);
    nextParams.delete('quartile');
    if (quartileVal && quartileVal !== 'all') {
      nextParams.set('quartile', quartileVal);
    }
    nextParams.set('page', '1');
    setSearchParams(nextParams);
  };

  // Reset all filters
  const handleClearAll = () => {
    setSearchInput('');
    setSearchParams({ page: '1', limit: String(limit) });
  };

  // Change sorting method
  const handleSortChange = (newSort) => {
    const nextParams = new URLSearchParams(searchParams);
    nextParams.set('sort', newSort);
    setSearchParams(nextParams);
  };

  // Change page
  const handlePageChange = (newPage) => {
    if (newPage < 1) return;
    const nextParams = new URLSearchParams(searchParams);
    nextParams.set('page', String(newPage));
    setSearchParams(nextParams);
  };

  // Guest-aware follow toggle
  const handleFollowJournal = async (journalId) => {
    if (!currentUser) {
      setShowAuthModal(true);
      return;
    }

    setFollowedJournals(prev => ({
      ...prev,
      [journalId]: !prev[journalId]
    }));
  };

  return {
    searchInput,
    setSearchInput,
    subjectAreas,
    subjectCategories,
    loadingFilters,
    
    journals,
    total,
    loadingJournals,
    error,
    
    search,
    page,
    limit,
    sort,
    selectedAreas,
    selectedCategories,
    selectedAccess,
    selectedQuartiles,
    
    followedJournals,
    showAuthModal,
    setShowAuthModal,
    
    handleSearchSubmit,
    searchForTag,
    handleQuartileToggle,
    handleAccessToggle,
    handleAreaToggle,
    handleCategoryToggle,
    onAreaSelect,
    onCategorySelect,
    onAccessSelect,
    onQuartileSelect,
    handleClearAll,
    handleSortChange,
    handlePageChange,
    handleFollowJournal,
    fetchJournals
  };
}
