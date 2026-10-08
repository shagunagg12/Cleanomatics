import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export function Toast({ toasts, onDismiss }) {
  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  );
}

function ToastItem({ toast, onDismiss }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss(toast.id);
    }, toast.duration || 4000);

    return () => clearTimeout(timer);
  }, [toast, onDismiss]);

  const icons = {
    success: <CheckCircle2 size={18} style={{ color: '#16a34a', flexShrink: 0 }} />,
    error: <AlertCircle size={18} style={{ color: 'var(--danger)', flexShrink: 0 }} />,
    info: <Info size={18} style={{ color: 'var(--primary)', flexShrink: 0 }} />,
  };

  return (
    <div className={`toast toast-${toast.type || 'info'}`}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
        {icons[toast.type] || icons.info}
        <span className="toast-message">{toast.message}</span>
      </div>
      <button
        type="button"
        className="btn-icon btn-sm"
        onClick={() => onDismiss(toast.id)}
        aria-label="Dismiss toast"
        style={{ border: 'none', background: 'transparent', padding: '2px' }}
      >
        <X size={14} />
      </button>
    </div>
  );
}
