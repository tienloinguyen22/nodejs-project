import express from 'express';
import { authenticate } from '../../../../core';
import { create, del } from './services';

export const deviceTokensController = express.Router();
deviceTokensController.post('/', authenticate(), create);
deviceTokensController.delete('/:token', authenticate(), del);
