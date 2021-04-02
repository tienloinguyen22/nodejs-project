import { Response, Request } from 'express';
import { autoFillQuery, toDbQuery } from '@app/core';
import { StatusCodes } from 'http-status-codes';
import { bookingsRepository } from '../bookings.repository';
import { DB_QUERY_SETTER_DICT } from './find';

export const findById = async (req: Request, res: Response, next: Function): Promise<void> => {
  try {
    const { query } = req;
    const { id } = req.params;
    const autoFilledQuery = autoFillQuery({
      ...query,
      _id: id,
    });

    // 1. Build query
    const filters = toDbQuery(autoFilledQuery, DB_QUERY_SETTER_DICT);

    // 2. Query db
    const bookingInfo = await bookingsRepository.findOne(filters);

    res.status(StatusCodes.OK).json(bookingInfo);
  } catch (error) {
    next(error);
  }
};
