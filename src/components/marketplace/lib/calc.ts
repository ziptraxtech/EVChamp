// ──────────────────────────────────────────────────────────────────────────
// All calculator formulas, ported verbatim from the prototype.
// ──────────────────────────────────────────────────────────────────────────
import type { Car } from "../data/cars";

/** First number found in a string ("60 kW DC" → 60). */
export function num(s: string): number {
  const m = String(s).match(/[\d.]+/);
  return m ? parseFloat(m[0]) : 0;
}
export const kw = (c: Car) => num(c.charging);
export const ps = (c: Car) => num(c.power);
/** 0–100 time in seconds; "—" → 99 (never qualifies for performance bonus). */
export const spr = (c: Car) => {
  const m = String(c.sprint).match(/[\d.]+/);
  return m ? parseFloat(m[0]) : 99;
};
/** Real-world efficiency, km per kWh. */
export const eff = (c: Car) => c.range / c.battery;

// ── EMI (reducing-balance) ─────────────────────────────────────────────────
export interface EmiArgs {
  down: number;
  years: number;
  rate: number;
}
export function emiFor(priceInr: number, { down, years, rate }: EmiArgs) {
  const onRoad = Math.round(priceInr * 1.1); // ~10% RTO + insurance
  const principal = Math.max(0, onRoad - down);
  const r = rate / 1200;
  const n = years * 12;
  if (principal <= 0) return { emi: 0, onRoad };
  const pw = Math.pow(1 + r, n);
  return { emi: (principal * r * pw) / (pw - 1), onRoad };
}

// ── Running cost ───────────────────────────────────────────────────────────
export interface RunningArgs {
  daily: number;
  elec: number;
  petrol: number;
  mileage: number;
}
export function runningCost(car: Car, { daily, elec, petrol, mileage }: RunningArgs) {
  const e = eff(car);
  const evPerKm = elec / e;
  const petPerKm = petrol / mileage;
  const monthlyKm = daily * 30;
  const evMonth = evPerKm * monthlyKm;
  const petMonth = petPerKm * monthlyKm;
  const saveMonth = Math.max(0, petMonth - evMonth);
  const save5yr = saveMonth * 60;
  const litresYr = (monthlyKm * 12) / mileage;
  const co2 = (litresYr * 5 * 2.31) / 1000; // tonnes over 5yr
  const pctCheaper = Math.round((1 - evPerKm / petPerKm) * 100);
  const maxM = Math.max(evMonth, petMonth, 1);
  return {
    evPerKm,
    petPerKm,
    evMonth,
    petMonth,
    saveMonth,
    save5yr,
    co2,
    pctCheaper,
    evBarW: (evMonth / maxM) * 100,
    petBarW: (petMonth / maxM) * 100,
  };
}

// ── Trip planner ───────────────────────────────────────────────────────────
export function planTrip(car: Car, dist: number, chargerKw: number) {
  const teff = eff(car);
  const usable = Math.round(car.range * 0.9); // 10% buffer
  const chargeRange = car.range * 0.6; // 20→80% window
  const stops = dist > usable ? Math.ceil((dist - usable) / chargeRange) : 0;
  const chargeEachMin = Math.round(((car.battery * 0.6) / chargerKw) * 60 * 1.1);
  const driveH = dist / 80; // ~80 km/h avg
  const totalH = driveH + (stops * chargeEachMin) / 60;
  const energy = dist / teff;
  const markers: { leftPct: number }[] = [];
  for (let i = 1; i <= stops; i++) {
    const km = usable + (i - 1) * chargeRange;
    markers.push({ leftPct: Math.min(96, (km / dist) * 100) });
  }
  return { usable, stops, chargeEachMin, totalH, energy, markers, noStops: stops === 0 };
}

export function fmtHours(h: number): string {
  const hh = Math.floor(h);
  const mm = Math.round((h - hh) * 60);
  return `${hh}h ${mm < 10 ? "0" : ""}${mm}m`;
}

// ── Finder score ───────────────────────────────────────────────────────────
export interface FinderArgs {
  budget: number;
  use: "city" | "family" | "highway" | "performance";
  body: "all" | "hatchback" | "sedan" | "suv" | "luxury";
  home: boolean;
}

export interface ScoredCar {
  car: Car;
  score: number;
  reasons: string[];
  scorePct: number;
}

export function scoreFinder(cars: Car[], { budget, use, body, home }: FinderArgs): ScoredCar[] {
  const scored = cars
    .filter((c) => c.priceInr <= budget * 1.08)
    .map((c) => {
      let score = 0;
      const reasons: string[] = [];
      const head = budget - c.priceInr;
      const ckw = kw(c);
      const cps = ps(c);
      const rng = c.range;
      const sp = spr(c);

      if (head >= 0) {
        score += 28;
        reasons.push(head > budget * 0.25 ? "Well within budget" : "Fits your budget");
      } else {
        score += 13;
        reasons.push("Slightly over budget");
      }

      if (body === "all" || c.type === body) {
        score += 14;
        if (body !== "all") reasons.push("Your kind of body");
      } else {
        score += 2;
      }

      if (use === "city") {
        if (c.type === "hatchback") {
          score += 14;
          reasons.push("Ideal city runabout");
        }
        if (c.priceInr < 1300000) score += 8;
        if (rng >= 150) score += 4;
      }
      if (use === "family") {
        if (c.type === "suv") {
          score += 12;
          reasons.push("Spacious family SUV");
        } else if (c.type === "sedan") {
          score += 8;
          reasons.push("Comfortable sedan");
        }
        if (c.seats >= 5) score += 3;
        if (rng >= 400) {
          score += 6;
          reasons.push(`${rng} km range`);
        } else if (rng >= 300) score += 3;
      }
      if (use === "highway") {
        if (rng >= 450) {
          score += 14;
          reasons.push(`${rng} km highway range`);
        } else if (rng >= 350) {
          score += 8;
          reasons.push(`${rng} km range`);
        }
        if (ckw >= 100) {
          score += 9;
          reasons.push(`Ultra-fast ${ckw} kW charging`);
        } else if (ckw >= 60) {
          score += 5;
          reasons.push(`${ckw} kW fast charging`);
        }
      }
      if (use === "performance") {
        if (cps >= 220) {
          score += 12;
          reasons.push(`${cps} PS power`);
        } else if (cps >= 150) {
          score += 6;
          reasons.push(`${cps} PS power`);
        }
        if (sp <= 6.5) {
          score += 9;
          reasons.push(`${c.sprint} 0–100`);
        } else if (sp <= 8) {
          score += 4;
          reasons.push(`${c.sprint} 0–100`);
        }
      }
      if (!home) {
        if (ckw >= 100) {
          score += 8;
          reasons.push("Great for public fast-charging");
        } else if (ckw >= 60) score += 4;
        if (rng >= 400) score += 6;
      } else {
        score += 6;
      }

      const uniq = Array.from(new Set(reasons)).slice(0, 3);
      return { car: c, score, reasons: uniq };
    })
    .sort((a, b) => b.score - a.score);

  const maxRaw = scored.length ? Math.max(...scored.map((x) => x.score)) : 1;
  return scored.map((x) => ({
    ...x,
    scorePct: Math.round(58 + 42 * (x.score / maxRaw)),
  }));
}
