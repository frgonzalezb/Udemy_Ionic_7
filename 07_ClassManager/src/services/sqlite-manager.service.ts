import { Injectable } from '@angular/core';
import { CapacitorSQLite } from '@capacitor-community/sqlite';
import { Device } from '@capacitor/device';
import { Preferences } from '@capacitor/preferences';
import { AlertController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class SqliteManagerService {

  public isWeb!: boolean;
  private DB_SETUP_KEY: string = 'first_db_setup';

  constructor(
    private alertCtrl: AlertController
  ) { }

  async initDB() {
    const info = await Device.getInfo();
    const sqlite = CapacitorSQLite as any;
    if (info.platform === 'android') {
      try {
        await sqlite.requestPermissions();
      } catch (error) {
        const alert = await this.alertCtrl.create({
          header: 'Error',
          message: 'Esta app no puede funcionar sin acceso a la base de datos.',
          buttons: ['OK']
        });
        await alert.present();
      }
    } else if (info.platform === 'web') {
      this.isWeb = true;
      await sqlite.initWebStore();
    }
    this.setupDB();
  }

  async setupDB() {
    const dbSetupDone = await Preferences.get({ key: this.DB_SETUP_KEY });
    if (!dbSetupDone.value) {
      // descargar la DB
    } else {
      // recuperar la DB
    }
  }

}
