import { useEffect, type ReactNode } from "react";
import { X } from "lucide-react";
import type { Car } from "./data/cars";

/**
 * Shared modal frame: blurred backdrop (click to close), a photo header with the
 * car name overlaid, and a body. Clicking inside the card does not close it.
 */
export function ModalShell({
  car,
  eyebrow,
  meta,
  maxWidth,
  onClose,
  children,
}: {
  car: Car;
  eyebrow: string;
  meta: string;
  maxWidth: number;
  onClose: () => void;
  children: ReactNode;
}) {
  // Lock body scroll + close on Escape while open.
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  return (
    <div
      onClick={onClose}
      className="fade-in fixed inset-0 z-[400] flex items-start justify-center overflow-y-auto bg-[rgba(7,16,28,.55)] px-5 py-10 backdrop-blur-[5px]"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="modal-enter w-full overflow-hidden rounded-[20px] bg-white shadow-[0_30px_80px_rgba(7,16,28,.4)]"
        style={{ maxWidth }}
        role="dialog"
        aria-modal="true"
        aria-label={car.name}
      >
        <div className="relative aspect-[16/9] w-full overflow-hidden bg-gradient-to-br from-[#eef2f7] to-[#e2e8f0]">
          {/* blurred fill — covers the frame edge-to-edge, no letterbox bars */}
          <img
            src={car.images[0]}
            alt=""
            aria-hidden
            className="absolute inset-0 h-full w-full scale-[1.18] object-cover object-center"
            style={{ filter: "blur(22px) saturate(1.05) brightness(.92)" }}
          />
          {/* whole car — contained so it's never cropped, lifted with a drop shadow */}
          <img
            src={car.images[0]}
            alt={car.name}
            className="absolute inset-0 h-full w-full object-contain object-center p-2.5"
            style={{ filter: "drop-shadow(0 10px 18px rgba(6,16,28,.32))" }}
          />
          <div
            className="absolute inset-0"
            style={{ background: "linear-gradient(to top,rgba(3,10,18,.82),rgba(3,10,18,.05) 70%)" }}
          />
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="absolute right-3.5 top-3.5 flex h-[34px] w-[34px] items-center justify-center rounded-full bg-white/90 text-ink shadow-[0_4px_12px_rgba(0,0,0,.18)] transition-colors hover:bg-white"
          >
            <X size={17} strokeWidth={2} />
          </button>
          <div className="absolute inset-x-[18px] bottom-3.5">
            <div className="text-[0.68rem] font-bold uppercase tracking-[1px] text-white/70">{eyebrow}</div>
            <div className="mt-0.5 font-display text-[1.4rem] font-extrabold leading-[1.1] text-white">{car.name}</div>
            <div className="mt-[3px] text-[0.78rem] text-white/[.78]">{meta}</div>
          </div>
        </div>
        {children}
      </div>
    </div>
  );
}

/** Labeled text input used across both modals. */
export function TextField({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  min,
}: {
  label: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  min?: string;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-[0.76rem] font-bold text-ink">{label}</label>
      <input
        type={type}
        value={value}
        min={min}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-[10px] border border-line px-3.5 py-[11px] text-[0.9rem] outline-none focus:border-green"
      />
    </div>
  );
}

/** +91-prefixed phone input. */
export function PhoneField({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="mb-1.5 block text-[0.76rem] font-bold text-ink">Phone number</label>
      <div className="flex items-stretch overflow-hidden rounded-[10px] border border-line focus-within:border-green">
        <span className="flex items-center whitespace-nowrap border-r border-line bg-panel px-3 text-[0.86rem] font-semibold text-body">
          🇮🇳 +91
        </span>
        <input
          type="tel"
          value={value}
          placeholder="81234 56789"
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 px-3.5 py-[11px] text-[0.9rem] outline-none"
        />
      </div>
    </div>
  );
}

/** Primary gradient submit button. */
export function PrimaryButton({
  children,
  onClick,
  className = "",
}: {
  children: ReactNode;
  onClick: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`bg-primary-gradient rounded-[11px] py-[13px] text-[0.92rem] font-extrabold text-white shadow-[0_8px_20px_rgba(10,138,82,.24)] transition-transform hover:-translate-y-px ${className}`}
    >
      {children}
    </button>
  );
}
