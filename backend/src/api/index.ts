import express from 'express';
import userRouter from './user';
import matchRouter from './match';
import invRouter from './inventory';
import shopRouter from './shop';
import walletRouter from './wallet';
import transactionRouter from './transaction';

const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    message: 'API - 👋🌎🌍🌏',
  });
});

router.use('/user', userRouter);
router.use('/inventory', invRouter);
router.use('/shop', shopRouter);
router.use('/wallet', walletRouter);
router.use('/transaction', transactionRouter);
router.use('/match', matchRouter);

export default router;
