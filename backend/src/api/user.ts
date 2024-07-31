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
    logger.http('400 POST /api/user/create');
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
    logger.http(`400 GET /api/user/${pid}`);
    res.status(400).json({ error: 'Invalid playerID' });
    return;
  }
  const user = await getUserByID(pid);
  if (!user) {
    logger.error('Failed to get user');
    logger.http(`500 GET /api/user/${pid}`);
    res.status(500).json({ error: 'Failed to get user' });
    return;
  }
  logger.http(`200 GET /api/user/${pid}`);
  res.json({ user });
});

// edit user profile
router.put('/:playerID', async (req, res) => {
  const { playerID } = req.params;
  const pid = parseInt(playerID);
  if (!pid) {
    logger.http(`400 PUT /api/user/${pid}`);
    res.status(400).json({ error: 'Invalid playerID' });
    return;
  }
  const values = req.body;
  if (!values) {
    logger.http(`400 PUT /api/user/${pid}`);
    res.status(400).json({ error: 'Missing required fields' });
    return;
  }
  const success = await updateUserByID(pid, values);
  if (!success) {
    logger.error('Failed to update user');
    logger.http(`500 PUT /api/user/${pid}`);
    res.status(500).json({ error: 'Failed to update user' });
    return;
  }
  logger.http(`200 PUT /api/user/${pid}`);
  res.json({ success });
});

// delete user profile
router.delete('/:playerID', async (req, res) => {
  const { playerID } = req.params;
  const pid = parseInt(playerID);
  if (!pid) {
    logger.http(`400 DELETE /api/user/${pid}`);
    res.status(400).json({ error: `Invalid playerID: ${pid}` });
    return;
  }
  const success = await deleteUserByID(pid);
  if (!success) {
    logger.error('Failed to delete user');
    logger.http(`500 DELETE /api/user/${pid}`);
    res
      .status(500)
      .json({ error: `Failed to delete user with playerID: ${pid}` });
    return;
  }
  logger.http(`200 DELETE /api/user/${pid}`);
  res.json({ success });
});

export default router;
