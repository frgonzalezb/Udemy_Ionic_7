import { Component } from '@angular/core';
import { Device } from '@capacitor/device';
import { Platform } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { SqliteManagerService } from 'src/app/services/sqlite-manager.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {

  public isWeb: boolean;
  public load: boolean;

  constructor(
    private platform: Platform,
    private _translate: TranslateService,
    private _sqlite: SqliteManagerService
  ) {
    this.load = false;
    this.isWeb = false;
    this._translate.setDefaultLang('es');
    this.initApp();
  }

  initApp() {
    this.platform.ready().then(async () => {
      
      const language = await Device.getLanguageCode();
      const info = await Device.getInfo();
      
      this.isWeb = info.platform === 'web';
      
      if (language.value) {
        this._translate.use(language.value.slice(0, 2));
      }

      this._sqlite.initDB();
      this._sqlite.dbReady.subscribe(isReady => {
        this.load = true;
      });
    });
  }
}
