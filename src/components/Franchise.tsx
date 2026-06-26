import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Footer from '../Footer';

const opportunities = [
  { icon: '⚡', title: 'Charging Station Partnerships', desc: 'Set up EV charging points and earn from a growing user base.' },
  { icon: '🔧', title: 'EV Service & Diagnostics Centers', desc: 'Offer AI-powered diagnostics and battery assessment services.' },
  { icon: '🚗', title: 'Marketplace Support Locations', desc: 'Become a hub for certified pre-owned EV transactions.' },
  { icon: '🏗️', title: 'Mobility & Infrastructure', desc: 'Collaborate on EV leasing, fleet management, and infrastructure projects.' },
];

const benefits = [
  'Entry into a fast-growing EV market',
  'Access to EVChamp technology and ecosystem',
  'Brand association with EV innovation',
  'Multiple revenue opportunities',
  'Operational support and business guidance',
  'Up to 30% ROI from Year 1',
];

const testimonials = [
  { quote: 'Joining EVChamp was the smartest business decision I made. The AI platform is a game-changer, and the support I get is incredible.', name: 'Rajesh Kumar', role: 'Pro Franchisee, Delhi' },
  { quote: 'The Master Centre model gives me so much potential. With the leasing platform and spares distribution, my revenue streams are constantly growing.', name: 'Priya Sharma', role: 'Master Franchisee, Pune' },
  { quote: 'Even with my Basic Centre, the profitability is fantastic. The demand for EV leasing is huge. I\'m already planning my second location!', name: 'Amit Singh', role: 'Pro Franchisee, Jaipur' },
];

const Franchise: React.FC = () => {
  const navigate = useNavigate();

  const goToContact = () => {
    navigate('/contact');
    window.scrollTo({
      top: 0,
      behavior: 'auto',
    });
  };

  return (
    <div className="bg-white min-h-screen">
      <Helmet>
        <title>EV Franchise Partnership in India | Join the EVChamp Growth Network</title>
        <meta name="description" content="Become an EVChamp franchise partner and join a growing network built around EV charging, diagnostics, mobility services, and sustainable infrastructure." />
        <meta name="keywords" content="EV franchise India, EV business opportunity, charging franchise, EV partnership, electric mobility franchise" />
      </Helmet>

      {/* Hero */}
      <section
        className="relative overflow-hidden text-white"
        style={{
          backgroundImage: "url('/investyz.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-slate-950/55" />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/60 via-slate-900/45 to-slate-900/30" />
        <div className="relative container mx-auto px-4 sm:px-6 py-16 sm:py-20 text-center max-w-3xl">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">Build the Future with EVChamp</h1>
          <p className="text-gray-300 text-base sm:text-lg leading-relaxed mb-6">
            EVChamp Franchise Partnership offers a business opportunity for entrepreneurs and organizations looking to enter the fast-growing electric mobility sector.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <button 
              onClick={goToContact} 
              className="text-white font-semibold px-6 py-3 rounded-lg transition-all text-sm"
              style={{
                background: 'linear-gradient(120deg, #0a8a52, #1257c4)',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.filter = 'brightness(1.1)')}
              onMouseLeave={(e) => (e.currentTarget.style.filter = 'brightness(1)')}
            >
              Apply Now
            </button>
            <button
            onClick={() => window.open('https://www.investyz.com/', '_blank', 'noopener,noreferrer')}
            className="border border-white/30 text-white font-semibold px-6 py-3 rounded-lg hover:bg-white/10 transition-all text-sm"
          >
            Investyz
          </button>
          </div>
        </div>
      </section>

  {/* Why Partner */}
<section className="bg-gray-50">
  <div className="container mx-auto px-4 sm:px-6 py-14 sm:py-20 max-w-5xl">
    <div className="max-w-3xl mx-auto text-center">
      <span className="inline-block text-green-600 font-semibold text-sm uppercase tracking-wider mb-3">
        Build the Future of Electric Mobility
      </span>

      <h2 className="text-2xl sm:text-4xl font-bold text-gray-900 mb-5">
        Why Become an EVChamp Partner?
      </h2>

      <p className="text-sm sm:text-base text-gray-600 leading-relaxed mb-5">
        India’s electric mobility ecosystem is creating new opportunities across
        EV charging, roadside assistance, diagnostics, battery services, vehicle
        support, and green mobility solutions. EVChamp brings these services
        together through a growing technology-driven platform.
      </p>

      <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
        By partnering with EVChamp, entrepreneurs, service providers, charging
        operators, investors, and mobility businesses can participate in the
        expanding EV market with access to digital tools, operational guidance,
        brand visibility, and ecosystem support.
      </p>

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <button
          onClick={goToContact}
          className="text-white font-semibold px-7 py-3.5 rounded-xl shadow-lg transition-all"
          style={{
            background: 'linear-gradient(120deg, #0a8a52, #1257c4)',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.filter = 'brightness(1.1)')}
          onMouseLeave={(e) => (e.currentTarget.style.filter = 'brightness(1)')}
        >
          Become an EVChamp Partner
        </button>

        <button
          onClick={() =>
            document
              .getElementById('partnership-opportunities')
              ?.scrollIntoView({ behavior: 'smooth' })
          }
          className="border border-gray-300 text-gray-800 font-semibold px-7 py-3.5 rounded-xl hover:border-green-500 hover:text-green-700 transition-all"
        >
          Explore Opportunities
        </button>
      </div>
    </div>
  </div>
</section>

{/* Partnership Opportunities */}
<section id="partnership-opportunities" className="bg-white">
  <div className="container mx-auto px-4 sm:px-6 py-14 sm:py-20 max-w-6xl">
    <div className="max-w-3xl mx-auto text-center mb-12">
      <span className="inline-block text-green-600 font-semibold text-sm uppercase tracking-wider mb-3">
        Partnership Models
      </span>

      <h2 className="text-2xl sm:text-4xl font-bold text-gray-900 mb-4">
        EV Business and Partnership Opportunities
      </h2>

      <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
        Choose a partnership model aligned with your experience, investment
        capacity, local market, and business goals. EVChamp supports multiple
        opportunities across the electric vehicle ecosystem.
      </p>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {opportunities.map((item) => (
        <div
          key={item.title}
          className="group relative p-6 rounded-2xl border border-gray-100 bg-white hover:-translate-y-1 hover:border-green-200 hover:shadow-xl transition-all duration-300"
        >
          <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center mb-4 group-hover:bg-green-100 transition-colors">
            <span className="text-2xl">{item.icon}</span>
          </div>

          <h3 className="text-base font-bold text-gray-900 mb-2">
            {item.title}
          </h3>

          <p className="text-sm text-gray-600 leading-relaxed">
            {item.desc}
          </p>
        </div>
      ))}
    </div>

    <div className="mt-10 text-center">
      <p className="text-sm text-gray-500 mb-5">
        Not sure which opportunity is right for you? Our team can help you
        understand the available partnership models.
      </p>

      <button
        onClick={goToContact}
        className="inline-flex items-center justify-center text-white font-semibold px-7 py-3.5 rounded-xl shadow-lg transition-all"
        style={{
          background: 'linear-gradient(120deg, #0a8a52, #1257c4)',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.filter = 'brightness(1.1)')}
        onMouseLeave={(e) => (e.currentTarget.style.filter = 'brightness(1)')}
      >
        Discuss a Partnership
      </button>
    </div>
  </div>
</section>

{/* What Partners Gain */}
<section className="bg-gray-50">
  <div className="container mx-auto px-4 sm:px-6 py-14 sm:py-20 max-w-6xl">
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
      <div>
        <span className="inline-block text-green-600 font-semibold text-sm uppercase tracking-wider mb-3">
          Partner Advantages
        </span>

        <h2 className="text-2xl sm:text-4xl font-bold text-gray-900 mb-5">
          What EVChamp Partners Can Gain
        </h2>

        <p className="text-sm sm:text-base text-gray-600 leading-relaxed mb-7">
          EVChamp partners can benefit from a connected mobility ecosystem,
          digital visibility, business support, and access to opportunities
          across the growing electric vehicle market.
        </p>

        <ul className="space-y-4">
          {benefits.map((benefit) => (
            <li
              key={benefit}
              className="flex items-start gap-3 text-sm sm:text-base text-gray-700"
            >
              <span className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg
                  className="w-4 h-4 text-green-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </span>

              <span>{benefit}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-100 shadow-lg">
        <div className="mb-6">
          <span className="inline-block text-green-600 font-semibold text-xs uppercase tracking-wider mb-2">
            Indicative Business Overview
          </span>

          <h3 className="text-xl font-bold text-gray-900">
            Partnership Investment Highlights
          </h3>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between gap-4 border-b border-gray-100 pb-4">
            <span className="text-sm text-gray-600">
              Indicative Initial Investment
            </span>
            <span className="text-sm font-bold text-gray-900">
              From ₹15 Lakh
            </span>
          </div>

          <div className="flex items-center justify-between gap-4 border-b border-gray-100 pb-4">
            <span className="text-sm text-gray-600">
              Business Model
            </span>
            <span className="text-sm font-bold text-gray-900 text-right">
              Location and Service Based
            </span>
          </div>

          <div className="flex items-center justify-between gap-4 border-b border-gray-100 pb-4">
            <span className="text-sm text-gray-600">
              Revenue Potential
            </span>
            <span className="text-sm font-bold text-green-700 text-right">
              Depends on Usage and Market
            </span>
          </div>

          <div className="flex items-center justify-between gap-4">
            <span className="text-sm text-gray-600">
              Support
            </span>
            <span className="text-sm font-bold text-gray-900 text-right">
              Technology, Brand and Operations
            </span>
          </div>
        </div>

        <div className="mt-6 rounded-xl bg-amber-50 border border-amber-100 p-4">
          <p className="text-xs text-amber-800 leading-relaxed">
            Investment requirements, revenue, ROI, and payback period may vary
            based on the selected model, location, operating costs, demand, and
            partner performance. Detailed projections should be reviewed during
            the consultation process.
          </p>
        </div>

        <button
          onClick={goToContact}
          className="w-full mt-6 text-white font-semibold px-6 py-3 rounded-xl transition-all"
          style={{
            background: 'linear-gradient(120deg, #0a8a52, #1257c4)',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.filter = 'brightness(1.1)')}
          onMouseLeave={(e) => (e.currentTarget.style.filter = 'brightness(1)')}
        >
          Request Partnership Details
        </button>
      </div>
    </div>
  </div>
</section>

{/* Testimonials */}
<section className="bg-white">
  <div className="container mx-auto px-4 sm:px-6 py-14 sm:py-20 max-w-6xl">
    <div className="max-w-3xl mx-auto text-center mb-12">
      <span className="inline-block text-green-600 font-semibold text-sm uppercase tracking-wider mb-3">
        Partner Experiences
      </span>

      <h2 className="text-2xl sm:text-4xl font-bold text-gray-900 mb-4">
        What Our EV Ecosystem Partners Say
      </h2>

      <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
        Discover how businesses and mobility professionals are working with
        EVChamp to build stronger local EV services and customer experiences.
      </p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {testimonials.map((testimonial) => (
        <article
          key={testimonial.name}
          className="relative bg-gray-50 rounded-2xl p-6 border border-gray-100 hover:border-green-200 hover:shadow-lg transition-all"
        >
          <span className="absolute top-4 right-5 text-5xl font-serif text-green-100">
            “
          </span>

          <div className="flex gap-1 text-amber-400 text-sm mb-4">
            <span>★</span>
            <span>★</span>
            <span>★</span>
            <span>★</span>
            <span>★</span>
          </div>

          <blockquote className="text-sm text-gray-600 leading-relaxed mb-6 relative z-10">
            “{testimonial.quote}”
          </blockquote>

          <div className="border-t border-gray-200 pt-4">
            <p className="text-sm font-bold text-gray-900">
              {testimonial.name}
            </p>

            <p className="text-xs text-gray-500 mt-1">
              {testimonial.role}
            </p>
          </div>
        </article>
      ))}
    </div>

    <div className="mt-10 text-center">
      <button
        onClick={goToContact}
        className="inline-flex items-center justify-center bg-gray-900 text-white font-semibold px-7 py-3.5 rounded-xl hover:bg-green-700 transition-all"
      >
        Start Your EV Partnership Journey
      </button>
    </div>
  </div>
</section>

      {/* CTA */}
      <section
        className="relative overflow-hidden text-white"
        style={{
          backgroundImage: "url('/investyz.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-slate-950/55" />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/60 via-slate-900/45 to-slate-900/30" />
        <div className="relative container mx-auto px-4 sm:px-6 py-14 text-center max-w-3xl">
          <h2 className="text-2xl font-bold mb-3">Don't Just Watch the EV Revolution — Lead It</h2>
          <p className="text-gray-300 text-sm mb-6">Limited opportunities available. Secure your exclusive territory and become a pioneer in India's EV service industry.</p>
          <div className="flex flex-wrap justify-center gap-3">
            <button 
              onClick={goToContact} 
              className="text-white font-semibold px-6 py-3 rounded-lg transition-all text-sm"
              style={{
                background: 'linear-gradient(120deg, #0a8a52, #1257c4)',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.filter = 'brightness(1.1)')}
              onMouseLeave={(e) => (e.currentTarget.style.filter = 'brightness(1)')}
            >
              Contact Us
            </button>           
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Franchise;