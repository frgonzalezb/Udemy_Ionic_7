import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CouponCardsPageRoutingModule } from './coupon-cards-routing.module';

import { CouponCardsPage } from './coupon-cards.page';

import { QRCodeModule } from 'angularx-qrcode';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CouponCardsPageRoutingModule,
    QRCodeModule
  ],
  declarations: [CouponCardsPage]
})
export class CouponCardsPageModule {}
