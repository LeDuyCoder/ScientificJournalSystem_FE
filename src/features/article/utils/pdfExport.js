import { jsPDF } from 'jspdf';
import logoIcon from '../../../assets/icons/researchpulse_logo_icon.svg';
import logoFull from '../../../assets/icons/researchpulse_logo_full.svg';

/**
 * Utility functions for exporting article data to PDF.
 */

const formatAuthorsLine = (authors = []) => {
  if (!authors || authors.length === 0) return 'Authors: Not specified';
  const names = authors.map(author => author.display_name || author.name || author.author_name || '').filter(Boolean).join(', ');
  return names ? `Authors: ${names}` : 'Authors: Not specified';
};

const loadSvgAsImage = async (svgUrl, opacity = 1.0) => {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = () => {
      const ratio = img.height / img.width;
      const canvas = document.createElement('canvas');
      canvas.width = 1000;
      canvas.height = canvas.width * ratio;
      const ctx = canvas.getContext('2d');
      ctx.globalAlpha = opacity;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      resolve({ dataUrl: canvas.toDataURL('image/png'), ratio });
    };
    img.onerror = () => resolve(null); // Fallback to null on error
    img.src = svgUrl;
  });
};

export const downloadArticlePdf = async (article, options = { withWatermark: true }) => {
  if (!article) return;

  // Initialize jsPDF document (Portrait, millimeters, A4 size)
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  // Page settings
  const margin = 15;
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const maxLineWidth = pageWidth - margin * 2;
  let cursorY = margin;

  const [watermarkIcon, footerLogo] = await Promise.all([
    loadSvgAsImage(logoIcon, 0.05),
    loadSvgAsImage(logoFull, 1.0)
  ]);

  const addWatermark = () => {
    if (!options.withWatermark) return; // Skip watermark for premium
    if (watermarkIcon && watermarkIcon.dataUrl) {
      const logoSize = 140; // mm
      const x = (pageWidth - logoSize) / 2;
      const y = (pageHeight - logoSize) / 2;
      doc.addImage(watermarkIcon.dataUrl, 'PNG', x, y, logoSize, logoSize);
    }
    
    // Add footer logo at bottom right
    if (footerLogo && footerLogo.dataUrl) {
      const w = 40; // mm wide
      const h = w * footerLogo.ratio;
      const x = pageWidth - margin - w;
      const y = pageHeight - 12 - (h / 2); // Center aligned with the footer text (which is at pageHeight - 10)
      doc.addImage(footerLogo.dataUrl, 'PNG', x, y, w, h);
    }
  };

  // Add watermark to first page
  addWatermark();

  // Helper to add text and advance cursor
  const addText = (text, fontSize = 12, isBold = false, textColor = [0, 0, 0], advanceY = 0) => {
    doc.setFontSize(fontSize);
    doc.setFont('helvetica', isBold ? 'bold' : 'normal');
    doc.setTextColor(textColor[0], textColor[1], textColor[2]);

    // Split text to fit width
    const lines = doc.splitTextToSize(text || '', maxLineWidth);
    
    // Check if we need to add a new page
    const estimatedHeight = lines.length * (fontSize * 0.4);
    if (cursorY + estimatedHeight > doc.internal.pageSize.getHeight() - margin) {
      doc.addPage();
      addWatermark();
      cursorY = margin;
      
      // Reset font settings for the current text
      doc.setFontSize(fontSize);
      doc.setFont('helvetica', isBold ? 'bold' : 'normal');
      doc.setTextColor(textColor[0], textColor[1], textColor[2]);
    }

    doc.text(lines, margin, cursorY);
    cursorY += (lines.length * fontSize * 0.4) + advanceY;
  };

  // Title
  addText(article.title || 'Untitled Article', 18, true, [0, 0, 0], 8);

  // Authors
  const authorsText = Array.isArray(article.authors) 
    ? formatAuthorsLine(article.authors) 
    : (article.authors || article.authors_text || 'Authors: Not specified');
  addText(authorsText, 11, false, [80, 80, 80], 8);

  // Divider
  doc.setDrawColor(200, 200, 200);
  doc.line(margin, cursorY - 3, pageWidth - margin, cursorY - 3);
  cursorY += 5;

  // Metadata Box (Year, Journal, Publisher, DOI, Citations)
  const metadata = [
    `Year: ${article.publication_year || article.year || 'N/A'}`,
    `Venue: ${article.journal_name || article.journal || article.venue || 'N/A'}`,
    `Publisher: ${article.publisher_name || article.publisher || 'N/A'}`,
    `Volume/Issue: Vol. ${article.volume_number || article.volume || 'N/A'}, Issue ${article.issue_number || article.issue || 'N/A'}`,
    `DOI: ${article.doi || 'N/A'}`,
    `Citations: ${article.citations ?? article.semantic_citation_count ?? 0}`
  ].filter(Boolean);

  metadata.forEach(item => {
    addText(item, 10, false, [50, 50, 50], 3);
  });

  cursorY += 5;
  doc.setDrawColor(200, 200, 200);
  doc.line(margin, cursorY - 3, pageWidth - margin, cursorY - 3);
  cursorY += 5;

  // Abstract
  addText('Abstract', 14, true, [0, 0, 0], 5);
  addText(article.abstract || article.description || 'No abstract is available for this article.', 11, false, [20, 20, 20], 8);

  // Keywords
  const keywordsList = Array.isArray(article.keywords) 
    ? article.keywords.map(k => k.display_name || k.name || k.keyword).filter(Boolean)
    : [];
  
  if (keywordsList.length > 0) {
    cursorY += 5;
    addText('Keywords', 14, true, [0, 0, 0], 5);
    addText(keywordsList.join('; '), 11, false, [80, 80, 80], 5);
  }

  // Footer (e.g., Exported from Scientific Journal System)
  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  doc.text(`Exported from ResearchPulse on ${new Date().toLocaleDateString()}`, margin, doc.internal.pageSize.getHeight() - 10);

  // Trigger Download
  const safeTitle = (article.title || 'article').substring(0, 30).replace(/[^a-z0-9]/gi, '_').toLowerCase();
  const filename = `article_${article.article_id || 'unknown'}_${safeTitle}.pdf`;
  doc.save(filename);
};
