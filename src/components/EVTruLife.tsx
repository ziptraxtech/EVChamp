import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { FaChevronDown } from 'react-icons/fa';

const EVTruLife: React.FC = () => {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const navigate = useNavigate();
  const ChevronIcon = FaChevronDown as React.ElementType;

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>EVTruLife | AI Battery Intelligence to Extend EV Battery Lifespan</title>
        <meta name="description" content="EVTruLife extends Li-ion battery lifespan by up to 40% using AI and IoT. Real-time health monitoring, predictive analytics, and smart diagnostics for EVs." />
        <meta name="keywords" content="EV battery intelligence, AI battery diagnostics, lithium ion battery lifespan, EVTruLife, EV battery health" />
      </Helmet>

      {/* Hero */}
      <section className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
        <div className="container mx-auto px-4 sm:px-6 py-14 sm:py-18 text-center max-w-3xl">
          <span className="inline-block text-xs font-bold tracking-wider uppercase text-green-400 mb-3">EVTruLife by EVChamp</span>
          <h1 className="text-3xl sm:text-4xl font-bold mb-3">AI Battery Intelligence</h1>
          <p className="text-gray-300 text-base sm:text-lg leading-relaxed">
            Extend the lifespan of Li-ion batteries by up to 40% with cutting-edge AI technology and IoT capabilities. Greener, smarter, longer-lasting batteries.
          </p>
        </div>
      </section>

      <section className="py-12 sm:py-16 px-4 sm:px-6 max-w-6xl mx-auto">

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          {/* Left Section - Text Content */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">
              Why Choose EVTruLife?
            </h2>

            <div className="space-y-4 mb-8">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 mt-1">
                  <div className="flex items-center justify-center h-8 w-8 rounded-full bg-orange-500 text-white font-bold">
                    ✓
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    AI-Powered Battery Intelligence
                  </h3>
                  <p className="text-gray-700">
                    Advanced algorithms that analyze battery health, predict degradation, and optimize charging patterns for maximum longevity.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 mt-1">
                  <div className="flex items-center justify-center h-8 w-8 rounded-full bg-orange-500 text-white font-bold">
                    ✓
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Real-Time Monitoring
                  </h3>
                  <p className="text-gray-700">
                    24/7 IoT-enabled tracking of battery performance, temperature, and health metrics through our cloud platform.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 mt-1">
                  <div className="flex items-center justify-center h-8 w-8 rounded-full bg-orange-500 text-white font-bold">
                    ✓
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Sustainability at Core
                  </h3>
                  <p className="text-gray-700">
                    Reduce waste, extend battery life, and minimize environmental impact with our eco-conscious solutions.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 mt-1">
                  <div className="flex items-center justify-center h-8 w-8 rounded-full bg-orange-500 text-white font-bold">
                    ✓
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    End-to-End Solutions
                  </h3>
                  <p className="text-gray-700">
                    From manufacturing to fleet operations to energy recovery, we support the entire battery lifecycle.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Section - Call to Action */}
          <div className="lg:col-span-1">
            <div className="bg-gradient-to-br from-orange-400 to-red-600 rounded-2xl p-8 text-white shadow-xl sticky top-24">
              <h3 className="text-2xl font-bold mb-4">Ready to Transform Your Battery Strategy?</h3>
              <p className="mb-6 text-orange-50">
                Join the battery revolution and extend your battery lifespan with AI intelligence.
              </p>
              <a
                href="mailto:zipbattery@evchamp.in"
                className="inline-block w-full text-center bg-white text-orange-600 font-bold py-3 rounded-lg hover:bg-orange-50 transition-colors mb-4"
              >
                Get in Touch
              </a>
              <button
                type="button"
                className="inline-block w-full text-center bg-white/20 backdrop-blur-sm text-white font-bold py-3 rounded-lg hover:bg-white/30 transition-colors border border-white/40"
              >
                Learn More
              </button>
            </div>
          </div>
        </div>

        {/* Expandable Sections */}
        <div className="space-y-4 mb-12">
          {/* Batteries Section */}
          <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            <button
              onClick={() => toggleSection('batteries')}
              className="w-full flex items-center justify-between p-6 bg-white hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center space-x-4">
                <div className="text-3xl">⚡</div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900">Batteries</h3>
              </div>
              <ChevronIcon 
                className={`w-6 h-6 text-orange-500 transition-transform ${
                  expandedSection === 'batteries' ? 'rotate-180' : ''
                }`}
              />
            </button>

            {expandedSection === 'batteries' && (
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                <div className="grid lg:grid-cols-3 gap-6">
                  {/* Text Content */}
                  <div className="lg:col-span-2 space-y-4 text-gray-700">
                    <p className="text-base">
                      Complete battery pack management and optimization for electric vehicles and energy storage systems:
                    </p>
                    <ul className="list-disc list-inside space-y-2">
                      <li><strong>Fleet Battery Management:</strong> Monitor entire EV fleet battery health from a single dashboard</li>
                      <li><strong>Charging Optimization:</strong> Smart charging protocols extend battery lifespan and reduce charging times</li>
                      <li><strong>Thermal Management:</strong> AI-driven temperature optimization for peak performance</li>
                      <li><strong>Energy Storage Systems:</strong> Solutions for stationary battery storage and grid applications</li>
                      <li><strong>SOS & Alert System:</strong> Real-time notifications for battery anomalies and maintenance needs</li>
                      <li><strong>Analytics & Reports:</strong> Detailed insights into battery performance, ROI, and maintenance schedules</li>
                    </ul>
                    <p className="pt-4 text-sm text-gray-600">
                      Our battery management platform is trusted by OEMs, fleet operators, and energy enterprises to maximize battery lifespan and operational efficiency.
                    </p>
                  </div>
                  
                  {/* Battery Monitoring Dashboard */}
                  <div className="lg:col-span-1">
                    <div className="bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl p-6 shadow-lg text-white relative overflow-hidden">
                      {/* Blurred Content */}
                      <div className="filter blur-[2px] pointer-events-none select-none">
                        {/* Header */}
                        <div className="flex justify-between items-center mb-6">
                          <h4 className="text-lg font-bold">Truck - 1</h4>
                          <div className="text-2xl">⏻</div>
                        </div>
                        
                        {/* Circular Charge Indicator */}
                        <div className="flex justify-center mb-8">
                          <div className="relative w-32 h-32">
                            <svg className="w-full h-full" viewBox="0 0 120 120">
                              <circle cx="60" cy="60" r="50" fill="none" stroke="#1e40af" strokeWidth="12"/>
                              <circle 
                                cx="60" 
                                cy="60" 
                                r="50" 
                                fill="none" 
                                stroke="#84cc16" 
                                strokeWidth="12"
                                strokeDasharray={`${(68 / 100) * 314} 314`}
                                strokeLinecap="round"
                                transform="rotate(-90 60 60)"
                              />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                              <span className="text-3xl font-bold">68%</span>
                              <span className="text-sm opacity-80">Charge</span>
                            </div>
                          </div>
                        </div>
                        
                        {/* Metrics Grid */}
                        <div className="grid grid-cols-3 gap-3 mb-4">
                          <div className="text-center">
                            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-2">
                              <span className="text-lg">🌡️</span>
                            </div>
                            <p className="text-lg font-bold text-yellow-300">79°c</p>
                            <p className="text-xs opacity-75">Temperature</p>
                          </div>
                          <div className="text-center">
                            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-2">
                              <span className="text-lg">⚡</span>
                            </div>
                            <p className="text-lg font-bold text-yellow-300">12v</p>
                            <p className="text-xs opacity-75">Voltage</p>
                          </div>
                          <div className="text-center">
                            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-2">
                              <span className="text-lg">📊</span>
                            </div>
                            <p className="text-lg font-bold text-yellow-300">-</p>
                            <p className="text-xs opacity-75">Status</p>
                          </div>
                        </div>
                        
                        {/* Additional Metrics */}
                        <div className="grid grid-cols-3 gap-3">
                          <div className="text-center">
                            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-2">
                              <span className="text-lg">❤️</span>
                            </div>
                            <p className="text-lg font-bold text-yellow-300">95%</p>
                            <p className="text-xs opacity-75">Health</p>
                          </div>
                          <div className="text-center">
                            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-2">
                              <span className="text-lg">🔄</span>
                            </div>
                            <p className="text-lg font-bold text-yellow-300">48</p>
                            <p className="text-xs opacity-75">Cycles</p>
                          </div>
                          <div className="text-center">
                            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-2">
                              <span className="text-lg">🔋</span>
                            </div>
                            <p className="text-lg font-bold text-yellow-300">25Ah</p>
                            <p className="text-xs opacity-75">Capacity</p>
                          </div>
                        </div>
                      </div>

                      {/* Lock Overlay */}
                      <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/30 backdrop-blur-[1px] rounded-2xl">
                        <div className="bg-white/20 backdrop-blur-sm rounded-full p-4 mb-4">
                          <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                          </svg>
                        </div>
                        <p className="text-white font-bold text-lg mb-1">Analysis Locked</p>
                        <p className="text-white/70 text-sm mb-4 text-center px-6">Add your battery to unlock detailed analysis</p>
                        <button 
                          onClick={() => navigate('/advance-analysis?mode=battery')}
                          className="bg-yellow-400 text-gray-800 font-bold px-8 py-3 rounded-lg hover:bg-yellow-300 transition-all transform hover:scale-105 shadow-lg flex items-center space-x-2"
                        >
                          <span>🔓</span>
                          <span>Unlock Analysis</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Contact Section */}
        <div className="bg-gradient-to-r from-orange-400 to-red-600 rounded-2xl p-8 sm:p-12 text-white shadow-lg">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">
            Transform Your Battery Strategy Today
          </h2>
          <p className="text-lg mb-8 text-orange-50 max-w-2xl">
            Join OEMs, fleet operators, and energy enterprises who are extending battery lifespan and reducing costs with EVTruLife's AI-powered solutions.
          </p>
          
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-6 inline-block">
            <p className="mb-2"><strong>Contact Us:</strong></p>
            <p className="mb-2">📧 Email: <a href="mailto:evtrulife@evchamp.in" className="underline hover:text-orange-100">evtrulife@evchamp.in</a></p>
            <p className="mb-2">🌐 Website: <a href="https://www.evchamp.in" className="underline hover:text-orange-100">www.evchamp.in</a></p>
            <p>📞 Call: <a href="tel:+918368681769" className="underline hover:text-orange-100">+91 83686 81769</a></p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default EVTruLife;
