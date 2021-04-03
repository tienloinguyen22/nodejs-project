import { Router } from 'express';
import { auth } from '../modules/auth/controller';

export const apis = (): Router => {
  const app = Router();
  auth(app);
  return app;
};
