import { Router } from 'express';
import agendashInitializer from 'agendash';
import basicAuth from 'express-basic-auth';
import { Container } from 'typedi';
import { configs } from '../../configs';

export const agendash = (app: Router): void => {
  const agenda = Container.get('agenda');
  app.use(
    '/agendash',
    basicAuth({
      users: { [configs.agendash.user as string]: configs.agendash.password as string },
      challenge: true,
    }),
    agendashInitializer(agenda),
  );
};
