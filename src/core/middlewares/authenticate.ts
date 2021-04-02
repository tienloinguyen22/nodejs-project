import { Response, Request } from 'express';
import _ from 'lodash';
import { StatusCodes } from 'http-status-codes';
import { ApiError } from '../errors/api_error';

export const authenticate = () => {
  return (req: Request, _res: Response, next: Function) => {
    if (!_.get(req, 'user._id')) {
      throw new ApiError('Not authenticated', StatusCodes.FORBIDDEN);
    } else {
      next();
    }
  };
};
