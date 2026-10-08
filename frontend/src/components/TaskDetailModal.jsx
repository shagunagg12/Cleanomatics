import React, { useState, useEffect } from 'react';
import { X, Edit2, Trash2, Copy, Check, Calendar, Clock } from 'lucide-react';
import { StatusBadge } from './StatusBadge.jsx';
import { PriorityBadge } from './PriorityBadge.jsx';
import { formatDate, formatDateTime, isOverdue } from '../utils/dateUtils.js';

export function TaskDetailModal({
  task,
  isOpen,
  onClose,
  onEdit,
  onDelete,
}) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !task) return null;

  const handleCopyId = () => {
    navigator.clipboard.writeText(task.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const overdue = isOverdue(task.dueDate, task.status);

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '620px' }}
      >
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span className="detail-meta-label">Task Details</span>
          </div>
          <button
            type="button"
            className="btn-icon"
            onClick={onClose}
            aria-label="Close dialog"
          >
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          {/* Status & Priority row */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <StatusBadge status={task.status} />
              <PriorityBadge priority={task.priority} />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <span className="detail-id-code" title={task.id}>
                {task.id.slice(0, 8)}...
              </span>
              <button
                type="button"
                className="btn-icon btn-sm"
                onClick={handleCopyId}
                title="Copy Full UUID"
              >
                {copied ? <Check size={12} style={{ color: '#16a34a' }} /> : <Copy size={12} />}
              </button>
            </div>
          </div>

          {/* Title */}
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-main)', lineHeight: 1.35 }}>
            {task.title}
          </h2>

          {/* Description */}
          <div>
            <div className="detail-meta-label" style={{ marginBottom: '0.35rem' }}>
              Description
            </div>
            <div className="detail-desc-box">
              {task.description}
            </div>
          </div>

          {/* Timestamps & Due date grid */}
          <div className="detail-meta-list">
            <div className="detail-meta-item">
              <span className="detail-meta-label">
                <Calendar size={12} style={{ display: 'inline', marginRight: '4px' }} />
                Due Date
              </span>
              <span
                className="detail-meta-value"
                style={{ color: overdue ? 'var(--danger)' : 'inherit' }}
              >
                {formatDate(task.dueDate)} {overdue ? '(Overdue)' : ''}
              </span>
            </div>

            <div className="detail-meta-item">
              <span className="detail-meta-label">
                <Clock size={12} style={{ display: 'inline', marginRight: '4px' }} />
                Created At
              </span>
              <span className="detail-meta-value">
                {formatDateTime(task.createdAt)}
              </span>
            </div>

            <div className="detail-meta-item">
              <span className="detail-meta-label">
                <Clock size={12} style={{ display: 'inline', marginRight: '4px' }} />
                Last Updated
              </span>
              <span className="detail-meta-value">
                {formatDateTime(task.updatedAt)}
              </span>
            </div>

            <div className="detail-meta-item">
              <span className="detail-meta-label">Full Task ID</span>
              <span className="detail-meta-value" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem' }}>
                {task.id}
              </span>
            </div>
          </div>
        </div>

        <div className="modal-footer" style={{ justifyContent: 'space-between' }}>
          <button
            type="button"
            className="btn btn-danger btn-sm"
            onClick={() => {
              onClose();
              onDelete(task);
            }}
          >
            <Trash2 size={14} />
            <span>Delete</span>
          </button>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
            >
              Close
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => {
                onClose();
                onEdit(task);
              }}
            >
              <Edit2 size={14} />
              <span>Edit Task</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
