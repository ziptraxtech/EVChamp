import { Capacitor } from '@capacitor/core';
import { LocalNotifications } from '@capacitor/local-notifications';

/**
 * Hardcoded local notifications — scheduled on-device at random time slots.
 *
 * Unlike Firebase push, these need NO backend, NO tokens and NO internet.
 * The messages are baked into the app and the OS fires them even when the
 * app is closed. Best for engagement nudges / reminders.
 *
 * Trade-off: because the text ships inside the APK, you can't change it
 * remotely — for that, keep using the FCM admin panel.
 */

// ---- 1. Hardcoded message pool ---------------------------------------------
const MESSAGES: { title: string; body: string }[] = [
  { title: '⚡ EVChamp', body: 'Find your nearest EV charging station and get back on the road faster.' },
  { title: '🔋 Battery Check', body: 'Planning a drive today? Check your battery level before you leave.' },
  { title: '📍 Charger Near You', body: 'Explore nearby EV charging stations with EVChamp.' },
  { title: '🚗 Plan Your EV Trip', body: 'Find charging stations along your route before starting your journey.' },
  { title: '🌱 Drive Green', body: 'Every electric journey helps build a cleaner and greener future.' },
  { title: '🔌 Stay Charged', body: 'A quick charging stop can keep your journey smooth and stress-free.' },
  { title: '🗺️ Smart Route Planning', body: 'Use EVChamp to locate convenient chargers along your travel route.' },
  { title: '💸 Explore EV Deals', body: 'Discover the latest electric vehicle products and offers on EVChamp.' },
  { title: '🛠️ EV Support', body: 'Need help with your EV? Explore service and roadside assistance options.' },
  { title: '⭐ EVChamp Tip', body: 'Try to keep your EV battery between 20% and 80% for daily use.' },
  { title: '🚘 Ready for the Road?', body: 'Check nearby charging options before heading out today.' },
  { title: '🔋 Charge Smarter', body: 'Plan your charging break early and avoid unnecessary travel delays.' },
  { title: '📲 Open EVChamp', body: 'Your nearest charging station may be just a few taps away.' },
  { title: '🌍 Power Your Journey', body: 'Explore EV charging locations across India with EVChamp.' },
  { title: '⚡ Quick Charging Reminder', body: 'Low battery? Find a nearby charging point before your next trip.' },
  { title: '🧭 Travel With Confidence', body: 'Locate EV chargers and plan a smoother electric journey today.' },
  { title: '🔧 Keep Your EV Healthy', body: 'Regular checks can help improve your EV’s performance and reliability.' },
  { title: '🏪 EV Marketplace', body: 'Browse useful EV accessories, services, and mobility solutions.' },
  { title: '🚨 Roadside Support', body: 'EV trouble on the road? Explore available assistance through EVChamp.' },
  { title: '💚 Your EV Companion', body: 'Charging, navigation, support, and EV services—all in one place.' },
];

// Fixed daily delivery times in the device's local time: 11 AM and 7 PM.
const SLOT_HOURS = [11, 19];
// How many days ahead to pre-schedule. With 2 slots/day we queue
// DAYS_AHEAD * 2 notifications at once. The OS fires them even if the app
// is closed; just reopen within this window to top the schedule back up.
const DAYS_AHEAD = 14;

// ---- 2. Helpers ------------------------------------------------------------
const MS_PER_DAY = 24 * 60 * 60 * 1000;

/** Whole-day number since the Unix epoch, based on the local calendar date. */
const localDayNumber = (date: Date): number =>
  Math.floor(
    new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime() /
      MS_PER_DAY
  );

/**
 * Build the upcoming notification schedule: two per day (11 AM & 7 PM) for
 * the next DAYS_AHEAD days, skipping any slot that has already passed today.
 *
 * Message selection is deterministic — keyed off the absolute day number and
 * the slot index — so the 20-message pool runs as a fixed rolling sequence:
 *   • the two messages on any given day are always different, and
 *   • with 2 messages/day the whole pool only repeats once every 10 days.
 * Because a calendar slot always maps to the same message, re-running this on
 * every app launch tops the queue back up without causing early repeats.
 */
const buildSchedule = () => {
  const now = new Date();
  const items: { id: number; at: Date; msg: { title: string; body: string } }[] = [];

  for (let d = 0; d < DAYS_AHEAD; d++) {
    const day = new Date(now);
    day.setDate(day.getDate() + d);
    const dayNum = localDayNumber(day);

    SLOT_HOURS.forEach((hour, slot) => {
      const at = new Date(day);
      at.setHours(hour, 0, 0, 0);

      // Skip slots that are already in the past (e.g. 11 AM when it's noon).
      if (at.getTime() <= now.getTime()) return;

      const seq = dayNum * SLOT_HOURS.length + slot;
      const msg = MESSAGES[((seq % MESSAGES.length) + MESSAGES.length) % MESSAGES.length];

      items.push({ id: 1000 + items.length, at, msg });
    });
  }

  return items;
};

// ---- 3. Public API ---------------------------------------------------------
/**
 * Request permission and schedule the fixed daily notifications (11 AM & 7 PM)
 * for the next DAYS_AHEAD days. Safe to call on every app launch — it clears
 * any previously scheduled batch first so they don't pile up, then re-queues
 * the deterministic sequence.
 */
export const scheduleLocalNotifications = async () => {
  // Local notifications only work in the native app, not the browser.
  if (!Capacitor.isNativePlatform()) {
    return;
  }

  try {
    // Ask for permission (Android 13+ / iOS).
    const perm = await LocalNotifications.requestPermissions();
    if (perm.display !== 'granted') {
      console.log('❌ Local notification permission not granted');
      return;
    }

    // Create the Android channel (matches our FCM channel id/colour).
    await LocalNotifications.createChannel({
      id: 'evchamp_default',
      name: 'EVChamp Notifications',
      description: 'Charging reminders and EV updates',
      importance: 5,
      visibility: 1,
      sound: undefined,
    }).catch(() => { /* iOS has no channels — ignore */ });

    // Clear any previously scheduled local notifications so we don't stack up.
    const pending = await LocalNotifications.getPending();
    if (pending.notifications.length > 0) {
      await LocalNotifications.cancel({ notifications: pending.notifications });
    }

    // Build the fixed 11 AM / 7 PM schedule for the next DAYS_AHEAD days.
    const toSchedule = buildSchedule().map((item) => ({
      id: item.id, // stable id range for our local batch
      title: item.msg.title,
      body: item.msg.body,
      channelId: 'evchamp_default',
      smallIcon: 'ic_launcher',
      schedule: { at: item.at, allowWhileIdle: true },
      extra: { action: 'navigate', target: '/' },
    }));

    if (toSchedule.length === 0) {
      console.log('ℹ️ No future notification slots to schedule right now.');
      return;
    }

    await LocalNotifications.schedule({ notifications: toSchedule });

    console.log(
      `✅ Scheduled ${toSchedule.length} local notifications:`,
      toSchedule.map((n) => n.schedule.at.toLocaleString())
    );
  } catch (error) {
    console.error('❌ Error scheduling local notifications:', error);
  }
};

/**
 * Handle taps on local notifications (deep-link navigation).
 * Call this once at app startup.
 */
export const setupLocalNotificationTapHandler = async () => {
  if (!Capacitor.isNativePlatform()) return;

  await LocalNotifications.addListener(
    'localNotificationActionPerformed',
    (event) => {
      const extra = (event?.notification?.extra || {}) as Record<string, string>;
      const target = extra.target || '/';
      console.log('👆 Local notification tapped → navigate:', target);
      if (target) {
        window.location.href = target;
      }
    }
  );
};

/** Cancel all scheduled local notifications. */
export const cancelLocalNotifications = async () => {
  if (!Capacitor.isNativePlatform()) return;
  const pending = await LocalNotifications.getPending();
  if (pending.notifications.length > 0) {
    await LocalNotifications.cancel({ notifications: pending.notifications });
  }
};

/**
 * 🔔 TEST HELPER — fire a single notification a few seconds from now.
 *
 * Use this to verify notifications work on a device without waiting for the
 * 11 AM / 7 PM slots. Pick a random message from the pool so you can see the
 * real content + emoji rendering.
 *
 * Trigger options:
 *   • In the device webview console:  window.__testNotification()
 *   • Or wire it to a debug button / call it from App.tsx temporarily.
 *
 * @param delaySeconds how many seconds from now to fire (default 5).
 */
export const sendTestNotification = async (delaySeconds = 5) => {
  if (!Capacitor.isNativePlatform()) {
    console.log('ℹ️ Local notifications only work on a real device/emulator, not the browser.');
    return;
  }

  try {
    const perm = await LocalNotifications.requestPermissions();
    if (perm.display !== 'granted') {
      console.log('❌ Local notification permission not granted');
      return;
    }

    await LocalNotifications.createChannel({
      id: 'evchamp_default',
      name: 'EVChamp Notifications',
      description: 'Charging reminders and EV updates',
      importance: 5,
      visibility: 1,
      sound: undefined,
    }).catch(() => { /* iOS has no channels — ignore */ });

    const msg = MESSAGES[Math.floor(Math.random() * MESSAGES.length)];
    const at = new Date(Date.now() + delaySeconds * 1000);

    await LocalNotifications.schedule({
      notifications: [
        {
          id: 9999, // dedicated test id, separate from the 1000+ batch
          title: msg.title,
          body: msg.body,
          channelId: 'evchamp_default',
          smallIcon: 'ic_launcher',
          schedule: { at, allowWhileIdle: true },
          extra: { action: 'navigate', target: '/' },
        },
      ],
    });

    console.log(`✅ Test notification scheduled for ${at.toLocaleTimeString()} (${delaySeconds}s):`, msg.title);
  } catch (error) {
    console.error('❌ Error sending test notification:', error);
  }
};

// Expose the test helper on window so you can trigger it from the device
// webview console (chrome://inspect) without rebuilding: window.__testNotification()
if (typeof window !== 'undefined') {
  (window as unknown as { __testNotification?: typeof sendTestNotification }).__testNotification =
    sendTestNotification;
}

