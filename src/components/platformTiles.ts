export interface PlatformTile {
  icon: string;
  bg: string;
  title: string;
  desc: string;
  route: string;
}

// Shared between the landing page grid and the header's Platform mega-menu.
export const PLATFORM_TILES: PlatformTile[] = [
  { icon: '⚡', bg: '#FEF3C7', title: 'Find EV Chargers', desc: 'Live charging map with real-time availability', route: '/find-ev-chargers' },
  { icon: '🚗', bg: '#FFEDD5', title: 'Book Test drive EVs', desc: 'Schedule EV test drives near you', route: '/ev-marketplace' },
  { icon: '🤝', bg: '#EEF2FF', title: 'Franchise', desc: 'Partner with us and own an EV hub', route: '/franchise' },
  { icon: '🔩', bg: '#FDE7EF', title: 'ZipsureAi Battery Health Report', desc: 'Patented AI battery-life optimization', route: '/evtrulife' },
  { icon: '💳', bg: '#E6F7F1', title: 'EVChamp Pay', desc: 'Fast, secure payments via QR, cards & UPI', route: '/evchamp-pay' },
  { icon: '🌟', bg: '#FEF9E7', title: 'Ze.Xperience', desc: 'Test drives & the EV showcase', route: '/ze-xperience' },
  { icon: '🔧', bg: '#F3EEFE', title: 'Service Centres', desc: 'Verified EV workshops across India', route: '/service-centres' },
  { icon: '🔋', bg: '#EAF1FE', title: 'Zeflash Diagnostics', desc: '20-minute AI battery health report', route: '/zeflash' },
  { icon: '🏷️', bg: '#E0F2FE', title: 'Sell Your EV', desc: 'List with zero commission fees', route: '/sell-ev' },
  { icon: '🛟', bg: '#E9F8F0', title: 'Roadside Assistance Plans', desc: '24×7 EV-trained emergency support', route: '/rsa-plans' },
];

export const PROTECTED_ROUTES = [
  '/charging-network', '/service-centres', '/buy-plans', '/buy-used-ev',
  '/rsa-plans', '/sell-ev', '/rent-ev', '/advance-analysis', '/delete-account',
  '/ev-marketplace',
];
