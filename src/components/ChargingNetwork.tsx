import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Footer from '../Footer';

// Re-use the same CSV data and map logic from Franchise
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix Leaflet marker icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

interface Station {
  name: string;
  address: string;
  lat: number;
  lng: number;
  evses: { status: string; connectors: { standard: string; max_electric_power: number }[] }[];
}

const ChargingNetwork: React.FC = () => {
  const navigate = useNavigate();
  const [stations, setStations] = useState<Station[]>([]);
  const [loading, setLoading] = useState(true);
  const mapRef = useRef<any>(null);

  useEffect(() => {
    fetch('/device_locations_api-stations.csv')
      .then(res => res.text())
      .then(csvText => {
        const lines = csvText.split('\n').filter(l => l.trim());
        if (lines.length <= 1) { setLoading(false); return; }
        const headers = lines[0].split(',');
        const nameIdx = headers.indexOf('name');
        const addrIdx = headers.indexOf('address');
        const latIdx = headers.indexOf('latitude');
        const lngIdx = headers.indexOf('longitude');

        const parsed: Station[] = [];
        for (let i = 1; i < lines.length; i++) {
          const cols = lines[i].split(',');
          const lat = parseFloat(cols[latIdx]);
          const lng = parseFloat(cols[lngIdx]);
          if (!isNaN(lat) && !isNaN(lng)) {
            parsed.push({
              name: cols[nameIdx] || 'Charging Station',
              address: cols[addrIdx] || '',
              lat,
              lng,
              evses: [{ status: 'AVAILABLE', connectors: [{ standard: 'Type 2', max_electric_power: 22000 }] }],
            });
          }
        }
        setStations(parsed);
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
        <title>EV Charging Stations in India | Explore EVChamp Charging Network</title>
        <meta name="description" content="Explore EVChamp's charging station network across India. Find reliable EV charging locations, improve route planning, and access smart charging support." />
        <meta name="keywords" content="EV charging stations India, charging network, EV charger locations, EV charging map, electric vehicle charging India" />
      </Helmet>

      {/* Hero */}
      <section className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
        <div className="container mx-auto px-4 sm:px-6 py-14 sm:py-18 text-center max-w-3xl">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">Explore an Expanding Charging Network</h1>
          <p className="text-gray-300 text-base sm:text-lg leading-relaxed mb-6">
            EVChamp's charging station network is built to support EV drivers across India with better access to reliable charging locations. Reduce range anxiety and plan your journeys with confidence.
          </p>
          <div className="flex flex-wrap justify-center gap-2 text-xs sm:text-sm">
            <span className="bg-white/10 px-3 py-1.5 rounded-full">⚡ Extensive Coverage</span>
            <span className="bg-white/10 px-3 py-1.5 rounded-full">📍 Route Planning</span>
            <span className="bg-white/10 px-3 py-1.5 rounded-full">🔌 Real-Time Availability</span>
          </div>
        </div>
      </section>

      {/* Map */}
      <section className="bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 py-10">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 text-center mb-6">Find Charging Stations Near You</h2>
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-600"></div>
            </div>
          ) : (
            <div className="rounded-xl overflow-hidden shadow-lg border border-gray-200" style={{ height: '500px' }}>
              <MapContainer
                center={[20.5937, 78.9629]}
                zoom={5}
                style={{ height: '100%', width: '100%' }}
                ref={mapRef}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; OpenStreetMap contributors'
                />
                {stations.map((station, idx) => (
                  <Marker key={idx} position={[station.lat, station.lng]}>
                    <Popup>
                      <div className="text-sm">
                        <strong>{station.name}</strong>
                        <br />
                        <span className="text-gray-500">{station.address}</span>
                        <br />
                        <span className="text-green-600 font-medium">
                          {station.evses[0]?.status === 'AVAILABLE' ? '● Available' : '○ Unavailable'}
                        </span>
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

      {/* For Drivers & Partners */}
      <section className="bg-white">
        <div className="container mx-auto px-4 sm:px-6 py-12 max-w-4xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 mb-2">For EV Drivers</h3>
              <p className="text-sm text-gray-600 leading-relaxed mb-4">Find charging stations that fit your route and travel needs. Plan journeys and charge with confidence.</p>
              <button onClick={() => goTo('/buy-plans')} className="text-sm font-medium text-green-700 hover:text-green-800">Get EV Plans →</button>
            </div>
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 mb-2">For Businesses & Partners</h3>
              <p className="text-sm text-gray-600 leading-relaxed mb-4">Join a growing charging ecosystem that supports EV adoption and improves infrastructure availability.</p>
              <button onClick={() => goTo('/franchise')} className="text-sm font-medium text-green-700 hover:text-green-800">Franchise Opportunities →</button>
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

export default ChargingNetwork;
