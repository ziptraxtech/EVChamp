import React, { useEffect, useState } from 'react';
import { useAuth, useUser } from '@clerk/clerk-react';
import autopayManager, { AutopaySubscription } from '../utils/autopayManager';

const AutopaySettings: React.FC = () => {
  const { getToken } = useAuth();
  const { user } = useUser();
  const [subscriptions, setSubscriptions] = useState<AutopaySubscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const fetchSubscriptions = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get auth token from Clerk
      const token = await getToken();
      if (!token || !user?.id) {
        setError('Authentication required');
        return;
      }

      // Set auth token in autopayManager
      autopayManager.setAuthToken(token);

      // Fetch subscriptions for current user
      const subs = await autopayManager.getUserSubscriptions(user.id);
      setSubscriptions(subs);
    } catch (err: any) {
      setError(err.message || 'Failed to load subscriptions');
      console.error('Error fetching subscriptions:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePauseSubscription = async (subscriptionId: string) => {
    try {
      const result = await autopayManager.pauseSubscription(subscriptionId);
      if (result.success) {
        await fetchSubscriptions();
      } else {
        setError(result.error || 'Failed to pause subscription');
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleResumeSubscription = async (subscriptionId: string) => {
    try {
      const result = await autopayManager.resumeSubscription(subscriptionId);
      if (result.success) {
        await fetchSubscriptions();
      } else {
        setError(result.error || 'Failed to resume subscription');
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleCancelSubscription = async (subscriptionId: string) => {
    if (!window.confirm('Are you sure you want to cancel this subscription?')) {
      return;
    }

    try {
      const result = await autopayManager.cancelSubscription(subscriptionId);
      if (result.success) {
        await fetchSubscriptions();
      } else {
        setError(result.error || 'Failed to cancel subscription');
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'paused':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'expired':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <svg className="animate-spin h-12 w-12 text-blue-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <p className="text-gray-600">Loading your subscriptions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">Autopay Subscriptions</h1>
          <p className="text-slate-400">Manage your automatic plan renewals</p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 rounded-lg border border-red-500/60 bg-red-950/40 px-4 py-3 text-sm text-red-100 flex items-start gap-3">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="flex-shrink-0 mt-0.5">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        {/* Empty State */}
        {subscriptions.length === 0 && (
          <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-12 text-center">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="mx-auto mb-4 text-slate-600">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z" />
            </svg>
            <h3 className="text-lg font-semibold text-white mb-2">No Active Subscriptions</h3>
            <p className="text-slate-400 mb-6">You don't have any autopay subscriptions yet. Purchase a plan to get started!</p>
            <button className="inline-block bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold px-6 py-2 rounded-lg hover:from-cyan-600 hover:to-blue-700 transition">
              Buy a Plan
            </button>
          </div>
        )}

        {/* Subscriptions List */}
        {subscriptions.length > 0 && (
          <div className="space-y-4">
            {subscriptions.map((subscription) => (
              <div
                key={subscription.subscriptionId}
                className="rounded-2xl border border-slate-800 bg-slate-900/50 overflow-hidden hover:border-slate-700 transition"
              >
                {/* Card Header */}
                <div
                  className="p-6 flex items-center justify-between cursor-pointer hover:bg-slate-800/30 transition"
                  onClick={() => setExpandedId(expandedId === subscription.subscriptionId ? null : subscription.subscriptionId)}
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className="w-12 h-12 rounded-lg bg-blue-500/20 flex items-center justify-center">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-blue-400">
                        <path d="M6 9V2h12v7M6 9c0 1.105-1.343 2-3 2s-3-.895-3-2m12 0c0 1.105 1.343 2 3 2s3-.895 3-2m-9 9v4m6-4v4m-5 4v2m4-2v2" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-white">{subscription.planName}</h3>
                      <p className="text-sm text-slate-400">{subscription.planDetails.tests} tests • {subscription.planDetails.months} months</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(subscription.status)}`}>
                      {subscription.status.charAt(0).toUpperCase() + subscription.status.slice(1)}
                    </span>
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className={`text-slate-600 transition-transform ${expandedId === subscription.subscriptionId ? 'rotate-180' : ''}`}
                    >
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </div>
                </div>

                {/* Card Details (Expandable) */}
                {expandedId === subscription.subscriptionId && (
                  <div className="border-t border-slate-800 px-6 py-6 bg-slate-950/50 space-y-6">
                    {/* Renewal Information */}
                    <div>
                      <h4 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-3">Renewal Information</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs text-slate-500 mb-1">Next Charge Date</p>
                          <p className="text-white font-medium">{formatDate(subscription.nextRenewalDate)}</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-500 mb-1">Amount</p>
                          <p className="text-white font-medium">₹{(subscription.planDetails.basePrice * 1.18).toFixed(2)}</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-500 mb-1">Active Since</p>
                          <p className="text-white font-medium">{formatDate(subscription.startDate)}</p>
                        </div>
                        {subscription.lastChargeDate && (
                          <div>
                            <p className="text-xs text-slate-500 mb-1">Last Charge</p>
                            <p className="text-white font-medium">{formatDate(subscription.lastChargeDate)}</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Renewal Reminder */}
                    {autopayManager.isRenewalDueSoon(subscription) && (
                      <div className="rounded-lg border border-yellow-500/30 bg-yellow-500/10 p-3 flex items-start gap-3">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-yellow-500 flex-shrink-0 mt-0.5">
                          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3.05h16.94a2 2 0 0 0 1.71-3.05L13.71 3.86a2 2 0 0 0-3.42 0z" />
                          <line x1="12" y1="9" x2="12" y2="13" />
                          <line x1="12" y1="17" x2="12.01" y2="17" />
                        </svg>
                        <div>
                          <p className="text-sm font-medium text-yellow-100">Renewal coming soon</p>
                          <p className="text-xs text-yellow-100/80">Your plan will renew on {formatDate(subscription.nextRenewalDate)}</p>
                        </div>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-3">
                      {subscription.status === 'active' && (
                        <>
                          <button
                            onClick={() => handlePauseSubscription(subscription.subscriptionId)}
                            className="inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-900/50 text-slate-200 px-4 py-2 text-sm font-medium hover:bg-slate-800 transition"
                          >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                              <rect x="6" y="4" width="4" height="16" />
                              <rect x="14" y="4" width="4" height="16" />
                            </svg>
                            Pause Subscription
                          </button>
                          <button
                            onClick={() => handleCancelSubscription(subscription.subscriptionId)}
                            className="inline-flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 text-red-200 px-4 py-2 text-sm font-medium hover:bg-red-500/20 transition"
                          >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <polyline points="3 6 5 6 21 6" />
                              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                              <line x1="10" y1="11" x2="10" y2="17" />
                              <line x1="14" y1="11" x2="14" y2="17" />
                            </svg>
                            Cancel
                          </button>
                        </>
                      )}

                      {subscription.status === 'paused' && (
                        <button
                          onClick={() => handleResumeSubscription(subscription.subscriptionId)}
                          className="inline-flex items-center gap-2 rounded-lg border border-green-500/30 bg-green-500/10 text-green-200 px-4 py-2 text-sm font-medium hover:bg-green-500/20 transition"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                            <polygon points="5 3 19 12 5 21 5 3" />
                          </svg>
                          Resume Subscription
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AutopaySettings;
