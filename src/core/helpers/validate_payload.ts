import * as yup from 'yup';
import { StatusCodes } from 'http-status-codes';
import { ApiError } from '../errors/api_error';

export const validatePayload = async (
  rules: yup.ObjectSchemaDefinition<{}>,
  data: object,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  options?: any,
): Promise<void> => {
  try {
    const validationSchema = yup.object().shape(rules, options);
    await validationSchema.validate(data);
  } catch (error) {
    throw new ApiError(error.message, StatusCodes.BAD_REQUEST);
  }
};
