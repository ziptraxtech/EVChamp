import React, { useRef } from 'react';
import headerImg from '../assets/header.jpg';

const Hero: React.FC = () => {
  // Function to trigger attention effect on navbar buttons
  const handleExploreClick = () => {
    // Add a class to each navbar button for attention
    ['rent-ev-btn', 'buy-plans-btn', 'franchise-btn'].forEach(id => {
      const btn = document.getElementById(id);
      if (btn) {
        btn.classList.add('animate-pulse', 'ring-4', 'ring-green-400');
        setTimeout(() => {
          btn.classList.remove('animate-pulse', 'ring-4', 'ring-green-400');
        }, 1200);
      }
    });
  };

  return (
    <section className="py-12 bg-gradient-to-tr from-yellow-200 via-green-200 to-blue-300 transition-colors duration-1000">
      <div className="container mx-auto px-6 flex flex-col md:flex-row items-stretch justify-between gap-10">
        {/* Text Section */}
        <div className="flex-1 max-w-xl flex flex-col justify-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight">
            Empowering Intelligent Electric Mobility<br />
            <span className="text-green-600">with AI &amp; IoT-Driven Fleet Management</span>
          </h1>
          <p className="mt-6 text-lg text-gray-600">
            At EVChamp, we are transforming EV fleet management through our integrated platform that combines AI-powered software with IoT-enabled smart hardware. Experience seamless, efficient, and intelligent electric mobility operations.
          </p>
          <div className="mt-8">
            <button
              onClick={handleExploreClick}
              className="inline-block bg-gradient-to-r from-green-500 to-green-700 text-white font-bold text-lg px-10 py-4 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all"
            >
              Explore Plans &amp; Solutions
            </button>
          </div>
        </div>
        {/* Image and Points Section */}
        <div className="flex-1 flex flex-col items-center justify-center h-full">
          <img
            src={headerImg}
            alt="EV Fleet Management Illustration"
            className="w-full h-full rounded-xl shadow-2xl object-cover mb-6"
          />
          <div className="mt-6 flex flex-col sm:flex-row flex-wrap gap-x-10 gap-y-4 w-full justify-center">
            <div className="flex items-center space-x-2">
              <svg className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="font-semibold text-gray-700">AI-Driven Leasing &amp; Asset Management</span>
            </div>
            <div className="flex items-center space-x-2">
              <svg className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="font-semibold text-gray-700">Smart Buyback &amp; Warranty</span>
            </div>
            <div className="flex items-center space-x-2">
              <svg className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="font-semibold text-gray-700">Real-Time Telematics &amp; Analytics</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;