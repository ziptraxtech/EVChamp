import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth, useUser } from '@clerk/clerk-react';
import { getPaymentBreakdown } from '../utils/gstCalculator';

// Maps this page's URL plan param to a src/config/creditPlans.ts catalog ID.
// Only plans that actually exist in the (currently EVChamp-only) catalog are
// listed — 'custom' has no catalog entry yet and isn't purchasable here.
const CATALOG_PLAN_ID: { [key: string]: string } = {
  trial: 'zeflash-trial',
  starter: 'zeflash-starter',
  value: 'zeflash-value',
  smart: 'zeflash-smart',
};

// Coupon codes configuration
const AVAILABLE_COUPONS: { [key: string]: { type: 'flat' | 'percentage'; value: number; description: string } } = {
  'EVCODERS': {
    type: 'flat',
    value: 999999,
    description: 'Special offer - Pay only ₹1',
  },
  'OFFSEASON': {
    type: 'percentage',
    value: 20,
    description: '20% discount on final amount',
  },
};

function loadRazorpayScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if ((window as any).Razorpay) { resolve(); return; }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Razorpay'));
    document.body.appendChild(script);
  });
}

const ZeVaultCheckout: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { getToken } = useAuth();
  const { isSignedIn, user } = useUser();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [planDetails, setPlanDetails] = useState<any>(null);
  const [paymentBreakdown, setPaymentBreakdown] = useState<any>(null);
  const [paid, setPaid] = useState(false);
  const [fulfillmentNote, setFulfillmentNote] = useState<string | null>(null);
  const [issuedCouponCode, setIssuedCouponCode] = useState<string | null>(null);
  const [couponCopied, setCouponCopied] = useState(false);
  
  // Coupon state
  const [couponInput, setCouponInput] = useState('');
  const [couponApplied, setCouponApplied] = useState<any>(null);
  const [couponError, setCouponError] = useState<string | null>(null);

  // Extract params
  const plan = searchParams.get('plan');
  const tests = parseInt(searchParams.get('tests') || '0');
  const months = parseInt(searchParams.get('months') || '0');
  const price = parseInt(searchParams.get('price') || '0');

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, []);

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
    setPaymentBreakdown(getPaymentBreakdown(price));
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

  const handleValidateCoupon = async () => {
    if (!couponInput.trim()) {
      setCouponError('Please enter a coupon code');
      return;
    }

    const couponCode = couponInput.toUpperCase().trim();
    const coupon = AVAILABLE_COUPONS[couponCode];

    if (!coupon) {
      setCouponError('Invalid coupon code. Available codes: EVCODERS, OFFSEASON');
      return;
    }

    // Calculate discount
    let discountAmount = 0;
    let finalAmount = planDetails.price;

    if (coupon.type === 'flat') {
      discountAmount = Math.min(coupon.value, planDetails.price - 1);
      finalAmount = Math.max(1, planDetails.price - discountAmount);
    } else if (coupon.type === 'percentage') {
      discountAmount = Math.round((planDetails.price * coupon.value) / 100);
      finalAmount = Math.max(1, planDetails.price - discountAmount);
    }

    setCouponApplied({
      couponCode: couponCode,
      discountType: coupon.type,
      discountValue: coupon.value,
      discountAmount: discountAmount,
      originalAmount: planDetails.price,
      finalAmount: finalAmount,
      description: coupon.description,
    });
    setCouponInput('');
    setCouponError(null);
  };

  const handleRemoveCoupon = () => {
    setCouponApplied(null);
    setCouponInput('');
    setCouponError(null);
  };

  const handlePayment = async () => {
    if (!planDetails || !paymentBreakdown || !user?.primaryEmailAddress?.emailAddress) {
      setError('Unable to process payment. Missing required information.');
      return;
    }
    const catalogPlanId = CATALOG_PLAN_ID[planDetails.plan];
    if (!catalogPlanId) {
      setError('This plan is not available for purchase yet.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await loadRazorpayScript();

      const token = await getToken();
      const orderRes = await fetch('/api/create-credit-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ 
          planId: catalogPlanId,
          couponCode: couponApplied?.couponCode || null,
        }),
      });
      if (!orderRes.ok) {
        const errBody = await orderRes.json().catch(() => ({}));
        throw new Error(errBody.detail || errBody.error || 'Could not start checkout');
      }
      const order = await orderRes.json();

      const rzp = new (window as any).Razorpay({
        key: order.keyId,
        amount: order.amount,
        currency: order.currency,
        order_id: order.orderId,
        name: 'EVChamp — ZeVault',
        description: planDetails.description,
        prefill: {
          name: (user.firstName || '') + (user.lastName ? ` ${user.lastName}` : ''),
          email: user.primaryEmailAddress.emailAddress,
        },
        theme: { color: '#06b6d4' },
        handler: async (response: {
          razorpay_order_id: string;
          razorpay_payment_id: string;
          razorpay_signature: string;
        }) => {
          // Webhook remains the durable source of truth, but confirm here so
          // local/dev (and clients whose tab stays open) get coupon email /
          // Zeflash credits immediately without waiting for the cron.
          try {
            // Refresh the Clerk token — checkout can outlive the short-lived JWT
            // fetched before Razorpay opened, which caused confirm to 401 and
            // left the success screen without a coupon code.
            const confirmToken = (await getToken()) || token;
            const confirmRes = await fetch('/api/confirm-credit-payment', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${confirmToken}` },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });
            const confirmBody = await confirmRes.json().catch(() => ({}));
            if (!confirmRes.ok) {
              console.error('confirm-credit-payment rejected:', confirmRes.status, confirmBody);
              setFulfillmentNote('Payment captured. Credits/coupon will arrive shortly — check your email or open Zeflash in a few minutes.');
            } else if (confirmBody?.couponCode) {
              setIssuedCouponCode(String(confirmBody.couponCode));
              setFulfillmentNote('Save this code and enter it in Zeflash to run your free AI diagnostic. A copy was also emailed to your account email.');
            } else if (confirmBody?.zeflash === 'coupon_emailed') {
              setFulfillmentNote('A one-time Zeflash coupon was emailed to your account email. Enter it in Zeflash to run your free AI diagnostic.');
            } else if (confirmBody?.zeflash === 'credited') {
              setFulfillmentNote('Your Zeflash diagnostic credit is ready — open Zeflash while signed in to use it.');
            } else if (confirmBody?.zeflash === 'failed') {
              setFulfillmentNote('Payment captured. Credit delivery is still processing — check your email shortly, or open Zeflash in a few minutes.');
            } else {
              setFulfillmentNote('Payment captured. If this plan includes Zeflash diagnostics, check your email for a coupon or open Zeflash to see new credits.');
            }
          } catch (confirmErr) {
            console.error('confirm-credit-payment failed (webhook may still deliver):', confirmErr);
            setFulfillmentNote('Payment captured. Credits/coupon will arrive shortly once payment is confirmed.');
          } finally {
            setLoading(false);
            setPaid(true);
          }
        },
        modal: { ondismiss: () => setLoading(false) },
      });
      rzp.on('payment.failed', () => {
        setError('Payment failed. Please try again.');
        setLoading(false);
      });
      rzp.open();
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

  if (paid) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center px-4">
        <div className="max-w-md w-full rounded-2xl border border-emerald-500/30 bg-emerald-950/20 backdrop-blur-xl p-8 text-center">
          <div className="w-14 h-14 bg-emerald-500/15 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-emerald-400">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Payment received</h2>
          <p className="text-sm text-slate-300 mb-1">
            Your <span className="font-semibold text-white">{planDetails.planName}</span> purchase is confirmed.
          </p>
          {issuedCouponCode && (
            <div className="mt-4 mb-4 rounded-xl border border-cyan-500/30 bg-slate-950/60 px-4 py-4">
              <p className="text-xs uppercase tracking-wide text-cyan-300/80 mb-2">Your Zeflash coupon</p>
              <p className="font-mono text-2xl font-bold tracking-widest text-white break-all">{issuedCouponCode}</p>
              <button
                type="button"
                onClick={async () => {
                  try {
                    await navigator.clipboard.writeText(issuedCouponCode);
                    setCouponCopied(true);
                    window.setTimeout(() => setCouponCopied(false), 2000);
                  } catch {
                    setCouponCopied(false);
                  }
                }}
                className="mt-3 inline-flex items-center justify-center rounded-lg border border-cyan-500/40 px-3 py-1.5 text-xs font-semibold text-cyan-200 hover:bg-cyan-500/10"
              >
                {couponCopied ? 'Copied' : 'Copy code'}
              </button>
            </div>
          )}
          <p className="text-xs text-slate-400 mb-6">
            {fulfillmentNote || 'Your purchase is confirmed. Zeflash credits or a coupon email will arrive shortly.'}
          </p>
          <div className="space-y-3">
            <button
              onClick={() => navigate('/zevault')}
              className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md hover:from-cyan-600 hover:to-blue-700"
            >
              Back to ZeVault
            </button>
            <p className="text-xs text-slate-400 text-center">
              Your wallet balance will be updated on the ZeVault page
            </p>
          </div>
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
                <span className="text-white font-semibold">₹{(couponApplied?.originalAmount || planDetails.price).toLocaleString('en-IN')}</span>
              </div>

              {/* Coupon Discount */}
              {couponApplied && (
                <div className="flex items-center justify-between text-sm bg-green-500/10 rounded-lg px-3 py-2 border border-green-500/30">
                  <span className="text-green-400 font-semibold">
                    {couponApplied.discountType === 'flat' 
                      ? `Discount (${couponApplied.couponCode})`
                      : `Discount ${couponApplied.discountValue}% (${couponApplied.couponCode})`
                    }
                  </span>
                  <span className="text-green-300 font-bold">-₹{couponApplied.discountAmount.toLocaleString('en-IN')}</span>
                </div>
              )}

              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400">
                  {couponApplied ? 'Subtotal after discount' : 'Subtotal'}
                </span>
                <span className="text-white font-semibold">₹{(couponApplied?.finalAmount || planDetails.price).toLocaleString('en-IN')}</span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400">GST (18%)</span>
                <span className="text-white font-semibold">₹{((couponApplied?.finalAmount || planDetails.price) * 0.18 % 1 === 0 
                  ? Math.floor((couponApplied?.finalAmount || planDetails.price) * 0.18).toLocaleString('en-IN') 
                  : ((couponApplied?.finalAmount || planDetails.price) * 0.18).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }))}</span>
              </div>

              <div className="border-t border-slate-700 pt-3 flex items-center justify-between">
                <span className="font-semibold text-slate-100">Total Amount</span>
                <span className="text-2xl font-bold text-yellow-300">
                  ₹{Math.round((couponApplied?.finalAmount || planDetails.price) * 1.18).toLocaleString('en-IN')}
                </span>
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

            {/* Coupon Section */}
            <div className="rounded-xl border border-cyan-500/30 bg-cyan-950/20 p-4 mb-6">
              <p className="text-xs font-semibold text-cyan-300 uppercase tracking-wider mb-3">
                Have a coupon code? Enter it below
              </p>
              
              {couponApplied ? (
                <div className="rounded-lg border border-green-500/40 bg-green-500/10 p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="text-xs text-green-300/70 mb-1">Coupon Applied ✓</p>
                      <p className="text-lg font-bold text-green-300">{couponApplied.couponCode}</p>
                      <p className="text-xs text-green-300/60 mt-1">{couponApplied.description}</p>
                    </div>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-green-400">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                      <polyline points="22 4 12 14.01 9 11.01" />
                    </svg>
                  </div>
                  <button
                    type="button"
                    onClick={handleRemoveCoupon}
                    className="text-xs text-green-300/60 hover:text-green-300 underline"
                  >
                    Remove coupon
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={couponInput}
                      onChange={(e) => {
                        setCouponInput(e.target.value.toUpperCase());
                        setCouponError(null);
                      }}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          handleValidateCoupon();
                        }
                      }}
                      placeholder="Enter coupon code"
                      className="flex-1 px-3 py-2 rounded-lg border border-slate-600 bg-slate-900/50 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/50"
                    />
                    <button
                      onClick={handleValidateCoupon}
                      disabled={!couponInput.trim()}
                      className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-700 disabled:bg-slate-700 disabled:cursor-not-allowed text-white text-sm font-semibold transition-all"
                    >
                      Apply
                    </button>
                  </div>
                  {couponError && (
                    <p className="text-xs text-red-400">{couponError}</p>
                  )}
                  <p className="text-xs text-slate-400">Try: OFFSEASON (20% off)</p>
                </div>
              )}
            </div>

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
              <span>{loading ? 'Processing...' : `Pay ₹${Math.round((couponApplied?.finalAmount || planDetails.price) * 1.18).toLocaleString('en-IN')}`}</span>
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
