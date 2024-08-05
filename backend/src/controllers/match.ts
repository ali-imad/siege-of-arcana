import { query } from '../services/db';
import format from 'pg-format';
import logger from '../utils/logger';

// export async function createMatch(
//   mode: string,
//   map: string,
//   statsIDs: number[],
// ): Promise<any | null> {
//   const limitedStatsIDs = statsIDs.slice(0, 10);
//
//   const statsIDColumns = limitedStatsIDs.map((_, index) => `statsID${index + 1}`).join(', ');
//
//   const statsIDValues = limitedStatsIDs.map(id => format('%L', id)).join(', ');
//
//   const sql = format(
//     `INSERT INTO %I (mode, map, datePlayed, ${statsIDColumns}) VALUES (%L, %L, ${statsIDValues}) RETURNING matchID;`,
//     'Match',
//     mode,
//     map,
//   );
//
//   try {
//     const rsp = await query(sql);
//     if (rsp.rows && rsp.rows.length > 0) {
//       return rsp.rows[0];
//     } else {
//       logger.error('Match created but no matchID returned');
//       return null;
//     }
//   } catch (err) {
//     logger.error('Error executing query', err);
//     return null;
//   }
// }

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