/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-param-reassign */

import { Response, Request } from 'express';
import admin from 'firebase-admin';
import { usersRepository } from '../../modules/auth/aggregates/users/users.repository';
import { logger } from '../loggers';

export const verifyToken = () => {
  return async (req: Request, res: Response, next: Function) => {
    try {
      const bearerToken = req.get('Authorization');
      if (!bearerToken) {
        next();
      } else {
        const token = bearerToken.replace('Bearer ', '');
        const verifyIdToken = await admin.auth().verifyIdToken(token);
        const user = await usersRepository.findOne({ firebaseId: verifyIdToken.uid });
        (req as any).user = user;
        next();
      }
    } catch (error) {
      logger.error('Verify token error: ', error);
      next();
    }
  };
};
