# Razorpay Integration Troubleshooting Guide

## Issue: Razorpay Modal Not Opening

If clicking "Place Order" button doesn't open the Razorpay payment modal, follow these steps:

### ✅ Step 1: Verify Environment Variables

1. **Check if `.env.local` exists** in your project root:
   ```bash
   ls -la .env.local
   ```

2. **Add required environment variables** to `.env.local`:
   ```
   REACT_APP_RAZORPAY_KEY_ID=your_razorpay_key_id_here
   REACT_APP_RAZORPAY_KEY_SECRET=your_razorpay_key_secret_here
   REACT_APP_API_URL=http://localhost:5000/api
   REACT_APP_CLERK_PUBLISHABLE_KEY=your_clerk_key_here
   ```

3. **Get your Razorpay Keys**:
   - Go to https://dashboard.razorpay.com
   - Navigate to Settings → API Keys
   - Copy your **Key ID** (not Key Secret - the Key Secret is for backend only)

### ✅ Step 2: Verify the Frontend Configuration

1. **Check browser console** for errors:
   - Open DevTools (F12 or Cmd+Option+I)
   - Go to Console tab
   - Look for error messages starting with "❌"

2. **Common error messages and solutions**:
   - **"Razorpay Key ID not configured"**
     - Solution: Check `.env.local` file has `REACT_APP_RAZORPAY_KEY_ID`
   
   - **"Failed to load Razorpay script"**
     - Solution: Check internet connection, verify CDN is accessible
   
   - **"window.Razorpay is not available"**
     - Solution: Razorpay script didn't load properly, refresh page

### ✅ Step 3: Debug the Payment Flow

1. **Open DevTools Console and look for these messages**:
   ```
   🔧 Razorpay Initialization Started
   Razorpay Key ID: ✓ Loaded
   📥 Loading Razorpay script...
   ✓ Razorpay script loaded
   📦 Creating order...
   🎯 Payment options: {...}
   ✓ Razorpay instance created
   🔓 Opening Razorpay modal...
   ✓ Razorpay modal opened
   ```

2. **If any step is missing or shows an error**, that's where the problem is.

### ✅ Step 4: Restart Development Server

After making any changes to `.env.local`:

```bash
# Stop the current server (Ctrl+C)
npm stop

# Clear cache
rm -rf node_modules/.cache

# Restart
npm run dev
```

### ✅ Step 5: Verify Network Requests

1. Open DevTools → Network tab
2. Click "Place Order" button
3. Look for requests:
   - `checkout.razorpay.com/v1/checkout.js` (should be 200 OK)
   - `/api/create-order` (might be 404 if backend not running, but payment should still open in "demo" mode)

### ✅ Step 6: Test Payment Integration

1. **Razorpay Test Credentials**:
   - Key ID: `rzp_test_1234567890123` (example)
   - For test payments, use:
     - Card: `4111 1111 1111 1111`
     - Expiry: Any future date
     - CVV: Any 3 digits

2. **Verify Razorpay Account Status**:
   - Go to https://dashboard.razorpay.com/app/settings/api-keys
   - Ensure you're in **Test Mode** (development)
   - Copy the correct Key ID

### ✅ Step 7: Check CORS Issues (if backend exists)

If you see CORS errors in console:

1. Backend needs CORS headers:
   ```javascript
   app.use(cors({
     origin: ['http://localhost:3000', 'https://checkout.razorpay.com'],
     credentials: true
   }));
   ```

2. Or if backend doesn't exist, the app will use "demo mode" without creating orders

### 🔍 Debugging Steps in Code

The console will now show detailed logs:

```javascript
// In browser console, run this to test:
const razorpayService = require('./src/services/razorpayService').default;
razorpayService.initializePayment(99, 'Test', 'Test Payment');
```

## Common Issues & Solutions

| Issue | Cause | Solution |
|-------|-------|----------|
| Blank modal | Script not loaded | Check CDN access, restart dev server |
| "Key ID not found" | Env var missing | Add REACT_APP_RAZORPAY_KEY_ID to .env.local |
| Silent failure | Key ID error not caught | Check browser console for error messages |
| Payment doesn't process | Backend not running | Backend is optional for demo mode |
| Modal closes immediately | Invalid options | Check console for option validation errors |

## Files Modified

1. **src/services/razorpayService.ts** - Added comprehensive logging
2. **src/components/BuyPlans.tsx** - Enhanced error messages
3. **RAZORPAY_TROUBLESHOOTING.md** - This file

## Next Steps

1. Add your Razorpay Key ID to `.env.local`
2. Restart the dev server
3. Try clicking "Place Order" again
4. Check browser console for detailed logs
5. Share console logs if issue persists

## Useful Links

- Razorpay Dashboard: https://dashboard.razorpay.com
- Razorpay Docs: https://razorpay.com/docs/
- Test Card Details: https://razorpay.com/docs/payments/payments/test-integration/
