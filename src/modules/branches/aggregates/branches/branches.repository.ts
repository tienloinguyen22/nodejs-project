import { addAuditableSchema, MongoRepository } from '@app/core';
import mongoose from 'mongoose';
import { Branch } from './interfaces';

export const BranchesSchema = new mongoose.Schema(
  addAuditableSchema({
    name: String,
    location: String,
    avatarImageUrl: String,
    locationImageUrl: String,
    description: {
      vi: String,
      en: String,
    },
    phoneNumber: String,
    availableServices: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Service',
        default: [],
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
  }),
);
BranchesSchema.index({
  name: 'text',
  location: 'text',
}).index({ isActive: 1 });

export const BranchesModel = mongoose.model('Branch', BranchesSchema);

export const branchesRepository = new MongoRepository<Branch>(BranchesModel, ['availableServices']);
