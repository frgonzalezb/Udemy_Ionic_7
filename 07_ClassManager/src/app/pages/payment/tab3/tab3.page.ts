import { Component, ViewChild } from '@angular/core';
import { PaymentListComponent } from './components/payment-list/payment-list.component';
import Filter from 'src/app/models/filter';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {

  @ViewChild(PaymentListComponent) paymentList!: PaymentListComponent;

  constructor() {}

  ionViewWillEnter() {
    if (this.paymentList) {
      this.paymentList.filter = new Filter();
      this.paymentList.filter.paid = undefined;
      this.paymentList.getPayments();
    }
  }

}
