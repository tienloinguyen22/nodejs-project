import admin from 'firebase-admin';
import { configs } from '../configs';

export const initializeFirebase = (): void => {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: configs.firebase.projectId,
      clientEmail: configs.firebase.clientEmail,
      privateKey: (configs.firebase.privateKey || '').replace(/\\n/g, '\n'),
    }),
    databaseURL: configs.firebase.databaseURL,
  });
};
