package com.evchamp.app;

import android.app.AlarmManager;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.os.Build;
import android.util.Log;
import androidx.core.app.NotificationCompat;
import androidx.core.app.NotificationManagerCompat;

import java.util.Calendar;
import java.util.Random;
import java.util.TimeZone;

public class NotificationReceiver extends BroadcastReceiver {
    private static final String TAG = "EVChamp";
    private static final String CHANNEL_ID = "evchamp_default";
    private static int notificationCounter = 1;

    // EV-related messages
    private static final String[] MESSAGES = {
        "Find your nearest EV charging station and get back on the road faster.",
        "Planning a drive today? Check your battery level before you leave.",
        "Explore nearby EV charging stations with EVChamp.",
        "Find charging stations along your route before starting your journey.",
        "Every electric journey helps build a cleaner and greener future.",
        "A quick charging stop can keep your journey smooth and stress-free.",
        "Use EVChamp to locate convenient chargers along your travel route.",
        "Discover the latest electric vehicle products and offers on EVChamp.",
        "Need help with your EV? Explore service and roadside assistance options.",
        "Try to keep your EV battery between 20% and 80% for daily use.",
        "Check nearby charging options before heading out today.",
        "Plan your charging break early and avoid unnecessary travel delays.",
        "Your nearest charging station may be just a few taps away.",
        "Explore EV charging locations across India with EVChamp.",
        "Low battery? Find a nearby charging point before your next trip.",
        "Locate EV chargers and plan a smoother electric journey today.",
        "Regular checks can help improve your EV's performance and reliability.",
        "Browse useful EV accessories, services, and mobility solutions.",
        "EV trouble on the road? Explore available assistance through EVChamp.",
        "Charging, navigation, support, and EV services—all in one place."
    };

    private static final String[] TITLES = {
        "⚡ EVChamp",
        "🔋 Battery Check",
        "📍 Charger Near You",
        "🚗 Plan Your EV Trip",
        "🌱 Drive Green",
        "🔌 Stay Charged",
        "🗺️ Smart Route Planning",
        "💸 Explore EV Deals",
        "🛠️ EV Support",
        "⭐ EVChamp Tip",
        "🚘 Ready for the Road?",
        "🔋 Charge Smarter",
        "📲 Open EVChamp",
        "🌍 Power Your Journey",
        "⚡ Quick Charging Reminder",
        "🧭 Travel With Confidence",
        "🔧 Keep Your EV Healthy",
        "🏪 EV Marketplace",
        "🚨 Roadside Support",
        "💚 Your EV Companion"
    };

    @Override
    public void onReceive(Context context, Intent intent) {
        long receivedTime = System.currentTimeMillis();
        Log.d(TAG, "🔔 NotificationReceiver triggered at " + new java.util.Date(receivedTime));
        
        try {
            String action = intent.getAction();
            Log.d(TAG, "📬 Intent Action: " + action);
            
            // Extract the notification slot (request code)
            int notificationSlot = intent.getIntExtra("notification_slot", -1);
            Log.d(TAG, "📤 Notification Slot: " + notificationSlot);

            if (notificationSlot == -1) {
                Log.w(TAG, "⚠️ No notification_slot in intent");
                return;
            }

            // Create notification channel
            createNotificationChannel(context);

            // Get random message
            Random random = new Random();
            int messageIndex = random.nextInt(MESSAGES.length);
            String title = TITLES[messageIndex];
            String message = MESSAGES[messageIndex];
            
            Log.d(TAG, "📋 Message Index: " + messageIndex);
            Log.d(TAG, "📢 Title: " + title);
            Log.d(TAG, "📝 Message: " + message);

            sendNotification(context, title, message, notificationCounter++);

            // IMPORTANT: Reschedule only this specific alarm for tomorrow
            rescheduleAlarmForTomorrow(context, notificationSlot);
            
            Log.d(TAG, "✅ Notification complete!");
        } catch (Exception e) {
            Log.e(TAG, "❌ Error in onReceive:", e);
            e.printStackTrace();
        }
    }

    private void rescheduleAlarmForTomorrow(Context context, int notificationSlot) {
        try {
            Log.d(TAG, "🔄 Rescheduling alarm slot " + notificationSlot + "...");
            
            // Don't reschedule immediate test notification
            if (notificationSlot == 9000) {
                Log.d(TAG, "🧪 Immediate notification - skipping reschedule");
                return;
            }
            
            AlarmManager alarmManager = (AlarmManager) context.getSystemService(Context.ALARM_SERVICE);
            if (alarmManager == null) {
                Log.e(TAG, "❌ AlarmManager not available");
                return;
            }

            // Reschedule for 8 hours from now
            TimeZone istTimeZone = TimeZone.getTimeZone("Asia/Kolkata");
            Calendar calendar = Calendar.getInstance(istTimeZone);
            calendar.add(Calendar.HOUR_OF_DAY, 8);
            calendar.set(Calendar.MINUTE, 0);
            calendar.set(Calendar.SECOND, 0);
            calendar.set(Calendar.MILLISECOND, 0);

            Log.d(TAG, "📅 Rescheduled for: " + calendar.getTime() + " (8 hours from now)");

            // Create new alarm intent with the same notification_slot
            Intent newIntent = new Intent(context, NotificationReceiver.class);
            newIntent.setAction("com.evchamp.ALARM");
            newIntent.putExtra("notification_slot", notificationSlot);

            PendingIntent pendingIntent = PendingIntent.getBroadcast(
                context,
                notificationSlot,  // Use the same request code
                newIntent,
                PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE
            );

            // Schedule using exact or inexact based on permissions
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
                if (alarmManager.canScheduleExactAlarms()) {
                    alarmManager.setExactAndAllowWhileIdle(
                        AlarmManager.RTC_WAKEUP,
                        calendar.getTimeInMillis(),
                        pendingIntent
                    );
                    Log.d(TAG, "✅ Exact alarm rescheduled for slot " + notificationSlot);
                } else {
                    alarmManager.setAndAllowWhileIdle(
                        AlarmManager.RTC_WAKEUP,
                        calendar.getTimeInMillis(),
                        pendingIntent
                    );
                    Log.d(TAG, "✅ Inexact alarm rescheduled for slot " + notificationSlot);
                }
            } else {
                alarmManager.setAndAllowWhileIdle(
                    AlarmManager.RTC_WAKEUP,
                    calendar.getTimeInMillis(),
                    pendingIntent
                );
                Log.d(TAG, "✅ Alarm rescheduled for slot " + notificationSlot);
            }

        } catch (Exception e) {
            Log.e(TAG, "❌ Error rescheduling:", e);
            e.printStackTrace();
        }
    }

    private void createNotificationChannel(Context context) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            NotificationChannel channel = new NotificationChannel(
                CHANNEL_ID,
                "EVChamp Notifications",
                NotificationManager.IMPORTANCE_HIGH
            );
            channel.setDescription("Daily EV charging reminders and tips");
            channel.enableVibration(true);
            channel.setShowBadge(true);

            NotificationManager notificationManager = 
                    context.getSystemService(NotificationManager.class);
            if (notificationManager != null) {
                notificationManager.createNotificationChannel(channel);
                Log.d(TAG, "✅ Notification channel created/updated");
            }
        }
    }

    private void sendNotification(Context context, String title, String message, int notificationId) {
        try {
            Log.d(TAG, "🏗️  Building notification with ID: " + notificationId);
            
            // Create intent to open MainActivity when notification is clicked
            Intent launchIntent = new Intent(context, MainActivity.class);
            launchIntent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_SINGLE_TOP);
            
            PendingIntent contentIntent = PendingIntent.getActivity(
                context,
                0,
                launchIntent,
                PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE
            );
            
            NotificationCompat.Builder builder = new NotificationCompat.Builder(context, CHANNEL_ID)
                .setSmallIcon(android.R.drawable.ic_dialog_info)
                .setContentTitle(title)
                .setContentText(message)
                .setAutoCancel(true)
                .setPriority(NotificationCompat.PRIORITY_HIGH)
                .setShowWhen(true)
                .setVibrate(new long[]{0, 500, 250, 500})
                .setContentIntent(contentIntent);  // Add click action

            NotificationManagerCompat notificationManager = NotificationManagerCompat.from(context);
            notificationManager.notify(notificationId, builder.build());

            Log.d(TAG, "✅ Notification sent successfully with title: " + title);
            Log.d(TAG, "✅ Message: " + message);
        } catch (Exception e) {
            Log.e(TAG, "❌ Error sending notification:", e);
            e.printStackTrace();
        }
    }
}
