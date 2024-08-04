import express from 'express';
import { getPlayerMatches } from '../controllers/match';

const router = express.Router();

router.get('/api/matches/:playerID', async (req, res) => {
  const playerID = parseInt(req.params.playerID, 10);
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

export default router;