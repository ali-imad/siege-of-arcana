import express from 'express';
import { deleteMatch, getMatchStats, getPlayerMatches } from '../controllers/match';
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

router.get('/view/:matchID', async (req, res) => {
  const matchID = parseInt(req.params.matchID, 10);
  logger.debug(matchID);
  if (isNaN(matchID)) {
    return res.status(400).send('Invalid player ID');
  }

  const matches = await getMatchStats(matchID);
  if (matches) {
    res.json(matches);
  } else {
    res.status(404).send('No matches found for player');
  }
});

router.delete('/delete/:matchID', async (req, res) => {
  const matchID = parseInt(req.params.matchID);
  if (isNaN(matchID)) {
    return res.status(400).json({ error: 'Invalid match ID' });
  }

  const result = await deleteMatch(matchID);
  if (result) {
    res.status(200).json({ message: 'Match deleted successfully' });
  } else {
    res.status(500).json({ error: 'Failed to delete match' });
  }
});

export default router;