import React, { useState, useEffect, useCallback } from 'react';
import { Navbar } from './components/Navbar.jsx';
import { StatsSummary } from './components/StatsSummary.jsx';
import { FilterBar } from './components/FilterBar.jsx';
import { TaskCard } from './components/TaskCard.jsx';
import { TaskTable } from './components/TaskTable.jsx';
import { Pagination } from './components/Pagination.jsx';
import { TaskFormModal } from './components/TaskFormModal.jsx';
import { TaskDetailModal } from './components/TaskDetailModal.jsx';
import { DeleteConfirmModal } from './components/DeleteConfirmModal.jsx';
import { EmptyState } from './components/EmptyState.jsx';
import { SkeletonLoader } from './components/SkeletonLoader.jsx';
import { Toast } from './components/Toast.jsx';
import { taskApi } from './api/taskApi.js';
import { useDebounce } from './hooks/useDebounce.js';
import { useTheme } from './hooks/useTheme.js';
import { AlertCircle, RefreshCw } from 'lucide-react';

export default function App() {
  const { theme, toggleTheme } = useTheme();

  // Data & loading state
  const [tasks, setTasks] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [apiError, setApiError] = useState(null);

  // Filters & Controls
  const [searchInput, setSearchInput] = useState('');
  const debouncedSearch = useDebounce(searchInput, 300);
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(9);
  const [viewMode, setViewMode] = useState(() => {
    return localStorage.getItem('cleanomatics_view_mode') || 'grid';
  });

  // Modals state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedTaskForEdit, setSelectedTaskForEdit] = useState(null);
  const [selectedTaskForDetail, setSelectedTaskForDetail] = useState(null);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverErrors, setServerErrors] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  // Toast notifications
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info') => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 6);
    setToasts((prev) => [...prev, { id, message, type }]);
  }, []);

  const dismissToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Persist view mode
  const handleViewModeChange = (mode) => {
    setViewMode(mode);
    localStorage.setItem('cleanomatics_view_mode', mode);
  };

  // Reset page when filter or search changes
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, statusFilter, priorityFilter, sortBy, sortOrder]);

  // Fetch tasks
  const fetchTasks = useCallback(async () => {
    setIsLoading(true);
    setApiError(null);
    try {
      const response = await taskApi.getTasks({
        search: debouncedSearch,
        status: statusFilter,
        priority: priorityFilter,
        sortBy,
        sortOrder,
        page,
        limit,
      });

      setTasks(response.data || []);
      setPagination(response.meta?.pagination || null);
      setStats(response.meta?.stats || null);
    } catch (err) {
      console.error('Failed to fetch tasks:', err);
      setApiError(err.message || 'Unable to connect to the backend server.');
      addToast(err.message || 'Error loading tasks', 'error');
    } finally {
      setIsLoading(false);
    }
  }, [debouncedSearch, statusFilter, priorityFilter, sortBy, sortOrder, page, limit, addToast]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // Handler: Create or Update Task
  const handleFormSubmit = async (formData) => {
    setIsSubmitting(true);
    setServerErrors(null);

    try {
      if (selectedTaskForEdit) {
        // Edit mode
        const res = await taskApi.updateTask(selectedTaskForEdit.id, formData);
        addToast('Task updated successfully', 'success');
        setIsFormOpen(false);
        setSelectedTaskForEdit(null);

        // Update detail modal if open with the same task
        if (selectedTaskForDetail && selectedTaskForDetail.id === selectedTaskForEdit.id) {
          setSelectedTaskForDetail(res.data);
        }
      } else {
        // Create mode
        await taskApi.createTask(formData);
        addToast('Task created successfully', 'success');
        setIsFormOpen(false);
      }
      await fetchTasks();
    } catch (err) {
      console.error('Save task error:', err);
      if (err.errors) {
        setServerErrors(err.errors);
      } else {
        addToast(err.message || 'Failed to save task', 'error');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handler: Quick Status Update
  const handleQuickStatusChange = async (task, newStatus) => {
    try {
      await taskApi.updateTask(task.id, { status: newStatus });
      addToast(`Status updated to "${newStatus.replace('_', ' ')}"`, 'success');
      await fetchTasks();
      if (selectedTaskForDetail && selectedTaskForDetail.id === task.id) {
        setSelectedTaskForDetail((prev) => ({ ...prev, status: newStatus }));
      }
    } catch (err) {
      addToast(err.message || 'Failed to update status', 'error');
    }
  };

  // Handler: Delete Task
  const handleConfirmDelete = async (taskId) => {
    setIsDeleting(true);
    try {
      await taskApi.deleteTask(taskId);
      addToast('Task deleted successfully', 'success');
      setTaskToDelete(null);
      if (selectedTaskForDetail && selectedTaskForDetail.id === taskId) {
        setSelectedTaskForDetail(null);
      }
      await fetchTasks();
    } catch (err) {
      addToast(err.message || 'Failed to delete task', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  // Handler: Reset to Demo seed tasks
  const handleResetData = async () => {
    if (isResetting) return;
    setIsResetting(true);
    try {
      await taskApi.resetDemoTasks();
      addToast('Workspace restored to demo tasks', 'info');
      await fetchTasks();
    } catch (err) {
      addToast(err.message || 'Failed to reset demo data', 'error');
    } finally {
      setIsResetting(false);
    }
  };

  // Open Edit modal
  const handleOpenEdit = (task) => {
    setSelectedTaskForEdit(task);
    setIsFormOpen(true);
  };

  // Open Create modal
  const handleOpenCreate = () => {
    setSelectedTaskForEdit(null);
    setServerErrors(null);
    setIsFormOpen(true);
  };

  // Reset all filters
  const handleResetFilters = () => {
    setSearchInput('');
    setStatusFilter('all');
    setPriorityFilter('all');
    setSortBy('createdAt');
    setSortOrder('desc');
  };

  const isFiltered =
    searchInput.trim() !== '' ||
    statusFilter !== 'all' ||
    priorityFilter !== 'all' ||
    sortBy !== 'createdAt' ||
    sortOrder !== 'desc';

  return (
    <div className="app-container">
      {/* Top Navigation */}
      <Navbar
        theme={theme}
        onToggleTheme={toggleTheme}
        onOpenCreate={handleOpenCreate}
        onResetData={handleResetData}
        isResetting={isResetting}
      />

      {/* Main Content Area */}
      <main className="main-content">
        {/* Metric summary cards */}
        <StatsSummary
          stats={stats}
          currentStatus={statusFilter}
          onSelectStatus={(status) => setStatusFilter(status)}
        />

        {/* Filter, search, and sort toolbar */}
        <FilterBar
          searchInput={searchInput}
          onSearchChange={setSearchInput}
          status={statusFilter}
          onStatusChange={setStatusFilter}
          priority={priorityFilter}
          onPriorityChange={setPriorityFilter}
          sortBy={sortBy}
          onSortByChange={setSortBy}
          sortOrder={sortOrder}
          onToggleSortOrder={() => setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'))}
          viewMode={viewMode}
          onViewModeChange={handleViewModeChange}
          onResetFilters={handleResetFilters}
        />

        {/* Backend Connection Error Banner */}
        {apiError && (
          <div
            style={{
              padding: '1rem',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--danger-subtle)',
              border: '1px solid var(--danger-border)',
              color: 'var(--danger)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '1.25rem',
              gap: '1rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <AlertCircle size={18} />
              <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>
                {apiError} (Ensure backend server is running on port 5000)
              </span>
            </div>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={fetchTasks}
            >
              <RefreshCw size={14} />
              <span>Retry</span>
            </button>
          </div>
        )}

        {/* Main List / Grid Content */}
        {isLoading ? (
          <SkeletonLoader viewMode={viewMode} count={limit} />
        ) : tasks.length === 0 ? (
          <EmptyState
            isFiltered={isFiltered}
            onResetFilters={handleResetFilters}
            onOpenCreate={handleOpenCreate}
            onResetSeed={handleResetData}
          />
        ) : viewMode === 'table' ? (
          <TaskTable
            tasks={tasks}
            onViewDetails={(task) => setSelectedTaskForDetail(task)}
            onEdit={handleOpenEdit}
            onDelete={(task) => setTaskToDelete(task)}
          />
        ) : (
          <div className="task-grid">
            {tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onViewDetails={(t) => setSelectedTaskForDetail(t)}
                onEdit={handleOpenEdit}
                onDelete={(t) => setTaskToDelete(t)}
                onStatusChange={handleQuickStatusChange}
              />
            ))}
          </div>
        )}

        {/* Pagination controls */}
        {!isLoading && tasks.length > 0 && (
          <Pagination
            pagination={pagination}
            onPageChange={(newPage) => setPage(newPage)}
            onLimitChange={(newLimit) => {
              setLimit(newLimit);
              setPage(1);
            }}
          />
        )}
      </main>

      {/* Create / Edit Modal */}
      <TaskFormModal
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setSelectedTaskForEdit(null);
          setServerErrors(null);
        }}
        onSubmit={handleFormSubmit}
        initialData={selectedTaskForEdit}
        isSubmitting={isSubmitting}
        serverErrors={serverErrors}
      />

      {/* Task Details Modal */}
      <TaskDetailModal
        task={selectedTaskForDetail}
        isOpen={Boolean(selectedTaskForDetail)}
        onClose={() => setSelectedTaskForDetail(null)}
        onEdit={(task) => {
          setSelectedTaskForDetail(null);
          handleOpenEdit(task);
        }}
        onDelete={(task) => {
          setTaskToDelete(task);
        }}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        task={taskToDelete}
        isOpen={Boolean(taskToDelete)}
        onClose={() => setTaskToDelete(null)}
        onConfirm={handleConfirmDelete}
        isDeleting={isDeleting}
      />

      {/* Toast Notifications */}
      <Toast toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
