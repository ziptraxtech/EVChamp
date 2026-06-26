import { LocalNotifications } from '@capacitor/local-notifications';
import { Capacitor } from '@capacitor/core';

let notificationIntervalId: NodeJS.Timeout | null = null;
let notificationCounter = 0;

/**
 * Schedule local notifications - sends continuous notifications every 5 seconds
 */
export const scheduleLocalNotifications = async () => {
  console.log('🚀 scheduleLocalNotifications called');
  
  if (!Capacitor.isNativePlatform()) {
    console.log('⚠️ Local notifications only work on native platforms (Android/iOS)');
    return;
  }

  try {
    console.log('📍 Requesting notification permissions...');
    // Request notification permissions
    const permission = await LocalNotifications.requestPermissions();
    console.log('📍 Notification permission response:', JSON.stringify(permission));

    // Listen for notifications being sent
    LocalNotifications.addListener('localNotificationReceived', (notification) => {
      console.log('🔔 Notification received:', JSON.stringify(notification));
    });

    // Send first notification immediately
    notificationCounter = 0;
    console.log('📤 Sending first notification...');
    await sendNextNotification();

    // Then send continuous notifications every 5 seconds
    console.log('⏰ Starting continuous notification interval (5 seconds)');
    notificationIntervalId = setInterval(async () => {
      console.log('⏰ Interval tick - sending notification');
      await sendNextNotification();
    }, 5000); // 5000 milliseconds = 5 seconds

    console.log('✅ Continuous notifications started (every 5 seconds)');
  } catch (error) {
    console.error('❌ Error scheduling local notifications:', error);
  }
};

/**
 * Send the next notification in the sequence
 */
const sendNextNotification = async () => {
  notificationCounter++;
  const timestamp = new Date().toLocaleTimeString();
  const notificationId = 1000 + (notificationCounter % 1000); // Keep IDs under control

  console.log(`📤 Preparing notification #${notificationCounter}, ID: ${notificationId}, Time: ${timestamp}`);

  try {
    const notifications = [
      {
        title: 'EVChamp Test #' + notificationCounter,
        body: `Notification received at ${timestamp}`,
        id: notificationId,
        autoCancel: true,
        smallIcon: 'ic_stat_icon_config_sample',
        iconColor: '#488AFF',
      },
    ];

    console.log(`📤 Scheduling notification: ${JSON.stringify(notifications[0])}`);
    
    await LocalNotifications.schedule({
      notifications: notifications,
    });

    console.log(`✅ Notification #${notificationCounter} scheduled with ID ${notificationId}`);
  } catch (error) {
    console.error(`❌ Error sending notification #${notificationCounter}:`, error);
  }
};

/**
 * Stop sending continuous notifications
 */
export const stopContinuousNotifications = () => {
  if (notificationIntervalId) {
    clearInterval(notificationIntervalId);
    notificationIntervalId = null;
    console.log('✅ Continuous notifications stopped');
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
