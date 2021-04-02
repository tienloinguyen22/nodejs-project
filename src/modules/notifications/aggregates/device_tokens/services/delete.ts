import { Response, Request } from 'express';
import { StatusCodes } from 'http-status-codes';
import * as yup from 'yup';
import { ApiError, validatePayload } from '../../../../../core';
import { deviceTokensRepository } from '../device_tokens.repository';

export const del = async (req: Request, res: Response, next: Function): Promise<void> => {
  try {
    // 1. Validate body
    await validatePayload({ token: yup.string().required('Device token is required') }, req.params);

    // 2. Validate exist
    const existedDeviceToken = await deviceTokensRepository.findOne({
      token: req.params.token,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      user: (req as any).user._id,
    });
    if (!existedDeviceToken) {
      throw new ApiError(`Device token not found`, StatusCodes.BAD_REQUEST);
    }

    // 3. Delete
    await deviceTokensRepository.del(existedDeviceToken._id);
    res.status(StatusCodes.OK).json({});
  } catch (error) {
    next(error);
  }
};
