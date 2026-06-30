import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Footer from '../Footer';

interface LocationState {
  plan?: string;
  tests?: number;
  months?: number;
  price?: number;
  openCheckout?: boolean;
}

const Zeflash: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState;
  const [iframeKey, setIframeKey] = useState(0);
  const [iframeSrc, setIframeSrc] = useState('https://zeflash.app');

  useEffect(() => {
    if (state?.openCheckout && state?.plan) {
      const checkoutUrl = `https://zeflash.app/checkout?plan=${state.plan}&tests=${state.tests}&months=${state.months}&price=${state.price}`;
      setIframeSrc(checkoutUrl);
    }
  }, [state]);

  const goTo = (route: string) => {
    navigate(route);
    window.scrollTo({ top: 0, behavior: 'auto' });
  };

  const reloadIframe = () => {
    setIframeKey(prev => prev + 1);
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
          <div className="rounded-2xl overflow-hidden border border-gray-200 shadow-lg w-full bg-gray-50" style={{ height: '80vh', minHeight: '500px' }}>
            <iframe
              key={iframeKey}
              src={iframeSrc}
              title="Zeflash Website"
              className="w-full h-full"
              style={{ border: 'none', width: '100%', height: '100%' }}
              allow="fullscreen; payment; camera; microphone; clipboard-read; clipboard-write; geolocation; accelerometer; gyroscope"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="mt-4 text-center">
            <button 
              onClick={reloadIframe}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium underline"
            >
              Reload if content doesn't load
            </button>
          </div>
        </div>
      </section>

      
      {/* CTA */}
      <section className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
        <div className="container mx-auto px-4 sm:px-6 py-12 text-center max-w-3xl">
          <p className="text-gray-300 text-base mb-6">EVChamp's charging network is part of a larger mission to make electric mobility easier, more accessible, and more dependable across India.</p>
          <button 
            onClick={() => goTo('/contact')} 
            className="text-white font-semibold px-6 py-3 rounded-lg transition-all text-sm"
            style={{
              background: 'linear-gradient(120deg, #0a8a52, #1257c4)',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.filter = 'brightness(1.1)')}
            onMouseLeave={(e) => (e.currentTarget.style.filter = 'brightness(1)')}
          >
            Partner With Us
          </button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Zeflash;
