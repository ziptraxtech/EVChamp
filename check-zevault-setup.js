#!/usr/bin/env node

/**
 * EVChamp ZeVault Payment Diagnostic Tool
 * Helps identify Razorpay integration issues
 */

const fs = require('fs');
const path = require('path');

console.log('\n🔍 EVChamp ZeVault Payment Diagnostic\n');
console.log('=' .repeat(50));

// Check 1: Environment Variables
console.log('\n📋 Check 1: Environment Variables\n');

const envFiles = ['.env', '.env.local', '.env.development', '.env.production'];
let envFound = false;

for (const envFile of envFiles) {
  const envPath = path.join(__dirname, envFile);
  if (fs.existsSync(envPath)) {
    console.log(`✓ Found ${envFile}`);
    envFound = true;
    
    try {
      const content = fs.readFileSync(envPath, 'utf8');
      const hasRazorpayKey = content.includes('REACT_APP_RAZORPAY_KEY_ID');
      const hasApiUrl = content.includes('REACT_APP_API_URL');
      const hasCallbackUrl = content.includes('REACT_APP_RAZORPAY_CALLBACK_URL');
      
      console.log(`  • REACT_APP_RAZORPAY_KEY_ID: ${hasRazorpayKey ? '✓' : '✗'}`);
      console.log(`  • REACT_APP_API_URL: ${hasApiUrl ? '✓' : '✗'}`);
      console.log(`  • REACT_APP_RAZORPAY_CALLBACK_URL: ${hasCallbackUrl ? '✓' : '✗'}`);
    } catch (err) {
      console.log(`  ⚠️  Could not read ${envFile}`);
    }
  }
}

if (!envFound) {
  console.log('✗ No .env files found');
  console.log('  → Create .env.local with your Razorpay credentials');
}

// Check 2: Required Components
console.log('\n📦 Check 2: Required Components\n');

const requiredFiles = [
  'src/components/ZeVaultCheckout.tsx',
  'src/components/ZeVaultPage.tsx',
  'src/services/razorpayService.ts',
  'src/App.tsx',
];

for (const file of requiredFiles) {
  const filePath = path.join(__dirname, '..', file);
  if (fs.existsSync(filePath)) {
    console.log(`✓ ${file}`);
  } else {
    console.log(`✗ ${file} - MISSING`);
  }
}

// Check 3: Route Configuration
console.log('\n🛣️  Check 3: Route Configuration\n');

try {
  const appPath = path.join(__dirname, '..', 'src/App.tsx');
  if (fs.existsSync(appPath)) {
    const appContent = fs.readFileSync(appPath, 'utf8');
    
    const hasCheckoutRoute = appContent.includes("path=\"/checkout\"");
    const hasCheckoutImport = appContent.includes('ZeVaultCheckout');
    
    console.log(`✓ App.tsx exists`);
    console.log(`  • /checkout route: ${hasCheckoutRoute ? '✓' : '✗'}`);
    console.log(`  • ZeVaultCheckout import: ${hasCheckoutImport ? '✓' : '✗'}`);
  }
} catch (err) {
  console.log(`✗ Could not check App.tsx`);
}

// Check 4: Razorpay Service
console.log('\n💳 Check 4: Razorpay Service\n');

try {
  const servicePath = path.join(__dirname, '..', 'src/services/razorpayService.ts');
  if (fs.existsSync(servicePath)) {
    const serviceContent = fs.readFileSync(servicePath, 'utf8');
    
    const hasInitializePayment = serviceContent.includes('initializePayment');
    const hasLoadScript = serviceContent.includes('loadScript');
    const hasCreateOrder = serviceContent.includes('createOrder');
    const hasLogging = serviceContent.includes('console.log');
    
    console.log(`✓ razorpayService.ts exists`);
    console.log(`  • initializePayment method: ${hasInitializePayment ? '✓' : '✗'}`);
    console.log(`  • loadScript method: ${hasLoadScript ? '✓' : '✗'}`);
    console.log(`  • createOrder method: ${hasCreateOrder ? '✓' : '✗'}`);
    console.log(`  • Logging enabled: ${hasLogging ? '✓' : '✗'}`);
  }
} catch (err) {
  console.log(`✗ Could not check razorpayService.ts`);
}

// Check 5: ZeVaultPage Navigation
console.log('\n📄 Check 5: ZeVaultPage Navigation\n');

try {
  const pagePath = path.join(__dirname, '..', 'src/components/ZeVaultPage.tsx');
  if (fs.existsSync(pagePath)) {
    const pageContent = fs.readFileSync(pagePath, 'utf8');
    
    const hasCheckoutNavigation = pageContent.includes('/checkout');
    const hasQueryParams = pageContent.includes('plan=') && pageContent.includes('tests=');
    
    console.log(`✓ ZeVaultPage.tsx exists`);
    console.log(`  • Navigates to /checkout: ${hasCheckoutNavigation ? '✓' : '✗'}`);
    console.log(`  • Passes query params: ${hasQueryParams ? '✓' : '✗'}`);
  }
} catch (err) {
  console.log(`✗ Could not check ZeVaultPage.tsx`);
}

// Check 6: Summary
console.log('\n' + '='.repeat(50));
console.log('\n🎯 Troubleshooting Checklist\n');

const checklist = [
  '1. Set REACT_APP_RAZORPAY_KEY_ID in .env.local',
  '2. Restart development server after changing .env',
  '3. Open browser DevTools (F12) before testing payment',
  '4. Navigate to /zevault page',
  '5. Click any "Buy" button',
  '6. Should redirect to /checkout with query parameters',
  '7. Click "Pay ₹XXX" button',
  '8. Razorpay modal should open',
  '9. Check browser console for logs starting with "🔧"',
  '10. If modal doesn\'t open, look for red error messages',
];

checklist.forEach(item => console.log(`  ${item}`));

console.log('\n💡 Pro Tips:\n');
console.log('  • Use Chrome DevTools Network tab to see CDN requests');
console.log('  • Search console for "Razorpay" to see all related logs');
console.log('  • Check Razorpay dashboard for test vs live mode');
console.log('  • Verify callback URL matches in Razorpay settings');

console.log('\n' + '='.repeat(50) + '\n');
console.log('✅ Diagnostic complete!\n');
