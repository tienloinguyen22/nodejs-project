import { Response, Request } from 'express';
import { ApiError } from '@app/core';
import { StatusCodes } from 'http-status-codes';
import { petsRepository } from '../pets.repository';
import { BookingStatuses } from '../../../../bookings/aggregates/bookings/interfaces';
import { bookingsRepository } from '../../../../bookings/aggregates/bookings/bookings.repository';

export const remove = async (req: Request, res: Response, next: Function): Promise<void> => {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { query } = req as any;
    const { id } = req.params;

    // 1. Validate existed pet
    const existedPet = await petsRepository.findOne({
      ...query,
      _id: id,
    });
    if (!existedPet) {
      throw new ApiError('Pet not found', StatusCodes.NOT_FOUND);
    }

    // 2. Validate pet booking
    const existedBookingsCount = await bookingsRepository.count({
      'pet._id': existedPet._id,
      status: { $in: [BookingStatuses.PENDING, BookingStatuses.UPCOMMING, BookingStatuses.IN_PROGRESS] },
    });
    if (existedBookingsCount > 0) {
      throw new ApiError('This pet is having booking', StatusCodes.NOT_FOUND);
    }

    // 3. Delete
    await petsRepository.del(id);
    res.status(StatusCodes.OK).json({});
  } catch (error) {
    next(error);
  }
};
