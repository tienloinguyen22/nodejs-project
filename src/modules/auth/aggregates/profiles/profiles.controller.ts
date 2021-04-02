import express from 'express';
import { authenticate } from '@app/core';
import { update, get } from './services';

export const profilesController = express.Router();
profilesController.get('/', authenticate(), get);
profilesController.patch('/', authenticate(), update);
