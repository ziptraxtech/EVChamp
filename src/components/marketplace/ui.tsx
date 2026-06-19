import type { ReactNode } from "react";

/** Centered content shell — 1240px max, 40px side padding. */
export function Shell({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`mx-auto w-full max-w-[1240px] px-10 ${className}`}>{children}</div>;
}

/** White sidebar/result card with the standard card shadow. */
export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={`rounded-2xl border border-line bg-white shadow-[0_1px_2px_rgba(16,33,51,.06)] ${className}`}
    >
      {children}
    </div>
  );
}

/** Eyebrow + heading + sub used at the top of each tool. */
export function ToolHeader({
  eyebrow,
  icon,
  title,
  sub,
}: {
  eyebrow: string;
  icon: ReactNode;
  title: string;
  sub: string;
}) {
  return (
    <div className="mb-7">
      <div className="mb-2.5 inline-flex items-center gap-2 text-[0.72rem] font-bold uppercase tracking-[2px] text-green">
        {icon}
        {eyebrow}
      </div>
      <h2 className="mb-1.5 text-[1.9rem] font-extrabold text-ink">{title}</h2>
      <p className="max-w-[580px] text-[0.98rem] leading-relaxed text-body">{sub}</p>
    </div>
  );
}

/** Labeled range slider with a live value read-out. */
export function Slider({
  label,
  display,
  value,
  min,
  max,
  step,
  onChange,
}: {
  label: string;
  /** Formatted text shown on the right (e.g. "₹20.00L"). */
  display: string;
  /** Raw numeric slider value. */
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="mb-[22px]">
      <div className="mb-3 flex items-baseline justify-between">
        <label className="text-[0.82rem] font-bold text-ink">{label}</label>
        <span className="font-display text-[0.95rem] font-extrabold text-green">{display}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </div>
  );
}

/** Pill / grid option button with the selected-state treatment. */
export function OptionButton({
  active,
  onClick,
  children,
  className = "",
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`cursor-pointer rounded-[10px] border px-3 py-2.5 text-[0.82rem] transition-all ${
        active
          ? "border-green bg-[rgba(10,138,82,.10)] font-bold text-green"
          : "border-line bg-white font-semibold text-body hover:border-[#cdd6e2]"
      } ${className}`}
    >
      {children}
    </button>
  );
}
