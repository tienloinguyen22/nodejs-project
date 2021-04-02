import { addAuditableSchema, MongoRepository } from '@app/core';
import mongoose from 'mongoose';
import { BookingSchema } from '../../../bookings/aggregates/bookings/bookings.repository';
import { NotificationTypes, Notification } from './interfaces';

export const NotificationSchema = new mongoose.Schema(
  addAuditableSchema({
    type: {
      type: String,
      enum: [
        NotificationTypes.CHECK_IN,
        NotificationTypes.CHECK_OUT,
        NotificationTypes.BOOKING_CONFIRM,
        NotificationTypes.BOOKING_SERVICE_UPDATE,
      ],
    },
    booking: BookingSchema,
    read: {
      type: Boolean,
      default: false,
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
    },
  }),
);
NotificationSchema.index({ type: 1 }).index({ user: 1 });

export const NotificationsModel = mongoose.model('Notification', NotificationSchema);

export const notificationsRepository = new MongoRepository<Notification>(NotificationsModel, []);
