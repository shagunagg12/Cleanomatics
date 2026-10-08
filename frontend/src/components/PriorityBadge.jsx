import React from 'react';

const PRIORITY_CONFIG = {
  low: {
    label: 'Low',
    className: 'badge-priority-low',
  },
  medium: {
    label: 'Medium',
    className: 'badge-priority-medium',
  },
  high: {
    label: 'High',
    className: 'badge-priority-high',
  },
};

export function PriorityBadge({ priority }) {
  const config = PRIORITY_CONFIG[priority] || {
    label: priority,
    className: 'badge-priority-low',
  };

  return (
    <span className={`badge ${config.className}`}>
      {config.label}
    </span>
  );
}
