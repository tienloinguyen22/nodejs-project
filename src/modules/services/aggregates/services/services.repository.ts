import { addAuditableSchema, MongoRepository } from '@app/core';
import mongoose from 'mongoose';
import { PriceTypes, Service } from './interfaces';

export const PriceConfigSchema = new mongoose.Schema({
  price: Number,
  minWeight: Number,
  maxWeight: Number,
});

export const ExtraCareSchema = new mongoose.Schema({
  name: String,
  priceType: {
    type: String,
    enum: [PriceTypes.FIXED, PriceTypes.BASE_ON_WEIGHT],
  },
  price: Number,
  priceConfigs: [PriceConfigSchema],
  quantityPerDay: Number,
  unit: String,
});

export const RoomTypeSchema = new mongoose.Schema({
  _id: String,
  name: String,
  price: Number,
  minWeight: Number,
  maxWeight: Number,
});

export const RoomOptionSchema = new mongoose.Schema({
  name: String,
  shortDescription: {
    vi: String,
    en: String,
  },
  description: {
    vi: String,
    en: String,
  },
  roomTypes: [RoomTypeSchema],
  extraCares: [ExtraCareSchema],
});

export const ServiceSchema = new mongoose.Schema(
  addAuditableSchema({
    name: String,
    shortDescription: {
      vi: String,
      en: String,
    },
    description: {
      vi: String,
      en: String,
    },
    roomOptions: [RoomOptionSchema],
    priceType: {
      type: String,
      enum: [PriceTypes.FIXED, PriceTypes.BASE_ON_WEIGHT],
    },
    price: Number,
    priceConfigs: [PriceConfigSchema],
    extraCares: [ExtraCareSchema],
    isActive: {
      type: Boolean,
      default: true,
    },
  }),
);
ServiceSchema.index({
  name: 'text',
  'shortDescription.vi': 'text',
  'shortDescription.en': 'text',
  'description.vi': 'text',
  'description.en': 'text',
});

export const ServicesModel = mongoose.model('Service', ServiceSchema);

export const servicesRepository = new MongoRepository<Service>(ServicesModel, []);
