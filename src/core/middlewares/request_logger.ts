/* eslint-disable no-console */
/* eslint-disable no-null/no-null */
import { Response, Request } from 'express';
import util from 'util';
import { logger } from '../loggers';

export const requestLogger = () => {
  return async (req: Request, res: Response, next: Function) => {
    logger.info(
      'Query: ',
      util.inspect(req.query, {
        showHidden: false,
        depth: null,
      }),
    );
    logger.info(
      'Body: ',
      util.inspect(req.body, {
        showHidden: false,
        depth: null,
      }),
    );
    next();
  };
};
