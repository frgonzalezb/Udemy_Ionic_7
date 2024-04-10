import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  constructor(private toastCtrl: ToastController) { }

  async showToast(message: string, duration: number = 5000) {
    const toast = await this.toastCtrl.create({
      message,
      duration,
      position: 'top'
    });
    await toast.present();
  }

}
