import { addAuditableSchema, MongoRepository } from '@app/core';
import mongoose from 'mongoose';
import { PetSpecies } from '../pets/interfaces';
import { Breed } from './interfaces';

const BreedSchema = new mongoose.Schema(
  addAuditableSchema({
    name: String,
    species: {
      type: String,
      required: true,
      enum: [PetSpecies.DOG, PetSpecies.CAT],
    },
    imageUrl: String,
    isActive: {
      type: Boolean,
      default: true,
    },
  }),
);
BreedSchema.index({ name: 'text' }).index({ species: 1 });

export const BreedsModel = mongoose.model('Breed', BreedSchema);

export const breedsRepository = new MongoRepository<Breed>(BreedsModel, []);
