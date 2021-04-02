import { Response, Request } from 'express';
import { StatusCodes } from 'http-status-codes';
import * as yup from 'yup';
import _ from 'lodash';
import moment from 'moment';
import ejs from 'ejs';
import path from 'path';
import {
  addModificationInfo,
  ApiError,
  getRoomType,
  getTimezoneDifferent,
  MailServices,
  pushNotification,
  regex,
  sendEmail,
  validatePayload,
} from '../../../../../core';
import { breedsRepository } from '../../../../pets/aggregates/breeds/breeds.repository';
import { PetGenders, PetSpecies } from '../../../../pets/aggregates/pets/interfaces';
import { petsRepository } from '../../../../pets/aggregates/pets/pets.repository';
import { calculateLateCheckoutFee, calculateLateCheckoutTime, validateBookingServices } from '../../../helpers';
import { bookingsRepository } from '../bookings.repository';
import { BookingStatuses, CreateBookingPayload } from '../interfaces';
import { NotificationTypes } from '../../../../notifications/aggregates/notifications/interfaces';

export const updatePet = async (req: Request, res: Response, next: Function): Promise<void> => {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { body } = req as any;
    const { id } = req.params;

    // 2. Validate body
    await validatePayload(
      {
        name: yup.string().nullable(true),
        species: yup
          .string()
          .nullable(true)
          .oneOf([PetSpecies.CAT, PetSpecies.DOG], 'Invalid species'),
        breed: yup
          .string()
          .nullable(true)
          .test('EXISTED_BREED', 'Breed not found', async (breed: string) => {
            const existedBreed = await breedsRepository.findOne({
              _id: breed,
              isActive: true,
            });
            return Boolean(existedBreed);
          }),
        avatarUrl: yup
          .string()
          .nullable(true)
          .matches(regex.imageExt, 'Invalid image URL'),
        dob: yup.string().required('DOB is required'),
        gender: yup
          .string()
          .nullable(true)
          .oneOf([PetGenders.NEUTERIZED, PetGenders.FEMALE, PetGenders.MALE], 'Invalid pet gender'),
        weight: yup
          .number()
          .nullable(true)
          .min(0.5, 'Weight too small (>= 0.5kg)'),
        allergies: yup.string().nullable(true),
        vetName: yup.string().nullable(true),
        vetPhoneNo: yup
          .string()
          .nullable(true)
          .test('VALID_PHONE_NUMBER', 'Invalid vet phone number', (vetPhoneNo: string) => {
            if (!vetPhoneNo) {
              return true;
            }
            return regex.phoneNumber.test(vetPhoneNo);
          }),
        vetAddress: yup.string().nullable(true),
        vaccinationDue: yup
          .string()
          .nullable(true)
          .test('VALID_ISODATE', 'Invalid vaccination due', (vaccinationDue: string) => {
            if (!vaccinationDue) {
              return true;
            }
            return regex.isoDate.test(vaccinationDue);
          }),
        dewormDue: yup
          .string()
          .nullable(true)
          .test('VALID_ISODATE', 'Invalid deworm due', (dewormDue: string) => {
            if (!dewormDue) {
              return true;
            }
            return regex.isoDate.test(dewormDue);
          }),
        proofOfCurrentVaccinations: yup
          .array()
          .nullable(true)
          .of(yup.string())
          .test('VALID_IMAGE_URL', 'Invalid image URL', (proofOfCurrentVaccinations: string[]) => {
            if (!proofOfCurrentVaccinations) {
              return true;
            }

            let result = true;
            // eslint-disable-next-line no-restricted-syntax
            for (const item of proofOfCurrentVaccinations) {
              if (!regex.imageExt.test(item)) {
                result = false;
                break;
              }
            }
            return result;
          }),
      },
      body,
    );

    // 3. Validate booking
    const existedBooking = await bookingsRepository.findById(id);
    if (!existedBooking) {
      throw new ApiError(`Booking not found`, StatusCodes.NOT_FOUND);
    }

    // 3. Validate booking status
    const notAllowedUpdateStatuses = [BookingStatuses.IN_PROGRESS, BookingStatuses.FINISHED, BookingStatuses.CANCELLED];
    if (notAllowedUpdateStatuses.includes(existedBooking.status)) {
      throw new ApiError(`Can't update booking that already ${existedBooking.status}`, StatusCodes.BAD_REQUEST);
    }

    // 4. Update Pet
    const newPetInfo = await petsRepository.update({
      ...existedBooking.pet,
      ...body,
      ...addModificationInfo(req),
    });

    // 5. Update Booking
    const selectedServices = existedBooking.services.map((item) => item.service);
    const bookingPayload: CreateBookingPayload = {
      pet: existedBooking.pet._id,
      pickupOption: existedBooking.pickupOption,
      services: existedBooking.services.map((item) => {
        const newRoomType = getRoomType(newPetInfo, item.roomOption, item.roomType);
        const lateCheckoutTime = calculateLateCheckoutTime(item.checkOutTime);
        return {
          service: _.get(item, 'service._id'),
          roomOption: _.get(item, 'roomOption._id'),
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          roomType: (newRoomType ? newRoomType._id : undefined) as any,
          extraCares: (_.get(item, 'extraCares') || []).map((extraCare) => extraCare._id),
          checkInTime: moment(item.checkInTime).toISOString(),
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          checkOutTime: item.checkOutTime ? moment(item.checkOutTime).toISOString() : (undefined as any),
          lateCheckoutFee: newRoomType ? calculateLateCheckoutFee(lateCheckoutTime, newRoomType.price) : 0,
        };
      }),
      note: existedBooking.note,
      branch: existedBooking.branch._id,
    };
    const validateBookingServicesResult = validateBookingServices(bookingPayload, selectedServices, newPetInfo);
    const newBookingInfo = await bookingsRepository.update({
      ...existedBooking,
      ...addModificationInfo(req),
      pet: newPetInfo,
      services: validateBookingServicesResult.bookingServices,
      totalPrice: validateBookingServicesResult.totalPrice,
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

    // 8. Send email
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
