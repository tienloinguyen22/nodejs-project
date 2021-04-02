import { CronJob } from 'cron';
import moment from 'moment';
import { getTimezoneDifferent, pushNotification } from '../../../../../core';
import { bookingsRepository } from '../../../../bookings/aggregates/bookings/bookings.repository';
import { Booking, BookingStatuses } from '../../../../bookings/aggregates/bookings/interfaces';
import { NotificationTypes } from '../interfaces';

export const pushCheckOutNotificationsJob = new CronJob('0 25,55 */1 * * *', async () => {
  // Before 1 hour
  const before1HourStartTime = moment().add(60, 'minute');
  const before1HourEndTime = moment().add(70, 'minute');
  const checkOutBefore1HourCursor = await bookingsRepository.findAllCursor({
    status: { $in: [BookingStatuses.PENDING, BookingStatuses.UPCOMMING, BookingStatuses.IN_PROGRESS] },
    'services.checkOutTime': {
      $gte: new Date(before1HourStartTime.toISOString()),
      $lte: new Date(before1HourEndTime.toISOString()),
    },
  });

  checkOutBefore1HourCursor.on('data', async (booking: Booking) => {
    checkOutBefore1HourCursor.pause();
    await pushNotification({
      user: booking.petOwner._id,
      type: NotificationTypes.CHECK_OUT,
      booking,
      notification: {
        title: 'B&P Check-out',
        body: `Please be noted to check-out for ${booking.pet.name} at ${booking.branch.name} at ${moment(
          booking.services[0].checkInTime,
        )
          .add(getTimezoneDifferent(), 'hour')
          .format('hh:mm A, DD/MM')}`,
      },
    });
    checkOutBefore1HourCursor.resume();
  });

  checkOutBefore1HourCursor.on('end', () => {
    // eslint-disable-next-line no-console
    console.log(`
      [Cronjob] Finish "Push check out notifications before 1 hour job":
        startTime: ${before1HourStartTime.toISOString()}
        endTime: ${before1HourEndTime.toISOString()}
    `);
    checkOutBefore1HourCursor.close();
  });

  // Before 17 hour
  const before17HourStartTime = moment().add(17 * 60, 'minute');
  const before17HourEndTime = moment().add(17 * 60 + 10, 'minute');
  const checkOutBefore17HourCursor = await bookingsRepository.findAllCursor({
    status: { $in: [BookingStatuses.PENDING, BookingStatuses.UPCOMMING, BookingStatuses.IN_PROGRESS] },
    'services.checkOutTime': {
      $gte: new Date(before17HourStartTime.toISOString()),
      $lte: new Date(before17HourEndTime.toISOString()),
    },
  });

  checkOutBefore17HourCursor.on('data', async (booking: Booking) => {
    checkOutBefore17HourCursor.pause();
    await pushNotification({
      user: booking.petOwner._id,
      type: NotificationTypes.CHECK_OUT,
      booking,
      notification: {
        title: 'B&P Check-out',
        body: `Please be noted to check-out for ${booking.pet.name} at ${booking.branch.name} at ${moment(
          booking.services[0].checkInTime,
        )
          .add(getTimezoneDifferent(), 'hour')
          .format('hh:mm A, DD/MM')}`,
      },
    });
    checkOutBefore17HourCursor.resume();
  });

  checkOutBefore17HourCursor.on('end', () => {
    // eslint-disable-next-line no-console
    console.log(`
      [Cronjob] Finish "Push check out notifications before 17 hours job":
        startTime: ${before17HourStartTime.toISOString()}
        endTime: ${before17HourEndTime.toISOString()}
    `);
    checkOutBefore1HourCursor.close();
  });
});
