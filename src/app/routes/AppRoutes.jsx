import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LandingPage from '../../features/landing/pages/LandingPage';
import JournalDetailPage from '../../features/journal/pages/JournalDetailPage';
import CatalogSearchPage from '../../features/catalog/pages/CatalogSearchPage';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/journals/:id" element={<JournalDetailPage />} />
      <Route path="/catalog" element={<CatalogSearchPage />} />
      <Route path="/search" element={<CatalogSearchPage />} />
      {/* Fallback redirect or simple 404 can go here */}
      <Route path="*" element={<LandingPage />} />
    </Routes>
  );
}
