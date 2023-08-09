import { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';

import logo from '../assets/logo.svg';
import { getFirebaseToken, onForegroundMessage } from './services/firebase';

export default function App() {
  const [showNotificationBanner, setShowNotificationBanner] = useState(Notification.permission === 'default');

  useEffect(() => {
    onForegroundMessage()
      .then((payload) => {
        console.log('Received foreground message: ', payload);
        const { notification } = payload;
        toast(<ToastifyNotification title={notification?.title || ''} body={notification?.body || ''} />);
      })
      .catch(err => console.log('An error occured while retrieving foreground message. ', err));
  }, []);

  const handleGetFirebaseToken = () => {
    getFirebaseToken()
      .then((firebaseToken) => {
        console.log('Firebase token: ', firebaseToken);
        if (firebaseToken) {
          setShowNotificationBanner(false);
        }
      })
      .catch((err) => console.error('An error occured while retrieving firebase token. ', err))
  }

  const ToastifyNotification = ({ title, body }: { title: string, body: string }) => (
    <div className="push-notification">
      <h2 className="push-notification-title">{title}</h2>
      <p className="push-notification-text">{body}</p>
    </div>
  );

  return (
    <div className="app">
      {showNotificationBanner && <div className="notification-banner">
        <span>The app needs permission to</span>
        <a
          href="#"
          className="notification-banner-link"
          onClick={handleGetFirebaseToken}
        >
          enable push notifications.
        </a>
      </div>}

    </div>
  );
}