import React from 'react';
import { ListTodo, Clock, PlayCircle, CheckCircle2 } from 'lucide-react';

export function StatsSummary({ stats, currentStatus, onSelectStatus }) {
  if (!stats) return null;

  const items = [
    {
      key: 'all',
      label: 'All Tasks',
      value: stats.total || 0,
      icon: <ListTodo size={16} className="text-muted" />,
      color: 'inherit',
    },
    {
      key: 'pending',
      label: 'Pending',
      value: stats.pending || 0,
      icon: <Clock size={16} style={{ color: '#d97706' }} />,
    },
    {
      key: 'in_progress',
      label: 'In Progress',
      value: stats.in_progress || 0,
      icon: <PlayCircle size={16} style={{ color: '#2563eb' }} />,
    },
    {
      key: 'completed',
      label: 'Completed',
      value: stats.completed || 0,
      icon: <CheckCircle2 size={16} style={{ color: '#16a34a' }} />,
    },
  ];

  return (
    <div className="stats-grid">
      {items.map((item) => {
        const isActive = currentStatus === item.key;
        return (
          <div
            key={item.key}
            className="stat-card"
            style={{
              cursor: 'pointer',
              borderColor: isActive ? 'var(--primary)' : 'var(--border-color)',
              background: isActive ? 'var(--primary-subtle)' : 'var(--bg-surface)',
            }}
            onClick={() => onSelectStatus(item.key)}
            title={`Filter by ${item.label}`}
          >
            <div className="stat-label">
              <span>{item.label}</span>
              {item.icon}
            </div>
            <div className="stat-value">{item.value}</div>
          </div>
        );
      })}
    </div>
  );
}
