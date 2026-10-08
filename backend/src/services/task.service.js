import crypto from 'crypto';
import { initialSeedTasks } from '../utils/seedData.js';

class TaskService {
  constructor() {
    // In-memory task store initialized with realistic seed tasks
    this.tasks = JSON.parse(JSON.stringify(initialSeedTasks));
  }

  /**
   * Priority hierarchy rank for sorting
   */
  static PRIORITY_WEIGHTS = {
    high: 3,
    medium: 2,
    low: 1,
  };

  /**
   * Retrieve filtered, searched, sorted, and paginated tasks
   */
  async getAllTasks(queryParams = {}) {
    let {
      search = '',
      status = 'all',
      priority = 'all',
      sortBy = 'createdAt',
      sortOrder = 'desc',
      page = 1,
      limit = 10,
    } = queryParams;

    let filtered = [...this.tasks];

    // 1. Text Search (title & description)
    if (search && search.trim() !== '') {
      const query = search.trim().toLowerCase();
      filtered = filtered.filter(
        (task) =>
          task.title.toLowerCase().includes(query) ||
          task.description.toLowerCase().includes(query)
      );
    }

    // 2. Status Filter
    if (status && status !== 'all') {
      filtered = filtered.filter((task) => task.status === status);
    }

    // 3. Priority Filter
    if (priority && priority !== 'all') {
      filtered = filtered.filter((task) => task.priority === priority);
    }

    // 4. Sorting
    const isAsc = sortOrder.toLowerCase() === 'asc';
    filtered.sort((a, b) => {
      if (sortBy === 'priority') {
        const weightA = TaskService.PRIORITY_WEIGHTS[a.priority] || 0;
        const weightB = TaskService.PRIORITY_WEIGHTS[b.priority] || 0;
        return isAsc ? weightA - weightB : weightB - weightA;
      }

      if (sortBy === 'dueDate') {
        const dateA = a.dueDate ? new Date(a.dueDate).getTime() : isAsc ? Infinity : -Infinity;
        const dateB = b.dueDate ? new Date(b.dueDate).getTime() : isAsc ? Infinity : -Infinity;
        return isAsc ? dateA - dateB : dateB - dateA;
      }

      if (sortBy === 'title') {
        return isAsc
          ? a.title.localeCompare(b.title)
          : b.title.localeCompare(a.title);
      }

      // Default: createdAt
      const timeA = new Date(a.createdAt).getTime();
      const timeB = new Date(b.createdAt).getTime();
      return isAsc ? timeA - timeB : timeB - timeA;
    });

    const total = filtered.length;
    const parsedPage = Math.max(1, parseInt(page, 10) || 1);
    const parsedLimit = Math.max(1, parseInt(limit, 10) || 10);
    const totalPages = Math.ceil(total / parsedLimit) || 1;

    // Apply pagination slice
    const startIndex = (parsedPage - 1) * parsedLimit;
    const paginatedTasks = filtered.slice(startIndex, startIndex + parsedLimit);

    // Compute status overview for dashboard stats
    const stats = {
      total: this.tasks.length,
      pending: this.tasks.filter((t) => t.status === 'pending').length,
      in_progress: this.tasks.filter((t) => t.status === 'in_progress').length,
      completed: this.tasks.filter((t) => t.status === 'completed').length,
    };

    return {
      tasks: paginatedTasks,
      pagination: {
        total,
        page: parsedPage,
        limit: parsedLimit,
        totalPages,
        hasNextPage: parsedPage < totalPages,
        hasPrevPage: parsedPage > 1,
      },
      stats,
    };
  }

  /**
   * Retrieve a single task by ID
   */
  async getTaskById(id) {
    return this.tasks.find((task) => task.id === id) || null;
  }

  /**
   * Create a new task
   */
  async createTask(taskData) {
    const {
      title,
      description,
      status = 'pending',
      priority = 'medium',
      dueDate = null,
    } = taskData;

    const now = new Date().toISOString();
    const newTask = {
      id: crypto.randomUUID(),
      title: title.trim(),
      description: description.trim(),
      status,
      priority,
      dueDate: dueDate || null,
      createdAt: now,
      updatedAt: now,
    };

    this.tasks.unshift(newTask);
    return newTask;
  }

  /**
   * Update an existing task
   */
  async updateTask(id, updateData) {
    const taskIndex = this.tasks.findIndex((task) => task.id === id);
    if (taskIndex === -1) {
      return null;
    }

    const currentTask = this.tasks[taskIndex];
    const updatedTask = {
      ...currentTask,
      ...(updateData.title !== undefined && { title: updateData.title.trim() }),
      ...(updateData.description !== undefined && { description: updateData.description.trim() }),
      ...(updateData.status !== undefined && { status: updateData.status }),
      ...(updateData.priority !== undefined && { priority: updateData.priority }),
      ...(updateData.dueDate !== undefined && { dueDate: updateData.dueDate || null }),
      updatedAt: new Date().toISOString(),
    };

    this.tasks[taskIndex] = updatedTask;
    return updatedTask;
  }

  /**
   * Delete a task by ID
   */
  async deleteTask(id) {
    const taskIndex = this.tasks.findIndex((task) => task.id === id);
    if (taskIndex === -1) {
      return false;
    }

    this.tasks.splice(taskIndex, 1);
    return true;
  }

  /**
   * Reset store to initial seed data (useful for demo/testing)
   */
  async resetToSeedData() {
    this.tasks = JSON.parse(JSON.stringify(initialSeedTasks));
    return this.tasks;
  }
}

export const taskService = new TaskService();
