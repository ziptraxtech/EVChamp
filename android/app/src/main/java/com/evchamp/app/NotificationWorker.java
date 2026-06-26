package com.evchamp.app;

import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.content.Context;
import android.os.Build;
import android.util.Log;

import androidx.annotation.NonNull;
import androidx.core.app.NotificationCompat;
import androidx.core.app.NotificationManagerCompat;
import androidx.work.PeriodicWorkRequest;
import androidx.work.WorkManager;
import androidx.work.Worker;
import androidx.work.WorkerParameters;

import java.util.concurrent.TimeUnit;

public class NotificationWorker extends Worker {
    private static final String TAG = "EVChamp";
    private static final String CHANNEL_ID = "evchamp_default";
    private static int notificationCounter = 1;

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

    public NotificationWorker(@NonNull Context context, @NonNull WorkerParameters params) {
        super(context, params);
    }

    @NonNull
    @Override
    public Result doWork() {
        Log.d(TAG, "🔔 NotificationWorker triggered!");
        
        try {
            createNotificationChannel(getApplicationContext());
            
            long receivedTime = System.currentTimeMillis();
            int messageIndex = (int) (receivedTime / 1000) % MESSAGES.length;
            String title = TITLES[messageIndex];
            String message = MESSAGES[messageIndex];
            
            Log.d(TAG, "📢 Title: " + title);
            Log.d(TAG, "📝 Message: " + message);
            
            sendNotification(getApplicationContext(), title, message, notificationCounter++);
            
            Log.d(TAG, "✅ Notification sent successfully!");
            return Result.success();
        } catch (Exception e) {
            Log.e(TAG, "❌ Error in NotificationWorker:", e);
            return Result.retry();
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
                Log.d(TAG, "✅ Notification channel created");
            }
        }
    }

    private void sendNotification(Context context, String title, String message, int notificationId) {
        try {
            NotificationCompat.Builder builder = new NotificationCompat.Builder(context, CHANNEL_ID)
                .setSmallIcon(android.R.drawable.ic_dialog_info)
                .setContentTitle(title)
                .setContentText(message)
                .setAutoCancel(true)
                .setPriority(NotificationCompat.PRIORITY_HIGH)
                .setShowWhen(true)
                .setVibrate(new long[]{0, 500, 250, 500});

            NotificationManagerCompat notificationManager = NotificationManagerCompat.from(context);
            notificationManager.notify(notificationId, builder.build());

            Log.d(TAG, "✅ Notification sent: " + title);
        } catch (Exception e) {
            Log.e(TAG, "❌ Error sending notification:", e);
        }
    }

    /**
     * Schedule notifications at fixed times using WorkManager
     */
    public static void scheduleNotifications(Context context) {
        Log.d(TAG, "📅 Scheduling notifications using WorkManager...");
        
        try {
            // Schedule periodic work every 15 minutes
            PeriodicWorkRequest notificationWork = 
                new PeriodicWorkRequest.Builder(
                    NotificationWorker.class,
                    15,
                    TimeUnit.MINUTES
                ).build();

            WorkManager.getInstance(context).enqueueUniquePeriodicWork(
                "evchamp_notifications",
                androidx.work.ExistingPeriodicWorkPolicy.KEEP,
                notificationWork
            );
            
            Log.d(TAG, "✅ Notifications scheduled with WorkManager (every 15 minutes)");
        } catch (Exception e) {
            Log.e(TAG, "❌ Error scheduling notifications:", e);
        }
    }
}
