import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import EVChampLogo from '../assets/EVChampLogo.png';
import { useUser, SignInButton, SignOutButton } from '@clerk/clerk-react';

const Header: React.FC = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
    setIsMobileMenuOpen(false); // Close mobile menu after clicking a link
  };

  const { isSignedIn, user } = useUser();

  const navLinks = (
    <>
      <button onClick={() => scrollToSection('features')} className="text-gray-600 hover:text-green-600 transition-colors cursor-pointer py-2 w-full text-left">Features</button>
      <button onClick={() => scrollToSection('how-it-works')} className="text-gray-600 hover:text-green-600 transition-colors cursor-pointer py-2 w-full text-left">How It Works</button>
      <button onClick={() => scrollToSection('testimonials')} className="text-gray-600 hover:text-green-600 transition-colors cursor-pointer py-2 w-full text-left">Testimonials</button>
      <button onClick={() => scrollToSection('franchise-section')} className="text-gray-600 hover:text-green-600 transition-colors cursor-pointer py-2 w-full text-left">Franchise</button>
    </>
  );

  return (
    <header className="bg-ev-gradient backdrop-blur-lg sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2 cursor-pointer">
          <img src={EVChampLogo} alt="EV Champ Logo" className="h-8 w-8" />
          <span className="text-2xl font-bold font-serif text-blue-900">EV CHAMP</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          {navLinks}
        </nav>

        {/* Desktop CTAs and Account */}
        <div className="hidden md:flex items-center space-x-4">
          <a id="rent-ev-btn" href="/rent-ev" className="bg-gradient-to-r from-blue-500 to-blue-700 text-white font-semibold px-6 py-2 rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all">Rent EV</a>
          <a id="buy-plans-btn" href="/buy-plans" className="cta-gradient text-white font-semibold px-6 py-2 rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all bg-gradient-to-r from-green-500 to-green-700">Buy Plans</a>
          <a id="buy-used-ev-btn" href="/buy-used-ev" className="cta-gradient text-white font-semibold px-6 py-2 rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all bg-gradient-to-r from-yellow-400 to-yellow-600">Buy Used EV's</a>
          
          {/* Account Management Button */}
          <div className="relative">
            {isSignedIn ? (
              <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm text-gray-700 px-4 py-2 rounded-lg hover:bg-white/30 transition-all duration-200 shadow-lg">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">{user?.firstName?.charAt(0) || user?.username?.charAt(0) || 'U'}</div>
                <span className="font-semibold text-sm">{user?.firstName || user?.username || 'User'}</span>
                <svg className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
              </button>
            ) : (
              <SignInButton mode="modal">
                <button className="flex items-center space-x-2 bg-gradient-to-r from-green-500 to-green-700 text-white px-4 py-2 rounded-lg hover:from-green-600 hover:to-green-800 transition-all duration-200 shadow-lg">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                  <span className="font-semibold">Sign In</span>
                </button>
              </SignInButton>
            )}
            {isDropdownOpen && isSignedIn && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50">
                <div className="px-4 py-2 border-b border-gray-100">
                  <p className="text-sm font-semibold text-gray-900">{user?.firstName} {user?.lastName}</p>
                  <p className="text-xs text-gray-500">{user?.primaryEmailAddress?.emailAddress}</p>
                </div>
                <a href="/user" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors" onClick={() => setIsDropdownOpen(false)}>
                  <svg className="w-4 h-4 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                  Profile Settings
                </a>
                <SignOutButton>
                  <button className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors" onClick={() => setIsDropdownOpen(false)}>
                    <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                    Sign Out
                  </button>
                </SignOutButton>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-gray-700 focus:outline-none">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="px-6 pt-2 pb-4 flex flex-col space-y-2">
            {navLinks}
            <div className="border-t my-2"></div>
            <a href="/rent-ev" className="block text-center bg-gradient-to-r from-blue-500 to-blue-700 text-white font-semibold px-6 py-2 rounded-lg shadow-md">Rent EV</a>
            <a href="/buy-plans" className="block text-center bg-gradient-to-r from-green-500 to-green-700 text-white font-semibold px-6 py-2 rounded-lg shadow-md">Buy Plans</a>
            <a href="/buy-used-ev" className="block text-center bg-gradient-to-r from-yellow-400 to-yellow-600 text-white font-semibold px-6 py-2 rounded-lg shadow-md">Buy Used EV's</a>
            <div className="border-t my-2"></div>
            {isSignedIn ? (
              <>
                <a href="/user" className="text-gray-700 font-semibold py-2 w-full text-left" onClick={() => setIsMobileMenuOpen(false)}>Profile Settings</a>
                <SignOutButton>
                  <button className="text-red-600 font-semibold py-2 w-full text-left" onClick={() => setIsMobileMenuOpen(false)}>Sign Out</button>
                </SignOutButton>
              </>
            ) : (
              <SignInButton mode="modal">
                <button className="w-full text-center bg-gradient-to-r from-green-500 to-green-700 text-white font-semibold px-6 py-2 rounded-lg shadow-md">Sign In</button>
              </SignInButton>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;