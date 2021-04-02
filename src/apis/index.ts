import { Router } from 'express';
import { agendash } from './routes/agendash';
import { auth } from './routes/auth';

export const apis = (): Router => {
  const app = Router();
  auth(app);
  agendash(app);
  return app;
};
