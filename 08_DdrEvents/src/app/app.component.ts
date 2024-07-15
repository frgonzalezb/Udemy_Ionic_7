import { Component } from '@angular/core';
import { Device } from '@capacitor/device';
import { Platform } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { Store } from '@ngxs/store';
import { CheckUserIsLoggedIn } from './state/auth/auth.actions';
import { FcmService } from './services/fcm.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(
    private _fcm: FcmService,
    private _translate: TranslateService,
    private platform: Platform,
    private store: Store
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

      this._fcm.init();
      this.store.dispatch(new CheckUserIsLoggedIn());
    });
  }
}
