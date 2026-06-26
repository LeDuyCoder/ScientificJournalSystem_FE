/**
 * File source thuộc hệ thống FE ResearchPulse.
 *
 * File: features\catalog\components\FilterPanel.jsx
 */
import { useMemo, useState } from 'react';
import { Dropdown, Form } from 'react-bootstrap';
import { Icon } from '@iconify/react';
import { FilterCard } from '../../../shared/components/Card';
import { FilterSearch } from '../../../shared/components/Input';

export default function FilterPanel({
  searchInput = '',
  setSearchInput,
  onSearchSubmit,
  subjectAreas = [],
  subjectCategories = [],
  selectedAreas = [],
  selectedCategories = [],
  selectedAccess = [],
  selectedQuartiles = [],
  selectedYear = '',
  selectedZone = '',
  zones = [],
  onAreaSelect,
  onCategorySelect,
  onAccessSelect,
  onQuartileSelect,
  onYearSelect,
  onZoneSelect,
  isOaDiamond = false,
  onOaDiamondToggle,
  onClearAll,
  loading = false
}) {
  const [menuSearch, setMenuSearch] = useState({});
  const hasSelectedArea = selectedAreas.length > 0;
  const accessValue = selectedAccess[0] || 'all';
  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: currentYear - 2014 }, (_, i) => currentYear - i);

  const cleanLabel = (value = '') => {
    const parts = String(value).split(';').map(part => part.trim()).filter(Boolean);
    return parts.length > 0 ? parts[parts.length - 1] : value;
  };

  const getAreaLabel = (areaId) => {
    const area = subjectAreas.find(item => String(item.subject_area_id) === String(areaId));
    return area ? cleanLabel(area.display_name) : '';
  };

  const categoryNameCounts = subjectCategories.reduce((acc, cat) => {
    const label = cleanLabel(cat.display_name);
    acc[label] = (acc[label] || 0) + 1;
    return acc;
  }, {});

  const getCategoryLabel = (cat) => {
    const label = cleanLabel(cat.display_name);
    const isDuplicateName = categoryNameCounts[label] > 1;
    const areaLabel = getAreaLabel(cat.subject_area_id);
    return isDuplicateName && areaLabel ? `${label} (${areaLabel})` : label;
  };

  const visibleCategories = useMemo(() => {
    if (!hasSelectedArea) return [];
    return subjectCategories.filter(cat => selectedAreas.includes(String(cat.subject_area_id)));
  }, [hasSelectedArea, selectedAreas, subjectCategories]);

  const zoneOptions = zones.map(zone => ({
    value: String(zone.zone_id),
    label: zone.name,
    title: zone.name
  }));

  const filterOptions = {
    area: subjectAreas.map(area => ({
      value: String(area.subject_area_id),
      label: cleanLabel(area.display_name),
      title: area.display_name
    })),
    category: visibleCategories.map(cat => ({
      value: String(cat.subject_category_id),
      label: getCategoryLabel(cat),
      title: cat.display_name
    })),
    zone: zoneOptions,
    quartile: ['Q1', 'Q2', 'Q3', 'Q4'].map(q => ({ value: q, label: q })),
    year: yearOptions.map(year => ({ value: String(year), label: String(year) }))
  };

  const selectedLabels = {
    area: selectedAreas[0] ? getAreaLabel(selectedAreas[0]) : '',
    category: selectedCategories[0]
      ? filterOptions.category.find(option => option.value === String(selectedCategories[0]))?.label || ''
      : '',
    zone: selectedZone ? zoneOptions.find(option => option.value === String(selectedZone))?.label || '' : '',
    quartile: selectedQuartiles[0] || '',
    year: selectedYear || ''
  };

  const filterConfigs = [
    {
      id: 'area',
      label: 'Subject area',
      selectedLabel: selectedLabels.area,
      options: filterOptions.area,
      disabled: loading,
      searchable: true,
      onSelect: onAreaSelect,
      onClear: () => onAreaSelect('all')
    },
    {
      id: 'category',
      label: 'Subject category',
      selectedLabel: selectedLabels.category,
      options: filterOptions.category,
      disabled: loading || !hasSelectedArea,
      searchable: true,
      emptyLabel: hasSelectedArea ? 'Không có category phù hợp' : 'Chọn subject area trước',
      onSelect: onCategorySelect,
      onClear: () => onCategorySelect('all')
    },
    {
      id: 'zone',
      label: 'Zone',
      selectedLabel: selectedLabels.zone,
      options: filterOptions.zone,
      disabled: loading,
      searchable: true,
      onSelect: onZoneSelect,
      onClear: () => onZoneSelect('all')
    },
    {
      id: 'quartile',
      label: 'Quartile',
      selectedLabel: selectedLabels.quartile,
      options: filterOptions.quartile,
      disabled: loading,
      onSelect: onQuartileSelect,
      onClear: () => onQuartileSelect('all')
    },
    {
      id: 'year',
      label: 'Year',
      selectedLabel: selectedLabels.year,
      options: filterOptions.year,
      disabled: loading,
      onSelect: onYearSelect,
      onClear: () => onYearSelect('all')
    }
  ];

  const activeChips = filterConfigs
    .filter(config => config.selectedLabel)
    .map(config => ({ id: config.id, label: config.label, value: config.selectedLabel, onClear: config.onClear }));

  if (accessValue === 'open_access') {
    activeChips.push({
      id: 'access',
      label: 'Access',
      value: 'Open Access',
      onClear: () => onAccessSelect('all')
    });
  }

  if (isOaDiamond) {
    activeChips.push({
      id: 'oa-diamond',
      label: 'Access',
      value: 'OA Diamond',
      onClear: () => onOaDiamondToggle?.(false)
    });
  }

  const getFilteredOptions = (config) => {
    const keyword = (menuSearch[config.id] || '').trim().toLowerCase();
    if (!keyword) return config.options;
    return config.options.filter(option => option.label.toLowerCase().includes(keyword));
  };

  const renderDropdown = (config) => {
    const filteredOptions = getFilteredOptions(config);
    const activeValue = config.id === 'area'
      ? selectedAreas[0]
      : config.id === 'category'
        ? selectedCategories[0]
        : config.id === 'zone'
          ? selectedZone
          : config.id === 'quartile'
            ? selectedQuartiles[0]
            : selectedYear;

    return (
      <Dropdown key={config.id} className="catalog-filter-dropdown" autoClose="outside">
        <Dropdown.Toggle
          variant="light"
          id={`catalog-filter-${config.id}`}
          className={`catalog-filter-button ${config.selectedLabel ? 'is-active' : ''}`}
          disabled={config.disabled}
        >
          <span className="catalog-filter-button-label">{config.selectedLabel || config.label}</span>
          <Icon icon="lucide:chevron-down" width="15" />
        </Dropdown.Toggle>

        <Dropdown.Menu className="catalog-filter-menu">
          <div className="catalog-filter-menu-header">
            <span>{config.label}</span>
            {config.selectedLabel && (
              <button type="button" onClick={config.onClear} className="catalog-filter-reset-btn">
                Reset
              </button>
            )}
          </div>

          {config.searchable && (
            <div className="catalog-menu-search">
              <Icon icon="lucide:search" width="15" />
              <input
                type="search"
                value={menuSearch[config.id] || ''}
                onChange={(event) => setMenuSearch(prev => ({ ...prev, [config.id]: event.target.value }))}
                placeholder="Search values"
              />
            </div>
          )}

          <div className="catalog-filter-options">
            {filteredOptions.length > 0 ? (
              filteredOptions.map(option => {
                const isSelected = String(activeValue || '') === String(option.value);
                return (
                  <button
                    key={option.value}
                    type="button"
                    title={option.title || option.label}
                    className={`catalog-filter-option ${isSelected ? 'is-selected' : ''}`}
                    onClick={() => {
                      if (isSelected) {
                        config.onClear();
                        return;
                      }
                      config.onSelect(option.value);
                    }}
                  >
                    <span className="catalog-option-check" aria-hidden="true">
                      {isSelected && <Icon icon="lucide:check" width="13" />}
                    </span>
                    <span>{option.label}</span>
                  </button>
                );
              })
            ) : (
              <div className="catalog-filter-empty">{config.emptyLabel || 'Không có lựa chọn phù hợp'}</div>
            )}
          </div>
        </Dropdown.Menu>
      </Dropdown>
    );
  };

  return (
    <FilterCard className="catalog-filter-card text-start mb-4">
      <div className="catalog-filter-layout">
        <div className="catalog-filter-toolbar" aria-label="Catalog filters">
          {filterConfigs.map(renderDropdown)}

          <Dropdown className="catalog-filter-dropdown" autoClose="outside">
            <Dropdown.Toggle variant="light" id="catalog-more-filters" className="catalog-filter-button catalog-more-filter-button">
              <Icon icon="lucide:sliders-horizontal" width="16" />
              <span>More filters</span>
            </Dropdown.Toggle>
            <Dropdown.Menu className="catalog-filter-menu catalog-more-filter-menu">
              <div className="catalog-filter-menu-header">
                <span>More filters</span>
              </div>

              <button
                type="button"
                onClick={() => onAccessSelect(accessValue === 'open_access' ? 'all' : 'open_access')}
                className={`catalog-toggle-row ${accessValue === 'open_access' ? 'is-active' : ''}`}
              >
                <Form.Check
                  type="switch"
                  checked={accessValue === 'open_access'}
                  readOnly
                  className="m-0"
                />
                <span>Only Open Access Journals</span>
              </button>

              <button
                type="button"
                onClick={() => onOaDiamondToggle && onOaDiamondToggle(!isOaDiamond)}
                className={`catalog-toggle-row ${isOaDiamond ? 'is-active' : ''}`}
              >
                <Form.Check
                  type="switch"
                  checked={isOaDiamond}
                  readOnly
                  className="m-0"
                />
                <span>Only OA Diamond</span>
              </button>
            </Dropdown.Menu>
          </Dropdown>
        </div>

        <form className="catalog-table-search-form" onSubmit={onSearchSubmit}>
          <FilterSearch
            value={searchInput}
            onChange={(event) => setSearchInput?.(event.target.value)}
            placeholder="Search in table"
            className="catalog-table-search"
            actionButton={null}
          />
        </form>
      </div>

      {activeChips.length > 0 && (
        <div className="catalog-selected-filters" aria-label="Selected catalog filters">
          {activeChips.map(chip => (
            <button
              key={chip.id}
              type="button"
              className="catalog-selected-filter-chip"
              onClick={chip.onClear}
            >
              <span>{chip.value}</span>
              <Icon icon="lucide:x" width="13" />
            </button>
          ))}

          <button type="button" onClick={onClearAll} className="catalog-clear-btn catalog-clear-inline">
            Clear filters
          </button>
        </div>
      )}
    </FilterCard>
  );
}
