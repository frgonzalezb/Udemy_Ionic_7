import { CapacitorConfig } from '@capacitor/cli';

// Necesario agregar CapacitorHttp aquí
// https://capacitorjs.com/docs/apis/http#configuration

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: '04_PokedexApp',
  webDir: 'www',
  server: {
    androidScheme: 'https'
  },
  plugins: {
    "CapacitorHttp": {
      "enabled": true
    }
  }

};

export default config;
