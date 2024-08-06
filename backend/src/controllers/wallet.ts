import { query, queryIsEmpty } from '../services/db';
import format from 'pg-format';
import logger from '../utils/logger';
import { BALANCE_RELATION, CURR_RELATION } from '../interfaces/relations';

export interface CurrBalance {
  curr: string;
  bal: number;
  id: number;
}

async function rspToCurrBalances(sql: string) {
  const rsp = await query(sql);
  const retArr: CurrBalance[] = [];
  logger.debug(`Got resp with n=${rsp.rows.length}`);
  rsp.rows.forEach(row => {
    logger.debug(`Got row: ${JSON.stringify(row)}`);
    retArr.push({
      curr: row.currname,
      bal: row.amount,
      id: row.balanceid,
    });
  });
  return retArr;
}

async function isPremiumCurrency(curr: string) {
  // curr must exist
  const sql = format(
    `SELECT type
    FROM %I
    WHERE currname = %L;`,
    CURR_RELATION,
    curr,
  );

  const rsp = await query(sql);
  if (queryIsEmpty(rsp)) {
    logger.error(
      `Currency ${curr} does not exist when polling for premium status`,
    );
    return false;
  }

  return rsp.rows[0].type;
}

// get all currency balances for a player
export async function getCurrBalances(pID: number): Promise<CurrBalance[]> {
  const sql = format(
    `SELECT cb.currname, cb.amount, cb.balanceid
    FROM %I cb
    WHERE cb.playerid = %L;`,
    BALANCE_RELATION,
    pID,
  );

  return rspToCurrBalances(sql);
}

// get balance for a specific currency
export async function getCurrBalance(
  pID: number,
  curr: string,
): Promise<CurrBalance> {
  const sql = format(
    `SELECT cb.currname, cb.amount, cb.balanceid
    FROM %I cb
    WHERE cb.playerid = %L AND cb.currname = %L;`,
    BALANCE_RELATION,
    pID,
    curr,
  );
  const rsp = await rspToCurrBalances(sql);

  if (rsp.length === 0) {
    return { curr, bal: -1, id: -1 };
  }

  return rsp[0];
}

// add a currency balance for a player
export async function addCurrBalance(
  pID: number,
  curr: string,
  toAdd: number,
): Promise<boolean> {
  if (toAdd < 0) {
    logger.error('Cannot add negative balance');
    return false;
  }

  if (!(await isPremiumCurrency(curr))) {
    logger.warn(
      `Currency ${curr} is not a premium currency, adding $${toAdd} to ${pID}'s balance anyways...`,
    );
  }

  if ((await getCurrBalance(pID, curr)).bal < 0) {
    // insert new balance for the player
    const sql = format(
      `INSERT INTO %I (playerid, currname, amount)
      VALUES (%L, %L, %L);`,
      BALANCE_RELATION,
      pID,
      curr,
      toAdd,
    );

    const res = await query(sql);

    return !queryIsEmpty(res);
  }
  // update the existing balance
  const sql = format(
    `UPDATE %I
    SET amount = amount + %L
    WHERE playerid = %L AND currname = %L;`,
    BALANCE_RELATION,
    toAdd,
    pID,
    curr,
  );

  return !queryIsEmpty(await query(sql));
}

// remove a currency balance for a player
export async function removeCurrBalance(
  pID: number,
  curr: string,
  toRemove: number,
): Promise<number> {
  if ((await getCurrBalance(pID, curr)).bal <= 0) {
    logger.warn(`Player with pID ${pID} does not have currency ${curr}`);
    return -1;
  }

  if ((await getCurrBalance(pID, curr)).bal < toRemove) {
    logger.warn(
      `Player with pID ${pID} has insufficient balance for currency ${curr}`,
    );
    return -2;
  }

  if ((await getCurrBalance(pID, curr)).bal === toRemove) {
    // delete the balance
    const sql = format(
      `DELETE FROM %I
      WHERE playerid = %L AND currname = %L;`,
      BALANCE_RELATION,
      pID,
      curr,
    );

    const res = await query(sql);

    return !queryIsEmpty(res) ? 1 : 0;
  }

  // update the existing balance
  const sql = format(
    `UPDATE %I
    SET amount = amount - %L
    WHERE playerid = %L AND currname = %L;`,
    BALANCE_RELATION,
    toRemove,
    pID,
    curr,
  );

  return !queryIsEmpty(await query(sql)) ? 1 : 0;
}
