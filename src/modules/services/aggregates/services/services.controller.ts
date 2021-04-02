import express from 'express';
import { findAll } from './services';

export const servicesController = express.Router();
servicesController.get('/find-all', findAll);
