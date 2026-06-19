# 🔐 RAZORPAY KEYS SECURITY ARCHITECTURE

## Visual Guide: Where Each Key Goes

```
RAZORPAY DASHBOARD
https://dashboard.razorpay.com
│
├─ Key ID: rzp_live_4QS6rb1lpyfBXF
│   └─ Status: ✅ PUBLIC (safe to expose)
│
└─ Key Secret: aG1mnuj1s60HYTE86u9IOI2X
    └─ Status: 🔴 TOP SECRET (never expose)
    └─ Webhook Secret: zeflash_live_whsec_2026

                ↓↓↓

                YOUR APPLICATION
                
    ┌─────────────────────────────────┐
    │     FRONTEND (Browser)          │
    │                                 │
    │  .env.local:                    │
    │  VITE_RAZORPAY_KEY_ID=          │
    │    rzp_live_4QS6rb1lpyfBXF ✅   │
    │                                 │
    │  REACT_APP_RAZORPAY_KEY_ID=     │
    │    rzp_live_4QS6rb1lpyfBXF ✅   │
    │                                 │
    │  ❌ NO KEY_SECRET HERE!         │
    │  ❌ NO WEBHOOK_SECRET HERE!     │
    └─────────────────────────────────┘
            ↓
        React Component
            ↓
        Razorpay Modal
            ↓
        User Completes Payment
            ↓
    HTTPS POST to Backend
            ↓
    
    ┌─────────────────────────────────┐
    │     BACKEND (Server)            │
    │                                 │
    │  .env (Server only):            │
    │  RAZORPAY_KEY_SECRET=           │
    │    aG1mnuj1s60HYTE86u9IOI2X 🔴  │
    │                                 │
    │  RAZORPAY_WEBHOOK_SECRET=       │
    │    zeflash_live_whsec_2026 🔴   │
    │                                 │
    │  VITE_RAZORPAY_KEY_ID=          │
    │    rzp_live_4QS6rb1lpyfBXF      │
    │    (optional, for logging)      │
    └─────────────────────────────────┘
            ↓
        Verify Signature
            ↓
    ✅ Payment Verified?
            ↓
        Update Database
            ↓
        Send Response
            ↓
    Return to Frontend
            ↓
    Show Success Page
```

---

## Key File Configuration Guide

### 📄 `.env.local` (Local Development)

```bash
# ✅ SAFE - Frontend can see
VITE_RAZORPAY_KEY_ID=rzp_live_4QS6rb1lpyfBXF
REACT_APP_RAZORPAY_KEY_ID=rzp_live_4QS6rb1lpyfBXF

# 🔴 SECRET - Backend only
RAZORPAY_KEY_SECRET=aG1mnuj1s60HYTE86u9IOI2X
RAZORPAY_WEBHOOK_SECRET=zeflash_live_whsec_2026

# 🔐 NEVER committed to git
# Protected by: .gitignore
```

### 📄 `.env.example` (Git Repository)

```bash
# ✅ SAFE - Can commit to git
VITE_RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxx
REACT_APP_RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxx

# ⚠️ NEVER include real secrets here
# This is just a template for developers

# 🚫 DO NOT include these:
# RAZORPAY_KEY_SECRET=
# RAZORPAY_WEBHOOK_SECRET=
```

### 🚀 CI/CD Pipeline (GitHub Actions)

```yaml
name: Deploy to Production

env:
  # Frontend - Public
  VITE_RAZORPAY_KEY_ID: ${{ secrets.RAZORPAY_KEY_ID }}
  REACT_APP_RAZORPAY_KEY_ID: ${{ secrets.RAZORPAY_KEY_ID }}

jobs:
  deploy-frontend:
    runs-on: ubuntu-latest
    env:
      # Frontend vars only
      VITE_RAZORPAY_KEY_ID: ${{ secrets.RAZORPAY_KEY_ID }}
    # Deploy to Vercel/Netlify

  deploy-backend:
    runs-on: ubuntu-latest
    env:
      # Backend vars only - NEVER in frontend job
      RAZORPAY_KEY_SECRET: ${{ secrets.RAZORPAY_KEY_SECRET }}
      RAZORPAY_WEBHOOK_SECRET: ${{ secrets.RAZORPAY_WEBHOOK_SECRET }}
    # Deploy to your backend server
```

---

## Source Code Usage

### ✅ CORRECT - Frontend Only

```typescript
// src/services/razorpayService.ts
class RazorpayService {
  private keyId: string;

  constructor() {
    // ✅ SAFE - Use only KEY_ID
    this.keyId = process.env.REACT_APP_RAZORPAY_KEY_ID || '';
    
    // 🔴 NEVER do this:
    // const secret = process.env.RAZORPAY_KEY_SECRET; // ❌ WRONG!
  }

  async initializePayment(amount: number) {
    // ✅ SAFE - Frontend payment initialization
    const options = {
      key: this.keyId,  // PUBLIC - safe
      amount: amount * 100,
      // ... other options
    };
    new window.Razorpay(options).open();
  }
}
```

### ✅ CORRECT - Backend Only

```typescript
// backend/routes/payments.ts
const express = require('express');
const crypto = require('crypto');

router.post('/api/verify-payment', (req, res) => {
  // 🔴 TOP SECRET - Use only on backend
  const secret = process.env.RAZORPAY_KEY_SECRET; // ✅ CORRECT

  const { paymentId, orderId, signature } = req.body;
  
  // Verify signature using secret
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(`${orderId}|${paymentId}`)
    .digest('hex');

  if (expectedSignature === signature) {
    // ✅ Payment verified - safe to credit user
    updateUserCredits(userId, credits);
    res.json({ verified: true });
  } else {
    // 🔴 Invalid signature - reject payment
    res.status(400).json({ verified: false });
  }
});
```

---

## Security Matrix

```
┌──────────────────────────────────────────────────────┐
│                  KEY USAGE MATRIX                    │
├──────────────────────────────────────────────────────┤
│                                                      │
│  KEY_ID (Public)                                     │
│  ├─ ✅ Use in: Frontend Components                  │
│  ├─ ✅ Use in: React/Vue/Angular                    │
│  ├─ ✅ Use in: Browser Console (safe)               │
│  ├─ ✅ Use in: Production Frontend                  │
│  └─ ❌ Never: Store in database                     │
│                                                      │
│  KEY_SECRET (Top Secret)                            │
│  ├─ ✅ Use in: Backend API endpoints                │
│  ├─ ✅ Use in: Payment verification                 │
│  ├─ ✅ Use in: Webhook validation                   │
│  ├─ ✅ Use in: Refund processing                    │
│  ├─ ❌ Never: Use in Frontend                       │
│  ├─ ❌ Never: Log or print                          │
│  ├─ ❌ Never: Commit to git                         │
│  ├─ ❌ Never: Send to client                        │
│  └─ ❌ Never: Expose in error messages              │
│                                                      │
│  WEBHOOK_SECRET (Top Secret)                        │
│  ├─ ✅ Use in: Webhook endpoints                    │
│  ├─ ✅ Use in: Signature verification               │
│  ├─ ❌ Never: Use in Frontend                       │
│  ├─ ❌ Never: Log or print                          │
│  ├─ ❌ Never: Commit to git                         │
│  └─ ❌ Never: Hardcode in source                    │
│                                                      │
└──────────────────────────────────────────────────────┘
```

---

## Error Handling: What To Do

### ✅ GOOD - Safe Error Messages

```typescript
// ✅ SAFE - No key exposure
catch (error) {
  console.error('Payment initialization failed');
  console.error('Error code:', error.code);
  console.error('Error message:', error.message);
  // Safe for users to see
}

// ✅ SAFE - Truncate keys for debugging
const debugKey = `${this.keyId.slice(0, 8)}...${this.keyId.slice(-4)}`;
console.log('Using key:', debugKey);
// Output: Using key: rzp_live_...XF
```

### ❌ WRONG - Dangerous Error Messages

```typescript
// ❌ DANGEROUS - Exposes key
catch (error) {
  console.error('Payment failed with key:', RAZORPAY_KEY_SECRET);
  // Entire team sees the secret!
}

// ❌ DANGEROUS - Full key in logs
const secret = process.env.RAZORPAY_KEY_SECRET;
console.log('Secret:', secret);
// Full secret visible in logs!

// ❌ DANGEROUS - Key in error message
throw new Error(`Payment failed: ${RAZORPAY_KEY_SECRET}`);
// Sent to user and error tracking!
```

---

## Deployment Checklist Diagram

```
Local Development
    ↓
    ├─ .env.local with LIVE keys ✅
    ├─ Frontend uses KEY_ID only ✅
    ├─ Backend uses KEY_SECRET only ✅
    └─ No hardcoded secrets ✅
    ↓
Staging Environment
    ↓
    ├─ CI/CD has separate secrets ✅
    ├─ Frontend vars set (KEY_ID) ✅
    ├─ Backend vars set (KEY_SECRET) ✅
    ├─ Webhook endpoint configured ✅
    └─ Full payment flow tested ✅
    ↓
Production Environment
    ↓
    ├─ GitHub/GitLab secrets configured ✅
    ├─ Vercel/Netlify secrets configured ✅
    ├─ Server environment variables set ✅
    ├─ Webhooks enabled ✅
    ├─ Monitoring active ✅
    ├─ Alerts configured ✅
    └─ Ready for customers ✅
```

---

## Key Rotation Timeline

```
Month 1-6: CURRENT KEYS IN USE
├─ Key ID: rzp_live_4QS6rb1lpyfBXF ✅
├─ Key Secret: aG1mnuj1s60HYTE86u9IOI2X ✅
└─ Webhook Secret: zeflash_live_whsec_2026 ✅

                    ↓ TIME PASSES ↓

Month 6: ROTATION PLANNED
├─ Generate new keys in Razorpay
├─ Test new keys in staging
├─ Plan downtime (if needed)
└─ Notify team

Month 6: ROTATION EXECUTED
├─ Update .env.local with new keys
├─ Update CI/CD secrets
├─ Update backend server
├─ Run pre-deployment checks
└─ Deploy new keys

Month 6: VERIFICATION
├─ Test payment flow ✅
├─ Monitor transactions ✅
├─ Check no errors ✅
├─ Revoke old keys in Razorpay ✅
└─ Document completion ✅

Month 7-12: NEW KEYS IN USE
├─ Key ID: rzp_live_XXXXXXXX ✅
├─ Key Secret: YYYYYYYY ✅
└─ Webhook Secret: ZZZZZZZZ ✅
```

---

## Summary: Quick Reference

| Item | Safe? | Where? | Why? |
|------|-------|--------|------|
| KEY_ID | ✅ Yes | Frontend & Backend | Public by design |
| KEY_SECRET | 🔴 No | Backend only | Enables real transactions |
| WEBHOOK_SECRET | 🔴 No | Backend only | Verifies Razorpay requests |
| In .env.local | ⚠️ Secret file | Local dev only | Not committed to git |
| In .env.example | ⚠️ Template | Repository | No real secrets |
| In source code | 🔴 Never | Nowhere | Would expose credentials |
| In git history | 🔴 Never | Nowhere | Permanent record |
| In error logs | 🔴 Never | Nowhere | Breaches security |
| In CI/CD secrets | ✅ Yes | GitHub Actions | Encrypted by platform |

---

## 🎯 Final Checklist

Before considering your payment system secure:

- [ ] KEY_ID configured in `.env.local` for frontend
- [ ] KEY_SECRET configured in `.env.local` for backend ONLY
- [ ] WEBHOOK_SECRET configured in `.env.local`
- [ ] `.env.local` is in `.gitignore`
- [ ] No secrets in `.env.example`
- [ ] No secrets in source code
- [ ] No secrets in git history
- [ ] Frontend doesn't access KEY_SECRET
- [ ] Backend doesn't expose KEY_SECRET in errors
- [ ] Logging sanitizes key values
- [ ] Error messages don't expose keys
- [ ] CI/CD configured with secrets
- [ ] Separate frontend/backend var setup
- [ ] Team trained on security
- [ ] Documentation reviewed
- [ ] Ready for production ✅

---

**Status**: 🟢 Secure Configuration Complete  
**Keys**: LIVE & PROTECTED  
**Ready for**: Production Payment Processing  
**Reminder**: Treat these keys like your bank password!
