# 🔒 SECRET MANAGEMENT & SECURITY GUIDE

## Quick Start for Developers

### 1. Set Up Your Local Environment
```bash
# Copy the template to create your local secrets file
cp .env.local.template .env.local

# Edit .env.local and fill in YOUR credentials
nano .env.local
```

### 2. Key Files and Their Purpose

| File | Purpose | Commit? | Contains |
|------|---------|---------|----------|
| `.env` | Shared config | ✅ YES | Public keys only (REACT_APP_*) |
| `.env.local` | **YOUR SECRETS** | ❌ NO | All sensitive credentials |
| `.env.local.template` | Documentation | ✅ YES | Template with placeholders |
| `.gitignore` | Git exclusions | ✅ YES | Includes .env.local |

### 3. Which Keys Go Where?

**In `.env` (PUBLIC - committed to git):**
- `REACT_APP_CLERK_PUBLISHABLE_KEY` - Used by browser, safe to expose
- `REACT_APP_API_URL` - Your API endpoint
- Any other `REACT_APP_*` variables

**In `.env.local` (PRIVATE - git-ignored):**
- `CLERK_SECRET_KEY` - Clerk backend authentication
- `DATABASE_URL` - Neon database credentials
- `FIREBASE_SERVICE_ACCOUNT_KEY` - Firebase admin access
- `ADMIN_API_KEY` - API protection key
- `GMAIL_USER` & `GMAIL_PASSWORD` - Email credentials
- `RAZORPAY_KEY_ID` & `RAZORPAY_KEY_SECRET` - Payment credentials
- Any other sensitive data

### 4. Common Operations

#### Add a New Secret
1. Add the variable to `.env.local` with your actual value
2. Add a commented template to `.env.local.template` for documentation
3. Update this guide if it's a new type of secret

#### Rotate Credentials
1. Generate new credentials from the service (Clerk, Firebase, etc.)
2. Update the value in `.env.local`
3. Update in Vercel environment variables (if deployed)
4. Commit the change to your deployment workflow docs
5. **NEVER commit the actual secret value**

#### Check if Your Changes are Safe
```bash
# Verify .env.local is in .gitignore
grep -n "\.env\.local" .gitignore

# Check .env file has no secrets
cat .env | grep -i secret || echo "No secrets in .env ✅"

# Verify .env.local is not tracked
git status | grep .env.local && echo "⚠️ .env.local is tracked!" || echo ".env.local is ignored ✅"
```

## Vercel Production Deployment

For production, set environment variables in Vercel dashboard:

1. Go to Vercel → Project Settings → Environment Variables
2. Add each secret from `.env.local` **individually** (not the entire file)
3. Set for appropriate environments: Production, Preview, Development
4. **Never paste the entire `.env.local` file into Vercel**

### Vercel Environment Variables to Set:
- `CLERK_SECRET_KEY` - Clerk secret
- `DATABASE_URL` - Production database URL
- `FIREBASE_SERVICE_ACCOUNT_KEY` - Firebase admin key
- `ADMIN_API_KEY` - Admin API key
- `GMAIL_USER` - Gmail username
- `GMAIL_PASSWORD` - Gmail app password
- `RAZORPAY_KEY_ID` - Razorpay key ID
- `RAZORPAY_KEY_SECRET` - Razorpay secret

## Security Best Practices

✅ **DO:**
- Keep `.env.local` in `.gitignore`
- Rotate secrets regularly
- Use strong, randomly generated keys (use `crypto` for API keys)
- Use service-specific API keys/tokens (don't reuse passwords)
- Review `.env` before committing (verify no secrets)
- Update `.env.local.template` when adding new secrets
- Document all credentials with comments

❌ **DON'T:**
- Commit `.env.local` or any file with real credentials
- Paste secrets into code or comments
- Share `.env.local` in chat/email/documents
- Use the same password for multiple services
- Leave placeholder values uncommented in `.env.local`
- Commit `.env.local.template` with actual values
- Print secrets in logs or console

## If You Accidentally Expose a Secret

1. **Immediately rotate the credential** in the service (Clerk, Firebase, etc.)
2. **Update all references** (Vercel env vars, .env.local, etc.)
3. **Clean git history** (advanced users):
   ```bash
   # Option 1: BFG Repo-Cleaner (recommended)
   bfg --delete-files .env.local
   bfg --replace-text passwords.txt
   
   # Option 2: git filter-branch (manual, more complex)
   git filter-branch --tree-filter 'rm -f .env.local' -- --all
   ```
4. **Force push to main** (coordinate with team):
   ```bash
   git push origin --force-with-lease
   ```
5. **Notify team** about the security incident

## Emergency Credential Rotation Checklist

When rotating critical credentials:

- [ ] Generate new credential from service
- [ ] Update in `.env.local`
- [ ] Update in Vercel environment variables
- [ ] Test the application locally
- [ ] Deploy to production and verify
- [ ] Revoke/disable the old credential
- [ ] Document the change with timestamp
- [ ] Notify team members

## References

- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)
- [Clerk Secrets](https://clerk.com/docs/keys-and-credentials)
- [Firebase Admin SDK](https://firebase.google.com/docs/admin/setup)
- [OWASP Secrets Management](https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html)
