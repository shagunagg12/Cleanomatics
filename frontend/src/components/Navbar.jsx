import React from 'react';
import { Plus, Moon, Sun, RotateCcw, CheckSquare } from 'lucide-react';

export function Navbar({ theme, onToggleTheme, onOpenCreate, onResetData, isResetting }) {
  return (
    <header className="navbar">
      <div className="navbar-inner">
        <div className="brand">
          <div className="brand-icon">
            <CheckSquare size={16} />
          </div>
          <span>Cleanomatics</span>
          <span className="brand-badge">Tasks</span>
        </div>

        <div className="nav-actions">
          <button
            type="button"
            className="btn-icon"
            onClick={onResetData}
            title="Reset store to demo tasks"
            disabled={isResetting}
          >
            <RotateCcw size={16} className={isResetting ? 'animate-spin' : ''} />
          </button>

          <button
            type="button"
            className="btn-icon"
            onClick={onToggleTheme}
            title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </button>

          <button
            type="button"
            className="btn btn-primary"
            onClick={onOpenCreate}
            id="create-task-btn"
          >
            <Plus size={16} />
            <span>New Task</span>
          </button>
        </div>
      </div>
    </header>
  );
}
