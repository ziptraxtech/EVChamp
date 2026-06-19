# 🔧 Razorpay Payment Setup Guide

## Issue: "Razorpay Key ID not configured"

The payment feature is not working because the Razorpay API keys are missing from your `.env.local` file.

---

## ✅ Quick Fix (5 minutes)

### Step 1: Get Your Razorpay Keys

1. **Go to Razorpay Dashboard:**
   - Visit: https://dashboard.razorpay.com
   - Log in with your account (create one if needed)

2. **Navigate to API Keys:**
   - Click **Settings** (gear icon) in top right
   - Select **API Keys** from left sidebar
   - You'll see two keys:
     - **Key ID** (starts with `rzp_test_` or `rzp_live_`)
     - **Key Secret** (long random string)

3. **Copy Your Keys:**
   - Note down your **Key ID** and **Key Secret**

### Step 2: Update `.env.local` File

Open the file: `/Users/kshetij/Desktop/internship project/EVChamp-latest/.env.local`

Find these lines (around line 27-28):
```bash
# Razorpay Keys (from Razorpay Dashboard)
# RAZORPAY_KEY_ID=your-key-id
# RAZORPAY_KEY_SECRET=your-key-secret
```

**Replace with:**
```bash
# ============================================
# RAZORPAY PAYMENT GATEWAY KEYS (REQUIRED)
# ============================================
REACT_APP_RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxx
REACT_APP_RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxxxxxxx
REACT_APP_API_URL=http://localhost:5000/api
```

**Important:** Replace `xxxxxxxxxxxxx` with your actual keys from Razorpay.

### Step 3: Restart Your Development Server

```bash
# If running: Press Ctrl+C to stop
# Then restart:
npm start
```

---

## 🔍 Verify the Fix

### Check 1: Browser Console
1. Open your app in browser
2. Open DevTools (F12 or Cmd+Option+I)
3. Click on a "Buy Plan" button
4. Look at the **Console** tab

**If Fixed, you should see:**
```
✓ Razorpay already loaded in window
🔧 Razorpay Initialization Started
Razorpay Key ID: ✓ Loaded
📥 Loading Razorpay script...
✓ Razorpay script loaded
```

**If Still Broken, you'll see:**
```
❌ Razorpay Key ID missing
Error: Razorpay Key ID not configured...
```

### Check 2: Payment Modal Opens
1. Click any plan's "Buy" button
2. Razorpay payment modal should pop up
3. You should see the amount, email field, etc.

---

## 🚀 Production Setup

### For Production (Live Payments):

1. **Get Live Keys from Razorpay:**
   - Dashboard → Settings → API Keys
   - Use **Live Key ID** (starts with `rzp_live_`)
   - Use **Live Key Secret**

2. **Update Production Environment:**
   - If using Vercel: 
     - Project Settings → Environment Variables
     - Add `REACT_APP_RAZORPAY_KEY_ID` and `REACT_APP_RAZORPAY_KEY_SECRET`
   - If using other hosting: Update your environment configuration

3. **Set NODE_ENV to production:**
   ```bash
   NODE_ENV=production
   ```

---

## 📊 Environment Variables Reference

| Variable | Required | Type | Example |
|----------|----------|------|---------|
| `REACT_APP_RAZORPAY_KEY_ID` | ✅ YES | Public | `rzp_test_abc123...` |
| `REACT_APP_RAZORPAY_KEY_SECRET` | ✅ YES | Private | `secret123...` |
| `REACT_APP_API_URL` | ✅ YES | URL | `http://localhost:5000/api` |
| `REACT_APP_CLERK_PUBLISHABLE_KEY` | ✅ YES | Public | `pk_test_...` |

---

## 🐛 Troubleshooting

### Issue: Still seeing "Key not configured"

**Solution:**
1. Double-check `.env.local` syntax (no extra spaces)
2. Verify keys are uncommented (no `#` at start)
3. Restart the development server completely
4. Check if `.env.local` is in the root directory

### Issue: Modal opens but payment fails

**Solution:**
1. Make sure you're using **TEST keys** for testing
2. Use Razorpay test card: `4111 1111 1111 1111`
3. Check browser Console for error messages
4. Verify `REACT_APP_API_URL` is correct

### Issue: "Failed to load Razorpay script"

**Solution:**
1. Check your internet connection
2. Ensure firewall allows CDN access: `checkout.razorpay.com`
3. Try incognito/private browser mode
4. Check if you're behind a VPN

---

## 🔐 Security Best Practices

✅ **DO:**
- Keep `.env.local` in `.gitignore` (never commit)
- Use TEST keys for development
- Use LIVE keys only in production
- Rotate keys periodically

❌ **DON'T:**
- Commit `.env.local` to git
- Expose secret keys in public code
- Share `.env.local` files via email/chat
- Use test keys in production

---

## 📞 Getting Help

### Razorpay Support:
- Documentation: https://razorpay.com/docs/
- Dashboard: https://dashboard.razorpay.com
- Support Email: support@razorpay.com

### Your Dev Setup:
- Check the `/src/services/razorpayService.ts` file for detailed logging
- Browser Console will show detailed error messages
- Check Network tab for failed API calls

---

## ✨ Next Steps After Fix

Once payments are working:

1. **Create Backend Order API** (`/api/create-order`)
   - Validate amount
   - Create Razorpay order
   - Return order ID to frontend

2. **Create Verification API** (`/api/verify-payment`)
   - Verify payment signature
   - Update user subscription
   - Send confirmation email

3. **Create Success Page** (`/payment-success`)
   - Display confirmation message
   - Show subscription details
   - Link to activate plan

---

**Last Updated:** June 19, 2026
**Status:** In Progress - Awaiting Razorpay Key Configuration
