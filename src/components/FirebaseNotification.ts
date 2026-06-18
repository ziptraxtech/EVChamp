import { Capacitor } from '@capacitor/core';
import { FirebaseMessaging } from '@capacitor-firebase/messaging';

let initialized = false;
let currentFCMToken: string | null = null;

// Store notification callbacks for UI updates
export let onNotificationReceived: ((notification: any) => void) | null = null;
export let onNotificationActionPerformed: ((notification: any) => void) | null = null;

export const initializePushNotifications = async (): Promise<void> => {
  if (initialized || !Capacitor.isNativePlatform()) {
    return;
  }

  initialized = true;

  try {
    const permission = await FirebaseMessaging.requestPermissions();

    if (permission.receive !== 'granted') {
      console.log('Notification permission denied.');
      return;
    }

    const tokenResult = await FirebaseMessaging.getToken();
    currentFCMToken = tokenResult.token;

    console.log('FCM device token:', currentFCMToken);

    // Store token on backend
    await storeFCMTokenOnBackend(currentFCMToken);

    await FirebaseMessaging.subscribeToTopic({
      topic: 'all_users',
    });

    console.log('Subscribed to all_users topic');

    await FirebaseMessaging.addListener(
      'notificationReceived',
      event => {
        console.log('Notification received:', event);
        
        // Show visual notification to user
        if (onNotificationReceived) {
          onNotificationReceived(event);
        }
        
        // Auto-show alert with notification details
        const title = event.notification?.title || 'New Notification';
        const body = event.notification?.body || 'You have a new message';
        
        showNotificationAlert(title, body, event.notification?.data as Record<string, string> | undefined);
      },
    );

    await FirebaseMessaging.addListener(
      'notificationActionPerformed',
      event => {
        console.log('Notification opened/interacted:', event);
        
        if (onNotificationActionPerformed) {
          onNotificationActionPerformed(event);
        }
        
        // Handle navigation or actions based on notification data
        handleNotificationAction(event.notification?.data as Record<string, string> | undefined);
      },
    );

    console.log('Push notifications initialized successfully');
  } catch (error) {
    initialized = false;
    console.error('Firebase Messaging setup failed:', error);
  }
};

// Store FCM token on backend for later use
async function storeFCMTokenOnBackend(token: string): Promise<void> {
  try {
    const response = await fetch('/api/store-fcm-token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token }),
    });

    if (!response.ok) {
      console.warn('Failed to store FCM token on backend');
      return;
    }

    console.log('FCM token stored successfully');
  } catch (error) {
    console.error('Error storing FCM token:', error);
  }
}

// Show notification alert as toast
function showNotificationAlert(
  title: string,
  body: string,
  data?: Record<string, string>
): void {
  const notificationDiv = document.createElement('div');
  notificationDiv.id = `notification-${Date.now()}`;
  notificationDiv.className = 'fixed top-4 right-4 max-w-md bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg shadow-xl p-4 z-50';
  notificationDiv.innerHTML = `
    <div class="flex items-start justify-between gap-3">
      <div class="flex-1">
        <h3 class="font-semibold text-white mb-1">${escapeHtml(title)}</h3>
        <p class="text-sm text-blue-100">${escapeHtml(body)}</p>
      </div>
      <button class="text-blue-200 hover:text-white">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
    </div>
  `;

  const closeBtn = notificationDiv.querySelector('button');
  if (closeBtn) {
    closeBtn.onclick = () => notificationDiv.remove();
  }

  document.body.appendChild(notificationDiv);

  // Auto-remove after 6 seconds
  setTimeout(() => {
    if (document.contains(notificationDiv)) {
      notificationDiv.remove();
    }
  }, 6000);
}

// Handle notification actions (navigation, etc.)
function handleNotificationAction(data?: Record<string, string>): void {
  if (!data) return;

  const action = data.action || data.type;
  const targetPath = data.targetPath || data.url;

  console.log('Handling notification action:', { action, targetPath });

  // Navigate to target path if provided
  if (targetPath) {
    window.location.href = targetPath;
  }
}

// Escape HTML to prevent XSS
function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return text.replace(/[&<>"']/g, (char) => map[char]);
}

// Getter for FCM token
export const getFCMToken = (): string | null => currentFCMToken;

// Register callback for notification events
export const registerNotificationCallbacks = (
  onReceived?: (notification: any) => void,
  onAction?: (notification: any) => void
): void => {
  if (onReceived) onNotificationReceived = onReceived;
  if (onAction) onNotificationActionPerformed = onAction;
};