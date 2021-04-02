import { Job } from 'agenda';
import { logger } from '../loaders/logger';

export const sendEmail = async (job: Job, done: () => void): Promise<void> => {
  try {
    logger.debug('🚀  Send Email Job triggered!');
    done();
  } catch (e) {
    logger.error('🔥 Error with Send Email Job: %o', e);
    done();
  }
};
