import { useState } from "react";
import { BarChart3, Zap, Car as CarIcon, Leaf, Percent } from "lucide-react";
import { INVENTORY } from "./data/cars";
import { runningCost } from "./lib/calc";
import { fmtMoney } from "./lib/format";
import { useToolkit } from "./context";
import { Card, ToolHeader, Slider } from "./ui";
import { CarSelect } from "./CarSelect";

export default function RunningCost() {
  const { cur } = useToolkit();
  const [carId, setCarId] = useState("nexon-ev");
  const [daily, setDaily] = useState(40);
  const [elec, setElec] = useState(8);
  const [petrol, setPetrol] = useState(105);
  const [mileage, setMileage] = useState(16);

  const car = INVENTORY.find((c) => c.id === carId) ?? INVENTORY[0];
  const r = runningCost(car, { daily, elec, petrol, mileage });

  return (
    <section className="mx-auto max-w-[1240px] px-10 pb-[90px] pt-5">
      <ToolHeader
        eyebrow="Running-Cost Calculator"
        icon={<BarChart3 size={15} strokeWidth={1.8} />}
        title="Electric vs petrol — the real monthly numbers"
        sub="Compare what an EV actually costs to run against an equivalent petrol car at today's prices."
      />

      <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[340px_1fr]">
        <Card className="p-6 lg:sticky lg:top-[86px]">
          <div className="mb-[22px]">
            <label className="mb-2.5 block text-[0.82rem] font-bold text-ink">Compare this EV</label>
            <CarSelect value={carId} onChange={setCarId} />
          </div>
          <Slider label="Daily driving" display={`${daily} km/day`} value={daily} min={10} max={150} step={5} onChange={setDaily} />
          <Slider label="Electricity rate" display={`₹${elec}/kWh`} value={elec} min={4} max={16} step={0.5} onChange={setElec} />
          <Slider label="Petrol price" display={`₹${petrol}/L`} value={petrol} min={80} max={130} step={1} onChange={setPetrol} />
          <Slider label="Petrol car mileage" display={`${mileage} km/L`} value={mileage} min={8} max={28} step={1} onChange={setMileage} />
        </Card>

        <div>
          <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <StatCard
              tone="green"
              icon={<Zap size={16} strokeWidth={1.8} />}
              label={car.name}
              big={fmtMoney(r.evMonth, cur)}
              sub={`per month · ${fmtMoney(r.evPerKm, cur)}/km`}
              barW={r.evBarW}
            />
            <StatCard
              tone="slate"
              icon={<CarIcon size={16} strokeWidth={1.8} />}
              label="Equivalent petrol car"
              big={fmtMoney(r.petMonth, cur)}
              sub={`per month · ${fmtMoney(r.petPerKm, cur)}/km`}
              barW={r.petBarW}
            />
          </div>

          <div
            className="flex flex-wrap items-center gap-7 rounded-2xl border border-line p-7 shadow-[0_1px_2px_rgba(16,33,51,.06)]"
            style={{ background: "linear-gradient(135deg,#e7f5ee,#eef4fb)" }}
          >
            <div className="min-w-[220px] flex-1">
              <div className="mb-2 text-[0.78rem] font-bold uppercase tracking-[1px] text-green-strong">
                You save by going electric
              </div>
              <div className="font-display text-[2.6rem] font-extrabold leading-none text-green">
                {fmtMoney(r.saveMonth, cur)}
                <span className="text-[1.1rem] font-semibold text-body">/mo</span>
              </div>
              <div className="mt-2 text-[0.92rem] text-body">
                That&apos;s <b className="text-ink">{fmtMoney(r.save5yr, cur)}</b> over 5 years of driving.
              </div>
            </div>
            <div className="flex gap-4">
              <MiniCard icon={<Leaf size={22} strokeWidth={1.8} />} value={r.co2.toFixed(1)} label="tonnes CO₂ saved / 5yr" />
              <MiniCard icon={<Percent size={22} strokeWidth={1.8} />} value={`${r.pctCheaper}%`} label="cheaper per km" />
            </div>
          </div>

          <p className="mt-3.5 text-[0.74rem] leading-[1.5] text-muted">
            Estimates use the EV&apos;s real-world efficiency (range ÷ battery). Petrol comparison assumes a
            similar car at the mileage you set. Excludes maintenance, where EVs typically save more.
          </p>
        </div>
      </div>
    </section>
  );
}

function StatCard({
  tone,
  icon,
  label,
  big,
  sub,
  barW,
}: {
  tone: "green" | "slate";
  icon: React.ReactNode;
  label: string;
  big: string;
  sub: string;
  barW: number;
}) {
  const green = tone === "green";
  return (
    <div className="rounded-2xl border border-line bg-white p-[22px] shadow-[0_1px_2px_rgba(16,33,51,.06)]">
      <div
        className={`mb-3 flex items-center gap-2 text-[0.78rem] font-bold uppercase tracking-[1px] ${
          green ? "text-green" : "text-body"
        }`}
      >
        {icon}
        <span className="truncate">{label}</span>
      </div>
      <div className={`font-display text-[2.2rem] font-extrabold leading-none ${green ? "text-green" : "text-ink"}`}>
        {big}
      </div>
      <div className="mt-1 text-[0.8rem] text-body">{sub}</div>
      <div className="mt-4 h-2.5 overflow-hidden rounded-md bg-panel">
        <div
          className="h-full rounded-md"
          style={{
            width: `${barW}%`,
            background: green ? "linear-gradient(90deg,#0a8a52,#12b886)" : "#94a3b8",
          }}
        />
      </div>
    </div>
  );
}

function MiniCard({ icon, value, label }: { icon: React.ReactNode; value: string; label: string }) {
  return (
    <div className="min-w-[120px] rounded-[13px] border border-line bg-white px-5 py-4 text-center">
      <div className="mb-2 flex justify-center text-green">{icon}</div>
      <div className="font-display text-[1.3rem] font-extrabold leading-none text-ink">{value}</div>
      <div className="mt-1 text-[0.7rem] text-body">{label}</div>
    </div>
  );
}
