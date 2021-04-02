import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import morgan from 'morgan';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { errorHandler } from '../core';

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

  // Load API routes
  // app.use(config.api.prefix, routes());

  // Error handlers
  app.use(errorHandler());
};
