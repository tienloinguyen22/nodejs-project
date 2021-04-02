import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { logger } from '../loggers';
import { ApiError } from '../errors/api_error';

export const errorHandler = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  return (err: ApiError, req: Request, res: Response, _next: Function) => {
    logger.error('Request Error: ', req.url);
    logger.error('Error: ', err.message);

    res
      .status(err.status || StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: err.message || 'Internal server error' });
  };
};
