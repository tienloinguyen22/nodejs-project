import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { logger } from '../../loaders/logger';
import { ApiError } from '../errors/api_error';

export const errorHandler = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  return (err: ApiError, req: Request, res: Response, _next: Function) => {
    logger.error('Error: ', err);
    res
      .status(err.status || StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: err.message || 'Internal server error' });
  };
};
