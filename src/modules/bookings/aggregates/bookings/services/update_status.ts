import { Response, Request } from 'express';
import { StatusCodes } from 'http-status-codes';
import * as yup from 'yup';
import ejs from 'ejs';
import moment from 'moment';
import path from 'path';
import {
  addModificationInfo,
  ApiError,
  getTimezoneDifferent,
  MailServices,
  pushNotification,
  sendEmail,
  validatePayload,
} from '../../../../../core';
import { NotificationTypes } from '../../../../notifications/aggregates/notifications/interfaces';
import { bookingsRepository } from '../bookings.repository';
import { BookingStatuses, UpdateBookingStatusPayload } from '../interfaces';

export const updateStatus = async (req: Request, res: Response, next: Function): Promise<void> => {
  try {
    // eslint-disable-next-line prefer-destructuring
    const body: UpdateBookingStatusPayload = req.body;
    const { id } = req.params;

    // 1. Validate body
    await validatePayload(
      {
        status: yup
          .string()
          .required('Status is required')
          .oneOf(
            [
              BookingStatuses.PENDING,
              BookingStatuses.UPCOMMING,
              BookingStatuses.IN_PROGRESS,
              BookingStatuses.FINISHED,
              BookingStatuses.CANCELLED,
            ],
            'Invalid booking status',
          ),
      },
      body,
    );

    // 2. Validate booking
    const existedBooking = await bookingsRepository.findById(id);
    if (!existedBooking) {
      throw new ApiError(`Booking not found`, StatusCodes.NOT_FOUND);
    }

    // 3. Validate booking status
    const notAllowedUpdateStatuses = [BookingStatuses.FINISHED, BookingStatuses.CANCELLED];
    if (notAllowedUpdateStatuses.includes(existedBooking.status)) {
      throw new ApiError(`Can't update booking that already ${existedBooking.status}`, StatusCodes.BAD_REQUEST);
    }

    // 4. Update
    const newBookingInfo = await bookingsRepository.update({
      _id: existedBooking._id,
      status: body.status,
      ...addModificationInfo(req),
    });
    res.status(StatusCodes.OK).json(newBookingInfo);

    // 5. Push notification
    if (newBookingInfo.status === BookingStatuses.UPCOMMING || newBookingInfo.status === BookingStatuses.FINISHED) {
      const notificationType =
        newBookingInfo.status === BookingStatuses.UPCOMMING
          ? NotificationTypes.BOOKING_CONFIRM
          : NotificationTypes.BOOKING_FINISHED;
      const notificationContent =
        newBookingInfo.status === BookingStatuses.UPCOMMING
          ? {
              title: 'B&P Booking confirmed',
              body: `Booking for ${newBookingInfo.pet.name} at ${newBookingInfo.branch.name} is successfully confirmed`,
            }
          : {
              title: 'B&P Booking finished',
              body: `Your booking at ${newBookingInfo.branch.name} for ${newBookingInfo.pet.name} has beed finished`,
            };
      await pushNotification({
        user: newBookingInfo.petOwner._id,
        type: notificationType,
        booking: newBookingInfo,
        notification: notificationContent,
      });
    }

    // 6. Send Email
    if (newBookingInfo.status === BookingStatuses.UPCOMMING) {
      const checkInTime = moment(newBookingInfo.services[0].checkInTime)
        .add(getTimezoneDifferent(), 'hour')
        .format('hh:mm A, DD/MM/YYYY');
      ejs.renderFile(
        path.join(__dirname, '../../../../../core/mailer/templates/confirm_booking.ejs'),
        {
          customerName: newBookingInfo.petOwner.fullName,
          petName: newBookingInfo.pet.name,
          weight: newBookingInfo.pet.weight,
          checkInTime,
          branch: newBookingInfo.branch.location,
        },
        (err, html) => {
          if (err) {
            // eslint-disable-next-line no-console
            console.log(`🚀 Error renderring 'confirm_booking.ejs'`, err);
          } else {
            sendEmail(MailServices.GMAIL, {
              to: newBookingInfo.petOwner.email,
              subject: 'Bed & Pets First - Xác Nhận Lịch Hẹn',
              html,
            });
          }
        },
      );
    } else if (newBookingInfo.status === BookingStatuses.CANCELLED) {
      const checkInTime = moment(newBookingInfo.services[0].checkInTime)
        .add(getTimezoneDifferent(), 'hour')
        .format('hh:mm A, DD/MM/YYYY');
      ejs.renderFile(
        path.join(__dirname, '../../../../../core/mailer/templates/cancel_booking.ejs'),
        {
          customerName: newBookingInfo.petOwner.fullName,
          petName: newBookingInfo.pet.name,
          checkInTime,
          branch: newBookingInfo.branch.location,
        },
        (err, html) => {
          if (err) {
            // eslint-disable-next-line no-console
            console.log(`🚀 Error renderring 'cancel_booking.ejs'`, err);
          } else {
            sendEmail(MailServices.GMAIL, {
              to: newBookingInfo.petOwner.email,
              subject: 'Bed & Pets First - Hủy Lịch Hẹn',
              html,
            });
          }
        },
      );
    }
  } catch (error) {
    next(error);
  }
};
