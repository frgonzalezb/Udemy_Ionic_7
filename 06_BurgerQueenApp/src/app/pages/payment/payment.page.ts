import { Component } from '@angular/core';
import { UserOrderService } from 'src/app/services/user-order.service';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.page.html',
  styleUrls: ['./payment.page.scss'],
})
export class PaymentPage {

  public showNewAccount: boolean;

  constructor(
    public _userOrder: UserOrderService
  ) {
    this.showNewAccount = false;
  }

  newAccount() {
    this.showNewAccount = true;
  }

  showLogin() {
    this.showNewAccount = false;
  }

}
