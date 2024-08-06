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

//TODO: ISOLATE ALLIES BASED ON LOCALSTORAGE.USER.MatchSTats.Out
export async function getPlayerMatches(playerID: number): Promise<any | null> {
  const sql = format(
    `SELECT 
      m.matchID, 
      m.mode, 
      m.map,
      m.datePlayed,
      ms.xpGain, 
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
      ms.playerID = %L;`,
    playerID);

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

interface MatchView {
  matchID: number;
  dateplayed: string | null;
  mode: string | null;
  map: string | null;
  allies: Player[];
  enemies: Player[];
}

interface Player {
  profile: string;
  kda: string | null;
  efficacy: number | null;
}

export async function getMatchStats(matchIDS: number): Promise<MatchView | null> {
  const sql = format(`
    SELECT 
      m.matchID, 
      m.mode, 
      m.map,
      m.dateplayed,
      p.username AS playername,
      ms.xpGain, 
      ms.kills, 
      ms.deaths, 
      ms.assists, 
      ms.outcome 
    FROM 
      Match m 
    JOIN 
      MatchStats ms ON m.matchID = ms.matchID 
    JOIN 
      Player p ON ms.playerID = p.playerID 
    WHERE 
      m.matchID = %L;
  `, matchIDS);

  try {
    const rsp = await query(sql);
    if (rsp.rows && rsp.rows.length > 0) {
      const { matchID, mode, map, dateplayed } = rsp.rows[0];

      const allies: Player[] = [];
      const enemies: Player[] = [];

      rsp.rows.forEach(row => {
        const player = {
          profile: row.playername,
          kda: `${row.kills}/${row.deaths}/${row.assists}`,
          efficacy: null,
        };
        if (row.outcome === 'Win') {
          allies.push(player);
        } else {
          enemies.push(player);
        }
      });

      return {
        matchID,
        dateplayed,
        mode,
        map,
        allies,
        enemies,
      };
    } else {
      logger.error('No matches found for player');
      return null;
    }
  } catch (err) {
    logger.error('Error executing query', err);
    return null;
  }
}

export async function updatePlayerXP(playerID: number, xpGain: number): Promise<boolean> {
  const updatePlayerSql = format(
    `UPDATE Player
     SET totalXP = totalXP - %L
     WHERE playerID = %L;`,
    xpGain,
    playerID);

  try {
    await query(updatePlayerSql);
    return true;
  } catch (err) {
    logger.error('Error updating player XP', err);
    return false;
  }
}

export async function deleteMatch(matchID: number): Promise<boolean> {
  const getPlayerXpSQL = format(
    `SELECT playerID, xpGain
     FROM MatchStats
     WHERE matchID = %L;`,
    matchID);

  const deleteMatchSQL = format(
    `DELETE FROM Match
     WHERE matchID = %L;`,
    matchID);


  try {
    const playerXpRsp = await query(getPlayerXpSQL);
    if (playerXpRsp.rows && playerXpRsp.rows.length > 0) {
      for (const row of playerXpRsp.rows) {
        const success = await updatePlayerXP(row.playerid, row.xpgain);
        if (!success) {
          throw new Error('Failed to update player XP');
        }
      }
    } else {
      logger.error('No players found for the match');
      return false;
    }
    await query(deleteMatchSQL);

    return true;
  } catch (err) {
    logger.error('Error deleting match', err);
    return false;
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