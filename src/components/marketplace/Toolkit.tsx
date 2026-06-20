import { useCallback, useMemo, useRef, useState } from "react";
import type { Currency } from "./data/cars";
import { ToolkitContext, type Tab, type OfferSource, type ToolkitContextValue } from "./context";
import AnnouncementBar from "./AnnouncementBar";
import Navbar from "./Navbar";
import Hero from "./Hero";
import Finder from "./Finder";
import Affordability from "./Affordability";
import RunningCost from "./RunningCost";
import TripPlanner from "./TripPlanner";
import { BookingModal } from "./BookingModal";
import { OffersModal } from "./OffersModal";
import { Toast } from "./Toast";
import { CompareBar } from "./CompareBar";
import { CompareModal } from "./CompareModal";

export default function Toolkit() {
  const [cur, setCur] = useState<Currency>("INR");
  const [tab, setTab] = useState<Tab>("finder");
  const [toast, setToast] = useState("");
  const [booking, setBooking] = useState<{ carId: string } | null>(null);
  const [offers, setOffers] = useState<{ carId: string; source: OfferSource } | null>(null);
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [compareOpen, setCompareOpen] = useState(false);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(""), 2600);
  }, []);

  const openBooking = useCallback((carId: string) => setBooking({ carId }), []);
  const openOffers = useCallback(
    (carId: string, source: OfferSource) => setOffers({ carId, source }),
    [],
  );

  const toggleCompare = useCallback(
    (id: string) => {
      setCompareIds((ids) => {
        if (ids.includes(id)) return ids.filter((x) => x !== id);
        if (ids.length >= 4) {
          showToast("You can compare up to 4 EVs");
          return ids;
        }
        return [...ids, id];
      });
    },
    [showToast],
  );
  const clearCompare = useCallback(() => setCompareIds([]), []);
  const openCompare = useCallback(() => setCompareOpen(true), []);
  const closeCompare = useCallback(() => setCompareOpen(false), []);

  const ctx = useMemo<ToolkitContextValue>(
    () => ({ cur, setCur, tab, setTab, openBooking, openOffers, showToast, compareIds, toggleCompare, clearCompare, openCompare }),
    [cur, tab, openBooking, openOffers, showToast, compareIds, toggleCompare, clearCompare, openCompare],
  );

  return (
    <ToolkitContext.Provider value={ctx}>
      <div className="relative z-[1]">
        <AnnouncementBar />
        <Navbar />
        <Hero />

        {tab === "finder" && <Finder />}
        {tab === "afford" && <Affordability />}
        {tab === "cost" && <RunningCost />}
        {tab === "trip" && <TripPlanner />}
      </div>

      {booking && (
        <BookingModal
          key={booking.carId}
          carId={booking.carId}
          cur={cur}
          onClose={() => setBooking(null)}
          showToast={showToast}
        />
      )}

      {offers && (
        <OffersModal
          key={`${offers.carId}-${offers.source}`}
          carId={offers.carId}
          source={offers.source}
          cur={cur}
          onClose={() => setOffers(null)}
          showToast={showToast}
        />
      )}

      {toast && <Toast message={toast} />}

      <CompareBar />
      {compareOpen && <CompareModal onClose={closeCompare} />}
    </ToolkitContext.Provider>
  );
}
