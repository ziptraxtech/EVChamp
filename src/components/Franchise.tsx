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
  'Projected 16–20% annual returns over a 60-month term*',
];

// Figures from the EVChamp Micro-Utility franchise plan sheet. All are indicative.
const plans = [
  {
    name: 'Plan A',
    title: '4 × 6 kW Network',
    price: '₹6.00 Lakh',
    roi: '96.3%',
    rewards60: '₹5,77,760',
    yieldPath: '13.5% Y1 → 48.1% Y4–5',
    y45Cash: '₹2,88,880/yr',
    total5yr: '₹11,77,760',
    featured: true,
  },
  {
    name: 'Plan B',
    title: '24 kW Combo Terminal',
    price: '₹5.00 Lakh',
    roi: '88.5%',
    rewards60: '₹4,42,426',
    yieldPath: '13% Y1 → 44% Y4–5',
    y45Cash: '₹2,21,213/yr',
    total5yr: '₹9,42,426',
    featured: false,
  },
];

const planHighlights = [
  { title: '100% Payback @ Month 36', desc: 'Subscription returned by month 36, backed by a zero-loss early exit option.' },
  { title: '22%+ Project IRR', desc: '60-month operating term on decentralised EV fast-charging units.' },
  { title: 'Decentralised Grid', desc: 'Units deployed across 2–4 multi-transit host hubs for optimal fleet utilisation.' },
  { title: 'Powered by ZipsureAI', desc: 'Edge AI to optimise charging, power routing, and predictive maintenance.' },
];

const assetComparison = [
  { asset: 'EVChamp Plan A', sub: true, yield: '13.5% Y1 → 48.1% Y4–5', rewards: '₹11,77,760', security: '100% subscription back at Mo 36; zero-loss option' },
  { asset: 'EVChamp Plan B', sub: true, yield: '13% Y1 → 44% Y4–5', rewards: '₹9,42,426', security: '100% subscription back at Mo 36; zero-loss option' },
  { asset: 'Bank FD', sub: false, yield: '6.8% – 7.1%', rewards: '~₹2.10 L', security: 'Locked; value eroded by inflation' },
  { asset: 'Senior Bonds', sub: false, yield: '7.5% – 8.2%', rewards: '~₹2.30 L', security: 'Subject to credit rating risk' },
  { asset: 'REIT', sub: false, yield: '6.5% – 7.2%', rewards: '~₹2.05 L', security: 'Lease cycle & vacancy risk' },
];

const PLAN_DISCLAIMER =
  '*All figures are projected and indicative in nature, based on expected growth in infrastructure utilisation, and subject to market and operational conditions. Returns are not guaranteed. The company does not seek any direct investments; partners subscribe to franchise plans and receive returns as “rewards”.';

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

  // Opens the contact form pre-filled for the chosen franchise plan.
  const applyForPlan = (plan: string) => {
    navigate(`/contact?${new URLSearchParams({ type: 'Franchise Partnership', plan })}`);
    window.scrollTo({ top: 0, behavior: 'auto' });
  };

  return (
    <div className="bg-white min-h-screen">
      <Helmet>
        <title>EV Franchise Partnership in India | Join the EVChamp Growth Network</title>
        <meta name="description" content="Own green assets with an EVChamp franchise. EV fast-charging micro-utility plans from ₹5 lakh with projected 16–20% annual returns over a 60-month term." />
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
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 leading-tight">
            Now Green EV Assets can Earn up to 20%<span className="text-green-400">*</span> Annually
          </h1>
          <p className="text-lg sm:text-xl font-semibold text-white/90 mb-1">
            as an EVChamp's ZipAsset Franchise Partner
          </p>
          <p className="text-xs sm:text-sm text-green-300 mb-5">(*RoI Projected over 5 years)</p>
          <p className="text-gray-300 text-base sm:text-lg leading-relaxed mb-6">
            Partner with EVChamp to build profitable electric mobility infrastructure and tap into India's fastest-growing clean energy sector.
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
              onClick={() => document.getElementById('franchise-plans')?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-white/10 border border-white/30 text-white font-semibold px-6 py-3 rounded-lg hover:bg-white/20 transition-all text-sm"
            >
              View Plans
            </button>
            <button
            onClick={() => window.open('https://zip-invest.vercel.app/', '_blank', 'noopener,noreferrer')}
            className="border border-white/30 text-white font-semibold px-6 py-3 rounded-lg hover:bg-white/10 transition-all text-sm"
          >
            ZipAsset
          </button>
          </div>
          <p className="text-[11px] text-gray-400 mt-5">*Projected average annual returns over a 60-month term. Subject to market and operational conditions.</p>
        </div>
      </section>

      {/* Franchise Plans */}
      <section id="franchise-plans" className="bg-white scroll-mt-24">
        <div className="container mx-auto px-4 sm:px-6 py-14 sm:py-20 max-w-6xl">
          <div className="max-w-3xl mx-auto text-center mb-10">
            <span className="inline-block text-green-600 font-semibold text-sm uppercase tracking-wider mb-3">
              EVChamp Micro-Utility
            </span>
            <h2 className="text-2xl sm:text-4xl font-bold text-gray-900 mb-4">
              Franchise Deployment Plans
            </h2>
            <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
              Subscribe to a franchise plan and earn rewards on decentralised EV fast-charging infrastructure.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`relative rounded-2xl border bg-white p-6 sm:p-7 shadow-sm hover:shadow-xl transition-all ${
                  plan.featured ? 'border-green-400 ring-1 ring-green-200' : 'border-gray-200'
                }`}
              >
                {plan.featured && (
                  <span className="absolute -top-3 left-6 rounded-full bg-green-600 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-white">
                    Highest rewards
                  </span>
                )}
                <p className="text-xs font-bold uppercase tracking-wider text-gray-500">{plan.name}</p>
                <h3 className="text-lg font-bold text-gray-900 mb-4">{plan.title}</h3>

                <p className="text-3xl sm:text-4xl font-extrabold text-gray-900">{plan.price}</p>
                <p className="text-sm text-gray-500 mb-5">Subscription</p>

                <div className="rounded-xl bg-green-50 border border-green-100 p-4 mb-5">
                  <p className="text-sm font-bold text-green-700">✓ Estimated {plan.roi} expected reward ROI*</p>
                  <p className="text-xs text-green-800 mt-1">60-month expected rewards: <b>{plan.rewards60}</b></p>
                </div>

                <dl className="space-y-3 text-sm">
                  <div className="flex justify-between gap-4 border-b border-gray-100 pb-3">
                    <dt className="text-gray-600">Payback</dt>
                    <dd className="font-bold text-gray-900 text-right">Month 36 <span className="font-medium text-green-700">(100% returned)</span></dd>
                  </div>
                  <div className="flex justify-between gap-4 border-b border-gray-100 pb-3">
                    <dt className="text-gray-600">Est. yield</dt>
                    <dd className="font-bold text-gray-900 text-right">{plan.yieldPath}</dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-gray-600">Y4–Y5 expected cash rewards</dt>
                    <dd className="font-bold text-green-700 text-right">{plan.y45Cash}</dd>
                  </div>
                </dl>

                <button
                  onClick={() => applyForPlan(plan.name)}
                  className="w-full mt-6 text-white font-semibold px-6 py-3 rounded-xl transition-all"
                  style={{ background: 'linear-gradient(120deg, #0a8a52, #1257c4)' }}
                  onMouseEnter={(e) => (e.currentTarget.style.filter = 'brightness(1.1)')}
                  onMouseLeave={(e) => (e.currentTarget.style.filter = 'brightness(1)')}
                >
                  Apply for {plan.name}
                </button>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-10">
            {planHighlights.map((h) => (
              <div key={h.title} className="rounded-xl border border-gray-100 bg-gray-50 p-5">
                <p className="text-sm font-bold text-gray-900 mb-1">{h.title}</p>
                <p className="text-xs text-gray-600 leading-relaxed">{h.desc}</p>
              </div>
            ))}
          </div>

          {/* Asset class comparison */}
          <div className="mt-14">
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 text-center mb-6">
              How the Plans Compare with Other Asset Classes
            </h3>
            <div className="overflow-x-auto rounded-2xl border border-gray-200">
              <table className="w-full min-w-[640px] text-sm">
                <thead className="bg-gray-50 text-left text-xs uppercase tracking-wide text-gray-500">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Franchise &amp; Asset</th>
                    <th className="px-4 py-3 font-semibold">Est. Yield / Expected Rewards</th>
                    <th className="px-4 py-3 font-semibold">5-Yr Net Rewards / Cash</th>
                    <th className="px-4 py-3 font-semibold">Capital Security</th>
                  </tr>
                </thead>
                <tbody>
                  {assetComparison.map((row) => (
                    <tr key={row.asset} className={`border-t border-gray-100 ${row.sub ? 'bg-green-50/60' : ''}`}>
                      <td className="px-4 py-3 font-semibold text-gray-900">
                        {row.asset}
                        {row.sub && <span className="ml-1 text-xs font-normal text-gray-500">(Sub.)</span>}
                      </td>
                      <td className={`px-4 py-3 ${row.sub ? 'font-bold text-green-700' : 'text-gray-700'}`}>{row.yield}</td>
                      <td className={`px-4 py-3 ${row.sub ? 'font-bold text-gray-900' : 'text-gray-700'}`}>{row.rewards}</td>
                      <td className="px-4 py-3 text-gray-600">{row.security}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-[11px] text-gray-500 leading-relaxed mt-4">{PLAN_DISCLAIMER}</p>
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
              Franchise Plans
            </span>
            <span className="text-sm font-bold text-gray-900 text-right">
              From ₹5 Lakh subscription
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
              Projected 16–20% p.a.*
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