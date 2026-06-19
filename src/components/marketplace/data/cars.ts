// ──────────────────────────────────────────────────────────────────────────
// EV Champ — Decision Toolkit inventory (16 EVs).
// priceInr = ex-showroom price in ₹. range = real-world km. battery = kWh.
// `images` = 4 shots per car ([0] = primary/hero, [3] = interior).
// ──────────────────────────────────────────────────────────────────────────

export type BodyType = "hatchback" | "sedan" | "suv" | "luxury";

export interface Car {
  id: string;
  name: string;
  brand: string;
  type: BodyType;
  variant: string;
  priceInr: number;
  range: number; // km
  sprint: string; // 0-100 km/h, or "—"
  power: string; // e.g. "145 PS"
  charging: string; // e.g. "60 kW DC"
  battery: number; // kWh
  seats: number;
  images: string[]; // /public paths, [0] primary
}

export const INVENTORY: Car[] = [
  { id: "comet",      name: "MG Comet EV",            brand: "MG",          type: "hatchback", variant: "17.3 kWh · 2026",              priceInr: 499000,  range: 190, sprint: "—",    power: "42 PS",  charging: "3.3 kW AC",  battery: 17.3, seats: 4, images: ["/images/comet/comet.webp", "/images/comet/comet2.avif", "/images/comet/comet3.avif", "/images/comet/comet-interior.webp"] },
  { id: "tiago",      name: "Tata Tiago EV",          brand: "Tata Motors", type: "hatchback", variant: "LR · 24 kWh · 2026",           priceInr: 799000,  range: 250, sprint: "—",    power: "75 PS",  charging: "50 kW DC",   battery: 24,   seats: 5, images: ["/images/tiago/tiago.avif", "/images/tiago/tiago2.avif", "/images/tiago/tiago3.avif", "/images/tiago/tiago-interior.avif"] },
  { id: "punch-ev",   name: "Tata Punch EV",          brand: "Tata Motors", type: "suv",       variant: "Smart · 25 kWh · 2024",        priceInr: 969000,  range: 350, sprint: "9.3s", power: "82 PS",  charging: "25 kW DC",   battery: 25,   seats: 5, images: ["/images/punchev/punch-ev.webp", "/images/punchev/punchev1.avif", "/images/punchev/punchev2.avif", "/images/punchev/punch-interior.avif"] },
  { id: "ec3",        name: "Citroën ëC3",            brand: "Citroën",     type: "hatchback", variant: "Shine · 29.2 kWh · 2026",      priceInr: 1157000, range: 320, sprint: "—",    power: "57 PS",  charging: "50 kW DC",   battery: 29.2, seats: 5, images: ["/images/citroen-ec3/citroeon-ev.avif", "/images/citroen-ec3/citroen-ec3.avif", "/images/citroen-ec3/citroen-ev-3.avif", "/images/citroen-ec3/citroen-interior.avif"] },
  { id: "nexon-ev",   name: "Tata Nexon EV",          brand: "Tata Motors", type: "suv",       variant: "LR 45 · 40.5 kWh · 2026",      priceInr: 1349000, range: 400, sprint: "8.9s", power: "145 PS", charging: "60 kW DC",   battery: 40.5, seats: 5, images: ["/images/nexon/nexon.avif", "/images/nexon/nexon2.avif", "/images/nexon/nexon3.avif", "/images/nexon/nexon-interior.avif"] },
  { id: "windsor",    name: "MG Windsor EV",          brand: "MG",          type: "suv",       variant: "Pro · 38 kWh · 2026",          priceInr: 1410000, range: 300, sprint: "—",    power: "136 PS", charging: "60 kW DC",   battery: 38,   seats: 5, images: ["/images/windsor/mg_windsor.avif", "/images/windsor/windsor2.avif", "/images/windsor/windsor3.avif", "/images/windsor/windsor-interior.avif"] },
  { id: "curvv",      name: "Tata Curvv EV",          brand: "Tata Motors", type: "suv",       variant: "Empowered+ · 55 kWh · 2024",   priceInr: 1699000, range: 502, sprint: "8.6s", power: "165 PS", charging: "70 kW DC",   battery: 55,   seats: 5, images: ["/images/curvv/tata-curvv-ev.avif", "/images/curvv/curvv2.avif", "/images/curvv/curvv3.avif", "/images/curvv/curvv-interior.avif"] },
  { id: "creta-ev",   name: "Hyundai Creta Electric", brand: "Hyundai",     type: "suv",       variant: "Excellence · 51.4 kWh · 2026", priceInr: 1799000, range: 390, sprint: "7.9s", power: "169 PS", charging: "110 kW DC",  battery: 51.4, seats: 5, images: ["/images/creta/creta.avif", "/images/creta/creta-1.avif", "/images/creta/creta-2.avif", "/images/creta/creta-interior.avif"] },
  { id: "zsev",       name: "MG ZS EV",               brand: "MG",          type: "suv",       variant: "Excite · 50.3 kWh · 2026",     priceInr: 1898000, range: 380, sprint: "8.5s", power: "177 PS", charging: "76 kW DC",   battery: 50.3, seats: 5, images: ["/images/zs-ev/zs-ev.webp", "/images/zs-ev/zs-ev.jpg", "/images/zs-ev/zs-ev2.jpg", "/images/zs-ev/zs-ev-interior.avif"] },
  { id: "harrier-ev", name: "Tata Harrier EV",        brand: "Tata Motors", type: "suv",       variant: "QWD · 75 kWh · 2026",          priceInr: 2149000, range: 500, sprint: "6.3s", power: "238 PS", charging: "120 kW DC",  battery: 75,   seats: 5, images: ["/images/harrier/harrier.avif", "/images/harrier/harrier2.avif", "/images/harrier/harrier3.avif", "/images/harrier/harrier-interior.avif"] },
  { id: "xev9e",      name: "Mahindra XEV 9e",        brand: "Mahindra",    type: "suv",       variant: "79 kWh · 2025",                priceInr: 2190000, range: 656, sprint: "6.8s", power: "286 PS", charging: "175 kW DC",  battery: 79,   seats: 5, images: ["/images/xev-9e/xev9e.avif", "/images/xev-9e/xev9e-1.avif", "/images/xev-9e/xev9e-2.avif", "/images/xev-9e/xev9e-interior.avif"] },
  { id: "xev9s",      name: "Mahindra XEV 9S",        brand: "Mahindra",    type: "suv",       variant: "79 kWh · 7-seat · 2026",       priceInr: 2090000, range: 600, sprint: "6.8s", power: "286 PS", charging: "175 kW DC",  battery: 79,   seats: 7, images: ["/images/xev-9s/xev-9s.avif", "/images/xev-9s/xev-9s-1.avif", "/images/xev-9s/xev-9s-2.avif", "/images/xev-9s/xev9s-interior.avif"] },
  { id: "atto3",      name: "BYD Atto 3",             brand: "BYD",         type: "suv",       variant: "Superior · 60.5 kWh · 2026",   priceInr: 2499000, range: 430, sprint: "7.3s", power: "204 PS", charging: "80 kW DC",   battery: 60.5, seats: 5, images: ["/images/byd-atto/byd-atto.webp", "/images/byd-atto/byd-atto-2.webp", "/images/byd-atto/byd-atto-3.avif", "/images/byd-atto/byd-interior.webp"] },
  { id: "be6",        name: "Mahindra BE 6",          brand: "Mahindra",    type: "suv",       variant: "79 kWh · AWD · 2025",          priceInr: 2690000, range: 682, sprint: "6.7s", power: "231 PS", charging: "175 kW DC",  battery: 79,   seats: 5, images: ["/images/be6/be6.jpg", "/images/be6/be6-1.jpeg", "/images/be6/be6-3.avif", "/images/be6/be6-interior.jpg"] },
  { id: "ioniq5",     name: "Hyundai IONIQ 5",        brand: "Hyundai",     type: "luxury",    variant: "72.6 kWh · 2026",              priceInr: 4605000, range: 520, sprint: "5.1s", power: "217 PS", charging: "350 kW DC",  battery: 72.6, seats: 5, images: ["/images/ioniq5/ioniq5-1.avif", "/images/ioniq5/ioniq5-2.jpg", "/images/ioniq5/ioniq5-3.avif", "/images/ioniq5/ioniq-interior.jpg"] },
  { id: "ev6",        name: "Kia EV6",                brand: "KIA",         type: "luxury",    variant: "GT-Line AWD · 84 kWh · 2026",  priceInr: 6095000, range: 530, sprint: "5.3s", power: "325 PS", charging: "350 kW DC",  battery: 84,   seats: 5, images: ["/images/ev6/ev6.webp", "/images/ev6/ev6-1.avif", "/images/ev6/ev6-3.webp", "/images/ev6/kiaev6-interior.avif"] },
];

// Currency conversion used by the UI toggle.
export type Currency = "INR" | "USD" | "AED";
export const FX: Record<Currency, number> = { INR: 1, USD: 1 / 83, AED: 1 / 22.6 };

// Booking form option sets.
export const CITIES = ["Mumbai", "Delhi NCR", "Bangalore", "Hyderabad", "Chennai", "Pune", "Ahmedabad", "Kolkata"];
export const SLOTS = ["8:00 AM", "9:30 AM", "11:00 AM", "12:30 PM", "2:00 PM", "3:30 PM", "5:00 PM", "6:30 PM"];

// Offer math (per car) — keep identical to the design.
export function offersFor(car: Car) {
  const exchange = Math.round((car.priceInr * 0.025) / 1000) * 1000;
  const corp = Math.round((car.priceInr * 0.012) / 1000) * 1000;
  const total = exchange + corp + 18000;
  return { exchange, corp, total };
}

export function carById(id: string): Car {
  return INVENTORY.find((c) => c.id === id) ?? INVENTORY[0];
}

// The car with the highest offer total — drives the announcement bar.
export const TOP_OFFER_CAR: Car = INVENTORY.reduce((best, c) =>
  offersFor(c).total > offersFor(best).total ? c : best
, INVENTORY[0]);
