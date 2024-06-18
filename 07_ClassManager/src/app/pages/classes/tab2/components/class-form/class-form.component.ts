import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
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
    } else {
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

}
