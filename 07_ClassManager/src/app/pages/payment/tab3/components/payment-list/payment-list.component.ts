import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import Class from 'src/app/models/class';
import Payment from 'src/app/models/payment';
import Student from 'src/app/models/student';
import { AlertService } from 'src/app/services/alert.service';
import { SqliteManagerService } from 'src/app/services/sqlite-manager.service';

@Component({
  selector: 'app-payment-list',
  templateUrl: './payment-list.component.html',
  styleUrls: ['./payment-list.component.scss'],
})
export class PaymentListComponent implements OnInit {

  public payments: Payment[];
  public total: number;

  constructor(
    private _alert: AlertService,
    private _sqlite: SqliteManagerService,
    private _translate: TranslateService
  ) {
    this.payments = [];
    this.total = 0;
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
      if (classes && students) {
        this.associateObjects(classes, students);
      }
      console.log(this.payments); // dbg
      this.calculateTotal();
      console.log(this.total); // dbg
      
    });
  }

  associateObjects(classes: Class[], students: Student[]) {
    this.payments.forEach(p => {
      p.class = classes.find(c => c.id === p.id_class);
      if (p.class) {
        p.class.student = students.find(s => s.id === p.class?.id_student);
      }
    });
  }

  calculateTotal() {
    this.total = 0;
    this.payments.forEach(p => {
      this.total += p.paid;
    });
  }

}
