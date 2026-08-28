import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useUser, SignInButton, SignOutButton } from '@clerk/clerk-react';
import { PLATFORM_TILES, PROTECTED_ROUTES } from './platformTiles';

const GRAD = 'linear-gradient(100deg,#0BA66A 0%,#1E63FF 100%)';

const navLinkStyle: React.CSSProperties = {
  color: '#334155',
  fontSize: 14.5,
  fontWeight: 500,
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  padding: 0,
  fontFamily: 'inherit',
};

/**
 * Site-wide header: navigation bar on top, announcement bar directly beneath it.
 * Replaces the legacy Header so every route shares the landing-page navigation.
 */
export default function SiteHeader() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isSignedIn, user } = useUser();
  const [platformOpen, setPlatformOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const accountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setPlatformOpen(false);
    setAccountOpen(false);
    setMobileOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (accountRef.current && !accountRef.current.contains(e.target as Node)) setAccountOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  const goTo = (route: string) => {
    setPlatformOpen(false);
    setAccountOpen(false);
    setMobileOpen(false);
    navigate(PROTECTED_ROUTES.includes(route) && !isSignedIn ? '/sign-in' : route);
    window.scrollTo({ top: 0, behavior: 'auto' });
  };

  return (
    <div style={{ fontFamily: 'Inter, sans-serif' }}>
      <style>{`
        @keyframes shMenuIn { from { opacity: 0; transform: translateY(-10px) scale(.97); } to { opacity: 1; transform: translateY(0) scale(1); } }
        @keyframes shRowIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
        .sh-menu { animation: shMenuIn .22s cubic-bezier(.22,1,.36,1) both; }
        .sh-row { animation: shRowIn .3s ease both; transition: background .15s ease; }
        .sh-row:hover { background: #F5F8FC !important; }
        .sh-burger { display: none !important; }
        @media (max-width: 900px) {
          .sh-navlinks { display: none !important; }
          .sh-cta { display: none !important; }
          .sh-burger { display: inline-flex !important; }
          .sh-nav { padding: 12px 18px !important; }
        }
      `}</style>

      {/* Navigation bar */}
      <header style={{ position: 'sticky', top: 0, zIndex: 60, background: 'rgba(255,255,255,.92)', backdropFilter: 'blur(14px)', borderBottom: '1px solid #EDF1F5' }}>
        <nav className="sh-nav" style={{ maxWidth: 1240, margin: '0 auto', padding: '15px 32px', display: 'flex', alignItems: 'center', gap: 30 }}>
          <button onClick={() => goTo('/')} style={{ display: 'flex', alignItems: 'center', gap: 11, background: 'none', border: 'none', cursor: 'pointer', padding: 0, flex: '0 0 auto' }}>
            <img src="/evchamp-logo.png" alt="EVChamp" style={{ width: 34, height: 34, borderRadius: 9, objectFit: 'cover' }} />
            <span style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontSize: 21, color: '#0F172A', letterSpacing: '-0.01em' }}>EVChamp</span>
          </button>

          <div className="sh-navlinks" style={{ display: 'flex', alignItems: 'center', gap: 26, marginLeft: 10 }}>
            <div onMouseEnter={() => setPlatformOpen(true)} onMouseLeave={() => setPlatformOpen(false)} style={{ position: 'relative' }}>
              <span
                role="button"
                tabIndex={0}
                onClick={() => setPlatformOpen((o) => !o)}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setPlatformOpen((o) => !o); } }}
                style={{ display: 'inline-flex', alignItems: 'center', gap: 5, color: platformOpen ? '#1E63FF' : '#334155', fontSize: 14.5, fontWeight: 500, cursor: 'pointer', userSelect: 'none', paddingBottom: 16, marginBottom: -16 }}
              >
                Platform
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth={2.4} style={{ transform: platformOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform .2s' }}>
                  <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              {platformOpen && (
                <div className="sh-menu" style={{ position: 'absolute', top: 'calc(100% + 16px)', left: -16, width: 620, background: '#fff', border: '1px solid #EDF1F5', borderRadius: 18, boxShadow: '0 30px 70px rgba(15,23,42,.18)', padding: 14, zIndex: 70, transformOrigin: 'top left' }}>
                  <div style={{ position: 'absolute', top: -7, left: 30, width: 14, height: 14, background: '#fff', borderLeft: '1px solid #EDF1F5', borderTop: '1px solid #EDF1F5', transform: 'rotate(45deg)' }} />
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4 }}>
                    {PLATFORM_TILES.map((p, i) => (
                      <button
                        key={p.title}
                        className="sh-row"
                        onClick={() => goTo(p.route)}
                        style={{ display: 'flex', alignItems: 'flex-start', gap: 13, padding: 13, borderRadius: 12, border: 'none', background: 'transparent', textAlign: 'left', cursor: 'pointer', animationDelay: `${(i * 0.03).toFixed(2)}s` }}
                      >
                        <span style={{ flex: '0 0 auto', width: 40, height: 40, borderRadius: 11, background: p.bg, display: 'grid', placeItems: 'center', fontSize: 18 }}>{p.icon}</span>
                        <span style={{ display: 'block' }}>
                          <span style={{ display: 'block', fontSize: 14.5, fontWeight: 700, color: '#0F172A' }}>{p.title}</span>
                          <span style={{ display: 'block', fontSize: 12.5, lineHeight: 1.45, color: '#64748B', marginTop: 2 }}>{p.desc}</span>
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <button onClick={() => goTo('/about')} style={navLinkStyle}>About</button>
            <button onClick={() => goTo('/contact')} style={navLinkStyle}>Contact</button>
            <button onClick={() => goTo('/blog')} style={navLinkStyle}>Blog</button>
          </div>

          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 12 }}>
            <button className="sh-cta" onClick={() => goTo('/zevault')} style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: '#7C3AED', color: '#fff', fontSize: 14, fontWeight: 600, padding: '10px 16px', borderRadius: 10, whiteSpace: 'nowrap', border: 'none', cursor: 'pointer', flex: '0 0 auto' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="#fff"><path d="M13 2 4 14h6l-1 8 9-12h-6l1-8Z" /></svg> ZeVault
            </button>
            <button className="sh-cta" onClick={() => goTo(isSignedIn ? '/find-ev-chargers' : '/sign-up')} style={{ background: GRAD, color: '#fff', fontSize: 14, fontWeight: 600, padding: '10px 18px', borderRadius: 10, boxShadow: '0 6px 16px rgba(30,99,255,.24)', whiteSpace: 'nowrap', border: 'none', cursor: 'pointer', flex: '0 0 auto' }}>Get Started</button>

            <div ref={accountRef} style={{ position: 'relative', flex: '0 0 auto' }}>
              {isSignedIn ? (
                <button onClick={() => setAccountOpen((o) => !o)} style={{ display: 'flex', alignItems: 'center', gap: 7, background: 'none', border: 'none', cursor: 'pointer', padding: 2 }}>
                  <span style={{ width: 32, height: 32, borderRadius: '50%', background: GRAD, color: '#fff', display: 'grid', placeItems: 'center', fontSize: 13, fontWeight: 700 }}>
                    {user?.firstName?.charAt(0) || user?.username?.charAt(0) || 'U'}
                  </span>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth={2.4} style={{ transform: accountOpen ? 'rotate(180deg)' : 'none', transition: 'transform .2s' }}>
                    <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              ) : (
                <SignInButton mode="modal">
                  <button style={{ display: 'inline-flex', alignItems: 'center', gap: 6, ...navLinkStyle }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth={2}>
                      <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    Sign In
                  </button>
                </SignInButton>
              )}
              {accountOpen && isSignedIn && (
                <div className="sh-menu" style={{ position: 'absolute', right: 0, top: 'calc(100% + 10px)', width: 220, background: '#fff', border: '1px solid #EDF1F5', borderRadius: 14, boxShadow: '0 24px 56px rgba(15,23,42,.16)', padding: 6, zIndex: 70, transformOrigin: 'top right' }}>
                  <div style={{ padding: '10px 12px', borderBottom: '1px solid #EDF1F5' }}>
                    <div style={{ fontSize: 13.5, fontWeight: 700, color: '#0F172A' }}>{user?.firstName} {user?.lastName}</div>
                    <div style={{ fontSize: 12, color: '#94A3B8', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.primaryEmailAddress?.emailAddress}</div>
                  </div>
                  <button className="sh-row" onClick={() => goTo('/zevault')} style={accountItemStyle('#7C3AED')}>ZeVault Credits</button>
                  <button className="sh-row" onClick={() => goTo('/user')} style={accountItemStyle('#334155')}>Profile Settings</button>
                  <SignOutButton>
                    <button className="sh-row" style={accountItemStyle('#DC2626')} onClick={() => setAccountOpen(false)}>Sign Out</button>
                  </SignOutButton>
                </div>
              )}
            </div>

            <button className="sh-burger" aria-label="Menu" onClick={() => setMobileOpen((o) => !o)} style={{ alignItems: 'center', justifyContent: 'center', width: 38, height: 38, borderRadius: 10, border: '1px solid #EDF1F5', background: '#fff', cursor: 'pointer' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0F172A" strokeWidth={2.2}>
                {mobileOpen ? <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" /> : <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />}
              </svg>
            </button>
          </div>
        </nav>

        {mobileOpen && (
          <div className="sh-menu" style={{ borderTop: '1px solid #EDF1F5', background: '#fff', padding: '12px 18px 18px', maxHeight: '70vh', overflowY: 'auto' }}>
            {PLATFORM_TILES.map((p) => (
              <button key={p.title} className="sh-row" onClick={() => goTo(p.route)} style={{ display: 'flex', alignItems: 'center', gap: 12, width: '100%', padding: 11, borderRadius: 11, border: 'none', background: 'transparent', textAlign: 'left', cursor: 'pointer' }}>
                <span style={{ width: 34, height: 34, borderRadius: 10, background: p.bg, display: 'grid', placeItems: 'center', fontSize: 16 }}>{p.icon}</span>
                <span style={{ fontSize: 14.5, fontWeight: 600, color: '#0F172A' }}>{p.title}</span>
              </button>
            ))}
            <div style={{ height: 1, background: '#EDF1F5', margin: '10px 0' }} />
            {[['About', '/about'], ['Contact', '/contact'], ['Blog', '/blog'], ['ZeVault', '/zevault']].map(([label, route]) => (
              <button key={route} className="sh-row" onClick={() => goTo(route)} style={{ display: 'block', width: '100%', padding: 11, borderRadius: 11, border: 'none', background: 'transparent', textAlign: 'left', fontSize: 14.5, fontWeight: 600, color: '#334155', cursor: 'pointer' }}>{label}</button>
            ))}
            <button onClick={() => goTo(isSignedIn ? '/find-ev-chargers' : '/sign-up')} style={{ width: '100%', marginTop: 10, background: GRAD, color: '#fff', fontSize: 15, fontWeight: 700, padding: '13px', borderRadius: 12, border: 'none', cursor: 'pointer' }}>Get Started</button>
          </div>
        )}
      </header>

      {/* Announcement bar — sits directly below the navigation */}
      <div style={{ background: GRAD, color: '#fff', textAlign: 'center', fontSize: 13, fontWeight: 600, letterSpacing: '0.01em', padding: '9px 16px' }}>
        New: EVChamp raises a green-infrastructure fund — franchise &amp; investment slots now open ·{' '}
        <span style={{ textDecoration: 'underline', textUnderlineOffset: 2, cursor: 'pointer' }} onClick={() => goTo('/franchise')}>Learn more →</span>
      </div>
    </div>
  );
}

function accountItemStyle(color: string): React.CSSProperties {
  return { display: 'block', width: '100%', padding: '10px 12px', marginTop: 2, borderRadius: 10, border: 'none', background: 'transparent', textAlign: 'left', fontSize: 13.5, fontWeight: 600, color, cursor: 'pointer' };
}
