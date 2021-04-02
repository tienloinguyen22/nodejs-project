import admin from 'firebase-admin';
import { deviceTokensRepository } from '../../modules/notifications/aggregates/device_tokens/device_tokens.repository';
import { notificationsRepository } from '../../modules/notifications/aggregates/notifications/notifications.repository';
import { PushNotificationPayload } from '../interfaces/push_notification_payload';
import { createObjectId } from './create_object_id';

export const pushNotification = async (payload: PushNotificationPayload): Promise<void> => {
  // 1. Create notification record
  await notificationsRepository.create({
    _id: createObjectId(),
    type: payload.type,
    booking: payload.booking,
    read: false,
    user: payload.user,
    createdAt: new Date().getTime(),
    createdBy: payload.user,
  });

  // 2. Get all device token + push noti
  const deviceTokens = await deviceTokensRepository.findAll({ user: payload.user });
  const messages = deviceTokens.map((deviceToken) => {
    return {
      token: deviceToken.token,
      notification: payload.notification,
      data: { bookingId: payload.booking._id.toString() },
    };
  });
  await admin.messaging().sendAll(messages);
};
