import { BookingService } from './booking';

export interface ValidateBookingServicesResult {
  totalPrice: number;
  bookingServices: BookingService[];
}
