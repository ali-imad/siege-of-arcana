import { query } from '../services/db';
import format from 'pg-format';
import logger from '../utils/logger';

const RELATION_NAME = 'match';


export async function createMatch(
  mode: string,
  map: string,
  statsIDs: number[],
): Promise<any | null> {
  const limitedStatsIDs = statsIDs.slice(0, 10);

  const statsIDColumns = limitedStatsIDs.map((_, index) => `statsID${index + 1}`).join(', ');

  const statsIDValues = limitedStatsIDs.map(id => format('%L', id)).join(', ');

  const sql = format(
    `INSERT INTO %I (mode, map, ${statsIDColumns}) VALUES (%L, %L, ${statsIDValues}) RETURNING matchID;`,
    'Match',
    mode,
    map,
  );

  try {
    const rsp = await query(sql);
    if (rsp.rows && rsp.rows.length > 0) {
      return rsp.rows[0];
    } else {
      logger.error('Match created but no matchID returned');
      return null;
    }
  } catch (err) {
    logger.error('Error executing query', err);
    return null;
  }
}

export async function getPlayerMatches(playerID: number): Promise<any | null> {
  const sql = `
    SELECT 
      m.matchID, 
      m.mode, 
      m.map, 
      ms.kills, 
      ms.deaths, 
      ms.assists, 
      ms.outcome 
    FROM 
      Match m 
    JOIN 
      MatchStats ms 
    ON 
      m.matchID = ms.matchID 
    WHERE 
      ms.playerID = ${playerID};
  `;

  try {
    const rsp = await query(sql);
    if (rsp.rows && rsp.rows.length > 0) {
      return rsp.rows;
    } else {
      logger.error('No matches found for player');
      return null;
    }
  } catch (err) {
    logger.error('Error executing query', err);
    return null;
  }
}