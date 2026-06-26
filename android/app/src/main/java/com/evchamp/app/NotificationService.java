package com.evchamp.app;

import android.app.Service;
import android.content.Intent;
import android.os.Handler;
import android.os.IBinder;
import android.os.Looper;
import android.util.Log;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Locale;

public class NotificationService extends Service {
    private Handler handler;
    private int notificationCount = 0;
    private static final int NOTIFICATION_INTERVAL = 5000; // 5 seconds

    @Override
    public void onCreate() {
        super.onCreate();
        Log.d("EVChamp", "🚀 NotificationService created");
        handler = new Handler(Looper.getMainLooper());
        NotificationHelper.createNotificationChannel(this);
    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        Log.d("EVChamp", "🚀 NotificationService started");
        startSendingNotifications();
        return START_STICKY;
    }

    private void startSendingNotifications() {
        handler.post(new Runnable() {
            @Override
            public void run() {
                notificationCount++;
                String timestamp = new SimpleDateFormat("HH:mm:ss", Locale.US).format(new Date());
                String title = "EVChamp Test #" + notificationCount;
                String message = "Notification at " + timestamp;
                
                Log.d("EVChamp", "📤 Sending notification #" + notificationCount);
                NotificationHelper.sendTestNotification(NotificationService.this, title, message);
                
                // Schedule next notification
                handler.postDelayed(this, NOTIFICATION_INTERVAL);
            }
        });
    }

    @Override
    public IBinder onBind(Intent intent) {
        return null;
    }

    @Override
    public void onDestroy() {
        super.onDestroy();
        Log.d("EVChamp", "🛑 NotificationService destroyed");
        handler.removeCallbacksAndMessages(null);
    }
}
