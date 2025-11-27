import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import razorpayService from '../services/razorpayService';

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
    price: 6999,
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
    price: 51 ,
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
    price: 1800,
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
    price: 3000,
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
    price: 5000,
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
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-12">
      {/* Back Button at the top */}
      <div className="container mx-auto px-6 mb-6 flex items-center">
        <button
          onClick={() => navigate('/')}
          className="flex items-center bg-white border border-gray-200 shadow-md rounded-lg px-4 py-2 hover:bg-green-100 transition-all text-green-700 font-semibold text-lg"
        >
          <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
          Back to Home
        </button>
      </div>
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-2 tracking-tight">EVChamp Plans & Pricing</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">Select your hardware and software plans. You can buy both together for a seamless experience.</p>
        </div>

        {/* Hardware Plans */}
        <div className="mb-16">
          <h2 className="text-3xl font-semibold text-gray-800 mb-8 text-center">IoT Hardware Plans</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {hardwarePlans.map((plan) => (
              <div
                key={plan.id}
                className={`relative bg-white rounded-2xl shadow-lg p-8 border-2 transition-all duration-200 cursor-pointer hover:scale-105 hover:shadow-2xl ${selectedPlans.some(p => p.id === plan.id && p.type === 'hardware') ? 'border-green-500 ring-4 ring-green-200' : 'border-gray-100'}`}
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
                  className={`w-full py-3 rounded-lg font-semibold mt-2 transition-all duration-200 bg-gradient-to-r from-green-500 to-green-700 text-white hover:from-green-600 hover:to-green-800 ${selectedPlans.some(p => p.id === plan.id && p.type === 'hardware') ? 'opacity-80' : ''}`}
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
          <h2 className="text-3xl font-semibold text-gray-800 mb-8 text-center">Software Subscription Plans</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {softwarePlans.map((plan) => {
              const isSelected = selectedPlans.some(p => p.id === plan.id && p.type === plan.type);
              return (
                <div
                  key={plan.id}
                  className={`relative bg-white rounded-2xl shadow-lg p-8 border-2 transition-all duration-200 cursor-pointer hover:scale-105 hover:shadow-2xl ${isSelected ? 'border-blue-500 ring-4 ring-blue-200' : 'border-gray-100'}`}
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
  );
};

export default BuyPlans; 