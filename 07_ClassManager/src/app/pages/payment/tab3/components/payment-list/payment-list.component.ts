import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import Payment from 'src/app/models/payment';
import { AlertService } from 'src/app/services/alert.service';
import { SqliteManagerService } from 'src/app/services/sqlite-manager.service';

@Component({
  selector: 'app-payment-list',
  templateUrl: './payment-list.component.html',
  styleUrls: ['./payment-list.component.scss'],
})
export class PaymentListComponent implements OnInit {

  public payments: Payment[];

  constructor(
    private _alert: AlertService,
    private _sqlite: SqliteManagerService,
    private _translate: TranslateService
  ) {
    this.payments = [];
  }

  ngOnInit() {
    this.getPayments();
  }

  getPayments() {
    Promise.all([
      this._sqlite.getPayments(),
      this._sqlite.getClasses(null),
      this._sqlite.getStudents()
    ]).then(data => {
      if (data && data[0]) {
        this.payments = data[0];
      }
      let classes = data[1];
      let students = data[2];
      console.log(this.payments);
      
    });
  }

}
