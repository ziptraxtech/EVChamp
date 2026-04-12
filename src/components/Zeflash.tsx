import React from 'react';
import { Helmet } from 'react-helmet-async';
import Footer from '../Footer';

const zeflashFeatures = [
  {
    title: 'Rapid Flash Testing',
    desc: 'Capture true battery performance and internal efficiency in minutes, not hours.',
  },
  {
    title: 'Multi-Signal Scanning',
    desc: 'Analyze current, temperature, impedance, and other key signals to detect early degradation.',
  },
  {
    title: 'AI + Digital Twin Intelligence',
    desc: 'Physics-driven models predict lifespan, efficiency trends, and failure risk with high precision.',
  },
  {
    title: 'Portable Diagnostics at Chargers',
    desc: 'Run lab-grade checks in the field at charging points without pack disassembly.',
  },
  {
    title: 'Benchmark & Traceability',
    desc: 'Compare across chemistries and manufacturers with consistent, certifiable outputs.',
  },
  {
    title: 'Instant Health Report',
    desc: 'Get SoP, SoF, efficiency variance, range-loss estimate, and recommendations in one report.',
  },
];

const audiences = [
  'EV Fleet Operators',
  'Service Centers',
  'Second-life & Recycling Businesses',
  'OEMs, Insurers, and Manufacturers',
];

const Zeflash: React.FC = () => {
  return (
    <div className="bg-white min-h-screen">
      <Helmet>
        <title>Zeflash | Rapid AI EV Battery Diagnostics</title>
        <meta
          name="description"
          content="Zeflash is a rapid AI-powered EV battery diagnostics platform for fast, field-ready health checks with SoP, SoF, and instant actionable reports."
        />
        <meta
          name="keywords"
          content="Zeflash, EV battery diagnostics, rapid EV testing, SoP, SoF, battery health report, AI battery analysis"
        />
      </Helmet>

      <section className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
        <div className="container mx-auto px-4 sm:px-6 py-16 sm:py-20 max-w-5xl text-center">
          <img
            src="/zeflash-logo.png"
            alt="Zeflash Logo"
            className="h-16 sm:h-20 w-auto mx-auto mb-6"
          />
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            Zeflash: Rapid AI Diagnostics & Power
          </h1>
          <p className="text-gray-300 text-base sm:text-lg leading-relaxed max-w-3xl mx-auto mb-8">
            Quick 20-minute EV and battery diagnostics during charging. Zeflash combines fast charger testing with
            battery physics-driven AI to reveal real performance, aging behavior, and safety condition on the spot.
          </p>
          <a
            href="https://zeflash.app"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center bg-green-500 text-white font-semibold px-6 py-3 rounded-lg hover:bg-green-600 transition-all"
          >
            Visit Zeflash Website
          </a>
        </div>
      </section>

      <section className="bg-gray-50 border-y border-gray-100">
        <div className="container mx-auto px-4 sm:px-6 py-12 sm:py-16 max-w-5xl">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center mb-8">What is Zeflash?</h2>
          <p className="text-gray-600 text-base sm:text-lg leading-relaxed text-center max-w-4xl mx-auto">
            Zeflash Rapid Diagnostics is an advanced EV battery testing platform designed for fast, field-ready health
            checks. It accurately measures State of Power and State of Function at pack level, helping fleets, garages,
            and OEMs make confident decisions for servicing, second-life repurposing, and safe recycling.
          </p>
        </div>
      </section>

      <section className="bg-white">
        <div className="container mx-auto px-4 sm:px-6 py-12 sm:py-16 max-w-6xl">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center mb-10">Core Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {zeflashFeatures.map((item) => (
              <div key={item.title} className="rounded-xl border border-gray-100 p-5 bg-gray-50 hover:shadow-md transition-all">
                <h3 className="text-base font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-gray-50 border-y border-gray-100">
        <div className="container mx-auto px-4 sm:px-6 py-12 sm:py-16 max-w-5xl">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center mb-8">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="bg-white rounded-xl border border-gray-100 p-5">
              <p className="text-sm font-semibold text-green-700 mb-2">Step 1</p>
              <p className="text-sm text-gray-600">Locate a Zeflash-enabled charger, connect, and start the session.</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-100 p-5">
              <p className="text-sm font-semibold text-green-700 mb-2">Step 2</p>
              <p className="text-sm text-gray-600">Rapid AI diagnostics collect and process live charging datasets.</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-100 p-5">
              <p className="text-sm font-semibold text-green-700 mb-2">Step 3</p>
              <p className="text-sm text-gray-600">Receive a detailed battery health report and recommendations in minutes.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="container mx-auto px-4 sm:px-6 py-12 sm:py-16 max-w-5xl text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">Who It Is For</h2>
          <div className="flex flex-wrap justify-center gap-3">
            {audiences.map((item) => (
              <span key={item} className="px-4 py-2 rounded-full bg-gray-100 text-gray-700 text-sm font-medium">
                {item}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
        <div className="container mx-auto px-4 sm:px-6 py-12 sm:py-14 max-w-3xl text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">See Beyond the Battery</h2>
          <p className="text-gray-300 mb-6 text-base leading-relaxed">
            Zeflash turns complex EV battery data into clear, confident action for every charging decision.
          </p>
          <a
            href="https://zeflash.app"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center border border-white/30 px-6 py-3 rounded-lg font-semibold hover:bg-white/10 transition-all"
          >
            Go to Zeflash
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Zeflash;
