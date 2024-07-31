import express from 'express';
import logger from '../utils/logger';
import userRouter from './user';
const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    message: 'API - 👋🌎🌍🌏',
  });
  logger.http('200 GET / (api)');
});

router.use('/user', userRouter);

export default router;
