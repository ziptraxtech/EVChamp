import { useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import { useUser } from '@clerk/clerk-react';
import { Capacitor } from '@capacitor/core';
import { FirebaseMessaging } from '@capacitor-firebase/messaging';

// Broadcast topic every device is subscribed to. The backend can push to this
// topic via /api/send-notification-topic to reach all installs at once.
const DEFAULT_TOPIC = 'all_users';

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
};

let messagingInstance: any = null;

/**
 * Initialize Firebase and request notification permissions
 * This is called once on app load
 */
export const initializePushNotifications = async () => {
  // Native (Android/iOS) build inside the Capacitor WebView — the web Firebase
  // SDK + service worker do NOT work here, so use the native plugin instead.
  if (Capacitor.isNativePlatform()) {
    return initializeNativePushNotifications();
  }

  try {
    // Check if Firebase config is available
    if (!firebaseConfig.projectId) {
      console.warn('⚠️ Firebase config not found. Notifications disabled.');
      return;
    }

    // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    messagingInstance = getMessaging(app);

    // Check if browser supports notifications
    if (!('Notification' in window)) {
      console.warn('⚠️ This browser does not support desktop notifications');
      return;
    }

    // Check if notifications are blocked
    if (Notification.permission === 'denied') {
      console.warn('⚠️ Notifications are blocked by user');
      return;
    }

    // Request permission if not granted
    if (Notification.permission === 'default') {
      console.log('📍 Requesting notification permission...');
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        console.log('❌ Notification permission denied');
        return;
      }
    }

    // Get FCM token
    const token = await getToken(messagingInstance, {
      vapidKey: process.env.REACT_APP_FIREBASE_VAPID_KEY,
    });

    if (token) {
      console.log('✅ FCM Token received:', token.substring(0, 20) + '...');
      // Store token in backend
      await storeFCMToken(token);
    } else {
      console.warn('⚠️ Failed to get FCM token');
    }

    // Listen for incoming messages when app is in foreground
    setupMessageListener();

    console.log('✅ Firebase Cloud Messaging initialized');
  } catch (error) {
    console.error('❌ Error initializing Firebase notifications:', error);
  }
};

/**
 * Initialize push notifications for the native Android/iOS app using the
 * @capacitor-firebase/messaging plugin. This path is used inside the APK
 * (Capacitor WebView), where the web Firebase SDK cannot obtain a token.
 */
const initializeNativePushNotifications = async () => {
  try {
    // Ask the OS for notification permission (Android 13+ / iOS prompt).
    const permission = await FirebaseMessaging.requestPermissions();
    if (permission.receive !== 'granted') {
      console.log('❌ Native notification permission not granted');
      return;
    }

    // Retrieve the device FCM token and register it with the backend.
    const { token } = await FirebaseMessaging.getToken();
    if (token) {
      console.log('✅ Native FCM token:', token.substring(0, 20) + '...');
      await storeFCMToken(token, 'Android App');
    } else {
      console.warn('⚠️ Failed to get native FCM token');
    }

    // Subscribe to the broadcast topic so admin "topic" pushes reach this device.
    try {
      await FirebaseMessaging.subscribeToTopic({ topic: DEFAULT_TOPIC });
      console.log(`📡 Subscribed to topic "${DEFAULT_TOPIC}"`);
    } catch (topicErr) {
      console.warn('⚠️ Topic subscription failed:', topicErr);
    }

    // Keep the stored token fresh when Firebase rotates it.
    await FirebaseMessaging.addListener('tokenReceived', (event) => {
      if (event?.token) {
        console.log('🔄 Native FCM token refreshed');
        storeFCMToken(event.token, 'Android App');
      }
    });

    // Foreground message received while the app is open.
    await FirebaseMessaging.addListener('notificationReceived', (event) => {
      console.log('📬 Native notification received:', event.notification);
    });

    // User tapped a notification — handle deep-link navigation.
    await FirebaseMessaging.addListener('notificationActionPerformed', (event) => {
      const data = (event?.notification?.data || {}) as Record<string, string>;
      console.log('👆 Notification tapped:', data);
      handleNotificationData(data);
    });

    console.log('✅ Native Firebase Cloud Messaging initialized');
  } catch (error) {
    console.error('❌ Error initializing native notifications:', error);
  }
};

/**
 * Store FCM token in backend
 */
const storeFCMToken = async (token: string, deviceName?: string) => {
  try {
    const response = await fetch('/api/store-fcm-token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token, deviceName }),
    });

    const data = await response.json();
    if (response.ok) {
      console.log('✅ FCM token stored on backend');
    } else {
      console.error('❌ Failed to store FCM token:', data.error);
    }
  } catch (error) {
    console.error('❌ Error storing FCM token:', error);
  }
};

/**
 * Setup listener for incoming messages when app is in foreground
 */
const setupMessageListener = () => {
  if (!messagingInstance) return;

  onMessage(messagingInstance, (payload) => {
    console.log('📬 Message received:', payload);

    const { notification, data } = payload;

    // Show browser notification
    if (notification) {
      new Notification(notification.title || 'EVChamp', {
        body: notification.body,
        icon: notification.icon || '/evchamp-icon.png',
        badge: '/evchamp-icon.png',
        tag: 'evchamp-notification',
        requireInteraction: false,
      });
    }

    // Handle custom data from notification
    if (data) {
      console.log('📦 Notification data:', data);
      // You can handle specific actions here based on data.action
      // Example: Navigate to a page, update UI, etc.
      handleNotificationData(data);
    }
  });

  console.log('📡 Message listener setup');
};

/**
 * Handle custom notification data
 */
const handleNotificationData = (data: Record<string, string>) => {
  const { action, target } = data;

  if (action === 'navigate' && target) {
    // Navigate to the specified target
    window.location.href = target;
  }

  if (action === 'update') {
    // Trigger a page refresh or data update
    window.location.reload();
  }

  // Add more custom actions as needed
};

/**
 * Hook to initialize notifications on app load
 */
export const useNotifications = () => {
  const { user } = useUser();

  useEffect(() => {
    if (!user) return; // Wait for user to be authenticated

    // Initialize push notifications
    initializePushNotifications();
  }, [user]);
};

/**
 * Get the current FCM token
 */
export const getFCMToken = async (): Promise<string | null> => {
  try {
    if (!messagingInstance) {
      const app = initializeApp(firebaseConfig);
      messagingInstance = getMessaging(app);
    }

    const token = await getToken(messagingInstance, {
      vapidKey: process.env.REACT_APP_FIREBASE_VAPID_KEY,
    });

    return token || null;
  } catch (error) {
    console.error('Error getting FCM token:', error);
    return null;
  }
};

/**
 * Request notification permission
 */
export const requestNotificationPermission = async (): Promise<boolean> => {
  try {
    if (!('Notification' in window)) {
      console.warn('Notifications not supported');
      return false;
    }

    if (Notification.permission === 'granted') {
      return true;
    }

    if (Notification.permission === 'denied') {
      console.warn('Notifications denied by user');
      return false;
    }

    const permission = await Notification.requestPermission();
    return permission === 'granted';
  } catch (error) {
    console.error('Error requesting notification permission:', error);
    return false;
  }
};

export default useNotifications;
