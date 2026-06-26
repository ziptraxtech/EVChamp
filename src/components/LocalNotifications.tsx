import { LocalNotifications } from '@capacitor/local-notifications';
import { Capacitor } from '@capacitor/core';

/**
 * Schedule local notifications
 */
export const scheduleLocalNotifications = async () => {
  if (!Capacitor.isNativePlatform()) {
    console.log('⚠️ Local notifications only work on native platforms (Android/iOS)');
    return;
  }

  try {
    // Request notification permissions
    const permission = await LocalNotifications.requestPermissions();
    console.log('📍 Notification permission:', permission);

    // Schedule a test notification in 5 seconds
    await LocalNotifications.schedule({
      notifications: [
        {
          title: 'EVChamp',
          body: 'Welcome to EVChamp! You are now receiving notifications.',
          id: 1,
          schedule: { at: new Date(Date.now() + 5000) }, // 5 seconds from now
          smallIcon: 'ic_stat_icon_config_sample',
          iconColor: '#488AFF',
        },
      ],
    });

    console.log('✅ Local notifications scheduled');
  } catch (error) {
    console.error('❌ Error scheduling local notifications:', error);
  }
};

/**
 * Setup handler for when notification is tapped
 */
export const setupLocalNotificationTapHandler = async () => {
  if (!Capacitor.isNativePlatform()) {
    console.log('⚠️ Local notification handlers only work on native platforms');
    return;
  }

  try {
    // Handle notification tap
    LocalNotifications.addListener('localNotificationActionPerformed', (notification) => {
      console.log('✅ Notification tapped:', notification);
      // Handle notification tap action here
      // For example, navigate to a specific page
    });

    console.log('✅ Local notification tap handler setup');
  } catch (error) {
    console.error('❌ Error setting up notification handler:', error);
  }
};

/**
 * Send a test notification
 */
export const sendTestNotification = async (title: string, body: string) => {
  if (!Capacitor.isNativePlatform()) {
    console.log('⚠️ Local notifications only work on native platforms (Android/iOS)');
    // For web, show a browser notification instead
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, { body });
    }
    return;
  }

  try {
    await LocalNotifications.schedule({
      notifications: [
        {
          title,
          body,
          id: Math.floor(Math.random() * 10000),
          schedule: { at: new Date(Date.now() + 1000) }, // 1 second from now
          smallIcon: 'ic_stat_icon_config_sample',
          iconColor: '#488AFF',
        },
      ],
    });

    console.log('✅ Test notification sent:', title);
  } catch (error) {
    console.error('❌ Error sending test notification:', error);
  }
};

/**
 * Request local notification permissions
 */
export const requestLocalNotificationPermission = async () => {
  if (!Capacitor.isNativePlatform()) {
    console.log('⚠️ Local notifications only work on native platforms');
    return false;
  }

  try {
    const permission = await LocalNotifications.requestPermissions();
    console.log('📍 Notification permissions:', permission);
    return permission.display === 'granted';
  } catch (error) {
    console.error('❌ Error requesting notification permission:', error);
    return false;
  }
};

/**
 * Cancel a scheduled notification
 */
export const cancelNotification = async (id: number) => {
  if (!Capacitor.isNativePlatform()) {
    return;
  }

  try {
    await LocalNotifications.cancel({ notifications: [{ id }] });
    console.log('✅ Notification cancelled:', id);
  } catch (error) {
    console.error('❌ Error cancelling notification:', error);
  }
};
