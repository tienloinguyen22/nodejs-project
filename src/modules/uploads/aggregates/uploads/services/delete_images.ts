import { Response, Request } from 'express';
import fs from 'fs';
import path from 'path';
import { ApiError } from '@app/core';
import { StatusCodes } from 'http-status-codes';

export const deleteImages = async (req: Request, res: Response, next: Function): Promise<void> => {
  try {
    const { filename } = req.params;
    const filepath = path.join(__dirname, `../../../../../../uploads/images/${filename}`);

    // 1. Check file exists
    const existed = fs.existsSync(filepath);
    if (!existed) {
      throw new ApiError('Image file not found', StatusCodes.BAD_REQUEST);
    }

    // 2. Delete file
    fs.unlinkSync(filepath);

    // 3. Response
    res.status(StatusCodes.OK).json({});
  } catch (error) {
    next(error);
  }
};
