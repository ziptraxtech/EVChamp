#!/usr/bin/env node
/**
 * Firebase Service Account Key Formatter
 * 
 * This script reads your Firebase service account JSON file and outputs
 * a correctly minified single-line string ready to paste into Vercel.
 *
 * Usage:
 *   node scripts/format-firebase-key.js path/to/serviceAccountKey.json
 *
 * Then copy the output and paste it as the FIREBASE_SERVICE_ACCOUNT_KEY
 * environment variable value in Vercel dashboard.
 */

const fs = require('fs');
const path = require('path');

const filePath = process.argv[2];

if (!filePath) {
  console.error('\n❌  Usage: node scripts/format-firebase-key.js <path-to-key.json>\n');
  console.log('Steps:');
  console.log('  1. Go to Firebase Console → Project Settings → Service Accounts');
  console.log('  2. Click "Generate new private key" → Download JSON');
  console.log('  3. Run: node scripts/format-firebase-key.js ~/Downloads/evchamp-firebase-key.json');
  console.log('  4. Copy the output and paste into Vercel → FIREBASE_SERVICE_ACCOUNT_KEY\n');
  process.exit(1);
}

const absPath = path.resolve(filePath);

if (!fs.existsSync(absPath)) {
  console.error(`\n❌  File not found: ${absPath}\n`);
  process.exit(1);
}

try {
  const raw = fs.readFileSync(absPath, 'utf8');
  const parsed = JSON.parse(raw);

  // Validate required fields
  const required = ['type', 'project_id', 'private_key', 'client_email'];
  const missing = required.filter(f => !parsed[f]);
  if (missing.length > 0) {
    console.error(`\n❌  Missing required fields: ${missing.join(', ')}\n`);
    process.exit(1);
  }

  if (parsed.type !== 'service_account') {
    console.error('\n❌  This does not look like a service account key (type != "service_account")\n');
    process.exit(1);
  }

  // The private key contains literal \n characters. JSON.stringify preserves them correctly.
  const minified = JSON.stringify(parsed);

  console.log('\n✅  Successfully formatted Firebase service account key!\n');
  console.log('═══════════════════════════════════════════════════════');
  console.log('  Project ID :', parsed.project_id);
  console.log('  Client Email:', parsed.client_email);
  console.log('  Key length  :', minified.length, 'characters');
  console.log('═══════════════════════════════════════════════════════\n');
  console.log('📋  Copy everything between the lines below:\n');
  console.log('─────────────────────────────────────────────────────────');
  console.log(minified);
  console.log('─────────────────────────────────────────────────────────');
  console.log('\n📌  Paste this as FIREBASE_SERVICE_ACCOUNT_KEY in Vercel:');
  console.log('   https://vercel.com/dashboard → Project → Settings → Environment Variables\n');
  console.log('⚠️   Then REDEPLOY the project for the change to take effect.\n');

} catch (err) {
  console.error('\n❌  Failed to parse JSON:', err.message);
  console.log('\nMake sure you downloaded the full service account JSON from Firebase Console.\n');
  process.exit(1);
}
