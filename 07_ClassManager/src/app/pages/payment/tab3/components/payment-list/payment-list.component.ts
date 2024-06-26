import { Component, OnInit } from '@angular/core';
import Class from 'src/app/models/class';
import Filter from 'src/app/models/filter';
import Payment from 'src/app/models/payment';
import Student from 'src/app/models/student';
import { SqliteManagerService } from 'src/app/services/sqlite-manager.service';

@Component({
  selector: 'app-payment-list',
  templateUrl: './payment-list.component.html',
  styleUrls: ['./payment-list.component.scss'],
})
export class PaymentListComponent implements OnInit {

  public payments: Payment[];
  public total: number;
  public filter: Filter;

  constructor(
    private _sqlite: SqliteManagerService,
  ) {
    this.payments = [];
    this.total = 0;
    this.filter = new Filter();
    this.filter.paid = undefined;
  }

  ngOnInit() {
    this.getPayments();
  }

  getPayments() {
    Promise.all([
      this._sqlite.getPayments(this.filter),
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
      this.calculateTotal();
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
    /* NOTA: El método del profe era algo más esotérico para mi gusto,
    así que decidí hacerlo de esta manera. */
    this.total = 0;
    this.payments.forEach(p => {
      this.total += p.paid;
    });
  }

  filterData($event: Filter) {
    this.filter = $event;
    this.getPayments();
  }

}
