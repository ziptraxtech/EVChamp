/**
 * Coupon Manager
 * Handles coupon codes and discounts for EVChamp plans
 * Auto-applies 20% welcome discount on first purchase only
 */

export interface Coupon {
  code: string;
  discountPercentage: number;
  description: string;
  isActive: boolean;
}

export interface CouponValidationResult {
  valid: boolean;
  coupon?: Coupon;
  discountAmount: number;
  finalPrice: number;
  message: string;
  autoApplied?: boolean;
}

class CouponManager {
  // Hidden coupon codes with 20% discount (not shown to users)
  private coupons: Coupon[] = [
    {
      code: 'WELCOME_FIRST_20',
      discountPercentage: 20,
      description: 'First Purchase Discount',
      isActive: true,
    },
  ];

  /**
   * Get the welcome/first purchase coupon
   */
  getWelcomeCoupon(): Coupon {
    return this.coupons[0];
  }

  /**
   * Auto-apply welcome coupon for first purchase
   */
  autoApplyWelcomeCoupon(basePrice: number): CouponValidationResult {
    const coupon = this.getWelcomeCoupon();
    const discountAmount = Math.round((basePrice * coupon.discountPercentage) / 100);
    const finalPrice = basePrice - discountAmount;

    console.log('✅ Welcome coupon auto-applied:', {
      code: coupon.code,
      originalPrice: basePrice,
      discountAmount,
      finalPrice,
      discountPercentage: coupon.discountPercentage,
    });

    return {
      valid: true,
      coupon,
      discountAmount,
      finalPrice,
      message: `Welcome bonus - 20% discount applied`,
      autoApplied: true,
    };
  }

  /**
   * Calculate final price with welcome coupon
   */
  calculateFirstPurchasePrice(basePrice: number): number {
    const result = this.autoApplyWelcomeCoupon(basePrice);
    return result.finalPrice;
  }

  /**
   * Get discount amount for first purchase
   */
  getFirstPurchaseDiscount(basePrice: number): number {
    const result = this.autoApplyWelcomeCoupon(basePrice);
    return result.discountAmount;
  }
}

export const couponManager = new CouponManager();
export default couponManager;
