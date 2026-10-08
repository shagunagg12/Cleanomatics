import app from './app.js';
import { config } from './config/index.js';

const server = app.listen(config.port, () => {
  console.log(`===============================================`);
  console.log(`🚀 Cleanomatics Task Server running on port ${config.port}`);
  console.log(`📡 Base API URL: http://localhost:${config.port}/api`);
  console.log(`📖 Swagger Docs: http://localhost:${config.port}/api/docs`);
  console.log(`🩺 Health Check: http://localhost:${config.port}/api/health`);
  console.log(`===============================================`);
});

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
  });
});
