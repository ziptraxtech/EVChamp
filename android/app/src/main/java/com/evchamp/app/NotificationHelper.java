package com.evchamp.app;

import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.content.Context;
import android.os.Build;
import androidx.core.app.NotificationCompat;

public class NotificationHelper {
    private static final String CHANNEL_ID = "evchamp_notifications";
    private static final String CHANNEL_NAME = "EVChamp Notifications";
    private static int notificationId = 1;

    public static void createNotificationChannel(Context context) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            NotificationChannel channel = new NotificationChannel(
                    CHANNEL_ID,
                    CHANNEL_NAME,
                    NotificationManager.IMPORTANCE_HIGH
            );
            channel.setDescription("EVChamp test notifications");
            
            NotificationManager notificationManager = 
                    context.getSystemService(NotificationManager.class);
            if (notificationManager != null) {
                notificationManager.createNotificationChannel(channel);
                android.util.Log.d("EVChamp", "✅ Notification channel created");
            }
        }
    }

    public static void sendTestNotification(Context context, String title, String message) {
        createNotificationChannel(context);
        
        NotificationCompat.Builder builder = new NotificationCompat.Builder(context, CHANNEL_ID)
                .setSmallIcon(R.mipmap.ic_launcher)
                .setContentTitle(title)
                .setContentText(message)
                .setAutoCancel(true)
                .setPriority(NotificationCompat.PRIORITY_HIGH);

        NotificationManager notificationManager = 
                context.getSystemService(NotificationManager.class);
        if (notificationManager != null) {
            notificationManager.notify(notificationId++, builder.build());
            android.util.Log.d("EVChamp", "✅ Native notification sent: " + title);
        }
    }
}
