import express from 'express';
import { authorize, permissions } from '@app/core';
import { create, update, find, remove } from './services';

export const petsController = express.Router();
petsController.get('/', authorize(permissions.PETS.VIEW), find);
petsController.post('/', authorize(permissions.PETS.CREATE), create);
petsController.patch('/:id', authorize(permissions.PETS.UPDATE), update);
petsController.delete('/:id', authorize(permissions.PETS.DELETE), remove);
