#!/bin/bash

# EVChamp Push Notifications - Complete Deployment Commands
# Copy and paste these commands in order to deploy

echo "🚀 EVChamp Push Notifications - Deployment Script"
echo "=================================================="
echo ""

# Color codes
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}STEP 1: Add Environment Variables to Vercel${NC}"
echo "Go to: https://vercel.com/dashboard"
echo "Select EVChamp → Settings → Environment Variables"
echo ""
echo "Add these 3 variables (copy from below):"
echo ""
echo "Name: FIREBASE_SERVICE_ACCOUNT_KEY"
echo "Value: {minified JSON from QUICK_REFERENCE.md}"
echo ""
echo "Name: DATABASE_URL"
echo "Value: postgresql://neondb_owner:npg_3bEA4UunDHgW@ep-cool-hall-anhtee5p-pooler.c-6.us-east-1.aws.neon.tech/neondb?ssslmoderequire&channel_binding=require"
echo ""
echo "Name: ADMIN_API_KEY"
echo "Value: 5e696088d17cd276e890a0e4e2a658ec920b8233382abf71449ccec9297b67c3"
echo ""
echo "⏸️  Press ENTER when done adding variables to Vercel..."
read

echo ""
echo -e "${BLUE}STEP 2: Deploy Code${NC}"
cd /Users/kshetij/Desktop/internship\ project/EVChamp-latest || exit 1

git add .
git commit -m "feat: Implement Firebase push notifications

- Configure FCM endpoint rewrites in vercel.json
- Implement FirebaseNotification handler with token storage
- Add AdminNotificationPanel for custom notifications
- Create diagnostic and testing tools
- Production-ready push notification system"

git push origin main

echo ""
echo "⏳ Waiting for Vercel deployment..."
echo "Monitor at: https://vercel.com/dashboard"
echo ""
echo "⏸️  Press ENTER when deployment completes..."
read

echo ""
echo -e "${BLUE}STEP 3: Verify Deployment${NC}"
node diagnose-notifications.js

echo ""
echo "⏸️  If all checks are ✅, press ENTER to continue..."
read

echo ""
echo -e "${BLUE}STEP 4: Setup Android Device${NC}"
echo "Building Android app..."
cd android
./gradlew installDebug

echo ""
echo "✅ App installed on device"
echo "📱 Now:"
echo "  1. Launch EVChamp on your device"
echo "  2. Grant notification permissions"
echo "  3. Keep app running"
echo ""
echo "⏸️  Press ENTER when app is running with permissions..."
read

echo ""
echo "Checking device logs..."
adb logcat -c
sleep 2
echo "Looking for FCM token registration..."
adb logcat | grep -i fcm | head -5

echo ""
echo -e "${BLUE}STEP 5: Send Test Notification${NC}"
cd /Users/kshetij/Desktop/internship\ project/EVChamp-latest

API_URL=https://evchamp.in node test-notification.js

echo ""
echo -e "${GREEN}🎉 Deployment Complete!${NC}"
echo ""
echo "✅ Push notifications are live on https://evchamp.in"
echo "✅ Admin panel available at: https://evchamp.in/admin/notifications"
echo "✅ Check device for test notification"
echo ""
echo "📚 Documentation:"
echo "  • QUICK_REFERENCE.md - Copy-paste values"
echo "  • FINAL_DEPLOYMENT_CHECKLIST.md - Complete checklist"
echo "  • PUSH_NOTIFICATION_TROUBLESHOOTING.md - Problem solving"
echo ""
echo "🚀 Next: Send custom notifications from admin panel or use API endpoints"
echo ""
