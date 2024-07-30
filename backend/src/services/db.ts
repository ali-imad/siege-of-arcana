import '../utils/loadEnv';
import { Pool, PoolClient, QueryResult } from 'pg';
import logger from '../utils/logger';

let client: PoolClient | null = null;
const pool = new Pool({
  user: process.env['DB_USER'],
  host: process.env['DB_HOST'],
  database: process.env['DB_NAME'],
  password: process.env['DB_PASSWORD'],
  port: parseInt(process.env['DB_PORT'] || '5432'),
});

export const query = async (text: string): Promise<QueryResult> => {
  if (!client) {
    throw new Error('No client');
  }

  const resp = await client.query(text);
  logger.debug(`Query: ${text}`);
  if (!resp) {
    logger.error(`Query failed: ${text}`);
    client.release();
    throw new Error('Query failed');
  } else {
    logger.debug(`Query successful with ${resp.rowCount} rows`);
  }
  return resp;
};

export const getClient = async () => {
  client = await pool.connect();
};

export const disconnect = async (): Promise<void> => {
  await pool.end();
};
