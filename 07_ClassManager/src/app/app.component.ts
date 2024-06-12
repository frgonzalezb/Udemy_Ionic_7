import { Component } from '@angular/core';
import { Device } from '@capacitor/device';
import { Platform } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {

  public isWeb!: boolean;

  constructor(
    private platform: Platform,
    private _translate: TranslateService
  ) {
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
    });
  }
}
