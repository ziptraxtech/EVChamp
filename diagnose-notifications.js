#!/usr/bin/env node

/**
 * EVChamp Push Notifications - Diagnostic Tool
 * 
 * This script helps identify why notifications aren't being sent
 * 
 * Usage:
 *   node diagnose-notifications.js
 */

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

async function runDiagnostics() {
  log('\n╔════════════════════════════════════════════════════════════╗', 'cyan');
  log('║  🔍 EVChamp Push Notifications - Diagnostic Tool           ║', 'cyan');
  log('╚════════════════════════════════════════════════════════════╝\n', 'cyan');

  const issues = [];
  const warnings = [];
  const success = [];

  // Check 1: Environment Variables
  log('📋 Checking Environment Variables...', 'blue');
  
  const requiredEnvVars = [
    'DATABASE_URL',
    'FIREBASE_SERVICE_ACCOUNT_KEY',
    'ADMIN_API_KEY',
  ];

  requiredEnvVars.forEach((envVar) => {
    if (process.env[envVar]) {
      log(`  ✅ ${envVar} is set`, 'green');
      success.push(envVar);
    } else {
      log(`  ❌ ${envVar} is NOT set`, 'red');
      issues.push(`Missing environment variable: ${envVar}`);
    }
  });

  // Check 2: Firebase Configuration
  log('\n🔥 Checking Firebase Configuration...', 'blue');
  
  if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
    try {
      const config = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
      if (config.project_id && config.private_key && config.client_email) {
        log('  ✅ Firebase credentials are valid JSON', 'green');
        log(`     Project ID: ${config.project_id}`, 'cyan');
        log(`     Client Email: ${config.client_email}`, 'cyan');
      } else {
        log('  ❌ Firebase credentials missing required fields', 'red');
        issues.push('Firebase credentials incomplete (missing project_id, private_key, or client_email)');
      }
    } catch (err) {
      log('  ❌ Firebase credentials are not valid JSON', 'red');
      issues.push(`Firebase JSON parse error: ${err.message}`);
    }
  } else {
    log('  ❌ FIREBASE_SERVICE_ACCOUNT_KEY not set', 'red');
  }

  // Check 3: Vercel Configuration
  log('\n🚀 Checking Vercel Configuration...', 'blue');
  
  try {
    const fs = require('fs');
    const path = require('path');
    const vercelPath = path.join(__dirname, 'vercel.json');
    
    if (fs.existsSync(vercelPath)) {
      const vercelConfig = JSON.parse(fs.readFileSync(vercelPath, 'utf8'));
      
      const fcmEndpoints = [
        '/api/store-fcm-token',
        '/api/link-fcm-token',
        '/api/fcm-tokens/all',
        '/api/send-notification-all',
        '/api/send-notification-user',
        '/api/send-notification-topic',
        '/api/test-notification',
      ];

      const hasAllEndpoints = fcmEndpoints.every((endpoint) => {
        return JSON.stringify(vercelConfig).includes(endpoint);
      });

      if (hasAllEndpoints) {
        log('  ✅ All FCM endpoints configured in vercel.json', 'green');
      } else {
        log('  ⚠️  Some FCM endpoints missing from vercel.json', 'yellow');
        warnings.push('Update vercel.json with all FCM endpoint rewrites');
      }
    } else {
      log('  ⚠️  vercel.json not found', 'yellow');
      warnings.push('vercel.json file not found');
    }
  } catch (err) {
    log(`  ⚠️  Could not read vercel.json: ${err.message}`, 'yellow');
  }

  // Check 4: API Endpoint Status
  log('\n🌐 Checking API Endpoint Status...', 'blue');
  
  const apiUrl = process.env.API_URL || 'https://evchamp.in';
  
  try {
    log(`  Testing: ${apiUrl}/api/test-notification`, 'cyan');
    const response = await fetch(`${apiUrl}/api/test-notification`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
      timeout: 5000,
    });

    const contentType = response.headers.get('content-type');
    
    if (contentType?.includes('application/json')) {
      const data = await response.json();
      
      if (response.ok) {
        log('  ✅ API endpoint is responding correctly', 'green');
        log(`     Message: ${data.message}`, 'cyan');
        
        if (data.totalActiveTokens > 0) {
          log(`     ✅ ${data.totalActiveTokens} active FCM tokens found!`, 'green');
        } else {
          log(`     ⚠️  No active FCM tokens registered`, 'yellow');
          warnings.push('No devices have registered FCM tokens yet. Build and run the app on an Android device.');
        }
      } else {
        log(`  ❌ API error: ${data.error || data.message}`, 'red');
        
        if (data.error?.includes('No active FCM tokens')) {
          warnings.push('No FCM tokens found - app needs to register tokens first');
        } else {
          issues.push(`API error: ${data.error || data.message}`);
        }
      }
    } else {
      log(`  ❌ API returned non-JSON response (${contentType})`, 'red');
      issues.push('API endpoint not properly configured - returns HTML instead of JSON');
      log('     → Run: vercel deploy --prod', 'yellow');
    }
  } catch (err) {
    log(`  ❌ Could not reach API: ${err.message}`, 'red');
    issues.push(`Cannot reach ${apiUrl} - verify API is deployed and accessible`);
  }

  // Check 5: Android App Status
  log('\n📱 Checking Android App Status...', 'blue');
  
  try {
    const { execSync } = require('child_process');
    
    try {
      const devices = execSync('adb devices', { encoding: 'utf8' });
      const connectedDevices = devices.split('\n').filter((line) => line.includes('device') && !line.includes('devices'));
      
      if (connectedDevices.length > 0) {
        log(`  ✅ Android device(s) connected: ${connectedDevices.length}`, 'green');
        
        // Check logcat for FCM messages
        try {
          const logcat = execSync('adb logcat -d | grep -i fcm', { encoding: 'utf8', stdio: 'pipe' }).slice(0, 500);
          if (logcat.length > 0) {
            log('  ✅ FCM logs found in device', 'green');
            log(`     Recent: ${logcat.split('\n')[0]}`, 'cyan');
          } else {
            log('  ⚠️  No FCM logs found - app may not have started', 'yellow');
            warnings.push('Run the app on the connected device and grant notification permissions');
          }
        } catch {
          log('  ⚠️  Could not read logcat (app may not have run yet)', 'yellow');
        }
      } else {
        log('  ⚠️  No Android devices connected', 'yellow');
        warnings.push('Connect an Android device via USB to test notifications');
      }
    } catch {
      log('  ⚠️  adb not available', 'yellow');
      warnings.push('Install Android SDK Platform Tools or use Android Studio');
    }
  } catch (err) {
    log(`  ⚠️  Could not check device status: ${err.message}`, 'yellow');
  }

  // Summary
  log('\n╔════════════════════════════════════════════════════════════╗', 'cyan');
  log('║  📊 DIAGNOSTIC SUMMARY                                     ║', 'cyan');
  log('╚════════════════════════════════════════════════════════════╝\n', 'cyan');

  if (issues.length === 0 && warnings.length === 0) {
    log('✅ All systems operational! Ready to send notifications.', 'green');
  } else {
    if (issues.length > 0) {
      log('❌ CRITICAL ISSUES:', 'red');
      issues.forEach((issue, i) => {
        log(`   ${i + 1}. ${issue}`, 'red');
      });
    }

    if (warnings.length > 0) {
      log('\n⚠️  WARNINGS:', 'yellow');
      warnings.forEach((warning, i) => {
        log(`   ${i + 1}. ${warning}`, 'yellow');
      });
    }
  }

  log('\n📋 NEXT STEPS:', 'blue');
  log('1. Ensure Android app is built and running on device', 'cyan');
  log('2. Grant notification permissions when app prompts', 'cyan');
  log('3. Deploy to Vercel: vercel deploy --prod', 'cyan');
  log('4. Set environment variables in Vercel dashboard', 'cyan');
  log('5. Run this diagnostic again to verify', 'cyan');
  log('6. Send test notification: API_URL=https://evchamp.in node test-notification.js\n', 'cyan');
}

runDiagnostics().catch(console.error);
