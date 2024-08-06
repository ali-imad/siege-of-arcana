import format from 'pg-format';
import { query } from '../services/db';
import logger from '../utils/logger';

// get all columns from a relation
export async function getColumnNames(relation: string): Promise<string[]> {
  const sql = format(
    'SELECT column_name FROM information_schema.columns WHERE table_name = %L;',
    relation,
  );
  const rsp = await query(sql);
  const retArr: string[] = [];
  rsp.rows.forEach(row => {
    logger.debug(`Got row: ${JSON.stringify(row)}`);
    retArr.push(row.column_name);
  });
  return retArr;
}

// get all relation names
export async function getRelations(): Promise<string[]> {
  const sql = format(
    'SELECT table_name FROM information_schema.tables WHERE table_schema = %L;',
    'public',
  );
  const rsp = await query(sql);
  const retArr: string[] = [];
  rsp.rows.forEach(row => {
    logger.debug(`Got row: ${JSON.stringify(row)}`);
    retArr.push(row.table_name);
  });
  return retArr;
}

export async function projectSelect(
  relation: string,
  columns: string[],
): Promise<object[]> {
  const sql = format('SELECT %I FROM %I;', columns, relation);
  const rsp = await query(sql);
  if (!rsp.rows) {
    logger.warn('No rows returned from query');
  }
  return rsp.rows;
}
