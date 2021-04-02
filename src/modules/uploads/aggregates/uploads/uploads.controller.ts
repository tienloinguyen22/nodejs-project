import express from 'express';
import { authenticate, multerImages } from '@app/core';
import { uploadImages, deleteImages } from './services';

export const uploadsController = express.Router();
uploadsController.post('/images', authenticate(), multerImages.single('image'), uploadImages);
uploadsController.delete('/images/:filename', authenticate(), deleteImages);
