import { CircleCheckBig } from "lucide-react";

/** Bottom-right confirmation toast. */
export function Toast({ message }: { message: string }) {
  return (
    <div className="toast-enter fixed bottom-8 right-8 z-[500] flex items-center gap-2.5 rounded-xl border border-green bg-white px-[22px] py-3.5 text-[0.88rem] font-semibold text-ink shadow-[0_12px_32px_rgba(16,33,51,.18)]">
      <CircleCheckBig size={18} strokeWidth={2} className="text-green" />
      {message}
    </div>
  );
}
