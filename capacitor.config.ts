import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.ab04ce040e0448bcb6ce6cf73e4e3dc0',
  appName: 'intense-pixel-blasters-showdown',
  webDir: 'dist',
  server: {
    url: 'https://ab04ce04-0e04-48bc-b6ce-6cf73e4e3dc0.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#000000',
      showSpinner: false
    }
  }
};

export default config;