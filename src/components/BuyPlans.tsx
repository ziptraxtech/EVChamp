import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import razorpayService from '../services/razorpayService';
import headerImg from '../assets/header.jpg';

interface Plan {
  id: number;
  name: string;
  price: number;
  duration: string;
  features: string[];
  idealFor: string;
  type: 'hardware' | 'software';
}

const hardwarePlans: Plan[] = [
  {
    id: 1,
    name: 'SMART',
    price: 4999,
    duration: '1 Year (includes device & data plan)',
    features: [
      'Real-time GPS Tracking',
      'Geo-fencing Alerts',
      'Driving History',
      'Battery & Motor Diagnostics',
      'Immobilizer financier',
    ],
    idealFor: 'Small-Medium Fleet Operators',
    type: 'hardware',
  },
  {
    id: 2,
    name: 'PRO',
    price: 8999,
    duration: '1 Year (includes device & data plan)',
    features: [
      'All SMART features',
      'AI Predictive Maintenance',
      'Buyback & AMC Integration',
      'Cloud Data Storage',
    ],
    idealFor: 'Large Fleets & Leasing Companies',
    type: 'hardware',
  },
];

const softwarePlans: Plan[] = [
  {
    id: 1,
    name: 'CORE',
    price: 4500,
    duration: 'Annual (per vehicle)',
    features: [
      'App + Web Dashboard Access',
      'Live Telematics Insights',
      'Warranty, Buyback & AMC Tracking',
      'Fleet Health Reports',
      'Maintenance & Fault Alerts',
    ],
    idealFor: 'Fleet Owners',
    type: 'software',
  },
  {
    id: 2,
    name: 'App BASIC',
    price: 2400,
    duration: 'Annual (per vehicle)',
    features: [
      'Real-time Vehicle Data',
      'Trip Summary',
      'Battery Alerts',
      'Service Reminders',
    ],
    idealFor: 'EV Owners, Drivers, Small Operators',
    type: 'software',
  },
  {
    id: 3,
    name: 'App PRO',
    price: 3600,
    duration: 'Annual (per vehicle)',
    features: [
      'All BASIC features',
      'Predictive Maintenance Alerts',
      'Fault Codes',
      'Warranty & Buyback View',
    ],
    idealFor: 'EV Owners, Drivers, Small Operators',
    type: 'software',
  },
  {
    id: 4,
    name: 'Dashboard STANDARD',
    price: 4500,
    duration: 'Annual (per vehicle)',
    features: [
      'Fleet Overview Dashboard',
      'Driving Behavior Analytics',
      'Health & Performance Reports',
    ],
    idealFor: 'Fleet Managers, OEMs, Leasing Companies, Insurers',
    type: 'software',
  },
  {
    id: 5,
    name: 'Dashboard ENTERPRISE',
    price: 6500,
    duration: 'Annual (per vehicle)',
    features: [
      'All STANDARD features',
      'Advanced Analytics & AI Insights',
      'Custom Reports & Integrations',
      'Priority Support',
    ],
    idealFor: 'Large Enterprises, OEMs, Insurance Companies',
    type: 'software',
  },
];

const BuyPlans: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const [selectedPlans, setSelectedPlans] = useState<Plan[]>([]);
  const [showDetails, setShowDetails] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const orderSectionRef = useRef<HTMLDivElement>(null);
  const detailsSectionRef = useRef<HTMLDivElement>(null);

  const handleHardwareSelect = (plan: Plan) => {
    const existingHardware = selectedPlans.find(p => p.type === 'hardware');
    if (existingHardware) {
      setSelectedPlans(selectedPlans.filter(p => p.type !== 'hardware').concat(plan));
    } else {
      setSelectedPlans([...selectedPlans, plan]);
    }
  };

  const handleSoftwareToggle = (plan: Plan) => {
    const isSelected = selectedPlans.some(p => p.id === plan.id && p.type === plan.type);
    if (isSelected) {
      setSelectedPlans(selectedPlans.filter(p => !(p.id === plan.id && p.type === plan.type)));
    } else {
      setSelectedPlans([...selectedPlans, plan]);
    }
  };

  const totalPrice = selectedPlans.reduce((sum, plan) => sum + plan.price, 0);

  const handleOrderClick = () => {
    setShowDetails(true);
    setTimeout(() => {
      detailsSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handlePayment = async () => {
    if (!user) {
      alert('Please sign in to proceed with payment.');
      return;
    }

    if (selectedPlans.length === 0) {
      alert('Please select at least one plan.');
      return;
    }

    setIsProcessing(true);

    try {
      const planNames = selectedPlans.map(plan => plan.name).join(', ');
      const description = `EVChamp Plans: ${planNames}`;
      
      await razorpayService.initializePayment(
        totalPrice,
        'EVChamp Plans Purchase',
        description,
        user.primaryEmailAddress?.emailAddress || undefined,
        user.firstName || user.username || undefined
      );
    } catch (error) {
      console.error('Payment error:', error);
      alert('Payment failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      

      {/* Plans Section */}
      <div id="plans-section" className="py-10 sm:py-12">
      {/* Back Button at the top */}
      <div className="container mx-auto px-4 sm:px-6 mb-6 flex items-center">
        <button
          onClick={() => navigate('/')}
          className="flex items-center bg-white border border-gray-200 shadow-md rounded-lg px-3 sm:px-4 py-2 hover:bg-green-100 transition-all text-green-700 font-semibold text-base sm:text-lg"
        >
          <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
          Back to Home
        </button>    
      </div>
    {/* Hero Section - Moved from Landing Page */}
      <section className="py-10 sm:py-12 bg-gradient-to-tr from-yellow-200 via-green-200 to-blue-300 transition-colors duration-1000">
        <div className="container mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-stretch justify-between gap-10">
          {/* Text Section */}
          <div className="flex-1 max-w-xl flex flex-col justify-center text-center md:text-left">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight">
              Empowering Intelligent Electric Mobility<br />
              <span className="text-green-600">with AI &amp; IoT-Driven Fleet Management</span>
            </h1>
            <p className="mt-5 sm:mt-6 text-base sm:text-lg text-gray-600">
              At EVChamp, we are transforming EV fleet management through our integrated platform that combines AI-powered software with IoT-enabled smart hardware. Experience seamless, efficient, and intelligent electric mobility operations.
            </p>
            <div className="mt-6 sm:mt-8">
              <button
                onClick={() => {
                  document.getElementById('plans-section')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="w-full sm:w-auto inline-block bg-gradient-to-r from-green-500 to-green-700 text-white font-bold text-base sm:text-lg px-6 sm:px-10 py-3 sm:py-4 rounded-xl shadow-lg hover:shadow-xl transition-all sm:transform sm:hover:-translate-y-1"
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
              className="w-full h-56 sm:h-72 md:h-full rounded-xl shadow-2xl object-cover mb-6"
            />
            <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row flex-wrap gap-x-10 gap-y-4 w-full justify-center">
              <div className="flex items-center space-x-2">
                <svg className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="font-semibold text-gray-700 text-sm sm:text-base">AI-Driven Leasing &amp; Asset Management</span>
              </div>
              <div className="flex items-center space-x-2">
                <svg className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="font-semibold text-gray-700 text-sm sm:text-base">Smart Buyback &amp; Warranty</span>
              </div>
              <div className="flex items-center space-x-2">
                <svg className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="font-semibold text-gray-700 text-sm sm:text-base">Real-Time Telematics &amp; Analytics</span>
              </div>
            </div>
          </div>
        </div>
      </section>  

      {/* EVCHAMP Overview Section */}
      <section className="py-12 sm:py-16 bg-gradient-to-br from-yellow-200 via-green-200 to-blue-300">
        <div className="container mx-auto px-4 sm:px-6 grid md:grid-cols-2 gap-10 md:gap-12 items-center">
          {/* Left: QR Code Box */}
          <div className="flex flex-col items-center">
            <div className="w-32 h-32 sm:w-40 sm:h-40 bg-gradient-to-br from-gray-200 to-blue-100 border-4 border-dashed border-blue-300 flex items-center justify-center rounded-xl shadow-inner mb-3">
              <span className="text-blue-400 font-bold text-lg text-center">[QR Code Here]</span>
            </div>
            <span className="text-xs text-gray-400">Scan to download the app</span>
          </div>

          {/* Right: Text & Offerings */}
          <div className="text-center md:text-left">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
              EVCHAMP Overview
            </h2>
            <p className="mb-6 text-base sm:text-lg text-gray-700 max-w-xl mx-auto md:mx-0">
              At EVChamp, we are at the forefront of transforming electric vehicle (EV) fleet management through our integrated platform that combines AI-powered software with IoT-enabled smart hardware. Our solutions are designed to make EV operations seamless, efficient, and intelligent.
            </p>
            <div className="flex flex-col gap-3 sm:gap-4">
              <div className="flex items-center">
                <svg className="text-blue-600 text-2xl mr-3 w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M13 7H7v6h6V7z" />
                  <path fillRule="evenodd" d="M7 2a1 1 0 012 0v1h2V2a1 1 0 112 0v1h2a2 2 0 012 2v2h1a1 1 0 110 2h-1v2h1a1 1 0 110 2h-1v2a2 2 0 01-2 2h-2v1a1 1 0 11-2 0v-1H9v1a1 1 0 11-2 0v-1H5a2 2 0 01-2-2v-2H2a1 1 0 110-2h1V9H2a1 1 0 010-2h1V5a2 2 0 012-2h2V2zM5 5h10v10H5V5z" clipRule="evenodd" />
                </svg>
                <span className="text-gray-800 font-medium">AI-Driven EV Leasing & Asset Management</span>
              </div>
              <div className="flex items-center">
                <svg className="text-green-600 text-2xl mr-3 w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1h4v1a2 2 0 11-4 0zM12 14c.015-.34.208-.646.477-.859a4 4 0 10-4.954 0c.27.213.462.519.476.859h4.002z" />
                </svg>
                <span className="text-gray-800 font-medium">Smart Buyback & Warranty Solutions</span>
              </div>
              <div className="flex items-center">
                <svg className="text-purple-600 text-2xl mr-3 w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                <span className="text-gray-800 font-medium">Real-Time Telematics & Predictive Maintenance</span>
              </div>
              <div className="flex items-center">
                <svg className="text-pink-600 text-2xl mr-3 w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
                <span className="text-gray-800 font-medium">Integrated Mobile App & Web Dashboard</span>
              </div>
            </div>
            <div className="mt-6">
              <span className="inline-block bg-gradient-to-r from-blue-500 to-green-400 text-white px-4 py-1 rounded-full text-sm font-semibold shadow">
                Available on Android, iOS & Web
              </span>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-2 tracking-tight">EVChamp Plans & Pricing</h1>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">Select your hardware and software plans. You can buy both together for a seamless experience.</p>
        </div>

        {/* Hardware Plans */}
        <div className="mb-16">
          <h2 className="text-2xl sm:text-3xl font-semibold text-gray-800 mb-8 text-center">IoT Hardware Plans</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {hardwarePlans.map((plan) => (
              <div
                key={plan.id}
                className={`relative bg-white rounded-2xl shadow-lg p-6 sm:p-8 border-2 transition-all duration-200 cursor-pointer md:hover:scale-105 md:hover:shadow-2xl ${selectedPlans.some(p => p.id === plan.id && p.type === 'hardware') ? 'border-green-500 ring-4 ring-green-200' : 'border-gray-100'}`}
                onClick={() => handleHardwareSelect(plan)}
              >
                <div className="absolute top-4 right-4">
                  {selectedPlans.some(p => p.id === plan.id && p.type === 'hardware') && (
                    <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700">Selected</span>
                  )}
                </div>
                <h3 className="text-2xl font-bold mb-2 text-green-700">{plan.name}</h3>
                <div className="text-3xl font-extrabold mb-2 text-green-600">₹{plan.price.toLocaleString()}</div>
                <p className="text-gray-500 mb-2">{plan.duration}</p>
                <p className="text-sm text-gray-700 mb-4">Ideal for: <span className="font-semibold">{plan.idealFor}</span></p>
                <ul className="mb-4 space-y-2">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center">
                      <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <button
                  className={`w-full py-3 rounded-lg font-semibold mt-2 transition-all duration-200 bg-gradient-to-r from-green-500 to-green-700 text-white hover:from-green-600 hover:to-green-800 text-sm sm:text-base ${selectedPlans.some(p => p.id === plan.id && p.type === 'hardware') ? 'opacity-80' : ''}`}
                  onClick={(e) => { e.stopPropagation(); handleHardwareSelect(plan); }}
                >
                  {selectedPlans.some(p => p.id === plan.id && p.type === 'hardware') ? 'Deselect' : 'Select Hardware Plan'}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Software Plans */}
        <div className="mb-16">
          <h2 className="text-2xl sm:text-3xl font-semibold text-gray-800 mb-8 text-center">Software Subscription Plans</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {softwarePlans.map((plan) => {
              const isSelected = selectedPlans.some(p => p.id === plan.id && p.type === plan.type);
              return (
                <div
                  key={plan.id}
                  className={`relative bg-white rounded-2xl shadow-lg p-6 sm:p-8 border-2 transition-all duration-200 cursor-pointer md:hover:scale-105 md:hover:shadow-2xl ${isSelected ? 'border-blue-500 ring-4 ring-blue-200' : 'border-gray-100'}`}
                  onClick={() => handleSoftwareToggle(plan)}
                >
                  <div className="absolute top-4 right-4">
                    {isSelected && (
                      <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700">Selected</span>
                    )}
                  </div>
                  <h3 className="text-2xl font-bold mb-2 text-blue-700">{plan.name}</h3>
                  <div className="text-3xl font-extrabold mb-2 text-blue-600">₹{plan.price.toLocaleString()}</div>
                  <p className="text-gray-500 mb-2">{plan.duration}</p>
                  <p className="text-sm text-gray-700 mb-4">Ideal for: <span className="font-semibold">{plan.idealFor}</span></p>
                  <ul className="mb-4 space-y-2">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center">
                        <svg className="w-5 h-5 text-blue-500 mr-2" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <button
                    className={`w-full py-3 rounded-lg font-semibold mt-2 transition-all duration-200 bg-gradient-to-r from-blue-500 to-blue-700 text-white hover:from-blue-600 hover:to-blue-800 ${isSelected ? 'opacity-80' : ''}`}
                    onClick={(e) => { e.stopPropagation(); handleSoftwareToggle(plan); }}
                  >
                    {isSelected ? 'Deselect' : 'Select Software Plan'}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Cart Summary & Order Button */}
        {selectedPlans.length > 0 && !showDetails && (
          <div ref={orderSectionRef} className="max-w-2xl mx-auto mt-12 bg-white rounded-2xl shadow-lg p-8 border border-gray-200 animate-fade-in-up">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">Your Selection</h2>
            <ul className="mb-6 space-y-4">
              {selectedPlans.map((plan) => (
                <li key={plan.type + plan.id} className="flex items-center justify-between bg-gray-50 rounded-lg px-4 py-3 border">
                  <div>
                    <span className={`font-semibold ${plan.type === 'hardware' ? 'text-green-700' : 'text-blue-700'}`}>{plan.name}</span>
                    <span className="ml-2 text-gray-500 text-sm">({plan.duration})</span>
                  </div>
                  <div className="font-bold text-gray-800">₹{plan.price.toLocaleString()}</div>
                </li>
              ))}
            </ul>
            <div className="flex justify-between items-center mb-6">
              <span className="font-semibold text-lg">Total</span>
              <span className="text-2xl font-extrabold text-green-700">₹{totalPrice.toLocaleString()}</span>
            </div>
            <button
              onClick={handleOrderClick}
              className="w-full bg-gradient-to-r from-green-500 to-blue-500 text-white font-bold text-lg px-10 py-4 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all"
            >
              Place Order
            </button>
          </div>
        )}

        {/* Details Section */}
        {showDetails && (
          <div ref={detailsSectionRef} className="max-w-lg mx-auto mt-16 bg-white rounded-2xl shadow-2xl p-10 border border-gray-200 animate-fade-in-up">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Place Your Order</h3>
            <div className="mb-6 bg-blue-50 rounded-lg p-4 border-l-4 border-blue-400">
              <div className="font-semibold text-blue-700 mb-2">Selected Plans:</div>
              <ul className="mb-2">
                {selectedPlans.map((plan) => (
                  <li key={plan.type + plan.id} className="flex items-center justify-between">
                    <span className={`font-semibold ${plan.type === 'hardware' ? 'text-green-700' : 'text-blue-700'}`}>{plan.name}</span>
                    <span className="text-gray-700">₹{plan.price.toLocaleString()}</span>
                  </li>
                ))}
              </ul>
              <div className="font-bold text-green-700 mt-2">Total: ₹{totalPrice.toLocaleString()}</div>
            </div>
            <form className="space-y-4">
              <div>
                <label className="block text-gray-700 font-medium mb-2">Full Name</label>
                <input type="text" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent" placeholder="Enter your full name" />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-2">Email</label>
                <input type="email" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent" placeholder="Enter your email" />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-2">Phone Number</label>
                <input type="tel" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent" placeholder="Enter your phone number" />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-2">Company (optional)</label>
                <input type="text" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent" placeholder="Enter your company name" />
              </div>
              <button type="button" className="w-full bg-gradient-to-r from-green-500 to-blue-500 text-white py-4 px-6 rounded-lg font-semibold text-lg hover:bg-green-700 transition-colors transform hover:scale-105" onClick={handlePayment} disabled={isProcessing}>
                {isProcessing ? 'Processing Payment...' : 'Place Order'}
              </button>
            </form>
          </div>
        )}
      </div>
      </div>
    </div>
  );
};

export default BuyPlans; 