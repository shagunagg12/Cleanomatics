import React from 'react';

export function SkeletonLoader({ viewMode = 'grid', count = 6 }) {
  if (viewMode === 'table') {
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
            {Array.from({ length: count }).map((_, i) => (
              <tr key={i}>
                <td>
                  <div className="skeleton-line" style={{ width: '60%', marginBottom: '6px' }} />
                  <div className="skeleton-line" style={{ width: '85%', height: '10px' }} />
                </td>
                <td><div className="skeleton-line" style={{ width: '70px', height: '22px', borderRadius: '12px' }} /></td>
                <td><div className="skeleton-line" style={{ width: '60px', height: '22px', borderRadius: '12px' }} /></td>
                <td><div className="skeleton-line" style={{ width: '80px' }} /></td>
                <td><div className="skeleton-line" style={{ width: '75px' }} /></td>
                <td><div className="skeleton-line" style={{ width: '60px', marginLeft: 'auto' }} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div className="task-grid">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="skeleton-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: '6px' }}>
              <div className="skeleton-line" style={{ width: '70px', height: '22px', borderRadius: '12px' }} />
              <div className="skeleton-line" style={{ width: '60px', height: '22px', borderRadius: '12px' }} />
            </div>
            <div className="skeleton-line" style={{ width: '50px', height: '22px' }} />
          </div>
          <div className="skeleton-line" style={{ width: '80%', height: '18px', marginTop: '4px' }} />
          <div className="skeleton-line" style={{ width: '100%', height: '12px' }} />
          <div className="skeleton-line" style={{ width: '90%', height: '12px' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '12px', paddingTop: '10px', borderTop: '1px solid var(--border-color)' }}>
            <div className="skeleton-line" style={{ width: '75px' }} />
            <div className="skeleton-line" style={{ width: '65px' }} />
          </div>
        </div>
      ))}
    </div>
  );
}
