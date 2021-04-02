import { Response, Request } from 'express';
import {
  autoFillQuery,
  toDbQuery,
  toDbSort,
  createDefaultSort,
  ignoreEmptyField,
  createSimpleSetter,
  createSearchSetter,
} from '@app/core';
import { StatusCodes } from 'http-status-codes';
import { bookingsRepository } from '../bookings.repository';

export const DB_QUERY_SETTER_DICT = {
  _id: ignoreEmptyField(createSimpleSetter('_id')),
  search: ignoreEmptyField(createSearchSetter(false)),
  branch: ignoreEmptyField(createSimpleSetter('branch._id')),
  service: ignoreEmptyField(createSimpleSetter('services.service._id')),
  status: ignoreEmptyField(createSimpleSetter('status')),
  createdBy: ignoreEmptyField(createSimpleSetter('createdBy')),
};

export const SORT_FIELD_DICT = {
  totalPrice: createDefaultSort('totalPrice'),
  createdAt: createDefaultSort('createdAt'),
  checkInTime: createDefaultSort('services.0.checkInTime'),
};

export const find = async (req: Request, res: Response, next: Function): Promise<void> => {
  try {
    const { query } = req;
    const autoFilledQuery = autoFillQuery(query);

    // 1. Build query
    const filters = toDbQuery(autoFilledQuery, DB_QUERY_SETTER_DICT);
    const sortBy = toDbSort(autoFilledQuery.sortBy, SORT_FIELD_DICT);

    // 2. Query db
    const [total, data] = await Promise.all([
      bookingsRepository.count(filters),
      bookingsRepository.find({
        filters,
        pageNumber: autoFilledQuery.pageNumber,
        pageSize: autoFilledQuery.pageSize,
        sortBy,
      }),
    ]);

    res.status(StatusCodes.OK).json({
      total,
      data,
    });
  } catch (error) {
    next(error);
  }
};
