import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';
import { UserOrderService } from 'src/app/services/user-order.service';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.page.html',
  styleUrls: ['./payment.page.scss'],
})
export class PaymentPage {

  public showNewAccount: boolean;
  public step: number;
  public address?: string;
  public addressOption: string;
  public showNewAddress: boolean;

  constructor(
    public _userOrder: UserOrderService,
    private navController: NavController
  ) {
    this.showNewAccount = false;
    this.step = 1;
    this.addressOption = 'address-default';
    this.showNewAddress = false;
  }

  ionViewWillEnter() {
    this.showNewAccount = false;
    this.step = 1;
    this.addressOption = 'address-default';
    this.showNewAddress = false;
    this.changeAddress();
  }

  newAccount() {
    this.showNewAccount = true;
  }

  showLogin() {
    this.showNewAccount = false;
  }

  prevStep() {
    this.step--;
  }

  nextStep() {
    this.step++;
  }

  goBackHome() {
    this.navController.navigateForward('categories');
  }

  changeAddress() {
    switch(this.addressOption) {
      case 'address-default':
        this.showNewAddress = false;
        this.address = this._userOrder.getUser().address;
        break;
      case 'choose-address':
        this.showNewAddress = true;
        this.address = '';
        break;
    }
  }

}
