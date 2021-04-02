import { Response, Request } from 'express';
import { ApiError } from '@app/core';
import { StatusCodes } from 'http-status-codes';
import _ from 'lodash';
import { usersRepository } from '../../users/users.repository';

export const get = async (req: Request, res: Response, next: Function): Promise<void> => {
  try {
    const userId = _.get(req, 'user._id');
    const userProfile = await usersRepository.findById(userId);
    if (!userProfile) {
      throw new ApiError('Profile not found', StatusCodes.NOT_FOUND);
    }
    res.status(StatusCodes.OK).json(userProfile);
  } catch (error) {
    next(error);
  }
};
