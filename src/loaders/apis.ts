import { Router } from 'express';
import { auth } from '../modules/auth/routes';

export const apis = (): Router => {
  const app = Router();
  auth(app);
  return app;
};
