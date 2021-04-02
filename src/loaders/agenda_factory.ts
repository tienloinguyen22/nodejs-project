import { Agenda } from 'agenda';
import { configs } from '../configs';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const agendaFactory = ({ mongoConnection }: { mongoConnection: any }): Agenda => {
  return new Agenda({
    mongo: mongoConnection,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    db: { collection: configs.agenda.dbCollection } as any,
    processEvery: configs.agenda.pooltime,
    maxConcurrency: configs.agenda.concurrency,
  });
};
