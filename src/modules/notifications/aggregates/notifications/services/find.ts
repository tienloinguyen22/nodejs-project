import { Response, Request } from 'express';
import { autoFillQuery, toDbQuery, toDbSort, createDefaultSort, ignoreEmptyField, createSimpleSetter } from '@app/core';
import { StatusCodes } from 'http-status-codes';
import { notificationsRepository } from '../notifications.repository';

const DB_QUERY_SETTER_DICT = { createdBy: ignoreEmptyField(createSimpleSetter('user')) };

const SORT_FIELD_DICT = { createdAt: createDefaultSort('createdAt') };

export const find = async (req: Request, res: Response, next: Function): Promise<void> => {
  try {
    const { query } = req;
    const autoFilledQuery = autoFillQuery(query);

    // 1. Build query
    const filters = toDbQuery(autoFilledQuery, DB_QUERY_SETTER_DICT);
    const sortBy = toDbSort(autoFilledQuery.sortBy, SORT_FIELD_DICT);

    // 2. Query db
    const [total, data] = await Promise.all([
      notificationsRepository.count(filters),
      notificationsRepository.find({
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
