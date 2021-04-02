import bunyan from 'bunyan';
import { config } from '@app/config';

const logger: bunyan = bunyan.createLogger({
  name: config.appName,
  streams: [
    {
      level: 'debug',
      stream: process.stdout,
    },
  ],
});

export { logger };
