import { Agenda, JobPriority } from 'agenda';
import { configs } from '../configs';
import { JobNames } from '../core';
import { sendEmail } from '../jobs';

export const jobsLoader = ({ agenda }: { agenda: Agenda }): void => {
  agenda.define(
    JobNames.SEND_EMAIL,
    {
      priority: JobPriority.high,
      concurrency: configs.agenda.concurrency,
    },
    sendEmail,
  );

  agenda.start();
};
