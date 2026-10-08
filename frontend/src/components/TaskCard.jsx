import React from 'react';
import { Calendar, Eye, Edit2, Trash2, AlertCircle } from 'lucide-react';
import { StatusBadge } from './StatusBadge.jsx';
import { PriorityBadge } from './PriorityBadge.jsx';
import { formatDate, isOverdue } from '../utils/dateUtils.js';

export function TaskCard({
  task,
  onViewDetails,
  onEdit,
  onDelete,
  onStatusChange,
}) {
  const overdue = isOverdue(task.dueDate, task.status);

  return (
    <div className="task-card" data-task-id={task.id}>
      <div>
        <div className="task-card-header">
          <div className="task-badges">
            <StatusBadge status={task.status} />
            <PriorityBadge priority={task.priority} />
          </div>
          {/* Quick status dropdown */}
          <div className="select-wrapper">
            <select
              className="select-control"
              style={{
                fontSize: '0.725rem',
                padding: '0.15rem 1.25rem 0.15rem 0.4rem',
                height: '24px',
              }}
              value={task.status}
              onChange={(e) => onStatusChange(task, e.target.value)}
              title="Quickly change status"
            >
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>

        <h3
          className="task-title"
          onClick={() => onViewDetails(task)}
          title="Click to view details"
        >
          {task.title}
        </h3>

        <p className="task-description" style={{ marginTop: '0.4rem' }}>
          {task.description}
        </p>
      </div>

      <div className="task-card-meta">
        <div className={`task-due-date ${overdue ? 'overdue' : ''}`}>
          {overdue ? <AlertCircle size={13} /> : <Calendar size={13} />}
          <span>{formatDate(task.dueDate)}</span>
          {overdue && <span style={{ fontSize: '0.7rem' }}>(Overdue)</span>}
        </div>

        <div className="task-card-actions">
          <button
            type="button"
            className="btn-icon"
            onClick={() => onViewDetails(task)}
            title="View Details"
            aria-label={`View details for ${task.title}`}
          >
            <Eye size={14} />
          </button>
          <button
            type="button"
            className="btn-icon"
            onClick={() => onEdit(task)}
            title="Edit Task"
            aria-label={`Edit ${task.title}`}
          >
            <Edit2 size={14} />
          </button>
          <button
            type="button"
            className="btn-icon"
            style={{ color: 'var(--danger)' }}
            onClick={() => onDelete(task)}
            title="Delete Task"
            aria-label={`Delete ${task.title}`}
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
