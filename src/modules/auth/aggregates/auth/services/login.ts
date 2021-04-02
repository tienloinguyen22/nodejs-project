import { Response, Request } from 'express';
import {
  validatePayload,
  regex,
  Genders,
  createObjectId,
  LoginTypes,
  getCurrentTimestampInMilliseconds,
  roleIds,
  ApiError,
} from '@app/core';
import * as yup from 'yup';
import admin from 'firebase-admin';
import { StatusCodes } from 'http-status-codes';
import { usersRepository } from '../../users/users.repository';
import { LoginPayload } from '../interfaces';
import { User } from '../../users/interfaces';
import { rolesRepository } from '../../roles/roles.repository';

export const login = async (req: Request, res: Response, next: Function): Promise<void> => {
  try {
    const payload: LoginPayload = req.body;

    // 1. validate
    await validatePayload(
      {
        idToken: yup.string().required('ID Token is required'),
        fullName: yup
          .string()
          .required('Full name is required')
          .max(50, 'Full name is too long (<= 50 characters)'),
        email: yup
          .string()
          .nullable(true)
          .test('VALID_EMAIL', 'Invalid email address', (email: string) => {
            if (!email) {
              return true;
            }
            return regex.email.test(email);
          }),
        phoneNo: yup
          .string()
          .nullable(true)
          .test('VALID_PHONE_NUMBER', 'Invalid phone number', (phoneNo: string) => {
            if (!phoneNo) {
              return true;
            }
            return regex.phoneNumber.test(phoneNo);
          }),
        avatarUrl: yup.string().nullable(true),
        dob: yup
          .string()
          .nullable(true)
          .test('VALID_DOB', 'Invalid dob', (dob: string) => {
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
      payload,
    );

    // 2. If user exist => return
    const verifyIdToken = await admin.auth().verifyIdToken(payload.idToken);
    const firebaseInfo = await admin.auth().getUser(verifyIdToken.uid);
    const providerInfo = firebaseInfo.providerData[0];

    let loginType = LoginTypes.APPLE;
    if (providerInfo.providerId === 'facebook.com') {
      loginType = LoginTypes.FACEBOOK;
    } else if (providerInfo.providerId === 'google.com') {
      loginType = LoginTypes.GOOGLE;
    }

    const existedUser = await usersRepository.findOne({ email: verifyIdToken.email });
    if (existedUser) {
      const updateUserInfo = {
        _id: existedUser._id,
        firebaseId: verifyIdToken.uid,
        loginType,
      };
      const newUserInfo = await usersRepository.update(updateUserInfo);
      res.status(StatusCodes.OK).json(newUserInfo);
    } else {
      // 3. Create user if not exist
      const existedUserRole = await rolesRepository.findById(roleIds.USER);
      if (!existedUserRole) {
        throw new ApiError('User role not found', StatusCodes.INTERNAL_SERVER_ERROR);
      }

      const userInfo: Partial<User> = {
        _id: createObjectId(),
        fullName: payload.fullName,
        email: payload.email,
        phoneNo: payload.phoneNo,
        avatarUrl: payload.avatarUrl,
        dob: payload.dob,
        address: payload.address,
        gender: payload.gender,
        firebaseId: verifyIdToken.uid,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        roles: [roleIds.USER] as any,
        loginType,
        createdAt: getCurrentTimestampInMilliseconds(),
      };
      const newUser = await usersRepository.create(userInfo);
      res.status(StatusCodes.OK).json(newUser);
    }
  } catch (error) {
    next(error);
  }
};
