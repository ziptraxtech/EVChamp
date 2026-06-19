import { useState } from "react";
import { Wallet } from "lucide-react";
import { INVENTORY } from "./data/cars";
import { emiFor } from "./lib/calc";
import { fmtPrice, fmtEmi } from "./lib/format";
import { useToolkit } from "./context";
import { Card, ToolHeader, Slider, OptionButton } from "./ui";

const TENURES = [3, 5, 7];

export default function Affordability() {
  const { cur } = useToolkit();
  const [mbudget, setMbudget] = useState(35000);
  const [down, setDown] = useState(200000);
  const [years, setYears] = useState(5);
  const [rate, setRate] = useState(9);

  const rows = INVENTORY.map((c) => {
    const { emi, onRoad } = emiFor(c.priceInr, { down, years, rate });
    const fits = emi <= mbudget;
    return { car: c, emi, onRoad, fits, barW: Math.min(100, (emi / mbudget) * 100) };
  }).sort((a, b) => a.emi - b.emi);

  const fitsCount = rows.filter((r) => r.fits).length;

  return (
    <section className="mx-auto max-w-[1240px] px-10 pb-[90px] pt-5">
      <ToolHeader
        eyebrow="Affordability Studio"
        icon={<Wallet size={15} strokeWidth={1.8} />}
        title="See exactly what fits your monthly budget"
        sub="Set a down payment, tenure and EMI ceiling — every EV's loan is calculated live and ranked by monthly cost."
      />

      <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[340px_1fr]">
        <Card className="p-6 lg:sticky lg:top-[86px]">
          <Slider
            label="Monthly EMI ceiling"
            display={fmtEmi(mbudget, cur)}
            value={mbudget}
            min={8000}
            max={150000}
            step={1000}
            onChange={setMbudget}
          />
          <Slider
            label="Down payment"
            display={fmtPrice(down, cur)}
            value={down}
            min={0}
            max={2000000}
            step={25000}
            onChange={setDown}
          />
          <div className="mb-[22px]">
            <label className="mb-3 block text-[0.82rem] font-bold text-ink">Loan tenure</label>
            <div className="flex gap-2">
              {TENURES.map((y) => (
                <OptionButton key={y} active={years === y} onClick={() => setYears(y)} className="flex-1 !py-2.5 text-center !text-[0.83rem]">
                  {y} yr
                </OptionButton>
              ))}
            </div>
          </div>
          <Slider
            label="Interest rate"
            display={`${rate}%`}
            value={rate}
            min={7}
            max={13}
            step={0.25}
            onChange={setRate}
          />

          <div className="mt-6 rounded-xl border border-[rgba(10,138,82,.15)] bg-[rgba(10,138,82,.06)] p-4">
            <div className="font-display text-[1.7rem] font-extrabold leading-none text-green">
              {fitsCount}
              <span className="text-[1rem] font-semibold text-body"> / 16</span>
            </div>
            <div className="mt-[3px] text-[0.8rem] text-body">EVs fit your {fmtEmi(mbudget, cur)} ceiling</div>
          </div>
        </Card>

        <div className="flex flex-col gap-2.5">
          {rows.map(({ car, emi, onRoad, fits, barW }) => (
            <div
              key={car.id}
              className="flex items-center gap-4 rounded-[14px] border bg-white px-4 py-3 shadow-[0_1px_2px_rgba(16,33,51,.06)]"
              style={{ borderColor: fits ? "rgba(10,138,82,.35)" : "#e4e9f0" }}
            >
              <div className="relative h-12 w-[72px] flex-none overflow-hidden rounded-lg bg-divider">
                <img src={car.images[0]} alt={car.name} className="absolute inset-0 h-full w-full object-cover" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="mb-2 flex items-baseline justify-between gap-2.5">
                  <div className="truncate font-display text-[0.95rem] font-bold">{car.name}</div>
                  <div className="whitespace-nowrap text-[0.74rem] text-body">on-road {fmtPrice(onRoad, cur)}</div>
                </div>
                <div className="h-2 overflow-hidden rounded-md bg-panel">
                  <div
                    className="h-full rounded-md transition-[width] duration-[250ms]"
                    style={{
                      width: `${barW}%`,
                      background: fits ? "linear-gradient(90deg,#0a8a52,#12b886)" : "#cbd5e1",
                    }}
                  />
                </div>
              </div>
              <div className="w-[120px] flex-none text-right">
                <div
                  className="font-display text-[1.05rem] font-extrabold leading-none"
                  style={{ color: fits ? "#0a8a52" : "#94a3b8" }}
                >
                  {fmtEmi(emi, cur)}
                </div>
                <div
                  className="mt-[3px] text-[0.68rem] font-bold tracking-[0.3px]"
                  style={{ color: fits ? "#0a8a52" : "#94a3b8" }}
                >
                  {fits ? "Within budget" : "Over budget"}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
