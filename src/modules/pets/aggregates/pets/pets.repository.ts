import { addAuditableSchema, MongoRepository } from '@app/core';
import mongoose from 'mongoose';
import { PetSpecies, PetGenders, Pet } from '../pets/interfaces';

export const PetSchema = new mongoose.Schema(
  addAuditableSchema({
    name: String,
    species: {
      type: String,
      enum: [PetSpecies.CAT, PetSpecies.DOG],
    },
    breed: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Breed',
    },
    avatarUrl: String,
    dob: Date,
    gender: {
      type: String,
      enum: [PetGenders.NEUTERIZED, PetGenders.FEMALE, PetGenders.MALE],
    },
    weight: Number,
    allergies: String,
    vetName: String,
    vetPhoneNo: String,
    vetAddress: String,
    vaccinationDue: Date,
    dewormDue: Date,
    proofOfCurrentVaccinations: [String],
  }),
);
PetSchema.index({ name: 'text' })
  .index({ species: 1 })
  .index({ breed: 1 })
  .index({ gender: 1 });

export const PetsModel = mongoose.model('Pet', PetSchema);

export const petsRepository = new MongoRepository<Pet>(PetsModel, ['breed']);
