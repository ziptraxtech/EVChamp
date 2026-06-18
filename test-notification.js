#!/usr/bin/env node

/**
 * EVChamp Firebase Push Notification Tester
 * 
 * This script tests the push notification system before deployment
 * 
 * Usage:
 *   node test-notification.js
 *   API_URL=https://your-api.com node test-notification.js
 * 
 * Requirements:
 *   - Backend API running (deployed or local)
 *   - At least one Android device with EVChamp app installed and notifications enabled
 *   - App must be running in background or foreground
 */

const API_URL = process.env.API_URL || 'http://localhost:5000';
const TEST_NOTIFICATION_ENDPOINT = `${API_URL}/api/test-notification`;

// Configuration for custom test message
const CUSTOM_TITLE = process.env.TITLE || 'EVChamp';
const CUSTOM_BODY = process.env.BODY || 'Test Notification';

async function testNotification() {
  console.log('\n');
  console.log('╔══════════════════════════════════════════════════════════╗');
  console.log('║  🔔 EVChamp Push Notification Test                        ║');
  console.log('╚══════════════════════════════════════════════════════════╝');
  console.log('\n');

  console.log('📍 API URL:', API_URL);
  console.log('🎯 Endpoint:', TEST_NOTIFICATION_ENDPOINT);
  console.log('');

  try {
    console.log('⏳ Sending test notification...\n');

    const response = await fetch(TEST_NOTIFICATION_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({}),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('❌ Error Response:');
      console.error(JSON.stringify(data, null, 2));
      console.log('\n📝 Troubleshooting Steps:');
      
      if (data.error?.includes('Firebase')) {
        console.log('  1. ✓ Set FIREBASE_SERVICE_ACCOUNT_KEY environment variable');
        console.log('  2. ✓ Ensure Firebase project has Cloud Messaging enabled');
      }
      
      if (data.message?.includes('No active FCM tokens')) {
        console.log('  1. ✓ Build and run the EVChamp app on Android device');
        console.log('  2. ✓ Accept notification permissions when prompted');
        console.log('  3. ✓ Keep the app running (foreground or background)');
        console.log('  4. ✓ Check Firebase Console for registered devices');
      }
      
      process.exit(1);
    }

    console.log('✅ Success! Test notification sent!\n');
    console.log('📊 Response Details:');
    console.log(`  • Status: ${response.status} ${response.statusText}`);
    console.log(`  • Message ID: ${data.messageId || 'N/A'}`);
    console.log(`  • Device: ${data.tokenUsed || 'N/A'}`);
    console.log(`  • Total Active Devices: ${data.totalActiveTokens || 0}`);
    console.log(`  • Message: ${data.message}`);
    console.log('');

    if (data.success) {
      console.log('🎉 Push Notifications are working!\n');
      console.log('📱 Check your Android device - you should see the notification.');
      console.log('');
      console.log('Next Steps:');
      console.log('  1. Verify you received the notification on your device');
      console.log('  2. Click on the notification and verify it opens the app');
      console.log('  3. Test sending notifications from the Admin Panel');
      console.log('     → Navigate to /admin/notifications');
      console.log('  4. Deploy to production when ready!');
      console.log('');
    }

  } catch (error) {
    console.error('❌ Connection Error:');
    console.error(error.message);
    console.log('\n📝 Troubleshooting:');
    console.log(`  1. ✓ Check if API is running at ${API_URL}`);
    console.log('  2. ✓ Set API_URL environment variable if using different endpoint');
    console.log('  3. ✓ Verify CORS is enabled on backend');
    console.log('');
    console.log('Run with custom API URL:');
    console.log('  API_URL=https://your-api.com node test-notification.js');
    console.log('');
    process.exit(1);
  }
}

// Run the test
testNotification();
