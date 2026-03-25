import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import EVChampLogo from '../assets/EVChampLogo.png';
import { useUser, SignInButton, SignOutButton } from '@clerk/clerk-react';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isBuyPlansOpen, setIsBuyPlansOpen] = useState(false);
  const buyPlansRef = useRef<HTMLDivElement>(null);

  // Close Buy Plans dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (buyPlansRef.current && !buyPlansRef.current.contains(event.target as Node)) {
        setIsBuyPlansOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
          {/* Buy Plans Dropdown */}
          <div className="relative" ref={buyPlansRef}>
            <button
              onClick={() => setIsBuyPlansOpen(!isBuyPlansOpen)}
              className="flex items-center space-x-1 cta-gradient text-white font-semibold px-4 py-2 rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all bg-gradient-to-r from-green-500 to-green-700 text-sm"
            >
              <span>Buy Plans</span>
              <svg className={`w-4 h-4 transition-transform ${isBuyPlansOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
            </button>
            {isBuyPlansOpen && (
              <div className="absolute left-0 mt-2 w-44 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50">
                <button onClick={() => { navigate('/buy-plans'); setIsBuyPlansOpen(false); }} className="w-full text-left px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-green-50 hover:text-green-700 transition-colors">
                  IoT Plans
                </button>
                <button onClick={() => { navigate('/rsa-plans'); setIsBuyPlansOpen(false); }} className="w-full text-left px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-green-50 hover:text-green-700 transition-colors">
                  RSA Plans
                </button>
              </div>
            )}
          </div>
          <button onClick={() => navigate('/franchise')} className="cta-gradient text-white font-semibold px-4 py-2 rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all bg-gradient-to-r from-yellow-400 to-yellow-600 text-sm">EV Charging</button>
          <button onClick={() => navigate('/zipbattery')} className="cta-gradient text-white font-semibold px-4 py-2 rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all bg-gradient-to-r from-orange-400 to-red-600 text-sm">ZipBattery</button>
          
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
                <button onClick={() => { navigate('/user'); setIsDropdownOpen(false); }} className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                  <svg className="w-4 h-4 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                  Profile Settings
                </button>
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
          <div className="px-4 py-3 flex flex-col space-y-3">
            {/* Quick Actions - Horizontal Button Row */}
            <div className="flex gap-2 flex-wrap">
              <div className="relative flex-1 min-w-max" ref={buyPlansRef}>
                <button
                  type="button"
                  onClick={(e) => { e.preventDefault(); setIsBuyPlansOpen(!isBuyPlansOpen); }}
                  className="w-full bg-gradient-to-r from-green-500 to-green-700 text-white font-semibold px-4 py-2 rounded-md shadow-sm text-xs flex items-center justify-center gap-1 cursor-pointer hover:shadow-md"
                >
                  <span>Buy Plans</span>
                  <svg className={`w-3 h-3 transition-transform ${isBuyPlansOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </button>
                {isBuyPlansOpen && (
                  <div className="absolute top-full left-0 mt-1 w-40 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50">
                    <button type="button" onClick={(e) => { e.preventDefault(); navigate('/buy-plans'); setIsBuyPlansOpen(false); setIsMobileMenuOpen(false); }} className="block w-full text-left px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-green-50 cursor-pointer">
                      IoT Plans
                    </button>
                    <button type="button" onClick={(e) => { e.preventDefault(); navigate('/rsa-plans'); setIsBuyPlansOpen(false); setIsMobileMenuOpen(false); }} className="block w-full text-left px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-green-50 cursor-pointer">
                      RSA Plans
                    </button>
                  </div>
                )}
              </div>
              <button type="button" onClick={() => { navigate('/franchise'); setIsMobileMenuOpen(false); }} className="flex-1 bg-gradient-to-r from-yellow-400 to-yellow-600 text-white font-semibold px-3 py-2 rounded-md shadow-sm text-xs cursor-pointer hover:shadow-md">EV Charging</button>
              <button type="button" onClick={() => { navigate('/zipbattery'); setIsMobileMenuOpen(false); }} className="flex-1 bg-gradient-to-r from-orange-400 to-red-600 text-white font-semibold px-3 py-2 rounded-md shadow-sm text-xs cursor-pointer hover:shadow-md">ZipBattery</button>
            </div>
            
            {/* Navigation Links */}
            <div className="border-t pt-3 space-y-2">
              <button type="button" onClick={() => { scrollToSection('features'); setIsMobileMenuOpen(false); }} className="text-gray-700 hover:text-green-600 transition-colors cursor-pointer py-2 w-full text-left text-sm font-medium">Features</button>
              <button type="button" onClick={() => { scrollToSection('hero'); setIsMobileMenuOpen(false); }} className="text-gray-700 hover:text-green-600 transition-colors cursor-pointer py-2 w-full text-left text-sm font-medium">AI for EV</button>
              <button type="button" onClick={() => { scrollToSection('testimonials'); setIsMobileMenuOpen(false); }} className="text-gray-700 hover:text-green-600 transition-colors cursor-pointer py-2 w-full text-left text-sm font-medium">Testimonials</button>
              <button type="button" onClick={() => { scrollToSection('franchise-section'); setIsMobileMenuOpen(false); }} className="text-gray-700 hover:text-green-600 transition-colors cursor-pointer py-2 w-full text-left text-sm font-medium">Explore</button>
            </div>
            
            {/* Account Section */}
            <div className="border-t pt-3 space-y-2">
              {isSignedIn ? (
                <>
                  <div className="px-2 py-1">
                    <p className="text-sm font-semibold text-gray-900">{user?.firstName} {user?.lastName}</p>
                    <p className="text-xs text-gray-500 truncate">{user?.primaryEmailAddress?.emailAddress}</p>
                  </div>
                  <button type="button" onClick={() => { navigate('/user'); setIsMobileMenuOpen(false); }} className="text-gray-700 font-medium py-2 w-full text-left text-sm hover:bg-gray-50 px-2 rounded cursor-pointer">Profile Settings</button>
                  <SignOutButton>
                    <button className="text-red-600 font-medium py-2 w-full text-left text-sm hover:bg-red-50 px-2 rounded cursor-pointer" onClick={() => setIsMobileMenuOpen(false)}>Sign Out</button>
                  </SignOutButton>
                </>
              ) : (
                <SignInButton mode="modal">
                  <button className="w-full text-center bg-gradient-to-r from-green-500 to-green-700 text-white font-semibold px-4 py-2 rounded-md shadow-sm text-sm cursor-pointer" onClick={() => setIsMobileMenuOpen(false)}>Sign In</button>
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