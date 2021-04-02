/* eslint-disable global-require */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import express from 'express';
import { expressLoader } from './express';
import { dependencyInjector } from './dependency_injector';
import { mongooseLoader } from './mongoose';
import { jobsLoader } from './jobs';
import { logger } from './logger';
import './events'; // We have to import at least all the events once so they can be triggered

export const prepare = async ({ app }: { app: express.Application }): Promise<void> => {
  const mongoConnection = await mongooseLoader();
  logger.info('🚀  DB loaded and connected!');

  const userModel = {
    name: 'userModel',
    model: require('../models/user').default,
  };

  const { agenda } = dependencyInjector({
    mongoConnection,
    models: [userModel],
  });
  logger.info('🚀  Dependency Injector loaded');

  jobsLoader({ agenda });
  logger.info('🚀  Jobs loaded');

  expressLoader({ app });
  logger.info('🚀  Express loaded');
};
