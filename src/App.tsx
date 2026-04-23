import React from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Header from './components/Header';
import Testimonials from './Testimonials';
import Footer from './Footer';
import BuyPlans from './components/BuyPlans';
import RentEV from './components/RentEV';
import TermsOfUse from './components/TermsOfUse';
import PrivacyPolicy from './components/PrivacyPolicy';
import RefundPolicy from './components/RefundPolicy';
import PaymentSuccess from './components/PaymentSuccess';
import { SignIn, SignUp, UserProfile, RedirectToSignIn, useUser } from '@clerk/clerk-react';
import Franchise from './components/Franchise';
import BuyUsedEV from './components/BuyUsedEV';
import ServiceCentres from './components/ServiceCentres';
import ZipBattery from './components/ZipBattery';
import AdvanceAnalysis from './components/AdvanceAnalysis';
import DeleteAccount from './components/DeleteAccount';
import RSAPlans from './components/RSAPlans';
import SellEV from './components/SellEV';
import ServicesShowcase from './components/ServicesShowcase';
import { ScrollReveal } from './components/ScrollReveal';
import AboutUs from './components/AboutUs';
import ChargingNetwork from './components/ChargingNetwork';
import Investyz from './components/Investyz';
import ContactUs from './components/ContactUs';
import SmarterEVAssistance from './components/SmarterEVAssistance';
import Zeflash from './components/Zeflash';

import PartnersCarousel from './components/PartnersCarousel';
import { useSyncUserToDB } from './hooks/useSyncUserToDB';

function HomePage() {
  const navigate = useNavigate();
  const goTo = (route: string) => {
    navigate(route);
    window.scrollTo({ top: 0, behavior: 'auto' });
  };

  const scrollToTopServices = () => {
    const section = document.getElementById('top-services');
    if (section) {
      const rect = section.getBoundingClientRect();
      const sectionTop = window.scrollY + rect.top;
      const centeredTop = sectionTop - (window.innerHeight - rect.height) / 2;
      const targetTop = Math.max(0, centeredTop - 40);

      window.scrollTo({
        top: targetTop,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className="home-page bg-white min-h-screen w-full">
      <Helmet>
        <title>EVChamp | AI &amp; IoT-Driven EV Fleet Management Platform in India</title>
        <meta name="description" content="EVChamp is an AI & IoT-driven EV ecosystem for fleet management, certified pre-owned EVs, battery diagnostics, charging stations, roadside assistance, franchise partnerships, and green infrastructure investment." />
        <meta name="keywords" content="EV fleet management platform, AI EV platform India, IoT for EVs, EV marketplace, battery diagnostics, EV charging network" />
      </Helmet>

      {/* Hero Section */}
      <section
        className="relative overflow-hidden text-white"
        style={{
          backgroundImage: "url('/bg-hero.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center 20%',
        }}
      >
        <div className="absolute inset-0 bg-white/10" />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/55 via-slate-900/40 to-slate-900/25" />

        <div className="relative container mx-auto px-4 sm:px-6 py-16 sm:py-24 text-center max-w-4xl">
          <div className="rounded-2xl bg-black/20 backdrop-blur-[2px] px-4 py-8 sm:px-8 sm:py-10 shadow-xl">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-6 text-white drop-shadow-sm">
              Powering the Future of Electric Mobility with AI and IoT
            </h1>
            <p className="text-white/95 text-base sm:text-lg leading-relaxed mb-8 max-w-3xl mx-auto drop-shadow-sm">
              From certified pre-owned EVs and battery diagnostics to IoT hardware, software subscriptions, charging access, roadside assistance, and smart EV support — EVChamp brings every part of the EV journey into one connected platform.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <button onClick={scrollToTopServices} className="bg-white text-gray-900 font-semibold px-6 py-3 rounded-lg hover:bg-gray-100 transition-all text-sm shadow-sm">
                Explore Platform
              </button>
              <button onClick={() => goTo('/sign-up')} className="bg-green-500 text-white font-semibold px-6 py-3 rounded-lg hover:bg-green-600 transition-all text-sm shadow-sm">
                Get Started
              </button>
              <button onClick={() => goTo('/contact')} className="border border-white/50 bg-white/10 text-white font-semibold px-6 py-3 rounded-lg hover:bg-white/15 transition-all text-sm backdrop-blur-sm">
                Talk to Our Team
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Why EVChamp — compact value prop */}
      <section className="bg-gray-50 border-b border-gray-100">
        <div className="container mx-auto px-4 sm:px-6 py-12 sm:py-16 max-w-4xl text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">Why EVChamp</h2>
          <p className="text-gray-600 text-base leading-relaxed">
            Battery health, maintenance, charging access, fleet uptime, resale value, and infrastructure investment all matter. EVChamp uses AI and IoT to simplify operations, improve transparency, and create better outcomes for individuals and businesses alike.
          </p>
        </div>
      </section>

      {/* What EVChamp Offers — button grid instead of long scroll */}
      <section className="bg-white">
        <div className="container mx-auto px-4 sm:px-6 py-12 sm:py-16">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center mb-10">What EVChamp Offers</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
            {[
              { icon: '🚗', label: 'EV Marketplace', desc: 'Certified pre-owned EV buying and selling', route: '/buy-used-ev', color: 'from-blue-500 to-blue-600' },
              { icon: '🔋', label: 'Battery Diagnostics', desc: 'Complete battery health and vehicle insights', route: '/zipbattery', color: 'from-green-500 to-emerald-600' },
              { icon: '📡', label: 'IoT Hardware', desc: 'Connected fleet intelligence plans', route: '/buy-plans', color: 'from-purple-500 to-purple-600' },
              { icon: '📊', label: 'Software Plans', desc: 'Monitoring and optimization subscriptions', route: '/buy-plans', color: 'from-indigo-500 to-indigo-600' },
              { icon: '🛣️', label: 'Roadside Assistance', desc: 'Emergency EV support across India', route: '/rsa-plans', color: 'from-orange-500 to-orange-600' },
              { icon: '⚡', label: 'Charging Network', desc: 'Station access across India', route: '/charging-network', color: 'from-yellow-500 to-amber-600' },
              { icon: '🤝', label: 'Franchise Partnership', desc: 'Build your EV business with us', route: '/franchise', color: 'from-teal-500 to-teal-600' },
              { icon: '📈', label: 'INVESTYZ', desc: 'Green infrastructure investment', route: '/investyz', color: 'from-rose-500 to-rose-600' },
            ].map((item) => (
              <button
                key={item.label}
                onClick={() => goTo(item.route)}
                className="group text-left p-5 rounded-xl border border-gray-100 hover:border-gray-200 hover:shadow-lg transition-all duration-300 bg-white"
              >
                <span className="text-2xl mb-3 block">{item.icon}</span>
                <h3 className="text-sm font-bold text-gray-900 mb-1 group-hover:text-green-700 transition-colors">{item.label}</h3>
                <p className="text-xs text-gray-500 leading-snug">{item.desc}</p>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Services Showcase — existing tiles */}
      <section id="top-services">
        <ScrollReveal className="home-section-shell" duration={850} threshold={0.15}>
          <ServicesShowcase />
        </ScrollReveal>
      </section>

      {/* Audience Cards — compact */}
      <section className="bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 py-12 sm:py-16">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center mb-10">Built for a Smarter EV Future</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 mb-2">For Individuals</h3>
              <p className="text-sm text-gray-600 leading-relaxed mb-4">Buy or sell EVs with confidence, access battery diagnostics, get help when needed, and discover nearby charging support.</p>
              <button onClick={() => goTo('/buy-used-ev')} className="text-sm font-medium text-green-700 hover:text-green-800 transition-colors">
                Explore Marketplace →
              </button>
            </div>
            <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 mb-2">For Fleets & Businesses</h3>
              <p className="text-sm text-gray-600 leading-relaxed mb-4">Monitor vehicle performance, reduce downtime, improve operational efficiency, and manage EV assets with real-time intelligence.</p>
              <button onClick={() => goTo('/buy-plans')} className="text-sm font-medium text-green-700 hover:text-green-800 transition-colors">
                View Plans →
              </button>
            </div>
            <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 mb-2">For Investors & Partners</h3>
              <p className="text-sm text-gray-600 leading-relaxed mb-4">Explore sustainable infrastructure investment opportunities and franchise models built for long-term growth in India's EV ecosystem.</p>
              <button onClick={() => goTo('/investyz')} className="text-sm font-medium text-green-700 hover:text-green-800 transition-colors">
                Learn About INVESTYZ →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Partners Banner */}
      <section className="bg-white border-y border-gray-100">
        <div className="py-10">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-8 text-center">Our Partners</h2>
          <PartnersCarousel />
        </div>
      </section>

      {/* Testimonials */}
      <ScrollReveal duration={900} delay={80} threshold={0.15}>
        <Testimonials />
      </ScrollReveal>

      {/* Final CTA */}
      <section className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
        <div className="container mx-auto px-4 sm:px-6 py-14 text-center max-w-3xl">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">Join the EVChamp Network</h2>
          <p className="text-gray-300 text-base mb-8">Be part of the next generation of electric mobility in India.</p>
          <div className="flex flex-wrap justify-center gap-3">
            <button onClick={() => goTo('/sign-up')} className="bg-green-500 text-white font-semibold px-6 py-3 rounded-lg hover:bg-green-600 transition-all text-sm">
              Get Started Free
            </button>
            <button onClick={() => goTo('/contact')} className="border border-white/30 text-white font-semibold px-6 py-3 rounded-lg hover:bg-white/10 transition-all text-sm">
              Contact Us
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

function UserSettingsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-6 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <div className="mb-6">
            <button
              onClick={() => window.history.back()}
              className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm text-gray-700 px-4 py-2 rounded-lg hover:bg-white/30 transition-all duration-200 shadow-lg"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="font-semibold">Back</span>
            </button>
          </div>
          
          {/* Page Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Account Settings</h1>
            <p className="text-gray-600">Manage your profile, security, and preferences</p>
          </div>
          
          {/* User Profile Component */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20 p-8">
            <UserProfile routing="path" path="/user" />
          </div>
        </div>
      </div>
    </div>
  );
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isSignedIn } = useUser();
  if (!isSignedIn) {
    return <RedirectToSignIn />;
  }
  return <>{children}</>;
}

function App() {
  useSyncUserToDB();
  return (
    <Router>
      <div>
        <Header />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/sign-in" element={<SignIn routing="path" path="/sign-in" />} />
          <Route path="/sign-up" element={<SignUp routing="path" path="/sign-up" />} />
          <Route path="/user" element={<UserSettingsPage />} />
          <Route path="/payment-success" element={<PaymentSuccess />} />
          <Route path="/buy-plans" element={
            <ProtectedRoute>
              <BuyPlans />
            </ProtectedRoute>
          } />
          <Route path="/rent-ev" element={
            <ProtectedRoute>
              <RentEV />
            </ProtectedRoute>
          } />
          <Route path="/terms" element={<TermsOfUse />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/refund" element={<RefundPolicy />} />
          <Route path="/franchise" element={<Franchise />} />
          <Route path="/sell-ev" element={<SellEV />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/charging-network" element={<ChargingNetwork />} />
          <Route path="/zeflash" element={<Zeflash />} />
          <Route path="/investyz" element={<Investyz />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/ev-assistance" element={<SmarterEVAssistance />} />
          <Route path="/zipbattery" element={<ZipBattery />} />
          <Route path="/advance-analysis" element={
            <ProtectedRoute>
              <AdvanceAnalysis />
            </ProtectedRoute>
          } />
          <Route path="/buy-used-ev" element={
            <ProtectedRoute>
              <BuyUsedEV />
            </ProtectedRoute>
          } />
          <Route path="/service-centres" element={<ServiceCentres />} />
          <Route path="/delete-account" element={
            <ProtectedRoute>
              <DeleteAccount />
            </ProtectedRoute>
          } />
          <Route path="/rsa-plans" element={
            <ProtectedRoute>
              <RSAPlans />
            </ProtectedRoute>
          } />
        </Routes>

        {/* Floating WhatsApp Button */}
        <a
          href="https://wa.me/918368681769?text=Hi%2C%20I%20would%20like%20to%20request%20services."
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 bg-green-500 hover:bg-green-600 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
          aria-label="Chat on WhatsApp"
        >
          <svg viewBox="0 0 32 32" className="w-8 h-8 fill-white">
            <path d="M16 0C7.164 0 0 7.163 0 16c0 2.822.737 5.469 2.027 7.77L0 32l8.437-2.01A15.938 15.938 0 0 0 16 32c8.837 0 16-7.163 16-16S24.837 0 16 0zm0 29.333a13.27 13.27 0 0 1-6.77-1.853l-.485-.287-5.007 1.194 1.234-4.874-.316-.5A13.226 13.226 0 0 1 2.667 16C2.667 8.636 8.636 2.667 16 2.667S29.333 8.636 29.333 16 23.364 29.333 16 29.333zm7.27-9.878c-.398-.199-2.355-1.162-2.72-1.295-.365-.133-.631-.199-.897.199-.266.398-1.03 1.295-1.262 1.561-.232.266-.465.299-.863.1-.398-.199-1.681-.619-3.201-1.977-1.183-1.057-1.982-2.362-2.214-2.76-.232-.398-.025-.613.174-.811.179-.178.398-.465.597-.698.199-.232.266-.398.398-.664.133-.266.066-.498-.033-.697-.1-.199-.897-2.162-1.229-2.96-.324-.776-.652-.671-.897-.683l-.764-.013c-.266 0-.698.1-1.063.498-.365.398-1.395 1.362-1.395 3.325s1.428 3.857 1.627 4.123c.199.266 2.81 4.29 6.808 6.018.951.411 1.693.656 2.272.84.954.304 1.823.261 2.51.158.765-.114 2.355-.962 2.688-1.892.332-.93.332-1.727.232-1.892-.099-.166-.365-.266-.763-.465z" />
          </svg>
        </a>
      </div>
    </Router>
  );
}

export default App;
