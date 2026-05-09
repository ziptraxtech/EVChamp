import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Footer from '../Footer';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

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

const Zeflash: React.FC = () => {
  const navigate = useNavigate();
  const [stations, setStations] = useState<Station[]>([]);
  const [loading, setLoading] = useState(true);
  const mapRef = useRef<any>(null);

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

  return (
    <div className="bg-white min-h-screen">
      <Helmet>
        <title>Zeflash | Rapid AI EV Battery Diagnostics</title>
        <meta name="description" content="Zeflash is a rapid AI-powered EV battery diagnostics platform for fast, field-ready health checks with SoP, SoF, and instant actionable reports." />
        <meta name="keywords" content="Zeflash, EV battery diagnostics, rapid EV testing, SoP, SoF, battery health report, AI battery analysis" />
      </Helmet>

      {/* Hero */}
      <section className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
        <div className="container mx-auto px-4 sm:px-6 py-16 sm:py-20 max-w-5xl text-center">
          <img src="/zeflash-logo.png" alt="Zeflash Logo" className="h-16 sm:h-20 w-auto mx-auto mb-6" />
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            Zeflash: Rapid AI Diagnostics & Power
          </h1>
          <p className="text-gray-300 text-base sm:text-lg leading-relaxed max-w-3xl mx-auto mb-8">
            Quick 20-minute EV and battery diagnostics during charging. Zeflash combines fast charger testing with
            battery physics-driven AI to reveal real performance, aging behavior, and safety condition on the spot.
          </p>
        </div>
      </section>

      {/* Embedded Zeflash Website */}
      <section className="bg-white">
        <div className="container mx-auto px-4 sm:px-6 py-10 max-w-6xl">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center mb-4">Explore Zeflash</h2>
          <p className="text-gray-500 text-center text-sm mb-6">Browse the full Zeflash platform below.</p>
          <div className="rounded-2xl overflow-hidden border border-gray-200 shadow-lg w-full" style={{ height: '80vh', minHeight: '500px' }}>
            <iframe
              src="https://zeflash.app"
              title="Zeflash Website"
              className="w-full h-full"
              style={{ border: 'none', width: '100%', height: '100%' }}
              allow="fullscreen"
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox allow-top-navigation-by-user-activation"
            />
          </div>
        </div>
      </section>

      {/* Charging Network Map */}
      <section className="bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 py-10">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 text-center mb-6">Find Charging Stations Near You</h2>
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-600"></div>
            </div>
          ) : (
            <div className="rounded-xl overflow-hidden shadow-lg border border-gray-200" style={{ height: '500px' }}>
              <MapContainer center={[28.6139, 77.2090]} zoom={10} style={{ height: '100%', width: '100%' }} ref={mapRef}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; OpenStreetMap contributors' />
                {stations.map((station, idx) => (
                  <Marker key={idx} position={[station.lat, station.lng]}>
                    <Popup>
                      <div className="text-sm min-w-[240px]">
                        <strong>{station.name}</strong><br />
                        <span className="text-gray-500">{station.address}</span><br />
                        <span className="text-gray-500">{station.city}, {station.state}</span><br />
                        <span className="text-green-700 font-medium">{station.stationStatus}</span><br />
                        <span className="text-xs text-gray-600">
                          Chargers: {station.evses.length} | Available: {station.evses.filter(e => e.status.toLowerCase() === 'available').length}
                        </span>
                        <div className="mt-2 space-y-1 max-h-28 overflow-auto border-t border-gray-100 pt-2">
                          {station.evses.map((evse) => (
                            <a key={evse.id}
                              href={`https://www.google.com/maps/dir/?api=1&destination=${station.lat},${station.lng}`}
                              target="_blank" rel="noopener noreferrer"
                              className="block text-xs text-blue-700 hover:text-blue-900 underline">
                              Navigate to Charger {evse.id}
                            </a>
                          ))}
                        </div>
                        <a href={`https://www.google.com/maps/dir/?api=1&destination=${station.lat},${station.lng}`}
                          target="_blank" rel="noopener noreferrer"
                          className="inline-block mt-2 bg-blue-600 text-white px-3 py-1 rounded-md text-xs font-medium hover:bg-blue-700 transition-colors">
                          Open in Google Maps
                        </a>
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            </div>
          )}
          <p className="text-center text-sm text-gray-400 mt-4">{stations.length} stations loaded across India</p>
        </div>
      </section>

      {/* For Partners */}
      <section className="bg-white">
        <div className="container mx-auto px-4 sm:px-6 py-12 max-w-4xl">
          <div className="flex justify-center">
            <div onClick={() => navigate('/contact')}
              className="group rounded-2xl p-6 border border-blue-100 bg-gradient-to-br from-blue-50 via-white to-sky-50 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer max-w-md w-full">
              <div className="flex items-start justify-between gap-3 mb-4">
                <h3 className="text-xl font-bold text-gray-900">For Businesses & Partners</h3>
                <span className="text-xs font-semibold text-blue-700 bg-blue-100 px-2 py-1 rounded-full">ZipSureAI</span>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed mb-6">
                Join a growing charging ecosystem that supports EV adoption and improves infrastructure availability.
              </p>
              <div className="flex items-center justify-between">
                <img src="/ZipsureAI Logo.png" alt="ZipsureAI" className="h-10 w-auto object-contain" />
                <span className="text-sm font-semibold text-blue-700 group-hover:text-blue-800 transition-colors">Open ZipSureAI →</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
        <div className="container mx-auto px-4 sm:px-6 py-12 text-center max-w-3xl">
          <p className="text-gray-300 text-base mb-6">EVChamp's charging network is part of a larger mission to make electric mobility easier, more accessible, and more dependable across India.</p>
          <button onClick={() => goTo('/contact')} className="bg-green-500 text-white font-semibold px-6 py-3 rounded-lg hover:bg-green-600 transition-all text-sm">
            Partner With Us
          </button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Zeflash;
