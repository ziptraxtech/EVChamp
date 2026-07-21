/**
 * GST Calculator Utility
 * Handles 18% GST calculation for payments
 */

export const GST_RATE = 0.18; // 18% GST

/**
 * Calculate GST amount for a given price
 * @param baseAmount - The base amount before GST
 * @returns GST amount
 */
export const calculateGST = (baseAmount: number): number => {
  return Math.round(baseAmount * GST_RATE * 100) / 100;
};

/**
 * Calculate total amount including GST
 * @param baseAmount - The base amount before GST
 * @returns Total amount including GST
 */
export const calculateTotalWithGST = (baseAmount: number): number => {
  return Math.round((baseAmount + calculateGST(baseAmount)) * 100) / 100;
};

/**
 * Get breakdown of price, GST and total
 * @param baseAmount - The base amount before GST
 * @returns Object with baseAmount, gstAmount, and totalAmount
 */
export const getPaymentBreakdown = (baseAmount: number) => {
  const gstAmount = calculateGST(baseAmount);
  const totalAmount = baseAmount + gstAmount;
  
  return {
    baseAmount: Math.round(baseAmount * 100) / 100,
    gstAmount: Math.round(gstAmount * 100) / 100,
    totalAmount: Math.round(totalAmount * 100) / 100,
    gstPercentage: GST_RATE * 100,
  };
};
