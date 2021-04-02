import { Router } from 'express';
import agendashInitializer from 'agendash';
import basicAuth from 'express-basic-auth';
import { configs } from '../../configs';
import { agendaFactory } from '../../loaders/agenda_factory';

export const agendash = (app: Router): void => {
  app.use(
    '/agendash',
    basicAuth({
      users: { [configs.agendash.user as string]: configs.agendash.password as string },
      challenge: true,
    }),
    agendashInitializer(agendaFactory()),
  );
};
