# 🔧 Push Notifications Troubleshooting Guide

## Issue: Test notification is not being sent to installed devices

### Root Cause Analysis

The test notification fails for one of these reasons:

1. **No FCM tokens registered in database**
   - The app hasn't stored any device tokens yet
   - Check: `fcm_tokens` table should have entries

2. **Vercel rewrite rules not deployed**
   - The updated `vercel.json` hasn't been pushed to production
   - Endpoints return 404 error

3. **Firebase Admin SDK not initialized**
   - `FIREBASE_SERVICE_ACCOUNT_KEY` not set in Vercel environment

4. **App not initializing push notifications**
   - Android app not running with notifications enabled
   - Permissions not granted

---

## Step-by-Step Troubleshooting

### Step 1: Check if FCM Tokens are in Database

Connect to your Neon database and run:

```sql
SELECT 
  id, 
  fcm_token, 
  device_name, 
  clerk_user_id, 
  is_active, 
  last_used, 
  created_at
FROM fcm_tokens 
ORDER BY created_at DESC;
```

**Expected**: Should show registered devices
**If empty**: Proceed to Step 2

---

### Step 2: Verify Android App is Storing Tokens

**On your Android device:**

1. **Build & Run the App**:
   ```bash
   cd android
   ./gradlew installDebug
   ```

2. **Check Logcat for push notification logs**:
   ```bash
   adb logcat | grep -E "FCM|Firebase|notification"
   ```

   **Look for messages like**:
   - ✅ "FCM device token: ..."
   - ✅ "FCM token stored successfully"
   - ❌ "Notification permission denied" → Grant permissions in app

3. **Grant Notification Permissions**:
   - If app asks for notification permissions, **tap "Allow"**
   - Keep app running in background

---

### Step 3: Verify Vercel Deployment

After deploying `vercel.json`, test the endpoint:

```bash
curl -X POST https://evchamp.in/api/test-notification \
  -H "Content-Type: application/json" \
  -d '{}'
```

**Expected Response**:
```json
{
  "success": false,
  "message": "No active FCM tokens found. Install the app and enable notifications first."
}
```

**Or if tokens exist**:
```json
{
  "success": true,
  "message": "Test notification sent successfully!",
  "messageId": "message_id_here",
  "totalActiveTokens": 1
}
```

**If you get HTML error**: Deployment not complete, redeploy with `vercel deploy --prod`

---

### Step 4: Firebase Configuration Verification

**In Firebase Console:**

1. Go to **Project Settings** → **Cloud Messaging**
2. Note your **Server API Key**
3. Verify **Android App** is registered:
   - Go to **Project Settings** → **Your apps**
   - Android app should be listed
   - `google-services.json` should be in `android/app/`

---

## Complete Workflow to Send Test Notification

### Phase 1: Device Setup (Do This First)

1. **Build Android app**:
   ```bash
   cd android
   ./gradlew installDebug
   ```

2. **Run app on device**:
   - Launch the app
   - Grant notification permissions when prompted
   - Keep app running (don't close it)

3. **Verify token registration**:
   - Check Logcat: `adb logcat | grep FCM`
   - Should see: "FCM device token: xyz..."
   - Should see: "FCM token stored successfully"

### Phase 2: Backend Deployment (Do This Second)

1. **Ensure `vercel.json` is updated**:
   ```bash
   git add vercel.json
   git commit -m "fix: Add FCM endpoint rewrites for Vercel"
   git push
   ```

2. **Deploy to Vercel**:
   ```bash
   vercel deploy --prod
   ```

3. **Verify deployment**:
   ```bash
   API_URL=https://evchamp.in node test-notification.js
   ```

### Phase 3: Send Test Notification

Once both device and backend are ready:

```bash
API_URL=https://evchamp.in node test-notification.js
```

---

## Direct Test Without Waiting for Deployment

If you want to test **locally** before deploying to Vercel:

### Using Local Backend Server

1. **Start local server**:
   ```bash
   cd /Users/kshetij/Desktop/internship\ project/EVChamp-latest
   node api/index.js
   ```

2. **Point app to local backend**:
   - In `src/components/FirebaseNotification.ts`, change:
     ```typescript
     const response = await fetch('/api/store-fcm-token', {
     ```
     To:
     ```typescript
     const response = await fetch('http://your-machine-ip:5000/api/store-fcm-token', {
     ```

3. **Send test notification**:
   ```bash
   API_URL=http://localhost:5000 node test-notification.js
   ```

---

## Firebase Admin SDK Setup

The test endpoint uses Firebase Admin SDK to send notifications. Ensure:

1. **Environment Variable Set** (on Vercel):
   ```
   FIREBASE_SERVICE_ACCOUNT_KEY = {json credentials as string}
   ```

2. **Get Credentials**:
   - Firebase Console → Project Settings → Service Accounts
   - Generate new key → JSON
   - Copy entire JSON content

3. **Format for Environment Variable**:
   ```bash
   # Escape and minify the JSON
   echo 'FIREBASE_SERVICE_ACCOUNT_KEY='$(cat service-account-key.json | tr -d '\n' | jq -c .)
   ```

---

## Testing Endpoints Directly

### Test Notification (No Auth)
```bash
curl -X POST https://evchamp.in/api/test-notification \
  -H "Content-Type: application/json" \
  -d '{}'
```

### Send to All Devices (Requires Admin API Key)
```bash
curl -X POST https://evchamp.in/api/send-notification-all \
  -H "Content-Type: application/json" \
  -H "x-api-key: YOUR_ADMIN_API_KEY" \
  -d '{
    "title": "EVChamp",
    "body": "Test Notification",
    "data": { "action": "test" }
  }'
```

### Get All Registered Tokens (Admin Only)
```bash
curl -X GET https://evchamp.in/api/fcm-tokens/all \
  -H "x-api-key: YOUR_ADMIN_API_KEY"
```

---

## Common Issues & Solutions

| Issue | Cause | Solution |
|-------|-------|----------|
| "No active FCM tokens found" | App not running / permissions not granted | Rebuild app, grant permissions, keep it running |
| "Firebase Admin not initialized" | `FIREBASE_SERVICE_ACCOUNT_KEY` not set | Set env var in Vercel, redeploy |
| "Cannot POST /api/test-notification" | Vercel rewrite not deployed | Run `vercel deploy --prod` |
| Notification not appearing on device | FCM token invalid or revoked | Rebuild app, restart it |
| Permission denied errors in logcat | App can't access notification API | Grant permissions in app settings |

---

## Quick Checklist

- [ ] Android app built and installed
- [ ] App running and notification permissions granted
- [ ] Logcat shows "FCM device token: ..."
- [ ] Logcat shows "FCM token stored successfully"
- [ ] Database has entries in `fcm_tokens` table
- [ ] `vercel.json` updated with FCM rewrites
- [ ] Latest code deployed to Vercel (`vercel deploy --prod`)
- [ ] Environment variables set in Vercel dashboard
- [ ] Test endpoint responds with JSON (not HTML)
- [ ] Can see notification on device

Once all items are checked, run:
```bash
API_URL=https://evchamp.in node test-notification.js
```

