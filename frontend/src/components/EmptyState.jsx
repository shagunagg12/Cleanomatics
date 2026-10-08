import React from 'react';
import { SearchX, Inbox, Plus, RotateCcw } from 'lucide-react';

export function EmptyState({
  isFiltered,
  onResetFilters,
  onOpenCreate,
  onResetSeed,
}) {
  if (isFiltered) {
    return (
      <div className="empty-state">
        <SearchX className="empty-icon" />
        <h3 className="empty-title">No matching tasks found</h3>
        <p className="empty-subtitle">
          We couldn't find any tasks matching your active search or filters. Try adjusting your query or filters.
        </p>
        <button
          type="button"
          className="btn btn-secondary btn-sm"
          onClick={onResetFilters}
          style={{ marginTop: '0.5rem' }}
        >
          Clear all filters
        </button>
      </div>
    );
  }

  return (
    <div className="empty-state">
      <Inbox className="empty-icon" />
      <h3 className="empty-title">No tasks in your workspace</h3>
      <p className="empty-subtitle">
        Your task board is currently empty. Create your first task or load realistic demo data to get started.
      </p>
      <div style={{ display: 'flex', gap: '0.625rem', marginTop: '0.5rem' }}>
        <button
          type="button"
          className="btn btn-secondary btn-sm"
          onClick={onResetSeed}
        >
          <RotateCcw size={14} />
          <span>Load Demo Tasks</span>
        </button>
        <button
          type="button"
          className="btn btn-primary btn-sm"
          onClick={onOpenCreate}
        >
          <Plus size={14} />
          <span>Create Task</span>
        </button>
      </div>
    </div>
  );
}
