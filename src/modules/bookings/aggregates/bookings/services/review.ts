import { Response, Request } from 'express';
import { StatusCodes } from 'http-status-codes';
import * as yup from 'yup';
import ejs from 'ejs';
import path from 'path';
import { addModificationInfo, ApiError, MailServices, sendEmail, validatePayload } from '../../../../../core';
import { bookingsRepository } from '../bookings.repository';
import { BookingStatuses, ReviewBookingPayload } from '../interfaces';

export const review = async (req: Request, res: Response, next: Function): Promise<void> => {
  try {
    // eslint-disable-next-line prefer-destructuring
    const body: ReviewBookingPayload = req.body;
    const { id } = req.params;

    // 1. Validate body
    await validatePayload(
      {
        rating: yup
          .number()
          .required('Rating is required')
          .min(1, 'Invalid rating (>= 1)')
          .max(5, 'Invalid rating (<= 5)'),
        review: yup.string().required('Review is required'),
      },
      body,
    );

    // 2. Validate booking
    const existedBooking = await bookingsRepository.findById(id);
    if (!existedBooking) {
      throw new ApiError(`Booking not found`, StatusCodes.NOT_FOUND);
    }
    if (existedBooking.review && existedBooking.rating) {
      throw new ApiError(`This booking has been reviewed before`, StatusCodes.BAD_REQUEST);
    }

    // 3. Validate booking status
    if (existedBooking.status !== BookingStatuses.FINISHED) {
      throw new ApiError(`Only FINISHED booking can be reviewed`, StatusCodes.BAD_REQUEST);
    }

    // 4. Update
    const newBookingInfo = await bookingsRepository.update({
      _id: existedBooking._id,
      rating: body.rating,
      review: body.review,
      ...addModificationInfo(req),
    });
    res.status(StatusCodes.OK).json(newBookingInfo);

    // 5. Send email to admin
    ejs.renderFile(
      path.join(__dirname, '../../../../../core/mailer/templates/review_booking.ejs'),
      {
        customerName: newBookingInfo.petOwner.fullName,
        rating: newBookingInfo.rating,
        maxRating: 5,
        review: newBookingInfo.review,
      },
      (err, html) => {
        if (err) {
          // eslint-disable-next-line no-console
          console.log(`🚀 Error renderring 'review_booking.ejs'`, err);
        } else {
          sendEmail(MailServices.GMAIL, {
            to: 'bedandpetfirst@gmail.com',
            subject: 'Bed & Pets First - Đánh Giá Dịch Vụ',
            html,
          });
        }
      },
    );
  } catch (error) {
    next(error);
  }
};
