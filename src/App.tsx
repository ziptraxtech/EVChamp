import React from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import Header from './components/Header';
import Hero from './components/Hero';
import Features from './components/Features';
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
import ZipBattery from './components/ZipBattery';
import AdvanceAnalysis from './components/AdvanceAnalysis';
import DeleteAccount from './components/DeleteAccount';
import RSAPlans from './components/RSAPlans';
import SellEV from './components/SellEV';

// Add this import for the banner image
import BannerLogos from './assets/footer_banner.jpeg'; // Update the path if needed

interface FeatureCardProps {
  icon: string;
  title: string;
  description: string;
  route: string;
  gradient: string;
}

function FeatureCard({ icon, title, description, route, gradient }: FeatureCardProps) {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate(route);
    window.scrollTo({ top: 0, behavior: 'auto' });
  };
  return (
    <div
      onClick={handleClick}
      className={`cursor-pointer bg-gradient-to-r ${gradient} rounded-xl p-8 sm:p-10 flex flex-col items-center text-center text-white shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300`}
    >
      <span className="text-5xl sm:text-6xl mb-4">{icon}</span>
      <h3 className="text-xl sm:text-2xl font-bold mb-2">{title}</h3>
      <p className="text-sm sm:text-base opacity-90 leading-snug">{description}</p>
    </div>
  );
}

function HomePage() {
  return (
    <div className="bg-gradient-to-br from-yellow-200 via-green-200 to-blue-300 min-h-screen w-full">
      <HowItWorks />
      {/* Franchise Highlight Section */}
      
      {/* Feature Navigation Cards */}
      <div className="w-full flex flex-col items-center py-8 bg-white px-4 sm:px-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-800 mb-10">Explore EVChamp Services</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 sm:gap-6">
          <FeatureCard
            icon="🚗"
            title="Sell EV"
            description="List & sell your electric vehicle easily"
            route="/sell-ev"
            gradient="from-blue-500 to-blue-700"
          />
          <FeatureCard
            icon="📋"
            title="Buy Plans"
            description="Choose the best IOT and RSA plans for your vehicle"
            route="/buy-plans"
            gradient="from-green-500 to-green-700"
          />
          <FeatureCard
            icon="⚡"
            title="EV Chargers"
            description="Find & utilize EV charging stations and explore Franchise opportunites"
            route="/franchise"
            gradient="from-yellow-400 to-yellow-600"
          />
          <FeatureCard
            icon="🔋"
            title="ZipBattery"
            description="Extend Battery Lifespan with AI Intelligence"
            route="/zipbattery"
            gradient="from-orange-400 to-red-600"
          />
        </div>
      </div>
      {/* Our Partners Banner */}
      <div className="w-full flex flex-col items-center py-8 bg-white px-4 sm:px-6">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-4">Our Partners</h2>
        <img
          src={BannerLogos}
          alt="Partner Logos"
          className="max-w-6xl w-full rounded-xl shadow-md object-contain"
        />
      </div>
      <DashboardFeatures />
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
          <Route path="/sell-ev" element={<SellEV />} />
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
      </div>
    </Router>
  );
}

export default App;
