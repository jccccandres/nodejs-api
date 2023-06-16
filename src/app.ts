import express from 'express';
import config from 'config';
import connect from './utils/connect';
import logger from './utils/logger';

const port = config.get<number>("port");

const app = express();

const server = app.listen(port, async () => {
  logger.info(`App is running at http://localhost:${port}`);

  await connect();
});

export default server;