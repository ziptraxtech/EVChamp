#!/bin/bash

# EVChamp Push Notifications - Complete Deployment Commands
# SECURITY WARNING: Do NOT add any credentials to this file!
# Store all credentials in .env.local (which is in .gitignore)

echo "🚀 EVChamp Push Notifications - Deployment Script"
echo "=================================================="
echo ""

# Color codes
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${RED}⚠️  SECURITY WARNING${NC}"
echo "This file contains DEPLOYMENT INSTRUCTIONS ONLY"
echo "Do NOT add any credentials or secrets to this file!"
echo "See SECURE_CREDENTIALS.md for safe credential management"
echo ""

echo -e "${BLUE}STEP 1: Prepare Environment Variables${NC}"
echo "=================================================="
echo ""
echo "1. Create a file: .env.local (in project root)"
echo "2. Add these variables (get from secure source):"
echo ""
echo "   FIREBASE_SERVICE_ACCOUNT_KEY=<minified-json-from-firebase>"
echo "   DATABASE_URL=<postgresql-connection-string>"
echo "   ADMIN_API_KEY=<random-api-key>"
echo ""
echo "3. Save .env.local (already in .gitignore)"
echo ""

echo -e "${BLUE}STEP 2: Add to Vercel${NC}"
echo "=================================================="
echo "1. Go to: https://vercel.com/dashboard"
echo "2. Select EVChamp → Settings → Environment Variables"
echo "3. Add each variable from .env.local"
echo "   - Name: FIREBASE_SERVICE_ACCOUNT_KEY"
echo "   - Name: DATABASE_URL"
echo "   - Name: ADMIN_API_KEY"
echo ""
echo "⏸️  Press ENTER when done adding variables to Vercel..."
read

echo ""
echo -e "${BLUE}STEP 3: Deploy Code${NC}"
echo "=================================================="
cd /Users/kshetij/Desktop/internship\ project/EVChamp-latest || exit 1

git add .
git commit -m "chore: Deploy Firebase push notifications

- No credentials in git history
- All secrets in environment variables
- Production-ready deployment"

git push origin main

echo ""
echo "✅ Deployment pushed to GitHub"
echo "⏳ Vercel will automatically deploy from main branch"
echo ""
echo -e "${GREEN}✨ Deployment in progress!${NC}"
