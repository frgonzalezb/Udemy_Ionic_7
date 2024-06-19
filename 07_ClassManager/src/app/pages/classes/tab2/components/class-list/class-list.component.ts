import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import Class from 'src/app/models/class';
import Filter from 'src/app/models/filter';
import Student from 'src/app/models/student';
import { AlertService } from 'src/app/services/alert.service';
import { SqliteManagerService } from 'src/app/services/sqlite-manager.service';

@Component({
  selector: 'app-class-list',
  templateUrl: './class-list.component.html',
  styleUrls: ['./class-list.component.scss'],
})
export class ClassListComponent implements OnInit {

  public classes: Class[];
  public classSelected: Class | null;
  public showForm: boolean;
  public filter: Filter;

  constructor(
    private _sqlite: SqliteManagerService,
    private _alert: AlertService,
    private _translate: TranslateService
  ) {
    this.classes = [];
    this.classSelected = null;
    this.showForm = false;
    this.filter = new Filter();
  }

  ngOnInit() {
    this.getClasses();
  }

  onShowForm() {
    this.showForm = true;
  }

  onCloseForm() {
    this.showForm = false;
    this.classSelected = null;
    this.getClasses();
  }

  getClasses() {
    Promise.all([
      this._sqlite.getClasses(),
      this._sqlite.getStudents()
    ]).then(results => {
      if (results[0] && results[1]) {
        this.classes = results[0];
        let students = results[1];
        this.associateStudentsToClasses(students);
      }
    });
  }

  private associateStudentsToClasses(students: Student[]) {
    this.classes.forEach(c => {
      let student = students.find(s => s.id === c.id_student);
      if (student) {
        c.student = student;
      }
    })
  }

  updateClass(item: Class) {
    this.classSelected = item;
    this.showForm = true;
  }

  deleteClassConfirm(item: Class) {
    const self = this;
    this._alert.alertConfirm(
      this._translate.instant('label.confirm'),
      this._translate.instant('label.confirm.message.class'),
      function() {
        self.deleteStudent(item);
      }
    )
  }

  deleteStudent(classObj: Class){
    this._sqlite.deleteClass(classObj).then(() => {
      this._alert.alertMessage(
        this._translate.instant('label.success'),
        this._translate.instant('label.success.message.remove.class')
      );
      this.getClasses();
    }).catch(error => {
      console.error(error); // dbg
      this._alert.alertMessage(
        this._translate.instant('label.error'),
        this._translate.instant('label.error.message.remove.class')
      );
    })
  }

}
