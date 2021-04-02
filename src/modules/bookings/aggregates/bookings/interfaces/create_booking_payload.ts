import { PickupOptions } from '.';
import { ISODate } from '../../../../../core';

export interface CreateBookingServicePayload {
  service: string;
  roomOption: string;
  roomType: string;
  extraCares: string[];
  checkInTime: ISODate;
  checkOutTime: ISODate;
  lateCheckoutFee: number;
}

export interface CreateBookingPayload {
  pet: string;
  pickupOption: PickupOptions;
  services: CreateBookingServicePayload[];
  note: string;
  branch: string;
}
