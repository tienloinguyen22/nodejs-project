import Agenda from 'agenda';
import { configs } from '../configs';

let agenda: Agenda | undefined;

export const agendaFactory = (): Agenda => {
  if (!agenda) {
    agenda = new Agenda({
      db: {
        address: configs.databaseURL,
        collection: configs.agenda.dbCollection,
      },
      processEvery: configs.agenda.pooltime,
      maxConcurrency: configs.agenda.concurrency,
    });
  }
  return agenda;
};
