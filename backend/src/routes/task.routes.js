import { Router } from 'express';
import { TaskController } from '../controllers/task.controller.js';
import { validateTaskPayload } from '../middleware/validate.js';

const router = Router();

// GET all tasks (supports query: search, status, priority, sortBy, sortOrder, page, limit)
router.get('/', TaskController.getAllTasks);

// POST reset demo tasks
router.post('/reset', TaskController.resetTasks);

// GET single task by ID
router.get('/:id', TaskController.getTaskById);

// POST create task
router.post('/', validateTaskPayload(false), TaskController.createTask);

// PUT update task
router.put('/:id', validateTaskPayload(true), TaskController.updateTask);

// DELETE task
router.delete('/:id', TaskController.deleteTask);

export default router;
