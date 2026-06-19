declare global {
  interface Window {
    Razorpay: any;
  }
}

export interface PaymentOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id?: string;
  prefill: {
    name?: string;
    email?: string;
    contact?: string;
  };
  notes: {
    address: string;
  };
  theme: {
    color: string;
  };
  callback_url?: string;
  readonly?: {
    amount: boolean;
  };
}

export interface OrderDetails {
  id: string;
  amount: number;
  currency: string;
  receipt: string;
  status: string;
}

class RazorpayService {
  private keyId: string;

  constructor() {
    // ⚠️ SECURITY: Only use KEY_ID in frontend
    // Never expose KEY_SECRET in frontend code, logs, or error messages
    this.keyId = process.env.REACT_APP_RAZORPAY_KEY_ID || process.env.VITE_RAZORPAY_KEY_ID || '';
    
    // Debug: Log that service is initializing (without exposing full key)
    if (this.keyId) {
      console.log(
        '%c✓ RazorpayService initialized with KEY_ID',
        'color: #00cc00; font-weight: bold;'
      );
    } else {
      console.error(
        '%c❌ RazorpayService: KEY_ID not found in environment variables',
        'color: #ff0000; font-weight: bold;'
      );
    }
    
    // Log warning if secret is accidentally configured in frontend
    if (process.env.REACT_APP_RAZORPAY_KEY_SECRET || process.env.RAZORPAY_KEY_SECRET) {
      console.warn(
        '%c⚠️  SECURITY WARNING: Razorpay KEY_SECRET found in frontend environment!',
        'color: #ff9900; font-weight: bold; font-size: 14px;'
      );
      console.warn(
        '%cREAZON: KEY_SECRET must ONLY exist on backend server for payment verification.',
        'color: #ff9900;'
      );
      console.warn(
        '%cACTION: Remove RAZORPAY_KEY_SECRET from .env.local and frontend .env files immediately!',
        'color: #ff0000; font-weight: bold;'
      );
    }
  }

  // Initialize Razorpay script
  loadScript(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (window.Razorpay) {
        console.log('✓ Razorpay already loaded in window');
        resolve();
        return;
      }

      console.log('📝 Creating script tag for Razorpay...');
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      
      script.onload = () => {
        console.log('✓ Razorpay script loaded successfully');
        resolve();
      };
      
      script.onerror = () => {
        console.error('❌ Failed to load Razorpay script from CDN');
        reject(new Error('Failed to load Razorpay script. Please check your internet connection.'));
      };
      
      document.body.appendChild(script);
    });
  }

  // Create order on your backend (you'll need to implement this)
  async createOrder(amount: number, currency: string = 'INR'): Promise<OrderDetails> {
    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
      console.log(`📡 Making API call to: ${apiUrl}/create-order`);
      
      const response = await fetch(`${apiUrl}/create-order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: amount * 100, // Convert to paise
          currency,
        }),
      });

      console.log(`📊 API Response Status: ${response.status}`);

      if (!response.ok) {
        console.warn(`⚠️  API returned ${response.status}. Using demo mode (no order_id).`);
        // Fall through to demo mode
      } else {
        const orderData = await response.json();
        console.log('✓ Order created successfully:', orderData);
        return orderData;
      }
    } catch (error) {
      console.warn('⚠️  Error creating order:', error);
      console.log('📌 Falling back to demo mode (payment will work without order_id)');
    }
    
    // For demo purposes, create a mock order (no order_id)
    // This allows payment modal to open even without backend
    const mockOrder = {
      id: '',
      amount: amount * 100,
      currency,
      receipt: `receipt_${Date.now()}`,
      status: 'created',
    };
    console.log('📌 Using demo order:', mockOrder);
    return mockOrder;
  }

  // Initialize payment
  async initializePayment(
    amount: number,
    name: string,
    description: string,
    userEmail?: string,
    userName?: string
  ): Promise<void> {
    try {
      // Verify key is loaded
      console.log('%c🔧 Razorpay Initialization Started', 'color: #ff6b00; font-weight: bold;');
      console.log('Razorpay Key ID:', this.keyId ? '✓ Loaded' : '✗ NOT LOADED');
      console.log('💰 Payment Amount Details:', {
        amountInRupees: amount,
        amountInPaise: amount * 100,
        currency: 'INR'
      });
      console.log('Environment:', {
        isDev: process.env.NODE_ENV === 'development',
        hasKeyId: !!this.keyId,
        keyIdLength: this.keyId?.length || 0,
      });
      
      if (!this.keyId) {
        console.error('❌ Razorpay Key ID missing');
        const errorMsg = `
🔴 RAZORPAY KEY NOT CONFIGURED

Your payment cannot be processed because the Razorpay Key ID is missing.

⚠️ REQUIRED SETUP STEPS:
1. Get your Razorpay credentials from: https://dashboard.razorpay.com/app/settings/api-keys
2. Add to .env.local file:
   REACT_APP_RAZORPAY_KEY_ID=your_key_id_here
3. IMPORTANT: After updating .env.local, RESTART your development server
   Kill current server: Ctrl+C
   Then run: npm start
4. Wait for server to fully restart (check terminal for "Compiled successfully")
5. Refresh browser page

📖 For detailed setup guide, see: RAZORPAY_SETUP_GUIDE.md
⚡ Quick test: Open DevTools Console and run:
   console.log(process.env.REACT_APP_RAZORPAY_KEY_ID)
        `.trim();
        console.error(errorMsg);
        alert(errorMsg);
        throw new Error(errorMsg);
      }

      console.log('📥 Loading Razorpay script...');
      await this.loadScript();
      console.log('✓ Razorpay script loaded');

      console.log('📦 Creating order for amount:', amount);
      const order = await this.createOrder(amount);
      console.log('✓ Order created:', order);

      const options: PaymentOptions = {
        key: this.keyId,
        amount: order.amount,
        currency: order.currency,
        name: 'EVChamp',
        description,
        ...(order.id ? { order_id: order.id } : {}),
        prefill: {
          name: userName,
          email: userEmail,
        },
        notes: {
          address: 'EVChamp Office, India',
        },
        theme: {
          color: '#10B981', // Green color matching your theme
        },
        callback_url: process.env.REACT_APP_RAZORPAY_CALLBACK_URL || 'https://razorpay.me/@zipsureai',
        readonly: {
          amount: true
        }
      };

      console.log('🎯 Payment options (sanitized):', {
        key: options.key ? '✓ Present' : '✗ Missing',
        amount: options.amount,
        amountInRupees: options.amount / 100,
        currency: options.currency,
        description: options.description,
        orderIdPresent: !!options.order_id,
      });

      if (!window.Razorpay) {
        throw new Error('Razorpay script loaded but window.Razorpay is not available. This might be a CDN loading issue.');
      }

      console.log('✓ Creating Razorpay instance...');
      const razorpay = new window.Razorpay(options);
      console.log('✓ Razorpay instance created successfully');

      razorpay.on('payment.success', (response: any) => {
        console.log('%c✅ Payment successful:', 'color: #00cc00; font-weight: bold;', response);
        this.handlePaymentSuccess(response, order);
      });

      razorpay.on('payment.failed', (response: any) => {
        console.error('%c❌ Payment failed:', 'color: #ff0000; font-weight: bold;', response);
        this.handlePaymentFailure(response);
      });

      razorpay.on('payment.error', (error: any) => {
        console.error('%c⚠️ Payment error event:', 'color: #ff9900; font-weight: bold;', error);
      });

      console.log('%c🔓 Opening Razorpay modal...', 'color: #0066ff; font-weight: bold;');
      razorpay.open();
      console.log('✓ Razorpay modal opened successfully');
    } catch (error) {
      console.error('%c❌ Error initializing payment:', 'color: #ff0000; font-weight: bold;', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      console.error('Full error details:', {
        name: error instanceof Error ? error.name : 'Unknown',
        message: errorMessage,
        stack: error instanceof Error ? error.stack : 'No stack trace',
      });
      alert(`Failed to initialize payment: ${errorMessage}\n\nPlease check your internet connection and try again.`);
      throw error; // Re-throw for component to handle
    }
  }

  // Handle successful payment
  private handlePaymentSuccess(response: any, order: OrderDetails): void {
    // You can implement your success logic here
    // For example, redirect to success page, update database, etc.
    console.log('Payment successful:', response);
    
    // Redirect to success page with payment details
    const params = new URLSearchParams({
      razorpay_payment_id: response.razorpay_payment_id,
      razorpay_order_id: response.razorpay_order_id,
      razorpay_signature: response.razorpay_signature,
    });
    
    window.location.href = `/payment-success?${params.toString()}`;
  }

  // Handle failed payment
  private handlePaymentFailure(response: any): void {
    alert('Payment failed. Please try again.');
  }

  // Verify payment signature (implement on backend)
  async verifyPayment(paymentId: string, orderId: string, signature: string): Promise<boolean> {
    try {
      const response = await fetch('/api/verify-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          paymentId,
          orderId,
          signature,
        }),
      });

      if (!response.ok) {
        return false;
      }

      const result = await response.json();
      return result.verified;
    } catch (error) {
      console.error('Error verifying payment:', error);
      return false;
    }
  }
}

const razorpayServiceInstance = new RazorpayService();
export default razorpayServiceInstance;
