# 🔐 Secure Credentials Management Guide

## ⚠️ CRITICAL: Credentials Have Been Exposed

**Alert**: Database credentials were found exposed in `deploy.sh` at commit `0642d05`.

### Immediate Action Required:
1. ✅ **ROTATE Neon Database Password** (IMMEDIATELY)
2. ✅ **ROTATE Admin API Key** (IMMEDIATELY) 
3. ✅ **UPDATE Firebase Credentials if exposed** (Check git history)
4. ✅ **CLEAN Git History** to remove exposed credentials

---

## 🔑 How to Securely Store Credentials

### Step 1: Create `.env.local` File

Create this file in the project root (NEVER commit to git):

```bash
# .env.local (DO NOT COMMIT)
FIREBASE_SERVICE_ACCOUNT_KEY={"type":"service_account",...minified JSON...}
DATABASE_URL=postgresql://user:password@host/db?sslmode=require
ADMIN_API_KEY=random-secure-api-key-here
CLERK_SECRET_KEY=sk_test_xxxxx
```

### Step 2: Verify `.gitignore` Contains `.env.local`

Check your `.gitignore`:
```bash
# Should include:
.env.local
.env.*.local
```

### Step 3: Add Credentials to Vercel

1. Go to: https://vercel.com/dashboard
2. Select EVChamp project
3. Settings → Environment Variables
4. Add each variable:
   - Name: `FIREBASE_SERVICE_ACCOUNT_KEY`
   - Value: [Get from `.env.local`]
   - Add the same for `DATABASE_URL` and `ADMIN_API_KEY`

### Step 4: Reference in Code

Backend uses environment variables:
```javascript
// api/index.js
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
const dbUrl = process.env.DATABASE_URL;
const apiKey = process.env.ADMIN_API_KEY;
```

Frontend uses Vercel environment variables:
```typescript
// React components
const apiUrl = process.env.REACT_APP_API_URL;
```

---

## 🛡️ Exposed Credentials - ACTION REQUIRED

### Credentials That Were Exposed:
1. **Neon Database URL**
   - Status: ⚠️ EXPOSED in deploy.sh
   - Action: ROTATE PASSWORD immediately
   - Location: https://console.neon.tech

2. **Admin API Key**
   - Status: ⚠️ EXPOSED in deploy.sh  
   - Action: GENERATE NEW KEY immediately
   - Location: Vercel dashboard

3. **Clerk API Keys**
   - Status: Check .env file
   - Action: Review and rotate if needed
   - Location: https://dashboard.clerk.com

4. **Firebase Service Account**
   - Status: Check git history
   - Action: Review and rotate if needed
   - Location: Firebase console

---

## 🔧 Rotating Credentials

### Neon Database

1. Go to: https://console.neon.tech
2. Select your project
3. Connection Details → Change password
4. Copy new password
5. Update `DATABASE_URL` in:
   - `.env.local`
   - Vercel environment variables

Example new URL format:
```
postgresql://neondb_owner:NEW_PASSWORD@ep-xxx-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require
```

### Admin API Key

1. Generate new secure key:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

2. Update in:
   - `.env.local` as `ADMIN_API_KEY`
   - Vercel environment variables
   - Any dependent services

### Firebase Service Account

1. Go to Firebase Console
2. Project Settings → Service Accounts
3. Generate new key
4. Download as JSON
5. Minify and set as `FIREBASE_SERVICE_ACCOUNT_KEY`

---

## 🧹 Cleaning Git History

### Option 1: BFG Repo-Cleaner (Recommended)

```bash
# Remove the credentials from entire history
bfg --replace-text credentials.txt --no-blob-protection

# Force push to remove from remote
git reflog expire --expire=now --all
git gc --prune=now --aggressive
git push origin --force --all
```

### Option 2: Git Filter-Branch

```bash
# Remove specific file from history
git filter-branch --tree-filter 'rm -f deploy.sh' HEAD

# Force push
git push origin --force --all
```

### Option 3: Rewrite History

```bash
# Use git-filter-repo (newer tool)
git filter-repo --path deploy.sh --invert-paths

# Force push
git push origin --force --all
```

---

## ✅ Safe Credential Practices

### DO:
- ✅ Store secrets in `.env.local` (local development)
- ✅ Store secrets in environment variables (Vercel/production)
- ✅ Use `.gitignore` to exclude `.env*` files
- ✅ Rotate credentials regularly
- ✅ Use strong, random API keys
- ✅ Review git history for exposed secrets
- ✅ Use separate credentials for different environments

### DON'T:
- ❌ Commit `.env` or `.env.local` files
- ❌ Hardcode credentials in code
- ❌ Share credentials via email or chat
- ❌ Use the same credentials across environments
- ❌ Commit database URLs with passwords
- ❌ Store credentials in markdown files
- ❌ Add credentials to deployment scripts

---

## 📋 Credential Audit Checklist

- [ ] Neon database password rotated
- [ ] Admin API key rotated
- [ ] Firebase service account reviewed
- [ ] Clerk API keys reviewed
- [ ] `.env.local` created (not committed)
- [ ] `.gitignore` includes `.env*`
- [ ] Vercel environment variables updated
- [ ] Git history cleaned of exposed secrets
- [ ] Deploy script doesn't contain secrets
- [ ] Documentation updated
- [ ] Team notified of rotation

---

## 📞 Emergency Response

If credentials are exposed:

1. **Immediately Rotate**
   - Generate new credentials
   - Update all services

2. **Update References**
   - `.env.local` (local)
   - Vercel environment variables (production)
   - Any integrations/APIs

3. **Clean History**
   - Remove from git history
   - Force push to remove from remote

4. **Notify Team**
   - Update team on rotations
   - Share new safe practices
   - Document in security incident log

5. **Monitor**
   - Watch for unauthorized access
   - Check logs for suspicious activity
   - Verify services still working

---

## 📚 References

- [Vercel Environment Variables](https://vercel.com/docs/projects/environment-variables)
- [Neon Credentials Management](https://neon.tech/docs/conceptual-guides/connection-security)
- [Firebase Service Accounts](https://firebase.google.com/docs/admin/setup)
- [Git Secret Removal](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/removing-sensitive-data-from-a-repository)

---

**Last Updated**: June 18, 2026
**Status**: ⚠️ ACTION REQUIRED - Credentials Exposed
**Priority**: CRITICAL

