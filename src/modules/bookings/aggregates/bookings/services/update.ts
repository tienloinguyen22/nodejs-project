/* eslint-disable no-restricted-syntax */
/* eslint-disable object-curly-newline */
import { Response, Request } from 'express';
import * as yup from 'yup';
import {
  validatePayload,
  ApiError,
  addModificationInfo,
  pushNotification,
  getTimezoneDifferent,
  sendEmail,
  MailServices,
} from '@app/core';
import { StatusCodes } from 'http-status-codes';
import ejs from 'ejs';
import moment from 'moment';
import path from 'path';
import { BookingStatuses, CreateBookingServicePayload, PickupOptions, UpdateBookingPayload } from '../interfaces';
import { servicesRepository } from '../../../../services/aggregates/services/services.repository';
import { validateBookingServices } from '../../../helpers';
import { petsRepository } from '../../../../pets/aggregates/pets/pets.repository';
import { bookingsRepository } from '../bookings.repository';
import { branchesRepository } from '../../../../branches/aggregates/branches/branches.repository';
import { NotificationTypes } from '../../../../notifications/aggregates/notifications/interfaces';

export const update = async (req: Request, res: Response, next: Function): Promise<void> => {
  try {
    const { id } = req.params;
    // eslint-disable-next-line prefer-destructuring
    const body: UpdateBookingPayload = req.body;

    // 0. Validate booking
    const existedBooking = await bookingsRepository.findById(id);
    if (!existedBooking) {
      throw new ApiError(`Booking not found`, StatusCodes.NOT_FOUND);
    }
    const notAllowedUpdateStatuses = [BookingStatuses.FINISHED, BookingStatuses.CANCELLED];
    if (notAllowedUpdateStatuses.includes(existedBooking.status)) {
      throw new ApiError(`Can't update booking that already ${existedBooking.status}`, StatusCodes.BAD_REQUEST);
    }

    // 1. Validate body
    await validatePayload(
      {
        pet: yup.string().required('Pet is required'),
        pickupOption: yup
          .string()
          .required('Pick up option is required')
          .oneOf([PickupOptions.BIKE, PickupOptions.CAR, PickupOptions.NONE], 'Invalid pickup option'),
        services: yup
          .array()
          .required('Services is required')
          .of(
            yup.object().shape({
              service: yup.string().required('Service is required'),
              roomOption: yup.string().nullable(true),
              roomType: yup.string().nullable(true),
              extraCares: yup.array().nullable(true),
              checkInTime: yup.string().required('Check in time is required'),
              checkOutTime: yup.string().nullable(true),
            }),
          ),
        additionalFees: yup
          .array()
          .nullable(true)
          .of(
            yup.object().shape({
              title: yup.string().required('Addional fee title is required'),
              price: yup
                .number()
                .required('Addional fee price is required')
                .min(1000, 'Invalid addional fee (>= 1000)'),
            }),
          ),
        note: yup.string().nullable(true),
        branch: yup.string().required('Branch location is required'),
        checkoutNote: yup.string().nullable(true),
      },
      body,
    );

    // 2. Validate pet
    const existedPet = await petsRepository.findById(body.pet);
    if (!existedPet) {
      throw new ApiError(`Pet not found`, StatusCodes.NOT_FOUND);
    }

    // 3. Validate branch location
    const existedBranch = await branchesRepository.findById(body.branch);
    if (!existedBranch) {
      throw new ApiError(`Location not found`, StatusCodes.NOT_FOUND);
    }

    // 4. Find services
    const selectedServices = await servicesRepository.findAll({
      _id: { $in: body.services.map((item: CreateBookingServicePayload) => item.service) },
    });

    // 5. Validate service
    const validateBookingServicesResult = validateBookingServices(body, selectedServices, existedPet);
    let { totalPrice } = validateBookingServicesResult;

    // 6. Validate additional fees
    const additionalFees = body.additionalFees || [];
    for (const item of additionalFees) {
      totalPrice += item.price;
    }

    // 6. Update
    const newBookingInfo = await bookingsRepository.update({
      _id: existedBooking._id,
      pet: existedPet,
      pickupOption: body.pickupOption,
      services: validateBookingServicesResult.bookingServices,
      note: body.note,
      totalPrice,
      branch: existedBranch,
      additionalFees,
      checkoutNote: body.checkoutNote,
      ...addModificationInfo(req),
    });
    res.status(StatusCodes.OK).json(newBookingInfo);

    // 7. Push notification
    await pushNotification({
      user: newBookingInfo.petOwner._id,
      type: NotificationTypes.BOOKING_SERVICE_UPDATE,
      booking: newBookingInfo,
      notification: {
        title: 'B&P Booking updated',
        body: `Services were updated in ${newBookingInfo.pet.name}'s Booking at ${newBookingInfo.branch.name}`,
      },
    });

    // 8. Send Email
    const checkInTime = moment(newBookingInfo.services[0].checkInTime)
      .add(getTimezoneDifferent(), 'hour')
      .format('hh:mm A, DD/MM/YYYY');
    ejs.renderFile(
      path.join(__dirname, '../../../../../core/mailer/templates/edit_booking.ejs'),
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
          console.log(`🚀 Error renderring 'update_booking.ejs'`, err);
        } else {
          sendEmail(MailServices.GMAIL, {
            to: newBookingInfo.petOwner.email,
            subject: 'Bed & Pets First - Cập Nhật Thông Tin Lịch Hẹn',
            html,
          });
        }
      },
    );
  } catch (error) {
    next(error);
  }
};
