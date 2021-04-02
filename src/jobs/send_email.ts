import { Job } from 'agenda/dist/job';
import { Logger } from 'winston';
import { Container } from 'typedi';

export const sendEmail = async (job: Job, done: () => void): Promise<void> => {
  const logger: Logger = Container.get('logger');
  try {
    logger.debug('🚀  Send Email Job triggered!');
    done();
  } catch (e) {
    logger.error('🔥 Error with Send Email Job: %o', e);
    done();
  }
};
