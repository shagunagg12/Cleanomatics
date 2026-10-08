/**
 * Format date string to readable format e.g. "Oct 15, 2026"
 */
export function formatDate(dateString) {
  if (!dateString) return 'No due date';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return 'Invalid date';

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
}

/**
 * Format full date timestamp e.g. "Oct 15, 2026, 04:30 PM"
 */
export function formatDateTime(dateString) {
  if (!dateString) return '—';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '—';

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(date);
}

/**
 * Check if a due date is in the past (overdue) and not completed
 */
export function isOverdue(dueDate, status) {
  if (!dueDate || status === 'completed') return false;
  const due = new Date(dueDate);
  const now = new Date();
  // Set to end of due date day
  due.setHours(23, 59, 59, 999);
  return due < now;
}

/**
 * Convert ISO date to YYYY-MM-DD for date input
 */
export function toInputDate(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '';
  return date.toISOString().split('T')[0];
}
