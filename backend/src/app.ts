import express from 'express';
import helmet from 'helmet';
import cors from 'cors';

import * as middlewares from './middlewares';
import api from './api';

import './utils/loadEnv';
import httpLog from './utils/http-log';

const app = express();

app.use(helmet());
app.use(cors());
app.use(httpLog);
app.use(express.json());

app.get('/', (req, res) => {
  res.json({
    message:
      'Welcome to the Siege of Arcana backend! Use the /api route to access the API.',
  });
});

app.use('/api', api);

app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

export default app;
