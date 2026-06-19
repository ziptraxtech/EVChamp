# BuyPlans Payment Amount Testing Guide

## 🎯 Overview
This guide helps you verify that the payment amount fix is working correctly in the BuyPlans component.

## ✅ What Was Fixed

### Issue
- Order summary showed correct amount (e.g., ₹8,599)
- But payment might not match due to missing backend endpoint

### Solution
- ✅ Created `/api/create-order` endpoint in backend
- ✅ Enhanced logging to track amounts through payment flow
- ✅ Verified amount conversions (rupees ↔ paise)

---

## 🧪 Testing Procedure

### Step 1: Start Development Server
```bash
# Terminal 1: Start backend
cd /path/to/EVChamp-latest
npm run server
# Should see: "API server running on http://0.0.0.0:5001"

# Terminal 2: Start frontend
npm run dev
# Should see: "http://localhost:5173"
```

### Step 2: Open Browser DevTools
1. Open http://localhost:5173
2. Press `F12` to open DevTools
3. Go to **Console** tab
4. Go to **Network** tab (keep both open)

### Step 3: Test Case 1 - Single Plan

#### Select Plan
1. Navigate to BuyPlans page
2. Select **SMART** plan (₹4,999)
3. Verify order summary shows: `₹4,999`

#### Check Console Logs
Click **"Place Order"** and look for:

```javascript
// Should see in Console:
🛒 Payment initiated for user: user_...
📋 Order Summary: {
  selectedPlans: [
    { name: "SMART", price: 4999 }
  ],
  totalPriceInRupees: 4999,
  totalPriceInPaise: 499900,
  description: "EVChamp Plans: SMART"
}
💰 Payment Amount Details: {
  amountInRupees: 4999,
  amountInPaise: 499900,
  currency: "INR"
}
🎯 Payment options (sanitized): {
  key: "✓ Present",
  amount: 499900,
  amountInRupees: 4999,
  currency: "INR",
  ...
}
```

#### Check Network Request
1. In **Network** tab, look for: `POST /api/create-order`
2. **Request body:**
   ```json
   {
     "amount": 499900,
     "currency": "INR"
   }
   ```
3. **Response (should be 200):**
   ```json
   {
     "id": "order_...",
     "amount": 499900,
     "currency": "INR"
   }
   ```

#### Verify Payment Modal
1. After logs appear, Razorpay modal should open
2. **Amount shown: ₹4,999** ✓
3. Click "Close" to exit (don't complete payment yet)

---

### Step 3: Test Case 2 - Multiple Plans

#### Select Plans
1. Clear previous selection
2. Select **SMART** (₹4,999)
3. Select **CORE** (₹3,600)
4. Verify order summary shows: `₹8,599`

#### Check Console Logs
Click **"Place Order"** and verify:

```javascript
// selectedPlans should show both:
selectedPlans: [
  { name: "SMART", price: 4999 },
  { name: "CORE", price: 3600 }
],
totalPriceInRupees: 8599,        // ← Key: 4999 + 3600
totalPriceInPaise: 859900,       // ← Key: 8599 × 100
```

#### Check Network Request
1. POST `/api/create-order` request
2. **Verify amount: 859900 paise**

#### Verify Payment Modal
1. Amount shown: **₹8,599** ✓

---

### Step 4: Test Case 3 - Complex Selection

#### Select Multiple Types
1. Select **PRO** hardware plan (₹8,999)
2. Select **Dashboard STANDARD** (₹4,500)
3. Select **Dashboard ENTERPRISE** (₹7,500)
4. Order summary should show: `₹21,099` (8999 + 4500 + 7500)

#### Verify Amounts
```javascript
// Console logs should show:
totalPriceInRupees: 21099
totalPriceInPaise: 2109900

// Network request should send:
amount: 2109900
```

#### Verify Payment Modal
1. Amount shown: **₹21,099** ✓

---

## 🔍 Debugging Checklist

### Amount Calculation Issues

**If amounts don't match:**

1. **Check console for "📋 Order Summary:"**
   - Verify `totalPriceInRupees` = sum of selected plan prices
   - Verify `totalPriceInPaise` = totalPriceInRupees × 100

2. **Check network "POST /api/create-order" request:**
   - Should have `"amount": <totalPrice * 100>`
   - Should have `"currency": "INR"`

3. **Check backend response:**
   ```
   [BuyPlans Create Order] Order created: {
     orderId: "order_1Ac2Pz...",
     amount: 859900,
     currency: "INR",
     amountInRupees: 8599
   }
   ```

### API Endpoint Issues

**If `/api/create-order` fails (404):**

1. **Check backend is running:**
   ```bash
   curl http://localhost:5001/api/health
   # Should return: {"status":"ok","timestamp":"..."}
   ```

2. **Check server logs for errors:**
   ```
   [BuyPlans Create Order Error] Invalid amount
   ```

3. **Verify Razorpay is configured:**
   - Backend should have Razorpay keys set
   - Check server logs for Razorpay initialization

### Payment Modal Issues

**If payment modal shows wrong amount:**

1. **Check console "🎯 Payment options" log:**
   - Verify `amount` field (in paise)
   - Verify `amountInRupees` (should match rupees from summary)

2. **Check readonly flag:**
   - Amount should be readonly in modal: `readonly: { amount: true }`

---

## 📊 Amount Reference Table

| Scenario | Plans Selected | Display | Paise | Expected |
|---|---|---|---|---|
| Single | SMART | ₹4,999 | 499,900 | ✓ |
| Single | CORE | ₹3,600 | 360,000 | ✓ |
| Single | PRO | ₹8,999 | 899,900 | ✓ |
| Double | SMART + CORE | ₹8,599 | 859,900 | ✓ |
| Double | PRO + ENTERPRISE | ₹16,499 | 1,649,900 | ✓ |
| Triple | SMART + CORE + STANDARD | ₹13,099 | 1,309,900 | ✓ |

---

## 🚀 Performance Testing

### Test Response Time
1. Open Network tab (DevTools)
2. Filter by "create-order"
3. Click "Place Order"
4. **Expected duration: < 500ms**

### Check for Errors
1. Look for failed requests (red status codes)
2. Check Console tab for `❌` errors
3. Should see only `✓` success logs

---

## 📱 Payment Completion Test (OPTIONAL)

**⚠️ Only do this with test card if you have one!**

1. Follow steps above until modal opens
2. Use test card: **4111111111111111**
3. Expiry: **12/25**, CVV: **123**
4. Complete payment
5. **Verify transaction amount in Razorpay dashboard**

---

## 📋 Final Verification Checklist

- [ ] Backend `/api/create-order` endpoint exists
- [ ] Console shows "📋 Order Summary:" with correct amounts
- [ ] Network request shows correct paise amount
- [ ] API response shows correct order ID
- [ ] Payment modal displays correct rupee amount
- [ ] Amount marked as readonly in modal
- [ ] No errors in browser console
- [ ] No errors in server logs
- [ ] Payment flow completes without errors

---

## 🆘 Troubleshooting Quick Links

| Issue | Check | File |
|---|---|---|
| Amounts mismatch | Console logs | `/src/components/BuyPlans.tsx` |
| API 404 error | Server running | `/server/index.js` |
| Razorpay not loading | Key configured | `/src/services/razorpayService.ts` |
| Wrong paise conversion | Math.round() | `/server/index.js` line 1063 |

---

## 📞 Support

If issues persist:

1. **Check logs in this order:**
   - Browser DevTools Console
   - Server terminal output
   - Network tab responses

2. **Verify configuration:**
   - `.env.local` has Razorpay keys
   - Backend is running on port 5001
   - Frontend is running on port 5173

3. **Review fix documentation:**
   - `BUYPLANS_PAYMENT_FIX.md` (detailed)
   - `BUYPLANS_AMOUNT_FIX_QUICK.md` (summary)

---

**Last Updated:** June 2026  
**Status:** ✅ FIXED - Ready for Testing
