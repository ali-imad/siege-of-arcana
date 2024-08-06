import express from 'express';
import {
  addCurrBalance,
  getCurrBalance,
  getCurrBalances,
  removeCurrBalance,
} from '../controllers/wallet';

const router = express.Router();

// get all user wallets
router.get('/:playerID', async (req, res) => {
  const { playerID } = req.params;
  const pid = parseInt(playerID);
  if (!pid && pid !== 0) {
    res.status(400).json({ error: 'Invalid playerID' });
    return;
  }

  try {
    const wallets = await getCurrBalances(pid);
    return res.json({ wallets });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get wallets' });
    return;
  }
});

// get a specific wallet
router.get('/:playerID/:currency', async (req, res) => {
  const { playerID, currency } = req.params;
  const pid = parseInt(playerID);
  if (!pid && pid !== 0) {
    res.status(400).json({ error: 'Invalid playerID' });
    return;
  }

  try {
    const wallet = await getCurrBalance(pid, currency);
    if (wallet.id === -1) {
      res.status(404).json({ error: 'Wallet not found' });
      return;
    }
    return res.json(wallet);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get wallet' });
    return;
  }
});

// fund a wallet
router.post('/fund', async (req, res) => {
  const { playerID, currency, amount } = req.body;
  const pid = parseInt(playerID);
  if (!pid && pid !== 0) {
    res.status(400).json({ success: false, error: 'Invalid playerID' });
    return;
  }

  if (!currency || !amount) {
    res.status(400).json({ success: false, error: 'Missing required fields' });
    return;
  }

  // add amount to wallet
  const success = await addCurrBalance(pid, currency, amount);
  if (!success) {
    res.status(500).json({ success: false, error: 'Failed to fund wallet' });
    return;
  }

  res.json({ success: true });
});

// withdraw from a wallet
router.post('/withdraw', async (req, res) => {
  const { playerID, currency, amount } = req.body;
  const pid = parseInt(playerID);
  if (!pid && pid !== 0) {
    res.status(400).json({ success: false, error: 'Invalid playerID' });
    return;
  }

  if (!currency || !amount) {
    res.status(400).json({ success: false, error: 'Missing required fields' });
    return;
  }

  // remove from wallet
  const retVal = await removeCurrBalance(pid, currency, amount);
  if (retVal === -1) {
    // curr balance not found
    res.status(404).json({ success: false, error: 'Wallet not found' });
    return;
  }
  if (retVal === -2) {
    // insufficient balance
    res.status(400).json({ success: false, error: 'Insufficient balance' });
    return;
  }
  if (retVal === 0) {
    // failed to remove balance
    res
      .status(500)
      .json({ success: false, error: 'Failed to withdraw from wallet' });
    return;
  }
  if (retVal === 1) {
    // success
    res.json({ success: true });
    return;
  }
});

export default router;
