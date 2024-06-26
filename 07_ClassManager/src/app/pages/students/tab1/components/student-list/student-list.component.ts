import { Component, OnInit } from '@angular/core';
import { SqliteManagerService } from 'src/app/services/sqlite-manager.service';
import Student from 'src/app/models/student';
import { AlertService } from 'src/app/services/alert.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-student-list',
  templateUrl: './student-list.component.html',
  styleUrls: ['./student-list.component.scss'],
})
export class StudentListComponent implements OnInit {

  public students: Student[];
  public studentSelected: Student | null;
  public showForm: boolean;

  constructor(
    private _sqlite: SqliteManagerService,
    private _alert: AlertService,
    private _translate: TranslateService
  ) {
    this.students = [];
    this.studentSelected = null;
    this.showForm = false;
  }

  ngOnInit() {
    this.getStudents();
  }

  onShowForm() {
    this.showForm = true;
  }

  onCloseForm() {
    this.showForm = false;
    this.studentSelected = null;
    this.getStudents();
  }

  filterList($event: any) {
    this.getStudents($event.detail.value);
    
  }

  getStudents(search?: string) {
    this._sqlite.getStudents(search).then((students) => {
      if (!students) {
        return null;
      }
      this.students = students;
      return students;
    });
  }

  updateStudent(student: Student) {
    this.studentSelected = student;
    this.onShowForm();
  }

  deleteStudent(student: Student) {
    this._sqlite.deleteStudent(student).then(() => {
      this._alert.alertMessage(
        this._translate.instant('label.success'),
        this._translate.instant('label.success.message.remove.student')
      );
      this.getStudents();
    }).catch((error) => {
      this._alert.alertMessage(
        this._translate.instant('label.error'),
        this._translate.instant('label.error.message.remove.student')
      );
    });
  }

  confirmStudentDeletion(student: Student) {
    const self = this; // para que no tenga problema con deleteStudent()
    this._alert.alertConfirm(
      this._translate.instant('label.confirm'),
      this._translate.instant('label.confirm.message.student'),
      function () {
        self.deleteStudent(student);
      }
    );
  }

}
