import { useState, useEffect, useCallback } from 'react';
import {
  getJournalByIdApi,
  getJournalRankingsApi,
  getCatalogVolumesApi,
  getCatalogIssuesApi,
  getJournalArticlesApi,
  followJournalApi,
  addJournalToProjectApi,
} from '../api/journalApi';

export function useJournalDetail(journalId, currentUser) {
  // Page core states
  const [journal, setJournal] = useState(null);
  const [rankingHistory, setRankingHistory] = useState([]);
  const [volumes, setVolumes] = useState([]);
  const [issuesByVolume, setIssuesByVolume] = useState({});
  const [recentArticles, setRecentArticles] = useState([]);
  const [activeTab, setActiveTab] = useState('ranking');

  // Loading & error states
  const [loadingJournal, setLoadingJournal] = useState(true);
  const [loadingRanking, setLoadingRanking] = useState(false);
  const [loadingVolumes, setLoadingVolumes] = useState(false);
  const [loadingArticles, setLoadingArticles] = useState(false);
  const [error, setError] = useState(null);
  const [notFound, setNotFound] = useState(false);

  // Modal / Interaction states
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isAddingToProject, setIsAddingToProject] = useState(false);

  // Fetch Core Journal Info
  const fetchJournalInfo = useCallback(async () => {
    if (!journalId) return;
    setLoadingJournal(true);
    setError(null);
    setNotFound(false);

    try {
      const response = await getJournalByIdApi(journalId);
      if (response.data && response.data.data) {
        setJournal(response.data.data);
      } else {
        setNotFound(true);
      }
    } catch (err) {
      console.error('API error fetching journal info:', err);
      setError(err.response?.data?.message || err.message);
      setNotFound(true);
    } finally {
      setLoadingJournal(false);
    }
  }, [journalId]);

  // Fetch Rankings History
  const fetchRankingHistory = useCallback(async () => {
    if (!journalId) return;
    setLoadingRanking(true);
    try {
      const response = await getJournalRankingsApi(journalId);
      if (response.data && response.data.data) {
        setRankingHistory(response.data.data);
      } else {
        setRankingHistory([]);
      }
    } catch (err) {
      console.error('API error fetching rankings:', err);
      setRankingHistory([]);
    } finally {
      setLoadingRanking(false);
    }
  }, [journalId]);

  // Fetch Volumes
  const fetchVolumes = useCallback(async () => {
    if (volumes.length > 0) return; // cache loaded
    setLoadingVolumes(true);
    try {
      const response = await getCatalogVolumesApi({ journal_id: journalId });
      if (response.data && response.data.data) {
        setVolumes(response.data.data);
      } else {
        setVolumes([]);
      }
    } catch (err) {
      console.error('API error fetching volumes:', err);
      setVolumes([]);
    } finally {
      setLoadingVolumes(false);
    }
  }, [journalId, volumes.length]);

  // Fetch Issues for a specific volume
  const fetchIssuesForVolume = useCallback(async (volumeId) => {
    if (issuesByVolume[volumeId]) return; // already loaded
    try {
      const response = await getCatalogIssuesApi({ volume_id: volumeId });
      if (response.data && response.data.data) {
        setIssuesByVolume(prev => ({ ...prev, [volumeId]: response.data.data }));
      } else {
        setIssuesByVolume(prev => ({ ...prev, [volumeId]: [] }));
      }
    } catch (err) {
      console.error(`API error fetching issues for volume ${volumeId}:`, err);
      setIssuesByVolume(prev => ({ ...prev, [volumeId]: [] }));
    }
  }, [issuesByVolume]);

  // Fetch Recent Articles
  const fetchRecentArticles = useCallback(async () => {
    if (recentArticles.length > 0) return; // cache loaded
    setLoadingArticles(true);
    try {
      const response = await getJournalArticlesApi({ journal_id: journalId });
      if (response.data && response.data.data) {
        setRecentArticles(response.data.data);
      } else {
        setRecentArticles([]);
      }
    } catch (err) {
      console.error('API error fetching articles:', err);
      setRecentArticles([]);
    } finally {
      setLoadingArticles(false);
    }
  }, [journalId, recentArticles.length]);

  // Init fetch
  useEffect(() => {
    fetchJournalInfo();
    fetchRankingHistory();
  }, [fetchJournalInfo, fetchRankingHistory]);

  // Lazy load tabs
  useEffect(() => {
    if (activeTab === 'volumes') {
      fetchVolumes();
    } else if (activeTab === 'articles') {
      fetchRecentArticles();
    }
  }, [activeTab, fetchVolumes, fetchRecentArticles]);

  // Actions
  const handleFollow = useCallback(async () => {
    if (!currentUser) {
      setShowAuthModal(true);
      return;
    }

    setIsFollowing(true);
    try {
      await followJournalApi(journalId);
      setJournal(prev => {
        if (!prev) return prev;
        const wasFollowing = prev.is_following;
        return { ...prev, is_following: !wasFollowing };
      });
    } catch (err) {
      console.error('Follow API failed:', err);
    } finally {
      setIsFollowing(false);
    }
  }, [journalId, currentUser]);

  const handleAddToProject = useCallback(async (projectId) => {
    if (!currentUser) {
      setShowAuthModal(true);
      return;
    }

    setIsAddingToProject(true);
    try {
      if (projectId) {
        await addJournalToProjectApi(projectId, journalId);
        setShowProjectModal(false);
        alert('Tạp chí đã được thêm vào dự án thành công!');
      } else {
        setShowProjectModal(true);
      }
    } catch (err) {
      console.error('Add to project API failed:', err);
      alert('Thêm vào dự án thất bại. Vui lòng thử lại!');
    } finally {
      setIsAddingToProject(false);
    }
  }, [journalId, currentUser]);

  return {
    journal,
    rankingHistory,
    volumes,
    issuesByVolume,
    recentArticles,
    activeTab,
    setActiveTab,
    loadingJournal,
    loadingRanking,
    loadingVolumes,
    loadingArticles,
    error,
    notFound,
    showAuthModal,
    setShowAuthModal,
    showProjectModal,
    setShowProjectModal,
    isFollowing,
    isAddingToProject,
    handleFollow,
    handleAddToProject,
    fetchIssuesForVolume
  };
}
