import admin from 'firebase-admin';
import { StatusCodes } from 'http-status-codes';
import { ApiError, createObjectId, getCurrentTimestampInMilliseconds, LoginTypes, roleIds } from '../../../core';
import { rolesRepository } from '../../roles/repository';
import { User } from '../../users/interfaces';
import { usersRepository } from '../../users/repository';
import { LoginPayload } from '../interfaces';

export const login = async (payload: LoginPayload): Promise<User> => {
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
    return usersRepository.update(updateUserInfo);
  }

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
  return usersRepository.create(userInfo);
};
