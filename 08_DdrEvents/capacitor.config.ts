import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: '08_DdrEvents',
  webDir: 'www',
  plugins: {
    CapacitorHttp: {
      enabled: false, // por las traducciones
    },
    PushNotifications: {
      presentationOptions: ["badge", "sound", "alert"]
    }
  }
};

export default config;
