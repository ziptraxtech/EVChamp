/**
 * All page content lives here so copy/data can move to a CMS without touching components.
 */

const CDN = "https://d2atk76x06g5eh.cloudfront.net";

export interface Finish {
  name: string;
  tag: string;
  img: string;
  swatch: string;
}

export interface Detail {
  code: string;
  name: string;
  blurb: string;
  img: string;
}

export interface Stat {
  target: number;
  decimals: number;
  unit: string;
  label: string;
}

export interface SpecGroup {
  title: string;
  rows: [string, string][];
}

export interface GalleryItem {
  src: string;
  caption: string;
}

/**
 * 360° turntable frames at 45° increments.
 * 0–180 are real renders; 225/270/315 mirror 135/90/45 horizontally (flip:true).
 * Drop in dedicated renders + set flip:false for a true turntable.
 */
export interface Frame {
  src: string;
  flip: boolean;
}

export const FRAMES: Frame[] = [
  { src: "/images/f77/0.png", flip: false },
  { src: "/images/f77/45.png", flip: false },
  { src: "/images/f77/90.png", flip: false },
  { src: "/images/f77/135.png", flip: false },
  { src: "/images/f77/180.png", flip: false },
  { src: "/images/f77/135.png", flip: true },
  { src: "/images/f77/90.png", flip: true },
  { src: "/images/f77/45.png", flip: true },
];

/** Frame the turntable opens on (90° side profile). */
export const INITIAL_FRAME = 2;

export const HERO_STATS: Stat[] = [
  { target: 323, decimals: 0, unit: "km", label: "Range · IDC" },
  { target: 155, decimals: 0, unit: "km/h", label: "Top speed" },
  { target: 2.8, decimals: 1, unit: "s", label: "0–60 km/h" },
  { target: 100, decimals: 0, unit: "Nm", label: "Torque" },
];

export const PERFORMANCE_STATS: Stat[] = [
  { target: 323, decimals: 0, unit: "km", label: "Range · IDC" },
  { target: 155, decimals: 0, unit: "km/h", label: "Top speed" },
  { target: 2.8, decimals: 1, unit: "sec", label: "0 – 60 km/h" },
  { target: 30, decimals: 0, unit: "kW", label: "Peak power · 40.2 bhp" },
  { target: 100, decimals: 0, unit: "Nm", label: "Peak torque" },
  { target: 10.3, decimals: 1, unit: "kWh", label: "Battery" },
];

export const FINISHES: Finish[] = [
  {
    name: "Airstrike",
    tag: "Arctic silver with stealth graphics — the everyday weapon.",
    img: `${CDN}/homepage/personalities/Airstrike-image.png`,
    swatch: "#cfd2d8",
  },
  {
    name: "Laser",
    tag: "Race-bred crimson — pure street aggression.",
    img: `${CDN}/homepage/personalities/Laser-image-11.webp`,
    swatch: "#e0233a",
  },
  {
    name: "Shadow",
    tag: "Murdered-out matte black with the full Recon kit.",
    img: `${CDN}/homepage/personalities/Shadow-image.png`,
    swatch: "#26262e",
  },
];

export const DETAILS: Detail[] = [
  {
    code: "A1",
    name: "Swingarm",
    blurb: "Aerospace-grade cast swingarm tuned for rigidity and feedback.",
    img: `${CDN}/homepage/refresh/dttld/swing_arm_1.webp`,
  },
  {
    code: "A2",
    name: "Air Intakes",
    blurb: "Sculpted intakes channel airflow straight to the powertrain.",
    img: `${CDN}/homepage/refresh/dttld/air_intake.webp`,
  },
  {
    code: "A3",
    name: "N40 Hatch",
    blurb: "Front storage hatch integrated into the tank silhouette.",
    img: `${CDN}/homepage/refresh/dttld/f77_2.2484_1.webp`,
  },
  {
    code: "A4",
    name: "Tail Light",
    blurb: "Signature floating LED tail — unmistakable after dark.",
    img: `${CDN}/homepage/refresh/dttld/f77_2.2482_1.webp`,
  },
  {
    code: "A5",
    name: "Side Stand",
    blurb: "Precision-machined stand with a reassuring mechanical click.",
    img: `${CDN}/homepage/refresh/dttld/side_stand_1.webp`,
  },
];

export const GALLERY: GalleryItem[] = [
  { src: `${CDN}/website/india/home/F77/mobile/SS04.png`, caption: "Three-quarter stance" },
  { src: `${CDN}/website/india/home/F77/mobile/SS05.png`, caption: "Street profile" },
  { src: `${CDN}/website/india/home/F77/mobile/SS06.png`, caption: "Rear haunches" },
  { src: `${CDN}/homepage/refresh/dttld/f77_2.2482_1.webp`, caption: "Signature tail" },
];

export const TECH = {
  power: {
    kicker: "Power module",
    title: "10.3 kWh. Range anxiety, retired.",
    body:
      "India's largest production motorcycle battery pack, in an all-aluminium IP67 enclosure with cell-level fuse technology. The Boost 3.0 kW charger refills 20–80% in 2.5 hours from any 16A socket.",
    img: `${CDN}/homepage/refresh/charger/boost_charger.webp`,
    rows: [
      ["Boost charger", "3.0 kW · 2×", true],
      ["20–80% charge", "2.5 h", false],
      ["Enclosure", "IP67 aluminium", false],
    ] as [string, string, boolean][],
  },
  smart: {
    kicker: "Smart ride",
    title: "A machine that learns the road",
    body:
      "Powered by Violette A.I. — four levels of traction control, dynamic regen, Delta Watch, hill-hold and park assist. Over-the-air updates keep the bike sharper than the day you bought it.",
    img: `${CDN}/homepage/refresh/smart_ride/traction_control.jpg`,
    grid: [
      ["4", "Traction levels", false],
      ["OTA", "Updates", false],
      ["4G", "Connected", false],
      ["A.I.", "Violette", true],
    ] as [string, string, boolean][],
  },
  safety: {
    kicker: "Safety",
    title: "Five advanced levels of safety",
    body:
      "Thermal, electrical, mechanical, electronic and software safeguards built around the world's most advanced BMS — backed by dual-channel ABS and a rigid chassis.",
    img: `${CDN}/homepage/refresh/dttld/air_intake.webp`,
    tags: ["Dual-channel ABS", "Cell-level fuse", "Hill-hold", "Park assist"],
  },
};

export const SPECS: SpecGroup[] = [
  {
    title: "Performance",
    rows: [
      ["Top speed", "155 km/h"],
      ["0 – 60 km/h", "2.8 s"],
      ["Peak power", "30 kW / 40.2 bhp"],
      ["Peak torque", "100 Nm"],
      ["Ride modes", "Glide / Combat / Ballistic"],
    ],
  },
  {
    title: "Battery & charging",
    rows: [
      ["Battery", "10.3 kWh Li-ion"],
      ["Range (IDC)", "up to 323 km"],
      ["Range (WMTC)", "231 km est."],
      ["Boost charge", "20–80% / 2.5 h"],
      ["Warranty", "up to 1,00,000 km"],
    ],
  },
  {
    title: "Chassis & brakes",
    rows: [
      ["Kerb weight", "207 kg"],
      ["Front brake", "320 mm disc"],
      ["Rear brake", "230 mm disc"],
      ["ABS", "Dual-channel"],
      ["Wheels", "17-inch alloy"],
    ],
  },
  {
    title: "Intelligence",
    rows: [
      ["Brain", "Violette A.I."],
      ["Traction control", "4-level"],
      ["Connectivity", "4G + Bluetooth, OTA"],
      ["Assists", "Hill-hold, park, Delta Watch"],
      ["Lighting", "Full LED"],
    ],
  },
];

export const FINISH_OPTIONS = ["F77 SuperStreet Original", "F77 SuperStreet Recon"];

/** Top announcement strip — mirrors the EV Showcase offers bar, F77-themed. */
export const ANNOUNCE = {
  lead: "Now live · Ultraviolette F77 SuperStreet in full 360°",
  benefit: "323 km range · 0–60 in 2.8s",
  cta: "Register interest",
};

export const NAV_LINKS = [
  { href: "#orbit", label: "360°" },
  { href: "#performance", label: "Performance" },
  { href: "#features", label: "Technology" },
  { href: "#detail", label: "Design" },
  { href: "#specs", label: "Specs" },
];
