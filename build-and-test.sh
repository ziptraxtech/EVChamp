#!/bin/bash

# EVChamp Notification System - Build & Test Script
# This script builds the latest APK and provides testing instructions

set -e

WORKSPACE_ROOT="/Users/kshetij/Desktop/internship project/EVChamp-latest"
ANDROID_DIR="$WORKSPACE_ROOT/android"
APP_DIR="$ANDROID_DIR/app"

echo "═══════════════════════════════════════════════════════════"
echo "  EVChamp Notification System - Build & Deploy Script"
echo "═══════════════════════════════════════════════════════════"
echo ""

# Check if Android directory exists
if [ ! -d "$ANDROID_DIR" ]; then
    echo "❌ ERROR: Android directory not found at $ANDROID_DIR"
    exit 1
fi

echo "📁 Workspace: $WORKSPACE_ROOT"
echo "📁 Android Dir: $ANDROID_DIR"
echo ""

# Step 1: Clean build
echo "🧹 Step 1: Cleaning project..."
cd "$ANDROID_DIR"
if [ -f "gradlew" ]; then
    ./gradlew clean
    echo "✅ Clean complete"
else
    echo "❌ ERROR: gradlew not found"
    exit 1
fi

echo ""

# Step 2: Build debug APK
echo "🏗️  Step 2: Building debug APK..."
./gradlew assembleDebug
BUILD_STATUS=$?

if [ $BUILD_STATUS -eq 0 ]; then
    echo "✅ Build successful"
else
    echo "❌ Build failed"
    exit 1
fi

echo ""

# Find APK
APK_PATH="$APP_DIR/build/outputs/apk/debug/app-debug.apk"
if [ -f "$APK_PATH" ]; then
    APK_SIZE=$(ls -lh "$APK_PATH" | awk '{print $5}')
    echo "📦 APK Location: $APK_PATH"
    echo "📦 APK Size: $APK_SIZE"
else
    echo "❌ APK not found at $APK_PATH"
    exit 1
fi

echo ""

# Step 3: Check ADB
echo "🔌 Step 3: Checking ADB connection..."
DEVICES=$(adb devices | grep -c "device$" || true)

if [ "$DEVICES" -lt 1 ]; then
    echo "⚠️  WARNING: No connected devices found"
    echo "   Connect an Android device and run:"
    echo "   adb install -r $APK_PATH"
else
    echo "✅ Found $DEVICES connected device(s)"
    
    # Step 4: Install APK
    echo ""
    echo "📲 Step 4: Installing APK..."
    adb install -r "$APK_PATH"
    
    if [ $? -eq 0 ]; then
        echo "✅ Installation successful"
    else
        echo "❌ Installation failed"
        exit 1
    fi
fi

echo ""
echo "═══════════════════════════════════════════════════════════"
echo "  🎉 Build Complete!"
echo "═══════════════════════════════════════════════════════════"
echo ""

echo "📋 NEXT STEPS:"
echo ""
echo "1️⃣  Open the EVChamp app to trigger alarm scheduling"
echo "   (Logs should show scheduling at 11 AM and 7 PM IST)"
echo ""
echo "2️⃣  View live logs to verify scheduling:"
echo "   adb logcat | grep 'EVChamp'"
echo ""
echo "3️⃣  Check scheduled alarms:"
echo "   adb shell dumpsys alarm | grep com.evchamp.app"
echo ""
echo "4️⃣  Test notification (set device time to 10:59 AM):"
echo "   - Wait 2 minutes for notification at 11:00 AM"
echo "   - Close app and test again at 7 PM"
echo ""
echo "5️⃣  View full logs:"
echo "   adb logcat -d | grep EVChamp"
echo ""
echo "📚 Documentation:"
echo "   - NOTIFICATION_VERIFICATION_GUIDE.md (step-by-step testing)"
echo "   - NOTIFICATION_SYSTEM_REPORT.md (full technical details)"
echo "   - NOTIFICATION_TROUBLESHOOTING.md (common issues)"
echo ""
echo "═══════════════════════════════════════════════════════════"
