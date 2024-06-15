import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import Student from 'src/app/models/student';
import { AlertService } from 'src/app/services/alert.service';
import { SqliteManagerService } from 'src/app/services/sqlite-manager.service';

@Component({
  selector: 'app-student-form',
  templateUrl: './student-form.component.html',
  styleUrls: ['./student-form.component.scss'],
})
export class StudentFormComponent implements OnInit {

  @Input() student!: Student;

  @Output() closeForm: EventEmitter<boolean>;

  public update: boolean;

  constructor(
    private _sqlite: SqliteManagerService,
    private _translate: TranslateService,
    private _alert: AlertService
  ) {
    this.update = false;
    this.closeForm = new EventEmitter<boolean>();
  }

  ngOnInit() {
    if (!this.student) {
      this.student = new Student();
    } else {
      this.update = true;
    }
  }

  onCloseForm() {
    this.closeForm.emit(true);
  }

  createOrUpdateStudent() {
    if (this.update) {
      this._sqlite.updateStudent(this.student).then(() => {
        this._alert.alertMessage(
          this._translate.instant('label.success'),
          this._translate.instant('label.success.message.edit.student')
        );
        this.onCloseForm();
      }).catch((error) => {
        console.error(error); // dbg
        this._alert.alertMessage(
          this._translate.instant('label.error'),
          this._translate.instant('label.error.message.edit.student')
        );
        this.onCloseForm();
      });
    } else {
      this._sqlite.createStudent(this.student).then(() => {
        this._alert.alertMessage(
          this._translate.instant('label.success'),
          this._translate.instant('label.success.message.add.student')
        );
        this.onCloseForm();
      }).catch((error) => {
        console.error(error); // dbg
        this._alert.alertMessage(
          this._translate.instant('label.error'),
          this._translate.instant('label.error.message.add.student')
        );
        this.onCloseForm();
      });
    }
  }

}
