import { useState } from "react";
import { Route, Zap } from "lucide-react";
import { INVENTORY } from "./data/cars";
import { planTrip, fmtHours } from "./lib/calc";
import { rupee } from "./lib/format";
import { useToolkit } from "./context";
import { Card, ToolHeader, Slider, OptionButton } from "./ui";
import { CarSelect } from "./CarSelect";

const CHARGERS: { kw: number; label: string; sub: string }[] = [
  { kw: 25, label: "City", sub: "25 kW" },
  { kw: 50, label: "Standard", sub: "50 kW" },
  { kw: 120, label: "Highway", sub: "120 kW" },
  { kw: 350, label: "Ultra", sub: "350 kW" },
];

export default function TripPlanner() {
  const [carId, setCarId] = useState("be6");
  const [dist, setDist] = useState(400);
  const [chargerKw, setChargerKw] = useState(120);

  const car = INVENTORY.find((c) => c.id === carId) ?? INVENTORY[0];
  const t = planTrip(car, dist, chargerKw);

  const statusTxt = t.noStops
    ? "Makes it on one charge"
    : `${t.stops} charging stop${t.stops === 1 ? "" : "s"}`;

  return (
    <section className="mx-auto max-w-[1240px] px-10 pb-[90px] pt-5">
      <ToolHeader
        eyebrow="Range & Trip Planner"
        icon={<Route size={15} strokeWidth={1.8} />}
        title="Will it make the trip? Plan the stops"
        sub="Pick a car, set the distance and charger speed — see charging stops, time added and energy used."
      />

      <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[340px_1fr]">
        <Card className="p-6 lg:sticky lg:top-[86px]">
          <div className="mb-[22px]">
            <label className="mb-2.5 block text-[0.82rem] font-bold text-ink">Your EV</label>
            <CarSelect value={carId} onChange={setCarId} />
            <div className="mt-2 text-[0.76rem] text-body">
              Usable range ≈ <b className="text-ink">{t.usable} km</b> (10% buffer)
            </div>
          </div>

          <Slider label="Trip distance" display={`${dist} km`} value={dist} min={50} max={1000} step={10} onChange={setDist} />

          <div>
            <label className="mb-3 block text-[0.82rem] font-bold text-ink">Charger you&apos;ll use</label>
            <div className="grid grid-cols-2 gap-2">
              {CHARGERS.map((c) => (
                <OptionButton
                  key={c.kw}
                  active={chargerKw === c.kw}
                  onClick={() => setChargerKw(c.kw)}
                  className="!px-2 text-center leading-[1.3]"
                >
                  {c.label}
                  <br />
                  <span className="text-[0.68rem] font-semibold opacity-75">{c.sub}</span>
                </OptionButton>
              ))}
            </div>
          </div>
        </Card>

        <div>
          <Card className="mb-4 p-[26px]">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div className="font-display text-[1.15rem] font-extrabold">{car.name}</div>
              <div
                className="inline-flex items-center gap-[7px] rounded-[20px] border px-3.5 py-[7px] text-[0.8rem] font-bold"
                style={{
                  background: t.noStops ? "rgba(10,138,82,.08)" : "rgba(245,158,11,.10)",
                  borderColor: t.noStops ? "rgba(10,138,82,.25)" : "rgba(245,158,11,.3)",
                  color: t.noStops ? "#076b40" : "#b45309",
                }}
              >
                <Zap size={14} strokeWidth={1.8} />
                {statusTxt}
              </div>
            </div>

            <div className="mb-2 flex justify-between text-[0.74rem] font-semibold text-body">
              <span>Start</span>
              <span>{dist} km</span>
            </div>
            <div
              className="relative h-4 rounded-[9px]"
              style={{ background: "linear-gradient(90deg,#0a8a52,#12b886)" }}
            >
              {t.markers.map((mk, i) => (
                <div
                  key={i}
                  className="absolute top-1/2 z-[2] flex h-[30px] w-[30px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-green bg-white text-green shadow-[0_3px_8px_rgba(16,33,51,.18)]"
                  style={{ left: `${mk.leftPct}%` }}
                >
                  <Zap size={14} strokeWidth={1.8} />
                </div>
              ))}
            </div>
            <div className="mt-4 flex items-center gap-2 text-[0.78rem] text-body">
              <span className="inline-block h-3 w-3 rounded-full border-2 border-green bg-white" />
              Each marker = a fast-charging stop along the route
            </div>
          </Card>

          <div className="grid grid-cols-2 gap-3.5 lg:grid-cols-4">
            <TripStat value={String(t.stops)} label="charging stops" green />
            <TripStat value={t.noStops ? "—" : `${t.chargeEachMin} min`} label="per stop (20→80%)" />
            <TripStat value={fmtHours(t.totalH)} label="total travel time" />
            {/* trip cost floors the electricity rate at ₹12/kWh (highway/DC pricing) */}
            <TripStat value={`${Math.round(t.energy)} kWh`} label={`energy · ${rupee(t.energy * 12)}`} />
          </div>

          <p className="mt-3.5 text-[0.74rem] leading-[1.5] text-muted">
            Assumes ~80 km/h average, charging 20→80% at each stop, and a 10% range buffer. Real charging
            tapers above 80%, so stops are kept short.
          </p>
        </div>
      </div>
    </section>
  );
}

function TripStat({ value, label, green }: { value: string; label: string; green?: boolean }) {
  return (
    <Card className="p-[18px]">
      <div className={`font-display text-[1.8rem] font-extrabold leading-none ${green ? "text-green" : "text-ink"}`}>
        {value}
      </div>
      <div className="mt-1.5 text-[0.74rem] text-body">{label}</div>
    </Card>
  );
}
