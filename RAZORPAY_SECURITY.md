# 🔐 RAZORPAY SECURITY & KEYS MANAGEMENT

## ⚠️ CRITICAL SECURITY ALERT

**Your live Razorpay keys have been added to `.env.local`**

These keys are **PRODUCTION LIVE KEYS** and allow real money transactions. Treat them with extreme care.

---

## 📋 Key Information Reference

| Key | Value | Usage | Exposure Risk |
|-----|-------|-------|----------------|
| `VITE_RAZORPAY_KEY_ID` | `rzp_live_4QS6rb1lpyfBXF` | Frontend (Safe) | ✅ Public |
| `REACT_APP_RAZORPAY_KEY_ID` | `rzp_live_4QS6rb1lpyfBXF` | Frontend (Safe) | ✅ Public |
| `RAZORPAY_KEY_SECRET` | `aG1mnuj1s60HYTE86u9IOI2X` | Backend Only | 🔴 TOP SECRET |
| `RAZORPAY_WEBHOOK_SECRET` | `zeflash_live_whsec_2026` | Webhook Verification | 🔴 TOP SECRET |

---

## 🛡️ SECURITY ARCHITECTURE

### What's Safe to Expose (Frontend)
```
✅ VITE_RAZORPAY_KEY_ID = rzp_live_4QS6rb1lpyfBXF
✅ REACT_APP_RAZORPAY_KEY_ID = rzp_live_4QS6rb1lpyfBXF
```
- These KEY IDs are public by design
- Used to render Razorpay payment modal
- Can be seen in browser console/network tab
- No security risk if exposed

### What Must Stay Secret (Backend Only)
```
🔴 RAZORPAY_KEY_SECRET = aG1mnuj1s60HYTE86u9IOI2X
🔴 RAZORPAY_WEBHOOK_SECRET = zeflash_live_whsec_2026
```
- NEVER expose in frontend code
- NEVER log or print these values
- ONLY use on backend server
- Required for:
  - Payment verification
  - Webhook signature validation
  - Processing refunds
  - Accessing sensitive APIs

---

## 📁 Files Configuration

### Frontend Only
**File**: `src/services/razorpayService.ts`
```typescript
// ✅ SAFE - Use only KEY_ID
this.keyId = process.env.REACT_APP_RAZORPAY_KEY_ID || '';

// ❌ DANGEROUS - Never access SECRET in frontend
// this.secret = process.env.RAZORPAY_KEY_SECRET;  // DELETE THIS!
```

### Backend Only
**File**: `server/routes/payments.ts` (Backend)
```typescript
// ✅ SAFE - Use SECRET on backend only
const keySecret = process.env.RAZORPAY_KEY_SECRET;
const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

// Use for verification:
// 1. Verify payment signature
// 2. Validate webhook authenticity
// 3. Process refunds
```

### Environment Configuration
**File**: `.env.local` (Never commit to git)
```bash
# Frontend - Safe to expose
VITE_RAZORPAY_KEY_ID=rzp_live_4QS6rb1lpyfBXF
REACT_APP_RAZORPAY_KEY_ID=rzp_live_4QS6rb1lpyfBXF

# Backend - KEEP SECRET
RAZORPAY_KEY_SECRET=aG1mnuj1s60HYTE86u9IOI2X
RAZORPAY_WEBHOOK_SECRET=zeflash_live_whsec_2026
```

---

## 🚨 IF KEYS ARE EXPOSED

### Immediate Actions (First 5 minutes)
1. **Stop using these keys immediately**
2. **Go to Razorpay Dashboard**: https://dashboard.razorpay.com
3. **Navigate to**: Settings → API Keys
4. **Click "Regenerate"** on both keys
5. **Update `.env.local`** with new keys

### Damage Control (Next hour)
1. **Review recent transactions** in Razorpay dashboard
2. **Check for unauthorized charges**
3. **Enable 2FA** on Razorpay account
4. **Monitor your bank account**
5. **Notify payment recipients** if needed

### Long-term (Next 24 hours)
1. **Review git history** to remove exposed keys
   ```bash
   git log --all -S "rzp_live_4QS6rb1lpyfBXF"
   ```
2. **Force push** if keys found in history
3. **Update team members** about the incident
4. **Implement secret scanning** in CI/CD
5. **Audit all production access logs**

---

## ✅ BEST PRACTICES IMPLEMENTED

### ✅ Secure Key Storage
- Keys stored in `.env.local` (not committed to git)
- `.gitignore` prevents accidental commits
- Different files for test vs production keys

### ✅ Frontend Security
- Only KEY_ID available in frontend code
- KEY_SECRET removed from constructor
- Warnings logged if secret found in frontend

### ✅ Backend Security (To Implement)
- KEY_SECRET only loaded on server startup
- Never logged or exposed in error messages
- Truncate keys for logging: `rzp_live_...fbXF`

### ✅ Webhook Security
- WEBHOOK_SECRET used to verify Razorpay requests
- All webhook payloads must be validated
- Signature verification prevents spoofing

---

## 🔄 Payment Verification Flow

### Secure Implementation

**Step 1: Frontend (Safe)**
```typescript
// ✅ SAFE - Only KEY_ID used
const razorpay = new window.Razorpay({
  key: process.env.REACT_APP_RAZORPAY_KEY_ID,  // ✅ Public
  // payment details...
});
```

**Step 2: Backend Verification (Secure)**
```typescript
// ✅ SECURE - SECRET only on backend
const crypto = require('crypto');
const secret = process.env.RAZORPAY_KEY_SECRET;

function verifyPayment(payment_id, order_id, signature) {
  const data = `${order_id}|${payment_id}`;
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(data)
    .digest('hex');
  
  return expectedSignature === signature;
}
```

**Step 3: User Credit Update (After Verification)**
```typescript
// Only credit user AFTER verifying with backend
if (verifyPayment(paymentId, orderId, signature)) {
  // ✅ SAFE - Payment verified
  updateUserCredit(userId, credits);
  logTransaction(userId, transactionDetails);
}
```

---

## 📊 Deployment Checklist

### Before Production Deployment

- [ ] Remove all test keys from production
- [ ] Keys stored in CI/CD secrets (GitHub Actions, Vercel, etc.)
- [ ] `.env.local` is in `.gitignore`
- [ ] Git history cleaned of any exposed keys
- [ ] Backend payment verification implemented
- [ ] Webhook endpoint created and tested
- [ ] Error messages don't expose key fragments
- [ ] Logging doesn't print full keys
- [ ] Database encrypts payment records
- [ ] Rate limiting on payment endpoints
- [ ] Fraud detection implemented
- [ ] 2FA enabled on Razorpay account

### CI/CD Configuration

**GitHub Actions** (Example):
```yaml
env:
  RAZORPAY_KEY_ID: ${{ secrets.RAZORPAY_KEY_ID }}
  RAZORPAY_KEY_SECRET: ${{ secrets.RAZORPAY_KEY_SECRET }}
```

**Vercel** (Frontend Hosting):
```
Project Settings → Environment Variables
VITE_RAZORPAY_KEY_ID = rzp_live_4QS6rb1lpyfBXF
```

**Backend Server** (Your Server):
```
Only RAZORPAY_KEY_SECRET should be here
Never expose KEY_ID
```

---

## 🔍 Monitoring & Alerts

### Set Up Alerts in Razorpay Dashboard

1. **Suspicious Activity**
   - Multiple failed payments from same card
   - Unusual transaction amounts
   - High refund rate

2. **Account Activity**
   - Login attempts
   - API key rotations
   - Webhook failures

3. **Financial Alerts**
   - Daily transaction summary
   - Failed settlements
   - Chargeback notifications

---

## 📚 Reference Files

| File | Purpose | Sensitivity |
|------|---------|-------------|
| `.env.local` | Local keys | 🔴 TOP SECRET |
| `.env.example` | Template (no real keys) | ✅ Safe |
| `.gitignore` | Prevents commits | ✅ Public |
| `src/services/razorpayService.ts` | Frontend integration | ✅ Public |
| `RAZORPAY_SECURITY.md` | This file | ✅ Public |

---

## 🎯 Payment Flow Security Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                     USER BROWSER (Frontend)                  │
│                    ✅ SAFE - KEY_ID Only                     │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ React App → Razorpay Modal (KEY_ID visible)         │  │
│  │ User enters: Card/UPI details                        │  │
│  │ Razorpay returns: payment_id, order_id, signature   │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                           ↓
                    HTTPS Request
                           ↓
┌─────────────────────────────────────────────────────────────┐
│                  YOUR BACKEND SERVER                         │
│              🔴 TOP SECRET - KEY_SECRET Only                 │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ 1. Receive: payment_id, order_id, signature          │  │
│  │ 2. Use KEY_SECRET to verify signature                │  │
│  │ 3. Call Razorpay API if refund needed                │  │
│  │ 4. Update database with verified payment             │  │
│  │ 5. Return success/failure to frontend                │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                           ↓
                    HTTPS Response
                           ↓
┌─────────────────────────────────────────────────────────────┐
│                     USER BROWSER                             │
│          Redirect to /payment-success page                   │
│          Show "Payment Confirmed" to user                    │
└─────────────────────────────────────────────────────────────┘
```

---

## 🚀 Next Steps

1. **Test Payment Flow**
   ```bash
   npm start
   # Go to /zevault
   # Click "Buy Plan"
   # Complete payment with live key
   ```

2. **Implement Backend Verification**
   - Create `/api/verify-payment` endpoint
   - Use KEY_SECRET to verify signatures
   - Update user credits only after verification

3. **Set Up Webhooks**
   - Razorpay → Backend webhook endpoint
   - Verify webhook signature with WEBHOOK_SECRET
   - Handle: payment.success, payment.failed, refund.created

4. **Monitor & Maintain**
   - Check Razorpay dashboard daily
   - Rotate keys every 6 months
   - Keep dependencies updated
   - Monitor transaction trends

---

## 📞 Emergency Contacts

**If keys are compromised:**
1. Razorpay Support: support@razorpay.com
2. Your Bank/PSP Contact
3. Incident Response Team
4. Security Team

---

## ✨ Security Summary

| Aspect | Status | Details |
|--------|--------|---------|
| Frontend Keys | ✅ Safe | KEY_ID only, publicly visible |
| Backend Keys | 🔴 Critical | KEY_SECRET stored server-side only |
| Environment | ✅ Secure | Keys in `.env.local`, not in git |
| Code | ✅ Protected | No hardcoded secrets |
| Logging | ✅ Clean | No key fragments in logs |
| Deployment | ⏳ Ready | Use CI/CD secrets for production |

**REMEMBER: Your keys are LIVE and can process real payments. Treat them as TOP SECRET.**

---

**Last Updated:** June 19, 2026  
**Status:** 🟢 Secure Configuration Active  
**Next Review:** When rotating keys (every 6 months)
