import express from 'express';
import { authorize, permissions } from '../../../../core';
import { findAll, update } from './services';

export const branchesController = express.Router();
branchesController.get('/find-all', findAll);
branchesController.patch('/:id', authorize(permissions.BRANCHES.UPDATE), update);
