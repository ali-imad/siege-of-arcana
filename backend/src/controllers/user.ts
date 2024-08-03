import { query } from '../services/db';
import format from 'pg-format';
import logger from '../utils/logger';

const RELATION_NAME = 'player';

export async function createUser(
  name: string,
  email: string,
  password: string,
): Promise<any | null> {
  const sql = format(
    'INSERT INTO %I (username, email, password, elo, totalXP) VALUES (%L, %L, %L, %L, %L) RETURNING playerID;',
    RELATION_NAME,
    name,
    email,
    password,
    0,
    0,
  );

  try {
    const rsp = await query(sql);
    if (rsp.rows && rsp.rows.length > 0) {
      return rsp.rows[0];
    } else {
      logger.error('User created but no playerID returned');
      return null;
    }
  } catch (err) {
    logger.error('Error executing query', err);
    return null;
  }
}

export async function getUserByID(playerID: number): Promise<any> {
  const sql = format(
    'SELECT * FROM %I WHERE playerID = %L;',
    RELATION_NAME,
    playerID,
  );
  const rsp = await query(sql);
  return rsp.rows.length > 0 ? rsp.rows[0] : null;
}

export async function getUserByName(username: string): Promise<any> {
  const sql = format(
    'SELECT * FROM %I WHERE username = %L;',
    RELATION_NAME,
    username,
  );
  const rsp = await query(sql);
  return rsp.rows.length > 0 ? rsp.rows[0] : null;
}

export async function getUserByEmail(email: string): Promise<any> {
  const sql = format(
    'SELECT * FROM %I WHERE email = %L;',
    RELATION_NAME,
    email,
  );
  const rsp = await query(sql);
  return rsp.rows.length > 0 ? rsp.rows[0] : null;
}

export async function updateUserByID(
  playerID: number,
  values: Record<string, string | number>,
): Promise<boolean> {
  const setClause = Object.entries(values)
    .map(([key, value]) => {
      if (typeof value === 'number') {
        value = Math.floor(value);
      }
      return format('%I = %L', key, value);
    })
    .join(', ');

  const sql = format(
    'UPDATE %I SET %s WHERE playerID = %L;',
    RELATION_NAME,
    setClause,
    playerID,
  );

  try {
    await query(sql);
    return true;
  } catch (err) {
    logger.error('Error updating user', err);
    return false;
  }
}

export async function deleteUserByID(playerID: number): Promise<boolean> {
  const sql = format(
    'DELETE FROM %I WHERE playerID = %L;',
    RELATION_NAME,
    playerID,
  );

  try {
    await query(sql);
    return true;
  } catch (err) {
    logger.error('Error deleting user', err);
    return false;
  }
}
