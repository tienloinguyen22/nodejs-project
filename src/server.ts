import { config } from '@app/config';
import express from 'express';
import helmet from 'helmet';
import compress from 'compression';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import morgan from 'morgan';
import { StatusCodes } from 'http-status-codes';
import {
  logger,
  startDatabase,
  bulidSwaggerDocs,
  errorHandler,
  verifyToken,
  initializeFirebase,
  requestLogger,
} from './core';
import { usersController } from './modules/auth/aggregates/users/users.controller';
import { rolesController } from './modules/auth/aggregates/roles/roles.controller';
import { profilesController } from './modules/auth/aggregates/profiles/profiles.controller';
import { authController } from './modules/auth/aggregates/auth/auth.controller';
import { uploadsController } from './modules/uploads/aggregates/uploads/uploads.controller';
import { breedsController } from './modules/pets/aggregates/breeds/breeds.controller';
import { petsController } from './modules/pets/aggregates/pets/pets.controller';
import { branchesController } from './modules/branches/aggregates/branches/branches.controller';
import { servicesController } from './modules/services/aggregates/services/services.controller';
import { bookingsController } from './modules/bookings/aggregates/bookings/bookings.controller';
import { deviceTokensController } from './modules/notifications/aggregates/device_tokens/device_tokens.controller';
import { notificationsController } from './modules/notifications/aggregates/notifications/notifications.controller';

(async () => {
  // 0. connect to mongo
  logger.info(`[Server] Initialize mongo ...`);
  await startDatabase(config.database.connectionString);

  // 1. bootstrap firebase
  logger.info(`[Server] Initialize firebase.....`);
  initializeFirebase();

  // 2. bootstrap server
  const server = express();
  server
    .use(helmet())
    .use(compress())
    .use(bodyParser.json())
    .use(bodyParser.urlencoded({ extended: true }))
    .use(cookieParser())
    .use(morgan('combined'))
    .use(requestLogger())
    .use(
      cors({
        origin: config.cors.whitelistUrls,
        credentials: true,
      }),
    )
    .use('/images', express.static('uploads/images'))
    .use(verifyToken());

  // 3. setup controllers
  server.use(`${config.api.prefix}/auth`, authController);
  server.use(`${config.api.prefix}/users`, usersController);
  server.use(`${config.api.prefix}/roles`, rolesController);
  server.use(`${config.api.prefix}/profiles`, profilesController);
  server.use(`${config.api.prefix}/breeds`, breedsController);
  server.use(`${config.api.prefix}/pets`, petsController);
  server.use(`${config.api.prefix}/branches`, branchesController);
  server.use(`${config.api.prefix}/services`, servicesController);
  server.use(`${config.api.prefix}/bookings`, bookingsController);
  server.use(`${config.api.prefix}/device-tokens`, deviceTokensController);
  server.use(`${config.api.prefix}/notifications`, notificationsController);
  server.use(`${config.api.prefix}/uploads`, uploadsController);
  server.use(errorHandler());

  // 4. setup swaggers
  const swaggerDocument = bulidSwaggerDocs();
  server.use(`${config.api.prefix}${config.api.docsUrl}`, swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  server.use(`${config.api.prefix}${config.api.docsJson}`, async (_req, res) => {
    res.status(StatusCodes.OK).json(swaggerDocument);
  });

  // 5. start server
  const port = parseInt(process.env.PORT ? process.env.PORT : '', 10) || 3000;
  server.listen(port);
  logger.info(`[Server] Server listens on port ${port} ...`);
})();
