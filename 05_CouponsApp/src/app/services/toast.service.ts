import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  constructor(private toastController: ToastController) {}

  async presentToast(
      message: string = 'Hello World!', 
      duration: number = 5000
    ) {
    const toast = await this.toastController.create({
      message: message,
      duration: duration,
      position: 'top',
    });

    await toast.present();
  }
}
