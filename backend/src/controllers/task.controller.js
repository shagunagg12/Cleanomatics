import { taskService } from '../services/task.service.js';
import { ApiResponse } from '../utils/apiResponse.js';

export class TaskController {
  /**
   * GET /api/tasks
   * Fetch all tasks with search, filter, sort, and pagination
   */
  static async getAllTasks(req, res, next) {
    try {
      const { tasks, pagination, stats } = await taskService.getAllTasks(req.query);
      return ApiResponse.success(res, tasks, 'Tasks retrieved successfully', 200, {
        pagination,
        stats,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/tasks/:id
   * Fetch a single task by ID
   */
  static async getTaskById(req, res, next) {
    try {
      const { id } = req.params;
      const task = await taskService.getTaskById(id);

      if (!task) {
        return ApiResponse.error(res, `Task with ID '${id}' not found`, 404);
      }

      return ApiResponse.success(res, task, 'Task retrieved successfully', 200);
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/tasks
   * Create a new task
   */
  static async createTask(req, res, next) {
    try {
      const newTask = await taskService.createTask(req.body);
      return ApiResponse.success(res, newTask, 'Task created successfully', 201);
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /api/tasks/:id
   * Update an existing task
   */
  static async updateTask(req, res, next) {
    try {
      const { id } = req.params;
      const updatedTask = await taskService.updateTask(id, req.body);

      if (!updatedTask) {
        return ApiResponse.error(res, `Task with ID '${id}' not found`, 404);
      }

      return ApiResponse.success(res, updatedTask, 'Task updated successfully', 200);
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /api/tasks/:id
   * Delete a task by ID
   */
  static async deleteTask(req, res, next) {
    try {
      const { id } = req.params;
      const deleted = await taskService.deleteTask(id);

      if (!deleted) {
        return ApiResponse.error(res, `Task with ID '${id}' not found`, 404);
      }

      return ApiResponse.success(res, { id }, 'Task deleted successfully', 200);
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/tasks/reset
   * Reset store to default seed tasks (helper for testing/demo)
   */
  static async resetTasks(req, res, next) {
    try {
      const tasks = await taskService.resetToSeedData();
      return ApiResponse.success(res, tasks, 'Task database reset to default demo tasks', 200);
    } catch (error) {
      next(error);
    }
  }
}
