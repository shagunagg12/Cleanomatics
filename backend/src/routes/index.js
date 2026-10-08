import { Router } from 'express';
import taskRoutes from './task.routes.js';

const router = Router();

// Health check endpoint
router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// Task resources
router.use('/tasks', taskRoutes);

export default router;
