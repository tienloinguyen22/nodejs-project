import express from 'express';
import { login } from './services';

export const authController = express.Router();
authController.post('/login', login);
