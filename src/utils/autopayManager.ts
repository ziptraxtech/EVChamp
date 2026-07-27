/**
 * Autopay Manager
 * Handles subscription renewal automation for EVChamp plans
 */

export interface AutopaySubscription {
  subscriptionId: string;
  userId: string;
  planId: string;
  planName: string;
  planDetails: {
    tests: number;
    months: number;
    basePrice: number;
  };
  razorpaySubscriptionId?: string;
  status: 'active' | 'paused' | 'cancelled' | 'expired';
  startDate: Date;
  nextRenewalDate: Date;
  lastChargeDate?: Date;
  failedAttempts: number;
  maxRetries: number;
  paymentMethod: {
    cardLast4?: string;
    upiId?: string;
    walletId?: string;
  };
  autoChargeEnabled: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface AutopayResponse {
  success: boolean;
  message: string;
  subscriptionId?: string;
  nextChargeDate?: Date;
  error?: string;
}

class AutopayManager {
  private authToken: string = '';

  /**
   * Set auth token (called from React components with Clerk token)
   */
  setAuthToken(token: string) {
    this.authToken = token;
  }

  /**
   * Get auth token for API calls
   */
  private getAuthHeader(): { Authorization: string } {
    return {
      Authorization: `Bearer ${this.authToken}`
    };
  }

  /**
   * Create a new autopay subscription after payment success
   */
  async createAutopaySubscription(
    userId: string,
    planId: string,
    planName: string,
    planDetails: { tests: number; months: number; basePrice: number },
    paymentMethodId?: string,
    razorpaySubscriptionId?: string
  ): Promise<AutopayResponse> {
    try {
      console.log('📅 Creating autopay subscription...', {
        userId,
        planId,
        planName,
        planDetails,
      });

      // Generate subscription ID
      const subscriptionId = `sub_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      // Calculate next renewal date based on plan validity
      const nextRenewalDate = new Date();
      nextRenewalDate.setMonth(nextRenewalDate.getMonth() + planDetails.months);

      const subscription: AutopaySubscription = {
        subscriptionId,
        userId,
        planId,
        planName,
        planDetails,
        razorpaySubscriptionId,
        status: 'active',
        startDate: new Date(),
        nextRenewalDate,
        failedAttempts: 0,
        maxRetries: 3,
        paymentMethod: {
          // Store payment method reference if available
        },
        autoChargeEnabled: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Save to backend
      const response = await fetch('/api/autopay/subscriptions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...this.getAuthHeader(),
        },
        body: JSON.stringify(subscription),
      });

      if (!response.ok) {
        throw new Error(`Failed to create subscription: ${response.statusText}`);
      }

      const data = await response.json();

      console.log('✅ Autopay subscription created:', {
        subscriptionId: data.subscriptionId,
        nextRenewalDate: data.nextRenewalDate,
      });

      return {
        success: true,
        message: 'Autopay subscription created successfully',
        subscriptionId: data.subscriptionId,
        nextChargeDate: new Date(data.nextRenewalDate),
      };
    } catch (error: any) {
      console.error('❌ Failed to create autopay subscription:', error);
      return {
        success: false,
        message: 'Failed to setup autopay',
        error: error.message,
      };
    }
  }

  /**
   * Update autopay subscription status
   */
  async updateSubscriptionStatus(
    subscriptionId: string,
    status: 'active' | 'paused' | 'cancelled' | 'expired'
  ): Promise<AutopayResponse> {
    try {
      console.log('🔄 Updating subscription status...', { subscriptionId, status });

      const response = await fetch(`/api/autopay/subscriptions/${subscriptionId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...this.getAuthHeader(),
        },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        throw new Error(`Failed to update subscription: ${response.statusText}`);
      }

      const data = await response.json();

      console.log('✅ Subscription status updated:', { status: data.status });

      return {
        success: true,
        message: `Subscription ${status} successfully`,
      };
    } catch (error: any) {
      console.error('❌ Failed to update subscription:', error);
      return {
        success: false,
        message: 'Failed to update subscription',
        error: error.message,
      };
    }
  }

  /**
   * Pause autopay subscription
   */
  async pauseSubscription(subscriptionId: string): Promise<AutopayResponse> {
    return this.updateSubscriptionStatus(subscriptionId, 'paused');
  }

  /**
   * Resume paused autopay subscription
   */
  async resumeSubscription(subscriptionId: string): Promise<AutopayResponse> {
    return this.updateSubscriptionStatus(subscriptionId, 'active');
  }

  /**
   * Cancel autopay subscription
   */
  async cancelSubscription(subscriptionId: string): Promise<AutopayResponse> {
    return this.updateSubscriptionStatus(subscriptionId, 'cancelled');
  }

  /**
   * Get user's active subscriptions
   */
  async getUserSubscriptions(userId: string): Promise<AutopaySubscription[]> {
    try {
      console.log('📋 Fetching user subscriptions...', { userId });

      const response = await fetch(`/api/autopay/subscriptions?userId=${userId}`, {
        headers: {
          ...this.getAuthHeader(),
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch subscriptions: ${response.statusText}`);
      }

      const data = await response.json();

      console.log('✅ Subscriptions fetched:', data);

      return data.subscriptions || [];
    } catch (error: any) {
      console.error('❌ Failed to fetch subscriptions:', error);
      return [];
    }
  }

  /**
   * Get next charge date for a subscription
   */
  getNextChargeDate(subscription: AutopaySubscription): Date {
    return new Date(subscription.nextRenewalDate);
  }

  /**
   * Check if subscription needs renewal soon (within 7 days)
   */
  isRenewalDueSoon(subscription: AutopaySubscription, daysThreshold: number = 7): boolean {
    const today = new Date();
    const nextRenewal = new Date(subscription.nextRenewalDate);
    const daysUntilRenewal = Math.ceil((nextRenewal.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    return daysUntilRenewal <= daysThreshold && daysUntilRenewal >= 0;
  }

  /**
   * Trigger manual renewal charge
   */
  async triggerRenewal(subscriptionId: string): Promise<AutopayResponse> {
    try {
      console.log('💳 Triggering manual renewal...', { subscriptionId });

      const response = await fetch(`/api/autopay/subscriptions/${subscriptionId}/renew`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...this.getAuthHeader(),
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to trigger renewal: ${response.statusText}`);
      }

      const data = await response.json();

      console.log('✅ Renewal triggered successfully:', data);

      return {
        success: true,
        message: 'Renewal charged successfully',
        nextChargeDate: new Date(data.nextRenewalDate),
      };
    } catch (error: any) {
      console.error('❌ Failed to trigger renewal:', error);
      return {
        success: false,
        message: 'Failed to process renewal',
        error: error.message,
      };
    }
  }

  /**
   * Update payment method for subscription
   */
  async updatePaymentMethod(
    subscriptionId: string,
    paymentMethodId: string
  ): Promise<AutopayResponse> {
    try {
      console.log('💳 Updating payment method...', { subscriptionId });

      const response = await fetch(
        `/api/autopay/subscriptions/${subscriptionId}/payment-method`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            ...this.getAuthHeader(),
          },
          body: JSON.stringify({ paymentMethodId }),
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to update payment method: ${response.statusText}`);
      }

      const data = await response.json();

      console.log('✅ Payment method updated:', data);

      return {
        success: true,
        message: 'Payment method updated successfully',
      };
    } catch (error: any) {
      console.error('❌ Failed to update payment method:', error);
      return {
        success: false,
        message: 'Failed to update payment method',
        error: error.message,
      };
    }
  }

  /**
   * Get auth token from Clerk
   */
  private async getAuthToken(): Promise<string> {
    // Auth token should be set via setAuthToken() from React components
    return this.authToken;
  }
}

export const autopayManager = new AutopayManager();
export default autopayManager;
