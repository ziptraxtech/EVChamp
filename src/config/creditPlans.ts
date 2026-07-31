export type CreditService = 'evchamp' | 'zeflash' | 'zipsureai';

export interface CreditLineItem {
  service: CreditService;
  unitType: string;
  quantity: number;
}

export interface CreditPlan {
  id: string;
  name: string;
  priceInr: number;
  lineItems: CreditLineItem[];
}

// Each plan fans out to one or more services via the outbox pipeline. The
// partner dispatcher is ready for Zeflash and ZipsureAI, but the live catalog
// intentionally remains EVChamp-only until every partner grant endpoint is
// deployed and configured.
//
// The backend keeps its own copy of this catalog (api/index.js and
// server/index.js are separate CommonJS files with no shared module), so any
// change here MUST be mirrored in both of those files too.
export const CREDIT_PLANS: CreditPlan[] = [
  {
    id: 'zeflash-trial',
    name: 'One Time',
    priceInr: 1, // temporary live test price — restore to 300
    // One Zeflash diagnostic. If the buyer already has a Zeflash account
    // (same Clerk user), credits land in their Zeflash wallet. Otherwise
    // EVChamp emails a one-time EVZ-… coupon they can redeem unsigned.
    lineItems: [{ service: 'zeflash', unitType: 'diagnostic_test', quantity: 1 }],
  },
  {
    id: 'zeflash-starter',
    name: 'Starter Pack',
    priceInr: 1500,
    lineItems: [{ service: 'evchamp', unitType: 'inr', quantity: 1500 }],
  },
  {
    id: 'zeflash-value',
    name: 'Value Pack',
    priceInr: 3000,
    lineItems: [{ service: 'evchamp', unitType: 'inr', quantity: 3000 }],
  },
  {
    id: 'zeflash-smart',
    name: 'Smart Pack',
    priceInr: 6000,
    lineItems: [{ service: 'evchamp', unitType: 'inr', quantity: 6000 }],
  },
];

export function getCreditPlan(id: string): CreditPlan | undefined {
  return CREDIT_PLANS.find((p) => p.id === id);
}
