#!/usr/bin/env node

/**
 * Quick FCM Token Registration Test
 * 
 * This script will help you test the FCM token registration without
 * needing to have the mobile app running yet.
 * 
 * Usage:
 *   node test-fcm-setup.js
 */

const fs = require('fs');
const path = require('path');

console.log('\n╔══════════════════════════════════════════════════════════╗');
console.log('║  🔔 EVChamp FCM Setup Test                                 ║');
console.log('╚══════════════════════════════════════════════════════════╝\n');

// Check if server/.env exists
const envPath = path.join(__dirname, 'server', '.env');
const envExamplePath = path.join(__dirname, 'server', '.env.example');

console.log('📋 Checking server configuration...\n');

if (!fs.existsSync(envPath)) {
  console.log('❌ server/.env does not exist yet');
  console.log('\n📍 To fix this:\n');
  console.log('1. Go to Firebase Console: https://console.firebase.google.com');
  console.log('2. Select your EVChamp project');
  console.log('3. Navigate to Project Settings → Service Accounts tab');
  console.log('4. Click "Generate New Private Key" and download the JSON file');
  console.log('5. Minify the JSON and copy it\n');
  console.log('   OR run: node scripts/format-firebase-key.js /path/to/key.json\n');
  console.log('6. Then create server/.env with:');
  console.log('   cp server/.env.example server/.env');
  console.log('   # Edit server/.env and paste the minified Firebase key\n');
  process.exit(1);
}

try {
  const envContent = fs.readFileSync(envPath, 'utf8');
  const hasFirebaseKey = envContent.includes('FIREBASE_SERVICE_ACCOUNT_KEY=') && 
                         !envContent.includes('FIREBASE_SERVICE_ACCOUNT_KEY={') === false &&
                         envContent.split('FIREBASE_SERVICE_ACCOUNT_KEY=')[1]?.trim().length > 50;
  
  if (!hasFirebaseKey) {
    console.log('⚠️  server/.env exists but FIREBASE_SERVICE_ACCOUNT_KEY is empty or invalid');
    console.log('\n📝 Fix this:');
    console.log('1. Get your Firebase service account key from Firebase Console');
    console.log('2. Run: node scripts/format-firebase-key.js /path/to/firebase-key.json');
    console.log('3. Edit server/.env and paste the output as FIREBASE_SERVICE_ACCOUNT_KEY value\n');
    process.exit(1);
  }

  console.log('✅ server/.env exists');
  console.log('✅ FIREBASE_SERVICE_ACCOUNT_KEY is configured\n');

  // Check other required keys
  const hasAdminKey = envContent.includes('ADMIN_API_KEY=') && 
                      envContent.split('ADMIN_API_KEY=')[1]?.trim().length > 10;
  const hasRazorpayKey = envContent.includes('RAZORPAY_KEY_ID=') && 
                         envContent.split('RAZORPAY_KEY_ID=')[1]?.trim().length > 5;
  const hasRazorpaySecret = envContent.includes('RAZORPAY_KEY_SECRET=') && 
                            envContent.split('RAZORPAY_KEY_SECRET=')[1]?.trim().length > 5;

  console.log('🔐 Configuration Status:');
  console.log(`  ${hasFirebaseKey ? '✅' : '❌'} FIREBASE_SERVICE_ACCOUNT_KEY`);
  console.log(`  ${hasAdminKey ? '✅' : '⚠️'} ADMIN_API_KEY ${hasAdminKey ? '' : '(optional, but recommended)'}`);
  console.log(`  ${hasRazorpayKey ? '✅' : '⚠️'} RAZORPAY_KEY_ID ${hasRazorpayKey ? '' : '(for payments)'}`);
  console.log(`  ${hasRazorpaySecret ? '✅' : '⚠️'} RAZORPAY_KEY_SECRET ${hasRazorpaySecret ? '' : '(for payments)'}\n`);

  if (!hasAdminKey) {
    console.log('💡 Generate ADMIN_API_KEY with:');
    console.log('   node -e "console.log(require(\'crypto\').randomBytes(32).toString(\'hex\'))"');
    console.log('   Then add it to server/.env\n');
  }

  console.log('✨ Ready to test!\n');
  console.log('Next steps:');
  console.log('1. Start server: cd server && node index.js');
  console.log('2. Open EVChamp app on Android device');
  console.log('3. Accept notification permissions when prompted');
  console.log('4. Run: node test-notification.js');
  console.log('5. Check your phone for the test notification\n');

} catch (error) {
  console.error('❌ Error reading server/.env:', error.message);
  process.exit(1);
}
