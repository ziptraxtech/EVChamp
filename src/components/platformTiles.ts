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
  { icon: '🔧', bg: '#F3EEFE', title: 'Service Centres', desc: 'Verified EV workshops across India', route: '/service-centres' },
  { icon: '🔋', bg: '#EAF1FE', title: 'Zeflash Diagnostics', desc: '20-minute AI battery health report', route: '/zeflash' },
  { icon: '🏷️', bg: '#E0F2FE', title: 'Sell Your EV', desc: 'List with zero commission fees', route: '/sell-ev' },
  { icon: '🛟', bg: '#E9F8F0', title: 'Roadside Assistance', desc: '24×7 EV-trained emergency support', route: '/rsa-plans' },
  { icon: '🔩', bg: '#FDE7EF', title: 'ZipBattery', desc: 'Patented AI battery-life optimization', route: '/evtrulife' },
  { icon: '🛰️', bg: '#EEF2FF', title: 'ZipsureAI & IoT Plans', desc: 'Fleet intelligence & monitoring', route: '/buy-plans' },
  { icon: '🌟', bg: '#FEF9E7', title: 'Ze.Xperience', desc: 'Test drives & the EV showcase', route: '/ze-xperience' },
];

export const PROTECTED_ROUTES = [
  '/charging-network', '/service-centres', '/buy-plans', '/buy-used-ev',
  '/rsa-plans', '/sell-ev', '/rent-ev', '/advance-analysis', '/delete-account',
  '/ev-marketplace',
];
