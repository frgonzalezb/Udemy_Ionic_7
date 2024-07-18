import { Injectable } from '@angular/core';
import { AlertButton, AlertController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  constructor(
    private alertCtrl: AlertController,
    private _translate: TranslateService
  ) { }

  async alertCustomButtons(header: string, message: string, buttons: AlertButton[], backdropDismiss: boolean): Promise<void> {
    const alert = await this.alertCtrl.create({
      header,
      message,
      buttons,
      backdropDismiss
    });
    await alert.present();
  }

  async alertSuccess(header: string, message: string): Promise<void> {
    const alert = await this.alertCtrl.create({
      header: header,
      message: message,
      buttons: ['OK']
    });
    await alert.present();
  }

  async alertConfirm(header: string, message: string, functionOk: Function): Promise<void> {
    const alert = await this.alertCtrl.create({
      header: header,
      message: message,
      buttons: [
        {
          text: this._translate.instant('label.cancel'),
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        },
        {
          text: this._translate.instant('label.ok'),
          role: 'confirm',
          cssClass: 'secondary',
          handler: () => {
            functionOk();
          }
        }
      ]
    });
    await alert.present();
  }

}
