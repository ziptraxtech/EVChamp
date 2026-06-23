#!/usr/bin/env node

/**
 * Direct FCM Notification Sender
 * Paste your serviceAccountKey.json path below and run this script
 */

const admin = require("firebase-admin");
const path = require("path");

// ⚠️ MODIFY THIS PATH to your Firebase service account JSON
const serviceAccountPath = path.join(__dirname, "serviceAccountKey.json");

try {
  console.log("\n🔔 EVChamp FCM Direct Notification Sender\n");
  console.log(`Loading Firebase credentials from: ${serviceAccountPath}`);

  // Load your Firebase credentials
  const serviceAccount = require(serviceAccountPath);

  // Initialize Firebase Admin SDK
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });

  const messaging = admin.messaging();
  console.log("✅ Firebase Admin SDK initialized\n");

  // In-memory token store (in production, get from your database)
  const fcmTokens = new Set();

  // Example: Store a token (in real app, the mobile app sends this)
  // For testing, you can manually add a token here or from your backend logs
  // fcmTokens.add("your_fcm_token_here");

  console.log("📋 Instructions:");
  console.log("1. Run your backend: node server/index.js");
  console.log("2. Open EVChamp app on your Android device");
  console.log("3. Check logcat for: FCM device token: [token_here]");
  console.log("4. Copy that token and set it below:\n");

  // For now, send a test message to a specific topic that all devices subscribe to
  console.log("Sending test notification to 'all_users' topic...\n");

  const message = {
    notification: {
      title: "🔔 EVChamp Test",
      body: "Push notifications are working! ✅",
    },
    data: {
      type: "test",
      timestamp: Date.now().toString(),
    },
    android: {
      notification: {
        sound: "default",
        channelId: "evchamp_default",
        priority: "high",
      },
    },
  };

  messaging
    .sendToTopic("all_users", message)
    .then((messageId) => {
      console.log("✅ Notification sent to topic!");
      console.log(`   Message ID: ${messageId}\n`);
      console.log(
        "🎉 Check your Android device for the notification!\n"
      );
      process.exit(0);
    })
    .catch((error) => {
      console.error("❌ Error sending notification:", error.message);
      console.error(
        "\n💡 Common fixes:"
      );
      console.error("   1. Check serviceAccountKey.json path is correct");
      console.error("   2. Make sure app is running and subscribed to 'all_users' topic");
      console.error("   3. Check Firebase project ID matches\n");
      process.exit(1);
    });
} catch (err) {
  console.error("❌ Error:", err.message);
  console.error(
    "\n📝 Setup:"
  );
  console.error(
    "   1. Download serviceAccountKey.json from Firebase Console"
  );
  console.error(
    "   2. Place it in the project root directory"
  );
  console.error(
    "   3. Update the path in this script if needed"
  );
  console.error("   4. Run: node send-fcm-direct.js\n");
  process.exit(1);
}
