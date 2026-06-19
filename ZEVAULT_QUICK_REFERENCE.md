# ZeVault Payment Integration - Quick Reference

## 🚀 Getting Started

### Step 1: Setup Environment Variables
Create `.env.local` in the project root:
```env
REACT_APP_RAZORPAY_KEY_ID=rzp_live_YOUR_KEY_ID_HERE
REACT_APP_RAZORPAY_KEY_SECRET=your_secret_key_here
REACT_APP_API_URL=https://your-backend-url.com/api
REACT_APP_RAZORPAY_CALLBACK_URL=https://your-frontend-url.com/payment-success
```

### Step 2: Restart Dev Server
```bash
# Kill running server (Ctrl+C)
# Then restart
npm start
```

### Step 3: Test the Flow
1. Navigate to `http://localhost:3000/zevault`
2. Click any plan button (Start Trial, Get Started, Get Value Pack, Buy Custom Plan)
3. You should be redirected to `/checkout` page
4. Click "Pay ₹XXX" button
5. Razorpay modal should open

## 📁 File Structure

```
src/
├── components/
│   ├── ZeVaultPage.tsx          ← Plan selection page
│   ├── ZeVaultCheckout.tsx      ← NEW: Checkout & payment page
│   └── PaymentSuccess.tsx       ← Success confirmation
├── services/
│   └── razorpayService.ts       ← Razorpay integration (enhanced)
└── App.tsx                      ← Routes (updated with /checkout)
```

## 🔗 URL Patterns

### ZeVault Plans Page
```
/zevault
```

### Checkout Page (with params)
```
/checkout?plan=trial&tests=1&months=0&price=199
/checkout?plan=starter&tests=8&months=12&price=1499
/checkout?plan=value&tests=12&months=12&price=2499
/checkout?plan=custom&tests=16&months=18&price=3040
```

### Success Page
```
/payment-success?razorpay_payment_id=XXX&razorpay_order_id=XXX&razorpay_signature=XXX
```

## 💻 Development Tips

### Enable Detailed Logging
Open browser DevTools Console (F12) and watch for:
- 🔧 = Initialization
- 📥 = Loading
- ✓ = Success
- ✗ = Error

### Test Razorpay Integration
```javascript
// In browser console:
console.log('Razorpay available:', !!window.Razorpay);
console.log('Key ID set:', !!process.env.REACT_APP_RAZORPAY_KEY_ID);
```

### Common Error Fixes

| Error | Solution |
|-------|----------|
| "Key ID not configured" | Add `REACT_APP_RAZORPAY_KEY_ID` to `.env.local` |
| Modal not opening | Check internet connection, restart dev server |
| Script loading failed | Verify Razorpay CDN is accessible |
| Invalid parameters | Check URL query parameters syntax |

## 🧪 Testing Scenarios

### Happy Path
1. User signs in
2. Navigates to /zevault
3. Clicks Buy Plan
4. Redirected to /checkout
5. Reviews order
6. Completes payment
7. Redirected to success page

### Error Handling
- Not signed in → Redirects to sign-in
- Invalid plan params → Shows error message
- Razorpay key missing → Shows configuration error
- Payment fails → Shows retry option

## 🔐 Security Features

✅ Authentication check (Clerk)
✅ User validation
✅ Parameter validation
✅ Secure payment gateway (Razorpay)
✅ HTTPS only callbacks
✅ No sensitive data in URLs
✅ Signature verification ready

## 📊 Plan Details

| Plan | Tests | Validity | Price |
|------|-------|----------|-------|
| Trial | 1 | - | ₹199 |
| Starter | 8 | 12 months | ₹1,499 |
| Value | 12 | 12 months | ₹2,499 |
| Custom | 8-24 | 12-24 months | Dynamic |

## 🐛 Debug Commands

Run diagnostic script:
```bash
node check-zevault-setup.js
```

Check environment variables:
```bash
cat .env.local | grep RAZORPAY
```

## 📞 Razorpay Resources

- Dashboard: https://dashboard.razorpay.com
- API Docs: https://razorpay.com/docs/api/
- Test Cards: https://razorpay.com/docs/payments/payments-guide/test-mode/

### Test Payment Details
- Card: 4111111111111111
- Expiry: 12/25
- CVV: 123

## ✅ Verification Checklist

Before going live:
- [ ] Razorpay live keys configured
- [ ] Callback URL verified in Razorpay dashboard
- [ ] Backend `/api/verify-payment` endpoint implemented
- [ ] Payment success page customized
- [ ] Email notifications set up
- [ ] Refund policy documented
- [ ] Terms & conditions updated
- [ ] Privacy policy updated

## 🚨 Production Deployment

1. Switch Razorpay keys to LIVE mode
2. Update `REACT_APP_RAZORPAY_KEY_ID` to live key
3. Update `REACT_APP_RAZORPAY_CALLBACK_URL` to production domain
4. Set `REACT_APP_API_URL` to production backend
5. Deploy frontend to production
6. Test complete payment flow
7. Monitor Razorpay dashboard for transactions
8. Set up alerts for failed payments

## 📝 Notes

- Payment amounts are in INR (Indian Rupees)
- All amounts are converted to paise (₹ * 100) for Razorpay API
- Order creation is optional (works in demo mode without order_id)
- Payment verification should happen on backend for security
- Webhook signatures must be verified

---
**Last Updated**: 2024
**Version**: 1.0
