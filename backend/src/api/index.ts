import express from 'express';
import userRouter from './user';
import matchRouter from './match';
const router = express.Router();


router.get('/', (req, res) => {
  res.json({
    message: 'API - 👋🌎🌍🌏',
  });
});

router.use('/user', userRouter);
router.use('/match', matchRouter);

export default router;
