import { Server } from 'http';
import app from './app';
import config from './app/config';

const port = config.port || 5000;

let server: Server;

async function main() {
  server = app.listen(port, () => {
    console.log(`Schedule Service Server Is Running On Port: ${port}`);
  });
}

main().catch((err) => {
  console.error('Error starting server:', err);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection detected, shutting down ...', err);
  if (server) {
    server.close(() => process.exit(1));
  } else {
    process.exit(1);
  }
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception detected, shutting down ...', err);
  process.exit(1);
});
