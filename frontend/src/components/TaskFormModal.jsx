import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { STATUS_FORM_OPTIONS, PRIORITY_FORM_OPTIONS } from '../utils/constants.js';
import { toInputDate } from '../utils/dateUtils.js';

export function TaskFormModal({
  isOpen,
  onClose,
  onSubmit,
  initialData = null, // if present, Edit mode; otherwise, Create mode
  isSubmitting = false,
  serverErrors = null,
}) {
  const isEdit = Boolean(initialData);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'pending',
    priority: 'medium',
    dueDate: '',
  });

  const [clientErrors, setClientErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        description: initialData.description || '',
        status: initialData.status || 'pending',
        priority: initialData.priority || 'medium',
        dueDate: toInputDate(initialData.dueDate),
      });
    } else {
      setFormData({
        title: '',
        description: '',
        status: 'pending',
        priority: 'medium',
        dueDate: '',
      });
    }
    setClientErrors({});
  }, [initialData, isOpen]);

  // Handle ESC key to close
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const validate = () => {
    const errors = {};
    if (!formData.title.trim()) {
      errors.title = 'Title is required.';
    } else if (formData.title.trim().length > 150) {
      errors.title = 'Title must be 150 characters or less.';
    }

    if (!formData.description.trim()) {
      errors.description = 'Description is required.';
    } else if (formData.description.trim().length > 2000) {
      errors.description = 'Description must be 2000 characters or less.';
    }

    setClientErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    onSubmit({
      title: formData.title.trim(),
      description: formData.description.trim(),
      status: formData.status,
      priority: formData.priority,
      dueDate: formData.dueDate ? formData.dueDate : null,
    });
  };

  // Merge errors (client-side prioritized, then backend serverErrors)
  const titleError = clientErrors.title || serverErrors?.title;
  const descError = clientErrors.description || serverErrors?.description;
  const statusError = clientErrors.status || serverErrors?.status;
  const priorityError = clientErrors.priority || serverErrors?.priority;
  const dueDateError = clientErrors.dueDate || serverErrors?.dueDate;

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h2 className="modal-title">
            {isEdit ? 'Edit Task' : 'Create New Task'}
          </h2>
          <button
            type="button"
            className="btn-icon"
            onClick={onClose}
            aria-label="Close dialog"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {/* Title field */}
            <div className="form-group">
              <label className="form-label" htmlFor="task-title-input">
                <span>
                  Title <span className="form-label-required">*</span>
                </span>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                  {formData.title.length}/150
                </span>
              </label>
              <input
                id="task-title-input"
                type="text"
                className={`form-input ${titleError ? 'has-error' : ''}`}
                placeholder="e.g. Implement user authentication flow"
                value={formData.title}
                maxLength={150}
                onChange={(e) => {
                  setFormData({ ...formData, title: e.target.value });
                  if (clientErrors.title) {
                    setClientErrors({ ...clientErrors, title: null });
                  }
                }}
                autoFocus
              />
              {titleError && <span className="form-error">{titleError}</span>}
            </div>

            {/* Description field */}
            <div className="form-group">
              <label className="form-label" htmlFor="task-desc-input">
                <span>
                  Description <span className="form-label-required">*</span>
                </span>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                  {formData.description.length}/2000
                </span>
              </label>
              <textarea
                id="task-desc-input"
                rows={4}
                className={`form-textarea ${descError ? 'has-error' : ''}`}
                placeholder="Detailed specifications, acceptance criteria, or context..."
                value={formData.description}
                maxLength={2000}
                onChange={(e) => {
                  setFormData({ ...formData, description: e.target.value });
                  if (clientErrors.description) {
                    setClientErrors({ ...clientErrors, description: null });
                  }
                }}
              />
              {descError && <span className="form-error">{descError}</span>}
            </div>

            {/* Status & Priority Row */}
            <div className="form-row-2">
              <div className="form-group">
                <label className="form-label" htmlFor="task-status-select">
                  Status
                </label>
                <select
                  id="task-status-select"
                  className={`form-select ${statusError ? 'has-error' : ''}`}
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                >
                  {STATUS_FORM_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                {statusError && <span className="form-error">{statusError}</span>}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="task-priority-select">
                  Priority
                </label>
                <select
                  id="task-priority-select"
                  className={`form-select ${priorityError ? 'has-error' : ''}`}
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                >
                  {PRIORITY_FORM_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                {priorityError && <span className="form-error">{priorityError}</span>}
              </div>
            </div>

            {/* Due Date field */}
            <div className="form-group">
              <label className="form-label" htmlFor="task-due-date-input">
                Due Date (Optional)
              </label>
              <input
                id="task-due-date-input"
                type="date"
                className={`form-input ${dueDateError ? 'has-error' : ''}`}
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
              />
              {dueDateError && <span className="form-error">{dueDateError}</span>}
            </div>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
              id="submit-task-btn"
            >
              {isSubmitting ? 'Saving...' : isEdit ? 'Save Changes' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
