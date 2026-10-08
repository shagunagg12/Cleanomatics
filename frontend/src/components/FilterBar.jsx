import React from 'react';
import {
  Search,
  X,
  ChevronDown,
  ArrowUp,
  ArrowDown,
  LayoutGrid,
  List,
} from 'lucide-react';
import {
  STATUS_OPTIONS,
  PRIORITY_OPTIONS,
  SORT_OPTIONS,
} from '../utils/constants.js';

export function FilterBar({
  searchInput,
  onSearchChange,
  status,
  onStatusChange,
  priority,
  onPriorityChange,
  sortBy,
  onSortByChange,
  sortOrder,
  onToggleSortOrder,
  viewMode,
  onViewModeChange,
  onResetFilters,
}) {
  const hasActiveFilters =
    searchInput.trim() !== '' ||
    status !== 'all' ||
    priority !== 'all' ||
    sortBy !== 'createdAt' ||
    sortOrder !== 'desc';

  return (
    <div className="toolbar-card">
      <div className="toolbar-row">
        {/* Search Input */}
        <div className="search-box-container">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Search by title or description..."
            value={searchInput}
            onChange={(e) => onSearchChange(e.target.value)}
            id="task-search-input"
          />
          {searchInput && (
            <button
              type="button"
              className="search-clear"
              onClick={() => onSearchChange('')}
              title="Clear search"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Filters and Sort */}
        <div className="filter-group">
          {/* Status Select */}
          <div className="select-wrapper">
            <select
              className="select-control"
              value={status}
              onChange={(e) => onStatusChange(e.target.value)}
              id="filter-status-select"
            >
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <ChevronDown size={14} className="select-caret" />
          </div>

          {/* Priority Select */}
          <div className="select-wrapper">
            <select
              className="select-control"
              value={priority}
              onChange={(e) => onPriorityChange(e.target.value)}
              id="filter-priority-select"
            >
              {PRIORITY_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <ChevronDown size={14} className="select-caret" />
          </div>

          {/* Sort By Select */}
          <div className="select-wrapper">
            <select
              className="select-control"
              value={sortBy}
              onChange={(e) => onSortByChange(e.target.value)}
              id="sort-by-select"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  Sort: {opt.label}
                </option>
              ))}
            </select>
            <ChevronDown size={14} className="select-caret" />
          </div>

          {/* Sort Direction Toggle */}
          <button
            type="button"
            className="btn btn-secondary btn-icon"
            onClick={onToggleSortOrder}
            title={sortOrder === 'asc' ? 'Ascending (click for descending)' : 'Descending (click for ascending)'}
            aria-label="Toggle sort order"
          >
            {sortOrder === 'asc' ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
          </button>

          {/* View Mode Toggle */}
          <div className="view-toggle">
            <button
              type="button"
              className={`view-toggle-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => onViewModeChange('grid')}
              title="Grid view"
              aria-label="Grid view"
            >
              <LayoutGrid size={16} />
            </button>
            <button
              type="button"
              className={`view-toggle-btn ${viewMode === 'table' ? 'active' : ''}`}
              onClick={() => onViewModeChange('table')}
              title="Table view"
              aria-label="Table view"
            >
              <List size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Active Filter Chips */}
      {hasActiveFilters && (
        <div className="active-filters-chips">
          <span style={{ color: 'var(--text-muted)' }}>Active filters:</span>
          {searchInput && (
            <span className="filter-chip">
              Search: "{searchInput}"
              <span className="filter-chip-remove" onClick={() => onSearchChange('')}>
                <X size={12} />
              </span>
            </span>
          )}
          {status !== 'all' && (
            <span className="filter-chip">
              Status: {status}
              <span className="filter-chip-remove" onClick={() => onStatusChange('all')}>
                <X size={12} />
              </span>
            </span>
          )}
          {priority !== 'all' && (
            <span className="filter-chip">
              Priority: {priority}
              <span className="filter-chip-remove" onClick={() => onPriorityChange('all')}>
                <X size={12} />
              </span>
            </span>
          )}
          {(sortBy !== 'createdAt' || sortOrder !== 'desc') && (
            <span className="filter-chip">
              Sort: {sortBy} ({sortOrder})
            </span>
          )}
          <button
            type="button"
            className="btn btn-ghost btn-sm"
            onClick={onResetFilters}
            style={{ fontSize: '0.75rem', padding: '0.1rem 0.4rem' }}
          >
            Reset all
          </button>
        </div>
      )}
    </div>
  );
}
