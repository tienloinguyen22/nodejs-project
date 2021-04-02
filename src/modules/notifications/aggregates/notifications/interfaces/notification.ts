import { IsAuditable } from '../../../../../core';
import { Booking } from '../../../../bookings/aggregates/bookings/interfaces';

export enum NotificationTypes {
  CHECK_IN = 'CHECK_IN',
  CHECK_OUT = 'CHECK_OUT',
  BOOKING_CONFIRM = 'BOOKING_CONFIRM',
  BOOKING_SERVICE_UPDATE = 'BOOKING_SERVICE_UPDATE',
  BOOKING_FINISHED = 'BOOKING_FINISHED',
}

export interface Notification extends IsAuditable {
  _id: string;
  type: NotificationTypes;
  booking: Booking;
  read: boolean;
  user: string; // User ID
}
