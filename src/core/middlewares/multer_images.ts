/* eslint-disable no-null/no-null */

import path from 'path';
import util from 'util';
import multer from 'multer';
import fs from 'fs';
import { v4 } from 'uuid';

const fileFolder = path.join(__dirname, `../../../uploads/temp`);

const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const fsAccessPromise = util.promisify(fs.access);
    try {
      await fsAccessPromise(fileFolder);
    } catch (error) {
      const fsMkdirPromise = util.promisify(fs.mkdir);
      await fsMkdirPromise(fileFolder);
    }
    cb(null, fileFolder);
  },
  filename: async (req, file, cb) => {
    const lastDot = file.originalname.lastIndexOf('.');
    const fileType = file.originalname.slice(lastDot + 1).trim();
    const filename = `${v4()}.${fileType}`;
    cb(null, filename);
  },
});

export const multerImages = multer({ storage });
