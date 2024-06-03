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

  constructor(
    public _userOrder: UserOrderService,
    private navController: NavController
  ) {
    this.showNewAccount = false;
    this.step = 1;
  }

  ionViewWillEnter() {
    this.showNewAccount = false;
    this.step = 1;
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

}
