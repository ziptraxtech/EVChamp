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
    <nav className="nav-glass sticky top-0 z-50 flex h-[66px] items-center justify-between border-b border-line px-10">
      <div className="font-display text-[1.4rem] font-extrabold tracking-[0.5px]">
        <span className="text-blue">EV</span>
        <span className="text-green">Champ</span>
      </div>

      {/* tab group */}
      <div className="flex gap-1 rounded-xl border border-line bg-panel p-1">
        {TABS.map((t) => {
          const active = tab === t.id;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={`inline-flex items-center gap-[7px] whitespace-nowrap rounded-[9px] px-[15px] py-2 text-[0.83rem] transition-all ${
                active ? "bg-primary-gradient font-bold text-white" : "font-semibold text-body hover:text-ink"
              }`}
            >
              {t.icon && <Search size={15} strokeWidth={1.8} />}
              {t.label}
            </button>
          );
        })}
      </div>

      {/* currency toggle */}
      <div className="flex gap-[2px] rounded-[9px] border border-line bg-panel p-[3px]">
        {CURRENCIES.map((c) => {
          const active = cur === c.id;
          return (
            <button
              key={c.id}
              type="button"
              onClick={() => setCur(c.id)}
              className={`whitespace-nowrap rounded-md px-[11px] py-1.5 text-[0.78rem] transition-all ${
                active ? "bg-primary-gradient font-bold text-white" : "font-semibold text-body hover:text-ink"
              }`}
            >
              {c.label}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
