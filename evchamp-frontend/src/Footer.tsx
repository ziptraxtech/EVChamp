// src/components/Footer.tsx
import React from 'react';
import footerBanner from './assets/footer_banner.jpeg';

const Footer: React.FC = () => (
  <footer className="bg-gradient-to-tr from-blue-900 via-green-900 to-yellow-700 text-white">



    <div className="container mx-auto px-6 py-12">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <h3 className="text-xl font-bold mb-4">© EVChamp</h3>
          <p className="text-gray-400">India's leading AI & IoT-driven EV fleet management platform.</p>
          {/* Social icons can be added here */}
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
          <ul className="space-y-2">
            <li><a href="/" className="text-gray-400 hover:text-white">Home</a></li>
            <li><a href="#features" className="text-gray-400 hover:text-white">Features</a></li>
            <li><a href="#coverage" className="text-gray-400 hover:text-white">Coverage</a></li>
            <li><a href="#quote" className="text-gray-400 hover:text-white">Get Quote</a></li>
          </ul>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-4">Legal</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="/privacy" className="underline text-gray-300 hover:text-white">Privacy Policy</a></li>
            <li><a href="/terms" className="underline text-gray-300 hover:text-white">Terms of Use</a></li>
            <li><a href="/refund" className="underline text-gray-300 hover:text-white">Refund & Cancellation Policy</a></li>
          </ul>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-4">Company Details & Contact</h3>
          <ul className="space-y-2 text-gray-400 text-sm">
            <li><span className="font-semibold text-white">ZipBolt Technologies Pvt Ltd</span></li>
            <li>MGF Metropolis Mall, MG Road,<br />Gurgaon, Haryana – 122002</li>
            <li>Phone: <a href="tel:+918368681769" className="hover:text-white">+91 83686 81769</a></li>
            <li>Email: <a href="mailto:contact@zipsureai.com" className="hover:text-white">contact@zipsureai.com</a></li>
          </ul>
        </div>
      </div>
      <div className="mt-12 border-t border-gray-700 pt-8 text-center text-gray-500">
        <p>&copy; 2024 EVChamp. All Rights Reserved.</p>
      </div>
    </div>
  </footer>
);

export default Footer;