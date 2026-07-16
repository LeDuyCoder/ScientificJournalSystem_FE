/**
 * Utility functions for exporting article data to CSV.
 */

const escapeCsvValue = (value) => {
  if (value === null || value === undefined) {
    return '';
  }
  
  const stringValue = String(value);
  
  // If the value contains quotes, commas, or newlines, it needs to be quoted
  if (stringValue.includes('"') || stringValue.includes(',') || stringValue.includes('\n')) {
    // Escape internal quotes by doubling them
    const escapedQuotes = stringValue.replace(/"/g, '""');
    return `"${escapedQuotes}"`;
  }
  
  return stringValue;
};

const formatAuthorsLine = (authors = []) => {
  if (!authors || authors.length === 0) return '';
  return authors.map(author => author.display_name || author.name || author.author_name || '').filter(Boolean).join('; ');
};

const formatKeywordsLine = (keywords = []) => {
  if (!keywords || keywords.length === 0) return '';
  return keywords.map(keyword => keyword.display_name || keyword.name || keyword.keyword || '').filter(Boolean).join('; ');
};

export const downloadArticleCsv = (article) => {
  if (!article) return;

  const headers = [
    'ID',
    'Title',
    'Authors',
    'Publication Year',
    'Publisher',
    'Journal / Venue',
    'Volume',
    'Issue',
    'Citations',
    'DOI',
    'Keywords',
    'Abstract'
  ];

  const row = [
    article.article_id || article.id || '',
    article.title || '',
    Array.isArray(article.authors) ? formatAuthorsLine(article.authors) : (article.authors || article.authors_text || ''),
    article.publication_year || article.year || '',
    article.publisher_name || article.publisher || '',
    article.journal_name || article.journal || article.venue || '',
    article.volume_number || article.volume || '',
    article.issue_number || article.issue || '',
    article.citations ?? article.semantic_citation_count ?? 0,
    article.doi || '',
    Array.isArray(article.keywords) ? formatKeywordsLine(article.keywords) : (article.keywords || ''),
    article.abstract || article.description || ''
  ];

  const csvContent = [
    headers.map(escapeCsvValue).join(','),
    row.map(escapeCsvValue).join(',')
  ].join('\n');

  // Add BOM for Excel UTF-8 compatibility
  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.setAttribute('href', url);
  const safeTitle = (article.title || 'article').substring(0, 30).replace(/[^a-z0-9]/gi, '_').toLowerCase();
  link.setAttribute('download', `article_${article.article_id || 'unknown'}_${safeTitle}.csv`);
  
  document.body.appendChild(link);
  link.click();
  
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
