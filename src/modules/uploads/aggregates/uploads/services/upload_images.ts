import { Response, Request } from 'express';
import { regex, ApiError, allowFileSizes } from '@app/core';
import fs from 'fs';
import { StatusCodes } from 'http-status-codes';
import imagemin from 'imagemin';
import imageminMozjpeg from 'imagemin-mozjpeg';
import imageminPngquant from 'imagemin-pngquant';

export const uploadImages = async (req: Request, res: Response, next: Function): Promise<void> => {
  try {
    const { file } = req;

    // 1. Validate file
    if (!regex.imageExt.test(file.originalname)) {
      fs.unlinkSync(file.path);
      throw new ApiError('Invalid image file', StatusCodes.BAD_REQUEST);
    }
    if (file.size > allowFileSizes.image) {
      fs.unlinkSync(file.path);
      throw new ApiError('File too large (<= 5MB)', StatusCodes.BAD_REQUEST);
    }

    // 2. Compress image for smaller size
    await imagemin([file.path], {
      destination: 'uploads/images',
      plugins: [
        imageminMozjpeg(),
        imageminPngquant({
          speed: 10,
          quality: [0.7, 0.8],
        }),
      ],
    });
    fs.unlinkSync(file.path);

    // 3. Response
    res.status(StatusCodes.OK).json({ url: `${file.filename}` });
  } catch (error) {
    next(error);
  }
};
