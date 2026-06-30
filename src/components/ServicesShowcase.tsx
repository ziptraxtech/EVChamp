import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import mockupImg from '../assets/mockuo.png';
import nexonImg from '../assets/tata-nexon.jpg';
import mgzsevImg from '../assets/mgzsev.jpg';
import cometevImg from '../assets/cometev.jpg';
import punchImg from '../assets/punch-ev.jpg';
import tiagoevImg from '../assets/tiagoev.jpg';

const ArrowButton: React.FC<{ onClick: (e: React.MouseEvent) => void }> = ({ onClick }) => (
  <button
    onClick={onClick}
    className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-600 hover:text-white transition-all duration-300 flex-shrink-0 shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2"
    style={{
      '--hover-bg': 'linear-gradient(120deg, #0a8a52, #1257c4)',
    } as React.CSSProperties}
    onMouseEnter={(e) => {
      (e.currentTarget as HTMLButtonElement).style.background = 'linear-gradient(120deg, #0a8a52, #1257c4)';
      (e.currentTarget as HTMLButtonElement).style.borderColor = 'transparent';
    }}
    onMouseLeave={(e) => {
      (e.currentTarget as HTMLButtonElement).style.background = 'white';
      (e.currentTarget as HTMLButtonElement).style.borderColor = '#e5e7eb';
    }}
    aria-label="View service details"
  >
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
  </button>
);

const CheckBadge: React.FC<{ text: string; colorClass?: string }> = ({ text, colorClass = 'bg-green-100 text-green-700' }) => (
  <span className={`inline-flex items-center gap-1.5 ${colorClass} font-semibold text-xs px-3 py-1.5 rounded-full`}>
    <svg className="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
    </svg>
    <span>{text}</span>
  </span>
);

interface ServiceCardProps {
  title: string;
  subtitle: string;
  description: string;
  image: string;
  badge: string;
  bgGradient: string;
  badgeColor: string;
  onClick: () => void;
  features?: string[];
}

const ServiceCard: React.FC<ServiceCardProps> = ({ 
  title, 
  subtitle, 
  description, 
  image, 
  badge, 
  bgGradient, 
  badgeColor, 
  onClick,
  features = []
}) => (
  <article
    onClick={onClick}
    role="button"
    tabIndex={0}
    onKeyPress={(e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        onClick();
      }
    }}
    className={`${bgGradient} rounded-xl p-5 flex flex-col justify-between cursor-pointer shadow-md hover:shadow-xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 border border-white/50 backdrop-blur-sm h-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2`}
  >
    <div>
      <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-1 leading-tight">
        {title}
      </h3>
      <p className="font-semibold text-sm mb-2" style={{ color: badgeColor }}>
        {subtitle}
      </p>
      <p className="text-gray-600 text-xs leading-relaxed mb-3">
        {description}
      </p>
      {features.length > 0 && (
        <ul className="text-gray-700 text-xs space-y-1 mb-3">
          {features.map((feature, idx) => (
            <li key={idx} className="flex items-start gap-2">
              <span className="text-green-600 mt-0.5">✓</span>
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
    <div className="flex items-end justify-between mt-4 gap-3">
      <img 
        src={image} 
        alt={`${title} vehicle`} 
        className="w-20 h-14 object-cover rounded-lg"
        loading="lazy"
      />
      <ArrowButton onClick={(e) => { e.stopPropagation(); onClick(); }} />
    </div>
    <div className="mt-3">
      <CheckBadge text={badge} colorClass={badgeColor} />
    </div>
  </article>
);

const ServicesShowcase: React.FC = () => {
  const navigate = useNavigate();
  const { isSignedIn } = useUser();

  const protectedRoutes = [
    '/charging-network', '/service-centres', '/buy-plans', '/buy-used-ev',
    '/rsa-plans', '/sell-ev', '/rent-ev', '/advance-analysis',
  ];

  const goTo = (route: string) => {
    if (protectedRoutes.includes(route) && !isSignedIn) {
      navigate('/sign-in');
      window.scrollTo({ top: 0, behavior: 'auto' });
      return;
    }
    navigate(route);
    window.scrollTo({ top: 0, behavior: 'auto' });
  };

  const services = [
    {
      title: 'Charging Stations',
      subtitle: '⚡ Find EV chargers near you',
      description: 'Locate nearby EV charging points, check real-time availability, and plan your route with confidence.',
      features: ['Live availability tracking', 'Route navigation', '500k+ chargers nationwide'],
      image: cometevImg,
      badge: 'Live map & navigation',
      bgGradient: 'bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-50',
      badgeColor: 'bg-amber-100 text-amber-700',
      route: '/find-ev-chargers'
    },
    {
      title: 'Service Centres',
      subtitle: '🔧 Verified workshops near you',
      description: 'Access trusted EV repair, diagnostics, battery service, and professional support across major cities.',
      features: ['Verified technicians', 'Free diagnostics', 'Pan-India coverage'],
      image: mgzsevImg,
      badge: 'Pan-India support network',
      bgGradient: 'bg-gradient-to-br from-purple-50 via-violet-50 to-indigo-50',
      badgeColor: 'bg-purple-100 text-purple-700',
      route: '/service-centres'
    },
    {
      title: 'Zeflash',
      subtitle: '🔋 Rapid AI battery diagnostics',
      description: '20-minute field diagnostics with advanced SoP, SoF analysis, and instant health reports during charging.',
      features: ['AI-powered analysis', '20-minute service', 'Instant reports'],
      image: punchImg,
      badge: 'Visit zeflash.app',
      bgGradient: 'bg-gradient-to-br from-blue-50 via-sky-50 to-cyan-50',
      badgeColor: 'bg-blue-100 text-blue-700',
      route: '/zeflash'
    },
    {
      title: 'Smart EV Telematics',
      subtitle: '📍 Real-time GPS & AI diagnostics',
      description: 'India\'s most advanced IoT tracking and fleet management platform built for electric vehicles.',
      features: ['Real-time tracking', 'AI diagnostics', 'Fleet management'],
      image: mockupImg,
      badge: 'Plans starting at ₹4,999/yr',
      bgGradient: 'bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50',
      badgeColor: 'bg-green-100 text-green-700',
      route: '/buy-plans'
    },
    {
      title: 'Rent an EV',
      subtitle: '🚗 Flexible & affordable',
      description: 'Rent electric vehicles by the day or month with zero fuel costs, zero emissions, and zero hassle.',
      features: ['Hourly to monthly rentals', 'Insurance included', 'Free charging'],
      image: nexonImg,
      badge: 'From ₹499/day',
      bgGradient: 'bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50',
      badgeColor: 'bg-teal-100 text-teal-700',
      route: '/rent-ev'
    },
    {
      title: 'RSA Plans',
      subtitle: '🚨 24×7 roadside support',
      description: 'Get towing, battery assistance, tyre support, and emergency EV help anywhere, anytime.',
      features: ['24/7 support availability', 'Quick response time', 'Nationwide coverage'],
      image: cometevImg,
      badge: 'Plans from ₹999/yr',
      bgGradient: 'bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50',
      badgeColor: 'bg-orange-100 text-orange-700',
      route: '/rsa-plans'
    },
    {
      title: 'Sell Your EV',
      subtitle: '💰 Best price & fast verification',
      description: 'List your electric vehicle and connect with thousands of genuine buyers instantly with zero commission.',
      features: ['Zero commission fees', 'Instant verification', '1000+ monthly buyers'],
      image: nexonImg,
      badge: 'Zero commission listing',
      bgGradient: 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50',
      badgeColor: 'bg-blue-100 text-blue-700',
      route: '/sell-ev'
    },
    {
      title: 'ZipBattery',
      subtitle: '⚙️ AI-powered battery health',
      description: 'Extend your EV battery lifespan using our patented AI diagnostic technology and smart optimization.',
      features: ['Extend battery life', 'Reduce costs', 'Patented technology'],
      image: tiagoevImg,
      badge: 'Patented technology',
      bgGradient: 'bg-gradient-to-br from-rose-50 via-pink-50 to-orange-50',
      badgeColor: 'bg-red-100 text-red-700',
      route: '/zipbattery'
    }
  ];

  return (
    <section 
      className="py-16 sm:py-20 bg-gradient-to-b from-gray-50 to-white"
      aria-labelledby="services-heading"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section with improved SEO and structure */}
        <header className="text-center mb-12 sm:mb-16">
          <h2 
            id="services-heading"
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 leading-tight"
          >
            Explore Our Top <span style={{
              background: 'linear-gradient(120deg, #0a8a52, #1257c4)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>EV Services</span>
          </h2>
          <p className="text-gray-600 text-sm sm:text-base max-w-3xl mx-auto leading-relaxed">
            Complete electric vehicle solutions — from charging infrastructure and maintenance to rentals and battery diagnostics. Everything you need on your EV journey.
          </p>
          
          {/* Trust/Stats Section */}
          <div className="mt-8 flex flex-wrap justify-center gap-6 sm:gap-8">
            <div className="flex flex-col items-center">
              <p className="text-xl sm:text-2xl font-bold" style={{
                background: 'linear-gradient(120deg, #0a8a52, #1257c4)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>500+</p>
              <p className="text-gray-600 text-xs sm:text-sm">Charging Points</p>
            </div>
            <div className="flex flex-col items-center">
              <p className="text-xl sm:text-2xl font-bold" style={{
                background: 'linear-gradient(120deg, #0a8a52, #1257c4)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>100+</p>
              <p className="text-gray-600 text-xs sm:text-sm">Service Centres</p>
            </div>
            <div className="flex flex-col items-center">
              <p className="text-xl sm:text-2xl font-bold" style={{
                background: 'linear-gradient(120deg, #0a8a52, #1257c4)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>50K+</p>
              <p className="text-gray-600 text-xs sm:text-sm">Happy Users</p>
            </div>
          </div>
        </header>

        {/* Services Grid - Responsive Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {services.map((service, index) => (
            <ServiceCard
              key={`service-${service.title.toLowerCase().replace(/\s+/g, '-')}`}
              title={service.title}
              subtitle={service.subtitle}
              description={service.description}
              features={service.features}
              image={service.image}
              badge={service.badge}
              bgGradient={service.bgGradient}
              badgeColor={service.badgeColor}
              onClick={() => goTo(service.route)}
            />
          ))}
        </div>

        {/* CTA Section with improved messaging */}
        <div className="mt-16 sm:mt-20 text-center">
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-8 sm:p-12 border border-green-200">
            <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
              Ready to Transform Your <span style={{
                background: 'linear-gradient(120deg, #0a8a52, #1257c4)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>EV Experience?</span>
            </h3>
            <p className="text-gray-600 text-sm sm:text-base mb-6 max-w-2xl mx-auto">
              Join thousands of EV owners who trust EVChamp for their complete electric vehicle needs
            </p>
            {/* One Time Trial - Grid Container */}
            <div className="flex justify-center mb-6">
              <div className="relative rounded-2xl border-2 border-emerald-400 bg-gradient-to-br from-emerald-50 to-white p-6 hover:shadow-lg transition-all flex flex-col w-full max-w-sm">
                <div className="absolute -top-3 right-4">
                  <span className="inline-block rounded-full bg-emerald-500 px-3 py-1 text-xs font-bold text-white shadow-md">
                    TRIAL
                  </span>
                </div>
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-gray-900">One Time</h3>
                  <p className="text-sm text-gray-600 mt-1">Try it once</p>
                </div>
                <div className="mb-6">
                  <div className="flex items-center gap-2">
                    <span className="text-4xl font-extrabold text-emerald-700">₹200</span>
                    <p className="text-xs text-gray-600"> -Valid for one time use only</p>
                  </div>
                </div>
                <ul className="space-y-3 mb-6 flex-grow">
                  <li className="flex items-start gap-2 text-sm text-gray-700">
                    <svg className="text-emerald-600 mt-0.5 flex-shrink-0" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
                    <span>1 complete 20-min diagnostic</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm text-gray-700">
                    <svg className="text-emerald-600 mt-0.5 flex-shrink-0" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
                    <span>Instant health report</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm text-gray-700">
                    <svg className="text-emerald-600 mt-0.5 flex-shrink-0" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
                    <span>PDF download</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm text-gray-700">
                    <svg className="text-emerald-600 mt-0.5 flex-shrink-0" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
                    <span>Basic recommendations</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm text-gray-700">
                    <svg className="text-emerald-600 mt-0.5 flex-shrink-0" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
                    <span>No credit card required</span>
                  </li>
                </ul>
                <button
                  onClick={() => {
                    console.log('📋 Trial Plan Selected:', { plan: 'trial', tests: 1, months: 0, price: 299, amountInPaise: 29900 });
                    navigate('/zeflash', { state: { plan: 'trial', tests: 1, months: 0, price: 299, openCheckout: true } });
                    window.scrollTo({ top: 0, behavior: 'auto' });
                  }}
                  className="block w-full text-center rounded-lg bg-emerald-600 text-white font-semibold px-4 py-2.5 hover:bg-emerald-700 transition-colors shadow-sm"
                >
                  Start Trial
                </button>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => {
                  if (!isSignedIn) {
                    navigate('/sign-in');
                  } else {
                    navigate('/zevault');
                    // Scroll to pricing section after navigation
                    setTimeout(() => {
                      const pricingSection = document.getElementById('pricing-section');
                      if (pricingSection) {
                        pricingSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      }
                    }, 500);
                  }
                  window.scrollTo({ top: 0, behavior: 'auto' });
                }}
                className="text-white font-semibold px-8 py-3 rounded-lg transition-all duration-300 shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2"
                style={{
                  background: 'linear-gradient(120deg, #0a8a52, #1257c4)',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.filter = 'brightness(1.1)')}
                onMouseLeave={(e) => (e.currentTarget.style.filter = 'brightness(1)')}
              >
                 Explore Annual Plans
              </button>
            </div>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full mb-4" style={{
              background: 'linear-gradient(120deg, #0a8a52, #1257c4)',
            }}>
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h4 className="font-bold text-gray-900 mb-2">Trusted & Verified</h4>
            <p className="text-gray-600 text-sm">All partners verified with strict quality standards</p>
          </div>
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full mb-4" style={{
              background: 'linear-gradient(120deg, #0a8a52, #1257c4)',
            }}>
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h4 className="font-bold text-gray-900 mb-2">Real-Time Data</h4>
            <p className="text-gray-600 text-sm">Live availability, pricing, and support 24/7</p>
          </div>
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full mb-4" style={{
              background: 'linear-gradient(120deg, #0a8a52, #1257c4)',
            }}>
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h4 className="font-bold text-gray-900 mb-2">Best Value</h4>
            <p className="text-gray-600 text-sm">Competitive pricing with exclusive member benefits</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesShowcase;
