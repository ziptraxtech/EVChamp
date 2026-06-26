import { Search, Wallet, BarChart3, Route, Zap } from "lucide-react";
import { carById } from "./data/cars";
import { useToolkit, type Tab } from "./context";

const QUICK: { tab: Tab; label: string; icon: typeof Search }[] = [
  { tab: "finder", label: "Find your EV", icon: Search },
  { tab: "afford", label: "Affordability", icon: Wallet },
  { tab: "cost", label: "Running cost", icon: BarChart3 },
  { tab: "trip", label: "Trip planner", icon: Route },
];

export default function Hero() {
  const { setTab } = useToolkit();
  const hero = carById("ioniq5");

  return (
    <section className="mx-auto grid max-w-[1240px] grid-cols-1 items-center gap-14 px-10 pb-9 pt-[60px] lg:grid-cols-2">
      <div>
        <div className="mb-5 inline-flex items-center gap-2 rounded-[20px] border border-line bg-[rgba(10,138,82,0.10)] px-3.5 py-1.5 text-[0.74rem] font-bold tracking-[0.5px] text-green">
          <span className="pulse-dot text-[0.5rem] leading-none">●</span> EV DECISION TOOLKIT
        </div>
        <h1 className="mb-[18px] text-[clamp(2.4rem,4vw,3.3rem)] font-extrabold leading-[1.07]">
          Buy your EV with <span className="text-gradient">total confidence</span>
        </h1>
        <p className="mb-[30px] max-w-[480px] text-[1.06rem] leading-[1.7] text-body">
          Four live tools that turn 16 real Indian EVs into one clear decision — match a car to your life,
          check what you can afford, run the real-world numbers, and plan the range before you ever book a
          drive.
        </p>
        <div className="flex flex-wrap gap-3">
          {QUICK.map(({ tab, label, icon: Icon }) => (
            <button
              key={tab}
              type="button"
              onClick={() => setTab(tab)}
              className="inline-flex items-center gap-[9px] rounded-[11px] bg-primary-gradient px-4 py-[11px] text-[0.88rem] font-bold text-white transition-all hover:-translate-y-px hover:shadow-[0_6px_20px_rgba(10,138,82,.28)]"
            >
              <Icon size={17} strokeWidth={1.8} />
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="relative">
        <div className="relative aspect-[4/3] overflow-hidden rounded-[22px] bg-gradient-to-br from-[#eef2f7] to-[#e2e8f0] shadow-[0_24px_60px_rgba(16,33,51,.16),0_0_0_1px_rgba(16,33,51,.04)]">
          <img
            src={hero.images[0]}
            alt={hero.name}
            className="absolute inset-0 h-full w-full object-cover object-center"
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to top,rgba(3,10,18,.78) 0%,rgba(3,10,18,.15) 42%,transparent 65%)",
            }}
          />
          <div className="bg-primary-gradient absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-[20px] px-3 py-1.5 text-[0.66rem] font-extrabold uppercase tracking-[1px] text-white">
            <Zap size={11} fill="currentColor" strokeWidth={0} /> 800V Ultra-Fast
          </div>
          <div className="absolute inset-x-5 bottom-[18px] flex items-end justify-between gap-3">
            <div>
              <div className="mb-[3px] text-[0.72rem] font-bold uppercase tracking-[1px] text-white/60">
                Hyundai
              </div>
              <div className="font-display text-[1.5rem] font-extrabold leading-[1.1] text-white">
                IONIQ 5
              </div>
            </div>
            <div className="flex gap-2">
              <StatChip value="520" label="KM RANGE" />
              <StatChip value="18" label="MIN CHARGE" />
            </div>
          </div>
        </div>

        <div className="absolute -bottom-[22px] -right-[14px] flex items-center gap-3 rounded-[14px] border border-line bg-white px-4 py-3 shadow-[0_12px_32px_rgba(16,33,51,.12)]">
          <div className="flex h-[38px] w-[38px] items-center justify-center rounded-[10px] bg-[rgba(10,138,82,.10)] text-green">
            <Zap size={20} strokeWidth={1.8} />
          </div>
          <div>
            <div className="font-display text-[1.05rem] font-extrabold leading-[1.1] text-ink">16 EVs</div>
            <div className="text-[0.74rem] text-body">live in this toolkit</div>
          </div>
        </div>
      </div>
    </section>
  );
}

function StatChip({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-[11px] border border-white/20 bg-white/15 px-3 py-2 text-center backdrop-blur-sm">
      <div className="font-display text-[1.05rem] font-extrabold leading-none text-white">{value}</div>
      <div className="text-[0.6rem] tracking-[0.5px] text-white/60">{label}</div>
    </div>
  );
}
