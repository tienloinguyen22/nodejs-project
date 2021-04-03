/* eslint-disable global-require */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import express from 'express';
import { expressLoader } from './express';
import { mongooseLoader } from './mongoose';
import { jobsLoader } from './jobs';
import { logger } from './logger';
import { agendaFactory } from './agenda_factory';
import { initializeFirebase } from './initialize_firebase';
import { eventEmitterFactory } from './event_emitter_factory';
import { eventSubscribersLoader } from './events';

export const prepare = async ({ app }: { app: express.Application }): Promise<void> => {
  await mongooseLoader();
  logger.info('🚀  DB loaded and connected!');

  await initializeFirebase();
  logger.info('🚀  Firebase loaded');

  const agenda = agendaFactory();
  jobsLoader({ agenda });
  logger.info('🚀  Jobs loaded');

  const eventEmitter = eventEmitterFactory();
  eventSubscribersLoader(eventEmitter);
  logger.info('🚀  Event Subscribers loaded');

  expressLoader({ app });
  logger.info('🚀  Express loaded');
};
