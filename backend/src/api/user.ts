// routes for user profiles and authentication
import express from 'express';

import {
  createUser,
  getUserByID,
  updateUserByID,
  deleteUserByID,
} from '../controllers/user';
import logger from '../utils/logger';

const router = express.Router();

// create a new user
router.post('/create', async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    res.status(400).json({ error: 'Missing required fields' });
    return;
  }
  const success = await createUser(name, email, password);
  if (!success) {
    logger.error('Failed to create user');
    res.status(500).json({ error: 'Failed to create user' });
    return;
  }
  res.json({ success });
});

// get user profile row
router.get('/:playerID', async (req, res) => {
  const { playerID } = req.params;
  const pid = parseInt(playerID);
  if (!pid && pid !== 0) {
    res.status(400).json({ error: 'Invalid playerID' });
    return;
  }
  const user = await getUserByID(pid);
  if (!user) {
    logger.error('Failed to get user');

    res.status(500).json({ error: 'Failed to get user' });
    return;
  }

  res.json({ exists: user });
});

// edit user profile
router.put('/:playerID', async (req, res) => {
  const { playerID } = req.params;
  const pid = parseInt(playerID);
  if (!pid) {
    res.status(400).json({ error: 'Invalid playerID' });
    return;
  }
  const values = req.body;
  if (!values) {
    res.status(400).json({ error: 'Missing required fields' });
    return;
  }
  const success = await updateUserByID(pid, values);
  if (!success) {
    logger.error('Failed to update user');

    res.status(500).json({ error: 'Failed to update user' });
    return;
  }

  res.json({ success });
});

// delete user profile
router.delete('/:playerID', async (req, res) => {
  const { playerID } = req.params;
  const pid = parseInt(playerID);
  if (!pid) {
    res.status(400).json({ error: `Invalid playerID: ${pid}` });
    return;
  }
  const success = await deleteUserByID(pid);
  if (!success) {
    logger.error('Failed to delete user');

    res
      .status(500)
      .json({ error: `Failed to delete user with playerID: ${pid}` });
    return;
  }

  res.json({ success });
});

export default router;
