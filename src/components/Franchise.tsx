import React, { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import Papa from 'papaparse';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import HowItWorks from '../HowItWorks';

// Fix for default marker icons in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface ChargingStation {
  stationName: string;
  address: string;
  city: string;
  state: string;
  latitude: number;
  longitude: number;
  stationStatus: string;
  evseStatus: string;
  evseId?: string;
  chargers?: Array<{ evseId: string; evseStatus: string }>;
  chargerCount?: number;
}

const Franchise: React.FC = () => {
  const BackArrow = FaArrowLeft as React.ElementType;
  const [chargingStations, setChargingStations] = useState<ChargingStation[]>([]);
  const [showMap, setShowMap] = useState(false);
  const mapSectionRef = useRef<HTMLDivElement>(null);

  // Load CSV data
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });

    Papa.parse('/device_locations_api-stations.csv', {
      download: true,
      header: true,
      complete: (results) => {
        const allStations = results.data
          .filter((row: any) => row.Latitude && row.Longitude)
          .map((row: any) => ({
            stationName: row['Station Name'] || 'Unknown',
            address: row.Address || '',
            city: row.City || '',
            state: row.State || '',
            latitude: parseFloat(row.Latitude),
            longitude: parseFloat(row.Longitude),
            stationStatus: row['Station Status'] || 'Unknown',
            evseStatus: row['EVSE Status'] || 'Unknown',
            evseId: row['EVSE ID'] || '',
          }));

        // Group stations by name and location
        const groupedMap = new Map();
        allStations.forEach(station => {
          const key = `${station.stationName}-${station.latitude}-${station.longitude}`;
          if (!groupedMap.has(key)) {
            groupedMap.set(key, {
              ...station,
              chargers: [{ evseId: station.evseId, evseStatus: station.evseStatus }],
              chargerCount: 1,
            });
          } else {
            const existing = groupedMap.get(key);
            existing.chargers.push({ evseId: station.evseId, evseStatus: station.evseStatus });
            existing.chargerCount++;
            // Update status to Available if any charger is available
            if (station.stationStatus === 'Available') {
              existing.stationStatus = 'Available';
            }
          }
        });

        setChargingStations(Array.from(groupedMap.values()));
      },
    });
  }, []);

  const handleViewStations = () => {
    setShowMap(true);
    setTimeout(() => {
      mapSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  return (
    <section className="py-12 sm:py-16 px-4 sm:px-6 max-w-6xl mx-auto">
      <Link 
        to="/" 
        className="inline-flex items-center text-gray-600 hover:text-green-700 transition-colors mb-8 font-semibold"
      >
        <BackArrow className="mr-2" />
        Back to Home
      </Link>

      <div className="mb-10">
        <HowItWorks />
      </div>
      
      {/* Charging Stations Map */}
      <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-8 mb-16">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Charging Stations Network</h2>
          <p className="text-gray-600">Explore our extensive charging station network across India</p>
        </div>
        
        {!showMap ? (
          <div className="text-center">
            <button
              onClick={handleViewStations}
              className="bg-gradient-to-r from-green-400 to-green-600 text-white font-semibold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all inline-flex items-center"
            >
              <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
              View Charging Stations Map
            </button>
            <p className="text-sm text-gray-500 mt-3">
              {chargingStations.length} stations available across India
            </p>
          </div>
        ) : (
          <div ref={mapSectionRef}>
            <div className="mb-4 flex justify-between items-center">
              <p className="text-sm text-gray-600">
                <span className="font-semibold text-green-600">{chargingStations.filter(s => s.stationStatus === 'Available').length}</span> Online | 
                <span className="font-semibold text-orange-600 ml-2">{chargingStations.filter(s => s.stationStatus === 'Maintenance').length}</span> Offline | 
                <span className="font-semibold text-gray-600 ml-2">{chargingStations.length}</span> Total
              </p>
              <button
                onClick={() => setShowMap(false)}
                className="text-sm text-gray-500 hover:text-gray-700 underline"
              >
                Hide Map
              </button>
            </div>
            <div className="rounded-xl overflow-hidden border-2 border-gray-200 shadow-lg" style={{ height: '500px' }}>
              <MapContainer
                center={[28.6139, 77.2090]} // Delhi as default center
                zoom={5}
                style={{ height: '100%', width: '100%' }}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {chargingStations.map((station, idx) => (
                  <Marker key={idx} position={[station.latitude, station.longitude]}>
                    <Popup>
                      <div className="p-2" style={{ minWidth: '200px' }}>
                        <h3 className="font-bold text-gray-800 mb-1 text-sm">{station.stationName}</h3>
                        <p className="text-xs text-gray-600 mb-1">{station.address}</p>
                        <p className="text-xs text-gray-500 mb-3">{station.city}, {station.state}</p>
                        <a
                          href={`https://www.google.com/maps/search/?api=1&query=${station.latitude},${station.longitude}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 !text-white text-xs font-semibold px-3 py-2 rounded-lg transition-colors w-full"
                          style={{ color: 'white !important' }}
                        >
                          <svg className="w-4 h-4 fill-white" fill="white" viewBox="0 0 24 24">
                            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                          </svg>
                          <span style={{ color: 'white !important' }}>Open in Google Maps</span>
                        </a>
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            </div>
            <div className="mt-4 bg-green-50 rounded-lg p-4 border border-green-100">
              <p className="text-sm text-green-800">
                <strong>💡 Franchise Opportunity:</strong> Join our network and become part of India's largest EV charging infrastructure!
              </p>
            </div>

            {/* Station Cards List */}
            <div className="mt-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-800">All Charging Stations</h3>
                <span className="text-sm font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                  {chargingStations.length} Stations
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-4">Scroll down to view all charging stations across India</p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[800px] overflow-y-auto pr-2 border-2 border-gray-100 rounded-xl p-4">
                {chargingStations.map((station, idx) => (
                  <div key={idx} className="bg-white rounded-xl shadow-md border border-gray-200 p-4 hover:shadow-lg transition-shadow">
                    {/* Station Name and Status Badge */}
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-bold text-gray-900 text-base flex-1">{station.stationName}</h4>
                      <span className={`text-xs px-3 py-1 rounded-full font-semibold ml-2 flex-shrink-0 ${
                        station.stationStatus === 'Available' 
                          ? 'bg-green-100 text-green-700' 
                          : station.stationStatus === 'Maintenance'
                          ? 'bg-gray-100 text-gray-600'
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {station.stationStatus === 'Available' ? 'ONLINE' : station.stationStatus === 'Maintenance' ? 'OFFLINE' : station.stationStatus.toUpperCase()}
                      </span>
                    </div>

                    {/* Location */}
                    <div className="flex items-start text-gray-600 mb-3">
                      <svg className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                      </svg>
                      <p className="text-xs leading-relaxed">{station.city}, {station.state}</p>
                    </div>

                    {/* Number of Chargers */}
                    <div className="bg-blue-50 rounded-lg px-3 py-2 mb-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-blue-900">
                          ⚡ {station.chargerCount || 1} Charger{(station.chargerCount || 1) > 1 ? 's' : ''} Available
                        </span>
                      </div>
                    </div>

                    {/* Charger Details */}
                    {station.chargers && station.chargers.length > 0 && (
                      <div className="mb-3 space-y-2 max-h-32 overflow-y-auto">
                        {station.chargers.map((charger, cIdx) => (
                          <div key={cIdx} className="bg-gray-50 rounded px-2 py-1.5 text-xs">
                            <div className="flex items-center justify-between">
                              <span className="text-gray-700 font-medium">ID: {charger.evseId || 'N/A'}</span>
                              <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                                charger.evseStatus === 'Available' 
                                  ? 'bg-green-100 text-green-700' 
                                  : charger.evseStatus === 'In use'
                                  ? 'bg-yellow-100 text-yellow-700'
                                  : 'bg-gray-200 text-gray-600'
                              }`}>
                                {charger.evseStatus}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Features/Info */}
                    <div className="space-y-1 mb-3 pt-2 border-t border-gray-100">
                      <div className="flex items-center text-xs text-gray-600">
                        <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                        <span>24/7 Access</span>
                      </div>
                      <div className="flex items-center text-xs text-gray-600">
                        <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                        <span>Fast Charging</span>
                      </div>
                    </div>

                    {/* Open in Google Maps Button */}
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${station.latitude},${station.longitude}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 w-full bg-white border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white text-xs font-semibold px-3 py-2 rounded-lg transition-all"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                      </svg>
                      Open in Google Maps
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <h1 className="text-3xl sm:text-4xl font-bold text-green-700 mb-6">EVChamp Franchise Partnership</h1>
      <p className="mb-4 text-base sm:text-lg font-semibold text-gray-800">The Electrifying Opportunity is Now!</p>
      <p className="mb-4 text-sm sm:text-base">India's roads are transforming, and the future is electric. EVChamp offers an unparalleled franchise opportunity to build a highly profitable business at the heart of India's Electric Vehicle revolution. Are you ready to charge ahead with the undisputed leader in EV Leasing services and AI Diagnostics?</p>

      <a
        href="https://investyz.com/"
        target="_blank"
        rel="noopener noreferrer"
        className="mt-10 block rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 overflow-hidden cursor-pointer"
        style={{ background: 'linear-gradient(135deg, #e8f5e9 0%, #a5d6a7 30%, #66bb6a 60%, #43a047 100%)' }}
      >
        <div className="p-6 sm:p-8">
          <div className="inline-flex items-center bg-white/80 backdrop-blur-sm rounded-full px-4 py-1.5 mb-4 shadow-sm">
            <svg className="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="font-bold text-gray-900 text-sm tracking-wide">INVESTYZ</span>
          </div>

          <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">INVESTYZ</h3>

          <p className="text-gray-800 text-sm sm:text-base leading-relaxed mb-5 max-w-xl">
            Invest in the Infrastructure of Tomorrow. Earn sustainable yields by investing in real-world assets like data centers, battery storage, EV charging, and renewable energy through decentralized physical infrastructure on Polygon.
          </p>
          
          <div className="inline-flex items-center text-blue-700 font-semibold text-sm sm:text-base hover:text-blue-900 transition-colors">
            <span>Visit site</span>
            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </div>
        </div>
      </a>
      <h2 className="text-xl sm:text-2xl font-bold mt-8 mb-2">Why Choose an EVChamp Franchise?</h2>
      <ul className="list-disc ml-4 sm:ml-6 mb-4 text-sm sm:text-base">
        <li>⚡ <b>Be the EV Expert in Your City:</b> Specialise in the fastest-growing automotive segment.</li>
        <li>⚡ <b>Proven Profitability:</b> Up to 30% ROI from Year 1 and full investment payback by Year 5!</li>
        <li>⚡ <b>Comprehensive Support:</b> From AI diagnostics to operational training and national marketing.</li>
        <li>⚡ <b>Future-Proof Business:</b> Invest in a business that grows with the future.</li>
        <li>⚡ <b>Strong Brand & Network:</b> Join a rapidly expanding national brand.</li>
      </ul>
      <h2 className="text-xl sm:text-2xl font-bold mt-8 mb-2">Diversified, High-Demand Services</h2>
      <ul className="list-disc ml-4 sm:ml-6 mb-4 text-sm sm:text-base">
        <li>EV Leasing Platform</li>
        <li>Advanced EV Diagnostics AI SaaS</li>
        <li>DC Fast Charging for 2W & 3W customers</li>
        <li>Data-Driven Certified Battery Assessment and EV Insights Platform (PaaS)</li>
      </ul>
      <h2 className="text-xl sm:text-2xl font-bold mt-8 mb-2">Our Franchisees are Thriving!</h2>
      <blockquote className="border-l-4 border-green-500 pl-4 italic mb-2">"Joining EVChamp was the smartest business decision I made. The AI platform is a game-changer, and the support I get is incredible. My Pro Centre is exceeding all expectations!"<br/>— Rajesh Kumar, Pro Franchisee, Delhi</blockquote>
      <blockquote className="border-l-4 border-green-500 pl-4 italic mb-2">"The Master Centre model gives me so much potential. With the leasing platform and spares distribution, my revenue streams are constantly growing. This is truly the future of Auto financing and EV services."<br/>— Priya Sharma, Master Franchisee, Pune</blockquote>
      <blockquote className="border-l-4 border-green-500 pl-4 italic mb-2">"Even with my Basic Centre, the profitability is fantastic. The demand for EV leasing is huge, and EVChamp makes it easy to deliver top-notch service. I'm already planning my second location!"<br/>— Amit Singh, Pro Franchisee, Jaipur</blockquote>
      <h2 className="text-xl sm:text-2xl font-bold mt-8 mb-2">Key Financial Highlights</h2>
      <ul className="list-disc ml-4 sm:ml-6 mb-4 text-sm sm:text-base">
        <li><b>Initial Investment:</b> Starting from INR 15 Lacs for a Pro and INR 25 Lacs for Master Centre</li>
        <li><b>Targeted ROI:</b> Up to 30% in Year 1 for Master Franchisees</li>
        <li><b>Rapid Payback:</b> Typically within 5 years</li>
      </ul>
      <p className="mb-4 text-sm sm:text-base">Don't Just Watch the EV Revolution - <b>LEAD IT!</b></p>
      <p className="mb-4 font-bold text-sm sm:text-base">Limited Opportunities Available! Secure your exclusive territory and become a pioneer in India's next-generation automotive service industry.</p>
      <p className="mb-4 text-sm sm:text-base">EVChamp: Powering Progress, Together.</p>
      <div className="bg-green-50 p-4 rounded-lg">
        <p><b>Contact Us Today:</b></p>
        <p>Visit our website: <a href="https://www.evchamp.in" className="text-green-700 underline">www.evchamp.in</a></p>
        <p>Call us: <a href="tel:+918368681769" className="text-green-700 underline">+91 83686 81769</a></p>
        <p>Email: <a href="mailto:franchise@evchamp.in" className="text-green-700 underline">franchise@evchamp.in</a></p>
      </div>

      
    </section>
  );
};

export default Franchise;