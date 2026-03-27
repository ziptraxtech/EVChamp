# Sell EV Marketplace - Feature Documentation

## Overview
The Sell EV marketplace is a comprehensive platform where users can list their electric vehicles for sale, get them certified with battery diagnostics, and potential buyers can book inspections and complete purchases via Razorpay.

## Key Features

### 1. **Vehicle Listing System**
- Sellers can list their EVs with detailed information
- Required fields:
  - Brand (Tata, MG, Hyundai, Mahindra, Ather, Other)
  - Model name
  - Year of manufacture (2015-2026)
  - Mileage (km driven)
  - Expected price
  - Location
  - Contact number
  - Vehicle description

### 2. **Battery Diagnostic Certification**
Each listed vehicle undergoes a comprehensive diagnostic test that includes:

#### Battery Health Assessment
- **State of Health (SOH) Analysis**: Determines the current capacity vs. original capacity
- **Remaining Capacity Testing**: Measures actual usable battery capacity
- **Cell Balance Verification**: Ensures all battery cells are functioning uniformly
- **Thermal Management Check**: Validates battery cooling/heating systems

#### Vehicle Condition Report
- **Mechanical Inspection**: Brakes, suspension, motors, drivetrain
- **Electronics & Software Check**: All electronic systems and software updates
- **Body & Paint Condition**: Exterior and interior condition assessment
- **Document Verification**: RC, insurance, service history validation

### 3. **Diagnostic Scoring System**
Vehicles are rated on a 10-point scale based on:
- Battery health percentage (0-100%)
- Overall vehicle condition
- Maintenance history
- Age and mileage

**Condition Categories:**
- **Excellent**: 95%+ battery health, minimal wear
- **Good**: 85-94% battery health, normal wear
- **Fair**: 75-84% battery health, moderate wear
- **Needs Attention**: <75% battery health, requires maintenance

### 4. **Marketplace Listings**
Each vehicle listing displays:
- High-quality images
- Price in lakhs (₹)
- Battery health percentage with color coding
- Diagnostic score out of 10
- Vehicle condition badge
- Key specifications (mileage, location)
- EVChamp certification badge

### 5. **Razorpay Integration**
Buyers can book vehicle inspections by paying ₹500 through Razorpay:
- Secure payment gateway integration
- Instant payment confirmation
- Booking confirmation email/SMS
- Includes:
  - Comprehensive battery diagnostic test
  - Complete vehicle condition report
  - Test drive opportunity

## Technical Implementation

### Component Structure
```
SellEV.tsx
├── Hero Section
├── How It Works (3-step process)
├── Listing Form Modal
├── Vehicle Inspection Modal
├── Marketplace Grid
├── Diagnostic Certificate Info
└── CTA Section
```

### State Management
- `showListingForm`: Controls listing form modal visibility
- `selectedVehicle`: Stores vehicle selected for inspection
- `formData`: Manages form input data

### Razorpay Integration
```typescript
const initRazorpayPayment = (vehicle: Vehicle) => {
  const options = {
    key: 'YOUR_RAZORPAY_KEY',
    amount: 50000, // ₹500 in paise
    currency: 'INR',
    name: 'EVChamp',
    description: `Inspection Fee for ${vehicle.vehicleModel}`,
    handler: function (response: any) {
      // Payment success handler
    }
  };
  const razorpay = new window.Razorpay(options);
  razorpay.open();
};
```

## User Flow

### Selling Flow
1. User clicks "List Your EV" button
2. Fills out vehicle details form
3. Submits listing
4. EVChamp team contacts within 24 hours
5. Diagnostic test scheduled (2-3 days)
6. Vehicle certified and listed on marketplace
7. Buyers can book inspections
8. Sale completed with EVChamp facilitation

### Buying Flow
1. Browse certified pre-owned EVs
2. View detailed vehicle information and diagnostic scores
3. Click "Book Test Drive & Inspection"
4. Pay ₹500 inspection fee via Razorpay
5. Schedule convenient inspection time
6. Test drive and review diagnostic reports
7. Complete purchase if satisfied

## Color Coding System

### Battery Health
- **Green** (95%+): Excellent condition
- **Yellow** (85-94%): Good condition
- **Orange** (<85%): Fair/Needs attention

### Condition Badges
- **Excellent**: Green background
- **Good**: Blue background
- **Fair**: Yellow background
- **Needs Attention**: Orange background

## API Endpoints (To Be Implemented)

### Backend Requirements
```
POST /api/vehicles/list - Submit new vehicle listing
GET /api/vehicles - Fetch all marketplace vehicles
GET /api/vehicles/:id - Get specific vehicle details
POST /api/bookings/inspection - Book vehicle inspection
POST /api/payments/verify - Verify Razorpay payment
PUT /api/vehicles/:id/diagnostic - Update diagnostic data
```

## Setup Instructions

### 1. Razorpay Configuration
1. Sign up at [Razorpay Dashboard](https://dashboard.razorpay.com/)
2. Get your API keys (Key ID and Key Secret)
3. Replace `YOUR_RAZORPAY_KEY` in SellEV.tsx with your actual key
4. Configure webhooks for payment verification

### 2. Environment Variables
Create a `.env` file:
```
REACT_APP_RAZORPAY_KEY=your_razorpay_key_id
REACT_APP_API_URL=your_backend_api_url
```

### 3. Backend Integration
Connect to your backend API for:
- Vehicle listing storage
- Diagnostic data management
- User authentication
- Payment verification
- Booking management

## Future Enhancements

1. **Image Upload**: Allow sellers to upload actual vehicle photos
2. **Chat System**: Enable direct buyer-seller communication
3. **EMI Calculator**: Help buyers calculate financing options
4. **Trade-in Options**: Allow users to trade old vehicles
5. **Warranty Programs**: Offer extended warranties on certified vehicles
6. **Home Inspection**: Schedule at-home vehicle inspection service
7. **Document Upload**: Digital document submission and verification
8. **Price Analytics**: AI-powered price recommendation for sellers
9. **Comparative Analysis**: Compare multiple vehicles side-by-side
10. **Video Inspection**: Virtual vehicle tours and inspections

## Security Considerations

1. **User Authentication**: Require Clerk authentication for listings
2. **Payment Security**: All payments through Razorpay's secure gateway
3. **Data Validation**: Server-side validation of all form inputs
4. **Fraud Prevention**: Verify seller identity and vehicle ownership
5. **Privacy Protection**: Encrypt sensitive personal information

## Marketing & Growth

1. **SEO Optimization**: Optimize listings for search engines
2. **Social Sharing**: Enable easy sharing of listings
3. **Referral Program**: Incentivize user referrals
4. **Partner Network**: Collaborate with EV dealerships
5. **Content Marketing**: Educational content about EV battery health

## Support & Documentation

- **User Guide**: Step-by-step guide for sellers and buyers
- **FAQ Section**: Common questions and answers
- **Help Center**: Video tutorials and documentation
- **Customer Support**: Phone, email, and chat support

## Metrics & Analytics

Track key metrics:
- Number of listings
- Conversion rate (listing to sale)
- Average time to sell
- Average diagnostic scores
- User engagement rates
- Payment success rates
- Customer satisfaction scores

---

## Contact for Support
For technical support or questions about the Sell EV marketplace, contact the EVChamp development team.
