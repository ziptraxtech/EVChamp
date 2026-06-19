import { useState } from "react";
import { Check, CircleCheckBig } from "lucide-react";
import { carById, CITIES, SLOTS, type Currency } from "./data/cars";
import { fmtPrice } from "./lib/format";
import { ModalShell, TextField, PhoneField, PrimaryButton } from "./ModalShell";

type Step = "details" | "slot" | "success";

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
const todayStr = () => new Date().toISOString().slice(0, 10);

export function BookingModal({
  carId,
  cur,
  onClose,
  showToast,
}: {
  carId: string;
  cur: Currency;
  onClose: () => void;
  showToast: (m: string) => void;
}) {
  const car = carById(carId);
  const [step, setStep] = useState<Step>("details");
  const [first, setFirst] = useState("");
  const [last, setLast] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [date, setDate] = useState("");
  const [address, setAddress] = useState("");
  const [slot, setSlot] = useState("");
  const [reference, setReference] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const digits = phone.replace(/\D/g, "");
  const meta = `${fmtPrice(car.priceInr, cur)} · ${car.range} km · ${car.battery} kWh`;

  function sendOtp() {
    if (!first.trim() || !last.trim() || !EMAIL_RE.test(email.trim()) || digits.length !== 10) {
      showToast("Please complete all your details first");
      return;
    }
    setStep("slot");
  }

  async function confirm() {
    if (!city || !date || address.trim().length < 4 || !slot) {
      showToast("Pick a city, date, address and time slot");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          carId: car.id,
          firstName: first.trim(),
          lastName: last.trim(),
          email: email.trim(),
          countryCode: "+91",
          phone: digits,
          city,
          preferredDate: date,
          address: address.trim(),
          timeSlot: slot,
        }),
      });
      if (!res.ok) {
        showToast("Something went wrong — please try again");
        return;
      }
      const data = await res.json();
      setReference(data.reference);
      setStep("success");
    } catch {
      showToast("Network error — please try again");
    } finally {
      setSubmitting(false);
    }
  }

  function reset() {
    setStep("details");
    setFirst("");
    setLast("");
    setEmail("");
    setPhone("");
    setCity("");
    setDate("");
    setAddress("");
    setSlot("");
    setReference("");
  }

  return (
    <ModalShell
      car={car}
      eyebrow="Book a test drive"
      meta={meta}
      maxWidth={560}
      onClose={onClose}
    >
      {step === "details" && (
        <div className="px-[26px] pb-[26px] pt-6">
          <StepBar step={1} label="Step 1 of 2 · Your details" />
          <div className="mb-3 grid grid-cols-2 gap-3">
            <TextField label="First name" value={first} onChange={setFirst} placeholder="First name" />
            <TextField label="Last name" value={last} onChange={setLast} placeholder="Last name" />
          </div>
          <div className="mb-3">
            <TextField label="Email" type="email" value={email} onChange={setEmail} placeholder="you@email.com" />
          </div>
          <div className="mb-5">
            <PhoneField value={phone} onChange={setPhone} />
          </div>
          <PrimaryButton onClick={sendOtp} className="w-full">
            Send OTP &amp; continue
          </PrimaryButton>
        </div>
      )}

      {step === "slot" && (
        <div className="px-[26px] pb-[26px] pt-6">
          <StepBar step={2} label="Step 2 of 2 · Slot & address" />
          <div className="mb-4 inline-flex items-center gap-[7px] rounded-[9px] border border-[rgba(10,138,82,.2)] bg-[rgba(10,138,82,.08)] px-3 py-[7px] text-[0.78rem] font-bold text-green-strong">
            <Check size={14} strokeWidth={2.2} />
            Verified +91 {digits}
          </div>
          <div className="mb-3 grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1.5 block text-[0.76rem] font-bold text-ink">City</label>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full cursor-pointer rounded-[10px] border border-line bg-white px-3.5 py-[11px] text-[0.9rem] outline-none focus:border-green"
              >
                <option value="">Select city</option>
                {CITIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <TextField label="Preferred date" type="date" value={date} onChange={setDate} min={todayStr()} />
          </div>
          <div className="mb-4">
            <TextField
              label="Doorstep address"
              value={address}
              onChange={setAddress}
              placeholder="Flat / House, Street, Locality"
            />
          </div>
          <label className="mb-2 block text-[0.76rem] font-bold text-ink">Preferred time slot</label>
          <div className="mb-5 grid grid-cols-4 gap-2">
            {SLOTS.map((s) => {
              const active = slot === s;
              return (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSlot(s)}
                  className={`rounded-[9px] border px-1 py-[9px] text-[0.78rem] transition-all ${
                    active
                      ? "border-green bg-[rgba(10,138,82,.10)] font-bold text-green"
                      : "border-line bg-white font-semibold text-body hover:border-[#cdd6e2]"
                  }`}
                >
                  {s}
                </button>
              );
            })}
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setStep("details")}
              className="rounded-[11px] border border-line bg-transparent px-[18px] py-[13px] text-[0.88rem] font-bold text-body"
            >
              ← Back
            </button>
            <PrimaryButton onClick={confirm} className="flex-1">
              {submitting ? "Confirming…" : "Confirm booking"}
            </PrimaryButton>
          </div>
        </div>
      )}

      {step === "success" && (
        <div className="px-[30px] pb-8 pt-9 text-center">
          <div className="mx-auto mb-[18px] flex h-16 w-16 items-center justify-center rounded-full bg-[rgba(10,138,82,.10)] text-green">
            <CircleCheckBig size={34} strokeWidth={2} />
          </div>
          <h2 className="mb-2.5 text-[1.5rem] font-extrabold">Test drive scheduled!</h2>
          <p className="mx-auto mb-5 max-w-[400px] text-[0.92rem] leading-[1.6] text-body">
            We&apos;ll send an SMS confirmation and call you 2 hours before your slot to coordinate doorstep
            delivery of the {car.name}.
          </p>
          <div className="mb-6 inline-block rounded-[11px] border border-dashed border-[rgba(10,138,82,.35)] bg-[rgba(10,138,82,.07)] px-6 py-3 font-display text-[1.15rem] font-extrabold tracking-[2px] text-green">
            {reference}
          </div>
          <div className="flex justify-center gap-3">
            <button
              type="button"
              onClick={reset}
              className="rounded-[11px] border border-green bg-transparent px-5 py-3 text-[0.88rem] font-bold text-green"
            >
              Schedule another
            </button>
            <PrimaryButton onClick={onClose} className="px-6 !py-3 text-[0.88rem]">
              Done
            </PrimaryButton>
          </div>
        </div>
      )}
    </ModalShell>
  );
}

function StepBar({ step, label }: { step: 1 | 2; label: string }) {
  return (
    <div className="mb-[18px] flex items-center gap-2.5">
      <div className="flex gap-1.5">
        <span className="h-1 w-[26px] rounded-[3px] bg-green" />
        <span className={`h-1 w-[26px] rounded-[3px] ${step === 2 ? "bg-green" : "bg-line"}`} />
      </div>
      <span className="text-[0.74rem] font-bold text-body">{label}</span>
    </div>
  );
}
