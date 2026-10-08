import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { PAGE_SIZE_OPTIONS } from '../utils/constants.js';

export function Pagination({
  pagination,
  onPageChange,
  onLimitChange,
}) {
  if (!pagination || pagination.total === 0) return null;

  const { total, page, limit, totalPages, hasNextPage, hasPrevPage } = pagination;
  const startItem = (page - 1) * limit + 1;
  const endItem = Math.min(page * limit, total);

  // Generate page numbers to display
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="pagination-container">
      <div className="pagination-info">
        Showing <strong>{startItem}</strong>–<strong>{endItem}</strong> of{' '}
        <strong>{total}</strong> tasks
        <span style={{ margin: '0 0.5rem', opacity: 0.5 }}>|</span>
        <span>Per page:</span>{' '}
        <select
          className="select-control"
          style={{
            display: 'inline-block',
            padding: '0.15rem 0.5rem',
            marginLeft: '0.25rem',
            fontSize: '0.8rem',
            height: '26px',
          }}
          value={limit}
          onChange={(e) => onLimitChange(Number(e.target.value))}
        >
          {PAGE_SIZE_OPTIONS.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </div>

      <div className="pagination-controls">
        <button
          type="button"
          className="page-btn"
          disabled={!hasPrevPage}
          onClick={() => onPageChange(page - 1)}
          aria-label="Previous Page"
          title="Previous Page"
        >
          <ChevronLeft size={16} />
        </button>

        {pageNumbers.map((p) => (
          <button
            key={p}
            type="button"
            className={`page-btn ${p === page ? 'active' : ''}`}
            onClick={() => onPageChange(p)}
          >
            {p}
          </button>
        ))}

        <button
          type="button"
          className="page-btn"
          disabled={!hasNextPage}
          onClick={() => onPageChange(page + 1)}
          aria-label="Next Page"
          title="Next Page"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
