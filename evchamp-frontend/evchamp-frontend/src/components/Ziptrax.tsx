import React from 'react';
import { Link } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';

const Ziptrax: React.FC = () => {
  const BackArrow = FaArrowLeft as React.ElementType;

  return (
    <div className="bg-gradient-to-br from-blue-50 via-white to-sky-50 min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-sky-400 to-blue-500 text-white">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-40 h-40 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-20 w-60 h-60 bg-yellow-300 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
          <Link
            to="/"
            className="inline-flex items-center text-white/80 hover:text-white transition-colors mb-8 font-semibold text-sm"
          >
            <BackArrow className="mr-2" />
            Back to Home
          </Link>

          <div className="text-center">
            {/* Lightning bolt icon */}
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl mb-6">
              <svg className="w-10 h-10 text-yellow-300" fill="currentColor" viewBox="0 0 24 24">
                <path d="M13 2L3 14h9l-1 10 10-12h-9l1-10z" />
              </svg>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2">
              ZIP<span className="text-yellow-300">TRAX</span>
            </h1>
            <p className="text-sky-100 font-semibold text-sm sm:text-base tracking-widest uppercase mb-6">Advanced CleanTech</p>
            <p className="text-lg sm:text-xl text-white/90 max-w-3xl mx-auto leading-relaxed">
              Ziptrax extends the life of Li-ion batteries by combining it with our AI-based Technology. Our artificial intelligence engine and IoT enabled hardware makes Lithium ion batteries last for up to <span className="font-bold text-yellow-300">40% longer</span>.
            </p>
            <p className="mt-4 text-base sm:text-lg text-white/80 max-w-2xl mx-auto">
              Ziptrax has a vision to provide the world with greener, smarter and longer lasting lithium ion batteries, while simultaneously eliminating battery waste and reducing environmental damage.
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-16">

        {/* App Overview — Device Management */}
        <section className="mb-16">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 text-center">ZipBattery App — Smart Device Management</h2>
          <p className="text-gray-600 text-center max-w-2xl mx-auto mb-10">
            Monitor all your battery-connected devices in one place. Track active and inactive devices with real-time charge percentage and temperature readings.
          </p>

          {/* Device List Mock */}
          <div className="max-w-md mx-auto bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-sky-400 to-blue-400 px-5 py-3">
              <h3 className="text-white font-bold text-lg">My Device</h3>
              <div className="flex mt-2 border-b border-white/30">
                <span className="text-white font-semibold text-sm pb-2 border-b-2 border-white mr-6">Active</span>
                <span className="text-white/60 font-medium text-sm pb-2">Inactive</span>
              </div>
            </div>
            <div className="divide-y divide-gray-100">
              {/* Device rows */}
              {[
                { name: 'Truck - 1', type: 'YBX ACTIVE SPECIALIST', charge: 68, temp: '79°C', chargeColor: 'text-green-500', tempColor: 'text-yellow-500', icon: '🚛' },
                { name: 'Truck - 2', type: 'YBX ACTIVE SPECIALIST', charge: 15, temp: '35°C', chargeColor: 'text-yellow-500', tempColor: 'text-green-500', icon: '🚛' },
                { name: 'Other', type: 'YBX ACTIVE SPECIALIST', charge: 25, temp: '85°C', chargeColor: 'text-yellow-500', tempColor: 'text-red-500', icon: '🔋' },
              ].map((device, i) => (
                <div key={i} className="flex items-center justify-between px-5 py-4 hover:bg-sky-50 transition-colors">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-slate-700 rounded-full flex items-center justify-center text-lg">{device.icon}</div>
                    <div>
                      <p className="font-bold text-gray-800 text-sm">{device.name}</p>
                      <p className="text-xs text-gray-500">{device.type}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className={`font-bold text-sm ${device.chargeColor}`}>{device.charge}%</span>
                    <span className={`font-bold text-sm ${device.tempColor}`}>{device.temp}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Battery Dashboard */}
        <section className="mb-16">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 text-center">Real-Time Battery Dashboard</h2>
          <p className="text-gray-600 text-center max-w-2xl mx-auto mb-10">
            Get a complete overview of your battery's vital statistics at a glance — charge level, temperature, voltage, health, charge cycles, and capacity.
          </p>

          <div className="max-w-lg mx-auto bg-gradient-to-br from-sky-400 to-blue-500 rounded-2xl shadow-xl p-6 sm:p-8 text-white">
            {/* Charge Ring */}
            <div className="flex justify-center mb-8">
              <div className="relative w-40 h-40">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="8" />
                  <circle cx="50" cy="50" r="42" fill="none" stroke="url(#chargeGradient)" strokeWidth="8" strokeLinecap="round" strokeDasharray="264" strokeDashoffset="84" />
                  <defs>
                    <linearGradient id="chargeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#22c55e" />
                      <stop offset="100%" stopColor="#86efac" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-bold">68%</span>
                  <span className="text-sm text-white/80">Charge</span>
                </div>
              </div>
            </div>

            {/* Temperature & Voltage */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-white/15 backdrop-blur-sm rounded-xl p-4 text-center">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-2xl font-bold text-yellow-300">79°C</p>
                <p className="text-xs text-white/70">Temperature</p>
              </div>
              <div className="bg-white/15 backdrop-blur-sm rounded-xl p-4 text-center">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M13 2L3 14h9l-1 10 10-12h-9l1-10z" />
                  </svg>
                </div>
                <p className="text-2xl font-bold text-yellow-300">12V</p>
                <p className="text-xs text-white/70">Voltage</p>
              </div>
            </div>

            {/* Health, Cycles, Capacity */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-white/15 backdrop-blur-sm rounded-xl p-3 text-center">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-1">
                  <svg className="w-4 h-4 text-red-300" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                  </svg>
                </div>
                <p className="text-xl font-bold text-green-300">95%</p>
                <p className="text-xs text-white/70">Health</p>
              </div>
              <div className="bg-white/15 backdrop-blur-sm rounded-xl p-3 text-center">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </div>
                <p className="text-xl font-bold text-yellow-300">48</p>
                <p className="text-xs text-white/70">Cycles</p>
              </div>
              <div className="bg-white/15 backdrop-blur-sm rounded-xl p-3 text-center">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                  </svg>
                </div>
                <p className="text-xl font-bold text-yellow-300">25Ah</p>
                <p className="text-xs text-white/70">Capacity</p>
              </div>
            </div>

            {/* Advance Analysis Button */}
            <button className="w-full mt-6 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-3 rounded-xl shadow-lg transition-all flex items-center justify-center space-x-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span>Advance Analysis</span>
            </button>
          </div>
        </section>

        {/* Advanced Cell Analysis */}
        <section className="mb-16">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 text-center">Advanced Cell-Level Analysis</h2>
          <p className="text-gray-600 text-center max-w-2xl mx-auto mb-10">
            Drill down into individual cell voltage and temperature readings. Color-coded indicators instantly flag cells operating outside normal range.
          </p>

          <div className="max-w-lg mx-auto bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-sky-400 to-blue-400 px-5 py-3">
              <h3 className="text-white font-bold text-lg">Advance Analysis</h3>
              <div className="flex mt-2 space-x-6">
                <span className="text-white font-semibold text-sm pb-2 border-b-2 border-white">Cells</span>
                <span className="text-white/60 font-medium text-sm pb-2">SoH</span>
                <span className="text-white/60 font-medium text-sm pb-2">Current</span>
              </div>
            </div>
            <div className="p-5">
              <div className="mb-4 text-sm text-gray-500">
                <p className="mb-1">Normal Range:</p>
                <p>Voltage (<span className="text-green-500 font-semibold">2.5v-8v</span>)</p>
                <p>Temperature (<span className="text-green-500 font-semibold">29°c-87°c</span>)</p>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { cell: 1, v: '3.3v', t: '39°c', vColor: 'bg-sky-200', tColor: 'bg-green-200' },
                  { cell: 2, v: '6.3v', t: '69°c', vColor: 'bg-yellow-200', tColor: 'bg-yellow-200' },
                  { cell: 3, v: '7.5v', t: '88°c', vColor: 'bg-orange-300', tColor: 'bg-red-300' },
                  { cell: 4, v: '3.3v', t: '39°c', vColor: 'bg-sky-200', tColor: 'bg-green-200' },
                  { cell: 5, v: '6.3v', t: '69°c', vColor: 'bg-yellow-200', tColor: 'bg-yellow-200' },
                  { cell: 6, v: '7.5v', t: '88°c', vColor: 'bg-orange-300', tColor: 'bg-red-300' },
                  { cell: 7, v: '3.3v', t: '39°c', vColor: 'bg-sky-200', tColor: 'bg-green-200' },
                  { cell: 8, v: '6.3v', t: '69°c', vColor: 'bg-yellow-200', tColor: 'bg-yellow-200' },
                  { cell: 9, v: '7.5v', t: '88°c', vColor: 'bg-orange-300', tColor: 'bg-red-300' },
                ].map((cell) => (
                  <div key={cell.cell} className="border border-gray-200 rounded-lg p-2.5 text-center">
                    <p className="text-xs text-gray-500 font-medium mb-1.5">{cell.cell}</p>
                    <div className={`${cell.vColor} rounded px-2 py-0.5 text-xs font-semibold text-gray-700 mb-1`}>{cell.v}</div>
                    <div className={`${cell.tColor} rounded px-2 py-0.5 text-xs font-semibold text-gray-700`}>{cell.t}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* State of Health */}
        <section className="mb-16">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 text-center">State of Health (SoH) Tracking</h2>
          <p className="text-gray-600 text-center max-w-2xl mx-auto mb-10">
            Track battery degradation over time with historical SoH graphs. Predict end-of-life and plan replacements proactively.
          </p>

          <div className="max-w-lg mx-auto bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-sky-400 to-blue-400 px-5 py-3">
              <h3 className="text-white font-bold text-lg">Advance Analysis</h3>
              <div className="flex mt-2 space-x-6">
                <span className="text-white/60 font-medium text-sm pb-2">Cells</span>
                <span className="text-white font-semibold text-sm pb-2 border-b-2 border-white">SoH</span>
                <span className="text-white/60 font-medium text-sm pb-2">Current</span>
              </div>
            </div>
            <div className="p-5">
              <h4 className="text-gray-800 font-semibold mb-4">State of Health</h4>
              {/* SoH Chart Mock */}
              <div className="relative h-48 bg-gradient-to-b from-sky-50 to-white rounded-lg border border-gray-100 p-4">
                {/* Y-axis labels */}
                <div className="absolute left-2 top-3 bottom-8 flex flex-col justify-between text-xs text-gray-400">
                  <span>100</span><span>80</span><span>60</span><span>40</span><span>20</span><span>0</span>
                </div>
                {/* Chart area */}
                <div className="ml-8 h-full relative">
                  <svg className="w-full h-full" viewBox="0 0 300 160" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="sohFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#7dd3fc" stopOpacity="0.4" />
                        <stop offset="100%" stopColor="#7dd3fc" stopOpacity="0.05" />
                      </linearGradient>
                    </defs>
                    <path d="M0,8 L50,12 L100,16 L150,20 L200,28 L250,36 L300,72 L300,160 L0,160 Z" fill="url(#sohFill)" />
                    <polyline points="0,8 50,12 100,16 150,20 200,28 250,36 300,72" fill="none" stroke="#84cc16" strokeWidth="2.5" />
                    {/* Data points */}
                    {[
                      [0, 8], [50, 12], [100, 16], [150, 20], [200, 28], [250, 36], [300, 72]
                    ].map(([x, y], i) => (
                      <circle key={i} cx={x} cy={y} r="4" fill="#84cc16" stroke="white" strokeWidth="2" />
                    ))}
                  </svg>
                </div>
                {/* X-axis labels */}
                <div className="flex justify-between ml-8 mt-1 text-xs text-gray-400">
                  <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span><span>July</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Add Battery via QR */}
        <section className="mb-16">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 text-center">Easy Battery Registration</h2>
          <p className="text-gray-600 text-center max-w-2xl mx-auto mb-10">
            Add batteries instantly by entering the serial number or scanning the QR code on the battery. Plug & play setup — no technical expertise needed.
          </p>

          <div className="max-w-md mx-auto bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-sky-400 to-blue-400 px-5 py-3">
              <h3 className="text-white font-bold text-lg">Add a Battery</h3>
            </div>
            <div className="p-6 text-center">
              <div className="flex items-center space-x-2 mb-4">
                <div className="flex-1 border border-gray-300 rounded-lg px-4 py-2.5 text-left text-gray-400 text-sm">Enter Serial Number</div>
                <button className="bg-sky-200 text-sky-700 font-bold px-5 py-2.5 rounded-lg text-sm">ADD</button>
              </div>
              <p className="text-gray-500 text-sm mb-1">Or,</p>
              <p className="font-bold text-gray-800 mb-4">Scan QR Code</p>
              <div className="bg-gray-100 rounded-xl p-6 inline-flex flex-col items-center">
                <svg className="w-20 h-20 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 013.75 9.375v-4.5zM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 01-1.125-1.125v-4.5zM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0113.5 9.375v-4.5z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 6.75h.75v.75h-.75v-.75zM6.75 16.5h.75v.75h-.75v-.75zM16.5 6.75h.75v.75h-.75v-.75zM13.5 13.5h.75v.75h-.75v-.75zM13.5 19.5h.75v.75h-.75v-.75zM19.5 13.5h.75v.75h-.75v-.75zM19.5 19.5h.75v.75h-.75v-.75zM16.5 16.5h.75v.75h-.75v-.75z" />
                </svg>
                <p className="text-xs text-gray-500">Please focus on QR Code</p>
              </div>
            </div>
          </div>
        </section>

        {/* Key App Features Grid */}
        <section className="mb-16">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-10 text-center">Why Choose ZipTRAX?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { icon: '⚡', title: 'AI-Powered Analytics', desc: 'Our artificial intelligence engine makes Lithium ion batteries last for up to 40% longer through predictive diagnostics.' },
              { icon: '🔋', title: 'Real-Time Monitoring', desc: 'Track charge level, voltage, temperature, health, cycles, and capacity — all in real time from one dashboard.' },
              { icon: '🔬', title: 'Cell-Level Analysis', desc: 'Drill into individual cell voltage and temperature data with color-coded alerts for cells outside normal range.' },
              { icon: '📈', title: 'State of Health Tracking', desc: 'Historical SoH graphs to track battery degradation over time and predict end-of-life proactively.' },
              { icon: '📱', title: 'QR Code Registration', desc: 'Add batteries instantly via serial number or QR code scan. Plug & play — no technical setup required.' },
              { icon: '🌱', title: 'Greener & Smarter', desc: 'Eliminate battery waste and reduce environmental damage by extending battery life significantly.' },
            ].map((f, i) => (
              <div key={i} className="bg-white rounded-xl p-5 shadow-md border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                <div className="text-3xl mb-3">{f.icon}</div>
                <h3 className="font-bold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Privacy & Trust */}
        <section className="mb-16">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sm:p-8 max-w-2xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-yellow-50 rounded-xl mb-4">
              <svg className="w-8 h-8 text-yellow-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M13 2L3 14h9l-1 10 10-12h-9l1-10z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">ZipBattery</h3>
            <h4 className="text-lg font-bold text-gray-800 mb-4">We are committed to protecting your privacy</h4>
            <p className="text-sm text-gray-600 leading-relaxed mb-3">
              ZipTrax built the ZipBattery app as a Commercial app. This SERVICE is provided by ZipTrax and is intended for use as is.
            </p>
            <p className="text-sm text-gray-600 leading-relaxed">
              The Personal Information that we collect is used for providing and improving the Service. We will not use or share your information with anyone except as described in our Privacy Policy.
            </p>
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center mb-8">
          <div className="bg-gradient-to-r from-sky-400 to-blue-500 rounded-2xl p-8 sm:p-12 text-white shadow-xl">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">Ready to extend your battery life?</h2>
            <p className="text-white/80 max-w-xl mx-auto mb-8">
              Get started with ZipTRAX today and experience smarter, greener, longer-lasting lithium ion battery management.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <a href="https://www.evchamp.in" target="_blank" rel="noopener noreferrer" className="bg-white text-blue-600 font-bold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all text-sm sm:text-base">
                Visit Website
              </a>
              <a href="mailto:franchise@evchamp.in" className="bg-yellow-400 text-gray-900 font-bold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all text-sm sm:text-base">
                Contact Us
              </a>
              <a href="tel:+918368681769" className="bg-white/20 backdrop-blur-sm text-white font-bold px-6 py-3 rounded-xl shadow-lg hover:bg-white/30 transition-all text-sm sm:text-base">
                +91 83686 81769
              </a>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
};

export default Ziptrax;
