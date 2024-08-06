import express from 'express';
import logger from '../utils/logger';
import {
  buyItem,
  findShopItemsByName,
  getAllShopItems,
  getAllShops,
  getShopItemsByShop,
} from '../controllers/shop';

const router = express.Router();

// get all shop items
router.get('/', async (req, res) => {
  try {
    const shopItems = await getAllShopItems();
    return res.json({ shopItems });
  } catch (error: any) {
    logger.error(`Failed to get shop items: ${error.message}`);
    res.status(500).json({ error: 'Failed to get shop items' });
    return;
  }
});

// get all shop names and id's
router.get('/shops', async (_req, res) => {
  const shops = await getAllShops();
  if (!shops) {
    res.status(500).json({ error: 'Could not find any shops' });
    return;
  }
  return res.json({ shops });
});

// get a shops items
router.get('/:shopID', async (req, res) => {
  const { shopID } = req.params;
  const sid = parseInt(shopID);
  if (!sid && sid !== 0) {
    res.status(400).json({ error: 'Invalid shopID' });
    return;
  }

  try {
    const shopItems = await getShopItemsByShop(sid);
    return res.json({ shopItems });
  } catch (error: any) {
    logger.error(`Failed to get shop items: ${error.message}`);
    res.status(500).json({ error: 'Failed to get shop items' });
    return;
  }
});

// search for shop items
router.get('/search/:name', async (req, res) => {
  const { name } = req.params;
  try {
    const shopItems = await findShopItemsByName(name);
    return res.json({ shopItems });
  } catch (error) {
    logger.error('Failed to get shop items');
    res.status(500).json({ error: 'Failed to get shop items' });
    return;
  }
});

// buy an item from a shop
router.post('/buy', async (req, res) => {
  const { playerID, shopID, itemID, quantity } = req.body;
  const pid = parseInt(playerID);
  const sid = parseInt(shopID);
  const iid = parseInt(itemID);
  const qty = parseInt(quantity);
  if (!pid && pid !== 0) {
    res.status(400).json({ success: false, error: 'Invalid playerID' });
    return;
  }
  if (!sid && sid !== 0) {
    res.status(400).json({ success: false, error: 'Invalid shopID' });
    return;
  }
  if (!iid && iid !== 0) {
    res.status(400).json({ success: false, error: 'Invalid itemID' });
    return;
  }
  if (!qty && qty !== 0) {
    res.status(400).json({ success: false, error: 'Invalid quantity' });
    return;
  }

  try {
    const success = await buyItem(pid, sid, iid, qty);
    if (!success) {
      res.status(400).json({ success: false, error: 'Failed to buy item' });
      return;
    }
    res.json({ success });
  } catch (error: any) {
    logger.error(`Failed to buy item: ${error.message}`);
    res.status(500).json({ success: false, error: 'Failed to buy item' });
    return;
  }
});

export default router;
