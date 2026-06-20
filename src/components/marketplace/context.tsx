import { createContext, useContext } from "react";
import type { Currency } from "./data/cars";

export type Tab = "finder" | "afford" | "cost" | "trip";
export type OfferSource = "announcement" | "card" | "unlock";

export interface ToolkitContextValue {
  cur: Currency;
  setCur: (c: Currency) => void;
  tab: Tab;
  setTab: (t: Tab) => void;
  /** Open the test-drive booking modal for a car. */
  openBooking: (carId: string) => void;
  /** Open the monthly-offers modal for a car, tagged with where it was triggered. */
  openOffers: (carId: string, source: OfferSource) => void;
  /** Fire a bottom-right toast (auto-dismisses). */
  showToast: (msg: string) => void;
  /** Car IDs currently selected for comparison (max 4). */
  compareIds: string[];
  /** Add/remove a car from the compare set (capped at 4, toasts when full). */
  toggleCompare: (id: string) => void;
  /** Empty the compare set. */
  clearCompare: () => void;
  /** Open the side-by-side compare modal. */
  openCompare: () => void;
}

export const ToolkitContext = createContext<ToolkitContextValue | null>(null);

export function useToolkit(): ToolkitContextValue {
  const ctx = useContext(ToolkitContext);
  if (!ctx) throw new Error("useToolkit must be used within <Toolkit>");
  return ctx;
}
