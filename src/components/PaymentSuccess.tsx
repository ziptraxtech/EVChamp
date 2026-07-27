import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useUser, useAuth } from '@clerk/clerk-react';
import autopayManager from '../utils/autopayManager';

const PaymentSuccess: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useUser();
  const { getToken } = useAuth();
  const [autopayStatus, setAutopayStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [autopayError, setAutopayError] = useState<string | null>(null);
  
  const paymentId = searchParams.get('razorpay_payment_id');
  const orderId = searchParams.get('razorpay_order_id');

  // Setup autopay after payment success
  useEffect(() => {
    const setupAutopay = async () => {
      try {
        // Get auth token from Clerk
        const token = await getToken();
        if (!token) {
          console.log('⚠️ Clerk token not available, skipping autopay setup');
          return;
        }

        // Set the token in autopayManager
        autopayManager.setAuthToken(token);

        // Get pending autopay setup from session storage
        const pendingSetup = sessionStorage.getItem('pendingAutopaySetup');
        if (!pendingSetup || !user?.id) {
          return;
        }

        const setupData = JSON.parse(pendingSetup);
        setAutopayStatus('loading');

        // Record coupon usage AFTER payment success
        if (setupData.coupon) {
          try {
            await fetch('/api/coupons/record-usage', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({
                userId: user.id,
                planId: setupData.planId,
                couponCode: setupData.coupon.code,
                discountAmount: setupData.coupon.discountAmount,
                originalPrice: setupData.coupon.originalPrice,
                finalPrice: setupData.coupon.finalPrice,
              }),
            });
            console.log('✅ Coupon usage recorded for user:', user.id);
          } catch (err) {
            console.warn('⚠️ Could not record coupon usage:', err);
            // Don't fail the whole process if coupon recording fails
          }
        }

        // Create autopay subscription
        const result = await autopayManager.createAutopaySubscription(
          user.id,
          setupData.planId,
          setupData.planName,
          setupData.planDetails
        );

        if (result.success) {
          console.log('✅ Autopay subscription created:', result.subscriptionId);
          setAutopayStatus('success');
          // Clear session storage
          sessionStorage.removeItem('pendingAutopaySetup');
        } else {
          console.error('❌ Failed to create autopay:', result.error);
          setAutopayStatus('error');
          setAutopayError(result.error || 'Failed to setup autopay');
        }
      } catch (err: any) {
        console.error('❌ Error setting up autopay:', err);
        setAutopayStatus('error');
        setAutopayError(err.message || 'An error occurred');
      }
    };

    if (paymentId && orderId) {
      setupAutopay();
    }
  }, [paymentId, orderId, user?.id, getToken]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center py-12">
      <div className="max-w-2xl mx-auto px-6">
        <div className="bg-white rounded-3xl shadow-2xl p-8 text-center">
          {/* Success Icon */}
          <div className="mb-6">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-16 h-16 text-green-500"
              >
                <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm4.28 6.97a.75.75 0 010 1.06l-5.25 5.25a.75.75 0 01-1.06 0l-2.25-2.25a.75.75 0 111.06-1.06l1.72 1.72 4.72-4.72a.75.75 0 011.06 0z" clipRule="evenodd" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Successful!</h1>
            <p className="text-gray-600">Thank you for choosing EVChamp</p>
          </div>

          {/* Payment Details */}
          <div className="bg-gray-50 rounded-xl p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Payment Details</h2>
            <div className="space-y-3 text-left">
              <div className="flex justify-between">
                <span className="text-gray-600">Payment ID:</span>
                <span className="font-mono text-sm">{paymentId || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Order ID:</span>
                <span className="font-mono text-sm">{orderId || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Status:</span>
                <span className="text-green-600 font-semibold">✓ Completed</span>
              </div>
            </div>
          </div>

          {/* Autopay Status */}
          {autopayStatus !== 'idle' && (
            <div className={`rounded-xl p-4 mb-8 ${
              autopayStatus === 'success'
                ? 'border border-green-200 bg-green-50'
                : autopayStatus === 'loading'
                ? 'border border-blue-200 bg-blue-50'
                : 'border border-red-200 bg-red-50'
            }`}>
              <div className="flex items-start gap-3">
                {autopayStatus === 'loading' && (
                  <>
                    <svg className="animate-spin h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <div>
                      <h3 className="font-semibold text-blue-900">Setting up Autopay...</h3>
                      <p className="text-sm text-blue-700">Your automatic renewal subscription is being created</p>
                    </div>
                  </>
                )}
                {autopayStatus === 'success' && (
                  <>
                    <svg className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <div>
                      <h3 className="font-semibold text-green-900">Autopay Enabled!</h3>
                      <p className="text-sm text-green-700">Your plan will automatically renew before expiration</p>
                    </div>
                  </>
                )}
                {autopayStatus === 'error' && (
                  <>
                    <svg className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    <div>
                      <h3 className="font-semibold text-red-900">Autopay Setup Failed</h3>
                      <p className="text-sm text-red-700">{autopayError || 'We couldn\'t setup autopay, but your payment was successful'}</p>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Next Steps */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">What's Next?</h3>
            <div className="space-y-3 text-left">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-blue-600 text-sm font-bold">1</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Confirmation Email</p>
                  <p className="text-sm text-gray-600">You'll receive a confirmation email with all the details</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-blue-600 text-sm font-bold">2</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Setup & Onboarding</p>
                  <p className="text-sm text-gray-600">Our team will contact you within 24 hours for setup</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-blue-600 text-sm font-bold">3</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Access Your Dashboard</p>
                  <p className="text-sm text-gray-600">Get access to your EVChamp dashboard and mobile app</p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/')}
              className="flex items-center justify-center space-x-2 bg-gradient-to-r from-green-500 to-green-700 text-white px-6 py-3 rounded-lg font-semibold hover:from-green-600 hover:to-green-800 transition-all duration-200"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-5 h-5"
              >
                <path d="M11.47 3.84a.75.75 0 011.06 0l7.5 7.5a.75.75 0 01-1.06 1.06L18 11.53V18a2.25 2.25 0 01-2.25 2.25h-1.5a.75.75 0 01-.75-.75v-4.5a.75.75 0 00-.75-.75h-2.5a.75.75 0 00-.75.75v4.5a.75.75 0 01-.75.75H5.25A2.25 2.25 0 013 18v-6.47l-1.97 1.97a.75.75 0 11-1.06-1.06l7.5-7.5z" />
              </svg>
              <span>Go to Home</span>
            </button>
            <button
              onClick={() => window.print()}
              className="flex items-center justify-center space-x-2 bg-white border-2 border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-all duration-200"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-5 h-5"
              >
                <path fillRule="evenodd" d="M6 3a2.25 2.25 0 00-2.25 2.25v13.5a.75.75 0 001.155.63L6 18.75l1.095.63a.75.75 0 00.75 0L9 18.75l1.095.63a.75.75 0 00.75 0L12 18.75l1.095.63a.75.75 0 00.75 0L15 18.75l1.095.63a.75.75 0 00.75 0L18 18.75l1.095.63a.75.75 0 001.155-.63V5.25A2.25 2.25 0 0018 3H6zm2.25 4.5a.75.75 0 000 1.5h7.5a.75.75 0 000-1.5h-7.5zM7.5 12a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5A.75.75 0 017.5 12zm0 3.75a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75z" clipRule="evenodd" />
              </svg>
              <span>Download Receipt</span>
            </button>
          </div>

          {/* Support Contact */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              Need help? Contact us at{' '}
              <a href="mailto:hello@zip-bolt.com" className="text-green-600 hover:text-green-700 font-medium">
                hello@zip-bolt.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
