import { Component, OnInit } from '@angular/core';
import { NavParams } from '@ionic/angular';

@Component({
  selector: 'app-coupon-cards',
  templateUrl: './coupon-cards.page.html',
  styleUrls: ['./coupon-cards.page.scss'],
})
export class CouponCardsPage implements OnInit {

  public QRCode: string;

  constructor(private navParams: NavParams) {
    console.log(this.navParams.data['coupons']); // dbg
    this.QRCode = '';
  }

  ngOnInit() {
    this.QRCode =JSON.stringify(this.navParams.data['coupons']);
  }

}
