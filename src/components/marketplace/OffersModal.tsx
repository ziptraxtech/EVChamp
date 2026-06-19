import { useState } from "react";
import { Repeat, CreditCard, Zap, IndianRupee } from "lucide-react";
import { carById, offersFor, type Currency } from "./data/cars";
import { fmtPrice, fmtMoney } from "./lib/format";
import type { OfferSource } from "./context";
import { ModalShell, TextField, PhoneField, PrimaryButton } from "./ModalShell";

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

export function OffersModal({
  carId,
  source,
  cur,
  onClose,
  showToast,
}: {
  carId: string;
  source: OfferSource;
  cur: Currency;
  onClose: () => void;
  showToast: (m: string) => void;
}) {
  const car = carById(carId);
  const off = offersFor(car);
  const [revealed, setRevealed] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const digits = phone.replace(/\D/g, "");
  const meta = `${fmtPrice(car.priceInr, cur)} · ${car.range} km`;

  async function unlock() {
    if (!name.trim() || !EMAIL_RE.test(email.trim()) || digits.length !== 10) {
      showToast("Add your name, email and phone to unlock");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/offer-leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          carId: car.id,
          fullName: name.trim(),
          email: email.trim(),
          countryCode: "+91",
          phone: digits,
          offerTotal: off.total,
          source,
        }),
      });
      if (!res.ok) {
        showToast("Something went wrong — please try again");
        return;
      }
      setRevealed(true);
    } catch {
      showToast("Network error — please try again");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <ModalShell
      car={car}
      eyebrow="June offers"
      meta={meta}
      maxWidth={540}
      onClose={onClose}
    >
      {!revealed ? (
        <div className="px-[26px] pb-[26px] pt-6">
          <h2 className="mb-1.5 text-[1.2rem] font-extrabold">See this month&apos;s exclusive offers</h2>
          <p className="mb-5 text-[0.86rem] leading-[1.55] text-body">
            Tell us where to send them — we&apos;ll unlock the live finance, exchange and corporate benefits for
            the {car.name} and email you a copy.
          </p>
          <div className="mb-3">
            <TextField label="Full name" value={name} onChange={setName} placeholder="Your name" />
          </div>
          <div className="mb-3">
            <TextField label="Email" type="email" value={email} onChange={setEmail} placeholder="you@email.com" />
          </div>
          <div className="mb-5">
            <PhoneField value={phone} onChange={setPhone} />
          </div>
          <PrimaryButton onClick={unlock} className="w-full">
            {submitting ? "Unlocking…" : "Unlock offers"}
          </PrimaryButton>
          <p className="mx-auto mt-3 text-center text-[0.7rem] leading-[1.5] text-muted">
            No spam. We&apos;ll only contact you about {car.name} pricing &amp; availability.
          </p>
        </div>
      ) : (
        <div className="px-[26px] pb-[26px] pt-6">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="text-[1.2rem] font-extrabold">Your June offers</h2>
            <span className="whitespace-nowrap rounded-lg bg-[rgba(245,158,11,.12)] px-2.5 py-[5px] text-[0.68rem] font-bold text-amber-ink">
              Valid till 30 Jun
            </span>
          </div>
          <div className="mb-[18px] flex flex-col gap-2.5">
            <OfferRow icon={<Repeat size={19} strokeWidth={1.8} />} title="Exchange bonus" sub="On your old car, any make" value={fmtMoney(off.exchange, cur)} />
            <OfferRow icon={<CreditCard size={19} strokeWidth={1.8} />} title="Corporate discount" sub="For 600+ partner companies" value={fmtMoney(off.corp, cur)} />
            <OfferRow icon={<Zap size={19} strokeWidth={1.8} />} title="Free 7.4 kW home charger" sub="With standard installation" value="Included" />
            <OfferRow icon={<IndianRupee size={19} strokeWidth={1.8} />} title="Low-rate finance" sub="7.99% p.a. · up to 84 months" value="7.99%" />
          </div>
          <div className="mb-[18px] flex items-center justify-between rounded-xl border border-dashed border-[rgba(10,138,82,.35)] bg-[rgba(10,138,82,.07)] px-4 py-3.5">
            <div className="text-[0.82rem] font-bold text-green-strong">Total benefit value</div>
            <div className="font-display text-[1.3rem] font-extrabold text-green">up to {fmtMoney(off.total, cur)}</div>
          </div>
          <PrimaryButton onClick={onClose} className="w-full">
            Got it — a specialist will call you
          </PrimaryButton>
        </div>
      )}
    </ModalShell>
  );
}

function OfferRow({
  icon,
  title,
  sub,
  value,
}: {
  icon: React.ReactNode;
  title: string;
  sub: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-[13px] rounded-xl border border-line bg-panel-2 px-[15px] py-[13px]">
      <div className="flex h-[38px] w-[38px] flex-none items-center justify-center rounded-[10px] bg-[rgba(10,138,82,.10)] text-green">
        {icon}
      </div>
      <div className="flex-1">
        <div className="text-[0.9rem] font-bold">{title}</div>
        <div className="text-[0.76rem] text-body">{sub}</div>
      </div>
      <div className="font-display text-[1rem] font-extrabold text-green">{value}</div>
    </div>
  );
}
