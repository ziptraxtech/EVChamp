# 🚀 Firebase Push Notification Testing Plan

## Pre-Test Checklist

Before sending a test notification, ensure the following are complete:

### ✅ Backend Setup
- [ ] Firebase Admin SDK initialized with service account credentials
- [ ] `FIREBASE_SERVICE_ACCOUNT_KEY` environment variable set
- [ ] `ADMIN_API_KEY` environment variable set
- [ ] Backend API running and accessible
- [ ] Database tables created (fcm_tokens, users, wallet_balance)

### ✅ Frontend Setup
- [ ] React app compiled with no errors
- [ ] `google-services.json` added to `android/app/`
- [ ] Capacitor plugins installed and configured
- [ ] Push notification permission handling implemented

### ✅ Android Device/Emulator
- [ ] Android device connected or emulator running
- [ ] EVChamp app installed and running
- [ ] Notifications enabled in app settings
- [ ] Android version supports Firebase Cloud Messaging (API 19+)

---

## Test Flow

### **Phase 1: Verify Infrastructure**

```bash
# 1. Check if API endpoint exists
curl -X POST http://localhost:5000/api/test-notification \
  -H "Content-Type: application/json" \
  -d '{}'
```

**Expected Response:**
```json
{
  "success": false,
  "message": "No active FCM tokens found...",
  "hint": "Make sure the app is built and running on Android device..."
}
```

**If error:** Check backend logs and Firebase initialization

---

### **Phase 2: Install App & Get FCM Token**

1. **Build Android APK:**
   ```bash
   npm run build
   npx cap open android
   # Click Run (Shift + F10) in Android Studio
   ```

2. **Grant Permissions:**
   - Accept notification permissions when prompted
   - Grant camera/location permissions as needed
   - Keep app running in foreground

3. **Verify Token Registration:**
   ```bash
   # Check database for FCM token
   SELECT COUNT(*) as active_tokens FROM fcm_tokens WHERE is_active = TRUE;
   ```

   Should return at least 1 active token.

---

### **Phase 3: Send Test Notification**

**Option A: Using Test Script**
```bash
# With local API
node test-notification.js

# With production API
API_URL=https://your-api.com node test-notification.js
```

**Option B: Using cURL**
```bash
curl -X POST http://localhost:5000/api/test-notification \
  -H "Content-Type: application/json" \
  -d '{}'
```

**Option C: Using Admin Panel**
1. Navigate to `/admin/notifications`
2. Select "🌍 All Devices"
3. Enter:
   - **Title:** `🧪 Test Notification from EVChamp`
   - **Body:** `If you see this, push notifications are working!`
   - **API Key:** Your `ADMIN_API_KEY`
4. Click "Send Notification"

---

### **Phase 4: Verify Reception**

After sending:

1. **Check Device Screen:**
   - Watch for notification toast appearing at top-right (web) or notification bar (Android)
   - Notification should show title and body

2. **Check Logs:**
   ```bash
   # Frontend logs (browser console or Android logcat)
   adb logcat | grep FCM
   ```
   
   Should show:
   ```
   [FCM] Notification received: {...}
   ```

3. **Check Backend Logs:**
   Should see:
   ```
   [FCM Send] Sent to all devices...
   [FCM] Sent to 1 devices, 0 failed
   ```

---

## Expected Results

### ✅ Success Indicators

1. **Notification Displayed:**
   - Toast/banner appears with title and body
   - Notification appears in Android notification center

2. **API Response:**
   ```json
   {
     "success": true,
     "totalTokens": 1,
     "successCount": 1,
     "failedCount": 0,
     "errors": []
   }
   ```

3. **Database Updated:**
   - `last_used` timestamp updated for the token
   - Token remains marked as `is_active = TRUE`

4. **Logs Show:**
   - Backend: `[FCM Send] Sent to 1 device`
   - Frontend: `[FCM] Notification received`

---

## Troubleshooting

### ❌ Problem: "No active FCM tokens found"

**Solution:**
1. Verify app is running on device
2. Check device has internet connection
3. Verify notification permission granted
4. Check database: `SELECT * FROM fcm_tokens;`
5. Review Android logcat: `adb logcat | grep Firebase`

---

### ❌ Problem: "Firebase Admin not initialized"

**Solution:**
1. Set `FIREBASE_SERVICE_ACCOUNT_KEY` environment variable:
   ```bash
   export FIREBASE_SERVICE_ACCOUNT_KEY='{"type":"service_account",...}'
   ```
2. Verify service account JSON is valid:
   ```bash
   node -e "console.log(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY))"
   ```
3. Restart backend server

---

### ❌ Problem: Notification sent but not received

**Solution:**
1. Check Android device notification settings
2. Verify app is not in deep sleep/Doze mode
3. Check Firebase Console for delivery status
4. Review Android logcat for Firebase errors
5. Try with app in foreground vs. background

---

### ❌ Problem: "Unauthorized - Invalid API Key"

**Solution:**
1. Verify `ADMIN_API_KEY` is set
2. Check header matches exactly (case-sensitive):
   ```
   x-api-key: your_key_here
   ```
3. No leading/trailing spaces in key

---

## Sample Test Scenarios

### Scenario 1: All Devices (Broadcast)
```bash
curl -X POST http://localhost:5000/api/send-notification-all \
  -H "Content-Type: application/json" \
  -H "x-api-key: your-secret-key" \
  -d '{
    "title": "📢 System Maintenance",
    "body": "EVChamp services will be updated tonight",
    "data": {"action": "info"}
  }'
```

### Scenario 2: Specific User
```bash
curl -X POST http://localhost:5000/api/send-notification-user \
  -H "Content-Type: application/json" \
  -H "x-api-key: your-secret-key" \
  -d '{
    "clerkUserId": "user_2abc123def456",
    "title": "💳 Wallet Updated",
    "body": "₹500 added to your ZeVault account!",
    "data": {"targetPath": "/zevault"}
  }'
```

### Scenario 3: Topic (Subscribers)
```bash
curl -X POST http://localhost:5000/api/send-notification-topic \
  -H "Content-Type: application/json" \
  -H "x-api-key: your-secret-key" \
  -d '{
    "topic": "all_users",
    "title": "🔔 New Feature Available",
    "body": "Check out our latest battery diagnostic improvements!",
    "data": {"targetPath": "/zeflash"}
  }'
```

---

## Post-Test Verification

After successful test notification:

1. ✅ Test with different notification types (all/user/topic)
2. ✅ Test with custom data and actions
3. ✅ Test with app in foreground and background
4. ✅ Test on multiple devices if available
5. ✅ Verify notification click actions work
6. ✅ Check database shows updated `last_used` times

---

## Ready to Deploy? ✨

When all tests pass:

1. **Commit changes:**
   ```bash
   git add .
   git commit -m "Add Firebase push notification system with test capabilities"
   ```

2. **Push to main:**
   ```bash
   git push origin main
   ```

3. **Deploy backend:**
   - Set environment variables on hosting platform
   - Verify API endpoints are accessible
   - Test with production API URL

4. **Build for production:**
   ```bash
   npm run build
   npx cap open android
   # Build release APK in Android Studio
   ```

---

**Good luck with your testing! 🎉**
