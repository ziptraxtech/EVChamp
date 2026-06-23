#!/usr/bin/env node

/**
 * FCM Setup Validator
 * Validates Firebase Cloud Messaging configuration and provides troubleshooting tips
 */

const fs = require('fs');
const path = require('path');
require('dotenv').config({
  path: [
    path.resolve(__dirname, '../.env.local'),
    path.resolve(__dirname, '../.env'),
    path.resolve(__dirname, '.env'),
  ],
});

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  blue: '\x1b[34m',
};

function log(color, ...args) {
  console.log(colors[color], ...args, colors.reset);
}

function header(text) {
  console.log('\n' + colors.cyan + '═'.repeat(60));
  console.log('  ' + text);
  console.log('═'.repeat(60) + colors.reset);
}

function checkFileExists(filePath, label) {
  if (fs.existsSync(filePath)) {
    log('green', `✅ ${label} exists`);
    return true;
  } else {
    log('red', `❌ ${label} missing at: ${filePath}`);
    return false;
  }
}

function validateJSON(jsonString, label) {
  try {
    const obj = JSON.parse(jsonString);
    log('green', `✅ ${label} is valid JSON`);
    return obj;
  } catch (e) {
    log('red', `❌ ${label} is NOT valid JSON`);
    log('red', `   Error: ${e.message}`);
    return null;
  }
}

function validateFirebaseKey(keyString) {
  if (!keyString) {
    log('red', '❌ FIREBASE_SERVICE_ACCOUNT_KEY is empty');
    return false;
  }

  if (keyString.includes('\n')) {
    log('red', '❌ FIREBASE_SERVICE_ACCOUNT_KEY contains newlines (not minified)');
    log('yellow', '   Fix: Use: cat firebase-key.json | jq -c . | xclip');
    return false;
  }

  const key = validateJSON(keyString, 'FIREBASE_SERVICE_ACCOUNT_KEY');
  if (!key) return false;

  const required = ['type', 'project_id', 'private_key', 'client_email'];
  const missing = required.filter(field => !key[field]);

  if (missing.length > 0) {
    log('red', `❌ Missing fields in Firebase key: ${missing.join(', ')}`);
    return false;
  }

  if (key.project_id !== 'evchamp-378d6') {
    log('yellow', `⚠️  Project ID is "${key.project_id}" (expected "evchamp-378d6")`);
  }

  log('green', `✅ FIREBASE_SERVICE_ACCOUNT_KEY valid (project: ${key.project_id})`);
  return true;
}

function main() {
  header('🔔 EVChamp Firebase Cloud Messaging Setup Validator');

  log('blue', '\n📋 Checking configuration...\n');

  // 1. Check files
  log('cyan', '1️⃣  File Structure:');
  const envExists = checkFileExists(
    path.resolve(__dirname, '.env'),
    'server/.env'
  );
  checkFileExists(
    path.resolve(__dirname, '../android/app/google-services.json'),
    'android/app/google-services.json'
  );

  // 2. Check environment variables
  log('\ncyan', '2️⃣  Environment Variables:');

  if (!envExists) {
    log('red', '\n❌ server/.env not found!');
    log('yellow', '\nTo create it:');
    log('yellow', '  1. Copy server/.env.example to server/.env');
    log('yellow', '  2. Fill in the required values (see FCM_SETUP_DIRECT.md)');
    process.exit(1);
  }

  const razorpayKeyId = process.env.RAZORPAY_KEY_ID;
  if (razorpayKeyId) {
    log('green', '✅ RAZORPAY_KEY_ID configured');
  } else {
    log('yellow', '⚠️  RAZORPAY_KEY_ID empty (optional for FCM)');
  }

  const firebaseKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
  const firebaseValid = validateFirebaseKey(firebaseKey);

  const adminKey = process.env.ADMIN_API_KEY;
  if (adminKey && adminKey.length >= 32) {
    log('green', '✅ ADMIN_API_KEY configured');
  } else {
    log('yellow', '⚠️  ADMIN_API_KEY empty or too short (needed for admin panel)');
  }

  // 3. Summary
  header('📊 Summary');

  if (!firebaseValid) {
    log('red', '\n❌ Configuration INCOMPLETE - Firebase key not valid');
    log('yellow', '\nNext steps:');
    log('yellow', '1. Get Firebase service account key from Firebase Console');
    log('yellow', '   → https://console.firebase.google.com/project/evchamp-378d6/settings/serviceaccounts');
    log('yellow', '2. Download the JSON file');
    log('yellow', '3. Minify it: cat firebase-key.json | jq -c .');
    log('yellow', '4. Paste into server/.env as FIREBASE_SERVICE_ACCOUNT_KEY');
    log('yellow', '\nSee: FCM_SETUP_DIRECT.md for full instructions\n');
    process.exit(1);
  }

  log('green', '✅ Configuration READY for local FCM testing!');
  log('cyan', '\nNext steps:');
  log('cyan', '1. Start backend:   node server/index.js');
  log('cyan', '2. Build Android:   npx cap build android');
  log('cyan', '3. Install APK:     adb install android/app/build/outputs/apk/debug/app-debug.apk');
  log('cyan', '4. Launch app:      Open EVChamp on device');
  log('cyan', '5. Test:            curl -X POST http://localhost:5001/api/test-notification');
  log('cyan', '\nFull guide: FCM_SETUP_DIRECT.md\n');
}

main();
