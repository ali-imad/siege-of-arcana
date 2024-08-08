import format from 'pg-format';
import logger from '../utils/logger';
import { queryIsEmpty, query, queryTx } from '../services/db';
import { getCurrBalance } from './wallet';
import { getInvIdFromPID, getQtyFromInv, InventoryName } from './inventory';
import {
  BALANCE_RELATION,
  CATEGORY_RELATION,
  CONSUMABLE_RELATION,
  COSMETIC_RELATION,
  INVITEM_RELATION,
  ITEM_RELATION,
  SHOP_RELATION,
  SHOPITEM_RELATION,
  TRANSACTION_RELATION,
} from '../interfaces/relations';
import { addSaleAmount, getSaleAmount } from './transaction';

export interface ShopItem {
  name: string;
  itemid: number;
  currname: string;
  price: number;
  category: string;
  shop: { name: string; shopid: number };
  rarity?: string;
  description?: string;
  expiration?: number;
}

export async function rspToShopItems(sql: string) {
  const rsp = await query(sql);
  const retArr: ShopItem[] = [];
  logger.debug(`Got resp with n=${rsp.rows.length}`);
  if (queryIsEmpty(rsp)) {
    return [];
  }
  rsp.rows.forEach(row => {
    logger.debug(`Got row: ${JSON.stringify(row)}`);
    retArr.push({
      name: row.title,
      itemid: row.itemid,
      price: row.cost,
      currname: row.currname,
      category: row.category,
      shop: { name: row.shopname, shopid: row.shopid },
      rarity: row.rarity,
      description: row.effect,
      expiration: row.expiration,
    });
  });
  return retArr;
}

export interface Shop {
  name: string;
  shopid: number;
}

export async function getAllShops(): Promise<Shop[]> {
  const sql = format(
    `SELECT shopid, title AS name
    FROM %I;`,
    SHOP_RELATION,
  );

  const rsp = await query(sql);
  const retArr: Shop[] = [];
  logger.debug(`Got resp with n=${rsp.rows.length}`);
  rsp.rows.forEach(row => {
    logger.debug(`Got row: ${JSON.stringify(row)}`);
    retArr.push({ name: row.name, shopid: row.shopid });
  });
  return retArr;
}

export async function getAllShopItems(): Promise<ShopItem[]> {
  const sql = format(
    `SELECT i.title, i.itemid, s.currname, s.cost, ic.category, cm.rarity, cs.expiration, cs.effect, s.shopid, sh.title AS shopname
    FROM %I s
    JOIN %I i ON s.itemid = i.itemid
    JOIN %I ic ON i.title = ic.title
    JOIN %I sh ON s.shopid = sh.shopid
    LEFT JOIN %I cm ON i.itemid = cm.itemid
    LEFT JOIN %I cs ON i.itemid = cs.itemid;`,
    SHOPITEM_RELATION,
    ITEM_RELATION,
    CATEGORY_RELATION,
    SHOP_RELATION,
    COSMETIC_RELATION,
    CONSUMABLE_RELATION,
  );

  return rspToShopItems(sql);
}

export async function getShopItemCost(
  sID: number,
  iID: number,
): Promise<{ currname: string; cost: number }> {
  const sql = format(
    `SELECT currname, cost
    FROM %I
    WHERE shopID = %L AND itemID = %L;`,
    SHOPITEM_RELATION,
    sID,
    iID,
  );

  const rsp = await query(sql);
  if (queryIsEmpty(rsp)) {
    logger.error(`No price found for shopID ${sID} and itemID ${iID}`);
    return { currname: '', cost: -1 };
  }
  return rsp.rows[0];
}

export async function getShopItemsByShop(sID: number): Promise<ShopItem[]> {
  const sql = format(
    `SELECT i.title, i.itemid, s.currname, s.cost, ic.category, cm.rarity, cs.expiration, cs.effect, s.shopid, sh.title AS shopname
    FROM %I s
    JOIN %I i ON s.itemid = i.itemid
    JOIN %I ic ON i.title = ic.title
    JOIN %I sh ON s.shopid = sh.shopid
    LEFT JOIN %I cm ON i.itemid = cm.itemid
    LEFT JOIN %I cs ON i.itemid = cs.itemid
    WHERE s.shopID = %L;`,
    SHOPITEM_RELATION,
    ITEM_RELATION,
    CATEGORY_RELATION,
    SHOP_RELATION,
    COSMETIC_RELATION,
    CONSUMABLE_RELATION,
    sID,
  );

  return rspToShopItems(sql);
}

// search for a shop item by name
export async function findShopItemsByName(name: string): Promise<ShopItem[]> {
  const sql = format(
    `SELECT i.title, i.itemid, s.currname, s.cost, ic.category, cm.rarity, cs.expiration, cs.effect, s.shopid, sh.title AS shopname
    FROM %I s
    JOIN %I i ON s.itemid = i.itemid
    JOIN %I ic ON i.title = ic.title
    JOIN %I sh ON s.shopid = sh.shopid
    LEFT JOIN %I cm ON i.itemid = cm.itemid
    LEFT JOIN %I cs ON i.itemid = cs.itemid
    WHERE LOWER(i.title) LIKE %L;`,
    SHOPITEM_RELATION,
    ITEM_RELATION,
    CATEGORY_RELATION,
    SHOP_RELATION,
    COSMETIC_RELATION,
    CONSUMABLE_RELATION,
    `%${name.toLowerCase()}%`,
  );

  return rspToShopItems(sql);
}

// buy an item from a shop and add it to player inventory, serializing a transaction
export async function buyItem(
  playerID: number,
  shopID: number,
  itemID: number,
  quantity: number,
): Promise<number> {
  // check if player has enough currency
  const { currname: currName, cost: unitCost } = await getShopItemCost(
    shopID,
    itemID,
  );
  let cost = await getSaleAmount(itemID, shopID, quantity);
  if (cost === -1) {
    // add a sale record to the LUT
    logger.debug(
      `Setting cost based on shop unit cost of ${unitCost} ${currName}`,
    );
    cost = await addSaleAmount(itemID, shopID, quantity, unitCost);
  }

  if (cost < 0) {
    logger.error(
      `Failed to set cost for shopID ${shopID} and itemID ${itemID}`,
    );
    return 0;
  } else {
    logger.debug(`Found total cost of ${cost} ${currName}`);
  }

  const currBal = await getCurrBalance(playerID, currName);

  if (currBal.bal < cost) {
    logger.debug(
      `Player ${playerID} does not have enough currency to buy item`,
    );
    return -1;
  }

  // get the players main inventory
  const invID = await getInvIdFromPID(playerID, InventoryName.Main);
  if (invID < 0) {
    logger.error(`Failed to get inventory ID for player ${playerID}`);
    return 0;
  }

  // start transacting
  // remove currency from player
  const withdrawQ = format(
    `UPDATE %I
    SET amount = amount - %L
    WHERE playerid = %L AND currname = %L;`,
    BALANCE_RELATION,
    cost,
    playerID,
    currName,
  );

  // add item to player inventory
  const addItemQ =
    (await getQtyFromInv(invID, itemID)) > 0
      ? format(
          `UPDATE %I
      SET quantity = quantity + %L
      WHERE invid = %L AND itemid = %L;`,
          INVITEM_RELATION,
          quantity,
          invID,
          itemID,
        )
      : format(
          `
          INSERT INTO %I (invid, itemid, quantity)
          VALUES (%L, %L, %L);`,
          INVITEM_RELATION,
          invID,
          itemID,
          quantity,
        );

  // add a transaction record
  const transQ = format(
    `INSERT INTO %I (playerid, itemid, shopid, invid, balanceid, cost)
    VALUES (%L, %L, %L, %L, %L, %L)
    RETURNING txid;`,
    TRANSACTION_RELATION,
    playerID,
    itemID,
    shopID,
    invID,
    currBal.id,
    cost,
  );

  const rsp = await queryTx([withdrawQ, addItemQ, transQ]);
  const success = !queryIsEmpty(rsp) ? 1 : 0;

  return success;
}
