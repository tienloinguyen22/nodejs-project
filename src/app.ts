import express from 'express';
import { configs } from './configs';
import { logger } from './loaders/logger';

const startServer = async (): Promise<void> => {
  const app = express();

  // eslint-disable-next-line global-require
  await require('./loaders').default({ expressApp: app });

  app
    .listen(configs.port, () => {
      logger.info(`🛡️  Server listening on port: ${configs.port}`);
    })
    .on('error', (err) => {
      logger.error(err);
      process.exit(1);
    });
};

startServer();
