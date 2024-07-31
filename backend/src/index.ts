import app from './app';
import logger from './utils/logger';
import './utils/loadEnv';
import { getClient, disconnect } from './services/db';

const port = process.env['PORT'] || 5000;

const startServer = async () => {
  try {
    logger.info('Connecting to database...');
    await getClient(); // Initialize the database client
    app.listen(port, () => {
      logger.info(`Listening: http://localhost:${port}`);
    });
  } catch (err) {
    logger.error('Failed to connect to database:', err);
    process.exit(1);
  }
};

startServer();

const shutdown = async () => {
  logger.info('Shutting down gracefully...');
  try {
    await disconnect(); // Close the database connection
  } catch (err) {
    logger.error('Error during disconnection:', err);
  } finally {
    process.exit(0);
  }
};

// Handle termination signals
process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);
