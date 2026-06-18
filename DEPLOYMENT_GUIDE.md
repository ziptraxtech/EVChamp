# 🚀 EVChamp Push Notifications - Deployment Guide

## Updated Configuration

The `vercel.json` has been updated to route all FCM (Firebase Cloud Messaging) endpoints through the Vercel serverless function at `/api/index.js`.

### Updated Rewrites in vercel.json

The following endpoints are now configured:

```json
{
  "source": "/api/store-fcm-token",
  "destination": "/api/index.js"
},
{
  "source": "/api/link-fcm-token",
  "destination": "/api/index.js"
},
{
  "source": "/api/fcm-tokens/all",
  "destination": "/api/index.js"
},
{
  "source": "/api/send-notification-all",
  "destination": "/api/index.js"
},
{
  "source": "/api/send-notification-user",
  "destination": "/api/index.js"
},
{
  "source": "/api/send-notification-topic",
  "destination": "/api/index.js"
},
{
  "source": "/api/test-notification",
  "destination": "/api/index.js"
}
```

## Deployment Steps

### 1. **Deploy to Vercel**

Push your changes and redeploy:

```bash
# Stage changes
git add .

# Commit with message
git commit -m "feat: Configure FCM endpoints for Vercel deployment"

# Push to your branch
git push origin main

# If using Vercel CLI
vercel deploy --prod
```

### 2. **Verify Environment Variables on Vercel**

Make sure these are set in Vercel project settings:

- `DATABASE_URL` - Your Neon database connection string
- `FIREBASE_SERVICE_ACCOUNT_KEY` - Firebase admin SDK credentials (as JSON string)
- `ADMIN_API_KEY` - Secret key for admin endpoints (for `/send-notification-all`, etc.)
- `GMAIL_USER` - Gmail account for contact emails
- `GMAIL_APP_PASSWORD` - Gmail app password
- `ZEFLASH_DATABASE_URL` - ZeFlash database URL (if applicable)
- `RAZORPAY_KEY_SECRET` - Razorpay secret key
- `CLERK_SECRET_KEY` - Clerk authentication secret

### 3. **Test the Endpoints After Deployment**

Once deployed, test with:

```bash
# Test notification endpoint (no auth required)
curl -X POST https://evchamp.in/api/test-notification \
  -H "Content-Type: application/json" \
  -d '{}'

# You should get a response like:
# {
#   "success": true,
#   "message": "Test notification sent successfully!",
#   "messageId": "message_id_here",
#   "totalActiveTokens": 1
# }
```

## Troubleshooting

### Issue: "Cannot POST /api/test-notification"
**Solution**: The rewrite rules in `vercel.json` are not being applied. Make sure:
- You've deployed the latest version with the updated `vercel.json`
- Clear Vercel cache: Visit your Vercel dashboard → Settings → Git → Clear cache
- Redeploy: `vercel deploy --prod`

### Issue: "No active FCM tokens found"
**Solution**: 
- Build and install the EVChamp Android app on a device
- Launch the app and accept notification permissions
- Keep the app running (foreground or background)
- The FCM token should be stored in the database automatically

### Issue: "Firebase Admin not initialized"
**Solution**:
- Check that `FIREBASE_SERVICE_ACCOUNT_KEY` is set in Vercel environment variables
- Verify the JSON is properly formatted (escaped quotes)
- Go to Firebase Console → Project Settings → Service Accounts → Generate new key

## Admin Panel (for future notifications)

Once deployed, you can send custom notifications via the admin panel:

1. Navigate to: `https://evchamp.in/admin/notifications`
2. Select notification type (All Users, Specific Topic, or Specific User)
3. Enter Title and Body
4. Enter your Admin API Key (from environment variable)
5. Click "Send Notification"

Supported Endpoints:
- `POST /api/send-notification-all` - Send to all devices
- `POST /api/send-notification-topic` - Send to a specific topic
- `POST /api/send-notification-user` - Send to a specific user

All require the `x-api-key` header with the `ADMIN_API_KEY` value.

## Next Steps

1. ✅ Deploy the updated `vercel.json` to production
2. ✅ Verify all FCM endpoints are working
3. ✅ Test sending notifications from the admin panel
4. ✅ Monitor Firebase Console for delivery status
5. ✅ Ready for production push notifications!

