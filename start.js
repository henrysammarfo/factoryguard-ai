const { spawn } = require('child_process');
const path = require('path');

// Set the PORT environment variable if not already set
if (!process.env.PORT) {
  process.env.PORT = '10000';
}

console.log(`[FactoryGuard] Starting production server on port ${process.env.PORT}`);

// Start the production server
const server = spawn('npm', ['run', 'server:prod'], {
  cwd: process.cwd(),
  stdio: 'inherit',
  env: { ...process.env }
});

server.on('error', (error) => {
  console.error('[FactoryGuard] Failed to start server:', error);
  process.exit(1);
});

server.on('close', (code) => {
  console.log(`[FactoryGuard] Server process exited with code ${code}`);
  process.exit(code);
});

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('[FactoryGuard] Received SIGTERM, shutting down gracefully');
  server.kill('SIGTERM');
});

process.on('SIGINT', () => {
  console.log('[FactoryGuard] Received SIGINT, shutting down gracefully');
  server.kill('SIGINT');
});
