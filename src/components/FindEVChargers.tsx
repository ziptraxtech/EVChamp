import React, { useState, useEffect, useMemo, useDeferredValue } from 'react';
import { createPortal } from 'react-dom';
import { Helmet } from 'react-helmet-async';
import Footer from '../Footer';
import { MapContainer, TileLayer, Marker, Popup, CircleMarker, Tooltip, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import 'react-leaflet-cluster/dist/assets/MarkerCluster.css';
import 'react-leaflet-cluster/dist/assets/MarkerCluster.Default.css';
import { REGIONS, DEFAULT_REGION, type RegionId } from '../config/regions';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

// ── Unified station model ─────────────────────────────────────────────────
// Both EVChamp's own network (CSV) and OpenChargeMap's public listings are
// normalized into this shape so the map/list/filter logic only has to deal
// with one data model, color-coded by live status rather than by source.
type StationStatus = 'available' | 'busy' | 'offline';

interface StationConn {
  label: string;
  dc: boolean;
}

interface Station {
  id: string;
  name: string;
  area: string;
  city: string;
  lat: number;
  lng: number;
  status: StationStatus;
  free: number;
  total: number;
  cost: string;
  conns: StationConn[];
}

// ── Theme tokens (light / dark) ───────────────────────────────────────────
interface ThemeTokens {
  dark: boolean;
  bg: string;
  surface: string;
  surfaceGlass: string;
  border: string;
  text: string;
  sub: string;
  muted: string;
  accent: string;
  accentBtn: string;
  accentBtnHover: string;
  accentBtnText: string;
  chipActiveBg: string;
  chipActiveText: string;
  avail: string;
  busy: string;
  off: string;
  pillAvailBg: string;
  pillAvailText: string;
  pillBusyBg: string;
  pillBusyText: string;
  pillOffBg: string;
  pillOffText: string;
  chipBg: string;
  clusterBorder: string;
  tiles: string;
}

function getTokens(dark: boolean): ThemeTokens {
  return dark
    ? {
        dark: true,
        bg: 'radial-gradient(120% 80% at 50% 0%, #131316 0%, #09090b 60%)',
        surface: '#18181b', surfaceGlass: 'rgba(24,24,27,0.92)', border: '#27272a',
        text: '#fafafa', sub: '#a1a1aa', muted: '#71717a',
        accent: '#34d399', accentBtn: '#10b981', accentBtnHover: '#34d399', accentBtnText: '#052e1f',
        chipActiveBg: '#fafafa', chipActiveText: '#09090b',
        avail: '#34d399', busy: '#fbbf24', off: '#52525b',
        pillAvailBg: 'rgba(52,211,153,0.15)', pillAvailText: '#34d399',
        pillBusyBg: 'rgba(251,191,36,0.15)', pillBusyText: '#fbbf24',
        pillOffBg: '#27272a', pillOffText: '#a1a1aa',
        chipBg: '#27272a', clusterBorder: '#18181b',
        tiles: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
      }
    : {
        dark: false,
        bg: '#EEF2F7',
        surface: '#ffffff', surfaceGlass: 'rgba(255,255,255,0.92)', border: '#E4E9F0',
        text: '#0F2133', sub: '#5E7085', muted: '#94A3B8',
        accent: '#0A8A52', accentBtn: '#0A8A52', accentBtnHover: '#076B40', accentBtnText: '#ffffff',
        chipActiveBg: '#0F2133', chipActiveText: '#ffffff',
        avail: '#0A8A52', busy: '#D99A1B', off: '#94A3B8',
        pillAvailBg: '#E7F5EE', pillAvailText: '#076B40',
        pillBusyBg: '#FDF3DC', pillBusyText: '#8A5B0A',
        pillOffBg: '#EEF2F7', pillOffText: '#5E7085',
        chipBg: '#EEF2F7', clusterBorder: '#ffffff',
        tiles: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
      };
}

// ── EVChamp CSV status derivation ─────────────────────────────────────────
// The CSV only carries a station-level "Station Status" plus a per-EVSE
// "EVSE Status" (Available / In use / Maintenance / Faulted / Inoperative /
// Coming soon) — no connector type, power rating, or tariff. We fold those
// into the same available/busy/offline model the design uses for OCM data.
function deriveCsvStatus(
  stationStatus: string,
  evseStatuses: string[]
): { status: StationStatus; free: number; total: number } {
  const total = evseStatuses.length || 1;
  const free = evseStatuses.filter((s) => s === 'Available').length;
  if (stationStatus === 'Maintenance') return { status: 'offline', free: 0, total };
  if (stationStatus === 'In use') return { status: 'busy', free, total };
  // Station Status 'Available' (or unrecognized) — infer from the EVSE mix.
  if (free === 0) return { status: 'busy', free: 0, total };
  return { status: 'available', free, total };
}

// ── Marker icon builders ──────────────────────────────────────────────────
function buildPinIcon(status: StationStatus, tokens: ThemeTokens): L.DivIcon {
  const color = status === 'available' ? tokens.avail : status === 'busy' ? tokens.busy : tokens.off;
  const boltFill = tokens.dark ? '#09090b' : '#ffffff';
  return L.divIcon({
    className: 'ev-pin',
    iconSize: [34, 34],
    iconAnchor: [17, 32],
    popupAnchor: [0, -30],
    html: `<svg width="34" height="34" viewBox="0 0 34 34"><path d="M17 2C10.4 2 5 7.4 5 14c0 8.5 12 18 12 18s12-9.5 12-18C29 7.4 23.6 2 17 2z" fill="${color}" stroke="${tokens.surface}" stroke-width="2"/><path d="M18.2 7.5L12 15.5h4l-.8 5.5 6.3-8h-4l.7-5.5z" fill="${boltFill}"/></svg>`,
  });
}

function buildClusterIconFactory(tokens: ThemeTokens) {
  return (cluster: { getChildCount: () => number }) =>
    L.divIcon({
      className: 'ev-cluster',
      iconSize: L.point(40, 40, true),
      html: `<div style="display:flex;align-items:center;justify-content:center;width:40px;height:40px;border-radius:99px;background:${tokens.accentBtn};color:${tokens.accentBtnText};font-family:Manrope,sans-serif;font-size:14px;font-weight:800;border:3px solid ${tokens.clusterBorder};box-shadow:0 3px 12px rgba(16,185,129,0.5);">${cluster.getChildCount()}</div>`,
    });
}

// ── Rich popup content ────────────────────────────────────────────────────
const STATUS_LABELS: Record<StationStatus, string> = { available: 'Available', busy: 'Busy', offline: 'Offline' };
const GOOGLE_MAPS_API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

const StationPopup: React.FC<{ station: Station; tokens: ThemeTokens; onPreview: () => void }> = ({ station, tokens, onPreview }) => {
  const openInMaps = `https://www.google.com/maps/search/?api=1&query=${station.lat},${station.lng}`;
  const pillColors: Record<StationStatus, [string, string]> = {
    available: [tokens.pillAvailBg, tokens.pillAvailText],
    busy: [tokens.pillBusyBg, tokens.pillBusyText],
    offline: [tokens.pillOffBg, tokens.pillOffText],
  };
  const dotColors: Record<StationStatus, string> = { available: tokens.avail, busy: tokens.busy, offline: tokens.off };
  const [pillBg, pillText] = pillColors[station.status];

  return (
    <div style={{ padding: 16, background: tokens.surface, borderRadius: 14 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10 }}>
        <div style={{ fontSize: 15.5, fontWeight: 800, color: tokens.text, lineHeight: 1.3 }}>{station.name}</div>
        <span
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 5, background: pillBg, color: pillText,
            borderRadius: 99, padding: '4px 10px', fontSize: 11.5, fontWeight: 800, whiteSpace: 'nowrap',
          }}
        >
          <span style={{ width: 6, height: 6, borderRadius: 99, background: dotColors[station.status] }} />
          {STATUS_LABELS[station.status]}
        </span>
      </div>
      <div style={{ fontSize: 12.5, fontWeight: 500, color: tokens.sub, marginTop: 3 }}>
        {station.area}
        {station.area && station.city ? ', ' : ''}
        {station.city}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, marginTop: 10 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: tokens.text }}>
          {station.free} of {station.total} points free
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: tokens.sub }}>Tariff</span>
          <span style={{ fontSize: 14, fontWeight: 800, color: tokens.accent }}>{station.cost || 'Tariff on site'}</span>
        </div>
      </div>
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 8 }}>
        {station.conns.map((cn, i) => (
          <span
            key={i}
            style={{ background: tokens.chipBg, borderRadius: 7, padding: '4px 9px', fontSize: 12, fontWeight: 700, color: tokens.text }}
          >
            ⚡ {cn.label}
          </span>
        ))}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 7, marginTop: 14 }}>
        <button
          onClick={onPreview}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', background: tokens.accentBtn,
            color: tokens.accentBtnText, borderRadius: 9, padding: '10px 14px', fontSize: 13.5, fontWeight: 800,
            border: 'none', cursor: 'pointer', fontFamily: "'Manrope', sans-serif",
          }}
        >
          Get directions in Google Maps
        </button>
        <a
          href={openInMaps}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: tokens.accent, fontSize: 13, fontWeight: 700, textDecoration: 'none' }}
        >
          Open location in Google Maps ↗
        </a>
      </div>
    </div>
  );
};

// ── In-page directions preview modal ──────────────────────────────────────
// Shows an embedded Google Maps preview before committing to leave the page.
// Uses Maps Embed API "directions" mode (a real driving route) once an origin
// is known — from the page's existing "Use my location" state, or requested
// fresh on open — and falls back to "place" mode (just a pin, no route) if
// geolocation isn't available/granted. Rendered via portal so it escapes
// Leaflet's popup stacking context and sits above the whole app.
const DirectionsModal: React.FC<{
  station: Station;
  tokens: ThemeTokens;
  userLocation: { lat: number; lng: number } | null;
  onClose: () => void;
}> = ({ station, tokens, userLocation, onClose }) => {
  const dirs = `https://www.google.com/maps/dir/?api=1&destination=${station.lat},${station.lng}`;
  const openInMaps = `https://www.google.com/maps/search/?api=1&query=${station.lat},${station.lng}`;

  const [origin, setOrigin] = useState(userLocation);
  const [locating, setLocating] = useState(false);
  const [locateFailed, setLocateFailed] = useState(false);

  useEffect(() => {
    if (origin || !navigator.geolocation) return;
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setOrigin({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setLocating(false);
      },
      () => {
        setLocateFailed(true);
        setLocating(false);
      },
      { timeout: 8000 }
    );
    // Only ever attempt this once per modal open — `origin` is intentionally
    // excluded so a successful fetch doesn't retrigger the effect.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const embedSrc = origin
    ? `https://www.google.com/maps/embed/v1/directions?key=${GOOGLE_MAPS_API_KEY}&origin=${origin.lat},${origin.lng}&destination=${station.lat},${station.lng}&mode=driving`
    : `https://www.google.com/maps/embed/v1/place?key=${GOOGLE_MAPS_API_KEY}&q=${station.lat},${station.lng}&zoom=15`;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return createPortal(
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 20, background: 'rgba(9,9,11,0.6)', backdropFilter: 'blur(4px)',
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%', maxWidth: 480, background: tokens.surface, borderRadius: 16,
          border: `1px solid ${tokens.border}`, boxShadow: '0 24px 60px rgba(0,0,0,0.4)', overflow: 'hidden',
          fontFamily: "'Manrope', sans-serif",
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10, padding: '16px 16px 0' }}>
          <div style={{ fontSize: 15.5, fontWeight: 800, color: tokens.text, lineHeight: 1.3 }}>{station.name}</div>
          <button
            onClick={onClose}
            aria-label="Close"
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', width: 28, height: 28, flexShrink: 0,
              background: tokens.chipBg, color: tokens.sub, border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 15,
            }}
          >
            ✕
          </button>
        </div>
        <div style={{ fontSize: 12.5, fontWeight: 500, color: tokens.sub, padding: '3px 16px 0' }}>
          {station.area}{station.area && station.city ? ', ' : ''}{station.city}
        </div>
        {locating && (
          <div style={{ fontSize: 12, fontWeight: 600, color: tokens.accent, padding: '6px 16px 0' }}>
            Locating you for turn-by-turn directions…
          </div>
        )}
        {locateFailed && (
          <div style={{ fontSize: 12, fontWeight: 600, color: tokens.sub, padding: '6px 16px 0' }}>
            Showing location only — enable location access for a driving route preview.
          </div>
        )}

        {GOOGLE_MAPS_API_KEY ? (
          <iframe
            title={origin ? `Directions preview — ${station.name}` : `Map preview — ${station.name}`}
            width="100%"
            height="260"
            style={{ border: 0, display: 'block', marginTop: 14 }}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            src={embedSrc}
          />
        ) : (
          <div style={{ height: 120, display: 'flex', alignItems: 'center', justifyContent: 'center', color: tokens.muted, fontSize: 13, fontWeight: 600, marginTop: 14 }}>
            Map preview unavailable
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 7, padding: 16 }}>
          <a
            href={dirs}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', background: tokens.accentBtn,
              color: tokens.accentBtnText, borderRadius: 9, padding: '10px 14px', fontSize: 13.5, fontWeight: 800,
              textDecoration: 'none',
            }}
          >
            Get directions in Google Maps
          </a>
          <a
            href={openInMaps}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: tokens.accent, fontSize: 13, fontWeight: 700, textDecoration: 'none' }}
          >
            Open location in Google Maps ↗
          </a>
        </div>
      </div>
    </div>,
    document.body
  );
};

// ── Map lifecycle helper (runs inside MapContainer) ───────────────────────
const MapViewController: React.FC<{
  userLocation: { lat: number; lng: number } | null;
  regionCenter: [number, number];
  regionZoom: number;
}> = ({ userLocation, regionCenter, regionZoom }) => {
  const map = useMap();

  // Drop Leaflet's own "Leaflet" flag-credit prefix from the attribution bar —
  // we still keep the required OSM/CARTO/OpenChargeMap credits below.
  useEffect(() => {
    map.attributionControl?.setPrefix(false);
  }, [map]);

  // MapContainer's center/zoom props are only read once at mount by
  // react-leaflet, so switching regions has to go through setView — kept as
  // its own effect (independent from the userLocation one below) so a region
  // switch always recenters even if a stale userLocation lingers.
  useEffect(() => {
    map.setView(regionCenter, regionZoom, { animate: true });
  }, [regionCenter, regionZoom, map]);

  useEffect(() => {
    if (userLocation) {
      map.setView([userLocation.lat, userLocation.lng], 12, { animate: true });
    }
  }, [userLocation, map]);

  // The map card's height changes across breakpoints and can mount before the
  // surrounding layout has settled, so nudge Leaflet to recompute its size a
  // few times shortly after mount/resize (mirrors the design's ResizeObserver).
  useEffect(() => {
    const timers = [120, 400, 900].map((delay) => window.setTimeout(() => map.invalidateSize(), delay));
    return () => timers.forEach((t) => window.clearTimeout(t));
  }, [map]);

  return null;
};

// ── Small style helpers (mirror the design's chip()/segBtn() helpers) ────
function chipStyle(active: boolean, t: ThemeTokens): React.CSSProperties {
  return {
    background: active ? t.chipActiveBg : t.surface,
    color: active ? t.chipActiveText : t.sub,
    border: `1px solid ${active ? t.chipActiveBg : t.border}`,
    borderRadius: 10,
    padding: '9px 13px',
    fontFamily: "'Manrope', sans-serif",
    fontSize: 13.5,
    fontWeight: 700,
    cursor: 'pointer',
  };
}

function segBtnStyle(active: boolean, t: ThemeTokens): React.CSSProperties {
  return {
    display: 'flex', alignItems: 'center', justifyContent: 'center', width: 34, height: 32,
    background: active ? t.accentBtn : 'transparent', color: active ? t.accentBtnText : t.sub,
    border: 'none', borderRadius: 8, cursor: 'pointer',
  };
}

type ThemeMode = 'light' | 'system' | 'dark';
type StatusFilter = 'all' | 'available';
type TypeFilter = 'all' | 'dc' | 'ac';

const FindEVChargers: React.FC = () => {
  // Theme (self-contained on this page — the rest of the site is light-only)
  const [themeMode, setThemeMode] = useState<ThemeMode>(() => {
    try {
      return (localStorage.getItem('evchamp-theme') as ThemeMode) || 'light';
    } catch {
      return 'light';
    }
  });
  const [systemDark, setSystemDark] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    setSystemDark(mq.matches);
    const handler = (e: MediaQueryListEvent) => setSystemDark(e.matches);
    if (mq.addEventListener) mq.addEventListener('change', handler);
    else mq.addListener(handler);
    return () => {
      if (mq.removeEventListener) mq.removeEventListener('change', handler);
      else mq.removeListener(handler);
    };
  }, []);

  const resolvedDark = themeMode === 'system' ? systemDark : themeMode === 'dark';
  const tokens = useMemo(() => getTokens(resolvedDark), [resolvedDark]);

  const setTheme = (mode: ThemeMode) => {
    try {
      localStorage.setItem('evchamp-theme', mode);
    } catch {
      /* localStorage unavailable (private mode etc.) — theme just won't persist */
    }
    setThemeMode(mode);
  };

  // Responsive breakpoints
  const [vw, setVw] = useState(() => (typeof window !== 'undefined' ? window.innerWidth : 1200));
  useEffect(() => {
    const onResize = () => setVw(window.innerWidth);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);
  const mobile = vw < 640;
  const tablet = vw >= 640 && vw < 1024;

  // Station data — EVChamp's own network (CSV) + OpenChargeMap (backend proxy)
  interface CsvGroup {
    name: string; address: string; city: string; state: string;
    lat: number; lng: number; stationStatus: string; evseStatuses: string[]; evseIds: string[];
  }
  interface LiveConnInfo { charging: boolean; dc: boolean | null; approxKw: number | null; lastSeen?: string }

  const [csvGroups, setCsvGroups] = useState<CsvGroup[]>([]);
  const [ocmStations, setOcmStations] = useState<Station[]>([]);
  const [regionId, setRegionId] = useState<RegionId>(DEFAULT_REGION);
  const currentRegion = useMemo(() => REGIONS.find((r) => r.id === regionId) ?? REGIONS[0], [regionId]);
  // Live per-EVSE telemetry from EVChamp's charjkaro CMS — used to infer real
  // AC/DC connector type + power for EVChamp's own network, since the CSV
  // export itself has no connector-type column (see extractConnectorInfo on
  // the backend for how dc/approxKw are derived from OCPP MeterValues).
  const [liveStatus, setLiveStatus] = useState<Record<string, LiveConnInfo>>({});

  useEffect(() => {
    const parseCsvLine = (line: string): string[] => {
      const cols: string[] = [];
      let current = '';
      let inQuotes = false;
      for (let i = 0; i < line.length; i++) {
        const ch = line[i];
        if (ch === '"') {
          if (inQuotes && line[i + 1] === '"') { current += '"'; i++; }
          else inQuotes = !inQuotes;
        } else if (ch === ',' && !inQuotes) { cols.push(current.trim()); current = ''; }
        else current += ch;
      }
      cols.push(current.trim());
      return cols;
    };

    fetch('/device_locations_api-stations.csv')
      .then((res) => res.text())
      .then((csvText) => {
        const lines = csvText.replace(/\r/g, '').split('\n').filter((l) => l.trim());
        if (lines.length <= 1) { return; }
        const headers = parseCsvLine(lines[0]);
        const stationIdIdx = headers.indexOf('Station ID');
        const stationNameIdx = headers.indexOf('Station Name');
        const evseIdIdx = headers.indexOf('EVSE ID');
        const addressIdx = headers.indexOf('Address');
        const cityIdx = headers.indexOf('City');
        const stateIdx = headers.indexOf('State');
        const latIdx = headers.indexOf('Latitude');
        const lngIdx = headers.indexOf('Longitude');
        const stationStatusIdx = headers.indexOf('Station Status');
        const evseStatusIdx = headers.indexOf('EVSE Status');

        const grouped = new Map<string, CsvGroup>();

        for (let i = 1; i < lines.length; i++) {
          const cols = parseCsvLine(lines[i]);
          const lat = parseFloat(cols[latIdx]);
          const lng = parseFloat(cols[lngIdx]);
          if (Number.isNaN(lat) || Number.isNaN(lng)) continue;
          const key = `${cols[stationIdIdx] || cols[stationNameIdx]}-${lat}-${lng}`;
          const evseStatus = cols[evseStatusIdx] || 'Unknown';
          const evseId = cols[evseIdIdx] || '';
          if (!grouped.has(key)) {
            grouped.set(key, {
              name: cols[stationNameIdx] || 'Charging Station',
              address: cols[addressIdx] || '',
              city: cols[cityIdx] || '',
              state: cols[stateIdx] || '',
              lat, lng,
              stationStatus: cols[stationStatusIdx] || 'Available',
              evseStatuses: [evseStatus],
              evseIds: evseId ? [evseId] : [],
            });
          } else {
            const g = grouped.get(key)!;
            g.evseStatuses.push(evseStatus);
            if (evseId) g.evseIds.push(evseId);
          }
        }

        setCsvGroups(Array.from(grouped.values()));
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    // EVChamp's live charging status, proxied server-side (charjkaro CMS) and
    // cached ~5 min there — refetch on the same cadence to stay current.
    const load = () => {
      fetch('/api/evchamp-live-status')
        .then((res) => res.json())
        .then((data) => {
          if (data?.statuses && typeof data.statuses === 'object') {
            setLiveStatus(data.statuses);
          }
        })
        .catch(() => {});
    };
    load();
    const interval = setInterval(load, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  // Combine the CSV's station metadata with charjkaro's live per-EVSE
  // telemetry: derive a real "DC Fast"/"AC" connector label (with power)
  // whenever we've observed at least one charging session for that EVSE ID,
  // falling back to the generic placeholder otherwise.
  const csvStations = useMemo<Station[]>(() => csvGroups.map((s, idx) => {
    const { status, free, total } = deriveCsvStatus(s.stationStatus, s.evseStatuses);
    const connLabels = new Map<string, StationConn>();
    for (const evseId of s.evseIds) {
      const info = liveStatus[evseId];
      if (!info || info.dc === null) continue;
      const kw = info.approxKw ? `${info.approxKw} kW` : '';
      const label = kw ? `${info.dc ? 'DC Fast' : 'AC Type 2'} · ${kw}` : (info.dc ? 'DC Fast' : 'AC Type 2');
      connLabels.set(label, { label, dc: info.dc });
    }
    const conns = connLabels.size
      ? Array.from(connLabels.values())
      // EVChamp's own network CSV has no connector type, power rating, or
      // tariff data, and this EVSE has never been observed charging — default
      // to a generic label so it still surfaces under the "All"/"AC" filters.
      : [{ label: 'Charging point', dc: false }];
    return {
      id: `evc-${idx}`,
      name: s.name,
      area: s.address || s.name,
      city: [s.city, s.state].filter(Boolean).join(', '),
      lat: s.lat,
      lng: s.lng,
      status,
      free,
      total,
      cost: 'Tariff on site',
      conns,
    };
  }), [csvGroups, liveStatus]);

  useEffect(() => {
    // Regional OpenChargeMap listing, proxied server-side (cached ~1hr per
    // region) so the API key stays secret and we're not subject to anonymous
    // rate limits. Re-runs whenever the selected region changes.
    fetch(`/api/ocm-chargers?region=${regionId}`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data?.stations)) {
          const valid = (data.stations as Station[]).filter((s) => Number.isFinite(s.lat) && Number.isFinite(s.lng));
          setOcmStations(valid);
        }
      })
      .catch(() => {});
  }, [regionId]);

  // "Use my location"
  const [locating, setLocating] = useState(false);
  const [located, setLocated] = useState(false);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  // Station whose directions preview modal is open (null = closed)
  const [previewStation, setPreviewStation] = useState<Station | null>(null);

  const handleLocateMe = () => {
    if (!navigator.geolocation) return;
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude: lat, longitude: lng } = pos.coords;
        setUserLocation({ lat, lng });
        setLocated(true);
        setLocating(false);
        // Refetch OCM scoped to the user's location so nearby public
        // chargers outside the cached nationwide snapshot also show up.
        // Location-scoped requests drop the country/region filter entirely
        // on the backend (lat/lng + radius is a better filter than a
        // country boundary), so no `region` param is needed here.
        fetch(`/api/ocm-chargers?lat=${lat}&lng=${lng}&radiusKm=50`)
          .then((res) => res.json())
          .then((data) => {
            if (Array.isArray(data?.stations)) {
              const valid = (data.stations as Station[]).filter((s) => Number.isFinite(s.lat) && Number.isFinite(s.lng));
              setOcmStations(valid);
            }
          })
          .catch(() => {});
      },
      () => setLocating(false),
      { timeout: 8000 }
    );
  };

  // Search + filters
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query); // keeps typing responsive while ~3k markers re-cluster
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('all');

  // Region switch resets search/filters (stale text or an out-of-region
  // location pin would look broken when browsing a different region) and
  // always deterministically recenters the map to the new region.
  const handleRegionChange = (id: RegionId) => {
    if (id === regionId) return;
    setRegionId(id);
    setQuery('');
    setStatusFilter('all');
    setTypeFilter('all');
    setUserLocation(null);
    setLocated(false);
  };

  // EVChamp's own network (CSV) is India-only — only include it for regions
  // that have EVChamp coverage; other regions show OpenChargeMap data only.
  const allStations = useMemo(
    () => (currentRegion.hasEvchampNetwork ? [...csvStations, ...ocmStations] : ocmStations),
    [csvStations, ocmStations, currentRegion]
  );

  const filteredStations = useMemo(() => {
    const q = deferredQuery.trim().toLowerCase();
    return allStations
      .filter((st) => !q || `${st.name} ${st.area} ${st.city}`.toLowerCase().includes(q))
      .filter((st) => statusFilter === 'all' || st.status === 'available')
      .filter((st) => typeFilter === 'all' || st.conns.some((c) => (typeFilter === 'dc' ? c.dc : !c.dc)));
  }, [allStations, deferredQuery, statusFilter, typeFilter]);

  // Icons — rebuilt only when the theme changes, then reused across markers.
  const pinIcons = useMemo(
    () => ({
      available: buildPinIcon('available', tokens),
      busy: buildPinIcon('busy', tokens),
      offline: buildPinIcon('offline', tokens),
    }),
    [tokens]
  );
  const clusterIconCreateFn = useMemo(() => buildClusterIconFactory(tokens), [tokens]);

  // Rebuilding the cluster group from scratch (via `key`) on every theme or
  // data change avoids corrupting Leaflet.markercluster's internal spatial
  // index, which the design explicitly calls out as required.
  const clusterKey = useMemo(
    () => `${resolvedDark ? 'dark' : 'light'}|${filteredStations.map((s) => s.id).join(',')}`,
    [resolvedDark, filteredStations]
  );

  return (
    <>
      <Helmet>
        <title>Find EV Chargers | Discover Charging Stations Near You | EVChamp</title>
        <meta name="description" content="Find EV charging stations near you with real-time availability, directions, and navigation. Discover the fastest route to charge your electric vehicle across India." />
        <meta name="keywords" content="find EV chargers, charging stations near me, EV charging network, electric vehicle charging, charging station locator" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      </Helmet>

      {/* Announcement bar — mirrors the Ze.Xperience F77 announcement strip style.
          Rendered outside the padded page wrapper below so it's truly full-bleed
          edge-to-edge, matching Ze.Xperience (whose bar sits outside its padded
          content too), rather than inheriting the page's horizontal padding. */}
      <style>{`
        @keyframes evc-announce-pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(0.72); }
        }
        @keyframes evc-marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
      `}</style>
      <div
        style={{
          width: '100%',
          display: 'flex',
          flexWrap: 'nowrap',
          alignItems: 'center',
          overflow: 'hidden',
          padding: mobile ? '9px 0' : '9px 0',
          color: '#ffffff',
          background: 'linear-gradient(100deg, #13267a, #1f4fd0 60%, #2a6fe0)',
          boxShadow: 'inset 0 -1px 0 rgba(0,0,0,0.12)',
          fontFamily: "'Manrope', sans-serif",
        }}
      >
        {/* Always a flowing ticker, on every screen size — the combined
            message + pill + CPO line is long enough that no single-line
            width can hold it, so it flows instead of wrapping. Two identical
            copies back to back + translateX(-50%) is the standard
            seamless-loop marquee trick: each copy (incl. its own trailing
            margin) is exactly half the track's width, so the loop point
            shows no jump. */}
        <div style={{ display: 'flex', width: 'max-content', animation: 'evc-marquee 26s linear infinite' }}>
          {[0, 1].map((i) => (
            <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 10, whiteSpace: 'nowrap', marginRight: 36, paddingLeft: 16 }}>
              <span
                style={{
                  width: 8, height: 8, borderRadius: '50%', flexShrink: 0,
                  background: 'rgba(255,255,255,0.92)', boxShadow: '0 0 0 3px rgba(255,255,255,0.25)',
                  animation: 'evc-announce-pulse 2.2s ease-in-out infinite',
                }}
              />
              <span style={{ opacity: 0.95, fontSize: mobile ? 12.5 : 13.5, fontWeight: 700, letterSpacing: '0.2px' }}>
                EVChamp-Pay coming soon for fast and secure payment with just a QR code — using credit cards or UPI.
              </span>
              <span
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6, whiteSpace: 'nowrap',
                  borderRadius: 999, border: '1px solid rgba(130,190,240,0.35)',
                  background: 'linear-gradient(180deg, rgba(50,95,145,0.95) 0%, rgba(12,30,52,0.95) 100%)',
                  boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.28), inset 0 -8px 14px rgba(0,0,0,0.45), 0 2px 8px rgba(0,0,0,0.35)',
                  color: '#bfe3ff', padding: '5px 16px', fontSize: mobile ? 12 : 12.5, fontWeight: 700,
                }}
              >
                <span aria-hidden style={{ fontSize: 12 }}>✦</span> Launching Soon
              </span>
              <span aria-hidden style={{ opacity: 0.5 }}>•</span>
              <span style={{ opacity: 0.95, fontSize: mobile ? 12.5 : 13.5, fontWeight: 700, letterSpacing: '0.2px' }}>
                CPOs — contact us to list your charger locations and register for EVChamp-Pay.
              </span>
              <a
                href="/contact"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 5, whiteSpace: 'nowrap',
                  borderRadius: 20, background: '#ffffff', color: '#1f4fd0',
                  padding: '4px 13px', fontSize: mobile ? 12 : 12.5, fontWeight: 800, textDecoration: 'none',
                }}
              >
                Contact us <span aria-hidden>›</span>
              </a>
            </span>
          ))}
        </div>
      </div>

      <div
        style={{
          minHeight: '100vh',
          background: tokens.bg,
          fontFamily: "'Manrope', sans-serif",
          color: tokens.text,
          padding: mobile ? '16px 16px 40px' : tablet ? '20px 24px 48px' : '24px 32px 56px',
          transition: 'background .25s, color .25s',
        }}
      >
        <div style={{ maxWidth: 1120, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap', marginBottom: 22 }}>
            <div style={{ marginRight: 'auto' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6, flexWrap: 'wrap' }}>
                <span style={{ fontSize: 11.5, fontWeight: 800, letterSpacing: '2.5px', color: tokens.accent }}>
                  EVCHAMP · CHARGING NETWORK
                </span>
              </div>
              <h1 style={{ fontSize: mobile ? 20 : tablet ? 23 : 26, fontWeight: 800, margin: 0, color: tokens.text, letterSpacing: '-0.5px' }}>
                Find EV chargers near you{' '}
                <span
                  style={{
                    display: mobile ? 'block' : 'inline', fontSize: mobile ? 13 : 14, fontWeight: 600,
                    color: tokens.sub, marginLeft: mobile ? 0 : 8, marginTop: mobile ? 4 : 0,
                  }}
                >
                  {filteredStations.length} of {allStations.length} stations
                </span>
              </h1>
              {!currentRegion.hasEvchampNetwork && (
                <div style={{ fontSize: 12.5, fontWeight: 600, color: tokens.sub, marginTop: 4 }}>
                  Showing public OpenChargeMap listings only — EVChamp's own network isn't live in this region yet.
                </div>
              )}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', gap: 2, background: tokens.surface, border: `1px solid ${tokens.border}`, borderRadius: 10, padding: 3 }}>
                <button onClick={() => setTheme('light')} title="Light" style={segBtnStyle(themeMode === 'light', tokens)}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round">
                    <circle cx="12" cy="12" r="4"></circle>
                    <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"></path>
                  </svg>
                </button>
                <button onClick={() => setTheme('system')} title="System" style={segBtnStyle(themeMode === 'system', tokens)}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round">
                    <rect x="3" y="4" width="18" height="12" rx="2"></rect>
                    <path d="M8 20h8M12 16v4"></path>
                  </svg>
                </button>
                <button onClick={() => setTheme('dark')} title="Dark" style={segBtnStyle(themeMode === 'dark', tokens)}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round">
                    <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"></path>
                  </svg>
                </button>
              </div>
              <button
                onClick={handleLocateMe}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, background: tokens.accentBtn,
                  color: tokens.accentBtnText, border: 'none', borderRadius: 10, padding: '10px 16px',
                  fontFamily: "'Manrope', sans-serif", fontSize: 14, fontWeight: 800, cursor: 'pointer',
                  flex: mobile ? '1 1 auto' : '0 0 auto',
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round">
                  <circle cx="12" cy="12" r="3"></circle>
                  <path d="M12 2v3M12 19v3M2 12h3M19 12h3"></path>
                  <circle cx="12" cy="12" r="8"></circle>
                </svg>
                {locating ? 'Locating…' : located ? 'Location set' : 'Use my location'}
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginBottom: 14, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: tokens.sub, marginRight: 4 }}>Region:</span>
            {REGIONS.map((r) => (
              <button key={r.id} onClick={() => handleRegionChange(r.id)} style={chipStyle(regionId === r.id, tokens)}>
                {r.label}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center', marginBottom: 16 }}>
            <div
              style={{
                display: 'flex', alignItems: 'center', gap: 10, background: tokens.surface, border: `1px solid ${tokens.border}`,
                borderRadius: 10, padding: '9px 14px', width: mobile ? '100%' : 'calc(40ch + 64px)', flex: mobile ? '1 1 100%' : '0 0 auto',
                boxSizing: 'border-box',
              }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={tokens.muted} strokeWidth={2.2} strokeLinecap="round">
                <circle cx="11" cy="11" r="7"></circle>
                <path d="M21 21l-4.3-4.3"></path>
              </svg>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search country, city or charger company…"
                style={{ flex: 1, minWidth: 0, background: 'transparent', border: 'none', outline: 'none', color: tokens.text, fontFamily: "'Manrope', sans-serif", fontSize: 16, fontWeight: 500 }}
              />
            </div>
            <div style={{ display: 'flex', gap: 6, marginLeft: mobile ? 0 : 'auto', flexWrap: 'wrap', flex: mobile ? '1 1 100%' : '0 0 auto' }}>
              <button
                onClick={() => { setStatusFilter('all'); setTypeFilter('all'); }}
                style={chipStyle(statusFilter === 'all' && typeFilter === 'all', tokens)}
              >
                All
              </button>
              <button
                onClick={() => setStatusFilter(statusFilter === 'available' ? 'all' : 'available')}
                style={chipStyle(statusFilter === 'available', tokens)}
              >
                Available now
              </button>
              <button
                onClick={() => setTypeFilter(typeFilter === 'dc' ? 'all' : 'dc')}
                style={chipStyle(typeFilter === 'dc', tokens)}
              >
                DC fast
              </button>
              <button
                onClick={() => setTypeFilter(typeFilter === 'ac' ? 'all' : 'ac')}
                style={chipStyle(typeFilter === 'ac', tokens)}
              >
                AC
              </button>
            </div>
          </div>

          <div
            style={{
              position: 'relative', height: mobile ? 380 : tablet ? 460 : 520, borderRadius: mobile ? 14 : 18,
              overflow: 'hidden', border: `1px solid ${tokens.border}`,
              boxShadow: tokens.dark ? '0 24px 60px rgba(0,0,0,0.5)' : '0 20px 50px rgba(15,33,51,0.14)',
            }}
          >
            <MapContainer center={REGIONS[0].center} zoom={REGIONS[0].zoom} style={{ height: '100%', width: '100%' }}>
              <TileLayer
                key={tokens.dark ? 'dark-tiles' : 'light-tiles'}
                url={tokens.tiles}
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a> | Charger data &copy; <a href="https://openchargemap.org">Open Charge Map</a> contributors'
              />
              <MapViewController userLocation={userLocation} regionCenter={currentRegion.center} regionZoom={currentRegion.zoom} />
              <MarkerClusterGroup
                key={clusterKey}
                showCoverageOnHover={false}
                maxClusterRadius={55}
                spiderfyOnMaxZoom
                animate={false}
                animateAddingMarkers={false}
                chunkedLoading={false}
                removeOutsideVisibleBounds={false}
                iconCreateFunction={clusterIconCreateFn}
              >
                {filteredStations.map((st) => (
                  <Marker key={st.id} position={[st.lat, st.lng]} icon={pinIcons[st.status]}>
                    <Popup minWidth={268} maxWidth={268} closeButton>
                      <StationPopup station={st} tokens={tokens} onPreview={() => setPreviewStation(st)} />
                    </Popup>
                  </Marker>
                ))}
              </MarkerClusterGroup>
              {userLocation && (
                <CircleMarker
                  center={[userLocation.lat, userLocation.lng]}
                  radius={8}
                  pathOptions={{ color: '#3b82f6', weight: 3, fillColor: '#3b82f6', fillOpacity: 0.35 }}
                >
                  <Tooltip>You are here</Tooltip>
                </CircleMarker>
              )}
            </MapContainer>

            <div
              style={{
                position: 'absolute', left: mobile ? 10 : 14, bottom: mobile ? 10 : 14, zIndex: 1000,
                background: tokens.surfaceGlass, backdropFilter: 'blur(8px)', border: `1px solid ${tokens.border}`,
                borderRadius: 12, padding: mobile ? '9px 12px' : '11px 14px', display: 'flex',
                flexDirection: mobile ? 'row' : 'column', flexWrap: 'wrap', gap: mobile ? 12 : 8,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, fontWeight: 700, color: tokens.sub }}>
                <span style={{ width: 9, height: 9, borderRadius: 99, background: tokens.avail }} />
                Available
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, fontWeight: 700, color: tokens.sub }}>
                <span style={{ width: 9, height: 9, borderRadius: 99, background: tokens.busy }} />
                Busy
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, fontWeight: 700, color: tokens.sub }}>
                <span style={{ width: 9, height: 9, borderRadius: 99, background: tokens.off }} />
                Offline
              </div>
            </div>
          </div>

          {/* Below-map info section — creative recap of what makes this map worth trusting */}
          <div style={{ marginTop: 32 }}>
            <div style={{ textAlign: 'center', marginBottom: 20 }}>
              <span style={{ fontSize: 11.5, fontWeight: 800, letterSpacing: '2.5px', color: tokens.accent }}>
                WHY EVCHAMP
              </span>
              <h2 style={{ fontSize: mobile ? 18 : 22, fontWeight: 800, margin: '8px 0 6px', color: tokens.text, letterSpacing: '-0.4px' }}>
                More than pins on a map.
              </h2>
              <p style={{ fontSize: 13.5, fontWeight: 500, color: tokens.sub, maxWidth: 560, margin: '0 auto', lineHeight: 1.6 }}>
                Every charger here is live data, not a static listing — so what you see is what you'll actually find when you arrive.
              </p>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: mobile ? '1fr' : tablet ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)',
                gap: 14,
              }}
            >
              {[
                {
                  title: 'Live, not static',
                  desc: "Pins update from real charger telemetry — green means genuinely free right now, not just listed.",
                  icon: (
                    <path d="M13 2L4 14h6l-1 8 9-12h-6l1-8z" />
                  ),
                },
                {
                  title: 'One tap to arrive',
                  desc: 'Every station opens straight into Google Maps for turn-by-turn directions — no copy-pasting addresses.',
                  icon: (
                    <>
                      <circle cx="12" cy="12" r="10" />
                      <path d="M16.2 7.8l-2.1 6.3-6.3 2.1 2.1-6.3z" />
                    </>
                  ),
                },
                {
                  title: 'Filter your way',
                  desc: 'Narrow down by availability or connector type — DC fast for a quick top-up, AC for an overnight charge.',
                  icon: (
                    <>
                      <path d="M4 6h16M4 12h16M4 18h16" />
                      <circle cx="9" cy="6" r="1.6" fill={tokens.accent} stroke="none" />
                      <circle cx="16" cy="12" r="1.6" fill={tokens.accent} stroke="none" />
                      <circle cx="10" cy="18" r="1.6" fill={tokens.accent} stroke="none" />
                    </>
                  ),
                },
                {
                  title: 'Three regions and growing',
                  desc: "From India to the Gulf and Southeast Asia — we're mapping the charging world one plug at a time.",
                  icon: (
                    <>
                      <circle cx="12" cy="12" r="9" />
                      <path d="M3 12h18M12 3c2.5 2.5 3.8 5.7 3.8 9s-1.3 6.5-3.8 9c-2.5-2.5-3.8-5.7-3.8-9s1.3-6.5 3.8-9z" />
                    </>
                  ),
                },
              ].map((card) => (
                <div
                  key={card.title}
                  style={{
                    background: tokens.surface, border: `1px solid ${tokens.border}`, borderRadius: 14,
                    padding: '18px 16px', transition: 'transform .2s, box-shadow .2s',
                  }}
                >
                  <div
                    style={{
                      width: 34, height: 34, borderRadius: 10, background: tokens.chipBg,
                      display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12,
                    }}
                  >
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke={tokens.accent} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                      {card.icon}
                    </svg>
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 800, color: tokens.text, marginBottom: 4 }}>{card.title}</div>
                  <div style={{ fontSize: 12.5, fontWeight: 500, color: tokens.sub, lineHeight: 1.55 }}>{card.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {previewStation && (
        <DirectionsModal station={previewStation} tokens={tokens} userLocation={userLocation} onClose={() => setPreviewStation(null)} />
      )}

      <Footer />
    </>
  );
};

export default FindEVChargers;
