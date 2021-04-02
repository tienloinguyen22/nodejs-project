import { BookingAdditionalFee, PickupOptions } from './booking';
import { CreateBookingServicePayload } from './create_booking_payload';

export interface UpdateBookingPayload {
  pet: string;
  pickupOption: PickupOptions;
  services: CreateBookingServicePayload[];
  note: string;
  branch: string;
  additionalFees: BookingAdditionalFee[];
  checkoutNote: string;
}
