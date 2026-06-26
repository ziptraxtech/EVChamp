package com.evchamp.app;

import android.app.AlarmManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Build;
import android.util.Log;

import java.util.Calendar;
import java.util.TimeZone;

public class NotificationScheduler {
    private static final String TAG = "EVChampAlarm";

    // Notification time slots - every 8 hours
    private static final int SLOT_1 = 2001;      // First notification (immediate + 0 hours)
    private static final int SLOT_2 = 2002;      // Second notification (first + 8 hours)
    private static final int SLOT_3 = 2003;      // Third notification (first + 16 hours)

    /**
     * Schedule notifications every 8 hours starting immediately
     */
    public static void scheduleAll(Context context) {
        Log.d(TAG, "📅 Scheduling notifications every 8 hours starting now");

        AlarmManager alarmManager = (AlarmManager) context.getSystemService(Context.ALARM_SERVICE);
        if (alarmManager == null) {
            Log.e(TAG, "❌ AlarmManager not available");
            return;
        }

        // Check if this is the first time the app is opened
        SharedPreferences prefs = context.getSharedPreferences("EVChampNotifications", Context.MODE_PRIVATE);
        boolean isFirstTime = prefs.getBoolean("first_open", true);
        
        if (isFirstTime) {
            Log.d(TAG, "🎉 First time opening - sending immediate notification and scheduling 8-hour loop");
            // Send first notification IMMEDIATELY
            sendImmediateNotification(context);
            
            // Mark that we've already sent the first notification
            prefs.edit().putBoolean("first_open", false).commit();
        } else {
            Log.d(TAG, "⏭️ Not first time - skipping immediate notification");
        }
        
        // Schedule three separate alarms - 8 hours apart
        scheduleAlarmAtOffset(context, alarmManager, 8, SLOT_1);   // +8 hours
        scheduleAlarmAtOffset(context, alarmManager, 16, SLOT_2);  // +16 hours
        scheduleAlarmAtOffset(context, alarmManager, 24, SLOT_3);  // +24 hours (next day)

        Log.d(TAG, "✅ All three 8-hour notification slots scheduled");
    }

    /**
     * Send a test notification immediately
     */
    private static void sendImmediateNotification(Context context) {
        try {
            Log.d(TAG, "🔔 Sending IMMEDIATE notification");
            Intent intent = new Intent(context, NotificationReceiver.class);
            intent.setAction("com.evchamp.ALARM");
            intent.putExtra("notification_slot", 9000);
            intent.putExtra("immediate", true);
            
            context.sendBroadcast(intent);
            Log.d(TAG, "✅ Immediate notification sent");
        } catch (Exception e) {
            Log.e(TAG, "❌ Error sending immediate notification:", e);
        }
    }

    /**
     * Schedule alarm at specific hours offset from now
     */
    private static void scheduleAlarmAtOffset(Context context, AlarmManager alarmManager,
                                               int hoursOffset, int requestCode) {
        try {
            TimeZone istTimeZone = TimeZone.getTimeZone("Asia/Kolkata");
            Calendar calendar = Calendar.getInstance(istTimeZone);
            
            // Add hours to current time
            calendar.add(Calendar.HOUR_OF_DAY, hoursOffset);
            calendar.set(Calendar.MINUTE, 0);
            calendar.set(Calendar.SECOND, 0);
            calendar.set(Calendar.MILLISECOND, 0);

            long triggerTime = calendar.getTimeInMillis();
            Log.d(TAG, "Scheduled slot " + requestCode + " for " + new java.util.Date(triggerTime) + " (+" + hoursOffset + " hours)");

            // Create intent with unique request code
            Intent intent = new Intent(context, NotificationReceiver.class);
            intent.setAction("com.evchamp.ALARM");
            intent.putExtra("notification_slot", requestCode);

            PendingIntent pendingIntent = PendingIntent.getBroadcast(
                context,
                requestCode,
                intent,
                PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE
            );

            // Schedule using exact or inexact based on permissions
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
                if (alarmManager.canScheduleExactAlarms()) {
                    alarmManager.setExactAndAllowWhileIdle(
                        AlarmManager.RTC_WAKEUP,
                        triggerTime,
                        pendingIntent
                    );
                    Log.d(TAG, "✅ Exact alarm set for slot " + requestCode);
                } else {
                    alarmManager.setAndAllowWhileIdle(
                        AlarmManager.RTC_WAKEUP,
                        triggerTime,
                        pendingIntent
                    );
                    Log.d(TAG, "✅ Inexact alarm set for slot " + requestCode);
                }
            } else {
                alarmManager.setAndAllowWhileIdle(
                    AlarmManager.RTC_WAKEUP,
                    triggerTime,
                    pendingIntent
                );
                Log.d(TAG, "✅ Alarm set for slot " + requestCode);
            }

        } catch (Exception e) {
            Log.e(TAG, "❌ Error scheduling alarm:", e);
            e.printStackTrace();
        }
    }

    /**
     * Cancel all scheduled notifications
     */
    public static void cancelAll(Context context) {
        try {
            AlarmManager alarmManager = (AlarmManager) context.getSystemService(Context.ALARM_SERVICE);
            if (alarmManager == null) return;

            int[] requestCodes = {SLOT_1, SLOT_2, SLOT_3};

            for (int requestCode : requestCodes) {
                Intent intent = new Intent(context, NotificationReceiver.class);
                intent.setAction("com.evchamp.ALARM");

                PendingIntent pendingIntent = PendingIntent.getBroadcast(
                    context,
                    requestCode,
                    intent,
                    PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE
                );

                alarmManager.cancel(pendingIntent);
                Log.d(TAG, "❌ Cancelled alarm: " + requestCode);
            }

            Log.d(TAG, "✅ All alarms cancelled");
        } catch (Exception e) {
            Log.e(TAG, "❌ Error cancelling alarms:", e);
            e.printStackTrace();
        }
    }
}
