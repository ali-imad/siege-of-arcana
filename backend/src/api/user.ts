// routes for user profiles and authentication
import express from 'express';

import {
  createUser,
  getUserByID,
  updateUserByID,
  deleteUserByID,
  getUserByNameAndPassword,
  getUserByEmailAndPassword,
  getUserRank,
  getUserLevel,
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
});

  // get user profile row
router.get('/name/:elo', async (req, res) => {
  const { elo } = req.params;
  const eloInt = parseInt(elo);

  const rank = await getUserRank(eloInt);
  if (!rank) {
    logger.error('Failed to get rank');

    res.status(500).json({ error: 'Failed to get rank' });
    return;
  }

  res.json(rank.rank);
});

router.get('/profile/:totalXP', async (req, res) => {
  const { totalXP } = req.params;
  const totalXPINT = parseInt(totalXP);

  const level = await getUserLevel(totalXPINT);
  if (!level) {
    logger.error('Failed to get level');

    res.status(500).json({ error: 'Failed to get level' });
    return;
  }

  res.json(level.level);
});

// user log in
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  
  const user = await getUserByNameAndPassword(username, password)
  if (user) {
    logger.http(`200 POST /api/user/login`);
    res.json({ user });
  } else {
    logger.http(`401 POST /api/user/login`);
    res.status(401).json({ message: 'Invalid username or password' });
  }
});

// user register
router.post('/register', async (req, res) => {
  const { email, password } = req.body;
  
  const user = await getUserByEmailAndPassword(email, password)
  if (user) {
    logger.http(`200 POST /api/user/login`);
    res.json({ user });
  } else {
    logger.http(`401 POST /api/user/login`);
    res.status(401).json({ message: 'Invalid username or password' });
  }
});

// update user profile 
router.put('/update/:id', async (req, res) => {
  const { id } = req.params;
  const pid = parseInt(id);
  const { email, username, password } = req.body;
  
  const updatedUser = await updateUserByID(pid, {email, username, password});
  if (updatedUser) {
    logger.http(`200 PUT /api/user/update/${id}`);
    res.json({ user: updatedUser });
  } else {
    logger.http(`404 PUT /api/user/update/${id}`);
    res.status(404).json({ message: 'User not found or update failed' });
  }
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
