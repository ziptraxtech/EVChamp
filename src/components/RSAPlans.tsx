import React, { useRef, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useUser } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import razorpayService from '../services/razorpayService';
import { getPaymentBreakdown } from '../utils/gstCalculator';

interface RSAPlan {
  id: number;
  name: string;
  price: number;
  duration: string;
  tagline: string;
  features: string[];
  idealFor: string;
  highlight?: boolean;
  badge?: string;
  provider?: string;
}

const rsaPlans: RSAPlan[] = [
  {
    id: 1,
    name: 'RSA Basic',
    price: 999,
    duration: 'Annual',
    tagline: 'Essential roadside cover for everyday EV riders',
    features: [
      'Emergency towing (up to 25 km)',
      'On-site battery jump assistance',
      'Flat tyre support',
      '24×7 helpline access',
      'Minor on-road repairs',
    ],
    idealFor: 'Individual EV owners & daily commuters',
    provider: 'EVChamp',
  },
  {
    id: 2,
    name: 'RSA Standard',
    price: 1999,
    duration: 'Annual',
    tagline: 'Comprehensive cover with faster response',
    features: [
      'Emergency towing (up to 75 km)',
      'On-site battery charging & swap assistance',
      'Flat tyre & minor mechanical support',
      'Priority 24×7 helpline',
      'Fuel / charge delivery assistance',
      'Hotel & cab arrangement (1 incident/year)',
      'Key lockout assistance',
    ],
    idealFor: 'Regular EV users & small fleet operators',
    highlight: true,
    badge: 'Most Popular',
    provider: 'EVChamp',
  },
  {
    id: 3,
    name: 'RSA Premium',
    price: 3499,
    duration: 'Annual',
    tagline: 'Full-spectrum protection for fleets & power users',
    features: [
      'Emergency towing (unlimited distance)',
      'Dedicated fleet support executive',
      'On-site battery diagnostics & repair',
      'Flat tyre, mechanical & electrical support',
      'Priority dispatch — response within 45 min',
      'Hotel, cab & relay driving (3 incidents/year)',
      'Key lockout & accident management',
      'Monthly health check reminder',
      'Trip breakdown protection (intercity)',
    ],
    idealFor: 'Fleet owners, ride-sharing operators & enterprises',
    badge: 'Best Value',
    provider: 'EVChamp',
  },
  // ReadyAssist Plans
  {
    id: 4,
    name: 'ReadyAssist Basic',
    price: 1499,
    duration: 'Annual',
    tagline: 'Comprehensive roadside support for all vehicle types',
    features: [
      'Emergency towing (up to 50 km)',
      'Flat tyre repair & replacement',
      'Battery jumpstart assistance',
      '24×7 emergency helpline',
      'Key unlock assistance',
      'Starting problem diagnosis',
      'Fuel delivery service',
      '11,000+ service providers nationwide',
    ],
    idealFor: 'Individual vehicle owners & daily commuters',
    provider: 'ReadyAssist',
  },
  {
    id: 5,
    name: 'ReadyAssist Pro',
    price: 2499,
    duration: 'Annual',
    tagline: 'Premium care with priority dispatch & extended coverage',
    features: [
      'Emergency towing (up to 100 km)',
      'Priority 45-minute dispatch guarantee',
      'Flat tyre & mechanical support',
      'Battery diagnostics & charging',
      'Key unlock & starting problem support',
      'Fuel/charge delivery',
      'Hotel & cab arrangement',
      'Professional fitment services',
      'AI-powered command center support',
      'Multi-channel assistance (call, app, SMS)',
    ],
    idealFor: 'Regular commuters & small business owners',
    highlight: true,
    badge: 'Partner Choice',
    provider: 'ReadyAssist',
  },
  {
    id: 6,
    name: 'ReadyAssist Fleet+',
    price: 4999,
    duration: 'Annual',
    tagline: 'Enterprise-grade fleet management & support',
    features: [
      'Unlimited emergency towing',
      'Dedicated fleet support executive',
      '24/7 AI-powered command center',
      'Real-time vehicle tracking & diagnostics',
      'On-site battery diagnostics & repair',
      'Priority dispatch — response within 30 min',
      'Bulk fitment services at doorstep',
      'Comprehensive insurance claims assistance',
      'Monthly health check reminders',
      'Commercial vehicle specialized support',
      '3000+ trained EV mechanics',
      'CNG retrofitment consultation',
    ],
    idealFor: 'Fleet operators, ride-sharing companies & enterprises',
    badge: 'Enterprise',
    provider: 'ReadyAssist',
  },
];

const RSAPlans: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const [selectedPlan, setSelectedPlan] = useState<RSAPlan | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeProvider, setActiveProvider] = useState<'all' | 'EVChamp' | 'ReadyAssist'>('all');
  const detailsSectionRef = useRef<HTMLDivElement>(null);

  const handleSelect = (plan: RSAPlan) => {
    setSelectedPlan(plan);
    setShowDetails(false);
  };

  const handleOrderClick = () => {
    if (!user) {
      navigate('/sign-in');
      return;
    }
    setShowDetails(true);
    setTimeout(() => {
      detailsSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handlePayment = async () => {
    if (!user) {
      navigate('/sign-in');
      return;
    }
    if (!selectedPlan) return;
    setIsProcessing(true);
    try {
      const breakdown = getPaymentBreakdown(selectedPlan.price);
      await razorpayService.initializePayment(
        breakdown.totalAmount,
        `${selectedPlan.provider} RSA Plan: ${selectedPlan.name}`,
        `Roadside Assistance - ${selectedPlan.name} (${selectedPlan.duration}) | Base: ₹${breakdown.baseAmount} + GST (18%): ₹${breakdown.gstAmount} = Total: ₹${breakdown.totalAmount}`,
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

  const filteredPlans = activeProvider === 'all' 
    ? rsaPlans 
    : rsaPlans.filter(plan => plan.provider === activeProvider);

  return (
    <div className="min-h-screen bg-white">
      <style>{`
        @keyframes slideInDown {
          from {
            opacity: 0;
            transform: translateY(-30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-40px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(40px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 0 0 rgba(251, 146, 60, 0.7); }
          50% { box-shadow: 0 0 0 10px rgba(251, 146, 60, 0); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        @keyframes shimmer {
          0% { background-position: -1000px 0; }
          100% { background-position: 1000px 0; }
        }
        @keyframes rotate-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes bounce-in {
          0% { transform: scale(0) translateY(-100%); opacity: 0; }
          50% { transform: scale(1.05); }
          100% { transform: scale(1) translateY(0); opacity: 1; }
        }
        @keyframes glow-border {
          0%, 100% { border-color: rgba(251, 146, 60, 0.5); box-shadow: 0 0 10px rgba(251, 146, 60, 0.2); }
          50% { border-color: rgba(251, 146, 60, 1); box-shadow: 0 0 20px rgba(251, 146, 60, 0.5); }
        }
        @keyframes slideInFromLeft {
          0% {
            opacity: 0;
            transform: translateX(-100px) translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateX(0) translateY(0);
          }
        }
        @keyframes slideInFromRight {
          0% {
            opacity: 0;
            transform: translateX(100px) translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateX(0) translateY(0);
          }
        }
        @keyframes slideInFromTop {
          0% {
            opacity: 0;
            transform: translateY(-50px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slide-in-down { animation: slideInDown 0.8s ease-out; }
        .animate-slide-in-up { animation: slideInUp 0.8s ease-out; }
        .animate-slide-in-left { animation: slideInLeft 0.8s ease-out; }
        .animate-slide-in-right { animation: slideInRight 0.8s ease-out; }
        .animate-fade-in { animation: fadeIn 0.6s ease-out; }
        .animate-pulse-glow { animation: pulse-glow 2s infinite; }
        .animate-float { animation: float 3s ease-in-out infinite; }
        .animate-blob { animation: blob 7s infinite; }
        .animate-shimmer { animation: shimmer 3s infinite; }
        .animate-rotate-slow { animation: rotate-slow 20s linear infinite; }
        .animate-in-from-left { animation: slideInFromLeft 1s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
        .animate-in-from-right { animation: slideInFromRight 1s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
        .animate-in-from-top { animation: slideInFromTop 0.8s ease-out forwards; }
        .delay-100 { animation-delay: 0.1s; }
        .delay-200 { animation-delay: 0.2s; }
        .delay-300 { animation-delay: 0.3s; }
        .animate-bounce-in { animation: bounce-in 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55); }
        .animate-glow-border { animation: glow-border 2s ease-in-out infinite; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }
        .glass-effect {
          backdrop-filter: blur(10px);
          background: rgba(255, 255, 255, 0.8);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }
      `}</style>

      <Helmet>
        <title>24/7 Roadside Assistance Plans India | EVChamp & ReadyAssist RSA</title>
        <meta name="description" content="Premium 24/7 roadside assistance plans for EV owners and all vehicles in India. Compare EVChamp & ReadyAssist RSA plans. Emergency towing, battery diagnostics, 45-min response. 19,100+ pincodes covered." />
        <meta name="keywords" content="roadside assistance India, RSA plans, emergency towing service, 24x7 vehicle support, EV battery assistance, ReadyAssist partnership, EVChamp RSA, breakdown assistance, emergency roadside support, tyre support, vehicle care, EV roadside support" />
        <meta property="og:title" content="24/7 Roadside Assistance Plans | EVChamp & ReadyAssist RSA" />
        <meta property="og:description" content="Never get stranded. Premium RSA coverage with 19,100+ pincodes, 11,000+ service providers, 3M+ users, and 4.6/5 rating. Emergency towing, battery support, flat tyre assistance." />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="/evchamp-logo.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="24/7 Roadside Assistance Plans | EVChamp & ReadyAssist" />
        <meta name="twitter:description" content="Premium RSA coverage with emergency towing, battery diagnostics, 45-min response guarantee." />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="author" content="EVChamp" />
        <meta name="theme-color" content="#fb923c" />
        <link rel="canonical" href="https://evchamp.in/rsa-plans" />
        <meta name="robots" content="index, follow" />
      </Helmet>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-900 via-orange-800 to-red-900 text-white min-h-screen flex items-center">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-96 h-96 bg-orange-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute top-40 right-10 w-96 h-96 bg-red-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute bottom-20 left-1/2 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
          {/* Grid background */}
          <div className="absolute inset-0 opacity-10" style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)',
            backgroundSize: '50px 50px'
          }}></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 py-16 sm:py-24 text-center max-w-5xl relative z-10">
          <div className="animate-slide-in-down mb-8">
            <span className="inline-block px-6 py-3 bg-gradient-to-r from-orange-500/40 to-red-500/40 backdrop-blur-xl rounded-full text-sm font-bold text-orange-100 border border-orange-300/50 mb-4 shadow-lg hover:shadow-xl transition-all hover:scale-105 cursor-default">
              🚨 24/7 Emergency Support Available Nationwide
            </span>
          </div>

          <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black mb-8 leading-tight text-white drop-shadow-2xl overflow-visible">
            <span className="inline-block animate-in-from-left">Never</span>
            <span className="inline-block ml-2 ml-sm:1 animate-in-from-top delay-100">Get</span>
            <span className="inline-block ml-2 ml-sm:1 animate-in-from-right delay-200">
              <span className="bg-gradient-to-r from-yellow-300 via-orange-400 to-red-400 bg-clip-text text-transparent animate-pulse">Stranded!</span>
            </span>
          </h1>

          <p className="text-lg sm:text-2xl text-gray-100 leading-relaxed mb-10 max-w-3xl mx-auto animate-slide-in-up font-light drop-shadow-lg">
            24/7 Emergency roadside assistance for your electric vehicle and all vehicle types. From towing to battery support, we've got you covered across India's 19,100+ pincodes with 11,000+ trusted service providers.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12 animate-slide-in-up flex-wrap">
            <div className="flex items-center justify-center gap-3 bg-white/15 backdrop-blur-lg px-2 py-1 rounded-full border border-white/30 hover:bg-white/25 transition-all transform hover:scale-110 shadow-lg hover:shadow-xl">
              <span className="text-3xl">⭐</span>
              <span className="text-lg font-bold">4.6/5 Rating</span>
            </div>
            <div className="flex items-center justify-center gap-3 bg-white/15 backdrop-blur-lg px-2 py-1 rounded-full border border-white/30 hover:bg-white/25 transition-all transform hover:scale-110 shadow-lg hover:shadow-xl">
              <span className="text-3xl">👥</span>
              <span className="text-lg font-bold">3M+ Users</span>
            </div>
            <div className="flex items-center justify-center gap-3 bg-white/15 backdrop-blur-lg px-2 py-1 rounded-full border border-white/30 hover:bg-white/25 transition-all transform hover:scale-110 shadow-lg hover:shadow-xl">
              <span className="text-3xl">🌍</span>
              <span className="text-lg font-bold">Pan-India Coverage</span>
            </div>
          </div>

          <p className="text-xl text-orange-200 font-bold animate-float mb-10">🤝 Powered by EVChamp & ReadyAssist Partnership</p>

          <div className="animate-slide-in-up" style={{ animationDelay: '0.3s' }}>
            <button 
              onClick={() => {
                const element = document.getElementById('plan-cards');
                element?.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }}
              className="inline-flex items-center gap-3 bg-gradient-to-r from-orange-500 to-red-600 text-white px-6 py-3 rounded-full font-bold text-lg hover:from-orange-600 hover:to-red-700 transition-all transform hover:scale-110 shadow-2xl hover:shadow-3xl active:scale-95"
            >
              Explore Plans <span className="text-2xl animate-bounce" style={{ animationDelay: '0.2s' }}>↓</span>
            </button>
          </div>
        </div>

        {/* Decorative SVG Wave */}
        <svg className="absolute bottom-0 left-0 w-full h-32 text-white" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <defs>
            <linearGradient id="waveGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" style={{ stopColor: 'white', stopOpacity: 0.2 }} />
              <stop offset="100%" style={{ stopColor: 'white', stopOpacity: 0 }} />
            </linearGradient>
          </defs>
          <path d="M0,50 Q300,100 600,50 T1200,50 L1200,120 L0,120 Z" fill="url(#waveGradient)"></path>
          <path d="M0,60 Q300,110 600,60 T1200,60 L1200,120 L0,120 Z" fill="white" opacity="0.1"></path>
        </svg>
      </section>

      <div className="container mx-auto px-4 sm:px-6 py-12 sm:py-20">

        {/* Partner Info Cards Section */}
        <section id="plans" className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16 scroll-mt-20">
          {/* EVChamp Card */}
          <div className="group relative bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 rounded-3xl shadow-lg hover:shadow-2xl border-2 border-orange-200 hover:border-orange-400 transition-all duration-300 transform hover:-translate-y-2 animate-slide-in-left p-8 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-400/5 to-amber-400/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl"></div>
            <div className="absolute -right-20 -top-20 w-40 h-40 bg-orange-200 rounded-full opacity-10 group-hover:opacity-20 transition-opacity duration-300"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-6">
                <div className="text-6xl p-4 bg-gradient-to-br from-orange-100 to-amber-100 rounded-full shadow-lg">⚡</div>
                <div>
                  <h3 className="text-3xl font-black bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">EVChamp RSA</h3>
                  <p className="text-sm font-bold text-orange-600 mt-1">🏆 EV Specialists</p>
                </div>
              </div>
              <p className="text-gray-700 text-sm mb-6 leading-relaxed border-l-4 border-orange-400 pl-4 font-medium">
                Our proprietary roadside assistance service tailored specifically for EV owners with specialized battery support and charging assistance.
              </p>
              <div className="space-y-3">
                {['⚡ EV-specialist technicians nationwide', '🔋 Battery diagnostics & emergency charging', '📍 Smart charging point locator', '🌐 Pan-India network coverage'].map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-3 rounded-lg hover:bg-orange-100/50 transition-all transform hover:translate-x-1 group/item cursor-pointer">
                    <span className="text-orange-600 font-bold text-lg">✓</span>
                    <p className="text-sm text-gray-700 font-medium">{feature}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ReadyAssist Card */}
          <div className="group relative bg-gradient-to-br from-yellow-50 via-amber-50 to-yellow-50 rounded-3xl shadow-lg hover:shadow-2xl border-2 border-yellow-200 hover:border-yellow-400 transition-all duration-300 transform hover:-translate-y-2 animate-slide-in-right p-8 overflow-hidden" style={{ animationDelay: '0.2s' }}>
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/5 to-amber-400/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl"></div>
            <div className="absolute -left-20 -bottom-20 w-40 h-40 bg-yellow-200 rounded-full opacity-10 group-hover:opacity-20 transition-opacity duration-300"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-gradient-to-br from-yellow-100 to-amber-100 rounded-full shadow-lg">
                  <img src="/readyassist.png" alt="ReadyAssist" className="w-14 h-14" />
                </div>
                <div>
                  <h3 className="text-3xl font-black bg-gradient-to-r from-yellow-600 to-amber-600 bg-clip-text text-transparent">ReadyAssist</h3>
                  <p className="text-sm font-bold text-yellow-600 mt-1">⭐ Partnership Leader</p>
                </div>
              </div>
              <p className="text-gray-700 text-sm mb-6 leading-relaxed border-l-4 border-yellow-400 pl-4 font-medium">
                India's top-rated 24/7 vehicle care company with 11,000+ service providers and 3M+ satisfied customers across 19,100+ pincodes.
              </p>
              <div className="space-y-3">
                {['🤖 AI-powered command center 24/7', '🚗 Support for all vehicle types', '⭐ 4.6★ Google rating (3M+ reviews)', '🔧 Professional fitment services'].map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-3 rounded-lg hover:bg-yellow-100/50 transition-all transform hover:translate-x-1 group/item cursor-pointer">
                    <span className="text-yellow-600 font-bold text-lg">✓</span>
                    <p className="text-sm text-gray-700 font-medium">{feature}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Provider Filter Section */}
        <section className="flex justify-center gap-4 mb-12 flex-wrap animate-slide-in-up">
          <button
            onClick={() => setActiveProvider('all')}
            className={`px-6 py-3 rounded-full font-bold transition-all duration-300 transform hover:scale-105 text-xs sm:text-sm ${
              activeProvider === 'all'
                ? 'bg-gradient-to-r from-orange-400 to-red-500 text-white shadow-lg shadow-orange-500/50 scale-105'
                : 'bg-white text-gray-700 border-2 border-gray-300 hover:border-orange-400 hover:shadow-md'
            }`}
          >
            🎯 All Plans
          </button>
          <button
            onClick={() => setActiveProvider('EVChamp')}
            className={`px-6 py-3 rounded-full font-bold transition-all duration-300 transform hover:scale-105 text-xs sm:text-sm ${
              activeProvider === 'EVChamp'
                ? 'bg-gradient-to-r from-orange-400 to-amber-500 text-white shadow-lg shadow-orange-500/50 scale-105'
                : 'bg-white text-gray-700 border-2 border-gray-300 hover:border-orange-400 hover:shadow-md'
            }`}
          >
            ⚡ EVChamp Plans
          </button>
          <button
            onClick={() => setActiveProvider('ReadyAssist')}
            className={`px-6 py-3 rounded-full font-bold transition-all duration-300 transform hover:scale-105 text-xs sm:text-sm ${
              activeProvider === 'ReadyAssist'
                ? 'bg-gradient-to-r from-yellow-400 to-amber-500 text-white shadow-lg shadow-yellow-500/50 scale-105'
                : 'bg-white text-gray-700 border-2 border-gray-300 hover:border-yellow-400 hover:shadow-md'
            }`}
          >
            🔧 ReadyAssist Plans
          </button>
        </section>

        {/* Trust Badges */}
        <section className="flex flex-wrap justify-center gap-6 mb-16 animate-fade-in">
          {[
            { icon: '🕐', label: '24×7 Support', color: 'from-blue-400 to-cyan-400' },
            { icon: '⚡', label: 'EV Specialists', color: 'from-green-400 to-emerald-400' },
            { icon: '🚗', label: '19,100+ Pincodes', color: 'from-purple-400 to-pink-400' },
            { icon: '⭐', label: '4.6★ Rated', color: 'from-yellow-400 to-orange-400' },
          ].map((badge, idx) => (
            <div 
              key={badge.label} 
              className="flex items-center space-x-2 bg-white rounded-full px-6 py-3 shadow-md border-2 border-gray-100 hover:shadow-lg hover:border-gray-300 transition-all transform hover:scale-105 hover:-translate-y-1 cursor-pointer group"
              style={{ animationDelay: `${idx * 0.1}s` }}
            >
              <span className="text-2xl animate-float group-hover:rotate-12 transition-transform">{badge.icon}</span>
              <span className="text-xs font-bold text-gray-700">{badge.label}</span>
            </div>
          ))}
        </section>

        {/* Plan Cards Grid */}
        <section id="plan-cards" className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 scroll-mt-0 -mt-0">
          {filteredPlans.map((plan, idx) => (
            <div
              key={plan.id}
              onClick={() => handleSelect(plan)}
              className={`relative group bg-white rounded-3xl shadow-lg border-2 transition-all duration-300 cursor-pointer transform hover:scale-105 hover:shadow-2xl overflow-hidden animate-slide-in-up
                ${selectedPlan?.id === plan.id
                  ? 'border-orange-500 ring-4 ring-orange-300/50 scale-105'
                  : plan.highlight
                  ? 'border-orange-300 hover:border-orange-500'
                  : 'border-gray-200 hover:border-gray-400'}`}
              style={{ animationDelay: `${idx * 0.1}s` }}
            >
              {/* Card Header Bar */}
              <div className={`h-4 w-full ${
                plan.provider === 'ReadyAssist' 
                  ? 'bg-gradient-to-r from-yellow-400 to-amber-400'
                  : 'bg-gradient-to-r from-orange-400 to-red-400'
              }`} />

              {/* Badge */}
              {plan.badge && (
                <div className="absolute top-4 right-0 z-20">
                  <div className={`text-xs font-bold px-5 py-2 rounded-l-2xl text-white ${
                    plan.badge === 'Most Popular' ? 'bg-gradient-to-r from-orange-500 to-red-500 shadow-lg' : 
                    plan.badge === 'Partner Choice' ? 'bg-gradient-to-r from-blue-500 to-cyan-500 shadow-lg' :
                    'bg-gradient-to-r from-purple-500 to-pink-500 shadow-lg'
                  }`}>
                    {plan.badge === 'Most Popular' && '🏆'} {plan.badge}
                  </div>
                </div>
              )}

              <div className="p-8 relative">
                {/* Provider Badge */}
                <div className="inline-block mb-4">
                  <span className={`text-xs font-bold px-4 py-2 rounded-full ${
                    plan.provider === 'ReadyAssist'
                      ? 'bg-yellow-100 text-yellow-700'
                      : 'bg-orange-100 text-orange-700'
                  }`}>
                    {plan.provider}
                  </span>
                </div>

                {/* Selected Badge */}
                {selectedPlan?.id === plan.id && (
                  <span className="block mb-3 px-4 py-2 rounded-full text-xs font-bold bg-gradient-to-r from-orange-100 to-red-100 text-orange-700 w-fit">
                    ✓ Selected
                  </span>
                )}

                <h3 className={`text-2xl font-bold mb-2 text-gray-900 group-hover:text-transparent group-hover:bg-clip-text transition-all ${
                  plan.provider === 'ReadyAssist'
                    ? 'group-hover:bg-gradient-to-r group-hover:from-yellow-500 group-hover:to-amber-500'
                    : 'group-hover:bg-gradient-to-r group-hover:from-orange-500 group-hover:to-red-500'
                }`}>
                  {plan.name}
                </h3>
                <p className="text-sm text-gray-600 mb-4 italic leading-relaxed">{plan.tagline}</p>

                <div className={`rounded-2xl p-5 mb-6 border-2 ${
                  plan.provider === 'ReadyAssist'
                    ? 'bg-gradient-to-br from-yellow-50 to-amber-50 border-yellow-200'
                    : 'bg-gradient-to-br from-orange-50 to-red-50 border-orange-200'
                }`}>
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className={`text-4xl font-black bg-clip-text text-transparent ${
                      plan.provider === 'ReadyAssist'
                        ? 'bg-gradient-to-r from-yellow-500 to-amber-600'
                        : 'bg-gradient-to-r from-orange-500 to-red-600'
                    }`}>₹{plan.price.toLocaleString()}</span>
                    <span className="text-gray-600 text-sm font-semibold">/ {plan.duration}</span>
                  </div>                 
                </div>

                <p className="text-sm text-gray-700 mb-6 pb-6 border-b border-gray-200">
                  <strong className="text-gray-900 block mb-1">Ideal for:</strong> <span className="text-gray-600">{plan.idealFor}</span>
                </p>

                <ul className="mb-7 space-y-3">
                  {plan.features.slice(0, 5).map((feature, featIdx) => (
                    <li key={featIdx} className="flex items-start gap-3 group/item">
                      <div className="flex-shrink-0 mt-1">
                        <svg className={`w-5 h-5 group-hover/item:scale-110 transition-transform ${
                          plan.provider === 'ReadyAssist'
                            ? 'text-yellow-500'
                            : 'text-orange-500'
                        }`} fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span className="text-sm text-gray-700 font-medium">{feature}</span>
                    </li>
                  ))}
                  {plan.features.length > 5 && (
                    <li className={`text-xs font-bold pt-2 ${
                      plan.provider === 'ReadyAssist'
                        ? 'text-yellow-600'
                        : 'text-orange-600'
                    }`}>+{plan.features.length - 5} more benefits</li>
                  )}
                </ul>

                <button
                  className={`w-full py-3 px-4 rounded-xl font-bold transition-all duration-300 transform text-sm sm:text-base opacity-50 cursor-not-allowed ${
                    selectedPlan?.id === plan.id
                      ? plan.provider === 'ReadyAssist'
                        ? 'bg-gradient-to-r from-yellow-500 to-amber-500 text-white shadow-lg shadow-yellow-500/50'
                        : 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg shadow-orange-500/50'
                      : plan.provider === 'ReadyAssist'
                      ? 'bg-gradient-to-r from-yellow-400 to-amber-500 text-white shadow-md'
                      : 'bg-gradient-to-r from-orange-400 to-red-500 text-white shadow-md'
                  }`}
                  disabled
                >
                  {selectedPlan?.id === plan.id ? '✓ Selected' : 'Select Plan'}
                </button>
              </div>
            </div>
          ))}
        </section>

        {/* What's Covered Section */}
        <section className="bg-gradient-to-br from-white via-orange-50/50 to-white rounded-3xl shadow-lg border-2 border-orange-100 p-10 sm:p-12 mb-16 animate-slide-in-up">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2 text-center">What RSA Covers</h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto font-medium">Comprehensive roadside assistance with support for emergency breakdowns, mechanical issues, and more</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: '🚐', title: 'Emergency Towing', desc: 'Get towed to the nearest service centre or charging station when your EV breaks down.' },
              { icon: '⚡', title: 'Battery Assistance', desc: 'On-site battery diagnostics, jump start, or emergency charge to get you moving.' },
              { icon: '🔧', title: 'Minor Repairs', desc: 'On-road minor mechanical and electrical fixes to resolve common breakdown issues.' },
              { icon: '🛞', title: 'Tyre Support', desc: "Flat tyre change or repair assistance so you're never stuck on the roadside." },
              { icon: '🗝️', title: 'Key Lockout', desc: "Professional lockout assistance if you're locked out of your EV." },
              { icon: '🏨', title: 'Hotel & Cab', desc: 'Emergency stay and cab arrangement if breakdown leaves you stranded far from home.' },
            ].map((item, idx) => (
              <div 
                key={item.title} 
                className="group bg-white rounded-2xl p-6 border-2 border-gray-200 hover:border-orange-400 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 hover:bg-gradient-to-br hover:from-orange-50 hover:to-white cursor-pointer"
                style={{ animationDelay: `${idx * 0.05}s` }}
              >
                <div className="text-5xl mb-4">{item.icon}</div>
                <h4 className="font-bold text-gray-900 mb-2 text-lg group-hover:text-orange-600 transition-colors">{item.title}</h4>
                <p className="text-sm text-gray-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ReadyAssist About Section */}
        <section className="bg-gradient-to-br from-yellow-500 via-amber-500 to-yellow-600 rounded-3xl shadow-2xl border-2 border-yellow-400 p-10 sm:p-12 mb-16 text-white overflow-hidden relative">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -mr-48 -mt-48 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/10 rounded-full -ml-48 -mb-48 blur-3xl"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center relative z-10">
            <div className="animate-slide-in-up">
              <h2 className="text-4xl font-bold mb-6">About ReadyAssist</h2>
              <p className="text-lg leading-relaxed mb-6 text-blue-50">
                ReadyAssist is India's top-rated 24/7 vehicle care company, trusted by millions of customers with a 4.6/5 Google rating. With 11,000+ service providers and coverage across 19,100+ pincodes, they deliver reliable, on-time support across India.
              </p>
              <div className="space-y-3 mb-8">
                {[
                  { icon: '🎯', stat: '3M+', label: 'Customers Served' },
                  { icon: '⭐', stat: '4.6/5', label: 'Google Rating' },
                  { icon: '👨‍🔧', stat: '11,000+', label: 'Service Providers' },
                  { icon: '🌐', stat: '19,100+', label: 'Pincodes Covered' },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3 bg-white/10 rounded-lg px-4 py-3 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all transform hover:scale-105 group/stat">
                    <span className="text-3xl">{item.icon}</span>
                    <div>
                      <p className="font-bold text-lg">{item.stat}</p>
                      <p className="text-sm text-yellow-100">{item.label}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-white/95 rounded-2xl p-8 shadow-2xl animate-slide-in-up" style={{ animationDelay: '0.1s' }}>
              <h3 className="font-bold text-2xl text-gray-900 mb-6">ReadyAssist Services</h3>
              <div className="space-y-4">
                {[
                  { icon: '🚐', title: 'Towing Services', desc: 'Safe & reliable 24/7' },
                  { icon: '🛞', title: 'Flat Tyre Support', desc: 'Fast repair & replacement' },
                  { icon: '⚡', title: 'Battery Jumpstart', desc: 'Quick & efficient' },
                  { icon: '🔧', title: 'On-spot Repairs', desc: 'Starting & diagnostics' },
                  { icon: '📹', title: 'Dashcam Installation', desc: 'Professional fitment' },
                  { icon: '👩‍🔧', title: 'Project Shakthi', desc: '250+ women technicians' },
                ].map((service, idx) => (
                  <div key={service.title} className="flex items-start gap-3 pb-3 border-b border-gray-200 last:border-0 hover:translate-x-2 transition-transform group/service cursor-pointer">
                    <span className="text-3xl">{service.icon}</span>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 group-hover/service:text-yellow-600 transition-colors">{service.title}</p>
                      <p className="text-xs text-gray-600">{service.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Comparison Table */}
        <section className="bg-white rounded-2xl shadow-md border border-gray-100 p-8 mb-16 overflow-x-auto">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Plan Comparison</h2>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b-2 border-gray-300 bg-gradient-to-r from-orange-50 to-red-50">
                <th className="text-left py-3 px-4 font-bold text-gray-800">Feature</th>
                <th className="text-center py-3 px-4 font-bold text-orange-600">EVChamp Basic</th>
                <th className="text-center py-3 px-4 font-bold text-orange-600">EVChamp Standard</th>
                <th className="text-center py-3 px-4 font-bold text-red-600">EVChamp Premium</th>
                <th className="text-center py-3 px-4 font-bold text-yellow-600">ReadyAssist Basic</th>
                <th className="text-center py-3 px-4 font-bold text-purple-600">ReadyAssist Pro</th>
              </tr>
            </thead>
            <tbody>
              {[
                { feature: 'Price (Annual)', values: ['₹999', '₹1,999', '₹3,499', '₹1,499', '₹2,499'] },
                { feature: 'Towing Distance', values: ['25 km', '75 km', 'Unlimited', '50 km', '100 km'] },
                { feature: '24×7 Helpline', values: ['✓', '✓ Priority', '✓ Priority', '✓', '✓ Multi-channel'] },
                { feature: 'Dispatch Time', values: ['-', '-', '45 min', '-', '45 min'] },
                { feature: 'Hotel & Cab', values: ['-', '1x/year', '3x/year', '-', 'Yes'] },
                { feature: 'EV Specialists', values: ['✓', '✓', '✓', '✓ All vehicles', '✓ AI-powered'] },
              ].map((row, idx) => (
                <tr key={row.feature} className={`border-b border-gray-200 ${idx % 2 === 0 ? 'bg-gray-50' : ''}`}>
                  <td className="py-3 px-4 font-semibold text-gray-800">{row.feature}</td>
                  {row.values.map((value, vidx) => (
                    <td key={vidx} className="text-center py-3 px-4 text-gray-700">{value}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* Order Summary & CTA */}
        {selectedPlan && !showDetails && (
          <div className={`max-w-2xl mx-auto bg-white rounded-3xl shadow-2xl p-8 sm:p-10 border-2 mb-12 animate-slide-in-up ${
            selectedPlan.provider === 'ReadyAssist'
              ? 'border-yellow-200'
              : 'border-orange-200'
          }`}>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 text-center">Your Selection</h2>
            <div className={`flex items-center justify-between rounded-2xl px-6 py-5 border-2 mb-8 ${
              selectedPlan.provider === 'ReadyAssist'
                ? 'bg-gradient-to-br from-yellow-100 to-amber-100 border-yellow-300'
                : 'bg-gradient-to-br from-orange-100 to-red-100 border-orange-300'
            }`}>
              <div>
                <p className={`font-bold text-lg ${
                  selectedPlan.provider === 'ReadyAssist'
                    ? 'text-yellow-900'
                    : 'text-orange-900'
                }`}>{selectedPlan.name}</p>
                <p className="text-sm text-gray-700">{selectedPlan.provider} • {selectedPlan.duration}</p>
              </div>
              <div className={`text-3xl font-black text-transparent bg-clip-text ${
                selectedPlan.provider === 'ReadyAssist'
                  ? 'bg-gradient-to-r from-yellow-500 to-amber-600'
                  : 'bg-gradient-to-r from-orange-500 to-red-600'
              }`}>₹{selectedPlan.price.toLocaleString()}</div>
            </div>
            
            {/* GST Breakdown in Order Summary */}
            <div className={`mb-6 p-4 rounded-xl border-l-4 space-y-2 text-sm ${
              selectedPlan.provider === 'ReadyAssist'
                ? 'bg-yellow-50 border-yellow-400'
                : 'bg-orange-50 border-orange-400'
            }`}>
              <div className="flex justify-between">
                <span className="text-gray-700 font-medium">Base Amount</span>
                <span className="font-semibold text-gray-900">₹{getPaymentBreakdown(selectedPlan.price).baseAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-700 font-medium">GST (18%)</span>
                <span className="font-semibold text-gray-900">+ ₹{getPaymentBreakdown(selectedPlan.price).gstAmount.toLocaleString()}</span>
              </div>
              <div className={`flex justify-between pt-2 border-t-2 font-bold ${
                selectedPlan.provider === 'ReadyAssist'
                  ? 'border-yellow-200 text-yellow-700'
                  : 'border-orange-200 text-orange-700'
              }`}>
                <span>Total (Inc. GST)</span>
                <span>₹{getPaymentBreakdown(selectedPlan.price).totalAmount.toLocaleString()}</span>
              </div>
            </div>

            <button
              onClick={handleOrderClick}
              className={`w-full font-bold text-lg px-10 py-4 rounded-2xl shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 active:scale-95 text-white ${
                selectedPlan.provider === 'ReadyAssist'
                  ? 'bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-600 hover:to-amber-700'
                  : 'bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700'
              }`}
            >
              Proceed to Order
            </button>
          </div>
        )}

        {/* Details / Payment Form */}
        {showDetails && selectedPlan && (
          <div ref={detailsSectionRef} className={`max-w-lg mx-auto mt-8 bg-white rounded-3xl shadow-2xl p-10 border-2 mb-16 animate-slide-in-up ${
            selectedPlan.provider === 'ReadyAssist'
              ? 'border-yellow-200'
              : 'border-orange-200'
          }`}>
            <h3 className={`text-2xl font-bold text-gray-900 mb-6 bg-clip-text text-transparent ${
              selectedPlan.provider === 'ReadyAssist'
                ? 'bg-gradient-to-r from-yellow-500 to-amber-600'
                : 'bg-gradient-to-r from-orange-500 to-red-600'
            }`}>Complete Your Order</h3>
            <div className={`mb-8 rounded-2xl p-5 border-l-4 ${
              selectedPlan.provider === 'ReadyAssist'
                ? 'bg-gradient-to-br from-yellow-50 to-amber-100 border-yellow-500'
                : 'bg-gradient-to-br from-orange-50 to-red-100 border-orange-500'
            }`}>
              <p className={`font-bold mb-1 text-lg ${
                selectedPlan.provider === 'ReadyAssist'
                  ? 'text-yellow-900'
                  : 'text-orange-900'
              }`}>{selectedPlan.name}</p>
              <p className="text-xs text-gray-700">By {selectedPlan.provider}</p>
              <p className="text-sm text-gray-700 mt-2 leading-relaxed">{selectedPlan.tagline}</p>
              <p className={`text-3xl font-black text-transparent bg-clip-text mt-3 ${
                selectedPlan.provider === 'ReadyAssist'
                  ? 'bg-gradient-to-r from-yellow-600 to-amber-600'
                  : 'bg-gradient-to-r from-orange-600 to-red-600'
              }`}>₹{selectedPlan.price.toLocaleString()} / {selectedPlan.duration}</p>
              
              {/* GST Breakdown */}
              <div className={`mt-5 pt-5 border-t-2 space-y-2 ${
                selectedPlan.provider === 'ReadyAssist'
                  ? 'border-yellow-300'
                  : 'border-orange-300'
              }`}>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-700 font-medium">Base Amount</span>
                  <span className="font-semibold text-gray-900">₹{getPaymentBreakdown(selectedPlan.price).baseAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-700 font-medium">GST (18%)</span>
                  <span className="font-semibold text-gray-900">+ ₹{getPaymentBreakdown(selectedPlan.price).gstAmount.toLocaleString()}</span>
                </div>
                <div className={`flex justify-between text-base pt-3 border-t-2 ${
                  selectedPlan.provider === 'ReadyAssist'
                    ? 'border-yellow-300'
                    : 'border-orange-300'
                }`}>
                  <span className={`font-bold ${
                    selectedPlan.provider === 'ReadyAssist'
                      ? 'text-yellow-700'
                      : 'text-orange-700'
                  }`}>Total Amount (After GST)</span>
                  <span className={`font-black text-lg ${
                    selectedPlan.provider === 'ReadyAssist'
                      ? 'text-yellow-600'
                      : 'text-orange-600'
                  }`}>₹{getPaymentBreakdown(selectedPlan.price).totalAmount.toLocaleString()}</span>
                </div>
              </div>
            </div>
            <form className="space-y-5">
              <div>
                <label className="block text-gray-800 font-semibold mb-2 text-sm">Full Name</label>
                <input type="text" className={`w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none transition-all ${
                  selectedPlan.provider === 'ReadyAssist'
                    ? 'focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200'
                    : 'focus:border-orange-500 focus:ring-2 focus:ring-orange-200'
                }`} placeholder="Enter your full name" />
              </div>
              <div>
                <label className="block text-gray-800 font-semibold mb-2 text-sm">Email</label>
                <input type="email" className={`w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none transition-all ${
                  selectedPlan.provider === 'ReadyAssist'
                    ? 'focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200'
                    : 'focus:border-orange-500 focus:ring-2 focus:ring-orange-200'
                }`} placeholder="Enter your email" />
              </div>
              <div>
                <label className="block text-gray-800 font-semibold mb-2 text-sm">Phone Number</label>
                <input type="tel" className={`w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none transition-all ${
                  selectedPlan.provider === 'ReadyAssist'
                    ? 'focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200'
                    : 'focus:border-orange-500 focus:ring-2 focus:ring-orange-200'
                }`} placeholder="Enter your phone number" />
              </div>
              <div>
                <label className="block text-gray-800 font-semibold mb-2 text-sm">Vehicle Registration No.</label>
                <input type="text" className={`w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none transition-all ${
                  selectedPlan.provider === 'ReadyAssist'
                    ? 'focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200'
                    : 'focus:border-orange-500 focus:ring-2 focus:ring-orange-200'
                }`} placeholder="e.g. DL01AB1234" />
              </div>
              <div>
                <label className="block text-gray-800 font-semibold mb-2 text-sm">EV Model</label>
                <input type="text" className={`w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none transition-all ${
                  selectedPlan.provider === 'ReadyAssist'
                    ? 'focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200'
                    : 'focus:border-orange-500 focus:ring-2 focus:ring-orange-200'
                }`} placeholder="e.g. Ather 450X, Ola S1 Pro" />
              </div>
              <button
                type="button"
                className={`w-full text-white py-4 px-6 rounded-2xl font-bold text-lg transition-all transform hover:scale-105 shadow-lg hover:shadow-2xl disabled:opacity-75 disabled:cursor-not-allowed mt-6 active:scale-95 ${
                  selectedPlan.provider === 'ReadyAssist'
                    ? 'bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-600 hover:to-amber-700'
                    : 'bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700'
                }`}
                onClick={handlePayment}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Processing Payment...
                  </span>
                ) : (
                  `Pay ₹${getPaymentBreakdown(selectedPlan.price).totalAmount.toLocaleString()}`
                )}
              </button>
            </form>
          </div>
        )}

      </div>
    </div>
  );
};

export default RSAPlans;
