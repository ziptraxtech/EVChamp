import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.evchamp.app',
  appName: 'EVChamp',
<<<<<<< HEAD
  webDir: 'build', // Changed back to 'build' for CRA
  server: {
    // url: 'https://evchamp.vercel.app', // Commented out for local development
    cleartext: false,
    allowNavigation: [
      'evchamp.in',
=======
  webDir: 'build',
  server: {
    url: 'https://evchamp.vercel.app', // Replace with YOUR actual URL
    cleartext: false,
    allowNavigation: [
      'evchamp.in', // Replace with YOUR domain
>>>>>>> 8a0879474b392953f3c1bd31579c5105139ea1af
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
