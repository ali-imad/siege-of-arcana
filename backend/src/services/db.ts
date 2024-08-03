import '../utils/loadEnv';
import { Pool, PoolClient, QueryResult } from 'pg';
import logger from '../utils/logger';

let pool: Pool | null = null;

export async function initPool(): Promise<void> {
  if (pool !== null) return;

  pool = new Pool({
    user: process.env['DB_USER'],
    host: process.env['DB_HOST'],
    database: process.env['DB_NAME'],
    password: process.env['DB_PASSWORD'],
    port: parseInt(process.env['DB_PORT'] || '5432'),
  });
}

// Name:    Query
// Purpose: Call a SQL query and return the resul
// Args:    q       - query string (parameterized using pg-format)
// Returns: resp    - result of query on db
export async function query(q: string): Promise<QueryResult> {
  if (!pool) await initPool();
  if (!pool) throw new Error('Could not initialize pool');

  let client: PoolClient | null = await pool.connect();
  if (!client) throw new Error('Could not connect to pool');

  try {
    logger.debug(`Query: ${q}`);
    const resp = await client.query(q);
    if (!resp) {
      logger.error(`Query failed: ${q}`);
    } else {
      logger.debug(`Query successful with ${resp.rowCount} rows`);
    }
    return resp;
  } finally {
    client.release();
  }
}

export function queryIsEmpty(res: QueryResult): boolean {
  return res.rowCount === 0;
}

export async function disconnect(): Promise<void> {
  if (!pool) return;
  await pool.end();
}
