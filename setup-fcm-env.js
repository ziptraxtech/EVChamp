#!/usr/bin/env node

/**
 * Interactive Firebase Environment Setup Helper
 * 
 * This script walks you through creating server/.env with proper values
 * 
 * Usage:
 *   node setup-fcm-env.js
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const envPath = path.join(__dirname, 'server', '.env');
const envExamplePath = path.join(__dirname, 'server', '.env.example');

function question(prompt) {
  return new Promise(resolve => {
    rl.question(prompt, resolve);
  });
}

async function main() {
  console.clear();
  console.log('\n╔══════════════════════════════════════════════════════════╗');
  console.log('║  🔧 EVChamp Firebase FCM Environment Setup                ║');
  console.log('╚══════════════════════════════════════════════════════════╝\n');

  // Check if .env exists
  if (fs.existsSync(envPath)) {
    const overwrite = await question('✅ server/.env already exists. Overwrite? (y/n): ');
    if (overwrite.toLowerCase() !== 'y') {
      console.log('Exiting without changes.\n');
      rl.close();
      process.exit(0);
    }
  }

  console.log('\n📋 Let\'s set up your Firebase credentials:\n');

  // Firebase Service Account Key
  console.log('─────────────────────────────────────────────────────────');
  console.log('1️⃣  FIREBASE SERVICE ACCOUNT KEY');
  console.log('─────────────────────────────────────────────────────────');
  console.log('\nYou need a minified JSON key. To get it:\n');
  console.log('  1. Go to: https://console.firebase.google.com');
  console.log('  2. Select your EVChamp project');
  console.log('  3. Settings (⚙️) → Service Accounts tab');
  console.log('  4. Click "Generate New Private Key"');
  console.log('  5. Download the JSON file');
  console.log('  6. Run: node scripts/format-firebase-key.js /path/to/key.json');
  console.log('  7. Copy the output (one long line)\n');

  const firebaseKey = await question('📎 Paste your minified Firebase key here:\n(Should start with { and end with })\n\n➤ ');

  if (!firebaseKey.trim().startsWith('{')) {
    console.error('\n❌ Invalid Firebase key format. Should start with {\n');
    rl.close();
    process.exit(1);
  }

  // Admin API Key
  console.log('\n─────────────────────────────────────────────────────────');
  console.log('2️⃣  ADMIN API KEY (for notification panel)');
  console.log('─────────────────────────────────────────────────────────\n');
  console.log('Generate a secure random key:\n');
  console.log('  node -e "console.log(require(\'crypto\').randomBytes(32).toString(\'hex\'))"');

  const generateNew = await question('\nGenerate a new one? (y/n): ');
  let adminKey;
  
  if (generateNew.toLowerCase() === 'y') {
    const crypto = require('crypto');
    adminKey = crypto.randomBytes(32).toString('hex');
    console.log(`\n✨ Generated: ${adminKey}\n`);
  } else {
    adminKey = await question('📎 Paste your admin API key:\n➤ ');
  }

  if (adminKey.length < 20) {
    console.error('\n❌ Admin key too short. Should be at least 20 characters.\n');
    rl.close();
    process.exit(1);
  }

  // Razorpay Keys
  console.log('\n─────────────────────────────────────────────────────────');
  console.log('3️⃣  RAZORPAY KEYS (for payments)');
  console.log('─────────────────────────────────────────────────────────\n');

  const razorpayKeyId = await question('📎 Razorpay Key ID (leave blank to skip):\n➤ ');
  const razorpayKeySecret = await question('🔐 Razorpay Key Secret (leave blank to skip):\n➤ ');
  const razorpayWebhookSecret = await question('🔗 Razorpay Webhook Secret (leave blank to skip):\n➤ ');

  // Other optional keys
  console.log('\n─────────────────────────────────────────────────────────');
  console.log('4️⃣  OTHER SETTINGS (optional)');
  console.log('─────────────────────────────────────────────────────────\n');

  const databaseUrl = await question('📦 DATABASE_URL (leave blank to skip):\n➤ ');
  const clerkSecretKey = await question('🔐 CLERK_SECRET_KEY (leave blank to skip):\n➤ ');
  const port = await question('🌐 PORT (default 5001):\n➤ ') || '5001';

  // Build .env content
  let envContent = `# ============================================
# 🔐 SERVER BACKEND SECRETS
# ============================================
# DO NOT COMMIT THIS FILE - it's in .gitignore

# Firebase Admin SDK Credentials
FIREBASE_SERVICE_ACCOUNT_KEY=${firebaseKey}

# Admin API Key for protected endpoints
ADMIN_API_KEY=${adminKey}
`;

  if (razorpayKeyId) envContent += `\n# Razorpay Payment Keys\nRAZORPAY_KEY_ID=${razorpayKeyId}`;
  if (razorpayKeySecret) envContent += `\nRAZORPAY_KEY_SECRET=${razorpayKeySecret}`;
  if (razorpayWebhookSecret) envContent += `\nRAZORPAY_WEBHOOK_SECRET=${razorpayWebhookSecret}`;
  if (databaseUrl) envContent += `\n\n# Database\nDATABASE_URL=${databaseUrl}`;
  if (clerkSecretKey) envContent += `\n\n# Clerk Auth\nCLERK_SECRET_KEY=${clerkSecretKey}`;

  envContent += `\n\n# Server Configuration
NODE_ENV=development
PORT=${port}

# Generated at: ${new Date().toISOString()}
`;

  // Write .env file
  try {
    fs.writeFileSync(envPath, envContent, { mode: 0o600 });
    console.log('\n✅ Successfully created server/.env\n');
    console.log(`📁 Location: ${envPath}`);
    console.log(`🔒 Permissions: Read/write by owner only (mode 0600)\n`);

    // Verify
    console.log('─────────────────────────────────────────────────────────');
    console.log('🧪 Verifying configuration...\n');

    const content = fs.readFileSync(envPath, 'utf8');
    const hasFirebase = content.includes('FIREBASE_SERVICE_ACCOUNT_KEY={');
    const hasAdmin = content.includes('ADMIN_API_KEY=');
    
    console.log(`  ${hasFirebase ? '✅' : '❌'} FIREBASE_SERVICE_ACCOUNT_KEY`);
    console.log(`  ${hasAdmin ? '✅' : '❌'} ADMIN_API_KEY`);
    console.log(`  ${razorpayKeyId ? '✅' : '⚠️'} RAZORPAY_KEY_ID`);
    console.log(`  ${databaseUrl ? '✅' : '⚠️'} DATABASE_URL`);

    console.log('\n✨ Setup complete!\n');
    console.log('🚀 Next steps:');
    console.log('  1. Run: node test-fcm-setup.js  (verify config)');
    console.log('  2. Run: cd server && node index.js  (start server)');
    console.log('  3. Open EVChamp app on Android');
    console.log('  4. Test: curl -X POST http://localhost:5001/api/test-notification\n');

  } catch (error) {
    console.error(`\n❌ Error writing to ${envPath}:`, error.message);
    rl.close();
    process.exit(1);
  }

  rl.close();
}

main().catch(error => {
  console.error('❌ Error:', error.message);
  rl.close();
  process.exit(1);
});
