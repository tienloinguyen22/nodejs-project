import admin from 'firebase-admin';
import { Booking } from '../../modules/bookings/aggregates/bookings/interfaces';
import { NotificationTypes } from '../../modules/notifications/aggregates/notifications/interfaces';

export interface PushNotificationPayload {
  user: string;
  type: NotificationTypes;
  booking: Booking;
  notification: admin.messaging.Notification;
}
