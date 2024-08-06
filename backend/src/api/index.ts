import express from 'express';
import userRouter from './user';
import matchRouter from './match';
import invRouter from './inventory';
import shopRouter from './shop';
import walletRouter from './wallet';
import transactionRouter from './transaction';
import {
  getColumnNames,
  getRelations,
  projectSelect,
} from '../controllers/meta';

const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    message: 'API - 👋🌎🌍🌏',
  });
});

router.get('/tables', async (req, res) => {
  const tables = await getRelations();
  if (!tables) {
    return res.status(500).json({ error: 'Failed to get tables' });
  }
  return res.json({ tables });
});

router.get('/tables/:table', async (req, res) => {
  const { table } = req.params;
  const filters = await getColumnNames(table);
  if (!filters) {
    return res
      .status(500)
      .json({ error: `Failed to get filters for ${table}` });
  }
  return res.json({ filters });
});

router.post('/query', async (req, res) => {
  const { table, filters } = req.body;
  if (!table || !filters) {
    return res.status(400).json({ error: 'Invalid request' });
  }
  const results = await projectSelect(table, filters);
  if (!results) {
    return res.status(500).json({
      error: `Failed to get results for table ${table} on columns ${filters.join(', ')}`,
    });
  }
  res.json({ results });
});

router.use('/user', userRouter);
router.use('/inventory', invRouter);
router.use('/shop', shopRouter);
router.use('/wallet', walletRouter);
router.use('/transaction', transactionRouter);
router.use('/match', matchRouter);

export default router;
