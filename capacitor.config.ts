import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.evchamp.app',
  appName: 'EVChamp',
  webDir: 'build',
  server: {
    // Set CAP_LIVE_SERVER=false when syncing to load the locally bundled
    // `build/` folder instead of the deployed site — needed to test changes
    // that haven't been deployed yet. Default (unset) keeps production behaviour.
    ...(process.env.CAP_LIVE_SERVER === 'false'
      ? {}
      : { url: 'https://evchamp.vercel.app' }),
    cleartext: false,
    allowNavigation: [
      'evchamp.in',
      'evchamp.vercel.app',
      'zeflash.app',
      '*.zeflash.app',
      '*.vercel.app',
      '*.clerk.accounts.dev',
      'clerk.accounts.dev',
      'accounts.clerk.dev',
      '*.clerk.dev',
      'clerk.dev',
      '*.clerk.com',
      'clerk.com',
    ],
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: "#22c55e",
      showSpinner: false,
    },
  },
};

export default config;
