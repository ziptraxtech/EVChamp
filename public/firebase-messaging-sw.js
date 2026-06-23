/* eslint-disable no-undef */
/**
 * Firebase Cloud Messaging service worker (browser / PWA only).
 *
 * This handles background push notifications when the website is open in a
 * normal browser but not focused. It is NOT used inside the Android APK —
 * the native @capacitor-firebase/messaging plugin handles those.
 *
 * The values below are public Firebase client config (safe to ship to the
 * browser) and match android/app/google-services.json.
 */
importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: 'AIzaSyDQSBBwtOYSH_NAGvPR6Nf46Q6UTX1cFoQ',
  authDomain: 'evchamp-378d6.firebaseapp.com',
  projectId: 'evchamp-378d6',
  storageBucket: 'evchamp-378d6.firebasestorage.app',
  messagingSenderId: '1025062994128',
  appId: '1:1025062994128:android:6e90463bf2c553cc571ed5',
});

const messaging = firebase.messaging();

// Show a notification when a background message arrives.
messaging.onBackgroundMessage((payload) => {
  const title = (payload.notification && payload.notification.title) || 'EVChamp';
  const options = {
    body: (payload.notification && payload.notification.body) || '',
    icon: '/evchamp-icon.png',
    badge: '/evchamp-icon.png',
    data: payload.data || {},
  };
  self.registration.showNotification(title, options);
});

// Deep-link handling: navigate when the user taps a notification.
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const data = event.notification.data || {};
  const target = data.target || '/';
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if ('focus' in client) {
          client.navigate(target);
          return client.focus();
        }
      }
      if (clients.openWindow) return clients.openWindow(target);
    })
  );
});
