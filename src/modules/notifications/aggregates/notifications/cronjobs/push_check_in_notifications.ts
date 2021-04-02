import { CronJob } from 'cron';
import moment from 'moment';
import { getTimezoneDifferent, pushNotification } from '../../../../../core';
import { bookingsRepository } from '../../../../bookings/aggregates/bookings/bookings.repository';
import { Booking, BookingStatuses } from '../../../../bookings/aggregates/bookings/interfaces';
import { NotificationTypes } from '../interfaces';

export const pushCheckInNotificationsJob = new CronJob('0 25,55 */1 * * *', async () => {
  // Before 1 hour
  const before1HourStartTime = moment().add(60, 'minute');
  const before1HourEndTime = moment().add(70, 'minute');
  const checkInBefore1HourCursor = await bookingsRepository.findAllCursor({
    status: { $in: [BookingStatuses.PENDING, BookingStatuses.UPCOMMING, BookingStatuses.IN_PROGRESS] },
    'services.0.checkInTime': {
      $gte: new Date(before1HourStartTime.toISOString()),
      $lte: new Date(before1HourEndTime.toISOString()),
    },
  });

  checkInBefore1HourCursor.on('data', async (booking: Booking) => {
    checkInBefore1HourCursor.pause();
    await pushNotification({
      user: booking.petOwner._id,
      type: NotificationTypes.CHECK_IN,
      booking,
      notification: {
        title: 'B&P Check-in',
        body: `Please be noted to check-in for ${booking.pet.name} at ${booking.branch.name} at ${moment(
          booking.services[0].checkInTime,
        )
          .add(getTimezoneDifferent(), 'hour')
          .format('hh:mm A, DD/MM')}`,
      },
    });
    checkInBefore1HourCursor.resume();
  });

  checkInBefore1HourCursor.on('end', () => {
    // eslint-disable-next-line no-console
    console.log(`
      [Cronjob] Finish "Push check in notifications before 1 hour job":
        startTime: ${before1HourStartTime.toISOString()}
        endTime: ${before1HourEndTime.toISOString()}
    `);
    checkInBefore1HourCursor.close();
  });

  // Before 12 hour
  const before12HourStartTime = moment().add(12 * 60, 'minute');
  const before12HourEndTime = moment().add(12 * 60 + 10, 'minute');
  const checkInBefore12HourCursor = await bookingsRepository.findAllCursor({
    status: { $in: [BookingStatuses.PENDING, BookingStatuses.UPCOMMING, BookingStatuses.IN_PROGRESS] },
    'services.0.checkInTime': {
      $gte: new Date(before12HourStartTime.toISOString()),
      $lte: new Date(before12HourEndTime.toISOString()),
    },
  });

  checkInBefore12HourCursor.on('data', async (booking: Booking) => {
    checkInBefore1HourCursor.pause();
    await pushNotification({
      user: booking.petOwner._id,
      type: NotificationTypes.CHECK_IN,
      booking,
      notification: {
        title: 'B&P Check-in',
        body: `Please be noted to check-in for ${booking.pet.name} at ${booking.branch.name} at ${moment(
          booking.services[0].checkInTime,
        )
          .add(getTimezoneDifferent(), 'hour')
          .format('hh:mm A, DD/MM')}`,
      },
    });
    checkInBefore1HourCursor.resume();
  });

  checkInBefore12HourCursor.on('end', () => {
    // eslint-disable-next-line no-console
    console.log(`
      [Cronjob] Finish "Push check in notifications before 12 hours job":
        startTime: ${before12HourStartTime.toISOString()}
        endTime: ${before12HourEndTime.toISOString()}
    `);
    checkInBefore12HourCursor.close();
  });
});
