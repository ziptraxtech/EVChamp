#!/bin/bash

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}🔍 EVChamp Razorpay Integration Validator${NC}\n"

# Check if .env.local exists
if [ -f .env.local ]; then
    echo -e "${GREEN}✓ .env.local file found${NC}"
    
    # Check for Razorpay Key ID
    if grep -q "REACT_APP_RAZORPAY_KEY_ID" .env.local; then
        RAZORPAY_KEY=$(grep "REACT_APP_RAZORPAY_KEY_ID" .env.local | cut -d '=' -f 2)
        if [ -z "$RAZORPAY_KEY" ] || [ "$RAZORPAY_KEY" = "your_razorpay_key_id_here" ]; then
            echo -e "${RED}✗ REACT_APP_RAZORPAY_KEY_ID is empty or default${NC}"
            echo "  👉 Please add your Razorpay Key ID from https://dashboard.razorpay.com/app/settings/api-keys"
        else
            echo -e "${GREEN}✓ REACT_APP_RAZORPAY_KEY_ID is configured${NC}"
        fi
    else
        echo -e "${RED}✗ REACT_APP_RAZORPAY_KEY_ID not found in .env.local${NC}"
        echo "  👉 Add this line to .env.local:"
        echo "     REACT_APP_RAZORPAY_KEY_ID=your_razorpay_key_id_here"
    fi
else
    echo -e "${RED}✗ .env.local file not found${NC}"
    echo "  👉 Create .env.local with the following content:"
    echo ""
    echo "REACT_APP_RAZORPAY_KEY_ID=your_razorpay_key_id_here"
    echo "REACT_APP_RAZORPAY_KEY_SECRET=your_razorpay_key_secret_here"
    echo "REACT_APP_API_URL=http://localhost:5000/api"
    echo "REACT_APP_CLERK_PUBLISHABLE_KEY=your_clerk_key_here"
    echo ""
fi

# Check if node_modules exists
if [ -d node_modules ]; then
    echo -e "${GREEN}✓ node_modules directory found${NC}"
else
    echo -e "${RED}✗ node_modules not found${NC}"
    echo "  👉 Run: npm install"
fi

# Check if package.json has razorpay
if grep -q '"razorpay"' package.json; then
    echo -e "${GREEN}✓ Razorpay package is listed in package.json${NC}"
else
    echo -e "${YELLOW}⚠ Razorpay package not found in dependencies${NC}"
fi

# Check if BuyPlans component exists
if [ -f src/components/BuyPlans.tsx ]; then
    echo -e "${GREEN}✓ BuyPlans.tsx component found${NC}"
else
    echo -e "${RED}✗ BuyPlans.tsx not found${NC}"
fi

# Check if razorpayService exists
if [ -f src/services/razorpayService.ts ]; then
    echo -e "${GREEN}✓ razorpayService.ts found${NC}"
else
    echo -e "${RED}✗ razorpayService.ts not found${NC}"
fi

echo ""
echo -e "${YELLOW}📋 Next Steps:${NC}"
echo "1. Add your Razorpay Key ID to .env.local"
echo "2. Restart development server: npm run dev"
echo "3. Try the payment flow again"
echo "4. Check browser console (F12) for detailed logs"
echo ""
echo -e "${YELLOW}📚 More info: Read RAZORPAY_TROUBLESHOOTING.md${NC}"
