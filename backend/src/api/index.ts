import express from 'express';
import userRouter from './user';
const router = express.Router();
import matchRouter from './match';

router.get('/', (req, res) => {
  res.json({
    message: 'API - 👋🌎🌍🌏',
  });
});

router.use('/user', userRouter);
router.use('/match', matchRouter);

export default router;
