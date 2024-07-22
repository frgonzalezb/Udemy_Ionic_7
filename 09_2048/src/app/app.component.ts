import { Platform } from '@ionic/angular';
import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Device } from '@capacitor/device';
import { AdMob, AdmobConsentStatus, AdmobConsentDebugGeography } from '@capacitor-community/admob';
import { Preferences } from '@capacitor/preferences';
import { environment } from 'src/environments/environment.prod';
import { ScreenOrientation } from '@awesome-cordova-plugins/screen-orientation/ngx';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {

  constructor(
    private _translate: TranslateService,
    private platform: Platform,
    private screenOrientation: ScreenOrientation
  ) {
    this._translate.setDefaultLang('es');
    this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT);
    this.initApp();
  }

  async initApp() {
    this.platform.ready().then(async () => {
      
      const language = await Device.getLanguageCode();
      const info = await Device.getInfo();
      
      if (language.value) {
        this._translate.use(language.value.slice(0, 2));
      }
    });
  
    // @capacitor-community/admob
    // Habilitar esto cuando todo esté listo
    // AdMob.initialize({
    //   testingDevices: [environment.deviceId],
    //   initializeForTesting: true
    // });

    // await this.showConsent();
  }

  async showConsent() {
    // @capacitor-community/admob
    const consentInfo = await AdMob.requestConsentInfo({
      debugGeography: AdmobConsentDebugGeography.EEA,
      testDeviceIdentifiers: [environment.deviceId]
    });
  
    if (consentInfo.isConsentFormAvailable && consentInfo.status === AdmobConsentStatus.REQUIRED) {
      const {status} = await AdMob.showConsentForm();
      // @capacitor/preferences
      await Preferences.set({
        key: 'statusBanner',
        value: status,
      });
    }
  }

}
