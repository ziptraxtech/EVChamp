import React from 'react';

const features = [
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01" /></svg>
    ),
    title: 'Plug & Play Compatibility',
    desc: 'Easy installation for OBD and non-OBD vehicles. Get started with your EV fleet instantly.'
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V4a2 2 0 10-4 0v1.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
    ),
    title: '4G Connectivity & GNSS',
    desc: 'Reliable 4G with 2G fallback and GNSS for accurate real-time tracking and analytics.'
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2a4 4 0 018 0v2m-4-4v-4a4 4 0 10-8 0v4m4 4v2a4 4 0 01-8 0v-2m8 0a4 4 0 018 0v2" /></svg>
    ),
    title: 'Real-Time Battery & Energy Analytics',
    desc: 'Monitor battery status, energy usage, and get actionable insights for every vehicle.'
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
    ),
    title: 'Immobilizer, Geofencing & Theft Alerts',
    desc: 'Advanced security with immobilizer, geofencing, and instant theft alerts for your fleet.'
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a2 2 0 01-2-2V4a2 2 0 012-2h8a2 2 0 012 2v4z" /></svg>
    ),
    title: 'Cloud Synchronization',
    desc: 'Seamless data sync between IoT hardware and the EVChamp dashboard for real-time control.'
  },
];

const Features: React.FC = () => (
  <section id="features" className="py-20 bg-transparent">
    <div className="container mx-auto px-6">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Why Choose EVChamp IoT Hardware?</h2>
        <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">Our advanced IoT devices are engineered for precision, security, and reliability—empowering your EV fleet with the latest in connectivity, analytics, and automation.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((f) => (
          <div key={f.title} className="bg-gray-50 p-8 rounded-xl shadow-sm hover:shadow-lg transition-shadow border border-gray-200">
            <div className="bg-green-100 text-green-600 rounded-full h-12 w-12 flex items-center justify-center mb-4">
              {f.icon}
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">{f.title}</h3>
            <p className="text-gray-600">{f.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default Features; 