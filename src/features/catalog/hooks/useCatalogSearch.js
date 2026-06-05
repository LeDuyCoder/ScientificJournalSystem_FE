import { useState, useEffect, useCallback, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { searchJournalsApi } from '../../journal/api/journalApi';
import { getSubjectAreasApi, getSubjectCategoriesApi } from '../api/catalogApi';

// High-fidelity Mock Journals database for Sandbox & API failures
const MOCK_JOURNALS = [
  {
    id: 'nature-machine-intelligence',
    display_name: 'Nature Machine Intelligence',
    publisher: 'Springer Nature',
    country: 'United Kingdom',
    issn: '2522-5839',
    is_open_access: false,
    quartile: 'Q1',
    subject_area_id: 1, // Computer Science
    subject_area_name: 'Computer Science',
    subject_category_id: 101, // Artificial Intelligence
    subject_category_name: 'Artificial Intelligence',
    metric_value: 23.8,
    metric_name: 'Impact Factor'
  },
  {
    id: 'ieee-tpami',
    display_name: 'IEEE Transactions on Pattern Analysis and Machine Intelligence',
    publisher: 'IEEE Computer Society',
    country: 'United States',
    issn: '0162-8828',
    is_open_access: false,
    quartile: 'Q1',
    subject_area_id: 1, // Computer Science
    subject_area_name: 'Computer Science',
    subject_category_id: 103, // Computer Vision
    subject_category_name: 'Computer Vision',
    metric_value: 24.3,
    metric_name: 'Impact Factor'
  },
  {
    id: 'jmlr',
    display_name: 'Journal of Machine Learning Research',
    publisher: 'Microtome Publishing',
    country: 'United States',
    issn: '1532-4435',
    is_open_access: true,
    quartile: 'Q1',
    subject_area_id: 1, // Computer Science
    subject_area_name: 'Computer Science',
    subject_category_id: 102, // Machine Learning
    subject_category_name: 'Machine Learning',
    metric_value: 8.5,
    metric_name: 'SJR'
  },
  {
    id: 'neural-networks',
    display_name: 'Neural Networks',
    publisher: 'Elsevier',
    country: 'Netherlands',
    issn: '0893-6080',
    is_open_access: true,
    quartile: 'Q2',
    subject_area_id: 1, // Computer Science
    subject_area_name: 'Computer Science',
    subject_category_id: 101, // Artificial Intelligence
    subject_category_name: 'Artificial Intelligence',
    metric_value: 7.8,
    metric_name: 'Impact Factor'
  },
  {
    id: 'lancet-digital-health',
    display_name: 'The Lancet Digital Health',
    publisher: 'Elsevier',
    country: 'United Kingdom',
    issn: '2589-7500',
    is_open_access: true,
    quartile: 'Q1',
    subject_area_id: 2, // Medicine
    subject_area_name: 'Medicine',
    subject_category_id: 201, // Clinical Medicine
    subject_category_name: 'Clinical Medicine',
    metric_value: 36.6,
    metric_name: 'Impact Factor'
  },
  {
    id: 'computer-aided-engineering',
    display_name: 'Computer-Aided Civil and Infrastructure Engineering',
    publisher: 'Wiley-Blackwell',
    country: 'United States',
    issn: '1093-9687',
    is_open_access: false,
    quartile: 'Q1',
    subject_area_id: 3, // Engineering
    subject_area_name: 'Engineering',
    subject_category_id: 301, // Civil Engineering
    subject_category_name: 'Civil Engineering',
    metric_value: 11.7,
    metric_name: 'Impact Factor'
  }
];

const MOCK_SUBJECT_AREAS = [
  { subject_area_id: 1, display_name: 'Computer Science', count: 4280 },
  { subject_area_id: 2, display_name: 'Medicine', count: 6120 },
  { subject_area_id: 3, display_name: 'Engineering', count: 3450 },
  { subject_area_id: 4, display_name: 'Physics', count: 2810 },
  { subject_area_id: 5, display_name: 'Biology', count: 3920 }
];

const MOCK_SUBJECT_CATEGORIES = [
  { subject_category_id: 101, subject_area_id: 1, display_name: 'Artificial Intelligence', count: 892 },
  { subject_category_id: 102, subject_area_id: 1, display_name: 'Machine Learning', count: 734 },
  { subject_category_id: 103, subject_area_id: 1, display_name: 'Computer Vision', count: 518 },
  { subject_category_id: 104, subject_area_id: 1, display_name: 'NLP', count: 421 },
  { subject_category_id: 201, subject_area_id: 2, display_name: 'Clinical Medicine', count: 915 },
  { subject_category_id: 301, subject_area_id: 3, display_name: 'Civil Engineering', count: 420 }
];

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
  
  const selectedAreas = searchParams.getAll('area_id').map(id => parseInt(id, 10));
  const selectedCategories = searchParams.getAll('cat_id').map(id => parseInt(id, 10));
  
  // Access: open_access or subscription
  const selectedAccess = searchParams.getAll('access');
  // Quartiles: Q1, Q2, Q3, Q4
  const selectedQuartiles = searchParams.getAll('quartile');

  // Load subject filters from API
  useEffect(() => {
    async function loadFilters() {
      setLoadingFilters(true);
      try {
        const [areasRes, catsRes] = await Promise.all([
          getSubjectAreasApi(),
          getSubjectCategoriesApi()
        ]);
        
        if (areasRes.data?.success !== false) {
          setSubjectAreas(areasRes.data?.data || MOCK_SUBJECT_AREAS);
        } else {
          setSubjectAreas(MOCK_SUBJECT_AREAS);
        }

        if (catsRes.data?.success !== false) {
          setSubjectCategories(catsRes.data?.data || MOCK_SUBJECT_CATEGORIES);
        } else {
          setSubjectCategories(MOCK_SUBJECT_CATEGORIES);
        }
      } catch (err) {
        console.warn('Failed to load catalog filters from backend API, using mock fallbacks:', err);
        setSubjectAreas(MOCK_SUBJECT_AREAS);
        setSubjectCategories(MOCK_SUBJECT_CATEGORIES);
      } finally {
        setLoadingFilters(false);
      }
    }

    loadFilters();
  }, []);

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
        setTotal(data.total || (data.items || []).length);
      } else {
        throw new Error(response.data?.message || 'Invalid search format');
      }
    } catch (err) {
      console.warn('Backend search API failed, running high-fidelity offline filter logic:', err);
      
      // Artificial delay to mimic network latency
      await new Promise(resolve => setTimeout(resolve, 600));

      // Offline filter simulation
      let filtered = [...MOCK_JOURNALS];

      // Search keyword filter
      if (search) {
        const query = search.toLowerCase();
        filtered = filtered.filter(j => 
          j.display_name.toLowerCase().includes(query) ||
          j.publisher.toLowerCase().includes(query) ||
          j.issn.toLowerCase().includes(query)
        );
      }

      // Subject Area Filter
      if (selectedAreas.length > 0) {
        filtered = filtered.filter(j => selectedAreas.includes(j.subject_area_id));
      }

      // Subject Category Filter
      if (selectedCategories.length > 0) {
        filtered = filtered.filter(j => selectedCategories.includes(j.subject_category_id));
      }

      // Access Filter
      if (selectedAccess.length > 0) {
        const showOA = selectedAccess.includes('open_access');
        const showSub = selectedAccess.includes('subscription');
        if (showOA && !showSub) {
          filtered = filtered.filter(j => j.is_open_access);
        } else if (!showOA && showSub) {
          filtered = filtered.filter(j => !j.is_open_access);
        }
      }

      // Quartile Filter
      if (selectedQuartiles.length > 0) {
        filtered = filtered.filter(j => selectedQuartiles.includes(j.quartile));
      }

      // Sorting simulation
      if (sort === 'metric') {
        filtered.sort((a, b) => b.metric_value - a.metric_value);
      } else if (sort === 'name') {
        filtered.sort((a, b) => a.display_name.localeCompare(b.display_name));
      }

      // Pagination slice
      const start = (page - 1) * limit;
      const paginated = filtered.slice(start, start + limit);

      setJournals(paginated);
      setTotal(filtered.length);
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
    const currentAreas = nextParams.getAll('area_id').map(id => parseInt(id, 10));

    if (currentAreas.includes(areaId)) {
      // Toggling off area
      const remainingAreas = currentAreas.filter(id => id !== areaId);
      nextParams.delete('area_id');
      remainingAreas.forEach(id => nextParams.append('area_id', String(id)));

      // Remove dependent categories
      const currentCats = nextParams.getAll('cat_id').map(id => parseInt(id, 10));
      const dependentCats = subjectCategories
        .filter(c => c.subject_area_id === areaId)
        .map(c => c.subject_category_id);
      
      const remainingCats = currentCats.filter(id => !dependentCats.includes(id));
      nextParams.delete('cat_id');
      remainingCats.forEach(id => nextParams.append('cat_id', String(id)));
    } else {
      // Toggling on area
      nextParams.append('area_id', String(areaId));
    }

    nextParams.set('page', '1');
    setSearchParams(nextParams);
  };

  const handleCategoryToggle = (catId) => {
    toggleParamValue('cat_id', catId);
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
    handleClearAll,
    handleSortChange,
    handlePageChange,
    handleFollowJournal,
    fetchJournals
  };
}
