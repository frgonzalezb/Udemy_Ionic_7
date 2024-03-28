import { Component, OnInit } from '@angular/core';
import { AlertController, NavController, NavParams } from '@ionic/angular';

import { CouponsService } from 'src/app/services/coupons.service';
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';

import Coupon from 'src/app/models/coupon';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-coupons',
  templateUrl: './coupons.page.html',
  styleUrls: ['./coupons.page.scss'],
})
export class CouponsPage implements OnInit {

  public coupons: Coupon[];
  public activeCoupons: boolean;
  public showCamera: boolean;

  constructor(
      private _coupons: CouponsService,
      private navParams: NavParams,
      private navController: NavController,
      private alertController: AlertController,
      private toastService: ToastService
    ) {
    this.coupons = [];
    this.activeCoupons = false;
    this.showCamera = false;
  }

  ngOnInit() {
    this._coupons.getCoupons().then((coupons: Coupon[]) => {
      this.coupons = coupons;
      console.log(this.coupons); // dbg
    });
  }

  async checkPermissionsForCamera() {
    const permission = await BarcodeScanner.checkPermission({ force: true });
  
    if (permission.granted) {
      this.startCamera();
    } else {
      const alert = await this.alertController.create({
        message: 'Esta app necesita usar la cámara para funcionar.'
      });
    }
  }

  async startCamera() {
    /* La forma recomendada por el profe es la de showCamera.
    Sin embargo, dejo comentado este snippet por si acaso... */

    // make background of WebView transparent
    // note: if you are using ionic this might not be enough, check below
    // BarcodeScanner.hideBackground();

    if (!this.showCamera) {
      this.showCamera = true;
    }
  
    const result = await BarcodeScanner.startScan();

    if (result.hasContent) {
      console.log(result.content); // dbg
      this.showContent(result.content);
    }

    this.closeCamera(); // Importante!!
  }

  closeCamera() {
    if (this.showCamera) {
      this.showCamera = false;
      BarcodeScanner.stopScan();
    }
  }

  changeActive(coupon: Coupon) {
    coupon.active = !coupon.active;
    this.activeCoupons = this.coupons.some(c => c.active);
  }

  goToCard() {
    this.navParams.data['coupons'] = this.coupons.filter(c => c.active);
    this.navController.navigateForward('coupon-cards');
  }

  private isCouponValid(coupon: Coupon) {
    return coupon && coupon.id_product && coupon.img && coupon.name && coupon.discount;
  }

  private showContent(content: string) {
    try {
      let coupon: Coupon = JSON.parse(content);

      if (this.isCouponValid(coupon)) {
        this.toastService.presentToast('Código QR escaneado correctamente.');
        this.coupons.push(coupon);
      } else {
        this.toastService.presentToast('El cupón no es válido.');
      }
    } catch (error) {
      console.error(error); // dbg
      this.toastService.presentToast('El código QR no es válido.');
    }
  }

}
