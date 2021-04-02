/* eslint-disable no-restricted-syntax */
/* eslint-disable object-curly-newline */
import { Response, Request } from 'express';
import * as yup from 'yup';
import {
  validatePayload,
  addCreationInfo,
  createObjectId,
  ApiError,
  getTimezoneDifferent,
  sendEmail,
  MailServices,
} from '@app/core';
import { StatusCodes } from 'http-status-codes';
import ejs from 'ejs';
import path from 'path';
import moment from 'moment';
import { usersRepository } from '../../../../auth/aggregates/users/users.repository';
import { CreateBookingPayload, CreateBookingServicePayload, PickupOptions } from '../interfaces';
import { servicesRepository } from '../../../../services/aggregates/services/services.repository';
import { validateBookingServices } from '../../../helpers';
import { petsRepository } from '../../../../pets/aggregates/pets/pets.repository';
import { bookingsRepository } from '../bookings.repository';
import { branchesRepository } from '../../../../branches/aggregates/branches/branches.repository';

export const create = async (req: Request, res: Response, next: Function): Promise<void> => {
  try {
    // eslint-disable-next-line prefer-destructuring
    const body: CreateBookingPayload = req.body;

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
        note: yup.string().nullable(true),
        branch: yup.string().required('Branch location is required'),
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

    // 6. Create
    const petOwner = existedPet.createdBy ? await usersRepository.findById(existedPet.createdBy) : undefined;
    const newBooking = await bookingsRepository.create({
      _id: createObjectId(),
      pet: existedPet,
      petOwner,
      pickupOption: body.pickupOption,
      services: validateBookingServicesResult.bookingServices,
      note: body.note,
      totalPrice: validateBookingServicesResult.totalPrice,
      branch: existedBranch,
      ...addCreationInfo(req),
    });
    res.status(StatusCodes.OK).json(newBooking);

    // 7. Send email to admin
    const checkInTime = moment(newBooking.services[0].checkInTime)
      .add(getTimezoneDifferent(), 'hour')
      .format('hh:mm A, DD/MM/YYYY');
    ejs.renderFile(
      path.join(__dirname, '../../../../../core/mailer/templates/create_booking.ejs'),
      {
        customerName: newBooking.petOwner.fullName,
        petName: newBooking.pet.name,
        weight: newBooking.pet.weight,
        checkInTime,
        branch: newBooking.branch.location,
        bookingUrl: `https://pet-hotel-admin.mindxtech.com/bookings/${String(newBooking._id)}`,
      },
      (err, html) => {
        if (err) {
          // eslint-disable-next-line no-console
          console.log(`🚀 Error renderring 'create_booking.ejs'`, err);
        } else {
          sendEmail(MailServices.GMAIL, {
            to: 'bedandpetfirst@gmail.com',
            subject: 'Bed & Pets First - Lịch Hẹn mới',
            html,
          });
        }
      },
    );
  } catch (error) {
    next(error);
  }
};
