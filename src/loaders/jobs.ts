import Agenda from 'agenda';
import { configs } from '../configs';
import { JobNames } from '../core';
import { sendEmail } from '../jobs';

export const jobsLoader = ({ agenda }: { agenda: Agenda }): void => {
  agenda.define(
    JobNames.SEND_EMAIL,
    {
      priority: 'high',
      concurrency: configs.agenda.concurrency,
    },
    sendEmail,
  );

  agenda.start();
};
