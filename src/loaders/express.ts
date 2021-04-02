import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import morgan from 'morgan';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import agendashInitializer from 'agendash';
import basicAuth from 'express-basic-auth';
import { errorHandler } from '../core';
import { configs } from '../configs';
import { apis } from './apis';
import { agendaFactory } from './agenda_factory';

export const expressLoader = ({ app }: { app: express.Application }): void => {
  // Health Check
  app.get('/status', (req, res) => {
    res.status(200).end();
  });
  app.head('/status', (req, res) => {
    res.status(200).end();
  });

  // Useful if you're behind a reverse proxy (Heroku, Bluemix, AWS ELB, Nginx, etc)
  // It shows the real origin IP in the heroku or Cloudwatch logs
  app.enable('trust proxy');
  app.use(cors());
  app.use(cookieParser());
  app.use(bodyParser.json());
  app.use(helmet());
  app.use(morgan('[:date[iso]] :method :url :status :response-time ms - :res[content-length]'));
  app.use(compression());
  app.use(
    '/agendash',
    basicAuth({
      users: { [configs.agendash.user as string]: configs.agendash.password as string },
      challenge: true,
    }),
    agendashInitializer(agendaFactory()),
  );

  // Load API routes
  app.use(configs.api.prefix, apis());

  // Error handlers
  app.use(errorHandler());
};
