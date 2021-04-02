/* eslint-disable no-restricted-syntax */
import { StatusCodes } from 'http-status-codes';
import _ from 'lodash';
import moment from 'moment';
import { ApiError, createObjectId, regex } from '../../../core';
import { Pet } from '../../pets/aggregates/pets/interfaces';
import { Service } from '../../services/aggregates/services/interfaces';
import {
  BookingExtraCare,
  BookingService,
  CreateBookingPayload,
  ValidateBookingServicesResult,
} from '../aggregates/bookings/interfaces';
import { getPrice } from './get_price';

export const validateBookingServices = (
  body: CreateBookingPayload,
  selectedServices: Service[],
  existedPet: Pet,
): ValidateBookingServicesResult => {
  const selectedServicesById = _.mapKeys(selectedServices, '_id');
  const bookingServices: BookingService[] = [];
  let totalPrice = 0;

  for (const item of body.services) {
    const service = selectedServicesById[item.service];
    if (!service) {
      throw new ApiError(`Service with ID: ${item.service} not found`, StatusCodes.NOT_FOUND);
    }

    const roomOption = _.mapKeys(service.roomOptions || [], '_id')[item.roomOption];
    if (item.roomOption && !roomOption) {
      throw new ApiError(`Room Option with ID: ${item.roomOption} not found`, StatusCodes.NOT_FOUND);
    }

    const roomType = _.mapKeys(_.get(roomOption, 'roomTypes') || [], '_id')[item.roomType];
    if (item.roomType && !roomType) {
      throw new ApiError(`Room Type with ID: ${item.roomType} not found`, StatusCodes.NOT_FOUND);
    }

    const checkInMoment = moment(item.checkInTime);
    if (!regex.isoDate.test(item.checkInTime)) {
      throw new ApiError(`Invalid check in time`, StatusCodes.BAD_REQUEST);
    }
    if (item.checkOutTime && !regex.isoDate.test(item.checkOutTime)) {
      throw new ApiError(`Invalid check out time`, StatusCodes.BAD_REQUEST);
    }
    if (item.checkOutTime) {
      const checkOutMoment = moment(item.checkOutTime);
      if (checkOutMoment.isBefore(checkInMoment)) {
        throw new ApiError(`Check out time can't happen before check in time`, StatusCodes.BAD_REQUEST);
      }
    }
    const quantity = item.checkOutTime ? Math.round(moment(item.checkOutTime).diff(checkInMoment, 'hour') / 24) : 1;

    const isPetHotelService = service.roomOptions && service.roomOptions.length > 0;
    let extraCaresById = _.mapKeys(service.extraCares, '_id');
    if (isPetHotelService) {
      const roomOptionsById = _.mapKeys(service.roomOptions, '_id');
      const selectedRoomOption = roomOptionsById[item.roomOption];
      if (!selectedRoomOption) {
        throw new ApiError(`Room Option with ID: ${item.roomOption} not found`, StatusCodes.NOT_FOUND);
      }
      extraCaresById = _.mapKeys(selectedRoomOption.extraCares, '_id');
    }
    const extraCares: BookingExtraCare[] = [];
    for (const extraCare of item.extraCares) {
      const selectedExtraCare = extraCaresById[extraCare];
      if (!selectedExtraCare) {
        throw new ApiError(`Extra Care with ID: ${extraCare} not found`, StatusCodes.NOT_FOUND);
      } else {
        const extraCarePrice = getPrice(existedPet, selectedExtraCare);
        totalPrice += extraCarePrice * selectedExtraCare.quantityPerDay * quantity;
        extraCares.push({
          ...selectedExtraCare,
          quantity: selectedExtraCare.quantityPerDay * quantity,
          price: extraCarePrice,
        });
      }
    }

    const servicePrice = roomType ? roomType.price : getPrice(existedPet, service);
    totalPrice += servicePrice * quantity;
    totalPrice += item.lateCheckoutFee;
    bookingServices.push({
      _id: createObjectId(),
      service,
      roomOption,
      roomType,
      extraCares,
      checkInTime: item.checkInTime,
      checkOutTime: item.checkOutTime,
      lateCheckoutFee: item.lateCheckoutFee,
      quantity,
      price: servicePrice,
    });
  }

  return {
    totalPrice,
    bookingServices,
  };
};
