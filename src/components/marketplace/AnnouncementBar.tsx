import { Tag, ChevronRight } from "lucide-react";
import { TOP_OFFER_CAR, offersFor } from "./data/cars";
import { fmtMoney } from "./lib/format";
import { useToolkit } from "./context";

export default function AnnouncementBar() {
  const { cur, openOffers } = useToolkit();
  const total = offersFor(TOP_OFFER_CAR).total;

  return (
    <button
      type="button"
      onClick={() => openOffers(TOP_OFFER_CAR.id, "announcement")}
      className="flex w-full cursor-pointer items-center justify-center gap-2 px-4 py-2 text-white shadow-[inset_0_-1px_0_rgba(0,0,0,.12)] sm:gap-3 sm:px-10 sm:py-[9px]"
      style={{ background: "linear-gradient(100deg,#13267a,#1f4fd0 60%,#2a6fe0)" }}
    >
      <span className="inline-flex items-center gap-[7px] text-[0.74rem] font-bold tracking-[0.2px] sm:text-[0.82rem]">
        <span className="inline-flex h-[18px] w-[18px] flex-shrink-0 items-center justify-center rounded-full bg-white/20">
          <Tag size={11} strokeWidth={2.4} />
        </span>
        {/* lead text — hidden on the smallest screens to keep the bar one line */}
        <span className="hidden opacity-95 sm:inline">June EV offers are live</span>
        <b className="font-display font-extrabold">Benefits up to {fmtMoney(total, cur)}</b>
      </span>
      {/* full pill on desktop */}
      <span className="hidden items-center gap-[5px] whitespace-nowrap rounded-[20px] bg-white px-3 py-1 text-[0.76rem] font-extrabold text-blue-mid sm:inline-flex">
        View monthly offers
        <ChevronRight size={13} strokeWidth={2.6} />
      </span>
      {/* compact tap affordance on mobile */}
      <ChevronRight size={15} strokeWidth={2.6} className="flex-shrink-0 sm:hidden" />
    </button>
  );
}
