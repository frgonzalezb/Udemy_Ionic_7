import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import * as moment from 'moment';
import Class from 'src/app/models/class';
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

  constructor(
    private _sqlite: SqliteManagerService,
    private _translate: TranslateService,
    private _alert: AlertService
  ) {
    this.update = false;
    this.closeForm = new EventEmitter<boolean>();
  }

  ngOnInit() {
    if (!this.classObj) {
      this.classObj = new Class();
      this.classObj.price = 0;
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
      this._sqlite.createClass(this.classObj).then(() => {
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
