import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Footer from '../Footer';

const investmentAreas = [
  { icon: '⚡', title: 'EV Charging Infrastructure', desc: 'Invest in the backbone of electric mobility across India.' },
  { icon: '🔋', title: 'Battery Storage Assets', desc: 'Support grid-level and commercial battery storage solutions.' },
  { icon: '🖥️', title: 'Data Centers', desc: 'Power the digital infrastructure driving modern operations.' },
  { icon: '☀️', title: 'Renewable Energy Projects', desc: 'Participate in solar, wind, and clean energy generation.' },
  { icon: '🏗️', title: 'Real-World Infrastructure', desc: 'Access diversified physical asset investment opportunities.' },
];

const Investyz: React.FC = () => {
  const navigate = useNavigate();
  const goTo = (route: string) => {
    navigate(route);
    window.scrollTo({ top: 0, behavior: 'auto' });
  };
  const goToContact = () => {
    window.location.href = '/contact';
  };
  const goToInvestyzWebsite = () => {
    window.open('https://www.investyz.com', '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="bg-white min-h-screen">
      <Helmet>
        <title>INVESTYZ | Invest in EV Charging, Battery Storage, Data Centers &amp; Green Infrastructure</title>
        <meta name="description" content="INVESTYZ lets you invest in real-world infrastructure assets like EV charging, battery storage, data centers, and renewable energy through decentralized physical infrastructure on Polygon." />
        <meta name="keywords" content="green infrastructure investment, EV charging investment, battery storage investment, decentralized infrastructure, real world asset investing" />
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
          <p className="text-green-400 text-sm font-semibold tracking-wider uppercase mb-3">By EVChamp</p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">Invest in the Infrastructure of Tomorrow</h1>
          <p className="text-gray-300 text-base sm:text-lg leading-relaxed mb-6">
            INVESTYZ is a sustainable infrastructure investment platform built for the next generation of real-world assets. Through decentralized physical infrastructure on Polygon, INVESTYZ gives investors access to sectors powering the future.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <button onClick={goToContact} className="bg-green-500 text-white font-semibold px-6 py-3 rounded-lg hover:bg-green-600 transition-all text-sm">
              Start Investing
            </button>
            <button onClick={() => goTo('/about')} className="border border-white/30 text-white font-semibold px-6 py-3 rounded-lg hover:bg-white/10 transition-all text-sm">
              Learn More
            </button>
          </div>
        </div>
      </section>

      {/* Investment Areas */}
      <section className="bg-white">
        <div className="container mx-auto px-4 sm:px-6 py-12 sm:py-16 max-w-5xl">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center mb-10">What You Can Invest In</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {investmentAreas.map((item) => (
              <div key={item.title} className="p-5 rounded-xl border border-gray-100 hover:border-gray-200 hover:shadow-md transition-all">
                <span className="text-2xl block mb-3">{item.icon}</span>
                <h3 className="text-sm font-bold text-gray-900 mb-1">{item.title}</h3>
                <p className="text-xs text-gray-500 leading-snug">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why INVESTYZ */}
      <section className="bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 py-12 sm:py-16 max-w-3xl">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">Why INVESTYZ</h2>
          <p className="text-gray-600 text-center leading-relaxed mb-8">
            As demand grows for clean energy, electrification, and digital infrastructure, there is a rising need for investment models that are both sustainable and future-ready. INVESTYZ brings together infrastructure growth and long-term yield potential.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl p-6 border border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 mb-2">Built on Transparency</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Using decentralized infrastructure concepts, INVESTYZ supports a more transparent and accessible investment experience.
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 border border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 mb-2">Sustainability with Purpose</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Infrastructure investments that deliver both impact and utility. Capital connected to physical systems supporting modern life and climate-conscious growth.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-white">
        <div className="container mx-auto px-4 sm:px-6 py-12 max-w-3xl">
          <h2 className="text-xl font-bold text-gray-900 mb-6 text-center">Frequently Asked Questions</h2>
          <div className="space-y-4">
            <details className="border border-gray-100 rounded-lg p-4 group">
              <summary className="text-sm font-medium text-gray-900 cursor-pointer">What is real-world asset investing?</summary>
              <p className="mt-2 text-sm text-gray-600">Real-world asset investing involves putting capital into physical infrastructure like charging stations, battery storage, and renewable energy projects that generate tangible returns.</p>
            </details>
            <details className="border border-gray-100 rounded-lg p-4 group">
              <summary className="text-sm font-medium text-gray-900 cursor-pointer">How does decentralized infrastructure work?</summary>
              <p className="mt-2 text-sm text-gray-600">INVESTYZ uses blockchain-based technology on Polygon to create transparent, accessible investment vehicles for physical infrastructure assets.</p>
            </details>
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
        <div className="absolute inset-0 bg-slate-950/60" />
        <div className="relative container mx-auto px-4 sm:px-6 py-14 text-center max-w-3xl">
          <h2 className="text-2xl font-bold mb-4">Discover a New Way to Invest</h2>
          <p className="text-gray-300 text-sm mb-6">Explore INVESTYZ and invest in sustainable, real-world infrastructure.</p>
          <button onClick={goToContact} className="bg-green-500 text-white font-semibold px-6 py-3 rounded-lg hover:bg-green-600 transition-all text-sm">
            Get in Touch
          </button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Investyz;
