import { Search } from "lucide-react";
import type { Currency } from "./data/cars";
import { useToolkit, type Tab } from "./context";

const TABS: { id: Tab; label: string; icon?: boolean }[] = [
  { id: "finder", label: "Find Your EV", icon: true },
  { id: "afford", label: "Affordability" },
  { id: "cost", label: "Running Cost" },
  { id: "trip", label: "Trip Planner" },
];

const CURRENCIES: { id: Currency; label: string }[] = [
  { id: "INR", label: "₹ INR" },
  { id: "USD", label: "$ USD" },
  { id: "AED", label: "AED" },
];

export default function Navbar() {
  const { tab, setTab, cur, setCur } = useToolkit();

  return (
    <nav className="nav-glass sticky top-0 z-50 flex flex-wrap items-center gap-x-3 gap-y-2 border-b border-line px-4 py-2.5 sm:h-[66px] sm:flex-nowrap sm:justify-between sm:px-10 sm:py-0">
      {/* logo */}
      <div className="order-1 font-display text-[1.4rem] font-extrabold tracking-[0.5px]">
        <span className="text-blue">EV</span>
        <span className="text-green">Champ</span>
      </div>

      {/* currency toggle — top-right beside the logo on mobile, far-right on desktop */}
      <div className="order-2 ml-auto flex flex-shrink-0 gap-[2px] rounded-[9px] border border-line bg-panel p-[3px] sm:order-3 sm:ml-0">
        {CURRENCIES.map((c) => {
          const active = cur === c.id;
          return (
            <button
              key={c.id}
              type="button"
              onClick={() => setCur(c.id)}
              className={`whitespace-nowrap rounded-md px-2.5 py-1.5 text-[0.78rem] transition-all sm:px-[11px] ${
                active ? "bg-primary-gradient font-bold text-white" : "font-semibold text-body hover:text-ink"
              }`}
            >
              {c.label}
            </button>
          );
        })}
      </div>

      {/* tab group — full-width, horizontally scrollable strip on mobile; inline on desktop */}
      <div className="order-3 w-full overflow-x-auto no-scrollbar sm:order-2 sm:w-auto sm:overflow-visible">
        <div className="flex w-max gap-1 rounded-xl border border-line bg-panel p-1 sm:w-auto">
          {TABS.map((t) => {
            const active = tab === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setTab(t.id)}
                className={`inline-flex items-center gap-[7px] whitespace-nowrap rounded-[9px] px-3 py-2 text-[0.83rem] transition-all sm:px-[15px] ${
                  active ? "bg-primary-gradient font-bold text-white" : "font-semibold text-body hover:text-ink"
                }`}
              >
                {t.icon && <Search size={15} strokeWidth={1.8} />}
                {t.label}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
