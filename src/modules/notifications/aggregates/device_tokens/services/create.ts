import { Response, Request } from 'express';
import { StatusCodes } from 'http-status-codes';
import * as yup from 'yup';
import { addCreationInfo, validatePayload } from '../../../../../core';
import { deviceTokensRepository } from '../device_tokens.repository';

export const create = async (req: Request, res: Response, next: Function): Promise<void> => {
  try {
    // 1. Validate body
    await validatePayload({ token: yup.string().required('Device token is required') }, req.body);

    // 2. Create
    await deviceTokensRepository.create({
      token: req.body.token,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      user: (req as any).user._id,
      ...addCreationInfo(req),
    });
    res.status(StatusCodes.OK).json({});
  } catch (error) {
    next(error);
  }
};
