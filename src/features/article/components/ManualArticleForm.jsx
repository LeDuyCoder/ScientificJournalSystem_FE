import React, { useState, useEffect } from 'react';
import { Row, Col, Form } from 'react-bootstrap';
import KeywordInput from './KeywordInput';
import { getSubjectCategoriesApi } from '../../catalog/api/catalogApi';
import { searchJournalsApi } from '../../journal/api/journalApi';
import { MOCK_CATEGORIES, MOCK_JOURNALS } from '../../../shared/constants/mockData';

/**
 * ManualArticleForm Component
 * Renders manual entry input form for submit article flow.
 * 
 * @param {Object} props - Props
 * @param {Object} props.formData - Parent state object containing form values
 * @param {function} props.onChange - Handler to update parent state values
 */
export default function ManualArticleForm({ formData = {}, onChange }) {
  const [journals, setJournals] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loadingOptions, setLoadingOptions] = useState(false);

  // Load selection options from active system APIs
  useEffect(() => {
    const fetchSelectionOptions = async () => {
      setLoadingOptions(true);
      try {
        const [catsRes, journalsRes] = await Promise.all([
          getSubjectCategoriesApi(),
          searchJournalsApi({ limit: 100 })
        ]);
        
        if (catsRes?.data) {
          const rawCats = catsRes.data.data || catsRes.data;
          setCategories(Array.isArray(rawCats) ? rawCats : (rawCats?.items || []));
        }
        if (journalsRes?.data) {
          const rawJournals = journalsRes.data.data || journalsRes.data;
          setJournals(Array.isArray(rawJournals) ? rawJournals : (rawJournals?.items || []));
        }
      } catch (err) {
        console.warn('Could not load categories/journals from API, using mock items:', err);
        // Failover options if backend API is not available
        setCategories(MOCK_CATEGORIES);
        setJournals(MOCK_JOURNALS);
      } finally {
        setLoadingOptions(false);
      }
    };
    fetchSelectionOptions();
  }, []);

  /**
   * Helper to set individual field value.
   */
  const handleFieldChange = (key, value) => {
    onChange({ ...formData, [key]: value });
  };

  return (
    <div className="d-flex flex-column gap-4">
      {/* Title Form Field */}
      <Form.Group controlId="articleTitle">
        <Form.Label className="fw-semibold text-main mb-1.5 small text-uppercase tracking-wider">
          Article Title <span className="text-danger">*</span>
        </Form.Label>
        <Form.Control
          type="text"
          placeholder="e.g., Quantum Neural Dynamics in Synthetic Biological Systems"
          value={formData.title || ''}
          onChange={(e) => handleFieldChange('title', e.target.value)}
          required
          style={{ height: '42px', borderColor: 'var(--border)' }}
        />
      </Form.Group>

      {/* Abstract text field */}
      <Form.Group controlId="articleAbstract">
        <Form.Label className="fw-semibold text-main mb-1.5 small text-uppercase tracking-wider">
          Abstract <span className="text-danger">*</span>
        </Form.Label>
        <Form.Control
          as="textarea"
          rows={5}
          placeholder="Provide a concise summary of your research findings..."
          value={formData.abstract || ''}
          onChange={(e) => handleFieldChange('abstract', e.target.value)}
          required
          style={{ borderColor: 'var(--border)', resize: 'vertical' }}
        />
      </Form.Group>

      {/* Row of Keywords & Author Name */}
      <Row className="g-3">
        {/* Keywords tagging field */}
        <Col xs={12} md={6}>
          <Form.Group controlId="articleKeywords">
            <Form.Label className="fw-semibold text-main mb-1.5 small text-uppercase tracking-wider">
              Keywords
            </Form.Label>
            <KeywordInput 
              keywords={formData.keywords || []}
              onChange={(kwList) => handleFieldChange('keywords', kwList)}
              placeholder="Type keyword and press Enter..."
            />
          </Form.Group>
        </Col>

        {/* Author Name field */}
        <Col xs={12} md={6}>
          <Form.Group controlId="articleAuthor">
            <Form.Label className="fw-semibold text-main mb-1.5 small text-uppercase tracking-wider">
              Author Name <span className="text-danger">*</span>
            </Form.Label>
            <Form.Control
              type="text"
              placeholder="Full name as it appears in publication"
              value={formData.author || ''}
              onChange={(e) => handleFieldChange('author', e.target.value)}
              required
              style={{ height: '44px', borderColor: 'var(--border)' }}
            />
          </Form.Group>
        </Col>
      </Row>

      {/* Row of Journal Selection & Subject/Category select boxes */}
      <Row className="g-3">
        {/* Journal Selection dropdown */}
        <Col xs={12} md={6}>
          <Form.Group controlId="articleJournal">
            <Form.Label className="fw-semibold text-main mb-1.5 small text-uppercase tracking-wider">
              Journal Selection <span className="text-danger">*</span>
            </Form.Label>
            <Form.Select
              value={formData.journalId || ''}
              onChange={(e) => handleFieldChange('journalId', e.target.value)}
              required
              style={{ height: '42px', borderColor: 'var(--border)', cursor: 'pointer' }}
            >
              <option value="">Choose a journal...</option>
              {journals.map((j) => (
                <option key={j.id || j.journal_id} value={j.id || j.journal_id}>
                  {j.display_name || j.name || j.title}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>

        {/* Subject Category dropdown */}
        <Col xs={12} md={6}>
          <Form.Group controlId="articleCategory">
            <Form.Label className="fw-semibold text-main mb-1.5 small text-uppercase tracking-wider">
              Section / Category <span className="text-danger">*</span>
            </Form.Label>
            <Form.Select
              value={formData.categoryId || ''}
              onChange={(e) => handleFieldChange('categoryId', e.target.value)}
              required
              style={{ height: '42px', borderColor: 'var(--border)', cursor: 'pointer' }}
            >
              <option value="">Select category...</option>
              {categories.map((c) => (
                <option key={c.id || c.subject_category_id} value={c.id || c.subject_category_id}>
                  {c.display_name || c.name || c.category_name}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>
      </Row>
    </div>
  );
}
