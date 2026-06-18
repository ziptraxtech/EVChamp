#!/usr/bin/env node

/**
 * EVChamp - Pre-Deployment Setup Validator
 * 
 * This script validates all settings before deploying to Vercel
 * 
 * Usage:
 *   node setup-validator.js
 */

const fs = require('fs');
const path = require('path');

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  bold: '\x1b[1m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function header(title) {
  console.log('\n');
  log('╔════════════════════════════════════════════════════════════╗', 'cyan');
  log(`║  ${title.padEnd(58)} ║`, 'cyan');
  log('╚════════════════════════════════════════════════════════════╝', 'cyan');
}

async function validateSetup() {
  header('📋 EVChamp Pre-Deployment Validator');

  const issues = [];
  const warnings = [];
  const success = [];

  // Check 1: Vercel Config
  log('\n1️⃣  Checking vercel.json...', 'blue');
  try {
    const vercelPath = path.join(__dirname, 'vercel.json');
    const vercelConfig = JSON.parse(fs.readFileSync(vercelPath, 'utf8'));

    const requiredRewrites = [
      '/api/test-notification',
      '/api/store-fcm-token',
      '/api/link-fcm-token',
      '/api/fcm-tokens/all',
      '/api/send-notification-all',
      '/api/send-notification-user',
      '/api/send-notification-topic',
    ];

    const configStr = JSON.stringify(vercelConfig);
    const allPresent = requiredRewrites.every((path) => configStr.includes(path));

    if (allPresent) {
      log('   ✅ All FCM endpoints configured', 'green');
      success.push('vercel.json');
    } else {
      log('   ❌ Missing FCM endpoint rewrites', 'red');
      issues.push('vercel.json: Add all FCM endpoint rewrites');
    }
  } catch (err) {
    log(`   ❌ Error reading vercel.json: ${err.message}`, 'red');
    issues.push('vercel.json: File not found or invalid');
  }

  // Check 2: Environment Variables
  log('\n2️⃣  Checking environment variables setup...', 'blue');

  const requiredEnvVars = [
    { key: 'FIREBASE_SERVICE_ACCOUNT_KEY', type: 'Firebase credentials' },
    { key: 'DATABASE_URL', type: 'Neon database URL' },
    { key: 'ADMIN_API_KEY', type: 'Admin API key' },
  ];

  let envSetupValid = true;
  for (const envVar of requiredEnvVars) {
    log(`   • ${envVar.key}`, 'cyan');
    if (process.env[envVar.key]) {
      log(`     ✅ Will be set in Vercel`, 'green');
    } else {
      log(`     ℹ️  Currently not in shell (will be added to Vercel)`, 'yellow');
    }
  }

  // Check 3: Firebase Configuration
  log('\n3️⃣  Validating Firebase credentials...', 'blue');
  
  const firebaseKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
  if (firebaseKey) {
    try {
      const creds = JSON.parse(firebaseKey);
      const required = ['project_id', 'private_key', 'client_email', 'type'];
      const hasAll = required.every((field) => creds[field]);

      if (hasAll && creds.type === 'service_account') {
        log(`   ✅ Firebase credentials valid`, 'green');
        log(`     Project: ${creds.project_id}`, 'cyan');
        log(`     Email: ${creds.client_email}`, 'cyan');
        success.push('Firebase credentials');
      } else {
        log(`   ❌ Firebase credentials incomplete`, 'red');
        issues.push('Firebase: Missing required fields');
      }
    } catch (err) {
      log(`   ❌ Invalid Firebase JSON: ${err.message}`, 'red');
      issues.push('Firebase: Invalid JSON format');
    }
  } else {
    log(`   ⚠️  FIREBASE_SERVICE_ACCOUNT_KEY not in environment`, 'yellow');
    log(`     → Will be added to Vercel dashboard`, 'yellow');
  }

  // Check 4: Database URL
  log('\n4️⃣  Validating database URL...', 'blue');
  
  const dbUrl = process.env.DATABASE_URL;
  if (dbUrl) {
    if (dbUrl.includes('postgresql://') || dbUrl.includes('postgres://')) {
      log(`   ✅ Valid PostgreSQL URL format`, 'green');
      const urlObj = new URL(dbUrl);
      log(`     Host: ${urlObj.hostname}`, 'cyan');
      success.push('Database URL');
    } else {
      log(`   ❌ Invalid database URL format`, 'red');
      issues.push('Database: Invalid PostgreSQL URL');
    }
  } else {
    log(`   ⚠️  DATABASE_URL not in environment`, 'yellow');
    log(`     → Will be added to Vercel dashboard`, 'yellow');
  }

  // Check 5: Code Files
  log('\n5️⃣  Checking required source files...', 'blue');

  const requiredFiles = [
    { path: 'src/components/FirebaseNotification.ts', name: 'Firebase Notification Handler' },
    { path: 'src/components/AdminNotificationPanel.tsx', name: 'Admin Notification Panel' },
    { path: 'api/index.js', name: 'Backend API' },
    { path: 'android/app/google-services.json', name: 'Android Firebase Config' },
  ];

  requiredFiles.forEach((file) => {
    const fullPath = path.join(__dirname, file.path);
    if (fs.existsSync(fullPath)) {
      log(`   ✅ ${file.name}`, 'green');
      success.push(file.name);
    } else {
      log(`   ❌ ${file.name} missing at ${file.path}`, 'red');
      issues.push(`${file.name}: File not found`);
    }
  });

  // Check 6: Test Scripts
  log('\n6️⃣  Checking test/diagnostic scripts...', 'blue');

  const testScripts = [
    'test-notification.js',
    'diagnose-notifications.js',
  ];

  testScripts.forEach((script) => {
    const fullPath = path.join(__dirname, script);
    if (fs.existsSync(fullPath)) {
      log(`   ✅ ${script}`, 'green');
    } else {
      log(`   ⚠️  ${script} not found`, 'yellow');
      warnings.push(`${script}: Not found but not critical`);
    }
  });

  // Summary
  header('📊 Validation Summary');

  if (issues.length === 0) {
    log('✅ All checks passed! Ready for deployment.', 'green');
    log('\n📋 Next Steps:', 'blue');
    log('  1. Go to Vercel dashboard: https://vercel.com/dashboard', 'cyan');
    log('  2. Select EVChamp project → Settings → Environment Variables', 'cyan');
    log('  3. Add these variables:', 'cyan');
    log('     • FIREBASE_SERVICE_ACCOUNT_KEY (minified JSON)', 'yellow');
    log('     • DATABASE_URL (provided)', 'yellow');
    log('     • ADMIN_API_KEY (generated: see below)', 'yellow');
    log('  4. Push code: git push origin main', 'cyan');
    log('  5. Wait for automatic Vercel deployment', 'cyan');
    log('  6. Run: node diagnose-notifications.js', 'cyan');
    log('  7. Run: node test-notification.js', 'cyan');
  } else {
    log(`❌ Found ${issues.length} critical issue(s):`, 'red');
    issues.forEach((issue, i) => {
      log(`   ${i + 1}. ${issue}`, 'red');
    });
  }

  if (warnings.length > 0) {
    log(`\n⚠️  ${warnings.length} warning(s):`, 'yellow');
    warnings.forEach((warning, i) => {
      log(`   ${i + 1}. ${warning}`, 'yellow');
    });
  }

  // Show Generated API Key
  log('\n🔐 Generated ADMIN_API_KEY:', 'blue');
  const apiKey = require('crypto').randomBytes(32).toString('hex');
  log(`\n   ${apiKey}`, 'yellow');
  log('\n   📌 Copy this key and add to Vercel dashboard as ADMIN_API_KEY', 'cyan');

  // Statistics
  log('\n📈 Statistics:', 'blue');
  log(`   ✅ Passed: ${success.length}`, 'green');
  log(`   ❌ Failed: ${issues.length}`, 'red');
  log(`   ⚠️  Warnings: ${warnings.length}`, 'yellow');

  log('\n', 'reset');

  return issues.length === 0;
}

validateSetup().then((success) => {
  process.exit(success ? 0 : 1);
}).catch(console.error);
