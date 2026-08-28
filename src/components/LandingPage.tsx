import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { PLATFORM_TILES } from './platformTiles';

// New EVChamp landing page — matches the "EVChamp_Landing_page.html" design mockup
// (green/blue gradient brand, Poppins headings, pill nav, service cards, footer).

const GRAD = 'linear-gradient(100deg,#0BA66A 0%,#1E63FF 100%)';

// One-time Zeflash battery diagnostic trial (₹199) — handled by the ZeVault checkout route.
const TRIAL_CHECKOUT = '/checkout?plan=trial&tests=1&months=0&price=199';


const SERVICE_CARDS = [
  { icon: '⚡', tag: 'Live map & navigation', grad: 'linear-gradient(150deg,#F59E0B,#EA580C)', title: 'Charging Stations', desc: 'Locate nearby charging points, check real-time availability, and plan your route with confidence.', cta: 'Find EV chargers near you', route: '/find-ev-chargers' },
  { icon: '🔧', tag: 'Pan-India network', grad: 'linear-gradient(150deg,#7C3AED,#4F46E5)', title: 'Service Centres', desc: 'Access trusted EV repair, diagnostics, battery service and professional support across major cities.', cta: 'Verified workshops near you', route: '/service-centres' },
  { icon: '🔋', tag: 'Visit zeflash.app', grad: 'linear-gradient(150deg,#1E63FF,#0BA66A)', title: 'Zeflash', desc: '20-minute field diagnostics with advanced SoH & SoC analysis and instant health reports during charging.', cta: 'Rapid AI battery diagnostics', route: '/zeflash' },
  { icon: '🏷️', tag: 'Zero commission listing', grad: 'linear-gradient(150deg,#2563EB,#0EA5E9)', title: 'Sell Your EV', desc: 'List your electric vehicle and connect with thousands of genuine buyers instantly with zero commission.', cta: 'Best price & fast verification', route: '/sell-ev' },
  { icon: '🛟', tag: 'Plans from ₹999/yr', grad: 'linear-gradient(150deg,#0BA66A,#0891B2)', title: 'RSA Plans', desc: 'Get towing, battery assistance, tyre support and emergency EV help anywhere, anytime.', cta: '24×7 roadside support', route: '/rsa-plans' },
  { icon: '🔩', tag: 'Patented technology', grad: 'linear-gradient(150deg,#E11D48,#9333EA)', title: 'ZipBattery', desc: 'Extend your EV battery lifespan using our patented AI diagnostics and optimization technology.', cta: 'Learn more about ZipBattery', route: '/evtrulife' },
];

const TESTIMONIALS = [
  { quote: 'The AI-powered app has transformed how I manage my EV. Real-time battery monitoring and predictive maintenance alerts give me complete peace of mind.', name: 'Rohan Sharma', role: 'Tesla Model 3 Owner', initials: 'RS' },
  { quote: "EVChamp's charging network made my cross-city commute effortless. Finding a working charger is never a worry anymore.", name: 'Priya Patel', role: 'Tata Nexon EV Owner', initials: 'PP' },
  { quote: 'Sold my old EV through EVChamp in under a week with zero commission. Genuinely the easiest resale experience I have had.', name: 'Ankit Kumar', role: 'MG ZS EV Owner', initials: 'AK' },
];

const PARTNERS = ['TATA.ev', 'SungEel HiTech', 'LIUM GO', 'Sensing · Modelling · Analytics', 'ZipBattery'];

const AUDIENCE_CARDS = [
  {
    title: 'For individuals', bg: '#E9F8F0', color: '#0BA66A', cta: 'Explore Marketplace', route: '/ev-marketplace',
    desc: 'Buy or sell EVs with confidence, access battery diagnostics, get help when needed, and discover nearby charging support.',
    paths: ['M4 20c0-3.3 3.6-6 8-6s8 2.7 8 6'], circles: [[12, 8, 4]] as number[][],
  },
  {
    title: 'For fleets & businesses', bg: '#EAF1FE', color: '#1E63FF', cta: 'View Plans', route: '/buy-plans',
    desc: 'Monitor vehicle performance, reduce downtime, improve operational efficiency, and manage EV assets with real-time charging intelligence.',
    paths: ['M5 17 4 10a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2l-1 7', 'M3 17h18'], circles: [[8, 20, 1.5], [16, 20, 1.5]] as number[][],
  },
  {
    title: 'For investors & partners', bg: '#F3EEFE', color: '#7C3AED', cta: 'Explore EV Chargers', route: '/find-ev-chargers',
    desc: "Explore sustainable infrastructure investment opportunities and franchise models built for long-term growth in India's EV ecosystem.",
    paths: ['M4 18 10 12l4 4 6-7', 'M16 9h4v4'],
  },
];

function Tick({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#0BA66A" strokeWidth={2.4} style={{ flex: '0 0 auto' }}>
      <path d="m5 12 4.5 4.5L19 7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// 3D service-deck geometry (matches the design mockup).
const SERVICE_COUNT = SERVICE_CARDS.length;
const MAX_OFFSET = 2;
const SPACING = 236;
const STEP_DEG = 16;
const DEPTH = 120;
const TILT_X = 9;
const AUTO_SLIDE_MS = 3500;

export default function LandingPage() {
  const navigate = useNavigate();
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [activeService, setActiveService] = useState(0);
  const [svcHover, setSvcHover] = useState(false);
  const [svcTick, setSvcTick] = useState(0);

  useEffect(() => {
    if (svcHover) return;
    const id = setInterval(() => setActiveService((p) => (p + 1) % SERVICE_COUNT), AUTO_SLIDE_MS);
    return () => clearInterval(id);
  }, [svcHover, svcTick]);

  // Manual navigation also restarts the autoplay timer so the deck doesn't jump immediately after.
  const selectService = (i: number) => {
    setActiveService(((i % SERVICE_COUNT) + SERVICE_COUNT) % SERVICE_COUNT);
    setSvcTick((n) => n + 1);
  };

  const goTo = (route: string) => {
    navigate(route);
    window.scrollTo({ top: 0, behavior: 'auto' });
  };

  const t = TESTIMONIALS[activeTestimonial];

  return (
    <div style={{ background: '#fff', color: '#0F172A', fontFamily: "Inter, sans-serif", overflowX: 'hidden', width: '100%' }}>
      <Helmet>
        <title>EVChamp | AI &amp; IoT-Driven EV Fleet Management Platform in India</title>
        <meta name="description" content="EVChamp is an AI & IoT-driven EV ecosystem for fleet management, certified pre-owned EVs, battery diagnostics, charging stations, roadside assistance, franchise partnerships, and green infrastructure investment." />
      </Helmet>

      {/* Hero */}
      <section className="lp-hero" style={{ position: 'relative', maxWidth: 1240, margin: '0 auto', padding: '72px 32px 44px', display: 'grid', gridTemplateColumns: '1.05fr 0.95fr', gap: 52, alignItems: 'center' }}>
        <div style={{ position: 'absolute', top: -60, left: -180, width: 520, height: 520, background: 'radial-gradient(circle, rgba(30,99,255,.1), transparent 65%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: 120, right: -140, width: 460, height: 460, background: 'radial-gradient(circle, rgba(11,166,106,.1), transparent 65%)', pointerEvents: 'none' }} />
        <div style={{ position: 'relative' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 9, background: '#EAF1FE', color: '#1E4FBF', padding: '7px 14px', borderRadius: 100, fontSize: 12.5, fontWeight: 600, letterSpacing: '0.02em' }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#0BA66A' }} />
            AI &amp; IoT-driven EV ecosystem · India
          </div>
          <h1 className="lp-h1" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 800, fontSize: 60, lineHeight: 1.04, letterSpacing: '-0.025em', color: '#0F172A', margin: '22px 0 0' }}>
            Drive smart.<br />Drive{' '}
            <span style={{ background: GRAD, WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}>electric.</span>
          </h1>
          <p style={{ fontSize: 18, lineHeight: 1.6, color: '#556070', maxWidth: 520, margin: '22px 0 0' }}>
            Everything you need for a smarter EV experience — certified pre-owned EVs, battery diagnostics, charging, roadside assistance and IoT fleet intelligence, all on one connected platform.
          </p>
          <div style={{ display: 'flex', gap: 14, marginTop: 32, flexWrap: 'wrap' }}>
            <button onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: GRAD, color: '#fff', fontSize: 15.5, fontWeight: 600, padding: '15px 26px', borderRadius: 12, boxShadow: '0 10px 24px rgba(30,99,255,.26)', border: 'none', cursor: 'pointer', whiteSpace: 'nowrap' }}>
              Explore Platform
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
            </button>
            <button onClick={() => goTo(TRIAL_CHECKOUT)} style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8, background: '#fff', border: '1.5px solid #1D66F9', color: '#1D66F9', fontSize: 15.5, fontWeight: 700, padding: '15px 26px', borderRadius: 12, cursor: 'pointer', whiteSpace: 'nowrap' }}>Start Trial</button>
          </div>
          <div className="lp-stats" style={{ display: 'flex', gap: 40, marginTop: 40, flexWrap: 'wrap' }}>
            {[{ n: '2000', l: 'Charging points' }, { n: '100', l: 'Service centres' }, { n: '50K', l: 'Happy users' }].map((s) => (
              <div key={s.l}>
                <div style={{ fontFamily: 'Poppins, sans-serif', fontSize: 30, fontWeight: 700, color: '#0F172A' }}>{s.n}<span style={{ color: '#0BA66A' }}>+</span></div>
                <div style={{ fontSize: 13, color: '#64748B', marginTop: 2 }}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ position: 'relative' }}>
          <div style={{ position: 'relative', height: 500, borderRadius: 24, overflow: 'hidden', border: '1px solid #E6ECF3', boxShadow: '0 32px 80px rgba(15,23,42,.12)', background: 'linear-gradient(160deg,#0B1B3F,#0A0F26)' }}>
            <img src="/hero-ev.png" alt="EVChamp electric SUV charging at night" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }} />
          </div>
          <div className="lp-float-card" style={{ position: 'absolute', top: 26, left: -28, background: '#fff', border: '1px solid #E6ECF3', borderRadius: 16, padding: '14px 16px', width: 190, boxShadow: '0 10px 30px rgba(15,23,42,.1)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 12, color: '#64748B', fontWeight: 700 }}>Battery State of Health</span>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#0BA66A' }} />
            </div>
            <div style={{ fontFamily: 'Poppins, sans-serif', fontSize: 30, fontWeight: 700, color: '#0F172A', marginTop: 4 }}>95<span style={{ fontSize: 15, color: '#0BA66A', fontWeight: 600 }}>% Good</span></div>
            <div style={{ height: 6, borderRadius: 4, background: '#EEF2F7', marginTop: 8, overflow: 'hidden' }}><div style={{ height: '100%', width: '95%', background: GRAD, borderRadius: 4 }} /></div>
          </div>
          <div className="lp-float-card" style={{ position: 'absolute', bottom: 28, right: -24, background: '#fff', border: '1px solid #E6ECF3', borderRadius: 16, padding: '14px 16px', width: 205, boxShadow: '0 10px 30px rgba(15,23,42,.1)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ width: 26, height: 26, borderRadius: 8, background: '#EAF1FE', display: 'grid', placeItems: 'center' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#1E63FF" strokeWidth={2}><path d="M13 2 4 14h6l-1 8 9-12h-6l1-8Z" strokeLinejoin="round" /></svg>
              </span>
              <span style={{ fontSize: 12.5, color: '#64748B', fontWeight: 700 }}>Fast charging</span>
            </div>
            <div style={{ fontFamily: 'Poppins, sans-serif', fontSize: 17, fontWeight: 700, color: '#0BA66A', marginTop: 8 }}>Available now</div>
            <div style={{ fontSize: 12, color: '#64748B', marginTop: 2, fontWeight: 700 }}>Delhi · 40 free, 10 busy</div>
          </div>
        </div>
      </section>

      {/* Services showcase cards */}
      <section id="services" style={{ background: '#fff' }}>
        <div style={{ maxWidth: 1240, margin: '0 auto', padding: '80px 32px 96px' }}>
          <div style={{ textAlign: 'center', maxWidth: 660, margin: '0 auto' }}>
            <h2 style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 800, fontSize: 46, lineHeight: 1.05, letterSpacing: '-0.025em', margin: 0, color: '#0F172A' }}>
              Explore our top <span style={{ background: GRAD, WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}>EV services</span>
            </h2>
            <p style={{ fontSize: 16.5, lineHeight: 1.6, color: '#64748B', margin: '16px 0 0' }}>Complete electric-vehicle solutions — from charging infrastructure and maintenance to resale and battery diagnostics. Everything you need on your EV journey.</p>
          </div>

          <div
            onMouseEnter={() => setSvcHover(true)}
            onMouseLeave={() => setSvcHover(false)}
            style={{ position: 'relative', marginTop: 44 }}
          >
            <div style={{ pointerEvents: 'none', position: 'absolute', left: '50%', top: 40, transform: 'translateX(-50%)', width: '68%', height: 190, borderRadius: '50%', background: 'rgba(15,23,42,.06)', filter: 'blur(48px)' }} />
            <div className="lp-svc" style={{ position: 'relative', height: 420, perspective: 1300 }}>
              <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {SERVICE_CARDS.map((card, i) => {
                  // Fan the deck out around the active card (mirrors the design mockup's math).
                  let off = i - activeService;
                  const alt = off > 0 ? off - SERVICE_COUNT : off + SERVICE_COUNT;
                  if (Math.abs(alt) < Math.abs(off)) off = alt;
                  const abs = Math.abs(off);
                  const isActive = off === 0;
                  const transform = `translateX(${off * SPACING}px) translateY(${abs * 12 + (isActive ? -26 : 0)}px) translateZ(${-abs * DEPTH}px) rotateZ(${off * STEP_DEG}deg) rotateX(${isActive ? 0 : TILT_X}deg) scale(${isActive ? 1.05 : 0.9})`;
                  const visible = abs <= MAX_OFFSET;
                  return (
                    <div
                      key={card.title}
                      role="button"
                      tabIndex={visible ? 0 : -1}
                      onClick={() => (isActive ? goTo(card.route) : selectService(i))}
                      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); if (isActive) goTo(card.route); else selectService(i); } }}
                      style={{
                        position: 'absolute', width: 460, height: 300, transform, zIndex: 100 - abs,
                        opacity: visible ? 1 : 0, pointerEvents: visible ? 'auto' : 'none',
                        transformStyle: 'preserve-3d',
                        transition: 'transform .6s cubic-bezier(.22,1,.36,1), opacity .4s ease, box-shadow .4s ease',
                        borderRadius: 24, overflow: 'hidden',
                        boxShadow: isActive ? '0 34px 72px rgba(15,23,42,.34)' : '0 16px 40px rgba(15,23,42,.2)',
                        background: card.grad, border: '4px solid rgba(255,255,255,.16)', cursor: 'pointer',
                      }}
                    >
                      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,.4), rgba(0,0,0,.05) 55%, transparent)' }} />
                      <div style={{ position: 'relative', height: '100%', padding: 26, display: 'flex', flexDirection: 'column', color: '#fff' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <span style={{ width: 52, height: 52, borderRadius: 15, background: 'rgba(255,255,255,.2)', backdropFilter: 'blur(4px)', display: 'grid', placeItems: 'center', fontSize: 26 }}>{card.icon}</span>
                          <span style={{ background: 'rgba(255,255,255,.18)', backdropFilter: 'blur(4px)', color: '#fff', fontSize: 11.5, fontWeight: 700, padding: '6px 13px', borderRadius: 100 }}>✓ {card.tag}</span>
                        </div>
                        <div style={{ marginTop: 'auto' }}>
                          <h3 style={{ fontFamily: 'Poppins, sans-serif', fontSize: 27, fontWeight: 700, letterSpacing: '-0.015em', margin: 0 }}>{card.title}</h3>
                          <p style={{ fontSize: 14.5, lineHeight: 1.5, color: 'rgba(255,255,255,.9)', margin: '8px 0 0', maxWidth: 370 }}>{card.desc}</p>
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginTop: 16, background: '#fff', color: '#0F172A', fontSize: 13.5, fontWeight: 700, padding: '9px 16px', borderRadius: 100 }}>{card.cta} →</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              <button onClick={() => selectService(activeService - 1)} aria-label="Previous service" style={arrowStyle('left')}>‹</button>
              <button onClick={() => selectService(activeService + 1)} aria-label="Next service" style={arrowStyle('right')}>›</button>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 10 }}>
              {SERVICE_CARDS.map((card, i) => (
                <button
                  key={card.title}
                  onClick={() => selectService(i)}
                  aria-label={`Go to ${card.title}`}
                  style={{ height: 9, width: i === activeService ? 26 : 9, borderRadius: 100, border: 'none', padding: 0, cursor: 'pointer', background: i === activeService ? '#1E63FF' : '#CBD5E1', transition: 'all .3s ease' }}
                />
              ))}
            </div>
            <p style={{ textAlign: 'center', fontSize: 13, color: '#64748B', margin: '14px 0 0' }}>Click a card, use the arrows, or the dots to browse services.</p>
          </div>
        </div>
      </section>

      {/* App strip */}
      <section style={{ maxWidth: 1240, margin: '0 auto', padding: '20px 32px 40px' }}>
        <div className="lp-appstrip" style={{ background: '#F8FAFC', border: '1px solid #EDF1F5', borderRadius: 22, padding: '30px 36px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 32, flexWrap: 'wrap' }}>
          <div style={{ maxWidth: 620 }}>
            <span style={{ fontSize: 12, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#1E63FF', fontWeight: 700 }}>Mobile app</span>
            <h3 style={{ fontFamily: 'Poppins, sans-serif', fontSize: 24, fontWeight: 700, letterSpacing: '-0.01em', margin: '8px 0 0', color: '#0F172A' }}>The power of AI &amp; IoT for your EV — in your pocket.</h3>
            <p style={{ fontSize: 14.5, lineHeight: 1.6, color: '#64748B', margin: '8px 0 0' }}>From certified pre-owned EVs and battery diagnostics to charging access and roadside assistance — the EVChamp AI Companion brings every part of the EV journey into one app.</p>
          </div>
          <div style={{ display: 'flex', gap: 12, flex: '0 0 auto' }}>
            <a href="#" style={{ display: 'flex', alignItems: 'center', gap: 10, background: '#0F172A', color: '#fff', textDecoration: 'none', padding: '12px 18px', borderRadius: 11, whiteSpace: 'nowrap' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="#fff"><path d="M3 3.5v17l14-8.5-14-8.5Z" /></svg>
              <span style={{ textAlign: 'left' }}><span style={{ display: 'block', fontSize: 10, color: '#94A3B8' }}>GET IT ON</span><span style={{ display: 'block', fontSize: 14, fontWeight: 600 }}>Google Play</span></span>
            </a>
            <a href="#" style={{ display: 'flex', alignItems: 'center', gap: 10, background: '#fff', border: '1.5px solid #EDF1F5', color: '#0F172A', textDecoration: 'none', padding: '12px 18px', borderRadius: 11, whiteSpace: 'nowrap' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="#0F172A"><path d="M16.4 12.8c0-2.1 1.7-3.1 1.8-3.2-1-1.4-2.5-1.6-3-1.7-1.3-.1-2.5.8-3.2.8-.6 0-1.7-.7-2.8-.7-1.4 0-2.7.8-3.5 2.1-1.5 2.6-.4 6.4 1.1 8.5.7 1 1.5 2.2 2.6 2.1 1-.04 1.4-.7 2.7-.7s1.6.7 2.7.6c1.1-.02 1.8-1 2.5-2 .8-1.2 1.1-2.3 1.1-2.4-.02-.01-2.1-.8-2.1-3.2Zm-2.2-5.9c.6-.7 1-1.7.9-2.7-.8.03-1.9.6-2.5 1.3-.5.6-1 1.6-.9 2.6.9.07 1.8-.5 2.5-1.2Z" /></svg>
              <span style={{ textAlign: 'left' }}><span style={{ display: 'block', fontSize: 10, color: '#94A3B8' }}>COMING SOON</span><span style={{ display: 'block', fontSize: 14, fontWeight: 600 }}>App Store</span></span>
            </a>
          </div>
        </div>
      </section>

      {/* Platform tiles grid */}
      <section style={{ maxWidth: 1240, margin: '0 auto', padding: '8px 32px 44px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 24, flexWrap: 'wrap', marginBottom: 26 }}>
          <div>
            <span style={{ fontSize: 12, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#1E63FF', fontWeight: 700 }}>One connected platform</span>
            <h2 style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 800, fontSize: 34, lineHeight: 1.08, letterSpacing: '-0.025em', margin: '8px 0 0', color: '#0F172A' }}>Everything for your EV, in one place</h2>
          </div>
          <p style={{ fontSize: 14.5, lineHeight: 1.6, color: '#64748B', maxWidth: 380, margin: 0 }}>Jump straight to what you need — charging, diagnostics, resale and support. Pick a service to get started.</p>
        </div>
        <div className="lp-col3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          {PLATFORM_TILES.map((tile) => (
            <button
              key={tile.title}
              onClick={() => goTo(tile.route)}
              className="lp-tile"
              style={{ display: 'flex', alignItems: 'center', gap: 16, background: '#fff', border: '1px solid #EDF1F5', borderRadius: 18, padding: '20px 22px', textAlign: 'left', boxShadow: '0 6px 18px rgba(15,23,42,.04)', cursor: 'pointer' }}
            >
              <span style={{ flex: '0 0 auto', width: 52, height: 52, borderRadius: 14, background: tile.bg, display: 'grid', placeItems: 'center', fontSize: 24 }}>{tile.icon}</span>
              <span style={{ display: 'block', minWidth: 0 }}>
                <span style={{ display: 'block', fontFamily: 'Poppins, sans-serif', fontSize: 16.5, fontWeight: 700, lineHeight: 1.25, color: '#0F172A' }}>{tile.title} <span style={{ color: '#1E63FF', fontWeight: 800 }}>→</span></span>
                <span style={{ display: 'block', fontSize: 13.5, lineHeight: 1.5, color: '#64748B', marginTop: 3 }}>{tile.desc}</span>
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* Built for a smarter EV future */}
      <section id="about" style={{ background: '#F8FAFC', borderTop: '1px solid #EDF1F5' }}>
        <div style={{ maxWidth: 1240, margin: '0 auto', padding: '88px 32px' }}>
          <h2 style={{ textAlign: 'center', fontFamily: 'Poppins, sans-serif', fontWeight: 800, fontSize: 42, lineHeight: 1.06, letterSpacing: '-0.025em', margin: '0 0 48px', color: '#0F172A' }}>Built for a smarter EV future</h2>
          <div className="lp-col3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 22 }}>
            {AUDIENCE_CARDS.map((card) => (
              <div key={card.title} style={{ background: '#fff', border: '1px solid #EDF1F5', borderRadius: 18, padding: 32 }}>
                <span style={{ display: 'inline-grid', placeItems: 'center', width: 48, height: 48, borderRadius: 12, background: card.bg }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={card.color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                    {card.paths.map((d, i) => <path key={i} d={d} />)}
                    {card.circles?.map((c, i) => <circle key={i} cx={c[0]} cy={c[1]} r={c[2]} />)}
                  </svg>
                </span>
                <h3 style={{ fontFamily: 'Poppins, sans-serif', fontSize: 22, fontWeight: 700, margin: '18px 0 0', color: '#0F172A' }}>{card.title}</h3>
                <p style={{ fontSize: 15, lineHeight: 1.6, color: '#64748B', margin: '10px 0 0' }}>{card.desc}</p>
                <button onClick={() => goTo(card.route)} style={{ display: 'inline-flex', alignItems: 'center', gap: 7, marginTop: 18, color: card.color, background: 'none', border: 'none', padding: 0, fontSize: 14.5, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>{card.cta} →</button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Zeflash trial plan */}
      <section id="plans" style={{ background: '#fff' }}>
        <div className="lp-col2" style={{ maxWidth: 1240, margin: '0 auto', padding: '88px 32px', display: 'grid', gridTemplateColumns: '1fr 0.92fr', gap: 56, alignItems: 'center' }}>
          <div>
            <span style={{ fontSize: 12, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#1E63FF', fontWeight: 700 }}>Zeflash diagnostics</span>
            <h2 style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 800, fontSize: 42, lineHeight: 1.06, letterSpacing: '-0.025em', margin: '12px 0 0', color: '#0F172A' }}>Know your battery in 20 minutes.</h2>
            <p style={{ fontSize: 16.5, lineHeight: 1.65, color: '#64748B', margin: '18px 0 0', maxWidth: 460 }}>Rapid AI battery diagnostics with advanced SoH &amp; SoC analysis and an instant, tamper-proof health report — done right at the charging point.</p>
            <div style={{ display: 'grid', gap: 12, marginTop: 24 }}>
              {['AI-powered state-of-health analysis', 'Instant PDF report & recommendations', 'No credit card required to start'].map((item) => (
                <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <Tick size={18} />
                  <span style={{ fontSize: 15, color: '#334155' }}>{item}</span>
                </div>
              ))}
            </div>
          </div>
          <div style={{ position: 'relative', background: '#F8FAFC', border: '1.5px solid #0BA66A', borderRadius: 24, padding: 36, boxShadow: '0 24px 56px rgba(11,166,106,.12)' }}>
            <span style={{ position: 'absolute', top: 18, right: 18, background: GRAD, color: '#fff', fontSize: 11, fontWeight: 700, letterSpacing: '0.05em', padding: '5px 12px', borderRadius: 100 }}>TRIAL</span>
            <h3 style={{ fontFamily: 'Poppins, sans-serif', fontSize: 26, fontWeight: 700, margin: 0, textAlign: 'center', color: '#0F172A' }}>One Time</h3>
            <p style={{ textAlign: 'center', fontSize: 14, color: '#64748B', margin: '4px 0 0' }}>Try it once</p>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: 10, margin: '20px 0 0' }}>
              <span style={{ fontFamily: 'Poppins, sans-serif', fontSize: 46, fontWeight: 800, color: '#0F172A' }}>₹199</span>
              <span style={{ fontSize: 13, color: '#64748B' }}>valid for one-time use</span>
            </div>
            <div style={{ display: 'grid', gap: 12, marginTop: 24 }}>
              {['1 complete 20-min diagnostic', 'Instant health report + PDF', 'Basic recommendations', 'No credit card required'].map((item) => (
                <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <Tick size={17} />
                  <span style={{ fontSize: 14.5, color: '#334155' }}>{item}</span>
                </div>
              ))}
            </div>
            <button onClick={() => goTo(TRIAL_CHECKOUT)} style={{ display: 'block', width: '100%', textAlign: 'center', background: GRAD, color: '#fff', fontSize: 15.5, fontWeight: 700, padding: 15, borderRadius: 12, marginTop: 26, border: 'none', cursor: 'pointer', boxShadow: '0 10px 24px rgba(30,99,255,.24)', fontFamily: 'inherit' }}>Start Trial</button>
            <button onClick={() => goTo('/buy-plans')} style={{ display: 'block', width: '100%', textAlign: 'center', color: '#64748B', fontSize: 14, fontWeight: 600, marginTop: 14, background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>Explore annual plans →</button>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section style={{ background: '#F8FAFC' }}>
        <div style={{ maxWidth: 780, margin: '0 auto', padding: '72px 32px' }}>
          <div style={{ position: 'relative', padding: '6px 44px 0' }}>
            <span style={{ position: 'absolute', left: -6, top: -26, fontFamily: 'Georgia, serif', fontSize: 76, color: 'rgba(15,23,42,.07)', userSelect: 'none' }}>&#8220;</span>
            <p style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 300, fontSize: 27, lineHeight: 1.55, textAlign: 'center', color: '#0F172A', margin: 0 }}>&#8220;{t.quote}&#8221;</p>
            <span style={{ position: 'absolute', right: -6, bottom: -34, fontFamily: 'Georgia, serif', fontSize: 76, color: 'rgba(15,23,42,.07)', userSelect: 'none' }}>&#8221;</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20, marginTop: 24 }}>
            <p style={{ fontSize: 12, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#64748B', margin: 0 }}>{t.role}</p>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, flexWrap: 'wrap' }}>
              {TESTIMONIALS.map((item, i) => (
                <button
                  key={item.name}
                  onClick={() => setActiveTestimonial(i)}
                  style={{ display: 'inline-flex', alignItems: 'center', border: 'none', margin: 0, cursor: 'pointer', borderRadius: 999, transition: '0.3s', background: i === activeTestimonial ? '#0F172A' : 'transparent', boxShadow: i === activeTestimonial ? '0 10px 24px rgba(15,23,42,.18)' : 'none', padding: '6px 16px 6px 6px' }}
                >
                  <span style={{ width: 36, height: 36, borderRadius: '50%', background: GRAD, display: 'grid', placeItems: 'center', color: '#fff', fontWeight: 700, fontSize: 13, flex: '0 0 auto' }}>{item.initials}</span>
                  <span style={{ fontSize: 13.5, fontWeight: 600, whiteSpace: 'nowrap', color: i === activeTestimonial ? '#fff' : '#334155', marginLeft: 8 }}>{item.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Partners marquee */}
      <section style={{ background: '#fff', overflow: 'hidden' }}>
        <div style={{ maxWidth: 1240, margin: '0 auto', padding: '72px 0' }}>
          <p style={{ textAlign: 'center', fontSize: 12, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#64748B', fontWeight: 700, margin: '0 0 32px', padding: '0 32px' }}>Our partners</p>
          <div style={{ position: 'relative', height: 44, overflow: 'hidden' }}>
            <div className="lp-marquee" style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', gap: 72, width: 'max-content' }}>
              {[...PARTNERS, ...PARTNERS].map((p, i) => (
                <span key={i} style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontSize: 19, color: '#475569', whiteSpace: 'nowrap' }}>{p}</span>
              ))}
            </div>
            <div style={{ position: 'absolute', top: 0, left: 0, width: 160, height: '100%', background: 'linear-gradient(to right, #fff, transparent)', pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', top: 0, right: 0, width: 160, height: '100%', background: 'linear-gradient(to left, #fff, transparent)', pointerEvents: 'none' }} />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: '#0B1B3F' }}>
        <div style={{ maxWidth: 1240, margin: '0 auto', padding: '88px 32px', textAlign: 'center' }}>
          <h2 style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 800, fontSize: 44, letterSpacing: '-0.025em', color: '#fff', margin: 0 }}>Join the EVChamp network</h2>
          <p style={{ fontSize: 17, color: '#A9B6CE', margin: '16px auto 0', maxWidth: 520 }}>Be part of the next generation of electric mobility in India.</p>
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', marginTop: 32, flexWrap: 'wrap' }}>
            <button onClick={() => goTo('/sign-up')} style={{ background: GRAD, color: '#fff', fontSize: 15.5, fontWeight: 700, padding: '16px 30px', borderRadius: 12, boxShadow: '0 12px 28px rgba(30,99,255,.3)', border: 'none', cursor: 'pointer' }}>Get Started Free</button>
            <button onClick={() => goTo('/contact')} style={{ background: 'transparent', border: '1.5px solid rgba(255,255,255,.24)', color: '#fff', fontSize: 15.5, fontWeight: 700, padding: '16px 30px', borderRadius: 12, cursor: 'pointer' }}>Contact Us</button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: '#08122B' }}>
        <div className="lp-foot" style={{ maxWidth: 1240, margin: '0 auto', padding: '60px 32px 28px', display: 'grid', gridTemplateColumns: '1.3fr 1fr 1fr 1.15fr 1fr', gap: 36 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <img src="/evchamp-logo.png" alt="EVChamp" style={{ width: 30, height: 30, borderRadius: 8, objectFit: 'cover' }} />
              <span style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontSize: 19, color: '#fff' }}>EVChamp</span>
            </div>
            <p style={{ fontSize: 14, lineHeight: 1.6, color: '#8FA0BF', margin: '16px 0 0', maxWidth: 280 }}>The AI &amp; IoT operating system for India's electric-vehicle economy.</p>
            <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
              {['in', '𝕏', '▶'].map((s) => (
                <a key={s} href="#" style={{ width: 36, height: 36, borderRadius: 9, border: '1px solid rgba(255,255,255,.14)', display: 'grid', placeItems: 'center', color: '#B7C4DC', textDecoration: 'none', fontSize: 14 }}>{s}</a>
              ))}
            </div>
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>Platform</div>
            <div style={{ display: 'grid', gap: 11, marginTop: 16 }}>
              <button onClick={() => goTo('/find-ev-chargers')} style={footLinkStyle}>Find EV Chargers</button>
              <button onClick={() => goTo('/service-centres')} style={footLinkStyle}>Service Centres</button>
              <button onClick={() => goTo('/zeflash')} style={footLinkStyle}>Zeflash</button>
              <button onClick={() => goTo('/sell-ev')} style={footLinkStyle}>Sell Your EV</button>
            </div>
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>Company</div>
            <div style={{ display: 'grid', gap: 11, marginTop: 16 }}>
              <button onClick={() => goTo('/about')} style={footLinkStyle}>About</button>
              <button onClick={() => goTo('/franchise')} style={footLinkStyle}>Franchise</button>
              <button onClick={() => goTo('/franchise')} style={footLinkStyle}>Invest</button>
              <button onClick={() => goTo('/blog')} style={footLinkStyle}>Blog</button>
            </div>
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>Contact</div>
            <div style={{ display: 'grid', gap: 11, marginTop: 16 }}>
              <span style={{ fontSize: 13.5, lineHeight: 1.6, color: '#8FA0BF' }}>ZipBolt Technologies Pvt Ltd<br />MGF Metropolis Mall, MG Road,<br />Gurgaon, Haryana – 122002</span>
              <a href="tel:+918368681769" style={footLinkStyle}>+91 83686 81769</a>
              <a href="mailto:hello@zip-bolt.com" style={footLinkStyle}>hello@zip-bolt.com</a>
            </div>
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>Stay charged</div>
            <p style={{ fontSize: 13.5, color: '#8FA0BF', margin: '16px 0 12px' }}>Product news &amp; EV insights, monthly.</p>
            <div style={{ display: 'flex', background: 'rgba(255,255,255,.06)', border: '1px solid rgba(255,255,255,.14)', borderRadius: 10, padding: 4, gap: 6 }}>
              <input placeholder="Email address" style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: '#EAF2EC', fontFamily: 'Inter, sans-serif', fontSize: 13.5, padding: '8px 10px' }} />
              <button style={{ background: GRAD, color: '#fff', border: 'none', fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: 13.5, padding: '8px 14px', borderRadius: 7, cursor: 'pointer' }}>Join</button>
            </div>
          </div>
        </div>
        <div style={{ borderTop: '1px solid rgba(255,255,255,.08)' }}>
          <div className="lp-footbarrow" style={{ maxWidth: 1240, margin: '0 auto', padding: '20px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
            <span style={{ fontSize: 13, color: '#6C7C9C' }}>© 2026 EVChamp Technologies. All rights reserved.</span>
            <div style={{ display: 'flex', gap: 22 }}>
              <button onClick={() => goTo('/privacy')} style={footLinkStyle}>Privacy</button>
              <button onClick={() => goTo('/terms')} style={footLinkStyle}>Terms</button>
              <button onClick={() => goTo('/contact')} style={footLinkStyle}>Security</button>
            </div>
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes lpMenuIn { from { opacity: 0; transform: translateY(-10px) scale(.97); } to { opacity: 1; transform: translateY(0) scale(1); } }
        @keyframes lpRowIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
        .lp-pf-menu { animation: lpMenuIn .22s cubic-bezier(.22,1,.36,1) both; }
        .lp-pf-row { animation: lpRowIn .3s ease both; transition: background .15s ease; }
        .lp-pf-row:hover { background: #F5F8FC !important; }
        @media (max-width: 768px) {
          .lp-h1 { font-size: 38px !important; }
          .lp-hero { grid-template-columns: 1fr !important; gap: 34px !important; padding: 36px 20px 20px !important; }
          .lp-col3 { grid-template-columns: 1fr !important; }
          .lp-col2 { grid-template-columns: 1fr !important; gap: 32px !important; padding: 56px 20px !important; }
          .lp-appstrip { grid-template-columns: 1fr !important; gap: 30px !important; padding: 24px !important; flex-direction: column; align-items: flex-start !important; }
          .lp-foot { grid-template-columns: 1fr 1fr !important; gap: 26px !important; }
          .lp-navlinks, .lp-zevault { display: none !important; }
          .lp-stats { gap: 24px !important; }
          .lp-footbarrow { flex-direction: column !important; text-align: center !important; }
          .lp-float-card { display: none !important; }
          .lp-svc { transform: scale(.7); transform-origin: top center; height: 320px !important; }
        }
      `}</style>
    </div>
  );
}

const footLinkStyle: React.CSSProperties = { background: 'none', border: 'none', fontSize: 14, color: '#8FA0BF', textDecoration: 'none', cursor: 'pointer', padding: 0, textAlign: 'left' };
const arrowStyle = (side: 'left' | 'right'): React.CSSProperties => ({
  position: 'absolute', [side]: 6, top: '42%', zIndex: 200, width: 46, height: 46, borderRadius: '50%',
  background: '#fff', border: '1px solid #E6ECF3', boxShadow: '0 8px 22px rgba(15,23,42,.14)',
  display: 'grid', placeItems: 'center', cursor: 'pointer', color: '#0F172A', fontSize: 22, lineHeight: 1,
});
