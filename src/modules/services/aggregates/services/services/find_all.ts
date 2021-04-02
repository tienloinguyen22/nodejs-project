import { Response, Request } from 'express';
import { StatusCodes } from 'http-status-codes';
import { servicesRepository } from '../services.repository';

export const findAll = async (req: Request, res: Response, next: Function): Promise<void> => {
  try {
    // 1. Query db
    const data = await servicesRepository.findAll({ isActive: true });

    res.status(StatusCodes.OK).json({
      total: data.length,
      data,
    });
  } catch (error) {
    next(error);
  }
};
