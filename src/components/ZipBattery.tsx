import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaArrowLeft, FaChevronDown } from 'react-icons/fa';

const ZipBattery: React.FC = () => {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const BackArrow = FaArrowLeft as React.ElementType;
  const ChevronIcon = FaChevronDown as React.ElementType;

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50">
      <section className="py-12 sm:py-16 px-4 sm:px-6 max-w-6xl mx-auto">
        {/* Back Button */}
        <Link 
          to="/" 
          className="inline-flex items-center text-gray-600 hover:text-orange-700 transition-colors mb-8 font-semibold"
        >
          <BackArrow className="mr-2" />
          Back to Home
        </Link>

        {/* Header Section */}
        <div className="mb-12">
          <div className="flex items-center space-x-4 mb-6">
            {/* ZipBattery Logo */}
            <div className="flex items-center space-x-2">
              <div className="text-4xl sm:text-5xl font-bold">
                <span className="text-orange-600">Zip</span>
                <span className="text-red-500">Battery</span>
              </div>
              <div className="text-4xl sm:text-5xl text-yellow-400 -ml-2">⚡</div>
            </div>
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Extend Battery Lifespan with AI Intelligence
          </h1>

          <p className="text-base sm:text-lg text-gray-700 mb-4 leading-relaxed max-w-3xl">
            ZipBattery extends the lifespan of Li-ion batteries by combining cutting-edge AI technology with IoT capabilities. Our vision is to provide the world with greener, smarter, and longer-lasting lithium-ion batteries. Our artificial intelligence engine and IoT enabled hardware Lithium ion batteries last for up to 40% longer.
          </p>

          <p className="text-base sm:text-lg text-gray-600 mb-6">
            Experience the intelligence layer that powers the entire electric mobility ecosystem.
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          {/* Left Section - Text Content */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">
              Why Choose ZipBattery?
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
              <a
                href="#"
                className="inline-block w-full text-center bg-white/20 backdrop-blur-sm text-white font-bold py-3 rounded-lg hover:bg-white/30 transition-colors border border-white/40"
              >
                Learn More
              </a>
            </div>
          </div>
        </div>

        {/* Expandable Sections */}
        <div className="space-y-4 mb-12">
          {/* Cells Section */}
          <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            <button
              onClick={() => toggleSection('cells')}
              className="w-full flex items-center justify-between p-6 bg-white hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center space-x-4">
                <div className="text-3xl">🔋</div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900">Cells</h3>
              </div>
              <ChevronIcon 
                className={`w-6 h-6 text-orange-500 transition-transform ${
                  expandedSection === 'cells' ? 'rotate-180' : ''
                }`}
              />
            </button>

            {expandedSection === 'cells' && (
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                <div className="grid lg:grid-cols-3 gap-6">
                  {/* Text Content */}
                  <div className="lg:col-span-2 space-y-4 text-gray-700">
                    <p className="text-base">
                      Our advanced cell optimization technology focuses on individual battery cell performance and health. We provide:
                    </p>
                    <ul className="list-disc list-inside space-y-2">
                      <li><strong>Cell-Level Monitoring:</strong> Track voltage, impedance, and capacity of each cell in real-time</li>
                      <li><strong>Predictive Degradation:</strong> AI models predict cell degradation patterns and prevent failures</li>
                      <li><strong>Balancing Optimization:</strong> Intelligent cell balancing algorithms extend overall pack lifespan</li>
                      <li><strong>Manufacturing Integration:</strong> Quality assurance solutions for battery manufacturers</li>
                      <li><strong>Recovery Programs:</strong> Second-life assessment and recycling optimization for end-of-life cells</li>
                    </ul>
                    <p className="pt-4 text-sm text-gray-600">
                      With our cell-level insights, OEMs and fleet operators can optimize battery performance and reduce total cost of ownership by up to 35%.
                    </p>
                  </div>
                  
                  {/* Cell Analysis Grid Visualization */}
                  <div className="lg:col-span-1">
                    <div className="bg-white rounded-lg p-4 shadow-md border border-gray-200 max-h-96 overflow-y-auto">
                      <div className="space-y-3">
                        {/* Header Info */}
                        <div className="bg-blue-100 rounded-lg p-3 mb-3">
                          <h4 className="font-bold text-sm text-gray-800 mb-2">Normal Range:</h4>
                          <p className="text-xs text-gray-700 mb-1">Voltage: <span className="text-green-600 font-semibold">(2.5v-8v)</span></p>
                          <p className="text-xs text-gray-700">Temperature: <span className="text-green-600 font-semibold">(29°c-87°c)</span></p>
                        </div>
                        
                        {/* Cell Grid - 3x3 */}
                        <div className="grid grid-cols-3 gap-2">
                          {/* Cell 1 */}
                          <div className="border border-gray-300 rounded-lg p-2 bg-white">
                            <p className="text-xs font-bold text-gray-600 mb-1">1</p>
                            <div className="bg-blue-300 rounded px-1 py-0.5 mb-1">
                              <p className="text-xs font-bold text-gray-800">3.3v</p>
                            </div>
                            <div className="bg-green-400 rounded px-1 py-0.5">
                              <p className="text-xs font-bold text-gray-800">39°c</p>
                            </div>
                          </div>

                          {/* Cell 2 */}
                          <div className="border border-gray-300 rounded-lg p-2 bg-white">
                            <p className="text-xs font-bold text-gray-600 mb-1">2</p>
                            <div className="bg-blue-400 rounded px-1 py-0.5 mb-1">
                              <p className="text-xs font-bold text-gray-800">6.3v</p>
                            </div>
                            <div className="bg-yellow-400 rounded px-1 py-0.5">
                              <p className="text-xs font-bold text-gray-800">69°c</p>
                            </div>
                          </div>

                          {/* Cell 3 */}
                          <div className="border border-gray-300 rounded-lg p-2 bg-white">
                            <p className="text-xs font-bold text-gray-600 mb-1">3</p>
                            <div className="bg-blue-600 rounded px-1 py-0.5 mb-1">
                              <p className="text-xs font-bold text-white">7.5v</p>
                            </div>
                            <div className="bg-orange-400 rounded px-1 py-0.5">
                              <p className="text-xs font-bold text-gray-800">88°c</p>
                            </div>
                          </div>

                          {/* Cell 4 */}
                          <div className="border border-gray-300 rounded-lg p-2 bg-white">
                            <p className="text-xs font-bold text-gray-600 mb-1">4</p>
                            <div className="bg-blue-300 rounded px-1 py-0.5 mb-1">
                              <p className="text-xs font-bold text-gray-800">3.3v</p>
                            </div>
                            <div className="bg-green-400 rounded px-1 py-0.5">
                              <p className="text-xs font-bold text-gray-800">39°c</p>
                            </div>
                          </div>

                          {/* Cell 5 */}
                          <div className="border border-gray-300 rounded-lg p-2 bg-white">
                            <p className="text-xs font-bold text-gray-600 mb-1">5</p>
                            <div className="bg-blue-400 rounded px-1 py-0.5 mb-1">
                              <p className="text-xs font-bold text-gray-800">6.3v</p>
                            </div>
                            <div className="bg-yellow-400 rounded px-1 py-0.5">
                              <p className="text-xs font-bold text-gray-800">69°c</p>
                            </div>
                          </div>

                          {/* Cell 6 */}
                          <div className="border border-gray-300 rounded-lg p-2 bg-white">
                            <p className="text-xs font-bold text-gray-600 mb-1">6</p>
                            <div className="bg-blue-600 rounded px-1 py-0.5 mb-1">
                              <p className="text-xs font-bold text-white">7.5v</p>
                            </div>
                            <div className="bg-orange-400 rounded px-1 py-0.5">
                              <p className="text-xs font-bold text-gray-800">88°c</p>
                            </div>
                          </div>

                          {/* Cell 7 */}
                          <div className="border border-gray-300 rounded-lg p-2 bg-white">
                            <p className="text-xs font-bold text-gray-600 mb-1">7</p>
                            <div className="bg-blue-300 rounded px-1 py-0.5 mb-1">
                              <p className="text-xs font-bold text-gray-800">3.3v</p>
                            </div>
                            <div className="bg-green-400 rounded px-1 py-0.5">
                              <p className="text-xs font-bold text-gray-800">39°c</p>
                            </div>
                          </div>

                          {/* Cell 8 */}
                          <div className="border border-gray-300 rounded-lg p-2 bg-white">
                            <p className="text-xs font-bold text-gray-600 mb-1">8</p>
                            <div className="bg-blue-400 rounded px-1 py-0.5 mb-1">
                              <p className="text-xs font-bold text-gray-800">6.3v</p>
                            </div>
                            <div className="bg-yellow-400 rounded px-1 py-0.5">
                              <p className="text-xs font-bold text-gray-800">69°c</p>
                            </div>
                          </div>

                          {/* Cell 9 */}
                          <div className="border border-gray-300 rounded-lg p-2 bg-white">
                            <p className="text-xs font-bold text-gray-600 mb-1">9</p>
                            <div className="bg-blue-600 rounded px-1 py-0.5 mb-1">
                              <p className="text-xs font-bold text-white">7.5v</p>
                            </div>
                            <div className="bg-orange-400 rounded px-1 py-0.5">
                              <p className="text-xs font-bold text-gray-800">88°c</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

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
                    <div className="bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl p-6 shadow-lg text-white">
                      {/* Header */}
                      <div className="flex justify-between items-center mb-6">
                        <h4 className="text-lg font-bold">Truck - 1</h4>
                        <div className="text-2xl">⏻</div>
                      </div>
                      
                      {/* Circular Charge Indicator */}
                      <div className="flex justify-center mb-8">
                        <div className="relative w-32 h-32">
                          <svg className="w-full h-full" viewBox="0 0 120 120">
                            {/* Background Circle */}
                            <circle cx="60" cy="60" r="50" fill="none" stroke="#1e40af" strokeWidth="12"/>
                            {/* Charge Progress Circle */}
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
                          {/* Center Text */}
                          <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-3xl font-bold">68%</span>
                            <span className="text-sm opacity-80">Charge</span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Metrics Grid */}
                      <div className="grid grid-cols-3 gap-3 mb-4">
                        {/* Temperature */}
                        <div className="text-center">
                          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-2">
                            <span className="text-lg">🌡️</span>
                          </div>
                          <p className="text-lg font-bold text-yellow-300">79°c</p>
                          <p className="text-xs opacity-75">Temperature</p>
                        </div>
                        
                        {/* Voltage */}
                        <div className="text-center">
                          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-2">
                            <span className="text-lg">⚡</span>
                          </div>
                          <p className="text-lg font-bold text-yellow-300">12v</p>
                          <p className="text-xs opacity-75">Voltage</p>
                        </div>
                        
                        {/* Placeholder */}
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
                        {/* Health */}
                        <div className="text-center">
                          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-2">
                            <span className="text-lg">❤️</span>
                          </div>
                          <p className="text-lg font-bold text-yellow-300">95%</p>
                          <p className="text-xs opacity-75">Health</p>
                        </div>
                        
                        {/* Cycles */}
                        <div className="text-center">
                          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-2">
                            <span className="text-lg">🔄</span>
                          </div>
                          <p className="text-lg font-bold text-yellow-300">48</p>
                          <p className="text-xs opacity-75">Cycles</p>
                        </div>
                        
                        {/* Capacity */}
                        <div className="text-center">
                          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-2">
                            <span className="text-lg">🔋</span>
                          </div>
                          <p className="text-lg font-bold text-yellow-300">25Ah</p>
                          <p className="text-xs opacity-75">Capacity</p>
                        </div>
                      </div>
                      
                      {/* Advance Analysis Button */}
                      <button className="w-full mt-6 bg-yellow-400 text-gray-800 font-bold py-3 rounded-lg hover:bg-yellow-300 transition-colors flex items-center justify-center space-x-2">
                        <span>🔒</span>
                        <span>Advance Analysis</span>
                      </button>
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
            Join OEMs, fleet operators, and energy enterprises who are extending battery lifespan and reducing costs with ZipBattery's AI-powered solutions.
          </p>
          
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-6 inline-block">
            <p className="mb-2"><strong>Contact Us:</strong></p>
            <p className="mb-2">📧 Email: <a href="mailto:zipbattery@evchamp.in" className="underline hover:text-orange-100">zipbattery@evchamp.in</a></p>
            <p className="mb-2">🌐 Website: <a href="https://www.evchamp.in" className="underline hover:text-orange-100">www.evchamp.in</a></p>
            <p>📞 Call: <a href="tel:+918368681769" className="underline hover:text-orange-100">+91 83686 81769</a></p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ZipBattery;
