import React from 'react';
import { useNavigate } from 'react-router-dom';

// The single site-wide footer — same design as the main landing page, reused
// on every other route so no page shows the old (pre-redesign) footer.

const GRAD = 'linear-gradient(100deg,#0BA66A 0%,#1E63FF 100%)';

const SOCIALS = [
  {
    label: 'EVChamp on LinkedIn',
    href: 'https://www.linkedin.com/company/zipbolt/',
    path: 'M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9h4v12H3V9Zm7 0h3.8v1.7h.05c.53-.95 1.83-1.95 3.77-1.95 4.03 0 4.78 2.5 4.78 5.76V21h-4v-5.6c0-1.34-.03-3.06-1.9-3.06-1.9 0-2.2 1.45-2.2 2.96V21h-4V9Z',
  },
  {
    label: 'EVChamp on Instagram',
    href: 'https://www.instagram.com/zipboltinnovations/',
    path: 'M12 2.2c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41a3.8 3.8 0 0 1-1.38-.9 3.8 3.8 0 0 1-.9-1.38c-.16-.42-.36-1.06-.41-2.23C2.21 15.58 2.2 15.2 2.2 12s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41C8.42 2.21 8.8 2.2 12 2.2Zm0 1.8c-3.14 0-3.5.01-4.74.07-.9.04-1.38.19-1.7.31-.43.17-.74.37-1.06.69-.32.32-.52.63-.69 1.06-.12.32-.27.8-.31 1.7C3.44 8.5 3.43 8.86 3.43 12s.01 3.5.07 4.74c.4.9.19 1.38.31 1.7.17.43.37.74.69 1.06.32.32.63.52 1.06.69.32.12.8.27 1.7.31 1.24.06 1.6.07 4.74.07s3.5-.01 4.74-.07c.9-.04 1.38-.19 1.7-.31.43-.17.74-.37 1.06-.69.32-.32.52-.63.69-1.06.12-.32.27-.8.31-1.7.06-1.24.07-1.6.07-4.74s-.01-3.5-.07-4.74c-.04-.9-.19-1.38-.31-1.7a2.9 2.9 0 0 0-.69-1.06 2.9 2.9 0 0 0-1.06-.69c-.32-.12-.8-.27-1.7-.31-1.24-.06-1.6-.07-4.74-.07Zm0 3.06a4.94 4.94 0 1 1 0 9.88 4.94 4.94 0 0 1 0-9.88Zm0 1.8a3.14 3.14 0 1 0 0 6.28 3.14 3.14 0 0 0 0-6.28Zm5.14-3.2a1.15 1.15 0 1 1 0 2.3 1.15 1.15 0 0 1 0-2.3Z',
  },
];

const footLinkStyle: React.CSSProperties = { background: 'none', border: 'none', fontSize: 14, color: '#8FA0BF', textDecoration: 'none', cursor: 'pointer', padding: 0, textAlign: 'left' };

export default function Footer() {
  const navigate = useNavigate();
  const goTo = (route: string) => {
    navigate(route);
    window.scrollTo({ top: 0, behavior: 'auto' });
  };

  return (
    <footer style={{ background: '#08122B' }}>
      <style>{`
        @media (max-width: 768px) {
          .ftr-grid { grid-template-columns: 1fr 1fr !important; gap: 26px !important; padding: 44px 18px 24px !important; }
          .ftr-bar { flex-direction: column !important; text-align: center !important; padding: 18px !important; }
          /* Bigger touch targets, and 16px input so iOS doesn't zoom on focus. */
          .ftr-flink { min-height: 34px; display: flex !important; align-items: center; }
          .ftr-social { width: 42px !important; height: 42px !important; }
          .ftr-newsinput { font-size: 16px !important; }
        }
        @media (max-width: 480px) {
          .ftr-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
      <div className="ftr-grid" style={{ maxWidth: 1240, margin: '0 auto', padding: '60px 32px 28px', display: 'grid', gridTemplateColumns: '1.3fr 1fr 1fr 1.15fr 1fr', gap: 36 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <img src="/evchamp-logo.png" alt="EVChamp" style={{ width: 30, height: 30, borderRadius: 8, objectFit: 'cover' }} />
            <span style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontSize: 19, color: '#fff' }}>EVChamp</span>
          </div>
          <p style={{ fontSize: 14, lineHeight: 1.6, color: '#8FA0BF', margin: '16px 0 0', maxWidth: 280 }}>The AI &amp; IoT operating system for India's electric-vehicle economy.</p>
          <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
            {SOCIALS.map((s) => (
              <a
                key={s.label}
                className="ftr-social"
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
                title={s.label}
                style={{ width: 36, height: 36, borderRadius: 9, border: '1px solid rgba(255,255,255,.14)', display: 'grid', placeItems: 'center', color: '#B7C4DC', textDecoration: 'none' }}
              >
                <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d={s.path} />
                </svg>
              </a>
            ))}
          </div>
        </div>
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>Platform</div>
          <div style={{ display: 'grid', gap: 11, marginTop: 16 }}>
            <button onClick={() => goTo('/find-ev-chargers')} className="ftr-flink" style={footLinkStyle}>Find EV Chargers</button>
            <button onClick={() => goTo('/service-centres')} className="ftr-flink" style={footLinkStyle}>Service Centres</button>
            <button onClick={() => goTo('/zeflash')} className="ftr-flink" style={footLinkStyle}>Zeflash</button>
            <button onClick={() => goTo('/sell-ev')} className="ftr-flink" style={footLinkStyle}>Sell Your EV</button>
          </div>
        </div>
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>Company</div>
          <div style={{ display: 'grid', gap: 11, marginTop: 16 }}>
            <button onClick={() => goTo('/about')} className="ftr-flink" style={footLinkStyle}>About</button>
            <button onClick={() => goTo('/franchise')} className="ftr-flink" style={footLinkStyle}>Franchise</button>
            <button onClick={() => goTo('/franchise')} className="ftr-flink" style={footLinkStyle}>Invest</button>
            <button onClick={() => goTo('/blog')} className="ftr-flink" style={footLinkStyle}>Blog</button>
          </div>
        </div>
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>Contact</div>
          <div style={{ display: 'grid', gap: 11, marginTop: 16 }}>
            <span style={{ fontSize: 13.5, lineHeight: 1.6, color: '#8FA0BF' }}>ZipBolt Technologies Pvt Ltd<br />MGF Metropolis Mall, MG Road,<br />Gurgaon, Haryana – 122002</span>
            <a href="tel:+918368681769" className="ftr-flink" style={footLinkStyle}>+91 83686 81769</a>
            <a href="mailto:hello@zip-bolt.com" className="ftr-flink" style={footLinkStyle}>hello@zip-bolt.com</a>
          </div>
        </div>
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>Stay charged</div>
          <p style={{ fontSize: 13.5, color: '#8FA0BF', margin: '16px 0 12px' }}>Product news &amp; EV insights, monthly.</p>
          <div style={{ display: 'flex', background: 'rgba(255,255,255,.06)', border: '1px solid rgba(255,255,255,.14)', borderRadius: 10, padding: 4, gap: 6 }}>
            <input type="email" inputMode="email" autoComplete="email" placeholder="Email address" className="ftr-newsinput" style={{ flex: 1, minWidth: 0, background: 'transparent', border: 'none', outline: 'none', color: '#EAF2EC', fontFamily: 'Inter, sans-serif', fontSize: 13.5, padding: '8px 10px' }} />
            <button style={{ background: GRAD, color: '#fff', border: 'none', fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: 13.5, padding: '8px 14px', borderRadius: 7, cursor: 'pointer' }}>Join</button>
          </div>
        </div>
      </div>
      <div style={{ borderTop: '1px solid rgba(255,255,255,.08)' }}>
        <div className="ftr-bar" style={{ maxWidth: 1240, margin: '0 auto', padding: '20px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <span style={{ fontSize: 13, color: '#6C7C9C' }}>© 2026 EVChamp Technologies. All rights reserved.</span>
          <div style={{ display: 'flex', gap: 22 }}>
            <button onClick={() => goTo('/privacy')} className="ftr-flink" style={footLinkStyle}>Privacy</button>
            <button onClick={() => goTo('/terms')} className="ftr-flink" style={footLinkStyle}>Terms</button>
            <button onClick={() => goTo('/contact')} className="ftr-flink" style={footLinkStyle}>Security</button>
          </div>
        </div>
      </div>
    </footer>
  );
}
