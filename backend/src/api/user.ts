// routes for user profiles and authentication
import express from 'express';

import {
  createUser,
  getUserByID,
  updateUserByID,
  deleteUserByID,
  getUserByName,
  getUserByEmail,
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
  const response = await createUser(name, email, password);
  logger.debug(JSON.stringify(response))
  const playerID = response.playerid
  if (playerID === null) {
    logger.error('Failed to create user');
    res.status(500).json({ error: 'Failed to create user' });
    return;
  }
  logger.debug(`player account created with playerid: ${playerID}`)
  res.json({ playerID });
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

// get user profile row
router.get('/name/:username', async (req, res) => {
  const { username } = req.params;
  
  const user = await getUserByName(username);
  logger.http(`200 GET /api/user/name/${username}`);
  res.json({ user });
});

// get user profile row
router.get('/email/:email', async (req, res) => {
  const { email } = req.params;
  
  const user = await getUserByEmail(email)
  logger.http(`200 GET /api/user/name/${email}`);
  res.json({ user });
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
