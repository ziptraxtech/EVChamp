# 🎯 RAZORPAY LIVE KEYS - QUICK REFERENCE CARD

## 🔐 Your Keys (LIVE - PRODUCTION)

```
╔════════════════════════════════════════════════════════╗
║            RAZORPAY LIVE KEYS REFERENCE               ║
╠════════════════════════════════════════════════════════╣
║                                                        ║
║  KEY ID (Public - Safe to Expose)                     ║
║  ├─ Value: rzp_live_4QS6rb1lpyfBXF                   ║
║  ├─ Type: Payment Initialization                     ║
║  ├─ Frontend: YES ✅                                 ║
║  └─ Backend: Optional                               ║
║                                                        ║
║  KEY SECRET (Top Secret - NEVER Expose) 🔴           ║
║  ├─ Value: aG1mnuj1s60HYTE86u9IOI2X                  ║
║  ├─ Type: Payment Verification                       ║
║  ├─ Frontend: NO ❌                                  ║
║  └─ Backend: YES ✅                                  ║
║                                                        ║
║  WEBHOOK SECRET (Top Secret - NEVER Expose) 🔴       ║
║  ├─ Value: zeflash_live_whsec_2026                   ║
║  ├─ Type: Webhook Signature Verification            ║
║  ├─ Frontend: NO ❌                                  ║
║  └─ Backend: YES ✅                                  ║
║                                                        ║
╚════════════════════════════════════════════════════════╝
```

---

## 📋 Configuration Checklist

### For Frontend (.env.local)
```bash
✅ VITE_RAZORPAY_KEY_ID=rzp_live_4QS6rb1lpyfBXF
✅ REACT_APP_RAZORPAY_KEY_ID=rzp_live_4QS6rb1lpyfBXF
❌ No KEY_SECRET
❌ No WEBHOOK_SECRET
```

### For Backend (.env.local)
```bash
✅ RAZORPAY_KEY_SECRET=aG1mnuj1s60HYTE86u9IOI2X
✅ RAZORPAY_WEBHOOK_SECRET=zeflash_live_whsec_2026
✅ VITE_RAZORPAY_KEY_ID=rzp_live_4QS6rb1lpyfBXF (optional)
```

### For Git (.gitignore)
```bash
✅ .env.local is protected (not committed)
✅ .env.* are protected
✅ secrets/ directory protected
```

---

## 🚀 Quick Test Guide

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | `npm start` | Dev server running |
| 2 | Go to `/zevault` | Plans page loads |
| 3 | Click "Buy Plan" | Redirects to `/checkout` |
| 4 | Click "Pay ₹XXX" | Razorpay modal opens |
| 5 | Enter test card | Modal shows payment form |
| 6 | Complete payment | Modal closes, success page |

---

## 🎯 Key Decision Matrix

```
"Where should I use which key?"

SITUATION                  KEY TO USE              WHERE?
─────────────────────────────────────────────────────────
Display payment modal      KEY_ID                 Frontend ✅
Verify payment signature   KEY_SECRET             Backend 🔴
Verify webhook events      WEBHOOK_SECRET         Backend 🔴
Log for debugging          KEY_ID (truncated)     Anywhere 🟡
Call Razorpay API          KEY_SECRET             Backend 🔴
Process refunds            KEY_SECRET             Backend 🔴
Show in error to user      KEY_ID only            Frontend ✅
Commit to git              NONE                   Nowhere ❌
```

---

## 🔒 Security Quick Reference

| Do | Don't |
|----|-------|
| ✅ Store in .env.local | ❌ Hardcode in source |
| ✅ Use in CI/CD secrets | ❌ Commit to git |
| ✅ Log KEY_ID (truncated) | ❌ Log full KEY_SECRET |
| ✅ Rotate every 6 months | ❌ Reuse old keys |
| ✅ Use 2FA on Razorpay | ❌ Skip security |
| ✅ Verify on backend | ❌ Trust frontend |

---

## 🆘 Troubleshooting Quick Links

| Problem | Solution |
|---------|----------|
| Modal not opening | Restart `npm start` |
| Payment fails | Check Razorpay dashboard |
| Keys exposed | Rotate immediately |
| Backend error | Verify KEY_SECRET access |
| Webhook failed | Check endpoint logs |

---

## 📞 Important Contacts

- **Razorpay Dashboard**: https://dashboard.razorpay.com
- **Razorpay Support**: support@razorpay.com
- **Documentation**: https://razorpay.com/docs/
- **Test Cards**: https://razorpay.com/docs/payments/payments-getting-started/

---

## ⚡ Quick Commands

```bash
# Check if .env.local exists
ls -la .env.local

# View KEY_ID (safe to show)
grep RAZORPAY_KEY_ID .env.local

# Check if KEY_SECRET is in frontend (it shouldn't be)
grep -r "KEY_SECRET" src/
# Should return: (nothing)

# Check git history for exposed keys
git log --all -S "rzp_live_" | head

# Restart dev server
npm start

# Test payment flow
# Navigate to: http://localhost:3000/zevault
```

---

## 🎓 Key Concepts (Simple)

### Public Key (KEY_ID)
- Like your username
- Safe for everyone to see
- Used to start payment
- In your checkout modal

### Secret Key (KEY_SECRET)
- Like your password
- NEVER share it
- Used to verify payments
- Only on your server

### Webhook Secret (WEBHOOK_SECRET)
- Like a door key
- NEVER share it
- Used to verify Razorpay messages
- Only on your server

---

## 📊 Payment Flow (Visual)

```
User                    Frontend                Backend
 │                         │                      │
 ├─ Click "Buy"            │                      │
 │                    ┌─────┴─────┐               │
 │                    │ Show Modal │               │
 │                    │ (KEY_ID)   │               │
 │                    └─────┬─────┘               │
 │                         │                      │
 ├─ Pay                    │                      │
 │                    ┌─────┴─────┐               │
 │                    │ Get Sig    │               │
 │                    └─────┬─────┘               │
 │                         │ HTTPS Request         │
 │                         ├──────────────────────>│
 │                         │                ┌─────┴─────┐
 │                         │                │ Verify    │
 │                         │                │(KEY_SECRET)
 │                         │                └─────┬─────┘
 │                         │<──────────────────────┤
 │                         │ Result                │
 │              ┌──────────┴──────────┐            │
 │              │ Success or Failure   │            │
 │              └──────────┬───────────┘            │
 │ ✅ Success            │                         │
 │                         │                      │
```

---

## 🎯 Deployment Steps

```
1. Local Testing ✅
   └─ Restart npm start
   └─ Test payment flow
   └─ Verify console logs

2. Code Review ✅
   └─ Check no secrets in code
   └─ Verify .env.local not committed
   └─ Review git history

3. Staging Deploy ✅
   └─ Update staging secrets
   └─ Deploy frontend
   └─ Deploy backend
   └─ Test end-to-end

4. Production Deploy ✅
   └─ Follow checklist
   └─ Set CI/CD secrets
   └─ Deploy frontend
   └─ Deploy backend
   └─ Monitor transactions
```

---

## 🔐 If Keys Are Exposed

### Within 5 minutes:
1. [ ] Stop using these keys
2. [ ] Go to Razorpay Dashboard
3. [ ] Click "Regenerate"
4. [ ] Get new keys

### Within 1 hour:
1. [ ] Update .env.local
2. [ ] Update CI/CD secrets
3. [ ] Restart all servers
4. [ ] Test payment flow

### Within 24 hours:
1. [ ] Check Razorpay for fraud
2. [ ] Review git history
3. [ ] Audit team access
4. [ ] Document incident

---

## 📝 Files Reference

| File | Contains | Protect? |
|------|----------|----------|
| `.env.local` | Live keys | 🔴 YES |
| `.env.example` | Template | ✅ NO |
| `src/razorpayService.ts` | KEY_ID only | ✅ Safe |
| `backend/verify.ts` | KEY_SECRET | 🔴 Secure |
| `.gitignore` | Protection rules | ✅ Safe |

---

## ✨ Success Checklist

- [ ] Dev server running with live keys
- [ ] Payment modal opens correctly
- [ ] Test payment completes
- [ ] Success page displays
- [ ] Razorpay shows transaction
- [ ] Console has no errors
- [ ] No keys in logs
- [ ] Security measures active

---

## 🎯 Remember

```
┌─────────────────────────────────────────┐
│  THESE ARE LIVE PRODUCTION KEYS         │
│                                         │
│  They can process REAL payments         │
│  Treat them like bank passwords         │
│  Never expose them                      │
│  Rotate them regularly                  │
│  Use 2FA on Razorpay                    │
└─────────────────────────────────────────┘
```

---

## 📞 When to Ask for Help

| Issue | Action |
|-------|--------|
| Modal not opening | Check browser console |
| Payment fails | Check Razorpay dashboard |
| Backend error | Check server logs |
| Keys compromised | Rotate immediately |
| Payment verification | Review backend code |

---

**Quick Reference**: Keep this card handy during development  
**Status**: 🟢 Live & Ready  
**Security**: 🔒 Locked Down  
**Remember**: 🔴 NEVER expose the secrets!
