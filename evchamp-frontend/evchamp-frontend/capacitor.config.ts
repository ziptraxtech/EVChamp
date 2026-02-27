import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.evchamp.app',
  appName: 'EVChamp',
  webDir: 'build',
  server: {
    url: 'https://evchamp.vercel.app', // Replace with YOUR actual URL
    cleartext: false,
    allowNavigation: [
      'evchamp.in', // Replace with YOUR domain
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
