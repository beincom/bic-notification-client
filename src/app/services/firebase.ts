import { initializeApp } from 'firebase/app';
import env from "react-dotenv";
import { getToken, getMessaging, onMessage, MessagePayload } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: env.FIREBASE_API_KEY,
  authDomain: env.FIREBASE_AUTH_DOMAIN,
  projectId: env.FIREBASE_PROJECT_ID,
  storageBucket: env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: env.FIREBASE_MESSAGING_SENDER_ID,
  appId: env.FIREBASE_APP_ID
};

console.log('*** Environment ***', process.env.FIREBASE_ENV)
console.log('*** Firebase Config ***', firebaseConfig)

const firebaseApp = initializeApp(firebaseConfig);
const messaging = getMessaging(firebaseApp);

export const getOrRegisterServiceWorker = () => {
  if ('serviceWorker' in navigator) {
    return window.navigator.serviceWorker
      .getRegistration('/firebase-push-notification-scope')
      .then((serviceWorker) => {
        if (serviceWorker) return serviceWorker;
        return window.navigator.serviceWorker.register('/firebase-messaging-sw.js', {
          scope: '/firebase-push-notification-scope',
        });
      });
  }
  throw new Error('The browser doesn`t support service worker.');
};

export const getFirebaseToken = () =>
  getOrRegisterServiceWorker()
    .then((serviceWorkerRegistration) =>
      getToken(messaging, { vapidKey: process.env.FIREBASE_VAPID_KEY, serviceWorkerRegistration }));

export const onForegroundMessage = (): Promise<MessagePayload> =>
  new Promise((resolve) => onMessage(messaging, (payload) => resolve(payload)));