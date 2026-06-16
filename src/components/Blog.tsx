import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Footer from '../Footer';

interface ArticleSection {
  heading: string;
  paragraphs?: string[];
  bullets?: string[];
  subSections?: {
    title: string;
    paragraphs?: string[];
    bullets?: string[];
  }[];
}

const articleSections: ArticleSection[] = [
  
  {
    heading: 'Explore EV Champ Services',
    subSections: [
      {
        title: '1. Find EV Service Centres',
        paragraphs: [
          'One of the most valuable features of EV Champ is its nationwide network of verified EV service centers. Whether you own an electric car, scooter, or commercial EV, EV Champ helps you quickly locate trusted EV workshops near you and connect with qualified technicians and repair centers across the country.',
          'Through EV Champ, you can easily access comprehensive battery diagnostics support and get professional EV repairs from authorized service providers. Our pan-India service network ensures that timely maintenance improves vehicle performance, extends battery life, and reduces unexpected breakdowns. Every service center in our network is verified and authorized, giving you peace of mind when servicing your electric vehicle.',
        ],
      },
      {
        title: '2. Zeflash – AI-Powered Battery Diagnostics',
        paragraphs: [
          'Battery health is the most critical component of any electric vehicle. EV Champ offers Zeflash, an advanced AI-powered battery diagnostic solution that provides rapid battery diagnostics and AI-driven analysis in just minutes.',
          'Zeflash evaluates crucial metrics like State of Health (SoH) and State of Charge (SoC), while also analyzing charging performance insights and overall battery condition. The platform generates comprehensive health reports that help identify battery issues before they become major problems. This proactive approach saves money and improves vehicle reliability significantly.',
          'For fleet managers, Zeflash enables comprehensive fleet-wide battery performance monitoring and alerts across multiple vehicles. By identifying vehicles at risk of battery failure early, fleet operators can schedule preventive maintenance and reduce downtime substantially. Individual EV owners receive detailed health reports with predictive maintenance recommendations to extend battery lifespan, improve range, and maximize their vehicle\'s resale value.',
        ],
      },
      {
        title: '3. Smart EV Telematics & Fleet Plans',
        paragraphs: [
          'Managing electric vehicle fleets requires real-time data and actionable insights. EV Champ\'s Smart EV Telematics solution provides a powerful system for fleet operators to monitor and manage vehicles remotely.',
          'The platform offers comprehensive live GPS tracking and a real-time fleet monitoring dashboard that provides complete visibility across all vehicles. Fleet managers can access detailed driver behavior analytics and vehicle performance monitoring to identify inefficiencies and safety concerns. Advanced energy consumption reports help optimize routes and reduce operational costs.',
          'Route optimization algorithms help minimize fuel consumption and maximize efficiency, while real-time alerts notify managers of any issues instantly. This makes EV Champ one of the most comprehensive EV fleet management platforms in India.',
          'For commercial operators, the platform delivers significant operational benefits. Fleet managers can improve operational efficiency by tracking every aspect of vehicle performance, reduce maintenance costs through predictive analytics and proactive servicing, increase vehicle uptime by identifying issues before breakdowns occur, enhance driver safety with real-time monitoring and behavior insights, and monitor vehicle health remotely to prevent costly failures.',
        ],
      },
      {
        title: '4. RSA Plans – 24×7 Roadside Assistance',
        paragraphs: [
          'Breakdowns can happen anytime, even with electric vehicles. EV Champ offers comprehensive Roadside Assistance plans to keep drivers protected wherever they travel. Our services include swift vehicle towing support, battery emergency assistance and diagnostics, flat tyre support and replacement services, emergency response capabilities, and on-road technical guidance with remote troubleshooting.',
          'Roadside support is especially valuable for users traveling long distances or operating commercial fleets. EV Champ\'s Roadside Assistance is available 24/7/365 across major Indian cities, ensuring that help is always just a phone call away. Our plans are designed with flexible coverage options at affordable annual rates, giving you access to EV-trained technicians who understand battery systems, electrical components, and specialized repair procedures unique to electric vehicles.',
          'Whether a vehicle has a flat tyre, battery drain, software glitch, or mechanical issue, EV Champ dispatches trained professionals within the promised timeframe. Plans provide peace of mind for daily commuters, long-distance travelers, and commercial fleet operators alike. Our faster response times and EV-specific expertise ensure that your vehicle\'s back on the road as quickly as possible, minimizing downtime and keeping you moving safely.',
        ],
      },
      {
        title: '5. Sell Your EV',
        paragraphs: [
          'Selling an electric vehicle can be challenging due to concerns about battery condition and resale value. EV Champ simplifies the process by providing a trusted platform for EV buyers and sellers to connect confidently. Our platform allows you to reach genuine buyers quickly, with faster listings and better price discovery than traditional channels.',
          'Every vehicle listing on EV Champ includes verified vehicle information, ensuring transparency for both buyers and sellers. The platform offers zero commission opportunities on select vehicle types, making it more economical to sell your EV. Whether you\'re upgrading to a newer model or transitioning your fleet, EV Champ\'s marketplace connects you with serious buyers who understand the value of electric vehicles.',
        ],
      },
      {
        title: '6. ZipBattery – AI-Powered Battery Health Management',
        paragraphs: [
          'ZipBattery is another innovative service offered through EV Champ. It helps EV owners understand battery performance, degradation, and long-term health.',
          'The battery accounts for a significant portion of an EV\'s total cost. Monitoring battery health helps owners avoid expensive replacements, improve performance, increase resale value, and extend battery lifespan.',
          'ZipBattery empowers EV owners with data-driven battery management using patented AI technology. The system continuously monitors battery performance and predicts battery degradation patterns before they become critical issues. This proactive approach improves battery lifespan significantly and extends the overall value of the vehicle.',
          'ZipBattery generates detailed health reports that provide owners with comprehensive understanding of their battery\'s condition, performance metrics, and longevity predictions. By leveraging advanced analytics and machine learning, ZipBattery enables EV owners to make informed decisions about vehicle maintenance and future usage patterns.',
        ],
      },
    ],
  },
  {
    heading: 'Benefits of Using EV Champ',
    paragraphs: [
      'Instead of using multiple apps and service providers, EV Champ centralizes all major EV services under one platform. This gives EV owners, fleet operators, dealers, and service providers a more convenient and intelligent way to manage electric mobility.',
      'The platform provides unmatched convenience by consolidating EV service discovery, battery monitoring, fleet management, and roadside assistance into a single application. Users enjoy real-time monitoring capabilities that provide instant visibility into vehicle performance and health metrics. EV Champ connects you with verified service providers who have been thoroughly checked and authorized, ensuring quality service.',
      'AI-powered diagnostics enable predictive maintenance and early issue detection, while comprehensive fleet management tools help operators track and optimize entire vehicle fleets. The platform includes advanced battery health tracking that monitors performance and predicts maintenance needs. Emergency support available 24/7/365 ensures help is always available when you need it.',
    ],
  },
  {
    heading: 'Why EV Champ is the Future of EV Services in India',
    paragraphs: [
      'India\'s EV market is expected to grow exponentially over the next decade. With increasing vehicle adoption, digital support systems will become essential.',
      'EV Champ is built on foundational technologies that define the future of electric mobility. Artificial Intelligence powers predictive analytics, battery health forecasting, and driver behavior insights across the platform. Predictive Diagnostics identify potential issues before they become problems, significantly reducing vehicle downtime and maintenance costs.',
      'Fleet Intelligence provides operators with comprehensive visibility and control over entire vehicle fleets, enabling data-driven decision-making and optimization. Battery Analytics help owners understand and maintain the most critical component of their vehicles. Integrated Roadside Support ensures drivers are never stranded, and Service Center Discovery connects users with authorized, verified repair facilities.',
      'This comprehensive integrated approach positions EV Champ as a leading EV Service App India solution for modern electric mobility. By combining all these capabilities in one platform, EV Champ delivers unparalleled value for EV owners, fleet operators, and the broader electric vehicle ecosystem.',
    ],
  },
  {
    heading: 'Conclusion',
    paragraphs: [
      'As India’s electric mobility ecosystem continues to evolve, EV owners need smarter solutions to manage vehicle health, maintenance, and performance. EV Champ stands out as a comprehensive EV Service App India that brings together EV service centers, AI-powered battery diagnostics, fleet telematics, roadside assistance, EV resale support, and battery health management on a single platform.',
      'Whether you’re an individual EV owner or a fleet operator, EV Champ delivers the tools, insights, and support needed to maximize vehicle performance, reduce downtime, and enhance the overall EV ownership experience.',
    ],
  },
];

const Blog: React.FC = () => {
  const navigate = useNavigate();

  const handleScroll = (elementId: string) => {
    const element = document.getElementById(elementId);
    if (element) {
      // Calculate the scroll offset to account for page header and ensure proper positioning
      const elementPosition = element.getBoundingClientRect().top + window.scrollY;
      const offset = 100; // Adjust this value based on any sticky headers you have
      
      window.scrollTo({
        top: elementPosition - offset,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className="bg-white min-h-screen">
      <Helmet>
        <title>EV Champ – India's Smart EV Platform | EV Service App India</title>
        <meta
          name="description"
          content="EV Champ is India's smart EV platform offering EV service centres, AI battery diagnostics, fleet telematics, roadside assistance, EV resale support and battery health management."
        />
        <meta
          name="keywords"
          content="EV Champ, EV Service App India, EV fleet management platform, EV service centres, battery diagnostics, Zeflash, ZipBattery, EV roadside assistance, electric vehicle support India"
        />
      </Helmet>

      {/* Hero */}
      <section
        className="relative text-white py-16 sm:py-24 overflow-hidden"
        style={{
          backgroundImage: "url('/blog-hero.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center center',
          backgroundRepeat: 'no-repeat',
          minHeight: '380px',
        }}
      >
        <div className="absolute inset-0 bg-slate-950/65" />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-slate-950/60" />

        <div className="relative container mx-auto px-4 sm:px-6 max-w-5xl text-center">
          <span className="inline-block bg-green-500/20 border border-green-400/40 text-green-200 text-xs font-semibold px-4 py-2 rounded-full mb-5">
            EV Service App India
          </span>

          <h1
            className="text-3xl sm:text-4xl md:text-5xl font-bold mb-5 leading-tight"
            style={{ textShadow: '0 2px 16px rgba(0,0,0,0.7)' }}
          >
            EV Champ – India's Smart EV Platform: Transforming Electric Vehicle Ownership
          </h1>

          <p
            className="text-gray-200 text-base sm:text-lg max-w-3xl mx-auto leading-relaxed"
            style={{ textShadow: '0 1px 8px rgba(0,0,0,0.6)' }}
          >
            India’s electric vehicle industry is growing rapidly, and EV Champ brings AI,
            IoT, diagnostics, service discovery, fleet intelligence and roadside support
            into one smart platform.
          </p>
        </div>
      </section>

      {/* Featured Reads Section */}
      <main className="py-2 sm:py-6"></main>
            <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">Featured Reads</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div
                  onClick={() => handleScroll('service-1')}
                  className="bg-gradient-to-br from-green-50 to-blue-50 border border-green-200 rounded-xl p-5 cursor-pointer hover:shadow-lg transition-all hover:scale-105 transform"
                >
                  <h3 className="font-bold text-gray-900 mb-2">Find EV Service Centres</h3>
                  <p className="text-sm text-gray-600 mb-3">Locate trusted EV workshops nationwide with verified service providers. EV Champ helps you quickly locate trusted EV workshops near you.</p>
                  <span className="text-green-600 font-semibold text-sm">Read full content →</span>
                </div>
                

                <div
                  onClick={() => handleScroll('service-2')}
                  className="bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-5 cursor-pointer hover:shadow-lg transition-all hover:scale-105 transform"
                >
                  <h3 className="font-bold text-gray-900 mb-2">Zeflash – AI-Powered Battery Diagnostics</h3>
                  <p className="text-sm text-gray-600 mb-3">Advanced battery health analysis with rapid diagnostics and predictive maintenance.</p>
                  <span className="text-green-600 font-semibold text-sm">Read full content →</span>
                </div>

                <div
                  onClick={() => handleScroll('service-3')}
                  className="bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-5 cursor-pointer hover:shadow-lg transition-all hover:scale-105 transform"
                >
                  <h3 className="font-bold text-gray-900 mb-2">Smart EV Telematics & Fleet Plans</h3>
                  <p className="text-sm text-gray-600 mb-3">Real-time fleet monitoring, GPS tracking, and comprehensive vehicle performance insights.</p>
                  <span className="text-green-600 font-semibold text-sm">Read full content →</span>
                </div>

                <div
                  onClick={() => handleScroll('service-4')}
                  className="bg-gradient-to-br from-pink-50 to-orange-50 border border-pink-200 rounded-xl p-5 cursor-pointer hover:shadow-lg transition-all hover:scale-105 transform"
                >
                  <h3 className="font-bold text-gray-900 mb-2">RSA Plans – 24×7 Roadside Assistance</h3>
                  <p className="text-sm text-gray-600 mb-3">Round-the-clock emergency support with towing, battery assistance, and technical help.</p>
                  <span className="text-green-600 font-semibold text-sm">Read full content →</span>
                </div>

                <div
                  onClick={() => handleScroll('service-5')}
                  className="bg-gradient-to-br from-orange-50 to-yellow-50 border border-orange-200 rounded-xl p-5 cursor-pointer hover:shadow-lg transition-all hover:scale-105 transform"
                >
                  <h3 className="font-bold text-gray-900 mb-2">Sell Your EV</h3>
                  <p className="text-sm text-gray-600 mb-3">Connect with genuine buyers on a trusted marketplace with transparent pricing and verified listings.</p>
                  <span className="text-green-600 font-semibold text-sm">Read full content →</span>
                </div>

                <div
                  onClick={() => handleScroll('service-6')}
                  className="bg-gradient-to-br from-yellow-50 to-green-50 border border-yellow-200 rounded-xl p-5 cursor-pointer hover:shadow-lg transition-all hover:scale-105 transform"
                >
                  <h3 className="font-bold text-gray-900 mb-2">ZipBattery – AI-Powered Battery Health Management</h3>
                  <p className="text-sm text-gray-600 mb-3">Monitor battery performance, predict degradation, and extend vehicle lifespan with AI insights.</p>
                  <span className="text-green-600 font-semibold text-sm">Read full content →</span>
                </div>
              </div>
            </div>

      {/* Main Article */}
      <main className="py-10 sm:py-14">
        <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
          <article className="bg-white">
            <div className="mb-8 border-b border-gray-100 pb-8">
              <div className="flex flex-wrap items-center gap-3 mb-5">
                <span className="bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full">
                  EV Ecosystem
                </span>
                <span className="text-xs text-gray-400">· 2 min read</span>
                <span className="text-xs text-gray-400">· EVChamp Team</span>
              </div>

              <p className="text-gray-700 text-base sm:text-lg leading-relaxed mb-4">
                India&apos;s electric vehicle industry is growing rapidly, and with this growth
                comes the need for reliable, intelligent, and accessible EV support services.
                Whether you&apos;re an EV owner, fleet operator, battery manufacturer, dealer, or
                service provider, managing electric vehicles efficiently requires real-time
                monitoring, diagnostics, maintenance, and support.
              </p>

              <p className="text-gray-700 text-base sm:text-lg leading-relaxed">
                This is where <strong>EV Champ – India&apos;s Smart EV Platform</strong> comes
                into the picture. EV Champ is India&apos;s leading AI &amp; IoT-driven EV fleet
                management platform, designed to simplify EV ownership by bringing multiple
                services under one platform. From locating trusted EV service centers to
                monitoring battery health, enabling smart fleet tracking, predictive maintenance,
                real-time diagnostics, and managing fleets efficiently, EV Champ provides
                everything needed to keep electric vehicles running smoothly.
              </p>
            </div>

            

            {articleSections.map((section, index) => (
              <section key={index} className="mb-10">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
                  {section.heading}
                </h2>

                {section.paragraphs?.map((paragraph, pIndex) => (
                  <p key={pIndex} className="text-gray-700 leading-relaxed mb-4">
                    {paragraph}
                  </p>
                ))}

                {section.bullets && (
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
                    {section.bullets.map((item, bIndex) => (
                      <li
                        key={bIndex}
                        className="flex items-start gap-2 bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm text-gray-700"
                      >
                        <span className="text-green-600 font-bold">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {section.subSections?.map((sub, subIndex) => (
                  <div
                    id={`service-${subIndex + 1}`}
                    key={subIndex}
                    className="mt-6 bg-white border border-gray-100 rounded-2xl p-5 sm:p-6 shadow-sm"
                  >
                    <h3 className="text-xl font-bold text-gray-900 mb-3">
                      {sub.title}
                    </h3>

                    {sub.paragraphs?.map((paragraph, pIndex) => (
                      <p key={pIndex} className="text-gray-700 leading-relaxed mb-3">
                        {paragraph}
                      </p>
                    ))}

                    {sub.bullets && (
                      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-4">
                        {sub.bullets.map((item, bIndex) => (
                          <li
                            key={bIndex}
                            className="flex items-start gap-2 bg-green-50 border border-green-100 rounded-lg px-3 py-2 text-sm text-gray-700"
                          >
                            <span className="text-green-600 font-bold">✓</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </section>
            ))}
          </article>
        </div>
      </main>

      {/* CTA */}
      <section className="bg-gradient-to-br from-gray-950 to-slate-900 text-white py-14">
        <div className="container mx-auto px-4 sm:px-6 max-w-3xl text-center">
          <span className="text-3xl mb-4 block">⚡</span>
          <h2 className="text-2xl sm:text-3xl font-bold mb-3">
            Ready to Experience Smarter EV Ownership?
          </h2>
          <p className="text-gray-400 text-sm sm:text-base mb-6">
            Connect with EV Champ to explore EV service centres, battery diagnostics,
            fleet management, RSA plans, and smart EV support.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => navigate('/contact')}
              className="bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-3 rounded-lg text-sm transition-all"
            >
              Contact EVChamp
            </button>

            <button
              onClick={() => navigate('/service-centres')}
              className="bg-white/10 hover:bg-white/15 border border-white/20 text-white font-semibold px-6 py-3 rounded-lg text-sm transition-all"
            >
              Find EV Service Centres
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Blog;