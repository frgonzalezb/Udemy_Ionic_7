import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: '06_BurgerQueenApp',
  webDir: 'www',
  server: {
    androidScheme: 'https'
  },
  "plugins": {
    "CapacitorHttp": {
      "enabled": false
    }
  }
};

/* NOTA: Se ha desactivado el plugin CapacitorHttp para que no se
produzcan conflictos con la traducción. */

export default config;
