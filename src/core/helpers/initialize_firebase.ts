import admin from 'firebase-admin';
import { config } from '@app/config';

export const initializeFirebase = (): void => {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: config.firebase.serviceAccount.project_id,
      clientEmail: config.firebase.serviceAccount.client_email,
      privateKey: config.firebase.serviceAccount.private_key,
    }),
    databaseURL: config.firebase.databaseURL,
  });
};
