// routes for user profiles and authentication
import express from 'express';
import {
  getAllItemsFromInventory,
  getInvNamesFromPID,
  getItemsFromInventory,
  InventoryItem,
  removeItemFromInventory,
} from '../controllers/inventory';
import logger from '../utils/logger';

const router = express.Router();

// get all items in a users inventory
router.get('/:playerID', async (req, res) => {
  const { playerID } = req.params;
  const pid = parseInt(playerID);
  if (!pid && pid !== 0) {
    res.status(400).json({ error: 'Invalid playerID' });
    return;
  }

  try {
    const items: InventoryItem[] = await getAllItemsFromInventory(pid);
    return res.json({ items });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get inventory items' });
    return;
  }
});

// get all items in a users specific inventory
router.get('/get/:invName/:playerID', async (req, res) => {
  const { playerID, invName } = req.params;
  const pid = parseInt(playerID);
  if (!pid && pid !== 0) {
    res.status(400).json({ error: 'Invalid playerID' });
    return;
  }

  try {
    const items: InventoryItem[] = await getItemsFromInventory(pid, invName);
    return res.json({ items });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get inventory items' });
    return;
  }
});

// remove an item from inventory
router.post('/:invID/remove', async (req, res) => {
  const { invID } = req.params;
  const { itemID, quantity } = req.body;
  const inv = parseInt(invID);
  const item = parseInt(itemID);
  if (!inv && inv !== 0) {
    logger.error('Invalid inventory ID');
    res.status(400).json({ error: 'Invalid inventory ID' });
    return;
  }
  if (!item && item !== 0) {
    logger.error('Invalid item ID');
    res.status(400).json({ error: 'Invalid item ID' });
    return;
  }
  if (!quantity) {
    logger.error('Invalid quantity');
    res.status(400).json({ error: 'Invalid quantity' });
    return;
  }

  // remove item from inventory
  res.json({ success: await removeItemFromInventory(inv, item, quantity) });
});

// get names of all inventories
router.get('/names/:playerID', async (req, res) => {
  const { playerID } = req.params;
  const pid = parseInt(playerID);
  if (!pid && pid !== 0) {
    res.status(400).json({ error: 'Invalid playerID' });
    return;
  }

  try {
    const names: string[] = await getInvNamesFromPID(pid);
    return res.json({ names });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get inventory names' });
    return;
  }
});

// export the router
export default router;
