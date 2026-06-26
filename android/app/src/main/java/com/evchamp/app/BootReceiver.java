package com.evchamp.app;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.util.Log;

/**
 * BootReceiver: Reschedules notifications after device reboot
 * Ensures that alarms persist even after the device is powered off and back on
 */
public class BootReceiver extends BroadcastReceiver {
    private static final String TAG = "EVChamp";

    @Override
    public void onReceive(Context context, Intent intent) {
        if (Intent.ACTION_BOOT_COMPLETED.equals(intent.getAction())) {
            Log.d(TAG, "🔄 Device booted - rescheduling notifications");
            
            // Reschedule all notifications after device reboot
            NotificationScheduler.scheduleAll(context);
            
            Log.d(TAG, "✅ Notifications rescheduled after device boot");
        }
    }
}
