// routes for user profiles and authentication
import express from 'express';
import {
  getAllItemsFromInventory,
  getItemsFromInventory,
  InventoryItem,
  InventoryName,
  removeItemFromInventory,
} from '../controllers/inventory';

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

// get all items in a users main inventory
router.get('/main/:playerID', async (req, res) => {
  const { playerID } = req.params;
  const pid = parseInt(playerID);
  if (!pid && pid !== 0) {
    res.status(400).json({ error: 'Invalid playerID' });
    return;
  }

  try {
    const items: InventoryItem[] = await getItemsFromInventory(
      pid,
      InventoryName.Main,
    );
    return res.json({ items });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get inventory items' });
    return;
  }
});

// get all items in a users giftbox
router.get('/gift/:playerID', async (req, res) => {
  const { playerID } = req.params;
  const pid = parseInt(playerID);
  if (!pid && pid !== 0) {
    res.status(400).json({ error: 'Invalid playerID' });
    return;
  }

  try {
    const items: InventoryItem[] = await getItemsFromInventory(
      pid,
      InventoryName.Gift,
    );
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
    res.status(400).json({ error: 'Invalid inventory ID' });
    return;
  }
  if (!item && item !== 0) {
    res.status(400).json({ error: 'Invalid item ID' });
    return;
  }
  if (!quantity) {
    res.status(400).json({ error: 'Invalid quantity' });
    return;
  }

  // remove item from inventory
  res.json({ success: await removeItemFromInventory(inv, item, quantity) });
});

// export the router
export default router;
