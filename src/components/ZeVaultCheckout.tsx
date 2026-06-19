import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth, useUser } from '@clerk/clerk-react';
import razorpayServiceInstance from '../services/razorpayService';

const ZeVaultCheckout: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { getToken } = useAuth();
  const { isSignedIn, user } = useUser();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [planDetails, setPlanDetails] = useState<any>(null);

  // Extract params
  const plan = searchParams.get('plan');
  const tests = parseInt(searchParams.get('tests') || '0');
  const months = parseInt(searchParams.get('months') || '0');
  const price = parseInt(searchParams.get('price') || '0');

  useEffect(() => {
    // Redirect to sign-in if not authenticated
    if (!isSignedIn) {
      navigate('/sign-in', { replace: true });
      return;
    }

    // Parse and validate plan details
    if (!plan || !tests || !price) {
      setError('Invalid plan parameters. Please select a plan from ZeVault.');
      return;
    }

    const planData = {
      plan,
      tests,
      months,
      price,
      planName: getPlanName(plan),
      description: getPlanDescription(plan, tests, months),
    };

    setPlanDetails(planData);
  }, [isSignedIn, plan, tests, months, price, navigate]);

  const getPlanName = (planId: string) => {
    const names: { [key: string]: string } = {
      trial: 'One Time Trial',
      starter: 'Starter Pack',
      value: 'Value Pack',
      custom: 'Custom Plan',
    };
    return names[planId] || 'ZeVault Plan';
  };

  const getPlanDescription = (planId: string, testCount: number, monthCount: number) => {
    if (planId === 'custom') {
      return `${testCount} tests • ${monthCount} months validity`;
    }
    return `${testCount} battery diagnostic tests`;
  };

  const handlePayment = async () => {
    if (!planDetails || !user?.primaryEmailAddress?.emailAddress) {
      setError('Unable to process payment. Missing required information.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log('🚀 Starting ZeVault payment process...');
      console.log('📋 Order Summary:', {
        planName: planDetails.planName,
        tests: planDetails.tests,
        months: planDetails.months,
        priceInRupees: planDetails.price,
        priceInPaise: planDetails.price * 100,
        description: planDetails.description,
        user: user.primaryEmailAddress.emailAddress,
      });

      // Initialize Razorpay payment
      await razorpayServiceInstance.initializePayment(
        planDetails.price, // Amount in INR
        planDetails.planName,
        planDetails.description,
        user.primaryEmailAddress.emailAddress,
        user.firstName + (user.lastName ? ' ' + user.lastName : '')
      );

      console.log('✅ ZeVault payment modal opened');
    } catch (err: any) {
      console.error('❌ ZeVault payment error:', err);
      setError(err.message || 'Failed to initialize payment. Please try again.');
      setLoading(false);
    }
  };

  if (!isSignedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-300">Redirecting to sign in...</p>
        </div>
      </div>
    );
  }

  if (!planDetails) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center px-4">
        <div className="max-w-md w-full rounded-2xl border border-red-500/30 bg-red-950/20 backdrop-blur-xl p-6 text-center">
          <div className="text-red-400 mb-3">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mx-auto">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>
          <h2 className="text-lg font-semibold text-red-300 mb-2">Invalid Plan</h2>
          <p className="text-sm text-red-100/70 mb-4">
            {error || 'The plan details are missing or invalid.'}
          </p>
          <button
            onClick={() => navigate('/zevault')}
            className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-red-600 text-white font-semibold px-4 py-2.5 hover:bg-red-700 transition-all"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            Go Back to ZeVault
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-50">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur sticky top-0 z-40">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate('/zevault')}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-700 px-3 py-1.5 text-xs font-medium text-slate-200 hover:bg-slate-800"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            Back
          </button>
          <h1 className="text-lg font-semibold text-white">Checkout</h1>
          <div className="w-12" />
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Order Summary */}
          <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-6">
            <h2 className="text-lg font-semibold text-white mb-6">Order Summary</h2>

            {/* Plan Details */}
            <div className="rounded-xl border border-slate-700 bg-slate-900/50 p-4 mb-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-1">
                    ZeVault Plan
                  </p>
                  <h3 className="text-xl font-bold text-white">
                    {planDetails.planName}
                  </h3>
                </div>
              </div>

              <div className="space-y-2 text-sm text-slate-300 mb-4">
                <div className="flex items-center justify-between">
                  <span>Battery Tests:</span>
                  <span className="font-semibold text-yellow-300">{planDetails.tests}</span>
                </div>
                {planDetails.months > 0 && (
                  <div className="flex items-center justify-between">
                    <span>Validity:</span>
                    <span className="font-semibold text-yellow-300">{planDetails.months} months</span>
                  </div>
                )}
              </div>

              <div className="border-t border-slate-700 pt-4">
                <p className="text-xs text-slate-400 mb-2">Price per test:</p>
                <p className="text-sm text-slate-200">
                  ₹{(planDetails.price / planDetails.tests).toFixed(0)}/test
                </p>
              </div>
            </div>

            {/* Price Breakdown */}
            <div className="rounded-xl border border-slate-700 bg-slate-900/50 p-4 space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400">Subtotal</span>
                <span className="text-white font-semibold">₹{planDetails.price.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400">Processing Fee</span>
                <span className="text-white font-semibold">₹0</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400">Taxes (GST)</span>
                <span className="text-white font-semibold">Included</span>
              </div>

              <div className="border-t border-slate-700 pt-3 flex items-center justify-between">
                <span className="font-semibold text-slate-100">Total Amount</span>
                <span className="text-2xl font-bold text-yellow-300">
                  ₹{planDetails.price.toLocaleString('en-IN')}
                </span>
              </div>
              
              <div className="border-t border-slate-700 pt-3">
                <p className="text-xs text-slate-500">Amount in Paise: <span className="text-slate-300 font-mono">{(planDetails.price * 100).toLocaleString('en-IN')}</span></p>
              </div>
            </div>

            {/* Benefits */}
            <div className="mt-6 rounded-xl border border-slate-700 bg-slate-900/30 p-4">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                What You Get
              </p>
              <ul className="space-y-2">
                <li className="flex items-start gap-2 text-sm text-slate-300">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-green-400 mt-0.5 flex-shrink-0">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                  <span>{planDetails.tests} AI-powered battery diagnostics</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-slate-300">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-green-400 mt-0.5 flex-shrink-0">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                  <span>Instant health reports & insights</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-slate-300">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-green-400 mt-0.5 flex-shrink-0">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                  <span>Priority support & scheduling</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Payment Section */}
          <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-6 h-fit sticky top-24">
            <h2 className="text-lg font-semibold text-white mb-6">Payment Details</h2>

            {/* User Info */}
            <div className="rounded-xl border border-slate-700 bg-slate-900/50 p-4 mb-6">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                Billing To
              </p>
              <div className="space-y-2">
                <div>
                  <p className="text-xs text-slate-500">Name</p>
                  <p className="text-sm font-semibold text-white">
                    {user?.firstName} {user?.lastName}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Email</p>
                  <p className="text-sm font-semibold text-white">
                    {user?.primaryEmailAddress?.emailAddress}
                  </p>
                </div>
              </div>
            </div>

            {/* Payment Method Info */}
            <div className="rounded-xl border border-slate-700 bg-slate-900/50 p-4 mb-6">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                Payment Method
              </p>
              <div className="flex items-center gap-2">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-orange-400">
                  <path d="M2 8a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2z" />
                  <line x1="2" y1="12" x2="22" y2="12" />
                </svg>
                <div>
                  <p className="text-sm font-semibold text-white">Razorpay</p>
                  <p className="text-xs text-slate-400">Secure Payment Gateway</p>
                </div>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="rounded-xl border border-red-500/30 bg-red-950/20 p-3 mb-6">
                <p className="text-sm text-red-300">{error}</p>
              </div>
            )}

            {/* Terms & Conditions */}
            <div className="rounded-xl border border-slate-700 bg-slate-900/30 p-3 mb-6">
              <p className="text-xs text-slate-400 leading-relaxed">
                By proceeding with payment, you agree to our{' '}
                <a href="/terms" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:text-cyan-300">
                  Terms of Service
                </a>
                {' '}and{' '}
                <a href="/privacy" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:text-cyan-300">
                  Privacy Policy
                </a>
                . Your payment is secured by Razorpay.
              </p>
            </div>

            {/* Pay Button */}
            <button
              onClick={handlePayment}
              disabled={loading}
              className={`w-full py-3 px-4 rounded-lg font-semibold text-white flex items-center justify-center gap-2 transition-all ${
                loading
                  ? 'bg-slate-700 cursor-not-allowed opacity-50'
                  : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 shadow-lg shadow-cyan-500/40'
              }`}
            >
              {loading && (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="animate-spin">
                  <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                </svg>
              )}
              <span>{loading ? 'Processing...' : `Pay ₹${planDetails.price.toLocaleString('en-IN')}`}</span>
            </button>

            {/* Help Text */}
            <p className="text-xs text-slate-400 text-center mt-4">
              🔒 Your payment is 100% secure. Powered by Razorpay
            </p>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-12 rounded-2xl border border-slate-800 bg-slate-950/70 p-6">
          <h3 className="text-lg font-semibold text-white mb-6">Frequently Asked Questions</h3>
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-semibold text-white mb-2">How long is my plan valid?</h4>
              <p className="text-sm text-slate-300">
                {planDetails.months > 0
                  ? `Your plan is valid for ${planDetails.months} months from the date of purchase.`
                  : 'Your one-time trial is valid for immediate use.'}
              </p>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white mb-2">Can I upgrade or downgrade?</h4>
              <p className="text-sm text-slate-300">
                Yes! You can upgrade to a higher plan anytime. Contact our support team for downgrade options.
              </p>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white mb-2">Is there a refund policy?</h4>
              <p className="text-sm text-slate-300">
                Yes, we offer a 7-day money-back guarantee if you're not satisfied. Check our{' '}
                <a href="/refund" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:text-cyan-300">
                  refund policy
                </a>{' '}
                for details.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ZeVaultCheckout;
