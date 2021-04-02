import express from 'express';
import { permissions, authorize } from '@app/core';
import { create, find, updateStatus, update, updatePet, findById, review } from './services';

export const bookingsController = express.Router();
bookingsController.get('/', authorize(permissions.BOOKINGS.VIEW), find);
bookingsController.post('/', authorize(permissions.BOOKINGS.CREATE), create);
bookingsController.get('/:id', authorize(permissions.BOOKINGS.VIEW), findById);
bookingsController.patch('/:id', authorize(permissions.BOOKINGS.UPDATE), update);
bookingsController.patch('/:id/status', authorize(permissions.BOOKINGS.UPDATE), updateStatus);
bookingsController.patch('/:id/pet', authorize(permissions.BOOKINGS.UPDATE), updatePet);
bookingsController.patch('/:id/review', authorize(permissions.BOOKINGS.UPDATE), review);
