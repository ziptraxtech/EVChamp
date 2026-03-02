import React from 'react';
import { ScrollReveal } from './ScrollReveal';

const Features: React.FC = () => (
  <section id="features" className="py-12 sm:py-20 bg-transparent">
    <div className="container mx-auto px-4 sm:px-6">
      <ScrollReveal className="text-center mb-12">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">ZipTRAX Battery Analyzer</h2>
        <p className="mt-4 text-base sm:text-lg text-gray-600 max-w-3xl mx-auto">Ziptrax extends the life of Li-ion batteries by combining it with our AI-based Technology. It has a vision to provide the world with greener, smarter and longer lasting lithium ion batteries.</p>
      </ScrollReveal>
      <div className="text-center mt-8">
        <a
          href="/ziptrax"
          className="inline-block bg-gradient-to-r from-blue-300 to-blue-700 text-white font-bold text-base sm:text-lg px-6 sm:px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition"
        >
          Explore Ziptrax Opportunities
        </a>
      </div>
    </div>
  </section>
);

export default Features; 