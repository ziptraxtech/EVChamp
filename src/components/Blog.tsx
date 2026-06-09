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
    heading: 'Why EV Service Apps Are Important in India',
    paragraphs: [
      'As electric vehicle adoption increases across India, EV users face several challenges. Traditional vehicle service models are often not equipped to handle the unique requirements of electric vehicles. EV owners need specialized diagnostics, predictive maintenance, and digital support.',
      'An advanced EV Service App India like EV Champ bridges this gap by providing centralized access to all EV-related services through a single platform.',
    ],
    bullets: [
      'Finding trusted EV repair centers',
      'Monitoring battery health',
      'Managing fleet operations',
      'Accessing roadside assistance',
      'Selling used EVs',
      'Understanding vehicle performance',
      'Preventing battery failures',
    ],
  },
  {
    heading: 'Explore EV Champ Services',
    subSections: [
      {
        title: '1. Find EV Service Centres',
        paragraphs: [
          'One of the most valuable features of EV Champ is its nationwide network of verified EV service centers. Whether you own an electric car, scooter, or commercial EV, EV Champ helps you quickly connect with qualified technicians and repair centers.',
          'Timely maintenance improves vehicle performance, extends battery life, and reduces unexpected breakdowns.',
        ],
        bullets: [
          'Locate trusted EV workshops near you',
          'Access battery diagnostics support',
          'Get professional EV repairs',
          'Find authorized service providers',
          'Pan-India service network',
        ],
      },
      {
        title: '2. Zeflash – AI-Powered Battery Diagnostics',
        paragraphs: [
          'Battery health is the most critical component of any electric vehicle. EV Champ offers Zeflash, an advanced AI-powered battery diagnostic solution.',
          'Zeflash helps identify battery issues before they become major problems. This proactive approach saves money and improves vehicle reliability.',
          'Fleet managers can monitor battery performance across multiple vehicles and reduce downtime significantly.',
        ],
        bullets: [
          'Rapid battery diagnostics',
          'AI-driven analysis',
          'SoP and SoF evaluation',
          'Health reports within minutes',
          'Charging performance insights',
          'Predictive maintenance recommendations',
        ],
      },
      {
        title: '3. Smart EV Telematics & Fleet Plans',
        paragraphs: [
          'Managing electric vehicle fleets requires real-time data and actionable insights. EV Champ’s Smart EV Telematics solution provides a powerful system for fleet operators to monitor and manage vehicles remotely.',
          'This makes EV Champ one of the most comprehensive EV fleet management platforms in India.',
        ],
        bullets: [
          'Live GPS tracking',
          'Fleet monitoring dashboard',
          'Driver behavior analytics',
          'Vehicle performance monitoring',
          'Energy consumption reports',
          'Route optimization',
          'Real-time alerts',
          'Improve operational efficiency',
          'Reduce maintenance costs',
          'Increase vehicle uptime',
          'Enhance driver safety',
          'Monitor vehicle health remotely',
        ],
      },
      {
        title: '4. RSA Plans – 24×7 Roadside Assistance',
        paragraphs: [
          'Breakdowns can happen anytime, even with electric vehicles. EV Champ offers comprehensive Roadside Assistance plans to keep drivers protected wherever they travel.',
          'Roadside support is especially valuable for users traveling long distances or operating commercial fleets.',
        ],
        bullets: [
          'Vehicle towing support',
          'Battery assistance',
          'Flat tyre support',
          'Emergency response',
          'On-road technical help',
          '24×7 availability',
          'Affordable annual plans',
          'Faster response times',
          'Peace of mind for EV owners',
        ],
      },
      {
        title: '5. Sell Your EV',
        paragraphs: [
          'Selling an electric vehicle can be challenging due to concerns about battery condition and resale value. EV Champ simplifies the process by providing a trusted platform for EV buyers and sellers.',
        ],
        bullets: [
          'Reach genuine buyers',
          'Faster listings',
          'Better price discovery',
          'Verified vehicle information',
          'Zero commission opportunities',
        ],
      },
      {
        title: '6. ZipBattery – AI-Powered Battery Health Management',
        paragraphs: [
          'ZipBattery is another innovative service offered through EV Champ. It helps EV owners understand battery performance, degradation, and long-term health.',
          'The battery accounts for a significant portion of an EV’s total cost. Monitoring battery health helps owners avoid expensive replacements, improve performance, increase resale value, and extend battery lifespan.',
          'ZipBattery empowers EV owners with data-driven battery management.',
        ],
        bullets: [
          'Monitors battery performance',
          'Predicts battery degradation',
          'Improves battery lifespan',
          'Generates detailed health reports',
          'Uses patented AI technology',
        ],
      },
    ],
  },
  {
    heading: 'Benefits of Using EV Champ',
    paragraphs: [
      'Instead of using multiple apps and service providers, EV Champ centralizes all major EV services under one platform. This gives EV owners, fleet operators, dealers, and service providers a more convenient and intelligent way to manage electric mobility.',
    ],
    bullets: [
      'Convenience',
      'Real-time monitoring',
      'Verified service providers',
      'AI-powered diagnostics',
      'Fleet management tools',
      'Battery health tracking',
      'Emergency support',
    ],
  },
  {
    heading: 'Why EV Champ is the Future of EV Services in India',
    paragraphs: [
      'India’s EV market is expected to grow exponentially over the next decade. With increasing vehicle adoption, digital support systems will become essential.',
      'EV Champ combines artificial intelligence, predictive diagnostics, fleet intelligence, battery analytics, roadside support, and service center discovery. This integrated approach positions EV Champ as a leading EV Service App India solution for modern electric mobility.',
    ],
    bullets: [
      'Artificial Intelligence',
      'Predictive Diagnostics',
      'Fleet Intelligence',
      'Battery Analytics',
      'Roadside Support',
      'Service Center Discovery',
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

      {/* Main Article */}
      <main className="py-10 sm:py-14">
        <div className="container mx-auto px-4 sm:px-6 max-w-4xl">
          <article className="bg-white">
            <div className="mb-8 border-b border-gray-100 pb-8">
              <div className="flex flex-wrap items-center gap-3 mb-5">
                <span className="bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full">
                  EV Ecosystem
                </span>
                <span className="text-xs text-gray-400">May 20, 2026</span>
                <span className="text-xs text-gray-400">· 8 min read</span>
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