import { Container } from 'typedi';
import Agenda from 'agenda';
import mailgun from 'mailgun-js';
import { logger } from './logger';
import { agendaFactory } from './agenda_factory';
import { configs } from '../configs';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const dependencyInjector = ({ mongoConnection, models }: any): { agenda: Agenda.Agenda } => {
  try {
    const agenda = agendaFactory({ mongoConnection });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    models.forEach((model: any) => {
      Container.set(model.name, model.model);
    });
    Container.set('agenda', agenda);
    Container.set('logger', logger);
    Container.set(
      'emailClient',
      mailgun({
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        apiKey: configs.emails.apiKey!,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        domain: configs.emails.domain!,
      }),
    );
    logger.info('🚀  Agenda injected into container');
    return { agenda };
  } catch (e) {
    logger.error('🔥 Error on dependency injector loader: %o', e);
    throw e;
  }
};
