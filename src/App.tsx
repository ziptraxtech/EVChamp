import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import SiteHeader from './components/SiteHeader';
import BuyPlans from './components/BuyPlans';
import RentEV from './components/RentEV';
import TermsOfUse from './components/TermsOfUse';
import PrivacyPolicy from './components/PrivacyPolicy';
import RefundPolicy from './components/RefundPolicy';
import PaymentSuccess from './components/PaymentSuccess';
import { SignUp, UserProfile, RedirectToSignIn, useUser } from '@clerk/clerk-react';
import SmartSignIn from './components/SmartSignIn';
import Franchise from './components/Franchise';
import BuyUsedEV from './components/BuyUsedEV';
import ServiceCentres from './components/ServiceCentres';
import EVTruLife from './components/EVTruLife';
import AdvanceAnalysis from './components/AdvanceAnalysis';
import DeleteAccount from './components/DeleteAccount';
import RSAPlans from './components/RSAPlans';
import SellEV from './components/SellEV';
import AboutUs from './components/AboutUs';
import ChargingNetwork from './components/ChargingNetwork';
import FindEVChargers from './components/FindEVChargers';
import ContactUs from './components/ContactUs';
import SmarterEVAssistance from './components/SmarterEVAssistance';
import Zeflash from './components/Zeflash';
import EVChampPay from './components/EVChampPay';
import ZeVaultPage from './components/ZeVaultPage';
import ZeVaultCheckout from './components/ZeVaultCheckout';
import Blog from './components/Blog';
import ZeflashPlans from './components/ZeflashPlans';
import { initializePushNotifications } from './components/FirebaseNotification';
import { scheduleLocalNotifications, setupLocalNotificationTapHandler } from './components/LocalNotifications';
import AdminNotificationPanel from './components/AdminNotificationPanel';


import ChatbotPopup from './components/ChatbotPopup';
import EVMarketplace from './components/marketplace/EVMarketplace';
import ZeXperience from './components/experience/ZeXperience';
import LandingPage from './components/LandingPage';

function HomePage() {
  return <LandingPage />;
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
  const { isSignedIn, isLoaded } = useUser();
  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-gray-500 text-sm">Loading...</p>
        </div>
      </div>
    );
  }
  if (!isSignedIn) {
    return <RedirectToSignIn redirectUrl={window.location.pathname} />;
  }
  return <>{children}</>;
}

function App() {
  useEffect(() => {
    // Initialize Firebase notifications (if available)
    initializePushNotifications();
    
    // Schedule local notifications at 11 AM and 7 PM daily
    // These will work even when the app is closed
    scheduleLocalNotifications();
    
    // Handle when user taps a notification
    setupLocalNotificationTapHandler();
  }, []);
  return (
    <Router>
      <div className="min-w-0 w-full">
        <SiteHeader />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/ev-marketplace" element={
            <ProtectedRoute>
              <EVMarketplace />
            </ProtectedRoute>
          } />
          <Route path="/sign-in" element={<SmartSignIn />} />
          <Route path="/sign-up" element={<SignUp routing="path" path="/sign-up" forceRedirectUrl="/" fallbackRedirectUrl="/" />} />
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
          <Route path="/charging-network" element={
            <ProtectedRoute>
              <ChargingNetwork />
            </ProtectedRoute>
          } />
          <Route path="/zeflash" element={<Zeflash />} />
          <Route path="/evchamp-pay" element={<EVChampPay />} />
          <Route path="/zevault" element={<ZeVaultPage />} />
          <Route path="/ze-xperience" element={<ZeXperience />} />
          <Route path="/checkout" element={<ZeVaultCheckout />} />
          <Route path="/find-ev-chargers" element={<FindEVChargers />} />
          <Route path="/investyz" element={<FindEVChargers />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/zeflash-plans" element={<ZeflashPlans />} />
          <Route path="/ev-assistance" element={<SmarterEVAssistance />} />
          <Route path="/evtrulife" element={<EVTruLife />} />
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
          <Route path="/service-centres" element={
            <ProtectedRoute>
              <ServiceCentres />
            </ProtectedRoute>
          } />
          <Route path="/delete-account" element={
            <ProtectedRoute>
              <DeleteAccount />
            </ProtectedRoute>
          } />
          <Route path="/rsa-plans" element={<RSAPlans />} />
          <Route path="/admin/notifications" element={<AdminNotificationPanel />} />
        </Routes>

        {/* Floating Chatbot Popup (RAG-powered) */}
        <ChatbotPopup />
      </div>
    </Router>
  );
}

export default App;