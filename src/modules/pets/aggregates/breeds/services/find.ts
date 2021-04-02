import { Response, Request } from 'express';
import {
  autoFillQuery,
  toDbQuery,
  toDbSort,
  ignoreEmptyField,
  createSearchSetter,
  createSimpleSetter,
  createDefaultSort,
} from '@app/core';
import { StatusCodes } from 'http-status-codes';
import { breedsRepository } from '../breeds.repository';

const DB_QUERY_SETTER_DICT = {
  search: ignoreEmptyField(createSearchSetter(false)),
  species: ignoreEmptyField(createSimpleSetter('species')),
  isActive: ignoreEmptyField(createSimpleSetter('isActive')),
};

const SORT_FIELD_DICT = {
  name: createDefaultSort('name'),
  createdAt: createDefaultSort('createdAt'),
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
      breedsRepository.count(filters),
      breedsRepository.find({
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
