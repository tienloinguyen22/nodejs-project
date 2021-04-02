import express from 'express';
import { authorize, permissions } from '../../../../core';
import { find, read } from './services';
import './cronjobs';

export const notificationsController = express.Router();
notificationsController.get('/', authorize(permissions.NOTIFICATIONS.VIEW), find);
notificationsController.patch('/:id/read', authorize(permissions.NOTIFICATIONS.UPDATE), read);
