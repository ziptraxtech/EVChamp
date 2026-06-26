package com.evchamp.app;

import android.app.AlarmManager;
import android.content.Context;
import android.util.Log;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.TimeZone;
import java.util.Locale;

/**
 * NotificationDebugger: Provides diagnostic information about alarm scheduling
 * Helps troubleshoot notification timing and delivery issues
 */
public class NotificationDebugger {
    private static final String TAG = "EVChamp-Debug";

    /**
     * Log comprehensive diagnostic information about the system and alarm setup
     */
    public static void logDiagnostics(Context context) {
        Log.d(TAG, "========== EVCHAMP NOTIFICATION DIAGNOSTICS ==========");

        // System Information
        Log.d(TAG, "Android Version: " + android.os.Build.VERSION.SDK_INT + " (" + android.os.Build.VERSION.RELEASE + ")");
        Log.d(TAG, "Device: " + android.os.Build.MANUFACTURER + " " + android.os.Build.MODEL);

        // Time Information
        logTimeInfo();

        // AlarmManager Information
        logAlarmManagerInfo(context);

        // Permissions Check
        logPermissions(context);

        Log.d(TAG, "========== END DIAGNOSTICS ==========");
    }

    private static void logTimeInfo() {
        // System timezone
        TimeZone systemTz = TimeZone.getDefault();
        Log.d(TAG, "System Timezone: " + systemTz.getID() + " (UTC offset: " + systemTz.getRawOffset() / 3600000 + " hours)");

        // Current system time
        Calendar systemCal = Calendar.getInstance();
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss zzz", Locale.US);
        Log.d(TAG, "System Time: " + sdf.format(systemCal.getTime()));

        // IST time
        TimeZone istTz = TimeZone.getTimeZone("Asia/Kolkata");
        Calendar istCal = Calendar.getInstance(istTz);
        Log.d(TAG, "IST Time: " + sdf.format(istCal.getTime()));

        // Offset difference
        long offsetDiff = (systemTz.getRawOffset() - istTz.getRawOffset()) / 60000;
        Log.d(TAG, "Timezone Offset Difference: " + offsetDiff + " minutes");
    }

    private static void logAlarmManagerInfo(Context context) {
        AlarmManager alarmManager = (AlarmManager) context.getSystemService(Context.ALARM_SERVICE);
        if (alarmManager == null) {
            Log.e(TAG, "❌ AlarmManager is null!");
            return;
        }

        Log.d(TAG, "✅ AlarmManager available");

        // Android 12+ specific checks
        if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.S) {
            try {
                boolean canScheduleExact = alarmManager.canScheduleExactAlarms();
                Log.d(TAG, "Can Schedule Exact Alarms (Android 12+): " + canScheduleExact);
            } catch (Exception e) {
                Log.e(TAG, "Error checking canScheduleExactAlarms: " + e.getMessage());
            }
        }

        // Check INTERVAL_DAY value
        Log.d(TAG, "AlarmManager.INTERVAL_DAY: " + AlarmManager.INTERVAL_DAY + " ms (" + (AlarmManager.INTERVAL_DAY / 1000 / 60 / 60) + " hours)");
    }

    private static void logPermissions(Context context) {
        Log.d(TAG, "Checking Permissions:");
        logPermission(context, "android.permission.SCHEDULE_EXACT_ALARM", "SCHEDULE_EXACT_ALARM");
        logPermission(context, "android.permission.POST_NOTIFICATIONS", "POST_NOTIFICATIONS");
        logPermission(context, "android.permission.WAKE_LOCK", "WAKE_LOCK");
        logPermission(context, "android.permission.RECEIVE_BOOT_COMPLETED", "RECEIVE_BOOT_COMPLETED");
    }

    private static void logPermission(Context context, String permission, String label) {
        int result = context.checkCallingOrSelfPermission(permission);
        String status = (result == android.content.pm.PackageManager.PERMISSION_GRANTED) ? "✅ GRANTED" : "❌ DENIED";
        Log.d(TAG, "  " + label + ": " + status);
    }

    /**
     * Log the next alarm times
     */
    public static void logNextAlarmTimes() {
        Log.d(TAG, "========== NEXT ALARM TIMES (IST) ==========");

        TimeZone istTz = TimeZone.getTimeZone("Asia/Kolkata");
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss zzz", Locale.US);

        // Next 11 AM
        Calendar next11am = Calendar.getInstance(istTz);
        next11am.set(Calendar.HOUR_OF_DAY, 11);
        next11am.set(Calendar.MINUTE, 0);
        next11am.set(Calendar.SECOND, 0);
        
        Calendar now = Calendar.getInstance(istTz);
        if (next11am.getTimeInMillis() <= now.getTimeInMillis()) {
            next11am.add(Calendar.DAY_OF_MONTH, 1);
        }
        
        Log.d(TAG, "Next 11:00 AM: " + sdf.format(next11am.getTime()));
        long msUntil11am = next11am.getTimeInMillis() - now.getTimeInMillis();
        Log.d(TAG, "  Time until: " + (msUntil11am / 1000 / 60) + " minutes");

        // Next 7 PM
        Calendar next7pm = Calendar.getInstance(istTz);
        next7pm.set(Calendar.HOUR_OF_DAY, 19);
        next7pm.set(Calendar.MINUTE, 0);
        next7pm.set(Calendar.SECOND, 0);
        
        if (next7pm.getTimeInMillis() <= now.getTimeInMillis()) {
            next7pm.add(Calendar.DAY_OF_MONTH, 1);
        }
        
        Log.d(TAG, "Next 7:00 PM: " + sdf.format(next7pm.getTime()));
        long msUntil7pm = next7pm.getTimeInMillis() - now.getTimeInMillis();
        Log.d(TAG, "  Time until: " + (msUntil7pm / 1000 / 60) + " minutes");

        Log.d(TAG, "========== END ALARM TIMES ==========");
    }
}
