import { StatusCodes } from 'http-status-codes';
import { Request, Response } from 'express';
import * as yup from 'yup';
import { ObjectShape } from 'yup/lib/object';
import { ApiError } from '../errors/api_error';
import { ValidationSchema } from '../interfaces/validation_schema';

const validatePayload = async (rules: ObjectShape, data: object, options = {}): Promise<void> => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const validationSchema = yup.object().shape(rules, options as any);
  await validationSchema.validate(data);
};

export const validate = (validationSchema: ValidationSchema, options = {}) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  return async (req: Request, _res: Response, next: Function) => {
    try {
      if (validationSchema.body) {
        await validatePayload(validationSchema.body, req.body, options);
      }
      if (validationSchema.params) {
        await validatePayload(validationSchema.params, req.params, options);
      }
      if (validationSchema.query) {
        await validatePayload(validationSchema.query, req.query, options);
      }
      next();
    } catch (error) {
      const err = new ApiError(error.message, StatusCodes.BAD_REQUEST);
      next(err);
    }
  };
};
