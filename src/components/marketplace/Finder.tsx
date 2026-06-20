import { useState } from "react";
import { Search, Check, ChevronLeft, ChevronRight, Tag, Gauge, Zap, Activity, ShoppingBag } from "lucide-react";
import { INVENTORY, offersFor, type Currency } from "./data/cars";
import { scoreFinder, emiFor, type FinderArgs, type ScoredCar } from "./lib/calc";
import { fmtPrice, fmtEmi, fmtMoney } from "./lib/format";
import { useToolkit } from "./context";
import { Card, ToolHeader, Slider, OptionButton } from "./ui";

const USE_OPTS: { v: FinderArgs["use"]; label: string }[] = [
  { v: "city", label: "City commute" },
  { v: "family", label: "Family trips" },
  { v: "highway", label: "Long highway" },
  { v: "performance", label: "Performance" },
];
const BODY_OPTS: { v: FinderArgs["body"]; label: string }[] = [
  { v: "all", label: "Any" },
  { v: "hatchback", label: "Hatchback" },
  { v: "sedan", label: "Sedan" },
  { v: "suv", label: "SUV" },
  { v: "luxury", label: "Luxury" },
];

export default function Finder() {
  const { cur } = useToolkit();
  const [budget, setBudget] = useState(2000000);
  const [use, setUse] = useState<FinderArgs["use"]>("city");
  const [body, setBody] = useState<FinderArgs["body"]>("all");
  const [home, setHome] = useState(true);

  const matches = scoreFinder(INVENTORY, { budget, use, body, home });

  return (
    <section className="mx-auto max-w-[1240px] px-10 pb-[90px] pt-5">
      <ToolHeader
        eyebrow="Find Your EV"
        icon={<Search size={15} strokeWidth={1.8} />}
        title="Match a car to the way you live"
        sub="Set your budget and priorities — every EV is scored live against them, with the reasons it fits."
      />

      <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[340px_1fr]">
        {/* sidebar */}
        <Card className="p-6 lg:sticky lg:top-[86px]">
          <div className="mb-6">
            <Slider
              label="Maximum budget"
              display={fmtPrice(budget, cur)}
              value={budget}
              min={500000}
              max={6500000}
              step={50000}
              onChange={setBudget}
            />
          </div>

          <Field label="Primary use">
            <div className="grid grid-cols-2 gap-2">
              {USE_OPTS.map((o) => (
                <OptionButton key={o.v} active={use === o.v} onClick={() => setUse(o.v)}>
                  {o.label}
                </OptionButton>
              ))}
            </div>
          </Field>

          <Field label="Body style">
            <div className="flex flex-wrap gap-2">
              {BODY_OPTS.map((o) => (
                <OptionButton
                  key={o.v}
                  active={body === o.v}
                  onClick={() => setBody(o.v)}
                  className="!rounded-[20px] !px-3.5 !py-2 !text-[0.8rem]"
                >
                  {o.label}
                </OptionButton>
              ))}
            </div>
          </Field>

          <div>
            <label className="mb-1.5 block text-[0.82rem] font-bold text-ink">
              Can you charge at home?
            </label>
            <p className="mb-3 text-[0.74rem] leading-[1.5] text-body">
              No home charging? We favour longer range &amp; faster public charging.
            </p>
            <div className="flex gap-2">
              <OptionButton active={home} onClick={() => setHome(true)} className="flex-1 !py-2.5 text-center">
                Yes, at home
              </OptionButton>
              <OptionButton active={!home} onClick={() => setHome(false)} className="flex-1 !py-2.5 text-center">
                No / public only
              </OptionButton>
            </div>
          </div>
        </Card>

        {/* results */}
        <div>
          <div className="mb-4 text-[0.86rem] text-body">
            <b className="font-display text-[1.05rem] text-ink">{matches.length}</b> EVs match — best fit first
          </div>

          {matches.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-line px-5 py-[60px] text-center text-body">
              <div className="mb-1.5 font-display text-[1.1rem] font-bold text-ink">
                No EVs under this budget
              </div>
              <p className="text-[0.9rem]">
                Raise your budget — India&apos;s most affordable EV starts at ₹4.99L.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {matches.map((m) => (
                <CarCard key={m.car.id} match={m} />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-6">
      <label className="mb-3 block text-[0.82rem] font-bold text-ink">{label}</label>
      {children}
    </div>
  );
}

function CarCard({ match }: { match: ScoredCar }) {
  const { car, reasons, scorePct } = match;
  const { cur, openBooking, openOffers, compareIds, toggleCompare } = useToolkit();
  const inCompare = compareIds.includes(car.id);
  const [idx, setIdx] = useState(0);
  const imgs = car.images;
  const n = imgs.length;
  const emi = emiFor(car.priceInr, { down: 200000, years: 5, rate: 9 }).emi;
  const offerTotal = offersFor(car).total;
  const chargeTxt = car.charging.replace(" DC", "").replace(" AC", "");

  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-line bg-white shadow-[0_1px_2px_rgba(16,33,51,.06)] sm:flex-row">
      {/* carousel */}
      <div className="relative aspect-[4/3] flex-none self-stretch overflow-hidden bg-gradient-to-br from-[#eef2f7] to-[#e2e8f0] sm:aspect-auto sm:min-h-[215px] sm:w-60">
        {/* blurred fill — covers the frame edge-to-edge, no letterbox bars */}
        <img
          src={imgs[idx]}
          alt=""
          aria-hidden
          className="absolute inset-0 h-full w-full scale-[1.18] object-cover object-center"
          style={{ filter: "blur(20px) saturate(1.05) brightness(.92)" }}
        />
        {/* whole car — contained so it's never cropped, lifted with a drop shadow */}
        <img
          src={imgs[idx]}
          alt={car.name}
          className="absolute inset-0 h-full w-full object-contain object-center p-2"
          style={{ filter: "drop-shadow(0 8px 14px rgba(6,16,28,.3))" }}
        />
        <div className="absolute left-3 top-3 z-[2] rounded-[7px] border border-white/15 bg-[rgba(6,13,26,.7)] px-2.5 py-1 text-[0.62rem] font-bold uppercase tracking-[0.8px] text-white backdrop-blur-sm">
          {car.brand}
        </div>
        <div
          className="absolute right-3 top-3 z-[2] inline-flex items-center gap-1 rounded-[7px] px-2 py-1 text-[0.6rem] font-extrabold uppercase tracking-[0.6px] text-white"
          style={{ background: "linear-gradient(135deg,#2a6fe0,#1f4fd0)", boxShadow: "0 3px 8px rgba(31,79,208,.35)" }}
        >
          <Tag size={11} strokeWidth={2.4} />
          Offer
        </div>

        {n > 1 && (
          <>
            <CarouselArrow side="left" onClick={() => setIdx((idx - 1 + n) % n)} />
            <CarouselArrow side="right" onClick={() => setIdx((idx + 1) % n)} />
            <div className="absolute inset-x-3 bottom-2.5 z-[3] flex gap-[5px]">
              {imgs.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  aria-label={`Photo ${i + 1}`}
                  onClick={() => setIdx(i)}
                  className="h-1 rounded-[3px] shadow-[0_1px_2px_rgba(0,0,0,.25)] transition-all"
                  style={{
                    flex: i === idx ? 2 : 1,
                    background: i === idx ? "#0a8a52" : "rgba(255,255,255,.55)",
                  }}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* details */}
      <div className="flex min-w-0 flex-1 flex-col gap-[13px] px-5 py-[18px]">
        <div className="flex items-start justify-between gap-3.5">
          <div className="min-w-0">
            <div className="font-display text-[1.22rem] font-extrabold leading-[1.15]">{car.name}</div>
            <div className="mt-0.5 text-[0.78rem] text-body">{car.variant}</div>
          </div>
          <div className="flex-none rounded-xl border border-[rgba(10,138,82,.2)] bg-[rgba(10,138,82,.08)] px-3 py-[7px] text-center">
            <div className="font-display text-[1.35rem] font-extrabold leading-none text-green">{scorePct}%</div>
            <div className="text-[0.58rem] uppercase tracking-[1px] text-body">match</div>
          </div>
        </div>

        <div className="flex flex-wrap gap-[7px]">
          {reasons.map((r) => (
            <span
              key={r}
              className="inline-flex items-center gap-[5px] rounded-lg border border-[rgba(10,138,82,.15)] bg-[rgba(10,138,82,.06)] px-2.5 py-1 text-[0.74rem] font-semibold text-green-strong"
            >
              <Check size={12} strokeWidth={2.2} />
              {r}
            </span>
          ))}
        </div>

        <div className="flex gap-[18px] border-y border-divider py-[11px]">
          <SpecItem icon={<Gauge size={16} strokeWidth={1.8} />} text={`${car.range} km`} />
          <SpecItem icon={<Zap size={16} strokeWidth={1.8} />} text={chargeTxt} />
          <SpecItem icon={<Activity size={16} strokeWidth={1.8} />} text={car.power} />
        </div>

        <div className="flex flex-wrap items-center gap-3.5">
          <div>
            <span className="font-display text-[1.25rem] font-extrabold">{fmtPrice(car.priceInr, cur)}</span>
            <span className="ml-1 text-[0.72rem] text-body">ex-showroom</span>
          </div>
          <span className="rounded-[9px] border border-line bg-[rgba(10,138,82,.08)] px-2.5 py-1 text-[0.72rem] font-bold text-green">
            {fmtEmi(emi, cur)}
          </span>
          <div className="ml-auto flex gap-2">
            <button
              type="button"
              onClick={() => toggleCompare(car.id)}
              className={`rounded-[10px] border px-3.5 py-[9px] text-[0.8rem] font-semibold transition-all ${
                inCompare
                  ? "border-green bg-[rgba(10,138,82,.12)] text-green"
                  : "border-line bg-transparent text-body hover:border-[#cdd6e2] hover:text-ink"
              }`}
            >
              {inCompare ? "✓ Added" : "Compare"}
            </button>
            <button
              type="button"
              onClick={() => openBooking(car.id)}
              className="bg-primary-gradient rounded-[10px] px-[18px] py-[9px] text-[0.8rem] font-extrabold text-white shadow-[0_6px_16px_rgba(10,138,82,.22)] transition-transform hover:-translate-y-px"
            >
              Book drive
            </button>
          </div>
        </div>

        <OffersStrip offerTotal={offerTotal} onClick={() => openOffers(car.id, "card")} cur={cur} />
      </div>
    </div>
  );
}

function CarouselArrow({ side, onClick }: { side: "left" | "right"; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={side === "left" ? "Previous photo" : "Next photo"}
      className={`absolute top-1/2 z-[3] flex h-[30px] w-[30px] -translate-y-1/2 items-center justify-center rounded-full bg-[rgba(8,16,28,.45)] text-white backdrop-blur-sm transition-colors hover:bg-[rgba(8,16,28,.75)] ${
        side === "left" ? "left-2" : "right-2"
      }`}
    >
      {side === "left" ? <ChevronLeft size={16} strokeWidth={2.2} /> : <ChevronRight size={16} strokeWidth={2.2} />}
    </button>
  );
}

function SpecItem({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex items-center gap-[7px]">
      <span className="flex text-green">{icon}</span>
      <span className="text-[0.82rem] font-bold">{text}</span>
    </div>
  );
}

export function OffersStrip({
  offerTotal,
  onClick,
  cur,
}: {
  offerTotal: number;
  onClick: () => void;
  cur: Currency;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-3 rounded-xl border border-[#b9cdf5] px-3.5 py-[11px] text-left shadow-[0_4px_14px_rgba(31,79,208,.14)] transition-all hover:-translate-y-px hover:shadow-[0_8px_22px_rgba(31,79,208,.26)]"
      style={{ background: "linear-gradient(100deg,#eef3fe,#dce7fb)" }}
    >
      <span
        className="flex h-[34px] w-[34px] flex-none items-center justify-center rounded-[9px] text-white shadow-[0_3px_8px_rgba(31,79,208,.3)]"
        style={{ background: "linear-gradient(135deg,#2a6fe0,#1f4fd0)" }}
      >
        <ShoppingBag size={18} strokeWidth={2} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[0.84rem] font-extrabold leading-[1.2] text-blue-ink">
          View June monthly offers
        </span>
        <span className="mt-px block text-[0.74rem] text-[#3a5bb0]">
          Benefits up to <b>{fmtMoney(offerTotal, cur)}</b> · finance, exchange &amp; more
        </span>
      </span>
      <span className="inline-flex flex-none items-center gap-[5px] whitespace-nowrap rounded-[20px] bg-blue-mid px-2.5 py-[5px] text-[0.7rem] font-extrabold tracking-[0.4px] text-white">
        UNLOCK
        <ChevronRight size={13} strokeWidth={2.4} />
      </span>
    </button>
  );
}
