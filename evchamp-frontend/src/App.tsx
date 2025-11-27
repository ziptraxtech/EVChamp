import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Hero from './components/Hero';
import Features from './components/Features';
import Coverage from './Coverage';
import HowItWorks from './HowItWorks';
import Testimonials from './Testimonials';
import Footer from './Footer';
import Overview from './Overview';
import DashboardFeatures from './DashboardFeatures';
import BuyPlans from './components/BuyPlans';
import RentEV from './components/RentEV';
import TermsOfUse from './components/TermsOfUse';
import PrivacyPolicy from './components/PrivacyPolicy';
import RefundPolicy from './components/RefundPolicy';
import PaymentSuccess from './components/PaymentSuccess';
import { SignIn, SignUp, UserProfile, RedirectToSignIn, useUser } from '@clerk/clerk-react';
import Franchise from './components/Franchise';
import BuyUsedEV from './components/BuyUsedEV'; // Import the new component

// Add this import for the banner image
import BannerLogos from './assets/footer_banner.jpeg'; // Update the path if needed

function HomePage() {
  return (
    <div className="bg-gradient-to-br from-yellow-200 via-green-200 to-blue-300 min-h-screen w-full">
      <Hero />
      <Overview />
      {/* Our Partners Banner below Overview */}
      <div className="w-full flex flex-col items-center py-8 bg-white">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">Our Partners</h2>
        <img
          src={BannerLogos}
          alt="Partner Logos"
          className="max-w-6xl w-full rounded-xl shadow-md"
        />
      </div>
      {/* Franchise Highlight Section */}
  <div id="franchise-section" className="w-full flex flex-col items-center py-12 bg-white border-t border-b border-gray-100">
    <h2 className="text-2xl md:text-3xl font-bold text-green-700 mb-3">Become an EVChamp Franchise Partner</h2>
    <p className="max-w-2xl text-center text-gray-700 mb-6">
          Join the EV revolution and build a profitable business with India's leading AI & IoT-driven EV fleet management platform. 
          As an EVChamp franchisee, you get access to advanced technology, national brand support, and a rapidly growing market.
        </p>
        <a
          href="/franchise"
         className="inline-block bg-gradient-to-r from-yellow-300 to-yellow-700 text-white font-bold text-lg px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition"        >
          Explore Franchise Opportunities
        </a>
      </div>
      <DashboardFeatures />
      <Features />
      <HowItWorks />
      <Testimonials />
      <Footer />
    </div>
  );
}

function UserSettingsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-200 via-green-200 to-blue-300">
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
          <Route path="/buy-used-ev" element={
            <ProtectedRoute>
              <BuyUsedEV />
            </ProtectedRoute>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
