/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
import admin from 'firebase-admin';
import { config } from '../config';
import {
  getCurrentTimestampInMilliseconds,
  initializeFirebase,
  logger,
  LoginTypes,
  roleIds,
  startDatabase,
} from '../core';
import { usersRepository } from '../modules/auth/aggregates/users/users.repository';
import '../modules/auth/aggregates/roles/roles.repository';

const userFirebaseId = '9wkfE7ReFbVo4icAEMMYBSyVjrl1';

(async () => {
  logger.info(`[Server] Initialize mongo ...`);
  await startDatabase(config.database.connectionString);

  logger.info(`[Server] Initialize firebase.....`);
  initializeFirebase();

  // 1. Create Firebase user
  let firebaseUser: admin.auth.UserRecord | undefined;
  try {
    firebaseUser = await admin.auth().getUser(userFirebaseId);
  } catch (error) {
    if (error.code === 'auth/user-not-found') {
      try {
        firebaseUser = await admin.auth().createUser({
          uid: userFirebaseId,
          displayName: 'Bed & Pet Admin',
          email: 'admin@bpf.com',
          emailVerified: true,
          password: 'admin@123',
        });
      } catch (err) {
        // eslint-disable-next-line no-console
        console.log('error', error);
        return;
      }
    } else {
      // eslint-disable-next-line no-console
      console.log('error', error);
      return;
    }
  }

  // 2. Create mongodb user
  if (!firebaseUser) {
    // eslint-disable-next-line no-console
    console.log('Firebase user not found');
    return;
  }
  await usersRepository.upsert({
    _id: '5c8f538bd9df923c20dc564d',
    fullName: firebaseUser.displayName,
    email: firebaseUser.email,
    phoneNo: firebaseUser.phoneNumber,
    avatarUrl: firebaseUser.photoURL,
    dob: undefined,
    address: undefined,
    gender: undefined,
    firebaseId: firebaseUser.uid,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    roles: [roleIds.ADMIN] as any,
    loginType: LoginTypes.EMAIL,
    createdAt: getCurrentTimestampInMilliseconds(),
  });

  logger.info(`Create admin user success`);
  process.exit();
})();
