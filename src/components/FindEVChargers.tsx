import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Footer from '../Footer';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import L from 'leaflet';
import 'leaflet-routing-machine';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

// ── Routing control component (renders inside MapContainer) ──
interface RoutingProps {
  destination: [number, number] | null;
  onClear: () => void;
}

const RoutingControl: React.FC<RoutingProps> = ({ destination, onClear }) => {
  const map = useMap();
  const routingRef = useRef<any>(null);
  const vehicleMarkerRef = useRef<L.Marker | null>(null);
  const watchIdRef = useRef<number | null>(null);
  const [status, setStatus] = useState<'idle' | 'locating' | 'ready' | 'navigating' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  // Vehicle emoji icon
  const vehicleIcon = L.divIcon({
    html: '<div style="font-size:26px;line-height:1;filter:drop-shadow(0 2px 4px rgba(0,0,0,0.35));">🚗</div>',
    className: '',
    iconSize: [30, 30],
    iconAnchor: [15, 15],
  });

  const stopNavigation = useCallback(() => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    if (vehicleMarkerRef.current) {
      vehicleMarkerRef.current.remove();
      vehicleMarkerRef.current = null;
    }
  }, []);

  const clearAll = useCallback(() => {
    stopNavigation();
    if (routingRef.current) {
      map.removeControl(routingRef.current);
      routingRef.current = null;
    }
    setStatus('idle');
    setErrorMsg('');
    onClear();
  }, [map, onClear, stopNavigation]);

  const startNavigation = useCallback(() => {
    setStatus('navigating');

    // Add vehicle marker at current position
    navigator.geolocation.getCurrentPosition((pos) => {
      const latlng = L.latLng(pos.coords.latitude, pos.coords.longitude);

      if (vehicleMarkerRef.current) {
        vehicleMarkerRef.current.remove();
      }
      const marker = L.marker(latlng, { icon: vehicleIcon, zIndexOffset: 1000 });
      marker.addTo(map);
      vehicleMarkerRef.current = marker;
      map.setView(latlng, 15, { animate: true });

      // Watch position and move vehicle
      watchIdRef.current = navigator.geolocation.watchPosition(
        (p) => {
          const newLatLng = L.latLng(p.coords.latitude, p.coords.longitude);
          if (vehicleMarkerRef.current) {
            vehicleMarkerRef.current.setLatLng(newLatLng);
          }
          map.panTo(newLatLng, { animate: true });
        },
        () => {},
        { enableHighAccuracy: true, maximumAge: 2000, timeout: 10000 }
      );
    }, () => {}, { enableHighAccuracy: true });
  }, [map, vehicleIcon]);

  useEffect(() => {
    if (!destination) {
      stopNavigation();
      if (routingRef.current) {
        map.removeControl(routingRef.current);
        routingRef.current = null;
      }
      setStatus('idle');
      return;
    }

    setStatus('locating');
    setErrorMsg('');

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const userLatLng = L.latLng(pos.coords.latitude, pos.coords.longitude);
        const destLatLng = L.latLng(destination[0], destination[1]);

        if (routingRef.current) {
          map.removeControl(routingRef.current);
        }

        const control = (L as any).Routing.control({
          waypoints: [userLatLng, destLatLng],
          router: (L as any).Routing.osrmv1({
            serviceUrl: 'https://router.project-osrm.org/route/v1',
            profile: 'driving',
          }),
          lineOptions: {
            styles: [{ color: '#22c55e', weight: 5, opacity: 0.85 }],
            extendToWaypoints: true,
            missingRouteTolerance: 0,
          },
          addWaypoints: false,
          draggableWaypoints: false,
          fitSelectedRoutes: true,
          showAlternatives: false,
          show: false,           // hide turn-by-turn instruction panel
          collapsible: false,
          createMarker: (i: number, wp: any) => {
            if (i === 0) return null; // user position — handled by vehicle emoji
            const icon = L.divIcon({
              html: '<div style="font-size:26px;line-height:1;filter:drop-shadow(0 2px 4px rgba(0,0,0,0.3));">⚡</div>',
              className: '', iconSize: [30, 30], iconAnchor: [15, 30],
            });
            return L.marker(wp.latLng, { icon });
          },
        });

        control.addTo(map);
        routingRef.current = control;

        control.on('routesfound', () => setStatus('ready'));
        control.on('routingerror', () => {
          setStatus('error');
          setErrorMsg('Could not find a route. Try a different station.');
        });
      },
      () => {
        setStatus('error');
        setErrorMsg('Location access denied. Please allow location to get directions.');
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );

    return () => {
      stopNavigation();
      if (routingRef.current) {
        map.removeControl(routingRef.current);
        routingRef.current = null;
      }
    };
  }, [destination, map, stopNavigation]);

  if (status === 'idle') return null;

  return (
    <div style={{
      position: 'absolute', top: 12, left: '50%', transform: 'translateX(-50%)',
      zIndex: 1000, background: 'white', borderRadius: 12, padding: '9px 16px',
      boxShadow: '0 3px 14px rgba(0,0,0,0.2)', display: 'flex', alignItems: 'center',
      gap: 10, fontSize: 13, fontWeight: 500, whiteSpace: 'nowrap',
    }}>
      {status === 'locating' && (
        <><span style={{ color: '#22c55e' }}>📍</span> Getting your location…</>
      )}
      {status === 'ready' && (
        <>
          <span style={{ color: '#22c55e' }}>🗺️</span> Route ready —
          <button
            onClick={startNavigation}
            style={{
              background: '#22c55e', color: 'white', border: 'none', borderRadius: 7,
              padding: '5px 14px', cursor: 'pointer', fontSize: 12, fontWeight: 700,
              display: 'flex', alignItems: 'center', gap: 5,
            }}
          >
            🚗 Start Navigation
          </button>
        </>
      )}
      {status === 'navigating' && (
        <><span>🚗</span> Navigating… follow the green route</>
      )}
      {status === 'error' && (
        <><span style={{ color: '#ef4444' }}>⚠️</span> {errorMsg}</>
      )}
      <button
        onClick={clearAll}
        style={{
          marginLeft: 4, background: '#f3f4f6', border: 'none', borderRadius: 7,
          padding: '4px 11px', cursor: 'pointer', fontSize: 12, color: '#374151', fontWeight: 600,
        }}
      >
        ✕ Clear
      </button>
    </div>
  );
};

interface Station {
  stationId: string;
  name: string;
  address: string;
  city: string;
  state: string;
  lat: number;
  lng: number;
  stationStatus: string;
  evses: { id: string; status: string }[];
}

const investmentAreas = [
  { icon: '⚡', title: 'Real-Time Availability', desc: 'Check live charging station status and availability instantly.' },
  { icon: '�️', title: 'Smart Navigation', desc: 'Get turn-by-turn directions with optimized routing to your nearest charger.' },
  { icon: '�', title: 'Vehicle Tracking', desc: 'Track your location in real-time as you navigate to charging stations.' },
  { icon: '📊', title: 'Station Details', desc: 'View complete information about charging speeds, facilities, and services.' },
  { icon: '🔋', title: 'EVSE Status', desc: 'Know how many charging points are available at each station.' },
];

const FindEVChargers: React.FC = () => {
  const navigate = useNavigate();
  const [stations, setStations] = useState<Station[]>([]);
  const [loading, setLoading] = useState(true);
  const mapRef = useRef<any>(null);
  const [routeDestination, setRouteDestination] = useState<[number, number] | null>(null);

  useEffect(() => {
    const parseCsvLine = (line: string) => {
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
      .then(res => res.text())
      .then(csvText => {
        const lines = csvText.replace(/\r/g, '').split('\n').filter(l => l.trim());
        if (lines.length <= 1) { setLoading(false); return; }
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
        const grouped = new Map<string, Station>();
        for (let i = 1; i < lines.length; i++) {
          const cols = parseCsvLine(lines[i]);
          const lat = parseFloat(cols[latIdx]);
          const lng = parseFloat(cols[lngIdx]);
          if (!isNaN(lat) && !isNaN(lng)) {
            const stationKey = `${cols[stationIdIdx] || cols[stationNameIdx]}-${lat}-${lng}`;
            const nextEvse = { id: cols[evseIdIdx] || 'N/A', status: cols[evseStatusIdx] || 'Unknown' };
            if (!grouped.has(stationKey)) {
              grouped.set(stationKey, {
                stationId: cols[stationIdIdx] || '',
                name: cols[stationNameIdx] || 'Charging Station',
                address: cols[addressIdx] || '',
                city: cols[cityIdx] || '',
                state: cols[stateIdx] || '',
                lat, lng,
                stationStatus: cols[stationStatusIdx] || 'Unknown',
                evses: [nextEvse],
              });
            } else {
              grouped.get(stationKey)!.evses.push(nextEvse);
            }
          }
        }
        setStations(Array.from(grouped.values()));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);
  const goTo = (route: string) => {
    navigate(route);
    window.scrollTo({ top: 0, behavior: 'auto' });
  };
  const goToContact = () => {
    navigate('/contact');
    window.scrollTo({ top: 0, behavior: 'auto' });
  };
  const goToInvestyzWebsite = () => {
    window.open('https://www.investyz.com', '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="bg-white min-h-screen">
      <Helmet>
        <title>Find EV Chargers | Discover Charging Stations Near You | EVChamp</title>
        <meta name="description" content="Find EV charging stations near you with real-time availability, directions, and navigation. Discover the fastest route to charge your electric vehicle across India." />
        <meta name="keywords" content="find EV chargers, charging stations near me, EV charging network, electric vehicle charging, charging station locator" />
      </Helmet>

      {/* Hero */}
      <section className="relative overflow-hidden text-white bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/60 via-slate-900/45 to-slate-900/30" />
        <div className="relative container mx-auto px-4 sm:px-6 py-16 sm:py-20 text-center max-w-3xl">
          <p className="text-green-400 text-sm font-semibold tracking-wider uppercase mb-3">By EVChamp</p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">Find EV Chargers Near You</h1>
          <p className="text-gray-200 text-base sm:text-lg leading-relaxed mb-6">
            Discover charging stations across India with real-time availability, directions, and instant navigation to get you charging fast.
          </p>
          
          <div className="flex flex-wrap justify-center gap-3">
            <button onClick={() => document.querySelector('[style*="height: 480px"]')?.scrollIntoView({ behavior: 'smooth' })} className="bg-green-500 text-white font-semibold px-6 py-3 rounded-lg hover:bg-green-600 transition-all text-sm">
              Find Chargers
            </button>
            <button onClick={() => goTo('/franchise')} className="border border-white/30 text-white font-semibold px-6 py-3 rounded-lg hover:bg-white/10 transition-all text-sm">
              Partner With Us
            </button>
          </div>
        </div>
      </section>

      {/* Charging Network Map */}
      <section className="bg-gray-50 py-10 sm:py-14">
        <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 text-center mb-6">Find Charging Stations Near You</h2>
          {loading ? (
            <div className="flex justify-center items-center h-64 text-gray-500 text-sm">Loading map…</div>
          ) : (
            <div style={{ height: '480px', width: '100%', borderRadius: '12px', overflow: 'hidden', position: 'relative' }}>
              <MapContainer
                center={[20.5937, 78.9629]}
                zoom={5}
                style={{ height: '100%', width: '100%' }}
                ref={mapRef}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <RoutingControl
                  destination={routeDestination}
                  onClear={() => setRouteDestination(null)}
                />
                {stations.map((station, idx) => (
                  <Marker key={idx} position={[station.lat, station.lng]}>
                    <Popup>
                      <div style={{ minWidth: 180 }}>
                        <strong style={{ fontSize: 13 }}>{station.name}</strong><br />
                        {station.address && <span style={{ fontSize: 11, color: '#555' }}>{station.address}<br /></span>}
                        <span style={{ fontSize: 11, color: '#555' }}>
                          {station.city && <>{station.city}, </>}{station.state}
                        </span><br />
                        <span style={{ color: station.stationStatus === 'Available' ? '#16a34a' : '#888', fontSize: 11, fontWeight: 600 }}>
                          {station.stationStatus}
                        </span>
                        <span style={{ fontSize: 11, color: '#555', marginLeft: 8 }}>{station.evses.length} EVSE(s)</span>
                        <br />
                        <button
                          onClick={() => setRouteDestination([station.lat, station.lng])}
                          style={{
                            marginTop: 8, width: '100%', background: '#22c55e', color: 'white',
                            border: 'none', borderRadius: 6, padding: '6px 0', fontSize: 12,
                            fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center',
                            justifyContent: 'center', gap: 5,
                          }}
                        >
                          ⚡ Get Directions
                        </button>
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            </div>
          )}
          <p className="text-center text-xs text-gray-400 mt-3">{stations.length} stations loaded across India &nbsp;·&nbsp; Click any pin → <strong>Get Directions</strong> to route from your location</p>
        </div>
      </section>

      {/* Features */}
      <section className="bg-white">
        <div className="container mx-auto px-4 sm:px-6 py-12 sm:py-16 max-w-6xl">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center mb-10">Why Use Our Charging Network</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {investmentAreas.map((item) => (
              <div key={item.title} className="p-5 rounded-xl border border-gray-100 hover:border-gray-200 hover:shadow-md transition-all">
                <span className="text-2xl block mb-3">{item.icon}</span>
                <h3 className="text-sm font-bold text-gray-900 mb-1">{item.title}</h3>
                <p className="text-xs text-gray-500 leading-snug">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 py-12 sm:py-16 max-w-6xl">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">How It Works</h2>
          <p className="text-gray-600 text-center leading-relaxed mb-8">
            Our intelligent charging network helps you find the nearest available station, get real-time directions, and navigate safely with live vehicle tracking.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl p-6 border border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 mb-2">📍 Find Nearby Stations</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                View all EV charging stations on an interactive map. See real-time availability, status, and detailed information about each location.
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 border border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 mb-2">🚗 Smart Navigation</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Get optimized turn-by-turn directions, live vehicle tracking, and distance information to reach your charging station faster.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-white">
        <div className="container mx-auto px-4 sm:px-6 py-12 max-w-6xl">
          <h2 className="text-xl font-bold text-gray-900 mb-6 text-center">Frequently Asked Questions</h2>
          <div className="space-y-4">
            <details className="border border-gray-100 rounded-lg p-4 group">
              <summary className="text-sm font-medium text-gray-900 cursor-pointer">How do I find charging stations near me?</summary>
              <p className="mt-2 text-sm text-gray-600">Simply view the interactive map on this page. All EV charging stations across India are displayed with real-time availability status. Click on any station to see details.</p>
            </details>
            <details className="border border-gray-100 rounded-lg p-4 group">
              <summary className="text-sm font-medium text-gray-900 cursor-pointer">Can I get directions to a charging station?</summary>
              <p className="mt-2 text-sm text-gray-600">Yes! Click the "Get Directions" button on any station to activate smart navigation. We'll calculate the optimal route and provide turn-by-turn guidance to your destination.</p>
            </details>
            <details className="border border-gray-100 rounded-lg p-4 group">
              <summary className="text-sm font-medium text-gray-900 cursor-pointer">How accurate is the real-time availability?</summary>
              <p className="mt-2 text-sm text-gray-600">Our data is updated regularly from charging networks across India. Availability status shows whether stations are operational, but we recommend confirming with the station before arriving.</p>
            </details>
            <details className="border border-gray-100 rounded-lg p-4 group">
              <summary className="text-sm font-medium text-gray-900 cursor-pointer">Is the navigation feature free?</summary>
              <p className="mt-2 text-sm text-gray-600">Yes, our charging station finder and navigation service is completely free for all EVChamp users. Just enable location access on your device.</p>
            </details>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section
        className="relative overflow-hidden text-white"
        style={{
          background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 50%, #1e293b 100%)',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/40 via-slate-900/20 to-slate-900/10" />
        <div className="relative container mx-auto px-4 sm:px-6 py-14 text-center max-w-3xl">
          <h2 className="text-2xl font-bold mb-4">Ready to Find Your Nearest Charger?</h2>
          <p className="text-gray-300 text-sm mb-6">Start exploring our network of EV charging stations across India. Get real-time availability and smart directions today.</p>
          <div className="flex flex-wrap justify-center gap-3">
            <button onClick={() => document.querySelector('[style*="height: 480px"]')?.scrollIntoView({ behavior: 'smooth' })} className="bg-green-500 text-white font-semibold px-6 py-3 rounded-lg hover:bg-green-600 transition-all text-sm">
              Explore Map
            </button>
            <button onClick={goToContact} className="border border-white/30 text-white font-semibold px-6 py-3 rounded-lg hover:bg-white/10 transition-all text-sm">
              Contact Us
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default FindEVChargers;
