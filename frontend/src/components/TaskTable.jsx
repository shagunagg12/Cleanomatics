import React from 'react';
import { Eye, Edit2, Trash2, Calendar, AlertCircle } from 'lucide-react';
import { StatusBadge } from './StatusBadge.jsx';
import { PriorityBadge } from './PriorityBadge.jsx';
import { formatDate, isOverdue } from '../utils/dateUtils.js';

export function TaskTable({
  tasks,
  onViewDetails,
  onEdit,
  onDelete,
}) {
  return (
    <div className="table-container">
      <table className="task-table">
        <thead>
          <tr>
            <th>Task</th>
            <th>Status</th>
            <th>Priority</th>
            <th>Due Date</th>
            <th>Created</th>
            <th style={{ textAlign: 'right' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => {
            const overdue = isOverdue(task.dueDate, task.status);
            return (
              <tr key={task.id}>
                <td className="table-title-cell">
                  <div
                    className="table-title"
                    onClick={() => onViewDetails(task)}
                    title="Click to view details"
                  >
                    {task.title}
                  </div>
                  <div className="table-desc-preview">{task.description}</div>
                </td>
                <td>
                  <StatusBadge status={task.status} />
                </td>
                <td>
                  <PriorityBadge priority={task.priority} />
                </td>
                <td>
                  <div
                    className={`task-due-date ${overdue ? 'overdue' : ''}`}
                    style={{ fontSize: '0.8rem' }}
                  >
                    {overdue ? <AlertCircle size={12} /> : <Calendar size={12} />}
                    <span>{formatDate(task.dueDate)}</span>
                  </div>
                </td>
                <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  {formatDate(task.createdAt)}
                </td>
                <td>
                  <div
                    className="task-card-actions"
                    style={{ justifyContent: 'flex-end' }}
                  >
                    <button
                      type="button"
                      className="btn-icon"
                      onClick={() => onViewDetails(task)}
                      title="View Details"
                    >
                      <Eye size={14} />
                    </button>
                    <button
                      type="button"
                      className="btn-icon"
                      onClick={() => onEdit(task)}
                      title="Edit Task"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button
                      type="button"
                      className="btn-icon"
                      style={{ color: 'var(--danger)' }}
                      onClick={() => onDelete(task)}
                      title="Delete Task"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
