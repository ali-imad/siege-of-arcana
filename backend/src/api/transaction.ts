import express from 'express';
import { getTransactionsByPlayerID } from '../controllers/transaction';

const router = express.Router();

// get all transactions by player ID
router.get('/:playerID', async (req, res) => {
  const { playerID } = req.params;
  const pid = parseInt(playerID);
  if (!pid && pid !== 0) {
    res.status(400).json({ error: 'Invalid playerID' });
    return;
  }

  try {
    const transactions = await getTransactionsByPlayerID(pid);
    return res.json({ transactions });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get transactions' });
    return;
  }
});

export default router;
