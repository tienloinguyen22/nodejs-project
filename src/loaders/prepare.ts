/* eslint-disable global-require */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import express from 'express';
import { expressLoader } from './express';
import { mongooseLoader } from './mongoose';
import { jobsLoader } from './jobs';
import { logger } from './logger';
import { agendaFactory } from './agenda_factory';
// import './events'; // We have to import at least all the events once so they can be triggered

export const prepare = async ({ app }: { app: express.Application }): Promise<void> => {
  await mongooseLoader();
  logger.info('🚀  DB loaded and connected!');

  const agenda = agendaFactory();
  jobsLoader({ agenda });
  logger.info('🚀  Jobs loaded');

  expressLoader({ app });
  logger.info('🚀  Express loaded');
};
