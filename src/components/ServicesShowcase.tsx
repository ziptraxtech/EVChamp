import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import mockupImg from '../assets/mockuo.png';
import nexonImg from '../assets/tata-nexon.jpg';
import mgzsevImg from '../assets/mgzsev.jpg';
import cometevImg from '../assets/cometev.jpg';
import punchImg from '../assets/punch-ev.jpg';
import tiagoevImg from '../assets/tiagoev.jpg';

const ArrowButton: React.FC<{ onClick: (e: React.MouseEvent) => void }> = ({ onClick }) => (
  <button
    onClick={onClick}
    className="service-tile-arrow w-9 h-9 rounded-full border-2 border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-all duration-300 flex-shrink-0 group-hover:translate-x-1 group-hover:border-sky-400"
    aria-label="Explore"
  >
    <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
  </button>
);

const CheckBadge: React.FC<{ text: string; colorClass?: string }> = ({ text, colorClass = 'bg-green-100 text-green-700' }) => (
  <span className={`service-tile-badge inline-flex items-center gap-1.5 ${colorClass} font-medium text-xs sm:text-sm px-3 py-1 rounded-full`}>
    <svg className="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
    </svg>
    {text}
  </span>
);

const ServicesShowcase: React.FC = () => {
  const navigate = useNavigate();
  const { isSignedIn } = useUser();

  const protectedRoutes = [
    '/charging-network', '/service-centres', '/buy-plans', '/buy-used-ev',
    '/rsa-plans', '/sell-ev', '/rent-ev', '/advance-analysis',
  ];

  const goTo = (route: string) => {
    if (protectedRoutes.includes(route) && !isSignedIn) {
      navigate('/sign-in');
      window.scrollTo({ top: 0, behavior: 'auto' });
      return;
    }
    navigate(route);
    window.scrollTo({ top: 0, behavior: 'auto' });
  };

  return (
    <section className="py-12 sm:py-16 bg-[#f0f0f0]">
      <div className="container mx-auto px-4 sm:px-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-800 mb-8">
          Explore Our Top Services
        </h2>

        <div className="flex flex-col lg:flex-row gap-4">

          {/* ── Left Side: 2 equal stacked cards ── */}
          <div className="lg:w-[32%] flex flex-col gap-4">

            {/* Charging Stations — TOP */}
            <div
              onClick={() => goTo('/find-ev-chargers')}
              style={{ '--tile-delay': '0.05s' } as React.CSSProperties}
              className="service-tile group flex-1 bg-gradient-to-br from-yellow-50 to-amber-50 rounded-2xl p-5 sm:p-6 flex flex-col justify-between cursor-pointer shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden"
            >
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 leading-tight mb-2">
                  Charging Stations
                </h3>
                <p className="text-amber-600 font-semibold text-sm mb-1">
                  Find EV chargers near you.
                </p>
                <p className="text-gray-500 text-xs mb-4">
                  Locate nearby EV charging points, check availability, and plan your route with ease.
                </p>
                <CheckBadge text="Live map & navigation" colorClass="bg-amber-50 text-amber-700" />
              </div>
              <div className="flex items-end justify-between mt-4">
                <img src={cometevImg} alt="Charging Stations" className="w-24 h-16 object-cover rounded-lg" />
                <ArrowButton onClick={e => { e.stopPropagation(); goTo('/find-ev-chargers'); }} />
              </div>
            </div>

            {/* Find EV Service Centres — BOTTOM */}
            <div
              onClick={() => goTo('/service-centres')}
              style={{ '--tile-delay': '0.08s' } as React.CSSProperties}
              className="service-tile group flex-1 bg-gradient-to-br from-violet-50 to-purple-50 rounded-2xl p-5 sm:p-6 flex flex-col justify-between cursor-pointer shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden"
            >
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 leading-tight mb-2">
                  Find EV Service Centres
                </h3>
                <p className="text-purple-600 font-semibold text-sm mb-1">
                  Verified workshops near you.
                </p>
                <p className="text-gray-500 text-xs mb-4">
                  Locate trusted EV repair, diagnostics, and battery service support across major cities.
                </p>
                <CheckBadge text="Pan-India support network" colorClass="bg-purple-50 text-purple-700" />
              </div>
              <div className="flex items-end justify-between mt-4">
                <img src={mgzsevImg} alt="Find EV Service Centres" className="w-24 h-16 object-cover rounded-lg" />
                <ArrowButton onClick={e => { e.stopPropagation(); goTo('/service-centres'); }} />
              </div>
            </div>

          </div>

          {/* ── Right Side: top-row (2 cards) + bottom-row (3 cards) ── */}
          <div className="lg:w-[68%] flex flex-col gap-4">

            {/* Top row: 3 medium cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

              {/* Sell EV */}
              <div
                onClick={() => goTo('/zeflash')}
                style={{ '--tile-delay': '0.10s' } as React.CSSProperties}
                className="service-tile group bg-gradient-to-br from-sky-50 to-blue-50 rounded-2xl p-5 flex flex-col justify-between cursor-pointer shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden"
              >
                <div>
                  <img src="/zeflash-logo.png" alt="Zeflash" className="h-7 w-auto mb-2 object-contain" />
                  <p className="text-sky-600 font-semibold text-sm mb-2">Rapid AI battery diagnostics.</p>
                  <p className="text-gray-500 text-xs leading-snug">
                    20-minute field diagnostics with SoP, SoF, and instant health reports during charging.
                  </p>
                </div>
                <div className="flex items-end justify-between mt-4">
                  <img src={punchImg} alt="Zeflash" className="w-24 h-16 object-cover rounded-lg" />
                  <ArrowButton onClick={e => { e.stopPropagation(); goTo('/zeflash'); }} />
                </div>
                <div className="mt-3">
                  <CheckBadge text="Visit zeflash.app" colorClass="bg-sky-50 text-sky-700" />
                </div>
              </div>

              {/* Smart EV Telematics */}
              <div
                onClick={() => goTo('/buy-plans')}
                style={{ '--tile-delay': '0.15s' } as React.CSSProperties}
                className="service-tile group bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 rounded-2xl p-5 flex flex-col justify-between cursor-pointer shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden"
              >
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-1">Smart EV Telematics &amp; Fleet Plans</h3>
                  <p className="text-green-600 font-semibold text-sm mb-2">Real-time GPS. AI diagnostics.</p>
                  <p className="text-gray-500 text-xs leading-snug">
                    India's most advanced IoT tracking & fleet management platform built for electric vehicles.
                  </p>
                </div>
                <div className="flex items-end justify-between mt-4">
                  <img src={mockupImg} alt="EV Telematics App" className="w-24 h-16 object-contain rounded-lg bg-white" />
                  <ArrowButton onClick={e => { e.stopPropagation(); goTo('/buy-plans'); }} />
                </div>
                <div className="mt-3">
                  <CheckBadge text="Plans starting at ₹4,999/yr" colorClass="bg-green-100 text-green-700" />
                </div>
              </div>

              {/* Rent an EV */}
              <div
                onClick={() => goTo('/rent-ev')}
                style={{ '--tile-delay': '0.20s' } as React.CSSProperties}
                className="service-tile group bg-gradient-to-br from-teal-50 to-cyan-50 rounded-2xl p-5 flex flex-col justify-between cursor-pointer shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden"
              >
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-1">Rent an EV</h3>
                  <p className="text-teal-600 font-semibold text-sm mb-2">Flexible. Affordable. Green.</p>
                  <p className="text-gray-500 text-xs leading-snug">
                    Rent electric vehicles by the day or month with zero fuel costs and zero hassle.
                  </p>
                </div>
                <div className="flex items-end justify-between mt-4">
                  <img src={nexonImg} alt="Rent EV" className="w-24 h-16 object-cover rounded-lg" />
                  <ArrowButton onClick={e => { e.stopPropagation(); goTo('/rent-ev'); }} />
                </div>
                <div className="mt-3">
                  <CheckBadge text="From ₹499/day" colorClass="bg-teal-50 text-teal-700" />
                </div>
              </div>
            </div>

            {/* Bottom row: 3 smaller cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

              {/* RSA Plans */}
              <div
                onClick={() => goTo('/rsa-plans')}
                style={{ '--tile-delay': '0.20s' } as React.CSSProperties}
                className="service-tile group bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl p-5 flex flex-col justify-between cursor-pointer shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden"
              >
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-1">RSA Plans</h3>
                  <p className="text-orange-500 font-semibold text-sm mb-2">24×7 roadside support.</p>
                  <p className="text-gray-500 text-xs leading-snug">
                    Get towing, battery help, tyre support, and emergency EV assistance anywhere.
                  </p>
                </div>
                <div className="flex items-end justify-between mt-4">
                  <img
                    src={cometevImg}
                    alt="RSA Plans"
                    className="w-24 h-16 object-cover rounded-lg"
                  />
                  <ArrowButton onClick={e => { e.stopPropagation(); goTo('/rsa-plans'); }} />
                </div>
                <div className="mt-3">
                  <CheckBadge text="Plans from ₹999/yr" colorClass="bg-orange-50 text-orange-700" />
                </div>
              </div>

              {/* Sell Your EV */}
              <div
                onClick={() => goTo('/sell-ev')}
                style={{ '--tile-delay': '0.25s' } as React.CSSProperties}
                className="service-tile group bg-gradient-to-br from-blue-50 to-sky-50 rounded-2xl p-5 flex flex-col justify-between cursor-pointer shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden"
              >
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-1">Sell Your EV</h3>
                  <p className="text-blue-600 font-semibold text-sm mb-2">Best price. Fast &amp; verified.</p>
                  <p className="text-gray-500 text-xs leading-snug">
                    List your electric vehicle and reach thousands of genuine buyers instantly.
                  </p>
                </div>
                <div className="flex items-end justify-between mt-4">
                  <img
                    src={nexonImg}
                    alt="Sell EV"
                    className="w-24 h-16 object-cover rounded-lg"
                  />
                  <ArrowButton onClick={e => { e.stopPropagation(); goTo('/sell-ev'); }} />
                </div>
                <div className="mt-3">
                  <CheckBadge text="Zero commission listing" colorClass="bg-blue-50 text-blue-700" />
                </div>
              </div>

              {/* ZipBattery */}
              <div
                onClick={() => goTo('/zipbattery')}
                style={{ '--tile-delay': '0.30s' } as React.CSSProperties}
                className="service-tile group bg-gradient-to-br from-rose-50 to-orange-50 rounded-2xl p-5 flex flex-col justify-between cursor-pointer shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden"
              >
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-1">ZipBattery</h3>
                  <p className="text-red-600 font-semibold text-sm mb-2">AI-powered battery health.</p>
                  <p className="text-gray-500 text-xs leading-snug">
                    Extend EV battery lifespan using our patented AI diagnostic technology.
                  </p>
                </div>
                <div className="flex items-end justify-between mt-4">
                  <img
                    src={tiagoevImg}
                    alt="ZipBattery"
                    className="w-24 h-16 object-cover rounded-lg"
                  />
                  <ArrowButton onClick={e => { e.stopPropagation(); goTo('/zipbattery'); }} />
                </div>
                <div className="mt-3">
                  <CheckBadge text="Patented technology" colorClass="bg-red-50 text-red-600" />
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesShowcase;
