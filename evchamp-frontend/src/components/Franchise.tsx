import React from 'react';
import { Link } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';

const Franchise: React.FC = () => {
  const BackArrow = FaArrowLeft as React.ElementType;

  return (
    <section className="py-16 px-4 max-w-4xl mx-auto">
      <Link 
        to="/" 
        className="inline-flex items-center text-gray-600 hover:text-green-700 transition-colors mb-8 font-semibold"
      >
        <BackArrow className="mr-2" />
        Back to Home
      </Link>

      <h1 className="text-4xl font-bold text-green-700 mb-6">EVChamp Franchise Partnership</h1>
      <p className="mb-4 text-lg font-semibold text-gray-800">The Electrifying Opportunity is Now!</p>
      <p className="mb-4">India's roads are transforming, and the future is electric. EVChamp offers an unparalleled franchise opportunity to build a highly profitable business at the heart of India's Electric Vehicle revolution. Are you ready to charge ahead with the undisputed leader in EV Leasing services and AI Diagnostics?</p>
      <h2 className="text-2xl font-bold mt-8 mb-2">Why Choose an EVChamp Franchise?</h2>
      <ul className="list-disc ml-6 mb-4">
        <li>⚡ <b>Be the EV Expert in Your City:</b> Specialise in the fastest-growing automotive segment.</li>
        <li>⚡ <b>Proven Profitability:</b> Up to 30% ROI from Year 1 and full investment payback by Year 5!</li>
        <li>⚡ <b>Comprehensive Support:</b> From AI diagnostics to operational training and national marketing.</li>
        <li>⚡ <b>Future-Proof Business:</b> Invest in a business that grows with the future.</li>
        <li>⚡ <b>Strong Brand & Network:</b> Join a rapidly expanding national brand.</li>
      </ul>
      <h2 className="text-2xl font-bold mt-8 mb-2">Diversified, High-Demand Services</h2>
      <ul className="list-disc ml-6 mb-4">
        <li>EV Leasing Platform</li>
        <li>Advanced EV Diagnostics AI SaaS</li>
        <li>DC Fast Charging for 2W & 3W customers</li>
        <li>Data-Driven Certified Battery Assessment and EV Insights Platform (PaaS)</li>
      </ul>
      <h2 className="text-2xl font-bold mt-8 mb-2">Our Franchisees are Thriving!</h2>
      <blockquote className="border-l-4 border-green-500 pl-4 italic mb-2">"Joining EVChamp was the smartest business decision I made. The AI platform is a game-changer, and the support I get is incredible. My Pro Centre is exceeding all expectations!"<br/>— Rajesh Kumar, Pro Franchisee, Delhi</blockquote>
      <blockquote className="border-l-4 border-green-500 pl-4 italic mb-2">"The Master Centre model gives me so much potential. With the leasing platform and spares distribution, my revenue streams are constantly growing. This is truly the future of Auto financing and EV services."<br/>— Priya Sharma, Master Franchisee, Pune</blockquote>
      <blockquote className="border-l-4 border-green-500 pl-4 italic mb-2">"Even with my Basic Centre, the profitability is fantastic. The demand for EV leasing is huge, and EVChamp makes it easy to deliver top-notch service. I'm already planning my second location!"<br/>— Amit Singh, Pro Franchisee, Jaipur</blockquote>
      <h2 className="text-2xl font-bold mt-8 mb-2">Key Financial Highlights</h2>
      <ul className="list-disc ml-6 mb-4">
        <li><b>Initial Investment:</b> Starting from INR 15 Lacs for a Pro and INR 25 Lacs for Master Centre</li>
        <li><b>Targeted ROI:</b> Up to 30% in Year 1 for Master Franchisees</li>
        <li><b>Rapid Payback:</b> Typically within 5 years</li>
      </ul>
      <p className="mb-4">Don't Just Watch the EV Revolution - <b>LEAD IT!</b></p>
      <p className="mb-4 font-bold">Limited Opportunities Available! Secure your exclusive territory and become a pioneer in India's next-generation automotive service industry.</p>
      <p className="mb-4">EVChamp: Powering Progress, Together.</p>
      <div className="bg-green-50 p-4 rounded-lg">
        <p><b>Contact Us Today:</b></p>
        <p>Visit our website: <a href="https://www.evchamp.in" className="text-green-700 underline">www.evchamp.in</a></p>
        <p>Call us: <a href="tel:+918368681769" className="text-green-700 underline">+91 83686 81769</a></p>
        <p>Email: <a href="mailto:franchise@evchamp.in" className="text-green-700 underline">franchise@evchamp.in</a></p>
      </div>
    </section>
  );
};

export default Franchise;