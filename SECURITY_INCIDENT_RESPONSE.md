# 🔐 Security Incident Response Guide

## Credential Exposure Alert

A Neon database credential was detected as exposed in git history.

---

## ✅ SECURITY MEASURES IMPLEMENTED

### 1. **Enhanced `.gitignore`** ✅
- Added comprehensive secret patterns
- Protected all `.env*` files
- Protected database dumps and backups
- Protected credential files (`.key`, `.pem`, `.p12`, `.pfx`)
- Protected logs that might contain secrets

### 2. **Pre-commit Hook** ✅
- Installed security scanning hook at `.githooks/pre-commit`
- Prevents commits containing secrets
- Scans for common patterns:
  - Razorpay keys (`sk_live_`, `sk_test_`)
  - Database URLs (`DATABASE_URL=postgres`)
  - Clerk secrets (`sk_live_`)
  - Firebase keys (`AIzaSy`)
  - `.env` files (except `.env.example`)

### 3. **`.env.example` Template** ✅
- Created comprehensive template with all required variables
- No actual secrets in the repository
- Clear documentation for each credential type
- Links to where to get each credential

### 4. **Automated Security Setup** ✅
- Created `.githooks/setup-security.sh` script
- Automatically installs git hooks
- Scans history for existing secrets

---

## ⚠️ IMMEDIATE ACTIONS REQUIRED

### 1. **Run Security Setup** (CRITICAL)

```bash
cd /Users/kshetij/Desktop/internship\ project/EVChamp-latest
chmod +x .githooks/setup-security.sh
./.githooks/setup-security.sh
```

### 2. **Rotate Neon Database Password** (CRITICAL - DO THIS FIRST)

1. Go to [Neon Console](https://console.neon.tech)
2. Select your project → **Settings** → **Connection string**
3. Click **Reset password** 
4. Copy the new connection string
5. Update `.env.local`:
   ```
   DATABASE_URL=<NEW_CONNECTION_STRING>
   ```
6. Redeploy to Vercel:
   - Go to Vercel Dashboard → EVChamp → Settings → Environment Variables
   - Update `DATABASE_URL` with the new value
   - Vercel will auto-deploy with new credentials

### 3. **Rotate Razorpay Keys** (HIGH PRIORITY)

1. Go to [Razorpay Dashboard](https://dashboard.razorpay.com/app/settings/api-keys)
2. Click **Regenerate Key**
3. Copy both **Key ID** and **Key Secret**
4. Update environment variables:
   - `.env.local`:
     ```
     RAZORPAY_KEY_ID=<NEW_KEY_ID>
     RAZORPAY_KEY_SECRET=<NEW_KEY_SECRET>
     ```
   - Vercel Settings → Environment Variables

### 4. **Rotate Clerk Secret Key** (HIGH PRIORITY)

1. Go to [Clerk Dashboard](https://dashboard.clerk.com)
2. Select your app → **API Keys**
3. Rotate the secret key
4. Update:
   - `.env.local`: `CLERK_SECRET_KEY=<NEW_KEY>`
   - Vercel Environment Variables

### 5. **Review Firebase Credentials** (MEDIUM PRIORITY)

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project → **Project Settings** → **Service Accounts**
3. If any service account was exposed, create a new one
4. Update `FIREBASE_SERVICE_ACCOUNT_KEY` in `.env.local` and Vercel

### 6. **Scan Git History for Other Secrets**

Run these commands to check for exposed secrets:

```bash
# Search for common patterns
git log --all -S 'sk_live' --oneline
git log --all -S 'sk_test' --oneline
git log --all -S 'neon' --oneline
git log --all -S 'AIzaSy' --oneline

# Use git-secrets tool (recommended)
npm install -g git-secrets
git secrets --install
git secrets --scan
```

### 7. **Add Pre-commit Hooks to Prevent Future Leaks**

Install `git-secrets`:
```bash
brew install git-secrets  # macOS
# or
apt-get install git-secrets  # Ubuntu
```

Configure for your repo:
```bash
cd /path/to/EVChamp-latest
git secrets --install
git secrets --register-aws
git secrets --add 'sk_live'
git secrets --add 'sk_test'
git secrets --add 'RAZORPAY_KEY_SECRET'
```

---

## 🛡️ Best Practices Going Forward

### ✅ DO:
- Store all secrets in `.env.local` (never commit)
- Use environment variables in Vercel
- Rotate keys regularly (quarterly minimum)
- Use different keys for dev/staging/production
- Enable 2FA on all service dashboards
- Use encrypted `.env` files for backups
- Use the pre-commit hook to prevent accidental commits

### ❌ DON'T:
- Commit `.env` files to git
- Hardcode secrets in code
- Share secrets via chat/email
- Commit database dumps with data
- Use the same key across environments
- Leave credentials in git history
- Disable the pre-commit hook without good reason

---

## 📋 Credentials Checklist

Update Vercel Environment Variables for all of these:

```
☐ DATABASE_URL (Neon) - ROTATED
☐ RAZORPAY_KEY_ID - ROTATED
☐ RAZORPAY_KEY_SECRET - ROTATED
☐ RAZORPAY_WEBHOOK_SECRET - ROTATED
☐ CLERK_SECRET_KEY - ROTATED
☐ FIREBASE_SERVICE_ACCOUNT_KEY - CHECKED
☐ ZEFLASH_DATABASE_URL (if applicable)
☐ ZEFLASH_PARTNER_API_KEY (if applicable)
☐ CRON_SECRET - ROTATED
☐ GMAIL_USER - CHECKED
☐ GMAIL_APP_PASSWORD - CHECKED
```

---

## 🔍 Verification Steps

After rotating all credentials:

1. **Test locally:**
   ```bash
   npm run build
   npm start
   ```

2. **Test payments:**
   - Go to ZeVault checkout
   - Verify Razorpay modal loads
   - Make a test payment

3. **Check database:**
   - Verify wallet balance queries work
   - Check recent transactions in database

4. **Verify deployment:**
   - Push a small change to GitHub
   - Confirm Vercel redeploys successfully
   - Test the live site

5. **Test pre-commit hook:**
   - Try to add a fake secret to a file
   - Attempt to commit
   - Verify the hook blocks it

---

## 📞 Emergency Contacts

If credentials are still compromised:

1. **Neon Support**: https://neon.tech/support
2. **Razorpay Support**: support@razorpay.com
3. **Clerk Support**: https://clerk.com/support
4. **Firebase Support**: https://firebase.google.com/support

---

## 📝 Log of Actions Taken

- **Date**: August 1, 2026
- **Alert Source**: Neon credential exposure
- **Actions Completed**: 
  - [x] Enhanced .gitignore with comprehensive patterns
  - [x] Created pre-commit hook at .githooks/pre-commit
  - [x] Created .env.example template
  - [x] Created .githooks/setup-security.sh script
  - [x] Updated SECURITY_INCIDENT_RESPONSE.md
  - [ ] Run setup-security.sh script
  - [ ] Neon password rotated
  - [ ] Razorpay keys rotated
  - [ ] Clerk secret rotated
  - [ ] Firebase credentials reviewed
  - [ ] Vercel environment variables updated
  - [ ] Local tests passed
  - [ ] Live site verified

---

**Last Updated**: August 1, 2026
**Status**: � SECURITY SETUP COMPLETE - AWAITING KEY ROTATION

