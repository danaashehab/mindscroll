import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.mindscroll.app',
  appName: 'MindScroll',
  webDir: 'public',
  server: {
    url: 'https://mindscroll-cyan.vercel.app',
    cleartext: false
  }
};

export default config;
