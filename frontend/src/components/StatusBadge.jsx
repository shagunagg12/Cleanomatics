import React from 'react';

const STATUS_CONFIG = {
  pending: {
    label: 'Pending',
    className: 'badge-status-pending',
  },
  in_progress: {
    label: 'In Progress',
    className: 'badge-status-in_progress',
  },
  completed: {
    label: 'Completed',
    className: 'badge-status-completed',
  },
};

export function StatusBadge({ status }) {
  const config = STATUS_CONFIG[status] || {
    label: status,
    className: 'badge-status-pending',
  };

  return (
    <span className={`badge ${config.className}`}>
      <span className="badge-dot" />
      {config.label}
    </span>
  );
}
