import * as admin from 'firebase-admin';
import { serviceAccount } from './serviceAccountKey.generated';

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
  databaseURL: 'https://takumen-notification.firebaseio.com',
});

export const db = admin.firestore();
