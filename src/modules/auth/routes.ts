import { Router, Response, Request, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import * as yup from 'yup';
import { EventNames, Genders, regex, validate } from '../../core';
import { eventEmitterFactory } from '../../loaders/event_emitter_factory';
import { LoginPayload } from './interfaces';
import { authService } from './services';

const route = Router();

export const auth = (app: Router): void => {
  app.use('/auth', route);

  route.post('/test', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const eventEmitter = eventEmitterFactory();
      eventEmitter.emit(EventNames.TEST);
      return res.status(StatusCodes.OK).json({ success: true });
    } catch (e) {
      return next(e);
    }
  });

  route.post(
    '/login',
    validate({
      body: {
        idToken: yup.string().required('ID Token is required'),
        fullName: yup
          .string()
          .required('Full name is required')
          .max(50, 'Full name is too long (<= 50 characters)'),
        email: yup
          .string()
          .nullable(true)
          .test('VALID_EMAIL', 'Invalid email address', (email: string | null | undefined): boolean => {
            if (!email) {
              return true;
            }
            return regex.email.test(email);
          }),
        phoneNo: yup
          .string()
          .nullable(true)
          .test('VALID_PHONE_NUMBER', 'Invalid phone number', (phoneNo: string | null | undefined) => {
            if (!phoneNo) {
              return true;
            }
            return regex.phoneNumber.test(phoneNo);
          }),
        avatarUrl: yup.string().nullable(true),
        dob: yup
          .string()
          .nullable(true)
          .test('VALID_DOB', 'Invalid dob', (dob: string | null | undefined) => {
            if (!dob) {
              return true;
            }
            return regex.isoDate.test(dob);
          }),
        address: yup.string().nullable(true),
        gender: yup
          .string()
          .nullable(true)
          .oneOf([Genders.FEMALE, Genders.FEMALE, Genders.OTHER], 'Invalid gender'),
      },
    }),
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const user = await authService.login(req.body as LoginPayload);
        return res.status(StatusCodes.OK).json(user);
      } catch (e) {
        return next(e);
      }
    },
  );
};
