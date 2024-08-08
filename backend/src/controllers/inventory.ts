import { query, queryIsEmpty } from '../services/db';
import format from 'pg-format';
import logger from '../utils/logger';
import {
  CATEGORY_RELATION,
  INV_RELATION,
  INVITEM_RELATION,
  ITEM_RELATION,
} from '../interfaces/relations';

export enum InventoryName {
  Main = 'Main',
  Gift = 'Gift Box',
}

export type ItemType = 'Consumable' | 'Equipment';

export interface InventoryItem {
  name: string;
  invid: number;
  itemid: number;
  quantity: number;
  type: ItemType;
  inventory: InventoryName;
}

async function rspToInvItems(sql: string) {
  const rsp = await query(sql);
  const retArr: InventoryItem[] = [];
  logger.debug(`Got resp with n=${rsp.rows.length}`);
  rsp.rows.forEach(row => {
    logger.debug(`Got row: ${JSON.stringify(row)}`);
    retArr.push({
      name: row.title,
      invid: row.invid,
      itemid: row.itemid,
      quantity: row.quantity,
      type: row.category,
      inventory: row.invname,
    });
  });
  return retArr;
}

export async function getAllItemsFromInventory(
  pID: number,
): Promise<InventoryItem[]> {
  // from the inventory item table
  // get all titles (from item table), quantity (from inventoryitem table), category from itemcategory table and inventory name (from inventory table)
  const sql = format(
    `SELECT i.title, i.itemid, ii.quantity, ic.category, inv.invname, inv.invid
    FROM %I ii
    JOIN %I i ON ii.itemid = i.itemid
    JOIN %I ic ON i.title = ic.title
    JOIN %I inv ON ii.invid = inv.invid
    WHERE inv.playerid = %L;`,
    INVITEM_RELATION,
    ITEM_RELATION,
    CATEGORY_RELATION,
    INV_RELATION,
    pID,
  );

  return rspToInvItems(sql);
}

export async function getItemsFromInventory(
  pID: number,
  invName: InventoryName,
): Promise<InventoryItem[]> {
  // from the inventory item table
  // get all titles (from item table), quantity (from inventoryitem table), category from itemcategory table from main inventory items
  const sql = format(
    `SELECT i.title, i.itemid, ii.quantity, ic.category, inv.invname, inv.invid
    FROM %I ii
    JOIN %I i ON ii.itemid = i.itemid
    JOIN %I ic ON i.title = ic.title
    JOIN %I inv ON ii.invid = inv.invid
    WHERE inv.playerid = %L AND inv.invname = %L;`,
    INVITEM_RELATION,
    ITEM_RELATION,
    CATEGORY_RELATION,
    INV_RELATION,
    pID,
    invName,
  );

  return rspToInvItems(sql);
}

export async function getInvIdFromPID(
  pID: number,
  invName: InventoryName,
): Promise<number> {
  const sql = format(
    `SELECT invid
    FROM %I
    WHERE playerid = %L AND invname = %L;`,
    INV_RELATION,
    pID,
    invName,
  );

  const rsp = await query(sql);
  if (!queryIsEmpty(rsp)) {
    return rsp.rows[0].invid;
  }
  return -1;
}

export async function getQtyFromInv(
  invID: number,
  itemID: number,
): Promise<number> {
  // check if item already exists in inventory
  const checkSql = format(
    `SELECT quantity
    FROM %I
    WHERE invid = %L AND itemid = %L;`,
    INVITEM_RELATION,
    invID,
    itemID,
  );
  const checkRsp = await query(checkSql);
  logger.debug(`Got checkRsp: ${JSON.stringify(checkRsp.rows)}`);
  if (!queryIsEmpty(checkRsp)) {
    return checkRsp.rows[0].quantity;
  }
  return 0;
}

export async function removeItemFromInventory(
  invID: number,
  itemID: number,
  quantity: number,
): Promise<boolean> {
  const currQty = await getQtyFromInv(invID, itemID);
  if (currQty === 0) {
    logger.warn(`Item with itemID ${itemID} not found in inventory ${invID}`);
    return false;
  }
  if (currQty < quantity) {
    logger.warn(`Item with itemID ${itemID} has insufficient quantity`);
    return false;
  }
  if (currQty > quantity) {
    // if item exists, update quantity
    const updateSql = format(
      `UPDATE %I
      SET quantity = quantity - %L
      WHERE invid = %L AND itemid = %L;`,
      INVITEM_RELATION,
      quantity,
      invID,
      itemID,
    );
    const updateRsp = await query(updateSql);
    return !queryIsEmpty(updateRsp);
  } else {
    const deleteSql = format(
      `DELETE FROM %I
    WHERE invid = %L AND itemid = %L;`,
      INVITEM_RELATION,
      invID,
      itemID,
    );
    const deleteRsp = await query(deleteSql);
    return !queryIsEmpty(deleteRsp);
  }
}

export async function addItemToInventory(
  invID: number,
  itemID: number,
  quantity: number,
): Promise<boolean> {
  if (await getQtyFromInv(invID, itemID)) {
    // if item exists, update quantity
    const updateSql = format(
      `UPDATE %I
      SET quantity = quantity + %L
      WHERE invid = %L AND itemid = %L;`,
      INVITEM_RELATION,
      quantity,
      invID,
      itemID,
    );
    const updateRsp = await query(updateSql);
    return !queryIsEmpty(updateRsp);
  } else {
    const insertSql = format(
      `INSERT INTO %I (invid, itemid, quantity)
    VALUES (%L, %L, %L);`,
      INVITEM_RELATION,
      invID,
      itemID,
      quantity,
    );
    const insertRsp = await query(insertSql);
    return !queryIsEmpty(insertRsp);
  }
}
