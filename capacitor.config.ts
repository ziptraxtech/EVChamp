import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.evchamp.app',
  appName: 'EVChamp',
  webDir: 'build', // Changed back to 'build' for CRA
  server: {
    // url: 'https://evchamp.vercel.app', // Commented out for local development
    cleartext: false,
    allowNavigation: [
      'evchamp.in',
      '*.vercel.app',
      '*.clerk.accounts.dev',
      'clerk.accounts.dev'
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
