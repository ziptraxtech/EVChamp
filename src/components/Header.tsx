import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import EVChampLogo from '../assets/EVChampLogo.png';
import { useUser, SignInButton, SignOutButton } from '@clerk/clerk-react';

const Header: React.FC = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isIotDropdownOpen, setIsIotDropdownOpen] = useState(false);

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
      <button onClick={() => scrollToSection('features')} className="text-gray-600 hover:text-green-600 transition-colors cursor-pointer py-2 w-full text-left whitespace-nowrap">Features</button>
      <button onClick={() => scrollToSection('hero')} className="text-gray-600 hover:text-green-600 transition-colors cursor-pointer py-2 w-full text-left whitespace-nowrap">AI for EV</button>
      <button onClick={() => scrollToSection('testimonials')} className="text-gray-600 hover:text-green-600 transition-colors cursor-pointer py-2 w-full text-left whitespace-nowrap">Testimonials</button>
      <button onClick={() => scrollToSection('franchise-section')} className="text-gray-600 hover:text-green-600 transition-colors cursor-pointer py-2 w-full text-left whitespace-nowrap">Explore</button>
    </>
  );

  return (
    <header className="bg-ev-gradient backdrop-blur-lg sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 py-3 sm:py-4 flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2 cursor-pointer">
          <img src={EVChampLogo} alt="EV Champ Logo" className="h-7 w-7 sm:h-8 sm:w-8" />
          <span className="text-xl sm:text-2xl font-bold font-serif text-blue-900">EV CHAMP</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center space-x-6">
          {navLinks}
        </nav>

        {/* Desktop CTAs and Account */}
        <div className="hidden lg:flex items-center space-x-3">
          {/* IOT Plans Dropdown */}
          <div className="relative group">
            <button
              className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-semibold px-4 py-2 rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all text-sm flex items-center"
              type="button"
              aria-haspopup="true"
              aria-expanded={isIotDropdownOpen}
              tabIndex={0}
              onClick={() => setIsIotDropdownOpen((open) => !open)}
              onBlur={() => setTimeout(() => setIsIotDropdownOpen(false), 150)}
            >
              EV Plans
              <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
            </button>
            {isIotDropdownOpen && (
              <div className="absolute left-0 mt-2 w-40 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                <Link to="/rent-ev" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Rent EV</Link>
                <Link to="/buy-used-ev" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Buy Used EV's</Link>
              </div>
            )}
          </div>
          <a id="buy-plans-btn" href="/buy-plans" className="cta-gradient text-white font-semibold px-4 py-2 rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all bg-gradient-to-r from-green-500 to-green-700 text-sm">Buy Plans</a>
          <a id="franchise-btn" href="/franchise" className="cta-gradient text-white font-semibold px-4 py-2 rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all bg-gradient-to-r from-yellow-400 to-yellow-600 text-sm">Franchise</a>
          {/* Account Management Button */}
          <div className="relative">
            {isSignedIn ? (
              <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm text-gray-700 px-3 py-2 rounded-lg hover:bg-white/30 transition-all duration-200 shadow-lg">
                <div className="w-7 h-7 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center text-white font-semibold text-xs">{user?.firstName?.charAt(0) || user?.username?.charAt(0) || 'U'}</div>
                <span className="font-semibold text-sm">{user?.firstName || user?.username || 'User'}</span>
                <svg className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
              </button>
            ) : (
              <SignInButton mode="modal">
                <button className="flex items-center space-x-2 bg-gradient-to-r from-green-500 to-green-700 text-white px-3 py-2 rounded-lg hover:from-green-600 hover:to-green-800 transition-all duration-200 shadow-lg text-sm">
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

        {/* Mobile Menu Button - Three Dots */}
        <div className="lg:hidden flex items-center space-x-2">
          {/* Mobile User Icon */}
          {isSignedIn && (
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center text-white font-semibold text-xs shadow-md">
              {user?.firstName?.charAt(0) || user?.username?.charAt(0) || 'U'}
            </div>
          )}
          
          {/* Kebab Menu Button */}
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="bg-gradient-to-r from-blue-500 to-blue-600 text-white focus:outline-none p-2 rounded-lg shadow-md hover:shadow-lg hover:from-blue-600 hover:to-blue-700 transition-all">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              {isMobileMenuOpen ? (
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              ) : (
                <>
                  <circle cx="12" cy="5" r="1.5" />
                  <circle cx="12" cy="12" r="1.5" />
                  <circle cx="12" cy="19" r="1.5" />
                </>
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu Panel - Compact Design */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-200 shadow-lg">
          <div className="px-4 py-3 flex flex-col space-y-1">
            {/* Quick Actions - Compact Grid */}
            <div className="mb-2">
              {/* IOT Plans Dropdown for Mobile */}
              <div className="relative group w-full mb-2">
                <button className="w-full text-center bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-semibold px-3 py-2 rounded-md shadow-sm text-xs flex items-center justify-center">
                  IOT Plans
                  <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </button>
                <div className="absolute left-0 mt-1 w-full bg-white rounded-lg shadow-lg border border-gray-200 py-2 opacity-0 group-focus-within:opacity-100 group-hover:opacity-100 pointer-events-none group-focus-within:pointer-events-auto group-hover:pointer-events-auto transition-opacity z-50">
                  <a href="/rent-ev" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Rent EV</a>
                  <a href="/buy-used-ev" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Buy Used EV's</a>
                </div>
              </div>
              <a href="/buy-plans" className="w-full text-center bg-gradient-to-r from-green-500 to-green-700 text-white font-semibold px-3 py-2 rounded-md shadow-sm text-xs block mb-2" onClick={() => setIsMobileMenuOpen(false)}>Buy Plans</a>
              <a href="/franchise" className="w-full text-center bg-gradient-to-r from-yellow-400 to-yellow-600 text-white font-semibold px-3 py-2 rounded-md shadow-sm text-xs block" onClick={() => setIsMobileMenuOpen(false)}>Franchise</a>
            </div>
            
            {/* Navigation Links */}
            <div className="border-t pt-2 space-y-1">
              <button onClick={() => scrollToSection('features')} className="text-gray-600 hover:text-green-600 transition-colors cursor-pointer py-2 w-full text-left text-sm">Features</button>
              <button onClick={() => scrollToSection('hero')} className="text-gray-600 hover:text-green-600 transition-colors cursor-pointer py-2 w-full text-left text-sm">AI for EV</button>
              <button onClick={() => scrollToSection('testimonials')} className="text-gray-600 hover:text-green-600 transition-colors cursor-pointer py-2 w-full text-left text-sm">Testimonials</button>
              <button onClick={() => scrollToSection('franchise-section')} className="text-gray-600 hover:text-green-600 transition-colors cursor-pointer py-2 w-full text-left text-sm">Explore</button>
            </div>
            
            {/* Account Section */}
            <div className="border-t pt-2 space-y-1">
              {isSignedIn ? (
                <>
                  <div className="px-2 py-1">
                    <p className="text-sm font-semibold text-gray-900">{user?.firstName} {user?.lastName}</p>
                    <p className="text-xs text-gray-500 truncate">{user?.primaryEmailAddress?.emailAddress}</p>
                  </div>
                  <a href="/user" className="text-gray-700 font-medium py-2 w-full text-left block text-sm hover:bg-gray-50 px-2 rounded" onClick={() => setIsMobileMenuOpen(false)}>Profile Settings</a>
                  <SignOutButton>
                    <button className="text-red-600 font-medium py-2 w-full text-left text-sm hover:bg-red-50 px-2 rounded" onClick={() => setIsMobileMenuOpen(false)}>Sign Out</button>
                  </SignOutButton>
                </>
              ) : (
                <SignInButton mode="modal">
                  <button className="w-full text-center bg-gradient-to-r from-green-500 to-green-700 text-white font-semibold px-4 py-2 rounded-md shadow-sm text-sm" onClick={() => setIsMobileMenuOpen(false)}>Sign In</button>
                </SignInButton>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;