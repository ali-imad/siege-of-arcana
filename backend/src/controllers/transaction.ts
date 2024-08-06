import format from 'pg-format';
import logger from '../utils/logger';
import { queryIsEmpty, query } from '../services/db';
import {
  BALANCE_RELATION,
  CURR_RELATION,
  ITEM_RELATION,
  SALES_RELATION,
  SHOP_RELATION,
  SHOPITEM_RELATION,
  TRANSACTION_RELATION,
} from '../interfaces/relations';

interface TxRow {
  txid: number;
  itemname: string;
  shopname: string;
  quantity: number;
  cost: number;
  currency: string;
}

async function sqlToTxRow(sql: string) {
  const rsp = await query(sql);
  const retArr: TxRow[] = [];
  logger.debug(`Got resp with n=${rsp.rows.length}`);
  rsp.rows.forEach(row => {
    logger.debug(`Got row: ${JSON.stringify(row)}`);
    retArr.push({
      txid: row.txid,
      itemname: row.itemname,
      shopname: row.shopname,
      quantity: row.quantity,
      cost: row.cost,
      currency: row.currency,
    });
  });
  return retArr;
}

export async function getTransactionsByPlayerID(pid: number): Promise<TxRow[]> {
  const sql = format(
    `SELECT t.txid, i.title AS itemname, s.title AS shopname, sa.quantity, t.cost, c.currname AS currency
    FROM %I t
    JOIN %I i ON t.itemid = i.itemid
    JOIN %I s ON t.shopid = s.shopid
    JOIN %I si ON si.itemid = i.itemid
    JOIN %I sa ON sa.itemid = t.itemid AND t.shopid = sa.shopid
    JOIN %I cb ON t.balanceid = cb.balanceid
    JOIN %I c ON cb.currname = c.currname
    WHERE cb.playerid = %L;`,
    TRANSACTION_RELATION,
    ITEM_RELATION,
    SHOP_RELATION,
    SHOPITEM_RELATION,
    SALES_RELATION,
    BALANCE_RELATION,
    CURR_RELATION,
    pid,
  );
  return sqlToTxRow(sql);
}

export async function addSaleAmount(
  iid: number,
  sid: number,
  quantity: number,
  unitCost: number,
): Promise<number> {
  const sql = format(
    `INSERT INTO %I (itemid, shopid, quantity, cost)
    VALUES (%L, %L, %L, %L);`,
    SALES_RELATION,
    iid,
    sid,
    quantity,
    unitCost * quantity,
  );
  const rsp = await query(sql);
  if (queryIsEmpty(rsp)) {
    logger.error('Failed to add sale amount');
    return -1;
  }
  logger.debug(
    `Added sale amount for (iid: ${iid}, sid: ${sid}, qty: ${quantity}), cost: ${unitCost * quantity}`,
  );
  return unitCost * quantity;
}

export async function getSaleAmount(
  iid: number,
  sid: number,
  quantity: number,
): Promise<number> {
  const sql = format(
    `SELECT cost
    FROM %I
    WHERE itemid = %L AND shopid = %L AND quantity = %L;`,
    SALES_RELATION,
    iid,
    sid,
    quantity,
  );
  const rsp = await query(sql);
  if (queryIsEmpty(rsp)) {
    logger.debug(
      `No price found for shopID ${sid} and itemID ${iid} and qty: ${quantity}`,
    );
    return -1;
  }
  logger.debug(
    `Found price: ${rsp.rows[0].cost} for (iid: ${iid}, sid: ${sid}, qty: ${quantity})`,
  );
  return rsp.rows[0].cost;
}
