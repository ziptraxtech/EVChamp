# 🔔 Firebase Push Notification Setup Guide for EVChamp

## Overview
This guide walks you through setting up Firebase Cloud Messaging (FCM) with Android Studio and the EVChamp React app to send push notifications to all installed devices.

---

## 📋 COMPLETED SETUP

### ✅ **Frontend (React + Capacitor)**
- **File:** `src/components/FirebaseNotification.ts`
- **Features:**
  - ✓ Initializes Firebase Messaging
  - ✓ Requests user permissions
  - ✓ Gets FCM device token
  - ✓ Subscribes to `all_users` topic
  - ✓ Handles notification reception with UI toast alerts
  - ✓ Auto-stores FCM token on backend
  - ✓ Handles notification interactions (navigation, actions)

### ✅ **Backend (Node.js/Express)**
- **File:** `api/index.js`
- **New Endpoints:**
  - `POST /api/store-fcm-token` - Store device FCM token
  - `POST /api/link-fcm-token` - Link token to authenticated user
  - `GET /api/fcm-tokens/all` - Get all active tokens (admin only)
  - `POST /api/send-notification-all` - Send to all devices
  - `POST /api/send-notification-user` - Send to specific user
  - `POST /api/send-notification-topic` - Send to topic (e.g., all_users)

### ✅ **Database**
- **Table:** `fcm_tokens`
- Stores: `id, clerk_user_id, fcm_token, device_name, is_active, last_used, created_at`
- Indexes on user ID and active status for fast queries

### ✅ **Admin Panel**
- **File:** `src/components/AdminNotificationPanel.tsx`
- Send notifications to:
  - 🌍 All Devices
  - 👤 Specific User
  - 📢 Topics (broadcast)

---

## 🚀 SETUP STEPS

### **Step 1: Firebase Project Setup**

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or use existing one named "EVChamp"
3. Enable Firebase Cloud Messaging:
   - Go to **Project Settings** → **Cloud Messaging** tab
   - Copy your **Server API Key** (you'll need this later)
4. Go to **Project Settings** → **Service Accounts**
   - Click "Generate New Private Key"
   - Save the JSON file securely (you'll use this for backend)

### **Step 2: Android Setup**

#### **2.1 Download google-services.json**
1. In Firebase Console, go to **Project Settings** → **General**
2. Under "Your apps", click "Add App" → select Android
3. Register app with package name: `com.evchamp.app` (or your package name)
4. Download `google-services.json`
5. Place in `android/app/google-services.json`

#### **2.2 Configure Android Build Files**

The following is already configured in your project:

**`android/build.gradle`:**
```gradle
buildscript {
  dependencies {
    classpath 'com.google.gms:google-services:4.3.15'
  }
}
```

**`android/app/build.gradle`:**
```gradle
apply plugin: 'com.google.gms.google-services'

dependencies {
  implementation 'com.google.firebase:firebase-messaging:23.2.1'
}
```

### **Step 3: Backend Configuration**

#### **3.1 Install Firebase Admin SDK**
```bash
npm install firebase-admin
```

#### **3.2 Set Environment Variables**

Create/update your deployment environment variables:

**Development (.env.local):**
```bash
FIREBASE_SERVICE_ACCOUNT_KEY=<content of service account JSON>
ADMIN_API_KEY=your_secret_admin_key_here
DATABASE_URL=your_neon_db_url
```

**Production (Vercel/Deployment):**
Go to your deployment dashboard and add:
- `FIREBASE_SERVICE_ACCOUNT_KEY` - Full JSON content from Firebase
- `ADMIN_API_KEY` - Secret API key for admin endpoints
- `DATABASE_URL` - PostgreSQL connection string

#### **3.3 Initialize Firebase Admin in Backend**

The backend needs Firebase Admin initialization. Add this to the top of `api/index.js`:

```javascript
const admin = require('firebase-admin');

let firebaseInitialized = false;

// Initialize Firebase Admin only once
if (!firebaseInitialized && process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
  try {
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
    firebaseInitialized = true;
    console.log('[Firebase] Admin SDK initialized');
  } catch (err) {
    console.error('[Firebase Init Error]', err.message);
  }
}
```

### **Step 4: Frontend Configuration**

Your `src/App.tsx` already initializes push notifications:

```typescript
useEffect(() => {
  void initializePushNotifications();
}, []);
```

This is called automatically when the app loads on Android devices.

### **Step 5: Build & Deploy**

#### **For Android (Capacitor):**
```bash
npm run build
npx cap copy
npx cap open android
```

In Android Studio:
1. Connect device or start emulator
2. Click "Run" or press `Shift + F10`
3. Wait for app to build and install
4. Check `adb logcat` for Firebase initialization logs

#### **For Backend (Vercel/Production):**
```bash
git add .
git commit -m "Add Firebase push notification support"
git push origin main
```

---

## 📱 TESTING PUSH NOTIFICATIONS

### **Method 1: Admin Panel UI**

1. Navigate to `/admin/notifications` (add this route in your App.tsx)
2. Fill in notification details:
   - **Title:** "Battery Health Alert"
   - **Body:** "Your battery needs attention!"
   - **Custom Data:** `{"action": "open_diagnostics", "targetPath": "/zeflash"}`
3. Select recipient (All Devices / User / Topic)
4. Click "Send Notification"

### **Method 2: Direct API Call**

```bash
curl -X POST http://localhost:5000/api/send-notification-all \
  -H "Content-Type: application/json" \
  -H "x-api-key: your_secret_admin_key_here" \
  -d '{
    "title": "Test Notification",
    "body": "This is a test message",
    "data": {"action": "open_app"}
  }'
```

### **Method 3: Firebase Console**

1. Go to Firebase Console → **Cloud Messaging**
2. Click "Send your first message"
3. Enter title and body
4. Select target (Device, Topic, Condition)
5. Send test message

---

## 📊 Database Schema

### `fcm_tokens` Table
```sql
CREATE TABLE fcm_tokens (
  id SERIAL PRIMARY KEY,
  clerk_user_id TEXT,                    -- Null until user logs in
  fcm_token TEXT UNIQUE NOT NULL,        -- The device's FCM token
  device_name TEXT,                      -- e.g., "iPhone 14", "Samsung S23"
  is_active BOOLEAN DEFAULT TRUE,        -- For invalidating old tokens
  last_used TIMESTAMP DEFAULT NOW(),     -- Track device activity
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

## 🔐 API Authentication

### **Admin Endpoints Security**

All admin endpoints require:
```javascript
Header: x-api-key: <your_admin_api_key>
```

**Set `ADMIN_API_KEY` to a strong, random string:**
```bash
# Generate a secure key
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## 📡 Notification Payload Format

### **Send to All Devices**
```json
POST /api/send-notification-all
{
  "title": "New Update Available",
  "body": "Check out the latest features!",
  "data": {
    "action": "open_page",
    "targetPath": "/zeflash"
  }
}
```

### **Send to Specific User**
```json
POST /api/send-notification-user
{
  "clerkUserId": "user_2abc123def456",
  "title": "Payment Received",
  "body": "₹500 added to your wallet!",
  "data": {
    "walletUpdate": "true"
  }
}
```

### **Send to Topic**
```json
POST /api/send-notification-topic
{
  "topic": "premium_users",
  "title": "Exclusive Premium Feature",
  "body": "Only for our premium members!"
}
```

---

## 🐛 Troubleshooting

### **Issue: FCM Token Not Storing**
- Check backend logs: `console.log('[FCM]...')`
- Verify database connection: `SELECT * FROM fcm_tokens;`
- Ensure Firebase initialization in backend

### **Issue: Notifications Not Received**
- Check if app has notification permission granted
- Verify `is_active = TRUE` in database
- Check Android notification settings for the app
- Review `adb logcat` for errors

### **Issue: "Invalid API Key"**
- Verify `ADMIN_API_KEY` environment variable is set
- Confirm exact match between header and env variable
- Check for leading/trailing spaces

### **Issue: Firebase Admin Not Initializing**
- Verify `FIREBASE_SERVICE_ACCOUNT_KEY` is valid JSON
- Check Firebase project has Cloud Messaging enabled
- Ensure service account has messaging permissions

---

## 📝 Adding Admin Panel Route

Update `src/App.tsx`:

```typescript
import AdminNotificationPanel from './components/AdminNotificationPanel';

// Add to routes:
{
  path: '/admin/notifications',
  element: <AdminNotificationPanel />,
}
```

---

## 🎯 Next Steps

1. ✅ Set up Firebase project and download credentials
2. ✅ Add `google-services.json` to Android project
3. ✅ Set environment variables (`ADMIN_API_KEY`, `FIREBASE_SERVICE_ACCOUNT_KEY`)
4. ✅ Build and test on Android device/emulator
5. ✅ Access admin panel at `/admin/notifications`
6. ✅ Send test notification!

---

## 📚 Useful Links

- [Firebase Documentation](https://firebase.google.com/docs/messaging)
- [Capacitor Firebase Plugin](https://github.com/capacitor-community/firebase-messaging)
- [Android Notification Best Practices](https://developer.android.com/guide/topics/ui/notifiers/notifications)
- [Neon PostgreSQL Docs](https://neon.tech/docs)

---

## 🆘 Support

For issues or questions:
1. Check Firebase Cloud Messaging logs
2. Review browser console for frontend errors
3. Check server logs for backend errors
4. Verify all environment variables are set correctly

---

**Ready to send notifications? Let's go! 🚀**
