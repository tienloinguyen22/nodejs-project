import { addAuditableSchema, MongoRepository } from '@app/core';
import mongoose from 'mongoose';
import { DeviceToken } from './interfaces';

export const DeviceTokenSchema = new mongoose.Schema(
  addAuditableSchema({
    token: String,
    user: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
    },
  }),
);
DeviceTokenSchema.index({ token: 1 }).index({ user: 1 });

export const DeviceTokensModel = mongoose.model('DeviceToken', DeviceTokenSchema);

export const deviceTokensRepository = new MongoRepository<DeviceToken>(DeviceTokensModel, []);
