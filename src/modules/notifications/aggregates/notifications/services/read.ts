import { Response, Request } from 'express';
import { ApiError, createSimpleSetter, ignoreEmptyField, toDbQuery } from '@app/core';
import { StatusCodes } from 'http-status-codes';
import { notificationsRepository } from '../notifications.repository';

const DB_QUERY_SETTER_DICT = { createdBy: ignoreEmptyField(createSimpleSetter('user')) };

export const read = async (req: Request, res: Response, next: Function): Promise<void> => {
  try {
    const { query } = req;
    const { id } = req.params;

    // 1. Validate notification exists
    const filters = toDbQuery(query, DB_QUERY_SETTER_DICT);
    const existedNotification = await notificationsRepository.findOne({
      ...filters,
      _id: id,
    });
    if (!existedNotification) {
      throw new ApiError(`Notification not found`, StatusCodes.BAD_REQUEST);
    }

    // 2. Query db
    const newNotificationInfo = await notificationsRepository.update({
      _id: existedNotification._id,
      read: true,
    });
    res.status(StatusCodes.OK).json(newNotificationInfo);
  } catch (error) {
    next(error);
  }
};
