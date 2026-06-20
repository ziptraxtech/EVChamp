import { useEffect } from "react";
import { X } from "lucide-react";
import { carById, type Car, type Currency } from "./data/cars";
import { emiFor } from "./lib/calc";
import { fmtPrice, fmtEmi } from "./lib/format";
import { useToolkit } from "./context";

// Spec rows, in display order. Each renders one value per car. Building the grid
// row-by-row (label + a cell per car) keeps every row aligned automatically —
// no fragile fixed offsets — and the whole grid scrolls horizontally on mobile.
const ROWS: { label: string; highlight?: boolean; render: (c: Car, cur: Currency) => string }[] = [
  { label: "Ex-showroom", highlight: true, render: (c, cur) => fmtPrice(c.priceInr, cur) },
  { label: "EMI / month", render: (c, cur) => fmtEmi(emiFor(c.priceInr, { down: 200000, years: 5, rate: 9 }).emi, cur) },
  { label: "Range", render: (c) => `${c.range} km` },
  { label: "Fast charge", render: (c) => c.charging },
  { label: "Battery", render: (c) => `${c.battery} kWh` },
  { label: "Power", render: (c) => c.power },
  { label: "0–100 km/h", render: (c) => c.sprint },
  { label: "Seats", render: (c) => `${c.seats} seats` },
];

export function CompareModal({ onClose }: { onClose: () => void }) {
  const { compareIds, toggleCompare, cur, openBooking } = useToolkit();
  const cars = compareIds.map(carById);

  // Lock body scroll + close on Escape while open.
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  // Auto-close if the user removes the last car from inside the modal.
  useEffect(() => {
    if (compareIds.length === 0) onClose();
  }, [compareIds.length, onClose]);

  return (
    <div
      onClick={onClose}
      className="fade-in fixed inset-0 z-[600] flex items-start justify-center overflow-y-auto bg-[rgba(6,13,26,.65)] px-3 py-6 backdrop-blur-[6px] sm:px-6 sm:py-10"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Compare EVs"
        className="modal-enter w-full max-w-[1120px] overflow-hidden rounded-[20px] bg-white shadow-[0_32px_80px_rgba(6,13,26,.35)]"
      >
        {/* header */}
        <div className="flex items-center justify-between gap-3 border-b border-divider px-5 py-4 sm:px-8 sm:py-5">
          <div className="min-w-0">
            <div className="font-display text-[1.05rem] font-extrabold sm:text-[1.18rem]">Side-by-Side Compare</div>
            <div className="text-[0.72rem] text-body sm:text-[0.75rem]">
              {cars.length} EV{cars.length !== 1 ? "s" : ""} · tap remove to drop one
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex h-[34px] w-[34px] flex-none items-center justify-center rounded-full bg-panel text-ink transition-colors hover:bg-divider"
          >
            <X size={17} strokeWidth={2} />
          </button>
        </div>

        {/* scrollable grid */}
        <div className="overflow-x-auto px-5 py-6 sm:px-8 sm:py-8">
          <div className="min-w-max">
            {/* header row — car image + name */}
            <div className="flex">
              <div className="w-[92px] flex-shrink-0 sm:w-[120px]" />
              {cars.map((c) => (
                <div key={c.id} className="ml-3 w-[148px] flex-shrink-0 sm:ml-4 sm:w-[190px]">
                  <div className="h-[104px] overflow-hidden rounded-[12px] bg-gradient-to-br from-[#eef2f7] to-[#e2e8f0] sm:h-[140px]">
                    <img src={c.images[0]} alt={c.name} className="h-full w-full object-contain p-2" />
                  </div>
                  <button
                    type="button"
                    onClick={() => toggleCompare(c.id)}
                    className="w-full py-1 text-[0.7rem] text-muted transition-colors hover:text-ink"
                  >
                    ✕ Remove
                  </button>
                  <div className="font-display text-[0.9rem] font-extrabold leading-tight sm:text-[0.95rem]">{c.name}</div>
                  <div className="text-[0.7rem] text-body">{c.variant}</div>
                </div>
              ))}
            </div>

            {/* spec rows */}
            {ROWS.map((row) => (
              <div key={row.label} className="flex items-stretch">
                <div className="flex w-[92px] flex-shrink-0 items-center border-b border-panel py-3 text-[0.62rem] font-bold uppercase tracking-[0.7px] text-muted sm:w-[120px] sm:text-[0.7rem]">
                  {row.label}
                </div>
                {cars.map((c) => (
                  <div
                    key={c.id}
                    className={`ml-3 flex w-[148px] flex-shrink-0 items-center border-b border-panel py-3 text-[0.82rem] sm:ml-4 sm:w-[190px] sm:text-[0.85rem] ${
                      row.highlight ? "font-display font-extrabold text-green" : "font-semibold text-ink"
                    }`}
                  >
                    {row.render(c, cur)}
                  </div>
                ))}
              </div>
            ))}

            {/* book row */}
            <div className="flex">
              <div className="w-[92px] flex-shrink-0 sm:w-[120px]" />
              {cars.map((c) => (
                <div key={c.id} className="ml-3 w-[148px] flex-shrink-0 sm:ml-4 sm:w-[190px]">
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      openBooking(c.id);
                    }}
                    className="bg-primary-gradient mt-4 w-full rounded-[11px] py-2.5 text-[0.78rem] font-extrabold text-white shadow-[0_6px_16px_rgba(10,138,82,.22)] transition-transform hover:-translate-y-px sm:text-[0.8rem]"
                  >
                    Book Test Drive
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
