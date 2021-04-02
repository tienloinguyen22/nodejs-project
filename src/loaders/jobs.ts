import { Agenda } from 'agenda';

export const jobsLoader = ({ agenda }: { agenda: Agenda }): void => {
  // agenda.define(
  //   'send-email',
  //   {
  //     priority: JobPriority.high,
  //     concurrency: configs.agenda.concurrency,
  //   },
  //   new EmailSequenceJob().handler,
  // );
  agenda.start();
};
