import express from 'express';
import { permissions, authorize } from '@app/core';
import { find } from './services';

export const breedsController = express.Router();
breedsController.get('/', authorize(permissions.BREEDS.VIEW), find);
