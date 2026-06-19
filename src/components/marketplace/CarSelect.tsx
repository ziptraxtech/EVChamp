import { INVENTORY } from "./data/cars";

/** Native EV picker shared by the Running-Cost and Trip tools. */
export function CarSelect({ value, onChange }: { value: string; onChange: (id: string) => void }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full cursor-pointer rounded-[10px] border border-line bg-white px-3.5 py-[11px] text-[0.9rem] text-ink outline-none focus:border-green"
    >
      {INVENTORY.map((c) => (
        <option key={c.id} value={c.id}>
          {c.name}
        </option>
      ))}
    </select>
  );
}
