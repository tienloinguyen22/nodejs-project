import { Router } from 'express';
import { agendash } from '../modules/agendash/routes';
import { auth } from '../modules/auth/routes';

export const apis = (): Router => {
  const app = Router();
  auth(app);
  agendash(app);
  return app;
};
