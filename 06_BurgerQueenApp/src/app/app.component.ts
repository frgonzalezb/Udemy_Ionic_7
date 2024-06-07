import { Component } from '@angular/core';
import { Device } from '@capacitor/device';
import { Platform } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import config from 'capacitor.config';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {

  public load: boolean;

  constructor(
    private platform: Platform,
    private _translate: TranslateService
  ) {
    this._translate.setDefaultLang('es');
    this.load = false;
    this.initApp();
  }

  initApp() {
    this.platform.ready().then(async () => {
      const language = await Device.getLanguageCode();

      if (language.value) {
        this._translate.use(language.value.slice(0, 2));
      }

      // Activar aquí el CapacitorHttp
      if (config.plugins && config.plugins.CapacitorHttp) {
        config.plugins.CapacitorHttp.enabled = true;
      }
      
      this.load = true;
    });
  }
}
