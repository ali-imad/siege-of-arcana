import { query } from '../services/db';
import format from 'pg-format';
import logger from '../utils/logger';
import { PLAYER_RELATION } from '../interfaces/relations';

export async function createUser(
  name: string,
  email: string,
  password: string,
): Promise<any | null> {
  const sql = format(
    'INSERT INTO %I (username, email, password, elo, totalXP) VALUES (%L, %L, %L, %L, %L) RETURNING playerID;',
    PLAYER_RELATION,
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
    PLAYER_RELATION,
    playerID,
  );
  const rsp = await query(sql);
  return rsp.rows.length > 0 ? rsp.rows[0] : null;
}

export async function getUserByNameAndPassword(username: string, password: string): Promise<any> {
  const sql = format(
    'SELECT * FROM %I WHERE username = %L AND password = %L;',
    PLAYER_RELATION,
    username,
    password
  );
  const rsp = await query(sql);
  return rsp.rows.length > 0 ? rsp.rows[0] : null;
}

export async function getUserByEmailAndPassword(email: string, password: string): Promise<any> {
  const sql = format(
    'SELECT * FROM %I WHERE email = %L AND password = %L;',
    PLAYER_RELATION,
    email,
    password
  );
  const rsp = await query(sql);
  return rsp.rows.length > 0 ? rsp.rows[0] : null;
}

export async function getUserRank(elo: number): Promise<any> {
  const sql = format(
    'SELECT * FROM PlayerRank WHERE elo = %L',
     elo
  );
  const rsp = await query(sql);
  return rsp.rows.length > 0 ? rsp.rows[0] : null;
}

export async function getUserLevel(totalXP: number): Promise<any> {
  const remainder = totalXP % 1000;
  const earnedXP = totalXP - remainder;
  const sql = format(
    'SELECT * FROM PlayerLevel WHERE xp = %L',
    earnedXP
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
    PLAYER_RELATION,
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
    PLAYER_RELATION,
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

export async function getPlayerPerformanceAnalysis(playerID: number): Promise<any> {
  const sql = format(`
    WITH OverallAverages AS (
      SELECT 
        m.mode,
        AVG(ms.kills) as avg_overall_kills,
        AVG(ms.deaths) as avg_overall_deaths,
        AVG(ms.assists) as avg_overall_assists
      FROM MatchStats ms
      JOIN Match m ON ms.matchID = m.matchID
      GROUP BY m.mode
    )
    SELECT 
      m.mode,
      AVG(ms.kills) as avg_player_kills,
      AVG(ms.deaths) as avg_player_deaths,
      AVG(ms.assists) as avg_player_assists,
      oa.avg_overall_kills,
      oa.avg_overall_deaths,
      oa.avg_overall_assists
    FROM MatchStats ms
    JOIN Match m ON ms.matchID = m.matchID
    JOIN OverallAverages oa ON m.mode = oa.mode
    WHERE ms.playerID = %L
    GROUP BY m.mode, oa.avg_overall_kills, oa.avg_overall_deaths, oa.avg_overall_assists
    ORDER BY m.mode;
  `, 
  playerID);

  try {
    const rsp = await query(sql);
    if (rsp.rows && rsp.rows.length > 0) {
      return rsp.rows;
    } else {
      logger.error('User created but no playerID returned');
      return null;
    }
  } catch (err) {
    logger.error('Error executing query', err);
    return null;
  }
  
}
