import { t } from "i18next";
import { useTranslation } from "react-i18next";
/**
 * File source thuộc hệ thống FE ResearchPulse.
 *
 * File: features\article\components\ArticleFilterBar.jsx
 */
import { useState, useEffect } from 'react';
import { Dropdown, Form, Button } from 'react-bootstrap';
import { Icon } from '@iconify/react';
import { FilterSearch } from '../../../shared/components/Input';
import { FilterCard } from '../../../shared/components/Card';
import { searchJournalsApi } from '../../journal/api/journalApi';
import { getTopicsApi } from '../../topic/api/topic.api';
const YEAR_OPTIONS = [{
  value: '2026',
  label: '2026'
}, {
  value: '2025',
  label: '2025'
}, {
  value: '2024',
  label: '2024'
}, {
  value: '2023',
  label: '2023'
}, {
  value: '2022',
  label: '2022'
}];
const ACCESS_OPTIONS = [{
  value: 'oa',
  label: 'Open Access (OA)'
}];
const SORT_OPTIONS = [{
  value: 'created_at-desc',
  label: t("article.moiNhat")
}, {
  value: 'created_at-asc',
  label: t("article.cuNhat")
}, {
  value: 'title-asc',
  label: t("article.tieuDeAz")
}, {
  value: 'title-desc',
  label: t("article.tieuDeZa")
}, {
  value: 'publication_year-desc',
  label: t("article.namXuatBanGiam")
}, {
  value: 'publication_year-asc',
  label: t("article.namXuatBanTang")
}];
export default function ArticleFilterBar({
  filters,
  updateFilters,
  clearFilters
}) {
  const {
    t
  } = useTranslation();
  const [journalOptions, setJournalOptions] = useState([]);
  const [topicOptions, setTopicOptions] = useState([]);
  const [loadingFilters, setLoadingFilters] = useState(false);
  const [menuSearch, setMenuSearch] = useState({});
  useEffect(() => {
    const fetchFilterOptions = async () => {
      setLoadingFilters(true);
      try {
        const [journalResponse, topicResponse] = await Promise.allSettled([searchJournalsApi({
          limit: 100
        }), getTopicsApi({
          limit: 100,
          sort_by: 'display_name',
          sort_order: 'asc'
        })]);
        if (journalResponse.status === 'fulfilled' && journalResponse.value?.data?.success && journalResponse.value?.data?.data?.items) {
          const fetchedOptions = journalResponse.value.data.data.items.map(item => ({
            value: String(item.journal_id),
            label: item.display_name
          }));
          fetchedOptions.sort((a, b) => a.label.localeCompare(b.label));
          setJournalOptions(fetchedOptions);
        }
        if (topicResponse.status === 'fulfilled' && topicResponse.value?.data?.success) {
          const topicData = topicResponse.value.data;
          const topicItems = topicData?.data?.topics || topicData?.data?.items || topicData?.data || [];
          const fetchedTopics = topicItems.map(item => ({
            value: String(item.topic_id || item.id),
            label: item.display_name || item.name || `Topic #${item.topic_id || item.id}`
          })).filter(item => item.value && item.label);
          setTopicOptions(fetchedTopics);
        }
      } catch (error) {
        console.error('Failed to fetch article filter options:', error);
      } finally {
        setLoadingFilters(false);
      }
    };
    fetchFilterOptions();
  }, []);
  const handleSearchChange = val => {
    updateFilters({
      search: val
    });
  };
  const handleSelectChange = key => val => {
    updateFilters({
      [key]: val
    });
  };
  const handleSortChange = val => {
    const [sortBy, sortOrder] = val.split('-');
    updateFilters({
      sortBy,
      sortOrder
    });
  };
  const currentSortValue = `${filters.sortBy}-${filters.sortOrder}`;
  const hasActiveFilters = filters.search !== '' || filters.selectedYear !== 'all' || filters.selectedJournal !== 'all' || filters.selectedTopic !== 'all' || filters.selectedAccess !== 'all' || filters.sortBy !== 'created_at' || filters.sortOrder !== 'desc';
  const filterConfigs = [{
    id: 'year',
    label: t("article.nam"),
    options: YEAR_OPTIONS,
    selectedLabel: filters.selectedYear !== 'all' ? YEAR_OPTIONS.find(o => String(o.value) === String(filters.selectedYear))?.label : '',
    onSelect: handleSelectChange('year'),
    onClear: () => handleSelectChange('year')('all')
  }, {
    id: 'journal',
    label: t("typeJournal"),
    options: journalOptions,
    selectedLabel: filters.selectedJournal !== 'all' ? journalOptions.find(o => String(o.value) === String(filters.selectedJournal))?.label : '',
    onSelect: handleSelectChange('journal'),
    onClear: () => handleSelectChange('journal')('all'),
    searchable: true,
    emptyLabel: t("article.khongTimThayTapChi")
  }, {
    id: 'topic',
    label: t("article.chuDe"),
    options: topicOptions,
    selectedLabel: filters.selectedTopic !== 'all' ? topicOptions.find(o => String(o.value) === String(filters.selectedTopic))?.label : '',
    onSelect: handleSelectChange('topic'),
    onClear: () => handleSelectChange('topic')('all'),
    searchable: true,
    emptyLabel: t("article.khongTimThayChuDe")
  }];
  const activeChips = filterConfigs.filter(config => config.selectedLabel).map(config => ({
    id: config.id,
    label: config.label,
    value: config.selectedLabel,
    onClear: config.onClear
  }));
  if (filters.selectedAccess === 'oa') {
    activeChips.push({
      id: 'access',
      label: 'Access',
      value: 'Open Access',
      onClear: () => handleSelectChange('access')('all')
    });
  }
  if (currentSortValue !== 'created_at-desc') {
    activeChips.push({
      id: 'sort',
      label: 'Sort',
      value: SORT_OPTIONS.find(o => o.value === currentSortValue)?.label || t("article.sapXep"),
      onClear: () => handleSortChange('created_at-desc')
    });
  }
  const getFilteredOptions = config => {
    const keyword = (menuSearch[config.id] || '').trim().toLowerCase();
    if (!keyword) return config.options;
    return config.options.filter(option => option.label.toLowerCase().includes(keyword));
  };
  const renderDropdown = config => {
    const {
      t
    } = useTranslation();
    const filteredOptions = getFilteredOptions(config);
    const activeValue = config.id === 'year' ? filters.selectedYear : config.id === 'journal' ? filters.selectedJournal : filters.selectedTopic;
    return <Dropdown key={config.id} className="article-filter-dropdown" autoClose="outside">
        <Dropdown.Toggle variant="light" id={`article-filter-${config.id}`} className={`article-filter-button ${config.selectedLabel ? 'is-active' : ''}`} disabled={loadingFilters}>
          <span className="article-filter-button-label">{config.selectedLabel || config.label}</span>
          <Icon icon="lucide:chevron-down" width="15" />
        </Dropdown.Toggle>

        <Dropdown.Menu className="article-filter-menu">
          <div className="article-filter-menu-header">
            <span>{config.label}</span>
            {config.selectedLabel && <button type="button" onClick={config.onClear} className="article-filter-reset-btn">
                Reset
              </button>}
          </div>

          {config.searchable && <div className="article-menu-search">
              <Icon icon="lucide:search" width="15" />
              <input type="search" value={menuSearch[config.id] || ''} onChange={event => setMenuSearch(prev => ({
            ...prev,
            [config.id]: event.target.value
          }))} placeholder={t("article.searchValues")} />
            </div>}

          <div className="article-filter-options">
            {filteredOptions.length > 0 ? filteredOptions.map(option => {
            const isSelected = String(activeValue || '') === String(option.value);
            return <button key={option.value} type="button" title={option.title || option.label} className={`article-filter-option ${isSelected ? 'is-selected' : ''}`} onClick={() => {
              if (isSelected) {
                config.onClear();
                return;
              }
              config.onSelect(option.value);
            }}>
                    <span className="article-option-check" aria-hidden="true">
                      {isSelected && <Icon icon="lucide:check" width="13" />}
                    </span>
                    <span>{option.label}</span>
                  </button>;
          }) : <div className="article-filter-empty">{config.emptyLabel || t("article.khongCoLuaChonPhuHop")}</div>}
          </div>
        </Dropdown.Menu>
      </Dropdown>;
  };
  return <FilterCard className="article-filter-card text-start mb-4">
      <div className="article-filter-layout">
        <div className="article-filter-toolbar" aria-label="Article filters">
          {filterConfigs.map(renderDropdown)}

          {/* Sắp xếp */}
          <Dropdown className="article-filter-dropdown" autoClose="outside">
            <Dropdown.Toggle variant="light" id="article-sort-filters" className={`article-filter-button ${currentSortValue !== 'created_at-desc' ? 'is-active' : ''}`}>
              <span className="article-filter-button-label">
                {currentSortValue !== 'created_at-desc' ? SORT_OPTIONS.find(o => o.value === currentSortValue)?.label : t("article.sapXep")}
              </span>
              <Icon icon="lucide:arrow-up-down" width="15" />
            </Dropdown.Toggle>
            <Dropdown.Menu className="article-filter-menu">
              <div className="article-filter-menu-header">
                <span>{t("article.sapXepBaiBao")}</span>
                {currentSortValue !== 'created_at-desc' && <button type="button" onClick={() => handleSortChange('created_at-desc')} className="article-filter-reset-btn">
                    Reset
                  </button>}
              </div>
              <div className="article-filter-options">
                {SORT_OPTIONS.map(option => {
                const isSelected = option.value === currentSortValue;
                return <button key={option.value} type="button" className={`article-filter-option ${isSelected ? 'is-selected' : ''}`} onClick={() => handleSortChange(option.value)}>
                      <span className="article-option-check" aria-hidden="true">
                        {isSelected && <Icon icon="lucide:check" width="13" />}
                      </span>
                      <span>{option.label}</span>
                    </button>;
              })}
              </div>
            </Dropdown.Menu>
          </Dropdown>

          <Dropdown className="article-filter-dropdown" autoClose="outside">
            <Dropdown.Toggle variant="light" id="article-more-filters" className="article-filter-button article-more-filter-button">
              <Icon icon="lucide:sliders-horizontal" width="16" />
              <span>More filters</span>
            </Dropdown.Toggle>
            <Dropdown.Menu className="article-filter-menu article-more-filter-menu">
              <div className="article-filter-menu-header">
                <span>More filters</span>
              </div>

              <button type="button" onClick={() => handleSelectChange('access')(filters.selectedAccess === 'oa' ? 'all' : 'oa')} className={`article-toggle-row ${filters.selectedAccess === 'oa' ? 'is-active' : ''}`} style={{
              width: '100%',
              border: 0,
              background: 'transparent',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.65rem',
              color: 'var(--text-main)',
              fontWeight: 500,
              fontSize: '0.88rem'
            }}>
                <Form.Check type="switch" checked={filters.selectedAccess === 'oa'} readOnly className="m-0" />
                <span>{t("article.chiHienThiOpenAccess")}</span>
              </button>
            </Dropdown.Menu>
          </Dropdown>
        </div>

        <div className="article-table-search-form">
          <FilterSearch initialValue={filters.search} onSearchChange={handleSearchChange} placeholder={t("article.timBaiBaoDoiTuKhoa")} className="article-table-search" actionButton={null} />
        </div>
      </div>

      {activeChips.length > 0 && <div className="article-selected-filters" aria-label="Selected article filters">
          {activeChips.map(chip => <button key={chip.id} type="button" className="article-selected-filter-chip" onClick={chip.onClear}>
              <span>{chip.value}</span>
              <Icon icon="lucide:x" width="13" />
            </button>)}

          <button type="button" onClick={clearFilters} className="article-clear-btn article-clear-inline">
            Clear filters
          </button>
        </div>}
    </FilterCard>;
}