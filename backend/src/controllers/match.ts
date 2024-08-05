import { query, queryIsEmpty } from '../services/db';
import format from 'pg-format';
import logger from '../utils/logger';

const MATCH_RELATION = 'match';
const STATS_RELATION = 'matchstats';

export async function createMatch(
  mode: string,
  map: string,
  statsIDs: number[],
): Promise<any | null> {
  const limitedStatsIDs = statsIDs.slice(0, 10);

  const statsIDColumns = limitedStatsIDs
    .map((_, index) => `statsID${index + 1}`)
    .join(', ');

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
  const sql = format(
    `
    SELECT 
      m.matchID, 
      m.mode, 
      m.map, 
      ms.kills, 
      ms.deaths, 
      ms.assists, 
      ms.outcome 
    FROM 
       %L m 
    JOIN 
      %L ms 
    ON 
      m.matchID = ms.matchID 
    WHERE 
      ms.playerID = %L;
  `,
    MATCH_RELATION,
    STATS_RELATION,
    playerID,
  );

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

const WIN_STR = 'Win';
const LOSS_STR = 'Loss';
const SMURF_THRESHOLD = 0.6;

export async function getPlayerIsSmurf(
  playerID: number,
): Promise<{ isSmurf: boolean; winRatio: number } | null> {
  // determine if a player has 60% winrate using HAVING
  const sql = format(
    `
 SELECT 
    playerID, 
    CAST(COUNT(CASE WHEN outcome = %L THEN 1 END) AS FLOAT) / NULLIF(COUNT(CASE WHEN outcome IN (%L, %L) THEN 1 END), 0) as win_ratio
FROM 
    %I
WHERE
    playerID = %L
GROUP BY 
    playerID
HAVING 
    CAST(COUNT(CASE WHEN outcome = %L THEN 1 END) AS FLOAT) / NULLIF(COUNT(CASE WHEN outcome IN (%L, %L) THEN 1 END), 0) > %L
ORDER BY 
    win_ratio DESC; 
  `,
    WIN_STR,
    WIN_STR,
    LOSS_STR,
    STATS_RELATION,
    playerID,
    WIN_STR,
    WIN_STR,
    LOSS_STR,
    SMURF_THRESHOLD,
  );

  const rsp = await query(sql);
  if (queryIsEmpty(rsp)) {
    return { isSmurf: false, winRatio: 0 };
  }
  return { isSmurf: !queryIsEmpty(rsp), winRatio: rsp.rows[0]?.win_ratio };
}

export async function getPlayerOutcome(
  playerID: number,
  outcome: string,
): Promise<object[] | null> {
  let sql;
  if (outcome === 'all') {
    // get all player outcomes with GROUP BY
    sql = format(
      `
      SELECT 
        playerID, 
        outcome, 
        COUNT(outcome) 
      FROM 
        %I 
      WHERE 
        playerID = %L 
      GROUP BY 
        playerID, outcome;
      `,
      STATS_RELATION,
      playerID,
    );
  } else {
    // get all player outcomes with WHERE
    sql = format(
      `
      SELECT 
        playerID, 
        outcome, 
        COUNT(outcome) 
      FROM 
        %I 
      WHERE 
        playerID = %L 
        AND outcome = %L 
      GROUP BY 
        playerID, outcome;
      `,
      STATS_RELATION,
      playerID,
      outcome,
    );
  }

  const rsp = await query(sql);
  if (queryIsEmpty(rsp)) {
    logger.warn(
      `No matches found for playerID: ${playerID} with outcome: ${outcome}`,
    );
    return null;
  }

  return rsp.rows;
}
