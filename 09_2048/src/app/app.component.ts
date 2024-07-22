import { Platform } from '@ionic/angular';
import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Device } from '@capacitor/device';
import { AdMob } from '@capacitor-community/admob';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {

  constructor(
    private _translate: TranslateService,
    private platform: Platform,
  ) {
    this._translate.setDefaultLang('es');
    this.initApp();
  }

  initApp() {
    this.platform.ready().then(async () => {
      
      const language = await Device.getLanguageCode();
      const info = await Device.getInfo();
      
      if (language.value) {
        this._translate.use(language.value.slice(0, 2));
      }
    });
  
    AdMob.initialize({});
  }

}
