import express from 'express';

import logger from '../utils/logger';

const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    message: 'API - 👋🌎🌍🌏',
  });
  logger.http('200 GET / (api)');
});

export default router;
