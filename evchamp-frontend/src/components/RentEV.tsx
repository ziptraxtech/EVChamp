import React, { useEffect, useRef, useState } from 'react';
import { FaCar, FaBatteryFull, FaRoute, FaClock, FaUsers, FaShieldAlt, FaCheckCircle, FaArrowLeft } from 'react-icons/fa';
import { IconType } from 'react-icons';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import razorpayService from '../services/razorpayService';
// Add imports for local images
import nexonImg from '../assets/tata-nexon.jpg';
import mgzsevImg from '../assets/mgzsev.jpg';
import konaImg from '../assets/honda-kona-ev.jpg';
import xuv400Img from '../assets/xuv400.jpg';
import tiagoevImg from '../assets/tiagoev.jpg';
import cometevImg from '../assets/cometev.jpg';
import punchImg from '../assets/punch-ev.jpg';
import citroenImg from '../assets/citroen.jpg';
import e20nxtImg from '../assets/e20-NXT.jpg';

interface EVCard {
  id: number;
  name: string;
  brand: string;
  image: string;
  range: string;
  battery: string;
  seats: number;
  dailyRate: number;
  weeklyRate: number;
  monthlyRate: number;
  features: string[];
  available: boolean;
}

const evCars: EVCard[] = [
  {
    id: 1,
    name: "Nexon EV",
    brand: "Tata",
    image: nexonImg,
    range: "437 km",
    battery: "40.5 kWh",
    seats: 5,
    dailyRate: 2500,
    weeklyRate: 15000,
    monthlyRate: 55000,
    features: ["Fast Charging", "Connected Car Tech", "Safety Features", "Climate Control"],
    available: true
  },
  {
    id: 2,
    name: "ZSEV",
    brand: "MG",
    image: mgzsevImg,
    range: "461 km",
    battery: "50.3 kWh",
    seats: 5,
    dailyRate: 2800,
    weeklyRate: 16800,
    monthlyRate: 62000,
    features: ["i-SMART EV 2.0", "Panoramic Sunroof", "360° Camera", "Wireless Charging"],
    available: true
  },
  {
    id: 3,
    name: "Kona Electric",
    brand: "Hyundai",
    image: konaImg,
    range: "484 km",
    battery: "39.2 kWh",
    seats: 5,
    dailyRate: 3200,
    weeklyRate: 19200,
    monthlyRate: 72000,
    features: ["Bluelink Connected", "SmartSense", "Ventilated Seats", "Wireless Charging"],
    available: true
  },
  {
    id: 4,
    name: "XUV400",
    brand: "Mahindra",
    image: xuv400Img,
    range: "456 km",
    battery: "39.4 kWh",
    seats: 5,
    dailyRate: 2200,
    weeklyRate: 13200,
    monthlyRate: 48000,
    features: ["AdrenoX Connected", "Safety Features", "Climate Control", "Infotainment"],
    available: true
  },
  {
    id: 5,
    name: "Tiago EV",
    brand: "Tata",
    image: tiagoevImg,
    range: "315 km",
    battery: "24 kWh",
    seats: 5,
    dailyRate: 1800,
    weeklyRate: 10800,
    monthlyRate: 40000,
    features: ["Connected Car", "Safety Features", "Climate Control", "Infotainment"],
    available: true
  },
  {
    id: 6,
    name: "Comet EV",
    brand: "Tata",
    image: cometevImg,
    range: "150 km",
    battery: "17.5 kWh",
    seats: 2,
    dailyRate: 1200,
    weeklyRate: 7200,
    monthlyRate: 28000,
    features: ["Compact Design", "Easy Parking", "City Commute", "Low Cost"],
    available: true
  },
  {
    id: 7,
    name: "Punch EV",
    brand: "Tata",
    image: punchImg,
    range: "421 km",
    battery: "35 kWh",
    seats: 5,
    dailyRate: 2000,
    weeklyRate: 12000,
    monthlyRate: 45000,
    features: ["SUV Design", "High Ground Clearance", "Safety Features", "Connected Car"],
    available: true
  },
  {
    id: 8,
    name: "eC3",
    brand: "Citroen",
    image: citroenImg,
    range: "320 km",
    battery: "29.2 kWh",
    seats: 5,
    dailyRate: 1900,
    weeklyRate: 11400,
    monthlyRate: 42000,
    features: ["French Design", "Comfort Features", "Safety Tech", "Connected Services"],
    available: true
  },
  {
    id: 9,
    name: "e20 NXT",
    brand: "Mahindra",
    image: e20nxtImg,
    range: "140 km",
    battery: "15.9 kWh",
    seats: 4,
    dailyRate: 1100,
    weeklyRate: 6600,
    monthlyRate: 25000,
    features: ["Compact SUV", "Easy Driving", "City Friendly", "Low Maintenance"],
    available: true
  }
];

const RentEV: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const [selectedPeriod, setSelectedPeriod] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [selectedCar, setSelectedCar] = useState<EVCard | null>(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [bookingDetails, setBookingDetails] = useState({
    name: '',
    email: '',
    phone: '',
    pickupDate: '',
    returnDate: '',
    pickupLocation: '',
    returnLocation: '',
    licenseNumber: '',
    idProof: ''
  });

  // Ref to scroll to booking form when a car is selected
  const bookingFormRef = useRef<HTMLDivElement | null>(null);

  // When a car is selected and the modal opens, scroll to the booking form
  useEffect(() => {
    if (showBookingModal && selectedCar) {
      requestAnimationFrame(() => {
        bookingFormRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    }
  }, [showBookingModal, selectedCar]);

  const getRate = (car: EVCard) => {
    switch (selectedPeriod) {
      case 'daily':
        return car.dailyRate;
      case 'weekly':
        return car.weeklyRate;
      case 'monthly':
        return car.monthlyRate;
      default:
        return car.dailyRate;
    }
  };

  const handleBookNow = (car: EVCard) => {
    if (!user) {
      alert('Please sign in to rent an EV.');
      return;
    }
    setSelectedCar(car);
    setShowBookingModal(true);
  };

  const handlePayment = async () => {
    if (!selectedCar || !user) {
      alert('Please select a car and sign in to proceed.');
      return;
    }

    setIsProcessing(true);

    try {
      const amount = getRate(selectedCar);
      const periodText = selectedPeriod === 'daily' ? 'Daily' : selectedPeriod === 'weekly' ? 'Weekly' : 'Monthly';
      const description = `${selectedCar.brand} ${selectedCar.name} - ${periodText} Rental`;
      
      await razorpayService.initializePayment(
        amount,
        'EVChamp EV Rental',
        description,
        user.primaryEmailAddress?.emailAddress || undefined,
        user.firstName || user.username || undefined
      );
    } catch (error) {
      console.error('Payment error:', error);
      alert('Payment failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-yellow-50">
      {/* Back Button */}
      <div className="absolute top-24 left-6 z-10">
        <button
          onClick={() => navigate('/')}
          className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-lg hover:bg-white/30 transition-all duration-200 shadow-lg"
        >
          {FaArrowLeft({ className: "text-lg" })}
          <span className="font-semibold">Back to Home</span>
        </button>
      </div>
      
      {/* Hero Section */}
      <section className="pt-20 pb-12 bg-gradient-to-r from-blue-600 to-green-600 text-white">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Rent Electric Vehicles
          </h1>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Experience the future of mobility with our premium EV rental service. 
            Choose from India's finest electric vehicles with flexible rental periods.
          </p>
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <div className="flex items-center space-x-2 bg-white/20 rounded-lg px-4 py-2">
              {FaCar({ className: "text-2xl" })}
              <span>Premium EVs</span>
            </div>
            <div className="flex items-center space-x-2 bg-white/20 rounded-lg px-4 py-2">
              {FaBatteryFull({ className: "text-2xl" })}
              <span>Long Range</span>
            </div>
            <div className="flex items-center space-x-2 bg-white/20 rounded-lg px-4 py-2">
              {FaShieldAlt({ className: "text-2xl" })}
              <span>Fully Insured</span>
            </div>
          </div>
        </div>
      </section>

      {/* Rental Period Selector */}
      <section className="py-8 bg-white shadow-sm">
        <div className="container mx-auto px-6">
          <div className="flex justify-center space-x-4">
            {[
              { key: 'daily', label: 'Daily', icon: FaClock },
              { key: 'weekly', label: 'Weekly', icon: FaRoute },
              { key: 'monthly', label: 'Monthly', icon: FaUsers }
            ].map(({ key, label, icon: Icon }) => {
              const IconComponent = Icon;
              return (
                <button
                  key={key}
                  onClick={() => setSelectedPeriod(key as 'daily' | 'weekly' | 'monthly')}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-semibold transition-all ${
                    selectedPeriod === key
                      ? 'bg-green-600 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {IconComponent({ className: "text-lg" })}
                  <span>{label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* EV Cards Grid */}
      <section className="py-12">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {evCars.map((car) => (
              <div
                key={car.id}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow cursor-pointer"
                onClick={() => handleBookNow(car)}
              >
                <div className="relative">
                  <img 
                    src={car.image} 
                    alt={`${car.brand} ${car.name}`} 
                    className="w-full h-48 object-cover"
                  />
                  {car.available ? (
                    <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      Available
                    </div>
                  ) : (
                    <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      Booked
                    </div>
                  )}
                </div>
                
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{car.brand} {car.name}</h3>
                      <p className="text-gray-600">Electric Vehicle</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-green-600">₹{getRate(car).toLocaleString()}</div>
                      <div className="text-sm text-gray-500">per {selectedPeriod}</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="flex items-center space-x-2">
                      {FaRoute({ className: "text-green-600" })}
                      <span className="text-sm text-gray-600">{car.range} range</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      {FaBatteryFull({ className: "text-green-600" })}
                      <span className="text-sm text-gray-600">{car.battery}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      {FaUsers({ className: "text-green-600" })}
                      <span className="text-sm text-gray-600">{car.seats} seats</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      {FaCar({ className: "text-green-600" })}
                      <span className="text-sm text-gray-600">EV</span>
                    </div>
                  </div>

                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-900 mb-2">Key Features:</h4>
                    <div className="flex flex-wrap gap-2">
                      {car.features.map((feature, index) => (
                        <span key={index} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={(e) => { e.stopPropagation(); handleBookNow(car); }}
                    disabled={!car.available}
                    className={`w-full py-3 px-4 rounded-lg font-semibold transition-all ${
                      car.available
                        ? 'bg-green-600 text-white hover:bg-green-700 transform hover:-translate-y-1'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    {car.available ? 'Book Now' : 'Currently Booked'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Booking Form Section */}
      {showBookingModal && selectedCar && (
        <section id="booking-form" ref={bookingFormRef} className="py-16 bg-white">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-8">Book Your EV</h2>
              
              {/* Selected Car Summary */}
              <div className="bg-gray-50 rounded-xl p-6 mb-8">
                <h3 className="text-xl font-semibold mb-4">Selected Vehicle</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-center space-x-4">
                    <img 
                      src={selectedCar.image} 
                      alt={`${selectedCar.brand} ${selectedCar.name}`} 
                      className="w-24 h-16 object-cover rounded-lg"
                    />
                    <div>
                      <h4 className="font-semibold text-lg">{selectedCar.brand} {selectedCar.name}</h4>
                      <p className="text-gray-600">{selectedCar.range} range • {selectedCar.battery}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-green-600">₹{getRate(selectedCar).toLocaleString()}</div>
                    <div className="text-gray-500">per {selectedPeriod}</div>
                  </div>
                </div>
              </div>

              {/* Booking Form */}
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                    <input
                      type="text"
                      value={bookingDetails.name}
                      onChange={(e) => setBookingDetails({...bookingDetails, name: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                    <input
                      type="email"
                      value={bookingDetails.email}
                      onChange={(e) => setBookingDetails({...bookingDetails, email: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
                    <input
                      type="tel"
                      value={bookingDetails.phone}
                      onChange={(e) => setBookingDetails({...bookingDetails, phone: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">License Number *</label>
                    <input
                      type="text"
                      value={bookingDetails.licenseNumber}
                      onChange={(e) => setBookingDetails({...bookingDetails, licenseNumber: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Pickup Date *</label>
                    <input
                      type="date"
                      value={bookingDetails.pickupDate}
                      onChange={(e) => setBookingDetails({...bookingDetails, pickupDate: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Return Date *</label>
                    <input
                      type="date"
                      value={bookingDetails.returnDate}
                      onChange={(e) => setBookingDetails({...bookingDetails, returnDate: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Pickup Location *</label>
                    <input
                      type="text"
                      value={bookingDetails.pickupLocation}
                      onChange={(e) => setBookingDetails({...bookingDetails, pickupLocation: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Enter pickup address"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Return Location *</label>
                    <input
                      type="text"
                      value={bookingDetails.returnLocation}
                      onChange={(e) => setBookingDetails({...bookingDetails, returnLocation: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Enter return address"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">ID Proof Number (Aadhar/PAN) *</label>
                  <input
                    type="text"
                    value={bookingDetails.idProof}
                    onChange={(e) => setBookingDetails({...bookingDetails, idProof: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Enter Aadhar or PAN number"
                    required
                  />
                </div>

                <div className="flex justify-center pt-8">
                  <button
                    type="button"
                    onClick={() => {
                      // Scroll to payment section
                      document.getElementById('payment-section')?.scrollIntoView({ 
                        behavior: 'smooth',
                        block: 'start'
                      });
                    }}
                    className="bg-green-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-green-700 transform hover:-translate-y-1 transition-all shadow-lg"
                  >
                    Proceed to Payment
                  </button>
                </div>
              </form>
            </div>
          </div>
        </section>
      )}

      {/* Payment Section */}
      {showBookingModal && selectedCar && (
        <section id="payment-section" className="py-16 bg-gray-50">
          <div className="container mx-auto px-6">
            <div className="max-w-2xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-8">Complete Your Booking</h2>
              
              <div className="bg-white rounded-xl p-8 shadow-lg">
                <div className="mb-6">
                  <h3 className="text-xl font-semibold mb-4">Booking Summary</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Vehicle:</span>
                      <span className="font-semibold">{selectedCar.brand} {selectedCar.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Rental Period:</span>
                      <span className="font-semibold capitalize">{selectedPeriod}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Rate:</span>
                      <span className="font-semibold">₹{getRate(selectedCar).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Security Deposit:</span>
                      <span className="font-semibold">₹10,000</span>
                    </div>
                    <hr className="my-4" />
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total Amount:</span>
                      <span className="text-green-600">₹{(getRate(selectedCar) + 10000).toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <button
                    className="w-full bg-gradient-to-r from-green-500 to-blue-500 text-white py-4 rounded-lg font-semibold hover:from-green-600 hover:to-blue-600 transition-all"
                    onClick={handlePayment}
                    disabled={isProcessing}
                  >
                    {isProcessing ? 'Processing...' : 'Place Order'}
                  </button>
                </div>

                <div className="mt-6 text-center">
                  <button
                    onClick={() => setShowBookingModal(false)}
                    className="text-gray-500 hover:text-gray-700 underline"
                  >
                    Cancel Booking
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default RentEV; 