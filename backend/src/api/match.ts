import express from 'express';
import {
  getPlayerIsSmurf,
  getPlayerMatches,
  getPlayerOutcome,
} from '../controllers/match';
import logger from '../utils/logger';

const router = express.Router();

router.get('/:playerID', async (req, res) => {
  const playerID = parseInt(req.params.playerID, 10);
  logger.debug(playerID);
  if (isNaN(playerID)) {
    return res.status(400).send('Invalid player ID');
  }

  const matches = await getPlayerMatches(playerID);
  if (matches) {
    res.json(matches);
  } else {
    res.status(404).send('No matches found for player');
  }
});

// check if a player is a smurf
router.get('/smurfdetect/:playerID', async (req, res) => {
  const playerID = parseInt(req.params.playerID, 10);

  if (isNaN(playerID)) {
    return res.status(400).send('Invalid player ID');
  }

  try {
    res.json(await getPlayerIsSmurf(playerID));
  } catch (err) {
    logger.error(`Failed to detect smurf for pID: ${playerID} -- `, err);
    res.status(500).send(`Failed to detect smurf for pID: ${playerID}`);
  }
});

// get player outcomes
router.get('/outcome/:playerID', async (req, res) => {
  const playerID = parseInt(req.params.playerID, 10);
  if (isNaN(playerID)) {
    return res.status(400).send('Invalid player ID');
  }

  const matches = await getPlayerOutcome(playerID, 'all');
  if (!matches) {
    return res.status(404).send(`No matches found for pID ${playerID}`);
  }
  logger.debug(`Matches found for pID ${playerID}`);
  logger.debug(JSON.stringify(matches));

  res.json(matches);
});

// get specific outcome stats for a player
router.get('/outcome/:playerID/:outcome', async (req, res) => {
  const playerID = parseInt(req.params.playerID, 10);
  const outcome = req.params.outcome;

  if (isNaN(playerID)) {
    return res.status(400).send('Invalid player ID');
  }

  const matches = await getPlayerOutcome(playerID, outcome);
  if (!matches || matches.length === 0) {
    return res
      .status(404)
      .send(`No matches found for pID ${playerID} with outcome: ${outcome}`);
  }

  logger.debug(`Matches found for pID ${playerID}`);
  logger.debug(JSON.stringify(matches[0]));

  res.json(matches[0]);
});

export default router;
