import { Platform } from '@ionic/angular';
import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Device } from '@capacitor/device';
import { AdMob, AdmobConsentStatus, AdmobConsentDebugGeography } from '@capacitor-community/admob';
import { Preferences } from '@capacitor/preferences';

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

  async initApp() {
    this.platform.ready().then(async () => {
      
      const language = await Device.getLanguageCode();
      const info = await Device.getInfo();
      
      if (language.value) {
        this._translate.use(language.value.slice(0, 2));
      }
    });
  
    // @capacitor-community/admob
    AdMob.initialize({
      testingDevices: [],
      initializeForTesting: true
    });

    await this.showConsent();
  }

  async showConsent() {
    const consentInfo = await AdMob.requestConsentInfo({
      debugGeography: AdmobConsentDebugGeography.EEA,
      testDeviceIdentifiers: ['YOUR_DEVICE_ID']
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
