import { FX, type Currency } from "../data/cars";

const SYMBOL: Record<Currency, string> = { INR: "₹", USD: "$", AED: "AED " };

export function symbol(cur: Currency): string {
  return SYMBOL[cur];
}

/** Convert an ₹ amount into the active currency. */
export function convert(inr: number, cur: Currency): number {
  return inr * FX[cur];
}

/**
 * Big "sticker" prices.
 * INR shows lakhs ("₹13.49L"); other currencies show the full converted integer.
 */
export function fmtPrice(inr: number, cur: Currency): string {
  if (cur === "INR") return `₹${(inr / 1e5).toFixed(2)}L`;
  return `${SYMBOL[cur]}${Math.round(convert(inr, cur)).toLocaleString("en-US")}`;
}

/**
 * Monthly EMI figures — always suffixed "/mo".
 * INR shows whole thousands ("₹40k/mo"); other currencies show the converted integer.
 */
export function fmtEmi(inr: number, cur: Currency): string {
  if (cur === "INR") return `₹${Math.round(inr / 1000)}k/mo`;
  return `${SYMBOL[cur]}${Math.round(convert(inr, cur)).toLocaleString("en-US")}/mo`;
}

/** Exact money (offer benefits, monthly running costs, savings). */
export function fmtMoney(inr: number, cur: Currency): string {
  if (cur === "INR") return `₹${Math.round(inr).toLocaleString("en-IN")}`;
  return `${SYMBOL[cur]}${Math.round(convert(inr, cur)).toLocaleString("en-US")}`;
}

/** Always-₹ formatter (trip energy cost stays in rupees). */
export function rupee(n: number): string {
  return `₹${Math.round(n).toLocaleString("en-IN")}`;
}

/** Plain ₹ thousands label used in marketing copy ("Benefits up to ₹XX,XXX"). */
export function fmtInr(inr: number): string {
  return `₹${Math.round(inr).toLocaleString("en-IN")}`;
}
