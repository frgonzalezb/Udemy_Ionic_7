import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { capSQLiteChanges } from '@capacitor-community/sqlite';
import { TranslateService } from '@ngx-translate/core';
import * as moment from 'moment';
import Class from 'src/app/models/class';
import Payment from 'src/app/models/payment';
import Student from 'src/app/models/student';
import { AlertService } from 'src/app/services/alert.service';
import { SqliteManagerService } from 'src/app/services/sqlite-manager.service';

@Component({
  selector: 'app-class-form',
  templateUrl: './class-form.component.html',
  styleUrls: ['./class-form.component.scss'],
})
export class ClassFormComponent implements OnInit {

  @Input() classObj!: Class;

  @Output() closeForm: EventEmitter<boolean>;

  public update: boolean;
  public students!: Student[];
  public payment!: Payment;
  public paid!: boolean;
  public alreadyPaid!: boolean;

  constructor(
    private _sqlite: SqliteManagerService,
    private _translate: TranslateService,
    private _alert: AlertService
  ) {
    this.closeForm = new EventEmitter<boolean>();
    this.update = false;
  }

  ngOnInit() {
    if (!this.classObj) {
      this.classObj = new Class();
      this.classObj.price = 0;
      this.payment = new Payment();
      this.paid = false;
      this.alreadyPaid = false;
    } else {
      console.log(this.classObj); // dbg
      this.update = true;
    }

    this._sqlite.getStudents().then(students => {
      if (students) {
        this.students = students;
      }
    });
  }

  onCloseForm() {
    this.closeForm.emit(true);
  }

  createOrUpdateClass() {
    this.classObj.date_start = moment(this.classObj.date_start).format('YYYY-MM-DDTHH:mm');
    this.classObj.date_end = moment(this.classObj.date_end).format('YYYY-MM-DDTHH:mm');
    
    if (this.update) {
      console.log('update this.classObj',this.classObj); // dbg
      
      this._sqlite.updateClass(this.classObj).then(() => {
        this._alert.alertMessage(
          this._translate.instant('label.success'),
          this._translate.instant('label.success.message.edit.class'),
        );
        this.onCloseForm();
      }).catch(error => {
        console.error(error); // dbg
        this._alert.alertMessage(
          this._translate.instant('label.error'),
          this._translate.instant('label.error.message.edit.class'),
        );
      });
    } else {
      this._sqlite.createClass(this.classObj).then((changes: capSQLiteChanges) => {
        if (changes && changes.changes && changes.changes.lastId) {
          const idClass = changes.changes.lastId;
          this.payment.id_class = idClass;

          if (this.paid) {
            this.payment.date = moment(this.payment.date).format('YYYY-MM-DDTHH:mm');
            this.payment.paid = 1;
          } else {
            this.payment.paid = 0;
          }

          this._sqlite.createPayment(this.payment).then(() => {});
        }
        this._alert.alertMessage(
          this._translate.instant('label.success'),
          this._translate.instant('label.success.message.add.class'),
        );
        this.onCloseForm();
      }).catch(error => {
        console.error(error); // dbg
        this._alert.alertMessage(
          this._translate.instant('label.error'),
          this._translate.instant('label.error.message.add.class'),
        );
      });
    }
  }
}
