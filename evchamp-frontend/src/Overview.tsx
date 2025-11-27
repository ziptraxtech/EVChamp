import React from 'react';
import { FaRobot, FaCarBattery, FaMapMarkedAlt, FaMobileAlt } from 'react-icons/fa';
import { IconType } from 'react-icons';

interface Offering {
  icon: IconType;
  color: string;
  text: string;
}

const offerings: Offering[] = [
  { icon: FaRobot, color: 'text-blue-600', text: 'AI-Driven EV Leasing & Asset Management' },
  { icon: FaCarBattery, color: 'text-green-600', text: 'Smart Buyback & Warranty Solutions' },
  { icon: FaMapMarkedAlt, color: 'text-purple-600', text: 'Real-Time Telematics & Predictive Maintenance' },
  { icon: FaMobileAlt, color: 'text-pink-600', text: 'Integrated Mobile App & Web Dashboard' },
];

const Overview: React.FC = () => (
  <section className="py-16 bg-gradient-to-br from-yellow-200 via-green-200 to-blue-300">
    <div className="container mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
      {/* Left: QR Code Box */}
      <div className="flex flex-col items-center">
        <div className="w-40 h-40 bg-gradient-to-br from-gray-200 to-blue-100 border-4 border-dashed border-blue-300 flex items-center justify-center rounded-xl shadow-inner mb-3">
          <span className="text-blue-400 font-bold text-lg text-center">[QR Code Here]</span>
        </div>
        <span className="text-xs text-gray-400">Scan to download the app</span>
      </div>

      {/* Right: Text & Offerings */}
      <div>
        <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
          EVCHAMP Overview
        </h2>
        <p className="mb-6 text-lg text-gray-700 max-w-xl">
          At EVChamp, we are at the forefront of transforming electric vehicle (EV) fleet management through our integrated platform that combines AI-powered software with IoT-enabled smart hardware. Our solutions are designed to make EV operations seamless, efficient, and intelligent.
        </p>
        <div className="flex flex-col gap-4">
          {offerings.map((item, idx) => {
            const Icon = item.icon as React.ElementType;
            return (
              <div key={idx} className="flex items-center">
                <Icon className={`${item.color} text-2xl mr-3`} />
                <span className="text-gray-800 font-medium">{item.text}</span>
              </div>
            );
          })}
        </div>
        <div className="mt-6">
          <span className="inline-block bg-gradient-to-r from-blue-500 to-green-400 text-white px-4 py-1 rounded-full text-sm font-semibold shadow">
            Available on Android, iOS & Web
          </span>
        </div>
      </div>
    </div>
  </section>
);

export default Overview;