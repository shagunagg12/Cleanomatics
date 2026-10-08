const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

/**
 * Handle API responses and throw structured errors
 */
async function handleResponse(response) {
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(data.message || `Request failed with status ${response.status}`);
    error.status = response.status;
    error.errors = data.errors || null;
    throw error;
  }
  return data;
}

export const taskApi = {
  /**
   * Fetch paginated and filtered tasks
   */
  async getTasks(params = {}) {
    const query = new URLSearchParams();
    if (params.search) query.set('search', params.search);
    if (params.status && params.status !== 'all') query.set('status', params.status);
    if (params.priority && params.priority !== 'all') query.set('priority', params.priority);
    if (params.sortBy) query.set('sortBy', params.sortBy);
    if (params.sortOrder) query.set('sortOrder', params.sortOrder);
    if (params.page) query.set('page', params.page);
    if (params.limit) query.set('limit', params.limit);

    const qs = query.toString();
    const url = `${BASE_URL}/tasks${qs ? `?${qs}` : ''}`;
    const response = await fetch(url);
    return handleResponse(response);
  },

  /**
   * Fetch single task by ID
   */
  async getTaskById(id) {
    const response = await fetch(`${BASE_URL}/tasks/${id}`);
    return handleResponse(response);
  },

  /**
   * Create task
   */
  async createTask(taskData) {
    const response = await fetch(`${BASE_URL}/tasks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(taskData),
    });
    return handleResponse(response);
  },

  /**
   * Update task
   */
  async updateTask(id, updateData) {
    const response = await fetch(`${BASE_URL}/tasks/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updateData),
    });
    return handleResponse(response);
  },

  /**
   * Delete task
   */
  async deleteTask(id) {
    const response = await fetch(`${BASE_URL}/tasks/${id}`, {
      method: 'DELETE',
    });
    return handleResponse(response);
  },

  /**
   * Reset store to initial seed tasks
   */
  async resetDemoTasks() {
    const response = await fetch(`${BASE_URL}/tasks/reset`, {
      method: 'POST',
    });
    return handleResponse(response);
  },
};
