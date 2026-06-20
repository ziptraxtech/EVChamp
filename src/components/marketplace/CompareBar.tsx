import { X, Plus, ArrowRight } from "lucide-react";
import { carById } from "./data/cars";
import { useToolkit } from "./context";

/**
 * Sticky bottom bar — visible whenever at least one EV is selected to compare.
 * Shows 4 fixed slots on desktop; on mobile it collapses to the count + actions
 * (the slots are hidden to keep the bar compact).
 */
export function CompareBar() {
  const { compareIds, toggleCompare, clearCompare, openCompare } = useToolkit();
  if (compareIds.length === 0) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-[400] border-t-2 border-green bg-white shadow-[0_-6px_28px_rgba(10,138,82,.16)]">
      <div className="mx-auto flex max-w-[1240px] items-center gap-3 px-4 py-3 sm:gap-5 sm:px-10 sm:py-3.5">
        {/* label */}
        <div className="flex-shrink-0">
          <div className="font-display text-[0.95rem] font-extrabold text-ink sm:text-[1.05rem]">
            {compareIds.length} EV{compareIds.length !== 1 ? "s" : ""} selected
          </div>
          <div className="hidden text-[0.7rem] text-body sm:block">Add up to 4 to compare</div>
        </div>

        {/* 4 slots — desktop only */}
        <div className="hidden flex-1 gap-2.5 md:flex">
          {[0, 1, 2, 3].map((i) => {
            const id = compareIds[i];
            const car = id ? carById(id) : null;
            return (
              <div
                key={i}
                className="relative flex h-[58px] w-[120px] items-center justify-center overflow-hidden rounded-[10px] bg-[#f5f8fc]"
                style={{
                  border: "1.5px dashed #d1e0f5",
                  borderStyle: car ? "solid" : "dashed",
                }}
              >
                {car ? (
                  <>
                    <img src={car.images[0]} alt={car.name} className="h-full w-full object-contain p-1" />
                    <button
                      type="button"
                      onClick={() => id && toggleCompare(id)}
                      aria-label={`Remove ${car.name}`}
                      className="absolute right-1 top-1 flex h-[18px] w-[18px] items-center justify-center rounded-full bg-[rgba(6,13,26,.55)] text-white"
                    >
                      <X size={11} strokeWidth={2.5} />
                    </button>
                  </>
                ) : (
                  <div className="flex h-8 w-8 items-center justify-center rounded-full border border-dashed border-[#c0cfe6] text-[#c0cfe6]">
                    <Plus size={16} strokeWidth={2} />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* spacer pushes the actions to the right on mobile (where slots are hidden) */}
        <div className="flex-1 md:hidden" />

        {/* clear */}
        <button
          type="button"
          onClick={clearCompare}
          className="flex-shrink-0 rounded-[10px] border border-line bg-transparent px-3 py-2 text-[0.8rem] font-semibold text-body transition-colors hover:text-ink sm:px-[18px] sm:py-2.5"
        >
          Clear<span className="hidden sm:inline"> all</span>
        </button>

        {/* compare */}
        <button
          type="button"
          onClick={openCompare}
          className="bg-primary-gradient inline-flex flex-shrink-0 items-center gap-1.5 rounded-[10px] px-4 py-2.5 text-[0.84rem] font-extrabold text-white shadow-[0_6px_18px_rgba(10,138,82,.28)] transition-transform hover:-translate-y-px sm:px-[26px] sm:py-3 sm:text-[0.88rem]"
        >
          Compare <ArrowRight size={15} strokeWidth={2.4} />
        </button>
      </div>
    </div>
  );
}
