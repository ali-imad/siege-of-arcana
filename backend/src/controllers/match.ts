import { query } from '../services/db';
import format from 'pg-format';
import logger from '../utils/logger';

export async function createMatch(
  mode: string,
  map: string,
  statsIDs: number[],
): Promise<any | null> {
  const limitedStatsIDs = statsIDs.slice(0, 10);

  const statsIDColumns = limitedStatsIDs.map((_, index) => `statsID${index + 1}`).join(', ');

  const statsIDValues = limitedStatsIDs.map(id => format('%L', id)).join(', ');

  const sql = format(
    `INSERT INTO %I (mode, map, datePlayed, ${statsIDColumns}) VALUES (%L, %L, ${statsIDValues}) RETURNING matchID;`,
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
  const sql = `
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
      m.matchID = ${matchIDS};
  `;

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


export async function deleteMatch(matchID: number): Promise<boolean> {
  // Query to get player IDs and XP gains for the specified match
  const getPlayerXpSQL = `
    SELECT playerID, xpGain
    FROM MatchStats
    WHERE matchID = $1;
  `;

  // Query to delete the match
  const deleteMatchSQL = `
    DELETE FROM Match
    WHERE matchID = $1;
  `;

  // Query to delete match stats
  const deleteMatchStatsSQL = `
    DELETE FROM MatchStats
    WHERE matchID = $1;
  `;

  const client = await query('BEGIN'); // Start transaction

  try {
    // Fetch player IDs and XP gains
    const { rows: playerXpRows } = await query(getPlayerXpSQL, [matchID]);


    // Update XP for each player
    for (const row of playerXpRows) {
      await client.query(`
        UPDATE Player
        SET totalXP = totalXP - $1
        WHERE playerID = $2;
      `, [row.xpGain, row.playerID]);
    }

    // Delete the match and associated stats
    await client.query(deleteMatchStatsSQL, [matchID]);
    await client.query(deleteMatchSQL, [matchID]);

    await client.query('COMMIT'); // Commit transaction
    return true;
  } catch (err) {
    await client.query('ROLLBACK'); // Rollback transaction on error
    logger.error('Error deleting match', err);
    return false;
  } finally {
    client.release(); // Release the client
  }
}