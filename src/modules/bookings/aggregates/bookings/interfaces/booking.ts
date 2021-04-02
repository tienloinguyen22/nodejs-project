import { IsAuditable, ISODate } from '../../../../../core';
import { User } from '../../../../auth/aggregates/users/interfaces';
import { Branch } from '../../../../branches/aggregates/branches/interfaces';
import { Pet } from '../../../../pets/aggregates/pets/interfaces';
import { ExtraCare, RoomOption, RoomType, Service } from '../../../../services/aggregates/services/interfaces';

export enum BookingStatuses {
  PENDING = 'PENDING',
  UPCOMMING = 'UPCOMMING',
  IN_PROGRESS = 'IN_PROGRESS',
  FINISHED = 'FINISHED',
  CANCELLED = 'CANCELLED',
}

export enum PickupOptions {
  CAR = 'CAR',
  BIKE = 'BIKE',
  NONE = 'NONE',
}

export interface BookingExtraCare extends ExtraCare {
  quantity: number;
  price: number;
}

export interface BookingService {
  _id: string;
  service: Service;
  roomOption: RoomOption;
  roomType: RoomType;
  extraCares: BookingExtraCare[];
  checkInTime: ISODate;
  checkOutTime: ISODate;
  lateCheckoutFee: number;
  quantity: number;
  price: number;
}

export interface BookingAdditionalFee {
  _id: string;
  title: string;
  price: number;
}

export interface Booking extends IsAuditable {
  _id: string;
  pet: Pet;
  petOwner: User;
  pickupOption: PickupOptions;
  services: BookingService[];
  note: string;
  branch: Branch;
  totalPrice: number;
  status: BookingStatuses;
  additionalFees: BookingAdditionalFee[];
  checkoutNote: string;
  rating: number;
  review: string;
}
