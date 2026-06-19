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
interface FitMapToStationsProps {
  stations: Station[];
}

const FitMapToStations: React.FC<FitMapToStationsProps> = ({
  stations,
}) => {
  const map = useMap();

  useEffect(() => {
    const validStations = stations.filter(
      station =>
        Number.isFinite(station.lat) &&
        Number.isFinite(station.lng),
    );

    if (validStations.length === 0) {
      return;
    }

    if (validStations.length === 1) {
      map.setView(
        [validStations[0].lat, validStations[0].lng],
        14,
        {
          animate: true,
        },
      );

      return;
    }

    const bounds = L.latLngBounds(
      validStations.map(
        station =>
          [station.lat, station.lng] as [number, number],
      ),
    );

    map.fitBounds(bounds, {
      padding: [40, 40],
      maxZoom: 13,
      animate: true,
    });
  }, [stations, map]);

  return null;
};

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
      <section
      id="charging-station-map"
      className="bg-gray-50 py-10 sm:py-14"
      >
        <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
          <h2 className="text-2xl sm:text-4xl font-bold text-gray-900 text-center mb-6">Find Charging Stations Near You</h2>
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
                <FitMapToStations stations={stations} />
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
        <div className="container mx-auto px-4 sm:px-6 py-14 sm:py-20 max-w-6xl">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <span className="inline-block text-green-600 font-semibold text-sm uppercase tracking-wider mb-3">
              Smarter EV Charging
            </span>

            <h2 className="text-2xl sm:text-4xl font-bold text-gray-900 mb-4">
              Why Choose EVChamp to Find EV Charging Stations Near You?
            </h2>

            <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
              Discover reliable EV charging stations across India with location details,
              charger information, route guidance, and availability updates. EVChamp helps
              electric vehicle owners find suitable charging points quickly and plan every
              journey with greater confidence.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {investmentAreas.map((item) => (
              <div
                key={item.title}
                className="group p-6 rounded-2xl border border-gray-100 bg-white hover:-translate-y-1 hover:border-green-200 hover:shadow-xl transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center mb-4 group-hover:bg-green-100 transition-colors">
                  <span className="text-2xl">{item.icon}</span>
                </div>

                <h3 className="text-base font-bold text-gray-900 mb-2">
                  {item.title}
                </h3>

                <p className="text-sm text-gray-600 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <button
              onClick={() => {
                document
                  .getElementById('charging-station-map')
                  ?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="inline-flex items-center justify-center bg-green-600 text-white font-semibold px-7 py-3.5 rounded-xl hover:bg-green-700 hover:shadow-lg transition-all"
            >
              Find EV Chargers Near Me
            </button>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 py-14 sm:py-20 max-w-6xl">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <span className="inline-block text-green-600 font-semibold text-sm uppercase tracking-wider mb-3">
              Simple and Fast
            </span>

            <h2 className="text-2xl sm:text-4xl font-bold text-gray-900 mb-4">
              Find an EV Charging Station in Three Easy Steps
            </h2>

            <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
              Use the EVChamp charging station finder to locate nearby electric vehicle
              chargers, compare station details, and navigate to your preferred charging
              point without unnecessary delays.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="relative bg-white rounded-2xl p-7 border border-gray-100 shadow-sm hover:shadow-lg transition-all">
              <span className="absolute top-5 right-5 text-5xl font-bold text-gray-100">
                01
              </span>

              <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center text-2xl mb-5">
                📍
              </div>

              <h3 className="text-lg font-bold text-gray-900 mb-3">
                Detect Your Location
              </h3>

              <p className="text-sm text-gray-600 leading-relaxed">
                Enable location access or search by city, area, landmark, or PIN code to
                view EV charging stations near your current location.
              </p>
            </div>

            <div className="relative bg-white rounded-2xl p-7 border border-gray-100 shadow-sm hover:shadow-lg transition-all">
              <span className="absolute top-5 right-5 text-5xl font-bold text-gray-100">
                02
              </span>

              <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center text-2xl mb-5">
                ⚡
              </div>

              <h3 className="text-lg font-bold text-gray-900 mb-3">
                Compare Charging Stations
              </h3>

              <p className="text-sm text-gray-600 leading-relaxed">
                Review station location, charger availability, operating status, distance,
                and other useful details before choosing the most convenient charging point.
              </p>
            </div>

            <div className="relative bg-white rounded-2xl p-7 border border-gray-100 shadow-sm hover:shadow-lg transition-all">
              <span className="absolute top-5 right-5 text-5xl font-bold text-gray-100">
                03
              </span>

              <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center text-2xl mb-5">
                🚗
              </div>

              <h3 className="text-lg font-bold text-gray-900 mb-3">
                Navigate and Start Charging
              </h3>

              <p className="text-sm text-gray-600 leading-relaxed">
                Get route guidance to the selected EV charger and reach the station using
                optimized directions designed to make your charging journey faster and easier.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SEO Information Section */}
      <section className="bg-white">
        <div className="container mx-auto px-4 sm:px-6 py-14 sm:py-20 max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div>
              <span className="inline-block text-green-600 font-semibold text-sm uppercase tracking-wider mb-3">
                Charge With Confidence
              </span>

              <h2 className="text-2xl sm:text-4xl font-bold text-gray-900 mb-5">
                Your Trusted EV Charger Locator Across India
              </h2>

              <p className="text-gray-600 leading-relaxed mb-4">
                EVChamp makes it easier to search for electric vehicle charging stations
                near you. Whether you are travelling within your city or planning a longer
                road trip, our EV charging network finder helps you identify suitable
                charging locations along your route.
              </p>

              <p className="text-gray-600 leading-relaxed">
                Search for public EV chargers, fast-charging stations, and nearby charging
                points using a simple, user-friendly interface. Check available station
                information before starting your journey and reduce the time spent searching
                for a reliable place to charge your electric vehicle.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-2xl bg-gray-50 p-6 border border-gray-100">
                <p className="text-3xl mb-3">📌</p>
                <h3 className="font-bold text-gray-900 mb-2">
                  Location-Based Search
                </h3>
                <p className="text-sm text-gray-600">
                  Find charging points by current location, city, area, or destination.
                </p>
              </div>

              <div className="rounded-2xl bg-gray-50 p-6 border border-gray-100">
                <p className="text-3xl mb-3">🗺️</p>
                <h3 className="font-bold text-gray-900 mb-2">
                  Route Assistance
                </h3>
                <p className="text-sm text-gray-600">
                  Navigate directly to your selected EV charging station.
                </p>
              </div>

              <div className="rounded-2xl bg-gray-50 p-6 border border-gray-100">
                <p className="text-3xl mb-3">🔌</p>
                <h3 className="font-bold text-gray-900 mb-2">
                  Charger Information
                </h3>
                <p className="text-sm text-gray-600">
                  Review useful charging station details before travelling.
                </p>
              </div>

              <div className="rounded-2xl bg-gray-50 p-6 border border-gray-100">
                <p className="text-3xl mb-3">🌱</p>
                <h3 className="font-bold text-gray-900 mb-2">
                  Better EV Journeys
                </h3>
                <p className="text-sm text-gray-600">
                  Plan convenient and more dependable electric vehicle trips.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 py-14 sm:py-20 max-w-4xl">
          <div className="text-center mb-10">
            <span className="inline-block text-green-600 font-semibold text-sm uppercase tracking-wider mb-3">
              EV Charging Help
            </span>

            <h2 className="text-2xl sm:text-4xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions About EV Charging Stations
            </h2>

            <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
              Find answers to common questions about locating, selecting, and navigating
              to electric vehicle charging stations through EVChamp.
            </p>
          </div>

          <div className="space-y-4">
            <details className="bg-white border border-gray-200 rounded-xl p-5 group open:shadow-md transition-all">
              <summary className="flex items-center justify-between text-base font-semibold text-gray-900 cursor-pointer list-none">
                How do I find EV charging stations near me?
                <span className="text-green-600 text-xl group-open:rotate-45 transition-transform">
                  +
                </span>
              </summary>

              <p className="mt-4 text-sm text-gray-600 leading-relaxed">
                Enable location access to view nearby EV charging stations automatically.
                You can also search using a city, area, landmark, destination, or PIN code
                to find suitable electric vehicle chargers.
              </p>
            </details>

            <details className="bg-white border border-gray-200 rounded-xl p-5 group open:shadow-md transition-all">
              <summary className="flex items-center justify-between text-base font-semibold text-gray-900 cursor-pointer list-none">
                Can I get directions to an EV charging station?
                <span className="text-green-600 text-xl group-open:rotate-45 transition-transform">
                  +
                </span>
              </summary>

              <p className="mt-4 text-sm text-gray-600 leading-relaxed">
                Yes. Select a charging station and use the directions option to view the
                route from your current location to the selected charging point.
              </p>
            </details>

            <details className="bg-white border border-gray-200 rounded-xl p-5 group open:shadow-md transition-all">
              <summary className="flex items-center justify-between text-base font-semibold text-gray-900 cursor-pointer list-none">
                Does EVChamp show real-time charger availability?
                <span className="text-green-600 text-xl group-open:rotate-45 transition-transform">
                  +
                </span>
              </summary>

              <p className="mt-4 text-sm text-gray-600 leading-relaxed">
                EVChamp may display station status and availability information when it is
                provided by the relevant charging network. Availability can change quickly,
                so confirming with the charging station before arrival is recommended.
              </p>
            </details>

            <details className="bg-white border border-gray-200 rounded-xl p-5 group open:shadow-md transition-all">
              <summary className="flex items-center justify-between text-base font-semibold text-gray-900 cursor-pointer list-none">
                Can I find fast-charging stations through EVChamp?
                <span className="text-green-600 text-xl group-open:rotate-45 transition-transform">
                  +
                </span>
              </summary>

              <p className="mt-4 text-sm text-gray-600 leading-relaxed">
                Where charger-type information is available, you can review station details
                to identify charging points that may support fast charging or other suitable
                connector options for your electric vehicle.
              </p>
            </details>

            <details className="bg-white border border-gray-200 rounded-xl p-5 group open:shadow-md transition-all">
              <summary className="flex items-center justify-between text-base font-semibold text-gray-900 cursor-pointer list-none">
                Is the EV charging station finder free to use?
                <span className="text-green-600 text-xl group-open:rotate-45 transition-transform">
                  +
                </span>
              </summary>

              <p className="mt-4 text-sm text-gray-600 leading-relaxed">
                The EVChamp charger search and navigation experience can be used to locate
                charging stations. Individual charging station operators may apply their
                own charging rates, parking fees, or service charges.
              </p>
            </details>

            <details className="bg-white border border-gray-200 rounded-xl p-5 group open:shadow-md transition-all">
              <summary className="flex items-center justify-between text-base font-semibold text-gray-900 cursor-pointer list-none">
                Should I confirm station availability before travelling?
                <span className="text-green-600 text-xl group-open:rotate-45 transition-transform">
                  +
                </span>
              </summary>

              <p className="mt-4 text-sm text-gray-600 leading-relaxed">
                Yes. Charger availability, operating hours, maintenance status, and pricing
                may change. Confirming directly with the charging station is advisable,
                especially before long-distance journeys.
              </p>
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
