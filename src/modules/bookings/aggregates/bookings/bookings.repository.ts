import mongoose from 'mongoose';
import { addAuditableSchema, MongoRepository } from '../../../../core';
import { UserSchema } from '../../../auth/aggregates/users/users.repository';
import { BranchesSchema } from '../../../branches/aggregates/branches/branches.repository';
import { PetSchema } from '../../../pets/aggregates/pets/pets.repository';
import { PriceTypes } from '../../../services/aggregates/services/interfaces';
import {
  PriceConfigSchema,
  RoomOptionSchema,
  RoomTypeSchema,
  ServiceSchema,
} from '../../../services/aggregates/services/services.repository';
import { Booking, BookingStatuses, PickupOptions } from './interfaces';

const BookingExtraCareSchema = new mongoose.Schema({
  name: String,
  priceType: {
    type: String,
    enum: [PriceTypes.FIXED, PriceTypes.BASE_ON_WEIGHT],
  },
  price: Number,
  priceConfigs: [PriceConfigSchema],
  quantityPerDay: Number,
  unit: String,
  quantity: Number,
});

const BookingServiceSchema = new mongoose.Schema({
  service: ServiceSchema,
  roomOption: RoomOptionSchema,
  roomType: RoomTypeSchema,
  extraCares: [BookingExtraCareSchema],
  quantity: Number,
  price: Number,
  checkInTime: Date,
  checkOutTime: Date,
  lateCheckoutFee: Number,
});

const BookingAdditionalFeeSchema = new mongoose.Schema({
  title: String,
  price: Number,
});

export const BookingSchema = new mongoose.Schema(
  addAuditableSchema({
    pet: PetSchema,
    petOwner: UserSchema,
    pickupOption: {
      type: String,
      enum: [PickupOptions.BIKE, PickupOptions.CAR, PickupOptions.NONE],
    },
    services: [BookingServiceSchema],
    branch: BranchesSchema,
    note: String,
    totalPrice: Number,
    status: {
      type: String,
      enum: [
        BookingStatuses.PENDING,
        BookingStatuses.UPCOMMING,
        BookingStatuses.IN_PROGRESS,
        BookingStatuses.FINISHED,
        BookingStatuses.CANCELLED,
      ],
      default: BookingStatuses.PENDING,
    },
    additionalFees: [BookingAdditionalFeeSchema],
    checkoutNote: String,
    rating: Number,
    review: String,
  }),
);
BookingSchema.index({
  'pet.name': 'text',
  'petOwner.fullName': 'text',
  'petOwner.phoneNo': 'text',
  'petOwner.email': 'text',
})
  .index({ 'branch._id': 1 })
  .index({ 'services.service._id': 1 });

export const BookingsModel = mongoose.model('Booking', BookingSchema);

export const bookingsRepository = new MongoRepository<Booking>(BookingsModel, ['pet.breed']);
