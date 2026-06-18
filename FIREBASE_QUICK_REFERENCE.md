# 🔔 Firebase Push Notifications - Quick Reference

## ⚡ **TL;DR - What's Done**

✅ Frontend notification handling (React + Capacitor)
✅ Backend notification endpoints (Express + Firebase Admin)
✅ Database schema for storing FCM tokens
✅ Admin panel UI to send notifications
✅ Complete documentation and setup guide

**Status:** Ready for final setup and testing! 🚀

---

## 🎯 **What You Need to Do NOW**

### **3 Quick Steps to Go Live:**

#### **Step 1: Get Firebase Credentials (5 min)**
```bash
1. Go to https://console.firebase.google.com/
2. Select your "EVChamp" project
3. Download google-services.json
   → Place at: android/app/google-services.json
4. Get service account JSON
   → Project Settings → Service Accounts → Generate Key
```

#### **Step 2: Set Environment Variables (2 min)**
```bash
# In your .env.local or deployment platform:
FIREBASE_SERVICE_ACCOUNT_KEY="paste_entire_json_here"
ADMIN_API_KEY="run: node -e \"console.log(require('crypto').randomBytes(32).toString('hex'))\""
```

#### **Step 3: Install & Test (5 min)**
```bash
# Install Firebase Admin
npm install firebase-admin

# Add Firebase Admin init code to api/index.js (see docs)
# Build Android app
npm run build
npx cap copy
npx cap open android
```

---

## 🎨 **Admin Panel**

**Access:** `http://localhost:3000/admin/notifications`

**Features:**
- 🌍 Send to **All Devices**
- 👤 Send to **Specific User**
- 📢 Send to **Topic** (broadcast group)

---

## 📱 **How Notifications Work**

```
User's Android Device
         ↓
  Receives FCM Token
         ↓
  Stores on Backend (/api/store-fcm-token)
         ↓
  Subscribes to "all_users" topic
         ↓
  Admin sends notification → Backend
         ↓
  Firebase Admin SDK → Google FCM
         ↓
  Device receives + displays toast alert
         ↓
  User can click to navigate/act
```

---

## 🔐 **API Endpoints**

### **Public (No Auth Required):**
```
POST /api/store-fcm-token
{
  "token": "fcm_token_here",
  "deviceName": "iPhone 14" (optional)
}
```

### **User Authenticated:**
```
POST /api/link-fcm-token
Header: Authorization: Bearer <clerk_token>
{
  "fcmToken": "...",
  "deviceName": "..."
}
```

### **Admin Only (Requires x-api-key header):**
```
GET /api/fcm-tokens/all
POST /api/send-notification-all
POST /api/send-notification-user
POST /api/send-notification-topic
```

---

## 📊 **Database**

**Table:** `fcm_tokens`

```sql
id              SERIAL PRIMARY KEY
clerk_user_id   TEXT (nullable until auth)
fcm_token       TEXT UNIQUE NOT NULL
device_name     TEXT
is_active       BOOLEAN (default TRUE)
last_used       TIMESTAMP
created_at      TIMESTAMP
```

---

## 💡 **Example: Send Battery Alert**

**Via Admin Panel:**
1. Go to `/admin/notifications`
2. Title: `⚠️ Battery Health Alert`
3. Body: `Your battery needs a diagnostic test!`
4. Custom Data: `{"action":"open_diagnostics","targetPath":"/zeflash"}`
5. Click "Send Notification"

**Via API:**
```bash
curl -X POST http://localhost:5000/api/send-notification-all \
  -H "x-api-key: your_admin_key" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "⚠️ Battery Health Alert",
    "body": "Your battery needs a diagnostic test!",
    "data": {
      "action": "open_diagnostics",
      "targetPath": "/zeflash"
    }
  }'
```

---

## 🧪 **Testing Checklist**

- [ ] Firebase project created
- [ ] `google-services.json` downloaded & placed
- [ ] Service account JSON obtained
- [ ] Environment variables set
- [ ] `firebase-admin` npm package installed
- [ ] Firebase Admin init code added to backend
- [ ] Android app built with `npx cap copy`
- [ ] App installed on device
- [ ] App has notification permission granted
- [ ] Visit `/admin/notifications`
- [ ] Send test notification
- [ ] Receive on device ✅

---

## 🐛 **Troubleshooting**

**Notifications not received?**
```bash
# Check if tokens stored
SELECT * FROM fcm_tokens WHERE is_active = TRUE;

# Check device logs
adb logcat | grep -i "firebase\|notification"

# Check backend logs
Look for "[FCM]" messages in console
```

**Invalid API Key?**
- Verify exact match of `ADMIN_API_KEY` in env
- No leading/trailing spaces
- Check deployment platform env vars

**Firebase not initializing?**
- Verify service account JSON is valid
- Check `FIREBASE_SERVICE_ACCOUNT_KEY` env variable
- Review backend console logs

---

## 📝 **Files Modified**

| File | Changes |
|------|---------|
| `src/components/FirebaseNotification.ts` | Enhanced token handling + notifications UI |
| `src/components/AdminNotificationPanel.tsx` | NEW - Admin panel component |
| `api/index.js` | NEW - 5 FCM endpoints + fcm_tokens table |
| `src/App.tsx` | Added route: `/admin/notifications` |

---

## 📚 **Full Documentation**

- **Setup Guide:** `FIREBASE_PUSH_NOTIFICATION_SETUP.md`
- **Implementation Summary:** `FIREBASE_IMPLEMENTATION_SUMMARY.md`
- **This Quick Reference:** `QUICK_REFERENCE.md`

---

## 🚀 **You're Ready!**

Once setup complete, you can send notifications to:
- ✅ All 10K+ devices
- ✅ Specific users
- ✅ Topic-based groups
- ✅ With custom actions

**Next Step:** Tell me what notification you want to send! 📲

Example: _"Send a 'New battery diagnostic available' message to all users"_
