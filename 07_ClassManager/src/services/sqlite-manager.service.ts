import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CapacitorSQLite, JsonSQLite } from '@capacitor-community/sqlite';
import { Device } from '@capacitor/device';
import { Preferences } from '@capacitor/preferences';
import { AlertController } from '@ionic/angular';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SqliteManagerService {

  private isWeb: boolean;
  private dbName: string;
  private DB_NAME_KEY: string = 'db_name';
  private DB_SETUP_KEY: string = 'first_db_setup';

  constructor(
    private alertCtrl: AlertController,
    private http: HttpClient
  ) {
    this.isWeb = false;
    this.dbName = '';
  }

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
      this.downloadDatabase();
    } else {
      // recuperar la DB
      const dbName = await this.getDBName();
      await CapacitorSQLite.createConnection({ database: dbName });
      await CapacitorSQLite.open({ database: dbName });
    }
  }

  downloadDatabase() {
    this.http.get(environment.db).subscribe(async (jsonExport: JsonSQLite) => {
        const jsonString = JSON.stringify(jsonExport);
        const isValid = await CapacitorSQLite.isJsonValid({ jsonstring: jsonString });

        if (isValid.result) {
          this.dbName = jsonExport.database;

          await CapacitorSQLite.importFromJson({ jsonstring: jsonString });
          await CapacitorSQLite.createConnection({ database: this.dbName });
          await CapacitorSQLite.open({ database: this.dbName });

          await Preferences.set({ key: this.DB_SETUP_KEY, value: '1' });
          await Preferences.set({ key: this.DB_NAME_KEY, value: this.dbName });
      }
    });
  }

  async getDBName() {
    if (!this.dbName) {
      const dbName = await Preferences.get({ key: this.DB_NAME_KEY });
      if (dbName.value) {
        this.dbName = dbName.value;
      }
    }
    return this.dbName;
  }

}
